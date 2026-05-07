// gameStore 的初始 state 字面量：供 create() 首次初始化和 resetGame() 共用
// 作用域仅限于"未开始游戏"这个阶段，所以 unlockedEndings / unlockedAchievements
// 这类跨局档案不在这里（由 loadCollection 单独加载）。
//
// 工厂函数而非常量：每次调用都返回新对象/新数组，避免多次 reset 后不同 store
// 实例共享同一个 mutable reference（历史老 bug 避坑）。

import type { GameState } from './types';
import type { CosmeticState } from '@/types/game';
import { initialMentalState, initialCollapseWarning, initialRiskIndicators } from '@/engine/systems';
import { initialFansites } from '@/data/fansites';

export const makeInitialCosmeticState = (): CosmeticState => ({
  appearance: 50,
  procedureHistory: [],
  stiffFaceActive: false,
  stiffFaceDaysRemaining: 0,
  recoveryDaysRemaining: 0,
});

export function makeFreshGameState(): GameState {
  return {
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

    cosmeticState: makeInitialCosmeticState(),
    lastCosmeticNarration: '',
    lastCosmeticStatChanges: null,
    showCosmeticResult: false,

    pendingPhoneCall: null,
    showPhoneCall: false,
    dailyLedger: [],

    // 新系统初始状态
    mentalState: { ...initialMentalState },
    fansites: [...initialFansites],
    collapseWarning: { ...initialCollapseWarning, indicators: [...initialCollapseWarning.indicators] },
    riskIndicators: initialRiskIndicators.map(r => ({ ...r })),
    insurancePolicies: [],
    fansiteInteractionsUsed: 0,
  };
}
