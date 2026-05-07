import type { GameEvent } from '@/types/game';

export const prEvents: GameEvent[] = [
  {
    id: 'pr_press_conference',
    category: 'pr',
    severity: 'low',
    title: '新专辑发布会',
    description: '发布会场地的灯光刚调好，你在后台偷看了一眼——前三排坐的全是出了名爱挖坑的记者。提词器上滚动着你改了十七遍的通稿，但你知道，真正的战场是Q&A环节。你的艺人在化妆间里背台词，嘴里念念有词像在念经。',
    emoji: '🎙️',
    artistVariants: {
      idol: {
        description: '甄帅新专辑《Reborn》发布会，前三排记者席里至少五个是常年挖顶流黑料的。提词器上滚动着你改了十七遍的通稿，重点标红:"别聊数据、别聊超话、别聊上张专辑"。甄帅在化妆间背词，嘴里念叨着"我爱音乐、我爱粉丝"——超话大粉已经控评到位,「#甄帅新专辑名场面# 」词条蹲守中。',
      },
      actor: {
        description: '郝美丽金鸡之后第一部主演文艺片《漂流》的发布会，前三排是影评大 V 和几位挖坟型记者。提词器上的通稿你改了十七遍，重点是「不要提金鸡提名背后的资源争议」。郝美丽在化妆间小声背演员感言，眼神紧绷——文艺片发布会最怕的不是问题，是被说「没内容」。',
      },
      singer: {
        description: '高八度新专辑《八度空间》的线下发布会，来的一半是乐迷、一半是等着挑刺的乐评人。提词器上写着你改过十七遍的自述词，重点:「别提《我爱吃饭》代笔传闻、别提上张销量」。八哥在后台抱着吉他调弦，其实是在背词——原创音乐人最怕被问「这张是不是还是你同学写的」。',
      },
      influencer: {
        description: '冷冰凝转型后的第一张数字 EP 发布会——是的，带货主播也敢出专辑了。前三排坐的是等着看笑话的娱乐记者。提词器上通稿的重点是:「别提带货、别提 GMV、别提过去的假货风波」。冰冰在化妆间对着镜子练"我是用心做音乐的"表情，练了一下午还是不像。',
      },
      socialite: {
        description: '南陌格"艺人转型"首张 EP《格调》发布会，请的是高奢品牌朋友圈+时尚媒体。前三排坐的全是专门挖出身的八卦记者。提词器上的通稿重点是:「别提出道前、别提京圈关系、别提那些富婆传闻」。南陌格在后台反复练习"贵公子式微笑"，手指在西装口袋里攥得发白。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '邀请函是某公益基金会的"乡村教育守护人"爱心大使。你第一反应是"这个不错，偶像做公益对人设加分"——甄帅超话里的大粉已经开始在群里讨论"如果哥哥去要不要众筹助学金"。但第二反应是算账:"带几个代拍、拍多少合照发微博、要不要顺手发新单？"你问自己一句:"这是做公益，还是做营销？"',
      },
      actor: {
        description: '邀请函来自某老牌公益基金会——"乡村教育守护人"爱心大使。这种级别的公益对郝美丽这种拿过金鸡的演员是"人设积累"，不是"人设包装"。她看完邀请函沉默了一会儿，说:"我去，但不要宣传。"你知道这种"不宣传"反而是最好的宣传——演员走这种路线，圈内人都看得懂。',
      },
      singer: {
        description: '某公益基金会的"乡村音乐教室"计划——请高八度去山里给孩子们上一节音乐课。八哥自己出身普通家庭，小时候就是听收音机长大的。他看完邀请立刻说"去"。但你在脑子里算：这事包装得好是"高八度的音乐初心"，包装得差就是"作秀"。',
      },
      influencer: {
        description: '某公益基金会的邀请——"乡村教育守护人"爱心大使。冷冰凝是网红转型，公益对她而言是一条非常微妙的线：做得好能洗"带货网红"标签，做得不好就是"吃人血馒头做人设"。她看完照片说"我去"，但你知道她的带货粉里有一部分是看不得她"装文艺"的。',
      },
      socialite: {
        description: '邀请函是某公益基金会的"乡村教育守护人"爱心大使。南陌格的贵公子人设和"乡村支教"之间的反差感巨大——做得好能打出"不为名利的深度"，做得不好就是"装出来的深度"。他盯着照片说了句"去"，但你心里有数:"他出身好，这种场合的分寸感他自己未必有。"',
      },
    },
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
    artistVariants: {
      idol: {
        description: '宣传总监把平板推过来:"甄帅超话签到数据这周掉了 8%，得上个热搜救一下。" 报价单上「#甄帅颜值天花板# 」位置 80 万，「#甄帅新造型# 」40 万。你看了看甄帅上一条营业微博——转发 80 万，全是粉丝数据控评出来的。偶像的热搜不是买来做数据的，是买来证明「哥哥还在牌桌上」的。',
      },
      actor: {
        description: '宣传总监拿着平板进来:「郝老师下周文艺片路演，得提前烫个热搜，不然没人来。」报价单上「#郝美丽的演技# 」60 万，「#郝美丽文艺片路演# 」40 万。你心里清楚——演员买演技热搜，被同行看见会笑掉大牙，但不买，这场路演可能只有 200 个人到。',
      },
      singer: {
        description: '宣传总监把平板拍在桌上:"八哥新歌上线三天，榜单外 20 位，得买个热搜拉一下。" 「#高八度新歌封神# 」80 万，「#高八度回归原创# 」40 万。你盯着报价单犯愁——原创音乐人最怕被乐迷扒出「数据是买的」，但不买，这首八哥写了两年的歌可能就没人听。',
      },
      influencer: {
        description: '宣传总监摊开报价单:"冰姐，直播间这周 GMV 掉了 15%，得上个热搜引流。"「#冷冰凝直播间翻车# 」反向热搜 50 万，「#冷冰凝带货天花板# 」80 万。你和她对视——带货圈最不缺的就是买热搜，但每次买完都有一批黑粉出来扒「又买数据」。这笔账她自己都会算。',
      },
      socialite: {
        description: '宣传总监压低声音:"南陌格最近京圈传他被某品牌踢出局，得买个热搜压一下。"「#南陌格顶奢大使# 」100 万，「#南陌格贵公子感# 」60 万。你盯着报价单——贵公子人设最怕「营销痕迹重」，但在京圈这个局里，不营销就等于默认传闻是真的。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '一场直播采访中，记者眼睛一亮:"甄帅，网上都说流量偶像靠数据、不靠实力，你怎么看？"甄帅在镜头前愣了一下——这个问题你们这周的准备清单里没有。他看向镜头后面你站的位置，等你给个眼神。',
      },
      actor: {
        description: '直播采访录到一半，那位女记者突然合上本子:"郝老师，外界都说您是评委里有熟人才拿的金鸡新人奖。您怎么回应？"郝美丽沉默了两秒——这个问题你专门跟她提过三次"别接"。她看向镜头，等你的决定。',
      },
      singer: {
        description: '音乐节目的直播采访，主持人压低了声音:"八哥，很多老乐迷一直在传「《我爱吃饭》是你同学写的」，这事你怎么说？"八哥手里的话筒停了半秒——这是他最不想被问到的那个传闻。他扫了一眼你站的导演台。',
      },
      influencer: {
        description: '直播采访中，记者突然把话题带到了老地方:"冷冰凝，网上都说你当年带过假货、让粉丝烂脸，你这些年的转型算是在逃避吗？"冷冰凝眼睛一眯——这个问题她应对过无数次，但每次回应都是雷区。她看向镜头外你的方向。',
      },
      socialite: {
        description: '高端访谈节目现场直播，主持人笑着问了句:"南陌格老师，圈里一直有「贵公子其实出身并不显赫」的传言，您能给大家讲讲真实的您吗？"南陌格瞳孔微缩——这是他这辈子最不能回答的问题，因为"出道前"四个字能牵出来的东西太多了。他看了你一眼。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '甄帅生日当天全网炸了——北京国贸、上海陆家嘴、广州塔都投了大屏广告，武汉长江大桥下面挂了巨幅横幅，有一架私人飞机绕着机场拉着"甄帅生日快乐"横幅飞了整整两小时。#甄帅生日# 阅读量破 30 亿。后援会会长打电话来哭着说"哥哥必须有所表示"——偶像圈的规矩你懂的，不回应粉丝会寒心。',
      },
      actor: {
        description: '郝美丽生日当天粉丝应援意外壮观——不是大屏轰炸，而是有组织地给她捐了一整个乡村小学以她名字命名的图书角。#郝美丽生日# 阅读量 4 亿，但被捐助学校挂的感谢视频比任何应援都动人。演员粉丝和偶像粉丝完全是两种操作，你得匹配对等级别的回应。',
      },
      singer: {
        description: '高八度生日当天 QQ 音乐打榜前 20 全是粉丝自发买的单曲循环，微博热搜前 15 里 #高八度生日# 排第 3。更野的是——乐迷自发众筹买下了他出道酒吧的一整晚场，邀请他"回去唱一场"。乐迷的应援比偶像粉更有脑洞也更有人情。',
      },
      influencer: {
        description: '冷冰凝生日当天的应援完全是"带货模式"——她直播间老粉自发发起"生日爆单日"，一天把她直播间的销量抬到了双十一水平，还有头部代言品牌打出了"冰冰生日折扣"。#冷冰凝生日# 阅读 6 亿但讨论度比偶像低——带货圈的应援是用"真金白银"说话的。',
      },
      socialite: {
        description: '南陌格生日那天超夸张——某高奢品牌给他办了场专属生日派对，圈内贵公子贵小姐到齐。粉丝应援是包下一整栋 LED 写字楼，24 小时循环播放"南陌格生日快乐"。#南陌格生日# 阅读 8 亿，话题词条是 #贵公子生日排面# ——这种排面需要对等的贵公子式回应，不能太热情也不能太冷淡。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '微博之夜座位表流出——甄帅在第三排，前面坐的有两个出道时间不到一年的小爱豆。粉丝超话已经炸了，「#甄帅 微博之夜 第三排# 」冲上热搜第 6。后援会大粉连夜发了篇 5000 字长文「论顶流的咖位与排面」，超话置顶。你看着私信里 200 多条「姐你必须管管」的留言。',
      },
      actor: {
        description: '微博之夜的座位图传到圈内群——郝美丽被排到第三排靠边，前面坐着两位流量小花。圈内人一眼就懂:「金鸡新人奖在微博这种流量场不值钱」。她团队的人在群里阴阳:「演员不该来这种场」。但你知道，演员不来流量场，下一个戏的招商就少一档。',
      },
      singer: {
        description: '微博之夜座位表流出——高八度被安排在第三排，前面坐着两位刚出道半年的偶像爱豆。乐迷直接在 QQ 音乐评论区刷屏:「为什么金曲入围歌手要给爱豆让位」。八哥本人倒不在意，但你在意——音乐人在流量场的位置，就是下一年商演价格的锚。',
      },
      influencer: {
        description: '微博之夜座位表泄露——冷冰凝被排到第三排偏角。带货圈的人嘴上说「不在乎排面」，身体却很诚实——位置代表着平台对她「转型成不成」的判断。她直播间老粉已经在评论区刷:「凭什么我冰姐 GMV 比她们高还坐第三排」。',
      },
      socialite: {
        description: '微博之夜的座位图被时尚圈传开了——南陌格从去年的第一排滑到了今年的第三排偏角。这种细节圈内人一眼就能读出来:「南陌格那条贵公子线松动了」。三个合作的高奢品牌的市场负责人都在朋友圈点了那张座位图截图——这是行业最无声但最致命的信号。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '团队开了两小时的会讨论甄帅超话签到率连跌三个月。运营把对比图摊在桌上——左边是甄帅精修九宫格（点赞 30 万），右边是某新晋男爱豆在训练室地上瘫着吃泡面的随手拍（点赞 200 万）。偶像行业最怕的就是「端着」——但甄帅顶流人设最吃的恰好就是那点「端着」。你盯着那碗泡面发呆。',
      },
      actor: {
        description: '团队开会讨论郝美丽的微博互动连跌三个月。运营拿出对比图——左边郝美丽精修的金鸡红毯大片（3 万互动），右边某新生代女演员在剧组啃盒饭的随手拍（40 万互动）。演员的社交媒体是一门玄学:太精修被说「耍大牌」，太接地气被说「掉咖」。会议室里没人敢先开口。',
      },
      singer: {
        description: '团队复盘高八度微博互动三个月下滑。运营摊开对比图——左边八哥精修的专辑大片（1.5 万互动），右边某民谣歌手在 live house 后台抽烟的抓拍（30 万互动）。乐迷要的不是精修，是「音乐人的真实感」。八哥本人不爱发微博，但不发微博，新歌就没人听。',
      },
      influencer: {
        description: '团队开会复盘冷冰凝转型后微博数据。运营拿出对比图——左边冰凝精修的时尚硬照（5 万互动），右边某同期转型网红在家素颜炖汤的日常（80 万互动）。冰凝心里清楚:带货粉看的就是「人味儿」，精修反而让她离「艺人」更近、离「粉丝」更远。',
      },
      socialite: {
        description: '团队开会讨论南陌格微博互动连跌三个月。运营拿出对比图——左边南陌格顶奢大片（8 万互动），右边某真正的二代在京郊骑马的抓拍（150 万互动）。贵公子人设的死穴在这里:「你装的」和「他本来就是」的差距，是任何精修都补不上的。会议室里安静得能听见空调声。',
      },
    },
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
  {
    id: 'pr_blue_v_meltdown',
    category: 'pr',
    severity: 'low',
    title: '官微小编翻车了',
    description: '工作室微博实习生为了"接地气"，转发艺人新剧路透时发了一句"姐妹们冲鸭🐶"——配图自带土味滤镜。半小时内 #XX工作室小编# 上热搜，截图被做成表情包。粉丝群里炸锅:"这是哪个奇行种在运营我家官微？"',
    emoji: '🤖',
    artistVariants: {
      idol: { description: '甄帅的工作室微博发了句"姐妹们冲鸭🐶"配土味滤镜路透。粉丝当场破防——"我们顶流官微说话像 60 万粉的探店号"。半小时#甄帅工作室小编#热搜爆了，超话置顶帖标题:《我们花钱请的运营在干什么》。' },
      actor: { description: '郝美丽的工作室在转发她新文艺片的杀青照时配文"姐妹们冲鸭🐶"。文艺片粉丝直接懵了——"郝老师的官微在玩抽象？"圈内人开始截图传:"金鸡新人官微比新人还离谱。"' },
      singer: { description: '高八度的工作室在转发新单曲MV时配"姐妹们冲鸭🐶"——乐迷当场掀桌:"音乐人的官微说话像奶茶店活动文案。"豆瓣小组里有人写:"这就是为什么我从不关注艺人官微。"' },
      influencer: { description: '冷冰凝的工作室转发新代言时来了句"姐妹们冲鸭🐶"——这本来是她带货时的口头禅，但路人不买账:"网红就是网红，转型再久也是这个味儿。"#冷冰凝官微# 词条带刺。' },
      socialite: { description: '南陌格的工作室在转发他高奢硬照时配文"姐妹们冲鸭🐶"——贵公子人设崩塌现场。粉丝群:"我们陌哥的官微说话像义乌小商品城客服。"圈内立刻有人在群里发:"这种调性能配南陌格？"' },
    },
    choices: [
      {
        id: 'fire_intern',
        text: '官方道歉+开除小编',
        subtext: '立刻撇清责任',
        outcome: {
          narration: '一小时内删博、致歉、宣布人员调整。热搜降下去了，但实习生在脉脉发了篇长文《我在某顶流工作室被祭天的 30 天》当晚阅读破百万——"工作室甩锅文化"成了第二轮舆论焦点。',
          statChanges: { prRisk: 3, commercialValue: -2 },
        },
      },
      {
        id: 'embrace_meme',
        text: '将错就错玩梗',
        subtext: '把翻车当人设',
        outcome: {
          narration: '你让小编保留那条博，又发了一条"是的我就是这么野"。粉丝从破防变成大笑，#XX工作室小编是哪位# 反向冲到热搜第 8。三天后某互联网大厂蓝V私信"求关注互动"——黑红也是红。',
          statChanges: { fanLoyalty: 4, commercialValue: 2 },
          twist: {
            chance: 0.25,
            narration: '玩梗玩过头——小编下一条又来了句"哥哥嘎嘎乱杀"。这次连黑粉都觉得太尬了。从"野"变成"low"只用了 48 小时。',
            statChanges: { prRisk: 4, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'hire_pro_team',
        text: '换专业运营团队',
        subtext: '花钱解决 (-8万)',
        requireMinMoney: 80000,
        outcome: {
          narration: '你挖了某顶刊的前编辑过来做主编。三个月后官微的每条文案都像精修——但互动量也跌了一半。专业的代价是失去人味。',
          statChanges: { money: -80000, commercialValue: 3, fanLoyalty: -2 },
        },
      },
    ],
  },
  {
    id: 'pr_magazine_cover_war',
    category: 'pr',
    severity: 'medium',
    title: '顶刊双封争议',
    description: '某老牌时尚顶刊 12 月号定了双封——你的艺人和另一位流量同框。封面拍出来后，对方工作室不知通过什么渠道拿到了"主封"位置（书店摆放时朝外的那一面）。粉丝在超话刷"凭什么"，对家粉丝刷"姐姐配 C"，杂志官博评论区一夜破十万。',
    emoji: '📔',
    minDay: 8,
    artistVariants: {
      idol: { description: '某老牌时尚顶刊把甄帅和另一位顶流安排成双封——主封给了对方。甄帅粉丝当晚开始集体抵制:"我们一个人能买空一版，主封凭什么不是哥哥？"对家粉丝刷"咖位决定一切"。两边超话相互引战，杂志官博评论区破二十万。' },
      actor: { description: '某文艺顶刊给郝美丽和另一位影后做双封纪念金鸡。主封给了那位影后——粉丝倒是没闹，但圈内自媒体开始算账:"郝美丽这次明显被压一头，资源段位卡死了。"她本人盯着杂志样书看了很久。' },
      singer: { description: '某音乐杂志为高八度和另一位摇滚老炮做双封致敬"原创"。主封给了对方——乐迷分两派:"老炮配主封理所当然" vs "高八度今年专辑销量是他三倍"。微博上 #谁配做主封# 词条爆了。' },
      influencer: { description: '某商业顶刊给冷冰凝和另一位短视频女王做"她经济"双封。主封给了对方——冰冰团队当晚就要求杂志方解释。短视频圈两派人马在评论区开战，杂志官博评论破十五万。' },
      socialite: { description: '某高奢顶刊给南陌格和另一位新生代男演员做"新世代男性"双封。主封给了那位演员——南陌格的贵公子粉立刻开始反向考据:"陌哥才是真贵气，那位是流量。"两边粉丝对线，杂志方紧急联系工作室。' },
    },
    choices: [
      {
        id: 'demand_resplit',
        text: '强硬要求改主封',
        subtext: '威胁退出+索赔',
        outcome: {
          narration: '你给杂志方发了律师函并暗示退出。三天后杂志改成"双主封轮换上架"——A 城卖你的封面，B 城卖对家。两边粉丝都不满意，但你的咖位定盘了。圈内传"XX工作室真敢闹"。',
          statChanges: { commercialValue: 3, prRisk: 4, fanLoyalty: 3 },
        },
      },
      {
        id: 'fan_buyout',
        text: '动员粉丝买爆',
        subtext: '用销量数据反杀',
        outcome: {
          narration: '后援会发动"主封不重要、销量见真章"运动，三天卖空两版。杂志方不得不在第四版加印声明感谢"XX粉丝战斗力"。对家粉丝沉默了——数据这种东西骗不了人。',
          statChanges: { fanLoyalty: 5, commercialValue: 4, money: -20000 },
        },
      },
      {
        id: 'gracious_post',
        text: '艺人本人发文表示祝福',
        subtext: '高情商化解',
        outcome: {
          narration: '艺人微博发了张和对家的合照，配文"很开心一起拍这本"。路人盘瞬间涨了一截，#XX 格局# 上热搜第 5。但粉丝群里有部分人觉得"哥哥/姐姐太软了"——核心粉的团结度被消耗了一点。',
          statChanges: { commercialValue: 4, prRisk: -3, fanLoyalty: -2 },
          conditionalOutcomes: [
            {
              condition: { minPrRisk: 50 },
              narration: '艺人发文祝福，但因为正处舆情风口，路人冷嘲热讽:"装大度有啥用，自己事都没解决呢。"该发的不该发的全被翻出来鞭一遍。',
              statChanges: { prRisk: 4, fanLoyalty: -3 },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'pr_pinned_comment_disaster',
    category: 'pr',
    severity: 'low',
    title: '微博精选评论翻车',
    description: '艺人发了条新片宣传微博，运营按惯例去精选评论。结果其中一条精选写的是"姐姐/哥哥太美/帅了，吊打 XXX"——XXX 是某位前辈艺人。半小时内对方粉丝带着话题"#XX踩前辈营销#"杀进评论区。',
    emoji: '💬',
    choices: [
      {
        id: 'remove_apologize',
        text: '撤精选+小编道歉',
        subtext: '快速止损',
        outcome: {
          narration: '十分钟撤精选，二十分钟发道歉博，承认"小编审核疏忽"。对方粉丝勉强收兵，但你也知道圈内自此"XX 粉丝就是爱踩前辈"会被记一笔。',
          statChanges: { prRisk: -2, fanLoyalty: -2 },
        },
      },
      {
        id: 'silent_remove',
        text: '默默撤掉装没事',
        subtext: '不解释，不回应',
        outcome: {
          narration: '撤了，没声明。营销号立刻截图存档:"看，撤了就是默认了。" #XX工作室无回应# 上热搜，被解读为"心虚"。',
          statChanges: { prRisk: 5, fanLoyalty: -3 },
        },
      },
      {
        id: 'reach_out_senior',
        text: '私下联系前辈团队致歉',
        subtext: '走人情路线',
        outcome: {
          narration: '你打电话给那位前辈的经纪人，送了束花并发了私信致歉。前辈本人转发了一条"年轻人路还长"的微博——直接帮你把舆论压了下去。但你欠了一份人情，圈内的人情账总有一天要还。',
          statChanges: { prRisk: -3, commercialValue: 2 },
          unlockTag: 'owe_senior_favor',
        },
      },
    ],
  },
  {
    id: 'pr_paparazzi_protection_fee',
    category: 'pr',
    severity: 'high',
    title: '狗仔头子来"谈合作"',
    description: '某顶级狗仔工作室的老板亲自约你喝茶。开场白很客气:"我们手上有一些素材，关于您家艺人最近的私下行程。我们想合作——每月固定一笔，我们决定哪些发哪些不发。"他没说金额，他在等你出价。',
    emoji: '📸',
    minDay: 8,
    artistVariants: {
      idol: { description: '那个能让顶流半夜睡不着觉的狗仔头子约甄帅的经纪人喝茶。"甄老师最近有些和女艺人的同框，我们手里挺多素材。每月固定笔合作费，我们替您家把控发哪些不发哪些。"对偶像来说，这是性命攸关的合作或自杀。' },
      actor: { description: '那位资深娱记约你喝茶。"郝老师最近的行程有点东西——比如和某导演的几次单独碰面。" 演员被狗仔盯着的杀伤力比偶像小，但金鸡奖刚拿完，舆论安全期也只剩半年。' },
      singer: { description: '狗仔头子来约喝茶。"高老师虽然咖位不大但话题度够——比如他和那位老乐手的恩怨、和酒吧老板娘的关系。每月给个数，我们替您家压。"对音乐人来说这种合作钱花得最不甘心。' },
      influencer: { description: '狗仔头子主动约谈。"冷小姐最近的行程我们都拍着——某些品牌方的私下饭局、某些直播之外的口水战。每月一笔固定费用，我们替您筛选发哪些。" 对网红来说狗仔反而是熟门熟路的合作伙伴。' },
      socialite: { description: '那位老资格狗仔约你喝茶——他笑得特别意味深长:"南老师那段「商务模特」的旧账，市面上还有几个底片在流传。每月一笔合作费，我们替您家把这些素材永远压在抽屉里。" 这一次出价的不是合作，是赎金。' },
    },
    choices: [
      {
        id: 'pay_protection',
        text: '付保护费',
        subtext: '每月固定 (-15万)',
        requireMinMoney: 150000,
        outcome: {
          narration: '一个月十五万，签了三个月试用期。当月果然有两条本该爆的负面被他们按下来。但你也知道——你成了他们的鱼塘，他们随时可以把价码翻倍。',
          statChanges: { money: -150000, prRisk: -5 },
          unlockTag: 'paparazzi_deal',
          twist: {
            chance: 0.3,
            narration: '第二个月狗仔涨价到二十万，理由是"内容更多了"。你心里清楚——他们就是在用你艺人的料，反过来勒索你艺人。',
            statChanges: { money: -50000, prRisk: 3 },
          },
        },
      },
      {
        id: 'refuse_warn',
        text: '当场拒绝并放狠话',
        subtext: '"敢发就告"',
        outcome: {
          narration: '你拒绝得很硬。三天后他们果然放出一条"某顶流私下行程"的预告片——打码、留悬念。你知道下周一就会有正片。',
          statChanges: { prRisk: 8, commercialValue: -3 },
        },
      },
      {
        id: 'reverse_buy',
        text: '一次性买断现有素材',
        subtext: '不签长期 (-50万)',
        requireMinMoney: 500000,
        outcome: {
          narration: '五十万买断了他们手里目前所有的素材，并签了"该批素材不再使用"的协议。他们收钱办事，但下次他们拍到新的还会来——这只是把雷往后拖了三个月。',
          statChanges: { money: -500000, prRisk: -8 },
          unlockTag: 'paparazzi_one_time',
        },
      },
      {
        id: 'go_to_competitor',
        text: '主动联系另一家狗仔做反制',
        subtext: '请人盯着这家狗仔',
        outcome: {
          narration: '你联系了和这家狗仔有梁子的另一个团队，提供一笔钱让他们专门盯这家狗仔的把柄。一周后那家狗仔的老板自己被同行拍到出入会所——他没再来找过你。但你彻底踏入了狗仔生态的内部战争。',
          statChanges: { money: -100000, prRisk: -3 },
          unlockTag: 'paparazzi_war',
          twist: {
            chance: 0.35,
            narration: '反制狗仔的事不知怎么传到圈外——几家正经媒体写了"娱乐圈黑色生态链"长文，你的工作室名字赫然在列。',
            statChanges: { prRisk: 10, commercialValue: -5 },
          },
        },
      },
    ],
  },
  {
    id: 'pr_airport_fan_brawl',
    category: 'pr',
    severity: 'medium',
    title: '机场粉丝打起来了',
    description: '艺人凌晨从国外回来，机场接机粉丝群里因为"占位"问题先吵起来——你家粉丝和某对家粉丝隔着栏杆对骂，结果其中一个人推搡过界了。短视频:有个戴你家应援帽的女孩拽住对家粉丝头发。三十秒后视频上传，一小时上热搜。',
    emoji: '✈️',
    artistVariants: {
      idol: { description: '甄帅凌晨从日本巡演回来，浦东机场的接机粉丝大概有两千。和对家流量粉丝因为"占位"先吵起来，最后两个戴甄帅应援帽的女孩动手了——其中一个揪住对家粉丝头发被全程录像。#甄帅粉丝打人# 一小时冲到热搜第 4。' },
      actor: { description: '郝美丽从戛纳回来，机场接机的几百个粉丝也算稀罕。和某偶像粉丝因为占位置吵起来，结果两边动手——演员粉丝下场打架本身就是大新闻，圈内大佬群里立刻有人发"演员粉丝怎么这种水平"。' },
      singer: { description: '高八度从台北 Live House 巡演回来，机场上百个乐迷接机。和路过的某偶像粉丝因为"机场不是 LiveHouse"的争执推搡起来。#高八度粉丝大打出手# 词条很快爆了——乐迷打架在话题上比偶像粉丝打架更刺眼。' },
      influencer: { description: '冷冰凝从米兰时装周回来，几百个直播间老粉去机场接机。和某当红女星粉丝因为占位推搡——直播圈粉丝很多是中年女性，冲突视频里有个戴冰冰应援帽的阿姨打了对方一耳光。话题立马炸了。' },
      socialite: { description: '南陌格从巴黎高定回来，机场接机的私生饭加正经粉丝两百多。和某男团粉丝因占位互推，两个戴南陌格应援帽的男粉打了起来——男粉打架视频比女粉打架更戏剧化，#贵公子粉丝当街开揍# 冲热搜第 7。' },
    },
    choices: [
      {
        id: 'public_apology_compensation',
        text: '工作室公开道歉+赔偿对方',
        subtext: '正面承担 (-8万)',
        outcome: {
          narration: '工作室发声明致歉，并和对方粉丝私下达成赔偿协议。媒体对你家"工作室有担当"的评价上来了，但核心粉里有人不满:"为什么我们粉丝吃亏了你还要赔钱？"',
          statChanges: { money: -80000, prRisk: -5, fanLoyalty: -3 },
        },
      },
      {
        id: 'distance_fan',
        text: '声明"她不是我家粉丝"',
        subtext: '撇清关系',
        outcome: {
          narration: '工作室发声明:"该名打人女子并非我方艺人正规粉丝组织成员，其行为与本工作室无关。" 法律上没问题，但当晚就有人扒出那女孩在某签售会上的合影——"工作室连真粉都不认了"成了新热搜。',
          statChanges: { prRisk: 8, fanLoyalty: -8 },
        },
      },
      {
        id: 'artist_personal_apology',
        text: '艺人本人发微博沉痛道歉',
        subtext: '态度优先',
        outcome: {
          narration: '艺人发了一条三百字长博:"作为公众人物我有责任引导粉丝。" 路人感动了，对家粉丝暂时收兵。但你知道——艺人本人下场致歉，今后任何粉丝行为都会被栽到艺人头上。',
          statChanges: { prRisk: -5, fanLoyalty: 3, commercialValue: 2 },
        },
      },
      {
        id: 'restructure_fanclub',
        text: '借机整顿后援会',
        subtext: '解散闹事的支援站',
        outcome: {
          narration: '你顺手把那个一直闹的前线大粉支援站给解散了——理由现成。后援会内部一片惊呼，但其他大粉立刻收敛。短期粉丝团掉了一些核心，长期管理成本下来了。',
          statChanges: { fanLoyalty: -5, prRisk: -3 },
          unlockTag: 'fanclub_purged',
        },
      },
    ],
  },
  {
    id: 'pr_livestream_slip',
    category: 'pr',
    severity: 'medium',
    title: '直播失言',
    description: '艺人一场两小时的品牌直播，倒数第二分钟突然冒了一句:"哎那个 XX 城市的人不都那样嘛——" 直播间瞬间几千人弹幕刷屏"地图炮""退订该品牌"。商务连夜叫团队开会:"剪辑切片已经传遍小红书了。"',
    emoji: '🎤',
    minDay: 5,
    artistVariants: {
      idol: { description: '甄帅在某品牌的直播间走神了——倒数第二分钟，被网友带节奏问家乡话题，他回了一句"反正 XX 那地方的人不都那样嘛"。直播间炸锅，#甄帅地图炮# 半小时冲热搜第 6。该城市的粉丝控评开始撤旗。' },
      actor: { description: '郝美丽在某文艺刊的直播聊新片，提到一位记者来自 XX 城市时随口说"那种地方很难出人才呢" ——演员说这种话的杀伤力是偶像的两倍，圈内"郝美丽偏见"立刻发酵。' },
      singer: { description: '高八度在 LiveHouse 直播尾声，半玩笑半认真说了句"XX 城市的乐迷一向不行"——本来是和粉丝玩梗，结果被切片传出去成了"地域歧视"，原本对他无感的路人开始反扑。' },
      influencer: { description: '冷冰凝在带货直播尾声讲笑话:"我表妹从 XX 来的，一进城就懵了"——本意自嘲家庭，但切片立刻被解读为"嘲笑该城市落后"。直播间瞬间撤购退款的人比订购的人还多。' },
      socialite: { description: '南陌格在某高奢直播尾声，和品牌方互动时不经意说"XX 那种地方哪有什么品味"——贵公子人设瞬间从"格调"变成"傲慢"，#贵公子瞧不起小地方# 冲热搜第 3。' },
    },
    choices: [
      {
        id: 'apologize_visit',
        text: '艺人亲自飞该城市道歉+做公益',
        subtext: '诚意补救 (-15万)',
        requireMinMoney: 150000,
        outcome: {
          narration: '艺人飞过去做了一场公益直播+一场粉丝面谈，全程哽咽道歉。当地市民看到了诚意，舆论从"地图炮"变成"知错就改"。该城市粉丝甚至自发反向控评。',
          statChanges: { money: -150000, prRisk: -8, fanLoyalty: 4 },
        },
      },
      {
        id: 'small_apology',
        text: '工作室发声明+艺人微博道歉',
        subtext: '标准操作',
        outcome: {
          narration: '声明+道歉发了，话题降下去了，但 XX 城市的粉丝群组集体退出超话——核心数据掉了。',
          statChanges: { prRisk: -3, fanLoyalty: -3 },
        },
      },
      {
        id: 'twist_meaning',
        text: '声明"被恶意剪辑"',
        subtext: '甩锅切片号 (-3万律师函)',
        requireMinMoney: 30000,
        outcome: {
          narration: '律师函满天飞，部分切片号撤了。但完整版直播录像里那句话清清楚楚——"被恶意剪辑"四个字很快变成了笑话。',
          statChanges: { money: -30000, prRisk: 8, fanLoyalty: -6 },
        },
      },
      {
        id: 'silence_pass',
        text: '冷处理装没事',
        subtext: '不回应',
        outcome: {
          narration: '热搜挂了三天后自然下去，但 XX 城市每个相关词条下都有人挂着这件事鞭三个月。看不见的损失最难量化。',
          statChanges: { prRisk: 4, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'pr_donation_amount_doubt',
    category: 'pr',
    severity: 'medium',
    title: '捐款金额被质疑',
    description: '某地洪灾，明星捐款榜单出来——你艺人捐了 50 万。本该是正面。但有人对比了"某顶流捐 500 万、某老演员捐 200 万、某网红捐 100 万"，做了个图叫"明星捐款诚意排行榜"，你艺人排在中下。半小时#XX 捐款 50 万被嘲#爆。',
    emoji: '💰',
    choices: [
      {
        id: '追加捐款',
        text: '追加到 200 万',
        subtext: '加码挽尊 (-150万)',
        requireMinMoney: 1500000,
        outcome: {
          narration: '团队立即追加 150 万。第二张榜单出来你升到中上位，但圈内人都看出来"被骂之后才追加"——"诚意"这两个字反向掉价。',
          statChanges: { money: -1500000, prRisk: -3, fanLoyalty: 3, commercialValue: -2 },
        },
      },
      {
        id: 'silent_donate_more',
        text: '匿名追加 150 万',
        subtext: '不公开',
        outcome: {
          narration: '匿名追加 150 万到红十字会账户。一周后某当地媒体扒出受捐方账目里有"匿名 150 万艺人款"——追溯到你工作室的银行流水。"低调做慈善"成了热搜，路人盘大涨。',
          statChanges: { money: -1500000, prRisk: -5, fanLoyalty: 7, commercialValue: 4 },
        },
      },
      {
        id: 'public_response',
        text: '发声明解释"量力而行"',
        subtext: '硬刚舆论',
        outcome: {
          narration: '艺人发了条长博:"做慈善不该是数字游戏。" 三十万评论里一半骂一半挺。粉丝护得死死的，但路人开始觉得"艺人格局有点小"。',
          statChanges: { fanLoyalty: 3, commercialValue: -3, prRisk: 3 },
        },
      },
      {
        id: 'on_site_volunteer',
        text: '艺人飞灾区做志愿者',
        subtext: '行动比金额更重要 (-5万)',
        outcome: {
          narration: '艺人偷偷飞灾区做志愿者，三天没发微博。第四天有当地受灾群众发自拍带到艺人——"原来 XX 在这"，舆论瞬间从"捐少了"变成"亲自下场"。这一手让你赚回来的远比那 150 万多。',
          statChanges: { money: -50000, fanLoyalty: 8, commercialValue: 4, prRisk: -8 },
        },
      },
    ],
  },
  {
    id: 'pr_airport_outfit_war',
    category: 'pr',
    severity: 'low',
    title: '机场街拍品牌大战',
    description: '艺人下个月有四趟机场行程。商务部递来一份名单:四个高奢品牌都想"独家穿着出镜"——每家都暗示"如果同行品牌也穿了，我们就撤"。你看了看名单——这四家品牌互相是死敌。',
    emoji: '🛍️',
    artistVariants: {
      idol: { description: '甄帅下个月四趟商务行程。四个高奢品牌都想"独家机场出镜"，互相是死敌。商务总监压力很大:"哥哥的机场图就是顶流标尺，给谁不给谁都得罪人。"' },
      actor: { description: '郝美丽下个月有四个文艺片活动机场行程。四个高级时装品牌争着要"独家穿着"——演员的机场图是高奢公关战的兵家必争之地。' },
      singer: { description: '高八度下个月四个城市巡演机场。四个潮牌高奢同时争夺穿着权——音乐人的机场图比他的歌单还有商业价值，每家品牌都拿到一张是行情。' },
      influencer: { description: '冷冰凝下个月四趟商务出行。四个高奢同时排队要她穿——网红转型的最佳证明就是"高奢为我打架"，但每家都要"独家",她得做选择。' },
      socialite: { description: '南陌格下个月四趟出行。四个顶奢品牌同时争"独家穿着"——贵公子的机场图本来就是这四家争夺战的核心战场，每张图后面都是上千万级合作。' },
    },
    choices: [
      {
        id: 'rotate_brands',
        text: '四家轮流穿，每家一次',
        subtext: '人人有份',
        outcome: {
          narration: '操作得很均衡，但每家品牌都觉得"自家不是首选"。第三场之后有家品牌私下跟你说"以后不见了"——拒绝差异化的代价是没有忠诚度。',
          statChanges: { money: 200000, commercialValue: 3 },
        },
      },
      {
        id: 'highest_bidder',
        text: '价高者得，全程独家',
        subtext: '一家通吃 (+大额代言费)',
        outcome: {
          narration: '最后一家以 600 万拿下"四趟独家穿着"。你赚翻了，但其他三家在内部 PR 群里立马联手"以后不再考虑 XX 工作室"——你赢了一仗，输了战略。',
          statChanges: { money: 600000, commercialValue: 3, prRisk: 3 },
          unlockTag: 'pr_offended_brands',
        },
      },
      {
        id: 'mix_indie',
        text: '机场穿独立设计师品牌',
        subtext: '不站队',
        outcome: {
          narration: '艺人四趟全穿独立设计师作品。四家高奢都松了口气，反过来夸"XX 有品位、不站队"。某独立品牌因此爆了——下个月找你艺人合作的设计师排了一长串。但短期没拿到代言费。',
          statChanges: { commercialValue: 4, fanLoyalty: 4, money: -20000 },
        },
      },
    ],
  },
  {
    id: 'pr_cp_official_denial',
    category: 'pr',
    severity: 'high',
    title: '官方声明否认CP',
    description: '艺人和某搭档的"糖"已经磕了大半年，超话最大数据来源就是 CP 粉。但搭档那边经纪人发来私信:"两边都已发展到要拍真戏的地步，你们必须发个声明撇清。" 你打开 CP 超话——3000 万 CP 粉。',
    emoji: '💔',
    minDay: 10,
    artistVariants: {
      idol: { description: '甄帅和某女团成员的 CP 嗑了大半年——3000 万 CP 粉撑起了甄帅一半的数据。但女方公司新签了真同框合作，对方经纪人通牒:"必须发否认声明，不然两边都失血。"偶像 CP 一旦官方拆，掉粉是七位数级别。' },
      actor: { description: '郝美丽和搭档男主因新片宣传期"糖度过高"——CP 粉积累了 800 万。但男主新发展的真感情准备公开，他经纪人来通牒:"必须官方拆。" 演员 CP 拆了影响小，但你艺人这一年的话题度大半来自这个。' },
      singer: { description: '高八度和某女歌手的"音乐 CP"已经维持一年——豆瓣小组活跃度暴涨 300%。但她下张专辑要和别人合作，需要官方否认你们关系。乐迷 CP 一旦拆掉，豆瓣小组三天能死。' },
      influencer: { description: '冷冰凝和某男主播的"直播 CP"是她吸粉的主力——双人连麦每场 GMV 翻三倍。但男方公司不愿意了，要求"官方撇清"。撇了立刻丢一半带货流量。' },
      socialite: { description: '南陌格和某女演员的"贵公子 CP"已经成了高奢市场最热的公关组合——CP 粉 1500 万，贵公子人设的一半权重在她身上。但女方家族介入了，强制要求"必须否认"。这一拆，他贵公子人设的话题热度立马砍半。' },
    },
    choices: [
      {
        id: 'sincere_denial',
        text: '正式发联合声明否认',
        subtext: '一刀两断',
        outcome: {
          narration: '两家联合发声明:"双方仅为合作关系。" CP 超话当晚塌房，三天掉粉七位数。但你也甩掉了一个长期定时炸弹。',
          statChanges: { fanLoyalty: -10, commercialValue: -5, prRisk: -8 },
          unlockTag: 'cp_officially_denied',
        },
      },
      {
        id: 'delay_with_excuse',
        text: '拖延+用模糊话术应付',
        subtext: '"我们专注事业"',
        outcome: {
          narration: '工作室发了句"专注事业"。CP 粉自我安慰"这就是默认了"，搭档那边怒了——"我让你拆你不拆？" 圈内对家立刻开始放更多对你不利的料。',
          statChanges: { fanLoyalty: 4, commercialValue: -3, prRisk: 7 },
        },
      },
      {
        id: 'refuse_keep_cp',
        text: '硬挺，拒绝声明',
        subtext: 'CP 流量不能丢',
        outcome: {
          narration: '你们正面回绝。搭档那边连夜发单方面声明"我从未承认任何 CP 关系"——你被晾在原地。CP 粉骂你"踢人下井"，搭档粉骂你"贪婪"。两头不讨好。',
          statChanges: { fanLoyalty: -8, prRisk: 10, commercialValue: -3 },
        },
      },
      {
        id: 'turn_into_brotp',
        text: '把 CP 转化为「事业搭档」',
        subtext: '保留搭档关系不带感情',
        outcome: {
          narration: '你和搭档团队联合策划了一组"事业互助"vlog——保留同框，砍掉暧昧。CP 粉哀嚎了一周，剩下的转化成"事业粉"留下来了。这一手算把雷拆了一半。',
          statChanges: { fanLoyalty: -3, commercialValue: 3, prRisk: -3 },
          unlockTag: 'cp_to_brotp',
        },
      },
    ],
  },
  {
    id: 'pr_studio_admin_clapback',
    category: 'pr',
    severity: 'medium',
    title: '工作室小编回怼黑粉翻车',
    description: '工作室微博下面常年有几个固定黑号挂着骂。今天小编实在憋不住，回了一句"建议黑子先去看看自己长什么样再喷别人"。然后发现回复用的是工作室主号。截图三分钟后传到豆瓣鹅组，#XX工作室骂粉# 上热搜。',
    emoji: '🤬',
    choices: [
      {
        id: 'fire_apology',
        text: '官宣开除小编+艺人本人致歉',
        subtext: '舍卒保车',
        outcome: {
          narration: '声明+开除+艺人微博三连，态度做足了。当晚热搜降到 30 名外，但被开除的小编在朋友圈发了:"老板叫我那么回的。" 截图传出去，#XX老板甩锅#成了第二轮焦点。',
          statChanges: { prRisk: 4, fanLoyalty: -3 },
        },
      },
      {
        id: 'go_legal',
        text: '把那几个黑号告了',
        subtext: '法律手段反制 (-5万)',
        outcome: {
          narration: '律师函发到底，三个黑号公开身份道歉、删号。"工作室硬气"的话头起来了，#XX 维权胜诉# 取代了原本的话题。但你也得罪了那帮黑号背后可能存在的某些圈内势力。',
          statChanges: { money: -50000, prRisk: -5, fanLoyalty: 4, commercialValue: 2 },
          unlockTag: 'studio_lawsuit',
        },
      },
      {
        id: 'take_blame_personally',
        text: '老板/经纪人本人出来认错',
        subtext: '"是我让小编这么做的"',
        outcome: {
          narration: '你亲自发微博承认"管理失职"，公开道歉。粉丝感动到不行，路人也夸你"有担当"。但圈内有人记下来:"XX 工作室经纪人能下场背锅。" 是把双刃剑——以后任何风波都可能被叫去背。',
          statChanges: { fanLoyalty: 5, prRisk: -5, commercialValue: 2 },
        },
      },
      {
        id: 'pretend_hack',
        text: '声明账号被盗',
        subtext: '甩锅给"黑客"',
        outcome: {
          narration: '工作室发声明:"账号疑似被盗，相关回复非本工作室发布。" 但 IP 反查工具立刻被网友拿出来——同 IP 之前发过工作室正常通告。"装黑客被识破"成了 emoji 包，#XX 演技# 阅读破亿（讽刺意义上的）。',
          statChanges: { prRisk: 12, fanLoyalty: -7, commercialValue: -3 },
        },
      },
    ],
  },
];
