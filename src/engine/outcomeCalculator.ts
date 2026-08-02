import type { GameStats, StatChange } from '@/types/game';
import type { SeasonalModifier } from '@/data/seasonalModifiers';
import { GAME_CONFIG } from '@/data/constants';
import { clampStat } from '@/lib/utils';
import {
  aggregateMoneyMultiplier,
  aggregatePrRiskDecay,
  aggregateFameRisk,
  aggregateBusinessMoney,
  aggregateCrisisMoney,
} from '@/data/seasonalModifiers';

// 递减收益：数值越高，正面增长越难
function applyDiminishingReturns(currentValue: number, change: number): number {
  if (change <= 0) return change; // 负面变化不打折
  if (currentValue >= 80) return Math.max(1, Math.round(change * 0.25));
  if (currentValue >= 60) return Math.max(1, Math.round(change * 0.5));
  return change;
}

export function applyStatChanges(
  stats: GameStats,
  changes: StatChange,
  artistId?: string,
  appearanceMultiplier?: number,
  stiffFaceActive?: boolean,
  eventCategory?: string,
  modifiers?: SeasonalModifier[],
): GameStats {
  let { commercialValue, fanLoyalty, prRisk, money } = stats;

  let cv = changes.commercialValue ?? 0;
  let fl = changes.fanLoyalty ?? 0;
  let pr = changes.prRisk ?? 0;
  let mn = changes.money ?? 0;

  // Seasonal modifier: per-category money multiplier (business gains / crisis losses)
  if (modifiers && modifiers.length > 0 && mn !== 0 && eventCategory) {
    if (eventCategory === 'business' && mn > 0) {
      mn = Math.round(mn * aggregateBusinessMoney(modifiers));
    } else if (eventCategory === 'crisis' && mn < 0) {
      mn = Math.round(mn * aggregateCrisisMoney(modifiers));
    }
  }

  // 颜值倍率：正向 cv/fl 乘以 appearance multiplier
  if (appearanceMultiplier && appearanceMultiplier !== 1.0) {
    if (cv > 0) cv = Math.max(1, Math.round(cv * appearanceMultiplier));
    if (fl > 0) fl = Math.max(1, Math.round(fl * appearanceMultiplier));
  }

  // 僵脸 debuff：正向 cv/fl 打8折
  if (stiffFaceActive) {
    if (cv > 0) cv = Math.max(1, Math.round(cv * 0.8));
    if (fl > 0) fl = Math.max(1, Math.round(fl * 0.8));
  }

  // 递减收益（对正面增长打折）
  cv = applyDiminishingReturns(commercialValue, cv);
  fl = applyDiminishingReturns(fanLoyalty, fl);
  // 风险反向：风险越低越难降（但不影响风险增加）
  if (pr < 0 && prRisk <= 20) pr = Math.min(-1, Math.round(pr * 0.5));

  // "好事变坏"机制：如果选择结果全是正面（cv>0, fl>0, pr<=0），20%概率翻车
  const allPositive = cv > 0 && fl >= 0 && pr <= 0;
  if (allPositive && Math.random() < 0.2) {
    // 翻车：好事引来关注，风险上升
    pr = Math.max(2, Math.abs(cv) + 1);
    // 粉丝也可能反噬
    if (Math.random() < 0.5) fl = -Math.abs(Math.round(fl * 0.5)) || -1;
  }

  // Artist-specific modifiers
  if (artistId === 'idol') {
    fanLoyalty = clampStat(fanLoyalty + (fl !== 0 ? Math.round(fl * 1.5) : 0));
    if (pr > 0) pr = Math.round(pr * 1.5);
    commercialValue = clampStat(commercialValue + cv);
  } else if (artistId === 'actor') {
    if (pr > 0) pr = Math.round(pr * 0.5);
    commercialValue = clampStat(commercialValue + (cv > 0 ? Math.round(cv * 0.5) : cv));
    fanLoyalty = clampStat(fanLoyalty + fl);
  } else if (artistId === 'influencer') {
    if (mn > 0) mn = Math.round(mn * 1.5);
    fanLoyalty = clampStat(fanLoyalty + fl);
    commercialValue = clampStat(commercialValue + cv);
  } else if (artistId === 'socialite') {
    // 贵公子体质：大额代言（金额 >= 500000）收益×1.5，其它正向金额×1.2；私密黑料的风险×2
    if (mn >= 500000) mn = Math.round(mn * 1.5);
    else if (mn > 0) mn = Math.round(mn * 1.2);
    if (pr > 0) pr = Math.round(pr * 2);
    fanLoyalty = clampStat(fanLoyalty + fl);
    commercialValue = clampStat(commercialValue + cv);
  } else {
    fanLoyalty = clampStat(fanLoyalty + fl);
    commercialValue = clampStat(commercialValue + cv);
  }

  prRisk = clampStat(prRisk + pr);
  money = money + mn;

  return { commercialValue, fanLoyalty, prRisk, money };
}

// 每日被动收入的收支明细。金额均为「已乘 seasonal modifier」后的最终值，
// 与实际扣款同源，供 endDay 直接写入 ledger，避免两处各算一遍导致背离。
export interface DailyMoneyBreakdown {
  loyaltyBonus: number; // 粉丝周边收入（已含 modifier）
  commercialBonus: number; // 商务尾单分成（已含 modifier）
  loyaltyTier: 'high' | 'mid' | 'none';
  commercialTier: 'top' | 'high' | 'base' | 'none';
}

export function applyDailyPassiveEffects(
  stats: GameStats,
  prTeamLevel: number = 0,
  modifiers?: SeasonalModifier[],
): { stats: GameStats; breakdown: DailyMoneyBreakdown } {
  let { commercialValue, fanLoyalty, prRisk, money } = stats;

  const moneyMult = modifiers ? aggregateMoneyMultiplier(modifiers) : 1.0;
  const decayMult = modifiers ? aggregatePrRiskDecay(modifiers) : 1.0;
  const fameRiskMult = modifiers ? aggregateFameRisk(modifiers) : 1.0;

  // Natural risk decay (+ PR team upgrade bonus)
  // DAILY_RISK_DECAY is negative; higher decayMult => faster decay => more negative
  const naturalDecay = Math.round(GAME_CONFIG.DAILY_RISK_DECAY * decayMult) - prTeamLevel;
  prRisk = clampStat(prRisk + naturalDecay);

  // High risk drains commercial value
  if (prRisk > GAME_CONFIG.HIGH_RISK_THRESHOLD) {
    commercialValue = clampStat(commercialValue + GAME_CONFIG.HIGH_RISK_COMMERCIAL_DRAIN);
  }

  // 人红是非多：名气越高，每天被动吸引风险（受 modifier 放大/缩小）
  const fame = commercialValue + fanLoyalty;
  let fameRiskAdd = 0;
  if (fame >= 140) fameRiskAdd = 3;
  else if (fame >= 110) fameRiskAdd = 2;
  else if (fame >= 80) fameRiskAdd = 1;
  if (fameRiskAdd > 0) {
    prRisk = clampStat(prRisk + Math.max(1, Math.round(fameRiskAdd * fameRiskMult)));
  }

  // Daily operating costs
  money += GAME_CONFIG.DAILY_MONEY_COST;

  // High fan loyalty provides a small money bonus (merch etc.)
  let loyaltyBonusRaw = 0;
  let loyaltyTier: DailyMoneyBreakdown['loyaltyTier'] = 'none';
  if (fanLoyalty > GAME_CONFIG.HIGH_LOYALTY_THRESHOLD) {
    loyaltyBonusRaw = 4000;
    loyaltyTier = 'high';
  } else if (fanLoyalty >= 60) {
    loyaltyBonusRaw = 2000;
    loyaltyTier = 'mid';
  }

  // 商业价值带来的日常分成（代言商务的长期尾单分摊）
  let commercialBonusRaw = 0;
  let commercialTier: DailyMoneyBreakdown['commercialTier'] = 'none';
  if (commercialValue >= 80) {
    commercialBonusRaw = 6000;
    commercialTier = 'top';
  } else if (commercialValue >= 60) {
    commercialBonusRaw = 3500;
    commercialTier = 'high';
  } else if (commercialValue >= 40) {
    commercialBonusRaw = 1500;
    commercialTier = 'base';
  }

  // Modifier multiplier only scales the bonus (not the fixed daily cost — costs are固定的)
  const loyaltyBonus = Math.round(loyaltyBonusRaw * moneyMult);
  const commercialBonus = Math.round(commercialBonusRaw * moneyMult);
  money += loyaltyBonus + commercialBonus;

  return {
    stats: { commercialValue, fanLoyalty, prRisk, money },
    breakdown: { loyaltyBonus, commercialBonus, loyaltyTier, commercialTier },
  };
}
