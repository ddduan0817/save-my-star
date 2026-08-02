import { describe, it, expect } from 'vitest';
import { applyDailyPassiveEffects } from './outcomeCalculator';
import type { GameStats } from '@/types/game';
import type { SeasonalModifier } from '@/data/seasonalModifiers';
import { GAME_CONFIG } from '@/data/constants';

// applyDailyPassiveEffects 是每日被动收支的唯一数据源：它既算实际资金变动，
// 又返回给 ledger 展示用的 breakdown。这里的核心不变量是——
// **展示的收支明细合计，必须等于实际到账的被动收入**（否则玩家看到的账和
// 钱包对不上，就是之前修掉的那个 bug）。

const base: GameStats = {
  commercialValue: 50,
  fanLoyalty: 50,
  prRisk: 30,
  money: 100000,
};

/** 被动收入里「非固定运营成本」的部分 = 实际资金变化 - 固定日常开支 */
function passiveBonusApplied(before: GameStats, after: GameStats): number {
  const totalMoneyDelta = after.money - before.money;
  return totalMoneyDelta - GAME_CONFIG.DAILY_MONEY_COST;
}

describe('applyDailyPassiveEffects — 收支明细与实际资金自洽', () => {
  it('无 modifier：ledger 明细合计 === 实际到账的被动奖励', () => {
    const stats = { ...base, fanLoyalty: 85, commercialValue: 85 };
    const { stats: after, breakdown } = applyDailyPassiveEffects(stats, 0);

    const ledgerSum = breakdown.loyaltyBonus + breakdown.commercialBonus;
    expect(ledgerSum).toBe(passiveBonusApplied(stats, after));
  });

  it('带经济繁荣 modifier(×1.2)：明细已含 modifier，且与实际资金一致', () => {
    const boom: SeasonalModifier = {
      id: 'award_season',
      name: '颁奖季',
      emoji: '🏆',
      tagline: 't',
      description: 'd',
      moneyMultiplier: 1.2,
    };
    const stats = { ...base, fanLoyalty: 85, commercialValue: 85 };
    const { stats: after, breakdown } = applyDailyPassiveEffects(stats, 0, [boom]);

    // 明细必须是乘过 1.2 之后的值（4000*1.2=4800, 6000*1.2=7200）
    expect(breakdown.loyaltyBonus).toBe(4800);
    expect(breakdown.commercialBonus).toBe(7200);
    // 且合计仍等于实际到账
    const ledgerSum = breakdown.loyaltyBonus + breakdown.commercialBonus;
    expect(ledgerSum).toBe(passiveBonusApplied(stats, after));
  });

  it('阈值口径：奖励档位由「本次计算的数值」决定，不会与实际扣款背离', () => {
    // 商业价值刚好落在 60-79 档（中档 3500），忠诚刚好 60-79 档（2000）
    const stats = { ...base, fanLoyalty: 65, commercialValue: 62 };
    const { stats: after, breakdown } = applyDailyPassiveEffects(stats, 0);

    expect(breakdown.loyaltyTier).toBe('mid');
    expect(breakdown.commercialTier).toBe('high');
    expect(breakdown.loyaltyBonus).toBe(2000);
    expect(breakdown.commercialBonus).toBe(3500);

    const ledgerSum = breakdown.loyaltyBonus + breakdown.commercialBonus;
    expect(ledgerSum).toBe(passiveBonusApplied(stats, after));
  });

  it('低数值：无被动奖励时明细为 0，实际也只扣固定开支', () => {
    const stats = { ...base, fanLoyalty: 30, commercialValue: 30 };
    const { stats: after, breakdown } = applyDailyPassiveEffects(stats, 0);

    expect(breakdown.loyaltyBonus).toBe(0);
    expect(breakdown.commercialBonus).toBe(0);
    expect(breakdown.loyaltyTier).toBe('none');
    expect(breakdown.commercialTier).toBe('none');
    // 只扣固定日常开支
    expect(after.money - stats.money).toBe(GAME_CONFIG.DAILY_MONEY_COST);
  });

  it('顶级数值 + 高忠诚：明细档位正确(top / high)', () => {
    const stats = { ...base, fanLoyalty: 90, commercialValue: 90 };
    const { breakdown } = applyDailyPassiveEffects(stats, 0);

    expect(breakdown.loyaltyTier).toBe('high');
    expect(breakdown.commercialTier).toBe('top');
    expect(breakdown.loyaltyBonus).toBe(4000);
    expect(breakdown.commercialBonus).toBe(6000);
  });
});
