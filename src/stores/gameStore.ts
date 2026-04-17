import { create } from 'zustand';
import type {
  GameStats,
  GameEvent,
  EventChoice,
  Artist,
  ArtistArchetype,
  GamePhase,
  DecisionRecord,
  Ending,
  EndingId,
  StatChange,
} from '@/types/game';
import { artists } from '@/data/artists';
import { startNewDay, resolveChoice, checkDayEnd } from '@/engine/gameEngine';
import { applyDailyPassiveEffects, applyStatChanges } from '@/engine/outcomeCalculator';
import { loadUnlockedEndings, saveUnlockedEnding } from '@/lib/storage';
import { breakingEvents } from '@/data/events/breaking';

interface GameStore {
  gamePhase: GamePhase;
  currentDay: number;
  artist: Artist | null;
  stats: GameStats;
  currentEvents: GameEvent[];
  currentEventIndex: number;
  lastOutcomeNarration: string;
  lastStatChanges: StatChange | null;
  pendingTwist: { narration: string; statChanges: StatChange; unlockTag?: string } | null;
  decisionHistory: DecisionRecord[];
  activeTags: string[];
  eventUsageMap: Record<string, number>;
  ending: Ending | null;
  peakRisk: number;
  unlockedEndings: EndingId[];

  startGame: (artistId: ArtistArchetype) => void;
  advanceDay: () => void;
  selectChoice: (choice: EventChoice) => void;
  dismissOutcome: () => void;
  dismissTwist: () => void;
  resetGame: () => void;
  loadCollection: () => void;
}

// 突发事件触发概率 (每天 25%)
const BREAKING_CHANCE = 0.25;

function maybeInjectBreaking(
  events: GameEvent[],
  day: number,
  eventUsageMap: Record<string, number>
): GameEvent[] {
  if (day <= 3 || Math.random() > BREAKING_CHANCE) return events;

  const available = breakingEvents.filter(e => {
    const lastUsed = eventUsageMap[e.id];
    if (lastUsed !== undefined && (day - lastUsed) < 10) return false;
    if (e.minDay && day < e.minDay) return false;
    return true;
  });

  if (available.length === 0) return events;

  const breaking = available[Math.floor(Math.random() * available.length)];
  // 突发事件插到最前面
  return [breaking, ...events];
}

export const useGameStore = create<GameStore>((set, get) => ({
  gamePhase: 'not_started',
  currentDay: 0,
  artist: null,
  stats: { commercialValue: 0, fanLoyalty: 0, prRisk: 0, money: 0 },
  currentEvents: [],
  currentEventIndex: 0,
  lastOutcomeNarration: '',
  lastStatChanges: null,
  pendingTwist: null,
  decisionHistory: [],
  activeTags: [],
  eventUsageMap: {},
  ending: null,
  peakRisk: 0,
  unlockedEndings: [],

  startGame: (artistId: ArtistArchetype) => {
    const artist = artists.find(a => a.id === artistId)!;
    set({
      gamePhase: 'day_transition',
      currentDay: 1,
      artist,
      stats: { ...artist.initialStats },
      currentEvents: [],
      currentEventIndex: 0,
      lastOutcomeNarration: '',
      lastStatChanges: null,
      pendingTwist: null,
      decisionHistory: [],
      activeTags: [],
      eventUsageMap: {},
      ending: null,
      peakRisk: artist.initialStats.prRisk,
    });
  },

  advanceDay: () => {
    const { currentDay, stats, eventUsageMap, activeTags } = get();

    const newStats = currentDay > 1 ? applyDailyPassiveEffects(stats) : stats;

    let { events } = startNewDay(currentDay, newStats, eventUsageMap, activeTags);

    // 可能注入突发事件
    events = maybeInjectBreaking(events, currentDay, eventUsageMap);

    if (events.length === 0) {
      const dayEndEnding = checkDayEnd(currentDay, newStats, activeTags, get().peakRisk);
      if (dayEndEnding) {
        const unlocked = saveUnlockedEnding(dayEndEnding.id);
        set({ ending: dayEndEnding, gamePhase: 'ended', stats: newStats, unlockedEndings: unlocked });
        return;
      }
      set({ currentDay: currentDay + 1, stats: newStats, gamePhase: 'day_transition' });
      return;
    }

    const newUsageMap = { ...eventUsageMap };
    for (const e of events) {
      newUsageMap[e.id] = currentDay;
    }

    set({
      currentEvents: events,
      currentEventIndex: 0,
      stats: newStats,
      gamePhase: 'playing',
      eventUsageMap: newUsageMap,
    });
  },

  selectChoice: (choice: EventChoice) => {
    const { currentEvents, currentEventIndex, stats, artist, currentDay, activeTags, peakRisk } = get();
    const event = currentEvents[currentEventIndex];

    const result = resolveChoice(event, choice, stats, artist!.id, currentDay, activeTags, peakRisk);

    const newTags = [...activeTags];
    if (result.unlockTag) newTags.push(result.unlockTag);

    const record: DecisionRecord = {
      day: currentDay,
      eventId: event.id,
      eventTitle: event.title,
      choiceId: choice.id,
      choiceText: choice.text,
      statChanges: result.statChanges,
    };

    const newPeakRisk = Math.max(peakRisk, result.newStats.prRisk);

    if (result.ending) {
      const unlocked = saveUnlockedEnding(result.ending.id);
      set({
        stats: result.newStats,
        lastOutcomeNarration: result.narration,
        lastStatChanges: result.statChanges,
        pendingTwist: null,
        gamePhase: 'ended',
        ending: result.ending,
        activeTags: newTags,
        decisionHistory: [...get().decisionHistory, record],
        peakRisk: newPeakRisk,
        unlockedEndings: unlocked,
      });
      return;
    }

    set({
      stats: result.newStats,
      lastOutcomeNarration: result.narration,
      lastStatChanges: result.statChanges,
      pendingTwist: result.twist ?? null,
      gamePhase: 'showing_outcome',
      activeTags: newTags,
      decisionHistory: [...get().decisionHistory, record],
      peakRisk: newPeakRisk,
    });
  },

  dismissOutcome: () => {
    const { pendingTwist } = get();

    // 如果有反转待触发，进入反转阶段
    if (pendingTwist) {
      const { stats, artist, activeTags } = get();
      const twistStats = applyStatChanges(stats, pendingTwist.statChanges, artist?.id);
      const newTags = [...activeTags];
      if (pendingTwist.unlockTag) newTags.push(pendingTwist.unlockTag);

      set({
        gamePhase: 'showing_twist',
        stats: twistStats,
        lastOutcomeNarration: pendingTwist.narration,
        lastStatChanges: pendingTwist.statChanges,
        pendingTwist: null,
        activeTags: newTags,
        peakRisk: Math.max(get().peakRisk, twistStats.prRisk),
      });
      return;
    }

    // 正常流转
    const { currentEvents, currentEventIndex, currentDay, stats, activeTags, peakRisk } = get();

    if (currentEventIndex < currentEvents.length - 1) {
      set({
        currentEventIndex: currentEventIndex + 1,
        gamePhase: 'playing',
        lastOutcomeNarration: '',
        lastStatChanges: null,
      });
      return;
    }

    const dayEndEnding = checkDayEnd(currentDay, stats, activeTags, peakRisk);
    if (dayEndEnding) {
      const unlocked = saveUnlockedEnding(dayEndEnding.id);
      set({ ending: dayEndEnding, gamePhase: 'ended', unlockedEndings: unlocked });
      return;
    }

    set({
      currentDay: currentDay + 1,
      gamePhase: 'day_transition',
      lastOutcomeNarration: '',
      lastStatChanges: null,
    });
  },

  // 反转阶段结束后继续正常流转
  dismissTwist: () => {
    const { currentEvents, currentEventIndex, currentDay, stats, activeTags, peakRisk } = get();

    if (currentEventIndex < currentEvents.length - 1) {
      set({
        currentEventIndex: currentEventIndex + 1,
        gamePhase: 'playing',
        lastOutcomeNarration: '',
        lastStatChanges: null,
      });
      return;
    }

    const dayEndEnding = checkDayEnd(currentDay, stats, activeTags, peakRisk);
    if (dayEndEnding) {
      const unlocked = saveUnlockedEnding(dayEndEnding.id);
      set({ ending: dayEndEnding, gamePhase: 'ended', unlockedEndings: unlocked });
      return;
    }

    set({
      currentDay: currentDay + 1,
      gamePhase: 'day_transition',
      lastOutcomeNarration: '',
      lastStatChanges: null,
    });
  },

  resetGame: () => {
    set({
      gamePhase: 'not_started',
      currentDay: 0,
      artist: null,
      stats: { commercialValue: 0, fanLoyalty: 0, prRisk: 0, money: 0 },
      currentEvents: [],
      currentEventIndex: 0,
      lastOutcomeNarration: '',
      lastStatChanges: null,
      pendingTwist: null,
      decisionHistory: [],
      activeTags: [],
      eventUsageMap: {},
      ending: null,
      peakRisk: 0,
    });
  },

  loadCollection: () => {
    set({ unlockedEndings: loadUnlockedEndings() });
  },
}));
