// 粉圈昵称 & 头像池 —— 让视奸信息流拟真微博
// 真实微博粉圈昵称多为 2-6 字：叠字、拼音缩写、cp 前缀、单字 emoji 混搭
import type { ArtistArchetype } from '@/types/game';

export const NICKNAME_POOL: string[] = [
  '糖不加冰',
  '追星使我快乐',
  '柠檬鸭',
  '一只咕咕',
  '摆烂橘子',
  '打工不哭',
  '吃火锅',
  'emo酱',
  '咖啡续命',
  '翻滚鸡腿',
  '一只鲸',
  '路人甲',
  '蹲官宣',
  '咸鱼失败',
  '没想好',
  '躺平不倒',
  '磕就完了',
  '路过而已',
  '八卦线',
  '发芽豆子',
  '烤肉魂',
  '不想上班',
  '摆烂人',
  '打野的',
  '摸鱼冠军',
  '蹲个瓜',
  '快乐水',
  '发疯文学',
  '碎碎念',
  '橘猫哲学',
  '想磕糖',
  '请假中',
  '不追会死',
  '深夜蹲',
  '围观九号',
  '别撕了',
  '搬运工',
  '匿名鹅',
  '球长本长',
  '八点档',
  '我不李姐',
  '啊这',
  '已阅',
  '飘过',
  '挑事39号',
  '冷静吃瓜',
  '躺平任嘲',
  '安眠药bot',
  '深夜emo',
  '路人转粉',
  '磕学家',
  '想睡觉',
  '爱吃辣',
  '柠檬精本精',
];

// 各艺人身份专属昵称池：贴近真实微博粉圈起名习惯（叠字/小名/前缀）
const NICKNAME_BY_ARCHETYPE: Record<ArtistArchetype, string[]> = {
  idol: [
    '帅帅的糖',
    '帅帅女友',
    '帅帅の站姐',
    '甄帅本命',
    '打投第九年',
    '甄帅数据组',
    '帅帅超话',
    '甄帅厨',
    '帅帅美貌',
    '帅哥吹',
    '帅粉不撕',
    '帅甜甜',
    '甄不甜',
    '爱吃帅帅',
  ],
  actor: [
    '美丽姐女友',
    '美丽剧粉',
    '演技吹哨',
    '美丽小组',
    '金鸡见证',
    '美丽夸夸',
    '拉票十二年',
    '美丽路人',
    '美丽姐厨',
    '演技吹爆',
    '路演蹲守',
    '美丽的粉',
    '郝好看',
    '美丽姐甜',
  ],
  singer: [
    '八哥女友',
    '八哥打歌',
    '八哥音悦台',
    '八哥应援',
    '每日循环',
    '八哥超话',
    'liveho钉子户',
    '八哥厨',
    '呆萌协会',
    '第八根耳机',
    '打投拆家',
    '八哥甜甜',
    '八哥好听',
    '爱吃八哥',
  ],
  influencer: [
    '冰冰家老粉',
    '冰冰口红',
    '冰冰运营',
    '冰冰同款',
    '冰冰夸夸',
    '追直播八百天',
    '冰凝家搬运',
    '全球代购',
    '不塌房自救',
    '蹲冰冰',
    '清仓小分队',
    '冰凝家甜',
    '冰冰厨',
    '爱冰凝',
  ],
  socialite: [
    '格格女友',
    '陌格红毯',
    '格格高奢',
    '陌格时尚',
    '格格品鉴',
    '陌格颜值',
    '古偶考古',
    '陌格高定',
    '格格侧颜',
    '红毯截图',
    '格粉自救',
    '陌格甜甜',
    '格哥厨',
    '爱陌格',
  ],
};

export const AVATAR_POOL: string[] = [
  '🌸','🌷','🍑','🍓','💐','🌺','🪷','🍿','🍬','🍭',
  '🌈','🌟','⭐','🌙','☕','🍜','🍡','🍰','🍦','🍔',
  '🐱','🐶','🐰','🐻','🐼','🦊','🐨','🐸','🦄','🐳',
  '👀','🙈','🙉','🙊','🌻','🍋','🥝','🍇','🍒','🎈',
];

function pickFromPool<T>(pool: T[], seed?: number): T {
  if (typeof seed === 'number') {
    return pool[Math.abs(seed) % pool.length];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickNickname(archetype?: ArtistArchetype, seed?: number): string {
  if (archetype && Math.random() < 0.6) {
    return pickFromPool(NICKNAME_BY_ARCHETYPE[archetype], seed);
  }
  return pickFromPool(NICKNAME_POOL, seed);
}

export function pickAvatar(seed?: number): string {
  return pickFromPool(AVATAR_POOL, seed);
}
