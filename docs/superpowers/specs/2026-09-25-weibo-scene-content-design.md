# 微博场景内容系统设计

## 目标

重构 BurnerTab 的微博正文与评论生成逻辑，使每条内容同时满足：

- 微博正文是发帖人会真实发布的第一人称或自然口吻内容，不出现系统旁白。
- 评论准确回应当前帖子，而不是只保持大致正负情绪。
- 五位艺人在相同发博动作下具有不同职业背景、表达习惯和风险伏笔。
- 新内容使用显式 `sceneId`；关键词匹配仅服务没有场景字段的老存档。
- 一条帖子的正文、评论和互动数创建后保持稳定，刷新页面不会重新随机。

## 当前问题

1. `BurnerTab` 在帖子翻车时用 `backfireNarration` 替换 `postContent`，导致“偶像暗示恋情？粉丝直接炸了”这类系统结算旁白被显示为艺人微博正文。
2. `WeiboPostRecord` 只保存 `templateId`、`day` 和 `wasBackfire`，无法保留当时抽到的正文、场景、互动数和评论语境。
3. 评论生成通过正文关键词选择第一个主题池，再混入通用情绪池。帖子包含多个关键词时会误判，通用评论也会带入“镜头感”“嗑到了”等不相关语义。
4. 评论昵称来自艺人粉圈池，但评论本身没有作者身份、立场和场景约束，形成“昵称像粉丝，内容像路人”的割裂。

## 内容分层

以下四层必须独立，不允许互相回退：

1. **微博正文 `content`**：发帖人实际发布的内容。
2. **结算旁白 `outcomeNarration`**：向玩家解释操作结果，只出现在结算浮层。
3. **热搜标题 `trendTitle`**：媒体或公众对事件的概括，只出现在热搜区域。
4. **评论 `comments`**：基于场景、结果、评论者身份生成的回应。

`backfireNarration` 永远不能作为微博正文。翻车只改变评论分布、热搜和数值，不改写已经发出的原文。

## 显式场景模型

新增 `WeiboSceneId`。首批覆盖三类来源。

### 艺人发博场景

- `artist_work_photo`
- `artist_late_night`
- `artist_controversy_response`
- `artist_work_promotion`
- `artist_fan_gift`
- `artist_charity`
- `artist_fight_haters`
- `artist_selfie`
- `artist_romance_hint`
- `artist_apology`

### 粉圈信息流场景

- `fan_brand_sales`
- `fan_fansite_copyright`
- `fan_airport_sighting`
- `fan_support_campaign`
- `fan_work_complaint`
- `fan_media_smear`
- `fan_cp_discussion`
- `fan_fandom_conflict`
- `fan_career_discussion`
- `fan_crisis_watch`
- `fan_persona_discussion`
- `fan_private_sighting`

### 小号操作场景

- `burner_rival_smear`
- `burner_reverse_attack`
- `burner_artist_impersonation`

所有新增模板和 `VoyeurPost` 必须直接声明 `sceneId`。老记录缺少场景时，先根据 `templateId` 映射；仍无法映射时才调用关键词兼容器。

## 数据结构

### 发博模板

每个 `WeiboPostTemplate` 增加：

- `sceneId`
- `postVariants`: 通用正文池
- `artistPostVariants`: 五位艺人的专属正文池
- `imageRequirement`: `required | optional | none`
- `imageSlot`: 资源类别，不直接绑定临时文件名

每个场景至少提供 3 条通用正文。每位艺人在每个场景至少提供 2 条专属正文；专属正文优先，通用正文兜底。

### 发博历史

`WeiboPostRecord` 改为创建时快照：

- `id`
- `templateId`
- `sceneId`
- `day`
- `content`
- `outcome`: `success | backfire | leaked`
- `engagement`: `likes | comments | reposts`
- `imageKey?`

旧记录在读取时由 `templateId` 补全 `sceneId` 和正文，不破坏现有存档。

### 粉圈帖子

`VoyeurPost` 增加：

- `sceneId`
- `authorRole`
- `stance`: `supportive | skeptical | hostile | neutral | procedural`

这里的 `authorRole` 描述发帖人身份，例如唯粉、站姐、数据粉、路人或对家。它不再只用于显示标签，而会影响评论区构成。

## 五位艺人语气

- **甄帅**：年轻流量偶像，营业感强，语气亲近，习惯称粉丝为“你们”；恋情相关表达会刻意含糊，留下被解读空间。
- **郝美丽**：科班演员，表达克制、完整，重点放在角色、剧组和作品；不使用过多卖萌语气。
- **高八度**：创作歌手，简短直接，常写舞台、声音、排练和作品；避免使用演员、爱豆或带货式话术。
- **冷冰凝**：成熟社媒与直播语感，节奏快，擅长互动和种草，但在争议场景容易显得像公关文案。
- **南陌格**：高奢与古偶路线，语气疏离、精致，重视造型和氛围；避免过度亲昵和低幼表达。

专属语气只改变表达，不改变场景本身的玩法效果。

## 评论生成

### 评论条目

评论不再是字符串数组，而是结构化条目：

- `text`
- `role`: 唯粉、路人、数据粉、站姐、CP 粉、对家粉、黑粉、脱粉粉、私生等
- `stance`
- `allowedOutcomes`
- `artistIds?`

### 场景评论池

每个 `sceneId` 建立独立池，最低要求：

- 至少 12 条评论。
- 至少覆盖 3 种评论者身份。
- 成功和翻车各有可用评论，不能靠正负通用池硬凑。
- 明确禁止跨场景语义。例如镜头评论不得进入品牌销量场景，磕糖评论不得进入版权维权场景。

### 抽样规则

每次展示 3 条评论：

1. 第一条必须直接回应正文核心事实。
2. 第二条从与结果一致的主要立场抽取。
3. 第三条可提供另一种现实视角，但必须与场景相关。

昵称必须与评论者身份一致：

- 唯粉、数据粉、站姐和 CP 粉可以使用当前艺人的专属粉圈昵称。
- 路人使用通用生活化昵称。
- 对家使用对家或吃瓜语气昵称。
- 脱粉粉使用中性旧粉昵称。
- 私生使用行程追踪类昵称，不得套用核心粉站昵称。

不得出现“评论内容在骂艺人，但昵称仍像艺人核心站子”的身份冲突。
当帖子涉及对家比较、互撕、黑稿或反串时，评论区必须允许当前 Rival 的粉丝进入。例如甄帅局应出现“林C位数据站”等林 C 位粉丝，而不是把所有立场都伪装成甄帅粉丝。

示例：

- `fan_brand_sales`：下单/销量、数据行动、对家比较或理性提醒。
- `fan_fansite_copyright`：版权归属、举报搬运、证据留存、对站姐维权的不同态度。
- `artist_romance_hint + backfire`：唯粉质疑、脱粉观察、CP 粉解读、路人吃瓜。
- `artist_apology + success`：接受道歉、继续观察、要求后续行动，不出现“镜头感封神”。

同一条帖子使用帖子 ID 作为稳定随机种子。展开、收起和页面重渲染不会更换评论。

### 兜底规则

新数据严禁依赖关键词生成主评论。兼容顺序为：

1. 记录自带 `sceneId`
2. `templateId -> sceneId` 映射
3. 老 `VoyeurPost` 的关键词推断
4. 无语义的中性兜底，例如“蹲后续”“先看看情况”

兜底池不得包含颜值、CP、舞台、销量等明确主题词。

## 正文池规模

首批目标：

- 10 个艺人发博场景：每场景 3 条通用正文，五位艺人各 2 条专属正文。
- 12 个粉圈信息流场景：保留合格旧帖，并补到每场景至少 5 条微博正文。
- 3 个小号操作场景：每场景至少 12 条正文，避免连续重复。
- 25 个场景评论池：每场景至少 12 条结构化评论。

内容检查必须覆盖：

- 职业一致性
- 发帖人称一致性
- 性别称呼
- 艺人专属昵称
- 场景和评论语义
- 成功/翻车立场
- CJK 空格

## 配图判定

配图接入在内容逻辑稳定后进行。用户提供图片，代码只负责按 `imageKey` 映射本地静态资源。

### 必须配图

- `artist_work_photo`：工作现场或后台照片。
- `artist_work_promotion`：剧集海报、专辑封面、直播或品牌宣传图。
- `artist_fan_gift`：生日应援、花墙、礼物或手写信。
- `artist_selfie`：符合艺人身份的生活自拍。
- `artist_romance_hint`：能被粉丝过度解读的暧昧生活细节图。

### 可选配图

- `artist_late_night`：夜景、录音室、片场收工或酒店窗景。
- `artist_charity`：公益项目现场或官方项目卡片。
- `fan_airport_sighting`：低清机场路透。
- `fan_fansite_copyright`：带站姐水印的机场图或活动图。

### 不应使用生成图片

- `artist_controversy_response`
- `artist_fight_haters`
- `artist_apology`

这三类更适合纯文字或由前端生成的声明长图，避免 AI 图片中的文字错误。

最终实施完成后输出独立素材清单，逐张给出：艺人、场景、用途、构图、服装、环境、光线、镜头、画幅、禁止元素和建议文件名。

## 迁移与兼容

- Zustand persist 中的旧 `WeiboPostRecord` 继续可读。
- 老记录缺少 `content` 时使用对应模板的第一条稳定正文，不在每次渲染时随机。
- 老记录缺少互动数时根据记录 ID 或 `templateId + day` 生成稳定数值。
- 老 `burnerFeed` 缺少 `day` 时保留原 `time`。
- 关键词兼容器独立成函数，并标明只处理 legacy 数据。
- 账号身份决定 Feed 归属：艺人账号发布才进入 `weiboPostHistory`；小号发布始终进入 `burnerFeed`。小号被扒只改变曝光、热搜、评论与数值，不得改成艺人头像或“艺人”标签。

## 测试与验收

### 单元测试

- 翻车记录仍显示原始微博正文，结算旁白不会进入 Feed。
- 每个新模板都能解析出合法 `sceneId`。
- 每个场景至少有 12 条合法评论并覆盖 3 种身份。
- 评论只从当前场景和当前结果允许的集合中抽取。
- 相同帖子 ID 重复生成时正文、评论和互动数一致。
- 旧存档可补全场景并正常显示。

### 内容矩阵检查

使用脚本遍历五位艺人、10 个发博动作和成功/翻车结果，输出 100 组样本。检查：

- 是否出现职业错位。
- 是否出现第三人称系统旁白。
- 是否出现斜杠占位词或其他艺人昵称。
- 是否出现评论答非所问。

### UI 验收

- Feed 只显示微博正文。
- 结算浮层单独显示成功或翻车说明。
- 评论展开后三条内容均能直接关联当前帖子。
- 刷新和反复展开不会改变已发布内容。
