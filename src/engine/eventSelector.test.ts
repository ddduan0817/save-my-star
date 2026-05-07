import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  resolveEventForArtist,
  findEventById,
  selectEventsForDay,
} from './eventSelector';
import type { GameEvent, GameStats } from '@/types/game';

describe('eventSelector', () => {
  describe('resolveEventForArtist', () => {
    const baseEvent: GameEvent = {
      id: 'test_event',
      category: 'random',
      severity: 'low',
      title: 'Base Title',
      description: 'Base description',
      emoji: '🎬',
      choices: [
        {
          id: 'a',
          text: 'A',
          outcome: { narration: 'na', statChanges: {} },
        },
      ],
      artistVariants: {
        idol: {
          title: 'Idol Title',
          description: 'Idol desc',
        },
      },
    };

    it('returns the event unchanged when artistId is undefined', () => {
      const result = resolveEventForArtist(baseEvent, undefined);
      expect(result).toBe(baseEvent);
    });

    it('returns the event unchanged when no variant matches the artist', () => {
      const result = resolveEventForArtist(baseEvent, 'actor');
      expect(result).toBe(baseEvent);
    });

    it('overrides title/description from variant while preserving other fields', () => {
      const result = resolveEventForArtist(baseEvent, 'idol');
      expect(result.title).toBe('Idol Title');
      expect(result.description).toBe('Idol desc');
      // emoji not overridden -> preserved
      expect(result.emoji).toBe('🎬');
      expect(result.choices).toBe(baseEvent.choices);
      expect(result.id).toBe(baseEvent.id);
    });

    it('returns event unchanged when there are no artistVariants at all', () => {
      const ev: GameEvent = { ...baseEvent, artistVariants: undefined };
      expect(resolveEventForArtist(ev, 'idol')).toBe(ev);
    });
  });

  describe('findEventById', () => {
    it('finds a known event from the master event pool', () => {
      const ev = findEventById('crisis_leaked_photo');
      expect(ev).toBeDefined();
      expect(ev?.category).toBe('crisis');
    });

    it('returns undefined for a non-existent id', () => {
      expect(findEventById('definitely_not_a_real_event_id_xyz')).toBeUndefined();
    });
  });

  describe('selectEventsForDay', () => {
    let randomSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      // Make Math.random deterministic so weighted selection / "trouble" injection
      // pick consistently in tests.
      randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.1);
    });
    afterEach(() => {
      randomSpy.mockRestore();
    });

    const baseStats: GameStats = {
      commercialValue: 50,
      fanLoyalty: 50,
      prRisk: 30,
      money: 200000,
    };

    it('returns at least one event on day 1 with default conditions', () => {
      const events = selectEventsForDay(1, baseStats, {}, [], 'idol');
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThanOrEqual(1);
      // each returned event must have an id
      for (const e of events) {
        expect(typeof e.id).toBe('string');
      }
    });

    it('returns events that are GameEvent shaped (have choices array)', () => {
      const events = selectEventsForDay(1, baseStats, {}, [], 'actor');
      for (const e of events) {
        expect(Array.isArray(e.choices)).toBe(true);
      }
    });
  });
});
