// 视奸粉圈动态池 —— 粉圈黑话文案库
// 每次调用 rollVoyeurFeed(name, rivalName) 返回 3-5 条随机粉圈发言
// 文案参考豆瓣鹅组 / 微博超话 / 兔区常见语气：黑话密集、断句碎、阴阳怪气

import type { ArtistArchetype } from '@/types/game';
import { pickNickname, pickAvatar } from './nicknames';

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
  /** 真实网名（UI 层用来替代 匿名{authorTag}） */
  nickname?: string;
  /** 仅对特定艺人身份出现（不填 = 对所有身份可见） */
  archetypes?: ArtistArchetype[];
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
    archetypes: ['actor', 'idol', 'socialite'],
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
    archetypes: ['actor', 'idol', 'socialite'],
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
    archetypes: ['actor'],
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
    archetypes: ['actor', 'idol', 'socialite'],
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

// 响应式池：根据经纪人近期选择留下的 tag / 数值动态注入的粉圈发言
// 每条帖子附一个 matches(stats, tags) 门槛，只在命中时才可能被抽到
type ReactivePost = Omit<VoyeurPost, 'id'> & {
  matches: (ctx: { fanLoyalty: number; prRisk: number; commercialValue: number; tags: string[] }) => boolean;
};

const POOL_REACTIVE: ReactivePost[] = [
  // ===== 高忠诚度 (>=70) 一片彩虹屁 =====
  {
    authorTag: '唯粉',
    avatar: '💖',
    time: '刚刚',
    content: '姐妹们，{name} 团队最近这波操作真的是教科书级别，跟着这个经纪人稳赢。',
    likes: 3200,
    comments: 421,
    isIntel: false,
    matches: ({ fanLoyalty }) => fanLoyalty >= 70,
  },
  // ===== 低忠诚度 (<=35) 集体脱粉 =====
  {
    authorTag: '塌房粉',
    avatar: '🥀',
    time: '10 分钟前',
    content: '拉黑 {name} 了。经纪团队一次比一次拉，粉丝的耐心不是无限的。爬墙走人。',
    likes: 2140,
    comments: 987,
    isIntel: false,
    matches: ({ fanLoyalty }) => fanLoyalty <= 35,
  },
  // ===== 高舆论风险 (>=65) 吃瓜蹲声明 =====
  {
    authorTag: '路人',
    avatar: '🍿',
    time: '20 分钟前',
    content: '蹲一个 {name} 工作室的声明，感觉这次公关又要出昏招。这经纪人拿的什么剧本啊。',
    likes: 1876,
    comments: 1234,
    isIntel: false,
    matches: ({ prRisk }) => prRisk >= 65,
  },
  // ===== 极高舆论风险 (>=85) 塌房实锤 =====
  {
    authorTag: '毒唯',
    avatar: '⚡',
    time: '刚刚',
    content: '实锤了实锤了，{name} 这波真的救不回来了，经纪人还在硬撑，笑死。',
    likes: 5670,
    comments: 3421,
    isIntel: false,
    matches: ({ prRisk }) => prRisk >= 85,
  },
  // ===== 商业价值高 (>=70) 商务粉 =====
  {
    authorTag: '团粉',
    avatar: '💼',
    time: '1 小时前',
    content: '{name} 商务榜又冲上去了，感谢经纪团队。这一波品牌资源真的看得见。',
    likes: 1580,
    comments: 234,
    isIntel: false,
    matches: ({ commercialValue }) => commercialValue >= 70,
  },
  // ===== 商业价值低 (<=25) 商务寒冬 =====
  {
    authorTag: '唯粉',
    avatar: '💸',
    time: '30 分钟前',
    content: '{name} 半年没接过像样的代言了，粉丝焦虑到不行。团队在干嘛？',
    likes: 890,
    comments: 456,
    isIntel: false,
    matches: ({ commercialValue }) => commercialValue <= 25,
  },
  // ===== 动物人设：小狗 =====
  {
    authorTag: '唯粉',
    avatar: '🐶',
    time: '15 分钟前',
    content: '天呐 {name} 那个小狗系营业我看了三十遍，脑子里全是"我的狗"三个字。',
    likes: 4321,
    comments: 678,
    isIntel: false,
    matches: ({ tags }) => tags.includes('persona_dog'),
  },
  // ===== 动物人设：猫 =====
  {
    authorTag: '唯粉',
    avatar: '🐱',
    time: '20 分钟前',
    content: '{name} 猫系人设真的绝，那个傲娇小表情跟我家猫一模一样。',
    likes: 2890,
    comments: 340,
    isIntel: false,
    matches: ({ tags }) => tags.includes('persona_cat'),
  },
  // ===== 动物人设：仓鼠 =====
  {
    authorTag: '唯粉',
    avatar: '🐹',
    time: '25 分钟前',
    content: '仓鼠八哥的名场面，我求求你们再剪一集，我循环一百遍不够。',
    likes: 3421,
    comments: 512,
    isIntel: false,
    matches: ({ tags }) => tags.includes('persona_hamster'),
  },
  // ===== 动物人设：狐狸 =====
  {
    authorTag: '路人',
    avatar: '🦊',
    time: '半小时前',
    content: '不得不说 {name} 狐系营业真的会做，粉丝一边骂一边冲销量。',
    likes: 1780,
    comments: 421,
    isIntel: false,
    matches: ({ tags }) => tags.includes('persona_fox'),
  },
  // ===== 动物人设：狼 =====
  {
    authorTag: '唯粉',
    avatar: '🐺',
    time: '10 分钟前',
    content: '{name} 狼系氛围大片直接封神，这经纪人是懂视觉营销的。',
    likes: 4102,
    comments: 623,
    isIntel: false,
    matches: ({ tags }) => tags.includes('persona_wolf'),
  },
  // ===== 拒绝动物塑：神秘感 =====
  {
    authorTag: '路人',
    avatar: '🕶️',
    time: '半小时前',
    content: '{name} 团队最近很克制，不接综艺不炒人设，反而路人缘挺好。',
    likes: 987,
    comments: 234,
    isIntel: false,
    matches: ({ tags }) => tags.includes('persona_mysterious'),
  },
  // ===== 崩人设 =====
  {
    authorTag: '塌房粉',
    avatar: '💔',
    time: '5 分钟前',
    content: '{name} 人设崩了这波实在是骗不下去了，我今天正式脱粉。',
    likes: 2340,
    comments: 890,
    isIntel: false,
    matches: ({ tags }) => tags.includes('persona_broken'),
  },
  // ===== CP 卖腐营业中 =====
  {
    authorTag: 'CP粉',
    avatar: '💞',
    time: '20 分钟前',
    content: '今天这波糖我磕到了，{name} 你别管我磕的对不对，团队多发点物料！',
    likes: 5210,
    comments: 1103,
    isIntel: false,
    matches: ({ tags }) => tags.includes('cp_active'),
  },
  {
    authorTag: '唯粉',
    avatar: '😡',
    time: '25 分钟前',
    content: '{name} 团队最近发糖发上瘾了是吧？我们唯粉的感受你们考虑过吗！',
    likes: 3140,
    comments: 2450,
    isIntel: false,
    matches: ({ tags }) => tags.includes('cp_active'),
  },
  // ===== 主动解绑 =====
  {
    authorTag: '唯粉',
    avatar: '🌸',
    time: '半小时前',
    content: '{name} 主动解绑那条长文我看哭了，这才是真正为艺人考虑的团队。',
    likes: 3890,
    comments: 456,
    isIntel: false,
    matches: ({ tags }) => tags.includes('cp_unbound_active'),
  },
  // ===== 被动解绑 =====
  {
    authorTag: 'CP粉',
    avatar: '😤',
    time: '15 分钟前',
    content: '被解绑的是 {name} 我笑死，配不上就是配不上，别演了。',
    likes: 2100,
    comments: 1780,
    isIntel: false,
    matches: ({ tags }) => tags.includes('cp_dumped'),
  },
  // ===== 转型演员 =====
  {
    authorTag: '路人',
    avatar: '🎬',
    time: '1 小时前',
    content: '{name} 下海演戏了？看片花有点尴尬，但也别太苛刻，第一部嘛。',
    likes: 1240,
    comments: 780,
    isIntel: false,
    matches: ({ tags }) => tags.includes('career_actor_pivot'),
  },
  // ===== 转型综艺 =====
  {
    authorTag: '团粉',
    avatar: '🎪',
    time: '40 分钟前',
    content: '{name} 这波综艺常驻真的是选对了，商务肉眼可见地在起飞。',
    likes: 2340,
    comments: 341,
    isIntel: false,
    matches: ({ tags }) => tags.includes('career_variety_pivot'),
  },
  // ===== 黑称被玩梗 =====
  {
    authorTag: '路人',
    avatar: '🎯',
    time: '刚刚',
    content: '{name} 自己转发对家给的外号，笑死我了，这经纪人是不是学过传播学。',
    likes: 4560,
    comments: 1230,
    isIntel: false,
    matches: ({ tags }) => tags.includes('rival_meme_flipped'),
  },
];

// MVP：通用池 + 响应池；按艺人身份过滤剧集/演技等身份专属内容
export function rollVoyeurFeed(
  artistName: string,
  count = 4,
  ctx?: { fanLoyalty: number; prRisk: number; commercialValue: number; tags: string[]; artistId?: ArtistArchetype },
): VoyeurPost[] {
  const artistId = ctx?.artistId;
  const archetypeOk = (arche?: ArtistArchetype[]) => !arche || !artistId || arche.includes(artistId);

  const reactiveHits: Omit<VoyeurPost, 'id'>[] = ctx
    ? POOL_REACTIVE.filter(p => archetypeOk(p.archetypes) && p.matches(ctx)).map(({ matches, ...rest }) => rest)
    : [];
  const reactivePicked = reactiveHits.sort(() => Math.random() - 0.5).slice(0, Math.min(3, count));
  const remain = count - reactivePicked.length;
  const universalPool = POOL_UNIVERSAL.filter(p => archetypeOk(p.archetypes));
  const universalShuffled = [...universalPool].sort(() => Math.random() - 0.5).slice(0, remain);
  const combined = [...reactivePicked, ...universalShuffled].sort(() => Math.random() - 0.5);

  return combined.map((post, idx) => ({
    ...post,
    id: `voyeur_${Date.now()}_${idx}`,
    nickname: pickNickname(artistId),
    avatar: pickAvatar(),
    content: post.content.replace(/ ?\{name\} ?/g, artistName),
  }));
}
