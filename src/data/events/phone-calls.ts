import type { GameEvent } from '@/types/game';

export const phoneCallEvents: GameEvent[] = [
  // 1. 品牌方紧急来电
  {
    id: 'call_brand_urgent',
    category: 'business',
    severity: 'high',
    title: '品牌方紧急来电',
    description: '手机屏幕亮了——张总。你心里一沉。上次他主动打电话还是签约那天。"24小时，给我一个交代，不然合同的事我们重新考虑。"话筒那边的语气冷得像合同里的违约条款。',
    emoji: '📱',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '品牌方张总',
      callerAvatar: '📱',
      ringDescription: '品牌方紧急来电',
      hangUpOutcome: {
        narration: '张总的电话响了四声，然后转入语音信箱。五分钟后你收到一条微信："不接电话是吧？合作的事不用谈了。"第二天，品牌官微悄悄删除了所有跟你艺人相关的物料。',
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
          narration: '"张总，这件事确实是我们的疏忽。"你放低姿态，把准备好的整改方案一条一条念给他听。电话那头沉默了十秒——你能听到他在转笔。"行吧，再看看。但下不为例。"挂了电话你才发现手心全是汗。',
          statChanges: { prRisk: -5, commercialValue: 3, money: -10000 },
        },
      },
      {
        id: 'brand_negotiate',
        text: '据理力争，争取谈判空间',
        subtext: '有理有据，但可能激怒对方',
        outcome: {
          narration: '"张总，我给您看一组数据。"你打开那份熬了一夜做的舆情报告，语速不快不慢。对面的转笔声停了——他在听。',
          statChanges: { commercialValue: 5, prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 60 },
              narration: '"你这个经纪人有点东西。"张总笑了。你知道稳了——他只有心情好的时候才笑。第二天，追加投放的合同已经发到你邮箱了。',
              statChanges: { commercialValue: 8, money: 20000 },
            },
          ],
          twist: {
            chance: 0.25,
            narration: '但是！你后来才知道——张总挂你电话的下一秒就拨给了竞品艺人的经纪人。据理力争在他看来不是专业，是"不够重视"。品牌内部已经开始走解约流程了。',
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
    description: '一个陌生号码，你本想挂掉。但来电显示旁边的备注写着：「某某娱乐周刊·王某」。接起来对面语气很客气，但内容一点都不客气——"我手里有一些东西，想给你个提前回应的机会。如果明天中午前没收到回复...你懂的。"',
    emoji: '📰',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '记者王某',
      callerAvatar: '📰',
      ringDescription: '娱乐记者来电',
      hangUpOutcome: {
        narration: '你盯着那个号码，最终还是按了拒接。第二天早上七点，你是被助理的夺命连环call叫醒的——文章已经挂在了三个平台的头条，标题用的是红色加粗。评论区前排全是"实锤了"。',
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
          narration: '你约他在一家僻静的咖啡厅见了面。信封推过去的时候，你注意到他连眼皮都没抬一下——显然这不是他第一次收"车马费"。稿子最终没有发出来，但你知道这种人的胃口只会越来越大。',
          statChanges: { money: -50000, prRisk: -3 },
        },
      },
      {
        id: 'reporter_preempt',
        text: '抢先发声明控制叙事',
        subtext: '主动出击，但内容要把控好',
        outcome: {
          narration: '你把公关团队从被窝里捞起来，凌晨三点发出了声明。等记者第二天发稿时，评论区已经被你的声明链接刷满了——"人家昨晚就解释过了，你这稿子过时了。"',
          statChanges: { prRisk: 5, fanLoyalty: 3 },
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 30 },
              narration: '由于平时口碑积累得好，声明一出粉丝和路人齐刷刷站过来。记者反被骂"蹭热度""吃人血馒头"，灰溜溜删了预告。你在朋友圈发了个"😊"。',
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
          narration: '你安排了一次"坦诚相见"的深度采访。艺人聊了童年、聊了压力、聊了行业的不容易。录音笔转了两个小时，你觉得稳了。',
          statChanges: { fanLoyalty: 5, prRisk: 3 },
          twist: {
            chance: 0.3,
            narration: '但是！稿子出来后你傻了——标题是《独家：XX首次回应争议，采访中数度哽咽》。你说的那些推心置腹的话全成了"崩溃""失控"的注脚。断章取义的艺术，你算是领教了。',
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
    description: '来电显示是个你存过但从没拨过的号——对家的经纪人。"别挂，听我说完。"开场白就不一般。他提议联合做个项目，说"互相消耗对谁都没好处"。话是好话，但从对手嘴里说出来，你总觉得哪里不对。',
    emoji: '🤝',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '对家经纪人',
      callerAvatar: '🤝',
      ringDescription: '对家经纪人来电',
      hangUpOutcome: {
        narration: '你按下了拒接。三秒后收到一条短信："记住，是你先不给面子的。"你笑了一下——但笑完又有点后悔。',
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
          narration: '你决定赌一把。合作方案出乎意料地顺利——联合直播、话题互动、双方粉丝竟然从"对线"变成了"组CP"。热搜词条从#XX撕XX#变成了#世纪大和解#。',
          statChanges: { fanLoyalty: 5, commercialValue: 5, prRisk: -3 },
          twist: {
            chance: 0.2,
            narration: '但是！合作录制当天，你发现对方"不小心"安排了一个你艺人最不擅长的环节。镜头精准捕捉到了尴尬瞬间，当晚就成了鬼畜素材。你终于明白了——这个"橄榄枝"带刺。',
            statChanges: { prRisk: 8, fanLoyalty: -5 },
          },
        },
      },
      {
        id: 'rival_counter',
        text: '反将一军：接受，但暗中准备',
        subtext: '高风险操作',
        outcome: {
          narration: '"好啊，合作愉快。"你笑着答应，挂了电话后立刻拉了个群：公关、法务、造型、编导——"准备Plan B，这次我们反客为主。"',
          statChanges: { commercialValue: 3, prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 50 },
              narration: '对方果然埋了坑——但你的编导早就准备了反转环节。你的艺人不仅化解了尴尬，还顺势秀了一把实力。更妙的是，对家原本谈好的一个代言，因为这次"联合活动"的数据太好看，品牌方转投了你。对家经纪人的脸色，啧啧。',
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
    description: '后援会会长的电话——这人平时只发微信，打电话一定是出大事了。果然："哥/姐，会里要炸了。数据组说应援组浪费钱，应援组说数据组只会刷量。两边已经在超话里互撕了，再不管后援会就要分家了。"',
    emoji: '📣',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '粉丝后援会',
      callerAvatar: '📣',
      ringDescription: '粉丝后援会来电',
      hangUpOutcome: {
        narration: '会长的电话你没接。第二天超话里已经是两个阵营了——"XX全球数据站"和"XX应援后勤组"互相开麦对骂，路人看了一场免费大戏，#XX粉丝内讧#挂了一天热搜。',
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
          narration: '你开了三方视频会议，一边是数据组组长，另一边是应援组组长。你像个联合国调停官一样轮流倾听、逐条分析。三个小时后，两边都说了"好吧"——这两个字是你今天听到的最动听的词。',
          statChanges: { fanLoyalty: 8, prRisk: -3 },
        },
      },
      {
        id: 'fan_let_artist',
        text: '让艺人发一条安抚微博',
        subtext: '用偶像的影响力',
        outcome: {
          narration: '艺人发了一条微博："不管你们怎么吵，在我心里你们都是最重要的人。别内耗了好不好，我心疼。"评论区瞬间安静了，然后被"好的我们不吵了😭"刷屏。',
          statChanges: { fanLoyalty: 5, prRisk: -2 },
          twist: {
            chance: 0.2,
            narration: '但是！有粉丝发现微博里"的"和"地"用错了——艺人本人绝对不会犯这种错。"代发实锤"的截图传遍了所有群，本来消停的两派重新炸了："连道歉都不是亲自写的！"',
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
    description: '"你好，我是元亨资本的李总，我们一直在关注你们。"电话那头的声音沉稳而有底气——这种语气通常意味着他口袋里的钱比他的耐心多得多。他想投你的经纪公司，但条件...你听完之后眉头皱了起来。',
    emoji: '💰',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '投资人李总',
      callerAvatar: '💰',
      ringDescription: '投资人来电',
      hangUpOutcome: {
        narration: '李总的电话你没接。他也没再打第二次——有钱人的时间很贵，不会在一棵树上吊死。你刷朋友圈时看到他和另一家经纪公司的合影，配文是"期待合作"。',
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
          narration: '签字的时候你的手顿了一下——合同里有一条"重大商业决策需投资方书面同意"。你签了。钱到账的那一刻确实爽，但你知道从此以后不是一个人说了算了。',
          statChanges: { money: 80000, commercialValue: -3 },
        },
      },
      {
        id: 'investor_negotiate',
        text: '讨价还价，争取更好条件',
        subtext: '可能谈崩',
        outcome: {
          narration: '"李总，我们再聊聊这个条款。"你用一种不卑不亢的语气开始了拉锯战。谈判桌上没有朋友，只有条款和数字。',
          statChanges: { money: 50000 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 55 },
              narration: '你把艺人的商业数据表打开——ROI、粉丝购买力、品牌合作转化率——每一个数字都是筹码。李总看完沉默了五秒："行，按你说的来。"你赢了这场谈判。',
              statChanges: { money: 80000, commercialValue: 3 },
            },
          ],
          twist: {
            chance: 0.25,
            narration: '但是！李总觉得你"不够有诚意"，微笑着说了句"那就再看看吧"——你知道这是有钱人的礼貌拒绝。钱没拿到，反而搭进去好几天时间。',
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
    description: '凌晨两点十七分，手机屏幕亮了。来电显示是你艺人的名字。你接起来，那头很安静，过了好几秒才传来一句带哭腔的："你...还醒着吗？"TA的声音在发抖。最近铺天盖地的负面评论终于压垮了最后一根弦。',
    emoji: '😭',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '艺人本人',
      callerAvatar: '😭',
      ringDescription: '艺人深夜来电',
      hangUpOutcome: {
        narration: '你翻了个身，看了眼时间——两点多了，算了，明天再说吧。你按了拒接翻身继续睡。第二天TA的微博动态是一张全黑的图片，什么文字都没有。粉丝群里瞬间炸了：#XX怎么了#冲上了半夜热搜。',
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
          narration: '你披着外套坐在阳台上，听TA从小时候的事讲到出道那天的紧张，讲到第一次看见黑评时偷偷哭了。你什么都没说，就是"嗯""我在""没事的"。凌晨五点的时候TA终于笑了一声："谢谢你，我好多了。"你说："去睡吧。"然后你也哭了。',
          statChanges: { fanLoyalty: 3, prRisk: -5 },
        },
      },
      {
        id: 'artist_plan',
        text: '理性分析局势，制定应对方案',
        subtext: '用专业能力让TA安心',
        outcome: {
          narration: '你深吸一口气，打开电脑共享屏幕："你看，负面评论的峰值已经过了，再熬两天就没事了。"你一条一条给TA分析，用数据证明天没有塌。TA的抽泣声渐渐停了，换成了沉默——那种在思考的沉默。',
          statChanges: { prRisk: -8, commercialValue: 3 },
          conditionalOutcomes: [
            {
              condition: { maxFanLoyalty: 30 },
              narration: '但TA突然打断你："你能不能不要跟我讲数据了？我不想听这些，我只是...我只是想有个人跟我说句没关系。"电话那头沉默了。然后是嘟嘟嘟的忙音。',
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
          narration: '"不行就别扛了，去个没人认识你的地方待几天。"TA愣了一下——大概没想到你会说这种话。"真的可以吗？""当然可以，你又不是机器。"第二天，TA发了一张海边的照片。没有定位，没有文字。但你知道TA在笑。',
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
    description: '"喂？是XX的经纪人吗？我是《浪姐/哥》的导演。"你差点没拿稳手机。这节目你们做梦都想上。"有个嘉宾临时退了，明天开录。你们来不来？——现在就要答复我。"',
    emoji: '🎬',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '综艺导演',
      callerAvatar: '🎬',
      ringDescription: '综艺节目组来电',
      hangUpOutcome: {
        narration: '你没接到这个电话。等你看到未接来电时已经过了四十分钟——导演的下一通电话打给了你的竞争对手。当晚你在微博看到对方晒出的录制路透，心情复杂。',
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
          narration: '"来！"你秒回。挂了电话你才慌——造型、话术、才艺，什么都没准备。你连夜拉着团队开会到凌晨四点，给艺人准备了三套方案。录制当天，艺人状态在线，几个镜头被导演加了特写。你在监控室松了一口气。',
          statChanges: { commercialValue: 8, fanLoyalty: 5, money: 20000 },
          twist: {
            chance: 0.2,
            narration: '但是！准备太仓促，艺人在一个互动环节里说了句话——本来是想开玩笑的，但在座有位前辈脸色沉了一下。当晚那个片段被单独截出来传了十万转发，标题是："XX当众得罪前辈？"',
            statChanges: { prRisk: 8, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'tv_negotiate_fee',
        text: '答应，但趁机提高出场费',
        subtext: '对方急需人，正好提价',
        outcome: {
          narration: '"来是肯定来的，但出场费的事...导演您看，这么紧急的情况，诚意总得体现一下吧？"对面沉默了两秒。你屏住呼吸。"行，加50%。"你挂了电话在办公室原地跳了一下。',
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
    description: '你的律师陈大状平时从不在工作时间外打电话——他说过"律师的时间按小时收费，不会浪费在闲聊上"。所以当晚上九点他的号码出现在屏幕上时，你就知道事情不小了。"有人明天要递起诉书，可能是名誉权也可能是合同纠纷。我需要你现在告诉我实话——有没有什么我不知道的？"',
    emoji: '⚖️',
    isPhoneCall: true,
    phoneCallMeta: {
      callerName: '律师陈大状',
      callerAvatar: '⚖️',
      ringDescription: '律师紧急来电',
      hangUpOutcome: {
        narration: '你看着陈大状的未接来电，想着"能有多大事"，决定明天再回。第二天你是被记者的电话轰醒的——起诉书的照片已经被挂在了微博上，对方显然是有备而来，起诉和曝光是同步操作的。',
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
          narration: '陈大状连夜安排了和对方律师的会面。你在隔壁房间等，能听到那边不时传来拍桌子的声音。两个小时后陈大状走出来，领带都歪了："谈妥了。数字不好看，但比上法庭便宜。"你在协议上签了字，手有点抖。',
          statChanges: { money: -40000, prRisk: -5 },
        },
      },
      {
        id: 'lawyer_fight',
        text: '应诉到底',
        subtext: '旷日持久，但如果赢了可以扭转局面',
        outcome: {
          narration: '"打。"你就说了一个字。陈大状嘴角微微上扬——他喜欢打仗。律师团队开始连夜整理证据链。这会是一场持久战，但你不想服软。',
          statChanges: { money: -15000, prRisk: 5 },
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 40 },
              narration: '平时的风险管理在这时候见了回报——陈大状翻出几份关键材料，在桌上排了一排："赢面七成以上。"舆论也开始偏向你们，"支持依法维权"的话题悄悄爬上了热搜。',
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
