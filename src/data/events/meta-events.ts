import type { GameEvent } from '@/types/game';

/**
 * 新事件设计原则：
 * 1. 每个选项都有 conditionalOutcomes（根据当前属性走不同分支）
 * 2. 关键选项加入 twist（随机反转）
 * 3. 没有"绝对正确"的选择，只有"在当前状态下相对合适"的选择
 * 4. 同一选项在不同情境下可能完全相反的结果
 */

export const metaEvents: GameEvent[] = [
  // ===== 事件1：站姐威胁 =====
  // 核心机制：妥协可能养虎为患，强硬可能两败俱伤，玩梗可能神来之笔也可能翻车
  {
    id: 'meta_fansite_blackmail',
    category: 'crisis',
    severity: 'high',
    title: '站姐手里有黑图',
    description: '你的大站姐（粉丝头子）私信你："后台独家拍摄权，或者这张素颜崩图——你选。"那张图确实挺崩的，黑眼圈+双下巴+死亡角度。她给了你一晚上考虑。',
    emoji: '📸',
    minDay: 6,
    choices: [
      {
        id: 'compromise_fansite',
        text: '妥协，给站姐 backstage 权限',
        subtext: '花钱买平安',
        outcome: {
          narration: '你让步了。站姐拿到了独家图，发了九宫格精修，粉丝狂欢。',
          statChanges: { fanLoyalty: 3, commercialValue: 2, money: -15000 },
          // 随机反转：这次妥协开了坏头
          twist: {
            chance: 0.4,
            narration: '但是！其他站姐知道了这件事，纷纷私信你"我也要"。你现在有8个站姐在排队威胁你，不给就联合放黑图。养虎为患了属于是。',
            statChanges: { prRisk: 8, money: -40000 },
            unlockTag: 'fansite_mafia',
          },
        },
      },
      {
        id: 'refuse_fansite',
        text: '拒绝，赌她不敢真发',
        subtext: '硬刚到底',
        outcome: {
          narration: '你回了一个"随你"。',
          statChanges: {},
          // 条件分支：取决于粉丝忠诚度
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 65 },
              narration: '站姐真的发了黑图。但你的核心粉丝战斗力惊人，评论区瞬间被"素颜也可爱""拒绝容貌焦虑"刷屏。黑图反而成了虐粉素材，粉丝忠诚度再涨一波。站姐气得删博。',
              statChanges: { fanLoyalty: 5, prRisk: -3 },
            },
            {
              condition: { maxFanLoyalty: 35 },
              narration: '站姐发了黑图。你的粉丝本来就没几个，评论区全是路人的"哈哈哈哈"和"原来长这样"。站姐还补刀："脱粉了，真人和精修差太远。"毁灭性打击。',
              statChanges: { fanLoyalty: -8, commercialValue: -5, prRisk: 6 },
            },
          ],
          // 随机反转：站姐其实是你对家派来的
          twist: {
            chance: 0.25,
            narration: '但是！你调查发现这个"站姐"其实是你对家雇的职业黑粉，专门养号等这一天。你反手把证据发给八卦号，舆论瞬间反转。你的艺人成了"被有组织抹黑"的受害者。',
            statChanges: { prRisk: -5, fanLoyalty: 4, commercialValue: 3 },
          },
        },
      },
      {
        id: 'self_roast_fansite',
        text: '艺人先发制人，自己发丑照',
        subtext: '走黑粉的路让黑粉无路可走',
        outcome: {
          narration: '艺人发了一条微博：配图是更丑的自拍，文字"听说有人要发我黑图？我自己来，卷死你们😎"。',
          statChanges: { fanLoyalty: 4, prRisk: -2 },
          // 条件分支：取决于艺人的"人设类型"
          conditionalOutcomes: [
            {
              // 偶像型艺人玩这个梗效果更好
              condition: { minFanLoyalty: 50 },
              narration: '粉丝被这波操作秀到了，"我家哥哥/姐姐太会了"刷屏。路人也觉得有趣，"最懂互联网的明星"话题上了热搜。',
              statChanges: { commercialValue: 4, fanLoyalty: 3 },
            },
            {
              // 演员型艺人玩这个可能显得不专业
              condition: { maxFanLoyalty: 40, minCommercialValue: 50 },
              narration: '但你的艺人是走"实力派演员"路线的，这种网红玩法让一些业内人士皱眉。"不够严肃"的评价开始在圈内流传。',
              statChanges: { commercialValue: -3, prRisk: 2 },
            },
          ],
          // 随机反转：真的还有更丑的
          twist: {
            chance: 0.2,
            narration: '但是！站姐被你激怒了，放出了你没想到的存货——艺人刚睡醒的素颜视频，还有打呼的声音。"你以为这就是最丑的？"这波是自爆卡车了。',
            statChanges: { prRisk: 6, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'buy_fansite',
        text: '花钱买断所有底片',
        subtext: '一次性解决 (-5万)',
        requireMinMoney: 50000,
        outcome: {
          narration: '你转了5万，站姐删了底片，签了保密协议。',
          statChanges: { money: -50000 },
          // 条件分支：取决于资金充裕程度
          conditionalOutcomes: [
            {
              condition: { minMoney: 200000 },
              narration: '5万对你来说不算什么，买个安心。站姐还变成了你的"御用摄影师"，以后只发精修图。',
              statChanges: { fanLoyalty: 2, commercialValue: 2 },
            },
            {
              condition: { maxMoney: 80000 },
              narration: '这5万几乎掏空了你的流动资金。接下来几天你不得不推掉几个需要垫资的活动，错失了一些机会。',
              statChanges: { commercialValue: -3, money: -50000 },
            },
          ],
          // 随机反转：站姐留了备份
          twist: {
            chance: 0.3,
            narration: '但是！三个月后，当你以为这事过去了，站姐又来找你要钱——"我忘了云盘里还有备份，这次要10万"。你意识到这是个无底洞。',
            statChanges: { prRisk: 5 },
            unlockTag: 'fansite_endless_blackmail',
          },
        },
      },
    ],
  },

  // ===== 事件2：狗仔预告瓜 =====
  // 核心机制：信息不完全，玩家需要赌概率和判断形势
  {
    id: 'meta_paparazzi_teaser',
    category: 'breaking',
    severity: 'critical',
    title: '狗仔发预告：明天12点，顶流恋情',
    description: '知名狗仔@吃瓜少女张小寒 发微博："明天中午12点，顶流恋情，有图有真相，不塌房你找我。"配图是一个剪影。全网都在猜是谁，你的艺人名字出现在评论区前排。你私信狗仔，对方已读不回。',
    emoji: '🍉',
    isBreaking: true,
    minDay: 8,
    choices: [
      {
        id: 'buy_paparazzi',
        text: '联系狗仔买料',
        subtext: '花钱消灾 (-8万)',
        requireMinMoney: 80000,
        outcome: {
          narration: '你转了8万，狗仔删了微博，说"明天发别的瓜"。',
          statChanges: { money: -80000 },
          // 条件分支：取决于当前舆论风险
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 25 },
              narration: '你的艺人平时口碑很好，"被狗仔盯上"反而成了话题。粉丝心疼："我们XX太红了，狗仔都盯着"。路人好感度上升。',
              statChanges: { fanLoyalty: 3, commercialValue: 2 },
            },
            {
              condition: { minPrRisk: 60 },
              narration: '但你的艺人最近本来就风波不断，"花钱买平安"的消息不知怎么走漏了，"心虚才花钱"的评论刷屏。',
              statChanges: { prRisk: 5, fanLoyalty: -3 },
            },
          ],
          // 随机反转：狗仔收了钱还是发了
          twist: {
            chance: 0.15,
            narration: '但是！狗仔收了你的钱，还是发了——只是延迟了两天，还加价说"这是新的料，上次那个另算"。你遇到了职业骗子。',
            statChanges: { prRisk: 8, money: -80000, fanLoyalty: -4 },
          },
        },
      },
      {
        id: 'misdirect_paparazzi',
        text: '放烟雾弹，混淆视听',
        subtext: '让营销号带节奏说是别人',
        outcome: {
          narration: '你让几个营销号发"据知情人透露，明天的瓜是YY不是XX"。',
          statChanges: { money: -20000 },
          // 条件分支：取决于商业价值（资源多少决定营销号听不听你的）
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 60 },
              narration: '你的资源够多，营销号很配合。YY的粉丝开始紧张，你的粉丝松了一口气。第二天狗仔发的确实是YY——你赌对了。',
              statChanges: { prRisk: -5, fanLoyalty: 4 },
            },
            {
              condition: { maxCommercialValue: 40 },
              narration: '但你现在话语权不够，营销号发了但没人信。更糟糕的是，YY的团队发现了是你在带节奏，直接发声明警告"造谣必究"。',
              statChanges: { prRisk: 6, commercialValue: -3 },
            },
          ],
          // 随机反转：YY真的是明天的瓜
          twist: {
            chance: 0.3,
            narration: '但是！第二天狗仔发的真的是YY——你纯属瞎猫碰上死耗子。YY的团队怀疑是你搞鬼，两家关系彻底恶化。',
            statChanges: { prRisk: 4 },
            unlockTag: 'rival_yy_hostile',
          },
        },
      },
      {
        id: 'wait_and_see_paparazzi',
        text: '什么都不做，等明天',
        subtext: '50%概率不是你',
        outcome: {
          narration: '你选择了等待。',
          statChanges: {},
          // 纯随机结果
          conditionalOutcomes: [
            {
              // 50%概率不是你（通过随机逻辑在engine中实现，这里用条件模拟）
              condition: { maxPrRisk: 50 },
              narration: '第二天12点，狗仔发的是另一位顶流。你的粉丝在评论区刷屏"还好不是我们家"。虚惊一场，但你也什么都没做，错失了虐粉固粉的机会。',
              statChanges: { fanLoyalty: -2 },
            },
            {
              condition: { minPrRisk: 50 },
              narration: '第二天12点，狗仔发的真的是你的艺人——和某网红的亲密照。你因为没有提前准备，回应慢了半拍，舆论已经发酵。',
              statChanges: { prRisk: 8, fanLoyalty: -5, commercialValue: -4 },
            },
          ],
        },
      },
      {
        id: 'preemptive_confession',
        text: '让艺人先发"单身声明"',
        subtext: '提前占领舆论高地',
        outcome: {
          narration: '艺人发了一条微博："最近有人说我恋爱了？我澄清一下，是真的——我爱的是我的粉丝们😘"。',
          statChanges: { fanLoyalty: 3 },
          // 条件分支：取决于粉丝吃不吃这套
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 60 },
              narration: '粉丝吃这套，评论区全是"我也爱你"。第二天狗仔的料发出来，粉丝已经有了"不信谣不传谣"的心理准备，冲击被大大削弱。',
              statChanges: { prRisk: -3 },
            },
            {
              condition: { maxFanLoyalty: 35 },
              narration: '但你的粉丝不吃这套油腻话术，"别来这套""有这时间不如多营业"的评论被顶到前排。第二天狗仔的料一发，粉丝反而觉得"原来是真的，难怪提前打预防针"。',
              statChanges: { fanLoyalty: -4, prRisk: 4 },
            },
          ],
          // 随机反转：真的有恋情
          twist: {
            chance: 0.25,
            narration: '但是！狗仔发的料是真的——艺人确实在偷偷恋爱，而且对象就是微博里说的"粉丝们"中的某一个（大粉转正的狗血剧情）。你的单身声明变成了打脸现场。',
            statChanges: { prRisk: 10, fanLoyalty: -8, commercialValue: -5 },
          },
        },
      },
    ],
  },

  // ===== 事件3：综艺恶剪 =====
  // 核心机制：回应方式决定舆论走向，但没有完美答案
  {
    id: 'meta_edit_drama',
    category: 'crisis',
    severity: 'high',
    title: '综艺恶剪上热搜',
    description: '昨晚播出的综艺里，你的艺人被剪成了一个"没礼貌、爱抢镜、对前辈翻白眼"的作精。实际上录制时完全不是那样——翻白眼是因为眼睛进东西了，抢镜是导演安排的。但观众只信正片。#XX没素质# 正在热搜上爬。',
    emoji: '🎬',
    minDay: 7,
    choices: [
      {
        id: 'explain_edit',
        text: '发长文解释"被恶剪"',
        subtext: '还原事实真相',
        outcome: {
          narration: '你发了长文，附上了现场工作人员的证词，解释翻白眼是因为眼睛进了睫毛。',
          statChanges: {},
          // 条件分支：取决于当前舆论风险值
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 30 },
              narration: '你的艺人平时口碑够好，路人愿意相信。"恶剪害人"的话题上了热搜，节目组被迫出来道歉。',
              statChanges: { prRisk: -4, fanLoyalty: 4 },
            },
            {
              condition: { minPrRisk: 55 },
              narration: '但你的艺人最近本来就争议不断，"玩不起别上综艺""每个明星都说自己被恶剪"的评论刷屏。解释变成了狡辩。',
              statChanges: { prRisk: 5, fanLoyalty: -3 },
            },
          ],
          // 随机反转：节目组放出未播片段
          twist: {
            chance: 0.35,
            narration: '但是！节目组为了自保，放出了未播片段——虽然证明了翻白眼确实是因为眼睛进东西，但也暴露了你的艺人在休息时吐槽其他嘉宾的画面。越描越黑。',
            statChanges: { prRisk: 6, commercialValue: -3 },
          },
        },
      },
      {
        id: 'embrace_villain',
        text: '顺势接"作精"人设',
        subtext: '黑红也是红',
        outcome: {
          narration: '艺人发了一条微博："作精？这都被你们发现了😏"配了一张翻白眼的自拍。',
          statChanges: { commercialValue: 4, fanLoyalty: -3 },
          // 条件分支：取决于艺人类型
          conditionalOutcomes: [
            {
              // 网红转型艺人更适合这种玩法
              condition: { minFanLoyalty: 40, maxCommercialValue: 50 },
              narration: '你的艺人本来就是网红出身，懂互联网玩法。"作精人设"反而成了记忆点，综艺邀约暴增——"就想看看TA有多作"。',
              statChanges: { commercialValue: 6, prRisk: 2 },
            },
            {
              // 实力演员不适合
              condition: { minCommercialValue: 60 },
              narration: '但你的艺人是走"实力派演员"路线的，这种网红玩法让导演和制片方皱眉。"不够专业"的评价传开了，丢了一个正剧资源。',
              statChanges: { commercialValue: -5, prRisk: 3 },
            },
          ],
          // 随机反转：真变成万人嫌
          twist: {
            chance: 0.25,
            narration: '但是！"作精人设"接过头了。其他艺人开始公开避嫌，"不想和XX同台"的传言四起。你创造了一只怪物，现在控制不住它了。',
            statChanges: { commercialValue: -4, fanLoyalty: -5 },
          },
        },
      },
      {
        id: 'sue_show',
        text: '法律手段，起诉节目组',
        subtext: '用律师函说话',
        outcome: {
          narration: '律师函发了，要求节目组删除片段并道歉。',
          statChanges: { money: -35000 },
          // 条件分支：取决于资金
          conditionalOutcomes: [
            {
              condition: { minMoney: 150000 },
              narration: '你的资金充裕，请得起顶级律师团队。节目组怕了，连夜重新剪辑并公开道歉。',
              statChanges: { prRisk: -5, fanLoyalty: 3 },
            },
            {
              condition: { maxMoney: 100000 },
              narration: '但你现在资金紧张，律师团队不够强。节目组反咬你"炒作"，官司拖了半年还没结果，舆论早就翻篇了。',
              statChanges: { prRisk: 4, money: -35000, commercialValue: -3 },
            },
          ],
          // 随机反转：节目组有后台
          twist: {
            chance: 0.3,
            narration: '但是！这个综艺是平台S级项目，背后有资本撑腰。你的官司被无限期拖延，还被平台"软性封杀"——以后上不了这个平台的任何节目了。',
            statChanges: { commercialValue: -6, prRisk: 3 },
            unlockTag: 'platform_blacklist',
          },
        },
      },
      {
        id: 'other_guest_help',
        text: '找同场嘉宾帮忙澄清',
        subtext: '让前辈/其他嘉宾发声',
        outcome: {
          narration: '你联系了同场的一位前辈艺人，请求帮忙说句话。',
          statChanges: {},
          // 条件分支：取决于商业价值（人脉资源）
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 55 },
              narration: '你的咖位够大，前辈愿意卖你面子，发了一条"XX很礼貌，现场很照顾我们"的微博。舆论开始反转。',
              statChanges: { prRisk: -4, fanLoyalty: 3 },
            },
            {
              condition: { maxCommercialValue: 40 },
              narration: '但你现在不够红，前辈的经纪人说"不方便参与争议"。你体会到了什么叫"人走茶凉"。',
              statChanges: { prRisk: 3, commercialValue: -2 },
            },
          ],
          // 随机反转：前辈也翻车
          twist: {
            chance: 0.2,
            narration: '但是！前辈帮你发声后，TA自己的黑历史被扒出来了——原来这位"德高望重"的前辈也有不少料。你们俩一起挂在热搜上，组成了"难兄难弟"。',
            statChanges: { prRisk: 6, fanLoyalty: -2 },
          },
        },
      },
    ],
  },

  // ===== 事件4：品牌方背刺 =====
  // 核心机制：短期利益 vs 长期信誉的博弈
  {
    id: 'meta_brand_crisis',
    category: 'crisis',
    severity: 'high',
    title: '代言品牌翻车了',
    description: '你艺人代言的奶茶品牌被爆出使用过期原料、员工不戴手套操作。现在全网都在@你的艺人："你喝的也是这个吗？""代言人不出来走两步？"品牌方还没回应，你的手机已经被粉丝和品牌方同时打爆了。',
    emoji: '🧋',
    minDay: 6,
    choices: [
      {
        id: 'terminate_contract',
        text: '立刻解约',
        subtext: '划清界限',
        outcome: {
          narration: '你发了声明，宣布立即终止合作。',
          statChanges: { money: -60000 }, // 违约金
          // 条件分支：取决于响应速度
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 35 },
              narration: '你的响应速度够快，在舆论彻底发酵前完成了切割。"有担当"的评价刷屏，粉丝觉得你没有为了钱不顾底线。',
              statChanges: { fanLoyalty: 5, prRisk: -3 },
            },
            {
              condition: { minPrRisk: 60 },
              narration: '但你之前已经有很多争议，"现在知道切割了，之前拿钱的时候怎么不说"的评论被顶到前排。',
              statChanges: { fanLoyalty: -3, prRisk: 3 },
            },
          ],
          // 随机反转：品牌方反咬
          twist: {
            chance: 0.3,
            narration: '但是！品牌方急了，发声明说"代言人提前知情并参与宣传策划"，暗示你也知道原料问题。你们开始互撕，场面更难看了。',
            statChanges: { prRisk: 8, commercialValue: -5 },
          },
        },
      },
      {
        id: 'inspect_store',
        text: '艺人去门店"突击检查"',
        subtext: '反向营销，赌一把',
        outcome: {
          narration: '艺人戴着口罩突袭了一家门店，全程直播检查原料日期、操作流程。',
          statChanges: { money: -10000 },
          // 条件分支：取决于检查结果（随机性）
          conditionalOutcomes: [
            {
              // 假设50%概率检查通过
              condition: { maxPrRisk: 50 },
              narration: '检查的这家门店意外地规范，原料都是新鲜的。"被冤枉了"的舆论开始发酵，品牌方趁机反击是"恶意竞争抹黑"。',
              statChanges: { commercialValue: 3, fanLoyalty: 3, prRisk: -2 },
            },
            {
              condition: { minPrRisk: 50 },
              narration: '检查的门店确实有问题——过期原料就藏在柜台下面。你的艺人当场脸色铁青，直播变成了"实锤现场"。毁灭性翻车。',
              statChanges: { prRisk: 10, fanLoyalty: -6, commercialValue: -5 },
            },
          ],
          // 随机反转：被质疑是摆拍
          twist: {
            chance: 0.25,
            narration: '但是！网友扒出你检查的那家门店是"样板店"，其他门店的问题更严重。"作秀""洗白"的批评铺天盖地。',
            statChanges: { prRisk: 6, fanLoyalty: -4 },
          },
        },
      },
      {
        id: 'silent_brand',
        text: '装死，等风头过去',
        subtext: '不回应就是没发生',
        outcome: {
          narration: '你选择了沉默。',
          statChanges: {},
          // 条件分支：取决于粉丝忠诚度
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 70 },
              narration: '你的核心粉丝战斗力惊人，自发控评"等官方调查结果"。三天后新的热搜盖过了这件事，你侥幸过关。',
              statChanges: { fanLoyalty: -2 },
            },
            {
              condition: { maxFanLoyalty: 40 },
              narration: '但你的粉丝不够多，控不住评。"装死""心虚"的骂声持续了一周，品牌方最终也解约了——双方都不体面。',
              statChanges: { prRisk: 6, commercialValue: -4, fanLoyalty: -4 },
            },
          ],
          // 随机反转：被扒出还在代言
          twist: {
            chance: 0.4,
            narration: '但是！一周后，网友发现你的艺人还在用该品牌的产品发微博（之前签的自动发布）。"一边说等调查一边继续收钱"的截图疯传。',
            statChanges: { prRisk: 7, fanLoyalty: -5 },
          },
        },
      },
      {
        id: 'donate_compensation',
        text: '捐出全部代言费',
        subtext: '把钱给受害者/公益 (-代言费)',
        requireMinMoney: 0, // 特殊逻辑：捐出的是已收到的代言费
        outcome: {
          narration: '你宣布把该品牌的全部代言费捐给食品安全公益组织。',
          statChanges: { money: -80000 },
          // 条件分支：取决于资金是否充裕
          conditionalOutcomes: [
            {
              condition: { minMoney: 150000 },
              narration: '你的资金充裕，这波操作堪称教科书级别。"有担当有格局"的评价刷屏，甚至有几个高端品牌主动接触你。',
              statChanges: { fanLoyalty: 6, commercialValue: 4, prRisk: -5 },
            },
            {
              condition: { maxMoney: 100000 },
              narration: '但这笔钱对你来说不是小数目，捐完之后现金流紧张。虽然赢得了口碑，但接下来的运营捉襟见肘。',
              statChanges: { fanLoyalty: 4, prRisk: -3, money: -80000, commercialValue: -2 },
            },
          ],
          // 随机反转：被质疑是作秀
          twist: {
            chance: 0.2,
            narration: '但是！有人质疑你"捐出去的钱最后还是回到自己口袋"（通过关联基金会）。虽然没有证据，但质疑声不断。',
            statChanges: { prRisk: 4 },
          },
        },
      },
    ],
  },

  // ===== 事件5：小号被扒 =====
  // 核心机制：真实人设 vs 完美人设的冲突
  {
    id: 'meta_alt_account',
    category: 'crisis',
    severity: 'medium',
    title: '艺人的微博小号被扒了',
    description: '网友通过手机号关联、同款表情包、相似的打字习惯，扒出了你艺人的微博小号。小号里全是深夜emo、追星日常、吐槽"今天经纪人又逼我营业"，还有一条："其实我觉得XX（对家）的新歌还不错，不敢在大号说"。粉丝正在疯狂截图。',
    emoji: '🕵️',
    minDay: 5,
    choices: [
      {
        id: 'embrace_alt',
        text: '承认小号，走"真实人设"',
        subtext: '小号变官方二号',
        outcome: {
          narration: '艺人发了一条微博："好吧被你们发现了，那是我发泄情绪的小角落。以后还在那说话，别嫌我烦。"',
          statChanges: { fanLoyalty: 4, prRisk: -2 },
          // 条件分支：取决于吐槽经纪人的那条
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 60 },
              narration: '粉丝觉得"吐槽经纪人"那条特别真实可爱，"原来明星也烦上班"成了热梗。你和艺人的关系反而成了粉丝津津乐道的话题。',
              statChanges: { fanLoyalty: 5, commercialValue: 2 },
            },
            {
              condition: { maxFanLoyalty: 35 },
              narration: '但你的粉丝不够铁，"连经纪人都吐槽，人品有问题"的评论被顶上来。路人也开始质疑你的专业能力。',
              statChanges: { fanLoyalty: -3, commercialValue: -3 },
            },
          ],
          // 随机反转：小号还有更劲爆的
          twist: {
            chance: 0.3,
            narration: '但是！网友继续深挖小号，发现了一条半年前的吐槽："今天的活动好烦，粉丝好吵"。虽然只是一时情绪，但"嫌弃粉丝"的标签贴上了。',
            statChanges: { fanLoyalty: -7, prRisk: 5 },
          },
        },
      },
      {
        id: 'deny_alt',
        text: '否认："被盗号了/不是本人"',
        subtext: '硬不承认',
        outcome: {
          narration: '工作室发了声明，说那个账号"疑似被盗，内容非本人发布"。',
          statChanges: { prRisk: 4 },
          // 条件分支：取决于证据是否确凿
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 30 },
              narration: '你的艺人平时形象够好，粉丝愿意相信。虽然路人半信半疑，但热度很快过去了。',
              statChanges: { fanLoyalty: -2 },
            },
            {
              condition: { minPrRisk: 55 },
              narration: '但证据太确凿了（手机号、设备ID都对得上），"盗号"的说法没人信。"敢做不敢当"的评价让口碑雪上加霜。',
              statChanges: { prRisk: 6, fanLoyalty: -5 },
            },
          ],
          // 随机反转：对家出来认领
          twist: {
            chance: 0.2,
            narration: '但是！你否认之后，对家艺人YY突然发了一条微博："谢谢XX喜欢我新歌，我也觉得你不错😉"。你的艺人小号夸YY的事被坐实，两边粉丝开始组CP，局面更复杂了。',
            statChanges: { fanLoyalty: -4, commercialValue: 3, prRisk: 3 },
          },
        },
      },
      {
        id: 'abandon_alt',
        text: '弃号，从此不再更新',
        subtext: '就当没存在过',
        outcome: {
          narration: '你让艺人弃用了那个小号，不再更新。',
          statChanges: { fanLoyalty: -2 },
          // 条件分支：取决于粉丝反应
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 65 },
              narration: '核心粉丝虽然遗憾失去了一个"窥视真实"的窗口，但也理解艺人的选择。"保护隐私"的话题上了热搜。',
              statChanges: { prRisk: -2 },
            },
            {
              condition: { maxFanLoyalty: 40 },
              narration: '但路人粉和吃瓜网友不买单，"心虚才弃号""肯定还有更大的瓜"的猜测四起。',
              statChanges: { prRisk: 4 },
            },
          ],
          // 随机反转：小号被人接管
          twist: {
            chance: 0.25,
            narration: '但是！弃号三个月后，那个小号突然又开始更新了——被人盗号/卖了。内容变成了营销号风格，还"爆料"了很多假消息。你失去了控制权。',
            statChanges: { prRisk: 6 },
            unlockTag: 'alt_account_hijacked',
          },
        },
      },
      {
        id: 'self_deprecating_alt',
        text: '玩梗自嘲，复刻小号内容',
        subtext: '走黑粉的路',
        outcome: {
          narration: '艺人在大号发了一条："既然被发现了，那我就不装了。今天经纪人又逼我营业了，烦😤"，配图是小号同款表情包。',
          statChanges: { fanLoyalty: 5, commercialValue: 2 },
          // 条件分支：取决于艺人的"网感"
          conditionalOutcomes: [
            {
              // 网红/偶像型艺人更适合
              condition: { maxCommercialValue: 55 },
              narration: '你的艺人懂互联网，这个梗玩得恰到好处。"最会玩梗的明星"上了热搜，甚至有几个综艺邀约专门冲这个梗来的。',
              statChanges: { commercialValue: 5, fanLoyalty: 3 },
            },
            {
              // 实力演员可能显得掉价
              condition: { minCommercialValue: 70 },
              narration: '但你的艺人是走"实力派"路线的，这种网红玩法让一些导演皱眉。"不够严肃"的评价传开了，丢了一个正剧试镜机会。',
              statChanges: { commercialValue: -4, prRisk: 2 },
            },
          ],
          // 随机反转：玩过头了
          twist: {
            chance: 0.2,
            narration: '但是！玩梗玩过头了。艺人之后每次发正经内容，评论区全是"又被迫营业了？""烦就别干了"。人设反噬，正经工作被玩梗淹没。',
            statChanges: { commercialValue: -3, fanLoyalty: -3 },
          },
        },
      },
    ],
  },
];

export default metaEvents;
