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
import { lateGameEvents } from '@/data/events/late-game';
import { milestoneEvents } from '@/data/events/milestone';

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
  ...lateGameEvents,
  ...milestoneEvents,
];

const EVENT_COOLDOWN = 8; // 事件使用后需间隔8天才能再次出现

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
    if (c.minCommercial !== undefined && stats.commercialValue < c.minCommercial) return false;
    if (c.maxCommercial !== undefined && stats.commercialValue > c.maxCommercial) return false;
    if (c.minFanLoyalty !== undefined && stats.fanLoyalty < c.minFanLoyalty) return false;
    if (c.maxFanLoyalty !== undefined && stats.fanLoyalty > c.maxFanLoyalty) return false;
    if (c.minPrRisk !== undefined && stats.prRisk < c.minPrRisk) return false;
    if (c.maxPrRisk !== undefined && stats.prRisk > c.maxPrRisk) return false;
    if (c.minMoney !== undefined && stats.money < c.minMoney) return false;
    if (c.maxMoney !== undefined && stats.money > c.maxMoney) return false;
  }

  return true;
}

export function selectEventsForDay(
  day: number,
  stats: GameStats,
  eventUsageMap: Record<string, number>,
  activeTags: string[],
  artistId?: ArtistArchetype
): GameEvent[] {
  const eligible = allEvents.filter(e =>
    isEventEligible(e, day, stats, eventUsageMap, activeTags, artistId)
  );

  if (eligible.length === 0) return [];

  // Determine how many events this day
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
  eventCount = Math.min(eventCount, eligible.length);

  // Prefer unused events, then oldest used events
  const weighted = eligible.map(event => {
    const baseWeight = getCategoryWeight(event.category, stats, day);
    const lastUsed = eventUsageMap[event.id];
    // Never-used events get 2x weight; older usage = higher weight
    const freshnessBonus = lastUsed === undefined ? 2.0 : 1.0 + (day - lastUsed - EVENT_COOLDOWN) * 0.1;
    return { event, weight: baseWeight * Math.max(freshnessBonus, 0.5) };
  });

  const selected: GameEvent[] = [];
  const usedCategories = new Set<string>();

  for (let i = 0; i < eventCount; i++) {
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

  return selected;
}
