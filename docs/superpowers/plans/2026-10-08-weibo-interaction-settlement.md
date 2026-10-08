# Weibo Interaction Settlement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist Weibo likes and reposts and settle their gameplay consequences exactly once per account, post, and action.

**Architecture:** A pure engine resolves effects from interaction type, scene, stance, account, and post ownership. Zustand owns account-scoped visual state and one-time settlement markers, applies stat changes atomically, inserts trends, and returns feedback to `WeiboCard`.

**Tech Stack:** TypeScript, React 18, Zustand persist, Vitest, Next.js 14

---

### Task 1: Pure Interaction Resolver

**Files:**
- Create: `src/engine/weiboInteraction.ts`
- Create: `src/engine/weiboInteraction.test.ts`

- [ ] **Step 1: Write failing resolver tests**

Cover supportive, hostile, CP, private-sighting, burner-smear, small-account, and self-authored inputs:

```ts
expect(resolveWeiboInteraction({
  action: 'repost',
  account: 'artist',
  authorAccount: 'external',
  sceneId: 'burner_rival_smear',
  stance: 'hostile',
  artistName: '甄帅',
}).statChanges.prRisk).toBeGreaterThanOrEqual(7);
```

- [ ] **Step 2: Verify the tests fail**

Run:

```bash
npx vitest run src/engine/weiboInteraction.test.ts
```

Expected: FAIL because `weiboInteraction.ts` does not exist.

- [ ] **Step 3: Implement the resolver**

Export these contracts:

```ts
export type WeiboInteractionAction = 'like' | 'repost';
export type WeiboInteractionAccount = 'self' | 'artist';
export type WeiboPostAuthorAccount = WeiboInteractionAccount | 'external';

export interface WeiboInteractionResolution {
  statChanges: StatChange;
  feedback: string;
  trend?: Omit<WeiboTrend, 'rank'>;
}
```

Implement deterministic stance baselines, scene modifiers, small-account zero effects, and self-authored zero effects.

- [ ] **Step 4: Verify resolver tests pass**

Run:

```bash
npx vitest run src/engine/weiboInteraction.test.ts
```

Expected: all resolver tests pass.

### Task 2: Persisted Store Ledger

**Files:**
- Modify: `src/stores/types.ts`
- Modify: `src/stores/initialState.ts`
- Modify: `src/stores/gameStore.ts`
- Modify: `src/stores/gameStore.weibo.test.ts`

- [ ] **Step 1: Write failing Store tests**

Assert:

```ts
const first = store.interactWithWeiboPost(input);
const afterFirst = store.stats;
store.interactWithWeiboPost(input); // cancel
expect(store.stats).toEqual(afterFirst);
store.interactWithWeiboPost(input); // enable again
expect(store.stats).toEqual(afterFirst);
expect(first.settled).toBe(true);
```

Also test `self:` and `artist:` keys remain independent and small-account interaction has no stat delta.

- [ ] **Step 2: Add state and action types**

Add:

```ts
weiboInteractions: Record<string, WeiboInteractionState>;
interactWithWeiboPost: (
  input: WeiboInteractionInput,
) => { active: boolean; settled: boolean; feedback: string };
```

- [ ] **Step 3: Initialize the ledger**

Set `weiboInteractions: {}` in `makeFreshGameState()`. Existing persisted saves merge with this default.

- [ ] **Step 4: Implement atomic interaction updates**

Use functional Zustand `set(state => nextState)`. Build the key as `${state.burnerIdentity}:${input.postId}`. On cancellation, retain the settled marker. On first activation, call `resolveWeiboInteraction()`, use `applyStatChanges()`, update `peakRisk`, and prepend a rank-1 trend while shifting existing ranks.

- [ ] **Step 5: Verify Store tests pass**

Run:

```bash
npx vitest run src/stores/gameStore.weibo.test.ts
```

Expected: all identity-routing and interaction-settlement tests pass.

### Task 3: Connect WeiboCard

**Files:**
- Modify: `src/components/game/tabs/BurnerTab.tsx`

- [ ] **Step 1: Replace local like/repost state**

Read the current account-scoped state from:

```ts
const interaction = useGameStore(
  state => state.weiboInteractions[`${state.burnerIdentity}:${postId}`],
);
```

Keep comment expansion local because it has no gameplay consequence.

- [ ] **Step 2: Pass author metadata from every feed source**

Use:

```tsx
authorAccount="artist"   // normal artist history
authorAccount="self"     // burner feed or leaked burner history
authorAccount="external" // voyeur feed
authorStance={post.stance}
```

For records without an external stance, derive a conservative stance from outcome.

- [ ] **Step 3: Dispatch Store actions and show feedback**

Move the existing page `showToast` callback into `WeiboCard` as `onFeedback`. Like and repost buttons call `interactWithWeiboPost()` and display its returned message.

- [ ] **Step 4: Verify type safety**

Run:

```bash
npx tsc --noEmit
```

Expected: exit code 0.

### Task 4: Full Verification and Delivery

**Files:**
- Verify all modified files

- [ ] **Step 1: Run the complete suite**

```bash
npm test -- --run
npm run build
git diff --check
```

Expected: all tests pass, production build succeeds, and diff check is clean. Existing unrelated `StatsRadar.tsx` Hook warnings may remain.

- [ ] **Step 2: Review the final diff**

Confirm there are no unrelated edits and that old saves receive an empty interaction ledger.

- [ ] **Step 3: Commit and push**

```bash
git add docs/superpowers/specs/2026-10-08-weibo-interaction-settlement-design.md \
  docs/superpowers/plans/2026-10-08-weibo-interaction-settlement.md \
  src/engine/weiboInteraction.ts \
  src/engine/weiboInteraction.test.ts \
  src/stores/types.ts \
  src/stores/initialState.ts \
  src/stores/gameStore.ts \
  src/stores/gameStore.weibo.test.ts \
  src/components/game/tabs/BurnerTab.tsx
git commit -m "feat(weibo): settle account interactions"
git push origin main
```
