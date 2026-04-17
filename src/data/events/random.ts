import type { GameEvent } from '@/types/game';

export const randomEvents: GameEvent[] = [
  {
    id: 'random_meme',
    category: 'random',
    severity: 'low',
    title: '你的艺人变成表情包了！',
    description: '昨天活动上的一个搞怪表情被截图做成了表情包，现在全网都在用。微信聊天里十条消息有三条是你艺人的脸。',
    emoji: '😂',
    choices: [
      {
        id: 'embrace_meme',
        text: '玩梗！官方下场',
        subtext: '自己也用这个表情包',
        emoji: '🤣',
        outcome: {
          narration: '艺人亲自转发了最火的表情包，配文"你们够了哈哈哈"。这条微博转发破百万，"本人下场玩梗第一人"成了新标签。',
          statChanges: { fanLoyalty: 10, commercialValue: 5, prRisk: -3 },
        },
      },
      {
        id: 'stop_meme',
        text: '要求撤图',
        subtext: '发声明维护肖像权',
        emoji: '⚖️',
        outcome: {
          narration: '律师函一发，网友们更起劲了——"表情包都要管，太把自己当回事了吧。"适得其反了属于是。',
          statChanges: { prRisk: 8, fanLoyalty: -5 },
        },
      },
      {
        id: 'sell_meme',
        text: '出联名表情包',
        subtext: '和平台合作官方表情包',
        emoji: '💰',
        outcome: {
          narration: '和微信合作出了官方付费表情包，销量出奇地好！粉丝觉得偶像太会了，路人觉得这个人很有趣。',
          statChanges: { money: 60000, fanLoyalty: 5, commercialValue: 8 },
        },
      },
    ],
  },
  {
    id: 'random_viral_kindness',
    category: 'random',
    severity: 'low',
    title: '暖心一幕被路人拍到了',
    description: '有路人偷偷拍到你的艺人在便利店帮一位老人搬东西，还聊了好一会儿。视频传上网后，评论区全是"人间清醒""好善良"。',
    emoji: '🥺',
    choices: [
      {
        id: 'let_spread',
        text: '低调处理',
        subtext: '让视频自然传播',
        emoji: '🌱',
        outcome: {
          narration: '没有任何炒作，视频靠自来水传播到了千万级播放。"这就是为什么喜欢他/她"成了热评第一。自然的才是最有力的。',
          statChanges: { fanLoyalty: 12, prRisk: -8, commercialValue: 5 },
        },
      },
      {
        id: 'amplify',
        text: '趁机宣传',
        subtext: '安排媒体跟进报道',
        emoji: '📢',
        outcome: {
          narration: '媒体跟进报道了，但有人扒出旁边有工作人员在拍——"所以这是安排好的？"质疑声开始出来了。',
          statChanges: { commercialValue: 5, prRisk: 8 },
        },
      },
    ],
  },
  {
    id: 'random_paparazzi',
    category: 'random',
    severity: 'medium',
    title: '狗仔蹲点第三天了',
    description: '你发现有狗仔连续三天蹲在你艺人住所附近。他们肯定在等什么大料。你的艺人这两天确实有一些...不方便被拍到的行程。',
    emoji: '📷',
    choices: [
      {
        id: 'decoy',
        text: '声东击西',
        subtext: '安排替身车引开狗仔 (-2万)',
        emoji: '🚗',
        outcome: {
          narration: '替身车成功引开了狗仔。不过这种操作不能天天用，下次得想个更好的办法。',
          statChanges: { money: -20000, prRisk: -3 },
        },
      },
      {
        id: 'confront_pap',
        text: '正面交锋',
        subtext: '派保安去交涉',
        emoji: '🦍',
        outcome: {
          narration: '保安和狗仔发生了口角，被对方偷偷录了下来。"XX团队嚣张保安推搡记者"的标题已经在路上了。',
          statChanges: { prRisk: 12 },
        },
      },
      {
        id: 'boring_photo',
        text: '给他们一个无聊的独家',
        subtext: '主动给一张买菜照',
        emoji: '🥬',
        outcome: {
          narration: '你安排艺人穿着朴素去超市买菜，让狗仔拍了个够。"XX接地气买菜"的热搜虽然无聊，但至少挤走了他们准备曝的料。',
          statChanges: { prRisk: -5, fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'random_doppelganger',
    category: 'random',
    severity: 'low',
    title: '撞脸事件！网友疯传',
    description: '一个外卖小哥因为长得酷似你的艺人而走红，"平行世界的XX"话题阅读量已经过亿。有人觉得好玩，有人觉得被冒犯。',
    emoji: '👯',
    choices: [
      {
        id: 'collab_double',
        text: '约他一起拍视频',
        subtext: '蹭一波热度',
        emoji: '🤝',
        outcome: {
          narration: '两人合拍了一条"当我遇见另一个我"的短视频，笑到岔气。视频播放量破亿，两人都涨了一大波粉。',
          statChanges: { fanLoyalty: 8, commercialValue: 10, prRisk: -3 },
        },
      },
      {
        id: 'ignore_double',
        text: '无视',
        subtext: '不回应就好',
        emoji: '🤷',
        outcome: {
          narration: '你没回应，但网友们自己玩嗨了。外卖小哥开始接广告了，有品牌甚至找他代替你的艺人拍了平替版广告...',
          statChanges: { commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'random_fan_project',
    category: 'random',
    severity: 'low',
    title: '粉丝自制纪录片火了',
    description: '一位粉丝花了半年时间剪了一部你艺人的出道纪录片，从练习生时期一直到现在。质量高到离谱，B站播放量已经破千万。',
    emoji: '🎬',
    choices: [
      {
        id: 'repost_doc',
        text: '官方转发+感谢',
        subtext: '给粉丝最大的认可',
        emoji: '💖',
        outcome: {
          narration: '艺人亲自转发并写了一段长评论感谢这位粉丝。"双向奔赴"的故事感动了全网，连路人都开始追这部纪录片了。',
          statChanges: { fanLoyalty: 15, commercialValue: 5 },
        },
      },
      {
        id: 'copyright_doc',
        text: '要求下架',
        subtext: '涉及未授权素材',
        emoji: '⚠️',
        outcome: {
          narration: '版权投诉导致视频下架，粉丝心寒了。"用爱发电换来一纸投诉"成了出圈的伤心梗。大量粉丝脱粉。',
          statChanges: { fanLoyalty: -20, prRisk: 10 },
        },
      },
      {
        id: 'invite_fan',
        text: '邀请粉丝加入官方团队',
        subtext: '把人才收编',
        emoji: '🤩',
        outcome: {
          narration: '粉丝激动到哭！加入团队后制作的第一条官方视频质量炸裂。"别人家的运营"成了同行羡慕的模板。',
          statChanges: { fanLoyalty: 12, commercialValue: 8, money: -10000 },
        },
      },
    ],
  },
  {
    id: 'random_ai_face',
    category: 'random',
    severity: 'low',
    title: 'AI换脸视频传疯了',
    description: '有人用AI把你艺人的脸换到了各种搞笑视频上，其中一条"你的艺人在菜市场砍价"的视频播放量已经过亿了。',
    emoji: '🤖',
    choices: [
      {
        id: 'fun_ai',
        text: '官方下场玩AI',
        subtext: '自己出一版更搞笑的',
        emoji: '😂',
        outcome: {
          narration: '官方出了一版"AI艺人的一天"系列视频，从买菜到送外卖全套，笑翻全网。科技博主都来分析了。',
          statChanges: { fanLoyalty: 8, commercialValue: 10, prRisk: -3 },
        },
      },
      {
        id: 'legal_ai',
        text: '维权！侵犯肖像权',
        subtext: '发律师函',
        emoji: '⚖️',
        outcome: {
          narration: '律师函发了，但AI换脸的法律边界还很模糊。最后不了了之，白花了律师费。',
          statChanges: { money: -30000, prRisk: 3 },
        },
      },
    ],
  },
  {
    id: 'random_charity_challenge',
    category: 'random',
    severity: 'low',
    title: '公益挑战赛@你了',
    description: '一个全网公益挑战赛（类似冰桶挑战）在各大明星之间传递，现在轮到你的艺人了。不参加会显得没有社会责任感，参加又怕做得不好被嘲。',
    emoji: '🏃',
    choices: [
      {
        id: 'creative_challenge',
        text: '创意参与',
        subtext: '用独特的方式完成挑战',
        emoji: '✨',
        outcome: {
          narration: '你的艺人用了一个超有创意的方式完成了挑战，视频在全平台霸榜。"这才是公益正确打开方式"成了热评。',
          statChanges: { fanLoyalty: 10, commercialValue: 8, prRisk: -5 },
        },
      },
      {
        id: 'standard_challenge',
        text: '正常完成',
        subtext: '规规矩矩拍一条',
        emoji: '👍',
        outcome: {
          narration: '视频发了，中规中矩。既没有被夸也没有被骂，就是普通地完成了任务。',
          statChanges: { fanLoyalty: 3, prRisk: -2 },
        },
      },
    ],
  },
  {
    id: 'random_lookalike_pet',
    category: 'random',
    severity: 'low',
    title: '一只长得像你艺人的猫火了',
    description: '一只橘猫因为神态酷似你的艺人而爆火，"XX本喵"的话题已经有三亿阅读量。猫的主人也跟着涨了百万粉。',
    emoji: '🐱',
    choices: [
      {
        id: 'adopt_collab',
        text: '联动！一起拍视频',
        subtext: '和猫主人合作',
        emoji: '🤝',
        outcome: {
          narration: '艺人抱着"本喵"的合照冲上热搜第一。"人不如猫"的自嘲让全网路转粉。这只猫也成了艺人官方编外成员。',
          statChanges: { fanLoyalty: 12, commercialValue: 5, prRisk: -5 },
        },
      },
      {
        id: 'ignore_cat',
        text: '随它去吧',
        subtext: '一只猫而已',
        emoji: '😐',
        outcome: {
          narration: '你没蹭这波热度，但猫主人蹭了。各种"碰瓷"视频越来越多，你的艺人被动成了背景板。',
          statChanges: { commercialValue: -3 },
        },
      },
    ],
  },
];
