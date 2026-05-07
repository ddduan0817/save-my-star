// 新系统的纯函数 helper：心理状态 / 塌房预警 / 大粉互动 / 保险
// 这里只放纯函数和初始常量，store 仅引用不拥有。

import type {
  ArtistMentalState, 
  FansiteMaster, 
  InsurancePolicy, 
  CollapseWarning, 
  RiskIndicator,
  FansiteInteraction,
  InsuranceType,
  MentalStateEffect
} from '@/types/new_systems';
import { INSURANCE_TEMPLATES } from '@/types/new_systems';

// ===== 初始状态 =====

export const initialMentalState: ArtistMentalState = {
  mood: 60,        // 心情一般
  energy: 70,      // 精力尚可
  trust: 50,       // 基础信任
  cooperation: 60, // 配合度一般
  stress: 30,      // 轻度压力
  burnout: 20,     // 轻微倦怠
};

export const initialCollapseWarning: CollapseWarning = {
  level: 'none',
  riskType: 'none',
  indicators: [],
};

export const initialRiskIndicators: RiskIndicator[] = [
  { id: 'relationship', name: '恋情风险', description: '恋情曝光的可能性', value: 20, trend: 'stable' },
  { id: 'tax', name: '税务风险', description: '税务问题的隐患', value: 15, trend: 'stable' },
  { id: 'speech', name: '言论风险', description: '旧言论被扒的风险', value: 25, trend: 'stable' },
  { id: 'behavior', name: '行为风险', description: '行为失当的可能性', value: 20, trend: 'stable' },
];

// ===== 心理状态计算 =====

export function calculateMentalStateEffects(
  mentalState: ArtistMentalState
): { statModifiers: Partial<{ commercialValue: number; fanLoyalty: number; prRisk: number }>; description: string } {
  const effects: Partial<{ commercialValue: number; fanLoyalty: number; prRisk: number }> = {};
  const descriptions: string[] = [];

  // 能量影响配合度（间接影响商业价值）
  if (mentalState.energy < 20) {
    effects.commercialValue = (effects.commercialValue || 0) - 2;
    descriptions.push('艺人过度疲劳，工作质量下降');
  }

  // 压力影响舆论风险
  if (mentalState.stress > 70) {
    effects.prRisk = (effects.prRisk || 0) + 3;
    descriptions.push('艺人压力过大，容易出状况');
  }

  // 心情影响粉丝忠诚度
  if (mentalState.mood > 80) {
    effects.fanLoyalty = (effects.fanLoyalty || 0) + 2;
    descriptions.push('艺人状态好，粉丝感受到正能量');
  } else if (mentalState.mood < 20) {
    effects.fanLoyalty = (effects.fanLoyalty || 0) - 2;
    descriptions.push('艺人情绪低落，粉丝担心');
  }

  // 倦怠影响商业价值
  if (mentalState.burnout > 60) {
    effects.commercialValue = (effects.commercialValue || 0) - 3;
    descriptions.push('艺人产生倦怠，工作积极性下降');
  }

  return { statModifiers: effects, description: descriptions.join('；') };
}

// ===== 塌房预警计算 =====

export function calculateCollapseWarning(
  stats: { commercialValue: number; fanLoyalty: number; prRisk: number },
  mentalState: ArtistMentalState,
  day: number
): { warning: CollapseWarning; indicators: RiskIndicator[] } {
  const indicators: RiskIndicator[] = [];
  const warningIndicators: string[] = [];
  let maxRisk: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';
  let riskType: typeof initialCollapseWarning.riskType = 'none';

  // 计算各项风险指标
  const relationshipRisk = Math.min(100, (100 - stats.fanLoyalty) * 0.6 + mentalState.stress * 0.4);
  const taxRisk = stats.commercialValue > 70 ? 30 + Math.random() * 20 : 15; // 高收入艺人税务风险更高
  const speechRisk = day > 10 ? 20 + Math.random() * 30 : 10; // 随着时间推移，旧言论被扒风险增加
  const behaviorRisk = mentalState.stress > 60 ? 40 + mentalState.burnout * 0.3 : 20;

  indicators.push(
    { id: 'relationship', name: '恋情风险', description: '恋情曝光的可能性', value: Math.round(relationshipRisk), trend: relationshipRisk > 30 ? 'up' : 'stable' },
    { id: 'tax', name: '税务风险', description: '税务问题的隐患', value: Math.round(taxRisk), trend: stats.commercialValue > 70 ? 'up' : 'stable' },
    { id: 'speech', name: '言论风险', description: '旧言论被扒的风险', value: Math.round(speechRisk), trend: day > 10 ? 'up' : 'stable' },
    { id: 'behavior', name: '行为风险', description: '行为失当的可能性', value: Math.round(behaviorRisk), trend: mentalState.stress > 60 ? 'up' : 'stable' },
  );

  // 判断最高风险
  const risks = [
    { type: 'relationship' as const, value: relationshipRisk },
    { type: 'tax' as const, value: taxRisk },
    { type: 'speech' as const, value: speechRisk },
    { type: 'behavior' as const, value: behaviorRisk },
  ];

  const highestRisk = risks.reduce((max, r) => r.value > max.value ? r : max);

  if (highestRisk.value > 75) {
    maxRisk = 'critical';
    riskType = highestRisk.type;
    warningIndicators.push(`⚠️ ${getRiskTypeName(highestRisk.type)}极高，建议立即处理`);
  } else if (highestRisk.value > 55) {
    maxRisk = 'high';
    riskType = highestRisk.type;
    warningIndicators.push(`${getRiskTypeName(highestRisk.type)}较高，需要关注`);
  } else if (highestRisk.value > 35) {
    maxRisk = 'medium';
  } else if (highestRisk.value > 20) {
    maxRisk = 'low';
  }

  // 根据心理状态添加额外预警
  if (mentalState.burnout > 70) {
    warningIndicators.push('艺人倦怠指数过高，可能出现突发状况');
  }
  if (mentalState.trust < 30) {
    warningIndicators.push('艺人与经纪人信任度低，沟通可能出现问题');
  }

  return {
    warning: {
      level: maxRisk,
      riskType,
      indicators: warningIndicators,
      countdown: maxRisk === 'critical' ? Math.floor(Math.random() * 3) + 1 : undefined,
    },
    indicators,
  };
}

function getRiskTypeName(type: string): string {
  const names: Record<string, string> = {
    relationship: '恋情风险',
    tax: '税务风险',
    speech: '言论风险',
    behavior: '行为风险',
  };
  return names[type] || type;
}

// ===== 大粉互动处理 =====

/** 每日大粉互动次数上限 */
export const DAILY_FANSITE_INTERACTION_QUOTA = 3;
/** 冷落开始衰减的阈值（天） */
export const NEGLECT_DAYS_THRESHOLD = 4;
/** 冷落每日忠诚度衰减 */
export const NEGLECT_DAILY_DECAY = 2;
/** 安抚消耗艺人信任 */
export const CONSOLE_TRUST_COST = 8;

type Branch = 'crit' | 'normal' | 'backfire';

/** 不同风格的随机区间（命中/普通/翻车） */
const STYLE_BRANCH_WEIGHTS: Record<string, [number, number, number]> = {
  emotional:    [0.20, 0.55, 0.25], // 情绪型最易翻车
  photographer: [0.30, 0.60, 0.10],
  warrior:      [0.25, 0.50, 0.25], // 战斗粉容易嘴瓢
  analyst:      [0.30, 0.65, 0.05],
  data:         [0.30, 0.65, 0.05],
  commerce:     [0.25, 0.60, 0.15],
};

function rollBranch(style: string): Branch {
  const [c, n] = STYLE_BRANCH_WEIGHTS[style] || [0.25, 0.6, 0.15];
  const r = Math.random();
  if (r < c) return 'crit';
  if (r < c + n) return 'normal';
  return 'backfire';
}

const BRANCH_FLAVORS: Record<Branch, string[]> = {
  crit: [
    '反响超出预期，TA 在小群里疯狂安利你的诚意',
    'TA 截图发了超话，大家都说"经纪人有心了"',
    'TA 直接做了一组九宫格表白长图',
  ],
  normal: [
    'TA 收到后给了一个"嗯，知道了"',
    'TA 表示理解，但没什么额外波澜',
    '互动顺利完成',
  ],
  backfire: [
    'TA 觉得你诚意不够，截图发到了小群',
    '没想到 TA 当场破防，脱口一句"敷衍"',
    'TA 委婉拒绝，语气微妙',
  ],
};

export function interactWithFansite(
  fansites: FansiteMaster[],
  fansiteId: string,
  interaction: FansiteInteraction,
  currentDay: number = 0,
): { newFansites: FansiteMaster[]; cost: number; narration: string; branch: Branch } {
  const fansite = fansites.find(f => f.id === fansiteId);
  if (!fansite) return { newFansites: fansites, cost: 0, narration: '', branch: 'normal' };

  const cost = interaction.cost || 0;
  const baseLoyalty = interaction.effect.loyalty || 0;
  const branch = rollBranch(fansite.style);

  // 不同分支的忠诚度倍率
  let loyaltyDelta = baseLoyalty;
  let attitudeOverride = interaction.effect.attitude;
  if (branch === 'crit') {
    loyaltyDelta = Math.round(baseLoyalty >= 0 ? baseLoyalty * 1.6 + 2 : baseLoyalty * 0.6);
    if (baseLoyalty > 0 && !attitudeOverride) attitudeOverride = 'devoted';
  } else if (branch === 'backfire') {
    loyaltyDelta = Math.round(baseLoyalty >= 0 ? baseLoyalty * 0.2 - 4 : baseLoyalty * 1.4);
    if (baseLoyalty > 0) attitudeOverride = undefined;
    if (baseLoyalty < 0) attitudeOverride = 'hostile';
  }

  const newLoyalty = Math.max(0, Math.min(100, fansite.loyalty + loyaltyDelta));
  const newAttitude = attitudeOverride || fansite.attitude;
  const newHasBlackmail = interaction.effect.hasBlackmail !== undefined
    ? interaction.effect.hasBlackmail
    : fansite.hasBlackmail;

  // 基础叙述
  let baseNarration = '';
  switch (interaction.id) {
    case 'invite_backstage':       baseNarration = `你给了${fansite.name}后台拍摄权限`; break;
    case 'pay_exclusive':          baseNarration = `你花了¥${cost.toLocaleString()}买断了${fansite.name}的独家照片`; break;
    case 'official_recognition':   baseNarration = `你给了${fansite.name}官方认证`; break;
    case 'gift_merch':             baseNarration = `你送了${fansite.name}签名周边`; break;
    case 'dinner_meeting':         baseNarration = `你私下请${fansite.name}吃了顿饭`; break;
    case 'ignore':                 baseNarration = `你冷处理了${fansite.name}的请求`; break;
    case 'threaten_legal':         baseNarration = `你对${fansite.name}发了律师函`; break;
    case 'buyout_all':             baseNarration = `你花了¥${cost.toLocaleString()}买断了${fansite.name}所有底片`; break;
    case 'fund_antiblack':         baseNarration = `你给${fansite.name}的反黑组拨了一笔预算`; break;
    case 'commission_longpost':    baseNarration = `你约${fansite.name}写了一篇长图文`; break;
    case 'fund_voting':            baseNarration = `你给${fansite.name}的数据组拨了打投基金`; break;
    case 'brand_collab':           baseNarration = `你把一个品牌合作位分给了${fansite.name}`; break;
    default:                       baseNarration = `你与${fansite.name}进行了互动`;
  }

  const flavor = BRANCH_FLAVORS[branch][Math.floor(Math.random() * BRANCH_FLAVORS[branch].length)];
  const sign = loyaltyDelta > 0 ? '+' : '';
  const narration = `${baseNarration}。${flavor}（忠诚度 ${sign}${loyaltyDelta}）`;

  const newFansites = fansites.map(f =>
    f.id === fansiteId
      ? {
          ...f,
          loyalty: newLoyalty,
          attitude: newAttitude,
          hasBlackmail: newHasBlackmail,
          lastInteraction: currentDay || f.lastInteraction,
        }
      : f
  );

  return { newFansites, cost, narration, branch };
}

/** 冷落衰减 —— 每天结束时调用。返回新的大粉数组和事件描述。 */
export function applyFansiteNeglectDecay(
  fansites: FansiteMaster[],
  nextDay: number,
): { newFansites: FansiteMaster[]; alerts: string[] } {
  const alerts: string[] = [];
  const newFansites = fansites.map(f => {
    if (f.attitude === 'betrayed') return f;
    // 从未互动过：把开始时间锚定到当前天，后续才会算冷落
    if (f.lastInteraction === 0) {
      return { ...f, lastInteraction: nextDay };
    }
    const daysSince = nextDay - f.lastInteraction;
    if (daysSince <= NEGLECT_DAYS_THRESHOLD) return f;

    const decay = (daysSince - NEGLECT_DAYS_THRESHOLD) * NEGLECT_DAILY_DECAY;
    const newLoyalty = Math.max(0, f.loyalty - decay);

    let newAttitude: FansiteMaster['attitude'] = f.attitude;
    if (newLoyalty <= 0) newAttitude = 'betrayed';
    else if (newLoyalty < 15) newAttitude = 'hostile';
    else if (newLoyalty < 30 && f.attitude !== 'hostile') newAttitude = 'dissatisfied';

    if (newAttitude !== f.attitude) {
      alerts.push(
        newAttitude === 'betrayed'
          ? `${f.name} 已脱粉回踩`
          : newAttitude === 'hostile'
            ? `${f.name} 因长期被冷落转为敌对`
            : `${f.name} 开始抱怨被冷落`,
      );
    }

    return { ...f, loyalty: newLoyalty, attitude: newAttitude };
  });
  return { newFansites, alerts };
}

/** 艺人帮你安抚一个被冷落的大粉 —— 消耗信任值，但不占当日互动额度。 */
export function consoleFansiteByArtist(
  fansites: FansiteMaster[],
  fansiteId: string,
  currentDay: number,
): { newFansites: FansiteMaster[]; success: boolean; message: string } {
  const fansite = fansites.find(f => f.id === fansiteId);
  if (!fansite) {
    return { newFansites: fansites, success: false, message: '未找到该大粉' };
  }
  if (fansite.attitude === 'betrayed') {
    return { newFansites: fansites, success: false, message: `${fansite.name} 已脱粉，连艺人都安抚不动了` };
  }

  // 信任度高时艺人可以帮忙打个电话/发个语音回血
  const recovered = 12;
  const newLoyalty = Math.min(100, fansite.loyalty + recovered);
  let newAttitude = fansite.attitude;
  if (fansite.attitude === 'hostile' && newLoyalty >= 25) newAttitude = 'dissatisfied';
  if (fansite.attitude === 'dissatisfied' && newLoyalty >= 50) newAttitude = 'neutral';

  const newFansites = fansites.map(f =>
    f.id === fansiteId
      ? { ...f, loyalty: newLoyalty, attitude: newAttitude, lastInteraction: currentDay }
      : f,
  );

  return {
    newFansites,
    success: true,
    message: `${fansite.name} 收到艺人本人的语音消息后破防了，"哥哥/姐姐都开口了那必须给面子"（忠诚度 +${recovered}）`,
  };
}

// ===== 保险系统 =====

export function purchaseInsurance(
  policies: InsurancePolicy[],
  policyId: InsuranceType,
  money: number,
  day: number
): { success: boolean; newPolicies: InsurancePolicy[]; cost: number; message: string } {
  const template = INSURANCE_TEMPLATES.find(t => t.id === policyId);
  if (!template) {
    return { success: false, newPolicies: policies, cost: 0, message: '保险类型不存在' };
  }

  const existing = policies.find(p => p.id === policyId && p.isActive);
  if (existing) {
    return { success: false, newPolicies: policies, cost: 0, message: '已购买该保险' };
  }

  if (money < template.annualPremium) {
    return { success: false, newPolicies: policies, cost: 0, message: '资金不足' };
  }

  const newPolicy: InsurancePolicy = {
    ...template,
    isActive: true,
    purchasedDay: day,
  };

  return {
    success: true,
    newPolicies: [...policies, newPolicy],
    cost: template.annualPremium,
    message: `成功购买${template.name}，年保费¥${template.annualPremium.toLocaleString()}`,
  };
}

export function cancelInsurance(
  policies: InsurancePolicy[],
  policyId: InsuranceType
): { newPolicies: InsurancePolicy[]; refund: number; message: string } {
  const policy = policies.find(p => p.id === policyId && p.isActive);
  if (!policy) {
    return { newPolicies: policies, refund: 0, message: '未找到该保险' };
  }

  // 退保退还50%保费
  const refund = Math.floor(policy.annualPremium * 0.5);

  return {
    newPolicies: policies.map(p => p.id === policyId ? { ...p, isActive: false } : p),
    refund,
    message: `已退保${policy.name}，退还¥${refund.toLocaleString()}`,
  };
}

export function processInsuranceClaim(
  policies: InsurancePolicy[],
  eventCategory: string,
  lossAmount: number
): { payout: number; messages: string[] } {
  let totalPayout = 0;
  const messages: string[] = [];

  for (const policy of policies.filter(p => p.isActive)) {
    // 检查是否覆盖该事件类型
    const coversEvent = checkInsuranceCoverage(policy.id, eventCategory);
    if (!coversEvent) continue;

    // 计算赔付
    const claimAmount = Math.min(
      Math.max(0, lossAmount - policy.deductible) * policy.coverage,
      policy.maxPayout
    );

    if (claimAmount > 0) {
      totalPayout += claimAmount;
      messages.push(`${policy.name}赔付¥${Math.floor(claimAmount).toLocaleString()}`);
    }
  }

  return { payout: Math.floor(totalPayout), messages };
}

function checkInsuranceCoverage(policyId: InsuranceType, eventCategory: string): boolean {
  const coverageMap: Record<string, string[]> = {
    relationship: ['crisis', 'drama'],
    tax: ['business', 'crisis'],
    speech: ['crisis', 'pr'],
    behavior: ['crisis', 'drama', 'random'],
    comprehensive: ['crisis', 'business', 'pr', 'drama', 'random'],
  };

  return coverageMap[policyId]?.includes(eventCategory) || false;
}

// ===== 应用心理状态效果 =====

export function applyMentalEffect(
  currentState: ArtistMentalState,
  effect: MentalStateEffect
): ArtistMentalState {
  return {
    mood: Math.max(0, Math.min(100, currentState.mood + (effect.mood || 0))),
    energy: Math.max(0, Math.min(100, currentState.energy + (effect.energy || 0))),
    trust: Math.max(0, Math.min(100, currentState.trust + (effect.trust || 0))),
    cooperation: Math.max(0, Math.min(100, currentState.cooperation + (effect.cooperation || 0))),
    stress: Math.max(0, Math.min(100, currentState.stress + (effect.stress || 0))),
    burnout: Math.max(0, Math.min(100, currentState.burnout + (effect.burnout || 0))),
  };
}

// ===== 每日被动效果 =====

export function applyDailyMentalEffects(
  mentalState: ArtistMentalState,
  schedule: { activity: { id: string }; remainingDays: number } | null
): { newState: ArtistMentalState; narration: string } {
  let newState = { ...mentalState };
  const effects: string[] = [];

  // 根据行程影响心理状态
  if (schedule) {
    switch (schedule.activity.id) {
      case 'rest':
        newState.energy = Math.min(100, newState.energy + 20);
        newState.stress = Math.max(0, newState.stress - 15);
        newState.burnout = Math.max(0, newState.burnout - 10);
        effects.push('休息让艺人恢复了精力');
        break;
      case 'training':
        newState.energy = Math.max(0, newState.energy - 10);
        newState.cooperation = Math.min(100, newState.cooperation + 5);
        effects.push('培训提升了艺人的专业能力');
        break;
      case 'film':
      case 'variety':
      case 'endorsement':
        newState.energy = Math.max(0, newState.energy - 15);
        newState.stress = Math.min(100, newState.stress + 10);
        if (newState.energy < 30) {
          effects.push('高强度工作让艺人感到疲惫');
        }
        break;
    }
  }

  // 自然恢复
  if (newState.energy < 30) {
    newState.mood = Math.max(0, newState.mood - 5);
  }

  // 压力累积
  if (newState.stress > 60) {
    newState.burnout = Math.min(100, newState.burnout + 3);
  }

  // 信任度自然衰减
  if (newState.trust > 50) {
    newState.trust = Math.max(50, newState.trust - 1);
  }

  return { newState, narration: effects.join('；') };
}
