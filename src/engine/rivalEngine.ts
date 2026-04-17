import type {
  RivalState,
  RivalAction,
  RivalFameLevel,
  ArtistArchetype,
  Artist,
  GameStats,
  WeiboTrend,
  StatChange,
} from '@/types/game';
import { artists } from '@/data/artists';
import { rivalActions } from '@/data/rivalActions';

const FAME_ORDER: RivalFameLevel[] = ['low', 'medium', 'high', 'top'];

function fameToNum(f: RivalFameLevel): number {
  return FAME_ORDER.indexOf(f);
}
function numToFame(n: number): RivalFameLevel {
  return FAME_ORDER[Math.max(0, Math.min(3, n))] as RivalFameLevel;
}

/**
 * 开局初始化对手：从未选的3个艺人中随机选一个
 */
export function initializeRival(chosenArtistId: ArtistArchetype): RivalState {
  const candidates = artists.filter(a => a.id !== chosenArtistId);
  const rival = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    artistId: rival.id,
    name: rival.name,
    avatar: rival.avatar,
    fameLevel: 'medium',
    aggression: 40 + Math.floor(Math.random() * 20),
    actionsLog: [],
  };
}

/**
 * 每天选择对手动作
 */
export function selectRivalAction(
  rival: RivalState,
  day: number,
  playerStats: GameStats,
): RivalAction | null {
  // 过滤可用动作
  const eligible = rivalActions.filter(a => {
    if (a.minDay && day < a.minDay) return false;
    if (a.minFameLevel && fameToNum(rival.fameLevel) < fameToNum(a.minFameLevel)) return false;
    if (a.minAggression && rival.aggression < a.minAggression) return false;
    return true;
  });

  if (eligible.length === 0) return null;

  // 权重分配：基于 aggression 和玩家表现
  const playerPower = playerStats.commercialValue + playerStats.fanLoyalty;
  const isPlayerAhead = playerPower > 100; // 简化判断

  const weighted = eligible.map(action => {
    let weight = 10; // 基础权重

    switch (action.type) {
      case 'attack':
        weight = rival.aggression > 60 ? 25 : rival.aggression > 40 ? 15 : 8;
        if (isPlayerAhead) weight += 10; // 玩家领先时对手更爱攻击
        break;
      case 'neutral':
        weight = 15;
        break;
      case 'cooperation':
        weight = rival.aggression < 40 ? 20 : 8;
        if (!isPlayerAhead) weight += 5; // 玩家落后时对手更愿意合作
        break;
      case 'self_destruct':
        weight = 5; // 总是较低概率
        if (rival.fameLevel === 'top') weight = 10; // 顶级容易翻车
        break;
    }

    return { action, weight };
  });

  // 加权随机选择
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const { action, weight } of weighted) {
    roll -= weight;
    if (roll <= 0) return action;
  }

  return weighted[weighted.length - 1].action;
}

export interface RivalActionResult {
  playerStatChanges: StatChange | null;
  newRivalState: RivalState;
  narration: string;
  trend: WeiboTrend | null;
}

/**
 * 执行对手动作，返回结果
 */
export function resolveRivalAction(
  action: RivalAction,
  rival: RivalState,
  playerArtist: Artist,
  day: number,
): RivalActionResult {
  // 1. 更新对手 fame
  const newFameNum = fameToNum(rival.fameLevel) + action.rivalFameChange;
  const newFameLevel = numToFame(newFameNum);

  // 2. 更新 aggression
  let newAggression = rival.aggression;
  if (action.type === 'attack') newAggression = Math.min(100, newAggression + 5);
  if (action.type === 'cooperation') newAggression = Math.max(0, newAggression - 10);
  if (action.type === 'self_destruct') newAggression = Math.max(0, newAggression - 5);

  // 3. 构建 narration
  const narration = `${rival.avatar} ${rival.name}的经纪人动态：${action.description}`;

  // 4. 构建热搜条目
  let trend: WeiboTrend | null = null;
  if (action.generatesTrend && action.trendTitle) {
    trend = {
      rank: 99, // 会在注入时重新排
      title: action.trendTitle
        .replace('{rivalName}', rival.name)
        .replace('{playerName}', playerArtist.name),
      heat: `${Math.floor(Math.random() * 2000 + 500)}万`,
      isHot: action.type === 'self_destruct',
      sentiment: action.type === 'attack' ? 'negative'
        : action.type === 'self_destruct' ? 'positive'
        : 'neutral',
    };
  }

  // 5. 记录日志
  const logEntry = {
    day,
    actionId: action.id,
    title: action.title,
    affectedYou: !!action.playerEffects,
  };

  const newRivalState: RivalState = {
    ...rival,
    fameLevel: newFameLevel,
    aggression: newAggression,
    actionsLog: [...rival.actionsLog.slice(-9), logEntry], // 保留最近10条
  };

  return {
    playerStatChanges: action.playerEffects ?? null,
    newRivalState,
    narration,
    trend,
  };
}
