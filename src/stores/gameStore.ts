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
} from '@/types/game';
import { artists } from '@/data/artists';
import { startNewDay, resolveChoice, checkDayEnd } from '@/engine/gameEngine';
import { applyDailyPassiveEffects } from '@/engine/outcomeCalculator';
import { loadUnlockedEndings, saveUnlockedEnding } from '@/lib/storage';

interface GameStore {
  // State
  gamePhase: GamePhase;
  currentDay: number;
  artist: Artist | null;
  stats: GameStats;
  currentEvents: GameEvent[];
  currentEventIndex: number;
  lastOutcomeNarration: string;
  lastStatChanges: { commercialValue?: number; fanLoyalty?: number; prRisk?: number; money?: number } | null;
  decisionHistory: DecisionRecord[];
  activeTags: string[];
  eventUsageMap: Record<string, number>; // eventId -> last used day
  ending: Ending | null;
  peakRisk: number;
  unlockedEndings: EndingId[];

  // Actions
  startGame: (artistId: ArtistArchetype) => void;
  advanceDay: () => void;
  selectChoice: (choice: EventChoice) => void;
  dismissOutcome: () => void;
  resetGame: () => void;
  loadCollection: () => void;
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
      decisionHistory: [],
      activeTags: [],
      eventUsageMap: {},
      ending: null,
      peakRisk: artist.initialStats.prRisk,
    });
  },

  advanceDay: () => {
    const { currentDay, stats, eventUsageMap, activeTags } = get();

    // Apply daily passive effects
    const newStats = currentDay > 1 ? applyDailyPassiveEffects(stats) : stats;

    const { events } = startNewDay(currentDay, newStats, eventUsageMap, activeTags);

    if (events.length === 0) {
      const dayEndEnding = checkDayEnd(currentDay, newStats, activeTags, get().peakRisk);
      if (dayEndEnding) {
        const unlocked = saveUnlockedEnding(dayEndEnding.id);
        set({
          ending: dayEndEnding,
          gamePhase: 'ended',
          stats: newStats,
          unlockedEndings: unlocked,
        });
        return;
      }
      set({
        currentDay: currentDay + 1,
        stats: newStats,
        gamePhase: 'day_transition',
      });
      return;
    }

    // Record usage with current day
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
      gamePhase: 'showing_outcome',
      activeTags: newTags,
      decisionHistory: [...get().decisionHistory, record],
      peakRisk: newPeakRisk,
    });
  },

  dismissOutcome: () => {
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
      set({
        ending: dayEndEnding,
        gamePhase: 'ended',
        unlockedEndings: unlocked,
      });
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
