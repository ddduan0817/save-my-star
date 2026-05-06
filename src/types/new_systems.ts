// ===== 艺人心理状态系统 =====

export interface ArtistMentalState {
  mood: number;        // 心情值 0-100 (高=开心，低=抑郁)
  energy: number;      // 能量值 0-100 (高=精力充沛，低=疲劳/倦怠)
  trust: number;       // 信任值 0-100 (对经纪人的信任程度)
  cooperation: number; // 配合度 0-100 (工作配合意愿)
  stress: number;      // 压力值 0-100 (高=濒临崩溃)
  burnout: number;     // 倦怠指数 0-100 (高=想退圈)
}

export interface MentalStateEffect {
  mood?: number;
  energy?: number;
  trust?: number;
  cooperation?: number;
  stress?: number;
  burnout?: number;
}

export type MentalStateLabel = 
  | 'excellent'  // 状态极佳
  | 'good'       // 状态良好
  | 'normal'     // 一般
  | 'tired'      // 疲劳
  | 'stressed'   // 压力大
  | 'depressed'  // 情绪低落
  | 'burnout';   // 濒临崩溃

export function getMentalStateLabel(state: ArtistMentalState): {
  overall: MentalStateLabel;
  moodLabel: string;
  energyLabel: string;
  trustLabel: string;
} {
  // 综合状态判断
  const avg = (state.mood + state.energy + state.cooperation) / 3;
  let overall: MentalStateLabel = 'normal';
  if (avg >= 80) overall = 'excellent';
  else if (avg >= 65) overall = 'good';
  else if (avg >= 45) overall = 'normal';
  else if (avg >= 30) overall = 'tired';
  else if (state.stress > 70) overall = 'stressed';
  else if (state.mood < 25) overall = 'depressed';
  else if (state.burnout > 70) overall = 'burnout';

  // 单项标签
  const moodLabel = state.mood >= 70 ? '开心' : state.mood >= 40 ? '一般' : state.mood >= 20 ? '低落' : '抑郁';
  const energyLabel = state.energy >= 70 ? '精力充沛' : state.energy >= 40 ? '正常' : state.energy >= 20 ? '疲劳' : '透支';
  const trustLabel = state.trust >= 70 ? '完全信任' : state.trust >= 40 ? '基本信任' : state.trust >= 20 ? '有隔阂' : '不信任';

  return { overall, moodLabel, energyLabel, trustLabel };
}

// ===== 塌房预警系统 =====

export type RiskType = 'relationship' | 'tax' | 'speech' | 'behavior' | 'scandal' | 'none';

export interface CollapseWarning {
  level: 'none' | 'low' | 'medium' | 'high' | 'critical';  // 预警等级
  riskType: RiskType;      // 风险类型
  indicators: string[];    // 预警信号列表
  countdown?: number;      // 预计爆发天数（如果有）
}

export interface RiskIndicator {
  id: string;
  name: string;           // 指标名称
  description: string;    // 描述
  value: number;          // 当前值 0-100
  trend: 'up' | 'down' | 'stable';  // 趋势
}

// ===== 站姐经济学系统 =====

export type FansiteAttitude = 'devoted' | 'supportive' | 'neutral' | 'dissatisfied' | 'hostile' | 'betrayed';
export type FansiteResource = 'photos' | 'videos' | 'info' | 'connections' | 'money';

export interface FansiteMaster {
  id: string;
  name: string;           // 站姐ID/名字
  avatar: string;         // 头像emoji
  followers: number;      // 粉丝数
  attitude: FansiteAttitude;  // 对你的态度
  loyalty: number;        // 忠诚度 0-100
  resources: FansiteResource[];  // 掌握的资源
  hasBlackmail: boolean;  // 是否有黑料可勒索
  blackmailValue: number; // 勒索金额
  lastInteraction: number; // 上次互动天数
  specialTrait: string;   // 特殊属性描述
}

export interface FansiteInteraction {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost?: number;
  effect: {
    loyalty?: number;
    attitude?: FansiteAttitude;
    hasBlackmail?: boolean;
  };
}

// ===== 塌房保险系统 =====

export type InsuranceType = 
  | 'relationship'  // 恋情保险
  | 'tax'          // 税务保险
  | 'speech'       // 言论保险
  | 'behavior'     // 行为保险
  | 'comprehensive'; // 综合保险

export interface InsurancePolicy {
  id: InsuranceType;
  name: string;
  emoji: string;
  description: string;
  annualPremium: number;      // 年保费
  coverage: number;           // 赔付比例 0-1
  deductible: number;         // 免赔额
  exclusions: string[];       // 免责条款
  maxPayout: number;          // 最高赔付
  isActive: boolean;
  purchasedDay?: number;      // 购买日期
}

export interface InsuranceClaim {
  policyId: InsuranceType;
  eventId: string;
  claimAmount: number;
  approved: boolean;
  reason?: string;  // 拒赔理由（如果有）
}

// 预定义保险方案
export const INSURANCE_TEMPLATES: Omit<InsurancePolicy, 'isActive' | 'purchasedDay'>[] = [
  {
    id: 'relationship',
    name: '恋情曝光险',
    emoji: '💔',
    description: '恋情相关危机时，损失减少50%',
    annualPremium: 50000,
    coverage: 0.5,
    deductible: 20000,
    exclusions: ['婚前怀孕', '多人运动', '知三当三'],
    maxPayout: 200000,
  },
  {
    id: 'tax',
    name: '税务合规险',
    emoji: '📋',
    description: '税务问题曝光时，提供专业法务团队',
    annualPremium: 80000,
    coverage: 0.7,
    deductible: 50000,
    exclusions: ['故意逃税', '阴阳合同'],
    maxPayout: 500000,
  },
  {
    id: 'speech',
    name: '言论安全险',
    emoji: '💬',
    description: '旧言论翻车时的公关费用报销',
    annualPremium: 30000,
    coverage: 0.6,
    deductible: 10000,
    exclusions: ['涉及政治', '违法犯罪', '种族歧视'],
    maxPayout: 100000,
  },
  {
    id: 'behavior',
    name: '行为规范险',
    emoji: '🎭',
    description: '行为失当（耍大牌、打架等）的危机处理',
    annualPremium: 40000,
    coverage: 0.4,
    deductible: 15000,
    exclusions: ['违法行为', '刑事案件'],
    maxPayout: 150000,
  },
  {
    id: 'comprehensive',
    name: '顶流综合险',
    emoji: '🛡️',
    description: '全方位保障，但免责条款较多',
    annualPremium: 200000,
    coverage: 0.6,
    deductible: 100000,
    exclusions: ['故意自曝', '违反公序良俗', '政治敏感'],
    maxPayout: 1000000,
  },
];
