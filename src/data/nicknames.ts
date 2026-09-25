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
    '甄的甜',
    '帅甜八两',
    '帅气过敏',
    '把zs护送到2099',
    '真真好啊',
    '甜过投屏',
    '帅到失语症',
    '帅仔今天营业了吗',
    'zs的碎钻',
    '帅哥请留步',
    '甄一颗糖',
    '愿zs顺遂',
    '偷偷藏起来',
    '甜到牙齿',
  ],
  actor: [
    '美啊救命',
    '好mm的观众',
    '看了三遍',
    'hml镜头切我',
    '美丽姐脑膜炎',
    '好家伙金鸡',
    '哭着夸她',
    '演技破碎bot',
    '好mm今天营业',
    '美美美',
    '姐姐今天真美',
    '离美丽近点',
    '碎钻晃眼',
    'hml轻点开机',
  ],
  singer: [
    '八哥碎钻',
    '一秒回songs',
    '耳机里全是他',
    'gbd循环bot',
    '八哥高音杀我',
    '八度失眠',
    '低音都好听',
    '演唱会门票求',
    '八哥今天开麦了吗',
    '姐妹磕爆八哥',
    'gbd碎念',
    '八哥值得',
    '为八哥打歌',
    '哥的耳机线',
  ],
  influencer: [
    '姐姐好美',
    '被冰冰拿捏',
    '直播守门员',
    '冰凝的口红',
    '姐姐真敢说',
    '追直播不睡',
    '姐骨相太绝',
    '姐姐今天好看',
    '冰冰赛高',
    '姐妹别错过',
    '想被冰冰宠',
    '直播蹲蹲蹲',
    '姐姐的镜头感',
    '被冰凝夺舍',
  ],
  socialite: [
    '格格の侧颜',
    '陌格今天封神',
    '好绝一男的',
    '格哥请转身',
    '红毯看不够',
    '一寸格式',
    '陌格失语症',
    '哥的下颌线',
    '古偶天菜',
    '这颜值犯规',
    '格哥碎钻',
    '磕爆陌格',
    '陌格是我的',
    '格哥今天营业',
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
