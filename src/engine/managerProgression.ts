// 经纪人等级系统（Manager XP）
// -----------------------------------------------------------
// 目的：把"实习/见习/初级"的纯时间进级改成"靠真实操作攒经验值"的垂直成长线。
// XP 不是时间累加的，是事件结算时按"质量"发放：
//   - 把危机从高 PR 拉下来
//   - 做出 net-positive 的选择
//   - 守住高忠诚
//   - 推完一条大粉剧情弧
//   ...
// 反之也会扣（负债、塌房、忠诚暴跌）。
//
// 整局 20 天的节奏：
//   Lv1 → Lv2：~3-5 天玩家就能达到（让他早一点看到升级）
//   Lv2 → Lv3：~第 8-10 天
//   Lv3 → Lv4：~第 14-16 天（高手线）
//   Lv4 → Lv5：只有教科书级别打法能到（整局成就）
//
// 没有降级。最近 3 天净 XP < 0 时，UI 显示"⚠️ 最近状态滑坡"（提示而已）。

import type { GameStats, StatChange } from '@/types/game';

// ===== 等级表 =====

export interface ManagerLevel {
  lv: number;
  title: string;
  emoji: string;
  /** 到达这一级需要的累计 XP（首个等级=0） */
  minXp: number;
  /** 升级时 toast 副标题（世界给你的回应，不是 stat buff） */
  perk: string;
  /** MeTab 上的"你现在能做什么"小字 */
  hint: string;
}

export const MANAGER_LEVELS: ManagerLevel[] = [
  {
    lv: 1,
    title: '实习经纪人',
    emoji: '📋',
    minXp: 0,
    perk: '—',
    hint: '工位在过道边，能看见走廊的绿植',
  },
  {
    lv: 2,
    title: '正式经纪人',
    emoji: '👔',
    minXp: 80,
    perk: '公司给你换了带窗户的工位',
    hint: '可以独立对接中等量级商务了',
  },
  {
    lv: 3,
    title: '签约经纪人',
    emoji: '💼',
    minXp: 200,
    perk: 'S 级商务开始主动打电话试探',
    hint: '圈内已经叫得出你的名字',
  },
  {
    lv: 4,
    title: '金牌经纪人',
    emoji: '🏆',
    minXp: 400,
    perk: '竞争公司开始给你发挖角邀请',
    hint: '顶流资源向你艺人倾斜',
  },
  {
    lv: 5,
    title: '行业教父/教母',
    emoji: '👑',
    minXp: 700,
    perk: '你说一句话，热搜榜会听',
    hint: '已达最高等级 · 结局将有专属彩蛋',
  },
];

export const MAX_MANAGER_LEVEL = MANAGER_LEVELS.length;

// ===== 特殊称号（状态异常 overlay，不改 level） =====

export interface SpecialManagerTitle {
  id: string;
  title: string;
  emoji: string;
  match: (ctx: { stats: GameStats }) => boolean;
}

export const SPECIAL_MANAGER_TITLES: SpecialManagerTitle[] = [
  {
    id: 'tightrope',
    title: '走钢丝的疯子',
    emoji: '🤡',
    match: ({ stats }) => stats.prRisk > 90,
  },
  {
    id: 'debtor',
    title: '负债经纪人',
    emoji: '💀',
    match: ({ stats }) => stats.money < -50000,
  },
  {
    id: 'abandoned',
    title: '全网最惨经纪人',
    emoji: '🪦',
    match: ({ stats }) => stats.fanLoyalty <= 5,
  },
  {
    id: 'shark',
    title: '黑心资本家',
    emoji: '🦈',
    match: ({ stats }) => stats.money > 300000 && stats.fanLoyalty < 20,
  },
];

// ===== 当前等级查询 =====

export function getLevelFromXp(xp: number): ManagerLevel {
  // 从高往低匹配
  for (let i = MANAGER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= MANAGER_LEVELS[i].minXp) return MANAGER_LEVELS[i];
  }
  return MANAGER_LEVELS[0];
}

export function getNextLevel(currentLv: number): ManagerLevel | null {
  const next = MANAGER_LEVELS.find(l => l.lv === currentLv + 1);
  return next ?? null;
}

/** 返回 0-1 到下一级的进度；已到顶返回 1 */
export function getLevelProgress(xp: number, currentLv: number): number {
  const current = MANAGER_LEVELS.find(l => l.lv === currentLv);
  const next = getNextLevel(currentLv);
  if (!current || !next) return 1;
  const range = next.minXp - current.minXp;
  if (range <= 0) return 1;
  return Math.max(0, Math.min(1, (xp - current.minXp) / range));
}

// ===== XP 发放：按"事件选择结算"算 =====

export interface ChoiceXpContext {
  /** 事件的严重程度（可选，影响高难度事件的奖励权重） */
  severity?: 'low' | 'medium' | 'high' | 'critical';
  /** 这个选择施加的 stat 变化（已按艺人/颜值结算完后的最终变化） */
  statChanges: StatChange;
  /** 施加之前的 stats（用于判断危机拉回等差值） */
  prevStats: GameStats;
  /** 施加之后的 stats */
  nextStats: GameStats;
  /** 是否是高优先级（urgent）消息的选择 */
  wasUrgent?: boolean;
  /** 是否是大粉剧情弧的 finale（step=2→3 那步） */
  wasArcFinale?: boolean;
}

export interface XpAward {
  xpDelta: number;
  /** 发放原因的短文案，给 toast / MeTab 最近动态使用 */
  reasons: string[];
}

/** 事件选择时结算 XP。返回 0 或正或负均可。 */
export function awardChoiceXp(ctx: ChoiceXpContext): XpAward {
  const reasons: string[] = [];
  let xp = 0;

  const { statChanges, prevStats, nextStats, wasUrgent, wasArcFinale, severity } = ctx;

  // 1. 基础：net-positive 的选择（钱多了 / 粉丝多了 / 风险降了）
  const isNetPositive =
    (statChanges.money ?? 0) > 0 ||
    (statChanges.fanLoyalty ?? 0) > 0 ||
    (statChanges.prRisk ?? 0) < 0;
  if (isNetPositive) {
    xp += 5;
    reasons.push('稳住了场面 +5');
  }

  // 2. 综合涨幅大（单步至少 +10 等效收益）
  const compositeGain =
    (statChanges.fanLoyalty ?? 0) +
    (statChanges.commercialValue ?? 0) -
    (statChanges.prRisk ?? 0);
  if (compositeGain >= 10) {
    xp += 15;
    reasons.push('一把抓住了机会 +15');
  }

  // 3. 危机拉回：prRisk 从 ≥70 降到 <50
  if (prevStats.prRisk >= 70 && nextStats.prRisk < 50) {
    xp += 30;
    reasons.push('把公关危机压下来了 +30');
  }

  // 4. 高优先级紧急消息（severity high/critical）被妥善处理（没进一步恶化）
  if (wasUrgent && (severity === 'high' || severity === 'critical')) {
    const worsened =
      (statChanges.prRisk ?? 0) > 5 ||
      (statChanges.fanLoyalty ?? 0) < -5;
    if (!worsened) {
      xp += 20;
      reasons.push('处理了紧急高风险事件 +20');
    }
  }

  // 5. 大粉剧情弧 finale 推进
  if (wasArcFinale) {
    xp += 25;
    reasons.push('见证了一条大粉的完整弧线 +25');
  }

  return { xpDelta: xp, reasons };
}

// ===== XP 发放：每日结算（endDay） =====

export interface DailyXpContext {
  prevStats: GameStats;
  nextStats: GameStats;
  /** 当日净收支（用于判断单日亏损） */
  dailyNetMoney: number;
  /** 连续忠诚高位天数（当前 >60 的连击数） */
  highLoyaltyStreak: number;
}

export function awardDailyXp(ctx: DailyXpContext): XpAward {
  const reasons: string[] = [];
  let xp = 0;

  // 6. 高忠诚连击：连续 3 天以上 fanLoyalty >60
  if (ctx.highLoyaltyStreak >= 3 && ctx.nextStats.fanLoyalty > 60) {
    xp += 10;
    reasons.push('粉丝继续给力 +10');
  }

  // 7. 舆论风险破 80 —— 扣
  if (ctx.prevStats.prRisk < 80 && ctx.nextStats.prRisk >= 80) {
    xp -= 15;
    reasons.push('舆论风险破 80 -15');
  }

  // 8. 忠诚度跌破 20 —— 扣
  if (ctx.prevStats.fanLoyalty >= 20 && ctx.nextStats.fanLoyalty < 20) {
    xp -= 10;
    reasons.push('粉丝大规模流失 -10');
  }

  // 9. 单日亏损
  if (ctx.dailyNetMoney < 0) {
    xp -= 5;
    reasons.push('今日账户亏损 -5');
  }

  return { xpDelta: xp, reasons };
}

// ===== 升级检测 =====

export interface LevelUpResult {
  leveledUp: boolean;
  /** 新等级（只在 leveledUp 时有意义） */
  newLevel: ManagerLevel | null;
  /** 直接跨 2 级及以上？罕见但技术上可能发生。 */
  levelsCrossed: number;
}

export function checkLevelUp(prevXp: number, newXp: number): LevelUpResult {
  const prevLv = getLevelFromXp(prevXp).lv;
  const newLv = getLevelFromXp(newXp).lv;
  if (newLv <= prevLv) {
    return { leveledUp: false, newLevel: null, levelsCrossed: 0 };
  }
  return {
    leveledUp: true,
    newLevel: getLevelFromXp(newXp),
    levelsCrossed: newLv - prevLv,
  };
}

// ===== 特殊称号匹配 =====

export function matchSpecialTitle(stats: GameStats): SpecialManagerTitle | null {
  for (const sp of SPECIAL_MANAGER_TITLES) {
    if (sp.match({ stats })) return sp;
  }
  return null;
}
