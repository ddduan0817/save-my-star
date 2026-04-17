import type { GameEvent } from '@/types/game';

// ============================================================
// 事件链：通过 followUpEventId 串联的多步剧情线
// 5条链 × 2~3个事件 = 13个事件
// ============================================================

export const chainEvents: GameEvent[] = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🧾 链1: 税务风波链 (3 events)
  //   chain_tax_1 → chain_tax_2_investigate / chain_tax_2_deny
  //                  → chain_tax_3_clear / chain_tax_3_penalty
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'chain_tax_1',
    category: 'crisis',
    severity: 'high',
    title: '税务疑云：有人在举报？',
    description: '某财经大V发了条微博，暗示"有位顶流的税务有问题"，配图是你艺人代言的某奢侈品海报。评论区已经开始@税务局了，#查税#话题阅读量正在飙升...',
    emoji: '🧾',
    minDay: 8,
    choices: [
      {
        id: 'tax_proactive',
        text: '主动配合调查',
        subtext: '联系税务部门说明情况',
        outcome: {
          narration: '你主动联系了税务部门，表示全力配合调查。网友："这态度可以，没做亏心事不怕查。" 但品牌方还是紧张了...',
          statChanges: { prRisk: 3, commercialValue: -3 },
          followUpEventId: 'chain_tax_2_investigate',
          unlockTag: 'tax_cooperated',
        },
      },
      {
        id: 'tax_deny',
        text: '发声明否认',
        subtext: '"纯属造谣，已委托律师"',
        outcome: {
          narration: '律师函发出去了，但大V不仅没删帖，还追加了一条"我有证据"。事情越闹越大，"欲盖弥彰"四个字满屏都是。',
          statChanges: { prRisk: 5, fanLoyalty: -3 },
          followUpEventId: 'chain_tax_2_deny',
          unlockTag: 'tax_denied',
        },
      },
      {
        id: 'tax_silence',
        text: '冷处理不回应',
        subtext: '等风头过去',
        outcome: {
          narration: '你选择沉默，但沉默在这种时候就等于默认。"不敢回应就是心虚"的论调铺天盖地。品牌方已经在考虑暂停合作了。',
          statChanges: { prRisk: 4, commercialValue: -3 },
        },
      },
    ],
  },

  {
    id: 'chain_tax_2_investigate',
    category: 'crisis',
    severity: 'high',
    title: '税务调查结果出来了',
    description: '税务部门的初步核查结果出来了——确实存在一笔代缴税款的计算差异，金额不大但确实有。财经大V已经截图在等着了。你怎么处理？',
    emoji: '📋',
    requiredTags: ['tax_cooperated'],
    choices: [
      {
        id: 'tax_pay_fine',
        text: '立即补缴 + 公开道歉',
        subtext: '补税加滞纳金 (-5万)',
        requireMinMoney: 50000,
        outcome: {
          narration: '补缴完毕，诚恳道歉。"虽然有问题但态度端正"上了热搜，路人觉得你很体面。税务局也发了公告确认已结清。危机完美化解！',
          statChanges: { prRisk: -5, fanLoyalty: 3, money: -50000 },
          followUpEventId: 'chain_tax_3_clear',
          unlockTag: 'tax_resolved_well',
        },
      },
      {
        id: 'tax_argue',
        text: '据理力争',
        subtext: '"是财务公司的失误，不是我们的问题"',
        outcome: {
          narration: '你把锅甩给了财务公司，但网友不买账："请的财务公司你不管？推卸责任也是一种态度。" 舆论继续发酵中。',
          statChanges: { prRisk: 4, fanLoyalty: -3 },
          followUpEventId: 'chain_tax_3_penalty',
          unlockTag: 'tax_argued',
        },
      },
    ],
  },

  {
    id: 'chain_tax_2_deny',
    category: 'crisis',
    severity: 'critical',
    title: '实锤了！税务部门介入',
    description: '税务部门正式发公告介入调查。之前发的否认声明成了笑话，"打脸现场"在各平台刷屏。粉丝在超话里崩溃发帖，品牌方的电话一个接一个打来...',
    emoji: '🔨',
    requiredTags: ['tax_denied'],
    choices: [
      {
        id: 'tax_deny_apologize',
        text: '认错道歉 + 补缴',
        subtext: '全额补缴税款 (-8万)',
        requireMinMoney: 80000,
        outcome: {
          narration: '迟到的道歉虽然不够体面，但至少止血了。"先否认再道歉"成了经典案例，品牌方还是解约了两个。代价惨痛的教训。',
          statChanges: { prRisk: -3, commercialValue: -5, fanLoyalty: -3, money: -80000 },
          unlockTag: 'tax_late_apology',
        },
      },
      {
        id: 'tax_deny_hire_lawyer',
        text: '请顶级律师团应对',
        subtext: '打法律战 (-12万)',
        requireMinMoney: 120000,
        outcome: {
          narration: '律师团介入后，证实问题出在税务代理方。虽然艺人也有连带责任，但至少不是主观逃税。"有钱就是能请好律师"的酸话飘了一阵就散了。',
          statChanges: { prRisk: -3, commercialValue: -3, money: -120000 },
          followUpEventId: 'chain_tax_3_penalty',
          unlockTag: 'tax_lawyered_up',
        },
      },
    ],
  },

  {
    id: 'chain_tax_3_clear',
    category: 'pr',
    severity: 'medium',
    title: '税务风波后续：口碑逆转',
    description: '因为处理税务问题的态度好，官媒点名表扬了你的艺人"知错就改"。一波正面报道让路人好感直线上升，甚至有新品牌主动来谈合作了！',
    emoji: '✨',
    requiredTags: ['tax_resolved_well'],
    choices: [
      {
        id: 'tax_clear_charity',
        text: '趁热打铁做公益',
        subtext: '捐款 + 税务普法宣传',
        outcome: {
          narration: '你的艺人参与了税务普法公益活动，"用亲身经历教育大家"的人设立住了。各大品牌的合作邀约纷至沓来，税务风波反而成了加分项！',
          statChanges: { commercialValue: 5, fanLoyalty: 3, prRisk: -3, money: -20000 },
        },
      },
      {
        id: 'tax_clear_lowkey',
        text: '低调做人',
        subtext: '别再蹭这个话题了',
        outcome: {
          narration: '你选择让这件事平静收场。虽然没有额外收益，但也没有翻车风险。稳稳当当，挺好。',
          statChanges: { prRisk: -3, fanLoyalty: 2 },
        },
      },
    ],
  },

  {
    id: 'chain_tax_3_penalty',
    category: 'crisis',
    severity: 'high',
    title: '税务罚单来了',
    description: '最终裁定出来了，你的艺人需要补缴税款加罚款。金额不大但信号很大——"娱乐圈税务整顿"的大背景下，你被当成了典型。',
    emoji: '💸',
    requiredTags: ['tax_argued'],
    excludeTags: ['tax_resolved_well'],
    choices: [
      {
        id: 'tax_penalty_accept',
        text: '认罚，低头做人',
        subtext: '缴罚款 (-6万)',
        requireMinMoney: 60000,
        outcome: {
          narration: '罚款交了，声明发了，但这个污点短期内洗不掉。好在你态度诚恳，几个核心粉丝站了出来：" 人非圣贤。"慢慢来吧。',
          statChanges: { prRisk: -3, commercialValue: -3, money: -60000 },
        },
      },
      {
        id: 'tax_penalty_rebrand',
        text: '壮士断腕，全面转型',
        subtext: '暂停所有商务，专心作品',
        outcome: {
          narration: '你宣布暂停一切商业活动，专心打磨作品。粉丝含泪支持，路人也觉得这份决心值得尊重。"卧薪尝胆"的剧本，走起。',
          statChanges: { commercialValue: -5, fanLoyalty: 5, prRisk: -4, money: -30000 },
        },
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 💕 链2: 恋情曝光链 (3 events)
  //   chain_romance_1 → chain_romance_2_public / chain_romance_2_secret
  //                      → chain_romance_3_breakup / chain_romance_3_blessing
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'chain_romance_1',
    category: 'drama',
    severity: 'high',
    title: '狗仔又来了：恋情实锤？',
    description: '这次不是模糊的牵手照了——狗仔拍到你的艺人和圈外某富二代在海边度假的亲密照。照片清晰度堪比8K，连表情包都有人做好了。话题#XX的神秘恋人#已经爆了。',
    emoji: '💕',
    minDay: 10,
    excludeTags: ['public_relationship'],
    choices: [
      {
        id: 'romance_announce',
        text: '索性官宣吧',
        subtext: '"对，我恋爱了，很幸福"',
        outcome: {
          narration: '艺人甜蜜官宣，微博直接瘫了。"终于不用帮你们藏了"成了热评第一。CP粉狂喜，唯粉心碎，品牌方紧急开会评估影响...',
          statChanges: { prRisk: -3, fanLoyalty: -4, commercialValue: -3 },
          followUpEventId: 'chain_romance_2_public',
          unlockTag: 'romance_official',
        },
      },
      {
        id: 'romance_hide',
        text: '紧急灭火',
        subtext: '联系狗仔删图 + 控评',
        outcome: {
          narration: '你花了一番功夫把火压下去了，但图已经存了无数份。"互联网是有记忆的"——这句话你今天深刻体会到了。暗地里恋情继续，但随时可能再爆。',
          statChanges: { prRisk: 3, money: -30000 },
          followUpEventId: 'chain_romance_2_secret',
          unlockTag: 'romance_hidden',
        },
      },
      {
        id: 'romance_breakup',
        text: '劝艺人分手',
        subtext: '"事业为重！"',
        outcome: {
          narration: '你苦口婆心劝了一晚上，艺人含泪答应了。粉丝们不知道发生了什么，只觉得偶像最近看起来很憔悴。"好心疼"的弹幕疯狂刷屏。',
          statChanges: { fanLoyalty: 3, prRisk: -3 },
          twist: {
            chance: 0.25,
            narration: '分手的消息不知道怎么被对方朋友圈传出来了，"为了事业抛弃爱情"的话题引发热议。部分路人开始同情对方，觉得你的艺人太现实了。',
            statChanges: { prRisk: 4, fanLoyalty: -4 },
          },
        },
      },
    ],
  },

  {
    id: 'chain_romance_2_public',
    category: 'drama',
    severity: 'medium',
    title: '恋爱后遗症：品牌方的态度',
    description: '官宣一周了。好消息是路人好感确实上来了，坏消息是三个品牌方明确表示"恋爱人设不符合代言定位"。但也有情侣品牌来谈合作了——要接吗？',
    emoji: '💍',
    requiredTags: ['romance_official'],
    choices: [
      {
        id: 'romance_couple_brand',
        text: '接情侣品牌代言',
        subtext: '和恋人一起拍广告',
        outcome: {
          narration: '情侣广告拍得甜到齁，全网都在嗑真糖！商业价值虽然转型了但没降。"这就是爱情该有的样子"成了爆款文案。',
          statChanges: { commercialValue: 3, fanLoyalty: 3, money: 60000 },
          followUpEventId: 'chain_romance_3_blessing',
          unlockTag: 'romance_couple_brand',
        },
      },
      {
        id: 'romance_separate_work',
        text: '工作和感情分开',
        subtext: '恋爱归恋爱，事业归事业',
        outcome: {
          narration: '你明确表示工作中不会消费恋情。这种职业态度赢得了品牌方的尊重，原有代言基本保住了。不过CP粉觉得你"不够大方"。',
          statChanges: { commercialValue: 2, fanLoyalty: -2, prRisk: -3 },
          followUpEventId: 'chain_romance_3_breakup',
          unlockTag: 'romance_professional',
        },
      },
    ],
  },

  {
    id: 'chain_romance_2_secret',
    category: 'drama',
    severity: 'high',
    title: '地下恋情再次曝光！',
    description: '你以为压下去了？太天真了。这次是恋人的闺蜜在朋友圈晒了合照，被营销号截图传遍全网。"上次否认这次又来"，质疑声比上次凶十倍。',
    emoji: '🕵️',
    requiredTags: ['romance_hidden'],
    choices: [
      {
        id: 'romance_forced_admit',
        text: '这次真的瞒不住了，官宣',
        subtext: '道歉 + 公开',
        outcome: {
          narration: '"上次撒谎了对不起"——这个道歉声明写得诚恳但尴尬。粉丝最恨的就是被骗。脱粉的比直接官宣多了三倍，但好歹不用再藏了。',
          statChanges: { fanLoyalty: -5, prRisk: 3, commercialValue: -3 },
          followUpEventId: 'chain_romance_3_breakup',
          unlockTag: 'romance_forced_reveal',
        },
      },
      {
        id: 'romance_deny_again',
        text: '继续否认到底',
        subtext: '"是P图！假的！"',
        outcome: {
          narration: '你选择死不承认。但这次连粉丝都不信了——"经纪人你当我们傻吗？"超话里满是失望。恋人那边的朋友也开始爆料，四面楚歌。',
          statChanges: { prRisk: 5, fanLoyalty: -5, commercialValue: -3 },
          twist: {
            chance: 0.4,
            narration: '恋人本人发微博了："我不想再做见不得光的人。"直接放出聊天记录。全网哗然，"渣经纪人"的词条冲上热搜第一。',
            statChanges: { prRisk: 5, fanLoyalty: -4 },
          },
        },
      },
    ],
  },

  {
    id: 'chain_romance_3_blessing',
    category: 'pr',
    severity: 'low',
    title: '恋情大结局：全网祝福',
    description: '你的艺人和恋人一起出席了公益活动，被拍到的互动自然又甜蜜。"娱乐圈最佳恋人"的称号不胫而走，连官媒都发了正面报道。这波血赚！',
    emoji: '🎊',
    requiredTags: ['romance_couple_brand'],
    choices: [
      {
        id: 'romance_bless_leverage',
        text: '趁势接更多情侣向商务',
        subtext: '爱情事业双丰收！',
        outcome: {
          narration: '珠宝、婚纱、度假...品牌方排着队来谈情侣代言。你的艺人成了"国民恋人"代言专业户，粉丝也从心疼变成了真心祝福。HE达成！',
          statChanges: { commercialValue: 4, fanLoyalty: 3, money: 80000, prRisk: -3 },
        },
      },
      {
        id: 'romance_bless_balance',
        text: '适度曝光，保持神秘感',
        subtext: '别过度消费爱情',
        outcome: {
          narration: '你控制了恋情的曝光节奏，既保持了话题度又没有让人审美疲劳。"会营业但不油腻"的评价，正是你想要的效果。',
          statChanges: { commercialValue: 3, fanLoyalty: 3, prRisk: -3 },
        },
      },
    ],
  },

  {
    id: 'chain_romance_3_breakup',
    category: 'drama',
    severity: 'medium',
    title: '感情变故：分手传闻',
    description: '恋人已经两周没发朋友圈了，有人注意到你的艺人取关了对方的小号。"这是分手的节奏？"八卦博主们已经闻到味道了。',
    emoji: '💔',
    requiredTags: ['romance_professional'],
    excludeTags: ['romance_couple_brand'],
    choices: [
      {
        id: 'romance_breakup_confirm',
        text: '承认和平分手',
        subtext: '"感谢这段感情"',
        outcome: {
          narration: '体面的分手声明发出后，粉丝们居然松了一口气。"单身了又可以磕别的CP了！"你的艺人重新变成了"全民老公/老婆"，商业价值回来了。',
          statChanges: { fanLoyalty: 3, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'romance_breakup_ambiguous',
        text: '不回应，保持暧昧',
        subtext: '让子弹飞一会儿',
        outcome: {
          narration: '既没承认也没否认。粉丝们化身福尔摩斯，每天分析你艺人的社交动态。这种"薛定谔的恋情"居然也有话题度，算是因祸得福？',
          statChanges: { prRisk: 3, commercialValue: 2 },
        },
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎪 链3: 综艺翻红链 (2 events)
  //   chain_variety_1 → chain_variety_2_viral
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'chain_variety_1',
    category: 'business',
    severity: 'medium',
    title: '顶级综艺邀约！但有风险...',
    description: '某王牌综艺节目来了邀约，收视率虽然高但以"整活儿"著称——嘉宾经常被整得很惨。上一期有个艺人因为表现太尬直接社死了。去不去？',
    emoji: '🎪',
    minDay: 6,
    choices: [
      {
        id: 'variety_accept',
        text: '去！搏一搏',
        subtext: '高风险高回报',
        outcome: {
          narration: '你的艺人上了节目，表现得又真实又可爱。尤其是那段被吓到飙方言的片段，已经被做成表情包疯传了！弹幕都在刷"哈哈哈哈太真实了"。',
          statChanges: { fanLoyalty: 3, commercialValue: 3, prRisk: 2 },
          followUpEventId: 'chain_variety_2_viral',
          unlockTag: 'variety_appeared',
          twist: {
            chance: 0.2,
            narration: '节目里有个环节翻车了——你的艺人说错了一个常识性问题，"文化水平堪忧"的词条上了热搜。虽然后来澄清是剪辑效果，但已经传开了。',
            statChanges: { prRisk: 4, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'variety_negotiate',
        text: '去，但要提前沟通环节',
        subtext: '减少整活，增加才艺展示',
        outcome: {
          narration: '节目组答应了你的要求，但录出来的效果中规中矩。"太端着了"的评论有不少，但至少没翻车。安全落地。',
          statChanges: { commercialValue: 2, fanLoyalty: 1 },
        },
      },
      {
        id: 'variety_decline',
        text: '婉拒',
        subtext: '风险太大了',
        outcome: {
          narration: '你婉拒了邀约。后来听说另一个艺人去了，直接凭综艺感翻红了。你的艺人刷着别人的热搜，若有所思...',
          statChanges: { fanLoyalty: -2 },
        },
      },
    ],
  },

  {
    id: 'chain_variety_2_viral',
    category: 'business',
    severity: 'medium',
    title: '综艺名场面出圈了！',
    description: '你艺人在综艺里的表情包火遍全网，B站二创播放量破千万。热搜词条#XX综艺名场面#已经挂了三天了。各路商家疯狂蹭热度，甚至有品牌直接拿表情包做了广告。',
    emoji: '🔥',
    requiredTags: ['variety_appeared'],
    choices: [
      {
        id: 'viral_monetize',
        text: '趁热打铁接综艺通告',
        subtext: '多上几档节目巩固综艺咖人设',
        outcome: {
          narration: '你一口气接了三档综艺，艺人彻底打上了"综艺感超强"的标签。各大节目的邀约排到了下个季度，综艺通告费也翻了倍！',
          statChanges: { commercialValue: 4, money: 80000, fanLoyalty: 3 },
          twist: {
            chance: 0.25,
            narration: '上太多综艺了！粉丝开始抱怨："能不能好好拍戏/唱歌？天天上综艺是要转型搞笑艺人吗？"专业口碑有所下滑。',
            statChanges: { fanLoyalty: -3, commercialValue: -3 },
          },
        },
      },
      {
        id: 'viral_ip',
        text: '把表情包变成IP',
        subtext: '出联名周边 + 授权表情包',
        outcome: {
          narration: '你迅速注册了表情包IP，联名周边上线三分钟售罄。"原来表情包也能变现"成了行业案例。你的艺人笑着数钱，这波属于是躺赢了。',
          statChanges: { money: 100000, commercialValue: 3, fanLoyalty: 3 },
        },
      },
      {
        id: 'viral_classy',
        text: '顺其自然，不过度消费',
        subtext: '让热度慢慢沉淀',
        outcome: {
          narration: '你没有急于变现，反而让艺人发了条自嘲微博。这种"不把自己当回事"的态度反而让路人更喜欢了。格局，打开了。',
          statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
        },
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 💰 链4: 投资暴雷链 (3 events)
  //   chain_invest_1 → chain_invest_2_bad → chain_invest_3_aftermath
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'chain_invest_1',
    category: 'business',
    severity: 'medium',
    title: '投资好机会？某茶饮品牌邀请入股',
    description: '一个正在风口上的新式茶饮品牌邀请你的艺人入股并担任"首席体验官"。品牌方PPT做得漂亮极了——"万店计划""年回报率200%"。你身边的圈内人都说这牌子要火。',
    emoji: '🧋',
    minDay: 7,
    choices: [
      {
        id: 'invest_big',
        text: '大手笔入股',
        subtext: '投资30万，拿5%股份',
        requireMinMoney: 300000,
        outcome: {
          narration: '签约仪式办得很风光，你的艺人笑容满面地举着奶茶合影。品牌方在三个月内开了50家店，看起来形势一片大好。你心里美滋滋的...',
          statChanges: { commercialValue: 3, money: -300000 },
          followUpEventId: 'chain_invest_2_bad',
          unlockTag: 'invested_big',
        },
      },
      {
        id: 'invest_small',
        text: '小额参与',
        subtext: '投个5万意思一下',
        requireMinMoney: 50000,
        outcome: {
          narration: '你谨慎地只投了小额。品牌方有点不高兴但还是接受了，给了个"品牌大使"的头衔。至少不至于伤筋动骨。',
          statChanges: { commercialValue: 2, money: -50000 },
          followUpEventId: 'chain_invest_2_bad',
          unlockTag: 'invested_small',
        },
      },
      {
        id: 'invest_decline',
        text: '算了，不掺和',
        subtext: '艺人老老实实赚通告费就行',
        outcome: {
          narration: '"投资有风险"这句话你记得很牢。虽然错过了发布会的曝光机会，但你晚上睡得很踏实。不是所有钱都要赚的。',
          statChanges: { fanLoyalty: 1 },
        },
      },
    ],
  },

  {
    id: 'chain_invest_2_bad',
    category: 'crisis',
    severity: 'high',
    title: '茶饮品牌暴雷了！',
    description: '突然间铺天盖地的新闻——你投资的那个茶饮品牌被曝使用过期原料！多家门店被市监局查封，"XX代言的奶茶喝了会怎样"冲上热搜。你的艺人微博评论区已经沦陷了...',
    emoji: '💣',
    requiredTags: ['invested_big'],
    choices: [
      {
        id: 'invest_bad_cut',
        text: '立即切割',
        subtext: '发声明 + 退股 + 道歉',
        outcome: {
          narration: '你以最快速度发了声明退出投资。但"割韭菜跑得倒快"的讽刺声不断。退股的钱品牌方说"正在走流程"——你觉得大概率打水漂了。',
          statChanges: { prRisk: 3, commercialValue: -3, fanLoyalty: -3 },
          followUpEventId: 'chain_invest_3_aftermath',
          unlockTag: 'invest_cut_loss',
        },
      },
      {
        id: 'invest_bad_victim',
        text: '以受害者身份站出来',
        subtext: '"我们也是被骗的！"',
        outcome: {
          narration: '"我们也是受害者"——这个角度虽然有点投机，但确实引发了一波同情。不过也有人质疑："投资之前不做尽调的吗？"',
          statChanges: { prRisk: 3, fanLoyalty: -2 },
          followUpEventId: 'chain_invest_3_aftermath',
          unlockTag: 'invest_played_victim',
        },
      },
      {
        id: 'invest_bad_push',
        text: '督促品牌方整改',
        subtext: '以股东身份要求品牌负责',
        outcome: {
          narration: '你以股东身份推动品牌方全面整改和赔偿。虽然过程痛苦，但"有担当"的评价开始出现了。品牌方的整改声明里提到了你的推动，路人刮目相看。',
          statChanges: { prRisk: -2, fanLoyalty: 3, commercialValue: -3 },
          followUpEventId: 'chain_invest_3_aftermath',
          unlockTag: 'invest_took_responsibility',
        },
      },
    ],
  },

  {
    id: 'chain_invest_3_aftermath',
    category: 'business',
    severity: 'medium',
    title: '投资暴雷后遗症',
    description: '茶饮品牌的事情过去一个月了，但影响还在。其他品牌方在合作前都会问一句"不会再搞投资了吧？"你的艺人也有点怕了。接下来怎么办？',
    emoji: '📉',
    requiredTags: ['invest_cut_loss'],
    choices: [
      {
        id: 'invest_after_cautious',
        text: '彻底远离投资',
        subtext: '专注本职工作',
        outcome: {
          narration: '"不投了不投了"成了你的口头禅。品牌方们反而放心了——至少不会再有投资暴雷的风险。通告费虽然赚得慢，但胜在稳定。',
          statChanges: { commercialValue: 3, prRisk: -3, fanLoyalty: 2 },
        },
      },
      {
        id: 'invest_after_diversify',
        text: '找专业团队做投资',
        subtext: '请专业投资顾问，科学理财',
        outcome: {
          narration: '你聘请了专业的投资顾问团队。虽然短期内多了一笔开支，但长期来看这才是正路。"花钱买教训，买了就要学"——这条微博获赞无数。',
          statChanges: { money: -30000, prRisk: -3, commercialValue: 2 },
        },
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🤝 链5: 跨界合作链 (2 events)
  //   chain_collab_1 → chain_collab_2_success / chain_collab_2_flop
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'chain_collab_1',
    category: 'business',
    severity: 'medium',
    title: '跨界合作：国际大牌抛出橄榄枝',
    description: '某国际奢侈品牌邀请你的艺人参与一个"东方美学"主题的联名企划。合作形式很创新——不只是代言，而是让艺人参与设计。但圈内有人说这个品牌之前的联名都翻车了...',
    emoji: '🤝',
    minDay: 12,
    statConditions: { minCommercial: 40 },
    choices: [
      {
        id: 'collab_full',
        text: '全力投入',
        subtext: '亲自参与设计，深度合作',
        outcome: {
          narration: '你的艺人花了两周时间和设计团队碰撞灵感。从纹样到配色都有参与，"认真到让设计师都惊讶"的幕后花絮被品牌方发了出来，好评如潮。',
          statChanges: { commercialValue: 3, fanLoyalty: 3, money: -20000 },
          followUpEventId: 'chain_collab_2_success',
          unlockTag: 'collab_full_commit',
        },
      },
      {
        id: 'collab_surface',
        text: '挂名参与',
        subtext: '拍几张图就行，别太认真',
        outcome: {
          narration: '你只安排了一天拍摄时间，效果嘛...一言难尽。品牌方对成品不太满意，最终只用了两张图。"这不就是普通代言吗？"评论区毫不留情。',
          statChanges: { commercialValue: 2, money: 40000 },
          followUpEventId: 'chain_collab_2_flop',
          unlockTag: 'collab_half_hearted',
        },
      },
      {
        id: 'collab_decline',
        text: '婉拒，时机不对',
        subtext: '现在跨界风险太大',
        outcome: {
          narration: '你礼貌地拒绝了。后来这个企划找了别人，反响平平。你庆幸自己没蹚浑水，但也少了一次国际曝光的机会。',
          statChanges: { commercialValue: -2 },
        },
      },
    ],
  },

  {
    id: 'chain_collab_2_success',
    category: 'business',
    severity: 'medium',
    title: '联名企划大爆！全球关注',
    description: '联名系列发布了！你的艺人参与设计的"东方美学"系列在全球社交媒体刷屏，Vogue和ELLE都发了专题报道。限量款上线2分钟售罄，黄牛价炒到了10倍。国际粉丝疯狂增长中！',
    emoji: '🌟',
    requiredTags: ['collab_full_commit'],
    choices: [
      {
        id: 'collab_success_expand',
        text: '乘胜追击，谈长期合约',
        subtext: '成为品牌全球大使',
        outcome: {
          narration: '品牌方主动提出了三年全球大使合约，年薪七位数。签约仪式在巴黎举行，你的艺人站在埃菲尔铁塔前的大幅广告下，这一刻，值了。',
          statChanges: { commercialValue: 5, money: 150000, fanLoyalty: 3, prRisk: -3 },
        },
      },
      {
        id: 'collab_success_selective',
        text: '保持稀缺感',
        subtext: '这次的成功不能被稀释',
        outcome: {
          narration: '你没有急于签长约，反而让品牌方来"追"你。这种"不是所有钱都赚"的态度传开后，更多顶级品牌向你抛来了橄榄枝。饥饿营销，格局！',
          statChanges: { commercialValue: 4, fanLoyalty: 3, money: 60000 },
        },
      },
    ],
  },

  {
    id: 'chain_collab_2_flop',
    category: 'pr',
    severity: 'medium',
    title: '联名翻车：被嘲"文化挪用"',
    description: '联名系列发布了，但因为设计太敷衍，"东方美学"变成了刻板印象的大杂烩。龙纹+灯笼+红色——就差写"Chinese"了。海外网友骂"文化挪用"，国内网友骂"丢人丢到国外"。你的艺人夹在中间左右不是人。',
    emoji: '😬',
    requiredTags: ['collab_half_hearted'],
    choices: [
      {
        id: 'collab_flop_apologize',
        text: '道歉 + 退出合作',
        subtext: '承认参与度不够',
        outcome: {
          narration: '你发了声明承认参与度不足并退出合作。"至少敢承认"的评价让你止了血，但这个"联名翻车"的标签短期内是撕不掉了。下次记住：要么不做，要么做好。',
          statChanges: { prRisk: 3, commercialValue: -3, fanLoyalty: -2 },
        },
      },
      {
        id: 'collab_flop_blame',
        text: '甩锅给品牌方',
        subtext: '"设计方案不是我们定的"',
        outcome: {
          narration: '你把责任推给了品牌方的设计团队。虽然说的是事实，但"合作就是双方的事"的逻辑让甩锅显得很没担当。品牌方也发声了："合作过程中对方全程缺席。" 你被打了个措手不及。',
          statChanges: { prRisk: 4, commercialValue: -4, fanLoyalty: -4 },
          twist: {
            chance: 0.3,
            narration: '品牌方的公关总监在社交媒体上放出了你们的沟通记录，证明你方确实只给了一天时间。"实锤了"——你的艺人成了甩锅典型案例。',
            statChanges: { prRisk: 3, commercialValue: -3 },
          },
        },
      },
    ],
  },
];
