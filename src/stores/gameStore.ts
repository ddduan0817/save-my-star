// gameStore —— 主入口。
// 拆分策略：
//   - 类型定义:   ./types.ts
//   - 初始状态:   ./initialState.ts
//   - 共享 helper: ./helpers.ts
//   - 大 action:  ./actions/endDay.ts (其他中小 action 保留在本文件，避免过度拆分)
// 消费方始终只 import useGameStore，内部怎么拆都不影响。

import { create } from 'zustand';
import type {
  ArtistArchetype,
  EventChoice,
  TabId,
  ScheduleActivityId,
  UpgradeId,
  CosmeticProcedureId,
  CosmeticState,
  DecisionRecord,
  StatChange,
} from '@/types/game';
import { artists } from '@/data/artists';
import { resolveChoice } from '@/engine/gameEngine';
import { applyStatChanges } from '@/engine/outcomeCalculator';
import { loadUnlockedEndings, saveUnlockedEnding } from '@/lib/storage';
import { createMessages } from '@/engine/messageFactory';
import { scheduleActivities } from '@/data/schedules';
import { GAME_CONFIG } from '@/data/constants';
import { companyUpgradesData } from '@/data/upgrades';
import { generateWeiboTrends, generateFanComments } from '@/engine/socialGenerator';
import { weiboPostTemplates } from '@/data/weiboPosts';
import { resolveWeiboPost } from '@/engine/weiboPostEngine';
import { initializeRival } from '@/engine/rivalEngine';
import { cosmeticProcedures } from '@/data/cosmetics';
import { resolveProcedure, getAppearanceMultiplier } from '@/engine/cosmeticEngine';
import { loadUnlockedAchievements, saveArtistUsed } from '@/data/achievements';
import type { FansiteInteraction, InsuranceType } from '@/types/new_systems';
import {
  initialMentalState,
  initialCollapseWarning,
  initialRiskIndicators,
  interactWithFansite as interactWithFansiteImpl,
  consoleFansiteByArtist,
  DAILY_FANSITE_INTERACTION_QUOTA,
  CONSOLE_TRUST_COST,
  purchaseInsurance as purchaseInsuranceImpl,
  cancelInsurance as cancelInsuranceImpl,
  applyMentalEffect,
} from '@/engine/systems';
import { getFansitesForArtist } from '@/data/fansites';
import type { GameStore } from './types';
import { makeFreshGameState } from './initialState';
import { addLedger, runAchievementCheck, generateEventsForDay } from './helpers';
import { createEndDayAction } from './actions/endDay';

export const useGameStore = create<GameStore>((set, get) => ({
  // ===== 初始状态（从 initialState 展开，Create 和 resetGame 共用） =====
  ...makeFreshGameState(),

  // ===== Actions =====
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
    const trends = generateWeiboTrends(stats, artist);
    const comments = generateFanComments(stats, artist);
    const rival = initializeRival(artistId);
    const cosmeticState: CosmeticState = {
      appearance: artist.initialAppearance,
      procedureHistory: [],
      stiffFaceActive: false,
      stiffFaceDaysRemaining: 0,
      recoveryDaysRemaining: 0,
    };

    // 先把 freshGameState 铺一遍，再覆盖这局的入局字段，保证未显式设置的
    // 字段（比如 pendingTwist / showCosmeticResult）也被重置。
    set({
      ...makeFreshGameState(),
      gamePhase: 'playing',
      currentDay: day,
      artist,
      stats,
      messages,
      eventUsageMap: newUsageMap,
      peakRisk: artist.initialStats.prRisk,
      weiboTrends: trends,
      fanComments: comments,
      showDayBanner: true,
      rival,
      cosmeticState,
      // 新系统：保留首日 mental state / collapse warning 的默认值，
      // 只替换艺人专属的 fansites
      mentalState: initialMentalState,
      fansites: getFansitesForArtist(artistId),
      collapseWarning: initialCollapseWarning,
      riskIndicators: initialRiskIndicators,
    });

    // Day 1 daily operating cost
    addLedger(get, set, { label: '日常运营开支', amount: GAME_CONFIG.DAILY_MONEY_COST, category: 'daily' });
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
    const { currentEvents, currentEventIndex, stats, artist, currentDay, activeTags, peakRisk, messages, activeMessageId, cosmeticState, mentalState } = get();
    const event = currentEvents[currentEventIndex];

    // Enforce选项门槛 — silently ignore when requirements aren't met. UI should
    // disable the button, but we still guard here so data edits can't bypass it.
    if (choice.requireMinMoney !== undefined && stats.money < choice.requireMinMoney) return;
    if (choice.requireMinFanLoyalty !== undefined && stats.fanLoyalty < choice.requireMinFanLoyalty) return;
    if (choice.requireMaxPrRisk !== undefined && stats.prRisk > choice.requireMaxPrRisk) return;

    const appMultiplier = getAppearanceMultiplier(cosmeticState.appearance);
    const result = resolveChoice(event, choice, stats, artist!.id, currentDay, activeTags, peakRisk, appMultiplier, cosmeticState.stiffFaceActive, mentalState);

    const newTags = [...activeTags];
    if (result.unlockTag) newTags.push(result.unlockTag);

    // 应用心理状态效果
    const newMentalState = choice.outcome.mentalEffect
      ? applyMentalEffect(mentalState, choice.outcome.mentalEffect)
      : mentalState;

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
        lastMentalEffect: choice.outcome.mentalEffect ?? null,
        pendingTwist: null,
        gamePhase: 'ended',
        ending: result.ending,
        activeTags: newTags,
        decisionHistory: [...get().decisionHistory, record],
        peakRisk: newPeakRisk,
        unlockedEndings: unlocked,
        messages: updatedMessages,
        mentalState: newMentalState,
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
      lastMentalEffect: choice.outcome.mentalEffect ?? null,
      pendingTwist: result.twist ?? null,
      pendingFollowUpEventIds: result.followUpEventId
        ? [...get().pendingFollowUpEventIds, result.followUpEventId]
        : get().pendingFollowUpEventIds,
      gamePhase: 'showing_outcome',
      activeTags: newTags,
      decisionHistory: [...get().decisionHistory, record],
      peakRisk: newPeakRisk,
      messages: updatedMessages,
      mentalState: newMentalState,
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
      const { stats, artist, activeTags, mentalState } = get();
      const twistStats = applyStatChanges(stats, pendingTwist.statChanges, artist?.id);
      const newTags = [...activeTags];
      if (pendingTwist.unlockTag) newTags.push(pendingTwist.unlockTag);

      // 反转如果带 mentalEffect，在原选项已施加的心理状态之上再叠加一层
      const newMentalState = pendingTwist.mentalEffect
        ? applyMentalEffect(mentalState, pendingTwist.mentalEffect)
        : mentalState;

      set({
        gamePhase: 'showing_twist',
        stats: twistStats,
        lastOutcomeNarration: pendingTwist.narration,
        lastStatChanges: pendingTwist.statChanges,
        lastMentalEffect: pendingTwist.mentalEffect ?? null,
        pendingTwist: null,
        activeTags: newTags,
        peakRisk: Math.max(get().peakRisk, twistStats.prRisk),
        mentalState: newMentalState,
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
      lastMentalEffect: null,
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
      lastMentalEffect: null,
      currentEvents: [],
      currentEventIndex: 0,
    });
  },

  endDay: createEndDayAction(get, set),

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
    const newStats = applyStatChanges(stats, result.statChanges, artist.id);

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
    const newStats = applyStatChanges(
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
    const { pendingPhoneCall, stats, artist, activeTags, peakRisk, currentDay, decisionHistory, messages } = get();
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

    // Inject a resolved message so the call still appears in 消息 history
    const msg = createMessages([pendingPhoneCall], currentDay)[0];
    const updatedMessages = [{ ...msg, status: 'resolved' as const }, ...messages];

    set({
      showPhoneCall: false,
      pendingPhoneCall: null,
      stats: newStats,
      activeTags: newTags,
      lastOutcomeNarration: hangUpOutcome.narration,
      lastStatChanges: hangUpOutcome.statChanges,
      gamePhase: 'showing_outcome',
      // Populate currentEvents so MessagesTab renders the outcome view
      currentEvents: [pendingPhoneCall],
      currentEventIndex: 0,
      messages: updatedMessages,
      activeMessageId: msg.id,
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
    // 回到完全未开始的状态；保留 unlockedEndings / unlockedAchievements 不动，
    // 这两个是跨局档案，属于 loadCollection 的领域。
    const { unlockedEndings, unlockedAchievements } = get();
    set({ ...makeFreshGameState(), unlockedEndings, unlockedAchievements });
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

  // ===== 新系统 Actions =====
  interactWithFansite: (fansiteId: string, interaction: FansiteInteraction) => {
    const { fansites, stats, artist, currentDay, fansiteInteractionsUsed } = get();
    const fansite = fansites.find(f => f.id === fansiteId);
    if (!fansite || !artist) {
      return { narration: '', cost: 0, loyaltyDelta: 0, attitudeChanged: false };
    }

    // 每日额度
    if (fansiteInteractionsUsed >= DAILY_FANSITE_INTERACTION_QUOTA) {
      return {
        narration: `今天的精力用完了（${DAILY_FANSITE_INTERACTION_QUOTA}/${DAILY_FANSITE_INTERACTION_QUOTA}），明天再来吧`,
        cost: 0,
        loyaltyDelta: 0,
        attitudeChanged: false,
        blocked: 'quota_exceeded' as const,
      };
    }

    // 资金不足
    if (interaction.cost && stats.money < interaction.cost) {
      return {
        narration: `资金不足，差 ¥${(interaction.cost - stats.money).toLocaleString()}`,
        cost: 0,
        loyaltyDelta: 0,
        attitudeChanged: false,
        blocked: 'no_money' as const,
      };
    }

    const result = interactWithFansiteImpl(fansites, fansiteId, interaction, currentDay);
    const moneyChange = -result.cost;
    const statChanges: StatChange = moneyChange ? { money: moneyChange } : {};
    const newStats = moneyChange ? applyStatChanges(stats, statChanges, artist.id) : stats;

    const updated = result.newFansites.find(f => f.id === fansiteId);
    const loyaltyDelta = (updated?.loyalty ?? fansite.loyalty) - fansite.loyalty;
    const attitudeChanged = (updated?.attitude ?? fansite.attitude) !== fansite.attitude;

    set({
      fansites: result.newFansites,
      stats: newStats,
      lastOutcomeNarration: result.narration,
      lastStatChanges: moneyChange ? statChanges : null,
      fansiteInteractionsUsed: fansiteInteractionsUsed + 1,
    });

    if (moneyChange) {
      addLedger(get, set, {
        label: `大粉互动：${fansite.name}`,
        amount: moneyChange,
        category: 'event',
      });
    }

    return {
      narration: result.narration,
      cost: result.cost,
      loyaltyDelta,
      attitudeChanged,
    };
  },

  consoleFansite: (fansiteId: string) => {
    const { fansites, mentalState, currentDay } = get();
    if (mentalState.trust < CONSOLE_TRUST_COST) {
      return { success: false, message: `艺人信任度不足 ${CONSOLE_TRUST_COST}，TA 现在不愿意为你出面` };
    }
    const result = consoleFansiteByArtist(fansites, fansiteId, currentDay);
    if (!result.success) return { success: false, message: result.message };

    const newMental = applyMentalEffect(mentalState, { trust: -CONSOLE_TRUST_COST });
    set({
      fansites: result.newFansites,
      mentalState: newMental,
      lastOutcomeNarration: result.message,
    });
    return { success: true, message: result.message };
  },

  purchaseInsurance: (policyId: InsuranceType) => {
    const { insurancePolicies, stats, currentDay } = get();
    const result = purchaseInsuranceImpl(insurancePolicies, policyId, stats.money, currentDay);
    if (!result.success) {
      return { success: false, message: result.message };
    }
    set({
      insurancePolicies: result.newPolicies,
      stats: { ...stats, money: stats.money - result.cost },
    });
    addLedger(get, set, {
      label: `购买保险`,
      amount: -result.cost,
      category: 'upgrade',
    });
    return { success: true, message: result.message };
  },

  cancelInsurance: (policyId: InsuranceType) => {
    const { insurancePolicies, stats } = get();
    const result = cancelInsuranceImpl(insurancePolicies, policyId);
    if (result.refund > 0) {
      set({
        insurancePolicies: result.newPolicies,
        stats: { ...stats, money: stats.money + result.refund },
      });
      addLedger(get, set, {
        label: `退保`,
        amount: result.refund,
        category: 'upgrade',
      });
    }
    return { refund: result.refund, message: result.message };
  },
}));
