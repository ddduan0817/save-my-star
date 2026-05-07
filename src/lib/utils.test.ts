import { describe, it, expect } from 'vitest';
import { cn, formatMoney, clampStat } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names from strings', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes via clsx', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('dedupes/merges tailwind conflicts via twMerge', () => {
      // tailwind-merge keeps the latter winning utility
      expect(cn('p-2', 'p-4')).toBe('p-4');
    });
  });

  describe('formatMoney', () => {
    it('formats values >= 10000 in 万 with one decimal', () => {
      expect(formatMoney(15000)).toBe('1.5万');
      expect(formatMoney(100000)).toBe('10.0万');
    });

    it('formats values <= -10000 in 万', () => {
      expect(formatMoney(-25000)).toBe('-2.5万');
    });

    it('formats small absolute amounts with zh-CN locale grouping', () => {
      expect(formatMoney(1000)).toBe('1,000');
      expect(formatMoney(0)).toBe('0');
      expect(formatMoney(-500)).toBe('-500');
    });
  });

  describe('clampStat', () => {
    it('clamps to default 0..100 range', () => {
      expect(clampStat(150)).toBe(100);
      expect(clampStat(-5)).toBe(0);
      expect(clampStat(50)).toBe(50);
    });

    it('respects explicit min/max', () => {
      expect(clampStat(5, 10, 20)).toBe(10);
      expect(clampStat(25, 10, 20)).toBe(20);
      expect(clampStat(15, 10, 20)).toBe(15);
    });
  });
});
