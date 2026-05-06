// 新系统的 store 扩展
// 这个文件包含四大新系统的状态和操作方法

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

export function interactWithFansite(
  fansites: FansiteMaster[],
  fansiteId: string,
  interaction: FansiteInteraction
): { newFansites: FansiteMaster[]; cost: number; narration: string } {
  const fansite = fansites.find(f => f.id === fansiteId);
  if (!fansite) return { newFansites: fansites, cost: 0, narration: '' };

  const cost = interaction.cost || 0;
  let narration = '';

  // 应用效果
  const newLoyalty = Math.max(0, Math.min(100, fansite.loyalty + (interaction.effect.loyalty || 0)));
  const newAttitude = interaction.effect.attitude || fansite.attitude;
  const newHasBlackmail = interaction.effect.hasBlackmail !== undefined 
    ? interaction.effect.hasBlackmail 
    : fansite.hasBlackmail;

  // 生成叙述
  switch (interaction.id) {
    case 'invite_backstage':
      narration = `你给了${fansite.name}后台拍摄权限，TA很感激，忠诚度上升。`;
      break;
    case 'pay_exclusive':
      narration = `你花了¥${cost.toLocaleString()}买断了${fansite.name}手里的独家照片。`;
      break;
    case 'official_recognition':
      narration = `你给了${fansite.name}官方认证，TA成为了"御用摄影师"。`;
      break;
    case 'gift_merch':
      narration = `你送了${fansite.name}签名周边，TA很开心。`;
      break;
    case 'dinner_meeting':
      narration = `你请${fansite.name}吃了顿饭，聊了很多，关系拉近了。`;
      break;
    case 'ignore':
      narration = `你冷处理了${fansite.name}的请求，TA有些失望。`;
      break;
    case 'threaten_legal':
      narration = `你对${fansite.name}发了律师函，TA很生气，关系恶化。`;
      break;
    case 'buyout_all':
      narration = `你花了¥${cost.toLocaleString()}一次性买断了${fansite.name}所有底片。`;
      break;
    default:
      narration = `你与${fansite.name}进行了互动。`;
  }

  const newFansites = fansites.map(f => 
    f.id === fansiteId 
      ? { ...f, loyalty: newLoyalty, attitude: newAttitude, hasBlackmail: newHasBlackmail, lastInteraction: Date.now() }
      : f
  );

  return { newFansites, cost, narration };
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
