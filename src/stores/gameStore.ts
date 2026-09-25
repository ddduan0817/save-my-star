// gameStore —— 主入口。
// 拆分策略：
//   - 类型定义:   ./types.ts
//   - 初始状态:   ./initialState.ts
//   - 共享 helper: ./helpers.ts
//   - 大 action:  ./actions/endDay.ts (其他中小 action 保留在本文件，避免过度拆分)
// 消费方始终只 import useGameStore，内部怎么拆都不影响。

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
import { rollSeasonalModifiers } from '@/data/seasonalModifiers';
import { generateDailyBriefing } from '@/engine/briefingGenerator';
import { awardChoiceXp, checkLevelUp, getLevelFromXp } from '@/engine/managerProgression';
import type { GameStore } from './types';
import { makeFreshGameState } from './initialState';
import { addLedger, runAchievementCheck, generateEventsForDay } from './helpers';
import { createEndDayAction } from './actions/endDay';

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ===== 初始状态（从 initialState 展开，Create 和 resetGame 共用） =====
      ...makeFreshGameState(),

  // ===== Actions =====
  startGame: (artistId: ArtistArchetype) => {
    const artist = artists.find(a => a.id === artistId)!;
    saveArtistUsed(artistId);
    // 引导「看过」是跨局标记，开新局时保留，不因 makeFreshGameState 被重置
    const tutorialSeen = get().tutorialSeen;

    const day = 1;
    const stats = { ...artist.initialStats };
    const eventUsageMap: Record<string, number> = {};
    const activeTags: string[] = [];
    const modifiers = rollSeasonalModifiers();

    const { events, newUsageMap } = generateEventsForDay(
      day, stats, eventUsageMap, activeTags, artistId, undefined, undefined, modifiers,
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
      tutorialSeen,
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
      // 大环境 modifier
      seasonalModifiers: modifiers,
      showSeasonalIntro: modifiers.length > 0,
      dailyBriefing: generateDailyBriefing({
        day,
        stats,
        artist,
        modifiers,
        mentalState: initialMentalState,
        firstDay: true,
      }),
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
    const { currentEvents, currentEventIndex, stats, artist, currentDay, activeTags, peakRisk, messages, activeMessageId, cosmeticState, mentalState, seasonalModifiers, managerXp } = get();
    const event = currentEvents[currentEventIndex];

    // Enforce选项门槛 — silently ignore when requirements aren't met. UI should
    // disable the button, but we still guard here so data edits can't bypass it.
    if (choice.requireMinMoney !== undefined && stats.money < choice.requireMinMoney) return;
    if (choice.requireMinFanLoyalty !== undefined && stats.fanLoyalty < choice.requireMinFanLoyalty) return;
    if (choice.requireMaxPrRisk !== undefined && stats.prRisk > choice.requireMaxPrRisk) return;

    const appMultiplier = getAppearanceMultiplier(cosmeticState.appearance);
    const result = resolveChoice(event, choice, stats, artist!.id, currentDay, activeTags, peakRisk, appMultiplier, cosmeticState.stiffFaceActive, mentalState, seasonalModifiers);

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

    const prRiskIncrease = result.newStats.prRisk - stats.prRisk;
    let newManagerStress = get().managerStress;
    if (prRiskIncrease > 0) {
      newManagerStress = Math.min(100, newManagerStress + Math.floor(prRiskIncrease / 2));
    }

    // Mark message as resolved
    const updatedMessages = messages.map(m =>
      m.id === activeMessageId ? { ...m, status: 'resolved' as const } : m
    );

    // 计算经纪人 XP（判定 urgent 和 arc finale）
    const msg = messages.find(m => m.id === activeMessageId);
    const wasUrgent = msg?.isUrgent ?? false;
    const wasArcFinale = event.id.startsWith('arc_') && event.id.endsWith('_step2');
    const xpAward = awardChoiceXp({
      severity: event.severity,
      statChanges: result.statChanges,
      prevStats: stats,
      nextStats: result.newStats,
      wasUrgent,
      wasArcFinale,
    });
    const newManagerXp = Math.max(0, managerXp + xpAward.xpDelta);
    const levelUp = checkLevelUp(managerXp, newManagerXp);
    const newManagerLevel = getLevelFromXp(newManagerXp).lv;
    // 升到某些关键等级时注入 activeTag，用作事件门槛
    if (levelUp.leveledUp && newManagerLevel >= 4 && !newTags.includes('manager_lv4')) {
      newTags.push('manager_lv4');
    }

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
        managerXp: newManagerXp,
        managerLevel: newManagerLevel,
        managerStress: newManagerStress,
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
      managerXp: newManagerXp,
      managerLevel: newManagerLevel,
      managerStress: newManagerStress,
      pendingLevelUp: levelUp.leveledUp && levelUp.newLevel
        ? {
            lv: levelUp.newLevel.lv,
            title: levelUp.newLevel.title,
            emoji: levelUp.newLevel.emoji,
            perk: levelUp.newLevel.perk,
          }
        : get().pendingLevelUp,
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

      const prRiskIncrease = twistStats.prRisk - stats.prRisk;
      let newManagerStress = get().managerStress;
      if (prRiskIncrease > 0) {
        newManagerStress = Math.min(100, newManagerStress + Math.floor(prRiskIncrease / 2));
      }

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
        managerStress: newManagerStress,
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
    const { dailyPostUsed, stats, artist, activeTags, weiboTrends, weiboPostHistory, currentDay, burnerIdentity } = get();
    if (dailyPostUsed || !artist) return;

    const template = weiboPostTemplates.find(t => t.id === templateId);
    if (!template) return;

    const result = resolveWeiboPost(template, stats, artist.id, artist.name);

    let finalStatChanges = result.statChanges;
    let finalNarration = result.narration;
    let leaked = false;

    // 小号泄露：用经纪人小号发了"替艺人发博"的模板 → 有 75% 概率被扒是小号
    if (burnerIdentity === 'self') {
      leaked = Math.random() < 0.75;
      if (leaked) {
        finalStatChanges = {
          ...finalStatChanges,
          prRisk: (finalStatChanges.prRisk ?? 0) + 30,
          fanLoyalty: (finalStatChanges.fanLoyalty ?? 0) - 25,
          commercialValue: (finalStatChanges.commercialValue ?? 0) - 8,
        };
        finalNarration = `你手滑用了自己的小号发了这条本该艺人本人说的话。粉丝很快扒到你俩发博 IP 一致、常互动、连语气都对得上——"经纪人小号"实锤，「${artist.name}人设是团队操控」上热搜。`;
      } else {
        // 没被扒 = 私域小号没人看得到，零代价，只留悬念叙述
        finalStatChanges = { ...finalStatChanges };
        finalNarration = `这条从你的小号发出去了。粉丝数寥寥，评论区一片安静，这一次没人发现。但你知道，下一次不一定还有这种运气。`;
      }
    }

    const newStats = applyStatChanges(stats, finalStatChanges, artist.id);

    const isPrivateBurnerPost = burnerIdentity === 'self' && !leaked;

    const updatedTrends = leaked
      ? [
          {
            rank: 1,
            title: `${artist.name} 疑似经纪人操控人设`,
            heat: `${Math.floor(Math.random() * 300) + 250}万`,
            isHot: true,
            sentiment: 'negative' as const,
          },
          ...weiboTrends.map(t => ({ ...t, rank: t.rank + 1 })).slice(0, 9),
        ]
      : isPrivateBurnerPost
        ? weiboTrends
        : [
            result.trendEntry,
            ...weiboTrends.map(t => ({ ...t, rank: t.rank + 1 })),
          ];

    const newTags = [...activeTags];
    if (!result.isBackfire && !leaked && !isPrivateBurnerPost && template.unlockTag) {
      newTags.push(template.unlockTag);
    }
    if (leaked && !newTags.includes('burner_exposed')) {
      newTags.push('burner_exposed');
    }

    const rawContent = template.postContent ?? template.successNarration;
    const contentFilled = rawContent.replace(/\{name\}/g, artist.name);

    set({
      stats: newStats,
      dailyPostUsed: true,
      weiboPostHistory: isPrivateBurnerPost
        ? weiboPostHistory
        : [...weiboPostHistory, {
            templateId,
            day: currentDay,
            wasBackfire: result.isBackfire || leaked,
          }],
      burnerFeed: isPrivateBurnerPost
        ? [
            {
              id: `bp_${Date.now()}`,
              action: 'weibo_template',
              time: '刚刚',
              content: contentFilled,
              likes: Math.floor(Math.random() * 15) + 3,
              comments: Math.floor(Math.random() * 5),
              reposts: Math.floor(Math.random() * 3),
              backfired: false,
            },
            ...get().burnerFeed,
          ]
        : get().burnerFeed,
      weiboTrends: updatedTrends,
      lastPostNarration: finalNarration,
      lastPostStatChanges: finalStatChanges,
      showPostResult: true,
      activeTags: newTags,
      peakRisk: Math.max(get().peakRisk, newStats.prRisk),
    });

    if (finalStatChanges.money) {
      addLedger(get, set, { label: `发微博：${template.title}`, amount: finalStatChanges.money, category: 'weibo' });
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
    // 这两个是跨局档案，属于 loadCollection 的领域。tutorialSeen 同为跨局标记，保留。
    const { unlockedEndings, unlockedAchievements, tutorialSeen } = get();
    // 先清「进行中存档」，再 set —— set 会把 tutorialSeen 等重新持久化，
    // 顺序反了会把刚保留的标记又擦掉。
    useGameStore.persist.clearStorage();
    set({ ...makeFreshGameState(), unlockedEndings, unlockedAchievements, tutorialSeen });
  },

  dismissRivalAction: () => {
    set({ showRivalAction: false });
  },

  dismissAchievement: () => {
    set({ pendingAchievement: null });
  },

  dismissSeasonalIntro: () => {
    set({ showSeasonalIntro: false });
  },

  dismissLevelUp: () => {
    set({ pendingLevelUp: null });
  },

  dismissTutorial: () => {
    set({ tutorialSeen: true });
  },

  consumeVoyeur: () => {
    const { dailyVoyeurCount } = get();
    if (dailyVoyeurCount >= GAME_CONFIG.VOYEUR_DAILY_LIMIT) return false;
    set({ dailyVoyeurCount: dailyVoyeurCount + 1 });
    return true;
  },

  smearRival: () => {
    const state = get();
    if (state.dailyBurnerActionUsed) return { ok: false, reason: '今日已操作过小号' };
    if (state.mentalState.energy < 15) return { ok: false, reason: '艺人精力不足（需 15）' };
    const rival = state.rival;
    const rivalName = rival?.name ?? '对家';
    // 黑对家：小号和大号都能操作；15% 随机翻车
    const backfire = Math.random() < 0.15;
    const templates = [
      `笑死，${rivalName}那新剧的评分是靠水军刷的吧，我朋友在业内的都在传😅`,
      `有一说一${rivalName}这营销做得跟屎一样，还敢出来蹦跶`,
      `路透${rivalName}现场态度也太差了，工作人员都在吐槽`,
    ];
    const content = templates[Math.floor(Math.random() * templates.length)];
    const newMental = applyMentalEffect(state.mentalState, { energy: -15 });
    const newRival: typeof rival = rival && !backfire
      ? { ...rival, stats: { ...rival.stats, prRisk: Math.min(100, rival.stats.prRisk + 10) } }
      : rival;
    const post = {
      id: `burner_${Date.now()}`,
      action: 'smear_rival' as const,
      time: `第 ${state.currentDay} 天`,
      content,
      likes: Math.floor(Math.random() * 400) + 60,
      comments: Math.floor(Math.random() * 200) + 20,
      reposts: Math.floor(Math.random() * 80) + 5,
      backfired: backfire,
    };
    set({
      mentalState: newMental,
      rival: newRival,
      stats: backfire
        ? {
            ...state.stats,
            prRisk: Math.min(100, state.stats.prRisk + 18),
            fanLoyalty: Math.max(0, state.stats.fanLoyalty - 10),
          }
        : { ...state.stats, prRisk: Math.max(0, state.stats.prRisk - 3) },
      managerStress: Math.min(100, state.managerStress + (backfire ? 15 : 5)),
      burnerFeed: [post, ...state.burnerFeed],
      dailyBurnerActionUsed: true,
    });
    return { ok: true, backfire };
  },

  reverseAttack: () => {
    const state = get();
    if (state.dailyBurnerActionUsed) return { ok: false, reason: '今日已操作过小号' };
    if (state.mentalState.energy < 15) return { ok: false, reason: '艺人精力不足（需 15）' };
    const artistName = state.artist?.name ?? 'TA';
    // 反串黑：小号和大号都能操作；15% 随机翻车
    const backfire = Math.random() < 0.15;
    const templates = backfire
      ? [
          `被扒了……我小号被抓包挂在热搜了，社死`,
          `完蛋，反串黑翻车被姐妹们发现了，人设崩了`,
        ]
      : [
          `看到黑热搜好难过，${artistName} 明明这么努力……姐妹们撑住`,
          `又开始骂 ${artistName} 了，能不能给点空间啊，追星好累`,
          `${artistName} 到底做错什么了要被这样对待，心疼`,
        ];
    const content = templates[Math.floor(Math.random() * templates.length)];
    const newMental = applyMentalEffect(state.mentalState, { energy: -15 });
    let newStats = { ...state.stats };
    let stress = state.managerStress + 8;
    if (backfire) {
      newStats = {
        ...newStats,
        prRisk: Math.min(100, newStats.prRisk + 20),
        fanLoyalty: Math.max(0, newStats.fanLoyalty - 15),
      };
      stress += 15;
    } else {
      newStats = {
        ...newStats,
        fanLoyalty: Math.min(100, newStats.fanLoyalty + 5),
      };
    }
    const post = {
      id: `burner_${Date.now()}`,
      action: 'reverse_attack' as const,
      time: `第 ${state.currentDay} 天`,
      content,
      likes: Math.floor(Math.random() * 500) + 80,
      comments: Math.floor(Math.random() * 300) + 30,
      reposts: Math.floor(Math.random() * 120) + 10,
      backfired: backfire,
    };
    set({
      mentalState: newMental,
      stats: newStats,
      managerStress: Math.min(100, stress),
      burnerFeed: [post, ...state.burnerFeed],
      dailyBurnerActionUsed: true,
    });
    return { ok: true, backfire };
  },

  switchBurnerIdentity: (id) => {
    set({ burnerIdentity: id });
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
    }),
    {
      name: 'celebrity-sim-active-game', // localStorage key（区别于跨局档案 celebrity-sim-endings）
      storage: createJSONStorage(() => localStorage),
      version: 1, // 存档结构变更时 +1，配 migrate 做向后兼容
      skipHydration: true, // 由页面在 client 端手动 rehydrate，规避静态导出的时序陷阱
      // 只持久化「对局数据」，排除纯瞬态 UI 弹窗开关，
      // 否则刷新后弹窗状态会卡住 / 重复弹。actions（函数）会被 JSON 自动忽略。
      partialize: (s) => {
        const {
          showDayBanner,
          showPostResult,
          showRivalAction,
          showCosmeticResult,
          showPhoneCall,
          showSeasonalIntro,
          pendingAchievement,
          pendingLevelUp,
          ...rest
        } = s;
        return rest;
      },
    },
  ),
);
