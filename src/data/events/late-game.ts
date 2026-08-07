import type { GameEvent } from '@/types/game';

// 后期高风险事件（第20天+），给终盘增加紧迫感和戏剧性
export const lateGameEvents: GameEvent[] = [
  {
    id: 'late_nye_gala',
    category: 'business',
    severity: 'high',
    title: '跨年晚会压轴邀请！',
    description: '全国收视率最高的跨年晚会发来邀请，而且是压轴表演！这是年度最重要的舞台，但压轴意味着全国观众都在盯着，出一点差错都会被放大无数倍。',
    emoji: '🎆',
    minDay: 13,
    choices: [
      {
        id: 'accept_nye',
        text: '接！荣耀时刻',
        subtext: '全力准备压轴表演',
        outcome: {
          narration: '跨年夜，你的艺人站在最大的舞台上。表演完美，弹幕全是“封神了”。新年第一天就是以热搜第一开始的。',
          statChanges: { commercialValue: 5, fanLoyalty: 4, money: 110000 },
          conditionalOutcomes: [
            {
              condition: { minPrRisk: 60 },
              narration: '跨年表演的热度被之前积累的争议盖过了。弹幕里一半人在刷“换人”“不配”。本该是高光时刻，却变成了争议焦点。',
              statChanges: { commercialValue: 3, fanLoyalty: -3, money: 110000, prRisk: 4 },
            },
          ],
        },
      },
      {
        id: 'negotiate_nye',
        text: '接受但谈条件',
        subtext: '要独立舞台+自选曲目',
        outcome: {
          narration: '导演组答应了你的条件，但排练时间被压缩了。最终表演效果不错，虽然没有惊艳，但也算稳稳地完成了任务。',
          statChanges: { commercialValue: 3, money: 140000 },
        },
      },
    ],
  },
  {
    id: 'late_year_end_list',
    category: 'pr',
    severity: 'medium',
    title: '年终“最令人失望艺人”榜单',
    description: '某权威媒体的年终盘点出炉了，你的艺人赫然出现在“最令人失望的十大艺人”名单上，理由是“高开低走、德不配位”。评论区已经吵翻了。',
    emoji: '📉',
    minDay: 15,
    statConditions: { minPrRisk: 40 },
    choices: [
      {
        id: 'accept_criticism_gracefully',
        text: '大度回应',
        subtext: '“会努力做到更好”',
        outcome: {
          narration: '你的艺人发了一条微博：“批评都收到了，明年见。”简短有力的回应赢得了一波路人好感。',
          statChanges: { fanLoyalty: 3, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'question_criteria',
        text: '质疑评选标准',
        subtext: '“所谓权威不过如此”',
        outcome: {
          narration: '质疑评选标准的微博引发了更大的争议。媒体圈的人开始集体下场讨伐，这下不止一个榜单在批评你了。',
          statChanges: { prRisk: 5, fanLoyalty: 3, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'late_industry_bigwig',
    category: 'business',
    severity: 'high',
    title: '行业大佬亲自邀约',
    description: '一位手握数十亿资源的影视集团老板亲自约你吃饭，说想把你的艺人打造成“下一个十年的顶流”。听起来很美好，但江湖传言这位大佬的合约条件...很苛刻。',
    emoji: '🤝',
    minDay: 13,
    statConditions: { minCommercialValue: 60 },
    choices: [
      {
        id: 'accept_bigwig',
        text: '签约合作',
        subtext: '拿顶级资源',
        outcome: {
          narration: '签约后资源确实是顶级的，两部大IP、三个一线代言。但合约条件意味着你未来三年都被绑死了。这是一步险棋。',
          statChanges: { commercialValue: 5, money: 210000, fanLoyalty: -3 },
        },
      },
      {
        id: 'decline_bigwig',
        text: '婉拒',
        subtext: '“我们想走自己的路”',
        outcome: {
          narration: '大佬被拒绝后脸色不太好看，但你的艺人和团队的士气反而上来了。“不卑不亢”的态度也传到了圈内，口碑反而上升了。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'counter_offer',
        text: '提出对等合作',
        subtext: '不签独家，只做项目制',
        outcome: {
          narration: '你的方案让大佬刮目相看：“有想法。”最终达成了一个项目制合作，一部电影+一个代言，没有绑定条款。这是最好的结果。',
          statChanges: { commercialValue: 4, money: 140000, fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'late_scandal_compilation',
    category: 'crisis',
    severity: 'critical',
    title: '年终大型扒皮帖出现了',
    description: '一个万字长帖出现在各大论坛，把你的艺人今年所有的争议事件串在了一起，标题是“一个人设崩塌的全过程”。帖子数据还在持续上涨。这是一次有组织的攻击。',
    emoji: '📋',
    minDay: 15,
    statConditions: { minPrRisk: 50 },
    choices: [
      {
        id: 'point_by_point',
        text: '逐条反驳',
        subtext: '发长文回应每一个质疑',
        outcome: {
          narration: '团队花了三天写了一篇万字回应，配上证据逐条反驳。虽然耗费精力巨大，但“认真回应”的态度赢得了一部分中间派。',
          statChanges: { prRisk: -4, money: -40000, fanLoyalty: 3 },
        },
      },
      {
        id: 'report_and_sue',
        text: '举报+法律手段',
        subtext: '多管齐下',
        outcome: {
          narration: '帖子因为部分内容不实被举报下架了，但截图已经传遍了。律师开始走法律程序，但这是一场旷日持久的消耗战。',
          statChanges: { prRisk: 3, money: -56000 },
        },
      },
    ],
  },
  {
    id: 'late_retirement_offer',
    category: 'business',
    severity: 'high',
    title: '有人出天价买断约',
    description: '一家互联网公司想以天价买断你的艺人经纪合约，让她/他去做企业代言人+高管。工资加股票每年过千万，但意味着彻底退出娱乐圈。',
    emoji: '💰',
    minDay: 16,
    choices: [
      {
        id: 'take_the_money',
        text: '接受！落袋为安',
        subtext: '拿钱走人',
        outcome: {
          narration: '你和艺人认真聊了一夜，最终决定接受。告别粉丝的微博发出后全网震动。这也许不是最热血的结局，但是最安稳的。',
          statChanges: { money: 350000, commercialValue: -7, fanLoyalty: -4 },
          unlockTag: 'retired',
        },
      },
      {
        id: 'stay_in_game',
        text: '留在娱乐圈',
        subtext: '“我的故事还没结束”',
        outcome: {
          narration: '拒绝天价的消息传出后，粉丝们感动到哭：“是真的热爱这个舞台啊。”这个决定让你的艺人收获了最忠诚的一批粉丝。',
          statChanges: { fanLoyalty: 7, commercialValue: 4, prRisk: -3 },
        },
      },
    ],
  },
  {
    id: 'late_final_concert',
    category: 'business',
    severity: 'medium',
    title: '万人级粉丝见面大型活动',
    description: '场馆已经订好了，一场万人规模的大型活动正在筹备。这将是今年最后的重磅收官活动，成功了是完美收官，失败了就是年度笑话。',
    emoji: '🎪',
    minDay: 17,
    statConditions: { minFanLoyalty: 40 },
    choices: [
      {
        id: 'spare_no_expense',
        text: '不惜成本办到最好',
        subtext: '顶级舞美+特邀嘉宾 (-15万)',
        requireMinMoney: 110000,
        outcome: {
          narration: '当晚的现场效果让所有人震撼。三个小时的活动，加场了两次，粉丝们哭着不肯走。「年度最佳收官活动」的美誉名至实归。',
          statChanges: { money: -110000, fanLoyalty: 7, commercialValue: 5, prRisk: -4 },
        },
      },
      {
        id: 'standard_show',
        text: '正常预算',
        subtext: '做好本分就行',
        outcome: {
          narration: '演出顺利完成，粉丝们很开心。虽然没有惊天的大场面，但真诚的互动环节让所有人都觉得值了。',
          statChanges: { money: -40000, fanLoyalty: 4, commercialValue: 3 },
        },
      },
    ],
  },
];
