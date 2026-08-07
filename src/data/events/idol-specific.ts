import type { GameEvent } from '@/types/game';

// 甄帅（流量偶像/男）专属事件
export const idolSpecificEvents: GameEvent[] = [
  {
    id: 'idol_fan_fundraise_scandal',
    category: 'crisis',
    severity: 'high',
    title: '粉丝集资账目出问题了',
    description: '后援会被爆出集资款项去向不明，上百万粉丝的钱不知道花到哪里去了。虽然是后援会的锅，但“XX粉丝被割韭菜”的热搜已经上了，品牌方在观望你的态度。',
    emoji: '💸',
    forArtist: 'idol',
    minDay: 6,
    choices: [
      {
        id: 'intervene_fundraise',
        text: '官方介入整顿',
        subtext: '发声明要求后援会公开账目',
        outcome: {
          narration: '工作室发声明要求后援会48小时内公开所有账目，并宣布以后禁止以艺人名义集资。粉丝说“哥哥终于管了”，路人觉得这才是负责任的偶像。',
          statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'distance_fundraise',
        text: '撇清关系',
        subtext: '“后援会行为与艺人无关”',
        outcome: {
          narration: '声明一出，粉丝心寒了。“出事了就撇清，享受的时候怎么不说无关？”脱粉潮开始了。',
          statChanges: { fanLoyalty: -5, prRisk: 3 },
        },
      },
      {
        id: 'compensate_fans',
        text: '自掏腰包补偿粉丝',
        subtext: '把缺的钱补上 (-8万)',
        requireMinMoney: 56000,
        outcome: {
          narration: '你让艺人私下补上了后援会的亏空。消息传出去后，“教科书级别的偶像”成了新标签。品牌方对这种负责任的态度印象深刻。',
          statChanges: { money: -56000, fanLoyalty: 7, prRisk: -3, commercialValue: 3 },
        },
      },
    ],
  },
  {
    id: 'idol_trainee_challenger',
    category: 'drama',
    severity: 'medium',
    title: '新生代选秀冠军公开叫板',
    description: '今年最火的选秀节目冠军在采访中说“流量偶像的时代该翻篇了”，粉丝们认定这是在针对甄帅。两边粉丝已经在超话互撕三个小时了。',
    emoji: '⚡',
    forArtist: 'idol',
    minDay: 8,
    choices: [
      {
        id: 'mentor_stance',
        text: '前辈姿态',
        subtext: '公开鼓励后辈',
        outcome: {
          narration: '“每个时代都有属于它的偶像，希望你也能走得更远。”这段回应被赞“格局打开”，路人好感飙升。后辈反而显得小家子气了。',
          statChanges: { fanLoyalty: 3, commercialValue: 4, prRisk: -3 },
        },
      },
      {
        id: 'data_flex',
        text: '用数据说话',
        subtext: '晒出成绩单',
        outcome: {
          narration: '工作室“不经意间”放出了最新的代言数据和演唱会售票率。数据碾压级的差距让对方粉丝沉默了，但也显得有点“欺负新人”。',
          statChanges: { commercialValue: 3, prRisk: 3, fanLoyalty: 3 },
        },
      },
      {
        id: 'collab_rival',
        text: '约他一起上综艺',
        subtext: '化敌为友',
        outcome: {
          narration: '你主动联系对方经纪人，安排了一次综艺同台。节目上两人互相调侃的化学反应炸了，“世纪大和解”上了热搜。两边粉丝都说“磕到了”。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: -3 },
        },
      },
    ],
  },
  {
    id: 'idol_nightclub',
    category: 'crisis',
    severity: 'high',
    title: '深夜出入夜店被拍',
    description: '凌晨三点，你的艺人被拍到从高档夜店出来，还搂着一个不认识的人。照片虽然模糊但身份无疑。“偶像人设崩塌”的讨论已经开始了。',
    emoji: '🌙',
    forArtist: 'idol',
    minDay: 10,
    choices: [
      {
        id: 'friend_story',
        text: '解释是朋友聚会',
        subtext: '“给朋友过生日而已”',
        outcome: {
          narration: '“给大学同学庆生”的解释有一半人信了。但“凌晨三点的夜店生日会”这个说法确实有点勉强...评论区充满了质疑。',
          statChanges: { prRisk: 4, fanLoyalty: -3 },
        },
      },
      {
        id: 'own_lifestyle',
        text: '坦然面对',
        subtext: '“我也有自己的生活”',
        outcome: {
          narration: '甄帅发了一条微博：“工作之余也需要放松，谢谢大家关心。”路人觉得正常，但核心粉丝接受不了“偶像去夜店”的事实。',
          statChanges: { prRisk: 3, fanLoyalty: -4, commercialValue: 3 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 70 },
              narration: '因为粉丝忠诚度极高，大部分人选择了理解。“他也是普通人”的论调占据主流，危机很快就过去了。',
              statChanges: { prRisk: 3, fanLoyalty: -3, commercialValue: 3 },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'idol_dating_ban',
    category: 'business',
    severity: 'medium',
    title: '代言方要求签恋爱禁令',
    description: '一个顶级快消品牌想签甄帅，但合同里有一条“代言期间不得公开恋爱关系”的条款。代言费很可观，但这条禁令意味着未来两年都得“假装单身”。',
    emoji: '💍',
    forArtist: 'idol',
    minDay: 8,
    choices: [
      {
        id: 'accept_ban',
        text: '签！赚钱要紧',
        subtext: '接受恋爱禁令条款',
        outcome: {
          narration: '合同签了，代言费到手。但你知道这等于在甄帅脖子上套了一个随时会收紧的绳圈，万一恋情曝光，违约金是代言费的三倍。',
          statChanges: { money: 180000, commercialValue: 4, prRisk: 3 },
        },
      },
      {
        id: 'negotiate_ban',
        text: '协商去掉这条',
        subtext: '争取合理条款',
        outcome: {
          narration: '品牌方坚持不让步，谈判陷入僵局。最终你拿到了一个折中方案：代言费降20%但没有恋爱禁令。也算不亏。',
          statChanges: { money: 130000, commercialValue: 3 },
        },
      },
    ],
  },

  // ===== 招牌黑料：带嫂出道十年长跑 =====
  {
    id: 'idol_gf_trash',
    category: 'crisis',
    severity: 'high',
    title: '狗仔蹲到“女友”下楼倒垃圾',
    description: '凌晨两点，一家狗仔蹲在甄帅小区门口，拍到一个女生穿着他的T恤下楼倒垃圾，表情自然得像在自家。照片还没发，对方联系工作室：“这组图一百万买断，不买明天就发热搜。”',
    emoji: '🗑️',
    forArtist: 'idol',
    minDay: 5,
    choices: [
      {
        id: 'buy_out_photos',
        text: '花钱买断',
        subtext: '付一百万拿底片 (-100万)',
        requireMinMoney: 1000000,
        outcome: {
          narration: '钱转过去，底片和相机卡到手。狗仔转身就发了另一组“甄帅一人吃火锅”的图洗白你。危机暂时按住了，但你知道这不是最后一次，只要她还在他家，就永远有下一次。',
          statChanges: { money: -1000000, prRisk: -3, fanLoyalty: 3, commercialValue: 3 },
          unlockTag: 'paid_paparazzi',
        },
      },
      {
        id: 'admit_relationship',
        text: '公开认爱',
        subtext: '抢在热搜前自己发',
        outcome: {
          narration: '甄帅发了一条微博：“她是我十年的女朋友，我们打算结婚了。”瞬间登顶热搜第一。核心粉丝炸了，“我哥哥骗了我十年”，但路人盘和 CP 粉路人盘齐刷“好帅”。',
          statChanges: { fanLoyalty: -18, prRisk: 6, commercialValue: 4 },
          twist: {
            chance: 0.35,
            narration: '但是！三家快消品牌连夜发函，“鉴于艺人近期恋情公开，拟暂停合作”。恋爱脑的偶像不值钱，这是行业铁律。',
            statChanges: { money: -300000, commercialValue: -5 },
          },
        },
      },
      {
        id: 'send_her_abroad',
        text: '安排女友短期出国',
        subtext: '否认并让她消失一阵 (-15万)',
        requireMinMoney: 150000,
        outcome: {
          narration: '你连夜安排女友飞去米兰学摄影半年，工作室放出“同住的是他表妹”的说辞。狗仔照片被律师函按住，热度压了下去。女友走之前和甄帅吵了一架：“我是你藏起来的秘密吗？”',
          statChanges: { money: -150000, prRisk: 4, fanLoyalty: -3, commercialValue: 3 },
          unlockTag: 'gf_in_exile',
        },
      },
    ],
  },
  {
    id: 'idol_old_photo_dug',
    category: 'drama',
    severity: 'medium',
    title: '粉丝挖出十年前校园合影',
    description: '一位自称是甄帅高中校友的网友发了一张合影：“高二艺术节，中间这个男生是甄帅，旁边那个女生后来是他女朋友，听说一直在一起。”照片糊但人脸清晰，#甄帅校园女友 挂了小时榜。',
    emoji: '📷',
    forArtist: 'idol',
    minDay: 8,
    choices: [
      {
        id: 'deny_old_photo',
        text: '否认是同一人',
        subtext: '“那个女生是班长不是女友”',
        outcome: {
          narration: '工作室发了一条“网传合影为同班同学，请勿过度解读”的声明。有人信有人不信，校友原帖被按删了，但截图已经到处传。粉丝群里开始出现“感觉哥哥团队在骗我们”的声音。',
          statChanges: { prRisk: 5, fanLoyalty: -6 },
        },
      },
      {
        id: 'laugh_it_off',
        text: '自嘲带过',
        subtext: '让甄帅转发配文“高二的我好瘦”',
        outcome: {
          narration: '甄帅转发那张合影：“高二的我瘦得像根豆芽。”粉丝被带偏了注意力，开始考古他的减肥历程。校友原帖淹没在“哥哥以前也好可爱”的评论里。这波公关很滑。',
          statChanges: { fanLoyalty: 3, prRisk: -3 },
          twist: {
            chance: 0.25,
            narration: '但是！原发帖人又追加了一条：“合影里的女生和前天倒垃圾视频里的人是同一个。”这下躲不过去了。',
            statChanges: { prRisk: 5, fanLoyalty: -5 },
            unlockTag: 'photo_crosslinked',
          },
        },
      },
      {
        id: 'legal_takedown',
        text: '发律师函下架',
        subtext: '全网发函要求删图',
        outcome: {
          narration: '律师函满天飞，帖子和截图被清了一大半。但律师函反而变成“此地无银”，“为什么一个合影都要告？肯定有问题”成了新的热搜。',
          statChanges: { money: -30000, prRisk: 7, fanLoyalty: -3 },
        },
      },
    ],
  },
  {
    id: 'idol_ring_valentine',
    category: 'crisis',
    severity: 'critical',
    title: '情人节“女友”晒了戒指的半张图',
    description: '情人节当晚，一个私密小号发了张九宫格，第五张隐约能看到戴着戒指的左手和甄帅同款的手表。小号被粉丝扒了三小时，指向同一个人：那个“倒垃圾”的女生。#甄帅结婚 炸上热搜第一。',
    emoji: '💍',
    forArtist: 'idol',
    minDay: 11,
    choices: [
      {
        id: 'announce_marriage',
        text: '直接官宣结婚',
        subtext: '在热搜顶峰坦白',
        outcome: {
          narration: '甄帅和女友并肩的婚纱照发了出来：“这是我爱了十年的人。”核心粉丝大规模脱粉，热搜从#甄帅结婚 变成#甄帅脱粉潮。但路人盘说“被这份十年打动了”，商务品牌开始两极分化，家庭向品牌找上门，偶像向品牌集体退避。',
          statChanges: { fanLoyalty: -25, prRisk: 8, commercialValue: -5 },
          unlockTag: 'publicly_married',
        },
      },
      {
        id: 'fake_prop',
        text: '包装成“戏外道具”',
        subtext: '说是新剧求婚戏的道具戒 (-10万)',
        requireMinMoney: 100000,
        outcome: {
          narration: '工作室放出“新剧《求婚之夏》的定制戒，小号是剧组美术组工作人员的”，连带剧方一起给你打配合。热搜撤了，但圈内都知道这是硬圆，品牌方在观望。',
          statChanges: { money: -100000, prRisk: 5, fanLoyalty: -3 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 65 },
              narration: '因为粉丝忠诚度够高，大部分人愿意相信这个说法。“哥哥怎么可能骗我们”成了主流，危机消化得比预期顺利。',
              statChanges: { money: -100000, prRisk: 3, fanLoyalty: -3 },
            },
          ],
        },
      },
      {
        id: 'accuse_antifan',
        text: '反咬“黑粉造谣”',
        subtext: '举报小号+发律师函',
        outcome: {
          narration: '你让战斗粉带节奏攻击小号，说是“黑粉买号自导自演”。真粉真的信了，一度把小号刷下线，直到对方直接放出和甄帅的十年合照时间线。一夜之间，脱粉潮、举报、黑稿全来了。',
          statChanges: { fanLoyalty: -20, prRisk: 12, commercialValue: -5 },
          unlockTag: 'antifan_backfire',
        },
      },
    ],
  },
];
