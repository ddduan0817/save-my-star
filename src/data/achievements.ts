import type { GameStats, DecisionRecord, ArtistArchetype } from '@/types/game';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'legendary';
  // 检查函数：传入游戏状态，返回是否达成
  check: (ctx: AchievementContext) => boolean;
}

export interface AchievementContext {
  stats: GameStats;
  day: number;
  artistId: ArtistArchetype;
  activeTags: string[];
  decisionHistory: DecisionRecord[];
  peakRisk: number;
}

export const achievements: Achievement[] = [
  // ===== 数值类 =====
  {
    id: 'money_tycoon',
    title: '人间富贵花',
    description: '资金超过 ¥40万',
    emoji: '💰',
    rarity: 'rare',
    check: ({ stats }) => stats.money >= 400000,
  },
  {
    id: 'broke_af',
    title: '穷得叮当响',
    description: '资金降到 ¥0 以下',
    emoji: '🪹',
    rarity: 'common',
    check: ({ stats }) => stats.money < 0,
  },
  {
    id: 'max_fan',
    title: '万人迷',
    description: '粉丝忠诚度达到 90',
    emoji: '💕',
    rarity: 'rare',
    check: ({ stats }) => stats.fanLoyalty >= 90,
  },
  {
    id: 'max_commercial',
    title: '行走的ATM',
    description: '商业价值达到 90',
    emoji: '💎',
    rarity: 'rare',
    check: ({ stats }) => stats.commercialValue >= 90,
  },
  {
    id: 'high_risk_survivor',
    title: '走钢丝的人',
    description: '舆论风险超过 80 还活着',
    emoji: '🎪',
    rarity: 'common',
    check: ({ stats }) => stats.prRisk >= 80,
  },
  {
    id: 'all_stats_60',
    title: '六边形战士',
    description: '商业、粉丝都≥60，风险≤30',
    emoji: '⭐',
    rarity: 'rare',
    check: ({ stats }) => stats.commercialValue >= 60 && stats.fanLoyalty >= 60 && stats.prRisk <= 30,
  },

  // ===== 行为类 =====
  {
    id: 'early_crisis',
    title: '开局就塌房',
    description: '第3天前风险就超过 50',
    emoji: '💥',
    rarity: 'common',
    check: ({ stats, day }) => day <= 3 && stats.prRisk > 50,
  },
  {
    id: 'crisis_addict',
    title: '危机爱好者',
    description: '连续处理5个以上危机事件',
    emoji: '🔥',
    rarity: 'common',
    check: ({ decisionHistory }) => {
      if (decisionHistory.length < 5) return false;
      const last5 = decisionHistory.slice(-5);
      return last5.every(d => d.eventId.includes('crisis') || d.eventId.includes('milestone_official') || d.eventId.includes('milestone_broke'));
    },
  },
  {
    id: 'big_spender',
    title: '花钱如流水',
    description: '单局累计花费超过 ¥30万',
    emoji: '🌊',
    rarity: 'common',
    check: ({ decisionHistory }) => {
      const totalSpent = decisionHistory.reduce((sum, d) => {
        const m = d.statChanges.money ?? 0;
        return m < 0 ? sum + Math.abs(m) : sum;
      }, 0);
      return totalSpent >= 300000;
    },
  },
  {
    id: 'rollercoaster',
    title: '过山车人生',
    description: '风险曾超过80后又降到30以下',
    emoji: '🎢',
    rarity: 'rare',
    check: ({ stats, peakRisk }) => peakRisk > 80 && stats.prRisk < 30,
  },

  // ===== 天数类 =====
  {
    id: 'survive_10',
    title: '苟住了',
    description: '坚持到第10天',
    emoji: '🛡️',
    rarity: 'common',
    check: ({ day }) => day >= 10,
  },
  {
    id: 'survive_20',
    title: '老油条',
    description: '坚持到第20天',
    emoji: '🦊',
    rarity: 'common',
    check: ({ day }) => day >= 20,
  },

  // ===== 艺人类 =====
  {
    id: 'try_all_artists',
    title: '一个都不放过',
    description: '尝试过所有4位艺人（需多局游戏）',
    emoji: '🎭',
    rarity: 'legendary',
    // 这个需要跨局检测，在 store 里特殊处理
    check: () => false,
  },
  {
    id: 'idol_master',
    title: '饭圈教父',
    description: '用甄帅把粉丝忠诚打到80+',
    emoji: '🌟',
    rarity: 'rare',
    check: ({ stats, artistId }) => artistId === 'idol' && stats.fanLoyalty >= 80,
  },
  {
    id: 'influencer_rich',
    title: '带货女王的经纪人',
    description: '用冷冰凝赚到 ¥50万',
    emoji: '📱',
    rarity: 'rare',
    check: ({ stats, artistId }) => artistId === 'influencer' && stats.money >= 500000,
  },

  // ===== 隐藏/趣味 =====
  {
    id: 'speed_run',
    title: '速通大师',
    description: '在第3天前就触发结局',
    emoji: '⚡',
    rarity: 'legendary',
    check: ({ day }) => day <= 3,
  },
  {
    id: 'zero_risk',
    title: '无懈可击',
    description: '第10天时风险仍为0',
    emoji: '🧊',
    rarity: 'legendary',
    check: ({ stats, day }) => day >= 10 && stats.prRisk === 0,
  },

  // ===== 奇葩/搞笑成就 =====
  {
    id: 'poverty_line',
    title: '吃土经纪人',
    description: '资金降到 -10万 以下，你比艺人还惨',
    emoji: '🪦',
    rarity: 'rare',
    check: ({ stats }) => stats.money <= -100000,
  },
  {
    id: 'drama_magnet',
    title: '热搜体质',
    description: '单局触发过8个以上事件',
    emoji: '🧲',
    rarity: 'common',
    check: ({ decisionHistory }) => decisionHistory.length >= 8,
  },
  {
    id: 'mood_swing',
    title: '精分经纪人',
    description: '连续两个选择一个加忠诚一个减忠诚',
    emoji: '🎭',
    rarity: 'common',
    check: ({ decisionHistory }) => {
      if (decisionHistory.length < 2) return false;
      const last2 = decisionHistory.slice(-2);
      const a = last2[0].statChanges.fanLoyalty ?? 0;
      const b = last2[1].statChanges.fanLoyalty ?? 0;
      return (a > 0 && b < 0) || (a < 0 && b > 0);
    },
  },
  {
    id: 'money_printer',
    title: '印钞机',
    description: '单局累计赚超过 ¥50万',
    emoji: '🖨️',
    rarity: 'rare',
    check: ({ decisionHistory }) => {
      const totalEarned = decisionHistory.reduce((sum, d) => {
        const m = d.statChanges.money ?? 0;
        return m > 0 ? sum + m : sum;
      }, 0);
      return totalEarned >= 500000;
    },
  },
  {
    id: 'risk_junkie',
    title: '危险就是我的春药',
    description: '风险超过90还在继续玩',
    emoji: '☠️',
    rarity: 'rare',
    check: ({ stats }) => stats.prRisk >= 90,
  },
  {
    id: 'flat_liner',
    title: '咸鱼经纪人',
    description: '商业、粉丝、风险全部在30-50之间，毫无波澜',
    emoji: '🐟',
    rarity: 'rare',
    check: ({ stats }) =>
      stats.commercialValue >= 30 && stats.commercialValue <= 50 &&
      stats.fanLoyalty >= 30 && stats.fanLoyalty <= 50 &&
      stats.prRisk >= 30 && stats.prRisk <= 50,
  },
  {
    id: 'fan_zero',
    title: '孤家寡人',
    description: '粉丝忠诚度降到0',
    emoji: '🦗',
    rarity: 'common',
    check: ({ stats }) => stats.fanLoyalty <= 0,
  },
  {
    id: 'phoenix',
    title: '涅槃重生',
    description: '粉丝忠诚曾低于10后又回到70以上',
    emoji: '🔥',
    rarity: 'legendary',
    check: ({ stats, decisionHistory }) => {
      const wasLow = decisionHistory.some(d => {
        const fl = d.statChanges.fanLoyalty ?? 0;
        return fl < -5; // 曾经大幅掉粉
      });
      return wasLow && stats.fanLoyalty >= 70;
    },
  },
  {
    id: 'pacifist',
    title: '和平主义者',
    description: '前5个选择全部没有增加风险',
    emoji: '🕊️',
    rarity: 'rare',
    check: ({ decisionHistory }) => {
      if (decisionHistory.length < 5) return false;
      const first5 = decisionHistory.slice(0, 5);
      return first5.every(d => (d.statChanges.prRisk ?? 0) <= 0);
    },
  },
  {
    id: 'chaos_agent',
    title: '混沌经纪人',
    description: '前5个选择每个都增加了风险',
    emoji: '🌀',
    rarity: 'legendary',
    check: ({ decisionHistory }) => {
      if (decisionHistory.length < 5) return false;
      const first5 = decisionHistory.slice(0, 5);
      return first5.every(d => (d.statChanges.prRisk ?? 0) > 0);
    },
  },
  {
    id: 'survivor_no_money',
    title: '穷但活着',
    description: '资金为负数还撑到了第15天',
    emoji: '💀',
    rarity: 'rare',
    check: ({ stats, day }) => day >= 15 && stats.money < 0,
  },
];

// localStorage 存储
const ACHIEVEMENT_KEY = 'celebrity-sim-achievements';

export function loadUnlockedAchievements(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ACHIEVEMENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAchievement(id: string): string[] {
  const current = loadUnlockedAchievements();
  if (!current.includes(id)) {
    current.push(id);
    localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(current));
  }
  return current;
}

// 跨局追踪已用艺人
const ARTISTS_USED_KEY = 'celebrity-sim-artists-used';

export function loadArtistsUsed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ARTISTS_USED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveArtistUsed(id: string): string[] {
  const current = loadArtistsUsed();
  if (!current.includes(id)) {
    current.push(id);
    localStorage.setItem(ARTISTS_USED_KEY, JSON.stringify(current));
  }
  return current;
}

/** 检查当前状态是否解锁了新成就，返回新解锁的成就列表 */
export function checkAchievements(ctx: AchievementContext): Achievement[] {
  const unlocked = loadUnlockedAchievements();
  const newlyUnlocked: Achievement[] = [];

  for (const ach of achievements) {
    if (unlocked.includes(ach.id)) continue;

    // 特殊处理：尝试所有艺人
    if (ach.id === 'try_all_artists') {
      const used = loadArtistsUsed();
      if (used.length >= 4) {
        saveAchievement(ach.id);
        newlyUnlocked.push(ach);
      }
      continue;
    }

    if (ach.check(ctx)) {
      saveAchievement(ach.id);
      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
}
