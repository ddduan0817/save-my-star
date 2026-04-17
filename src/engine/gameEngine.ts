import type { GameStats, GameEvent, EventChoice, StatChange, Ending, ConditionalOutcome, Twist, ArtistArchetype } from '@/types/game';
import { GAME_CONFIG } from '@/data/constants';
import { applyStatChanges } from './outcomeCalculator';
import { selectEventsForDay } from './eventSelector';
import { evaluateEnding, checkImmediateEnding } from '@/data/endings';

export interface DayResult {
  events: GameEvent[];
}

export interface ChoiceResult {
  newStats: GameStats;
  narration: string;
  statChanges: StatChange;
  specialEffect?: string;
  unlockTag?: string;
  ending?: Ending | null;
  followUpEventId?: string;
  // 反转信息
  twist?: {
    narration: string;
    statChanges: StatChange;
    unlockTag?: string;
  } | null;
}

// 根据当前数值选择合适的结局分支
function resolveConditionalOutcome(
  conditionalOutcomes: ConditionalOutcome[] | undefined,
  stats: GameStats
): ConditionalOutcome | null {
  if (!conditionalOutcomes || conditionalOutcomes.length === 0) return null;

  for (const co of conditionalOutcomes) {
    const c = co.condition;
    let match = true;
    if (c.minFanLoyalty !== undefined && stats.fanLoyalty < c.minFanLoyalty) match = false;
    if (c.maxFanLoyalty !== undefined && stats.fanLoyalty > c.maxFanLoyalty) match = false;
    if (c.minPrRisk !== undefined && stats.prRisk < c.minPrRisk) match = false;
    if (c.maxPrRisk !== undefined && stats.prRisk > c.maxPrRisk) match = false;
    if (c.minCommercialValue !== undefined && stats.commercialValue < c.minCommercialValue) match = false;
    if (c.maxCommercialValue !== undefined && stats.commercialValue > c.maxCommercialValue) match = false;
    if (c.minMoney !== undefined && stats.money < c.minMoney) match = false;
    if (match) return co;
  }
  return null;
}

// 判断反转是否触发
function resolveTwist(twist: Twist | undefined): boolean {
  if (!twist) return false;
  return Math.random() < twist.chance;
}

// 给数值变动加随机波动（±30%，money ±20%），增加重玩性
function randomizeStatChanges(changes: StatChange): StatChange {
  const result: StatChange = {};
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined || value === 0) {
      (result as Record<string, number>)[key] = value as number;
      continue;
    }
    const rate = key === 'money' ? 0.2 : 0.3;
    const variance = Math.max(1, Math.round(Math.abs(value as number) * rate));
    const delta = Math.floor(Math.random() * (variance * 2 + 1)) - variance;
    let newValue = (value as number) + delta;
    // 保持正负号不变
    if ((value as number) > 0 && newValue <= 0) newValue = 1;
    if ((value as number) < 0 && newValue >= 0) newValue = -1;
    (result as Record<string, number>)[key] = newValue;
  }
  return result;
}

export function startNewDay(
  day: number,
  stats: GameStats,
  eventUsageMap: Record<string, number>,
  activeTags: string[],
  artistId?: ArtistArchetype
): DayResult {
  const events = selectEventsForDay(day, stats, eventUsageMap, activeTags, artistId);
  return { events };
}

export function resolveChoice(
  event: GameEvent,
  choice: EventChoice,
  currentStats: GameStats,
  artistId: string,
  day: number,
  activeTags: string[],
  peakRisk: number,
  appearanceMultiplier?: number,
  stiffFaceActive?: boolean,
): ChoiceResult {
  // 1. 检查是否有条件分支匹配
  const conditionalOutcome = resolveConditionalOutcome(
    choice.outcome.conditionalOutcomes,
    currentStats
  );

  // 使用条件分支或默认结局
  const narration = conditionalOutcome?.narration ?? choice.outcome.narration;
  const baseStatChanges = conditionalOutcome?.statChanges ?? choice.outcome.statChanges;
  const unlockTag = conditionalOutcome?.unlockTag ?? choice.outcome.unlockTag;

  // 加随机波动，让同一选项每次结果不同
  const statChanges = randomizeStatChanges(baseStatChanges);

  const newStats = applyStatChanges(currentStats, statChanges, artistId, appearanceMultiplier, stiffFaceActive);

  // Singer special: can survive one critical crisis
  if (artistId === 'singer' && newStats.prRisk >= GAME_CONFIG.CANCELLATION_THRESHOLD) {
    if (!activeTags.includes('used_singer_shield')) {
      newStats.prRisk = 85;
      return {
        newStats,
        narration: narration + '\n\n🛡️ 【作品说话】天赋技能发动！凭借过硬的作品口碑，你的艺人扛住了这次致命危机。但这张护身符只能用一次...',
        statChanges,
        specialEffect: choice.outcome.specialEffect,
        unlockTag: 'used_singer_shield',
        twist: null,
      };
    }
  }

  // 2. 检查反转是否触发
  let twistResult = null;
  if (resolveTwist(choice.outcome.twist)) {
    twistResult = {
      narration: choice.outcome.twist!.narration,
      statChanges: choice.outcome.twist!.statChanges,
      unlockTag: choice.outcome.twist!.unlockTag,
    };
  }

  const newPeakRisk = Math.max(peakRisk, newStats.prRisk);
  const tags = [...activeTags];
  if (unlockTag) tags.push(unlockTag);

  // Check for immediate endings
  const immediateEnding = checkImmediateEnding(newStats, newPeakRisk, tags);

  return {
    newStats,
    narration,
    statChanges,
    specialEffect: choice.outcome.specialEffect,
    unlockTag,
    ending: immediateEnding,
    followUpEventId: choice.outcome.followUpEventId,
    twist: twistResult,
  };
}

export function checkDayEnd(
  day: number,
  stats: GameStats,
  activeTags: string[],
  peakRisk: number
): Ending | null {
  if (day >= GAME_CONFIG.MAX_DAYS) {
    return evaluateEnding(stats, activeTags, day, peakRisk);
  }
  return null;
}
