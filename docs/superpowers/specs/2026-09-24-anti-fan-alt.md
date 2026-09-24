# 黑粉小号（Anti-Fan Alt Account）Spec

## 定位
经纪人的阴暗面出口：白天体面救火，深夜化身黑粉。视奸粉圈拿情报 + 亲手操控舆论。

## 入口
- 位置：MeTab 中 Weibo Trending 卡片下方，新增"🌙 深夜小号"浮标。
- 显隐条件：`managerStress >= 30` 且当前时间段为"深夜"（简化：`currentDay >= 3` 后每日均可见，白天可见但入口配色偏冷、按钮微抖动，配合 Meta 感）。
- 首次点击弹一次性 onboarding 卡（"你注册了一个匿名小号……"）。

## 每日行动（方案 1）
- **视奸**：1 次/天，免费。
- **操作**：1 次/天，消耗精力 15。
- 计数字段：`altAccountState.dailyVoyeurUsed`, `altAccountState.dailyOpUsed`。
- 每日 endDay 时重置。

## 视奸（Voyeur）
- 点击进入"粉圈信息流"：3-5 条粉圈动态（模板生成，带 `{name}` 替换）。
- 其中 1 条固定为"可视奸情报"（🔍 标记）。玩家点击可视奸卡 → 生成一张情报卡（Information Card）进入"消息"未读列表。
- 情报卡种类（初版 5 种）：
  1. `rival_scandal`——对家艺人负面猛料
  2. `fan_defect`——大粉动摇迹象
  3. `sponsor_leak`——品牌方内部意向
  4. `insider_drama`——剧组内幕
  5. `self_defense`——自家艺人被黑的粉圈原帖
- 情报卡属性：`{ id, type, title, snippet, effect: {statKey, delta}, expiresAtDay }`。
- **有效期**：生成后 3 天过期（`currentDay + 3`），过期自动从消息列表删除并进入 ledger 提示。

## 情报卡挂钩事件（方案 B）
- 特定事件选项支持"打出情报卡"：`choice.consumesInformationCardType?: InformationCardType`。
- UI：选项按钮旁若匹配到未过期情报卡，显示"🔍 使用情报：xxx"，点击后消耗该卡并把 `card.effect` 叠加到 outcome。
- 首批挂钩：3 个高频事件（对家挖角/品牌洽谈/剧组风波），事件 id 在 plan Task 里指定。

## 操作（Op）3 选 1
消耗精力 15，选一：

### A. 视奸粉圈（Snoop Circle）
- 效果：情报命中率 +30%（下一次视奸必给情报卡），无翻车风险。
- 叙事：`潜水到 {name} 的粉丝群，围观三小时……`

### B. 黑对家（Attack Rival）
- 效果：对家 rival.reputation -10，自家 prRisk +5（隐匿成本）。
- 翻车：基础概率 15%，翻车走翻车分级。
- 叙事：`P 图黑对家仙侠剧特效，转发破万……`

### C. 反串黑自家（Self-Defame Bait）
- 效果：`fanLoyalty +15`（护崽），`buzz +8`，`prRisk +8`（打不好会被识破）。
- 翻车：基础概率 25%（最高），翻车分级向"重"倾斜。
- 叙事：`发一句"{name} 演技一言难尽"等护崽小分队来撕……`

## 翻车判定
- 基础翻车概率 × (1 + managerStress/100)。
- 分级（roll 一次 0-1）：
  - `roll < 0.5` → 轻：prRisk +15, managerStress +10
  - `0.5 ≤ roll < 0.85` → 中：prRisk +30, managerStress +25, commercialValue -15
  - `roll ≥ 0.85` → 重：立即触发"人设崩塌被扒"结局（需满足触发条件）
- **翻车计数**：`altAccountState.exposureCount` 每次翻车（任意分级）+1。

## 新结局「人设崩塌被扒」
- id: `manager_persona_exposed`
- 触发条件：`managerStress >= 90 && altAccountState.exposureCount >= 1`
- 优先级：110（高于常规，低于「退圈宣言」的 120）
- 文案（Meta）：
  > 有人扒出你半夜挂着黑粉马甲的截图。热搜是你自己的名字。{name} 转发了那条帖子，配文只有一个句号。

## Store 扩展
```ts
interface AltAccountState {
  unlocked: boolean;              // 首次点击后 true
  dailyVoyeurUsed: boolean;
  dailyOpUsed: boolean;
  exposureCount: number;          // 累计翻车次数
  totalOps: number;               // 累计操作次数（成就/统计用）
}

interface InformationCard {
  id: string;
  type: 'rival_scandal' | 'fan_defect' | 'sponsor_leak' | 'insider_drama' | 'self_defense';
  title: string;
  snippet: string;                // `{name}` 占位
  effect: Partial<GameStats>;     // 叠加到 outcome
  createdDay: number;
  expiresAtDay: number;           // createdDay + 3
}
```
GameState 新增：`altAccount: AltAccountState`, `informationCards: InformationCard[]`。

## 联动
- endDay 里清理过期情报卡、重置 daily 计数。
- endDay 里检测「人设崩塌」结局（放在其他 stress 触发结局之前）。
- StatsBar 无需额外字段，压力值已可见。

## UI
- 小号面板：深色背景 `bg-slate-900`，红光 accent `text-red-400`，与主界面浅色形成分裂感。
- 视奸信息流：微博气泡样式，可视奸卡带 `🔍` 前缀 + 微光动效。
- 操作面板：3 张卡横排，翻车概率显式标注（"风险 15%"）。
- 情报卡列表：MessagesTab 内新增子分类"🔍 情报"，与常规消息分开。

## 测试
- vitest 单测：翻车分级分布（seed 化 mock，1000 次采样验证 50/35/15 分布）。
- vitest 单测：情报卡过期清理（day+3 后消失）。
- vitest 单测：结局触发条件（stress≥90 + exposureCount≥1 时才触发）。
- vitest 单测：精力不足时按钮禁用逻辑。
