import type { GameEvent } from '@/types/game';

// ===== 动物塑（全艺人）=====
// 团队/粉丝主动营业动物人设。接受立反差，拒绝保持神秘。
// 各艺人绑定不同动物：甄帅=小狗、郝美丽=猫、高八度=仓鼠、冷冰凝=狐狸、南陌格=狼
export const personaAnimalOfferEvent: GameEvent = {
  id: 'persona_animal_offer',
  category: 'pr',
  severity: 'medium',
  title: '团队提议给{name}绑一个动物人设',
  description: '宣传组开会：短视频时代，粉丝更愿意为“反差萌”买单。市场部想给{name}绑一个动物人设，做一波集中营业。',
  emoji: '🐾',
  minDay: 4,
  artistVariants: {
    idol: {
      description: '宣传组开会：万人迷体质其实很适合走“小狗系男友”路线，眼神湿漉漉、粘人、爱吃、爱笑。剪几条“小狗甄帅”合集能直接冲上小时榜。',
      emoji: '🐶',
      choices: [
        {
          id: 'accept_animal_dog',
          text: '接受，营业小狗系',
          subtext: '立"小狗系男友"人设',
          outcome: {
            narration: '一夜之间"小狗甄帅"tag 冲上小时榜，粉丝集体大喊"我的狗！"。CP 粉、唯粉、路人盘都吃这个反差，广告主看到数据当天就发了询价单。',
            statChanges: { fanLoyalty: 6, commercialValue: 4, prRisk: 2 },
            unlockTag: 'persona_dog',
          },
        },
        {
          id: 'reject_animal_dog',
          text: '拒绝，保持神秘感',
          subtext: '“他不是小狗，他是我哥哥”',
          outcome: {
            narration: '你按住了运营的手："他现在的偶像滤镜够薄了，再来一层狗滤镜，塌得更快。"神秘感留住了，热度也没冲上去。',
            statChanges: { fanLoyalty: 2, prRisk: -2 },
            unlockTag: 'persona_mysterious',
          },
        },
      ],
    },
    actor: {
      description: '宣传组翻遍郝美丽的物料：挑剔、傲娇、片场怼编剧的花絮全在。总监拍板："猫系女演员，人设立得住。"',
      emoji: '🐱',
      choices: [
        {
          id: 'accept_animal_cat',
          text: '接受，营业猫系',
          subtext: '立"傲娇猫系女演员"人设',
          outcome: {
            narration: '"郝美丽的猫瞬间"合集刷屏，连她拍桌怼编剧的花絮都被剪成"猫猫炸毛"，路人反而觉得可爱。金鸡新人+猫系人设，双 buff 拉满。',
            statChanges: { fanLoyalty: 5, commercialValue: 4, prRisk: 2 },
            unlockTag: 'persona_cat',
          },
        },
        {
          id: 'reject_animal_cat',
          text: '拒绝，专注演员身份',
          subtext: '“演员靠作品说话”',
          outcome: {
            narration: '你把宣传方案退回："她要走演技派路线，卖萌是短期流量，是慢性毒药。"团队闷声照办，但内部有人小声嘀咕"这波流量白白让了"。',
            statChanges: { fanLoyalty: 2, commercialValue: -1, prRisk: -2 },
            unlockTag: 'persona_mysterious',
          },
        },
      ],
    },
    singer: {
      description: '"八哥"这个粉丝爱称本来就带点动物感。宣传组顺势提议：走仓鼠系反差萌——舞台上高音炸场，下了台鼓着腮帮子啃饼干。',
      emoji: '🐹',
      choices: [
        {
          id: 'accept_animal_hamster',
          text: '接受，营业仓鼠系',
          subtext: '“舞台猛男，日常仓鼠”',
          outcome: {
            narration: '综艺后台"高八度啃饼干"的偷拍剪成 15 秒，转发破十万。粉丝集体沦陷"八哥真的是仓鼠成精"，商务方觉得这个反差点很好卖。',
            statChanges: { fanLoyalty: 6, commercialValue: 3, prRisk: 2 },
            unlockTag: 'persona_hamster',
          },
        },
        {
          id: 'reject_animal_hamster',
          text: '拒绝，坚守音乐人姿态',
          subtext: '“艺术家不卖萌”',
          outcome: {
            narration: '"八哥"翻脸："我是搞音乐的，不是搞卖萌的。"你替他挡下方案，团队心情复杂——挡住了一次塌房隐患，也挡住了一次翻红机会。',
            statChanges: { fanLoyalty: 2, prRisk: -2 },
            unlockTag: 'persona_mysterious',
          },
        },
      ],
    },
    influencer: {
      description: '数据组分析冷冰凝的用户画像："粉丝就喜欢看她一边卖惨一边狠赚。"宣传组拍板：狐系人设，精明、上镜、带一点危险感。',
      emoji: '🦊',
      choices: [
        {
          id: 'accept_animal_fox',
          text: '接受，营业狐系',
          subtext: '立"带货小狐狸"人设',
          outcome: {
            narration: '"冰冰是我们家狐狸精"这条评论被顶上热评。粉丝一边骂一边下单，GMV 数据反倒创了新高。狐系人设 = 会搞钱人设，完美闭环。',
            statChanges: { fanLoyalty: 5, commercialValue: 5, prRisk: 3 },
            unlockTag: 'persona_fox',
          },
        },
        {
          id: 'reject_animal_fox',
          text: '拒绝，避免"狐狸精"标签',
          subtext: '“太危险，容易被反噬”',
          outcome: {
            narration: '你摇头："她黑料够多了，再贴一个’狐狸精’的标签，黑粉能直接顺着这三个字造谣三个月。"运营叹气收回方案。',
            statChanges: { fanLoyalty: 1, prRisk: -3, commercialValue: -1 },
            unlockTag: 'persona_mysterious',
          },
        },
      ],
    },
    socialite: {
      description: '南陌格现在的花瓶小生标签太软，营销总监建议："换一个更有攻击性的——狼系贵公子，冷、狠、有距离感。"',
      emoji: '🐺',
      choices: [
        {
          id: 'accept_animal_wolf',
          text: '接受，营业狼系',
          subtext: '立"狼系贵公子"人设',
          outcome: {
            narration: '一组黑白狼系氛围大片放出去，"南陌格眼神杀"直接冲上热搜。高奢品牌很吃这一套，两个代言主动联系。花瓶终于有了刀感。',
            statChanges: { fanLoyalty: 4, commercialValue: 6, prRisk: 3 },
            unlockTag: 'persona_wolf',
          },
        },
        {
          id: 'reject_animal_wolf',
          text: '拒绝，保持花瓶美感',
          subtext: '“他现在的路子好卖”',
          outcome: {
            narration: '你按下方案："他现在的贵公子路线还能吃三年，别急着换。"营销总监耸肩收工。你觉得自己稳，但错过了一个可能爆的方向。',
            statChanges: { fanLoyalty: 2, commercialValue: -1 },
            unlockTag: 'persona_mysterious',
          },
        },
      ],
    },
  },
  choices: [
    {
      id: 'accept_animal_generic',
      text: '接受',
      subtext: '立反差感人设',
      outcome: {
        narration: '动物人设立住了，粉丝集体沦陷，商务方也觉得有点意思。',
        statChanges: { fanLoyalty: 5, commercialValue: 3, prRisk: 2 },
        unlockTag: 'persona_animal',
      },
    },
    {
      id: 'reject_animal_generic',
      text: '拒绝',
      subtext: '保持神秘感',
      outcome: {
        narration: '你按住了方案，选择留住神秘感。',
        statChanges: { fanLoyalty: 2, prRisk: -2 },
        unlockTag: 'persona_mysterious',
      },
    },
  ],
};

// ===== 崩人设反噬 =====
// 前置：绑了动物人设 + 舆论风险偏高（说明有暴躁/翻车事件积压）
export const personaAnimalCollapseEvent: GameEvent = {
  id: 'persona_animal_collapse',
  category: 'crisis',
  severity: 'high',
  title: '"{name}人设崩了"上热搜',
  description: '一段{name}后台发脾气的视频被扒出，和团队精心营业的动物人设形成剧烈反差。粉丝群里已经开始出现"人设都是骗我们的"这种声音。',
  emoji: '💥',
  minDay: 10,
  requiredTags: ['persona_dog', 'persona_cat', 'persona_hamster', 'persona_fox', 'persona_wolf'],
  statConditions: { minPrRisk: 40 },
  choices: [
    {
      id: 'collapse_apologize',
      text: '发长文道歉',
      subtext: '“真实的我也请你接受”',
      outcome: {
        narration: '一篇"人设是团队包装，真实的我脾气就是这样"的长文发出去。愿意接受的粉丝留下了，接受不了的直接脱粉。总量掉了，但留下的更铁。',
        statChanges: { fanLoyalty: -6, prRisk: -3, commercialValue: -2 },
        unlockTag: 'persona_broken',
      },
    },
    {
      id: 'collapse_double_down',
      text: '硬撑人设',
      subtext: '继续营业不承认',
      outcome: {
        narration: '团队连发三条"日常小狗/猫/狼"内容硬撑。真粉当场破防："已经翻车了还在演。"人设崩得更彻底，脱粉+黑热搜双杀。',
        statChanges: { fanLoyalty: -12, prRisk: 6, commercialValue: -4 },
        unlockTag: 'persona_broken',
        twist: {
          chance: 0.3,
          narration: '当天晚上，那个后台视频的完整版被曝出——脾气比片段更暴。人设彻底埋葬。',
          statChanges: { fanLoyalty: -6, prRisk: 5 },
        },
      },
    },
    {
      id: 'collapse_selfmock',
      text: '自嘲带过',
      subtext: '发一条"我是狼狗/猫狗合体"',
      outcome: {
        narration: '{name}发条微博："其实我是双面派，一面小狗一面小狼。"部分粉丝笑了，部分粉丝觉得敷衍。舆论热度快速消退，但塌房痕迹留下了。',
        statChanges: { fanLoyalty: -3, prRisk: -2 },
        unlockTag: 'persona_broken',
      },
    },
  ],
};

// ===== 卖腐 CP（男艺人专属：甄帅/高八度/南陌格）=====
export const cpBaitingOfferEvent: GameEvent = {
  id: 'cp_baiting_offer',
  category: 'pr',
  severity: 'medium',
  title: '综艺想让{name}和男嘉宾炒 CP',
  description: '节目组暗示，{name}和搭档男嘉宾的互动 CP 感很足，愿不愿意"营业"一波？CP 粉能带来一波集中曝光，但对唯粉是暴击。',
  emoji: '💞',
  forArtist: ['idol', 'singer', 'socialite'],
  minDay: 6,
  choices: [
    {
      id: 'cp_engage',
      text: '营业发糖',
      subtext: '喂粉，拉 CP 粉',
      outcome: {
        narration: 'CP 剪辑视频当晚破百万播放，#{name}和搭档的糖 冲上热搜。CP 粉集体氪金应援，但唯粉群炸了："我哥哥怎么能和男的这么亲密？"脱粉的脱粉，拉黑的拉黑。',
        statChanges: { fanLoyalty: 4, commercialValue: 5, prRisk: 5 },
        unlockTag: 'cp_active',
        followUpEventId: 'cp_unbind_crisis',
      },
    },
    {
      id: 'cp_distance',
      text: '保持距离',
      subtext: '不主动不拒绝',
      outcome: {
        narration: '你告诉艺人："镜头前别过分互动。"CP 粉觉得没糖但也没被打脸，路人盘无感。稳，也没什么爆发。',
        statChanges: { fanLoyalty: 1, prRisk: -1 },
      },
    },
    {
      id: 'cp_deny_official',
      text: '官方否认',
      subtext: '“兄弟情，请勿过度解读”',
      outcome: {
        narration: '工作室发声明："艺人之间纯粹兄弟情，请勿过度解读。"唯粉集体喊"哥哥辛苦了"，CP 粉当场破防。风险压下去，但也压掉了一波流量。',
        statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: -2 },
      },
    },
  ],
};

// ===== 解绑 CP =====
// 承接：卖腐链，requiredTags: cp_active
export const cpUnbindCrisisEvent: GameEvent = {
  id: 'cp_unbind_crisis',
  category: 'drama',
  severity: 'high',
  title: 'CP 搭档要 solo，{name}怎么办',
  description: '当初和{name}炒 CP 的男嘉宾开始接自己的独立资源，团队暗示要"解绑"，专心走个人路线。CP 粉已经开始嗅到风向，超话炸锅。',
  emoji: '💔',
  requiredTags: ['cp_active'],
  minDay: 9,
  choices: [
    {
      id: 'unbind_active',
      text: '主动解绑',
      subtext: '发长文告别 CP，立独立人设',
      outcome: {
        narration: '{name}发了一条"感谢一路以来的糖，但我们各自都有更远的路要走"。CP 粉集体破防脱粉，但路人和唯粉给他鼓掌："终于摆脱 CP 绑架。"独立艺人形象立住了。',
        statChanges: { fanLoyalty: -8, commercialValue: 4, prRisk: 3 },
        unlockTag: 'cp_unbound_active',
      },
    },
    {
      id: 'unbind_passive',
      text: '被动被解绑',
      subtext: '等对方先发声明',
      outcome: {
        narration: '搭档抢先发了一条"感谢过去的合作"，你的艺人变成"被解绑"的那个。CP 粉全部倒戈骂{name}"配不上"，热搜清一色负面。',
        statChanges: { fanLoyalty: -10, prRisk: 8, commercialValue: -3 },
        unlockTag: 'cp_dumped',
      },
    },
    {
      id: 'unbind_ghost',
      text: '装死冷处理',
      subtext: '不回应，让时间冲淡',
      outcome: {
        narration: '你按住所有回应，让这事慢慢淡下去。CP 粉一部分留守，一部分脱粉，路人几乎无感。风险控住了，热度也没了。',
        statChanges: { fanLoyalty: -3, prRisk: -1 },
        unlockTag: 'cp_ghosted',
      },
    },
  ],
};

// ===== 下海：转型 =====
// 爱豆↔演员/综艺，商业价值大幅波动
export const careerPivotEvent: GameEvent = {
  id: 'career_pivot',
  category: 'business',
  severity: 'high',
  title: '{name}是时候考虑"下海"了',
  description: '当前赛道天花板肉眼可见，团队开会讨论转型。爱豆下海演戏、演员下海综艺、网红下海代言，每条路都是一次豪赌——赌对了商业价值翻倍，赌错了就是掉队。',
  emoji: '🌊',
  minDay: 15,
  choices: [
    {
      id: 'pivot_acting',
      text: '下海演戏',
      subtext: '接一部大制作正剧',
      outcome: {
        narration: '{name}官宣加盟一部大导演的年代正剧，粉丝欢呼"转型演员"，但业内已经在传"流量演正剧要糊"。商业估值先冲一波，能不能站稳看播出。',
        statChanges: { commercialValue: 8, prRisk: 4, fanLoyalty: 3 },
        unlockTag: 'career_actor_pivot',
        twist: {
          chance: 0.3,
          narration: '开机第一天，一段"念台词像念课文"的路透流出。#{name}演技尴尬 挂上热搜。转型第一步就踩了坑。',
          statChanges: { commercialValue: -6, prRisk: 6, fanLoyalty: -4 },
        },
      },
    },
    {
      id: 'pivot_variety',
      text: '下海综艺',
      subtext: '接一档头部综艺常驻',
      outcome: {
        narration: '{name}签约头部综艺常驻，曝光量当月翻三倍，各类品牌代言主动上门。综艺咖的路走通了，但演员/歌手赛道那边逐渐没人再找他/她。',
        statChanges: { commercialValue: 6, fanLoyalty: -2, prRisk: 2, money: 200000 },
        unlockTag: 'career_variety_pivot',
      },
    },
    {
      id: 'pivot_stay',
      text: '不动，深耕原赛道',
      subtext: '拒绝转型',
      outcome: {
        narration: '你压下所有转型方案："他/她现在的赛道还没饱和，别急着切换。"稳是稳了，但天花板也钉死了。',
        statChanges: { commercialValue: -2, fanLoyalty: 2 },
      },
    },
  ],
};

// ===== 对家取黑称 =====
// 用 rival 系统的存在感 + prRisk 门槛（事件层无法直接读 rival.hostility，用 prRisk 代理）
export const rivalNamingSmearEvent: GameEvent = {
  id: 'rival_naming_smear',
  category: 'drama',
  severity: 'medium',
  title: '对家粉丝给{name}起了个黑称',
  description: '对家粉丝在超话集中开会造黑梗，给{name}起了一个专门用来扣帽子的黑称，正在往路人区扩散。你必须选一个应对方式。',
  emoji: '🏷️',
  minDay: 8,
  statConditions: { minPrRisk: 25 },
  choices: [
    {
      id: 'naming_legal',
      text: '发律师函警告',
      subtext: '走法律流程 (-3万)',
      requireMinMoney: 30000,
      outcome: {
        narration: '律师函满天飞，超话被清了一大半黑称词条。但律师函反而变成"此地无银"——路人开始好奇"为什么一个外号都要告？"话题热度反倒涨了。',
        statChanges: { money: -30000, prRisk: 4, fanLoyalty: 2 },
      },
    },
    {
      id: 'naming_selfmock',
      text: '反向玩梗自嘲',
      subtext: '{name}亲自转发调侃',
      outcome: {
        narration: '{name}在微博自嘲："粉丝送的外号我先用了。"路人乐了，黑称一夜之间被玩成粉丝爱称，对家粉集体破防："这梗被抢了！"',
        statChanges: { fanLoyalty: 5, prRisk: -3, commercialValue: 2 },
        unlockTag: 'rival_meme_flipped',
        twist: {
          chance: 0.2,
          narration: '但是——两天后有人翻出这个外号最早的出处，指向一段黑历史。自嘲变自曝，反噬了。',
          statChanges: { prRisk: 5, fanLoyalty: -4 },
        },
      },
    },
    {
      id: 'naming_ignore',
      text: '冷处理',
      subtext: '不回应，交给数据组反黑',
      outcome: {
        narration: '你让数据组默默控评，不给任何回应。黑称在小圈子里传了几天，没进入主流视野。稳，但那批粉圈黑话已经落地生根，早晚还会浮出来。',
        statChanges: { prRisk: 2 },
        unlockTag: 'rival_smear_dormant',
      },
    },
  ],
};

export const personaEvents: GameEvent[] = [
  personaAnimalOfferEvent,
  personaAnimalCollapseEvent,
  cpBaitingOfferEvent,
  cpUnbindCrisisEvent,
  careerPivotEvent,
  rivalNamingSmearEvent,
];
