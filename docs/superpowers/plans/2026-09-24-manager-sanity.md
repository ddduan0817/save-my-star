# Manager Sanity System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a second-perspective "Manager Sanity" mechanic that introduces visual distortion, locked choices, and high-risk "insane events" when the manager's stress is too high.

**Architecture:** Add `managerSanity` to the global Zustand store. Modify daily and event-driven state updates to drain/recover sanity. Intercept event and choice generation to twist text and disable rational options when sanity is low. Add a new high-priority pool of insane events and corresponding unique endings. Overlay CSS filters globally via `page.tsx` for low-sanity visual feedback.

**Tech Stack:** React, Tailwind CSS, Zustand, TypeScript

---

### Task 1: Add Manager Sanity to Store & Types

**Files:**
- Modify: `src/types/game.ts`
- Modify: `src/stores/types.ts`
- Modify: `src/stores/initialState.ts`
- Modify: `src/stores/gameStore.ts`

- [ ] **Step 1: Update EndingId type**
In `src/types/game.ts`, add the 4 new endings to `EndingId`:
```typescript
  | 'jail'
  | 'quit'
  | 'betrayed'
  | 'flipped_board'
```

- [ ] **Step 2: Add managerSanity to GameState**
In `src/stores/types.ts`, add `managerSanity: number;` to the `GameState` interface under the `// Core state` block.

- [ ] **Step 3: Initialize managerSanity**
In `src/stores/initialState.ts`, inside `makeFreshGameState()`, add `managerSanity: 100,` alongside the other core state initializers (like `currentDay: 0`).

- [ ] **Step 4: Drain sanity on PR risk increase**
In `src/stores/gameStore.ts`, inside the `selectChoice` action, before calling `set({ ... })`:
```typescript
    const prRiskIncrease = result.newStats.prRisk - stats.prRisk;
    let newManagerSanity = get().managerSanity;
    if (prRiskIncrease > 0) {
      newManagerSanity = Math.max(0, newManagerSanity - Math.floor(prRiskIncrease / 2));
    }
```
Add `managerSanity: newManagerSanity,` to the `set({ ... })` call in `selectChoice`.

- [ ] **Step 5: Handle pending twist PR risk increase**
In `src/stores/gameStore.ts`, inside the `dismissOutcome` action, where `pendingTwist` is handled:
```typescript
      const prRiskIncrease = twistStats.prRisk - stats.prRisk;
      let newManagerSanity = get().managerSanity;
      if (prRiskIncrease > 0) {
        newManagerSanity = Math.max(0, newManagerSanity - Math.floor(prRiskIncrease / 2));
      }
```
Add `managerSanity: newManagerSanity,` to the `set({ ... })` call for the `showing_twist` transition.

### Task 2: Implement Daily Sanity Updates

**Files:**
- Modify: `src/stores/actions/endDay.ts`

- [ ] **Step 1: Calculate daily passive sanity changes**
In `src/stores/actions/endDay.ts`, just before the `startNewDay` call:
```typescript
    let newManagerSanity = get().managerSanity;
    
    // Drain sanity if artist is uncooperative
    if (newMentalState.cooperation < 20) {
      newManagerSanity = Math.max(0, newManagerSanity - 5);
    }
    
    // Recover sanity if no crisis event was handled today
    const todayDecisions = get().decisionHistory.filter(d => d.day === currentDay);
    const hadCrisis = todayDecisions.some(d => {
      const e = findEventById(d.eventId);
      return e && e.category === 'crisis';
    });
    if (!hadCrisis) {
      newManagerSanity = Math.min(100, newManagerSanity + 5);
    }
```
Add `managerSanity: newManagerSanity,` to the final `set({ ... })` call at the bottom of `endDay.ts`.

- [ ] **Step 2: Pass sanity to event selection**
In `src/stores/actions/endDay.ts`, update the `startNewDay` call to pass sanity:
```typescript
    const result = startNewDay(
      currentDay + 1,
      newStats,
      eventUsageMap,
      newActiveTags,
      artist?.id,
      { mental: newMentalState, lowMoodStreak: newLowMoodStreak, sanity: newManagerSanity },
      seasonalModifiers
    );
```

### Task 3: Choice Distortion & Insane Event Engine Support

**Files:**
- Modify: `src/engine/gameEngine.ts`
- Modify: `src/engine/eventSelector.ts`

- [ ] **Step 1: Update gameEngine type signatures**
In `src/engine/gameEngine.ts`, update the `mentalContext` parameter in `startNewDay` to include `sanity: number;`. Pass it down to `selectEventsForDay`.

- [ ] **Step 2: Update eventSelector type signatures**
In `src/engine/eventSelector.ts`, update the `mentalContext` parameter in `selectEventsForDay` to include `sanity: number;`.

- [ ] **Step 3: Implement choice distortion logic**
In `src/engine/eventSelector.ts`, add a helper function `applySanityDistortion`:
```typescript
function applySanityDistortion(event: GameEvent, sanity: number): GameEvent {
  if (sanity >= 30) return event;
  
  return {
    ...event,
    choices: event.choices.map(c => {
      // Disable safe/calm choices (e.g., options that decrease PR risk without costing money, or simply 'wait it out')
      // As a heuristic, if a choice requires no money and lowers PR risk, or has '道歉' / '冷静' in text
      const isCalm = c.text.includes('道歉') || c.text.includes('冷静') || c.text.includes('耐心') || c.text.includes('沉默');
      if (isCalm) {
        return {
          ...c,
          text: `[理智断线] ${c.text}`,
          subtext: '你现在气得发抖，根本做不到。',
          requireMinMoney: 999999999, // effectively locked
        };
      }
      return {
        ...c,
        text: `[暴躁] ${c.text}`
      };
    })
  };
}
```

- [ ] **Step 4: Apply distortion to selected events**
In `src/engine/eventSelector.ts`, modify `selectEventsForDay` to map `applySanityDistortion` over the final array of selected events, using `mentalContext?.sanity ?? 100`. (Do this right before `return finalEvents;`).

### Task 4: The Insane Event Pool

**Files:**
- Create: `src/data/events/insane.ts`
- Modify: `src/engine/eventSelector.ts`

- [ ] **Step 1: Create the insane events data**
Create `src/data/events/insane.ts` with the 4 high-stakes events:
```typescript
import type { GameEvent } from '@/types/game';

export const insaneEvents: GameEvent[] = [
  {
    id: 'insane_fake_stalker',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    title: '【理智崩溃】造神计划',
    description: '看着惨淡的数据，你脑子里冒出一个疯狂的想法：自导自演一场私生饭跟踪事件，用虐粉来固粉。',
    emoji: '🎭',
    choices: [
      {
        id: 'do_it',
        text: '立刻雇人去酒店蹲点演戏',
        outcome: {
          narration: '热搜爆了。粉丝心疼得疯狂做数据，忠诚度瞬间拉满。但这颗雷，埋下了。',
          statChanges: { fanLoyalty: 100, prRisk: -20 },
          unlockTag: 'fake_stalker_bomb'
        }
      }
    ]
  },
  {
    id: 'insane_leak_rival',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    title: '【理智崩溃】围魏救赵',
    description: '公关部束手无策，为了压下现在的热搜，你决定把对家影帝的致命黑料匿名发给狗仔。',
    emoji: '💣',
    choices: [
      {
        id: 'leak_it',
        text: '按下发送键，让他替我们死',
        outcome: {
          narration: '全网都在吃新瓜，你们的危机瞬间解除了。但业内都知道是你干的，你上了资本的黑名单。',
          statChanges: { prRisk: -100 },
          unlockTag: 'industry_enemy'
        }
      }
    ]
  },
  {
    id: 'insane_extreme_pua',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    title: '【理智崩溃】PUA 大师',
    description: '艺人抱怨太累，你直接把两亿违约金合同拍在桌上：“想走？先把钱结了。”',
    emoji: '👹',
    choices: [
      {
        id: 'threaten',
        text: '冷酷地逼迫TA服从',
        outcome: {
          narration: '艺人被吓住了，彻底变成了听话的机器。但TA的眼神里，有什么东西死掉了。',
          statChanges: { commercialValue: 20 },
          mentalEffect: { cooperation: 100, burnout: 80, stress: 80, mood: -100, trust: -100 }
        }
      }
    ]
  },
  {
    id: 'insane_scorched_earth',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    title: '【理智崩溃】同归于尽',
    description: '公司高层让你引咎辞职来平息众怒。你看着抽屉里的阴阳合同副本，冷笑了一声。',
    emoji: '🔥',
    choices: [
      {
        id: 'report_all',
        text: '实名举报，大家一起死',
        outcome: {
          narration: '你带着材料走进了税务局。',
          statChanges: {},
          unlockTag: 'trigger_flipped_board'
        }
      }
    ]
  }
];
```

- [ ] **Step 2: Inject insane events when sanity is critical**
In `src/engine/eventSelector.ts`, import `insaneEvents`. At the top of `selectEventsForDay`, add:
```typescript
  if (mentalContext && mentalContext.sanity < 15) {
    const unusedInsane = insaneEvents.filter(e => !eventUsageMap[e.id]);
    if (unusedInsane.length > 0) {
      // Pick one insane event randomly and return it immediately as a breaking event
      const picked = unusedInsane[Math.floor(Math.random() * unusedInsane.length)];
      return [picked];
    }
  }
```

### Task 5: New Endings & Triggers

**Files:**
- Modify: `src/data/endings.ts`
- Modify: `src/data/events/chains-extended.ts` (or similar file for follow-ups)

- [ ] **Step 1: Add new endings**
In `src/data/endings.ts`, add the new endings:
```typescript
  {
    id: 'jail',
    title: '铁窗泪',
    subtitle: '高风险的代价',
    description: '你当初埋下的那些雷终于爆了。伪造事件、恶意操纵舆论……当调查组找上门时，公司毫不犹豫地把你推出去顶罪。艺人很快换了新经纪人，而你只能在铁窗里看TA的新闻。',
    emoji: '🚓',
    rarity: 'rare',
    color: 'from-gray-800 to-gray-600',
    priority: 150,
    conditions: (_stats, tags) => tags.includes('trigger_jail'),
  },
  {
    id: 'flipped_board',
    title: '掀翻棋盘',
    subtitle: '我不好过，大家别活',
    description: '你的实名举报引发了娱乐圈大地震。半数以上的头部艺人和资本被查，曾经高高在上的公司高管全进去了。你虽然再也无法在这个行业立足，但看着热搜上天天都是塌房通报，你点了一支烟，深藏功与名。',
    emoji: '🃏',
    rarity: 'legendary',
    color: 'from-red-900 to-black',
    priority: 200,
    conditions: (_stats, tags) => tags.includes('trigger_flipped_board'),
  },
  {
    id: 'quit',
    title: '提前退休',
    subtitle: '这破班谁爱上谁上',
    description: '理智断线的那一刻，你突然释然了。你把工牌甩在老板脸上，删了所有工作群。看着手机里 99+ 的未读消息，你买了一张去大理的单程机票。娱乐圈少了一个金牌经纪人，世界上多了一个快乐的普通人。',
    emoji: '✈️',
    rarity: 'rare',
    color: 'from-blue-400 to-cyan-300',
    priority: 140,
    conditions: (_stats, tags) => tags.includes('trigger_quit'),
  },
  {
    id: 'betrayed',
    title: '众叛亲离',
    subtitle: '你捧红的星星刺向了你',
    description: 'TA 在采访时突然失控，声泪俱下地控诉你长期的压榨和精神控制。平时你树敌太多，墙倒众人推。你亲手打造的完美人设，成了砸死你自己的最后一块石头。',
    emoji: '🗡️',
    rarity: 'rare',
    color: 'from-purple-900 to-slate-800',
    priority: 130,
    conditions: (_stats, _tags, _day, _peakRisk, mental) => (mental?.trust ?? 100) === 0 && (mental?.cooperation ?? 100) === 0,
  }
```

- [ ] **Step 2: Add trigger event for fake stalker bomb**
In `src/data/events/meta-events.ts` (or `random.ts`), add an event that triggers the jail ending if `fake_stalker_bomb` is active:
```typescript
  {
    id: 'police_investigation',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    requiredTags: ['fake_stalker_bomb'],
    title: '警方通报',
    description: '警方查明之前的“私生饭跟踪”系工作室自导自演。舆论哗然，官媒点名批评。',
    emoji: '🚨',
    choices: [
      {
        id: 'take_blame',
        text: '自己揽下所有罪责',
        outcome: {
          narration: '你被带走了。',
          statChanges: {},
          unlockTag: 'trigger_jail'
        }
      }
    ]
  }
```

### Task 6: UI and Visual Feedback

**Files:**
- Modify: `src/components/game/stats/StatsBar.tsx`
- Modify: `src/app/game/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add sanity indicator to StatsBar**
In `src/components/game/stats/StatsBar.tsx`:
```tsx
  const managerSanity = useGameStore(s => s.managerSanity);
```
Add the badge next to the `CollapseWarningBadge`:
```tsx
          <CollapseWarningBadge level={collapseWarning.level} />
          {managerSanity !== undefined && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors",
              managerSanity < 20 ? "bg-red-100 text-red-600 animate-pulse" :
              managerSanity < 40 ? "bg-orange-100 text-orange-600" :
              managerSanity < 70 ? "bg-yellow-100 text-yellow-600" :
              "bg-green-100 text-green-600"
            )}>
              🧠 {managerSanity}
            </span>
          )}
```

- [ ] **Step 2: Add global sanity filter CSS**
In `src/app/globals.css`, add:
```css
.sanity-vignette {
  box-shadow: inset 0 0 120px rgba(153, 27, 27, 0.15);
  background-color: rgba(153, 27, 27, 0.03);
}
.sanity-glitch {
  animation: glitch-pulse 2s infinite ease-in-out;
}
@keyframes glitch-pulse {
  0%, 100% { box-shadow: inset 0 0 50px rgba(153, 27, 27, 0.1); background-color: rgba(153, 27, 27, 0.05); }
  50% { box-shadow: inset 0 0 150px rgba(153, 27, 27, 0.3); background-color: rgba(153, 27, 27, 0.1); }
}
```

- [ ] **Step 3: Render sanity overlay**
In `src/app/game/page.tsx`, select `managerSanity`:
```tsx
  const managerSanity = useGameStore(s => s.managerSanity);
```
And immediately inside the return's wrapper div `<div className="min-h-screen px-4 py-8 relative">`, add the overlay:
```tsx
      {managerSanity !== undefined && managerSanity < 40 && (
        <div className={cn(
          "pointer-events-none fixed inset-0 z-[100] mix-blend-multiply transition-all duration-1000",
          managerSanity < 20 ? "sanity-glitch" : "sanity-vignette"
        )} />
      )}
```