# 经纪人模拟器：塌房危机 🌟

> 你是一名娱乐经纪人。你的艺人每天都在塌房的边缘疯狂试探。你能撑过 20 天吗？

[![Online Demo](https://img.shields.io/badge/demo-savemystar.pages.dev-orange)](https://savemystar.pages.dev)
[![CI](https://github.com/ddduan0817/save-my-star/actions/workflows/ci.yml/badge.svg)](https://github.com/ddduan0817/save-my-star/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

---

## 在线体验

**👉 [savemystar.pages.dev](https://savemystar.pages.dev)**

部署在 Cloudflare Pages，纯前端，移动端优先。手机扫码也能玩。

---

## 简介

一款模拟娱乐圈经纪人日常的**文字策略游戏**。你需要在**商业价值**、**粉丝忠诚度**和**舆论风险**之间艰难平衡，应对各种突发事件——品牌方暴怒来电、AI 换脸丑闻、粉丝内战、艺人深夜崩溃……

每个选择都有代价，每天都是新的危机。**没有正确答案**，只有更糟和更不糟。

---

## 玩法核心

### 三维数值系统

| 数值 | 上限 | 说明 |
|---|---|---|
| 💰 资金 | 无 | 用于商务、公关、整容、公司升级。低于阈值连续 3 天即破产 |
| 📈 商业价值 | 100 | 影响商务报价和合作机会 |
| ❤️ 粉丝忠诚 | 100 | 高忠诚度可减半舆论风险伤害 |
| ⚠️ 舆论风险 | 100 | 突破 95 触发**全网封杀**结局 |

### 每日流程

```
新的一天 (Day N)
    ↓
收到 1-3 条消息（事件 / 紧急来电 / 商务邀约）
    ↓
逐条处理 → 选择 → 看后果（部分有反转 twist）
    ↓
点 [结束今天] → 日程结算 / 对手行动 / 微博热搜更新
    ↓
进入 Day N+1
```

### 紧急来电系统

某些高风险事件会以**全屏来电界面**弹出，模拟手机来电。接听 / 挂断都有不同后果，无法忽略。

### 事件链 (Chains)

部分事件互相关联：今天的选择会决定明天能否触发后续事件，最长可达 5 段连续剧情。

### 10 种结局

从 **顶流巅峰** 到 **全网封杀**，再到隐藏的 **金钱至上**、**佛系艺人**、**塌房教科书** 等多种结局，根据你 20 天的累计选择动态生成。

---

## 特色

- **4 位性格迥异的艺人**：流量偶像 / 实力演员 / 唱跳歌手 / 网红转型，各自有专属事件
- **80+ 精心设计的事件**，每个选项都没有"正确答案"
- **紧急来电系统**：全屏来电界面，接听或挂断都有后果
- **10 种结局**：从顶流巅峰到全网封杀
- **竞争对手系统**：会反向偷塔、抢资源
- **公司升级**：投资团队解锁新能力
- **微博发帖系统**：自己发帖控评，但用力过猛会反噬
- **整容系统**：可以氪金给艺人改变形象
- **成就系统**：通关解锁
- **结局收藏**：在 Collection 页查看所有已解锁结局
- **纯前端**，无需后端，离线也能玩
- **移动端优先**的响应式设计

---

## 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | [Next.js 14](https://nextjs.org/) (App Router, Static Export) |
| 语言 | TypeScript 5 |
| 样式 | [Tailwind CSS 3](https://tailwindcss.com/) |
| 动画 | [Framer Motion 12](https://www.framer.com/motion/) |
| 状态管理 | [Zustand 5](https://github.com/pmndrs/zustand) |
| 截图导出 | [html-to-image](https://github.com/bubkoo/html-to-image) |
| 部署 | [Cloudflare Pages](https://pages.cloudflare.com/) |

---

## 项目结构

```
src/
├── app/                  # Next.js App Router 页面
│   ├── page.tsx          # 落地页（艺人选择）
│   ├── game/             # 游戏主界面
│   ├── ending/           # 结局页
│   └── collection/       # 结局收藏页
├── components/
│   ├── game/             # 游戏内组件（StatsBar/EventCard/Tabs...）
│   ├── icons/            # SVG 图标
│   └── landing/          # 落地页组件
├── data/                 # 游戏数据（事件、艺人、结局、成就...）
│   ├── events/           # 80+ 事件按类别分文件
│   ├── artists.ts
│   ├── endings.ts
│   ├── achievements.ts
│   └── constants.ts      # 全局调参常量
├── engine/               # 游戏引擎（纯函数）
│   ├── gameEngine.ts
│   ├── eventSelector.ts  # 当日事件选择器（带权重）
│   ├── outcomeCalculator.ts
│   └── socialGenerator.ts # 微博热搜 / 评论生成
├── stores/
│   └── gameStore.ts      # Zustand 全局状态
├── types/
│   └── game.ts           # 全部 TypeScript 类型
└── lib/                  # 工具与音效
```

---

## 本地开发

### 环境要求

- Node.js ≥ 18
- npm ≥ 9（或 pnpm / yarn）

### 启动

```bash
git clone https://github.com/ddduan0817/save-my-star.git
cd save-my-star
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可体验。

### 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 本地开发（热更新） |
| `npm run build` | 生产构建（静态导出到 `out/`） |
| `npm run start` | 启动生产服务器（仅用于本地预览） |
| `npm run lint` | ESLint 检查 |

---

## 部署

项目通过 Cloudflare Pages 部署，推送到 `main` 分支后自动构建发布。

也可以一键部署到其他平台：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ddduan0817/save-my-star)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ddduan0817/save-my-star)

---

## 如何添加新内容

### 添加新事件

1. 在 `src/data/events/` 下选择类别文件（或新建一个）
2. 按 `GameEvent` 类型添加事件对象
3. 在 `src/data/events/index.ts` 中导出

### 添加新艺人

1. 在 `src/data/artists.ts` 中添加艺人定义
2. 在 `src/types/game.ts` 的 `ArtistArchetype` 联合类型里加入新 ID
3. 在 `src/components/icons/ArtistAvatars.tsx` 添加头像
4. 可选：在 `src/data/events/idol-specific.ts` 添加专属事件

### 添加新结局

1. 在 `src/data/endings.ts` 添加结局定义
2. 在 `src/engine/endingResolver.ts` 添加触发条件

---

## Roadmap

- [ ] 单元测试（Vitest）
- [ ] 多语言（i18n）
- [ ] 多周目继承机制
- [ ] 更多艺人类型
- [ ] PWA / 离线缓存

---

## 贡献

欢迎 PR！特别欢迎以下方向：

- 新事件 / 新艺人 / 新结局
- 文案润色（让事件更"塌房"一点）
- Bug 修复
- 无障碍 (a11y) 改进

请遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范。

---

## License

[MIT](LICENSE) © ddduan0817

> 本项目纯属虚构娱乐，所有事件均为戏剧化处理，与现实人物事件无关。
