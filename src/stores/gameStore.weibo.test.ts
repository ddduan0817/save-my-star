import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { artists } from '@/data/artists';
import { makeFreshGameState } from './initialState';
import { useGameStore } from './gameStore';

const storage = vi.hoisted(() => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
      clear: () => values.clear(),
      key: (index: number) => Array.from(values.keys())[index] ?? null,
      get length() {
        return values.size;
      },
    },
  });
  return values;
});

const artist = artists.find(item => item.id === 'idol')!;

describe('gameStore Weibo identity routing', () => {
  beforeEach(() => {
    storage.clear();
    useGameStore.setState({
      ...makeFreshGameState(),
      gamePhase: 'playing',
      currentDay: 3,
      artist,
      stats: { ...artist.initialStats },
      rival: {
        artistId: 'idol',
        name: '林C位',
        avatar: './rivals/lin_c.png',
        title: '选秀C位·全能ace',
        backstory: '',
        fameLevel: 'high',
        aggression: 55,
        stats: {
          commercialValue: 55,
          fanLoyalty: 45,
          prRisk: 20,
          appearance: 70,
        },
        actionsLog: [],
      },
    });
    vi.spyOn(Date, 'now').mockReturnValue(1_790_000_000_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps an undiscovered burner template post private and effect-free', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const before = { ...useGameStore.getState().stats };

    useGameStore.getState().postWeibo('post_selfie');

    const state = useGameStore.getState();
    expect(state.stats).toEqual(before);
    expect(state.weiboPostHistory).toHaveLength(0);
    expect(state.burnerFeed).toHaveLength(1);
    expect(state.burnerFeed[0]).toMatchObject({
      sceneId: 'burner_artist_impersonation',
      outcome: 'success',
      backfired: false,
      day: 3,
    });
    expect(state.burnerFeed[0].likes).toBeLessThanOrEqual(12);
  });

  it('keeps an exposed burner template post under the burner identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    useGameStore.getState().postWeibo('post_selfie');

    const state = useGameStore.getState();
    expect(state.weiboPostHistory).toHaveLength(0);
    expect(state.burnerFeed).toHaveLength(1);
    expect(state.burnerFeed[0]).toMatchObject({
      sceneId: 'burner_artist_impersonation',
      outcome: 'leaked',
      backfired: true,
    });
    expect(state.activeTags).toContain('burner_exposed');
    expect(state.stats.prRisk).toBeGreaterThan(artist.initialStats.prRisk);
  });

  it('stores an artist-account post as an immutable public snapshot', () => {
    useGameStore.setState({ burnerIdentity: 'artist' });
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    useGameStore.getState().postWeibo('post_hint_romance');

    const state = useGameStore.getState();
    expect(state.burnerFeed).toHaveLength(0);
    expect(state.weiboPostHistory).toHaveLength(1);
    expect(state.weiboPostHistory[0]).toMatchObject({
      id: 'weibo_3_1790000000000',
      templateId: 'post_hint_romance',
      sceneId: 'artist_romance_hint',
      outcome: 'backfire',
      wasBackfire: true,
    });
    expect(state.weiboPostHistory[0].content).not.toContain('粉丝直接炸了');
    expect(state.weiboPostHistory[0].engagement).toBeDefined();
  });
});
