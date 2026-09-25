import { getWeiboPostImage, weiboPostTemplates } from '@/data/weiboPosts';
import {
  ALL_WEIBO_SCENES,
  COMMENT_NICK_POOLS,
  RIVAL_FAN_NICK_POOLS,
  RIVALRY_COMMENT_SCENES,
  WEIBO_COMMENT_POOLS,
} from '@/data/weiboScenes';
import type {
  ArtistArchetype,
  GeneratedWeiboComment,
  HydratedWeiboPostRecord,
  WeiboCommentEntry,
  WeiboCommentRole,
  WeiboEngagement,
  WeiboOutcome,
  WeiboPostRecord,
  WeiboPostTemplate,
  WeiboRivalId,
  WeiboRivalIdentity,
  WeiboSceneId,
} from '@/types/game';

const WEIBO_SCENE_IDS = new Set<string>(ALL_WEIBO_SCENES);
const ARTIST_ALIGNED_ROLES = new Set<WeiboCommentRole>([
  'fan',
  'data_fan',
  'fansite',
  'cp_fan',
]);
const RIVAL_CONTEXT_SCENES = new Set<WeiboSceneId>(RIVALRY_COMMENT_SCENES);
const RIVAL_ID_BY_NAME: Readonly<Record<string, WeiboRivalId>> = {
  林C位: 'lin_c',
  晁可爱: 'chao_cute',
  葛王: 'ge_wang',
  王思琪: 'wang_sc',
  顾君庭: 'gu_junting',
};

export const LEGACY_TEMPLATE_SCENE_MAP: Readonly<Record<string, WeiboSceneId>> = {
  post_work_photo: 'artist_work_photo',
  post_late_night: 'artist_late_night',
  post_respond_controversy: 'artist_controversy_response',
  post_promote_work: 'artist_work_promotion',
  post_fan_gift: 'artist_fan_gift',
  post_charity: 'artist_charity',
  post_fight_haters: 'artist_fight_haters',
  post_selfie: 'artist_selfie',
  post_hint_romance: 'artist_romance_hint',
  post_apology: 'artist_apology',
  smear_rival: 'burner_rival_smear',
  burner_rival_smear: 'burner_rival_smear',
  reverse_attack: 'burner_reverse_attack',
  burner_reverse_attack: 'burner_reverse_attack',
  weibo_template: 'burner_artist_impersonation',
  burner_artist_impersonation: 'burner_artist_impersonation',
};

export function stableHash(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function stablePick<T>(items: readonly T[], seed: string): T {
  if (items.length === 0) {
    throw new Error('stablePick requires a non-empty pool');
  }
  return items[stableHash(seed) % items.length];
}

function defaultIdentity<T>(item: T): string {
  if (typeof item === 'string') return item;
  try {
    return JSON.stringify(item);
  } catch {
    return String(item);
  }
}

export function uniqueStablePicks<T>(
  items: readonly T[],
  count: number,
  seed: string,
  identity: (item: T) => string = defaultIdentity,
): T[] {
  if (count <= 0 || items.length === 0) return [];

  const ranked = items
    .map((item, index) => ({
      item,
      index,
      score: stableHash(`${seed}:${index}:${identity(item)}`),
    }))
    .sort((left, right) => left.score - right.score || left.index - right.index);

  const seen = new Set<string>();
  const selected: T[] = [];
  ranked.forEach(({ item }) => {
    const key = identity(item);
    if (selected.length < count && !seen.has(key)) {
      seen.add(key);
      selected.push(item);
    }
  });
  return selected;
}

export function isWeiboSceneId(value: unknown): value is WeiboSceneId {
  return typeof value === 'string' && WEIBO_SCENE_IDS.has(value);
}

export function selectArtistPostContent(
  template: WeiboPostTemplate,
  artistId: ArtistArchetype,
  seed: string,
): string {
  const artistPool = template.artistPostVariants?.[artistId];
  const commonPool = template.postVariants;
  const pool = artistPool && artistPool.length > 0
    ? artistPool
    : commonPool && commonPool.length > 0
      ? commonPool
      : template.postContent
        ? [template.postContent]
        : [];

  if (pool.length === 0) {
    throw new Error(`Weibo template "${template.id}" has no post content`);
  }

  const sceneId = template.sceneId
    ?? LEGACY_TEMPLATE_SCENE_MAP[template.id]
    ?? 'fan_crisis_watch';
  return stablePick(pool, `${seed}:${sceneId}:${artistId}`);
}

export interface NicknameSelectionOptions {
  seed: string;
  sceneId?: WeiboSceneId;
  artistNickPool?: readonly string[];
  artistName?: string;
  rivalName?: string;
  rival?: string | WeiboRivalIdentity | null;
  currentRival?: string | WeiboRivalIdentity | null;
}

interface ResolvedRivalIdentity {
  id?: WeiboRivalId;
  name?: string;
}

function isWeiboRivalId(value: unknown): value is WeiboRivalId {
  return typeof value === 'string'
    && Object.prototype.hasOwnProperty.call(RIVAL_FAN_NICK_POOLS, value);
}

function resolveRivalIdentity(
  options: Pick<NicknameSelectionOptions, 'rivalName' | 'rival' | 'currentRival'>,
): ResolvedRivalIdentity {
  const source = options.rival ?? options.currentRival;
  const sourceName = typeof source === 'string' ? source : source?.name;
  const name = (options.rivalName ?? sourceName)?.trim() || undefined;
  const sourceId = typeof source === 'object' && source ? source.id : undefined;
  const id = isWeiboRivalId(sourceId)
    ? sourceId
    : name
      ? RIVAL_ID_BY_NAME[name]
      : undefined;
  return { id, name };
}

function dynamicRivalNicknames(rivalName: string): string[] {
  return [
    `${rivalName}粉丝`,
    `${rivalName}后援会`,
    `${rivalName}数据站`,
    `${rivalName}反黑站`,
    `陪${rivalName}走花路`,
    `${rivalName}应援灯`,
    `${rivalName}前线`,
    `只看${rivalName}`,
  ];
}

function artistRoleNicknames(
  role: WeiboCommentRole,
  artistNickPool: readonly string[],
  artistName?: string,
): string[] {
  const name = artistName?.trim();
  switch (role) {
    case 'fan': {
      const personalFans = artistNickPool.filter(
        nickname => !/数据|打投|反黑|管理|后援会|图站|音乐站|时尚站/.test(nickname),
      );
      return personalFans.length > 0 ? personalFans : [...artistNickPool];
    }
    case 'data_fan':
      return name
        ? [`${name}数据组`, `${name}反黑站`, `${name}超话数据`, `${name}打投组`]
        : [...COMMENT_NICK_POOLS.data_fan];
    case 'fansite':
      return name
        ? [`${name}图站`, `${name}现场站`, `${name}物料站`, `${name}前线`]
        : [...COMMENT_NICK_POOLS.fansite];
    case 'cp_fan':
      return name
        ? [`${name}同框研究所`, `${name}糖点记录簿`, `${name}嗑学组`, `${name}双人镜头存档`]
        : [...COMMENT_NICK_POOLS.cp_fan];
    default:
      return [...artistNickPool];
  }
}

export function selectNicknameForRole(
  role: WeiboCommentRole,
  options: NicknameSelectionOptions,
): string;
export function selectNicknameForRole(
  role: WeiboCommentRole,
  artistNickPool: readonly string[],
  seed: string,
  context?: Omit<NicknameSelectionOptions, 'seed' | 'artistNickPool'>,
): string;
export function selectNicknameForRole(
  role: WeiboCommentRole,
  optionsOrArtistPool: NicknameSelectionOptions | readonly string[],
  legacySeed?: string,
  legacyContext: Omit<NicknameSelectionOptions, 'seed' | 'artistNickPool'> = {},
): string {
  const options: NicknameSelectionOptions = Array.isArray(optionsOrArtistPool)
    ? {
        ...legacyContext,
        seed: legacySeed ?? '',
        artistNickPool: optionsOrArtistPool,
      }
    : optionsOrArtistPool as NicknameSelectionOptions;

  if (role === 'rival_fan') {
    const rival = resolveRivalIdentity(options);
    const rivalPool = rival.id
      ? RIVAL_FAN_NICK_POOLS[rival.id]
      : rival.name
        ? dynamicRivalNicknames(rival.name)
        : COMMENT_NICK_POOLS.rival_fan;
    return stablePick(rivalPool, `${options.seed}:${role}`);
  }

  const artistPool = options.artistNickPool ?? [];
  const pool = ARTIST_ALIGNED_ROLES.has(role) && artistPool.length > 0
    ? artistRoleNicknames(role, artistPool, options.artistName)
    : COMMENT_NICK_POOLS[role];
  return stablePick(pool, `${options.seed}:${role}`)
    .replace(/\{name\}/g, options.artistName ?? '');
}

export interface GenerateSceneCommentsInput {
  sceneId: WeiboSceneId;
  outcome: WeiboOutcome;
  seed: string;
  /** Current artist's nickname pool. */
  artistNickPool?: readonly string[];
  /** Backward-compatible alias for artistNickPool. */
  nickPool?: readonly string[];
  artistId?: ArtistArchetype;
  artistName?: string;
  rivalName?: string;
  rival?: string | WeiboRivalIdentity | null;
  currentRival?: string | WeiboRivalIdentity | null;
}

function isEntryEligible(
  entry: WeiboCommentEntry,
  outcome: WeiboOutcome,
  artistId?: ArtistArchetype,
  hasRivalIdentity = false,
): boolean {
  return entry.allowedOutcomes.includes(outcome)
    && (entry.role !== 'rival_fan' || hasRivalIdentity)
    && (
      !entry.artistIds
      || (artistId !== undefined && entry.artistIds.includes(artistId))
    );
}

function chooseUniqueNickname(
  role: WeiboCommentRole,
  options: NicknameSelectionOptions,
  usedNicknames: ReadonlySet<string>,
): string {
  const preferred = selectNicknameForRole(role, options);
  if (!usedNicknames.has(preferred)) return preferred;

  for (let attempt = 1; attempt <= 12; attempt += 1) {
    const fallback = selectNicknameForRole(role, {
      ...options,
      seed: `${options.seed}:fallback:${attempt}`,
    });
    if (!usedNicknames.has(fallback)) return fallback;
  }

  return `${preferred}${usedNicknames.size + 1}`;
}

export function generateSceneComments(
  input: GenerateSceneCommentsInput,
): GeneratedWeiboComment[] {
  const pool = WEIBO_COMMENT_POOLS[input.sceneId];
  const rival = resolveRivalIdentity(input);
  const hasRivalIdentity = rival.name !== undefined;
  const eligible = pool.filter(entry =>
    isEntryEligible(
      entry,
      input.outcome,
      input.artistId,
      hasRivalIdentity,
    ));
  const direct = eligible.filter(entry => entry.priority === 'direct');
  const secondary = eligible.filter(entry => entry.priority === 'secondary');
  const exactOutcomeDirect = direct.filter(entry =>
    entry.allowedOutcomes.length === 1
    && entry.allowedOutcomes[0] === input.outcome);
  const exactOutcomeSecondary = secondary.filter(entry =>
    entry.allowedOutcomes.length === 1
    && entry.allowedOutcomes[0] === input.outcome);
  const selected = uniqueStablePicks(
    exactOutcomeDirect.length > 0 ? exactOutcomeDirect : direct,
    1,
    `${input.seed}:${input.sceneId}:${input.outcome}:direct`,
    entry => entry.text,
  );
  const selectedTexts = new Set(selected.map(entry => entry.text));

  if (
    hasRivalIdentity
    && RIVAL_CONTEXT_SCENES.has(input.sceneId)
    && !selected.some(entry => entry.role === 'rival_fan')
  ) {
    const rivalFanEntry = uniqueStablePicks(
      secondary.filter(entry => entry.role === 'rival_fan'),
      1,
      `${input.seed}:${input.sceneId}:${input.outcome}:rival-fan`,
      entry => entry.text,
    )[0];
    if (rivalFanEntry) {
      selected.push(rivalFanEntry);
      selectedTexts.add(rivalFanEntry.text);
    }
  }

  if (selected.length < 3 && exactOutcomeSecondary.length > 0) {
    const outcomeEntry = uniqueStablePicks(
      exactOutcomeSecondary.filter(entry => !selectedTexts.has(entry.text)),
      1,
      `${input.seed}:${input.sceneId}:${input.outcome}:outcome-secondary`,
      entry => entry.text,
    )[0];
    if (outcomeEntry) {
      selected.push(outcomeEntry);
      selectedTexts.add(outcomeEntry.text);
    }
  }

  const hasSelectedRivalFan = selected.some(entry => entry.role === 'rival_fan');
  selected.push(...uniqueStablePicks(
    secondary.filter(entry =>
      !selectedTexts.has(entry.text)
      && (!hasSelectedRivalFan || entry.role !== 'rival_fan')),
    3 - selected.length,
    `${input.seed}:${input.sceneId}:${input.outcome}:secondary`,
    entry => entry.text,
  ));

  if (selected.length < 3) {
    const alreadySelected = new Set(selected.map(entry => entry.text));
    selected.push(...uniqueStablePicks(
      eligible.filter(entry => !alreadySelected.has(entry.text)),
      3 - selected.length,
      `${input.seed}:${input.sceneId}:${input.outcome}:fallback`,
      entry => entry.text,
    ));
  }

  if (selected.length < 3) {
    throw new Error(
      `Scene "${input.sceneId}" has fewer than three comments for "${input.outcome}"`,
    );
  }

  const usedNicknames = new Set<string>();
  const artistNickPool = input.artistNickPool ?? input.nickPool ?? [];
  return selected.map((entry, index) => {
    const nickname = chooseUniqueNickname(entry.role, {
      seed: `${input.seed}:nickname:${index}`,
      sceneId: input.sceneId,
      artistNickPool,
      artistName: input.artistName,
      rivalName: input.rivalName,
      rival: input.rival,
      currentRival: input.currentRival,
    }, usedNicknames);
    usedNicknames.add(nickname);
    return {
      nickname,
      text: entry.text.replace(/\{rival\}/g, rival.name ?? '对家'),
      role: entry.role,
      stance: entry.stance,
    };
  });
}

export interface LegacySceneInput {
  sceneId?: WeiboSceneId | string;
  templateId?: string;
  content?: string;
}

interface LegacyKeywordRule {
  sceneId: WeiboSceneId;
  pattern: RegExp;
}

const LEGACY_KEYWORD_RULES: readonly LegacyKeywordRule[] = [
  {
    sceneId: 'fan_fansite_copyright',
    pattern: /版权|盗图|搬运.{0,8}(?:授权|署名|水印)|水印.{0,8}(?:裁掉|删除)|原图.{0,8}(?:授权|搬运)|律师函.{0,8}(?:图片|站姐|搬运)/,
  },
  {
    sceneId: 'fan_brand_sales',
    pattern: /销量榜|代言.{0,10}(?:销量|下单|购买)|(?:下单|购买).{0,10}(?:品牌|代言)|GMV|销售额|晒单/,
  },
  {
    sceneId: 'fan_private_sighting',
    pattern: /私生|酒店定位|住址|偷拍视频|私人行程|跟到住处|手机号/,
  },
  {
    sceneId: 'fan_airport_sighting',
    pattern: /机场|航班|接机|送机|登机口|落地路透/,
  },
  {
    sceneId: 'burner_reverse_attack',
    pattern: /反串|装黑粉|反向虐粉|故意骂自家|引出保护欲/,
  },
  {
    sceneId: 'burner_artist_impersonation',
    pattern: /冒充本人|模仿本人|替本人表态|小号.{0,8}(?:被扒|实锤|本人)/,
  },
  {
    sceneId: 'burner_rival_smear',
    pattern: /匿名爆料.{0,12}对家|抹黑对家|造谣对家|对家黑稿/,
  },
  {
    sceneId: 'artist_apology',
    pattern: /郑重道歉|公开道歉|向.{0,8}道歉|是我做得不够好|承担错误/,
  },
  {
    sceneId: 'artist_romance_hint',
    pattern: /恋爱|官宣|心动|被爱|喜欢的人|感情状态|同款.{0,8}(?:情侣|对象)/,
  },
  {
    sceneId: 'artist_controversy_response',
    pattern: /本人回应|正面回应|关于近期.{0,12}(?:争议|声音)|事实说明|澄清如下/,
  },
  {
    sceneId: 'artist_fight_haters',
    pattern: /黑子|法庭见|造谣一张嘴|已交律师|恶意账号/,
  },
  {
    sceneId: 'artist_charity',
    pattern: /公益|捐助|慈善|助学|受助/,
  },
  {
    sceneId: 'artist_fan_gift',
    pattern: /粉丝礼物|生日应援|花墙|手写信|收到你们/,
  },
  {
    sceneId: 'artist_selfie',
    pattern: /自拍|随手一张|今日照片|原相机/,
  },
  {
    sceneId: 'artist_work_promotion',
    pattern: /新作品|定档|上线|新剧|新歌|专辑|预告|官宣作品/,
  },
  {
    sceneId: 'artist_late_night',
    pattern: /凌晨|深夜|睡不着|晚安|收工.{0,6}(?:夜|凌晨)/,
  },
  {
    sceneId: 'artist_work_photo',
    pattern: /工作照|剧组照|后台照|今日工位|拍摄现场/,
  },
  {
    sceneId: 'fan_cp_discussion',
    pattern: /CP|嗑到|糖点|同框|双人|解绑|卖腐/,
  },
  {
    sceneId: 'fan_fandom_conflict',
    pattern: /粉丝.{0,8}(?:开战|互撕)|对家.{0,8}(?:碰瓷|粉丝)|撕逼|黑称|跨广场/,
  },
  {
    sceneId: 'fan_support_campaign',
    pattern: /应援|集资|筹款|大屏|灯牌|认领物料/,
  },
  {
    sceneId: 'fan_work_complaint',
    pattern: /工作室.{0,8}(?:干什么|不作为)|团队.{0,8}(?:废物|不给力)|没有工作|快进组|资源太差/,
  },
  {
    sceneId: 'fan_media_smear',
    pattern: /营销号|带节奏|黑通稿|媒体抹黑|断章取义|反黑/,
  },
  {
    sceneId: 'fan_persona_discussion',
    pattern: /人设|动物塑|小狗系|猫系|狐狸系|狼系|仓鼠系|反差感/,
  },
  {
    sceneId: 'fan_career_discussion',
    pattern: /转型|职业规划|事业线|接戏|进组|资源规划|发展路线/,
  },
  {
    sceneId: 'fan_crisis_watch',
    pattern: /塌房|危机|实锤|爆料|翻车|舆情|回应/,
  },
];

export function inferLegacySceneId(input: LegacySceneInput): WeiboSceneId {
  if (isWeiboSceneId(input.sceneId)) return input.sceneId;

  const templateScene = input.templateId
    ? LEGACY_TEMPLATE_SCENE_MAP[input.templateId]
    : undefined;
  if (templateScene) return templateScene;

  const content = input.content?.trim() ?? '';
  const matchedRule = LEGACY_KEYWORD_RULES.find(rule => rule.pattern.test(content));
  return matchedRule?.sceneId ?? 'fan_crisis_watch';
}

function stableRange(seed: string, minimum: number, maximum: number): number {
  return minimum + (stableHash(seed) % (maximum - minimum + 1));
}

const ARTIST_ENGAGEMENT_MINIMUMS = {
  likes: 120000,
  comments: 12000,
  reposts: 20000,
};

export function createStableEngagement(
  seed: string,
  sceneId: WeiboSceneId,
  visibility: 'public' | 'private' = 'public',
): WeiboEngagement {
  const ranges = visibility === 'private'
    ? { likes: [0, 12], comments: [0, 3], reposts: [0, 2] }
    : sceneId.startsWith('artist_')
    ? { likes: [120000, 980000], comments: [12000, 98000], reposts: [20000, 180000] }
    : sceneId.startsWith('burner_')
      ? { likes: [20, 6000], comments: [5, 900], reposts: [2, 1200] }
      : { likes: [200, 18000], comments: [20, 2600], reposts: [30, 5000] };

  return {
    likes: stableRange(`${seed}:${sceneId}:likes`, ranges.likes[0], ranges.likes[1]),
    comments: stableRange(
      `${seed}:${sceneId}:comments`,
      ranges.comments[0],
      ranges.comments[1],
    ),
    reposts: stableRange(
      `${seed}:${sceneId}:reposts`,
      ranges.reposts[0],
      ranges.reposts[1],
    ),
  };
}

export function formatEngagementCount(value: number): string {
  if (value <= 10000) return String(value);
  const wan = (value / 10000).toFixed(1).replace(/\.0$/, '');
  return `${wan}万`;
}

export function hydrateWeiboPostRecord(
  record: WeiboPostRecord,
  artistId: ArtistArchetype,
): HydratedWeiboPostRecord {
  const template = weiboPostTemplates.find(item => item.id === record.templateId);
  const sceneId = inferLegacySceneId({
    sceneId: record.sceneId,
    templateId: record.templateId,
    content: record.content ?? template?.postContent,
  });
  const id = record.id ?? `weibo_${record.templateId}_${record.day}`;
  const outcome = record.outcome ?? (record.wasBackfire ? 'backfire' : 'success');
  const content = record.content
    ?? (template
      ? selectArtistPostContent(template, artistId, id)
      : '这条旧微博的正文暂时无法恢复。');
  const legacyArtistEngagement = sceneId.startsWith('artist_')
    && record.engagement
    && (
      record.engagement.likes < ARTIST_ENGAGEMENT_MINIMUMS.likes
      || record.engagement.comments < ARTIST_ENGAGEMENT_MINIMUMS.comments
      || record.engagement.reposts < ARTIST_ENGAGEMENT_MINIMUMS.reposts
    );

  return {
    ...record,
    id,
    sceneId,
    content,
    outcome,
    engagement: !record.engagement || legacyArtistEngagement
      ? createStableEngagement(id, sceneId)
      : record.engagement,
    imageKey: record.imageKey ?? (
      template ? getWeiboPostImage(artistId, template.imageSlot) : undefined
    ),
  };
}
