import type { WeiboPostTemplate, GameStats, ArtistArchetype, WeiboTrend, StatChange } from '@/types/game';

export interface WeiboPostResult {
  isBackfire: boolean;
  statChanges: StatChange;
  narration: string;
  trendEntry: WeiboTrend;
}

/**
 * 给数值加随机波动：±30%（money ±20%），最小绝对值1
 */
function randomizePostEffects(base: StatChange): StatChange {
  const result: StatChange = {};
  for (const [key, value] of Object.entries(base)) {
    if (value === undefined || value === 0) continue;
    const variance = key === 'money' ? 0.2 : 0.3;
    const multiplier = 1 + (Math.random() * 2 - 1) * variance;
    let val = Math.round(value * multiplier);
    // 保持符号不变，且绝对值至少为1（money除外）
    if (key !== 'money') {
      if (value > 0) val = Math.max(1, val);
      else if (value < 0) val = Math.min(-1, val);
    }
    result[key as keyof StatChange] = val;
  }
  return result;
}

/**
 * 判断是否翻车，计算效果，生成热搜条目
 */
export function resolveWeiboPost(
  template: WeiboPostTemplate,
  stats: GameStats,
  artistId: ArtistArchetype,
  artistName: string,
): WeiboPostResult {
  let isBackfire = false;

  // 特殊翻车逻辑：回应争议 / 发表道歉 在风险<30时翻车
  if (template.id === 'post_respond_controversy' || template.id === 'post_apology') {
    isBackfire = stats.prRisk < 30;
  }
  // 怼黑子：风险>50时翻车
  else if (template.id === 'post_fight_haters') {
    isBackfire = !!template.backfireConditions && stats.prRisk >= (template.backfireConditions.minPrRisk ?? 999);
  }
  // 暗示恋情：idol 和 singer 都容易翻车
  else if (template.id === 'post_hint_romance') {
    isBackfire = artistId === 'idol' || artistId === 'singer';
  }
  // 通用翻车判定
  else if (template.backfireConditions) {
    const bc = template.backfireConditions;
    const checks: boolean[] = [];

    if (bc.minPrRisk !== undefined) checks.push(stats.prRisk >= bc.minPrRisk);
    if (bc.maxFanLoyalty !== undefined) checks.push(stats.fanLoyalty <= bc.maxFanLoyalty);
    if (bc.maxCommercialValue !== undefined) checks.push(stats.commercialValue <= bc.maxCommercialValue);
    if (bc.forArtist !== undefined) checks.push(artistId === bc.forArtist);

    // 任一条件满足即翻车
    isBackfire = checks.length > 0 && checks.some(c => c);
  }

  // 基础效果 + 随机波动
  const rawEffects = isBackfire && template.backfireEffects
    ? template.backfireEffects
    : template.baseEffects;
  const statChanges = randomizePostEffects(rawEffects);

  const narration = isBackfire && template.backfireNarration
    ? template.backfireNarration
    : template.successNarration;

  // 生成热搜条目
  const trendEntry: WeiboTrend = {
    rank: 1,
    title: template.trendTitle.replace('{name}', artistName),
    heat: `${Math.floor(Math.random() * 3000 + 2000)}万`,
    isHot: !isBackfire,
    sentiment: isBackfire ? 'negative' : 'positive',
  };

  return { isBackfire, statChanges, narration, trendEntry };
}
