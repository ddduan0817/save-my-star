import type { GameEvent } from '@/types/game';

export const prEvents: GameEvent[] = [
  {
    id: 'pr_press_conference',
    category: 'pr',
    severity: 'low',
    title: '新专辑发布会',
    description: '新专辑要开发布会了，媒体们摩拳擦掌准备提问。你得决定让你的艺人用什么策略来应对——安全牌还是搞点事情？',
    emoji: '🎙️',
    choices: [
      {
        id: 'scripted',
        text: '念稿子',
        subtext: '安全第一，全程按台本走',
        outcome: {
          narration: '发布会平稳结束，没出任何差错。但记者们私下吐槽"无聊死了，全是官方话术"。上了一个不温不火的热搜就沉了。',
          statChanges: { commercialValue: 3 },
        },
      },
      {
        id: 'authentic',
        text: '做自己',
        subtext: '真实互动，展现个性',
        outcome: {
          narration: '艺人放飞自我，爆了好几个金句！"今天的发布会太好笑了"刷屏热搜。路人纷纷路转粉，这波赚大了。',
          statChanges: { fanLoyalty: 6, commercialValue: 3, prRisk: 3 },
          twist: {
            chance: 0.25,
            narration: '发布会上的金句被营销号断章取义了！"XX公开嘲讽同行"的标题满天飞，虽然不是原意，但解释的成本太高了。',
            statChanges: { prRisk: 6, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'bombshell',
        text: '搞个大新闻',
        subtext: '发布会上宣布重磅消息',
        outcome: {
          narration: '艺人在发布会上宣布了一个谁都没想到的合作。全场记者都疯了，热搜直接爆了。话题度拉满，但也把同行得罪了不少。',
          statChanges: { commercialValue: 7, fanLoyalty: 3, prRisk: 5 },
        },
      },
    ],
  },
  {
    id: 'pr_charity',
    category: 'pr',
    severity: 'low',
    title: '公益项目邀请',
    description: '某知名公益基金会邀请你的艺人担任爱心大使。这是树立正面形象的好机会，但需要投入时间和真金白银。',
    emoji: '🤲',
    choices: [
      {
        id: 'genuine_charity',
        text: '真心做公益',
        subtext: '投入时间和资金 (-5万)',
        outcome: {
          narration: '艺人亲自去了山区小学，和孩子们一起上课的照片温暖了全网。"这不是作秀，是真的在做"成了热评第一。',
          statChanges: { money: -40000, fanLoyalty: 9, prRisk: -6, commercialValue: 3 },
        },
      },
      {
        id: 'pr_charity_show',
        text: '做做样子',
        subtext: '拍几张照就走',
        outcome: {
          narration: '照片拍得挺好，但有人扒出艺人全程只待了20分钟。"公益作秀"的质疑声出来了。',
          statChanges: { prRisk: 5, fanLoyalty: -3 },
        },
      },
      {
        id: 'decline_charity',
        text: '太忙了婉拒',
        subtext: '这期档满了',
        outcome: {
          narration: '拒绝了公益邀请。虽然没人会因此骂你，但一个树立正面形象的机会就这么溜走了。',
          statChanges: {},
        },
      },
    ],
  },
  {
    id: 'pr_hot_search',
    category: 'pr',
    severity: 'low',
    title: '要不要买个热搜？',
    description: '你的宣传团队提议花钱买一个正面热搜来提升话题度。在这个行业里，这几乎是潜规则了。但万一被发现是买的，可就尴尬了。',
    emoji: '🔥',
    choices: [
      {
        id: 'buy_hot',
        text: '买！',
        subtext: '花钱上正面热搜 (-8万)',
        outcome: {
          narration: '热搜买到了，#XX全新造型绝了# 成功登上热搜榜。虽然评论区水军味有点重，但至少曝光量上来了。',
          statChanges: { money: -56000, commercialValue: 3 },
        },
      },
      {
        id: 'fan_army',
        text: '买热搜+粉丝控评组合拳',
        subtext: '全方位营销 (-12万)',
        requireMinMoney: 84000,
        outcome: {
          narration: '热搜+控评+超话打卡，数据漂亮得像假的（确实有点假）。但品牌方看数据决定合作，所以...值了？',
          statChanges: { money: -84000, commercialValue: 5, prRisk: 3 },
        },
      },
      {
        id: 'organic_only',
        text: '不买，靠实力',
        subtext: '自然增长',
        outcome: {
          narration: '你选择了一条更难但更干净的路。短期内看不到效果，但至少不用担心被扒"数据注水"。',
          statChanges: { fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'pr_interview_trap',
    category: 'pr',
    severity: 'medium',
    title: '记者挖坑了！',
    description: '一场直播采访中，记者突然话锋一转：\"网上有人说你能红全靠公司砸钱包装，对此你怎么看？\"你的艺人看向镜头，等着你的眼神暗示...',
    emoji: '🎯',
    minDay: 5,
    choices: [
      {
        id: 'deflect',
        text: '优雅化解',
        subtext: '微笑转移话题',
        outcome: {
          narration: '"感谢大家的关注，我会用作品说话的。"标准回答，不扣分也不加分。记者有点失望，但也没办法。',
          statChanges: { prRisk: -2 },
        },
      },
      {
        id: 'honest_answer',
        text: '真诚回答',
        subtext: '正面回应质疑',
        outcome: {
          narration: '"说实话，刚出道的时候确实需要公司支持，但现在的成绩我觉得还是有我自己的努力在的。"这个回答被剪成短视频，好评如潮。',
          statChanges: { fanLoyalty: 6, commercialValue: 3, prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 60 },
              narration: '真诚回答+强大的商业数据做后盾，路人直接被圈粉。"这个人说的是实话，数据摆在那"成了最佳防守。好几个品牌方看到采访后主动联系你谈合作。',
              statChanges: { fanLoyalty: 7, commercialValue: 6, money: 40000 },
            },
          ],
        },
      },
      {
        id: 'end_interview',
        text: '结束采访',
        subtext: '经纪人上场打断',
        outcome: {
          narration: '你冲上去说"今天的采访到此结束"。虽然保护了艺人，但"经纪人强势打断采访"的视频已经在传了。',
          statChanges: { prRisk: 7, fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'pr_fan_birthday',
    category: 'pr',
    severity: 'low',
    title: '粉丝生日应援太壮观了',
    description: '你的艺人生日，粉丝们在全国各大城市投放了LED大屏广告，还包下了一架飞机拉横幅。微博上#XX生日快乐#的tag阅读量破了10亿。你得表示表示。',
    emoji: '🎂',
    choices: [
      {
        id: 'personal_thanks',
        text: '在线感谢',
        subtext: '发微博逐一感谢',
        outcome: {
          narration: '艺人发了一条长微博，挨个感谢了粉丝的应援。"认真看了每一条留言"的话让粉丝们感动哭了。',
          statChanges: { fanLoyalty: 5 },
        },
      },
      {
        id: 'fan_meeting',
        text: '办粉丝见面会',
        subtext: '回馈粉丝 (-3万)',
        outcome: {
          narration: '300个名额秒空！见面会上艺人和粉丝一起切蛋糕、玩游戏，现场直拍播放量破千万。',
          statChanges: { money: -20000, fanLoyalty: 12, commercialValue: 3 },
        },
      },
      {
        id: 'casual_post',
        text: '简单发个自拍',
        subtext: '意思到了就行',
        outcome: {
          narration: '一张自拍打发了粉丝们花了上百万的应援。"偶像是真的不在乎我们啊"的帖子开始在超话里冒出来。',
          statChanges: { fanLoyalty: -3 },
        },
      },
    ],
  },
  {
    id: 'pr_weibo_night',
    category: 'pr',
    severity: 'medium',
    title: '微博之夜座位安排',
    description: '一年一度的微博之夜，座位安排就是地位的体现。你的艺人被安排在第三排，而几个"不如他/她"的后辈竟然坐在前面。粉丝已经在编"内涵长文"了。',
    emoji: '💺',
    minDay: 10,
    choices: [
      {
        id: 'negotiate_seat',
        text: '和主办方交涉',
        subtext: '据理力争好位置',
        outcome: {
          narration: '主办方给调到了第二排。粉丝们欢天喜地，但被挤走的那位的团队开始记恨你了。',
          statChanges: { fanLoyalty: 5, prRisk: 3 },
        },
      },
      {
        id: 'dont_care_seat',
        text: '无所谓',
        subtext: '位置不代表一切',
        outcome: {
          narration: '艺人坐在第三排全程笑得最开心，和周围的人热聊。反而成了当晚最出圈的互动时刻。',
          statChanges: { fanLoyalty: 3, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'skip_event',
        text: '直接不去',
        subtext: '用"档期冲突"推掉',
        outcome: {
          narration: '缺席微博之夜的消息传出，"XX是不是被封杀了"的猜测满天飞。虽然不是真的，但造成了一些不必要的恐慌。',
          statChanges: { prRisk: 6, fanLoyalty: -3 },
        },
      },
    ],
  },
  {
    id: 'pr_social_media_style',
    category: 'pr',
    severity: 'low',
    title: '社交媒体人设讨论',
    description: '团队在讨论你艺人的社交媒体策略。目前发的都是精修大片，但最近"接地气"的明星更受欢迎。要不要改变风格？',
    emoji: '📱',
    choices: [
      {
        id: 'go_casual',
        text: '转型接地气',
        subtext: '发日常、发素颜、发碎碎念',
        outcome: {
          narration: '第一条接地气的微博——一张没化妆在家吃泡面的照片——居然成了近期互动最高的一条。"原来你也吃泡面啊"成了出圈热评。',
          statChanges: { fanLoyalty: 6, commercialValue: 3 },
        },
      },
      {
        id: 'keep_glamour',
        text: '保持高冷精修',
        subtext: '维持现有调性',
        outcome: {
          narration: '精修路线继续维持，品牌方倒是很满意。但粉丝们开始吐槽"像个没有感情的营业机器"。',
          statChanges: { commercialValue: 3, fanLoyalty: -3 },
        },
      },
    ],
  },
];
