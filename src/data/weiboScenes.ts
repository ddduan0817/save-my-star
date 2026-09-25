import type {
  WeiboCommentEntry,
  WeiboCommentRole,
  WeiboCommentStance,
  WeiboOutcome,
  WeiboRivalId,
  WeiboSceneId,
} from '@/types/game';

export const ARTIST_POST_SCENES = [
  'artist_work_photo',
  'artist_late_night',
  'artist_controversy_response',
  'artist_work_promotion',
  'artist_fan_gift',
  'artist_charity',
  'artist_fight_haters',
  'artist_selfie',
  'artist_romance_hint',
  'artist_apology',
] as const satisfies readonly WeiboSceneId[];

export const FAN_FEED_SCENES = [
  'fan_brand_sales',
  'fan_fansite_copyright',
  'fan_airport_sighting',
  'fan_support_campaign',
  'fan_work_complaint',
  'fan_media_smear',
  'fan_cp_discussion',
  'fan_fandom_conflict',
  'fan_career_discussion',
  'fan_crisis_watch',
  'fan_persona_discussion',
  'fan_private_sighting',
] as const satisfies readonly WeiboSceneId[];

export const BURNER_SCENES = [
  'burner_rival_smear',
  'burner_reverse_attack',
  'burner_artist_impersonation',
] as const satisfies readonly WeiboSceneId[];

export const RIVALRY_COMMENT_SCENES = [
  'fan_brand_sales',
  'fan_media_smear',
  'fan_fandom_conflict',
  'burner_rival_smear',
  'burner_reverse_attack',
] as const satisfies readonly WeiboSceneId[];

export const ALL_WEIBO_SCENES = [
  ...ARTIST_POST_SCENES,
  ...FAN_FEED_SCENES,
  ...BURNER_SCENES,
] as const satisfies readonly WeiboSceneId[];

const SUCCESS: readonly WeiboOutcome[] = ['success'];
const BACKFIRE: readonly WeiboOutcome[] = ['backfire'];
const ALL_OUTCOMES: readonly WeiboOutcome[] = ['success', 'backfire', 'leaked'];

type CommentDraft = readonly [
  text: string,
  role: WeiboCommentRole,
  stance: WeiboCommentStance,
];

type CommentGroup = readonly CommentDraft[];

interface ScenePoolDraft {
  directSuccess: CommentDraft;
  directBackfire: CommentDraft;
  directShared: CommentDraft;
  success: CommentGroup;
  backfire: CommentGroup;
  shared: CommentGroup;
}

function toEntry(
  draft: CommentDraft,
  allowedOutcomes: readonly WeiboOutcome[],
  priority: WeiboCommentEntry['priority'],
): WeiboCommentEntry {
  const [text, role, stance] = draft;
  return { text, role, stance, allowedOutcomes, priority };
}

function defineScenePool(draft: ScenePoolDraft): WeiboCommentEntry[] {
  return [
    toEntry(draft.directSuccess, SUCCESS, 'direct'),
    toEntry(draft.directBackfire, BACKFIRE, 'direct'),
    toEntry(draft.directShared, ALL_OUTCOMES, 'direct'),
    ...draft.success.map(item => toEntry(item, SUCCESS, 'secondary')),
    ...draft.backfire.map(item => toEntry(item, BACKFIRE, 'secondary')),
    ...draft.shared.map(item => toEntry(item, ALL_OUTCOMES, 'secondary')),
  ];
}

export const COMMENT_NICK_POOLS: Record<WeiboCommentRole, readonly string[]> = {
  fan: [
    '星光收藏家',
    '陪你走花路',
    '今天也守护',
    '小小应援灯',
    '长情观众',
    '只看自家',
    '月亮后援席',
    '一路同行',
  ],
  casual: [
    '路过看一眼',
    '今天不加班',
    '西瓜半块',
    '随手刷到',
    '普通网友',
    '楼下便利店',
    '先吃饭吧',
    '围观群众',
  ],
  data_fan: [
    '数据组值班员',
    '反黑签到处',
    '榜单记录员',
    '超话搬砖人',
    '控评小队长',
    '链接汇总站',
    '打榜倒计时',
    '数据复盘号',
  ],
  fansite: [
    '前线图站',
    '快门记录册',
    '现场留档站',
    '光影收藏站',
    '原图发布页',
    '行程记录簿',
    '镜头背后',
    '今日出图',
  ],
  cp_fan: [
    '双人份晚风',
    '同框研究所',
    '糖点记录簿',
    '两颗星轨',
    '默契观察员',
    '并肩入镜',
    '嗑学课代表',
    '故事未完待续',
  ],
  anti: [
    '隔壁观察号',
    '不吃这套',
    '反方发言人',
    '路过拆台',
    '对面吃瓜组',
    '今天也质疑',
    '黑名单常客',
    '另一家路人',
  ],
  former_fan: [
    '旧相册未删',
    '曾经追过',
    '退坑观察期',
    '前排旧座位',
    '已取消关注',
    '老粉留句话',
    '从前很认真',
    '告别应援色',
  ],
  rival_fan: [
    '隔壁后援席',
    '对家数据组',
    '另一束应援光',
    '隔壁反黑站',
    '对面打投人',
    '隔壁前线',
    '另一家唯粉',
    '对家守护号',
  ],
  sasaeng: [
    '凌晨还在蹲',
    '行程追踪中',
    '今天也在前线',
    '航班观察号',
    '镜头不关机',
    '酒店门口见',
    '跟车记录簿',
    '私下行程bot',
  ],
};

export const RIVAL_FAN_NICK_POOLS: Record<WeiboRivalId, readonly string[]> = {
  lin_c: [
    '林C位粉丝',
    '林C位应援灯',
    '林C位数据站',
    'C位守护席',
    '林家打投组',
    '陪林C位登顶',
    '林C位舞台簿',
    '林C位反黑站',
  ],
  chao_cute: [
    '晁可爱粉丝',
    '可爱守护站',
    '晁晁追剧日记',
    '小晁数据组',
    '晁可爱反黑站',
    '甜妹应援灯',
    '陪晁晁进组',
    '可爱前线',
  ],
  ge_wang: [
    '葛王粉丝',
    '葛王新歌循环',
    '葛家打歌组',
    '神曲守护站',
    '葛王数据台',
    '陪葛王开唱',
    '葛王反黑站',
    '今晚听葛王',
  ],
  wang_sc: [
    '王思琪粉丝',
    '思琪追剧簿',
    '王思琪数据站',
    '小琪守护席',
    '思琪进组了吗',
    '王思琪反黑站',
    '琪光应援灯',
    '思琪前线',
  ],
  gu_junting: [
    '顾君庭粉丝',
    '君庭观影席',
    '顾君庭数据站',
    '庭前一束光',
    '顾家应援簿',
    '陪君庭进组',
    '顾君庭反黑站',
    '君庭前线',
  ],
};

export const WEIBO_COMMENT_POOLS: Record<WeiboSceneId, WeiboCommentEntry[]> = {
  artist_work_photo: defineScenePool({
    directSuccess: ['这组工作照把现场状态拍得太好了，收工辛苦。', 'fan', 'supportive'],
    directBackfire: ['争议还没回应就发工作照，确实很像在转移视线。', 'casual', 'skeptical'],
    directShared: ['照片里的布景是新项目现场吗？先蹲一个正式消息。', 'fansite', 'neutral'],
    success: [
      ['今天的造型和项目气质很搭，团队审美在线。', 'fan', 'supportive'],
      ['已存原图，工作室记得补一版无水印高清。', 'fansite', 'procedural'],
      ['有真实工作状态，比只发精修硬照自然。', 'casual', 'supportive'],
    ],
    backfire: [
      ['评论区问的事不回应，发多少照片也压不住。', 'former_fan', 'skeptical'],
      ['团队是不是觉得营业一下大家就会忘记前情？', 'casual', 'hostile'],
      ['这时候还安排热搜夸状态，对面都看不下去了。', 'anti', 'hostile'],
    ],
    shared: [
      ['现场光线挺复杂，成片能有这个效果不容易。', 'fansite', 'neutral'],
      ['先看作品，工作照只能说明当天状态。', 'casual', 'neutral'],
      ['行程辛苦，按时吃饭比营业更重要。', 'fan', 'supportive'],
    ],
  }),
  artist_late_night: defineScenePool({
    directSuccess: ['深夜这段话看懂了，累的时候也可以停一下。', 'fan', 'supportive'],
    directBackfire: ['没头没尾的深夜感悟，只会让人猜是不是又出事了。', 'casual', 'skeptical'],
    directShared: ['凌晨还醒着，是刚收工还是最近睡不好？', 'casual', 'neutral'],
    success: [
      ['不用每次都表现得很完美，我们会认真听。', 'fan', 'supportive'],
      ['这次不是营业口吻，能感到是真的想说几句。', 'former_fan', 'supportive'],
      ['早点休息，明天醒来再处理没做完的事。', 'casual', 'supportive'],
    ],
    backfire: [
      ['每次有舆情就深夜抒情，套路已经很明显了。', 'anti', 'hostile'],
      ['真正需要回应的问题一句都没提。', 'former_fan', 'skeptical'],
      ['团队最好确认一下状态，别让模糊表达继续发酵。', 'casual', 'procedural'],
    ],
    shared: [
      ['先不做过度解读，等本人白天再说。', 'casual', 'neutral'],
      ['看到就留一句晚安，希望今晚能睡好。', 'fan', 'supportive'],
      ['已截图留档，避免明早删掉后又出现不同版本。', 'fansite', 'procedural'],
    ],
  }),
  artist_controversy_response: defineScenePool({
    directSuccess: ['回应把时间线和责任说清楚了，至少没有回避核心问题。', 'casual', 'supportive'],
    directBackfire: ['原本没多少人关注的传闻，被这份回应重新顶上来了。', 'former_fan', 'skeptical'],
    directShared: ['先把原始材料和完整时间线放出来，文字表态不够。', 'casual', 'procedural'],
    success: [
      ['愿意正面说明就好，后续行动也请同步公开。', 'fan', 'supportive'],
      ['重点已经整理，别被断章取义的截图带跑。', 'data_fan', 'procedural'],
      ['如果事实和回应一致，这次可以给当事人空间。', 'casual', 'neutral'],
    ],
    backfire: [
      ['原本没人注意的事，现在本人亲自把热度抬起来了。', 'anti', 'hostile'],
      ['回应得这么郑重，反而让人怀疑传闻比想象中严重。', 'former_fan', 'skeptical'],
      ['先说明到底在回应什么吧，没头没尾只会引来更多搜索。', 'casual', 'hostile'],
    ],
    shared: [
      ['涉及当事人的部分别继续扩散未经证实的信息。', 'fan', 'procedural'],
      ['声明已存档，之后有新证据再对照。', 'fansite', 'procedural'],
      ['先等相关方完整回应，不急着站队。', 'casual', 'neutral'],
    ],
  }),
  artist_work_promotion: defineScenePool({
    directSuccess: ['新项目终于发布，关键信息已经记下了。', 'fan', 'supportive'],
    directBackfire: ['前面的争议没处理完就开始宣传，观感确实不好。', 'casual', 'skeptical'],
    directShared: ['上线时间和观看渠道能再写清楚一点吗？', 'casual', 'procedural'],
    success: [
      ['预约完成，正式上线当天会带话题反馈。', 'data_fan', 'procedural'],
      ['这次宣传文案很贴作品，不是只喊口号。', 'casual', 'supportive'],
      ['期待完整内容，先看成品再评价。', 'fan', 'neutral'],
    ],
    backfire: [
      ['宣传排期照跑，但观众的问题也需要有人回应。', 'former_fan', 'skeptical'],
      ['热搜买得很快，作品信息反而没讲明白。', 'anti', 'hostile'],
      ['合作方和平台最好评估一下现在的舆情风险。', 'casual', 'procedural'],
    ],
    shared: [
      ['先码住日期，看完作品再评价。', 'casual', 'neutral'],
      ['官博物料已汇总，转发时别带错链接。', 'data_fan', 'procedural'],
      ['希望成片对得起这段时间的准备。', 'fan', 'supportive'],
    ],
  }),
  artist_fan_gift: defineScenePool({
    directSuccess: ['认真看完应援和信件再来感谢，这份回应很有心。', 'fan', 'supportive'],
    directBackfire: ['平时很少回应粉丝，现在突然晒礼物和信，难免让人觉得是在补营业。', 'casual', 'skeptical'],
    directShared: ['礼物和信件都收到了，后援会记得公开签收明细。', 'fansite', 'procedural'],
    success: [
      ['看到自己的手写信出现在照片角落，真的值了。', 'fan', 'supportive'],
      ['现场物料已核对，感谢每个参与应援的人。', 'fansite', 'supportive'],
      ['表达感谢就很好，也提醒大家量力而行吧。', 'casual', 'neutral'],
    ],
    backfire: [
      ['感情不是晒一次信件和礼物就能补回来的。', 'former_fan', 'skeptical'],
      ['团队先把长期缺少互动的问题说清楚，别只靠一条感谢微博。', 'casual', 'procedural'],
      ['低谷时才想起晒粉丝心意，这种宠粉来得太巧了。', 'anti', 'hostile'],
    ],
    shared: [
      ['心意比金额重要，希望以后多收信少收贵重物品。', 'fan', 'neutral'],
      ['应援照片请保留原作者署名，不要二次裁切。', 'fansite', 'procedural'],
      ['生日祝福收到就好，大家别为排面互相比较。', 'casual', 'neutral'],
    ],
  }),
  artist_charity: defineScenePool({
    directSuccess: ['项目内容和捐助去向都写得清楚，愿意一起关注。', 'casual', 'supportive'],
    directBackfire: ['公益信息很重要，但不能拿来覆盖尚未回应的争议。', 'former_fan', 'skeptical'],
    directShared: ['请把官方项目链接置顶，避免大家转错渠道。', 'data_fan', 'procedural'],
    success: [
      ['已经通过官方入口参与，感谢让更多人看见。', 'fan', 'supportive'],
      ['不煽情，只把受助需求说清楚，这种表达挺好。', 'casual', 'supportive'],
      ['数据组只做公益信息扩散，不做金额攀比。', 'data_fan', 'procedural'],
    ],
    backfire: [
      ['如果只是临时公关动作，后续执行很快就会暴露。', 'anti', 'hostile'],
      ['先公开实际参与记录，再谈社会责任感。', 'casual', 'skeptical'],
      ['公益本身没错，但发布时机确实让人难以信服。', 'former_fan', 'neutral'],
    ],
    shared: [
      ['不要把受助者照片当成追星物料传播。', 'fan', 'procedural'],
      ['官方渠道已核验，其他收款码不要点。', 'data_fan', 'procedural'],
      ['项目值得关注，艺人评价可以和公益本身分开。', 'casual', 'neutral'],
    ],
  }),
  artist_fight_haters: defineScenePool({
    directSuccess: ['把造谣内容和法律处理说清楚，比含糊内涵有效。', 'fan', 'supportive'],
    directBackfire: ['回应已经越过澄清范围，直接攻击普通网友不合适。', 'casual', 'skeptical'],
    directShared: ['证据交给平台和律师，别继续和匿名账号拉扯。', 'data_fan', 'procedural'],
    success: [
      ['该硬气的时候就硬气，恶意造谣不能默认。', 'fan', 'supportive'],
      ['侵权链接已经汇总，粉丝不要私下辱骂对方。', 'data_fan', 'procedural'],
      ['有证据有边界，这次回应算得体。', 'casual', 'supportive'],
    ],
    backfire: [
      ['明星亲自追着网友吵，只会让事情继续升级。', 'former_fan', 'skeptical'],
      ['一句法庭见后面跟着人身攻击，前面的正当性都没了。', 'casual', 'hostile'],
      ['控不住情绪就别发，截图已经到处都是。', 'anti', 'hostile'],
    ],
    shared: [
      ['别去对方主页团建，保存证据交给专业团队。', 'fan', 'procedural'],
      ['原帖和回应都已留档，等正式处理结果。', 'fansite', 'procedural'],
      ['可以维护权益，但双方都不该扩大人身攻击。', 'casual', 'neutral'],
    ],
  }),
  artist_selfie: defineScenePool({
    directSuccess: ['这张日常自拍状态很松弛，比棚拍更有生活感。', 'fan', 'supportive'],
    directBackfire: ['修图痕迹太明显，日常自拍反而显得不真实。', 'casual', 'skeptical'],
    directShared: ['自拍背景看起来是在休息室，今天还有行程吗？', 'casual', 'neutral'],
    success: [
      ['简单发张照片就很好，不需要每次都写长文。', 'fan', 'supportive'],
      ['原图色调舒服，已经收进今日份记录。', 'fansite', 'supportive'],
      ['路人刷到也觉得状态不错，挺自然的。', 'casual', 'supportive'],
    ],
    backfire: [
      ['团队是不是没检查背景，敏感信息都露出来了。', 'former_fan', 'skeptical'],
      ['这时候发自拍像在试探大家是不是忘了前情。', 'casual', 'hostile'],
      ['滤镜拉满还营销真实状态，多少有点矛盾。', 'anti', 'hostile'],
    ],
    shared: [
      ['注意别让行程单和工作人员信息入镜。', 'fansite', 'procedural'],
      ['今天看起来挺有精神，记得休息。', 'fan', 'supportive'],
      ['照片看看就好，不用从背景猜私人生活。', 'casual', 'neutral'],
    ],
  }),
  artist_romance_hint: defineScenePool({
    directSuccess: ['这句保留空间的表达很温柔，等本人愿意公开再说。', 'cp_fan', 'supportive'],
    directBackfire: ['如果确实在暗示恋情，就别一边吊胃口一边让粉丝猜。', 'fan', 'hostile'],
    directShared: ['“最近很好”到底指工作还是感情，先不替本人定义。', 'casual', 'neutral'],
    success: [
      ['只要是认真生活，愿意尊重成年人的选择。', 'fan', 'supportive'],
      ['这个措辞和前几天的同款细节能对上，先记一笔。', 'cp_fan', 'supportive'],
      ['路人觉得挺正常，没必要因为一句话直接审判。', 'casual', 'neutral'],
    ],
    backfire: [
      ['单身人设营业这么久，现在让核心粉自己消化？', 'former_fan', 'skeptical'],
      ['不官宣又反复给线索，热度倒是吃得很明白。', 'anti', 'hostile'],
      ['团队最好尽快统一口径，越拖猜测越离谱。', 'casual', 'procedural'],
    ],
    shared: [
      ['别去骚扰疑似对象，所有猜测停在公开信息里。', 'cp_fan', 'procedural'],
      ['无论答案是什么，都希望别再用模糊话术消耗信任。', 'former_fan', 'neutral'],
      ['先等后续，截图拼时间线也不等于实锤。', 'casual', 'neutral'],
    ],
  }),
  artist_apology: defineScenePool({
    directSuccess: ['道歉明确说了错在哪里，也给出了后续整改期限。', 'casual', 'supportive'],
    directBackfire: ['原本没人注意这件事，突然道歉反而把所有人都引来问前情。', 'former_fan', 'skeptical'],
    directShared: ['道歉先收下，是否有效还要看接下来的行动。', 'fan', 'neutral'],
    success: [
      ['愿意承认错误就还有修正空间，希望说到做到。', 'fan', 'supportive'],
      ['没有卖惨也没有甩锅，这份表态可以继续观察。', 'casual', 'supportive'],
      ['整改节点已经整理，后援会不会替任何失误洗地。', 'data_fan', 'procedural'],
    ],
    backfire: [
      ['这件事本来没出圈，现在一封道歉把关键词全送上热搜了。', 'anti', 'hostile'],
      ['事情还没发酵就先公开道歉，反而让人怀疑还有没说的部分。', 'former_fan', 'skeptical'],
      ['先把前因后果说清楚吧，突然道歉只会引来更多猜测。', 'casual', 'hostile'],
    ],
    shared: [
      ['别催受影响的人立刻原谅，道歉不是结案通知。', 'fan', 'procedural'],
      ['原文和修改记录已留档，后续按行动判断。', 'fansite', 'procedural'],
      ['可以接受道歉，也可以保留质疑，这两件事不冲突。', 'casual', 'neutral'],
    ],
  }),
  fan_brand_sales: defineScenePool({
    directSuccess: ['销量榜已经上升，数据组继续核对有效订单。', 'data_fan', 'supportive'],
    directBackfire: ['冲销量冲到强制摊派，已经偏离正常消费了。', 'former_fan', 'skeptical'],
    directShared: ['下单走官方渠道，别点群里来源不明的链接。', 'data_fan', 'procedural'],
    success: [
      ['刚需已下单，晒单时记得带品牌活动话题。', 'fan', 'supportive'],
      ['品牌反馈速度不错，售后信息也写得很清楚。', 'casual', 'supportive'],
      ['当前榜单截图已存，晚八点再做一次数据复盘。', 'data_fan', 'procedural'],
      ['销量好就聊销量，别每次都拉{rival}出来比较。', 'rival_fan', 'skeptical'],
    ],
    backfire: [
      ['买不需要的东西做数据，最后压力都落在普通粉丝身上。', 'casual', 'skeptical'],
      ['退款被挂人就太过分了，消费本来就该自愿。', 'former_fan', 'hostile'],
      ['隔壁都开始晒真实订单了，这边还在统计空瓶链接。', 'anti', 'hostile'],
      ['先把真实订单对明白，再来碰瓷{rival}的商务成绩。', 'rival_fan', 'hostile'],
    ],
    shared: [
      ['量力而行，支持不该变成消费考核。', 'fan', 'neutral'],
      ['认准官方店铺和活动规则，谨防代拍代购骗局。', 'data_fan', 'procedural'],
      ['产品适合自己再买，别为了比较超额消费。', 'casual', 'neutral'],
      ['{rival}粉丝不接销量拉踩，双方各做各的数据。', 'rival_fan', 'neutral'],
    ],
  }),
  fan_fansite_copyright: defineScenePool({
    directSuccess: ['原图、发布时间和搬运链接都齐了，支持依法维权。', 'fansite', 'procedural'],
    directBackfire: ['证据还没核实就挂人，可能伤到正常转载账号。', 'casual', 'skeptical'],
    directShared: ['转载先看授权范围，署名不等于自动获得使用权。', 'fansite', 'procedural'],
    success: [
      ['已经举报无授权搬运，等待平台处理。', 'fan', 'procedural'],
      ['拍摄和修图都是劳动，支持原作者按流程维权。', 'casual', 'supportive'],
      ['水印版和原始文件都已留存，维权材料完整。', 'fansite', 'supportive'],
    ],
    backfire: [
      ['先撤掉包含无关用户信息的挂人截图吧。', 'former_fan', 'procedural'],
      ['版权归属说不清就先别发动粉丝举报。', 'casual', 'skeptical'],
      ['一边要求尊重版权一边拿别人的素材做证据图，很讽刺。', 'anti', 'hostile'],
    ],
    shared: [
      ['只处理侵权链接，不要扩散对方私人信息。', 'fan', 'procedural'],
      ['先停止扩散涉事图片，后续等平台认定。', 'fansite', 'procedural'],
      ['维权可以强硬，但事实和边界都要准确。', 'casual', 'neutral'],
    ],
  }),
  fan_airport_sighting: defineScenePool({
    directSuccess: ['机场路透确认平安落地，现场秩序看起来也不错。', 'fansite', 'supportive'],
    directBackfire: ['接机已经堵到通道，别再把影响旅客当成排面。', 'casual', 'hostile'],
    directShared: ['非公开行程不要追，公开区域也请保持距离。', 'fan', 'procedural'],
    success: [
      ['辛苦前线报平安，原图等站子统一发布。', 'fan', 'supportive'],
      ['现场没有围堵，大家都留出通行空间了。', 'fansite', 'supportive'],
      ['普通旅客视角看秩序还行，没有影响登机。', 'casual', 'neutral'],
    ],
    backfire: [
      ['追着拍到安检口真的越界了，工作人员都在劝。', 'former_fan', 'skeptical'],
      ['团队不公布行程却默许代拍聚集，这种操作该停。', 'casual', 'hostile'],
      ['每次都拿人多证明热度，扰乱秩序倒是真的。', 'anti', 'hostile'],
    ],
    shared: [
      ['不要实时发布航班和登机口信息。', 'fansite', 'procedural'],
      ['照片晚一点看没关系，安全比出图重要。', 'fan', 'supportive'],
      ['机场是公共空间，追星别影响其他人。', 'casual', 'neutral'],
    ],
  }),
  fan_support_campaign: defineScenePool({
    directSuccess: ['应援目标已经完成，账目和物料进度同步得很清楚。', 'data_fan', 'supportive'],
    directBackfire: ['应援临时加码又不公开预算，参与的人有权质疑。', 'former_fan', 'skeptical'],
    directShared: ['先看后援会公告，金额、用途和退款规则都要留档。', 'data_fan', 'procedural'],
    success: [
      ['已完成自己认领的部分，辛苦负责执行的姐妹。', 'fan', 'supportive'],
      ['公开表格每天更新，流程比以前规范多了。', 'casual', 'supportive'],
      ['物料数量已复核，超出部分不再追加筹款。', 'data_fan', 'procedural'],
    ],
    backfire: [
      ['拿未完成指标指责散粉，不是健康的应援方式。', 'casual', 'hostile'],
      ['账目对不上还删质疑帖，先暂停筹款吧。', 'former_fan', 'procedural'],
      ['排面喊得很响，执行细节却一问三不知。', 'anti', 'hostile'],
    ],
    shared: [
      ['自愿参与，不要私聊催款或公开点名。', 'fan', 'procedural'],
      ['所有转账凭证记得脱敏后归档。', 'data_fan', 'procedural'],
      ['应援是表达心意，不该变成粉籍考试。', 'casual', 'neutral'],
    ],
  }),
  fan_work_complaint: defineScenePool({
    directSuccess: ['新项目安排终于回应了大家对作品规划的担心。', 'fan', 'supportive'],
    directBackfire: ['团队继续用空泛饼安抚，实际工作还是没有进展。', 'former_fan', 'skeptical'],
    directShared: ['讨论资源可以，别把合作方和同组演员当出气口。', 'casual', 'procedural'],
    success: [
      ['项目类型适合长线发展，比盲目进组更重要。', 'fan', 'supportive'],
      ['官宣信息完整，至少这次没有让粉丝靠猜。', 'data_fan', 'supportive'],
      ['路人看规划挺合理，作品质量还是第一位。', 'casual', 'neutral'],
    ],
    backfire: [
      ['半年没有有效曝光，团队确实该解释职业规划。', 'former_fan', 'skeptical'],
      ['别再拿粉丝焦虑做热度，先把真正的工作落实。', 'fan', 'hostile'],
      ['天天骂团队却没有作品，隔壁看着都替你们急。', 'anti', 'hostile'],
    ],
    shared: [
      ['未官宣项目不要扩散，避免影响正常合作。', 'data_fan', 'procedural'],
      ['可以催事业，但别替本人决定每一步。', 'casual', 'neutral'],
      ['希望团队定期同步进度，减少无意义猜测。', 'fan', 'neutral'],
    ],
  }),
  fan_media_smear: defineScenePool({
    directSuccess: ['营销号的原文和事实时间线对不上，澄清证据有效。', 'data_fan', 'supportive'],
    directBackfire: ['没有证据就把所有负面报道叫抹黑，只会失去可信度。', 'casual', 'skeptical'],
    directShared: ['不要给营销号贡献点击，截图取证后走举报渠道。', 'data_fan', 'procedural'],
    success: [
      ['反黑组已整理原始出处，转发澄清不要带谣言链接。', 'fan', 'procedural'],
      ['媒体更正已经发出，说明这次核验确实有问题。', 'casual', 'supportive'],
      ['证据链清楚，支持工作室维护名誉。', 'fan', 'supportive'],
    ],
    backfire: [
      ['澄清图里自己都出现两版时间，先内部核对吧。', 'former_fan', 'skeptical'],
      ['把提出合理问题的人都打成黑粉，范围太大了。', 'casual', 'hostile'],
      ['没有证据就说{rival}买稿，别把我们拖进这场舆情。', 'rival_fan', 'hostile'],
    ],
    shared: [
      ['只传播可核验材料，聊天截图暂时不当证据。', 'data_fan', 'procedural'],
      ['先等正式说明，别跟着匿名爆料跑。', 'fan', 'neutral'],
      ['{rival}粉丝只接受有证据的讨论，别用“对家”代替事实。', 'rival_fan', 'neutral'],
    ],
  }),
  fan_cp_discussion: defineScenePool({
    directSuccess: ['这次公开互动确实自然，嗑到的人自己圈地开心。', 'cp_fan', 'supportive'],
    directBackfire: ['剪掉前后语境硬凑糖点，已经影响两边正常工作。', 'casual', 'skeptical'],
    directShared: ['同框是公开物料，关系定义还是交给当事人。', 'cp_fan', 'neutral'],
    success: [
      ['两个人接话的默契很好，这段可以反复看。', 'cp_fan', 'supportive'],
      ['唯粉尊重正常合作，别到个人广场刷组合内容。', 'fan', 'procedural'],
      ['路人觉得互动挺舒服，不用急着上升真假。', 'casual', 'neutral'],
    ],
    backfire: [
      ['偷拍视频和私人行程不能算糖，别越界。', 'former_fan', 'hostile'],
      ['为了组合热度歪曲原话，对双方都不尊重。', 'casual', 'skeptical'],
      ['又靠捆绑找存在感，单人话题能不能还给本人。', 'anti', 'hostile'],
    ],
    shared: [
      ['圈地自萌，不@本人，不骚扰合作对象。', 'cp_fan', 'procedural'],
      ['单人粉和组合粉各看各的，别互相查成分。', 'fan', 'neutral'],
      ['公开互动可以讨论，私人关系不要编故事。', 'casual', 'neutral'],
    ],
  }),
  fan_fandom_conflict: defineScenePool({
    directSuccess: ['双方后援会已经停战，先把辱骂和挂人内容删除。', 'data_fan', 'procedural'],
    directBackfire: ['别把冲突都推给{rival}，谁先跨广场记录都在。', 'rival_fan', 'hostile'],
    directShared: ['别带艺人大名互骂，举报违规内容后退出战场。', 'casual', 'procedural'],
    success: [
      ['停止扩散黑称，回到各自主页关注作品。', 'fan', 'supportive'],
      ['主持人已经清理引战帖，相关账号也做了禁言。', 'data_fan', 'procedural'],
      ['两边都降温以后，路人总算能正常看信息了。', 'casual', 'supportive'],
    ],
    backfire: [
      ['{rival}这边已经留完证，别再倒打一耙。', 'rival_fan', 'hostile'],
      ['大粉下场带节奏，普通粉丝只会被拖着一起挨骂。', 'former_fan', 'skeptical'],
      ['继续互扒隐私就不是粉圈争执，是实质伤害。', 'casual', 'hostile'],
    ],
    shared: [
      ['不转黑图，不传播私人信息，不参与人肉。', 'fan', 'procedural'],
      ['各家保存证据交平台，别组织跨区团建。', 'data_fan', 'procedural'],
      ['{rival}粉丝也只想各看各家，别再互相点名。', 'rival_fan', 'neutral'],
    ],
  }),
  fan_career_discussion: defineScenePool({
    directSuccess: ['这次职业规划有明确项目和时间表，比空口承诺可靠。', 'fan', 'supportive'],
    directBackfire: ['转型方向反复变化，现阶段确实看不出清晰路线。', 'former_fan', 'skeptical'],
    directShared: ['事业讨论以已官宣信息为准，网传项目先别当真。', 'data_fan', 'procedural'],
    success: [
      ['新方向能发挥长处，愿意等作品出来再判断。', 'fan', 'supportive'],
      ['团队开始取舍无效曝光，长期看是好事。', 'casual', 'supportive'],
      ['项目节点已整理，后面按完成度复盘。', 'data_fan', 'procedural'],
    ],
    backfire: [
      ['每次都说在接触项目，最后没有一个真正落地。', 'former_fan', 'skeptical'],
      ['团队把短期热度当规划，职业寿命只会越来越短。', 'casual', 'hostile'],
      ['连自己的定位都说不清，还天天比较别人资源。', 'anti', 'hostile'],
    ],
    shared: [
      ['粉丝可以提建议，但最终选择应尊重本人。', 'fan', 'neutral'],
      ['别去未官宣合作方评论区追问。', 'data_fan', 'procedural'],
      ['看一年后的作品结果，比现在争路线有意义。', 'casual', 'neutral'],
    ],
  }),
  fan_crisis_watch: defineScenePool({
    directSuccess: ['最新回应补上了关键证据，舆情开始回到事实层面。', 'casual', 'supportive'],
    directBackfire: ['新的爆料和原回应冲突，危机还在继续扩大。', 'former_fan', 'skeptical'],
    directShared: ['信息仍在更新，先按时间线整理，不急着下结论。', 'casual', 'neutral'],
    success: [
      ['核心事实已经澄清，粉丝别继续攻击最初的质疑者。', 'fan', 'procedural'],
      ['平台处理结果已更新，反黑组停止扩散旧截图。', 'data_fan', 'procedural'],
      ['能把问题处理清楚就好，后面看实际行动。', 'former_fan', 'neutral'],
    ],
    backfire: [
      ['团队每次回应都多一个漏洞，信任就是这样耗完的。', 'former_fan', 'hostile'],
      ['别再控评了，普通网友也能看出前后矛盾。', 'casual', 'hostile'],
      ['这次不是对家带节奏，是你们自己的说法站不住。', 'anti', 'hostile'],
    ],
    shared: [
      ['不传播未成年人与无关家属的信息。', 'fan', 'procedural'],
      ['原始来源优先，二手截图只作线索。', 'data_fan', 'procedural'],
      ['蹲后续，现阶段任何绝对判断都太早。', 'casual', 'neutral'],
    ],
  }),
  fan_persona_discussion: defineScenePool({
    directSuccess: ['这次公开表现和一直以来的人设一致，表达也很自然。', 'fan', 'supportive'],
    directBackfire: ['台前台后反差太大，之前经营的人设很难再成立。', 'former_fan', 'skeptical'],
    directShared: ['一个片段不足以定义真人，人设讨论别上升到人格审判。', 'casual', 'neutral'],
    success: [
      ['喜欢的是长期展现出来的选择，不是单个标签。', 'fan', 'supportive'],
      ['路人看完整视频后觉得没有营销号说得那么夸张。', 'casual', 'supportive'],
      ['原始物料已整理，别再传播剪辑版。', 'data_fan', 'procedural'],
    ],
    backfire: [
      ['以前靠这个标签吸粉，现在翻车就说别贴标签。', 'anti', 'hostile'],
      ['旧粉最清楚哪些表达是团队长期包装出来的。', 'former_fan', 'skeptical'],
      ['与其补新设定，不如承认真实状态有变化。', 'casual', 'hostile'],
    ],
    shared: [
      ['讨论公开行为就好，不要诊断陌生人的性格。', 'fan', 'procedural'],
      ['完整采访在官号，先看上下文再发言。', 'data_fan', 'procedural'],
      ['人会变化，关键是有没有伤害别人。', 'casual', 'neutral'],
    ],
  }),
  fan_private_sighting: defineScenePool({
    directSuccess: ['偶遇者主动模糊了地点和同行人，分享边界做得很好。', 'casual', 'supportive'],
    directBackfire: ['偷拍视频还带实时定位，已经严重越过私人边界。', 'former_fan', 'hostile'],
    directShared: ['私人行程不要追问地点，也不要根据背景继续扒。', 'fan', 'procedural'],
    success: [
      ['只描述礼貌互动、不放正脸照片，这种偶遇分享可以。', 'fan', 'supportive'],
      ['路人正常遇到就正常离开，双方都很体面。', 'casual', 'supportive'],
      ['相关超话已提醒删除定位信息。', 'data_fan', 'procedural'],
    ],
    backfire: [
      ['一路跟到住处还说是偶遇，没人会相信。', 'casual', 'hostile'],
      ['以前追过线下，更知道这种行为有多让人不安。', 'former_fan', 'skeptical'],
      ['拿侵犯隐私换热度，哪家粉丝都不该洗。', 'anti', 'hostile'],
    ],
    shared: [
      ['不转实时位置，不询问酒店和住址。', 'fan', 'procedural'],
      ['已经保存举报编号，原帖不要再二次传播。', 'data_fan', 'procedural'],
      ['明星也有不工作的时间，保持距离。', 'casual', 'neutral'],
    ],
  }),
  burner_rival_smear: defineScenePool({
    directSuccess: ['这条对家的负面说法已经有人跟进核实，舆论确实起来了。', 'fan', 'supportive'],
    directBackfire: ['拿{rival}当匿名黑稿目标却没有证据，抹黑痕迹太明显。', 'rival_fan', 'hostile'],
    directShared: ['匿名爆料先看证据，别因为提到对家就直接相信。', 'casual', 'neutral'],
    success: [
      ['时间线能对上，相关公开记录也已经整理出来。', 'data_fan', 'procedural'],
      ['自家不要下场转发，让事实自己发酵。', 'fan', 'procedural'],
      ['如果材料是真的，就等当事团队正式回应。', 'former_fan', 'neutral'],
    ],
    backfire: [
      ['连{rival}的项目名称都写错了，这种造谣也有人信？', 'rival_fan', 'hostile'],
      ['别拿粉圈矛盾包装成业内爆料，平台该处理了。', 'casual', 'hostile'],
      ['这种黑稿只会给自家招反噬，赶紧停止扩散。', 'former_fan', 'skeptical'],
    ],
    shared: [
      ['没有来源的聊天记录不能当实锤。', 'data_fan', 'procedural'],
      ['别带自家大名讨论，避免关联到艺人本人。', 'fan', 'procedural'],
      ['涉及{rival}的说法先给证据，匿名号没有天然可信度。', 'rival_fan', 'neutral'],
    ],
  }),
  burner_reverse_attack: defineScenePool({
    directSuccess: ['这条反串黑激起了保护情绪，粉丝已经开始集中澄清。', 'fan', 'supportive'],
    directBackfire: ['连{rival}粉丝都看出这是反串，账号历史已经藏不住了。', 'rival_fan', 'skeptical'],
    directShared: ['过激批评不等于真实路人意见，先看账号长期记录。', 'data_fan', 'procedural'],
    success: [
      ['核心粉已经整理事实，不要直接和这个账号对骂。', 'fan', 'procedural'],
      ['澄清帖数据起来了，先把正确信息顶上去。', 'data_fan', 'supportive'],
      ['路人看了前因后果，原帖确实夸张。', 'casual', 'neutral'],
    ],
    backfire: [
      ['拿自家艺人的痛点反串，最后伤到的还是自家。', 'former_fan', 'hostile'],
      ['别再把这口锅推给{rival}，账号切换记录写得很清楚。', 'rival_fan', 'hostile'],
      ['粉丝被当工具利用，知道真相后只会更失望。', 'casual', 'hostile'],
    ],
    shared: [
      ['不扩散原帖里的侮辱词，澄清时只放必要截图。', 'fan', 'procedural'],
      ['账号关系仍待确认，别提前认领或甩锅。', 'data_fan', 'procedural'],
      ['{rival}这边不会接这场反串戏，先把事实查清。', 'rival_fan', 'neutral'],
    ],
  }),
  burner_artist_impersonation: [
    toEntry(
      ['这条像本人语气的动态暂时没有引起身份怀疑。', 'fan', 'supportive'],
      SUCCESS,
      'direct',
    ),
    toEntry(
      ['用小号模仿本人发言的痕迹太重，已经有人开始扒账号。', 'casual', 'skeptical'],
      BACKFIRE,
      'direct',
    ),
    toEntry(
      ['账号关联已经被扒实锤，团队必须正面解释小号用途。', 'former_fan', 'hostile'],
      ['leaked'],
      'direct',
    ),
    toEntry(
      ['内容本身没有越界，先当普通网友表达看待。', 'casual', 'neutral'],
      SUCCESS,
      'secondary',
    ),
    toEntry(
      ['粉丝不要主动认领，避免把匿名号和本人绑定。', 'fan', 'procedural'],
      SUCCESS,
      'secondary',
    ),
    toEntry(
      ['目前没有可验证关联，反黑组不做扩散。', 'data_fan', 'procedural'],
      SUCCESS,
      'secondary',
    ),
    toEntry(
      ['用词习惯和发布时间都对上了，团队需要尽快说明。', 'former_fan', 'skeptical'],
      BACKFIRE,
      'secondary',
    ),
    toEntry(
      ['一边装粉丝一边替本人表态，这种操控感很不舒服。', 'casual', 'hostile'],
      BACKFIRE,
      'secondary',
    ),
    toEntry(
      ['小号旧帖已经被翻完，越删越像默认。', 'anti', 'hostile'],
      BACKFIRE,
      'secondary',
    ),
    toEntry(
      ['IP、上线时间和互动记录都对上了，这不是巧合。', 'casual', 'hostile'],
      ['leaked'],
      'secondary',
    ),
    toEntry(
      ['原来一直是经纪人在小号带节奏，之前的帖都得重新看。', 'former_fan', 'hostile'],
      ['leaked'],
      'secondary',
    ),
    toEntry(
      ['关联证据已经存档，删号也改变不了公开记录。', 'data_fan', 'procedural'],
      ['leaked'],
      'secondary',
    ),
    toEntry(
      ['不要继续扒手机号和私人社交账号。', 'fan', 'procedural'],
      ALL_OUTCOMES,
      'secondary',
    ),
    toEntry(
      ['只核验公开内容，不传播个人隐私。', 'data_fan', 'procedural'],
      ALL_OUTCOMES,
      'secondary',
    ),
    toEntry(
      ['账号关联进入公开讨论后，更要区分证据和隐私。', 'casual', 'neutral'],
      ALL_OUTCOMES,
      'secondary',
    ),
  ],
};
