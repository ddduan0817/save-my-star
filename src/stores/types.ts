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

export interface GameState {
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

  // ===== 新系统状态 =====
  mentalState: ArtistMentalState;
  fansites: FansiteMaster[];
  collapseWarning: CollapseWarning;
  riskIndicators: RiskIndicator[];
  insurancePolicies: InsurancePolicy[];
  /** 当日已用的大粉互动次数 */
  fansiteInteractionsUsed: number;
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
}

export type GameStore = GameState & GameActions;
