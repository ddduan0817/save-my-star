import type { WeiboPostTemplate, GameStats, ArtistArchetype, WeiboTrend, StatChange } from '@/types/game';

export interface WeiboPostResult {
  isBackfire: boolean;
  statChanges: StatChange;
  narration: string;
  trendEntry: WeiboTrend;
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

  const statChanges = isBackfire && template.backfireEffects
    ? template.backfireEffects
    : template.baseEffects;

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
