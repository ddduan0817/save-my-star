import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { appendLedger, generateEventsForDay } from './helpers';
import type { LedgerEntry, GameStats } from '@/types/game';

describe('helpers', () => {
  describe('appendLedger', () => {
    const existing: LedgerEntry[] = [
      { label: 'Existing', amount: 1000, category: 'daily' },
    ];

    it('returns the same array reference when no entries are provided', () => {
      const result = appendLedger(existing);
      expect(result).toBe(existing);
    });

    it('filters out null/undefined entries and zero-amount entries', () => {
      const result = appendLedger(
        existing,
        null,
        undefined,
        { label: 'Zero', amount: 0, category: 'event' },
      );
      expect(result).toBe(existing);
    });

    it('appends a single non-zero entry as a new array (does not mutate)', () => {
      const entry: LedgerEntry = { label: 'Gig', amount: 5000, category: 'schedule' };
      const result = appendLedger(existing, entry);
      expect(result).not.toBe(existing);
      expect(result).toHaveLength(2);
      expect(result[1]).toEqual(entry);
      // original untouched
      expect(existing).toHaveLength(1);
    });

    it('appends multiple entries, preserving order and filtering zero/null', () => {
      const a: LedgerEntry = { label: 'A', amount: 100, category: 'event' };
      const z: LedgerEntry = { label: 'Zero', amount: 0, category: 'event' };
      const b: LedgerEntry = { label: 'B', amount: -50, category: 'cosmetic' };
      const result = appendLedger(existing, a, z, null, b);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(existing[0]);
      expect(result[1]).toEqual(a);
      expect(result[2]).toEqual(b);
    });

    it('returns the same array when current ledger is empty and no entries are valid', () => {
      const empty: LedgerEntry[] = [];
      const result = appendLedger(empty);
      expect(result).toBe(empty);
    });
  });

  describe('generateEventsForDay', () => {
    const stats: GameStats = {
      commercialValue: 50,
      fanLoyalty: 50,
      prRisk: 30,
      money: 100000,
    };

    let randomSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      // 0.99 > BREAKING_CHANCE (0.25) so maybeInjectBreaking won't add one —
      // keeps output deterministic.
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    });
    afterEach(() => {
      randomSpy.mockRestore();
    });

    it('returns events array and a newUsageMap stamped to the given day', () => {
      const { events, newUsageMap } = generateEventsForDay(
        1,
        stats,
        {},
        [],
        'idol',
      );
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThanOrEqual(1);
      // each event id should be recorded in the usage map at the given day
      for (const e of events) {
        expect(newUsageMap[e.id]).toBe(1);
      }
    });

    it('does not mutate the incoming eventUsageMap', () => {
      const usage: Record<string, number> = { some_prior_event: 0 };
      const snapshot = { ...usage };
      generateEventsForDay(1, stats, usage, [], 'idol');
      expect(usage).toEqual(snapshot);
    });

    it('preserves prior usage entries in the returned newUsageMap', () => {
      const usage: Record<string, number> = { prior_event_xyz: 0 };
      const { newUsageMap } = generateEventsForDay(1, stats, usage, [], 'idol');
      expect(newUsageMap.prior_event_xyz).toBe(0);
    });
  });
});
