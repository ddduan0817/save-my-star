import type { GameEvent } from '@/types/game';

export const businessEvents: GameEvent[] = [
  {
    id: 'biz_luxury_brand',
    category: 'business',
    severity: 'low',
    title: '顶奢品牌邀约！',
    description: '某国际一线奢侈品牌联系你，想签你的艺人做亚太区品牌大使。这可是顶级商业资源，但谈判需要拿出诚意。',
    emoji: '💎',
    statConditions: { minCommercial: 50 },
    choices: [
      {
        id: 'accept_luxury',
        text: '欣然接受',
        subtext: '按品牌方报价签约',
        emoji: '🤝',
        outcome: {
          narration: '成功签下顶奢代言！品牌方很满意，时尚圈的大门正式打开。粉丝们也与有荣焉——"我家哥哥/姐姐也太厉害了吧！"',
          statChanges: { commercialValue: 15, money: 200000, fanLoyalty: 5 },
          twist: {
            chance: 0.2,
            narration: '品牌方对首批广告大片的效果非常满意！紧急追加了全球代言合约，代言费翻倍。这下是真的起飞了！',
            statChanges: { commercialValue: 10, money: 200000 },
          },
        },
      },
      {
        id: 'negotiate_harder',
        text: '坐地起价',
        subtext: '要求更高代言费',
        emoji: '💰',
        outcome: {
          narration: '你狮子大开口，品牌方犹豫了一下...最终还是答应了！毕竟你的艺人确实值这个价。但对方心里多少有点不爽。',
          statChanges: { commercialValue: 10, money: 350000 },
        },
      },
      {
        id: 'decline_luxury',
        text: '婉拒',
        subtext: '"不符合我们的调性"',
        emoji: '🙅',
        outcome: {
          narration: '拒绝顶奢代言的消息传出去，业内人都惊了。但也有人说"有格局"。粉丝觉得偶像很有原则。',
          statChanges: { fanLoyalty: 10, commercialValue: -5 },
        },
      },
    ],
  },
  {
    id: 'biz_variety_show',
    category: 'business',
    severity: 'low',
    title: '王牌综艺发来邀请',
    description: '国民级综艺节目组来了，邀请你的艺人作为常驻嘉宾参加新一季录制。这是提升国民度的绝佳机会，但也意味着曝光量巨大，任何瑕疵都会被放大。',
    emoji: '📺',
    choices: [
      {
        id: 'accept_variety',
        text: '接！好机会',
        subtext: '增加曝光和国民度',
        emoji: '✨',
        outcome: {
          narration: '综艺效果拉满！你的艺人意外展现了搞笑天赋，"人间清醒"的梗在社交媒体上疯传。路人粉暴涨！',
          statChanges: { fanLoyalty: 12, commercialValue: 8, money: 80000 },
          conditionalOutcomes: [
            {
              condition: { minPrRisk: 50 },
              narration: '综艺录制现场，你的艺人状态不太好，几次接梗都没接住。网友说"综艺感为零"，加上最近的争议，弹幕全是嘲讽。',
              statChanges: { fanLoyalty: -5, commercialValue: -3, money: 80000, prRisk: 5 },
            },
          ],
        },
      },
      {
        id: 'demand_top',
        text: '要求C位出场',
        subtext: '必须最高排位',
        emoji: '👑',
        outcome: {
          narration: '节目组答应了，但其他嘉宾的粉丝不乐意了。录制现场气氛微妙，剪辑出来效果一般。',
          statChanges: { money: 120000, fanLoyalty: -5, prRisk: 5 },
        },
      },
      {
        id: 'decline_variety',
        text: '档期冲突婉拒',
        subtext: '保持神秘感',
        emoji: '📅',
        outcome: {
          narration: '拒绝了国综邀请。有人说"端什么架子"，但核心粉丝觉得偶像很专注本职工作。',
          statChanges: { fanLoyalty: 3, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'biz_movie_role',
    category: 'business',
    severity: 'medium',
    title: '大导演递来橄榄枝',
    description: '国内一线大导演的新片正在选角，你的艺人被邀请试镜。如果能拿下角色，这将是从偶像到演员的关键一步。',
    emoji: '🎬',
    minDay: 6,
    choices: [
      {
        id: 'accept_supporting',
        text: '接受配角',
        subtext: '先进组学习',
        emoji: '🎭',
        outcome: {
          narration: '虽然是配角，但大导演调教下的演技进步明显。杀青后，导演在采访中夸了你的艺人"是块料"。',
          statChanges: { commercialValue: 10, fanLoyalty: 5, money: 50000 },
          unlockTag: 'transform',
        },
      },
      {
        id: 'demand_lead',
        text: '要求演主角',
        subtext: '不是主角不去',
        emoji: '⭐',
        outcome: {
          narration: '导演摇了摇头："演技还不够。"你失去了这次机会。粉丝不知道内情，但业内人都在说"不知天高地厚"。',
          statChanges: { commercialValue: -5 },
        },
      },
      {
        id: 'negotiate_ost',
        text: '接配角+演唱主题曲',
        subtext: '打包合作',
        emoji: '🎵',
        outcome: {
          narration: '一石二鸟的方案！配角演得不错，主题曲还上了音乐榜热搜。这波操作被业内人称为"教科书级别的资源利用"。',
          statChanges: { commercialValue: 12, fanLoyalty: 8, money: 80000 },
          unlockTag: 'transform',
        },
      },
    ],
  },
  {
    id: 'biz_livestream',
    category: 'business',
    severity: 'low',
    title: '直播带货邀约',
    description: '某头部电商平台想和你的艺人合作一场直播带货，坑位费开得很高。但圈内对"偶像直播带货"一直有争议——有人说"掉价"，有人说"真会赚钱"。',
    emoji: '🛒',
    choices: [
      {
        id: 'accept_stream',
        text: '接！赚钱要紧',
        subtext: '拿高额坑位费',
        emoji: '💵',
        outcome: {
          narration: '直播间人气爆棚，但弹幕里"偶像怎么卖货了"的吐槽不少。不过看看到账的金额...真香。',
          statChanges: { money: 150000, commercialValue: -5, fanLoyalty: -3 },
          twist: {
            chance: 0.3,
            narration: '直播卖出去的产品出质量问题了！买家集体在你艺人微博下面维权。"恰烂钱"的标签贴上来了。',
            statChanges: { prRisk: 15, fanLoyalty: -8, money: -50000 },
          },
        },
      },
      {
        id: 'selective',
        text: '精选品类再接',
        subtext: '只带和人设匹配的品牌',
        emoji: '✅',
        outcome: {
          narration: '只选了高端护肤和数码产品，直播效果好，口碑也维持住了。品牌方追加了合作。',
          statChanges: { money: 100000, commercialValue: 3 },
        },
      },
      {
        id: 'decline_stream',
        text: '坚决不做',
        subtext: '"我们不带货"',
        emoji: '🙅',
        outcome: {
          narration: '核心粉丝觉得偶像有调性，但钱就这么飞了。经纪人的工资是你自己发的啊喂。',
          statChanges: { fanLoyalty: 5, commercialValue: 3 },
        },
      },
    ],
  },
  {
    id: 'biz_rival_poach',
    category: 'business',
    severity: 'high',
    title: '竞争对手来挖角了！',
    description: '业内最大的经纪公司私下联系了你的艺人，开出了双倍薪酬的条件，承诺更好的资源。你的艺人态度暧昧，似乎在等你的反应。',
    emoji: '🕵️',
    minDay: 10,
    choices: [
      {
        id: 'match_offer',
        text: '加薪挽留',
        subtext: '匹配对方开价 (-10万)',
        emoji: '💰',
        outcome: {
          narration: '你咬牙加薪，艺人留下了。但你知道，这种事发生过一次就会发生第二次。而且你的钱包在哭泣。',
          statChanges: { money: -100000, fanLoyalty: 5 },
        },
      },
      {
        id: 'let_go',
        text: '放人走',
        subtext: '尊重选择',
        emoji: '👋',
        outcome: {
          narration: '你大度放手，艺人反而犹豫了——"你不挽留我吗？"最终他/她被你的坦诚打动，决定留下。信任度反而上来了。',
          statChanges: { fanLoyalty: 15, commercialValue: 5 },
        },
      },
      {
        id: 'career_plan',
        text: '画饼...不，展示职业规划',
        subtext: '用未来的蓝图打动TA',
        emoji: '📊',
        outcome: {
          narration: '你做了一份PPT，详细规划了未来三年的发展路径。艺人看完眼睛亮了，不仅留下来了，还主动发微博说"感谢最好的经纪人"。',
          statChanges: { fanLoyalty: 10, commercialValue: 8 },
        },
      },
    ],
  },
  {
    id: 'biz_overseas',
    category: 'business',
    severity: 'medium',
    title: '海外市场递来橄榄枝',
    description: '一家韩国娱乐公司想和你的艺人合作推出海外专辑，这意味着有机会打入国际市场。但国内的行程可能要让步。',
    emoji: '🌏',
    minDay: 12,
    choices: [
      {
        id: 'accept_overseas',
        text: '进军海外',
        subtext: '签约合作',
        emoji: '✈️',
        outcome: {
          narration: '海外专辑反响不错，在东南亚和日韩圈了一波粉。国内粉丝觉得"我家偶像走向世界了"，很自豪。',
          statChanges: { commercialValue: 12, fanLoyalty: 5, money: 100000 },
        },
      },
      {
        id: 'focus_domestic',
        text: '深耕国内',
        subtext: '国内市场还没吃透',
        emoji: '🏠',
        outcome: {
          narration: '专注国内的决定让你有更多精力经营粉丝。虽然错过了海外机会，但根基更扎实了。',
          statChanges: { fanLoyalty: 8 },
        },
      },
    ],
  },
  {
    id: 'biz_game_endorsement',
    category: 'business',
    severity: 'low',
    title: '大厂手游代言邀约',
    description: '某头部游戏公司想请你的艺人代言新手游，代言费给得很大方。但游戏圈粉丝一向挑剔，代言翻车的案例也不少。',
    emoji: '🎮',
    choices: [
      {
        id: 'accept_game',
        text: '接代言',
        subtext: '拿钱！',
        emoji: '💰',
        outcome: {
          narration: '代言广告拍得不错，游戏玩家虽然吐槽"又是流量明星"，但下载量确实涨了。品牌方很满意，追加了合作。',
          statChanges: { money: 180000, commercialValue: 5, prRisk: 3 },
        },
      },
      {
        id: 'play_game',
        text: '先试玩再决定',
        subtext: '如果游戏不好就不接',
        emoji: '🕹️',
        outcome: {
          narration: '艺人真的试玩了一周，还在直播间打了几把。游戏圈粉丝震惊："这人是真的在玩啊！"口碑爆了。',
          statChanges: { money: 150000, commercialValue: 10, fanLoyalty: 8 },
        },
      },
    ],
  },
];
