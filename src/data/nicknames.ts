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
    '一颗甄糖',
    '甜栗子壳',
    '月亮糖罐子',
    '藏一颗星',
    '甄之味',
    '云端糖水',
    '与你顺遂',
    '甜过山楂',
    '樱桃味的甄',
    '愿你被爱',
    '藏在星尘里',
    '甜芋头',
    '汽水与光',
    '甄且盛开',
  ],
  actor: [
    '看完再喝水',
    '好戏成瘾',
    '慢镜头里的她',
    '深巷电影票',
    '一帧一顿',
    '胶片与雨',
    '看她剪影',
    '她眉眼盛雪',
    '路演小雨',
    '为她收藏',
    '光影借宿',
    '半张银幕',
    '看她开机',
    '把奖颁给她',
  ],
  singer: [
    '耳机里落雨',
    '副歌起风了',
    '低音是海',
    '尾音三秒',
    '循环到天亮',
    '八度以上',
    '歌里余温',
    '藏进耳机',
    '晚风与鼓点',
    'live house 靠墙',
    '副歌请长一点',
    '给他一束光',
    '一秒回到主歌',
    '为他续票',
  ],
  influencer: [
    '暖光里的姐',
    '姐的直播间',
    '玫瑰味口红',
    '被她治愈了',
    '姐姐今天真美',
    '灯下小狐狸',
    '想成为她',
    '被她夸夸',
    '她好会说话',
    '姐是清风',
    '姐姐真温柔',
    '看她眼睛',
    '晚八点见',
    '再买一支',
  ],
  socialite: [
    '一寸山河',
    '眉眼是月',
    '风一样的他',
    '古偶天菜',
    '藏进他袖里',
    '一帧他的侧脸',
    '陌上花开',
    '看他转身',
    '他是山间雪',
    '深夜灯火',
    '一帧封神',
    '为他碎钻',
    '想借他一秒',
    '低头是他',
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
