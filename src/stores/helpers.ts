// gameStore 的内部 helper：日常结算 / 成就检查 / 事件生成

import type {
  GameEvent,
  GameStats,
  ArtistArchetype,
  LedgerEntry,
} from '@/types/game';
import { checkAchievements, loadUnlockedAchievements, type Achievement } from '@/data/achievements';
import { startNewDay } from '@/engine/gameEngine';
import { findEventById } from '@/engine/eventSelector';
import { breakingEvents } from '@/data/events/breaking';

// 突发事件触发概率 (每天 25%)
export const BREAKING_CHANCE = 0.25;
export const MAX_CARRYOVER_MESSAGES = 2;

// --- Ledger helpers ----------------------------------------------------------

// 收支明细单行追加：会触发一次 set()。只在"一次交互只写一行"的场景用。
// 多行联写请改用 appendLedger 构造数组后和主 set 一起写，避免 race。
export function addLedger<S extends { dailyLedger: LedgerEntry[] }>(
  get: () => S,
  set: (partial: Partial<S>) => void,
  entry: LedgerEntry,
) {
  if (entry.amount === 0) return;
  set({ dailyLedger: [...get().dailyLedger, entry] } as Partial<S>);
}

// 原子构造新的 ledger：适合在主 set() 同一 transaction 里一次写入多行，
// 避免上游 set() 清空 dailyLedger 后 addLedger 再追加产生的 race。
export function appendLedger(
  currentLedger: LedgerEntry[],
  ...entries: (LedgerEntry | null | undefined)[]
): LedgerEntry[] {
  const filtered = entries.filter((e): e is LedgerEntry => !!e && e.amount !== 0);
  if (filtered.length === 0) return currentLedger;
  return [...currentLedger, ...filtered];
}

// --- Achievement helper ------------------------------------------------------

interface AchievementCheckState {
  stats: GameStats;
  currentDay: number;
  artist: { id: ArtistArchetype } | null;
  activeTags: string[];
  decisionHistory: Parameters<typeof checkAchievements>[0]['decisionHistory'];
  peakRisk: number;
  cosmeticState: Parameters<typeof checkAchievements>[0]['cosmeticState'];
  pendingAchievement: Achievement | null;
  unlockedAchievements: string[];
}

export function runAchievementCheck<S extends AchievementCheckState>(
  get: () => S,
  set: (partial: Partial<S>) => void,
) {
  const { stats, currentDay, artist, activeTags, decisionHistory, peakRisk, cosmeticState } = get();
  if (!artist) return;
  const newAchs = checkAchievements({
    stats,
    day: currentDay,
    artistId: artist.id,
    activeTags,
    decisionHistory,
    peakRisk,
    cosmeticState,
  });
  if (newAchs.length > 0) {
    set({
      pendingAchievement: newAchs[0],
      unlockedAchievements: loadUnlockedAchievements(),
    } as Partial<S>);
  }
}

// --- Event generation --------------------------------------------------------

export function maybeInjectBreaking(
  events: GameEvent[],
  day: number,
  eventUsageMap: Record<string, number>,
): GameEvent[] {
  if (day <= 3 || Math.random() > BREAKING_CHANCE) return events;

  const available = breakingEvents.filter(e => {
    const lastUsed = eventUsageMap[e.id];
    if (lastUsed !== undefined) return false;
    if (e.minDay && day < e.minDay) return false;
    return true;
  });

  if (available.length === 0) return events;

  const breaking = available[Math.floor(Math.random() * available.length)];
  return [breaking, ...events];
}

export function generateEventsForDay(
  day: number,
  stats: GameStats,
  eventUsageMap: Record<string, number>,
  activeTags: string[],
  artistId?: ArtistArchetype,
  pendingFollowUpEventIds?: string[],
): { events: GameEvent[]; newUsageMap: Record<string, number> } {
  let { events } = startNewDay(day, stats, eventUsageMap, activeTags, artistId);

  // Inject follow-up events (event chains — supports multiple simultaneous chains)
  if (pendingFollowUpEventIds && pendingFollowUpEventIds.length > 0) {
    for (const id of pendingFollowUpEventIds) {
      const followUpEvent = findEventById(id);
      if (followUpEvent) {
        events = [followUpEvent, ...events];
      }
    }
  }

  // Maybe inject breaking event
  events = maybeInjectBreaking(events, day, eventUsageMap);

  const newUsageMap = { ...eventUsageMap };
  for (const e of events) {
    newUsageMap[e.id] = day;
  }

  return { events, newUsageMap };
}
