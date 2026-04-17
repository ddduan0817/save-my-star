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
  initialStats: GameStats;
  specialTrait: string;
  backstory: string;
}

// ===== Events =====
export type EventCategory = 'crisis' | 'business' | 'pr' | 'drama' | 'random';
export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface StatChange {
  commercialValue?: number;
  fanLoyalty?: number;
  prRisk?: number;
  money?: number;
}

export interface EventOutcome {
  narration: string;
  statChanges: StatChange;
  followUpEventId?: string;
  unlockTag?: string;
  specialEffect?: 'trending' | 'viral' | 'scandal_leak' | 'fan_war';
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
    maxPrRisk?: number;
    minPrRisk?: number;
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

export type GamePhase = 'not_started' | 'playing' | 'showing_outcome' | 'day_transition' | 'ended';
