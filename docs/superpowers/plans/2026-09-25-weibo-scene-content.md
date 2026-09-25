# Weibo Scene Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace keyword-driven Weibo content generation with explicit scene IDs, artist-specific post voices, scene-aware comments, stable post snapshots, and legacy-save compatibility.

**Architecture:** Put content data in `src/data/weiboScenes.ts` and deterministic selection/migration logic in `src/engine/weiboContent.ts`. Store complete snapshots when posts are created; rendering reads snapshots and never substitutes outcome narration for post content. Existing persisted records remain readable through a legacy resolver.

**Tech Stack:** TypeScript, React 18, Zustand persist, Vitest, Next.js 14.

---

## File Structure

- Create `src/data/weiboScenes.ts`: scene IDs, structured comment pools, artist voice variants, image metadata.
- Create `src/engine/weiboContent.ts`: deterministic selection, comment composition, legacy scene inference, record hydration.
- Create `src/engine/weiboContent.test.ts`: scene coverage, semantic isolation, deterministic behavior, legacy migration.
- Modify `src/types/game.ts`: shared scene and snapshot types.
- Modify `src/data/weiboPosts.ts`: add scene IDs, common variants, artist variants, image requirements.
- Modify `src/data/voyeurPosts.ts`: annotate feed posts with explicit scene and stance.
- Modify `src/stores/types.ts`: annotate burner posts with scenes.
- Modify `src/stores/gameStore.ts`: choose content once and persist full snapshots.
- Modify `src/components/game/tabs/BurnerTab.tsx`: render snapshots and consume scene-aware comments.

### Task 1: Define Scene and Snapshot Contracts

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/stores/types.ts`
- Test: `src/engine/weiboContent.test.ts`

- [ ] **Step 1: Write the failing contract test**

Create `src/engine/weiboContent.test.ts` with imports that do not yet exist:

```ts
import { describe, expect, it } from 'vitest';
import {
  ARTIST_POST_SCENES,
  BURNER_SCENES,
  FAN_FEED_SCENES,
} from '@/data/weiboScenes';

describe('Weibo scene contracts', () => {
  it('defines all 25 planned scenes without duplicates', () => {
    const scenes = [...ARTIST_POST_SCENES, ...FAN_FEED_SCENES, ...BURNER_SCENES];
    expect(scenes).toHaveLength(25);
    expect(new Set(scenes).size).toBe(25);
  });
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `npx vitest run src/engine/weiboContent.test.ts`

Expected: FAIL because `@/data/weiboScenes` does not exist.

- [ ] **Step 3: Add shared types**

Add to `src/types/game.ts`:

```ts
export type WeiboSceneId =
  | 'artist_work_photo'
  | 'artist_late_night'
  | 'artist_controversy_response'
  | 'artist_work_promotion'
  | 'artist_fan_gift'
  | 'artist_charity'
  | 'artist_fight_haters'
  | 'artist_selfie'
  | 'artist_romance_hint'
  | 'artist_apology'
  | 'fan_brand_sales'
  | 'fan_fansite_copyright'
  | 'fan_airport_sighting'
  | 'fan_support_campaign'
  | 'fan_work_complaint'
  | 'fan_media_smear'
  | 'fan_cp_discussion'
  | 'fan_fandom_conflict'
  | 'fan_career_discussion'
  | 'fan_crisis_watch'
  | 'fan_persona_discussion'
  | 'fan_private_sighting'
  | 'burner_rival_smear'
  | 'burner_reverse_attack'
  | 'burner_artist_impersonation';

export type WeiboOutcome = 'success' | 'backfire' | 'leaked';
export type WeiboCommentRole =
  | 'fan'
  | 'casual'
  | 'data_fan'
  | 'fansite'
  | 'cp_fan'
  | 'anti'
  | 'former_fan'
  | 'rival_fan'
  | 'sasaeng';
export type WeiboCommentStance =
  | 'supportive'
  | 'skeptical'
  | 'hostile'
  | 'neutral'
  | 'procedural';

export interface WeiboEngagement {
  likes: number;
  comments: number;
  reposts: number;
}

export interface GeneratedWeiboComment {
  nickname: string;
  text: string;
  role: WeiboCommentRole;
  stance: WeiboCommentStance;
}
```

Extend `WeiboPostTemplate`:

```ts
sceneId: WeiboSceneId;
postVariants: string[];
artistPostVariants: Partial<Record<ArtistArchetype, string[]>>;
imageRequirement: 'required' | 'optional' | 'none';
imageSlot?: string;
```

Replace `WeiboPostRecord` with a backward-compatible snapshot:

```ts
export interface WeiboPostRecord {
  id?: string;
  templateId: string;
  sceneId?: WeiboSceneId;
  day: number;
  content?: string;
  outcome?: WeiboOutcome;
  engagement?: WeiboEngagement;
  imageKey?: string;
  /** Legacy field retained for persisted saves. */
  wasBackfire: boolean;
}
```

Extend `BurnerPost` in `src/stores/types.ts`:

```ts
sceneId?: WeiboSceneId;
outcome?: WeiboOutcome;
```

Import `WeiboSceneId` and `WeiboOutcome` from `@/types/game`.

- [ ] **Step 4: Add scene constants**

Create `src/data/weiboScenes.ts` and export the three readonly arrays using the exact 25 IDs from `WeiboSceneId`. Export `ALL_WEIBO_SCENES` as their concatenation.

- [ ] **Step 5: Run the contract test**

Run: `npx vitest run src/engine/weiboContent.test.ts`

Expected: PASS, one test.

- [ ] **Step 6: Commit**

```bash
git add src/types/game.ts src/stores/types.ts src/data/weiboScenes.ts src/engine/weiboContent.test.ts
git commit -m "feat(weibo): define explicit scene contracts"
```

### Task 2: Build Artist Post Voice Pools

**Files:**
- Modify: `src/data/weiboPosts.ts`
- Modify: `src/engine/weiboContent.test.ts`
- Create: `src/engine/weiboContent.ts`

- [ ] **Step 1: Add failing coverage tests**

Add:

```ts
import { artists } from '@/data/artists';
import { weiboPostTemplates } from '@/data/weiboPosts';
import { selectArtistPostContent } from './weiboContent';

it('provides three common and two artist-specific variants per template', () => {
  for (const template of weiboPostTemplates) {
    expect(template.postVariants.length).toBeGreaterThanOrEqual(3);
    for (const artist of artists) {
      expect(template.artistPostVariants[artist.id]?.length).toBeGreaterThanOrEqual(2);
    }
  }
});

it('selects stable artist-specific first-person content', () => {
  const template = weiboPostTemplates.find(item => item.id === 'post_hint_romance')!;
  const first = selectArtistPostContent(template, 'singer', 'record-1');
  const second = selectArtistPostContent(template, 'singer', 'record-1');
  expect(first).toBe(second);
  expect(template.artistPostVariants.singer).toContain(first);
  expect(first).not.toContain('粉丝直接炸了');
});
```

- [ ] **Step 2: Verify the tests fail**

Run: `npx vitest run src/engine/weiboContent.test.ts`

Expected: FAIL because templates do not expose the new fields and selector is missing.

- [ ] **Step 3: Add deterministic selection**

Create in `src/engine/weiboContent.ts`:

```ts
import type { ArtistArchetype, WeiboPostTemplate } from '@/types/game';

export function stableHash(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stablePick<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) throw new Error('stablePick requires a non-empty pool');
  return items[stableHash(seed) % items.length];
}

export function selectArtistPostContent(
  template: WeiboPostTemplate,
  artistId: ArtistArchetype,
  seed: string,
): string {
  const artistPool = template.artistPostVariants[artistId];
  return stablePick(
    artistPool && artistPool.length > 0 ? artistPool : template.postVariants,
    `${seed}:${template.sceneId}:${artistId}`,
  );
}
```

- [ ] **Step 4: Populate all 10 post templates**

For every template in `src/data/weiboPosts.ts`:

- Assign its matching `artist_*` scene ID.
- Replace singular `postContent` use with at least three natural common variants.
- Add at least two variants for each of `idol`, `actor`, `singer`, `influencer`, and `socialite`.
- Preserve `successNarration`, `backfireNarration`, effects, and trends as outcome-only data.
- Add image metadata according to the approved design.

Example for romance:

```ts
sceneId: 'artist_romance_hint',
postVariants: [
  '被爱着的每一天都值得记录。🌙 有些事，时候到了自然会告诉你们。',
  '今天有人提醒我，原来幸福真的会让人变得话多。先保密。',
  '最近很好。不是工作上的那种好。',
],
artistPostVariants: {
  idol: [
    '你们总问我最近为什么总在笑。答案先欠着，等合适的时候再说。',
    '今晚不聊工作，只想偷偷记录一个很开心的瞬间。',
  ],
  actor: [
    '生活不是剧本，但偶尔也会有让人舍不得喊停的一场戏。',
    '有些关系不需要急着定义，认真生活就好。',
  ],
  singer: [
    '最近写了一段旋律，还没想好该唱给谁听。',
    '有些和声，一个人唱不完整。',
  ],
  influencer: [
    '今天不分享链接，分享一点藏不住的好心情。',
    '最近状态很好，原因暂时不公开。懂的都懂。',
  ],
  socialite: [
    '晚餐、月色，以及没有出现在镜头里的人。',
    '私人时间不多，但今晚值得留档。',
  ],
},
imageRequirement: 'required',
imageSlot: 'romance_hint',
```

- [ ] **Step 5: Run tests and typecheck**

Run: `npx vitest run src/engine/weiboContent.test.ts && npx tsc --noEmit`

Expected: PASS with no TypeScript output.

- [ ] **Step 6: Commit**

```bash
git add src/data/weiboPosts.ts src/engine/weiboContent.ts src/engine/weiboContent.test.ts
git commit -m "feat(weibo): add artist-specific post voices"
```

### Task 3: Add Structured Scene Comment Pools

**Files:**
- Modify: `src/data/weiboScenes.ts`
- Modify: `src/engine/weiboContent.ts`
- Modify: `src/engine/weiboContent.test.ts`

- [ ] **Step 1: Add failing pool validation tests**

```ts
import { ALL_WEIBO_SCENES, WEIBO_COMMENT_POOLS } from '@/data/weiboScenes';
import { generateSceneComments } from './weiboContent';

it('gives every scene at least twelve comments and three roles', () => {
  for (const sceneId of ALL_WEIBO_SCENES) {
    const pool = WEIBO_COMMENT_POOLS[sceneId];
    expect(pool.length).toBeGreaterThanOrEqual(12);
    expect(new Set(pool.map(item => item.role)).size).toBeGreaterThanOrEqual(3);
  }
});

it('keeps brand-sales comments semantically relevant', () => {
  const comments = generateSceneComments({
    sceneId: 'fan_brand_sales',
    outcome: 'success',
    seed: 'brand-post',
    nickPool: ['一颗甄糖', '数据站'],
  });
  expect(comments).toHaveLength(3);
  expect(comments.every(item => !/镜头|演技|嗑到|副歌/.test(item.text))).toBe(true);
});

it('keeps copyright comments semantically relevant', () => {
  const comments = generateSceneComments({
    sceneId: 'fan_fansite_copyright',
    outcome: 'success',
    seed: 'copyright-post',
    nickPool: ['一颗甄糖', '站姐留档'],
  });
  expect(comments.every(item => !/脸太能打|销量|嗑到|舞台/.test(item.text))).toBe(true);
});
```

- [ ] **Step 2: Verify validation fails**

Run: `npx vitest run src/engine/weiboContent.test.ts`

Expected: FAIL because structured pools and generator are missing.

- [ ] **Step 3: Define structured comment entries**

In `src/data/weiboScenes.ts`, export:

```ts
export interface WeiboCommentEntry {
  text: string;
  role: WeiboCommentRole;
  stance: WeiboCommentStance;
  allowedOutcomes: WeiboOutcome[];
  artistIds?: ArtistArchetype[];
  priority?: 'direct' | 'secondary';
}

export const WEIBO_COMMENT_POOLS: Record<WeiboSceneId, WeiboCommentEntry[]> = {
  // All 25 scene keys are required.
};

export const COMMENT_NICK_POOLS: Record<WeiboCommentRole, string[]> = {
  fan: [],
  casual: [],
  data_fan: [],
  fansite: [],
  cp_fan: [],
  anti: [],
  former_fan: [],
  rival_fan: [],
  sasaeng: [],
};
```

Populate every scene with at least 12 entries and three roles. Include separate outcome-compatible reactions. Populate every role nickname pool with at least eight matching names. Artist-specific nicknames may only augment `fan`, `data_fan`, `fansite`, and `cp_fan`; `casual`, `anti`, `former_fan`, `sasaeng`, and `rival_fan` must use their own role pools. Rivalry scenes receive the current Rival identity and use dedicated pools for 林C位、晁可爱、葛王、王思琪、顾君庭. Use direct scene language:

```ts
fan_brand_sales: [
  { text: '已下单，销量截图记得带话题发超话。', role: 'data_fan', stance: 'procedural', allowedOutcomes: ['success'], priority: 'direct' },
  { text: '品牌销量榜已经升了，数据组今晚继续盯。', role: 'data_fan', stance: 'supportive', allowedOutcomes: ['success'], priority: 'direct' },
  { text: '买需要的就好，别为了数据超额消费。', role: 'casual', stance: 'neutral', allowedOutcomes: ['success', 'backfire'], priority: 'secondary' },
  // Add nine or more scene-specific entries.
],
fan_fansite_copyright: [
  { text: '支持维权，搬运连出处都不标真的很过分。', role: 'fan', stance: 'supportive', allowedOutcomes: ['success'], priority: 'direct' },
  { text: '原图、发布时间和搬运链接都先留证。', role: 'fansite', stance: 'procedural', allowedOutcomes: ['success', 'backfire'], priority: 'direct' },
  { text: '已经举报盗图营销号，等平台处理。', role: 'fan', stance: 'procedural', allowedOutcomes: ['success'], priority: 'secondary' },
  // Add nine or more scene-specific entries.
],
```

- [ ] **Step 4: Implement weighted, stable composition**

Add to `src/engine/weiboContent.ts`:

```ts
export function generateSceneComments(input: {
  sceneId: WeiboSceneId;
  outcome: WeiboOutcome;
  seed: string;
  nickPool: string[];
  artistId?: ArtistArchetype;
}): GeneratedWeiboComment[] {
  const eligible = WEIBO_COMMENT_POOLS[input.sceneId].filter(entry =>
    entry.allowedOutcomes.includes(input.outcome)
    && (!entry.artistIds || (input.artistId && entry.artistIds.includes(input.artistId)))
  );
  const direct = eligible.filter(entry => entry.priority === 'direct');
  const secondary = eligible.filter(entry => entry.priority !== 'direct');
  const selected = uniqueStablePicks(direct, 1, `${input.seed}:direct`)
    .concat(uniqueStablePicks(secondary, 2, `${input.seed}:secondary`));
  return selected.map((entry, index) => ({
    nickname: selectNicknameForRole(
      entry.role,
      input.nickPool,
      `${input.seed}:nick:${index}`,
    ),
    text: entry.text,
    role: entry.role,
    stance: entry.stance,
  }));
}
```

Implement `uniqueStablePicks` without mutating source arrays and prevent duplicate text or nickname within one rendered comment block.

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/engine/weiboContent.test.ts`

Expected: PASS for scene counts, roles, semantic isolation, and deterministic selection.

- [ ] **Step 6: Commit**

```bash
git add src/data/weiboScenes.ts src/engine/weiboContent.ts src/engine/weiboContent.test.ts
git commit -m "feat(weibo): add scene-aware comment pools"
```

### Task 4: Annotate Feed Sources and Legacy Fallback

**Files:**
- Modify: `src/data/voyeurPosts.ts`
- Modify: `src/engine/weiboContent.ts`
- Modify: `src/engine/weiboContent.test.ts`

- [ ] **Step 1: Add failing inference tests**

```ts
import { inferLegacySceneId } from './weiboContent';

it('maps old template IDs before trying keywords', () => {
  expect(inferLegacySceneId({ templateId: 'post_selfie', content: '任意旧正文' }))
    .toBe('artist_selfie');
});

it('uses keywords only for old feed records', () => {
  expect(inferLegacySceneId({ content: '本站姐澄清，营销号盗图已经发律师函' }))
    .toBe('fan_fansite_copyright');
  expect(inferLegacySceneId({ content: '代言销量榜冲上去了，数据组继续' }))
    .toBe('fan_brand_sales');
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npx vitest run src/engine/weiboContent.test.ts`

Expected: FAIL because `inferLegacySceneId` is missing.

- [ ] **Step 3: Annotate every voyeur post**

Extend `VoyeurPost` with required `sceneId`, `authorRole`, and `stance`. Assign scene IDs based on the actual post meaning, not matching words. The two screenshot examples must be:

```ts
{
  sceneId: 'fan_brand_sales',
  authorRole: 'data_fan',
  stance: 'supportive',
  content: '{name} 今天代言的那个牌子销量炸了！家人们冲一下超话，别让对家又阴阳我们没商业价值。',
}

{
  sceneId: 'fan_fansite_copyright',
  authorRole: 'fansite',
  stance: 'procedural',
  content: '本站姐澄清一下，今天机场那组图版权在我这，营销号搬运的都是盗图。已经发律师函了，别再传。',
}
```

Reactive posts must also receive explicit scenes. Keep archetype filters and numeric/tag matching behavior unchanged.

- [ ] **Step 4: Implement ordered legacy inference**

Implement `inferLegacySceneId` with this order:

1. exact `templateId` map;
2. high-specificity patterns such as copyright, brand sales, apology, romance, music, acting, airport;
3. broad crisis or fandom patterns;
4. `fan_crisis_watch` as a neutral legacy fallback.

Do not call inference for records that already contain `sceneId`.

- [ ] **Step 5: Run tests and typecheck**

Run: `npx vitest run src/engine/weiboContent.test.ts && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/voyeurPosts.ts src/engine/weiboContent.ts src/engine/weiboContent.test.ts
git commit -m "feat(weibo): annotate feed posts with explicit scenes"
```

### Task 5: Persist Stable Post Snapshots

**Files:**
- Modify: `src/stores/gameStore.ts`
- Modify: `src/engine/weiboContent.ts`
- Modify: `src/engine/weiboContent.test.ts`

- [ ] **Step 1: Add hydration and engagement tests**

```ts
import {
  createStableEngagement,
  hydrateWeiboPostRecord,
} from './weiboContent';

it('creates stable engagement for the same record seed', () => {
  expect(createStableEngagement('post-1', 'artist_romance_hint'))
    .toEqual(createStableEngagement('post-1', 'artist_romance_hint'));
});

it('hydrates a legacy backfire record with post content, not narration', () => {
  const record = hydrateWeiboPostRecord({
    templateId: 'post_hint_romance',
    day: 3,
    wasBackfire: true,
  }, 'singer');
  expect(record.sceneId).toBe('artist_romance_hint');
  expect(record.outcome).toBe('backfire');
  expect(record.content).not.toContain('粉丝直接炸了');
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npx vitest run src/engine/weiboContent.test.ts`

Expected: FAIL because snapshot helpers are missing.

- [ ] **Step 3: Implement snapshot helpers**

`createStableEngagement` must use `stableHash` and scene-specific ranges. `hydrateWeiboPostRecord` must:

- preserve existing snapshot fields;
- infer `sceneId` from `templateId`;
- derive `outcome` from legacy `wasBackfire`;
- choose one stable artist-specific正文 for missing `content`;
- generate engagement once from stable record seed;
- return a complete renderable record without mutating persisted input.

- [ ] **Step 4: Store complete records at post time**

In `postWeibo`:

```ts
const postId = `weibo_${currentDay}_${Date.now()}`;
const content = selectArtistPostContent(template, artist.id, postId)
  .replace(/\{name\}/g, artist.name);
const outcome = leaked ? 'leaked' : result.isBackfire ? 'backfire' : 'success';
const engagement = createStableEngagement(postId, template.sceneId);
```

If `burnerIdentity === 'artist'`, append `{ id, templateId, sceneId, day, content, outcome, engagement, wasBackfire }` to public artist history.

If `burnerIdentity === 'self'`, always append the post to `burnerFeed` with `burner_artist_impersonation`, even when exposed. A leaked post receives `outcome: 'leaked'`, public-scale engagement and a hot search, but it must retain the burner nickname and avatar. A non-leaked post keeps the current zero-cost behavior and private-scale engagement. Never put a burner-authored post into `weiboPostHistory`.

Annotate `smearRival` with `burner_rival_smear` and `reverseAttack` with `burner_reverse_attack`.

- [ ] **Step 5: Run tests and typecheck**

Run: `npx vitest run src/engine/weiboContent.test.ts && npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/stores/gameStore.ts src/engine/weiboContent.ts src/engine/weiboContent.test.ts
git commit -m "feat(weibo): persist stable post snapshots"
```

### Task 6: Render Scene-Aware Posts and Comments

**Files:**
- Modify: `src/components/game/tabs/BurnerTab.tsx`

- [ ] **Step 1: Remove local keyword pools**

Delete `COMMENT_TEXTS_BY_SENTIMENT`, `TOPIC_COMMENT_POOLS`, and `sampleCommentsForArtist`. Import `generateSceneComments`, `hydrateWeiboPostRecord`, and `inferLegacySceneId` from `@/engine/weiboContent`.

- [ ] **Step 2: Make `WeiboCard` scene-aware**

Replace `sentiment` and `contentText` props with:

```ts
sceneId: WeiboSceneId;
outcome: WeiboOutcome;
postId: string;
artistId?: ArtistArchetype;
```

Generate comments with:

```ts
const commentList = useMemo(
  () => generateSceneComments({
    sceneId,
    outcome,
    seed: postId,
    nickPool: nickPool ?? GENERIC_NICKS,
    artistId,
  }),
  [artistId, nickPool, outcome, postId, sceneId],
);
```

- [ ] **Step 3: Render snapshots**

For artist posts, call `hydrateWeiboPostRecord(rec, artist.id)` and display `record.content`. Never reference `successNarration` or `backfireNarration` from the feed rendering path.

For burner and voyeur posts, pass explicit `sceneId`; only invoke legacy inference if the persisted record lacks it.

Keep the existing result overlay unchanged so `lastPostNarration` still explains success, backfire, or leakage.

- [ ] **Step 4: Stabilize keys and interaction counts**

Use `record.id` for the React key and `record.engagement` for counts. Do not call `Math.random()` during render. Existing local like/repost toggles may remain UI-local until the separate account-risk feature is implemented.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`

Expected: no output and exit code 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/game/tabs/BurnerTab.tsx
git commit -m "fix(weibo): render scene-aware post snapshots"
```

### Task 7: Content Matrix and Full Regression

**Files:**
- Modify: `src/engine/weiboContent.test.ts`
- Create: `src/engine/weiboContent.matrix.test.ts`

- [ ] **Step 1: Add matrix assertions**

Loop over five artists, ten templates, and both outcomes. Assert:

- content is non-empty;
- content is not any success/backfire narration;
- content has no `{name}`, `哥哥/姐姐`, `他/她`, or `一姐/一哥`;
- generated comments have unique text and nicknames;
- each comment is allowed for the selected outcome.

- [ ] **Step 2: Add a human-readable matrix test**

Create `src/engine/weiboContent.matrix.test.ts`. Generate one block per artist/template/outcome and print it only when `WEIBO_CONTENT_REPORT=1`:

```text
[高八度] [artist_romance_hint] [backfire]
正文: 最近写了一段旋律，还没想好该唱给谁听。
评论:
- 糕糕的话筒: ...
- 八哥新歌循环中: ...
- 路人甲: ...
```

Exit with code 1 when placeholders, duplicate comments, narration leakage, or missing pools are detected.

- [ ] **Step 3: Run focused tests**

Run: `npx vitest run src/engine/weiboContent.test.ts`

Expected: all tests PASS.

- [ ] **Step 4: Run full regression**

Run: `npm test && npx tsc --noEmit && npm run build`

Expected: all Vitest suites pass, TypeScript exits 0, and Next.js build succeeds.

- [ ] **Step 5: Run content validation**

Run: `WEIBO_CONTENT_REPORT=1 npx vitest run src/engine/weiboContent.matrix.test.ts --reporter=verbose`

Expected: 100 artist/template/outcome samples, zero validation errors.

- [ ] **Step 6: Prepare image brief**

After content validation, create `docs/weibo-image-brief.md` listing only assets referenced by `imageSlot`. Each item must include artist, scene, purpose, composition, wardrobe, environment, lighting, lens/framing, aspect ratio, prohibited elements, and final filename.

- [ ] **Step 7: Commit**

```bash
git add src/engine/weiboContent.test.ts src/engine/weiboContent.matrix.test.ts docs/weibo-image-brief.md
git commit -m "test(weibo): validate scene content matrix"
```
