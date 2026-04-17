import type { GameStats, Artist, DecisionRecord, WeiboTrend, FanComment } from '@/types/game';

// ===== Weibo Trends =====

const scandalTrends = [
  '#{name}黑料被扒#', '#{name}人设崩塌#', '#{name}被锤#',
  '#{name}道歉#', '#{name}又翻车了#', '#{name}塌房实锤#',
  '#爆料{name}真面目#', '#{name}粉丝脱粉回踩#',
];

const positiveFanTrends = [
  '#{name}超话#', '#{name}太绝了#', '#{name}YYDS#',
  '#{name}新物料#', '#谁懂{name}的魅力#', '#{name}粉丝破千万#',
  '#{name}直拍#', '#{name}又帅又能打#',
];

const businessTrends = [
  '#{name}新代言#', '#{name}商务资源逆天#', '#{name}品牌大使#',
  '#{name}时尚大片#', '#{name}登杂志封面#', '#{name}商业价值榜TOP#',
];

const neutralTrends = [
  '#娱乐圈又地震了#', '#某顶流深夜发文#', '#今天追星了吗#',
  '#新剧开机阵容曝光#', '#综艺路透流出#', '#选秀节目争议#',
  '#导演内涵某明星#', '#经纪人有多难当#', '#明星的一天#',
  '#饭圈文化观察#', '#娱乐圈隐藏CP#', '#明星收入排行#',
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function formatHeat(): string {
  const base = Math.floor(Math.random() * 9000 + 1000);
  if (base > 5000) return `${(base / 100).toFixed(0)}万`;
  return `${base}万`;
}

export function generateWeiboTrends(
  stats: GameStats,
  artist: Artist,
  _decisionHistory: DecisionRecord[],
  _activeTags: string[],
): WeiboTrend[] {
  const name = artist.name;
  const trends: WeiboTrend[] = [];
  let rank = 1;

  // High risk → scandal trends
  if (stats.prRisk > 60) {
    const count = stats.prRisk > 80 ? 3 : 2;
    const selected = pickRandom(scandalTrends, count);
    for (const t of selected) {
      trends.push({
        rank: rank++,
        title: t.replace('{name}', name),
        heat: formatHeat(),
        isHot: Math.random() < 0.5,
        sentiment: 'negative',
      });
    }
  }

  // High fan loyalty → fan trends
  if (stats.fanLoyalty > 50) {
    const count = stats.fanLoyalty > 70 ? 2 : 1;
    const selected = pickRandom(positiveFanTrends, count);
    for (const t of selected) {
      trends.push({
        rank: rank++,
        title: t.replace('{name}', name),
        heat: formatHeat(),
        isHot: stats.fanLoyalty > 70,
        sentiment: 'positive',
      });
    }
  }

  // High commercial → business trends
  if (stats.commercialValue > 50) {
    const selected = pickRandom(businessTrends, 1);
    for (const t of selected) {
      trends.push({
        rank: rank++,
        title: t.replace('{name}', name),
        heat: formatHeat(),
        isHot: false,
        sentiment: 'positive',
      });
    }
  }

  // Fill rest with neutral
  const remaining = Math.max(2, 7 - trends.length);
  const neutralSelected = pickRandom(neutralTrends, remaining);
  for (const t of neutralSelected) {
    trends.push({
      rank: rank++,
      title: t.replace('{name}', name),
      heat: formatHeat(),
      isHot: false,
      sentiment: 'neutral',
    });
  }

  // Re-rank
  return trends.map((t, i) => ({ ...t, rank: i + 1 }));
}

// ===== Fan Comments =====

const supportiveComments = [
  '永远支持你！加油！', '哥哥/姐姐今天也好帅/好美！', '冲鸭！我们一直在！',
  '啊啊啊太好看了吧', '妈妈爱你！', '你值得所有美好的事',
  '追星追到最好的了', '这才是真正的艺人！', '笑死 又被圈粉了',
  '你好好休息 我们等你', '今天也是为你骄傲的一天', '别理那些黑子 我们挺你',
];

const angryComments = [
  '真的好失望...', '你对得起粉丝吗', '脱粉了 再见', '路转黑',
  '早就看出来了 人设而已', '粉丝的钱是大风刮来的？',
  '别装了 累不累', '以前多喜欢 现在多讨厌',
];

const hateComments = [
  '塌房活该 早该凉了', '就这还有人喜欢？？', '黑料一箩筐',
  '啥时候退圈啊 等着呢', '爬', '哈哈哈终于翻车了',
  '资源咖 没实力就是没实力', '路人表示很反感',
];

const neutralComments = [
  '路过 看看热闹', '这个人最近好火啊', '不了解 有人科普一下吗',
  '吃瓜ing', '围观不站队', '热搜又见 频率好高',
];

const avatarEmojis = ['🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🦄', '🌸', '⭐', '🌙', '🍑', '🎀', '💫', '🌻', '🍒'];

const nicknames = [
  '追星少女', '吃瓜群众', '路人甲', '快乐小粉丝', '理智追星人',
  '不明真相围观', '娱乐博主', '黑粉滚粗', '清醒追星', '今天脱粉了吗',
  '哈哈哈哈哈', '理性讨论', '退出饭圈', '盲目支持', '又来吃瓜',
  '微博冲浪选手', '十级冲浪🏄', '瓜田守望者',
];

export function generateFanComments(stats: GameStats, _artist: Artist): FanComment[] {
  const comments: FanComment[] = [];

  // Determine distribution based on stats
  let supportiveRatio = 0.4;
  let angryRatio = 0.2;
  let hateRatio = 0.1;
  let neutralRatio = 0.3;

  if (stats.fanLoyalty > 70) {
    supportiveRatio = 0.6;
    angryRatio = 0.1;
    hateRatio = 0.05;
    neutralRatio = 0.25;
  } else if (stats.fanLoyalty < 30) {
    supportiveRatio = 0.15;
    angryRatio = 0.35;
    hateRatio = 0.2;
    neutralRatio = 0.3;
  }

  if (stats.prRisk > 60) {
    hateRatio += 0.15;
    angryRatio += 0.1;
    supportiveRatio -= 0.2;
    neutralRatio -= 0.05;
  }

  const total = 8;
  const counts = {
    supportive: Math.round(total * supportiveRatio),
    angry: Math.round(total * angryRatio),
    hate: Math.round(total * hateRatio),
    neutral: Math.max(1, total - Math.round(total * supportiveRatio) - Math.round(total * angryRatio) - Math.round(total * hateRatio)),
  };

  const pools: Record<string, string[]> = {
    supportive: supportiveComments,
    angry: angryComments,
    hate: hateComments,
    neutral: neutralComments,
  };

  const sentimentTypes = ['supportive', 'angry', 'hate', 'neutral'] as const;

  for (const sentiment of sentimentTypes) {
    const count = counts[sentiment];
    const selected = pickRandom(pools[sentiment], count);
    for (const content of selected) {
      comments.push({
        id: `comment-${comments.length}-${Math.random().toString(36).slice(2, 6)}`,
        avatar: avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)],
        nickname: nicknames[Math.floor(Math.random() * nicknames.length)],
        content,
        likes: Math.floor(Math.random() * 2000),
        sentiment,
      });
    }
  }

  // Shuffle
  return comments.sort(() => Math.random() - 0.5);
}
