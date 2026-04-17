import type { GameEvent } from '@/types/game';

export const phoneCallEvents: GameEvent[] = [
  // 1. 品牌方紧急来电
  {
    id: 'call_brand_urgent',
    category: 'business',
    severity: 'high',
    title: '品牌方紧急来电',
    description: '代言品牌的公关部发现你的艺人最近有争议，要求24小时内给出回应方案，否则考虑终止合同。',
    emoji: '📱',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '品牌方张总',
      callerAvatar: '📱',
      ringDescription: '品牌方紧急来电',
      hangUpOutcome: {
        narration: '你没有接品牌方的电话。张总非常不满，认为你们态度敷衍，决定暂停所有合作项目。',
        statChanges: { commercialValue: -8, money: -30000 },
      },
    },
    minDay: 3,
    statConditions: { minPrRisk: 40 },
    choices: [
      {
        id: 'brand_apologize',
        text: '诚恳道歉并承诺整改',
        subtext: '姿态放低，保住合作',
        outcome: {
          narration: '你诚恳地向张总道歉，承诺立刻处理争议。张总被你的态度打动，同意再观察一段时间。',
          statChanges: { prRisk: -5, commercialValue: 3, money: -10000 },
        },
      },
      {
        id: 'brand_negotiate',
        text: '据理力争，争取谈判空间',
        subtext: '有理有据，但可能激怒对方',
        outcome: {
          narration: '你摆出数据和舆论分析，说明争议可控。',
          statChanges: { commercialValue: 5, prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 60 },
              narration: '张总被你的专业分析说服了，不仅保留合作，还表示会考虑追加投放预算。',
              statChanges: { commercialValue: 8, money: 20000 },
            },
          ],
          twist: {
            chance: 0.25,
            narration: '但是！张总挂了电话后转头就联系了竞品艺人，你的态度让他觉得不够重视这次合作。',
            statChanges: { commercialValue: -10, money: -25000 },
          },
        },
      },
    ],
  },

  // 2. 记者来电
  {
    id: 'call_reporter_expose',
    category: 'crisis',
    severity: 'high',
    title: '记者掌握独家料',
    description: '某知名娱乐记者声称掌握了你艺人的独家猛料，给你一个提前回应的机会。如果你不理会，他明天就发。',
    emoji: '📰',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '记者王某',
      callerAvatar: '📰',
      ringDescription: '娱乐记者来电',
      hangUpOutcome: {
        narration: '你挂断了记者的电话。第二天，一篇措辞激烈的独家报道登上了各大平台头条，毫无还手之力。',
        statChanges: { prRisk: 15, fanLoyalty: -5 },
      },
    },
    minDay: 5,
    choices: [
      {
        id: 'reporter_buy',
        text: '花钱摆平，请求撤稿',
        subtext: '费用不低，但立竿见影',
        requireMinMoney: 50000,
        outcome: {
          narration: '你暗示可以"合作"，记者心领神会，这篇稿子最终没有发出来。代价是一笔不小的"车马费"。',
          statChanges: { money: -50000, prRisk: -3 },
        },
      },
      {
        id: 'reporter_preempt',
        text: '抢先发声明控制叙事',
        subtext: '主动出击，但内容要把控好',
        outcome: {
          narration: '你连夜准备声明稿，赶在记者发稿前主动回应。舆论被你引导了方向。',
          statChanges: { prRisk: 5, fanLoyalty: 3 },
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 30 },
              narration: '由于你平时风险控制得当，声明发出后粉丝和路人都站在你这边，记者反而被骂蹭热度。',
              statChanges: { prRisk: -3, fanLoyalty: 5 },
            },
          ],
        },
      },
      {
        id: 'reporter_cooperate',
        text: '配合采访，争取正面报道',
        subtext: '高风险高回报',
        outcome: {
          narration: '你安排了一次深度采访，让艺人展现真实的一面。',
          statChanges: { fanLoyalty: 5, prRisk: 3 },
          twist: {
            chance: 0.3,
            narration: '但是！记者在采访中套出了更多敏感信息，最终写成了一篇混合正负评价的深度稿，引发更大讨论。',
            statChanges: { prRisk: 10, fanLoyalty: -3 },
          },
        },
      },
    ],
  },

  // 3. 对家经纪人来电
  {
    id: 'call_rival_collab',
    category: 'drama',
    severity: 'medium',
    title: '对家提议合作',
    description: '竞争对手的经纪人主动来电，提议双方联合做一个项目，化解最近的竞争关系。但你不确定这是真心还是设局。',
    emoji: '🤝',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '对家经纪人',
      callerAvatar: '🤝',
      ringDescription: '对家经纪人来电',
      hangUpOutcome: {
        narration: '你直接挂断了对家的电话。对方感到被羞辱，放话说会让你好看。',
        statChanges: { prRisk: 5 },
      },
    },
    minDay: 6,
    choices: [
      {
        id: 'rival_accept',
        text: '接受合作提议',
        subtext: '化敌为友，但要小心被算计',
        outcome: {
          narration: '你同意了合作方案，双方联合策划了一个话题互动活动。效果出乎意料地好，双方粉丝都挺满意。',
          statChanges: { fanLoyalty: 5, commercialValue: 5, prRisk: -3 },
          twist: {
            chance: 0.2,
            narration: '但是！对方在合作中偷偷安排了对你艺人不利的环节，最终你的艺人在镜头前出了丑。',
            statChanges: { prRisk: 8, fanLoyalty: -5 },
          },
        },
      },
      {
        id: 'rival_counter',
        text: '反将一军：接受，但暗中准备',
        subtext: '高风险操作',
        outcome: {
          narration: '你假装答应合作，但暗中做好了应对方案。当对方试图使绊时，你早有准备。',
          statChanges: { commercialValue: 3, prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 50 },
              narration: '凭借你的商业嗅觉，你不仅识破了对方的小动作，还趁机拿到了一个原本属于对家的代言资源。漂亮！',
              statChanges: { commercialValue: 8, money: 30000, prRisk: -2 },
            },
          ],
        },
      },
      {
        id: 'rival_decline_polite',
        text: '婉拒，保持距离',
        subtext: '安全牌',
        outcome: {
          narration: '你客气地表示目前行程太满，无法配合。对方虽然遗憾但表示理解。',
          statChanges: { prRisk: -2 },
        },
      },
    ],
  },

  // 4. 粉丝会会长来电
  {
    id: 'call_fan_leader',
    category: 'pr',
    severity: 'medium',
    title: '粉丝组织内部矛盾',
    description: '粉丝后援会会长打来紧急电话：会内两派因为应援方式产生严重分歧，已经吵到要分裂了，请你出面协调。',
    emoji: '📣',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '粉丝会会长',
      callerAvatar: '📣',
      ringDescription: '粉丝会会长来电',
      hangUpOutcome: {
        narration: '你没接粉丝会的电话。会长很失望，两派矛盾进一步升级，最终后援会分裂成两个互相攻击的小团体。',
        statChanges: { fanLoyalty: -10, prRisk: 5 },
      },
    },
    minDay: 4,
    statConditions: { minFanLoyalty: 30 },
    choices: [
      {
        id: 'fan_mediate',
        text: '亲自出面调解',
        subtext: '展现诚意，但耗时耗力',
        outcome: {
          narration: '你花了整整一个下午跟两边代表视频通话，耐心听取双方诉求并给出折中方案。粉丝们很感动。',
          statChanges: { fanLoyalty: 8, prRisk: -3 },
        },
      },
      {
        id: 'fan_let_artist',
        text: '让艺人发一条安抚微博',
        subtext: '用偶像的影响力',
        outcome: {
          narration: '艺人发了一条感性的微博，感谢所有粉丝的支持，希望大家团结。评论区瞬间被"好的哥哥/姐姐"刷屏。',
          statChanges: { fanLoyalty: 5, prRisk: -2 },
          twist: {
            chance: 0.2,
            narration: '但是！有人截图发现这条微博是工作人员代发的（因为有错别字），引发"不诚心"的质疑。',
            statChanges: { fanLoyalty: -5, prRisk: 5 },
          },
        },
      },
    ],
  },

  // 5. 投资人来电
  {
    id: 'call_investor',
    category: 'business',
    severity: 'medium',
    title: '投资人考虑注资',
    description: '一个投资人对你的经纪公司感兴趣，想注入一笔资金，但他提出了一些让你犹豫的条件。',
    emoji: '💰',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '投资人李总',
      callerAvatar: '💰',
      ringDescription: '投资人来电',
      hangUpOutcome: {
        narration: '你没有接投资人的电话。错过了这次融资机会，公司资金链继续紧张。',
        statChanges: { money: -10000 },
      },
    },
    minDay: 4,
    statConditions: { maxMoney: 100000 },
    choices: [
      {
        id: 'investor_accept',
        text: '接受注资和条件',
        subtext: '资金充裕，但要让渡部分决策权',
        outcome: {
          narration: '你接受了李总的条件，一大笔资金到账。但从今以后，一些商业决策需要和投资方沟通。',
          statChanges: { money: 80000, commercialValue: -3 },
        },
      },
      {
        id: 'investor_negotiate',
        text: '讨价还价，争取更好条件',
        subtext: '可能谈崩',
        outcome: {
          narration: '你提出了自己的条件，双方反复拉锯。',
          statChanges: { money: 50000 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 55 },
              narration: '你展示了艺人的商业数据和发展潜力，成功说服李总接受更优惠的条件。资金到位，决策权完整保留。',
              statChanges: { money: 80000, commercialValue: 3 },
            },
          ],
          twist: {
            chance: 0.25,
            narration: '但是！李总觉得你太难缠，最终撤回了投资意向。不仅钱没拿到，还浪费了大量时间。',
            statChanges: { money: -5000 },
          },
        },
      },
      {
        id: 'investor_decline',
        text: '婉拒，靠自己',
        subtext: '保持独立',
        outcome: {
          narration: '你感谢了李总的好意，但表示目前不需要外部资金。虽然手头紧，但至少一切由你做主。',
          statChanges: {},
        },
      },
    ],
  },

  // 6. 艺人深夜来电
  {
    id: 'call_artist_cry',
    category: 'crisis',
    severity: 'high',
    title: '艺人深夜来电',
    description: '深夜两点，艺人突然打来电话，语气崩溃。最近的负面舆论让TA精神压力巨大，你需要立刻安抚。',
    emoji: '😭',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '艺人本人',
      callerAvatar: '😭',
      ringDescription: '艺人深夜来电',
      hangUpOutcome: {
        narration: '你没有接艺人的电话。第二天TA在社交媒体发了一条阴阳怪气的动态，粉丝纷纷猜测发生了什么。',
        statChanges: { fanLoyalty: -5, prRisk: 8 },
      },
    },
    minDay: 4,
    statConditions: { minPrRisk: 50 },
    choices: [
      {
        id: 'artist_comfort',
        text: '耐心安抚，陪聊到天亮',
        subtext: '做一个有温度的经纪人',
        outcome: {
          narration: '你放下手头所有事情，整整陪TA聊了三个小时。你的耐心和理解让艺人重新振作，第二天状态明显好转。',
          statChanges: { fanLoyalty: 3, prRisk: -5 },
        },
      },
      {
        id: 'artist_plan',
        text: '理性分析局势，制定应对方案',
        subtext: '用专业能力让TA安心',
        outcome: {
          narration: '你冷静地分析了当前局势，告诉TA一切在掌控之中，并展示了你准备好的公关方案。',
          statChanges: { prRisk: -8, commercialValue: 3 },
          conditionalOutcomes: [
            {
              condition: { maxFanLoyalty: 30 },
              narration: '但你过于理性的态度让已经很脆弱的TA感到你不够在乎。"你只关心数据，不关心我"——TA挂了电话。',
              statChanges: { fanLoyalty: -5, prRisk: 3 },
            },
          ],
        },
      },
      {
        id: 'artist_vacation',
        text: '建议暂时休息几天',
        subtext: '身心健康最重要',
        outcome: {
          narration: '你建议TA暂时放下工作，去没人认识的地方休息几天。TA如释重负地答应了。',
          statChanges: { prRisk: -5, fanLoyalty: 5, commercialValue: -5 },
        },
      },
    ],
  },

  // 7. 综艺导演来电
  {
    id: 'call_tv_director',
    category: 'business',
    severity: 'medium',
    title: '热门综艺邀约',
    description: '当红综艺节目组临时有嘉宾退出，导演直接给你打电话，问你的艺人能不能明天就来。机会难得但太仓促。',
    emoji: '🎬',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '综艺导演',
      callerAvatar: '🎬',
      ringDescription: '综艺节目组来电',
      hangUpOutcome: {
        narration: '你没接导演的电话，机会转瞬即逝。导演转头联系了竞争对手的艺人。',
        statChanges: { commercialValue: -3 },
      },
    },
    minDay: 5,
    statConditions: { minCommercial: 40 },
    choices: [
      {
        id: 'tv_accept',
        text: '立刻答应，连夜准备',
        subtext: '拼一把',
        outcome: {
          narration: '你当机立断接下了邀约，连夜帮艺人准备话题和互动方案。录制当天，艺人表现亮眼。',
          statChanges: { commercialValue: 8, fanLoyalty: 5, money: 20000 },
          twist: {
            chance: 0.2,
            narration: '但是！由于准备太仓促，艺人在节目中说错了一句话，被截图传播，小范围引发争议。',
            statChanges: { prRisk: 8, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'tv_negotiate_fee',
        text: '答应，但趁机提高出场费',
        subtext: '对方急需人，正好提价',
        outcome: {
          narration: '你抓住对方着急的心理，成功谈到了比正常高出50%的出场费。商务能力满分。',
          statChanges: { money: 40000, commercialValue: 5, fanLoyalty: 3 },
          twist: {
            chance: 0.15,
            narration: '但是！高出场费的事被同行扒了出来，被说"坐地起价没有格局"，引起了一些负面评价。',
            statChanges: { prRisk: 5, commercialValue: -3 },
          },
        },
      },
      {
        id: 'tv_decline',
        text: '婉拒，太仓促了',
        subtext: '稳妥但可惜',
        outcome: {
          narration: '你觉得准备时间太短，怕翻车，委婉拒绝了。导演表示遗憾但理解，说下次一定优先考虑。',
          statChanges: { prRisk: -2 },
        },
      },
    ],
  },

  // 8. 律师来电
  {
    id: 'call_lawyer_warning',
    category: 'crisis',
    severity: 'high',
    title: '律师紧急警告',
    description: '你的法律顾问突然来电：有人准备向法院递交针对你艺人的起诉书，可能涉及名誉侵权或合同纠纷。',
    emoji: '⚖️',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '律师陈大状',
      callerAvatar: '⚖️',
      ringDescription: '律师紧急来电',
      hangUpOutcome: {
        narration: '你没接律师的电话。等你看到消息时，起诉书已经递交，对方还联系了媒体曝光此事。',
        statChanges: { prRisk: 12, money: -30000 },
      },
    },
    minDay: 8,
    choices: [
      {
        id: 'lawyer_settle',
        text: '庭外和解，花钱消灾',
        subtext: '快速解决，但费用不低',
        requireMinMoney: 40000,
        outcome: {
          narration: '在律师的协调下，双方达成庭外和解协议。虽然花了不少钱，但避免了一场旷日持久的官司。',
          statChanges: { money: -40000, prRisk: -5 },
        },
      },
      {
        id: 'lawyer_fight',
        text: '应诉到底',
        subtext: '旷日持久，但如果赢了可以扭转局面',
        outcome: {
          narration: '你决定正面应诉，律师开始准备应诉材料。这将是一场持久战。',
          statChanges: { money: -15000, prRisk: 5 },
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 40 },
              narration: '由于你平时风险管理做得好，律师团队很快找到了有利证据。初步判断胜算很大，舆论也开始同情你们。',
              statChanges: { prRisk: -5, fanLoyalty: 5, money: -15000 },
            },
          ],
          twist: {
            chance: 0.2,
            narration: '但是！对方在庭审中突然提交了新证据，让案情变得更加复杂。看来这场官司要打很久了。',
            statChanges: { prRisk: 8, money: -20000 },
            unlockTag: 'ongoing_lawsuit',
          },
        },
      },
      {
        id: 'lawyer_pr',
        text: '打官司的同时打舆论战',
        subtext: '双线作战',
        outcome: {
          narration: '你一边让律师准备应诉，一边让公关团队引导舆论。双管齐下，声势很足。',
          statChanges: { fanLoyalty: 3, prRisk: 3, money: -25000 },
          twist: {
            chance: 0.25,
            narration: '但是！舆论战打得太激烈，被对方律师以"舆论施压影响司法公正"为由提出追加诉讼。',
            statChanges: { prRisk: 10, money: -15000 },
          },
        },
      },
    ],
  },
];
