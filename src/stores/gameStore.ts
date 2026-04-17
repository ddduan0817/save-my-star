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
  RivalState,
  CosmeticState,
  CosmeticProcedureId,
  LedgerEntry,
} from '@/types/game';
import { artists } from '@/data/artists';
import { startNewDay, resolveChoice, checkDayEnd } from '@/engine/gameEngine';
import { applyDailyPassiveEffects, applyStatChanges } from '@/engine/outcomeCalculator';
import { loadUnlockedEndings, saveUnlockedEnding } from '@/lib/storage';
import { breakingEvents } from '@/data/events/breaking';
import { findEventById } from '@/engine/eventSelector';
import { createMessages } from '@/engine/messageFactory';
import { scheduleActivities } from '@/data/schedules';
import { GAME_CONFIG } from '@/data/constants';
import { companyUpgradesData } from '@/data/upgrades';
import { generateWeiboTrends, generateFanComments } from '@/engine/socialGenerator';
import { weiboPostTemplates } from '@/data/weiboPosts';
import { resolveWeiboPost } from '@/engine/weiboPostEngine';
import { initializeRival, selectRivalAction, resolveRivalAction } from '@/engine/rivalEngine';
import { applyStatChanges as applyStatChangesEngine } from '@/engine/outcomeCalculator';
import { cosmeticProcedures } from '@/data/cosmetics';
import { resolveProcedure, tickCosmeticState, getAppearanceMultiplier } from '@/engine/cosmeticEngine';
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

  // Rival manager system
  rival: RivalState | null;
  rivalActionNarration: string;
  showRivalAction: boolean;

  // Cosmetic / Appearance system
  cosmeticState: CosmeticState;
  lastCosmeticNarration: string;
  lastCosmeticStatChanges: StatChange | null;
  showCosmeticResult: boolean;

  // Phone call system
  pendingPhoneCall: GameEvent | null;
  showPhoneCall: boolean;

  // Daily ledger (收支明细)
  dailyLedger: LedgerEntry[];

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
  dismissRivalAction: () => void;
  performProcedure: (procedureId: CosmeticProcedureId) => void;
  dismissCosmeticResult: () => void;
  answerPhoneCall: () => void;
  hangUpPhoneCall: () => void;
  dismissAchievement: () => void;
  dismissDayBanner: () => void;
  resetGame: () => void;
  loadCollection: () => void;
}

// 突发事件触发概率 (每天 25%)
const BREAKING_CHANCE = 0.25;
const MAX_CARRYOVER_MESSAGES = 2;

// 收支明细 helper
function addLedger(get: () => GameStore, set: (partial: Partial<GameStore>) => void, entry: LedgerEntry) {
  if (entry.amount === 0) return;
  set({ dailyLedger: [...get().dailyLedger, entry] });
}

// 成就检查 helper
function runAchievementCheck(get: () => GameStore, set: (partial: Partial<GameStore>) => void) {
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

  rival: null,
  rivalActionNarration: '',
  showRivalAction: false,

  cosmeticState: {
    appearance: 50,
    procedureHistory: [],
    stiffFaceActive: false,
    stiffFaceDaysRemaining: 0,
    recoveryDaysRemaining: 0,
  },
  lastCosmeticNarration: '',
  lastCosmeticStatChanges: null,
  showCosmeticResult: false,

  pendingPhoneCall: null,
  showPhoneCall: false,
  dailyLedger: [],

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
    const rival = initializeRival(artistId);
    const cosmeticState: CosmeticState = {
      appearance: artist.initialAppearance,
      procedureHistory: [],
      stiffFaceActive: false,
      stiffFaceDaysRemaining: 0,
      recoveryDaysRemaining: 0,
    };

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
      rival,
      rivalActionNarration: '',
      showRivalAction: false,
      cosmeticState,
      lastCosmeticNarration: '',
      lastCosmeticStatChanges: null,
      showCosmeticResult: false,
      pendingPhoneCall: null,
      showPhoneCall: false,
      dailyLedger: [],
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
    const { currentEvents, currentEventIndex, stats, artist, currentDay, activeTags, peakRisk, messages, activeMessageId, cosmeticState } = get();
    const event = currentEvents[currentEventIndex];

    const appMultiplier = getAppearanceMultiplier(cosmeticState.appearance);
    const result = resolveChoice(event, choice, stats, artist!.id, currentDay, activeTags, peakRisk, appMultiplier, cosmeticState.stiffFaceActive);

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
      if (result.statChanges.money) {
        addLedger(get, set, { label: `${event.title} → ${choice.text}`, amount: result.statChanges.money, category: 'event' });
      }
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

    // Ledger: event choice money
    if (result.statChanges.money) {
      addLedger(get, set, { label: `${event.title} → ${choice.text}`, amount: result.statChanges.money, category: 'event' });
    }

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
      if (pendingTwist.statChanges.money) {
        addLedger(get, set, { label: '反转！', amount: pendingTwist.statChanges.money, category: 'event' });
      }
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
      artistSchedule, companyUpgrades, rival, cosmeticState,
    } = get();

    // Block if urgent messages unresolved (except on final day — force ending)
    const hasUnresolvedUrgent = messages.some(m => m.isUrgent && m.status !== 'resolved');
    if (hasUnresolvedUrgent && currentDay < GAME_CONFIG.MAX_DAYS) return false;

    let newStats = { ...stats };

    // 1. Resolve artist schedule
    let newSchedule = artistSchedule;
    let scheduleLedgerEntry: LedgerEntry | null = null;
    if (artistSchedule) {
      if (artistSchedule.remainingDays <= 1) {
        // Schedule completes
        newStats = applyStatChanges(newStats, artistSchedule.activity.statChanges, artist?.id);
        if (artistSchedule.activity.statChanges.money) {
          scheduleLedgerEntry = { label: `${artistSchedule.activity.name}完成`, amount: artistSchedule.activity.statChanges.money, category: 'schedule' };
        }
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

    // 2.1 Tick cosmetic state (recovery & stiff face countdown)
    let newCosmeticState = tickCosmeticState(cosmeticState);
    // Manage stiff_face_active tag
    let newActiveTags = [...activeTags];
    if (newCosmeticState.stiffFaceActive && !newActiveTags.includes('stiff_face_active')) {
      newActiveTags.push('stiff_face_active');
    } else if (!newCosmeticState.stiffFaceActive) {
      newActiveTags = newActiveTags.filter(t => t !== 'stiff_face_active');
    }

    // 2.5 Rival daily action
    let newRival = rival;
    let rivalNarration = '';
    let rivalTrend: import('@/types/game').WeiboTrend | null = null;
    let rivalLedgerEntry: LedgerEntry | null = null;
    if (rival && artist) {
      const rivalAction = selectRivalAction(rival, currentDay, newStats);
      if (rivalAction) {
        const result = resolveRivalAction(rivalAction, rival, artist, currentDay);
        if (result.playerStatChanges) {
          newStats = applyStatChangesEngine(newStats, result.playerStatChanges, artist.id);
          if (result.playerStatChanges.money) {
            rivalLedgerEntry = { label: `竞争对手：${rivalAction.title}`, amount: result.playerStatChanges.money, category: 'rival' };
          }
        }
        newRival = result.newRivalState;
        rivalNarration = result.narration;
        rivalTrend = result.trend;
      }
    }

    // 3. Check for endings
    const newPeakRisk = Math.max(peakRisk, newStats.prRisk);
    const dayEndEnding = checkDayEnd(currentDay, newStats, newActiveTags, newPeakRisk);
    if (dayEndEnding) {
      const unlocked = saveUnlockedEnding(dayEndEnding.id);
      set({
        ending: dayEndEnding,
        gamePhase: 'ended',
        stats: newStats,
        unlockedEndings: unlocked,
        peakRisk: newPeakRisk,
        artistSchedule: newSchedule,
        cosmeticState: newCosmeticState,
        activeTags: newActiveTags,
      });
      return true;
    }

    // 4. Advance day
    const nextDay = currentDay + 1;

    // 5. Generate new events for next day
    const { events, newUsageMap } = generateEventsForDay(
      nextDay, newStats, eventUsageMap, newActiveTags, artist?.id, pendingFollowUpEventIds
    );

    const newMessages = createMessages(events, nextDay);

    // Separate phone call events (max 1 per day, from day 3+)
    let phoneCall: GameEvent | null = null;
    let filteredMessages = newMessages;
    if (nextDay >= 3) {
      const phoneCallMsg = newMessages.find(m => m.event.isPhoneCall);
      if (phoneCallMsg) {
        phoneCall = phoneCallMsg.event;
        filteredMessages = newMessages.filter(m => m.id !== phoneCallMsg.id);
      }
    }

    // Carry over unresolved non-urgent messages (max 2)
    const carryOver = messages
      .filter(m => m.status !== 'resolved' && !m.isUrgent)
      .slice(0, MAX_CARRYOVER_MESSAGES);

    // 6. Regenerate social feed
    let trends = generateWeiboTrends(newStats, artist!, decisionHistory, newActiveTags);
    const comments = generateFanComments(newStats, artist!);

    // Inject rival trend if any
    if (rivalTrend) {
      trends = [{ ...rivalTrend, rank: 1 }, ...trends.map(t => ({ ...t, rank: t.rank + 1 }))];
    }

    set({
      currentDay: nextDay,
      stats: newStats,
      messages: [...carryOver, ...filteredMessages],
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
      showDayBanner: !phoneCall, // don't show day banner if phone call is pending (will show after call ends)
      dailyPostUsed: false,
      showPostResult: false,
      rival: newRival,
      rivalActionNarration: rivalNarration,
      showRivalAction: !!rivalNarration,
      cosmeticState: newCosmeticState,
      activeTags: newActiveTags,
      pendingPhoneCall: phoneCall,
      showPhoneCall: !!phoneCall,
      dailyLedger: [], // reset ledger for new day
    });

    // Ledger: daily operating costs
    addLedger(get, set, { label: '日常运营开支', amount: GAME_CONFIG.DAILY_MONEY_COST, category: 'daily' });
    // Ledger: fan loyalty bonus
    if (stats.fanLoyalty > GAME_CONFIG.HIGH_LOYALTY_THRESHOLD) {
      addLedger(get, set, { label: '粉丝周边收入', amount: 3000, category: 'daily' });
    }
    // Ledger: schedule completion
    if (scheduleLedgerEntry) {
      addLedger(get, set, scheduleLedgerEntry);
    }
    // Ledger: rival action
    if (rivalLedgerEntry) {
      addLedger(get, set, rivalLedgerEntry);
    }

    return true;
  },

  setArtistSchedule: (activityId: ScheduleActivityId) => {
    const { artistSchedule, currentDay, cosmeticState } = get();
    // Can't change schedule while one is in progress or during cosmetic recovery
    if (artistSchedule && artistSchedule.remainingDays > 0) return;
    if (cosmeticState.recoveryDaysRemaining > 0) return;

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

    addLedger(get, set, { label: `升级：${upgradeData.name} Lv${currentLevel + 1}`, amount: -cost, category: 'upgrade' });
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

    if (result.statChanges.money) {
      addLedger(get, set, { label: `发微博：${template.title}`, amount: result.statChanges.money, category: 'weibo' });
    }

    runAchievementCheck(get, set);
  },

  dismissPostResult: () => {
    set({ showPostResult: false });
  },

  performProcedure: (procedureId: CosmeticProcedureId) => {
    const { cosmeticState, stats, artist, currentDay, activeTags } = get();
    if (!artist) return;

    // Can't do procedures during recovery
    if (cosmeticState.recoveryDaysRemaining > 0) return;

    const procedure = cosmeticProcedures.find(p => p.id === procedureId);
    if (!procedure) return;

    // Check money
    if (stats.money < procedure.cost) return;

    // Deduct cost
    const afterCost = { ...stats, money: stats.money - procedure.cost };

    // Resolve procedure
    const result = resolveProcedure(procedure, cosmeticState, currentDay);

    // Apply stat changes from procedure through engine
    const appearanceMultiplier = getAppearanceMultiplier(result.newCosmeticState.appearance);
    const newStats = applyStatChangesEngine(
      afterCost,
      result.statChanges,
      artist.id,
      appearanceMultiplier,
      result.newCosmeticState.stiffFaceActive,
    );

    // Manage tags
    const newTags = [...activeTags];
    if (result.wasDiscovered && !newTags.includes('cosmetic_discovered')) {
      newTags.push('cosmetic_discovered');
    }
    if (result.newCosmeticState.stiffFaceActive && !newTags.includes('stiff_face_active')) {
      newTags.push('stiff_face_active');
    }

    set({
      cosmeticState: result.newCosmeticState,
      stats: newStats,
      activeTags: newTags,
      lastCosmeticNarration: result.narration,
      lastCosmeticStatChanges: { ...result.statChanges, money: -(procedure.cost + Math.abs(result.statChanges.money ?? 0)) },
      showCosmeticResult: true,
      peakRisk: Math.max(get().peakRisk, newStats.prRisk),
    });

    const totalCosmeticCost = procedure.cost + Math.abs(result.statChanges.money ?? 0);
    addLedger(get, set, { label: `医美：${procedure.name}`, amount: -totalCosmeticCost, category: 'cosmetic' });

    runAchievementCheck(get, set);
  },

  dismissCosmeticResult: () => {
    set({ showCosmeticResult: false });
  },

  answerPhoneCall: () => {
    const { pendingPhoneCall, messages, currentDay } = get();
    if (!pendingPhoneCall) return;

    // Inject the phone call event as a message and auto-open it
    const msg = createMessages([pendingPhoneCall], currentDay)[0];
    const updatedMessages = [{ ...msg, status: 'read' as const }, ...messages];

    set({
      showPhoneCall: false,
      pendingPhoneCall: null,
      messages: updatedMessages,
      activeMessageId: msg.id,
      gamePhase: 'processing_message',
      currentEvents: [pendingPhoneCall],
      currentEventIndex: 0,
      showDayBanner: true,
    });
  },

  hangUpPhoneCall: () => {
    const { pendingPhoneCall, stats, artist, activeTags, peakRisk, currentDay, decisionHistory } = get();
    if (!pendingPhoneCall?.phoneCallMeta) return;

    const hangUpOutcome = pendingPhoneCall.phoneCallMeta.hangUpOutcome;
    const newStats = applyStatChanges(stats, hangUpOutcome.statChanges, artist?.id);
    const newTags = hangUpOutcome.unlockTag ? [...activeTags, hangUpOutcome.unlockTag] : [...activeTags];

    const record: DecisionRecord = {
      day: currentDay,
      eventId: pendingPhoneCall.id,
      eventTitle: pendingPhoneCall.title,
      choiceId: 'hang_up',
      choiceText: '挂断电话',
      statChanges: hangUpOutcome.statChanges,
    };

    set({
      showPhoneCall: false,
      pendingPhoneCall: null,
      stats: newStats,
      activeTags: newTags,
      lastOutcomeNarration: hangUpOutcome.narration,
      lastStatChanges: hangUpOutcome.statChanges,
      gamePhase: 'showing_outcome',
      decisionHistory: [...decisionHistory, record],
      peakRisk: Math.max(peakRisk, newStats.prRisk),
      showDayBanner: true,
    });

    if (hangUpOutcome.statChanges.money) {
      addLedger(get, set, { label: `挂断来电：${pendingPhoneCall.title}`, amount: hangUpOutcome.statChanges.money, category: 'phone' });
    }

    runAchievementCheck(get, set);
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
      rival: null,
      rivalActionNarration: '',
      showRivalAction: false,
      cosmeticState: {
        appearance: 50,
        procedureHistory: [],
        stiffFaceActive: false,
        stiffFaceDaysRemaining: 0,
        recoveryDaysRemaining: 0,
      },
      lastCosmeticNarration: '',
      lastCosmeticStatChanges: null,
      showCosmeticResult: false,
      pendingPhoneCall: null,
      showPhoneCall: false,
      dailyLedger: [],
    });
  },

  dismissRivalAction: () => {
    set({ showRivalAction: false });
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
