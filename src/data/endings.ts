import type { GameStats, Ending, EndingId } from '@/types/game';

export const endings: Ending[] = [
  {
    id: 'cancelled',
    title: '全网封杀',
    subtitle: '从此消失在公众视野',
    description: '舆论风险到达临界点，平台全面限流，品牌集体解约。你的艺人成了行业的反面教材。三个月后，再也没有人提起这个名字。',
    emoji: '🚫',
    rarity: 'common',
    color: 'from-red-900 to-red-600',
    priority: 100,
    conditions: (stats) => stats.prRisk >= 95,
  },
  {
    id: 'scandal_king',
    title: '塌房之王',
    subtitle: '热搜常客，但都是黑的',
    description: '你的艺人创造了一个记录：连续登上负面热搜榜首。虽然"黑红也是红"，但品牌方已经跑光了。现在唯一的商业价值是当反面教材。',
    emoji: '💀',
    rarity: 'common',
    color: 'from-gray-900 to-gray-600',
    priority: 90,
    conditions: (stats) => stats.prRisk >= 80 && stats.commercialValue < 20,
  },
  {
    id: 'money_god',
    title: '捞金达人',
    subtitle: '赚到了，但代价是什么',
    description: '银行账户数字惊人，但粉丝早就散了。你的艺人成了"割韭菜"的代名词。不过...他/她真的在乎吗？望着存款余额，嘴角微微上扬。',
    emoji: '🤑',
    rarity: 'rare',
    color: 'from-green-800 to-emerald-500',
    priority: 80,
    conditions: (stats) => stats.money >= 400000 && stats.fanLoyalty < 30,
  },
  {
    id: 'top_star',
    title: '顶流巅峰',
    subtitle: '站在行业金字塔尖',
    description: '商业价值登顶，粉丝忠诚度极高，舆论环境健康。你的艺人成为了这个时代的标志性人物。《时代》杂志的封面留给了他/她。',
    emoji: '👑',
    rarity: 'legendary',
    color: 'from-amber-400 to-yellow-600',
    priority: 70,
    conditions: (stats) => stats.commercialValue >= 80 && stats.fanLoyalty >= 70 && stats.prRisk < 30,
  },
  {
    id: 'fan_favorite',
    title: '粉丝永远的神',
    subtitle: '不是顶流，但是YYDS',
    description: '也许商业数据不是最亮眼的，但粉丝们愿意为他/她赴汤蹈火。每次演唱会都是万人合唱，每条微博都是真情实感。这才是偶像的意义。',
    emoji: '💖',
    rarity: 'rare',
    color: 'from-pink-500 to-rose-400',
    priority: 60,
    conditions: (stats, _tags, day) => stats.fanLoyalty >= 80 && day >= 20,
  },
  {
    id: 'comeback',
    title: '绝地翻盘',
    subtitle: '从谷底杀回巅峰',
    description: '曾经站在悬崖边上，全网都在等着看笑话。但你和你的艺人硬是杀出了一条血路。这个翻盘故事，以后会被写进娱乐圈教科书。',
    emoji: '🔥',
    rarity: 'legendary',
    color: 'from-orange-500 to-red-500',
    priority: 55,
    conditions: (stats, _tags, _day, peakRisk) => peakRisk >= 70 && stats.prRisk < 30 && stats.commercialValue >= 50,
  },
  {
    id: 'transformed',
    title: '华丽转型',
    subtitle: '不再是偶像，而是实力派',
    description: '从流量到实力的蜕变，你的艺人用作品证明了自己。虽然热度不如从前，但每一部作品都是精品，业内人都竖起了大拇指。',
    emoji: '🦋',
    rarity: 'rare',
    color: 'from-purple-500 to-indigo-500',
    priority: 50,
    conditions: (stats, tags) => tags.includes('transform') && stats.commercialValue > 60,
  },
  {
    id: 'steady_star',
    title: '稳定发展',
    subtitle: '不温不火，但长长久久',
    description: '没有大红大紫，也没有塌房翻车。你的艺人在这个瞬息万变的行业里，找到了属于自己的节奏。有戏拍，有歌唱，有人爱。挺好的。',
    emoji: '⭐',
    rarity: 'common',
    color: 'from-blue-500 to-cyan-400',
    priority: 30,
    conditions: (stats, _tags, day) =>
      day >= 20 &&
      stats.commercialValue >= 35 && stats.commercialValue <= 70 &&
      stats.fanLoyalty >= 35 &&
      stats.prRisk < 50,
  },
  {
    id: 'retired',
    title: '主动退圈',
    subtitle: '挥手告别，体面离场',
    description: '在最好的时候选择离开，留给观众一个完美的背影。有人说可惜，但你的艺人笑着说："够了，我想过普通人的生活。"',
    emoji: '👋',
    rarity: 'common',
    color: 'from-slate-400 to-slate-300',
    priority: 20,
    conditions: (_stats, tags) => tags.includes('retired'),
  },
  {
    id: 'fallen',
    title: '过气艺人',
    subtitle: '曾经的顶流，如今无人问津',
    description: '热度像退潮的海水一样消失了。综艺不再邀请，品牌不再续约，粉丝转投了新的偶像。你的艺人开始出现在各种小城市商演的名单上...',
    emoji: '📉',
    rarity: 'common',
    color: 'from-stone-600 to-stone-400',
    priority: 10,
    conditions: (_stats, _tags, day) => day >= 20,
  },
];

export function evaluateEnding(
  stats: GameStats,
  tags: string[],
  day: number,
  peakRisk: number
): Ending | null {
  const sorted = [...endings].sort((a, b) => b.priority - a.priority);
  for (const ending of sorted) {
    if (ending.conditions(stats, tags, day, peakRisk)) {
      return ending;
    }
  }
  return null;
}

export function checkImmediateEnding(stats: GameStats, peakRisk: number, tags: string[]): Ending | null {
  // Only check endings that can trigger mid-game
  if (stats.prRisk >= 95) {
    return endings.find(e => e.id === 'cancelled')!;
  }
  if (stats.prRisk >= 80 && stats.commercialValue < 20) {
    return endings.find(e => e.id === 'scandal_king')!;
  }
  if (tags.includes('retired')) {
    return endings.find(e => e.id === 'retired')!;
  }
  return null;
}
