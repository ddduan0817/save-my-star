// ===== Core Stats =====
export interface GameStats {
  commercialValue: number;  // 商业价值 0-100
  fanLoyalty: number;       // 粉丝忠诚度 0-100
  prRisk: number;           // 舆论风险 0-100 (high = bad)
  money: number;            // 资金 (actual yuan amount)
}

// ===== Artist =====
export type ArtistArchetype = 'idol' | 'actor' | 'singer' | 'influencer' | 'socialite';

export interface Artist {
  id: ArtistArchetype;
  name: string;
  title: string;
  description: string;
  avatar: string;
  gender: 'male' | 'female';
  initialStats: GameStats;
  initialAppearance: number;
  specialTrait: string;
  backstory: string;
}

// ===== Events =====
export type EventCategory = 'crisis' | 'business' | 'pr' | 'drama' | 'random' | 'breaking';
export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface StatChange {
  commercialValue?: number;
  fanLoyalty?: number;
  prRisk?: number;
  money?: number;
}

// 根据当前数值走不同剧情分支
export interface ConditionalOutcome {
  condition: {
    minFanLoyalty?: number;
    maxFanLoyalty?: number;
    minPrRisk?: number;
    maxPrRisk?: number;
    minCommercialValue?: number;
    maxCommercialValue?: number;
    minMoney?: number;
    maxMoney?: number;
  };
  narration: string;
  statChanges: StatChange;
  unlockTag?: string;
}

// "但是！"反转
export interface Twist {
  chance: number; // 0-1 触发概率
  narration: string;
  statChanges: StatChange;
  unlockTag?: string;
  // 反转可以独立影响心理状态（在原 outcome.mentalEffect 之上叠加施加）
  mentalEffect?: {
    mood?: number;
    energy?: number;
    trust?: number;
    cooperation?: number;
    stress?: number;
    burnout?: number;
  };
}

export interface EventOutcome {
  narration: string;
  statChanges: StatChange;
  followUpEventId?: string;
  unlockTag?: string;
  specialEffect?: 'trending' | 'viral' | 'scandal_leak' | 'fan_war';
  // 动态结局：根据数值走不同分支（优先级高于默认 narration）
  conditionalOutcomes?: ConditionalOutcome[];
  // 反转：选完之后有概率触发意外
  twist?: Twist;
  // 心理状态影响（选完之后施加到 ArtistMentalState 上）
  mentalEffect?: {
    mood?: number;
    energy?: number;
    trust?: number;
    cooperation?: number;
    stress?: number;
    burnout?: number;
  };
}

export interface EventChoice {
  id: string;
  text: string;
  subtext?: string;
  emoji?: string;
  outcome: EventOutcome;
  requireMinMoney?: number;
  requireMinFanLoyalty?: number;
  requireMaxPrRisk?: number;
}

export interface GameEvent {
  id: string;
  category: EventCategory;
  severity: EventSeverity;
  title: string;
  description: string;
  emoji: string;
  choices: EventChoice[];
  minDay?: number;
  maxDay?: number;
  requiredTags?: string[];
  excludeTags?: string[];
  statConditions?: {
    minCommercialValue?: number;
    maxCommercialValue?: number;
    minFanLoyalty?: number;
    maxFanLoyalty?: number;
    maxPrRisk?: number;
    minPrRisk?: number;
    minMoney?: number;
    maxMoney?: number;
  };
  // 突发事件标记：会用不同的UI表现
  isBreaking?: boolean;
  // 限时选择（秒），0=不限时
  timeLimit?: number;
  // 艺人专属事件
  forArtist?: ArtistArchetype | ArtistArchetype[];
  // 后续事件ID（事件链）
  followUpEventId?: string;
  // 紧急来电事件：以全屏来电界面弹出
  isPhoneCall?: boolean;
  phoneCallMeta?: {
    callerName: string;          // 来电者名称
    callerAvatar: string;        // 来电者头像 emoji
    ringDescription: string;     // 来电提示文字
    hangUpOutcome: EventOutcome; // 挂断后果
  };
}

// ===== Endings =====
export type EndingId =
  | 'top_star'
  | 'steady_star'
  | 'comeback'
  | 'fallen'
  | 'cancelled'
  | 'retired'
  | 'transformed'
  | 'scandal_king'
  | 'money_god'
  | 'fan_favorite'
  | 'retirement_declaration'
  | 'manager_breakup'
  | 'true_friends';

export interface Ending {
  id: EndingId;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  color: string;
  conditions: (
    stats: GameStats,
    tags: string[],
    day: number,
    peakRisk: number,
    mental?: { mood: number; energy: number; trust: number; cooperation: number; stress: number; burnout: number },
  ) => boolean;
  priority: number;
}

// ===== Game State =====
export interface DecisionRecord {
  day: number;
  eventId: string;
  eventTitle: string;
  choiceId: string;
  choiceText: string;
  statChanges: StatChange;
}

export type GamePhase = 'not_started' | 'playing' | 'processing_message' | 'showing_outcome' | 'showing_twist' | 'ended';

// ===== Tab System =====
export type TabId = 'messages' | 'artist' | 'workspace' | 'me';

// ===== Message System =====
export type MessageStatus = 'unread' | 'read' | 'resolved';

export interface GameMessage {
  id: string;
  event: GameEvent;
  status: MessageStatus;
  isUrgent: boolean;
  dayReceived: number;
}

// ===== Schedule System =====
export type ScheduleActivityId = 'filming' | 'variety' | 'endorsement' | 'rest' | 'training';

export interface ScheduleActivity {
  id: ScheduleActivityId;
  name: string;
  emoji: string;
  description: string;
  durationDays: number;
  statChanges: StatChange;
}

export interface ActiveSchedule {
  activity: ScheduleActivity;
  startedDay: number;
  remainingDays: number;
}

// ===== Company Upgrades =====
export type UpgradeId = 'pr_team' | 'data_analysis' | 'network' | 'legal';

export interface CompanyUpgrade {
  id: UpgradeId;
  name: string;
  emoji: string;
  maxLevel: number;
  costs: number[];
  descriptions: string[];
}

// ===== Social Feed =====
export interface WeiboTrend {
  rank: number;
  title: string;
  heat: string;
  isHot: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface FanComment {
  id: string;
  avatar: string;
  nickname: string;
  content: string;
  likes: number;
  sentiment: 'supportive' | 'angry' | 'hate' | 'neutral';
}

// ===== Weibo Posting System =====
export interface WeiboPostTemplate {
  id: string;
  title: string;
  emoji: string;
  description: string;
  baseEffects: StatChange;
  backfireConditions?: {
    minPrRisk?: number;
    maxFanLoyalty?: number;
    maxCommercialValue?: number;
    forArtist?: ArtistArchetype;
  };
  backfireEffects?: StatChange;
  backfireNarration?: string;
  successNarration: string;
  trendTitle: string; // 用 {name} 占位
  unlockTag?: string;
}

export interface WeiboPostRecord {
  templateId: string;
  day: number;
  wasBackfire: boolean;
}

// ===== Story Chain Tracker =====
export interface StoryChainDefinition {
  id: string;
  title: string;
  emoji: string;
  description: string;
  totalSteps: number;
  eventIds: string[];     // 该链所有可能的事件 ID
  triggerEventId: string; // 触发链的第一个事件 ID
}

// ===== Rival Manager System =====
export type RivalFameLevel = 'low' | 'medium' | 'high' | 'top';

export interface RivalState {
  artistId: ArtistArchetype;
  name: string;
  avatar: string;
  title: string;
  backstory: string;
  fameLevel: RivalFameLevel;
  aggression: number; // 0-100
  stats: {
    commercialValue: number;
    fanLoyalty: number;
    prRisk: number;
    appearance: number;
  };
  actionsLog: RivalActionRecord[];
}

export interface RivalActionRecord {
  day: number;
  actionId: string;
  title: string;
  affectedYou: boolean;
}

export type RivalActionType = 'attack' | 'neutral' | 'cooperation' | 'self_destruct';

export interface RivalAction {
  id: string;
  title: string;
  emoji: string;
  description: string;
  type: RivalActionType;
  playerEffects?: StatChange;
  rivalFameChange: number; // -1, 0, +1
  minFameLevel?: RivalFameLevel;
  minDay?: number;
  minAggression?: number;
  generatesTrend: boolean;
  trendTitle?: string; // {rivalName} / {playerName} 占位
}

// ===== Cosmetic / Appearance System =====
export type CosmeticProcedureId =
  | 'skincare_facial'
  | 'micro_injection'
  | 'nose_filler'
  | 'jaw_botox'
  | 'double_eyelid'
  | 'nose_job'
  | 'facial_contour';

export type CosmeticCategory = 'light' | 'medium' | 'major';
export type AppearanceTier = 'plain' | 'fresh' | 'refined' | 'star' | 'top';

export interface CosmeticProcedure {
  id: CosmeticProcedureId;
  name: string;
  emoji: string;
  category: CosmeticCategory;
  description: string;
  cost: number;
  appearanceGain: number;
  failChance: number;        // 0-1
  discoveryChance: number;   // 0-1
  recoveryDays: number;      // 0=无恢复期, >0=占用行程槽
  failAppearanceLoss: number;
}

export interface CosmeticRecord {
  procedureId: CosmeticProcedureId;
  day: number;
  succeeded: boolean;
  wasDiscovered: boolean;
}

export interface CosmeticState {
  appearance: number;             // 0-100
  procedureHistory: CosmeticRecord[];
  stiffFaceActive: boolean;
  stiffFaceDaysRemaining: number;
  recoveryDaysRemaining: number;
}

// ===== Daily Ledger (收支明细) =====
export type LedgerCategory = 'event' | 'schedule' | 'cosmetic' | 'upgrade' | 'weibo' | 'daily' | 'rival' | 'phone';

export interface LedgerEntry {
  label: string;         // e.g. "品牌代言争议 → 诚恳道歉"
  amount: number;        // positive = income, negative = expense
  category: LedgerCategory;
}
