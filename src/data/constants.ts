export const GAME_CONFIG = {
  MAX_DAYS: 20,
  EVENTS_PER_DAY: { min: 1, max: 3 },

  // Daily passive effects
  DAILY_RISK_DECAY: -2,
  HIGH_RISK_COMMERCIAL_DRAIN: -3,
  DAILY_MONEY_COST: -5000,

  // Stat thresholds
  CANCELLATION_THRESHOLD: 95,
  BANKRUPTCY_DAYS: 3,

  // Difficulty scaling
  EARLY_GAME: [1, 3] as const,
  MID_GAME: [4, 10] as const,
  LATE_GAME: [11, 17] as const,
  ENDGAME: [18, 20] as const,

  // Event weights by stat state
  CRISIS_WEIGHT_HIGH_RISK: 3.0,
  BUSINESS_WEIGHT_LOW_MONEY: 2.0,
  PR_WEIGHT_LOW_LOYALTY: 2.0,

  // Fan loyalty protection
  HIGH_LOYALTY_RISK_REDUCTION: 0.5,
  HIGH_LOYALTY_THRESHOLD: 80,
  HIGH_RISK_THRESHOLD: 80,
} as const;

/**
 * Thresholds and counts used by socialGenerator.ts to decide which weibo
 * trends / comment flavors to surface. Centralized here so game designers
 * can tune without touching engine code.
 */
export const SOCIAL_CONFIG = {
  // PR risk levels that trigger scandal trends
  SCANDAL_TREND_RISK_THRESHOLD: 60,
  SCANDAL_TREND_HIGH_RISK_THRESHOLD: 80,
  SCANDAL_TREND_COUNT_NORMAL: 2,
  SCANDAL_TREND_COUNT_HIGH: 3,

  // Low-money financial scandal trigger
  LOW_MONEY_TREND_THRESHOLD: 50_000,

  // Fan loyalty thresholds
  LOW_LOYALTY_TREND_THRESHOLD: 25,
  POSITIVE_TREND_MIN_LOYALTY: 50,
  POSITIVE_TREND_HIGH_LOYALTY: 70,
  POSITIVE_TREND_COUNT_NORMAL: 1,
  POSITIVE_TREND_COUNT_HIGH: 2,

  // Commercial value thresholds for business trends
  BUSINESS_TREND_MIN_COMMERCIAL: 50,
  BUSINESS_TREND_HIGH_COMMERCIAL: 75,
  BUSINESS_TREND_COUNT_NORMAL: 1,
  BUSINESS_TREND_COUNT_HIGH: 2,

  // Target total number of trends to show (randomized in [min, max))
  TARGET_TREND_COUNT_MIN: 7,
  TARGET_TREND_COUNT_RANDOM_RANGE: 3, // yields 7, 8, or 9
  TARGET_TREND_COUNT_MIN_FILL: 2,
} as const;

export const CATEGORY_EMOJI: Record<string, string> = {
  crisis: '🚨',
  business: '💰',
  pr: '💬',
  drama: '🎭',
  random: '🎲',
};

export const CATEGORY_LABEL: Record<string, string> = {
  crisis: '塌房危机',
  business: '商务机会',
  pr: '公关管理',
  drama: '行业Drama',
  random: '随机事件',
  breaking: '突发快讯',
};

export const STAT_LABELS = {
  commercialValue: '商业价值',
  fanLoyalty: '粉丝忠诚',
  prRisk: '舆论风险',
  money: '资金',
} as const;
