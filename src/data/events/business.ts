import type { GameEvent } from '@/types/game';

export const businessEvents: GameEvent[] = [
  {
    id: 'biz_luxury_brand',
    category: 'business',
    severity: 'low',
    title: '顶奢品牌邀约！',
    description: '邮件是半夜收到的，发件人后缀是某国际一线奢侈品。你反复读了三遍确认不是钓鱼邮件——"诚邀贵方艺人担任亚太区品牌大使"。你激动得差点截图发朋友圈，但理智告诉你：谈判才刚刚开始。',
    emoji: '💎',
    statConditions: { minCommercialValue: 50 },
    choices: [
      {
        id: 'accept_luxury',
        text: '欣然接受',
        subtext: '按品牌方报价签约',
        outcome: {
          narration: '成功签下顶奢代言！品牌方很满意，时尚圈的大门正式打开。粉丝们也与有荣焉——"我家哥哥/姐姐也太厉害了吧！"',
          statChanges: { commercialValue: 5, money: 140000, fanLoyalty: 3 },
          twist: {
            chance: 0.2,
            narration: '品牌方对首批广告大片的效果非常满意！紧急追加了全球代言合约，代言费翻倍。这下是真的起飞了！',
            statChanges: { commercialValue: 4, money: 140000 },
          },
        },
      },
      {
        id: 'negotiate_harder',
        text: '坐地起价',
        subtext: '要求更高代言费',
        outcome: {
          narration: '你狮子大开口，品牌方犹豫了一下...最终还是答应了！毕竟你的艺人确实值这个价。但对方心里多少有点不爽。',
          statChanges: { commercialValue: 4, money: 250000 },
        },
      },
      {
        id: 'decline_luxury',
        text: '婉拒',
        subtext: '"不符合我们的调性"',
        outcome: {
          narration: '拒绝顶奢代言的消息传出去，业内人都惊了。但也有人说"有格局"。粉丝觉得偶像很有原则。',
          statChanges: { fanLoyalty: 4, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'biz_variety_show',
    category: 'business',
    severity: 'low',
    title: '王牌综艺发来邀请',
    description: '你打开邮箱，差点以为是垃圾邮件——但发件人确实是那个国综的制片主任。"常驻嘉宾，十二期，下个月开录。"你读了两遍确认没有看错。这档综艺上一季的收视率碾压同时段所有节目，但同时也以"素材一条不删"著称。翻车的嘉宾不是一个两个了。',
    emoji: '📺',
    choices: [
      {
        id: 'accept_variety',
        text: '接！好机会',
        subtext: '增加曝光和国民度',
        outcome: {
          narration: '第一期录制，你在监控室里紧张得来回踱步。但你的艺人上了台就像变了个人——梗接得稳、表情管理到位，有段即兴反应被导演连喊了三遍"好"。播出那天你坐在电视前看弹幕，满屏都是"这人之前怎么没发现这么有意思"。你笑着给艺人发了条消息："你可以啊。"',
          statChanges: { fanLoyalty: 4, commercialValue: 3, money: 60000 },
          conditionalOutcomes: [
            {
              condition: { minPrRisk: 50 },
              narration: '录制当天你的艺人状态肉眼可见地差——眼神涣散，三次接梗全没接住。导演在对讲机里说了句"换机位别拍TA了"。播出时弹幕一水的"综艺感为零""来混什么呢"。加上最近的争议，路人盘更难了。',
              statChanges: { fanLoyalty: -3, commercialValue: -2, money: 60000, prRisk: 3 },
            },
          ],
        },
      },
      {
        id: 'demand_top',
        text: '要求C位出场',
        subtext: '必须最高排位',
        outcome: {
          narration: '你打电话给制片："咱们的排位..."对面笑了一下："都是平等嘉宾。"你坚持要了入场第一位和最多镜头的保证。录制那天，其他嘉宾的表情微妙得像在开追悼会。剪辑出来后你发现——镜头确实多，但全是尬笑的。同行经纪人的群里，你的名字后面多了个外号："C位战神"。',
          statChanges: { money: 80000, fanLoyalty: -3, prRisk: 3 },
        },
      },
      {
        id: 'decline_variety',
        text: '档期冲突婉拒',
        subtext: '保持神秘感',
        outcome: {
          narration: '你回了封措辞漂亮的邮件——"遗憾""期待下次"。挂了电话后你坐在椅子上想了五分钟：是不是太保守了？后来你看到节目播出后别的嘉宾大爆，心里酸了一下。但转念想想，至少没给对手送助攻。',
          statChanges: { fanLoyalty: 3, commercialValue: -2 },
        },
      },
    ],
  },
  {
    id: 'biz_movie_role',
    category: 'business',
    severity: 'medium',
    title: '大导演递来橄榄枝',
    description: '国内票房最高的导演打来电话——不是助理转达，是他亲自打的。"我新片有个角色，写的时候就想到了你家艺人。"你的心跳加速了。这种机会十年一遇，但接下来他说的话让你冷静了："目前只有配角的位置。"',
    emoji: '🎬',
    minDay: 6,
    choices: [
      {
        id: 'accept_supporting',
        text: '接受配角',
        subtext: '先进组学习',
        outcome: {
          narration: '进组第一天你的艺人就被骂哭了——导演不留情面。但三个月后杀青时，导演拍了拍TA的肩："下部戏，给你主角。"这句话没有被任何媒体拍到，但你知道这比任何热搜都重要。',
          statChanges: { commercialValue: 4, fanLoyalty: 2, money: 40000 },
          unlockTag: 'transform',
        },
      },
      {
        id: 'demand_lead',
        text: '要求演主角',
        subtext: '不是主角不去',
        outcome: {
          narration: '导演沉默了三秒："你确定？"然后挂了电话。你听说这个角色后来给了一个科班出身的新人——对方演得真的很好。每次刷到那部电影的预告，你心里都有点不是滋味。',
          statChanges: { commercialValue: -5, fanLoyalty: -2 },
        },
      },
      {
        id: 'negotiate_ost',
        text: '接配角+演唱主题曲',
        subtext: '打包合作',
        outcome: {
          narration: '配角演了，主题曲也唱了。电影上映那天，片尾字幕出现你艺人名字的瞬间，粉丝在影院里尖叫了。但导演私下跟圈内人说："这人心太大，什么都想要，下次不一定再用了。"',
          statChanges: { commercialValue: 3, fanLoyalty: 4, money: 60000, prRisk: 3 },
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
    description: '某头部电商平台的商务在微信上发了条消息，很简洁：坑位费六位数，佣金另算，档期你定。你截图给艺人看，TA的第一反应是"我又不是卖货的"，第二反应是看到数字后沉默了。你说"在这行，谁还没卖过货呢"。TA又沉默了。',
    emoji: '🛒',
    choices: [
      {
        id: 'accept_stream',
        text: '接！赚钱要紧',
        subtext: '拿高额坑位费',
        outcome: {
          narration: '直播间在线人数峰值八十万——其中大概一半是来看热闹的。弹幕里"偶像怎么卖货了"和"买了买了"交替出现。你的艺人一开始还端着，后来越卖越上头，到最后真的在安利一款洗面奶——因为TA自己用了觉得好。这段被截成鬼畜传了一周。钱到账了，你看了看数字，确实很"真香"。',
          statChanges: { money: 110000, commercialValue: -3, fanLoyalty: -3 },
          twist: {
            chance: 0.3,
            narration: '但是！直播推的一款面膜出了质量问题——有买家过敏了，红肿的照片满天飞。你艺人的微博变成了投诉热线，"恰烂钱"三个字被刻进了评论区的DNA。你退了一部分货款，但名声的损失退不了。',
            statChanges: { prRisk: 5, fanLoyalty: -3, money: -40000 },
          },
        },
      },
      {
        id: 'selective',
        text: '精选品类再接',
        subtext: '只带和人设匹配的品牌',
        outcome: {
          narration: '你花了三天筛选品牌，最后只留了高端护肤和一款数码新品——都是艺人真的在用的。直播那天TA拿出自己用了半年的旧耳机说"你看磨损了吧，是真的天天用"。这种"真实种草"的画风反而出圈了，品牌方当天就追加了下一季的合作。',
          statChanges: { money: 70000, commercialValue: 3 },
        },
      },
      {
        id: 'decline_stream',
        text: '坚决不做',
        subtext: '"我们不带货"',
        outcome: {
          narration: '你在商务群里回了四个字："暂不考虑。"然后打开工资表算了算这个月的团队开支。数字不太好看。你又打开了那条消息看了一遍坑位费的数字，深呼吸了一口气，把手机扣在桌上。核心粉丝说"偶像有调性"的时候，你微笑着点了点头。笑得有点勉强。',
          statChanges: { fanLoyalty: 3, commercialValue: 3 },
        },
      },
    ],
  },
  {
    id: 'biz_rival_poach',
    category: 'business',
    severity: 'high',
    title: '竞争对手来挖角了！',
    description: '业内最大的经纪公司派了个副总来你们公司楼下的咖啡厅"喝杯咖啡"。你的艺人回来后表情微妙："他们开了双倍价。"TA没有直接拒绝。TA看着你，像在等一个让TA留下来的理由。',
    emoji: '🕵️',
    minDay: 10,
    choices: [
      {
        id: 'match_offer',
        text: '加薪挽留',
        subtext: '匹配对方开价 (-10万)',
        outcome: {
          narration: '你咬牙签了加薪协议。TA笑了："其实我没真想走。但你能为我做到这步，我心里有数。"你也笑了——然后打开银行APP看了眼余额，又不笑了。',
          statChanges: { money: -70000, fanLoyalty: 3 },
        },
      },
      {
        id: 'let_go',
        text: '放人走',
        subtext: '尊重选择',
        outcome: {
          narration: '"想走就走吧，我不拦你。"你说这话的时候语气平静得连自己都意外。TA愣住了，站在门口不动。十秒钟后TA转过身来："你这个人...算了，我不走了。"后来TA在采访里说了一句出圈的话："我的经纪人，是这个行业里最真诚的人。"',
          statChanges: { fanLoyalty: 5, commercialValue: 3 },
        },
      },
      {
        id: 'career_plan',
        text: '画饼...不，展示职业规划',
        subtext: '用未来的蓝图打动TA',
        outcome: {
          narration: '你做了一份PPT，详细规划了未来三年的发展路径。艺人看完眼睛亮了，不仅留下来了，还主动发微博说"感谢最好的经纪人"。',
          statChanges: { fanLoyalty: 4, commercialValue: 3 },
        },
      },
    ],
  },
  {
    id: 'biz_overseas',
    category: 'business',
    severity: 'medium',
    title: '海外市场递来橄榄枝',
    description: '一封全英文邮件，你用翻译器看了三遍才看懂——一家韩国娱乐公司想和你的艺人合作推出海外专辑。他们附了一份详细的企划书：日韩巡回、东南亚路演、TikTok全球推广。你翻到最后一页看到了预算和分成比例，嘴角不自觉地上扬了。但你马上冷静下来：国内接下来两个月的行程全要推掉。',
    emoji: '🌏',
    minDay: 12,
    choices: [
      {
        id: 'accept_overseas',
        text: '进军海外',
        subtext: '签约合作',
        outcome: {
          narration: '第一站曼谷。你的艺人在机场出口被一百多个举着灯牌的粉丝包围了——他们不是中国粉丝。TA愣了三秒才反应过来，然后用刚学的泰语说了句"萨瓦迪卡"，全场尖叫。国内粉丝转发了现场视频，配文清一色是"我家偶像全球出道了😭"。你站在旁边，感觉一切都不太真实。',
          statChanges: { commercialValue: 4, fanLoyalty: 3, money: 70000 },
        },
      },
      {
        id: 'focus_domestic',
        text: '深耕国内',
        subtext: '国内市场还没吃透',
        outcome: {
          narration: '你回了封委婉的邮件，大意是"时机尚未成熟"。然后你关掉了翻译器，打开了国内下个月的通告排期表。密密麻麻的，但每一条你都认识。海外的世界很大，但眼前的事得先做好。你在心里给自己说了句：不急。',
          statChanges: { fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'biz_game_endorsement',
    category: 'business',
    severity: 'low',
    title: '大厂手游代言邀约',
    description: '某头部游戏公司的商务总监约你喝咖啡，桌上摆着一台iPad——上面是他们新手游的Demo。画面确实好看。"我们想让XX做代言人，广告片预算两千万。"你还没说话，他补了一句："但是游戏圈你知道的...玩家很挑。上一个流量代言人被骂到关评论了。"',
    emoji: '🎮',
    choices: [
      {
        id: 'accept_game',
        text: '接代言',
        subtext: '拿钱！',
        outcome: {
          narration: '广告片拍了三天，特效烧了一千万。成品出来确实帅/美，在B站的播放量破千万——但弹幕里"又是流量""跟游戏有什么关系"的吐槽铺天盖地。不过品牌方看的是下载量：首日新增用户翻了一倍。他们很满意，追加了一个赛季的合作。游戏玩家嘴上说不要，身体很诚实。',
          statChanges: { money: 130000, commercialValue: 3, prRisk: 3 },
        },
      },
      {
        id: 'play_game',
        text: '先试玩再决定',
        subtext: '如果游戏不好就不接',
        outcome: {
          narration: '你让艺人真的玩了一周。TA不仅玩了，还上了瘾——凌晨两点你收到TA的微信："我打到钻石段位了。"你让TA在直播间打了几把排位，操作虽然菜但态度很认真。游戏圈粉丝的画风从"又来一个不玩游戏的"变成了"TA是真菜啊哈哈但是好真实""比我强一点点"。真实比专业更有说服力。',
          statChanges: { money: 110000, commercialValue: 4, fanLoyalty: 3 },
        },
      },
    ],
  },
];
