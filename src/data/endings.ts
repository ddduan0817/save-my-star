import type { GameStats, Ending, EndingId } from '@/types/game';

export const endings: Ending[] = [
  {
    id: 'cancelled',
    title: '全网封杀',
    subtitle: '从此消失在公众视野',
    description: '舆论风险到达临界点的那一刻，你的手机同时收到了十七条消息——全是解约通知。平台限流、品牌跑路、综艺撤邀。你坐在空荡荡的办公室里，刷着热搜第一的词条："再见了，XX。"三个月后，这个名字只出现在营销课的反面案例里。',
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
    description: '你的艺人创造了一项不光彩的纪录——连续登上负面热搜榜首。粉丝群里最后一个人关了灯。品牌方把TA的立牌从店里撤走那天，有路人拍了张照发网上：画面里TA的脸被贴上了"清仓"的标签。黑红不是红，只是黑的另一种写法。',
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
    description: '银行APP上的数字让你忍不住截了个图——但你不敢发朋友圈。粉丝散了，口碑裂了，"割韭菜"三个字像文身一样刻在了你艺人的百科词条里。不过...TA似乎并不在乎。你们最后一次通话，TA正在马尔代夫的沙滩上晒太阳："赚够了就行。有些东西比名声值钱。"你挂了电话，不知道该羡慕还是叹气。',
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
    description: '《时代》杂志的封面拍了三个小时。摄影师最后选了一张TA不经意回头的照片——光打在侧脸上，眼神里有一种经历过所有事之后才有的平静。你站在棚外看着监视器里的画面，突然想起TA刚出道时在练习室摔倒又爬起来的样子。那个人和这个人，是同一个人。你鼻子一酸。',
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
    description: '也许商业数据不是最亮眼的，也许没有拿到最大的代言。但每次演唱会散场后，总有人在场外等到凌晨三点只为说一句"你唱得真好"。每条微博下面的评论不是控评复制粘贴，而是一千个人写的一千种真心话。有天你在后台看到TA偷偷在读粉丝的信，读着读着笑了，笑着笑着眼眶红了。这大概就是偶像最好的样子。',
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
    description: '你还记得那个最黑暗的夜晚——热搜前三全是TA的名字，没有一条是好的。TA在化妆间里问你："还有救吗？"你说："有。"其实当时你也不确定。但你们硬是扛过来了。翻盘那天，TA在台上哽咽了。台下粉丝举着灯牌，上面写的不是名字，是"我们没走"。',
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
    description: '没有大红大紫，也没有塌房翻车。TA的名字不会出现在年终盘点的第一位，但会出现在很多人"最想合作的艺人"名单里。有戏拍、有歌唱、有人在深夜的出租车里单曲循环TA的歌。你打开手机看了看明天的行程——满满当当。挺好的。',
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
    description: '退圈声明是TA自己写的，你一个字都没改。发出去的那天热搜挂了一整天，评论区全是蜡烛和"不要走"。但TA早就想好了——在最亮的时候转身，留给所有人一个想念的理由。最后一条微博的配图是TA背对镜头走向一条没人认识TA的街道。你关上了办公室的灯，觉得窗外的晚霞很好看。',
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
    description: '你在某个小城市的商场外面看到了那张海报——TA的名字印在最下面，字号比标题小两号。旁边是"门票：88元"。你想起刚出道那年，同样是商场活动，TA站在台上唱歌，台下挤满了人。现在台下只有十几把塑料椅子，空了一半。你没有走过去。转身的时候你想：这个行业的残酷不在于把你推下去，而在于没有人记得你曾经站在上面。',
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
