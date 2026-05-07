import type { GameEvent } from '@/types/game';

// 南陌格（网红转型演员/男，贵公子人设）专属事件
// 招牌黑料：出道前做过"商务男模"，云端有照片视频 + 私密群流传的"服务价目表"
export const socialiteSpecificEvents: GameEvent[] = [
  // ===== 日常非黑料事件（和其他艺人风格对齐） =====
  {
    id: 'socialite_luxury_campaign',
    category: 'business',
    severity: 'medium',
    title: '高奢品牌全球代言找来了',
    description: '一个欧洲顶级奢侈品牌想签南陌格做全球亚太区代言，合同金额八位数。但品牌方的合规部对"艺人历史背景"要求特别严，会做详细背调。',
    emoji: '💼',
    forArtist: 'socialite',
    minDay: 5,
    choices: [
      {
        id: 'take_global_deal',
        text: '接！值这个险',
        subtext: '签下八位数代言',
        outcome: {
          narration: '合同签下，一笔巨款到账。南陌格穿着品牌当季大片出街，"亚太区全球代言人"的名号一挂，圈内其他贵公子全靠边站。',
          statChanges: { money: 2000000, commercialValue: 8, prRisk: 4 },
          unlockTag: 'global_lux_deal',
        },
      },
      {
        id: 'negotiate_lighter',
        text: '谈一个轻量合作',
        subtext: '只接地区合作，避开背调',
        outcome: {
          narration: '品牌方给了一份"大中华区季度代言"的方案，金额缩水到一半，但背调只做基础版。稳妥度高了一截。',
          statChanges: { money: 600000, commercialValue: 4 },
        },
      },
    ],
  },
  {
    id: 'socialite_socialite_party',
    category: 'drama',
    severity: 'medium',
    title: '富婆圈晚宴邀请',
    description: '一位京圈顶级阔太太发来晚宴邀请，席上会有多位贵妇资源方。去了能拿到两三个代言，不去会被说"翻脸不认人"。但媒体可能会蹲这场。',
    emoji: '🥂',
    forArtist: 'socialite',
    minDay: 6,
    choices: [
      {
        id: 'attend_party',
        text: '去',
        subtext: '赴宴 + 资源链接',
        outcome: {
          narration: '南陌格到场，谈下两个品牌。但当晚有狗仔拍到他和某位富婆单独进电梯的侧影——"暧昧"话题上了热搜，团队连夜公关。',
          statChanges: { money: 300000, commercialValue: 5, prRisk: 6 },
        },
      },
      {
        id: 'skip_party',
        text: '不去',
        subtext: '婉拒并送花',
        outcome: {
          narration: '他送了花和礼物，没出席。资源少了，但他需要的正是"避嫌"这件事本身。',
          statChanges: { prRisk: -3, fanLoyalty: 3 },
        },
      },
      {
        id: 'bring_cover',
        text: '带粉丝后援会代表去',
        subtext: '用"粉丝陪同"做挡箭牌',
        outcome: {
          narration: '你安排了三位粉丝代表作为"陪同"跟着去，全程直播。富婆们很不爽，但舆论层面你赢了——"南陌格把粉丝带进京圈晚宴"成了当晚粉圈最大瓜。',
          statChanges: { money: 120000, fanLoyalty: 7, commercialValue: 3 },
        },
      },
    ],
  },

  // ===== 招牌黑料：商务男模往事 =====
  {
    id: 'socialite_private_group_leak',
    category: 'crisis',
    severity: 'high',
    title: '私密群"服务价目表"开始外传',
    description: '某个高档富婆圈的微信私密群里，一张"商务男模价目表"截图被人传到圈外。表里第三行用首字母打码，但"某 M 姓、1米85、全套价格 X 万"的描述指向很明确——就是南陌格出道前那段经历。已经有几家娱乐号私信工作室了："买还是不买，给个说法。"',
    emoji: '📋',
    forArtist: 'socialite',
    minDay: 5,
    choices: [
      {
        id: 'buy_all_screenshots',
        text: '全网买断+公关',
        subtext: '给每家娱乐号封口费 (-80万)',
        requireMinMoney: 800000,
        outcome: {
          narration: '八十万撒下去，十几家娱乐号集体沉默，热搜词条被手动压下去。但圈内开始暗流涌动——"南陌格团队很怕这张图"成了行业内幕。每过一阵就会有新的号想碰这块钱。',
          statChanges: { money: -800000, prRisk: -3, commercialValue: 3 },
          unlockTag: 'price_list_buried',
        },
      },
      {
        id: 'claim_fake',
        text: '发律师函打"伪造"',
        subtext: '定性为恶意 P 图 (-10万)',
        requireMinMoney: 100000,
        outcome: {
          narration: '律师函批量发出，大部分营销号撤了。但有人放出了"价目表截图里隐约可见的微信群聊时间戳"作为真实性佐证。法律战还没结束，舆论战已经输了一半。',
          statChanges: { money: -100000, prRisk: 8, fanLoyalty: -5 },
          unlockTag: 'forged_denial',
        },
      },
      {
        id: 'source_the_group',
        text: '查源头',
        subtext: '顺着私密群揪出截图人 (-20万)',
        requireMinMoney: 200000,
        outcome: {
          narration: '你花钱让专业人士顺着截图反查群号、管理员、发送设备。三天后锁定了一个过气男模——一个和南陌格同期但没火起来的竞争者。查到了，下一步怎么处理成了新问题。',
          statChanges: { money: -200000, prRisk: 3, commercialValue: -3 },
          unlockTag: 'found_leak_source',
        },
      },
    ],
  },
  {
    id: 'socialite_cloud_photos',
    category: 'crisis',
    severity: 'critical',
    title: '云端照片视频被人"意外"下载',
    description: '当年南陌格用的一个旧云盘账号据说被人破解，里面存着他做商务男模那段时间的照片和视频——部分场合穿着、部分和富婆的合照。一个匿名账号在暗网挂牌："50 枚比特币 or 500 万人民币。"某营销号开始放出打码版本的"预告图"造势。',
    emoji: '☁️',
    forArtist: 'socialite',
    minDay: 9,
    choices: [
      {
        id: 'pay_ransom',
        text: '付赎金买回',
        subtext: '走暗渠道转 500 万 (-500万)',
        requireMinMoney: 5000000,
        outcome: {
          narration: '五百万打过去，对方发回了一个加密压缩包和解压密码。确认是原件后，你让技术团队彻底销毁。但问题是——你不知道对方有没有留备份。这类勒索从来没有真的"结束"。',
          statChanges: { money: -5000000, prRisk: -5, fanLoyalty: 3 },
          unlockTag: 'ransom_paid',
          twist: {
            chance: 0.3,
            narration: '三个月后同一个账号又出现了："上次的存档还没卖完。"第二笔赎金要不要付？',
            statChanges: { prRisk: 8 },
            unlockTag: 'ransom_repeat',
          },
        },
      },
      {
        id: 'engage_cyber_team',
        text: '请黑客反追溯',
        subtext: '雇网安团队反向定位 + 毁证 (-60万)',
        requireMinMoney: 600000,
        outcome: {
          narration: '你联系了一个网安公司，他们花了一周反向定位到勒索者的 VPN 跳板。对方压力山大，下架了预告图并删除了挂牌。但网安公司不敢百分百保证销毁了所有备份——"我们只能让他不敢再卖"。',
          statChanges: { money: -600000, prRisk: 3, commercialValue: -3 },
          unlockTag: 'cyber_intimidation',
        },
      },
      {
        id: 'preemptive_strike',
        text: '自曝"过去"',
        subtext: '南陌格主动开直播讲当年打工史',
        outcome: {
          narration: '他开了一场两小时直播，没提"商务男模"四个字，只讲了当年"穷到在夜店给人端盘子、给贵妇拎包挣时薪"——把故事重塑成"苦出身的逆袭"。等营销号放完整照片时，粉丝的第一反应是"我们姐姐当年太苦了"。大事化小。',
          statChanges: { fanLoyalty: 10, prRisk: -8, commercialValue: -3 },
          unlockTag: 'reframed_the_past',
          twist: {
            chance: 0.35,
            narration: '但是！勒索者直接放出了一段有富婆脸的视频片段。"贵妇拎包"的人设立刻塌了。',
            statChanges: { fanLoyalty: -12, prRisk: 15 },
          },
        },
      },
    ],
  },
  {
    id: 'socialite_rich_wife_claim',
    category: 'drama',
    severity: 'critical',
    title: '某富婆突然认亲"当年小男朋友"',
    description: '一位 45 岁的阔太太在社交账号发了九宫格：南陌格当年给她"做商务"的合影、礼物单、转账记录。配文："我的小男朋友现在火了，忘了姐姐了？姐姐可是一直留着呢。"阔太太有三百万粉，帖子两小时转发破五万。',
    emoji: '👠',
    forArtist: 'socialite',
    minDay: 13,
    choices: [
      {
        id: 'private_settlement_lady',
        text: '私下重金和解',
        subtext: '让她撤博并签保密协议 (-300万)',
        requireMinMoney: 3000000,
        outcome: {
          narration: '三百万转到她账上，帖子两小时后删除，她发了条新微博："只是开玩笑，被误解了。"风波按下去了，但截图和九宫格已经存在于全网记忆。你知道她下次还会来。',
          statChanges: { money: -3000000, prRisk: 3, commercialValue: -3 },
          unlockTag: 'rich_wife_silenced',
        },
      },
      {
        id: 'deny_everything_lady',
        text: '全盘否认并反告诽谤',
        subtext: '"这人疯了我不认识她" (-20万)',
        requireMinMoney: 200000,
        outcome: {
          narration: '律师函满天飞。但阔太太直接放出了转账截图和开房记录——实锤越来越硬。南陌格的工作室被挤爆，品牌方连夜开会开始切割。',
          statChanges: { money: -200000, prRisk: 20, fanLoyalty: -15, commercialValue: -10 },
          unlockTag: 'rich_wife_escalated',
        },
      },
      {
        id: 'counter_leverage',
        text: '反制——挖她的黑料',
        subtext: '找她婚姻里的把柄反向施压 (-50万)',
        requireMinMoney: 500000,
        outcome: {
          narration: '团队花了一周查出她和现任老公的离婚协议有瑕疵，把这份信息"匿名"发给她。她当晚删博，从此再没提起过南陌格。但你知道这种操作触碰了底线——那位阔太太的圈子里有很多比她更大的人物。',
          statChanges: { money: -500000, prRisk: -3, fanLoyalty: -3 },
          unlockTag: 'counter_blackmail_lady',
          twist: {
            chance: 0.4,
            narration: '三周后，你反制用的那份信息被人反手泄露给另一家媒体。"南陌格团队涉嫌威胁女性"的热搜炸了。',
            statChanges: { prRisk: 15, commercialValue: -6 },
          },
        },
      },
    ],
  },

  // ===== 转型 / 资源 / 同期相关的非赎金类专属事件 =====
  {
    id: 'socialite_serious_role_audition',
    category: 'business',
    severity: 'medium',
    title: '一位文艺片大导找他试镜"反派矿工"',
    description: '某金棕榈入围过的文艺片导演给南陌格的工作室发来一份剧本——男二号"南方某矿区下井工头"，全程方言、毁容妆。导演直接说："你脸上那股贵气我想毁掉看看。"这是南陌格出道以来第一次被非偶像剧/非高奢广告体系认真邀约。但试镜要去剧组深山待两周，期间他三个高奢代言的拍摄要全部推。',
    emoji: '🎞️',
    forArtist: 'socialite',
    minDay: 8,
    choices: [
      {
        id: 'serious_take',
        text: '推掉广告进组',
        subtext: '赌一次"贵公子转演员"',
        outcome: {
          narration: '南陌格剃了头、晒黑了一档，进组前两天因为方言被导演骂哭过两次。三个月后片子拿了某海外电影节的展映，"南陌格 演技# 第一次冲上热搜正面位。但被推掉的两个高奢品牌悄悄把代言转给了他的圈内对手。',
          statChanges: { money: -200000, commercialValue: 3, fanLoyalty: 7, prRisk: -3 },
          unlockTag: 'transform',
        },
      },
      {
        id: 'serious_decline',
        text: '婉拒，专注高奢主线',
        subtext: '"贵公子不需要去演矿工"',
        outcome: {
          narration: '工作室回了"档期冲突"。导演半年后用了一个新人男演员，那个新人因这部片子提名了影帝。每次刷到提名新闻，南陌格都会沉默。但这一季他的高奢代言费报价又涨了 20%。',
          statChanges: { money: 150000, commercialValue: 4, fanLoyalty: -3 },
        },
      },
      {
        id: 'serious_negotiate',
        text: '试镜，但要求改戏份',
        subtext: '"我可以演，但不能毁容"',
        outcome: {
          narration: '你和导演谈了两小时，对方冷笑："那就不是这个角色。"导演当场撤了邀约，业内传开了"南陌格摆贵公子谱"的话头。圈内导演群组里你被点名讨论了一周。',
          statChanges: { commercialValue: -3, prRisk: 4 },
        },
      },
    ],
  },

  {
    id: 'socialite_pua_counter_rumor',
    category: 'drama',
    severity: 'high',
    title: '"南陌格其实是 PUA 富婆的"反向传闻',
    description: '一篇豆瓣长文火了——标题是《那些被"贵公子"PUA 过的姐姐们》，匿名拼凑了三段"被冷暴力—被借钱—被消失"的女性叙述，矛头隐约指向南陌格。文章没有点名，但行文里提到的"M 姓男模、出道于某选秀"几乎实锤。#南陌格 PUA# 冲到热搜第 4。这次不是富婆来撕他，是一群自称"受害者"的女性集体发声。',
    emoji: '🚩',
    forArtist: 'socialite',
    minDay: 11,
    choices: [
      {
        id: 'pua_legal_full',
        text: '法务全网起诉造谣',
        subtext: '律师函+公安立案 (-30万)',
        requireMinMoney: 300000,
        outcome: {
          narration: '律师函下午就挂了官博。三天后两位"匿名受害者"撤回了帖子，但第三位放出了一段语音对话——南陌格的声音清楚说出了"姐你不借我这笔钱以后就别再找我"。"实锤"两字冲到热搜第 1。代言连掉两个。',
          statChanges: { money: -300000, prRisk: 12, fanLoyalty: -7, commercialValue: -5 },
        },
      },
      {
        id: 'pua_female_endorse',
        text: '请合作过的女性艺人发声背书',
        subtext: '让搭档姐姐们站出来 (-50万人情)',
        outcome: {
          narration: '你动用了所有人情，三位和南陌格合作过古偶剧的女演员一起发了"陌弟弟一直很尊重对手"的暖文。话题被掰回"职场风评 vs 情感传闻"。受害者帖子没撤，但讨论度被冲淡了一半。但你这三笔人情，以后是要还的。',
          statChanges: { money: -50000, prRisk: -5, fanLoyalty: 4, commercialValue: -2 },
          unlockTag: 'owe_industry_favor',
        },
      },
      {
        id: 'pua_self_disclose',
        text: '南陌格自己直播谈感情史',
        subtext: '主动掰开揉碎讲',
        outcome: {
          narration: '他开了一场两小时直播，承认"年轻时确实从某些姐姐身上得到过帮助，没有处理好"，没具体回应任何指控但姿态放得很低。粉丝哭了一片，部分路人买账："至少他没装无辜。" 但圈内有人说："这种事情你越承认越脱不开身。"',
          statChanges: { fanLoyalty: 6, prRisk: -3, commercialValue: -3 },
          twist: {
            chance: 0.3,
            narration: '直播第二天，那位匿名受害者放出了和直播内容矛盾的转账记录。"自爆翻车"的标签贴上来了。',
            statChanges: { prRisk: 9, fanLoyalty: -5 },
          },
        },
      },
    ],
  },

  {
    id: 'socialite_old_modelmate_offer',
    category: 'business',
    severity: 'medium',
    title: '一位同期男模找他"合作出道"',
    description: '当年和南陌格一起做"商务男模"的同期男生 W 在朋友圈发了条九宫格——他这两年靠健身和自拍混到了 50 万粉，今天给南陌格发了私信："陌哥，我想签你的工作室，你带带我，咱们当年的故事我可以帮你说也可以帮你不说。"言外之意非常清楚。',
    emoji: '🤝',
    forArtist: 'socialite',
    minDay: 10,
    choices: [
      {
        id: 'sign_him',
        text: '签！把人攥在手里',
        subtext: '工作室签下他做艺人 (-40万)',
        requireMinMoney: 400000,
        outcome: {
          narration: '签约合同当晚就盖了章，对方第二天把"南陌格的好兄弟"挂在主页。你给他规划了健身博主路线，他配合得很好。但你心里清楚——你养的不是一个艺人，是一颗你自己埋的雷。',
          statChanges: { money: -400000, prRisk: -5, commercialValue: 3 },
          unlockTag: 'kept_old_modelmate',
        },
      },
      {
        id: 'pay_him_off',
        text: '一次性给笔钱让他消失',
        subtext: '直接打钱断关系 (-100万)',
        requireMinMoney: 1000000,
        outcome: {
          narration: '一百万到账后他删了朋友圈，承诺"再不联系"。你松了一口气，但你也知道——这种承诺有保鲜期。这个人手里的料，就是一份他随时可以再开的存款。',
          statChanges: { money: -1000000, prRisk: 3 },
          unlockTag: 'paid_off_modelmate',
        },
      },
      {
        id: 'reject_modelmate',
        text: '直接回"不熟"',
        subtext: '装不认识他',
        outcome: {
          narration: '南陌格本人回了"先生，我们似乎没认识"。三小时后对方在豆瓣鹅组发了张当年两人合照，配文"陌哥别装"。截图传到微博，#南陌格 不认旧友# 上了热搜。这把硬刚等于把雷自己挑起来引爆。',
          statChanges: { prRisk: 9, fanLoyalty: -3, commercialValue: -3 },
        },
      },
    ],
  },
];
