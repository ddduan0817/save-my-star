// ===== Core Stats =====
export interface GameStats {
  commercialValue: number;  // 商业价值 0-100
  fanLoyalty: number;       // 粉丝忠诚度 0-100
  prRisk: number;           // 舆论风险 0-100 (high = bad)
  money: number;            // 资金 (actual yuan amount)
}

// ===== Artist =====
export type ArtistArchetype = 'idol' | 'actor' | 'singer' | 'influencer';

export interface Artist {
  id: ArtistArchetype;
  name: string;
  title: string;
  description: string;
  avatar: string;
  gender: 'male' | 'female';
  initialStats: GameStats;
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
    minCommercial?: number;
    maxCommercial?: number;
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
  | 'fan_favorite';

export interface Ending {
  id: EndingId;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  color: string;
  conditions: (stats: GameStats, tags: string[], day: number, peakRisk: number) => boolean;
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

export type GamePhase = 'not_started' | 'playing' | 'showing_outcome' | 'showing_twist' | 'day_transition' | 'ended';
