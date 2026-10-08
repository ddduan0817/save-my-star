import { describe, expect, it } from 'vitest';
import { resolveWeiboInteraction } from './weiboInteraction';

describe('resolveWeiboInteraction', () => {
  it('keeps burner-account interactions private and effect-free', () => {
    const result = resolveWeiboInteraction({
      action: 'repost',
      account: 'self',
      authorAccount: 'external',
      sceneId: 'burner_rival_smear',
      stance: 'hostile',
      artistName: '甄帅',
    });

    expect(result.statChanges).toEqual({});
    expect(result.trend).toBeUndefined();
    expect(result.feedback).toContain('小号');
  });

  it('does not settle gameplay effects on self-authored posts', () => {
    const result = resolveWeiboInteraction({
      action: 'like',
      account: 'artist',
      authorAccount: 'artist',
      sceneId: 'artist_work_photo',
      stance: 'supportive',
      artistName: '甄帅',
    });

    expect(result.statChanges).toEqual({});
    expect(result.trend).toBeUndefined();
    expect(result.feedback).toContain('自己的微博');
  });

  it('rewards an artist-account repost of supportive fan content', () => {
    const result = resolveWeiboInteraction({
      action: 'repost',
      account: 'artist',
      authorAccount: 'external',
      sceneId: 'fan_support_campaign',
      stance: 'supportive',
      artistName: '甄帅',
    });

    expect(result.statChanges.fanLoyalty).toBeGreaterThanOrEqual(3);
    expect(result.statChanges.commercialValue).toBe(1);
    expect(result.feedback).toContain('粉丝');
  });

  it('makes hostile rival-smear reposts strongly risky and trending', () => {
    const result = resolveWeiboInteraction({
      action: 'repost',
      account: 'artist',
      authorAccount: 'external',
      sceneId: 'burner_rival_smear',
      stance: 'hostile',
      artistName: '甄帅',
    });

    expect(result.statChanges.prRisk).toBeGreaterThanOrEqual(11);
    expect(result.statChanges.fanLoyalty).toBeLessThan(0);
    expect(result.trend?.title).toContain('甄帅');
    expect(result.trend?.title).toContain('转发');
  });

  it('turns an artist-account CP repost into relationship speculation', () => {
    const result = resolveWeiboInteraction({
      action: 'repost',
      account: 'artist',
      authorAccount: 'external',
      sceneId: 'fan_cp_discussion',
      stance: 'supportive',
      artistName: '甄帅',
    });

    expect(result.statChanges.prRisk).toBeGreaterThanOrEqual(4);
    expect(result.trend?.title).toContain('CP');
  });

  it('treats liking private sightings as public confirmation', () => {
    const result = resolveWeiboInteraction({
      action: 'like',
      account: 'artist',
      authorAccount: 'external',
      sceneId: 'fan_private_sighting',
      stance: 'skeptical',
      artistName: '甄帅',
    });

    expect(result.statChanges.prRisk).toBeGreaterThanOrEqual(5);
    expect(result.trend?.title).toContain('私生活');
  });
});
