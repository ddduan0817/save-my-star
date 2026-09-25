import { describe, expect, it } from 'vitest';
import { artists } from '@/data/artists';
import { getRivalForArtist } from '@/data/rivals';
import { getWeiboPostImage, weiboPostTemplates } from '@/data/weiboPosts';
import { WEIBO_COMMENT_POOLS } from '@/data/weiboScenes';
import {
  generateSceneComments,
  selectArtistPostContent,
} from './weiboContent';
import { resolveWeiboPost } from './weiboPostEngine';
import type { WeiboOutcome } from '@/types/game';

const FORBIDDEN_PLACEHOLDERS = /\{(?:name|rival)\}|哥哥\/姐姐|他\/她|一姐\/一哥/;

describe('Weibo content matrix', () => {
  it('covers five artists, ten actions and both public outcomes', () => {
    const outcomes: WeiboOutcome[] = ['success', 'backfire'];
    const report: string[] = [];
    let cases = 0;

    for (const artist of artists) {
      const rival = getRivalForArtist(artist.id);
      for (const template of weiboPostTemplates) {
        expect(template.postVariants.length, template.id).toBeGreaterThanOrEqual(3);
        expect(
          template.artistPostVariants[artist.id]?.length,
          `${artist.id}:${template.id}`,
        ).toBeGreaterThanOrEqual(2);

        for (const outcome of outcomes) {
          const seed = `${artist.id}:${template.id}:${outcome}`;
          const content = selectArtistPostContent(template, artist.id, seed)
            .replace(/\{name\}/g, artist.name);
          const comments = generateSceneComments({
            sceneId: template.sceneId,
            outcome,
            seed,
            artistId: artist.id,
            artistName: artist.name,
            artistNickPool: [],
            rivalName: rival.name,
          });

          expect(content.trim(), seed).not.toBe('');
          expect(content, seed).not.toBe(template.successNarration);
          expect(content, seed).not.toBe(template.backfireNarration);
          expect(content, seed).not.toMatch(FORBIDDEN_PLACEHOLDERS);
          expect(comments, seed).toHaveLength(3);
          expect(new Set(comments.map(item => item.text)).size, seed).toBe(3);
          expect(new Set(comments.map(item => item.nickname)).size, seed).toBe(3);
          expect(
            comments.every(item => !FORBIDDEN_PLACEHOLDERS.test(item.text)),
            seed,
          ).toBe(true);

          for (const comment of comments) {
            const matchingEntry = WEIBO_COMMENT_POOLS[template.sceneId].find(
              entry => entry.text.replace(/\{rival\}/g, rival.name) === comment.text,
            );
            expect(matchingEntry, `${seed}:${comment.text}`).toBeDefined();
            expect(matchingEntry?.allowedOutcomes, `${seed}:${comment.text}`)
              .toContain(outcome);
          }

          if (process.env.WEIBO_CONTENT_REPORT === '1') {
            report.push(
              `[${artist.name}] [${template.sceneId}] [${outcome}]`,
              `正文: ${content}`,
              '评论:',
              ...comments.map(item => `- ${item.nickname}: ${item.text}`),
              '',
            );
          }
          cases += 1;
        }
      }
    }

    expect(cases).toBe(100);
    if (report.length > 0) console.log(report.join('\n'));
  });

  it('keeps every authored variant unique and free of outcome narration', () => {
    const allVariants: string[] = [];

    for (const template of weiboPostTemplates) {
      const variants = [
        ...template.postVariants,
        ...Object.values(template.artistPostVariants).flatMap(pool => pool ?? []),
      ];
      allVariants.push(...variants);

      for (const content of variants) {
        expect(content, `${template.id}:${content}`).not.toMatch(FORBIDDEN_PLACEHOLDERS);
        expect(content, template.id).not.toBe(template.successNarration);
        expect(content, template.id).not.toBe(template.backfireNarration);
      }
    }

    expect(allVariants).toHaveLength(130);
    expect(new Set(allVariants).size).toBe(allVariants.length);
  });

  it('uses a negative trend title when the selected post backfires', () => {
    const template = weiboPostTemplates.find(item => item.id === 'post_hint_romance')!;
    const result = resolveWeiboPost(template, {
      commercialValue: 45,
      fanLoyalty: 55,
      prRisk: 25,
      money: 200000,
    }, 'idol', '甄帅');

    expect(result.isBackfire).toBe(true);
    expect(result.trendEntry.title).toBe('#甄帅恋情暗示引发脱粉#');
    expect(result.trendEntry.sentiment).toBe('negative');
  });

  it('maps only delivered artist image assets', () => {
    expect(getWeiboPostImage('idol', 'work_photo'))
      .toBe('./weibo/idol/work_photo.jpg');
    expect(getWeiboPostImage('idol', 'romance_hint'))
      .toBe('./weibo/idol/romance_hint.jpg');
    expect(getWeiboPostImage('actor', 'work_photo'))
      .toBe('./weibo/actor/work_photo.jpg');
    expect(getWeiboPostImage('actor', 'fan_gift'))
      .toBe('./weibo/actor/fan_gift.jpg');
    expect(getWeiboPostImage('singer', 'work_photo')).toBeUndefined();
    expect(getWeiboPostImage('idol')).toBeUndefined();
  });

  it('treats Leng Bingning as an actor after her influencer career', () => {
    const artist = artists.find(item => item.id === 'influencer');
    expect(artist?.title).toBe('网红转型演员');

    const actingTemplateIds = new Set([
      'post_work_photo',
      'post_late_night',
      'post_promote_work',
      'post_fan_gift',
      'post_charity',
      'post_selfie',
      'post_hint_romance',
    ]);

    weiboPostTemplates
      .filter(template => actingTemplateIds.has(template.id))
      .forEach(template => {
        const variants = template.artistPostVariants.influencer ?? [];
        expect(variants, template.id).toHaveLength(2);
        expect(variants.join(''), template.id).not.toMatch(/直播间|选品|商品陈列/);
      });
  });
});
