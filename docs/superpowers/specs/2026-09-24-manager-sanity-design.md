# Manager Sanity System Design Spec

## 1. Overview
Introduce a second-perspective gameplay mechanic focusing on the manager's mental state ("Sanity"). This system breaks the fourth wall, making the player manage not only the artist's career but their own mental health. High stress leads to visual distortions, locked rational choices, and a unique pool of "Insane Events" featuring black comedy and extreme risk-reward trade-offs.

## 2. Core Mechanics
- **Manager Sanity (理智值)**: A new numeric stat (0-100), starting at 100.
- **Passive Decrease**: 
  - Increases in PR Risk drain Sanity proportionally (e.g., +10 PR Risk = -5 Sanity).
  - Low artist cooperation (< 20) drains Sanity during end-of-day calculation (-5/day).
- **Passive Recovery**: If no crisis events occur, recover +5 Sanity at the end of the day.

## 3. UI & Visual Feedback (No New Pages)
- **Status Indicator**: Add a small sanity icon (e.g., a brain or heartbeat line) in the `StatsBar` or `TabBar` near the "My Profile" tab. Color shifts from green -> yellow -> orange -> blinking red as sanity drops.
- **Sanity Filters (Global CSS)**:
  - `< 40 Sanity`: A faint red tint overlays the background (`bg-[#faf8f5]`), with slight vignette corners.
  - `< 20 Sanity`: Screen edges flash with red noise/glitch effects briefly when making choices, simulating a migraine or panic attack.

## 4. Choice Distortion (The Mechanics of Losing Control)
Intercept event resolution in `src/engine/eventSelector.ts`:
- **When Sanity < 30**:
  - **Locked Options**: Rational, low-risk choices (e.g., "Wait it out", "Issue a calm apology") are disabled (grayed out or crossed out).
  - **Twisted Text**: Normal choice text is prefixed with angry inner thoughts (e.g., `[烦躁] 随便发个声明应付一下`).

## 5. The "Insane Event" Pool (发疯事件池)
When Sanity < 15, regular events are overridden by high-priority "Insane Events". These offer immediate crisis resolution but plant catastrophic long-term bombs.

**Event Examples:**
1. **【造神计划】 (Creating a False God)**
   - *Context*: Losing fans rapidly.
   - *Insane Choice*: "Stage a fake stalker incident to gain sympathy."
   - *Outcome*: Fan loyalty maxes out instantly. However, a hidden flag is set. Future random events may trigger police discovery, leading to the **【法制咖】 (Banned by Law)** ending.

2. **【热搜对冲】 (Distraction Tactics)**
   - *Context*: PR Risk is critically high.
   - *Insane Choice*: "Leak a massive scandal about a rival A-lister to the paparazzi."
   - *Outcome*: PR Risk resets to 0. But a hidden "Industry Enemy" modifier is applied, doubling the difficulty of acquiring future business deals.

3. **【PUA 大师】 (The Ultimate PUA)**
   - *Context*: Artist is uncooperative and threatening to quit.
   - *Insane Choice*: "Slam a 200-million penalty contract on the table."
   - *Outcome*: Artist cooperation locks to 100 (complete puppet). Manager Sanity recovers. However, artist burnout and stress double daily, almost guaranteeing a sudden **【退圈宣言】 (Retirement)** ending within days.

4. **【同归于尽】 (Scorched Earth)**
   - *Context*: Company executives demand the manager take the fall for a scandal.
   - *Insane Choice*: "Take everyone down. Report the entire studio's tax evasion to the authorities with real names."
   - *Outcome*: Triggers the immediate hidden true ending: **【掀翻棋盘】 (Flipping the Board)** - You single-handedly reshuffle the entertainment industry.

## 6. Implementation Scope
- Update `GameStats` interface and `useGameStore` to include `managerSanity`.
- Modify `endDay.ts` to handle daily sanity adjustments.
- Update `StatsBar.tsx` for the visual indicator and global layout for filters.
- Update `eventSelector.ts` to handle choice locking/text replacement based on sanity.
- Create `src/data/events/insane.ts` for the new event pool and integrate it into the event selection logic with top priority when sanity < 15.
- Add new endings to `src/data/endings.ts`.
