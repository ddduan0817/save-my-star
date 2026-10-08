import type {
  StatChange,
  WeiboCommentStance,
  WeiboSceneId,
  WeiboTrend,
} from '@/types/game';

export type WeiboInteractionAction = 'like' | 'repost';
export type WeiboInteractionAccount = 'self' | 'artist';
export type WeiboPostAuthorAccount = WeiboInteractionAccount | 'external';

export interface WeiboInteractionInput {
  postId: string;
  action: WeiboInteractionAction;
  authorAccount: WeiboPostAuthorAccount;
  sceneId: WeiboSceneId;
  stance: WeiboCommentStance;
}

export interface WeiboInteractionResolutionInput
  extends Omit<WeiboInteractionInput, 'postId'> {
  account: WeiboInteractionAccount;
  artistName: string;
}

export interface WeiboInteractionResolution {
  statChanges: StatChange;
  feedback: string;
  trend?: Omit<WeiboTrend, 'rank'>;
}

const STANCE_EFFECTS: Record<
  WeiboCommentStance,
  Record<WeiboInteractionAction, StatChange>
> = {
  supportive: {
    like: { fanLoyalty: 1 },
    repost: { fanLoyalty: 2, commercialValue: 1 },
  },
  procedural: {
    like: { fanLoyalty: 1 },
    repost: { fanLoyalty: 1 },
  },
  neutral: {
    like: {},
    repost: { prRisk: 1 },
  },
  skeptical: {
    like: { prRisk: 2, fanLoyalty: -1 },
    repost: { prRisk: 4, fanLoyalty: -2 },
  },
  hostile: {
    like: { prRisk: 4, fanLoyalty: -2 },
    repost: { prRisk: 7, fanLoyalty: -4, commercialValue: -1 },
  },
};

const CONFLICT_SCENES = new Set<WeiboSceneId>([
  'fan_fandom_conflict',
  'fan_media_smear',
  'burner_rival_smear',
  'burner_reverse_attack',
  'burner_artist_impersonation',
  'artist_fight_haters',
]);

function addStatChanges(...changes: StatChange[]): StatChange {
  const result: StatChange = {};
  const keys: (keyof StatChange)[] = [
    'commercialValue',
    'fanLoyalty',
    'prRisk',
    'money',
  ];

  keys.forEach((key) => {
    const total = changes.reduce((sum, change) => sum + (change[key] ?? 0), 0);
    if (total !== 0) result[key] = total;
  });

  return result;
}

function getSceneChanges(
  sceneId: WeiboSceneId,
  action: WeiboInteractionAction,
  stance: WeiboCommentStance,
): StatChange {
  const isRepost = action === 'repost';

  if (sceneId === 'fan_cp_discussion') {
    return { prRisk: isRepost ? 4 : 2 };
  }
  if (sceneId === 'fan_private_sighting') {
    return { prRisk: isRepost ? 6 : 3 };
  }
  if (sceneId === 'fan_crisis_watch') {
    return { prRisk: isRepost ? 4 : 2 };
  }
  if (CONFLICT_SCENES.has(sceneId)) {
    return { prRisk: isRepost ? 4 : 2 };
  }
  if (
    sceneId === 'fan_brand_sales'
    && (stance === 'supportive' || stance === 'procedural')
  ) {
    return { commercialValue: isRepost ? 2 : 1 };
  }
  if (
    sceneId === 'fan_support_campaign'
    && (stance === 'supportive' || stance === 'procedural')
  ) {
    return { fanLoyalty: isRepost ? 1 : 1 };
  }

  return {};
}

function getRiskTrend(
  sceneId: WeiboSceneId,
  action: WeiboInteractionAction,
  artistName: string,
): Omit<WeiboTrend, 'rank'> | undefined {
  const verb = action === 'like' ? '点赞' : '转发';

  if (sceneId === 'fan_private_sighting') {
    return {
      title: `${artistName} ${verb}私生活爆料`,
      heat: action === 'repost' ? '486万' : '328万',
      isHot: true,
      sentiment: 'negative',
    };
  }
  if (sceneId === 'fan_cp_discussion' && action === 'repost') {
    return {
      title: `${artistName} 转发CP讨论引发猜测`,
      heat: '366万',
      isHot: true,
      sentiment: 'negative',
    };
  }
  if (CONFLICT_SCENES.has(sceneId)) {
    return {
      title: `${artistName} ${verb}争议微博公开下场`,
      heat: action === 'repost' ? '512万' : '274万',
      isHot: true,
      sentiment: 'negative',
    };
  }
  if (sceneId === 'fan_crisis_watch' && action === 'repost') {
    return {
      title: `${artistName} 转发危机讨论引发热议`,
      heat: '421万',
      isHot: true,
      sentiment: 'negative',
    };
  }

  return undefined;
}

function getArtistFeedback(
  sceneId: WeiboSceneId,
  action: WeiboInteractionAction,
  stance: WeiboCommentStance,
  trend: Omit<WeiboTrend, 'rank'> | undefined,
): string {
  const verb = action === 'like' ? '点赞' : '转发';

  if (trend) {
    return `你用艺人大号${verb}了敏感微博，截图开始扩散，相关话题已上热搜`;
  }
  if (sceneId === 'fan_cp_discussion') {
    return `艺人大号${verb}了CP讨论，粉丝开始解读这个动作`;
  }
  if (stance === 'supportive' || stance === 'procedural') {
    return `艺人大号的${verb}被粉丝看到，粉丝反馈变得更积极`;
  }
  if (stance === 'skeptical' || stance === 'hostile') {
    return `艺人大号${verb}了质疑内容，舆论风险已经上升`;
  }
  return `艺人大号${verb}放大了这条讨论`;
}

export function resolveWeiboInteraction(
  input: WeiboInteractionResolutionInput,
): WeiboInteractionResolution {
  const verb = input.action === 'like' ? '点赞' : '转发';

  if (input.account === 'self') {
    return {
      statChanges: {},
      feedback: `小号已${verb}，暂时没人把这个动作和艺人联系起来`,
    };
  }

  if (input.authorAccount === 'artist') {
    return {
      statChanges: {},
      feedback: `已${verb}自己的微博，没有产生额外影响`,
    };
  }

  const trend = getRiskTrend(input.sceneId, input.action, input.artistName);
  const statChanges = addStatChanges(
    STANCE_EFFECTS[input.stance][input.action],
    getSceneChanges(input.sceneId, input.action, input.stance),
  );

  return {
    statChanges,
    trend,
    feedback: getArtistFeedback(
      input.sceneId,
      input.action,
      input.stance,
      trend,
    ),
  };
}
