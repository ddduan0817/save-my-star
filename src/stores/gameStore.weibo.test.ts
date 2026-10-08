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
      imageKey: './weibo/idol/romance_hint.jpg',
      wasBackfire: true,
    });
    expect(state.weiboPostHistory[0].content).not.toContain('粉丝直接炸了');
    expect(state.weiboPostHistory[0].engagement).toBeDefined();
  });

  it('settles an artist-account interaction once and never rolls it back', () => {
    useGameStore.setState({ burnerIdentity: 'artist' });
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const input = {
      postId: 'hostile-feed-post',
      action: 'like' as const,
      authorAccount: 'external' as const,
      sceneId: 'fan_fandom_conflict' as const,
      stance: 'hostile' as const,
    };

    const first = useGameStore.getState().interactWithWeiboPost(input);
    const afterFirst = { ...useGameStore.getState().stats };
    expect(first).toMatchObject({ active: true, settled: true });
    expect(afterFirst.prRisk).toBeGreaterThan(artist.initialStats.prRisk);

    const cancel = useGameStore.getState().interactWithWeiboPost(input);
    expect(cancel).toMatchObject({ active: false, settled: false });
    expect(cancel.feedback).toContain('不会撤销');
    expect(useGameStore.getState().stats).toEqual(afterFirst);

    const reactivate = useGameStore.getState().interactWithWeiboPost(input);
    expect(reactivate).toMatchObject({ active: true, settled: false });
    expect(reactivate.feedback).toContain('不会重复结算');
    expect(useGameStore.getState().stats).toEqual(afterFirst);
    expect(useGameStore.getState().weiboInteractions['artist:hostile-feed-post'])
      .toMatchObject({ liked: true, likeSettled: true });
  });

  it('isolates interaction state by account and keeps burner actions effect-free', () => {
    useGameStore.setState({ burnerIdentity: 'artist' });
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const input = {
      postId: 'supportive-feed-post',
      action: 'repost' as const,
      authorAccount: 'external' as const,
      sceneId: 'fan_support_campaign' as const,
      stance: 'supportive' as const,
    };

    useGameStore.getState().interactWithWeiboPost(input);
    const afterArtist = { ...useGameStore.getState().stats };
    expect(useGameStore.getState().weiboInteractions['artist:supportive-feed-post'])
      .toMatchObject({ reposted: true, repostSettled: true });

    useGameStore.getState().switchBurnerIdentity('self');
    const burnerResult = useGameStore.getState().interactWithWeiboPost(input);

    expect(burnerResult).toMatchObject({ active: true, settled: true });
    expect(burnerResult.feedback).toContain('小号');
    expect(useGameStore.getState().stats).toEqual(afterArtist);
    expect(useGameStore.getState().weiboInteractions['self:supportive-feed-post'])
      .toMatchObject({ reposted: true, repostSettled: true });
  });

  it('adds a hot-search entry when the artist account amplifies a smear', () => {
    useGameStore.setState({ burnerIdentity: 'artist' });
    const input = {
      postId: 'rival-smear-post',
      action: 'repost' as const,
      authorAccount: 'external' as const,
      sceneId: 'burner_rival_smear' as const,
      stance: 'hostile' as const,
    };

    const result = useGameStore.getState().interactWithWeiboPost(input);
    const state = useGameStore.getState();

    expect(result.settled).toBe(true);
    expect(state.weiboTrends[0]).toMatchObject({
      rank: 1,
      isHot: true,
      sentiment: 'negative',
    });
    expect(state.weiboTrends[0].title).toContain('甄帅');
    expect(state.weiboTrends[0].title).toContain('转发');
  });
});
