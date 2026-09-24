// 视奸粉圈动态池 —— 粉圈黑话文案库
// 每次调用 rollVoyeurFeed(name, rivalName) 返回 3-5 条随机粉圈发言
// 文案参考豆瓣鹅组 / 微博超话 / 兔区常见语气：黑话密集、断句碎、阴阳怪气

export interface VoyeurPost {
  id: string;
  /** 发帖人标签：唯粉 / 团粉 / CP粉 / 路人 / 对家 / 毒唯 / 私生 */
  authorTag: '唯粉' | '团粉' | 'CP粉' | '路人' | '毒唯' | '对家毒唯' | '私生' | '塌房粉' | '同担';
  /** 头像 emoji */
  avatar: string;
  /** 发帖时间戳文案 */
  time: string;
  /** 帖子正文，{name} 替换成艺人，{rival} 替换成对家 */
  content: string;
  /** 互动数据 */
  likes: number;
  comments: number;
  /** 是否可视奸情报（🔍 高亮） —— MVP 阶段先都是 false，纯展示 */
  isIntel: boolean;
}

const POOL_UNIVERSAL: Omit<VoyeurPost, 'id'>[] = [
  // ===== 唯粉 · 花痴/护崽/焦虑 =====
  {
    authorTag: '唯粉',
    avatar: '🌸',
    time: '3 分钟前',
    content: '姐妹们，今天 {name} 的路透绝了，那个眼神我真的会当场去世。求原图求原图，蹲一个高清！！',
    likes: 1247,
    comments: 89,
    isIntel: false,
  },
  {
    authorTag: '唯粉',
    avatar: '🌷',
    time: '17 分钟前',
    content: '{name} 今天代言的那个牌子销量炸了！家人们冲一下超话，别让对家又阴阳我们没商业价值。',
    likes: 912,
    comments: 203,
    isIntel: false,
  },
  {
    authorTag: '唯粉',
    avatar: '🍑',
    time: '32 分钟前',
    content: '别再让 {name} 接烂剧了求求了，人设崩塌粉丝哭死。团队睁大眼睛看看剧本再签好吗？',
    likes: 1567,
    comments: 402,
    isIntel: false,
  },
  {
    authorTag: '唯粉',
    avatar: '🍓',
    time: '48 分钟前',
    content: '哭死了……{name} 今天直播说的那句"辛苦大家陪我走到现在"我循环了 20 遍。这就是我的信仰。',
    likes: 3421,
    comments: 512,
    isIntel: false,
  },
  {
    authorTag: '唯粉',
    avatar: '💐',
    time: '1 小时前',
    content: '生贺应援已经打款，姐妹们记得截图发群里对账。今年目标是纽约时代广场大屏，去年被对家压了一头。',
    likes: 892,
    comments: 145,
    isIntel: false,
  },
  {
    authorTag: '唯粉',
    avatar: '🌺',
    time: '2 小时前',
    content: '为什么 {name} 的营业越来越少了？团队是不是在雪藏？姐妹们别都夸别都夸，工作室要看到我们的不满！',
    likes: 678,
    comments: 891,
    isIntel: false,
  },
  {
    authorTag: '唯粉',
    avatar: '🪷',
    time: '3 小时前',
    content: '刚看到那个营销号发的对比图，眼泪当场下来。{name} 明明这么努力凭什么被那样说。已经举报了。',
    likes: 2103,
    comments: 340,
    isIntel: false,
  },

  // ===== 毒唯 · 战斗力拉满 =====
  {
    authorTag: '毒唯',
    avatar: '💢',
    time: '12 分钟前',
    content: '整天蹭 {name} 番位的那位真的够了，自己粉丝没数据是自己家爱豆没实力，别老 cue 我家人。',
    likes: 823,
    comments: 412,
    isIntel: false,
  },
  {
    authorTag: '毒唯',
    avatar: '🔪',
    time: '26 分钟前',
    content: '开撕开撕。{name} 番位一番爱豆凭什么被压咖。营销号列表已经拉好了，姐妹们轮着来。',
    likes: 456,
    comments: 789,
    isIntel: false,
  },
  {
    authorTag: '毒唯',
    avatar: '⚔️',
    time: '55 分钟前',
    content: '哦？这就开始碰瓷 {name} 了？姐妹醒醒，天热了什么阿猫阿狗都爬出来了。举报走起。',
    likes: 1245,
    comments: 623,
    isIntel: false,
  },
  {
    authorTag: '毒唯',
    avatar: '🩸',
    time: '2 小时前',
    content: '公告：从今天开始 {name} 后援会禁止提任何 CP 名，磕的姐妹自觉退群。爱豆是我们的信仰不是过家家道具。',
    likes: 3120,
    comments: 1502,
    isIntel: false,
  },

  // ===== 团粉 · 顾大局 =====
  {
    authorTag: '团粉',
    avatar: '🫂',
    time: '2 小时前',
    content: '希望后援会好好做数据，不要天天撕对家浪费时间。我们 {name} 缺的是作品不是热搜。',
    likes: 1089,
    comments: 156,
    isIntel: false,
  },
  {
    authorTag: '团粉',
    avatar: '🌟',
    time: '4 小时前',
    content: '姐妹们大局观一点，现在撕对家我们只会被拖下水。{name} 现在最缺的是作品口碑不是热搜第一。',
    likes: 745,
    comments: 89,
    isIntel: false,
  },

  // ===== CP粉 · 磕晕系列 =====
  {
    authorTag: 'CP粉',
    avatar: '💕',
    time: '31 分钟前',
    content: '不是……你们看那个花絮了吗？{name} 手明明碰到对方腰了啊！！磕晕了磕晕了嗑到了嗑到了！！',
    likes: 2103,
    comments: 567,
    isIntel: false,
  },
  {
    authorTag: 'CP粉',
    avatar: '🌈',
    time: '1 小时前',
    content: '整理了 {name} 和搭档从初见到杀青的所有互动，DOC 文档 47 页。私戳自取，转发请打码抠字。',
    likes: 4520,
    comments: 890,
    isIntel: false,
  },
  {
    authorTag: 'CP粉',
    avatar: '💞',
    time: '3 小时前',
    content: '求求单担别撕了，我们又不下正主超话，磕自己的糖碍着谁了。你们再骂我要报警了。',
    likes: 891,
    comments: 1230,
    isIntel: false,
  },

  // ===== 路人 · 冷眼旁观 =====
  {
    authorTag: '路人',
    avatar: '👤',
    time: '18 分钟前',
    content: '路人一枚，最近被 {name} 的物料圈粉了。请问怎么加入组织？打投超话是啥意思？',
    likes: 89,
    comments: 34,
    isIntel: false,
  },
  {
    authorTag: '路人',
    avatar: '🐟',
    time: '3 小时前',
    content: '这是我第 N 次看到 {name} 粉丝控评了……你们不累吗？评论区一水儿的复读机看着好瘆人。',
    likes: 345,
    comments: 289,
    isIntel: false,
  },
  {
    authorTag: '路人',
    avatar: '🥱',
    time: '5 小时前',
    content: '真心问一下，{name} 的作品哪部能看？看了两集新剧真的坐立难安。粉丝先不要开骂，我路人。',
    likes: 456,
    comments: 623,
    isIntel: false,
  },
  {
    authorTag: '路人',
    avatar: '🍿',
    time: '6 小时前',
    content: '搬个小板凳蹲今晚的瓜。{name} 那边不知道会不会出声明，公关这两年一直很拉。',
    likes: 234,
    comments: 178,
    isIntel: false,
  },

  // ===== 塌房粉 · 心累爬墙 =====
  {
    authorTag: '塌房粉',
    avatar: '💔',
    time: '25 分钟前',
    content: '爬墙了，实在受不了粉圈这种氛围，天天撕架天天控评，追星本来是想开心，结果每天都在生气。BYE。',
    likes: 456,
    comments: 178,
    isIntel: false,
  },
  {
    authorTag: '塌房粉',
    avatar: '🥀',
    time: '2 小时前',
    content: '追了 {name} 三年，今天决定退圈了。祝他/她一切都好，但我真的累了。删除超话，转粉那个新出道的小朋友。',
    likes: 1890,
    comments: 452,
    isIntel: false,
  },
  {
    authorTag: '塌房粉',
    avatar: '🕯️',
    time: '4 小时前',
    content: '{name} 塌不塌房我不知道，但今天营销号的路子太深了，摆明有人在背后推。心寒，脱粉观察一段时间。',
    likes: 2340,
    comments: 891,
    isIntel: false,
  },

  // ===== 私生 · 越界系列 =====
  {
    authorTag: '私生',
    avatar: '🕶️',
    time: '1 小时前',
    content: '刚在机场蹲到 {name}，戴着口罩帽子低着头，助理挡得很严实。（图不发了怕被挂）',
    likes: 234,
    comments: 891,
    isIntel: false,
  },
  {
    authorTag: '私生',
    avatar: '📸',
    time: '3 小时前',
    content: '房号手写图收了没？酒店那边熟人递话说 {name} 明晚有饭局。姐妹想拼车 dd。',
    likes: 145,
    comments: 720,
    isIntel: false,
  },

  // ===== 对家毒唯 · 阴阳怪气 =====
  {
    authorTag: '对家毒唯',
    avatar: '☠️',
    time: '2 小时前',
    content: '真心建议 {name} 粉丝把嘴闭上，蹭我家番位蹭到魔怔，还倒打一耙。KY 大军又来了。',
    likes: 512,
    comments: 623,
    isIntel: false,
  },
  {
    authorTag: '对家毒唯',
    avatar: '🖤',
    time: '4 小时前',
    content: '哦，{name} 又要冲我家哥哥的资源了？就这商业价值也配？姐妹们保持体面，别理疯狗，把数据做上去打脸。',
    likes: 890,
    comments: 1123,
    isIntel: false,
  },
  {
    authorTag: '对家毒唯',
    avatar: '🐍',
    time: '6 小时前',
    content: '所以 {name} 的团队什么时候能学会说人话？每次公关都像在挑衅粉丝智商，你家爱豆是不是很想被扒？',
    likes: 342,
    comments: 890,
    isIntel: false,
  },

  // ===== 同担 · 求同存异 =====
  {
    authorTag: '同担',
    avatar: '🤝',
    time: '42 分钟前',
    content: '姐妹们冷静，今天的营销号又在带节奏了，不要点进去也不要转发，正主微博底下控评就行。已举报。',
    likes: 678,
    comments: 45,
    isIntel: false,
  },
  {
    authorTag: '同担',
    avatar: '🕊️',
    time: '3 小时前',
    content: '求求各位同担了，不要再互相挂人了，{name} 每天营业已经很累了看到粉丝内斗真的会心疼。',
    likes: 1234,
    comments: 267,
    isIntel: false,
  },

  // ===== 加料：营销号 / 站姐 / 数据组 味道 =====
  {
    authorTag: '唯粉',
    avatar: '📊',
    time: '20 分钟前',
    content: '数据组紧急征集！{name} 今晚 8 点微博直播，家人们记得转评赞三连，粘贴组的文案在群公告，别抄错。',
    likes: 567,
    comments: 89,
    isIntel: false,
  },
  {
    authorTag: '唯粉',
    avatar: '📷',
    time: '45 分钟前',
    content: '本站姐澄清一下，今天机场那组图版权在我这，营销号搬运的都是盗图。已经发律师函了，别再传。',
    likes: 2890,
    comments: 145,
    isIntel: false,
  },
  {
    authorTag: '毒唯',
    avatar: '🔥',
    time: '1 小时前',
    content: '{name} 后援会赶紧出来说话啊！这种时候你们死哪去了？粉丝在前面顶雷你们在后台数集资？',
    likes: 3421,
    comments: 890,
    isIntel: false,
  },
  {
    authorTag: 'CP粉',
    avatar: '🍬',
    time: '2 小时前',
    content: '今天糖分好足，{name} 生日搭档第一个转发的祝福。这个动作显然是深夜等到零点。我不管我磕死了。',
    likes: 5670,
    comments: 1230,
    isIntel: false,
  },
  {
    authorTag: '路人',
    avatar: '🧊',
    time: '3 小时前',
    content: '客观说 {name} 演技这几年真的进步了，只是选剧本眼光一如既往差。团队什么时候能换换脑子。',
    likes: 890,
    comments: 234,
    isIntel: false,
  },
  {
    authorTag: '塌房粉',
    avatar: '🌫️',
    time: '5 小时前',
    content: '曾经我以为追星能救我，现在才明白只有睡觉能救我。粉了 {name} 五年，今天是最后一天了。',
    likes: 2134,
    comments: 456,
    isIntel: false,
  },
  {
    authorTag: '同担',
    avatar: '🌱',
    time: '6 小时前',
    content: '{name} 加油！新剧路透看着质感很不错，导演阵容也稳。我们粉丝要做的就是不给他/她添乱，好好等成片。',
    likes: 456,
    comments: 34,
    isIntel: false,
  },
  {
    authorTag: '毒唯',
    avatar: '⚡',
    time: '深夜',
    content: '姐妹们知道吗，最近那个营销号"XX 吃瓜社"是对家买的，转发的每一条都是踩 {name} 捧对家。已经拉黑名单群里同步了。',
    likes: 4123,
    comments: 1890,
    isIntel: false,
  },
  {
    authorTag: '对家毒唯',
    avatar: '🦂',
    time: '深夜',
    content: '再重复一次，{name} 的作品成绩和我家没有可比性。低段位就不要碰瓷了谢谢，蹭上来只会显得你们更寒酸。',
    likes: 678,
    comments: 1450,
    isIntel: false,
  },
  {
    authorTag: '私生',
    avatar: '🚗',
    time: '深夜',
    content: '刚跟车跟到小区门口，保安拦下来了。{name} 今晚回家挺早的，看气色好像不错。（不发图，别问）',
    likes: 89,
    comments: 567,
    isIntel: false,
  },
];

// MVP：先只用通用池；后续可以按 artist archetype 分池
export function rollVoyeurFeed(artistName: string, count = 4): VoyeurPost[] {
  const shuffled = [...POOL_UNIVERSAL].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count);
  return picked.map((post, idx) => ({
    ...post,
    id: `voyeur_${Date.now()}_${idx}`,
    content: post.content.replace(/\{name\}/g, artistName),
  }));
}
