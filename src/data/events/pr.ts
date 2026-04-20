import type { GameEvent } from '@/types/game';

export const prEvents: GameEvent[] = [
  {
    id: 'pr_press_conference',
    category: 'pr',
    severity: 'low',
    title: '新专辑发布会',
    description: '发布会场地的灯光刚调好，你在后台偷看了一眼——前三排坐的全是出了名爱挖坑的记者。提词器上滚动着你改了十七遍的通稿，但你知道，真正的战场是Q&A环节。你的艺人在化妆间里背台词，嘴里念念有词像在念经。',
    emoji: '🎙️',
    choices: [
      {
        id: 'scripted',
        text: '念稿子',
        subtext: '安全第一，全程按台本走',
        outcome: {
          narration: '四十五分钟，零失误。你在后台松了一口气。但散场后你经过记者休息区，听到有人说："又一场念PPT的发布会，稿子都能背了。"当天的通稿发出去，阅读量创了新低。安全的代价是无聊。',
          statChanges: { commercialValue: 3 },
        },
      },
      {
        id: 'authentic',
        text: '做自己',
        subtext: '真实互动，展现个性',
        outcome: {
          narration: '你跟艺人说"别管稿子了，想说什么说什么"。结果TA回答第二个问题的时候突然冒了句方言，全场笑喷。接下来四十分钟成了脱口秀现场，"XX发布会名场面"的tag当晚就爆了。你在后台笑得比谁都开心——直到你看到第二天的稿件。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: 3 },
          twist: {
            chance: 0.25,
            narration: '但是！TA那句"这张专辑比上张好多了"被截出来单独发——标题变成了"XX承认上张专辑是烂作？"。你盯着这条热搜看了十秒钟，然后默默把提词器的电源插回了插座。',
            statChanges: { prRisk: 4, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'bombshell',
        text: '搞个大新闻',
        subtext: '发布会上宣布重磅消息',
        outcome: {
          narration: '你让艺人在最后环节"不经意"提了一句："对了，下个月有个特别的合作，今天先不说了。"全场记者的快门声响成一片。三十秒内你收到了十二条媒体私信问"到底是什么合作"。其实你还没谈成呢——但热度先到手了。',
          statChanges: { commercialValue: 4, fanLoyalty: 3, prRisk: 3 },
        },
      },
    ],
  },
  {
    id: 'pr_charity',
    category: 'pr',
    severity: 'low',
    title: '公益项目邀请',
    description: '某知名公益基金会发来邀请函——担任"乡村教育守护人"爱心大使。照片上是几十个孩子在土操场上跑步的画面。你把邀请函递给艺人看，TA盯着照片看了很久。"去。"TA说了一个字。但你在想的是：去几天？带几个人？拍多少素材？这些念头让你觉得自己有点不是人。',
    emoji: '🤲',
    choices: [
      {
        id: 'genuine_charity',
        text: '认真做，待够一周',
        subtext: '投入时间和资金 (-4万)',
        outcome: {
          narration: '七天。没有通稿，没有摄影师——你只让助理拿手机随便拍了几张。你的艺人教三年级的孩子唱了一首歌，有个小女孩拉着TA的衣角说"老师你明天还来吗"。这些照片你原本没打算发，但助理偷偷传了一张到粉丝群。那张照片比任何精修大片都火。',
          statChanges: { money: -40000, fanLoyalty: 5, prRisk: -4, commercialValue: 3 },
        },
      },
      {
        id: 'pr_charity_show',
        text: '去半天拍个素材',
        subtext: '有图就行',
        outcome: {
          narration: '到了、拍了、发了、走了。全程一百二十分钟。照片里艺人笑得标准，孩子们笑得拘谨。有个较真的博主扒了TA的航班记录——"落地到起飞中间只隔了三小时"。"公益打卡"四个字精准到位。',
          statChanges: { prRisk: 3, fanLoyalty: -3 },
        },
      },
      {
        id: 'decline_charity',
        text: '太忙了婉拒',
        subtext: '这期确实排不开',
        outcome: {
          narration: '你回了封措辞考究的邮件表示遗憾。艺人那边你没提这事。但当你刷到那个基金会最终请了另一个艺人去的新闻时，你关掉了手机。',
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
    description: '宣传总监拿着平板走进来，上面是热搜报价单——这行字小得像怕被人看到。"这个位置四十万，那个位置八十万。效果嘛...你懂的。"你看了看自家艺人上一条微博的转发量——三千。你又看了看报价单。三千。八十万。这笔账怎么算都不对，但在这个行业，有些账本来就不是用来算的。',
    emoji: '🔥',
    choices: [
      {
        id: 'buy_hot',
        text: '买一个试试',
        subtext: '花钱上正面热搜 (-5.6万)',
        outcome: {
          narration: '#XX全新造型绝了# 在下午两点准时出现在热搜第十六位。你盯着它一点一点往上爬——十四、十一、八。评论区前五十条全是整齐划一的彩虹屁，整齐得像军训方阵。有个路人评论在夹缝中幸存了下来："这控评也太明显了吧。"你假装没看见。',
          statChanges: { money: -56000, commercialValue: 3 },
        },
      },
      {
        id: 'fan_army',
        text: '买热搜+粉丝控评组合拳',
        subtext: '全方位营销 (-8.4万)',
        requireMinMoney: 84000,
        outcome: {
          narration: '热搜、控评、超话签到、数据打投——全套流水线启动。数字漂亮得不像话：一小时内#XX造型# tag阅读量破亿。但你打开任意一条评论，像是同一个人用三百个号发的。品牌方的市场总监看了一眼数据说"不错"，然后转头问他的实习生："这个真实互动率多少？"',
          statChanges: { money: -84000, commercialValue: 3, prRisk: 3 },
        },
      },
      {
        id: 'organic_only',
        text: '不买，靠实力',
        subtext: '自然增长',
        outcome: {
          narration: '你合上了平板还给了宣传总监。TA看了你一眼，什么都没说就走了——但你感觉那个眼神在说"你等着瞧"。三个月后你看了看数据：粉丝净增长不多，但每条微博下面的评论都是真人在说真话。这东西值多少钱？你算不出来，但你觉得它值。',
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
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 60 },
              narration: '真诚回答+强大的商业数据做后盾，路人直接被圈粉。"这个人说的是实话，数据摆在那"成了最佳防守。好几个品牌方看到采访后主动联系你谈合作。',
              statChanges: { fanLoyalty: 4, commercialValue: 4, money: 40000 },
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
          statChanges: { prRisk: 4, fanLoyalty: 3 },
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
          statChanges: { fanLoyalty: 3 },
        },
      },
      {
        id: 'fan_meeting',
        text: '办粉丝见面会',
        subtext: '回馈粉丝 (-3万)',
        outcome: {
          narration: '300个名额秒空！见面会上艺人和粉丝一起切蛋糕、玩游戏，现场直拍播放量破千万。',
          statChanges: { money: -20000, fanLoyalty: 7, commercialValue: 3 },
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
          statChanges: { fanLoyalty: 3, prRisk: 3 },
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
          statChanges: { prRisk: 4, fanLoyalty: -3 },
        },
      },
    ],
  },
  {
    id: 'pr_social_media_style',
    category: 'pr',
    severity: 'low',
    title: '社交媒体人设讨论',
    description: '团队开了个两小时的会。议题只有一个：为什么你艺人的微博互动量连续三个月下滑。运营小妹拿出了一张对比图——左边是你家精修九宫格，右边是某新晋小花在菜市场啃煎饼果子的随手拍。后者互动量是你的七倍。会议室里很安静。你盯着那张煎饼果子的照片陷入了沉思。',
    emoji: '📱',
    choices: [
      {
        id: 'go_casual',
        text: '转型接地气',
        subtext: '发日常、发素颜、发碎碎念',
        outcome: {
          narration: '第一条接地气的微博是一张窝在沙发上吃泡面的照片，没化妆，头发乱的。你发出去的时候手都在抖。结果——互动量是上条精修图的十二倍。最高赞评论是一位中年大叔写的："看来明星也吃泡面啊，我放心了。"你读了三遍，笑了。',
          statChanges: { fanLoyalty: 4, commercialValue: 3 },
        },
      },
      {
        id: 'keep_glamour',
        text: '保持高冷精修',
        subtext: '维持现有调性',
        outcome: {
          narration: '你拍了拍桌子："我们的定位不一样，不需要去迎合。"运营小妹欲言又止。三个月后的数据会议上，互动量又跌了15%。你打开艺人最新那条精修九宫格——点赞第一名是艺人的妈妈。',
          statChanges: { commercialValue: 3, fanLoyalty: -3 },
        },
      },
    ],
  },
];
