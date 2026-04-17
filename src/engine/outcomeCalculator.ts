import type { GameStats, StatChange } from '@/types/game';
import { GAME_CONFIG } from '@/data/constants';
import { clampStat } from '@/lib/utils';

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
): GameStats {
  let { commercialValue, fanLoyalty, prRisk, money } = stats;

  let cv = changes.commercialValue ?? 0;
  let fl = changes.fanLoyalty ?? 0;
  let pr = changes.prRisk ?? 0;
  let mn = changes.money ?? 0;

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
  } else {
    fanLoyalty = clampStat(fanLoyalty + fl);
    commercialValue = clampStat(commercialValue + cv);
  }

  prRisk = clampStat(prRisk + pr);
  money = money + mn;

  return { commercialValue, fanLoyalty, prRisk, money };
}

export function applyDailyPassiveEffects(stats: GameStats, prTeamLevel: number = 0): GameStats {
  let { commercialValue, fanLoyalty, prRisk, money } = stats;

  // Natural risk decay (+ PR team upgrade bonus)
  prRisk = clampStat(prRisk + GAME_CONFIG.DAILY_RISK_DECAY - prTeamLevel);

  // High risk drains commercial value
  if (prRisk > GAME_CONFIG.HIGH_RISK_THRESHOLD) {
    commercialValue = clampStat(commercialValue + GAME_CONFIG.HIGH_RISK_COMMERCIAL_DRAIN);
  }

  // 人红是非多：名气越高，每天被动吸引风险
  const fame = commercialValue + fanLoyalty;
  if (fame >= 140) {
    // 顶级名气：每天+3风险
    prRisk = clampStat(prRisk + 3);
  } else if (fame >= 110) {
    // 高名气：每天+2风险
    prRisk = clampStat(prRisk + 2);
  } else if (fame >= 80) {
    // 中等名气：每天+1风险
    prRisk = clampStat(prRisk + 1);
  }

  // Daily operating costs
  money += GAME_CONFIG.DAILY_MONEY_COST;

  // High fan loyalty provides a small money bonus (merch etc.)
  if (fanLoyalty > GAME_CONFIG.HIGH_LOYALTY_THRESHOLD) {
    money += 3000;
  }

  return { commercialValue, fanLoyalty, prRisk, money };
}
