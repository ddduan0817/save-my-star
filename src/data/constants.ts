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
