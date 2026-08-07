// 大粉剧情线（Fansite Storylines）
// --------------------------------------------------------
// 每个艺人的 1 个指定大粉有一条三段式剧情弧（intro → mid → finale），
// 按天数 + 大粉忠诚/态度触发，注入到次日消息。让玩家对“某个大粉”产生长期记忆。
//
// 设计要点：
// - 每条弧的阶段是 arcStep 0/1/2：
//   0 = 未开始，1 = intro 已触发，2 = mid 已触发，3 = finale 已触发（终态）
// - 触发器：step=0 且 day>=4 → 出 intro 事件
//           step=1 且 day>=10 → 出 mid 事件
//           step=2 且 day>=15 → 出 finale 事件
// - 事件本身按当下 loyalty 走不同分支（结局不同）
// - 由 endDay.ts 每天检查一次，最多注入 1 个弧事件（避免弧和 callback 同时塞）

import type { GameEvent, ArtistArchetype } from '@/types/game';

interface ArcDef {
  /** 艺人锁定 */
  artist: ArtistArchetype;
  /** 弧线绑定的大粉 id（和 data/fansites.ts 里 FansiteMaster.id 对应） */
  fansiteId: string;
  /** 大粉名字（叙事使用） */
  fansiteName: string;
  /** 三段式事件（0 index = intro, 1 = mid, 2 = finale） */
  steps: [Omit<GameEvent, 'id'>, Omit<GameEvent, 'id'>, Omit<GameEvent, 'id'>];
  /** 每一步最早可以触发的天 */
  minDays: [number, number, number];
}

// 全局只为部分艺人配弧，避免一锅端地塞；剩下艺人后续补
const ARCS: ArcDef[] = [
  // ===== 偶像：战斗粉“偷心贼_帅版”的“一腔孤勇 → 过火 → 选边站” =====
  {
    artist: 'idol',
    fansiteId: 'fansite_3',
    fansiteName: '偷心贼_帅版',
    minDays: [4, 10, 15],
    steps: [
      {
        category: 'drama',
        severity: 'low',
        title: `${'偷心贼_帅版'}：组建“护帅队”`,
        description: '战斗粉偷心贼拉了一个 300 人的大群，取名“护帅先锋队”，声称要“24 小时轮班蹲黑子”。她给你发私信：“哥/姐，能不能来个官方站子认证？有认证我们更好控评。”',
        emoji: '⚔️',
        choices: [
          {
            id: 'arc_idol_warrior_bless',
            text: '给官方认证',
            subtext: '官方背书',
            outcome: {
              narration: '你给了她认证。她在群里发语音哭了，“我们终于被看见了”。当天反黑速度明显加快。',
              statChanges: { fanLoyalty: 4, prRisk: -2 },
              unlockTag: 'arc_idol_warrior_blessed',
            },
          },
          {
            id: 'arc_idol_warrior_remote',
            text: '远程鼓励但不认证',
            subtext: '保持距离',
            outcome: {
              narration: '你让助理发了一条暧昧的鼓励朋友圈截图给她。她感动了两天，又开始抱怨“没认证还是要低调”。',
              statChanges: { fanLoyalty: 1, prRisk: 1 },
              unlockTag: 'arc_idol_warrior_neutral',
            },
          },
          {
            id: 'arc_idol_warrior_decline',
            text: '婉拒',
            subtext: '“反黑行为过激容易出问题”',
            outcome: {
              narration: '你委婉地拒绝了。她在超话发了一条含糊的动态：“有些事情只能自己扛。”其他粉丝感觉到不对劲。',
              statChanges: { fanLoyalty: -2, prRisk: 2 },
              unlockTag: 'arc_idol_warrior_declined',
            },
          },
        ],
      },
      // mid
      {
        category: 'crisis',
        severity: 'medium',
        title: `${'偷心贼_帅版'}：误伤路人上了热搜`,
        description: '战斗粉的反黑变成了人身攻击，一个路人发了句“不觉得 TA 有那么帅”就被挂了三天，最终那人发文控诉“网暴”。现在营销号抓住了，写的都是“XX 粉丝战斗力爆棚”。',
        emoji: '💥',
        choices: [
          {
            id: 'arc_idol_warrior_pull',
            text: '艺人出面让她停手',
            subtext: '发声明“理性追星”',
            outcome: {
              narration: '艺人录了段视频让粉丝冷静。偷心贼解散了群，发了道歉长文，但对你们有了心结。',
              statChanges: { prRisk: -5, fanLoyalty: -2 },
              unlockTag: 'arc_idol_warrior_reined',
            },
          },
          {
            id: 'arc_idol_warrior_defend',
            text: '让她别认怂',
            subtext: '“黑子活该”',
            outcome: {
              narration: '你给她回了个“辛苦了”的语音。她把这条语音（已剪辑）发到群里给队员打气。反黑更疯了，但事态也更失控了。',
              statChanges: { prRisk: 10, fanLoyalty: 3, commercialValue: -3 },
              unlockTag: 'arc_idol_warrior_escalated',
            },
          },
          {
            id: 'arc_idol_warrior_ignore',
            text: '装不知道',
            subtext: '让子弹飞',
            outcome: {
              narration: '你按兵不动。偷心贼自己也在观望，她不确定该不该继续。这种暧昧的状态持续了几天。',
              statChanges: { prRisk: 4, fanLoyalty: -1 },
              unlockTag: 'arc_idol_warrior_ambiguous',
            },
          },
        ],
      },
      // finale
      {
        category: 'drama',
        severity: 'high',
        title: `${'偷心贼_帅版'}：退圈宣言`,
        description: '战斗粉偷心贼发了两千字长文：“我追了三年，从热血到心凉。从今天起我退出这个圈子，祝 TA 越来越好。”评论区瞬间破万，很多是她带出来的老粉跟着表态。',
        emoji: '🕯️',
        choices: [
          {
            id: 'arc_idol_warrior_farewell',
            text: '艺人亲自私信挽留',
            subtext: '语音一条发过去',
            outcome: {
              narration: '她收到语音后沉默了一夜，第二天删了那篇长文，发了“我是傻子”。但圈里都知道了，她不再是从前那个战斗粉。',
              statChanges: { fanLoyalty: 5, prRisk: -3 },
              unlockTag: 'arc_idol_warrior_returned',
            },
          },
          {
            id: 'arc_idol_warrior_letgo',
            text: '尊重她的选择',
            subtext: '不挽留',
            outcome: {
              narration: '你什么都没做。她真的走了。三天后粉丝数少了 4 万，很多是她带来的人。',
              statChanges: { fanLoyalty: -8, commercialValue: -3 },
              unlockTag: 'arc_idol_warrior_lost',
            },
          },
        ],
      },
    ],
  },

  // ===== 演员：拍图大神“美丽·光影手记”的“买断独家 → 底片争夺 → 出版画册” =====
  {
    artist: 'actor',
    fansiteId: 'fansite_1',
    fansiteName: '美丽·光影手记',
    minDays: [4, 10, 15],
    steps: [
      {
        category: 'business',
        severity: 'low',
        title: `${'美丽·光影手记'}：首次约你喝咖啡`,
        description: '拍图大神“美丽”约你在工作室楼下的咖啡馆见面。她翻出了一组你艺人上周活动的生图，质感极佳。“我想做一本限量画册，您可以允许我用吗？”',
        emoji: '☕',
        choices: [
          {
            id: 'arc_actor_photo_partner',
            text: '签合作协议',
            subtext: '分成画册收益',
            outcome: {
              narration: '合作协议签得很顺利。她给你留了 30%的分成，画册首印 500 本一天售罄。',
              statChanges: { money: 30000, fanLoyalty: 3, commercialValue: 2 },
              unlockTag: 'arc_actor_photo_partnered',
            },
          },
          {
            id: 'arc_actor_photo_buyout',
            text: '直接买断所有底片',
            subtext: '花 ¥60000',
            outcome: {
              narration: '你付了 6 万，她把硬盘交给你，眼神里有一点不甘。这些照片现在是你的了。',
              statChanges: { money: -60000, commercialValue: 2 },
              unlockTag: 'arc_actor_photo_bought',
            },
          },
          {
            id: 'arc_actor_photo_decline',
            text: '拒绝，不想商业化',
            subtext: '“这太媚俗”',
            outcome: {
              narration: '她收起相机，礼貌地点头。你隐约觉得她眼神里有什么东西灭了，那个时候还不知道会带来什么。',
              statChanges: { fanLoyalty: -1 },
              unlockTag: 'arc_actor_photo_declined',
            },
          },
        ],
      },
      // mid
      {
        category: 'crisis',
        severity: 'medium',
        title: `${'美丽·光影手记'}：她的画册被盗印了`,
        description: '美丽突然发长文：有人把她画册扫描完整放到了网盘免费下载。“我投入了一年，现在人家拿它赚流量。”她艾特了你艺人的官方号。',
        emoji: '😤',
        choices: [
          {
            id: 'arc_actor_photo_legal',
            text: '工作室出面帮她维权',
            subtext: '法务全包',
            outcome: {
              narration: '法务联系了平台，下架了盗版链接。美丽在微博公开致谢，“有这样的工作室，大粉不孤单。”',
              statChanges: { money: -20000, fanLoyalty: 6, commercialValue: 2 },
              unlockTag: 'arc_actor_photo_defended',
            },
          },
          {
            id: 'arc_actor_photo_offer_help',
            text: '给点安慰金（¥15000）',
            subtext: '意思一下',
            outcome: {
              narration: '她收下了，但没发微博。圈里的其他大粉议论，“象征性给点钱？这就是工作室的态度？”',
              statChanges: { money: -15000, fanLoyalty: 1, prRisk: 1 },
              unlockTag: 'arc_actor_photo_pittance',
            },
          },
          {
            id: 'arc_actor_photo_stay_out',
            text: '保持距离，让她自己处理',
            subtext: '不掺合版权事',
            outcome: {
              narration: '她没再艾特你。几天后她停更了一周，圈里第一次出现“光影手记要退了？”的讨论。',
              statChanges: { fanLoyalty: -3, prRisk: 2 },
              unlockTag: 'arc_actor_photo_abandoned',
            },
          },
        ],
      },
      // finale
      {
        category: 'business',
        severity: 'high',
        title: `${'美丽·光影手记'}：国际影展邀请函`,
        description: '美丽突然给你艺人发了一份英文邀请函，某国际电影摄影展想收她拍的一组“XX 在片场”的人像，并邀请你艺人出席开幕式。',
        emoji: '🌏',
        choices: [
          {
            id: 'arc_actor_photo_attend',
            text: '艺人亲自出席',
            subtext: '配合所有宣传',
            outcome: {
              narration: '开幕式上美丽哭了。你艺人现场做了简短发言：“她拍到了我自己都没看到的东西。”这段视频在国内再次火了。',
              statChanges: { money: 80000, commercialValue: 12, fanLoyalty: 6 },
              unlockTag: 'arc_actor_photo_gloriously',
            },
          },
          {
            id: 'arc_actor_photo_video_msg',
            text: '只发视频致辞',
            subtext: '不去现场',
            outcome: {
              narration: '你让艺人录了段视频。美丽理解，但在现场她明显更安静。照片还是被收藏了，但圈里有人议论“连面都不露？”',
              statChanges: { commercialValue: 4, fanLoyalty: 2 },
              unlockTag: 'arc_actor_photo_distant',
            },
          },
        ],
      },
    ],
  },

  // ===== 网红：情绪型大粉“xxx 今天想你”的“情感依赖 → 破防 → 和解 / 彻底决裂” =====
  {
    artist: 'influencer',
    fansiteId: 'fansite_1',
    fansiteName: 'xxx今天想你',
    minDays: [4, 10, 15],
    steps: [
      {
        category: 'pr',
        severity: 'low',
        title: `xxx今天想你：她半夜给你发消息了`,
        description: '凌晨两点，情绪型大粉在后援会小群里发了 9 条语音，第一条是：“我知道我不应该在这个点发消息，但是我今天真的...好想 TA。”',
        emoji: '🌙',
        choices: [
          {
            id: 'arc_inf_emo_voice',
            text: '让艺人回一条语音',
            subtext: '“早点睡”',
            outcome: {
              narration: '艺人回了一条 6 秒的语音：“我也想你，早点睡。”她把语音截屏发了三个超话，配文“我存一辈子”。',
              statChanges: { fanLoyalty: 6, prRisk: 1 },
              unlockTag: 'arc_inf_emo_voice_given',
            },
          },
          {
            id: 'arc_inf_emo_assist',
            text: '让助理代回',
            subtext: '“姐姐/哥哥累了”',
            outcome: {
              narration: '助理以艺人名义回了文字。她秒回了个“好”。但后面几天她发的内容明显冷淡了很多。',
              statChanges: { fanLoyalty: -1 },
              unlockTag: 'arc_inf_emo_assist',
            },
          },
          {
            id: 'arc_inf_emo_noreply',
            text: '不回',
            subtext: '专业边界',
            outcome: {
              narration: '你没有回。第二天她在小号发了一条哭脸，然后删了。这事没人再提，但大家都记得。',
              statChanges: { fanLoyalty: -3, prRisk: 1 },
              unlockTag: 'arc_inf_emo_silence',
            },
          },
        ],
      },
      // mid
      {
        category: 'crisis',
        severity: 'medium',
        title: `xxx今天想你：她偷拍了艺人的私下行程`,
        description: '她拍到了艺人和朋友私下聚餐的照片，并发到小群：“其实我一直都在你附近。”圈内大粉都惊了，这已经越线了。',
        emoji: '🚨',
        choices: [
          {
            id: 'arc_inf_emo_confront',
            text: '艺人直接电话她',
            subtext: '语气严肃',
            outcome: {
              narration: 'TA 给她打了 40 分钟电话。她在电话里哭了很久，承诺删除所有私下照片、不再跟踪。电话挂了以后，大家都不知道该怎么评价。',
              statChanges: { fanLoyalty: 2, prRisk: -3 },
              unlockTag: 'arc_inf_emo_confronted',
            },
          },
          {
            id: 'arc_inf_emo_police',
            text: '报警立案',
            subtext: '以私生处理',
            outcome: {
              narration: '警方找了她。超话爆炸，有人骂“至于吗”，有人说“早该这样”。总之你和她之间再也不会有一条语音了。',
              statChanges: { prRisk: 5, fanLoyalty: -4 },
              unlockTag: 'arc_inf_emo_legalized',
            },
          },
          {
            id: 'arc_inf_emo_warn_legal',
            text: '发律师函警告',
            subtext: '不立案但留底',
            outcome: {
              narration: '律师函发到了。她小号安静了三天，再出现时状态像换了个人，冷静、刻板、再也不“催营业”。',
              statChanges: { money: -20000, fanLoyalty: -2, prRisk: -1 },
              unlockTag: 'arc_inf_emo_warned',
            },
          },
        ],
      },
      // finale
      {
        category: 'drama',
        severity: 'high',
        title: `xxx今天想你：她上电视讲了追星这回事`,
        description: '她接了一个深度访谈节目，讲了自己三年来追你的心路：从喜欢到过度依赖，到意识到边界。节目里她说：“我现在每天只刷 20 分钟他的动态，然后去上班。”',
        emoji: '📺',
        choices: [
          {
            id: 'arc_inf_emo_support',
            text: '艺人转发她的采访',
            subtext: '“谢谢你成长”',
            outcome: {
              narration: '艺人亲自转发并配文“替我谢谢每一个学会放下过度情绪的人”。这一条被无数大 v 转发，掀起关于“健康追星”的讨论。',
              statChanges: { fanLoyalty: 8, commercialValue: 6, prRisk: -3 },
              unlockTag: 'arc_inf_emo_redemption',
            },
          },
          {
            id: 'arc_inf_emo_ignore',
            text: '不表态',
            subtext: '保持距离',
            outcome: {
              narration: '你没有转发。她也没联系你。但这条访谈自己火了，人们不需要你的配合也能认可她。',
              statChanges: { fanLoyalty: 2 },
              unlockTag: 'arc_inf_emo_silent_end',
            },
          },
        ],
      },
    ],
  },
];

/** 每天检查一次，如果当前艺人有可触发的剧情步骤就返回；否则 null。 */
export function pickFansiteArcEvent(ctx: {
  day: number;
  artistId: ArtistArchetype;
  fansiteArcStep: Record<string, number>; // key = fansiteId, value = 0|1|2|3
}): { event: GameEvent; fansiteId: string; nextStep: number } | null {
  const arc = ARCS.find(a => a.artist === ctx.artistId);
  if (!arc) return null;

  const currentStep = ctx.fansiteArcStep[arc.fansiteId] ?? 0;
  if (currentStep >= 3) return null; // arc done

  const nextStepIdx = currentStep; // 0, 1, 2
  const minDay = arc.minDays[nextStepIdx];
  if (ctx.day < minDay) return null;

  // 25% probability per eligible day ， avoid two arcs firing back-to-back
  if (Math.random() > 0.25) return null;

  const eventTemplate = arc.steps[nextStepIdx];
  const eventId = `arc_${arc.artist}_${arc.fansiteId}_step${nextStepIdx}`;
  return {
    event: { ...eventTemplate, id: eventId } as GameEvent,
    fansiteId: arc.fansiteId,
    nextStep: currentStep + 1,
  };
}

/** 暴露所有弧事件供 findEventById 使用（以防 followUpEventId 引用）。
 *  注入一个永远不会在 activeTags 里出现的 requiredTag，防止它们被普通
 *  weighted selector 抽中 ， 弧事件只能通过 pickFansiteArcEvent 主动注入。 */
export const fansiteArcEvents: GameEvent[] = ARCS.flatMap(arc =>
  arc.steps.map((step, idx) => ({
    ...step,
    id: `arc_${arc.artist}_${arc.fansiteId}_step${idx}`,
    forArtist: arc.artist,
    requiredTags: ['__arc_only__'],
  }) as GameEvent)
);
