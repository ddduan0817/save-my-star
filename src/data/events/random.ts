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
        outcome: {
          narration: '艺人亲自转发了最火的表情包，配文"你们够了哈哈哈"。这条微博转发破百万，"本人下场玩梗第一人"成了新标签。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: -3 },
          unlockTag: 'embraced_meme',
        },
      },
      {
        id: 'stop_meme',
        text: '要求撤图',
        subtext: '发声明维护肖像权',
        outcome: {
          narration: '律师函一发，网友们更起劲了——"表情包都要管，太把自己当回事了吧。"适得其反了属于是。',
          statChanges: { prRisk: 3, fanLoyalty: -3 },
        },
      },
      {
        id: 'sell_meme',
        text: '出联名表情包',
        subtext: '和平台合作官方表情包',
        outcome: {
          narration: '和微信合作出了官方付费表情包，销量出奇地好！粉丝觉得偶像太会了，路人觉得这个人很有趣。',
          statChanges: { money: 40000, fanLoyalty: 3, commercialValue: 3 },
          twist: {
            chance: 0.3,
            narration: '表情包销量冲到全平台第一！微信主动续约并追加了一套动态表情的合作。又一笔意外收入！',
            statChanges: { money: 60000, commercialValue: 3 },
          },
        },
      },
    ],
  },
  {
    id: 'random_viral_kindness',
    category: 'random',
    severity: 'low',
    title: '暖心一幕被路人拍到了',
    description: '一条九秒的视频在全网疯传：你的艺人在便利店门口，弯腰帮一位颤颤巍巍的老太太把散了一地的橘子捡回袋子里。老太太显然不认识TA，拉着TA的手说了句什么，然后TA笑了。那个笑容没有任何滤镜和角度，但比任何精修大片都好看。视频结尾，TA戴上口罩转身消失在人流里。',
    emoji: '🥺',
    choices: [
      {
        id: 'let_spread',
        text: '低调处理',
        subtext: '让视频自然传播',
        outcome: {
          narration: '你做了一件最难的事——什么都不做。没有转发，没有声明，没有"团队知情"。视频靠自来水传到了三千万播放。最打动人的不是捡橘子，而是自始至终没人知道TA就是那个"XX"。热评第一只有四个字："这种人，粉了。"',
          statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'amplify',
        text: '安排媒体跟进',
        subtext: '趁机扩大影响',
        outcome: {
          narration: '你让三家媒体做了跟进报道，标题都是"XX暖心一幕感动全网"。但有个博主放大了视频的第四秒——角落里站着一个拿手机录像的工作人员。"原来有人跟拍啊""意思是这是安排好的？"质疑声开始冒出来了。你看着那个角落里的人影——那其实是路人，但谁在乎真相呢。',
          statChanges: { commercialValue: 3, prRisk: 3 },
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
        outcome: {
          narration: '替身车成功引开了狗仔。不过这种操作不能天天用，下次得想个更好的办法。',
          statChanges: { money: -14000, prRisk: -3 },
        },
      },
      {
        id: 'confront_pap',
        text: '正面交锋',
        subtext: '派保安去交涉',
        outcome: {
          narration: '保安和狗仔发生了口角，被对方偷偷录了下来。"XX团队嚣张保安推搡记者"的标题已经在路上了。',
          statChanges: { prRisk: 4 },
        },
      },
      {
        id: 'boring_photo',
        text: '给他们一个无聊的独家',
        subtext: '主动给一张买菜照',
        outcome: {
          narration: '你安排艺人穿着朴素去超市买菜，让狗仔拍了个够。"XX接地气买菜"的热搜虽然无聊，但至少挤走了他们准备曝的料。',
          statChanges: { prRisk: -3, fanLoyalty: 3 },
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
        outcome: {
          narration: '两人合拍了一条"当我遇见另一个我"的短视频，笑到岔气。视频播放量破亿，两人都涨了一大波粉。',
          statChanges: { fanLoyalty: 3, commercialValue: 4, prRisk: -3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 60 },
              narration: '合拍视频爆了！不仅播放破亿，品牌方看到传播力后追加了一个"双胞胎"概念的广告创意。这波操作直接转化成了商业合作。',
              statChanges: { fanLoyalty: 4, commercialValue: 5, money: 60000, prRisk: -3 },
            },
          ],
        },
      },
      {
        id: 'ignore_double',
        text: '无视',
        subtext: '不回应就好',
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
    description: '一位粉丝花了半年时间剪了一部你艺人的出道纪录片，从出道前一直到现在。质量高到离谱，B站播放量已经破千万。',
    emoji: '🎬',
    choices: [
      {
        id: 'repost_doc',
        text: '官方转发+感谢',
        subtext: '给粉丝最大的认可',
        outcome: {
          narration: '艺人亲自转发并写了一段长评论感谢这位粉丝。"双向奔赴"的故事感动了全网，连路人都开始追这部纪录片了。',
          statChanges: { fanLoyalty: 5, commercialValue: 3 },
          twist: {
            chance: 0.25,
            narration: '纪录片被一家视频平台看中，买下了独家版权并邀请原作者制作官方纪录片系列！粉丝成了签约导演，这个故事本身又上了一轮热搜。',
            statChanges: { fanLoyalty: 3, commercialValue: 3, money: 20000 },
          },
        },
      },
      {
        id: 'copyright_doc',
        text: '要求下架',
        subtext: '涉及未授权素材',
        outcome: {
          narration: '版权投诉导致视频下架，粉丝心寒了。"用爱发电换来一纸投诉"成了出圈的伤心梗。大量粉丝脱粉。',
          statChanges: { fanLoyalty: -7, prRisk: 4 },
        },
      },
      {
        id: 'invite_fan',
        text: '邀请粉丝加入官方团队',
        subtext: '把人才收编',
        outcome: {
          narration: '粉丝激动到哭！加入团队后制作的第一条官方视频质量炸裂。"别人家的运营"成了同行羡慕的模板。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, money: -10000 },
        },
      },
    ],
  },
  {
    id: 'random_ai_face',
    category: 'random',
    severity: 'low',
    title: 'AI换脸视频传疯了',
    description: '你打开抖音想放松一下，结果第一条推荐就是你的艺人——在菜市场跟大妈砍价，还拍了拍西瓜说"这瓜保熟吗"。你差点信了，直到你看到AI生成的第六根手指。但评论区没人在乎手指——播放量已经过亿了，"XX菜市场砍价"成了本周最火的梗。',
    emoji: '🤖',
    choices: [
      {
        id: 'fun_ai',
        text: '官方下场玩AI',
        subtext: '自己出一版更搞笑的',
        outcome: {
          narration: '你让艺人真的去了趟菜市场，买了个西瓜抱着拍了张照片，配文："这瓜我亲自挑的，保熟。"然后团队出了一套"AI vs 真人"对比图——左边是AI版的六根手指，右边是本人比了个五。科技博主、美食博主、搞笑博主全来蹭热度，你坐在办公室看着数据往上飙，觉得AI这东西也不是完全没好处。',
          statChanges: { fanLoyalty: 3, commercialValue: 4, prRisk: -3 },
        },
      },
      {
        id: 'legal_ai',
        text: '维权！侵犯肖像权',
        subtext: '发律师函',
        outcome: {
          narration: '律师函发了，平台删了一批视频。但AI换脸的法律边界模糊得像马赛克——律师打了半个月电话，最后只追回了一个"已处理"的自动回复。钱花了，效果没看到。而且网友们开始用马赛克版本传播了——你压了个寂寞。',
          statChanges: { money: -20000, prRisk: 3 },
        },
      },
    ],
  },
  {
    id: 'random_charity_challenge',
    category: 'random',
    severity: 'low',
    title: '公益挑战赛@你了',
    description: '一个全网公益挑战赛像击鼓传花一样在明星圈里转了一圈，现在传到你这了。上一个完成挑战的是某老戏骨，拍了条质朴到哭的视频。你的艺人看完后说了句："我也想做，但我怕被骂。"——TA说的是实话，上一个做砸了的明星被骂了整整一周。',
    emoji: '🏃',
    choices: [
      {
        id: 'creative_challenge',
        text: '创意参与',
        subtext: '用独特的方式完成挑战',
        outcome: {
          narration: '你和创意团队折腾了两天，最后拍了一条三分钟的短片——没有口号没有BGM，只有你的艺人一个人安静地做完了整个挑战。最后一个镜头是TA满头汗看着镜头说："我也不知道拍得好不好，但至少是真的。"这条视频的完播率破了平台纪录。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'standard_challenge',
        text: '正常完成',
        subtext: '规规矩矩拍一条',
        outcome: {
          narration: '十五分钟拍完，二十分钟剪完，半小时后上线。中规中矩，不惊艳也不出错。热评第一是"完成✓"，第二是"下一位"。你的艺人看了看数据说："...就这？"你说："就这。"然后你们一起沉默了三秒。',
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
        outcome: {
          narration: '艺人抱着"本喵"的合照冲上热搜第一。"人不如猫"的自嘲让全网路转粉。这只猫也成了艺人官方编外成员。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'ignore_cat',
        text: '随它去吧',
        subtext: '一只猫而已',
        outcome: {
          narration: '你没蹭这波热度，但猫主人蹭了。各种"碰瓷"视频越来越多，你的艺人被动成了背景板。',
          statChanges: { commercialValue: -3 },
        },
      },
    ],
  },
];
