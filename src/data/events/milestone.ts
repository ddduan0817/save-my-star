import type { GameEvent } from '@/types/game';

// 数值里程碑事件：当某项数值达到阈值时自动触发
export const milestoneEvents: GameEvent[] = [
  // ===== 高商业价值触发 =====
  {
    id: 'milestone_brand_war',
    category: 'business',
    severity: 'high',
    title: '品牌方开始抢人了！',
    description: '你的艺人商业价值太高了，三家一线品牌同时发来邀约，互相抬价。这种局面看着美好，但选了一家就得罪另外两家。',
    emoji: '💎',
    statConditions: { minCommercialValue: 70 },
    minDay: 8,
    choices: [
      {
        id: 'auction_brands',
        text: '让他们竞价',
        subtext: '坐收渔翁之利',
        outcome: {
          narration: '三家品牌轮番加价，最终你以天价签下了其中一家。但另外两家市场总监放话“以后别来找我们”。短期暴赚，长期断路。',
          statChanges: { money: 200000, commercialValue: -3, prRisk: 3 },
        },
      },
      {
        id: 'bundle_deal',
        text: '打包合作',
        subtext: '三家都接但降低排他',
        outcome: {
          narration: '你谈了一个“非排他”合作方案，三家都接了但费用打了折。圈内人说你“既精明又不得罪人”，好评。',
          statChanges: { money: 120000, commercialValue: 3, fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'milestone_sky_high_bet',
    category: 'business',
    severity: 'high',
    title: '天价代言！但有对赌条款',
    description: '有品牌开出千万级代言费，但合同里藏着对赌条款：如果代言期内出任何负面新闻，不仅没钱拿还要倒赔。你的艺人现在商业价值顶天，但风险永远在路上。',
    emoji: '📈',
    statConditions: { minCommercialValue: 75 },
    minDay: 8,
    choices: [
      {
        id: 'sign_bet',
        text: '签！赌一把',
        subtext: '高风险高回报',
        outcome: {
          narration: '合同签了，千万代言费到账！但从今天起你得确保不出任何差错，否则赔到倾家荡产。这种合同，一般人真不敢签。',
          statChanges: { money: 300000, prRisk: 3 },
          unlockTag: 'high_bet_contract',
        },
      },
      {
        id: 'pass_bet',
        text: '太冒险了',
        subtext: '稳扎稳打更重要',
        outcome: {
          narration: '你拒绝了对赌条款。品牌方尊重你的决定，改用常规合同，费用砍了一半但没有风险。做人嘛，求个安稳。',
          statChanges: { money: 100000, commercialValue: 3 },
        },
      },
    ],
  },

  // ===== 高粉丝忠诚度触发 =====
  {
    id: 'milestone_fan_cult',
    category: 'crisis',
    severity: 'medium',
    title: '粉丝行为开始失控了',
    description: '粉丝忠诚度太高了，高到出了问题。后援会开始自发“净化”任何批评你艺人的声音，甚至有人去线下堵批评过你的博主。“饭圈暴力”的标签已经贴上来了。',
    emoji: '😤',
    statConditions: { minFanLoyalty: 75 },
    minDay: 8,
    choices: [
      {
        id: 'rein_in_fans',
        text: '公开呼吁理性',
        subtext: '发长文制止过激行为',
        outcome: {
          narration: '艺人发了一条很认真的微博呼吁理性追星。大部分粉丝收到了信号，但也有人觉得“偶像不站我们这边了”，小幅脱粉。',
          statChanges: { fanLoyalty: -5, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'turn_blind_eye',
        text: '装没看见',
        subtext: '粉丝多总比粉丝少好',
        outcome: {
          narration: '你选择无视，但事情越闹越大。一个被粉丝网暴的博主把事情闹上了新闻，“XX纵容粉丝暴力”的报道出来了。',
          statChanges: { prRisk: 6, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'milestone_fan_split',
    category: 'drama',
    severity: 'high',
    title: '粉丝内部分裂了！',
    description: '粉丝群体太庞大了，内部开始出现严重分歧。“唯粉”和“CP粉”互相开撕，“事业粉”和“颜值粉”也在吵。超话里每天都是内战。',
    emoji: '💔',
    statConditions: { minFanLoyalty: 70 },
    minDay: 8,
    choices: [
      {
        id: 'unify_message',
        text: '统一口径',
        subtext: '发布官方粉丝守则',
        outcome: {
          narration: '工作室发布了“理性追星公约”，大部分人表示支持。但总有人觉得“凭什么管我们”，小规模脱粉不可避免。',
          statChanges: { fanLoyalty: -3, prRisk: -3 },
        },
      },
      {
        id: 'let_fight',
        text: '不管了',
        subtext: '粉丝的事粉丝自己解决',
        outcome: {
          narration: '内战越打越凶，终于闹出了圈。路人看到的不是“粉丝多”而是“粉丝疯”。品牌方开始担忧了。',
          statChanges: { prRisk: 5, commercialValue: -3, fanLoyalty: -3 },
        },
      },
    ],
  },

  // ===== 低资金触发 =====
  {
    id: 'milestone_broke',
    category: 'crisis',
    severity: 'high',
    title: '账上没钱了！工资发不出来',
    description: '这个月的团队工资、场地租金、造型费加起来还差一大截。助理已经在问“老板，工资什么时候发”。你的信用卡账单也在哭。',
    emoji: '💸',
    statConditions: { maxMoney: 50000 },
    minDay: 5,
    choices: [
      {
        id: 'take_bad_gig',
        text: '接一个烂活救急',
        subtext: '商场开业剪彩 +钱',
        outcome: {
          narration: '你让艺人去了一个三线城市商场剪彩。钱到手了，但“XX沦落到剪彩了”的帖子也出来了。活着最重要吧。',
          statChanges: { money: 80000, commercialValue: -3, prRisk: 3 },
        },
      },
      {
        id: 'borrow_money',
        text: '找圈内人借钱',
        subtext: '欠人情也比破产好',
        outcome: {
          narration: '一个老朋友借了你一笔钱，暂时渡过难关。但人情债是最难还的，他说“以后有好资源记得带上我”。',
          statChanges: { money: 100000 },
        },
      },
    ],
  },
  {
    id: 'milestone_debt_collector',
    category: 'crisis',
    severity: 'critical',
    title: '债主找上门了',
    description: '之前投资的项目赔了，加上团队运营成本，你已经严重亏损。债主开始催款，如果不想办法弄到钱，可能要面临法律诉讼了。',
    emoji: '⚠️',
    statConditions: { maxMoney: 20000 },
    minDay: 7,
    choices: [
      {
        id: 'sell_rights',
        text: '卖掉部分版权',
        subtext: '用音乐/影视版权换钱',
        outcome: {
          narration: '你忍痛卖掉了几首歌的版权，钱暂时够了。但以后这些作品赚的钱就跟你没关系了。断臂求生。',
          statChanges: { money: 150000, commercialValue: -3 },
        },
      },
      {
        id: 'emergency_livestream',
        text: '紧急直播带货',
        subtext: '先活下来再说',
        outcome: {
          narration: '一场紧急直播带货，效果出奇地好，可能是因为大家从没见过你的艺人这么“拼命”。“含泪带货”上了热搜。',
          statChanges: { money: 120000, fanLoyalty: 3, commercialValue: -3, prRisk: 3 },
        },
      },
    ],
  },

  // ===== 高风险触发 =====
  {
    id: 'milestone_official_warning',
    category: 'crisis',
    severity: 'critical',
    title: '官媒点名批评了！',
    description: '人民日报旗下媒体发了一篇文章，没有直接点名但所有细节都指向你的艺人：“某些艺人需要对社会负起更大的责任。”这是最后的警告了。',
    emoji: '📰',
    statConditions: { minPrRisk: 70 },
    minDay: 8,
    choices: [
      {
        id: 'full_rectify',
        text: '全面整改',
        subtext: '取消争议活动+公开道歉 (-5万)',
        outcome: {
          narration: '你取消了所有有争议的活动安排，并发了一封诚恳的道歉信。官媒没有再追着不放，但这一刀已经砍下去了，三个品牌解约了。',
          statChanges: { prRisk: -9, commercialValue: -5, money: -50000 },
        },
      },
      {
        id: 'low_profile',
        text: '全面停工',
        subtext: '消失一阵子',
        outcome: {
          narration: '你让艺人彻底消失了两周。没有微博、没有活动、没有露面。热度降了，但风险也降了。粉丝很焦虑：“是不是被封了？”',
          statChanges: { prRisk: -6, commercialValue: -3, fanLoyalty: -3 },
        },
      },
    ],
  },
  {
    id: 'milestone_platform_limit',
    category: 'crisis',
    severity: 'high',
    title: '平台开始限流了',
    description: '你发现最近发的微博互动数据断崖式下跌，不是粉丝不看了，是平台在暗中限流。你的艺人的名字搜索时已经不会自动联想了。这是隐性封杀的前兆。',
    emoji: '🔇',
    statConditions: { minPrRisk: 60 },
    minDay: 6,
    choices: [
      {
        id: 'change_platform',
        text: '转战其他平台',
        subtext: '去抖音/B站重新开始',
        outcome: {
          narration: '你把重心转到了短视频平台。虽然要从头积累，但至少没有被限流。几条精心策划的视频效果不错。',
          statChanges: { prRisk: -3, fanLoyalty: 3, commercialValue: -3 },
        },
      },
      {
        id: 'pay_platform',
        text: '花钱疏通',
        subtext: '找平台关系解除限流 (-8万)',
        requireMinMoney: 80000,
        outcome: {
          narration: '你通过关系“疏通”了平台，限流解除了。但这种事不能天天做，而且让你意识到，在别人的地盘上，你永远没有主动权。',
          statChanges: { money: -80000, prRisk: -3 },
        },
      },
    ],
  },
];
