// 因果回调事件 ， 早期选择在后期发酵。
//
// 玩法诉求：让第 3 天随手做的“小决定”在第 12 天给你一个意外的 payback（好或坏），
// 玩家会突然想起“啊当初那个选择！”， 这是提升 20 天玩法记忆点的关键。
//
// 设计约束：
// - 每个 callback 要求一个 unlockTag（代表之前做过的选择）
// - 有 minDay / maxDay 限定触发窗口（避免当天就回放）
// - 由 pickConsequenceCallback 按“已触发窗 + 不重复”原则挑一个，
//   并让 endDay 注入到次日消息里
// - 单局最多触发 3 次（firedCallbackIds 保底）
//
// 这里的“事件”本身就是完整 GameEvent；它进入消息系统后和普通事件行为一致。

import type { GameEvent, ArtistArchetype } from '@/types/game';

/**
 * 单局最多注入的 callback 数量。超过后 endDay 不会再选中任何 callback。
 */
export const MAX_CALLBACKS_PER_RUN = 3;

interface CallbackDef {
  /** 触发需要的 tag（过去某个选择设置过） */
  requiredTag: string;
  /** 最早可以回放的天数（给玩家一点时间遗忘） */
  minDayAfter: number;
  /** 可选：艺人限定 */
  forArtist?: ArtistArchetype | ArtistArchetype[];
  /** 真正的回放事件 */
  event: Omit<GameEvent, 'requiredTags' | 'minDay'>;
}

const CALLBACKS: CallbackDef[] = [
  // ========== 狗仔付钱 → 狗仔回头要更多 ==========
  {
    requiredTag: 'paid_paparazzi',
    minDayAfter: 7,
    event: {
      id: 'callback_paparazzi_return',
      category: 'crisis',
      severity: 'high',
      title: '那个狗仔又来了',
      description: '两周前收了你封口费的那个狗仔，现在又拍到了新的“料”。他给你发消息：“老规矩？”，他显然觉得你是个冤大头了。',
      emoji: '📸',
      choices: [
        {
          id: 'pay_again',
          text: '再付一次（¥80000）',
          subtext: '宁愿破财免灾',
          outcome: {
            narration: '你又付了一次。他这次爽快地删了图，但你知道，这不会是最后一次。你被盯上了。',
            statChanges: { money: -80000, prRisk: 2 },
            unlockTag: 'ransom_repeat',
          },
        },
        {
          id: 'call_bluff',
          text: '不付了，就让他发',
          subtext: '赌他手里没料',
          outcome: {
            narration: '你赌他虚张声势。结果第二天确实没什么新瓜，他只是想试探。你赢了这把，但代价是结了个梁子。',
            statChanges: { prRisk: 4, fanLoyalty: -1 },
            twist: {
              chance: 0.35,
              narration: '结果他真的发了，而且这次是一组车库接送的偷拍图。他早就留了底牌。',
              statChanges: { prRisk: 15, fanLoyalty: -6, commercialValue: -4 },
            },
          },
        },
        {
          id: 'legal_warn',
          text: '发律师函警告',
          subtext: '用法律手段吓退',
          outcome: {
            narration: '律师函发过去，他安分了几天。但“XX团队滥用律师函”的话题悄悄起来了。',
            statChanges: { prRisk: 3, money: -15000 },
          },
        },
      ],
    },
  },

  // ========== 大方认恋情 → 粉丝回归 ==========
  {
    requiredTag: 'romance_official',
    minDayAfter: 6,
    event: {
      id: 'callback_romance_stability',
      category: 'pr',
      severity: 'low',
      title: '粉丝投稿：我回来了',
      description: '超话置顶了一篇万字长文，一个脱粉回踩的老粉说：“公开恋情那天我取关了，但这两周看你们处得真的好，我又回来了。”转发量出人意料。',
      emoji: '💌',
      choices: [
        {
          id: 'reply_thanks',
          text: '艺人亲自回复这条',
          subtext: '公开道谢',
          outcome: {
            narration: '艺人转发了这篇文，配了一句“谢谢愿意再给我们一次机会”。粉丝群哭崩，回踩潮彻底停了。',
            statChanges: { fanLoyalty: 8, commercialValue: 3, prRisk: -3 },
          },
        },
        {
          id: 'let_organic',
          text: '不下场，让它自然发酵',
          subtext: '避免引战',
          outcome: {
            narration: '你选择不回应。文章自己发酵到了热搜尾巴，该来的粉丝回来了，该离开的也没再回头。',
            statChanges: { fanLoyalty: 4 },
          },
        },
      ],
    },
  },

  // ========== 否认恋情 → 越描越黑 ==========
  {
    requiredTag: 'denied_relationship',
    minDayAfter: 5,
    event: {
      id: 'callback_denied_then_pics',
      category: 'crisis',
      severity: 'high',
      title: '否认过后的第十天...',
      description: '你上次发了声明否认恋情，今天一个营销号放出了声明那天之后的新照片，同一栋楼、同样的外套、牵着的手。“还要否认吗？”， 所有人都在等你回答。',
      emoji: '💔',
      choices: [
        {
          id: 'admit_now',
          text: '承认并道歉',
          subtext: '“对不起之前撒了谎”',
          outcome: {
            narration: '你艺人发长文道歉，承认上次声明措辞不严谨。承认得利落，路人反而觉得“至少是条汉子/真性情”。粉丝心痛但接受。',
            statChanges: { prRisk: -5, fanLoyalty: -3, commercialValue: -2 },
            unlockTag: 'denied_then_exposed',
          },
        },
        {
          id: 'deny_again',
          text: '继续否认是 P 图',
          subtext: '再赌一把',
          outcome: {
            narration: '“工作室声明：图片系恶意 P 图，已交律师处理。”，然后营销号直接放出了原视频。你彻底下不来台了。',
            statChanges: { prRisk: 18, fanLoyalty: -10, commercialValue: -6 },
          },
        },
        {
          id: 'change_subject',
          text: '放大招转移话题',
          subtext: '抛出更大的瓜',
          outcome: {
            narration: '你紧急放出了一个早就准备好的 vlog。话题是转移了一半，但懂的都懂，“这操作看多了。”',
            statChanges: { prRisk: 5, commercialValue: 1 },
          },
        },
      ],
    },
  },

  // ========== 税务坦白 → 后期获得“靠谱人设”加成 ==========
  {
    requiredTag: 'self_reported_tax',
    minDayAfter: 8,
    event: {
      id: 'callback_tax_reward',
      category: 'business',
      severity: 'medium',
      title: '官媒内参报道',
      description: '央视《新闻直播间》的一个短片里出现了你艺人的名字，“主动申报补税、配合税务检查”被当作正面案例一笔带过，只露了 3 秒。但这 3 秒在圈内炸开了。',
      emoji: '📰',
      choices: [
        {
          id: 'lean_in',
          text: '接合规公益代言',
          subtext: '把正面人设吃透',
          outcome: {
            narration: '民政部下属一个基金会找上门，邀请做“青年合规大使”，免费的，但身份很硬。代言圈里的人都知道这个分量。',
            statChanges: { commercialValue: 10, prRisk: -4 },
          },
        },
        {
          id: 'stay_humble',
          text: '不做公开表态',
          subtext: '低调走就好',
          outcome: {
            narration: '你让公关保持沉默，让这 3 秒自己发酵。结果更好，“不炫耀”反而成了新的加分项。',
            statChanges: { fanLoyalty: 5, commercialValue: 4 },
          },
        },
      ],
    },
  },

  // ========== 玩梗下场 → 综艺节目组找上门 ==========
  {
    requiredTag: 'embraced_meme',
    minDayAfter: 5,
    event: {
      id: 'callback_meme_variety_offer',
      category: 'business',
      severity: 'low',
      title: '综艺节目组钦点',
      description: '上次那个表情包的热度还没过，一档新综艺的主导演直接打电话到公司：“想要 TA 当常驻，就冲那个表情。”',
      emoji: '📺',
      choices: [
        {
          id: 'accept_variety',
          text: '接下这档综艺',
          subtext: '趁热打铁',
          outcome: {
            narration: '签了常驻，录制期间 TA 彻底放飞，表情包第二弹、第三弹接连上热搜。综艺后期路人盘爆开。',
            statChanges: { money: 150000, commercialValue: 8, fanLoyalty: 3, prRisk: 3 },
          },
        },
        {
          id: 'decline_variety',
          text: '婉拒，怕消耗人设',
          subtext: '留一点神秘感',
          outcome: {
            narration: '你拒绝了。节目组很诚恳地说“希望下次有机会”。公司里有人可惜，但 TA 的“稀缺感”还在。',
            statChanges: { commercialValue: 3, fanLoyalty: 2 },
          },
        },
      ],
    },
  },

  // ========== 大粉签了保密协议 → 大粉反水 ==========
  {
    requiredTag: 'fansite_mafia',
    minDayAfter: 6,
    event: {
      id: 'callback_fansite_mutiny',
      category: 'crisis',
      severity: 'high',
      title: '当初那个签了保密协议的大粉炸了',
      description: '你用钱压下去的那个大粉，今天突然小号出警，放出了当时签约的合同截图，“我知道这违约。但我觉得粉丝应该知道，你们追的哥哥/姐姐是怎么运作的。”',
      emoji: '⚖️',
      choices: [
        {
          id: 'sue_hard',
          text: '正式起诉违约',
          subtext: '按合同索赔',
          outcome: {
            narration: '法院受理了。她很快认怂撤帖并公开道歉，但“XX 团队压制粉丝言论”的印象留下了。',
            statChanges: { money: -30000, prRisk: 8, fanLoyalty: -5 },
            unlockTag: 'studio_lawsuit',
          },
        },
        {
          id: 'reach_out',
          text: '私下沟通赔钱',
          subtext: '让她删号消失',
          outcome: {
            narration: '她收了一笔钱删了号，事情被压下去了。但圈内的其他大粉都看在眼里，你的“好说话”名声在下降。',
            statChanges: { money: -50000, prRisk: 3, fanLoyalty: -2 },
          },
        },
        {
          id: 'let_it_burn',
          text: '什么都不做',
          subtext: '赌粉丝会帮你',
          outcome: {
            narration: '正经粉丝开始反手挂她“心疼哥哥被这种人算计”。三天后话题散了，但圈里都知道你“不拉回”大粉了。',
            statChanges: { fanLoyalty: 2, prRisk: 5 },
          },
        },
      ],
    },
  },

  // ========== 拒绝品牌 → 品牌主动回头 ==========
  {
    requiredTag: 'pr_offended_brands',
    minDayAfter: 7,
    event: {
      id: 'callback_brand_comeback',
      category: 'business',
      severity: 'medium',
      title: '那个被拒的品牌又回来了',
      description: '之前你嫌代言费低拒掉的那个品牌，今天品牌总监亲自约饭，“之前是我们考虑不周，这次把全年预算翻倍，诚意加码。”',
      emoji: '🤝',
      choices: [
        {
          id: 'accept_better',
          text: '接下，按新价签',
          subtext: '不计前嫌',
          outcome: {
            narration: '签约金额翻了三倍。品牌方后来私下说“TA 那次拒绝反而让我们内部重新评估了预算”。',
            statChanges: { money: 250000, commercialValue: 6 },
          },
        },
        {
          id: 'still_pass',
          text: '还是不接',
          subtext: '端住了',
          outcome: {
            narration: '你再次拒绝。消息很快传开，“这咖位真的端得住”。顶流感营造成功。',
            statChanges: { commercialValue: 8, fanLoyalty: 3 },
          },
        },
        {
          id: 'negotiate_hard',
          text: '加条件：全品类独家',
          subtext: '再狠一点',
          outcome: {
            narration: '对方同意全品类独家且五年合约。你艺人的代言版图里多了一个国际品牌。',
            statChanges: { money: 400000, commercialValue: 10, prRisk: 2 },
          },
        },
      ],
    },
  },

  // ========== 医美被发现 → 舆论二轮发酵 ==========
  {
    requiredTag: 'cosmetic_admitted',
    minDayAfter: 6,
    event: {
      id: 'callback_cosmetic_rebound',
      category: 'pr',
      severity: 'medium',
      title: '医美承认后的二轮发酵',
      description: '你艺人之前大方承认了做过一些微调。这两天一个医疗美容类自媒体发了“大家支持 XX 是因为 TA 愿意讲真话”的长文，路人风向开始转向：“整了怕什么，敢承认就是好样的。”',
      emoji: '💉',
      choices: [
        {
          id: 'ride_wave',
          text: '接医美品牌代言',
          subtext: '顺势变现',
          outcome: {
            narration: '一个主打透明成分的医美品牌主动找来。签约当天品牌股价涨了 3%。',
            statChanges: { money: 180000, commercialValue: 6, prRisk: 2 },
            unlockTag: 'cosmetic_endorsed',
          },
        },
        {
          id: 'keep_private',
          text: '回应“这是私事”',
          subtext: '不蹭热度',
          outcome: {
            narration: 'TA 转发了那篇文，只配了一句“以后就不说了，谢谢理解”。好感度又涨了一波。',
            statChanges: { fanLoyalty: 4, commercialValue: 2 },
          },
        },
      ],
    },
  },
];

/**
 * 从所有 callbacks 里挑一个 ， 按条件:
 *  - requiredTag 必须在 activeTags 里
 *  - 未在 firedIds 里（单局不重复）
 *  - day >= minDayAfter（给玩家时间）
 *  - 艺人匹配（如果有限定）
 *  - 全局上限未达（MAX_CALLBACKS_PER_RUN）
 *
 * 触发概率：满足条件的每天给一个 ~35% 概率注入；避免每次 end day 都必塞。
 */
export function pickConsequenceCallback(ctx: {
  day: number;
  activeTags: string[];
  firedIds: string[];
  artistId: ArtistArchetype;
}): GameEvent | null {
  if (ctx.firedIds.length >= MAX_CALLBACKS_PER_RUN) return null;

  const eligible = CALLBACKS.filter(cb => {
    if (!ctx.activeTags.includes(cb.requiredTag)) return false;
    if (ctx.firedIds.includes(cb.event.id)) return false;
    if (ctx.day < cb.minDayAfter) return false;
    if (cb.forArtist) {
      const allowed = Array.isArray(cb.forArtist) ? cb.forArtist : [cb.forArtist];
      if (!allowed.includes(ctx.artistId)) return false;
    }
    return true;
  });

  if (eligible.length === 0) return null;
  if (Math.random() > 0.35) return null;

  const pick = eligible[Math.floor(Math.random() * eligible.length)];
  return pick.event as GameEvent;
}

/** 暴露 callback 的所有 event 对象，让 eventSelector.findEventById 能找到它们（事件链）。
 *  注意：这里给每个 event 注入 requiredTags/minDay，让正常 selector 也尊重门槛 ，
 *  callback 优先由 pickConsequenceCallback 主动注入；万一漏过去走了普通 weighted 选择，
 *  起码不会在 tag 没满足时出现。
 */
export const consequenceCallbackEvents: GameEvent[] = CALLBACKS.map(c => ({
  ...(c.event as GameEvent),
  requiredTags: [c.requiredTag],
  minDay: c.minDayAfter,
}));
