import type { GameEvent, GameStats, EventCategory, ArtistArchetype } from '@/types/game';
import { GAME_CONFIG } from '@/data/constants';
import { crisisEvents } from '@/data/events/crisis';
import { businessEvents } from '@/data/events/business';
import { prEvents } from '@/data/events/pr';
import { dramaEvents } from '@/data/events/drama';
import { randomEvents } from '@/data/events/random';
import { idolSpecificEvents } from '@/data/events/idol-specific';
import { actorSpecificEvents } from '@/data/events/actor-specific';
import { singerSpecificEvents } from '@/data/events/singer-specific';
import { influencerSpecificEvents } from '@/data/events/influencer-specific';
import { socialiteSpecificEvents } from '@/data/events/socialite-specific';
import { lateGameEvents } from '@/data/events/late-game';
import { milestoneEvents } from '@/data/events/milestone';
import { chainEvents } from '@/data/events/chains';
import { chainsExtendedEvents } from '@/data/events/chains-extended';
import { artistTroubleEvents } from '@/data/events/artist-trouble';
import { cosmeticEvents } from '@/data/events/cosmetic';
import { phoneCallEvents } from '@/data/events/phone-calls';
import { absurdEvents } from '@/data/events/absurd';
import { platformEvents } from '@/data/events/platform';
import { metaEvents } from '@/data/events/meta-events';
import { mentalStateEvents } from '@/data/events/mental-state';
import { mentalTriggerEvents, mentalTriggerIds, getActiveMentalTriggers } from '@/data/events/mental-triggers';
import { consequenceCallbackEvents } from '@/data/consequenceCallbacks';
import { fansiteArcEvents } from '@/data/fansiteArcs';
import { managerMilestoneEvents } from '@/data/events/manager-milestone';
import type { ArtistMentalState } from '@/types/new_systems';
import type { SeasonalModifier } from '@/data/seasonalModifiers';
import { aggregateCategoryWeight } from '@/data/seasonalModifiers';

const allEvents: GameEvent[] = [
  ...crisisEvents,
  ...businessEvents,
  ...prEvents,
  ...dramaEvents,
  ...randomEvents,
  ...idolSpecificEvents,
  ...actorSpecificEvents,
  ...singerSpecificEvents,
  ...influencerSpecificEvents,
  ...socialiteSpecificEvents,
  ...lateGameEvents,
  ...milestoneEvents,
  ...chainEvents,
  ...chainsExtendedEvents,
  ...artistTroubleEvents,
  ...cosmeticEvents,
  ...phoneCallEvents,
  ...absurdEvents,
  ...platformEvents,
  ...metaEvents,
  ...mentalStateEvents,
  ...mentalTriggerEvents,
  ...consequenceCallbackEvents,
  ...fansiteArcEvents,
  ...managerMilestoneEvents,
];

const EVENT_COOLDOWN = 999; // 单局内事件不重复

/**
 * 按艺人解析事件变体：如果事件定义了 artistVariants 且当前艺人有对应变体，
 * 则用变体字段覆盖 title/description/emoji/choices，其它字段保留共享。
 */
export function resolveEventForArtist(event: GameEvent, artistId?: ArtistArchetype): GameEvent {
  if (!event.artistVariants || !artistId) return event;
  const variant = event.artistVariants[artistId];
  if (!variant) return event;
  return {
    ...event,
    title: variant.title ?? event.title,
    description: variant.description ?? event.description,
    emoji: variant.emoji ?? event.emoji,
    choices: variant.choices ?? event.choices,
  };
}

// 查找事件（用于事件链 followUpEventId）
export function findEventById(id: string): GameEvent | undefined {
  return allEvents.find(e => e.id === id);
}

function getCategoryWeight(category: EventCategory, stats: GameStats, day: number): number {
  let weight = 1.0;

  if (category === 'crisis') {
    if (stats.prRisk > 60) weight *= GAME_CONFIG.CRISIS_WEIGHT_HIGH_RISK;
    if (day > GAME_CONFIG.LATE_GAME[0]) weight *= 1.5;
  }

  if (category === 'business') {
    if (stats.money < 100000) weight *= GAME_CONFIG.BUSINESS_WEIGHT_LOW_MONEY;
  }

  if (category === 'pr') {
    if (stats.fanLoyalty < 40) weight *= GAME_CONFIG.PR_WEIGHT_LOW_LOYALTY;
  }

  if (category === 'drama') {
    if (day > GAME_CONFIG.MID_GAME[0]) weight *= 1.5;
  }

  return weight;
}

function getSeverityAllowed(day: number): string[] {
  if (day <= GAME_CONFIG.EARLY_GAME[1]) return ['low', 'medium'];
  if (day <= GAME_CONFIG.MID_GAME[1]) return ['low', 'medium', 'high'];
  return ['low', 'medium', 'high', 'critical'];
}

function isEventEligible(
  event: GameEvent,
  day: number,
  stats: GameStats,
  eventUsageMap: Record<string, number>, // eventId -> last used day
  activeTags: string[],
  artistId?: ArtistArchetype
): boolean {
  // Artist-specific event filter
  if (event.forArtist) {
    if (!artistId) return false;
    const allowed = Array.isArray(event.forArtist) ? event.forArtist : [event.forArtist];
    if (!allowed.includes(artistId)) return false;
  }

  // Cooldown check: skip if used too recently
  const lastUsedDay = eventUsageMap[event.id];
  if (lastUsedDay !== undefined && (day - lastUsedDay) < EVENT_COOLDOWN) return false;

  if (event.minDay && day < event.minDay) return false;
  if (event.maxDay && day > event.maxDay) return false;

  const allowedSeverities = getSeverityAllowed(day);
  if (!allowedSeverities.includes(event.severity)) return false;

  if (event.requiredTags) {
    if (!event.requiredTags.every(tag => activeTags.includes(tag))) return false;
  }
  if (event.excludeTags) {
    if (event.excludeTags.some(tag => activeTags.includes(tag))) return false;
  }

  if (event.statConditions) {
    const c = event.statConditions;
    if (c.minCommercialValue !== undefined && stats.commercialValue < c.minCommercialValue) return false;
    if (c.maxCommercialValue !== undefined && stats.commercialValue > c.maxCommercialValue) return false;
    if (c.minFanLoyalty !== undefined && stats.fanLoyalty < c.minFanLoyalty) return false;
    if (c.maxFanLoyalty !== undefined && stats.fanLoyalty > c.maxFanLoyalty) return false;
    if (c.minPrRisk !== undefined && stats.prRisk < c.minPrRisk) return false;
    if (c.maxPrRisk !== undefined && stats.prRisk > c.maxPrRisk) return false;
    if (c.minMoney !== undefined && stats.money < c.minMoney) return false;
    if (c.maxMoney !== undefined && stats.money > c.maxMoney) return false;
  }

  return true;
}

// 里程碑事件ID集合，满足条件时强制注入
const milestoneIds = new Set(milestoneEvents.map(e => e.id));
// 艺人作妖事件ID集合，每2-3天强制注入一个
const troubleIds = new Set(artistTroubleEvents.map(e => e.id));

export function selectEventsForDay(
  day: number,
  stats: GameStats,
  eventUsageMap: Record<string, number>,
  activeTags: string[],
  artistId?: ArtistArchetype,
  mentalContext?: {
    mental: ArtistMentalState;
    lowMoodStreak: number;
  },
  modifiers?: SeasonalModifier[],
): GameEvent[] {
  const eligible = allEvents.filter(e =>
    isEventEligible(e, day, stats, eventUsageMap, activeTags, artistId)
  );

  if (eligible.length === 0) return [];

  // 心理阈值被动事件：跨过阈值就强制注入（单局一次，由 EVENT_COOLDOWN 保证）
  let triggeredMentalEvent: GameEvent | null = null;
  if (mentalContext) {
    const activeIds = getActiveMentalTriggers({
      mood: mentalContext.mental.mood,
      trust: mentalContext.mental.trust,
      burnout: mentalContext.mental.burnout,
      stress: mentalContext.mental.stress,
      energy: mentalContext.mental.energy,
      lowMoodStreak: mentalContext.lowMoodStreak,
    });
    const firstUnused = activeIds
      .map(id => eligible.find(e => e.id === id))
      .find((e): e is GameEvent => !!e);
    triggeredMentalEvent = firstUnused ?? null;
  }

  // 里程碑事件强制注入（满足条件就触发，不和普通事件竞争）
  const triggeredMilestones = eligible.filter(e => milestoneIds.has(e.id));
  // 艺人作妖事件：每2-3天强制注入一个（从第2天起，偶数天必触发，奇数天50%概率）
  const troubleEligible = eligible.filter(e => troubleIds.has(e.id));
  const shouldTriggerTrouble = day >= 2 && troubleEligible.length > 0 &&
    (day % 2 === 0 || Math.random() < 0.5);
  const normalEligible = eligible.filter(e =>
    !milestoneIds.has(e.id) && !troubleIds.has(e.id) && !mentalTriggerIds.has(e.id)
  );

  // Determine how many normal events this day
  const rand = Math.random();
  let eventCount: number;
  if (day <= GAME_CONFIG.EARLY_GAME[1]) {
    eventCount = 1;
  } else if (rand < 0.3) {
    eventCount = 1;
  } else if (rand < 0.8) {
    eventCount = 2;
  } else {
    eventCount = 3;
  }
  // 里程碑事件占位后，剩余名额给普通事件
  const milestoneCount = Math.min(triggeredMilestones.length, 1); // 每天最多1个里程碑
  const troubleCount = shouldTriggerTrouble ? 1 : 0; // 艺人作妖事件最多1个
  const mentalCount = triggeredMentalEvent ? 1 : 0; // 心理阈值事件最多1个
  const normalCount = Math.min(
    Math.max(eventCount - milestoneCount - troubleCount - mentalCount, 1),
    normalEligible.length,
  );

  // Prefer unused events, then oldest used events
  const weighted = normalEligible.map(event => {
    const baseWeight = getCategoryWeight(event.category, stats, day);
    const modifierWeight = modifiers && modifiers.length > 0
      ? aggregateCategoryWeight(modifiers, event.category)
      : 1.0;
    const lastUsed = eventUsageMap[event.id];
    // Never-used events get 2x weight; older usage = higher weight
    const freshnessBonus = lastUsed === undefined ? 2.0 : 1.0 + (day - lastUsed - EVENT_COOLDOWN) * 0.1;
    return { event, weight: baseWeight * modifierWeight * Math.max(freshnessBonus, 0.5) };
  });

  const selected: GameEvent[] = [];
  const usedCategories = new Set<string>();

  // 心理阈值事件最先放入（最重要，玩家最该看）
  if (triggeredMentalEvent) {
    selected.push(triggeredMentalEvent);
    usedCategories.add(triggeredMentalEvent.category);
  }

  // 再放入里程碑事件
  if (milestoneCount > 0 && triggeredMilestones.length > 0) {
    const ms = triggeredMilestones[Math.floor(Math.random() * triggeredMilestones.length)];
    if (!selected.includes(ms)) {
      selected.push(ms);
      usedCategories.add(ms.category);
    }
  }

  // 再放入艺人作妖事件
  if (troubleCount > 0 && troubleEligible.length > 0) {
    const availableTrouble = troubleEligible.filter(e => !usedCategories.has(e.category));
    const pool = availableTrouble.length > 0 ? availableTrouble : troubleEligible;
    const te = pool[Math.floor(Math.random() * pool.length)];
    selected.push(te);
    usedCategories.add(te.category);
  }

  // 再抽选普通事件
  for (let i = 0; i < normalCount; i++) {
    const available = weighted.filter(
      w => !selected.includes(w.event) && !usedCategories.has(w.event.category)
    );
    if (available.length === 0) break;

    const totalWeight = available.reduce((sum, w) => sum + w.weight, 0);
    let r = Math.random() * totalWeight;

    for (const w of available) {
      r -= w.weight;
      if (r <= 0) {
        selected.push(w.event);
        usedCategories.add(w.event.category);
        break;
      }
    }
  }

  return selected.map(e => resolveEventForArtist(e, artistId));
}
