import type { GameEvent } from '@/types/game';

// 平台 / 算法梗事件 —— 直播间、小红书、抖音推流、超话签到等当下真实网络生态。
// 设计原则：① 情境本身就是一个可当标题传播的热搜梗；
//          ② 每条 narration 结尾尽量落到一句"可截图的高赞神评论"；
//          ③ twist 走"荒诞但真实的舆论无逻辑"；
//          ④ 强化经纪人（打工人）视角的自嘲共情。
export const platformEvents: GameEvent[] = [
  // 1. 直播间在线人数翻车
  {
    id: 'platform_livestream_47',
    category: 'crisis',
    severity: 'medium',
    title: '直播间在线人数被做成表情包了',
    description:
      '你的艺人首次开直播带货，宣发通稿写着"万人期待"。结果开播 20 分钟，右上角在线人数死死卡在 47。有网友截图配文"47 位家人们，咱把灯关一盏省点电"发到了广场，一夜之间"47 家人"成了梗，连对家粉都进来考古。弹幕在刷"宝子这个真的会谢""47 我们是相亲相爱一家人"。品牌方的选品负责人已经改了三次今晚的坑位。',
    emoji: '📉',
    minDay: 3,
    choices: [
      {
        id: 'live47_embrace',
        text: '将计就计，做"47家人"限定福利',
        subtext: '把梗接住，宠这47个人',
        outcome: {
          narration:
            '艺人当场宣布"今晚只服务 47 位家人，人齐了咱不进人了"，抽奖口令改成"47 号选手"。结果猎奇的人越涌越多，在线破 10 万，"从 47 到 10 万的逆袭"上了热搜。最高赞评论：这经纪人把烂牌打成了王炸。',
          statChanges: { fanLoyalty: 5, commercialValue: 4, prRisk: -3 },
          specialEffect: 'viral',
        },
      },
      {
        id: 'live47_buy',
        text: '连夜买流量把人数刷上去',
        subtext: '花钱冲数据，面子要紧 (-6万)',
        requireMinMoney: 60000,
        outcome: {
          narration:
            '在线人数半小时从 47 飙到 8 万，漂亮。但眼尖的网友发现"8 万人在线、评论区还是那 47 个人在说话"，"僵尸粉直播间"被做成对比图。你花 6 万买了个更大的笑话。',
          statChanges: { money: -60000, prRisk: 6, fanLoyalty: -3 },
        },
      },
      {
        id: 'live47_blame',
        text: '甩锅平台"限流"',
        subtext: '"我们被平台压推流了"',
        outcome: {
          narration:
            '团队发文暗示"遭遇不公平限流"。平台官方账号当晚下场回了一句"数据后台随时开放核查，欢迎"——公关话术里最凶的一种。网友：这是被官方当众读秒了。',
          statChanges: { prRisk: 5, commercialValue: -3 },
        },
      },
    ],
  },

  // 2. 道歉声明撞模板
  {
    id: 'platform_apology_template',
    category: 'crisis',
    severity: 'medium',
    title: '道歉声明被扒出和别人用的是同一个模板',
    description:
      '你艺人昨天刚发的"诚恳道歉信"，今早被网友发现——从排版、字体到"辜负了大家的期待""接下来会用作品说话"的措辞，和上个月另一位塌房艺人的声明一模一样，连那个多打的空格都在同一个位置。原来你们请的是同一家公关公司。#塌房道歉模板# 冲上热搜，网友开始 P"道歉信生成器"，输入名字一键出小作文。',
    emoji: '📝',
    minDay: 5,
    choices: [
      {
        id: 'tpl_own',
        text: '认了，让艺人手写重发一封',
        subtext: '"这次一个字一个字自己写"',
        outcome: {
          narration:
            '艺人手写重发了一封满是涂改和错别字的信，配文"这次是我自己写的，丑但真"。反差之下路人缘回血。最高赞：比那封精修的顺眼多了，起码是个活人。',
          statChanges: { fanLoyalty: 4, prRisk: -3 },
        },
      },
      {
        id: 'tpl_blame_pr',
        text: '公开甩锅公关公司',
        subtext: '"合作方失误，已终止合作"',
        outcome: {
          narration:
            '你把锅甩给公关公司。对方转头放出聊天记录——"是你方要求\'越快越好、参考上次那个\'"。甲方乙方当众对线，"塌房还能塌出商战"成了新瓜。你一个打工的，替两边背了锅。',
          statChanges: { prRisk: 6, fanLoyalty: -2 },
          twist: {
            chance: 0.3,
            narration:
              '但是！网友觉得"连道歉都外包"这事太好笑，注意力全被模板梗带跑，原本那件黑料反而没人追究了。你稀里糊涂躲过一劫，属于是塌房塌出了喜剧效果。',
            statChanges: { prRisk: -5, commercialValue: 3 },
          },
        },
      },
      {
        id: 'tpl_delete',
        text: '删了声明，装没发过',
        subtext: '赌大家忘性大',
        outcome: {
          narration:
            '声明删了，但"XX 删除道歉声明"立刻成了新词条。网友：道歉都能反悔，建议下次别道了。这颗雷你亲手又埋了回去。',
          statChanges: { prRisk: 5, fanLoyalty: -3 },
        },
      },
    ],
  },

  // 3. 小红书种草笔记翻车
  {
    id: 'platform_xhs_ad',
    category: 'business',
    severity: 'low',
    title: '小红书"真心安利"被扒是广告',
    description:
      '艺人发了篇小红书，图文并茂夸某面霜"我素颜就靠它，回购了三罐"。结果被扒出——同一篇文案，三个不同品牌的面霜她都"回购了三罐"。评论区秒变大型打假现场："姐你这脸是化工厂吗""三罐面霜叠涂能防弹吧"。品牌方看着数据里飙升的负面互动，脸色发青。',
    emoji: '💄',
    minDay: 4,
    choices: [
      {
        id: 'xhs_honest',
        text: '改口："恰饭我大方承认"',
        subtext: '把恰饭说成人设',
        outcome: {
          narration:
            '艺人重发："是广告，我恰饭，但用着是真觉得还行。装什么素人呢对吧。"坦诚人设反而立住了，"内娱最诚实恰饭博主"话题小火。最高赞：比那些装"自来水"的强多了。',
          statChanges: { commercialValue: 3, fanLoyalty: 2, prRisk: -2 },
        },
      },
      {
        id: 'xhs_delete',
        text: '悄悄删掉重发',
        subtext: '当无事发生',
        outcome: {
          narration:
            '笔记删了重发，但截图早满天飞。"删得掉笔记删不掉黑历史"被顶上热评，考古党连夜整理了"她夸过的第 18 款面霜"合集。',
          statChanges: { prRisk: 4, commercialValue: -2 },
        },
      },
      {
        id: 'xhs_sue',
        text: '让品牌方出来澄清"确实回购"',
        subtext: '拉品牌下水背书',
        outcome: {
          narration:
            '品牌方硬着头皮发了"确认艺人为真实用户"。网友立刻扒出这品牌上个月刚成立。"新公司哪来的回购三罐"，品牌和艺人一起翻车，商务总监的电话被打爆。',
          statChanges: { prRisk: 5, commercialValue: -4, money: 30000 },
          twist: {
            chance: 0.25,
            narration:
              '但这波"翻车联动"意外把品牌搞出了圈——猎奇下单的人暴增，品牌方居然回来加了预算，说"骂声也是声量"。魔幻。',
            statChanges: { money: 50000, commercialValue: 3 },
          },
        },
      },
    ],
  },

  // 4. 打工人共情：经纪人自己上了热搜
  {
    id: 'platform_manager_trending',
    category: 'drama',
    severity: 'low',
    title: '你这个经纪人自己上热搜了',
    description:
      '活动后台，你被拍到蹲在角落一边啃面包一边改通稿，手机屏幕上还开着 6 个未接来电。这张图被路人发上网，配文"内娱最惨打工人"，#经纪人的一天# 意外爆了。网友心疼你比心疼你艺人还多，弹幕全是"这不比我惨？""建议给他先放个假"。你的艺人在群里发了个"哈哈哈哈老板你火了"。',
    emoji: '🍞',
    minDay: 4,
    choices: [
      {
        id: 'mgr_ride',
        text: '顺势营业，当一天"网红经纪人"',
        subtext: '把自己的热度导给艺人',
        outcome: {
          narration:
            '你发了条微博："面包会有的，热搜也会有的，麻烦大家多关注我家艺人的新歌🙏"。粉丝被你的敬业圈粉，顺手把艺人新歌听上了榜。最高赞：这经纪人比艺人还会营业，建议出道。',
          statChanges: { fanLoyalty: 4, commercialValue: 3 },
          mentalEffect: { mood: 5 },
        },
      },
      {
        id: 'mgr_lowkey',
        text: '低调删图，"别抢艺人热度"',
        subtext: '本分打工人',
        outcome: {
          narration:
            '你联系路人删了图，专注幕后。虽然没蹭到热度，但艺人私下给你转了个大红包，备注"辛苦了老板"。有时候被看见，比上热搜更暖。',
          statChanges: { fanLoyalty: 1 },
          mentalEffect: { trust: 6, mood: 3 },
        },
      },
    ],
  },

  // 5. AI 翻唱 / 数字人翻车
  {
    id: 'platform_ai_cover',
    category: 'crisis',
    severity: 'medium',
    title: 'AI 用你艺人的声音翻唱了整张专辑',
    description:
      '有人把你艺人的声线喂给了 AI，一夜之间"AI 版"翻唱了别家的热歌，播放量还比正主原唱高。粉丝分两派吵翻：一派"这是侵权必须告"，一派"不得不承认 AI 唱得确实好听"。#AI 偷了XX的声音# 挂热搜，评论区最扎心一条：正主练了十年，AI 学了十秒。',
    emoji: '🎙️',
    minDay: 5,
    choices: [
      {
        id: 'aicover_sue',
        text: '发律师函+平台下架',
        subtext: '维权，声音也是财产',
        outcome: {
          narration:
            '律师函发了，平台连夜下架。但 AI 翻唱早被存成本地传遍全网，"越禁越想听"。你第一次意识到，能被告的是账号，告不了的是那串已经扩散的音频。热评：这届版权，追不上复制粘贴的速度。',
          statChanges: { prRisk: 3, money: -20000 },
        },
      },
      {
        id: 'aicover_official',
        text: '干脆官方出一版正主真唱',
        subtext: '"AI能唱，本人唱得更好"正面刚',
        outcome: {
          narration:
            '你安排艺人 48 小时内录了一版真人翻唱直接空降。粉丝疯狂对比"AI vs 真人"，正主那句现场换气和尾音颤音成了"人类含金量"名场面。#XX 真人版吊打AI# 反超热搜。最高赞：这才叫杀鸡用牛刀。',
          statChanges: { commercialValue: 4, fanLoyalty: 5, prRisk: -3 },
          specialEffect: 'viral',
        },
      },
      {
        id: 'aicover_collab',
        text: '反向操作：官方"授权"AI联名',
        subtext: '把侵权变成商业合作',
        outcome: {
          narration:
            '你联系了做 AI 的团队，谈了个"官方授权 AI 声库"的合作，抽成分账。粉丝炸锅："格局打开了"和"晚节不保"各半。钱是进账了，但有老粉发小作文"我们爱的是人，不是一个可以被授权的声音"。',
          statChanges: { money: 120000, commercialValue: 5, fanLoyalty: -4, prRisk: 2 },
          twist: {
            chance: 0.25,
            narration:
              '但是！这个"艺人主动拥抱 AI"的操作被科技媒体当成了正面案例报道，路人缘意外回升——"至少人家没假装 AI 不存在"。',
            statChanges: { fanLoyalty: 4, commercialValue: 3 },
          },
        },
      },
    ],
  },

  // 6. CP battle 战报
  {
    id: 'platform_cp_war',
    category: 'drama',
    severity: 'medium',
    title: '两家 CP 粉在超话打成了"战报体"',
    description:
      '你艺人被粉丝和两个不同的人磕 CP，两家 CP 粉为了"谁才是正主 CP"battle 到发战报——"今日数据：我方超话签到 +2万，对方控评被举报 37 条"。战火烧到正主头上，#XX 到底和谁锁死# 挂了热搜。而你的艺人本人在群里问你："他们说的这些人我都不太熟…"',
    emoji: '💞',
    minDay: 6,
    choices: [
      {
        id: 'cp_neutral',
        text: '发"我很好，别吵了"营业',
        subtext: '正主下场降温',
        outcome: {
          narration:
            '艺人发了句"谢谢大家关心，但我单身且社恐，求放过"。CP 粉集体破防又好笑，"正主亲自拆CP"成了年度名场面。最高赞：磕到最后正主说他社恐，我们像个小丑。',
          statChanges: { fanLoyalty: 3, prRisk: -3 },
        },
      },
      {
        id: 'cp_feed',
        text: '暗中给热度更高的那家喂糖',
        subtext: '哪家数据好就顺哪家',
        outcome: {
          narration:
            '你悄悄让艺人多和数据更猛的那位同框互动。糖是甜了，但另一家 CP 粉觉得被背叛，脱粉小作文+撤代言应援，"塑料 CP 割粉丝韭菜"上了热搜。数据是把双刃剑，你割了一半粉丝的心。',
          statChanges: { commercialValue: 3, fanLoyalty: -5, prRisk: 4 },
        },
      },
      {
        id: 'cp_ignore',
        text: '不管，让子弹飞',
        subtext: '沉默是金',
        outcome: {
          narration:
            '你选择不回应。两家 battle 越演越烈，最后双双被平台限流"饭圈互撕"。吃瓜路人只记住了一句："也不知道正主招谁惹谁了。"你的艺人无辜躺枪，但热度确实涨了。',
          statChanges: { commercialValue: 2, prRisk: 3, fanLoyalty: -2 },
        },
      },
    ],
  },

  // 7. 数字人直播带货翻车
  {
    id: 'platform_digital_human',
    category: 'business',
    severity: 'medium',
    title: '花钱做的"数字人"直播带货翻车了',
    description:
      '为了让艺人"躺着也能赚钱"，你砸钱做了个 AI 数字人替身 24 小时直播带货。结果数字人半夜卡 bug，对着镜头机械重复"家人们买它、家人们买它"整整两小时，眼神空洞、嘴型对不上。#XX 数字人诈尸了# 冲上热搜，鬼畜区已经开始二创。',
    emoji: '🤖',
    minDay: 7,
    choices: [
      {
        id: 'dh_meme',
        text: '把 bug 做成官方梗',
        subtext: '"家人们买它"表情包安排上',
        outcome: {
          narration:
            '你让团队连夜出了"家人们买它"的官方表情包和周边。玩梗玩到飞起，那句机械重复成了年度流行语，带货数据不降反升。最高赞：这是我见过唯一一个把服务器崩溃变成 KPI 的团队。',
          statChanges: { commercialValue: 5, money: 80000, fanLoyalty: 3 },
          specialEffect: 'viral',
        },
      },
      {
        id: 'dh_shutdown',
        text: '紧急下线，回归真人直播',
        subtext: '认怂，AI 还是不靠谱',
        outcome: {
          narration:
            '数字人连夜下线，艺人本人回归直播道歉"以后都是真人陪大家"。粉丝反而松了口气——"终于不用对着假人喊哥哥了"。但那笔做数字人的钱是打水漂了。',
          statChanges: { money: -50000, fanLoyalty: 4, prRisk: -2 },
        },
      },
    ],
  },
];
