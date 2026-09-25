import { describe, expect, it } from 'vitest';
import {
  getLevelFromXp,
  getLevelProgress,
  getNextLevel,
  matchSpecialTitle,
} from './managerProgression';

describe('manager progression display helpers', () => {
  it('resolves the initial level and progress', () => {
    expect(getLevelFromXp(0)).toMatchObject({ lv: 1, title: '实习经纪人' });
    expect(getNextLevel(1)?.minXp).toBe(80);
    expect(getLevelProgress(40, 1)).toBe(0.5);
  });

  it('resolves max level progress', () => {
    expect(getLevelFromXp(700)).toMatchObject({ lv: 5, title: '行业教母/教父' });
    expect(getNextLevel(5)).toBeNull();
    expect(getLevelProgress(700, 5)).toBe(1);
  });

  it('uses special titles without changing the underlying level', () => {
    expect(matchSpecialTitle({
      commercialValue: 50,
      fanLoyalty: 50,
      prRisk: 95,
      money: 100000,
    })?.title).toBe('走钢丝的疯子');
    expect(getLevelFromXp(200).lv).toBe(3);
  });
});
