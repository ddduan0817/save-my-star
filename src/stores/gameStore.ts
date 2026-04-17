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
  TabId,
  GameMessage,
  ActiveSchedule,
  ScheduleActivityId,
  UpgradeId,
  WeiboTrend,
  FanComment,
  WeiboPostRecord,
} from '@/types/game';
import { artists } from '@/data/artists';
import { startNewDay, resolveChoice, checkDayEnd } from '@/engine/gameEngine';
import { applyDailyPassiveEffects, applyStatChanges } from '@/engine/outcomeCalculator';
import { loadUnlockedEndings, saveUnlockedEnding } from '@/lib/storage';
import { breakingEvents } from '@/data/events/breaking';
import { findEventById } from '@/engine/eventSelector';
import { createMessages } from '@/engine/messageFactory';
import { scheduleActivities } from '@/data/schedules';
import { companyUpgradesData } from '@/data/upgrades';
import { generateWeiboTrends, generateFanComments } from '@/engine/socialGenerator';
import { weiboPostTemplates } from '@/data/weiboPosts';
import { resolveWeiboPost } from '@/engine/weiboPostEngine';
import { applyStatChanges as applyStatChangesEngine } from '@/engine/outcomeCalculator';
import {
  checkAchievements,
  loadUnlockedAchievements,
  saveArtistUsed,
  type Achievement,
} from '@/data/achievements';

interface GameStore {
  // Core state
  gamePhase: GamePhase;
  currentDay: number;
  artist: Artist | null;
  stats: GameStats;

  // Tab system
  activeTab: TabId;

  // Message system (replaces old currentEvents)
  messages: GameMessage[];
  activeMessageId: string | null;

  // Legacy compat: current event being processed
  currentEvents: GameEvent[];
  currentEventIndex: number;

  // Outcome display
  lastOutcomeNarration: string;
  lastStatChanges: StatChange | null;
  pendingTwist: { narration: string; statChanges: StatChange; unlockTag?: string } | null;
  pendingFollowUpEventIds: string[];

  // Game history
  decisionHistory: DecisionRecord[];
  activeTags: string[];
  eventUsageMap: Record<string, number>;
  ending: Ending | null;
  peakRisk: number;

  // Collection
  unlockedEndings: EndingId[];
  pendingAchievement: Achievement | null;
  unlockedAchievements: string[];

  // Schedule system
  artistSchedule: ActiveSchedule | null;

  // Company upgrades
  companyUpgrades: Record<UpgradeId, number>;

  // Social feed
  weiboTrends: WeiboTrend[];
  fanComments: FanComment[];

  // Day transition banner
  showDayBanner: boolean;

  // Weibo posting system
  dailyPostUsed: boolean;
  weiboPostHistory: WeiboPostRecord[];
  lastPostNarration: string;
  lastPostStatChanges: StatChange | null;
  showPostResult: boolean;

  // Actions
  startGame: (artistId: ArtistArchetype) => void;
  setActiveTab: (tab: TabId) => void;
  openMessage: (messageId: string) => void;
  closeMessage: () => void;
  selectChoice: (choice: EventChoice) => void;
  dismissOutcome: () => void;
  dismissTwist: () => void;
  endDay: () => boolean; // returns false if blocked by urgent messages
  setArtistSchedule: (activityId: ScheduleActivityId) => void;
  purchaseUpgrade: (upgradeId: UpgradeId) => void;
  postWeibo: (templateId: string) => void;
  dismissPostResult: () => void;
  dismissAchievement: () => void;
  dismissDayBanner: () => void;
  resetGame: () => void;
  loadCollection: () => void;
}

// 突发事件触发概率 (每天 25%)
const BREAKING_CHANCE = 0.25;
const MAX_CARRYOVER_MESSAGES = 2;

// 成就检查 helper
function runAchievementCheck(get: () => GameStore, set: (partial: Partial<GameStore>) => void) {
  const { stats, currentDay, artist, activeTags, decisionHistory, peakRisk } = get();
  if (!artist) return;
  const newAchs = checkAchievements({
    stats,
    day: currentDay,
    artistId: artist.id,
    activeTags,
    decisionHistory,
    peakRisk,
  });
  if (newAchs.length > 0) {
    set({
      pendingAchievement: newAchs[0],
      unlockedAchievements: loadUnlockedAchievements(),
    });
  }
}

function maybeInjectBreaking(
  events: GameEvent[],
  day: number,
  eventUsageMap: Record<string, number>
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

function generateEventsForDay(
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

export const useGameStore = create<GameStore>((set, get) => ({
  gamePhase: 'not_started',
  currentDay: 0,
  artist: null,
  stats: { commercialValue: 0, fanLoyalty: 0, prRisk: 0, money: 0 },

  activeTab: 'messages',
  messages: [],
  activeMessageId: null,

  currentEvents: [],
  currentEventIndex: 0,
  lastOutcomeNarration: '',
  lastStatChanges: null,
  pendingTwist: null,
  pendingFollowUpEventIds: [],
  decisionHistory: [],
  activeTags: [],
  eventUsageMap: {},
  ending: null,
  peakRisk: 0,
  unlockedEndings: [],
  pendingAchievement: null,
  unlockedAchievements: [],

  artistSchedule: null,
  companyUpgrades: { pr_team: 0, data_analysis: 0, network: 0, legal: 0 },

  weiboTrends: [],
  fanComments: [],

  showDayBanner: false,

  dailyPostUsed: false,
  weiboPostHistory: [],
  lastPostNarration: '',
  lastPostStatChanges: null,
  showPostResult: false,

  startGame: (artistId: ArtistArchetype) => {
    const artist = artists.find(a => a.id === artistId)!;
    saveArtistUsed(artistId);

    const day = 1;
    const stats = { ...artist.initialStats };
    const eventUsageMap: Record<string, number> = {};
    const activeTags: string[] = [];

    const { events, newUsageMap } = generateEventsForDay(
      day, stats, eventUsageMap, activeTags, artistId
    );

    const messages = createMessages(events, day);
    const trends = generateWeiboTrends(stats, artist, [], activeTags);
    const comments = generateFanComments(stats, artist);

    set({
      gamePhase: 'playing',
      currentDay: day,
      artist,
      stats,
      activeTab: 'messages',
      messages,
      activeMessageId: null,
      currentEvents: [],
      currentEventIndex: 0,
      lastOutcomeNarration: '',
      lastStatChanges: null,
      pendingTwist: null,
      pendingFollowUpEventIds: [],
      decisionHistory: [],
      activeTags,
      eventUsageMap: newUsageMap,
      ending: null,
      peakRisk: artist.initialStats.prRisk,
      artistSchedule: null,
      companyUpgrades: { pr_team: 0, data_analysis: 0, network: 0, legal: 0 },
      weiboTrends: trends,
      fanComments: comments,
      showDayBanner: true,
      dailyPostUsed: false,
      weiboPostHistory: [],
      lastPostNarration: '',
      lastPostStatChanges: null,
      showPostResult: false,
    });
  },

  setActiveTab: (tab: TabId) => {
    const { gamePhase } = get();
    // Don't allow tab switching while processing a message/outcome
    if (gamePhase === 'processing_message' || gamePhase === 'showing_outcome' || gamePhase === 'showing_twist') return;
    set({ activeTab: tab });
  },

  openMessage: (messageId: string) => {
    const { messages } = get();
    const msg = messages.find(m => m.id === messageId);
    if (!msg || msg.status === 'resolved') return;

    // Mark as read
    const updatedMessages = messages.map(m =>
      m.id === messageId ? { ...m, status: 'read' as const } : m
    );

    set({
      activeMessageId: messageId,
      messages: updatedMessages,
      gamePhase: 'processing_message',
      currentEvents: [msg.event],
      currentEventIndex: 0,
    });
  },

  closeMessage: () => {
    // Only allow closing non-urgent messages
    const { messages, activeMessageId } = get();
    const msg = messages.find(m => m.id === activeMessageId);
    if (msg?.isUrgent && msg.status !== 'resolved') return;

    set({
      activeMessageId: null,
      gamePhase: 'playing',
      currentEvents: [],
      currentEventIndex: 0,
    });
  },

  selectChoice: (choice: EventChoice) => {
    const { currentEvents, currentEventIndex, stats, artist, currentDay, activeTags, peakRisk, messages, activeMessageId } = get();
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

    // Mark message as resolved
    const updatedMessages = messages.map(m =>
      m.id === activeMessageId ? { ...m, status: 'resolved' as const } : m
    );

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
        messages: updatedMessages,
      });
      return;
    }

    set({
      stats: result.newStats,
      lastOutcomeNarration: result.narration,
      lastStatChanges: result.statChanges,
      pendingTwist: result.twist ?? null,
      pendingFollowUpEventIds: result.followUpEventId
        ? [...get().pendingFollowUpEventIds, result.followUpEventId]
        : get().pendingFollowUpEventIds,
      gamePhase: 'showing_outcome',
      activeTags: newTags,
      decisionHistory: [...get().decisionHistory, record],
      peakRisk: newPeakRisk,
      messages: updatedMessages,
    });

    runAchievementCheck(get, set);
  },

  dismissOutcome: () => {
    const { pendingTwist } = get();

    // If twist pending, transition to twist phase
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

    // Return to message list
    set({
      activeMessageId: null,
      gamePhase: 'playing',
      lastOutcomeNarration: '',
      lastStatChanges: null,
      currentEvents: [],
      currentEventIndex: 0,
    });
  },

  dismissTwist: () => {
    // Return to message list after twist
    set({
      activeMessageId: null,
      gamePhase: 'playing',
      lastOutcomeNarration: '',
      lastStatChanges: null,
      currentEvents: [],
      currentEventIndex: 0,
    });
  },

  endDay: () => {
    const {
      messages, currentDay, stats, activeTags, peakRisk, artist,
      eventUsageMap, pendingFollowUpEventIds, decisionHistory,
      artistSchedule, companyUpgrades,
    } = get();

    // Block if urgent messages unresolved
    const hasUnresolvedUrgent = messages.some(m => m.isUrgent && m.status !== 'resolved');
    if (hasUnresolvedUrgent) return false;

    let newStats = { ...stats };

    // 1. Resolve artist schedule
    let newSchedule = artistSchedule;
    if (artistSchedule) {
      if (artistSchedule.remainingDays <= 1) {
        // Schedule completes
        newStats = applyStatChanges(newStats, artistSchedule.activity.statChanges, artist?.id);
        newSchedule = null;
      } else {
        newSchedule = {
          ...artistSchedule,
          remainingDays: artistSchedule.remainingDays - 1,
        };
      }
    }

    // 2. Apply daily passive effects (with upgrade bonuses)
    newStats = applyDailyPassiveEffects(newStats, companyUpgrades.pr_team);

    // 3. Check for endings
    const newPeakRisk = Math.max(peakRisk, newStats.prRisk);
    const dayEndEnding = checkDayEnd(currentDay, newStats, activeTags, newPeakRisk);
    if (dayEndEnding) {
      const unlocked = saveUnlockedEnding(dayEndEnding.id);
      set({
        ending: dayEndEnding,
        gamePhase: 'ended',
        stats: newStats,
        unlockedEndings: unlocked,
        peakRisk: newPeakRisk,
        artistSchedule: newSchedule,
      });
      return true;
    }

    // 4. Advance day
    const nextDay = currentDay + 1;

    // 5. Generate new events for next day
    const { events, newUsageMap } = generateEventsForDay(
      nextDay, newStats, eventUsageMap, activeTags, artist?.id, pendingFollowUpEventIds
    );

    const newMessages = createMessages(events, nextDay);

    // Carry over unresolved non-urgent messages (max 2)
    const carryOver = messages
      .filter(m => m.status !== 'resolved' && !m.isUrgent)
      .slice(0, MAX_CARRYOVER_MESSAGES);

    // 6. Regenerate social feed
    const trends = generateWeiboTrends(newStats, artist!, decisionHistory, activeTags);
    const comments = generateFanComments(newStats, artist!);

    set({
      currentDay: nextDay,
      stats: newStats,
      messages: [...carryOver, ...newMessages],
      activeMessageId: null,
      activeTab: 'messages',
      gamePhase: 'playing',
      eventUsageMap: newUsageMap,
      pendingFollowUpEventIds: [],
      peakRisk: newPeakRisk,
      lastOutcomeNarration: '',
      lastStatChanges: null,
      artistSchedule: newSchedule,
      weiboTrends: trends,
      fanComments: comments,
      showDayBanner: true,
      dailyPostUsed: false,
      showPostResult: false,
    });

    return true;
  },

  setArtistSchedule: (activityId: ScheduleActivityId) => {
    const { artistSchedule, currentDay } = get();
    // Can't change schedule while one is in progress
    if (artistSchedule && artistSchedule.remainingDays > 0) return;

    const activity = scheduleActivities.find(a => a.id === activityId);
    if (!activity) return;

    set({
      artistSchedule: {
        activity,
        startedDay: currentDay,
        remainingDays: activity.durationDays,
      },
    });
  },

  purchaseUpgrade: (upgradeId: UpgradeId) => {
    const { stats, companyUpgrades } = get();
    const currentLevel = companyUpgrades[upgradeId] ?? 0;
    const upgradeData = companyUpgradesData.find(u => u.id === upgradeId);
    if (!upgradeData || currentLevel >= upgradeData.maxLevel) return;

    const cost = upgradeData.costs[currentLevel];
    if (stats.money < cost) return;

    set({
      stats: { ...stats, money: stats.money - cost },
      companyUpgrades: { ...companyUpgrades, [upgradeId]: currentLevel + 1 },
    });
  },

  postWeibo: (templateId: string) => {
    const { dailyPostUsed, stats, artist, activeTags, weiboTrends, weiboPostHistory, currentDay } = get();
    if (dailyPostUsed || !artist) return;

    const template = weiboPostTemplates.find(t => t.id === templateId);
    if (!template) return;

    const result = resolveWeiboPost(template, stats, artist.id, artist.name);

    // Apply stat changes through engine (artist modifiers apply)
    const newStats = applyStatChangesEngine(stats, result.statChanges, artist.id);

    // Inject trend at #1, re-rank others
    const updatedTrends = [
      result.trendEntry,
      ...weiboTrends.map(t => ({ ...t, rank: t.rank + 1 })),
    ];

    const newTags = [...activeTags];
    if (!result.isBackfire && template.unlockTag) {
      newTags.push(template.unlockTag);
    }

    set({
      stats: newStats,
      dailyPostUsed: true,
      weiboPostHistory: [...weiboPostHistory, {
        templateId,
        day: currentDay,
        wasBackfire: result.isBackfire,
      }],
      weiboTrends: updatedTrends,
      lastPostNarration: result.narration,
      lastPostStatChanges: result.statChanges,
      showPostResult: true,
      activeTags: newTags,
      peakRisk: Math.max(get().peakRisk, newStats.prRisk),
    });

    runAchievementCheck(get, set);
  },

  dismissPostResult: () => {
    set({ showPostResult: false });
  },

  dismissDayBanner: () => {
    set({ showDayBanner: false });
  },

  resetGame: () => {
    set({
      gamePhase: 'not_started',
      currentDay: 0,
      artist: null,
      stats: { commercialValue: 0, fanLoyalty: 0, prRisk: 0, money: 0 },
      activeTab: 'messages',
      messages: [],
      activeMessageId: null,
      currentEvents: [],
      currentEventIndex: 0,
      lastOutcomeNarration: '',
      lastStatChanges: null,
      pendingTwist: null,
      pendingFollowUpEventIds: [],
      decisionHistory: [],
      activeTags: [],
      eventUsageMap: {},
      ending: null,
      peakRisk: 0,
      pendingAchievement: null,
      artistSchedule: null,
      companyUpgrades: { pr_team: 0, data_analysis: 0, network: 0, legal: 0 },
      weiboTrends: [],
      fanComments: [],
      showDayBanner: false,
      dailyPostUsed: false,
      weiboPostHistory: [],
      lastPostNarration: '',
      lastPostStatChanges: null,
      showPostResult: false,
    });
  },

  dismissAchievement: () => {
    set({ pendingAchievement: null });
  },

  loadCollection: () => {
    set({
      unlockedEndings: loadUnlockedEndings(),
      unlockedAchievements: loadUnlockedAchievements(),
    });
  },
}));
