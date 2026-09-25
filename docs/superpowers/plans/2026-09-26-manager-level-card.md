# Manager Level Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the manager level display at the top of the Workspace tab.

**Architecture:** Extract the former `MeTab` manager profile into a focused `ManagerLevelCard` component. The component reads existing Zustand state and delegates all level calculations to `managerProgression.ts`; `WorkspaceTab` only places it above the collapse warning.

**Tech Stack:** React 18, TypeScript, Zustand, Framer Motion, Tailwind CSS, Vitest.

---

### Task 1: Extract the Manager Level Card

**Files:**
- Create: `src/components/game/features/ManagerLevelCard.tsx`
- Test: `src/engine/managerProgression.test.ts`

- [ ] **Step 1: Add level calculation tests**

```ts
import { describe, expect, it } from 'vitest';
import {
  getLevelFromXp,
  getLevelProgress,
  getNextLevel,
  matchSpecialTitle,
} from './managerProgression';

describe('manager progression display helpers', () => {
  it('resolves the initial level and progress', () => {
    expect(getLevelFromXp(0)).toMatchObject({ lv: 1, title: '实习经纪人' });
    expect(getNextLevel(1)?.minXp).toBe(80);
    expect(getLevelProgress(40, 1)).toBe(0.5);
  });

  it('uses special titles without changing the underlying level', () => {
    expect(matchSpecialTitle({
      commercialValue: 50,
      fanLoyalty: 50,
      prRisk: 95,
      money: 100000,
    })?.title).toBe('走钢丝的疯子');
    expect(getLevelFromXp(200).lv).toBe(3);
  });
});
```

- [ ] **Step 2: Run the focused test**

Run: `npx vitest run src/engine/managerProgression.test.ts`

Expected: PASS because it locks the existing progression behavior before UI extraction.

- [ ] **Step 3: Create `ManagerLevelCard`**

Move the former `MeTab` manager profile rendering into `src/components/game/features/ManagerLevelCard.tsx`. It must:

- read `stats`, `currentDay`, `artist`, `managerXp`, and `recentXpDeltas`;
- call `matchSpecialTitle`, `getLevelFromXp`, `getNextLevel`, and `getLevelProgress`;
- render normal, max-level, slumping, and special-title states;
- avoid displaying `undefined` when no artist exists;
- retain the existing orange XP progress treatment.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`

Expected: exit code 0.

### Task 2: Mount and Verify

**Files:**
- Modify: `src/components/game/tabs/WorkspaceTab.tsx`

- [ ] **Step 1: Mount the card**

Import `ManagerLevelCard` and render it as the first child inside the Workspace content container:

```tsx
<ManagerLevelCard />
<CollapseWarningPanel warning={collapseWarning} indicators={riskIndicators} />
```

- [ ] **Step 2: Run regressions**

Run: `npm test && npx tsc --noEmit && npm run build`

Expected: all tests pass, typecheck exits 0, production build succeeds.

- [ ] **Step 3: Browser verification**

Verify at mobile width:

- `实习经纪人 Lv.1` appears above `舆情雷达正常`;
- switching among `概览 / 大粉 / 保险` keeps the card visible;
- no overlap with the top stat bar or bottom navigation.

- [ ] **Step 4: Commit**

```bash
git add src/components/game/features/ManagerLevelCard.tsx src/components/game/tabs/WorkspaceTab.tsx src/engine/managerProgression.test.ts docs/superpowers/plans/2026-09-26-manager-level-card.md
git commit -m "fix(manager): restore level card in workspace"
```
