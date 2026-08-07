// 本季娱乐圈大环境 ， 开局随机抽 1–2 张，影响整局节奏。
// 设计原则：每张卡都有 **利 + 弊**，不能单纯的 buff 或 debuff。
//
// 读取方：
//   - eventSelector.ts 根据 `eventCategoryWeightMultiplier` 调整事件权重
//   - outcomeCalculator.ts 根据 `moneyMultiplier / prRiskDecayMultiplier` 调整每日被动
//   - endDay.ts 根据 `forcedEventEveryNDays` 强制注入专属事件（如“狗仔盛行”每 4 天偷拍）
//   - UI 开局弹窗展示名字 + 描述 + 图标

import type { EventCategory } from '@/types/game';

export type SeasonalModifierId =
  | 'variety_year'
  | 'fanquan_crackdown'
  | 'economic_downturn'
  | 'paparazzi_era'
  | 'top_star_retirement'
  | 'content_drought'
  | 'award_season'
  | 'cp_economy'
  | 'short_video_boom'
  | 'policy_tightening';

export interface SeasonalModifier {
  id: SeasonalModifierId;
  name: string;
  emoji: string;
  /** 一句话的“娱乐圈大环境”文案，开局弹窗 + 微博热搜 #XX年度关键词# 都会用 */
  tagline: string;
  /** 详细效果描述，给玩家看的明牌 */
  description: string;
  /** 事件分类权重倍率（不设则为 1.0） */
  categoryWeightMultiplier?: Partial<Record<EventCategory, number>>;
  /** 日常商业收入倍率（乘到 commercialBonus + loyaltyBonus 上） */
  moneyMultiplier?: number;
  /** 舆论风险每日衰减倍率（>1 衰减更快，<1 更慢） */
  prRiskDecayMultiplier?: number;
  /** 被动吸风险（人红是非多）倍率 */
  fameRiskMultiplier?: number;
  /** 商业事件里的 statChanges.money 倍率 */
  businessMoneyMultiplier?: number;
  /** 危机事件里的 money 损失倍率（<1 = 减免，>1 = 放大） */
  crisisMoneyMultiplier?: number;
  /** 每 N 天必注入的事件 ID（eventSelector 特判） */
  forcedEvent?: { eventId: string; everyNDays: number };
}

export const SEASONAL_MODIFIERS: SeasonalModifier[] = [
  {
    id: 'variety_year',
    name: '综艺大年',
    emoji: '📺',
    tagline: '“今年谁没上综艺都不好意思说自己是明星。”',
    description: '综艺/商务事件权重 ×1.8，所有商务出场费 ×1.3。但话题多风险也多，舆论风险衰减 ×0.7。',
    categoryWeightMultiplier: { business: 1.8, drama: 1.2 },
    businessMoneyMultiplier: 1.3,
    prRiskDecayMultiplier: 0.7,
  },
  {
    id: 'fanquan_crackdown',
    name: '饭圈严打',
    emoji: '⚖️',
    tagline: '“清朗行动进行时，超话每天被巡查。”',
    description: '舆论风险每日衰减减半，人红是非多 ×1.5。但粉丝应援事件减少、负面也减少，crisis 事件权重 ×0.7。',
    categoryWeightMultiplier: { crisis: 0.7, pr: 1.3 },
    prRiskDecayMultiplier: 0.5,
    fameRiskMultiplier: 1.5,
  },
  {
    id: 'economic_downturn',
    name: '经济下行',
    emoji: '📉',
    tagline: '“甲方都在砍预算，艺人日子也不好过。”',
    description: '所有商务收入 ×0.7，日常被动收入 ×0.8。但危机造成的金钱损失也 ×0.7（大家都穷，不好讹你）。',
    businessMoneyMultiplier: 0.7,
    moneyMultiplier: 0.8,
    crisisMoneyMultiplier: 0.7,
  },
  {
    id: 'paparazzi_era',
    name: '狗仔盛行',
    emoji: '📸',
    tagline: '“这个月已经抓了三个顶流恋情，下一个是谁？”',
    description: '每 4 天强制触发一次偷拍/绯闻事件。但高热度也有回报，商业价值增长事件更多。',
    categoryWeightMultiplier: { business: 1.3, crisis: 1.2 },
    forcedEvent: { eventId: 'absurd_selfie_shadow', everyNDays: 4 },
  },
  {
    id: 'top_star_retirement',
    name: '顶流退圈潮',
    emoji: '🌠',
    tagline: '“三个月内跑了五个 S 级，行业急需新人上位。”',
    description: '商业价值自动 +2/天（资源空窗），商务事件权重 ×1.5。但人红是非多倍增 ×1.3。',
    categoryWeightMultiplier: { business: 1.5 },
    fameRiskMultiplier: 1.3,
  },
  {
    id: 'content_drought',
    name: '内容荒',
    emoji: '🏜️',
    tagline: '“热搜第一能挂三天，大家实在没瓜可吃。”',
    description: '任何事件都容易被无限放大：舆论风险 ×1.3。但正面事件也容易出圈，粉丝忠诚增长事件 ×1.3。',
    categoryWeightMultiplier: { pr: 1.3, random: 1.3 },
    fameRiskMultiplier: 1.3,
    prRiskDecayMultiplier: 0.8,
  },
  {
    id: 'award_season',
    name: '颁奖季',
    emoji: '🏆',
    tagline: '“年底各大颁奖礼扎堆，资源重新洗牌。”',
    description: '商务事件 ×1.4，所有 drama 事件（行业八卦）×1.5。但竞争激烈，对家行动更积极。',
    categoryWeightMultiplier: { business: 1.4, drama: 1.5 },
    businessMoneyMultiplier: 1.2,
  },
  {
    id: 'cp_economy',
    name: 'CP 经济',
    emoji: '💑',
    tagline: '“只要上对了 CP，数据翻三倍。”',
    description: '粉丝忠诚增长 +20%，商务收入 +15%。但 CP 炒作也最容易翻车，恋情类 crisis 事件 ×1.5。',
    categoryWeightMultiplier: { crisis: 1.2, pr: 1.2 },
    businessMoneyMultiplier: 1.15,
    moneyMultiplier: 1.1,
  },
  {
    id: 'short_video_boom',
    name: '短视频井喷',
    emoji: '📱',
    tagline: '“三秒不出圈就被划走，所有人都在卷切片。”',
    description: '日常被动收入 ×1.2（短视频分成），随机事件权重 ×1.5。但审美疲劳快，商业价值增长减慢。',
    categoryWeightMultiplier: { random: 1.5, business: 0.85 },
    moneyMultiplier: 1.2,
  },
  {
    id: 'policy_tightening',
    name: '政策收紧',
    emoji: '📜',
    tagline: '“新规下来了：高片酬税务阴阳合同都要查。”',
    description: '所有商务收入 ×0.85（更多走合规），税务 / 言论风险事件 ×1.5。但路人缘回报加成，高路人缘时舆论风险衰减加快。',
    categoryWeightMultiplier: { crisis: 1.3 },
    businessMoneyMultiplier: 0.85,
    prRiskDecayMultiplier: 1.2,
  },
];

/**
 * 开局随机抽 1–2 张 modifier。
 * 50% 概率抽 1 张，50% 概率抽 2 张（避免太极端，且两张不能互为反效果，暂用简单随机）。
 */
export function rollSeasonalModifiers(): SeasonalModifier[] {
  const pool = [...SEASONAL_MODIFIERS];
  const count = Math.random() < 0.5 ? 1 : 2;
  const picked: SeasonalModifier[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked;
}

/** 聚合多张 modifier 的权重倍率（取乘积） */
export function aggregateCategoryWeight(
  modifiers: SeasonalModifier[],
  category: EventCategory,
): number {
  return modifiers.reduce((acc, m) => {
    const mult = m.categoryWeightMultiplier?.[category];
    return mult !== undefined ? acc * mult : acc;
  }, 1.0);
}

export function aggregateMoneyMultiplier(modifiers: SeasonalModifier[]): number {
  return modifiers.reduce((acc, m) => acc * (m.moneyMultiplier ?? 1), 1.0);
}

export function aggregatePrRiskDecay(modifiers: SeasonalModifier[]): number {
  return modifiers.reduce((acc, m) => acc * (m.prRiskDecayMultiplier ?? 1), 1.0);
}

export function aggregateFameRisk(modifiers: SeasonalModifier[]): number {
  return modifiers.reduce((acc, m) => acc * (m.fameRiskMultiplier ?? 1), 1.0);
}

export function aggregateBusinessMoney(modifiers: SeasonalModifier[]): number {
  return modifiers.reduce((acc, m) => acc * (m.businessMoneyMultiplier ?? 1), 1.0);
}

export function aggregateCrisisMoney(modifiers: SeasonalModifier[]): number {
  return modifiers.reduce((acc, m) => acc * (m.crisisMoneyMultiplier ?? 1), 1.0);
}
