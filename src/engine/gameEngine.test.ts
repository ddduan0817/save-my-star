import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { resolveChoice, startNewDay, checkDayEnd } from './gameEngine';
import type { GameEvent, EventChoice, GameStats } from '@/types/game';

// --- Test fixtures ----------------------------------------------------------

const baseStats: GameStats = {
  commercialValue: 50,
  fanLoyalty: 50,
  prRisk: 30,
  money: 100000,
};

function makeEvent(): GameEvent {
  return {
    id: 'test_evt',
    category: 'random',
    severity: 'low',
    title: 'T',
    description: 'D',
    emoji: '🔧',
    choices: [],
  };
}

function makeChoice(overrides?: Partial<EventChoice>): EventChoice {
  return {
    id: 'c1',
    text: 'Choice 1',
    outcome: {
      narration: 'default narration',
      statChanges: { commercialValue: 5, fanLoyalty: 0, prRisk: -4, money: 1000 },
    },
    ...overrides,
  };
}

describe('gameEngine', () => {
  // Lock Math.random to a mid value so both randomizeStatChanges (variance)
  // and resolveTwist (<chance), and the "好事变坏" 20% path stay deterministic.
  // Using 0.5 -> twist(chance 0.35) does NOT fire, allPositive 20% path does NOT fire.
  let randomSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });
  afterEach(() => {
    randomSpy.mockRestore();
  });

  describe('resolveChoice', () => {
    it('produces a ChoiceResult with newStats and narration from the default outcome', () => {
      const evt = makeEvent();
      const choice = makeChoice();
      const result = resolveChoice(evt, choice, baseStats, 'actor', 1, [], 30);
      expect(result.narration).toContain('default narration');
      expect(result.newStats).toBeDefined();
      expect(typeof result.newStats.commercialValue).toBe('number');
      expect(typeof result.newStats.money).toBe('number');
      expect(result.statChanges).toBeDefined();
    });

    it('uses a conditional outcome narration when the condition matches', () => {
      const evt = makeEvent();
      const choice: EventChoice = makeChoice({
        outcome: {
          narration: 'base narration',
          statChanges: { fanLoyalty: -1 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 40 },
              narration: 'HIGH LOYALTY BRANCH',
              statChanges: { fanLoyalty: 2 },
            },
          ],
        },
      });
      const result = resolveChoice(evt, choice, baseStats, 'actor', 1, [], 30);
      expect(result.narration).toContain('HIGH LOYALTY BRANCH');
    });

    it('falls back to default narration when no conditional branch matches', () => {
      const evt = makeEvent();
      const choice: EventChoice = makeChoice({
        outcome: {
          narration: 'default narration',
          statChanges: { fanLoyalty: -1 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 999 }, // impossible
              narration: 'UNREACHABLE',
              statChanges: {},
            },
          ],
        },
      });
      const result = resolveChoice(evt, choice, baseStats, 'actor', 1, [], 30);
      expect(result.narration).toContain('default narration');
      expect(result.narration).not.toContain('UNREACHABLE');
    });

    it('returns twist=null when no twist is configured', () => {
      const evt = makeEvent();
      const choice = makeChoice();
      const result = resolveChoice(evt, choice, baseStats, 'actor', 1, [], 30);
      expect(result.twist).toBeNull();
    });

    it('triggers twist when Math.random < twist.chance', () => {
      // Use a twist with chance 1.0 so it's guaranteed under our 0.5 stub.
      const evt = makeEvent();
      const choice: EventChoice = makeChoice({
        outcome: {
          narration: 'n',
          statChanges: { prRisk: -2 },
          twist: {
            chance: 1.0,
            narration: 'TWIST FIRED',
            statChanges: { prRisk: 5 },
          },
        },
      });
      const result = resolveChoice(evt, choice, baseStats, 'actor', 1, [], 30);
      expect(result.twist).not.toBeNull();
      expect(result.twist?.narration).toBe('TWIST FIRED');
    });

    it('handles negative stat deltas (randomizeStatChanges keeps sign)', () => {
      const evt = makeEvent();
      const choice: EventChoice = makeChoice({
        outcome: {
          narration: 'n',
          statChanges: { prRisk: -10, money: -5000 },
        },
      });
      const result = resolveChoice(evt, choice, baseStats, 'actor', 1, [], 30);
      // prRisk change should still be negative after randomization
      expect(result.statChanges.prRisk ?? 0).toBeLessThan(0);
      expect(result.statChanges.money ?? 0).toBeLessThan(0);
    });

    it('propagates followUpEventId from outcome', () => {
      const evt = makeEvent();
      const choice: EventChoice = makeChoice({
        outcome: {
          narration: 'n',
          statChanges: {},
          followUpEventId: 'next_event',
        },
      });
      const result = resolveChoice(evt, choice, baseStats, 'actor', 1, [], 30);
      expect(result.followUpEventId).toBe('next_event');
    });
  });

  describe('startNewDay', () => {
    it('returns a DayResult whose events is an array', () => {
      const { events } = startNewDay(1, baseStats, {}, [], 'idol');
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('checkDayEnd', () => {
    it('returns null before MAX_DAYS', () => {
      const result = checkDayEnd(1, baseStats, [], 30);
      expect(result).toBeNull();
    });

    it('returns a non-null ending at MAX_DAYS', () => {
      // MAX_DAYS = 20, so day >= 20 should evaluate an ending.
      const result = checkDayEnd(20, baseStats, [], 30);
      expect(result).not.toBeNull();
    });
  });
});
