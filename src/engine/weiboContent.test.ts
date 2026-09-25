import { describe, expect, it } from 'vitest';
import {
  ALL_WEIBO_SCENES,
  ARTIST_POST_SCENES,
  BURNER_SCENES,
  COMMENT_NICK_POOLS,
  FAN_FEED_SCENES,
  RIVAL_FAN_NICK_POOLS,
  RIVALRY_COMMENT_SCENES,
  WEIBO_COMMENT_POOLS,
} from '@/data/weiboScenes';
import type {
  WeiboCommentRole,
  WeiboOutcome,
  WeiboPostTemplate,
  WeiboSceneId,
} from '@/types/game';
import {
  createStableEngagement,
  formatEngagementCount,
  generateSceneComments,
  hydrateWeiboPostRecord,
  inferLegacySceneId,
  selectArtistPostContent,
  selectNicknameForRole,
  stablePick,
} from './weiboContent';

describe('Weibo scene contracts', () => {
  it('defines all 25 approved scene IDs without duplicates', () => {
    const scenes = [
      ...ARTIST_POST_SCENES,
      ...FAN_FEED_SCENES,
      ...BURNER_SCENES,
    ];

    expect(ARTIST_POST_SCENES).toHaveLength(10);
    expect(FAN_FEED_SCENES).toHaveLength(12);
    expect(BURNER_SCENES).toHaveLength(3);
    expect(scenes).toHaveLength(25);
    expect(new Set(scenes).size).toBe(25);
    expect(ALL_WEIBO_SCENES).toEqual(scenes);
  });

  it('provides at least twelve structured comments and three roles per scene', () => {
    for (const sceneId of ALL_WEIBO_SCENES) {
      const pool = WEIBO_COMMENT_POOLS[sceneId];

      expect(pool.length, sceneId).toBeGreaterThanOrEqual(12);
      expect(new Set(pool.map(entry => entry.role)).size, sceneId)
        .toBeGreaterThanOrEqual(3);
      expect(pool.some(entry => entry.priority === 'direct'), sceneId).toBe(true);
      expect(
        pool.some(entry => entry.allowedOutcomes.includes('success')),
        sceneId,
      ).toBe(true);
      expect(
        pool.some(entry => entry.allowedOutcomes.includes('backfire')),
        sceneId,
      ).toBe(true);
    }
  });

  it('provides substantial role-specific fallback nickname pools', () => {
    const roles: WeiboCommentRole[] = [
      'fan',
      'casual',
      'data_fan',
      'fansite',
      'cp_fan',
      'anti',
      'former_fan',
      'rival_fan',
      'sasaeng',
    ];

    for (const role of roles) {
      expect(COMMENT_NICK_POOLS[role].length, role).toBeGreaterThanOrEqual(8);
    }
  });

  it('provides dedicated nickname pools for all five rivals', () => {
    expect(Object.keys(RIVAL_FAN_NICK_POOLS).sort()).toEqual([
      'chao_cute',
      'ge_wang',
      'gu_junting',
      'lin_c',
      'wang_sc',
    ]);
    for (const pool of Object.values(RIVAL_FAN_NICK_POOLS)) {
      expect(pool.length).toBeGreaterThanOrEqual(8);
    }
    expect(RIVAL_FAN_NICK_POOLS.lin_c).toContain('林C位粉丝');
  });

  it('limits rival-fan entries to rivalry-compatible scenes', () => {
    const compatibleScenes = new Set<WeiboSceneId>(RIVALRY_COMMENT_SCENES);

    for (const sceneId of ALL_WEIBO_SCENES) {
      const rivalEntries = WEIBO_COMMENT_POOLS[sceneId]
        .filter(entry => entry.role === 'rival_fan');
      if (compatibleScenes.has(sceneId)) {
        expect(rivalEntries.length, sceneId).toBeGreaterThan(0);
        expect(rivalEntries.some(entry => entry.text.includes('{rival}')), sceneId)
          .toBe(true);
      } else {
        expect(rivalEntries, sceneId).toHaveLength(0);
      }
    }
  });
});

describe('deterministic content helpers', () => {
  it('selects the same item for the same seed and rejects empty pools', () => {
    expect(stablePick(['a', 'b', 'c'], 'post-42')).toBe(
      stablePick(['a', 'b', 'c'], 'post-42'),
    );
    expect(() => stablePick([], 'post-42')).toThrow(
      'stablePick requires a non-empty pool',
    );
  });

  it('prefers deterministic artist-specific post variants', () => {
    const template: WeiboPostTemplate = {
      id: 'test-romance',
      title: '测试',
      emoji: '',
      description: '',
      baseEffects: {},
      successNarration: '结算旁白',
      trendTitle: '#测试#',
      sceneId: 'artist_romance_hint',
      postVariants: ['通用正文一', '通用正文二'],
      artistPostVariants: {
        singer: ['歌手正文一', '歌手正文二'],
      },
      imageRequirement: 'required',
    };

    const first = selectArtistPostContent(template, 'singer', 'post-42');
    const second = selectArtistPostContent(template, 'singer', 'post-42');

    expect(first).toBe(second);
    expect(template.artistPostVariants?.singer).toContain(first);
    expect(first).not.toBe(template.successNarration);
  });

  it('creates stable engagement in non-negative integer ranges', () => {
    const first = createStableEngagement('post-42', 'artist_romance_hint');
    const second = createStableEngagement('post-42', 'artist_romance_hint');

    expect(first).toEqual(second);
    expect(Object.values(first).every(Number.isInteger)).toBe(true);
    expect(first.likes).toBeGreaterThanOrEqual(120000);
    expect(first.comments).toBeGreaterThanOrEqual(12000);
    expect(first.reposts).toBeGreaterThanOrEqual(20000);
  });

  it('formats five-digit engagement counts in ten-thousands', () => {
    expect(formatEngagementCount(9999)).toBe('9999');
    expect(formatEngagementCount(10000)).toBe('10000');
    expect(formatEngagementCount(10500)).toBe('1.1万');
    expect(formatEngagementCount(85649)).toBe('8.6万');
    expect(formatEngagementCount(120000)).toBe('12万');
  });

  it('keeps an unseen burner post at private-account scale', () => {
    const engagement = createStableEngagement(
      'private-post',
      'burner_artist_impersonation',
      'private',
    );

    expect(engagement.likes).toBeLessThanOrEqual(12);
    expect(engagement.comments).toBeLessThanOrEqual(3);
    expect(engagement.reposts).toBeLessThanOrEqual(2);
  });
});

describe('scene comment generation', () => {
  it('composes direct-first, compatible comments for every scene and outcome', () => {
    const outcomes: WeiboOutcome[] = ['success', 'backfire', 'leaked'];

    for (const sceneId of ALL_WEIBO_SCENES) {
      for (const outcome of outcomes) {
        const input = {
          sceneId,
          outcome,
          seed: `${sceneId}:${outcome}`,
          artistNickPool: ['一颗甄糖', '甄帅守护站', '甄帅数据组'],
          rivalName: '林C位',
        };
        const first = generateSceneComments(input);
        const second = generateSceneComments(input);
        const entries = first.map(comment =>
          WEIBO_COMMENT_POOLS[sceneId].find(entry =>
            entry.text.replace(/\{rival\}/g, input.rivalName) === comment.text),
        );

        expect(first, `${sceneId}:${outcome}`).toEqual(second);
        expect(first, `${sceneId}:${outcome}`).toHaveLength(3);
        expect(entries[0]?.priority, `${sceneId}:${outcome}`).toBe('direct');
        if (outcome !== 'leaked' || sceneId === 'burner_artist_impersonation') {
          expect(entries[0]?.allowedOutcomes, `${sceneId}:${outcome}:direct`)
            .toEqual([outcome]);
        }
        expect(
          entries.slice(1).every(entry => entry?.priority === 'secondary'),
          `${sceneId}:${outcome}`,
        ).toBe(true);
        expect(
          entries.every(entry => entry?.allowedOutcomes.includes(outcome)),
          `${sceneId}:${outcome}`,
        ).toBe(true);
        expect(new Set(first.map(comment => comment.text)).size).toBe(3);
        expect(new Set(first.map(comment => comment.nickname)).size).toBe(3);
      }
    }
  });

  it('returns one direct and two compatible secondary comments deterministically', () => {
    const input = {
      sceneId: 'artist_romance_hint' as const,
      outcome: 'backfire' as const,
      seed: 'romance-post-1',
      artistNickPool: ['一颗甄糖', '甄帅守护站', '甄帅数据组'],
    };

    const first = generateSceneComments(input);
    const second = generateSceneComments(input);

    expect(first).toEqual(second);
    expect(first).toHaveLength(3);
    expect(new Set(first.map(comment => comment.text)).size).toBe(3);
    expect(new Set(first.map(comment => comment.nickname)).size).toBe(3);

    const pool = WEIBO_COMMENT_POOLS[input.sceneId];
    const selectedEntries = first.map(comment =>
      pool.find(entry => entry.text === comment.text),
    );
    expect(selectedEntries[0]?.priority).toBe('direct');
    expect(selectedEntries.slice(1).every(entry => entry?.priority === 'secondary'))
      .toBe(true);
    expect(
      selectedEntries.every(entry => entry?.allowedOutcomes.includes(input.outcome)),
    ).toBe(true);
  });

  it('keeps comments inside the requested scene semantics', () => {
    const brandComments = generateSceneComments({
      sceneId: 'fan_brand_sales',
      outcome: 'success',
      seed: 'brand-post',
      artistNickPool: ['一颗甄糖', '甄帅数据组'],
    });
    const copyrightComments = generateSceneComments({
      sceneId: 'fan_fansite_copyright',
      outcome: 'backfire',
      seed: 'copyright-post',
      artistNickPool: ['一颗甄糖', '甄帅图站'],
    });

    expect(brandComments.every(comment => !/镜头|演技|嗑到|副歌/.test(comment.text)))
      .toBe(true);
    expect(copyrightComments.every(comment => !/销量|嗑到|舞台|演技/.test(comment.text)))
      .toBe(true);
  });

  it('uses artist nicknames only for artist-aligned roles', () => {
    const artistNickPool = ['一颗甄糖'];

    expect(selectNicknameForRole('fan', {
      seed: 'fan',
      artistNickPool,
    })).toContain('一颗甄糖');
    expect(selectNicknameForRole('data_fan', {
      seed: 'data',
      artistName: '甄帅',
      artistNickPool,
    })).toContain('甄帅');
    expect(selectNicknameForRole('casual', {
      seed: 'casual',
      artistNickPool,
    })).not.toContain('一颗甄糖');
    expect(selectNicknameForRole('former_fan', {
      seed: 'former',
      artistNickPool,
    })).not.toContain('一颗甄糖');
  });

  it('uses a distinct rival-fan role with rival identity substitution', () => {
    expect(RIVAL_FAN_NICK_POOLS.lin_c).toContain(
      selectNicknameForRole('rival_fan', {
        seed: 'rival-name',
        sceneId: 'fan_fandom_conflict',
        rivalName: '林C位',
      }),
    );
    expect(RIVAL_FAN_NICK_POOLS.lin_c).toContain(
      selectNicknameForRole('rival_fan', {
        seed: 'rival-identity',
        sceneId: 'burner_rival_smear',
        rival: { id: 'lin_c', name: '林C位' },
      }),
    );

    const comments = generateSceneComments({
      sceneId: 'fan_fandom_conflict',
      outcome: 'backfire',
      seed: 'lin-c-conflict',
      artistNickPool: ['一颗甄糖'],
      rival: { id: 'lin_c', name: '林C位' },
    });
    const rivalComment = comments.find(comment => comment.role === 'rival_fan');

    expect(rivalComment).toBeDefined();
    expect(RIVAL_FAN_NICK_POOLS.lin_c).toContain(rivalComment?.nickname);
    expect(rivalComment?.text).toContain('林C位');
    expect(rivalComment?.text).not.toContain('{rival}');
  });

  it('lets 林C位 fans answer a brand-sales comparison without borrowing 甄帅 nicknames', () => {
    const comments = generateSceneComments({
      sceneId: 'fan_brand_sales',
      outcome: 'success',
      seed: 'brand-rival-comparison',
      artistName: '甄帅',
      artistNickPool: ['{name}数据组', '一颗甄糖'],
      rivalName: '林C位',
    });
    const rivalComment = comments.find(comment => comment.role === 'rival_fan');

    expect(rivalComment).toBeDefined();
    expect(RIVAL_FAN_NICK_POOLS.lin_c).toContain(rivalComment?.nickname);
    expect(rivalComment?.text).toContain('林C位');
    expect(rivalComment?.nickname).not.toContain('甄帅');
  });

  it('resolves the current artist placeholder in aligned fan nicknames', () => {
    const nickname = selectNicknameForRole('data_fan', {
      seed: 'artist-name',
      artistName: '甄帅',
      artistNickPool: ['{name}应援站'],
    });

    expect(nickname).toContain('甄帅');
    expect(nickname).not.toContain('{name}');
  });

  it('does not emit rival-fan comments outside rivalry scenes', () => {
    const comments = generateSceneComments({
      sceneId: 'artist_selfie',
      outcome: 'backfire',
      seed: 'non-rival-scene',
      artistNickPool: ['一颗甄糖'],
      currentRival: { name: '林C位' },
    });

    expect(comments.every(comment => comment.role !== 'rival_fan')).toBe(true);
  });

  it('treats an exposed burner account as confirmed rather than speculative', () => {
    const comments = generateSceneComments({
      sceneId: 'burner_artist_impersonation',
      outcome: 'leaked',
      seed: 'confirmed-leak',
      artistName: '甄帅',
      artistNickPool: ['一颗甄糖'],
    });

    expect(comments.every(comment => !/没有认证|待确认|不能代替证据/.test(comment.text)))
      .toBe(true);
    expect(comments[0].text).toContain('扒实锤');
    expect(
      comments.filter(comment => {
        const entry = WEIBO_COMMENT_POOLS.burner_artist_impersonation
          .find(item => item.text === comment.text);
        return entry?.allowedOutcomes.length === 1
          && entry.allowedOutcomes[0] === 'leaked';
      }),
    ).toHaveLength(2);
  });
});

describe('legacy scene inference', () => {
  it('preserves an explicit scene and maps template IDs before keywords', () => {
    expect(inferLegacySceneId({
      sceneId: 'fan_brand_sales',
      templateId: 'post_selfie',
      content: '机场路透',
    })).toBe('fan_brand_sales');
    expect(inferLegacySceneId({
      templateId: 'post_selfie',
      content: '本站姐的版权图被盗了',
    })).toBe('artist_selfie');
    expect(inferLegacySceneId({
      templateId: 'weibo_template',
      content: '任意旧小号正文',
    })).toBe('burner_artist_impersonation');
  });

  it.each([
    ['本站姐澄清，营销号盗图已经发律师函', 'fan_fansite_copyright'],
    ['代言销量榜冲上去了，数据组继续下单', 'fan_brand_sales'],
    ['机场路透出来了，接机不要堵通道', 'fan_airport_sighting'],
    ['两家粉丝又开战了，对家别来碰瓷', 'fan_fandom_conflict'],
    ['偷拍视频还带酒店定位，私生离远点', 'fan_private_sighting'],
    ['最近有人说我恋爱了，先不回应', 'artist_romance_hint'],
    ['关于这次错误，我郑重道歉', 'artist_apology'],
  ])('infers "%s" as %s', (content, expected) => {
    expect(inferLegacySceneId({ content })).toBe(expected);
  });

  it('uses a neutral crisis scene when no legacy signal matches', () => {
    expect(inferLegacySceneId({ content: '先看看后续再说' }))
      .toBe('fan_crisis_watch');
  });

  it('hydrates legacy records without leaking outcome narration into content', () => {
    const hydrated = hydrateWeiboPostRecord({
      templateId: 'post_hint_romance',
      day: 3,
      wasBackfire: true,
    }, 'singer');

    expect(hydrated.id).toBe('weibo_post_hint_romance_3');
    expect(hydrated.sceneId).toBe('artist_romance_hint');
    expect(hydrated.outcome).toBe('backfire');
    expect(hydrated.content).not.toContain('粉丝直接炸了');
    expect(hydrated.engagement).toEqual(
      createStableEngagement(hydrated.id, hydrated.sceneId),
    );
  });

  it('upgrades persisted artist posts that still use the old low engagement scale', () => {
    const hydrated = hydrateWeiboPostRecord({
      id: 'legacy-low-engagement',
      templateId: 'post_work_photo',
      day: 1,
      sceneId: 'artist_work_photo',
      content: '旧微博',
      outcome: 'success',
      engagement: { likes: 85649, comments: 515, reposts: 6851 },
      wasBackfire: false,
    }, 'idol');

    expect(hydrated.engagement.likes).toBeGreaterThanOrEqual(120000);
    expect(hydrated.engagement.comments).toBeGreaterThanOrEqual(12000);
    expect(hydrated.engagement.reposts).toBeGreaterThanOrEqual(20000);
  });
});
