// gameStore 的类型层：把 state 字段和 actions 方法分开，这样 initialState.ts
// 可以只依赖 GameState，不需要导入 actions 签名。

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
import type { Achievement } from '@/data/achievements';
import type {
  ArtistMentalState,
  FansiteMaster,
  InsurancePolicy,
  CollapseWarning,
  RiskIndicator,
  FansiteInteraction,
  InsuranceType,
} from '@/types/new_systems';
import type { SeasonalModifier } from '@/data/seasonalModifiers';

export interface GameState {
  // Core state
  gamePhase: GamePhase;
  currentDay: number;
  artist: Artist | null;
  stats: GameStats;
  managerStress: number;

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
  /** 最近一次事件选择/反转施加的心理状态变化，用于 Outcome 面板展示 */
  lastMentalEffect: {
    mood?: number;
    energy?: number;
    trust?: number;
    cooperation?: number;
    stress?: number;
    burnout?: number;
  } | null;
  pendingTwist: {
    narration: string;
    statChanges: StatChange;
    unlockTag?: string;
    mentalEffect?: {
      mood?: number;
      energy?: number;
      trust?: number;
      cooperation?: number;
      stress?: number;
      burnout?: number;
    };
  } | null;
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

  // ===== 新系统状态 =====
  mentalState: ArtistMentalState;
  /** 连续 mood<20 的天数，用于失眠微博触发 */
  lowMoodStreak: number;
  fansites: FansiteMaster[];
  collapseWarning: CollapseWarning;
  riskIndicators: RiskIndicator[];
  insurancePolicies: InsurancePolicy[];
  /** 当日已用的大粉互动次数 */
  fansiteInteractionsUsed: number;

  // ===== 开局大环境 modifier =====
  /** 本局随机抽到的娱乐圈大环境卡（1-2 张） */
  seasonalModifiers: SeasonalModifier[];
  /** 开局卡展示 flag —— 让 UI 控制何时弹"本季大环境"弹窗 */
  showSeasonalIntro: boolean;
  /** 每日晨间简报文本（Briefing 系统） */
  dailyBriefing: string | null;

  // ===== 因果回调（Consequence Callback）系统 =====
  /** 已触发过的因果回调事件 id，避免重复 */
  firedCallbackIds: string[];

  // ===== 大粉剧情弧 =====
  /** 每条弧按 fansiteId 记录推进步数 (0=未开始, 1=intro已触发, 2=mid已触发, 3=finale已触发) */
  fansiteArcStep: Record<string, number>;

  // ===== 经纪人成长系统（Manager XP）=====
  /** 累计 XP。事件结算 + 每日结算都会发放。 */
  managerXp: number;
  /** 缓存当前等级（方便 UI 直接读，升级时由 action 覆盖） */
  managerLevel: number;
  /** 最近升级 toast —— 有值时 UI 弹窗，玩家点掉后清空 */
  pendingLevelUp: {
    lv: number;
    title: string;
    emoji: string;
    perk: string;
  } | null;
  /** 最近 3 天每日 XP 净值（用于"状态滑坡"提示），最新在尾部 */
  recentXpDeltas: number[];
  /** 连续 fanLoyalty>60 的天数（用于高忠诚连击 XP） */
  highLoyaltyStreak: number;

  // ===== 新手引导 =====
  /** 是否已看过首次玩法引导（跟随 persist 存储，看过后不再弹） */
  tutorialSeen: boolean;

  // ===== 黑粉小号系统（MVP：仅视奸粉圈信息流）=====
  /** 今日已使用的视奸次数（每日 endDay 重置，上限 VOYEUR_DAILY_LIMIT） */
  dailyVoyeurCount: number;
  /** 玩家用小号发出去的帖子（黑对家 / 反串黑），倒序渲染 */
  burnerFeed: BurnerPost[];
  /** 今日是否已使用小号操作（黑对家 / 反串黑，共享一个每日额度） */
  dailyBurnerActionUsed: boolean;
  /** 当前发博身份：小号 or 艺人大号（大号发黑话会误操作翻车） */
  burnerIdentity: 'self' | 'artist';
}

export interface BurnerPost {
  id: string;
  action: 'smear_rival' | 'reverse_attack' | 'weibo_template';
  time: string;
  content: string;
  likes: number;
  comments: number;
  reposts: number;
  backfired?: boolean;
}

export interface GameActions {
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

  // ===== 新系统 Actions =====
  interactWithFansite: (fansiteId: string, interaction: FansiteInteraction) => {
    narration: string;
    cost: number;
    loyaltyDelta: number;
    attitudeChanged: boolean;
    /** 'quota_exceeded' 时表示当日额度已满，调用方应弹提示 */
    blocked?: 'quota_exceeded' | 'no_money';
  };
  consoleFansite: (fansiteId: string) => { success: boolean; message: string };
  purchaseInsurance: (policyId: InsuranceType) => { success: boolean; message: string };
  cancelInsurance: (policyId: InsuranceType) => { refund: number; message: string };
  loadCollection: () => void;
  dismissSeasonalIntro: () => void;
  dismissLevelUp: () => void;
  /** 标记首次玩法引导已看过 */
  dismissTutorial: () => void;
  /** 消耗当日视奸次数（返回 false 表示今日已用过） */
  consumeVoyeur: () => boolean;
  /** 黑对家：消耗 15 精力，降低对家舆论 */
  smearRival: () => { ok: boolean; reason?: string };
  /** 反串黑自家：消耗 15 精力，15% 概率翻车 */
  reverseAttack: () => { ok: boolean; backfire?: boolean; reason?: string };
  /** 切换发博身份（小号 / 艺人大号） */
  switchBurnerIdentity: (id: 'self' | 'artist') => void;
}

export type GameStore = GameState & GameActions;
