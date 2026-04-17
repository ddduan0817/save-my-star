import type { GameStats, StatChange } from '@/types/game';
import { GAME_CONFIG } from '@/data/constants';
import { clampStat } from '@/lib/utils';

export function applyStatChanges(
  stats: GameStats,
  changes: StatChange,
  artistId?: string
): GameStats {
  let { commercialValue, fanLoyalty, prRisk, money } = stats;

  const cv = changes.commercialValue ?? 0;
  const fl = changes.fanLoyalty ?? 0;
  let pr = changes.prRisk ?? 0;
  let mn = changes.money ?? 0;

  // Artist-specific modifiers
  if (artistId === 'idol') {
    // Fan events amplified both ways
    fanLoyalty = clampStat(fanLoyalty + (fl !== 0 ? Math.round(fl * 1.5) : 0));
    if (pr > 0) pr = Math.round(pr * 1.5);
    commercialValue = clampStat(commercialValue + cv);
  } else if (artistId === 'actor') {
    // Risk increase halved, commercial gain halved
    if (pr > 0) pr = Math.round(pr * 0.5);
    commercialValue = clampStat(commercialValue + (cv > 0 ? Math.round(cv * 0.5) : cv));
    fanLoyalty = clampStat(fanLoyalty + fl);
  } else if (artistId === 'influencer') {
    // Money gains +50%
    if (mn > 0) mn = Math.round(mn * 1.5);
    fanLoyalty = clampStat(fanLoyalty + fl);
    commercialValue = clampStat(commercialValue + cv);
  } else {
    // Singer / default
    fanLoyalty = clampStat(fanLoyalty + fl);
    commercialValue = clampStat(commercialValue + cv);
  }

  prRisk = clampStat(prRisk + pr);
  money = money + mn;

  return { commercialValue, fanLoyalty, prRisk, money };
}

export function applyDailyPassiveEffects(stats: GameStats): GameStats {
  let { commercialValue, fanLoyalty, prRisk, money } = stats;

  // Natural risk decay
  prRisk = clampStat(prRisk + GAME_CONFIG.DAILY_RISK_DECAY);

  // High risk drains commercial value
  if (prRisk > GAME_CONFIG.HIGH_RISK_THRESHOLD) {
    commercialValue = clampStat(commercialValue + GAME_CONFIG.HIGH_RISK_COMMERCIAL_DRAIN);
  }

  // Daily operating costs
  money += GAME_CONFIG.DAILY_MONEY_COST;

  // High fan loyalty provides a small money bonus (merch etc.)
  if (fanLoyalty > GAME_CONFIG.HIGH_LOYALTY_THRESHOLD) {
    money += 3000;
  }

  return { commercialValue, fanLoyalty, prRisk, money };
}
