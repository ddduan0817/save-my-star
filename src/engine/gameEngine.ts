import type { GameStats, GameEvent, EventChoice, DecisionRecord, StatChange, Ending } from '@/types/game';
import { GAME_CONFIG } from '@/data/constants';
import { applyStatChanges, applyDailyPassiveEffects } from './outcomeCalculator';
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
}

export function startNewDay(
  day: number,
  stats: GameStats,
  usedEventIds: string[],
  activeTags: string[]
): DayResult {
  // Apply daily passive effects
  const events = selectEventsForDay(day, stats, usedEventIds, activeTags);
  return { events };
}

export function resolveChoice(
  event: GameEvent,
  choice: EventChoice,
  currentStats: GameStats,
  artistId: string,
  day: number,
  activeTags: string[],
  peakRisk: number
): ChoiceResult {
  const newStats = applyStatChanges(currentStats, choice.outcome.statChanges, artistId);

  // Singer special: can survive one critical crisis
  if (artistId === 'singer' && newStats.prRisk >= GAME_CONFIG.CANCELLATION_THRESHOLD) {
    if (!activeTags.includes('used_singer_shield')) {
      newStats.prRisk = 85;
      return {
        newStats,
        narration: choice.outcome.narration + '\n\n🛡️ 【作品说话】天赋技能发动！凭借过硬的作品口碑，你的艺人扛住了这次致命危机。但这张护身符只能用一次...',
        statChanges: choice.outcome.statChanges,
        specialEffect: choice.outcome.specialEffect,
        unlockTag: 'used_singer_shield',
      };
    }
  }

  const newPeakRisk = Math.max(peakRisk, newStats.prRisk);
  const tags = [...activeTags];
  if (choice.outcome.unlockTag) tags.push(choice.outcome.unlockTag);

  // Check for immediate endings
  const immediateEnding = checkImmediateEnding(newStats, newPeakRisk, tags);

  return {
    newStats,
    narration: choice.outcome.narration,
    statChanges: choice.outcome.statChanges,
    specialEffect: choice.outcome.specialEffect,
    unlockTag: choice.outcome.unlockTag,
    ending: immediateEnding,
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
