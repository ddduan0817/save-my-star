import type { GameEvent } from '@/types/game';

export const absurdEvents: GameEvent[] = [
  // 1. 艺人直播忘关麦，吐槽了你
  {
    id: 'absurd_hot_mic',
    category: 'crisis',
    severity: 'high',
    title: '直播忘关麦了！',
    description: '你正在刷手机，突然助理疯了一样冲进来——"快看直播！！！"你打开一看，画面是空的化妆间，但麦克风还开着。你的艺人正在跟化妆师吐槽："我那经纪人啊，天天让我营业营业，TA自己倒是准时下班..."弹幕已经炸了。',
    emoji: '🎙️',
    minDay: 5,
    choices: [
      {
        id: 'hot_mic_self_roast',
        text: '冲进直播间自嘲',
        subtext: '把尴尬变成综艺效果',
        outcome: {
          narration: '你一脚踹开化妆间的门，对着镜头说："准时下班怎么了？我不配吗？"艺人吓得手机掉地上，但弹幕瞬间变成了哈哈哈哈。你们即兴演了十分钟双人相声，"最惨经纪人"话题直接爆了。',
          statChanges: { fanLoyalty: 5, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'hot_mic_cut',
        text: '紧急切断直播',
        subtext: '止损第一',
        outcome: {
          narration: '你打电话让技术切断了直播信号。画面一黑，弹幕从"哈哈哈"变成了"心虚了吧"。录屏早就传遍了全网——"XX吐槽经纪人全程回放"当晚播放破千万。',
          statChanges: { prRisk: 5, fanLoyalty: -3 },
        },
      },
      {
        id: 'hot_mic_apologize',
        text: '让艺人发道歉视频',
        subtext: '正式回应',
        outcome: {
          narration: '艺人录了一条道歉视频，说"开玩笑的，我经纪人是全世界最好的经纪人"。但评论区画风诡异——"被迫营业.jpg""眨眼如果是求救信号请眨两下"。越描越黑了属于是。',
          statChanges: { prRisk: 3, fanLoyalty: -2, commercialValue: -2 },
        },
      },
    ],
  },

  // 2. AI生成的"恋爱视频"
  {
    id: 'absurd_ai_dating',
    category: 'crisis',
    severity: 'high',
    title: 'AI换脸"恋爱实锤"疯传',
    description: '一条"XX与神秘人深夜牵手"的视频在全网炸开——画面逼真得连你都看了三遍才敢确认是假的。AI换脸技术现在太强了，评论区已经有人在哭了。你的手机每秒震动一次。',
    emoji: '💔',
    minDay: 7,
    choices: [
      {
        id: 'ai_date_tech_debunk',
        text: '找技术大V鉴定打假',
        subtext: '用技术手段证明是AI生成的',
        outcome: {
          narration: '你连夜联系了三个科技博主做技术拆解——帧率分析、光影矛盾、手指关节畸变。24小时内"AI造谣新手段"反而成了科普热点。你的艺人从"恋爱石锤"变成了"AI受害者代言人"。',
          statChanges: { prRisk: -5, fanLoyalty: 3, commercialValue: 3 },
        },
      },
      {
        id: 'ai_date_sue',
        text: '报警+起诉造谣者',
        subtext: '走法律途径',
        outcome: {
          narration: '律师函当天就发了，警方也立案了。但网友等不了司法流程，"先传播再辟谣"的伤害已经造成了。一周后造谣者被抓——是个在读大学生，"为了涨粉"。你不知道该气还是该无语。',
          statChanges: { prRisk: 3, money: -25000 },
          twist: {
            chance: 0.3,
            narration: '但是！大学生被抓的新闻反而引发了同情——"不过是个孩子""追星追到坐牢"的话题出来了。舆论居然开始反转，觉得你们"以大欺小"。互联网没有逻辑。',
            statChanges: { prRisk: 8, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'ai_date_humor',
        text: '艺人亲自下场玩梗',
        subtext: '"我也想知道对象是谁"',
        outcome: {
          narration: '艺人发了一条微博：配图是AI视频截图，文字写"所以这个人是谁啊，怎么没通知我本人😅挺帅/美的能介绍一下吗"。评论区从恐慌变成了狂笑，"XX式辟谣"成了年度最佳公关案例。',
          statChanges: { fanLoyalty: 5, prRisk: -5, commercialValue: 4 },
        },
      },
    ],
  },

  // 3. 粉丝众筹买了一颗星星
  {
    id: 'absurd_star_naming',
    category: 'random',
    severity: 'low',
    title: '粉丝买了一颗星星！',
    description: '你收到一封来自国际天文联合会的邮件——不，这不是诈骗。粉丝们真的众筹花了18万给一颗小行星命名为你的艺人的名字。微博话题 #XX星# 已经3亿阅读了。天文台官网能查到。你反复确认了三遍，是真的。',
    emoji: '⭐',
    minDay: 8,
    statConditions: { minFanLoyalty: 50 },
    choices: [
      {
        id: 'star_planetarium',
        text: '办一场星空主题粉丝活动',
        subtext: '在天文馆包场开见面会',
        outcome: {
          narration: '天文馆包场，大屏幕上实时显示"XX星"的轨道。你的艺人站在星空穹顶下说了句："以后不管我在哪，你们抬头就能看到我。"全场哭成一片。这个瞬间被拍成短视频，播放量破了纪录。',
          statChanges: { fanLoyalty: 8, commercialValue: 5, money: -30000 },
        },
      },
      {
        id: 'star_merch',
        text: '出星空主题周边',
        subtext: '把浪漫变成生意',
        outcome: {
          narration: '星空主题T恤、手机壳、项链...三天卖了200万。粉丝买单了，但也有人酸"什么都能恰"。不过说实话，星星造型的项链确实挺好看的。',
          statChanges: { money: 120000, commercialValue: 3, fanLoyalty: -2 },
        },
      },
      {
        id: 'star_simple_thanks',
        text: '手写一封感谢信',
        subtext: '真诚回应就好',
        outcome: {
          narration: '艺人花了两个小时手写了一封信，拍照发了出来。字不算好看，但第三段有个涂改的痕迹——原来那里写的是"我不值得"，被划掉改成了"我会努力配得上"。粉丝们又哭了。',
          statChanges: { fanLoyalty: 6, prRisk: -3 },
        },
      },
    ],
  },

  // 4. 某顶流公开cue你的艺人
  {
    id: 'absurd_celeb_callout',
    category: 'business',
    severity: 'medium',
    title: '顶流喊话要合作！',
    description: '今天最大的瓜不是别人出事了——而是全网顶流在直播里说了句"最想合作的人是XX"，XX就是你的艺人。话题直接爆了，两家粉丝已经开始组CP了。你的手机响个不停，全是问"什么时候官宣"的。',
    emoji: '🌟',
    minDay: 10,
    statConditions: { minCommercialValue: 40 },
    choices: [
      {
        id: 'celeb_collab_accept',
        text: '积极促成合作',
        subtext: '联系对方经纪人',
        outcome: {
          narration: '你打通了对方经纪人的电话——对方显然也在等。合作企划两天就定了：一首合唱单曲。录音那天两人默契得吓人，制作人在玻璃后面比了个OK。单曲上线一小时破千万播放，你觉得自己见证了历史。',
          statChanges: { commercialValue: 8, fanLoyalty: 5, money: 50000 },
          twist: {
            chance: 0.2,
            narration: '但是！两家粉丝因为"谁是主唱谁是副唱""歌词分配不公平"吵起来了。超话里已经有人烧专辑照片了。你深刻理解了什么叫"顶流联动一时爽，粉丝互撕火葬场"。',
            statChanges: { prRisk: 8, fanLoyalty: -5 },
          },
        },
      },
      {
        id: 'celeb_play_cool',
        text: '假装不知道',
        subtext: '保持矜持',
        outcome: {
          narration: '你按兵不动，让子弹飞了两天。效果出奇——"XX为什么不回应""是太高冷还是有苦衷"的话题反而让热度翻倍了。有时候沉默比任何回应都有力。三天后你才让艺人发了个😏，全网解读了一整天。',
          statChanges: { commercialValue: 5, fanLoyalty: 3 },
        },
      },
      {
        id: 'celeb_decline',
        text: '婉拒，怕被蹭热度',
        subtext: '保持独立性',
        outcome: {
          narration: '你在行业群里放出风声"暂时没有合作计划"，既不得罪人也不接茬。但粉丝有点失望——"为什么放弃这么好的机会啊！经纪人脑子有问题吧！"你默默收下了今天的第107条私信辱骂。',
          statChanges: { fanLoyalty: -3, prRisk: 3 },
        },
      },
    ],
  },

  // 5. 自拍背景里有可疑人影
  {
    id: 'absurd_selfie_shadow',
    category: 'crisis',
    severity: 'medium',
    title: '自拍里的"第三个人"',
    description: '艺人发了张深夜自拍，背景是酒店房间。本来没什么问题——直到有个粉丝放大了画面角落：镜子里似乎映出了另一个人的身影。"恋爱实锤？""有人！绝对有人！"超话已经炸了。你仔细看了看那张照片...好像是个衣架。但谁在乎真相呢。',
    emoji: '👻',
    minDay: 6,
    choices: [
      {
        id: 'shadow_recreate',
        text: '让艺人重新拍一张同角度照片',
        subtext: '用事实说话',
        outcome: {
          narration: '艺人回到同一个酒店房间，用同一个角度拍了一张新照片，圈出那个"人影"——确实是个衣架。配文是"就是个挂衣服的，你们能不能正常一点😂"。粉丝松了口气，路人觉得挺好笑。',
          statChanges: { prRisk: -5, fanLoyalty: 3 },
        },
      },
      {
        id: 'shadow_delete',
        text: '秒删照片',
        subtext: '越快越好',
        outcome: {
          narration: '照片删了，但截图永存。"秒删=心虚"的逻辑在互联网上从不失效。"XX深夜秒删自拍疑似同居"的话题已经在八卦区置顶了。你现在解释什么都像掩饰。',
          statChanges: { prRisk: 8, fanLoyalty: -3 },
        },
      },
      {
        id: 'shadow_mystery',
        text: '不回应，让他们猜',
        subtext: '话题度也是资源',
        outcome: {
          narration: '你选择沉默。粉丝们化身福尔摩斯，开始分析照片里每一个像素。有人说是衣架，有人说是充气模特，还有人说是酒店闹鬼。讨论了整整一周，最后被另一条热搜盖过去了。你什么都没做，热度白嫖了七天。',
          statChanges: { commercialValue: 3, prRisk: 3 },
        },
      },
    ],
  },

  // 6. 颁奖礼上绊倒了
  {
    id: 'absurd_award_trip',
    category: 'drama',
    severity: 'high',
    title: '颁奖礼上摔了！',
    description: '全国直播。红毯。闪光灯。你的艺人穿着设计师特别定制的礼服，微笑着走向舞台——然后，在全国三千万观众面前，一个踉跄，整个人扑倒在台阶上。镜头给了三秒特写。你在后台看到监控画面的那一刻，感觉自己的心脏也跟着摔了一下。',
    emoji: '😱',
    minDay: 8,
    choices: [
      {
        id: 'trip_laugh_it_off',
        text: '教TA自嘲化解',
        subtext: '给耳麦指示，让TA现场自嘲',
        outcome: {
          narration: '艺人爬起来，拍了拍裙子/西装，对着话筒说："看来这个舞台太想留住我了。"全场爆笑+掌声。当晚GIF传遍全网，但画风从"社死现场"变成了"最飒的摔倒"。你在后台长出一口气——但手还在抖。',
          statChanges: { fanLoyalty: 5, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'trip_blame_dress',
        text: '声明是礼服/鞋子的问题',
        subtext: '把锅甩给服装品牌',
        outcome: {
          narration: '团队发了声明说是鞋子设计有问题。品牌方看到后立刻反击："我们的鞋子专业舞者穿都没问题。"现在你不仅没解决摔倒的尴尬，还多了个和品牌方互撕的热搜。两个话题同时挂在榜上，你想原地消失。',
          statChanges: { prRisk: 8, commercialValue: -5 },
        },
      },
      {
        id: 'trip_own_it',
        text: '让艺人发自黑视频',
        subtext: '摔就摔了，大方面对',
        outcome: {
          narration: '艺人当晚发了一条视频：把摔倒的片段配上了体操比赛的BGM和裁判打分画面——9.8、9.5、9.9。"自己给自己加特效"的操作让全网路转粉。有个运动品牌看到后私信你：想签"最会摔的代言人"。你犹豫了一下，回了个报价。',
          statChanges: { fanLoyalty: 4, commercialValue: 4, prRisk: -5, money: 30000 },
        },
      },
    ],
  },

  // 7. 演唱会现场观众求婚
  {
    id: 'absurd_fan_proposal',
    category: 'drama',
    severity: 'medium',
    title: '粉丝在演唱会上求婚了',
    description: '演唱会进行到煽情环节，台下突然有个男粉举起了LED牌子——不是应援牌，是"嫁给我"。全场尖叫。镜头怼了过去。你的艺人站在台上，手里拿着话筒，表情凝固了两秒。大屏幕正在直播TA的脸。你在侧台急得直跺脚。',
    emoji: '💍',
    minDay: 8,
    choices: [
      {
        id: 'proposal_wingman',
        text: '让艺人帮忙当"月老"',
        subtext: '把求婚对象换成那人的女朋友',
        outcome: {
          narration: '你通过耳麦告诉艺人："那人旁边就是他女朋友。"艺人反应过来了——"这位先生，你旁边那位才是你该求婚的对象吧？"镜头一转，果然有个女生又哭又笑。全场变成了大型告白现场，你的演唱会上了热搜但画风完全不一样了。',
          statChanges: { fanLoyalty: 5, commercialValue: 4, prRisk: -3 },
        },
      },
      {
        id: 'proposal_security',
        text: '让安保带走他',
        subtext: '维持秩序',
        outcome: {
          narration: '安保迅速把那人请了出去。但现场有至少两百个手机在拍——"XX演唱会暴力清场粉丝"的视频当晚就传开了。那个男粉还发了条长文，说"我只是想表达喜欢"。你开始怀疑人生。',
          statChanges: { prRisk: 5, fanLoyalty: -4 },
        },
      },
      {
        id: 'proposal_song',
        text: '用歌声化解',
        subtext: '唱一首情歌送给全场',
        outcome: {
          narration: '艺人笑了笑，说"这首歌送给在场每一个勇敢去爱的人"，然后唱了一首经典情歌。全场举起手机灯光，那个场面美得不像话。求婚的粉丝也不尴尬了——他成了"最幸福的观众"。第二天的新闻标题是："XX用一首歌让三万人落泪。"',
          statChanges: { fanLoyalty: 6, commercialValue: 3 },
        },
      },
    ],
  },

  // 8. 被路人认错成另一个明星
  {
    id: 'absurd_wrong_celeb',
    category: 'random',
    severity: 'low',
    title: '被认成了别的明星',
    description: '你的艺人戴着口罩低调逛街，突然被一群中学生认出来了——但她们喊的是另一个顶流的名字。"啊啊啊是YY吗！！""YY我爱你！！"你的艺人摘下口罩，中学生们愣了一秒，然后说了句致命的话："啊...不是...那打扰了。"这一幕被路人拍了下来。',
    emoji: '🫠',
    choices: [
      {
        id: 'wrong_celeb_self_mock',
        text: '让艺人发自嘲微博',
        subtext: '"对不起让你们失望了"',
        outcome: {
          narration: '艺人发了条微博："今日战绩——被认成YY。差距在哪，是脸吗🤡"配上一张两人的对比图。两家粉丝都笑疯了，YY本人也转发了——"别这样，我也经常被认成你😂"。一场尴尬变成了全网最佳互动。',
          statChanges: { fanLoyalty: 4, commercialValue: 4, prRisk: -3 },
        },
      },
      {
        id: 'wrong_celeb_ignore',
        text: '当无事发生',
        subtext: '不提了不提了',
        outcome: {
          narration: '你没让艺人回应。但路人拍的视频已经500万播放了。评论区最高赞："TA连被认错都这么有礼貌，好温柔""打扰了三个字杀伤力也太大了吧哈哈哈"。虽然有点尴尬，但人品分加上了。',
          statChanges: { fanLoyalty: 2, prRisk: 2 },
        },
      },
    ],
  },
];
