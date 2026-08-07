// ============================================================
// 🎭 艺人作妖事件 — 每个艺人定期自发搞事情
// 每2-3天强制触发一个，让艺人有“活人感”
// ============================================================

import type { GameEvent } from '@/types/game';

export const artistTroubleEvents: GameEvent[] = [

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌟 甄帅 (idol) — 自恋、冲动、社交媒体成瘾
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'trouble_idol_green_hair',
    category: 'drama',
    severity: 'medium',
    title: '甄帅把头发染成了荧光绿',
    description: '凌晨3点，甄帅自己溜去理发店染了荧光绿色的头发，还发了张自拍：“新造型，帅不帅？”评论区已经炸了。问题是，下周有个高端珠宝代言拍摄，品牌方打了17个电话过来。',
    emoji: '💚',
    forArtist: 'idol',
    choices: [
      {
        id: 'green_dye_back',
        text: '紧急拉去染回来',
        subtext: '花钱请最好的造型师连夜抢救',
        outcome: {
          narration: '造型师通宵加班把头发救了回来，但甄帅全程在撅嘴。“你们不懂时尚。”品牌方看到成品后终于放心了。你的钱包在哭泣。',
          statChanges: { money: -20000, prRisk: -2 },
        },
      },
      {
        id: 'green_embrace',
        text: '将错就错，搞“绿色环保”营销',
        subtext: '“我为地球变绿！”',
        outcome: {
          narration: '“甄帅为了环保事业改变形象”，你编的通稿堪称年度最佳。环保组织真的找来了！虽然珠宝品牌解约了，但甄帅成了环保大使，反差萌拉满。',
          statChanges: { fanLoyalty: 3, commercialValue: -2, prRisk: 2 },
          twist: {
            chance: 0.3,
            narration: '甄帅在环保活动上被拍到偷偷喝瓶装水、用一次性筷子。“环保大使用一次性餐具”上了热搜，你的脸又绿了。',
            statChanges: { prRisk: 4, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'green_merch',
        text: '出一波“荧光帅”限定周边',
        subtext: '绿色应援棒、绿色手环、绿色假发',
        outcome: {
          narration: '粉丝们疯了一样抢购荧光绿周边，演唱会上全场绿光，画面虽然诡异但确实壮观。“帅帅引领潮流”的说法居然立住了。',
          statChanges: { money: 30000, fanLoyalty: 2, commercialValue: 2 },
        },
      },
    ],
  },

  {
    id: 'trouble_idol_ex_like',
    category: 'drama',
    severity: 'high',
    title: '甄帅手滑点赞了前女友的照片',
    description: '甄帅在凌晨2点点赞了前女友三年前的沙滩照。虽然0.3秒后就取消了，但截图已经传遍全网。#帅帅深夜点赞前任# 以光速冲上热搜，前女友那边也发了个意味深长的“😏”。唯粉在超话里已经开始烧纸了。',
    emoji: '💔',
    forArtist: 'idol',
    choices: [
      {
        id: 'ex_hacked',
        text: '发声明说号被盗了',
        subtext: '“已经报警处理”',
        outcome: {
          narration: '“号被盗”这三个字堪称娱乐圈最大的笑话。网友翻出了甄帅同一时间发的其他动态，“号被盗了但贼只点了个赞？”你的公信力碎了一地。',
          statChanges: { prRisk: 3, fanLoyalty: -2 },
        },
      },
      {
        id: 'ex_honest',
        text: '“就是手滑了嘛”',
        subtext: '大方承认，轻描淡写',
        outcome: {
          narration: '甄帅发微博：“手滑了，就像你们半夜刷到前任朋友圈一样嘛。”这条微博转发80万，“说的太真实了”是热评第一。路人好感蹭蹭往上涨。',
          statChanges: { fanLoyalty: 3, prRisk: 1 },
        },
      },
      {
        id: 'ex_pay_off',
        text: '紧急联系前女友配合',
        subtext: '花钱消灾 + 统一口径',
        outcome: {
          narration: '前女友配合删除了那个“😏”并发了声明“老朋友而已”。但这份默契让CP粉嗅到了复合的味道，新的战争开始了。',
          statChanges: { money: -30000, prRisk: -2 },
          twist: {
            chance: 0.25,
            narration: '前女友的闺蜜在聊天记录里曝光了“他给了30万让我配合”。“花钱买人设”成了新的热搜词条。',
            statChanges: { prRisk: 4, fanLoyalty: -3, money: -10000 },
          },
        },
      },
    ],
  },

  {
    id: 'trouble_idol_toilet',
    category: 'drama',
    severity: 'medium',
    title: '甄帅在机场冲进了女厕所',
    description: '在机场被200多个粉丝围追堵截，甄帅慌不择路冲进了女厕所。里面一位大妈的尖叫声整个航站楼都听到了。更惨的是，有人举着手机拍到了全过程，甄帅一脸惊恐冲进去，三秒后一脸更惊恐地跑出来。',
    emoji: '🚽',
    forArtist: 'idol',
    choices: [
      {
        id: 'toilet_apologize',
        text: '立刻鞠躬道歉',
        subtext: '给大妈买了一车水果',
        outcome: {
          narration: '甄帅给大妈鞠了三个90度的躬，大妈从愤怒变成了“哎呀这孩子长得真帅”。大妈的孙女现在是甄帅的新粉丝。反差萌名场面，热搜挂了两天。',
          statChanges: { prRisk: 2, fanLoyalty: 3 },
        },
      },
      {
        id: 'toilet_hide',
        text: '在里面躲了20分钟',
        subtext: '等保安来救援',
        outcome: {
          narration: '“堂堂顶流躲女厕所20分钟”成了今年最搞笑的娱乐新闻。保安把他接出来时，外面已经围了500人拍照。甄帅的表情被做成了新表情包。',
          statChanges: { prRisk: 4 },
          twist: {
            chance: 0.3,
            narration: '女厕所里的另一位女士把甄帅躲在角落瑟瑟发抖的照片卖给了狗仔。“帅帅如此狼狈”的图片传遍全网，心疼的粉丝反而更多了。',
            statChanges: { fanLoyalty: 3, prRisk: -2 },
          },
        },
      },
      {
        id: 'toilet_window',
        text: '翻窗逃跑',
        subtext: '从厕所窗户爬出去',
        outcome: {
          narration: '甄帅从女厕所窗户翻了出去，被拍到穿着定制西装挂在窗户上的样子。这个姿势的截图瞬间成为全网最火的表情包，“当代艺人的逃跑艺术”。',
          statChanges: { prRisk: 3, commercialValue: -2 },
        },
      },
    ],
  },

  {
    id: 'trouble_idol_beauty_filter',
    category: 'random',
    severity: 'low',
    title: '直播美颜开到最大变成外星人',
    description: '甄帅开直播时不小心把美颜调到了MAX。下巴尖到能戳死人，眼睛大到像外星人，鼻子小到快消失了。他本人完全没发现，聊了15分钟才被弹幕疯狂刷“关掉美颜！！！”提醒。“外星帅帅”表情包已经做了800个。',
    emoji: '👽',
    forArtist: 'idol',
    choices: [
      {
        id: 'filter_self_mock',
        text: '自嘲：“我确实帅到不像地球人”',
        subtext: '用幽默化解尴尬',
        outcome: {
          narration: '甄帅发了条微博配外星人表情包：“官方认证，颜值已经超越人类范畴。”路人笑疯了，“能自嘲的偶像最可爱”成了热评第一。',
          statChanges: { fanLoyalty: 3, prRisk: -1 },
        },
      },
      {
        id: 'filter_ignore',
        text: '假装什么都没发生',
        subtext: '不回应就没事',
        outcome: {
          narration: '甄帅选择无视，但网友不会放过他。“外星帅帅”成了他的新外号，每次出现在镜头前弹幕都会刷“今天关美颜了吗”。三个月了还在说。',
          statChanges: { prRisk: 2 },
        },
      },
      {
        id: 'filter_merch',
        text: '出“外星帅帅”联名周边',
        subtext: '手办、贴纸、手机壳全安排',
        outcome: {
          narration: '“外星帅帅”联名手办三分钟售罄！手机壳成了全网爆款，连不知道甄帅是谁的人都在用。“把黑点变成卖点”，你的经纪人教科书又多了一页。',
          statChanges: { money: 30000, fanLoyalty: 2, commercialValue: 2 },
        },
      },
    ],
  },

  {
    id: 'trouble_idol_convenience',
    category: 'random',
    severity: 'low',
    title: '穿着Gucci蹲在便利店门口吃关东煮',
    description: '被拍到了。穿着三万块的Gucci外套，蹲在7-11门口吃关东煮。照片构图堪称行为艺术，奢侈品×平民美食×蹲姿，评论区两极分化：“接地气！” vs “偶像包袱呢？”Gucci品牌方的态度微妙。',
    emoji: '🍢',
    forArtist: 'idol',
    choices: [
      {
        id: 'oden_endorse',
        text: '趁机接个便利店代言',
        subtext: '反差感就是卖点！',
        outcome: {
          narration: '7-11看到热度直接找来了！广告语是“顶流都爱的关东煮”。甄帅穿着西装蹲着吃关东煮的广告图传遍全网，销量暴增300%。你也蹲着数钱。',
          statChanges: { commercialValue: 2, money: 40000, fanLoyalty: 1 },
        },
      },
      {
        id: 'oden_foodie',
        text: '发微博安利关东煮',
        subtext: '“关东煮真的很好吃啊！”',
        outcome: {
          narration: '甄帅写了一篇800字的关东煮测评，从汤底到丸子都点评了一遍。“万万没想到偶像是个吃货”成了热门话题。便利店门口多了一群蹲着吃的粉丝。',
          statChanges: { fanLoyalty: 3 },
        },
      },
      {
        id: 'oden_stylist',
        text: '请造型师以后全程跟着',
        subtext: '不能再拍到这种照片了',
        outcome: {
          narration: '从此甄帅出门必带造型师。但造型师在微博抱怨“工作内容包括阻止艺人蹲地上”，这条吐槽反而火了。你已经放弃控制叙事了。',
          statChanges: { money: -10000, prRisk: -1 },
        },
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎬 郝美丽 (actor) — 文艺、倔强、不接地气、戏瘾大
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'trouble_actor_reject_ad',
    category: 'business',
    severity: 'medium',
    title: '郝美丽拒绝了八位数代言',
    description: '某国际美妆品牌开出了八位数的天价代言费。郝美丽看了一眼广告脚本，冷冷地说：“用了XX你就是最美的女人，这种台词侮辱观众智商。”然后把合同扔回了桌上。品牌方气到发微博内涵：“某些人不知道自己几斤几两。”',
    emoji: '🙅',
    forArtist: 'actor',
    choices: [
      {
        id: 'reject_ad_beg',
        text: '求她把合同接回来',
        subtext: '八位数啊！八位数！',
        outcome: {
          narration: '你跪了两小时，郝美丽终于松口了。但拍摄时她的表情像在参加葬礼。广告成品出来后，网友说：“这是我见过的最冷漠的美妆广告。”品牌方欲哭无泪。',
          statChanges: { commercialValue: 3, fanLoyalty: -3, money: 60000 },
        },
      },
      {
        id: 'reject_ad_support',
        text: '支持她的艺术追求',
        subtext: '“你开心最重要”',
        outcome: {
          narration: '“郝美丽拒绝天价代言”上了热搜，路人评价两极分化。文青们封她为“最后的文艺女神”，但商务团队集体辞职了。你的银行卡在流泪。',
          statChanges: { fanLoyalty: 3, commercialValue: -3 },
        },
      },
      {
        id: 'reject_ad_rewrite',
        text: '让她自己重写广告文案',
        subtext: '“觉得烂你来写个好的”',
        outcome: {
          narration: '郝美丽写了一版“用镜头记录真实的美”的文艺范文案。品牌方看了半天：\“这...也能卖货？\”结果广告播出后，文艺女青年们疯狂下单，销量逆袭。',
          statChanges: { commercialValue: 2, fanLoyalty: 2, money: 40000 },
        },
      },
    ],
  },

  {
    id: 'trouble_actor_method',
    category: 'drama',
    severity: 'high',
    title: '郝美丽杀青后沉浸角色出不来了',
    description: '新剧杀青了，但郝美丽还活在角色里，一个民国女间谍。她已经三天用民国腔说话，管助理叫“同志”，管你叫“上峰”，吃饭用筷子夹面包。助理吓得打电话来：“经纪人，她...她跟我说密电码！”',
    emoji: '🕵️‍♀️',
    forArtist: 'actor',
    choices: [
      {
        id: 'method_doctor',
        text: '请心理医生帮她“退出角色”',
        subtext: '专业的事交给专业的人',
        outcome: {
          narration: '心理医生花了两个疗程终于把郝美丽拉回了现实。医生走的时候说：“这是我见过最敬业的演员，也是最吓人的病例。”',
          statChanges: { money: -15000 },
        },
      },
      {
        id: 'method_documentary',
        text: '把这个过程拍成纪录片',
        subtext: '“这是艺术啊！”',
        outcome: {
          narration: '你请了一个纪录片团队跟拍“郝美丽的方法派演技”。成片在电影节拿了最佳短纪录片，影评人说这是“对演员艺术的极致致敬”。郝美丽本人看完说：“我演得更好。”',
          statChanges: { fanLoyalty: 4, commercialValue: 2, prRisk: 2 },
          twist: {
            chance: 0.25,
            narration: '纪录片里她“接头”外卖小哥的画面被截出来了，#影后在线发疯# 上了热搜。但评论区全是哈哈哈，反而成了名场面。',
            statChanges: { fanLoyalty: 2, prRisk: 1 },
          },
        },
      },
      {
        id: 'method_wait',
        text: '等她自己出来',
        subtext: '上次也是一周才好',
        outcome: {
          narration: '你选择等待。第五天，郝美丽突然清醒了，看着自己穿的旗袍一脸茫然：“我为什么穿成这样？”助理终于哭了出来。',
          statChanges: { fanLoyalty: -2 },
        },
      },
    ],
  },

  {
    id: 'trouble_actor_critique',
    category: 'drama',
    severity: 'high',
    title: '郝美丽公开批评爆款剧“演技灾难”',
    description: '采访中被问到对某爆款甜宠剧的看法，郝美丽脱口而出：“演技灾难，剧本侮辱观众。除了脸没有任何可看性。”问题是，那部剧的女主粉丝有三千万，战斗力堪比军团。#郝美丽内涵XX# 已经挂在热搜第三。',
    emoji: '🗣️',
    forArtist: 'actor',
    choices: [
      {
        id: 'critique_context',
        text: '发声明说被断章取义',
        subtext: '“原意是对行业的思考”',
        outcome: {
          narration: '“断章取义”这四个字在娱乐圈跟“号被盗”一样没有可信度。但好歹降了降温，从热搜第三掉到了第八。三千万粉丝暂时停火，但火种还在。',
          statChanges: { prRisk: 2, fanLoyalty: -1 },
        },
      },
      {
        id: 'critique_double_down',
        text: '加倍下注：开直播详细分析',
        subtext: '“我不仅说了，我还能论证”',
        outcome: {
          narration: '郝美丽开了一场两小时的直播，逐帧分析那部剧的演技问题。弹幕从“你好毒”变成了“她说得对但没必要”最后变成了“学到了”。中戏教授转发了直播回放。',
          statChanges: { fanLoyalty: 4, prRisk: 4, commercialValue: -2 },
          twist: {
            chance: 0.3,
            narration: '被点名的女主直接连线了！两人在直播里从对峙变成了互相肯定。“文艺片女王vs甜宠剧女王世纪和解”上了热搜，两家粉丝都懵了。',
            statChanges: { prRisk: -4, fanLoyalty: 3, commercialValue: 2 },
          },
        },
      },
      {
        id: 'critique_apologize',
        text: '私下给对方道歉',
        subtext: '没必要树敌',
        outcome: {
          narration: '你安排了一次私下茶叙。对方表面和好但心里记了一笔。三个月后的颁奖典礼上，两人“不小心撞衫”的事情登上了热搜。有些仇，是和不了的。',
          statChanges: { prRisk: -2, fanLoyalty: -2 },
        },
      },
    ],
  },

  {
    id: 'trouble_actor_park',
    category: 'random',
    severity: 'low',
    title: '凌晨在公园背台词被路人报警了',
    description: '凌晨2点，郝美丽在公园长椅上声情并茂地背着一段凶杀案独白。路人大爷吓得报了警：“公园里有个女的在说杀人的事！”警察到场后认出了她，但执法记录仪的画面被传上了网，“影后公园发疯现场”。',
    emoji: '🌙',
    forArtist: 'actor',
    choices: [
      {
        id: 'park_laugh',
        text: '配合自嘲一波',
        subtext: '发微博+道歉大爷',
        outcome: {
          narration: '郝美丽发了微博：“对不起吓到大爷了，下次背台词选白天。P.S. 那段独白还没背熟，大家帮我对台词。”大爷成了新晋网红，接了个安眠药广告。',
          statChanges: { fanLoyalty: 3, prRisk: -1 },
        },
      },
      {
        id: 'park_promo',
        text: '说这是新电影的沉浸式宣传',
        subtext: '什么都能变成营销',
        outcome: {
          narration: '“这其实是电影《暗夜独白》的沉浸式宣传”，你现编的电影名字居然被制片人看到了，真的来谈合作了。人生的剧本果然比电影更离谱。',
          statChanges: { commercialValue: 2, prRisk: 1 },
        },
      },
      {
        id: 'park_sue',
        text: '追究传播视频的人',
        subtext: '执法记录仪不能随便传播！',
        outcome: {
          narration: '律师函发出去后，传播视频的人道歉删除了。但“影后连报警视频都要维权”的说法让路人觉得你小题大做。有时候，笑一笑就过去了。',
          statChanges: { prRisk: 3, money: -15000 },
        },
      },
    ],
  },

  {
    id: 'trouble_actor_english',
    category: 'drama',
    severity: 'medium',
    title: '郝美丽在国际影展飙英文翻车了',
    description: '某国际电影节发布会，郝美丽突然决定用英文回答外国记者的提问。“I am very happy to here today, this movie is very...very...额...good!”全场三秒沉默。翻译老师面无表情地重新翻译了一遍。现场视频在B站播放量已经破千万了。',
    emoji: '🇬🇧',
    forArtist: 'actor',
    choices: [
      {
        id: 'english_laugh_it_off',
        text: '自嘲“我英语确实很烂”',
        subtext: '诚实是最好的公关',
        outcome: {
          narration: '郝美丽在社交媒体发了一段自己背“very good”的搞笑视频。外国网友疯狂转发，“Chinese actress being honest”成了国际meme。反倒圈了一波海外粉。',
          statChanges: { fanLoyalty: 3, prRisk: -1 },
        },
      },
      {
        id: 'english_pretend',
        text: '当作没发生过',
        subtext: '不提就没人记得...吗？',
        outcome: {
          narration: '你选择冷处理，但B站鬼畜区已经把这段做成了各种混剪。“very very good”成了郝美丽的标志性台词。每次她出现在公众场合，弹幕都会刷这句话。',
          statChanges: { prRisk: 2 },
        },
      },
      {
        id: 'english_learn',
        text: '立刻请英语私教魔鬼训练',
        subtext: '下次绝不再出丑',
        outcome: {
          narration: '你请了个外教天天跟着她。三个月后的下一个电影节，郝美丽用流利的英文发言，全场起立鼓掌。“打脸最快的影后”成了励志故事。',
          statChanges: { money: -20000, fanLoyalty: 2, commercialValue: 2 },
        },
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎤 高八度 (singer) — 任性、暴脾气、真性情、行为艺术
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'trouble_singer_diss',
    category: 'drama',
    severity: 'high',
    title: '高八度凌晨4点发了首diss全行业的歌',
    description: '高八度喝了点酒，凌晨4点在网易云发了首叫《假唱俱乐部》的歌，歌词精准内涵了半个音乐圈。“这个用修音，那个不会写词，还有一个连do re mi都分不清。”6点清醒后秒删了，但录屏已经传遍全网。至少有6个歌手认为是在骂自己。',
    emoji: '🎤',
    forArtist: 'singer',
    choices: [
      {
        id: 'diss_apologize',
        text: '帮他挨个道歉',
        subtext: '你打电话打到手软',
        outcome: {
          narration: '你花了整整一天给6个被内涵的歌手道歉。其中3个接受了，2个说“我知道他就这样”，1个把你拉黑了。高八度本人全程在打游戏。',
          statChanges: { prRisk: -2, fanLoyalty: -2 },
        },
      },
      {
        id: 'diss_art',
        text: '“这首歌其实是行为艺术”',
        subtext: '音乐就是要有态度！',
        outcome: {
          narration: '“行为艺术”这个说法引发了巨大争议。乐评人分成两派：一派说这是“对音乐圈虚伪的辛辣讽刺”，另一派说这就是“喝多了发疯”。两派在微博吵了三天。',
          statChanges: { fanLoyalty: 2, prRisk: 3 },
        },
      },
      {
        id: 'diss_release',
        text: '将错就错，正式发布这首歌',
        subtext: '“摇滚精神就是真实”',
        outcome: {
          narration: '你帮他在各大平台正式上架了这首歌。播放量24小时破亿，一半人在听歌，一半人在猜每句词骂的是谁。音乐排行榜第一，社交媒体战场也第一。',
          statChanges: { fanLoyalty: 3, prRisk: 4, commercialValue: 2, money: 30000 },
          twist: {
            chance: 0.3,
            narration: '被diss的某流量歌手发了首回击曲，歌名叫《八度不够高》。两人的beef成了年度最火音乐事件，双方粉丝天天在评论区battle。',
            statChanges: { prRisk: 2, fanLoyalty: 2, commercialValue: 2 },
          },
        },
      },
    ],
  },

  {
    id: 'trouble_singer_stagedive',
    category: 'drama',
    severity: 'high',
    title: '高八度从舞台跳下去了，没人接住',
    description: '演唱会嗨到高潮，高八度大喊“我要飞到你们中间去！”然后真的从两米高的舞台跳了下去。问题是，前排粉丝吓得全部让开了。他直接摔在了地板上。全场尖叫。好在没骨折，但视频已经全网疯传。',
    emoji: '🤸',
    forArtist: 'singer',
    choices: [
      {
        id: 'dive_hospital',
        text: '紧急送医院检查',
        subtext: '先确认没有受伤',
        outcome: {
          narration: '送医后确认只是擦伤和轻微扭伤。你从医院发了一条平安声明，配了张高八度竖大拇指的照片。“粉丝在线心梗”上了热搜。',
          statChanges: { money: -15000, prRisk: 2 },
        },
      },
      {
        id: 'dive_get_up',
        text: '爬起来继续唱！',
        subtext: '这才是摇滚精神',
        outcome: {
          narration: '高八度从地上爬起来，拍了拍裤子，说了句“地板挺硬的”然后继续唱下一首。全场沸腾了。“最硬核的歌手”这个称号，他当之无愧。这个视频在YouTube播放量破了5000万。',
          statChanges: { fanLoyalty: 4, prRisk: 1 },
        },
      },
      {
        id: 'dive_art',
        text: '“这是行为艺术的一部分”',
        subtext: '高八度万物皆可行为艺术',
        outcome: {
          narration: '高八度本人发微博：“《落地》，这是我对地心引力的致敬。”所有人都知道他在扯淡，但这个态度太好笑了。“地心引力的致敬”成了年度金句。',
          statChanges: { prRisk: 2, fanLoyalty: 3 },
        },
      },
    ],
  },

  {
    id: 'trouble_singer_fight_blogger',
    category: 'drama',
    severity: 'medium',
    title: '高八度和乐评人在微博吵了72条',
    description: '一个10万粉的乐评博主给了高八度新专辑2分（满分10分），评价是“中学生作曲水平”。高八度怒了，直接在评论区开骂，从“你懂个屁的音乐”吵到“你小学毕业了吗”，一共72条。整个微博都在围观，连平台官方都下场了：“理性讨论，友善交流哦~”',
    emoji: '⌨️',
    forArtist: 'singer',
    choices: [
      {
        id: 'fight_confiscate',
        text: '没收他的手机',
        subtext: '物理断网，最后手段',
        outcome: {
          narration: '你冲到他家把手机没收了。高八度用iPad继续骂了5条才被你发现。最终还是断了网才消停。第二天他说：“我冷静了，但我不后悔。”',
          statChanges: { prRisk: -2, fanLoyalty: -1 },
        },
      },
      {
        id: 'fight_livestream',
        text: '让他们连麦PK',
        subtext: '把战场从文字搬到直播间',
        outcome: {
          narration: '你安排了一场直播连麦。高八度现场弹唱了三首歌证明实力，博主一首都挑不出毛病。最后博主改了评分：6分。“从2到6的连麦”成了经典名场面。',
          statChanges: { fanLoyalty: 3, prRisk: 2 },
        },
      },
      {
        id: 'fight_invite',
        text: '请博主来演唱会前排',
        subtext: '让他亲眼看看什么叫实力',
        outcome: {
          narration: '博主在现场嗨到站起来跳。演唱会后他删掉了原来的乐评，重新写了一篇8分好评。两人的恩怨被拍成了纪录短片，#化敌为友# 感动了不少人。',
          statChanges: { money: -5000, fanLoyalty: 2, prRisk: -3 },
        },
      },
    ],
  },

  {
    id: 'trouble_singer_subway',
    category: 'random',
    severity: 'low',
    title: '高八度在地铁里突然开始唱歌',
    description: '高八度嫌保姆车太无聊，偷偷坐了趟地铁。结果坐着坐着就开始哼歌，哼着哼着就开始飙高音。整节车厢的人从看手机变成了看他。有人录下了全过程，从乘客的惊恐到鼓掌，堪称微电影。地铁公司发了声明：“请勿在车厢内大声喧哗。”',
    emoji: '🚇',
    forArtist: 'singer',
    choices: [
      {
        id: 'subway_apologize',
        text: '向地铁公司道歉',
        subtext: '毕竟确实违规了',
        outcome: {
          narration: '高八度录了一段向地铁公司道歉的视频，结尾说“下次我戴耳机唱”。地铁公司回复：“欢迎戴耳机。”这段互动被网友称为“最礼貌的对话”。',
          statChanges: { prRisk: -1, fanLoyalty: 1 },
        },
      },
      {
        id: 'subway_concert',
        text: '搞一个“地铁巡演”企划',
        subtext: '在各条线路唱歌！',
        outcome: {
          narration: '你和地铁公司谈了一个合作，“音乐车厢”企划，指定时段高八度在特别车厢里演唱。票价0元，现场人满为患，地铁客流量暴增200%。',
          statChanges: { fanLoyalty: 4, commercialValue: 2, prRisk: 2 },
          twist: {
            chance: 0.2,
            narration: '合作企划太火了，每天都有人来地铁站蹲守，严重影响了正常通勤。市民投诉电话打爆了，企划被叫停。“好事做过头”的教训。',
            statChanges: { prRisk: 3, fanLoyalty: -2 },
          },
        },
      },
      {
        id: 'subway_thanks',
        text: '“感谢六号线的听众们”',
        subtext: '发条微博就完事了',
        outcome: {
          narration: '“感谢六号线全体乘客的包容，你们是我最棒的听众。”这条微博转发量比他上张专辑的宣传都高。有人说：“我决定开始坐六号线上班了。”',
          statChanges: { fanLoyalty: 3, prRisk: 1 },
        },
      },
    ],
  },

  {
    id: 'trouble_singer_guitar',
    category: 'drama',
    severity: 'high',
    title: '高八度在商演上砸了价值10万的吉他',
    description: '某商场开业请了高八度表演。他试了音觉得效果烂透了，脾气上来直接把一把价值10万的定制吉他砸了个稀碎。现场视频传开后，一半人说“真摇滚精神”，一半人说“这人有病吧”。吉他品牌方的律师函已经到了。',
    emoji: '🎸',
    forArtist: 'singer',
    choices: [
      {
        id: 'guitar_pay',
        text: '赔钱道歉',
        subtext: '老实认错',
        outcome: {
          narration: '你替高八度赔了吉他钱并公开道歉。高八度本人的道歉视频态度一般：“对不起，但那个音响确实很垃圾。”这个半心半意的道歉居然被路人觉得挺真实。',
          statChanges: { money: -30000, prRisk: -2 },
        },
      },
      {
        id: 'guitar_rock',
        text: '“摇滚就是这样的！”',
        subtext: '砸吉他是摇滚传统！',
        outcome: {
          narration: '你搬出了The Who和Nirvana的砸吉他传统。乐迷们买账了：“终于有人把摇滚精神带回中国了！”但主办方表示以后不会再请他了。而且吉他还是得赔。',
          statChanges: { fanLoyalty: 3, prRisk: 3, commercialValue: -2, money: -30000 },
        },
      },
      {
        id: 'guitar_collab',
        text: '和吉他品牌谈“砸不坏”联名',
        subtext: '化危机为商机',
        outcome: {
          narration: '“高八度砸不坏”系列吉他，这个联名企划一提出来，品牌方的律师函秒变合同。发布会上高八度现场暴力测试，吉他真的砸不坏。广告语：“连高八度都砸不坏的吉他。”',
          statChanges: { money: 30000, commercialValue: 3, fanLoyalty: 2 },
        },
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📱 冷冰凝 (influencer) — 接地气、心直口快、翻车体质、反差
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'trouble_influencer_brand_name',
    category: 'drama',
    severity: 'medium',
    title: '冷冰凝直播把“雅诗兰黛”说成了“雅诗兰蛋”',
    description: '直播带货，冷冰凝拿起产品自信满满：“这款雅诗兰蛋真的超好用！”直播间瞬间刷屏了。品牌方的市场总监在屏幕前差点昏过去。“雅诗兰蛋”以不可阻挡的速度成了热搜第一。',
    emoji: '🥚',
    forArtist: 'influencer',
    choices: [
      {
        id: 'egg_apologize',
        text: '立刻道歉纠正',
        subtext: '“对不起对不起，是兰黛！”',
        outcome: {
          narration: '冷冰凝反应过来后疯狂道歉，但越紧张越说错，连续说了三遍“兰蛋”。直播间已经笑到瘫了。品牌方最终选择了原谅，毕竟销量这晚上涨了400%。',
          statChanges: { prRisk: 1, commercialValue: -1 },
        },
      },
      {
        id: 'egg_embrace',
        text: '“以后它就叫兰蛋了！”',
        subtext: '霸气侧漏',
        outcome: {
          narration: '冷冰凝干脆霸气宣布：“在我直播间它就叫兰蛋！”粉丝们开始管所有化妆品叫“XX蛋”。品牌方市场总监看了一下销售数据后，决定不追究了，当晚成交额破纪录。',
          statChanges: { fanLoyalty: 4, commercialValue: -2, prRisk: 2 },
        },
      },
      {
        id: 'egg_private_apology',
        text: '下播后给品牌方赔礼',
        subtext: '送礼+保证不再犯',
        outcome: {
          narration: '你带着冷冰凝去品牌方总部负荆请罪。市场总监说：“你知道吗，现在淘宝搜兰蛋都能搜到我们的产品。”最终不仅没追责，还续了合同。',
          statChanges: { money: -15000, commercialValue: 1 },
        },
      },
    ],
  },

  {
    id: 'trouble_influencer_hater_friend',
    category: 'random',
    severity: 'low',
    title: '冷冰凝和黑粉对线800条，最后成了朋友',
    description: '一个黑粉在评论区连续骂了800条。冷冰凝没有拉黑，而是一条条回复。从互喷到发现对方也是湖南人，最后约着一起吃了顿小龙虾。两人的聊天记录和吃龙虾的合照被曝光后，“最强破冰”上了热搜。',
    emoji: '🦞',
    forArtist: 'influencer',
    choices: [
      {
        id: 'hater_vlog',
        text: '趁热度拍个vlog',
        subtext: '“黑粉变闺蜜”vlog',
        outcome: {
          narration: '“和黑粉吃小龙虾”的vlog播放量破千万。黑粉本人也涨了50万粉丝。两人现在经常在评论区互怼，粉丝说这才是“相爱相杀”。',
          statChanges: { fanLoyalty: 3, commercialValue: 2 },
        },
      },
      {
        id: 'hater_lowkey',
        text: '低调处理',
        subtext: '热度会过去的',
        outcome: {
          narration: '你选择不炒作这件事。但那个前黑粉自己成了冷冰凝最铁的粉丝，天天在超话里安利，比水军还努力。缘分这东西，真说不准。',
          statChanges: { prRisk: -2 },
        },
      },
      {
        id: 'hater_inspector',
        text: '请黑粉当“民间质检员”',
        subtext: '让她帮忙测评产品',
        outcome: {
          narration: '前黑粉成了冷冰凝的“首席找茬官”，每次直播都在弹幕里提专业意见。粉丝们说：“连黑粉都被收编了，冰冰格局太大了。”',
          statChanges: { fanLoyalty: 2, commercialValue: 2, prRisk: -1 },
        },
      },
    ],
  },

  {
    id: 'trouble_influencer_takeout',
    category: 'drama',
    severity: 'medium',
    title: '冷冰凝在高端晚宴当众叫了外卖',
    description: '某奢侈品牌的年度晚宴，冷冰凝坐在一桌顶流中间。吃了两口法餐后，她掏出手机当着所有人的面打开了外卖APP。10分钟后，外卖小哥穿过一群穿晚礼服的嘉宾，把一份麻辣烫送到了她手上。全场。静。默。',
    emoji: '🍜',
    forArtist: 'influencer',
    choices: [
      {
        id: 'takeout_art',
        text: '“这就是我的风格”',
        subtext: '我就是不装！',
        outcome: {
          narration: '冷冰凝淡定地吃着麻辣烫，旁边的顶流们面面相觑。这段视频火遍全网，“高端的食材往往只需要最朴素的烹饪方式”成了经典弹幕。“真实”是她最好的人设。',
          statChanges: { prRisk: 3, fanLoyalty: 4 },
          twist: {
            chance: 0.3,
            narration: '品牌方在社交媒体发了一条：“感谢所有嘉宾享用晚宴。”配了一张所有人优雅用餐的照片，唯独没有冷冰凝。被“开除”了。',
            statChanges: { commercialValue: -3, prRisk: 2 },
          },
        },
      },
      {
        id: 'takeout_apologize',
        text: '赶紧道歉',
        subtext: '太不给面子了...',
        outcome: {
          narration: '你逼着冷冰凝删了外卖给品牌方道歉。但她道歉时说了句：“菜确实不合我胃口嘛。”品牌方公关总监的脸抽搐了一下。有些人天生不适合说客套话。',
          statChanges: { commercialValue: -2, prRisk: -1 },
        },
      },
      {
        id: 'takeout_treat',
        text: '给全桌都点一份外卖',
        subtext: '一个人吃多尴尬，一起吃就是派对',
        outcome: {
          narration: '你加急又点了一桌麻辣烫。冷冰凝举着杯子说：“来来来，法餐配麻辣烫，中西合璧！”旁边的影帝居然第一个伸筷子了。最后全桌都在吃外卖，品牌方拍下了这个画面，意外地温馨。',
          statChanges: { money: -10000, fanLoyalty: 4, commercialValue: -1 },
        },
      },
    ],
  },

  {
    id: 'trouble_influencer_filter',
    category: 'drama',
    severity: 'high',
    title: '直播时猫关掉了美颜，真实皮肤曝光',
    description: '直播直播着，冷冰凝的猫跳上了电脑，一爪子关掉了所有滤镜和美颜。她的真实皮肤状态暴露了3.7秒才被助理切了回来。但就这3.7秒的截图已经传遍全网。“冰冰素颜”成了当日热搜第一，讨论量炸了。',
    emoji: '🐱',
    forArtist: 'influencer',
    choices: [
      {
        id: 'filter_brave',
        text: '发素颜自拍正面应对',
        subtext: '“对，这就是我的真脸”',
        outcome: {
          narration: '冷冰凝发了一组无滤镜自拍，配文：“猫说要给你们看看真正的我。”评论区从嘲讽变成了“勇气可嘉”再变成了“素颜也好看啊”。反转来得太快。猫被封为“最佳助理”。',
          statChanges: { fanLoyalty: 4, commercialValue: -2, prRisk: -2 },
        },
      },
      {
        id: 'filter_deny',
        text: '“是光线问题！”',
        subtext: '死不承认',
        outcome: {
          narration: '“光线问题”这个说法和“号被盗”并列成了2024年最佳笑话。网友把3.7秒的画面逐帧分析，做了20个对比图。越解释越惨。',
          statChanges: { prRisk: 4, fanLoyalty: -3 },
        },
      },
      {
        id: 'filter_skincare',
        text: '推出“素颜也能用”护肤系列',
        subtext: '危机就是商机',
        outcome: {
          narration: '你连夜联系了护肤品牌谈联名，“冰冰的素颜修护系列”。广告语是“不需要滤镜的底气”。预售当天售罄，连黑粉都下单了：“我倒要看看能不能救。”',
          statChanges: { commercialValue: 3, money: 30000, fanLoyalty: 1 },
        },
      },
    ],
  },

  {
    id: 'trouble_influencer_tears',
    category: 'business',
    severity: 'medium',
    title: '冷冰凝的自创品牌“冰冰的眼泪”被扒了',
    description: '冷冰凝偷偷注册了个化妆品品牌叫“冰冰的眼泪”，主打产品是一款“哭泣时也不花妆”的睫毛膏。产品还没上市，包装盒就被人扒出来了。上面写着“让你哭得更美丽”。网友：这是什么鬼？评论区全是黑人问号。',
    emoji: '💧',
    forArtist: 'influencer',
    choices: [
      {
        id: 'tears_launch',
        text: '正式官宣发布',
        subtext: '自信推广，靠产品说话',
        outcome: {
          narration: '冷冰凝拍了一支广告：一边看悲伤电影一边哭，妆完全不花。“哭戏女王的秘密武器”成了广告语。产品出乎意料地好卖，毕竟谁不想哭完还美美的？',
          statChanges: { commercialValue: 3, money: -20000, fanLoyalty: 1 },
        },
      },
      {
        id: 'tears_pretend',
        text: '假装不知道',
        subtext: '被扒了？我不知道呢~',
        outcome: {
          narration: '你选择装死，但营销号已经扒出了注册信息。“冰冰的眼泪LLC，法人代表：冷冰凝。”连隐瞒都成了新的笑点。',
          statChanges: { prRisk: 2 },
        },
      },
      {
        id: 'tears_rebrand',
        text: '改名“不哭”重新包装',
        subtext: '原来的名字太阴间了',
        outcome: {
          narration: '你紧急把品牌改名为“不哭BUKU”，slogan改成“强大到不需要眼泪”。这次的反馈好多了，“从哭得美丽到强大不哭，冰冰成长了”上了热搜正面话题。',
          statChanges: { money: -15000, commercialValue: 3, fanLoyalty: 2 },
        },
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 💼 南陌格 (socialite) — 贵公子出身焦虑、资源嫉妒、过度“精致”
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  {
    id: 'trouble_socialite_watch_flex',
    category: 'drama',
    severity: 'medium',
    title: '南陌格红毯戴了一块百万限量表',
    description: '南陌格自己没跟你商量，戴了一块圈内都知道是“贵妇资源方”送的百万限量表走了某时尚晚宴红毯。钟表论坛的人半小时内就扒出了表的来源、编号、当年曾出现在另一位阔太太腕上的合照。#南陌格百万表身份# 冲到热搜第 9。他的高奢女表代言品牌的商务总监已经在问“这块表是借的还是送的”。',
    emoji: '⌚',
    forArtist: 'socialite',
    choices: [
      {
        id: 'watch_claim_own',
        text: '放通稿“自己买的”',
        subtext: '工作室硬挺“全款到账”',
        outcome: {
          narration: '通稿放出去的同时你就在后悔，钟表论坛几个老 ID 当晚把当年那笔“阔太太—专柜—专属编号”的流水扒了出来，截图精准到分钟。“贵公子全款自购”成了饭后笑料，代言品牌法务部的邮件发进来了。',
          statChanges: { prRisk: 7, fanLoyalty: -3, commercialValue: -3 },
        },
      },
      {
        id: 'watch_gift_spin',
        text: '包装成“前辈馈赠”',
        subtext: '“圈内长辈送的成年礼”',
        outcome: {
          narration: '工作室发了条温情小作文，“谢谢 X 姐当年的照拂”，配上南陌格十八岁生日老照片。高级饭圈吃这套，“有情有义”挂了个正面 tag。但圈里人都看懂了：这位 X 姐就是当年那位阔太太。你知道这张牌以后再打就贵了。',
          statChanges: { prRisk: -3, fanLoyalty: 3, commercialValue: -2 },
          unlockTag: 'owe_rich_wife_favor',
        },
      },
      {
        id: 'watch_donate',
        text: '当场捐给公益拍卖',
        subtext: '直接把表捐出去断争议',
        outcome: {
          narration: '你安排南陌格在下一场公益夜把表捐了，当场拍出两百三十万。“贵公子的体面”冲到热搜正面位，代言品牌方撤回邮件还加订了一季合作。但那位“送表的姐姐”据说气得在群里发了条半小时的语音。',
          statChanges: { money: -150000, prRisk: -4, fanLoyalty: 4, commercialValue: 3 },
        },
      },
    ],
  },

  {
    id: 'trouble_socialite_english_flex',
    category: 'drama',
    severity: 'low',
    title: '南陌格直播时飙了一段塑料英文',
    description: '高奢品牌全球线上活动，南陌格要在直播里用英文跟总部连线。他提前三天没背稿，现场一句 “I am a Chinese gentleman, nice to meet you” 外加几次卡壳让全场沉默三秒。切片十分钟内出了鬼畜版，#南陌格英文水平# 冲到热搜第 14。粉丝在超话刷“哥哥勇气可嘉”，黑粉在做“贵公子英文测评”系列。',
    emoji: '🗣️',
    forArtist: 'socialite',
    choices: [
      {
        id: 'english_humor',
        text: '连夜发自嘲小作文',
        subtext: '“确实翻车了，在补课”',
        outcome: {
          narration: '南陌格亲自发了一条“作业本上英语单词”的图，配文“老师说下次不许交白卷”。路人笑了，粉丝哭笑不得说“这才是真实的哥哥”。代言品牌方反倒赞了一句“他很坦诚”，比装精英分更讨巧。',
          statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: 2 },
        },
      },
      {
        id: 'english_deny',
        text: '工作室硬洗“是镜头问题”',
        subtext: '“现场网络延迟导致”',
        outcome: {
          narration: '工作室小作文刚发出来，网友就把现场四机位的原画切片全贴上来了，网络一点毛病没有。“镜头延迟”和“号被盗”又凑成一对。贵公子人设再掉一格。',
          statChanges: { prRisk: 5, fanLoyalty: -3 },
        },
      },
      {
        id: 'english_tutor',
        text: '买“贵公子学英文”营销',
        subtext: '直接立一个成长人设',
        outcome: {
          narration: '你让宣传组把南陌格和知名英语老师合作的 Vlog 企划提前推了，“贵公子学英文·第一课”当晚上了 B 站首页推荐。翻车被洗成了“上进人设”，还顺手捧了个英语老师合作款。',
          statChanges: { money: -20000, commercialValue: 3, fanLoyalty: 3 },
        },
      },
    ],
  },

  {
    id: 'trouble_socialite_host_rich_friend',
    category: 'drama',
    severity: 'medium',
    title: '南陌格让一个“圈外富二代朋友”上他的综艺',
    description: '南陌格录一档观察类综艺时，自作主张把自己一个“圈外富二代朋友”带进了镜头，对方在节目里露脸十分钟，还聊了几句“我和陌陌当年一起泡夜店”。节目播出当晚，那位“朋友”的身份被扒：是某地产商的二公子，两年前有过一起未结案的 PUA 指控。#南陌格 朋友背景# 冲到热搜第 11。',
    emoji: '🥃',
    forArtist: 'socialite',
    choices: [
      {
        id: 'friend_cut_clean',
        text: '工作室连夜发切割声明',
        subtext: '“仅为节目嘉宾，无私交”',
        outcome: {
          narration: '切割声明措辞干净，但南陌格本人朋友圈之前发过多条和对方的合照被网友翻出来了。“切割打脸实时播报”成了热搜联想词。朋友那边也发了条冷笑话：“有意思。”你知道，这个朋友以后是敌人。',
          statChanges: { prRisk: 3, fanLoyalty: -3, commercialValue: -2 },
        },
      },
      {
        id: 'friend_stand_by',
        text: '南陌格亲自发声“疑罪从无”',
        subtext: '力挺到底',
        outcome: {
          narration: '他写了条长微博“案子没结，我不会弃友”。粉丝哭着说“哥哥讲义气”，但路人和女性向话题的评论区骂惨了，“PUA 指控都敢挺”成了标签。两个合作品牌发来“暂停合作”的邮件。',
          statChanges: { fanLoyalty: 4, prRisk: 7, commercialValue: -5 },
          twist: {
            chance: 0.3,
            narration: '三周后那位朋友的案子被法院判了，证据确凿的 PUA。南陌格当初那条“疑罪从无”微博被翻出来做成了图鉴。',
            statChanges: { prRisk: 8, fanLoyalty: -5, commercialValue: -4 },
          },
        },
      },
      {
        id: 'friend_mute',
        text: '不回应，让节目组剪了这段',
        subtext: '花钱让节目组重剪',
        outcome: {
          narration: '你和节目组连夜谈判，把那十分钟从重播版里剪掉，但首播已经录屏了。“原版 VS 重播”的对比图在贴吧流传。争议压住了一半，但没压干净。',
          statChanges: { money: -40000, prRisk: 3 },
        },
      },
    ],
  },

  {
    id: 'trouble_socialite_mocked_hometown',
    category: 'drama',
    severity: 'medium',
    title: '南陌格评论区翻车：“老家那种小县城”',
    description: '南陌格在一条美食 vlog 评论区回一个粉丝时打了句“老家那种小县城吃的你真下得去口”，半小时后自己删了。但截图已经传疯。#南陌格 嘲笑小县城# 挂热搜第 6。那位粉丝的主页地址栏真的写着“湖南·某县城”。地域话题加人设反差，双重暴雷。',
    emoji: '🙄',
    forArtist: 'socialite',
    choices: [
      {
        id: 'hometown_apologize',
        text: '南陌格亲自手写道歉',
        subtext: '长文承认“凡尔赛过头了”',
        outcome: {
          narration: '他写了三百字手写信，承认“嘴上没把门”，并说以后每年去一个县城做公益美食探店。小县城粉丝感动哭了，但路人嘲“立马找 PR 救场”。至少热度没炸更大。',
          statChanges: { fanLoyalty: 3, prRisk: -3, money: -20000 },
        },
      },
      {
        id: 'hometown_doubledown',
        text: '工作室硬洗“玩笑话”',
        subtext: '“粉丝之间的熟人玩笑”',
        outcome: {
          narration: '这套说辞把那位粉丝气到直接发帖：“我压根不认识他，哪来的熟人玩笑？”截图传到微博又火了一轮。“贵公子瞧不起穷人”的标签糊到脸上，两个国民级品牌立刻撤了合作邀约。',
          statChanges: { prRisk: 10, fanLoyalty: -5, commercialValue: -5 },
        },
      },
      {
        id: 'hometown_visit',
        text: '直接带团队去那个县城直播',
        subtext: '全程带货当地土特产',
        outcome: {
          narration: '三天后南陌格真的落地那个县城，直播间挂着“来看看南陌格嘴里的小县城”。当地文旅局配合得天衣无缝，全场两小时把县城所有土特产卖空。“贵公子反向打脸”上了正面热搜。',
          statChanges: { money: 60000, fanLoyalty: 5, prRisk: -5, commercialValue: 3 },
        },
      },
    ],
  },

  {
    id: 'trouble_socialite_birthday_flex',
    category: 'business',
    severity: 'low',
    title: '南陌格晒自己的生日派对花了两百万',
    description: '南陌格生日当晚自己发了九宫格，私人会所包场、米其林主厨、顶级 DJ 台、某奢侈品牌当季限定摆件。宠粉配文：“给自己的小礼物。”一个本地生活博主扒出场地、菜单、摆件总价接近两百万。#南陌格 生日排面# 第 8 位，但评论区一半在夸“有排面”，一半在骂“经济下行你这样发”。',
    emoji: '🎂',
    forArtist: 'socialite',
    choices: [
      {
        id: 'birthday_delete',
        text: '连夜删博',
        subtext: '装作没发过',
        outcome: {
          narration: '他凌晨两点删了博，但九宫格早就被营销号存档。“删博承认 = 心虚”的帖子反而更火了。评论区最高赞：“早知道就别晒，晒了又删最难看。”',
          statChanges: { prRisk: 4, fanLoyalty: -3 },
        },
      },
      {
        id: 'birthday_donate_match',
        text: '同步宣布向公益捐同等金额',
        subtext: '用两百万公益捐款对冲',
        outcome: {
          narration: '工作室公告“南陌格向山区教育捐款 200 万”配转账截图。风向立刻扭转，“花得起也捐得起”成了正面 tag。这一波等于花四百万买了个“贵公子的体面”，但人设立住了。',
          statChanges: { money: -2000000, prRisk: -5, fanLoyalty: 5, commercialValue: 5 },
        },
      },
      {
        id: 'birthday_embrace',
        text: '干脆做一期“南陌格的一天”纪录片',
        subtext: '把炫富做成付费内容',
        outcome: {
          narration: '你和视频平台谈下了一档付费纪录片，“南陌格的一天：24 小时 X 万元”。节目爆火，但“把炫富变成生意”的争议也从未停过。两年后经济环境再变的时候，这节目会被翻出来鞭尸。',
          statChanges: { money: 300000, commercialValue: 4, prRisk: 5 },
        },
      },
    ],
  },
];
