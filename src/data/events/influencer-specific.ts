import type { GameEvent } from '@/types/game';

// 冷冰凝（网红转型/女）专属事件
export const influencerSpecificEvents: GameEvent[] = [
  {
    id: 'influencer_not_real_celeb',
    category: 'drama',
    severity: 'medium',
    title: '"她也配叫明星？"',
    description: '一位老牌女演员在采访中说"现在什么人都能叫明星了"，虽然没点名，但所有人都觉得在说冷冰凝。话题#网红和明星的区别#已经有5亿阅读量了。',
    emoji: '😒',
    forArtist: 'influencer',
    minDay: 5,
    choices: [
      {
        id: 'prove_worth',
        text: '用成绩回应',
        subtext: '晒出商业数据和作品',
        outcome: {
          narration: '你整理了冷冰凝的品牌合作列表、带货数据和短片作品。"网红怎么了？数据不会说谎"的回应让不少人改观。',
          statChanges: { commercialValue: 3, fanLoyalty: 3, prRisk: -3 },
        },
      },
      {
        id: 'self_deprecate',
        text: '自嘲化解',
        subtext: '"对对对我就是网红"',
        outcome: {
          narration: '冷冰凝发了一条视频：穿着睡衣吃泡面，配文"网红的真实生活"。播放量破亿，连那位老牌演员的粉丝都笑了。这波操作格局太大了。',
          statChanges: { fanLoyalty: 5, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'fire_back_celeb',
        text: '正面回怼',
        subtext: '"票房不如我带货，凭什么瞧不起？"',
        outcome: {
          narration: '火药味十足的回应引爆了舆论。年轻粉丝觉得"太飒了"，但传统娱乐圈的大门可能就此关上了。',
          statChanges: { fanLoyalty: 3, commercialValue: -3, prRisk: 4 },
        },
      },
    ],
  },
  {
    id: 'influencer_livestream_disaster',
    category: 'crisis',
    severity: 'high',
    title: '直播翻车！产品当场出问题',
    description: '冷冰凝在直播带货时，推荐的面膜被一个观众现场试用后过敏了。观众发红的脸出现在直播画面里，弹幕瞬间炸了。直播还在继续，你需要立刻做决定。',
    emoji: '📺',
    forArtist: 'influencer',
    minDay: 6,
    choices: [
      {
        id: 'stop_and_address',
        text: '暂停直播处理',
        subtext: '立刻道歉+下架产品',
        outcome: {
          narration: '冷冰凝当场道歉并宣布全额退款。虽然损失了一笔钱，但"网红带货的良心标杆"成了新标签。品牌方吓坏了，赔了一大笔。',
          statChanges: { money: -40000, fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
          twist: {
            chance: 0.3,
            narration: '过敏的观众后来发微博说："小鱼姐第一时间处理，还私下联系我赔偿了医药费。以后只在她的直播间买东西。"这条微博被转发了50万次。',
            statChanges: { fanLoyalty: 4, commercialValue: 3 },
          },
        },
      },
      {
        id: 'blame_brand',
        text: '甩锅给品牌方',
        subtext: '"是他们的产品有问题"',
        outcome: {
          narration: '你让冷冰凝把责任推给了品牌方。品牌方一怒之下放出了你们签合同时根本没看质检报告的证据。"翻车还甩锅"成了热搜。',
          statChanges: { prRisk: 7, fanLoyalty: -4, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'influencer_old_video',
    category: 'crisis',
    severity: 'medium',
    title: '早期低俗视频被扒出来了',
    description: '有人翻出了冷冰凝三年前为了涨粉拍的一些擦边内容。虽然已经删了，但录屏在到处传。"这就是你们支持的明星"的帖子已经有十万转发了。',
    emoji: '📹',
    forArtist: 'influencer',
    minDay: 8,
    choices: [
      {
        id: 'own_past',
        text: '坦然面对过去',
        subtext: '发长文讲述转型心路',
        outcome: {
          narration: '冷冰凝写了一篇两千字的长文，讲述了从最开始拍视频到现在的心路历程。"谁不是从不完美开始的"引发了大量共鸣。路人好感反而上升了。',
          statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'deny_old_video',
        text: '否认是本人',
        subtext: '"视频是AI生成的"',
        outcome: {
          narration: '这个时代谁信AI生成的说法啊...原始平台的数据被扒出来了，实锤就是本人。说谎比视频本身更让人反感。',
          statChanges: { prRisk: 7, fanLoyalty: -4 },
        },
      },
      {
        id: 'growth_narrative',
        text: '包装成"成长故事"',
        subtext: '请媒体做专访讲述转型',
        outcome: {
          narration: '你安排了一个深度采访，主题是"从草根到明星的蜕变"。虽然有人觉得是洗白，但大部分人被她的真实和努力打动了。',
          statChanges: { fanLoyalty: 3, prRisk: 3, commercialValue: 3, money: -14000 },
        },
      },
    ],
  },
  {
    id: 'influencer_variety_mockery',
    category: 'drama',
    severity: 'low',
    title: '综艺上被当面嘲讽',
    description: '冷冰凝参加一档脱口秀节目，一个嘉宾当面调侃"你是不是走错片场了？这里是娱乐圈不是直播间"。现场气氛凝固了，镜头正对着冷冰凝的脸。',
    emoji: '🎭',
    forArtist: 'influencer',
    choices: [
      {
        id: 'witty_comeback',
        text: '机智回怼',
        subtext: '用幽默化解',
        outcome: {
          narration: '"是啊，不过直播间的观众可比这多多了呢。"全场笑翻，连调侃她的人都竖了大拇指。"综艺感炸裂"上了当晚热搜。',
          statChanges: { fanLoyalty: 4, commercialValue: 4, prRisk: -3 },
        },
      },
      {
        id: 'stay_silent_mock',
        text: '尴尬微笑',
        subtext: '不回应，笑笑就好',
        outcome: {
          narration: '她没回嘴，只是笑了笑。这个片段被反复播放，大家都觉得她"好委屈"。同情分倒是赚了不少。',
          statChanges: { fanLoyalty: 3, prRisk: 3 },
        },
      },
    ],
  },

  // ===== 招牌黑料①：NOFAKE 假货 + 烂脸维权 =====
  {
    id: 'influencer_nofake_victim',
    category: 'crisis',
    severity: 'high',
    title: '"NOFAKE 受害者群"来维权了',
    description: '一位粉丝在微博发了九宫格：脸上大面积过敏、脱皮、发炎。配文："冷冰凝一年前推的 NOFAKE 护肤套装，我用了三个月烂脸到今天。群里还有三百多个受害者，品牌早就跑路了，只剩她没消失。" 转发破十万，她的名字挂上热搜。',
    emoji: '😢',
    forArtist: 'influencer',
    minDay: 4,
    choices: [
      {
        id: 'personal_compensate',
        text: '自掏腰包私下赔偿',
        subtext: '按群里人数给医药费 (-40万)',
        requireMinMoney: 400000,
        outcome: {
          narration: '你让团队联系受害者群，一对一核对医药发票，共计四十多万。群主发了一条微博："冰凝姐私下处理了我们的损失，虽然她不是元凶，但她是唯一还在的那个。"舆论瞬间反转——"担当"成了她的新标签。',
          statChanges: { money: -400000, fanLoyalty: 10, prRisk: -8, commercialValue: 4 },
          unlockTag: 'nofake_compensated',
        },
      },
      {
        id: 'blame_brand_gone',
        text: '甩锅跑路品牌',
        subtext: '"你们应该去告 NOFAKE 不是我"',
        outcome: {
          narration: '工作室声明"艺人仅为代言方，产品质量应由品牌方负责"。受害者当场开了场直播把声明读了一遍，她群里三百人齐刷"良心何在"。法律上你没错，舆论上你死了。',
          statChanges: { prRisk: 15, fanLoyalty: -12, commercialValue: -5 },
          unlockTag: 'nofake_blame_shifted',
        },
      },
      {
        id: 'help_sue_brand',
        text: '出钱出人帮粉丝集体起诉',
        subtext: '请律师团帮受害者告品牌 (-15万)',
        requireMinMoney: 150000,
        outcome: {
          narration: '你请了一整个律师团免费帮受害者起诉 NOFAKE 残余资产。冷冰凝亲自出镜："我受你们信任推荐了这个品牌，出事了我不能躲。"这波操作把她从"受害者帮凶"变成了"维权先锋"。',
          statChanges: { money: -150000, fanLoyalty: 12, prRisk: -10, commercialValue: 6 },
          unlockTag: 'nofake_lawsuit_champion',
        },
      },
    ],
  },
  {
    id: 'influencer_comparison_photos',
    category: 'crisis',
    severity: 'critical',
    title: '粉丝烂脸对比图刷屏',
    description: '一个话题标签 #NOFAKE 前后对比 挂上热搜第二。点进去全是受害粉丝的烂脸对比图——左边是冷冰凝直播间下单前的素颜，右边是用完三个月后的惨状。视觉冲击极强，很多路人第一次知道这事。',
    emoji: '📸',
    forArtist: 'influencer',
    minDay: 7,
    choices: [
      {
        id: 'showup_hospital',
        text: '亲自去医院探望',
        subtext: '带医疗金去看最严重的那位',
        outcome: {
          narration: '她带着现金和两个医生助理去了市一院皮肤科，受害者直播了全过程。"姐姐亲手给我抹药膏"的视频两小时破亿播放。"真的在管事"的评价压过了"假货代言人"。',
          statChanges: { money: -80000, fanLoyalty: 8, prRisk: -6, commercialValue: 4 },
          unlockTag: 'hospital_visit_viral',
        },
      },
      {
        id: 'beauty_brand_endorse',
        text: '接一个医美品牌代言洗白',
        subtext: '"用行动证明我懂护肤"',
        outcome: {
          narration: '你火速签了一个医美集团的公益代言，免费给受害者提供修复疗程。品牌方给了你一笔"公益金"做曝光。但有受害者出来说："现在才懂了？早干嘛去了。"',
          statChanges: { money: 120000, prRisk: 3, fanLoyalty: 3, commercialValue: 3 },
        },
      },
      {
        id: 'deny_product_responsibility',
        text: '发声明"我也是受骗者"',
        subtext: '"我看了品检报告才接的代言"',
        outcome: {
          narration: '声明发出去 10 分钟就被挖出——当年接代言的合同金额是 180 万，里面根本没有"品检报告存档"条款。翻车二次翻车，这波是真的救不回来了。',
          statChanges: { prRisk: 14, fanLoyalty: -10, commercialValue: -5 },
        },
      },
    ],
  },
  {
    id: 'influencer_lawyer_letter_from_victim',
    category: 'crisis',
    severity: 'high',
    title: '受害者联名起诉她连带赔偿',
    description: '三百多名 NOFAKE 受害者联合委托律师，将冷冰凝作为"代言人责任主体"一并起诉，要求连带赔偿两千万。传票送到工作室，短视频平台连夜下架了她所有相关带货视频。',
    emoji: '📄',
    forArtist: 'influencer',
    minDay: 10,
    choices: [
      {
        id: 'fight_in_court',
        text: '硬刚到底',
        subtext: '请大所打官司 (-30万)',
        requireMinMoney: 300000,
        outcome: {
          narration: '大所律师切入"代言人是否实际知情"作为辩护核心。官司要打一年起，诉讼期间所有代言方观望。钱花了一笔，但时间成了最好的朋友——拖到最后，部分受害者撤诉了。',
          statChanges: { money: -300000, prRisk: 6, commercialValue: -5 },
          unlockTag: 'court_battle',
        },
      },
      {
        id: 'settle_outside',
        text: '庭外和解',
        subtext: '一次性掏 150 万息事宁人',
        requireMinMoney: 1500000,
        outcome: {
          narration: '150 万打到受害者集体账户，签了和解协议。官司撤诉。代价是她公开承认"未尽代言审核义务"——但比起两千万的诉求，这笔钱买了一个清净。',
          statChanges: { money: -1500000, prRisk: -5, fanLoyalty: 3, commercialValue: -3 },
          unlockTag: 'settlement_paid',
        },
      },
      {
        id: 'ignore_lawsuit',
        text: '拒不应诉',
        subtext: '"你们告你们的"',
        outcome: {
          narration: '缺席判决，法院判她连带赔偿 800 万——还有限高消费令。商业代言全面暂停。团队陷入停摆。这是所有选项里最坏的一个。',
          statChanges: { money: -800000, prRisk: 20, fanLoyalty: -10, commercialValue: -10 },
          unlockTag: 'consumption_restriction',
        },
      },
    ],
  },

  // ===== 招牌黑料②：阴阳合同 + 税务风波 =====
  {
    id: 'influencer_tax_audit_rumor',
    category: 'crisis',
    severity: 'high',
    title: '税务局查到她的工作室了',
    description: '一位同行直播里"不小心"透露："听说有个网红工作室正在被查账，牵扯阴阳合同。"圈内群炸了锅，指向冷冰凝早期的工作室。她两年前确实签过一份数字对不上的合同——当时没人在意，现在有人举报了。',
    emoji: '🏛️',
    forArtist: 'influencer',
    minDay: 8,
    choices: [
      {
        id: 'self_report_补税',
        text: '主动投案补税',
        subtext: '找税务局登门补缴 + 滞纳金 (-80万)',
        requireMinMoney: 800000,
        outcome: {
          narration: '在被传唤之前，你陪冷冰凝带着账本去了税务局。主动补缴 80 万（本税 + 滞纳金 + 罚款）。税务局出了一张"已配合核查"的函。三天后她发微博："感谢这次提醒，我以后会更严格。"把丑事包装成了成长。',
          statChanges: { money: -800000, prRisk: -5, fanLoyalty: 4, commercialValue: -3 },
          unlockTag: 'self_reported_tax',
        },
      },
      {
        id: 'hire_tax_fixer',
        text: '找关系"摆平"',
        subtext: '托中间人打点 (-30万，高风险)',
        requireMinMoney: 300000,
        outcome: {
          narration: '钱转给了一个号称"有关系"的中介。一周后账面上没动静，你以为事情过去了——直到两天后税务局的正式通知直接寄到了工作室。中介人间蒸发，钱打了水漂。',
          statChanges: { money: -300000, prRisk: 15, fanLoyalty: -5, commercialValue: -3 },
          unlockTag: 'fixer_scammed',
        },
      },
      {
        id: 'deny_and_wait',
        text: '否认并等风头过',
        subtext: '"谣言止于智者"',
        outcome: {
          narration: '你发了声明否认被查。但一个月后，网信办通报"某带货主播因偷逃税被补缴并罚款"——虽然没点名，但金额和工作室位置都对上了。这下被动了。',
          statChanges: { prRisk: 18, fanLoyalty: -12, commercialValue: -6 },
          unlockTag: 'tax_scandal_public',
        },
      },
    ],
  },
  {
    id: 'influencer_peer_reports',
    category: 'crisis',
    severity: 'critical',
    title: '同行实名举报她阴阳合同',
    description: '一个过气网红录了一段 8 分钟视频，手里拿着她两年前的一份合同扫描件——两个金额相差 600 万。"这就是冷冰凝当年接的 XX 代言的阴阳合同，小的报税用，大的实际收款。证据都在这里，我愿意配合调查。"视频当晚播放破五千万。',
    emoji: '🎬',
    forArtist: 'influencer',
    minDay: 12,
    choices: [
      {
        id: 'counter_sue_peer',
        text: '起诉同行诽谤',
        subtext: '合同确实有瑕疵，但先把对方压住 (-20万)',
        requireMinMoney: 200000,
        outcome: {
          narration: '律师函发出，对方三天内主动撤下了视频。但截图已经流出。事情一时压住了，但你知道对方手里可能还有别的。这种压法最多管两个月。',
          statChanges: { money: -200000, prRisk: 5, fanLoyalty: -3 },
          unlockTag: 'peer_muted',
        },
      },
      {
        id: 'full_public_apology',
        text: '直播公开道歉 + 补税',
        subtext: '开两小时直播坦白 + 全额补缴 (-150万)',
        requireMinMoney: 1500000,
        outcome: {
          narration: '她开了一场两小时直播，从当年为什么签阴阳合同、到后来为什么没主动纠正、到现在决定全额补缴 150 万，讲得很诚恳。网友褒贬不一，但"敢直播道歉"这件事本身救了她一半。',
          statChanges: { money: -1500000, prRisk: -8, fanLoyalty: 5, commercialValue: -5 },
          unlockTag: 'live_confession_tax',
        },
      },
      {
        id: 'redirect_attention',
        text: '放大招转移注意',
        subtext: '花钱造一个正面大瓜盖过去 (-50万)',
        requireMinMoney: 500000,
        outcome: {
          narration: '你紧急找了一家影视公司买了一个"冷冰凝零片酬出演公益微电影"的通稿，同时买了一轮热搜。注意力确实被转移了三天——然后更大的瓜被人继续爆出来，她的公益通稿反而显得"此地无银"。',
          statChanges: { money: -500000, prRisk: 8, fanLoyalty: -3 },
          unlockTag: 'distract_failed',
        },
      },
    ],
  },
];
