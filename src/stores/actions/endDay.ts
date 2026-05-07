// endDay action — extracted from gameStore because it was 230+ lines inline.
// 这个函数负责：结算艺人行程 → 被动效果 → 医美 tick → 竞争对手 →
// 检查死局结局 → 推进日期 → 生成次日事件 / 微博 / 评论 →
// 心理 & 塌房预警 → 保险年费 → 大粉冷落衰减 → 一次性 set 新状态。
//
// 约定：所有中间计算都基于 snapshot（get() 一次读完），最后一次 set() 写回，
// 避免中间状态被 UI 观察到。这里故意不用 immer，保持和原实现相同的语义。

import type { GameStore } from '../types';
import type { GameEvent, LedgerEntry, WeiboTrend } from '@/types/game';
import { checkDayEnd } from '@/engine/gameEngine';
import { applyDailyPassiveEffects, applyStatChanges } from '@/engine/outcomeCalculator';
import { applyStatChanges as applyStatChangesEngine } from '@/engine/outcomeCalculator';
import { createMessages } from '@/engine/messageFactory';
import { GAME_CONFIG } from '@/data/constants';
import { saveUnlockedEnding } from '@/lib/storage';
import { generateWeiboTrends, generateFanComments } from '@/engine/socialGenerator';
import { selectRivalAction, resolveRivalAction } from '@/engine/rivalEngine';
import { tickCosmeticState, getAppearanceMultiplier } from '@/engine/cosmeticEngine';
import {
  calculateCollapseWarning,
  applyFansiteNeglectDecay,
  applyDailyMentalEffects,
} from '@/engine/systems';
import { appendLedger, generateEventsForDay, MAX_CARRYOVER_MESSAGES } from '../helpers';

type Getter = () => GameStore;
type Setter = (partial: Partial<GameStore>) => void;

export function createEndDayAction(get: Getter, set: Setter): () => boolean {
  return () => {
    const {
      messages, currentDay, stats, activeTags, peakRisk, artist,
      eventUsageMap, pendingFollowUpEventIds,
      artistSchedule, companyUpgrades, rival, cosmeticState,
      mentalState, insurancePolicies, fansites, lowMoodStreak,
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
        // Schedule completes — apply with the same颜值倍率/僵脸 modifiers used by event choices
        const scheduleAppMultiplier = getAppearanceMultiplier(cosmeticState.appearance);
        newStats = applyStatChanges(
          newStats,
          artistSchedule.activity.statChanges,
          artist?.id,
          scheduleAppMultiplier,
          cosmeticState.stiffFaceActive,
        );
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
    const newCosmeticState = tickCosmeticState(cosmeticState);
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
    let rivalTrend: WeiboTrend | null = null;
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
    const dayEndEnding = checkDayEnd(currentDay, newStats, newActiveTags, newPeakRisk, mentalState);
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

    // 4.5 新系统每日更新：心理状态（需要先于事件生成，以便心理阈值被动事件可用）
    const mentalResult = applyDailyMentalEffects(mentalState, newSchedule);
    const newMentalState = mentalResult.newState;
    // 低落连击计数：mood<20 连续天数（用于触发失眠微博）
    const newLowMoodStreak = newMentalState.mood < 20 ? lowMoodStreak + 1 : 0;

    // 5. Generate new events for next day
    const { events, newUsageMap } = generateEventsForDay(
      nextDay, newStats, eventUsageMap, newActiveTags, artist?.id, pendingFollowUpEventIds,
      { mental: newMentalState, lowMoodStreak: newLowMoodStreak },
    );

    const newMessages = createMessages(events, nextDay);

    // Separate phone call events (max 1 per day as fullscreen ring, from day 3+).
    // Any additional phone-call events that happen to be generated on the same
    // day fall back into the regular message list so they aren't silently dropped.
    let phoneCall: GameEvent | null = null;
    let filteredMessages = newMessages;
    if (nextDay >= 3) {
      const phoneCallMsgs = newMessages.filter(m => m.event.isPhoneCall);
      if (phoneCallMsgs.length > 0) {
        phoneCall = phoneCallMsgs[0].event;
        // Remove ONLY the one that's going to ring; keep the rest as inbox items
        filteredMessages = newMessages.filter(m => m.id !== phoneCallMsgs[0].id);
      }
    }

    // Carry over unresolved non-urgent messages (max 2)
    const carryOver = messages
      .filter(m => m.status !== 'resolved' && !m.isUrgent)
      .slice(0, MAX_CARRYOVER_MESSAGES);

    // 6. Regenerate social feed
    let trends = generateWeiboTrends(newStats, artist!);
    const comments = generateFanComments(newStats, artist!);

    // Inject rival trend if any
    if (rivalTrend) {
      trends = [{ ...rivalTrend, rank: 1 }, ...trends.map(t => ({ ...t, rank: t.rank + 1 }))];
    }

    // 6.5 新系统每日更新：塌房预警（心理状态已在步骤4.5提前计算）
    const { warning: newCollapseWarning, indicators: newRiskIndicators } =
      calculateCollapseWarning(newStats, newMentalState, nextDay);

    // 6.6 保险年费扣款（每20天续费一次，用购买日判断）
    let newInsurancePolicies = insurancePolicies;
    let insurancePremiumLedger: LedgerEntry | null = null;
    let lapsedPolicyNames: string[] = [];
    if (insurancePolicies.length > 0) {
      let totalPremium = 0;
      const dueRenewals: { id: string; premium: number; name: string }[] = [];
      for (const p of insurancePolicies) {
        if (!p.isActive) continue;
        const daysSincePurchase = nextDay - p.purchasedDay;
        if (daysSincePurchase > 0 && daysSincePurchase % 20 === 0) {
          totalPremium += p.annualPremium;
          dueRenewals.push({ id: p.id, premium: p.annualPremium, name: p.name });
        }
      }
      if (totalPremium > 0) {
        if (newStats.money >= totalPremium) {
          newStats = { ...newStats, money: newStats.money - totalPremium };
          insurancePremiumLedger = { label: '保险年费续费', amount: -totalPremium, category: 'upgrade' };
        } else {
          // Insufficient funds → lapse the policies due for renewal
          const dueIds = new Set(dueRenewals.map(r => r.id));
          newInsurancePolicies = insurancePolicies.map(p =>
            dueIds.has(p.id) ? { ...p, isActive: false } : p,
          );
          lapsedPolicyNames = dueRenewals.map(r => r.name);
        }
      }
    }

    // 6.7 大粉日结：冷落衰减 + 全局影响 + 周边分成
    const fansiteResult = applyFansiteNeglectDecay(fansites, nextDay);
    const { newFansites: decayedFansites, alerts: neglectAlerts, statDelta: fansiteStatDelta, merchIncome: fansiteMerchIncome } = fansiteResult;
    if (fansiteStatDelta.fanLoyalty || fansiteStatDelta.prRisk || fansiteStatDelta.commercialValue || fansiteStatDelta.money) {
      newStats = applyStatChangesEngine(newStats, {
        fanLoyalty: fansiteStatDelta.fanLoyalty,
        prRisk: fansiteStatDelta.prRisk,
        commercialValue: fansiteStatDelta.commercialValue,
        money: fansiteStatDelta.money,
      }, artist?.id);
    }
    let fansiteMerchLedger: LedgerEntry | null = null;
    if (fansiteMerchIncome > 0) {
      fansiteMerchLedger = { label: '大粉带动周边销售', amount: fansiteMerchIncome, category: 'daily' };
    }

    // Build the fresh daily ledger atomically so it lands in the same set()
    // as the rest of the day-transition state. Any entries with amount=0 are
    // dropped by appendLedger.
    const dailyCostEntry: LedgerEntry = {
      label: '日常运营开支',
      amount: GAME_CONFIG.DAILY_MONEY_COST,
      category: 'daily',
    };
    const loyaltyBonusEntry: LedgerEntry | null =
      stats.fanLoyalty > GAME_CONFIG.HIGH_LOYALTY_THRESHOLD
        ? { label: '粉丝周边收入（高忠诚）', amount: 4000, category: 'daily' }
        : stats.fanLoyalty >= 60
          ? { label: '粉丝周边收入', amount: 2000, category: 'daily' }
          : null;
    const commercialBonusEntry: LedgerEntry | null =
      stats.commercialValue >= 80
        ? { label: '商务尾单分成（顶流）', amount: 6000, category: 'daily' }
        : stats.commercialValue >= 60
          ? { label: '商务尾单分成', amount: 3500, category: 'daily' }
          : stats.commercialValue >= 40
            ? { label: '商务尾单分成（基础）', amount: 1500, category: 'daily' }
            : null;
    const freshLedger = appendLedger(
      [],
      dailyCostEntry,
      loyaltyBonusEntry,
      commercialBonusEntry,
      scheduleLedgerEntry,
      rivalLedgerEntry,
      insurancePremiumLedger,
      fansiteMerchLedger,
    );

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
      lastMentalEffect: null,
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
      dailyLedger: freshLedger,
      mentalState: newMentalState,
      lowMoodStreak: newLowMoodStreak,
      collapseWarning: newCollapseWarning,
      riskIndicators: newRiskIndicators,
      insurancePolicies: newInsurancePolicies,
      fansites: decayedFansites,
      fansiteInteractionsUsed: 0,
    });

    if (neglectAlerts.length > 0 && process.env.NODE_ENV !== 'production') {
      // Surface in dev console; UI shows degraded state via fansite list itself.
      console.warn('[fansite neglect]', neglectAlerts);
    }
    if (lapsedPolicyNames.length > 0 && process.env.NODE_ENV !== 'production') {
      console.warn('[insurance lapsed — insufficient funds]', lapsedPolicyNames);
    }

    return true;
  };
}
