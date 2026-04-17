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
    description: '粉丝忠诚度达到 100',
    emoji: '💕',
    rarity: 'rare',
    check: ({ stats }) => stats.fanLoyalty >= 100,
  },
  {
    id: 'max_commercial',
    title: '行走的ATM',
    description: '商业价值达到 100',
    emoji: '💎',
    rarity: 'rare',
    check: ({ stats }) => stats.commercialValue >= 100,
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
  {
    id: 'survive_30',
    title: '经纪人之神',
    description: '坚持到第30天',
    emoji: '👑',
    rarity: 'rare',
    check: ({ day }) => day >= 30,
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
    description: '用甄帅把粉丝忠诚打到90+',
    emoji: '🌟',
    rarity: 'rare',
    check: ({ stats, artistId }) => artistId === 'idol' && stats.fanLoyalty >= 90,
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
    description: '在第5天前就触发结局',
    emoji: '⚡',
    rarity: 'legendary',
    check: ({ day }) => day <= 5,
  },
  {
    id: 'zero_risk',
    title: '无懈可击',
    description: '第15天时风险仍为0',
    emoji: '🧊',
    rarity: 'legendary',
    check: ({ stats, day }) => day >= 15 && stats.prRisk === 0,
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
