import type { FansiteMaster, FansiteInteraction } from '@/types/new_systems';
import type { ArtistArchetype } from '@/types/game';

/**
 * 大粉（fansite/big-fan）按艺人差异化生成。
 * 每个艺人 3-4 个大粉，人设、资源、忠诚度起点都不同——
 * 偶像派的大粉是修图技术流和元老前线；
 * 演员派偏文艺向、愿意为作品熬夜分析；
 * 歌手派偏专业听众和翻唱编曲党；
 * 网红派偏数据搬运工和带货互推。
 */

const fansitesByArtist: Record<ArtistArchetype, FansiteMaster[]> = {
  // ===== 偶像 =====
  idol: [
    {
      id: 'fansite_1',
      name: '星光不负赶路人',
      avatar: '📸',
      followers: 85000,
      attitude: 'devoted',
      loyalty: 85,
      resources: ['photos', 'videos', 'info'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '技术流大粉，修图一绝，手里有80%的舞台神图',
    },
    {
      id: 'fansite_2',
      name: '前线的风',
      avatar: '🌪️',
      followers: 120000,
      attitude: 'devoted',
      loyalty: 90,
      resources: ['photos', 'videos', 'info', 'connections'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '元老级大粉，从练习生时期跟到现在，但要求也最高',
    },
    {
      id: 'fansite_3',
      name: '熬夜冠军追星人',
      avatar: '🌙',
      followers: 38000,
      attitude: 'neutral',
      loyalty: 45,
      resources: ['photos', 'money'],
      hasBlackmail: true,
      blackmailValue: 30000,
      lastInteraction: 0,
      specialTrait: '有钱任性，经常买代拍，但最近开始接对家活',
    },
    {
      id: 'fansite_4',
      name: '显微镜女孩',
      avatar: '🔍',
      followers: 25000,
      attitude: 'dissatisfied',
      loyalty: 30,
      resources: ['info'],
      hasBlackmail: true,
      blackmailValue: 50000,
      lastInteraction: 0,
      specialTrait: '扒皮高手，知道很多不为人知的细节，一言不合就长文锤',
    },
  ],

  // ===== 演员 =====
  actor: [
    {
      id: 'fansite_1',
      name: '剧抛脸研究所',
      avatar: '🎬',
      followers: 95000,
      attitude: 'devoted',
      loyalty: 88,
      resources: ['videos', 'info'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '专业向，剪角色混剪能上热搜，每部新作必写万字长评',
    },
    {
      id: 'fansite_2',
      name: '场记本子',
      avatar: '📒',
      followers: 42000,
      attitude: 'supportive',
      loyalty: 72,
      resources: ['info', 'connections'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '熟知剧组所有花絮路线，路透素材源源不断',
    },
    {
      id: 'fansite_3',
      name: '红毯生图老兵',
      avatar: '📷',
      followers: 60000,
      attitude: 'neutral',
      loyalty: 50,
      resources: ['photos'],
      hasBlackmail: true,
      blackmailValue: 40000,
      lastInteraction: 0,
      specialTrait: '专拍颁奖礼/电影节，但偶尔会放一些"角度刁钻"的生图',
    },
  ],

  // ===== 歌手 =====
  singer: [
    {
      id: 'fansite_1',
      name: '耳机党党魁',
      avatar: '🎧',
      followers: 78000,
      attitude: 'devoted',
      loyalty: 86,
      resources: ['videos', 'info'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '专业乐评向，每首新歌必出多平台音质对比',
    },
    {
      id: 'fansite_2',
      name: '现场打榜冠军',
      avatar: '🎤',
      followers: 55000,
      attitude: 'supportive',
      loyalty: 75,
      resources: ['photos', 'videos'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '所有 Live 演出全勤，舞台直拍质量秒杀官方',
    },
    {
      id: 'fansite_3',
      name: '副歌传教士',
      avatar: '📻',
      followers: 32000,
      attitude: 'neutral',
      loyalty: 48,
      resources: ['info', 'connections'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '负责到处安利，但最近在嫌"新专不如老专"',
    },
    {
      id: 'fansite_4',
      name: '修音侦探',
      avatar: '🎚️',
      followers: 18000,
      attitude: 'dissatisfied',
      loyalty: 28,
      resources: ['info'],
      hasBlackmail: true,
      blackmailValue: 60000,
      lastInteraction: 0,
      specialTrait: '专门扒 Live 修音和走音片段，一不爽就剪合集',
    },
  ],

  // ===== 网红 =====
  influencer: [
    {
      id: 'fansite_1',
      name: '数据搬运中心',
      avatar: '📊',
      followers: 110000,
      attitude: 'devoted',
      loyalty: 80,
      resources: ['info', 'money'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '负责日常控评、刷数据、买热搜，专业打投',
    },
    {
      id: 'fansite_2',
      name: '反黑组组长',
      avatar: '🛡️',
      followers: 65000,
      attitude: 'devoted',
      loyalty: 85,
      resources: ['info', 'connections'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '24h 蹲超话，骂战和举报全包，但容易和别家正面冲突',
    },
    {
      id: 'fansite_3',
      name: '种草小报',
      avatar: '🛍️',
      followers: 48000,
      attitude: 'neutral',
      loyalty: 52,
      resources: ['photos', 'connections'],
      hasBlackmail: false,
      blackmailValue: 0,
      lastInteraction: 0,
      specialTrait: '专门搬同款，最近开始接对家品牌的合作',
    },
  ],
};

/** 默认（用作回退） */
export const initialFansites: FansiteMaster[] = fansitesByArtist.idol;

/** 按艺人 ID 取该艺人的大粉列表（深拷贝，避免 store 间共享引用） */
export function getFansitesForArtist(artistId: ArtistArchetype): FansiteMaster[] {
  const list = fansitesByArtist[artistId] || fansitesByArtist.idol;
  return list.map(f => ({ ...f, resources: [...f.resources] }));
}

// 大粉互动选项
export const fansiteInteractions: FansiteInteraction[] = [
  {
    id: 'invite_backstage',
    name: '给后台拍摄权限',
    emoji: '🎫',
    description: '允许大粉进入后台拍摄独家物料',
    cost: 0,
    effect: { loyalty: 15, attitude: 'devoted' },
  },
  {
    id: 'pay_exclusive',
    name: '买断独家图',
    emoji: '💰',
    description: '花钱买断大粉手里的独家照片',
    cost: 20000,
    effect: { loyalty: 10, hasBlackmail: false },
  },
  {
    id: 'official_recognition',
    name: '官方认证',
    emoji: '✅',
    description: '给大粉官方认证，提供工作证',
    cost: 5000,
    effect: { loyalty: 20, attitude: 'devoted' },
  },
  {
    id: 'gift_merch',
    name: '送签名周边',
    emoji: '🎁',
    description: '给大粉送艺人签名周边',
    cost: 3000,
    effect: { loyalty: 8 },
  },
  {
    id: 'dinner_meeting',
    name: '请吃饭谈心',
    emoji: '🍽️',
    description: '私下请大粉吃饭，拉近关系',
    cost: 8000,
    effect: { loyalty: 12, hasBlackmail: false },
  },
  {
    id: 'ignore',
    name: '冷处理',
    emoji: '😶',
    description: '暂时不处理，观察情况',
    cost: 0,
    effect: { loyalty: -5 },
  },
  {
    id: 'threaten_legal',
    name: '律师函警告',
    emoji: '⚖️',
    description: '对大粉发出法律警告（高风险）',
    cost: 15000,
    effect: { loyalty: -30, attitude: 'hostile' },
  },
  {
    id: 'buyout_all',
    name: '买断所有底片',
    emoji: '💎',
    description: '一次性买断大粉所有照片底片',
    cost: 80000,
    effect: { loyalty: 25, hasBlackmail: false, attitude: 'supportive' },
  },
];

// 大粉态度变化事件
export const fansiteEvents = [
  {
    id: 'fansite_happy',
    trigger: { minLoyalty: 80 },
    title: '大粉产出高质量物料',
    description: '你的大粉发了九宫格神图，转发破万，吸了一波路人粉',
    effect: { fanLoyalty: 3, commercialValue: 2 },
  },
  {
    id: 'fansite_neutral',
    trigger: { loyaltyRange: [40, 60] },
    title: '大粉开始接对家活',
    description: '发现你的大粉最近也在拍/cue对家艺人，粉丝群里开始有怨言',
    effect: { fanLoyalty: -2, prRisk: 2 },
  },
  {
    id: 'fansite_angry',
    trigger: { maxLoyalty: 30 },
    title: '大粉脱粉回踩',
    description: '一位大粉宣布脱粉，放出了一批黑历史，还写了长文吐槽',
    effect: { fanLoyalty: -5, prRisk: 6, commercialValue: -3 },
  },
  {
    id: 'fansite_blackmail',
    trigger: { hasBlackmail: true, minLoyalty: 40 },
    title: '大粉暗示要好处',
    description: '大粉私信你："最近手头紧，想卖点独家图，你觉得呢？"',
    choices: [
      { text: '给钱', cost: 30000, effect: { loyalty: 5, hasBlackmail: false } },
      { text: '拒绝', effect: { loyalty: -20, attitude: 'hostile' } },
    ],
  },
];
