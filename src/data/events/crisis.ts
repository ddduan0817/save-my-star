import type { GameEvent } from '@/types/game';

export const crisisEvents: GameEvent[] = [
  {
    id: 'crisis_leaked_photo',
    category: 'crisis',
    severity: 'high',
    title: '恋爱石锤！疑似约会照曝光',
    description: '狗仔拍到你的艺人和某神秘人深夜牵手逛街，照片已经在微博疯传，热搜正在往上爬。粉丝群已经炸了，品牌方开始打电话来问情况...',
    emoji: '📸',
    choices: [
      {
        id: 'deny',
        text: '坚决否认',
        subtext: '声明只是普通朋友',
        emoji: '🙅',
        outcome: {
          narration: '工作室紧急发声明否认恋情。但网友扒出更多细节，"此地无银三百两"的评论占满了评论区。',
          statChanges: { prRisk: 15, fanLoyalty: -5 },
          unlockTag: 'denied_relationship',
        },
      },
      {
        id: 'admit',
        text: '大方官宣',
        subtext: '直接公开恋情',
        emoji: '💕',
        outcome: {
          narration: '艺人亲自发微博："是的，我恋爱了，谢谢大家关心。"一部分粉丝送祝福，但脱粉的也不少。不过路人好感度倒是上来了。',
          statChanges: { prRisk: -5, fanLoyalty: -15, commercialValue: -10 },
          unlockTag: 'public_relationship',
        },
      },
      {
        id: 'suppress',
        text: '花钱压热搜',
        subtext: '联系平台撤热搜 (-8万)',
        emoji: '💰',
        requireMinMoney: 80000,
        outcome: {
          narration: '热搜被撤了，但"404"反而引发了更大的好奇心。大家都在问：到底是谁这么有能量？',
          statChanges: { prRisk: 5, money: -80000 },
        },
      },
      {
        id: 'misdirect',
        text: '转移注意力',
        subtext: '放出新歌/新戏的物料',
        emoji: '🎵',
        outcome: {
          narration: '紧急发布了新歌MV预告，粉丝们的注意力被成功转移了一部分。但八卦博主可不会这么轻易放过...',
          statChanges: { prRisk: 8, commercialValue: 5 },
        },
      },
    ],
  },
  {
    id: 'crisis_old_posts',
    category: 'crisis',
    severity: 'critical',
    title: '黑历史被扒！早年不当言论曝光',
    description: '有人翻出了你艺人五年前的社交媒体，里面有几条充满争议的言论。截图正在被大规模转发，"原来你是这样的XXX"已经上了热搜。',
    emoji: '💣',
    minDay: 5,
    choices: [
      {
        id: 'sincere_apology',
        text: '诚恳道歉',
        subtext: '承认过去不成熟',
        emoji: '🙏',
        outcome: {
          narration: '艺人手写了一封道歉信，承认年少无知。大部分路人接受了，但"道歉有用要警察干嘛"的声音也不小。',
          statChanges: { prRisk: 10, fanLoyalty: -5, commercialValue: -10 },
        },
      },
      {
        id: 'claim_hacked',
        text: '声称被盗号',
        subtext: '说不是本人发的',
        emoji: '🤖',
        outcome: {
          narration: '"盗号"的说法没人信，反而被群嘲"娱乐圈盗号宇宙"。事情进一步发酵，你现在是互联网笑话了。',
          statChanges: { prRisk: 25, fanLoyalty: -10 },
        },
      },
      {
        id: 'stay_silent',
        text: '沉默以对',
        subtext: '冷处理，等热度过去',
        emoji: '🤐',
        outcome: {
          narration: '沉默被解读为"心虚"。但好消息是，三天后新的瓜出来了，注意力转移了。坏消息是，这颗雷还埋着。',
          statChanges: { prRisk: 15 },
          unlockTag: 'silent_on_scandal',
        },
      },
    ],
  },
  {
    id: 'crisis_lip_sync',
    category: 'crisis',
    severity: 'high',
    title: '演唱会假唱实锤？',
    description: '一位现场观众拍到你的艺人在演唱会上疑似对口型。视频被专业音频博主分析后，"假唱"的结论冲上了热搜第一。',
    emoji: '🎤',
    minDay: 8,
    choices: [
      {
        id: 'admit_tech',
        text: '承认技术问题',
        subtext: '解释是音响故障导致的',
        emoji: '🔧',
        outcome: {
          narration: '发了一条长微博解释当天音响出了问题，并宣布免费重办一场。大部分粉丝买账了，但"花钱买假唱"的梗已经传开了。',
          statChanges: { prRisk: 10, money: -100000, fanLoyalty: 5 },
        },
      },
      {
        id: 'sue',
        text: '法律手段',
        subtext: '发律师函警告造谣者',
        emoji: '⚖️',
        outcome: {
          narration: '律师函一发，网友更来劲了："怎么，被说中了急了？"舆论进一步发酵。',
          statChanges: { prRisk: 20, money: -50000 },
        },
      },
      {
        id: 'live_proof',
        text: '直播飙高音',
        subtext: '开直播唱一段证明实力',
        emoji: '🎶',
        outcome: {
          narration: '艺人开了一场直播清唱，高音稳得一批。"打脸来得太快"刷屏弹幕，风评逆转！',
          statChanges: { prRisk: -10, fanLoyalty: 10, commercialValue: 5 },
        },
      },
    ],
  },
  {
    id: 'crisis_tax',
    category: 'crisis',
    severity: 'critical',
    title: '税务问题被曝光！',
    description: '有匿名举报称你的艺人存在阴阳合同、税务问题。虽然还没有官方调查，但消息已经在圈内传开了。这可是能毁掉整个职业生涯的大事。',
    emoji: '📋',
    minDay: 15,
    choices: [
      {
        id: 'cooperate',
        text: '主动配合调查',
        subtext: '自查补缴 (-20万)',
        emoji: '✅',
        outcome: {
          narration: '主动找税务部门自查补缴，态度诚恳。虽然花了大钱，但这件事被控制住了。官媒评价"知错能改"。',
          statChanges: { money: -200000, prRisk: 5, commercialValue: -5 },
        },
      },
      {
        id: 'lawyer',
        text: '请顶级律师',
        subtext: '法律团队全面介入 (-10万)',
        emoji: '👔',
        outcome: {
          narration: '律师团队介入后发现确实有问题，但及时补救了。不过"请得起顶级律师说明赚得够多"的讨论又起来了。',
          statChanges: { money: -100000, prRisk: 10 },
        },
      },
      {
        id: 'deny_tax',
        text: '否认一切',
        subtext: '声明从未逃税',
        emoji: '❌',
        outcome: {
          narration: '否认之后，举报人放出了更多证据。这下连官媒都点名了。你正在走一条非常危险的路。',
          statChanges: { prRisk: 30, commercialValue: -15 },
        },
      },
    ],
  },
  {
    id: 'crisis_fan_fight',
    category: 'crisis',
    severity: 'medium',
    title: '粉丝线下冲突上新闻了',
    description: '你的粉丝和另一位艺人的粉丝在机场发生肢体冲突，视频被路人拍下传到网上。"饭圈乱象"又上了热搜，你的艺人被要求表态。',
    emoji: '👊',
    choices: [
      {
        id: 'condemn',
        text: '公开谴责暴力',
        subtext: '呼吁理性追星',
        emoji: '🕊️',
        outcome: {
          narration: '艺人发长文谴责暴力行为，呼吁大家理性追星。官媒点赞，路人好感上升，但一部分激进粉丝觉得"偶像不向着我们"。',
          statChanges: { prRisk: -5, fanLoyalty: -8, commercialValue: 5 },
        },
      },
      {
        id: 'blame_other',
        text: '暗示是对方先动手',
        subtext: '让粉丝觉得被支持',
        emoji: '😤',
        outcome: {
          narration: '粉丝们觉得被偶像撑腰了，战斗力更强了。但对方粉丝和路人都在骂你拉偏架。',
          statChanges: { prRisk: 15, fanLoyalty: 10 },
        },
      },
      {
        id: 'ignore_fight',
        text: '装作没看到',
        subtext: '冷处理',
        emoji: '🙈',
        outcome: {
          narration: '沉默被解读为默许。官媒批评"艺人有责任引导粉丝"，热度持续了三天才消退。',
          statChanges: { prRisk: 10 },
        },
      },
    ],
  },
  {
    id: 'crisis_caught_smoking',
    category: 'crisis',
    severity: 'medium',
    title: '路人拍到当众吸烟！',
    description: '你的艺人在餐厅外面抽烟被路人拍到了。对于偶像人设来说，这不算大事但也不算小事。评论两极分化："大人抽烟怎么了"和"偶像失格"吵成一团。',
    emoji: '🚬',
    choices: [
      {
        id: 'apologize_smoke',
        text: '道歉并承诺戒烟',
        subtext: '维护偶像人设',
        emoji: '🙏',
        outcome: {
          narration: '道歉声明获得大部分粉丝谅解。但"承诺戒烟"这件事，以后万一又被拍到可就不好交代了...',
          statChanges: { prRisk: 5, fanLoyalty: -3 },
          unlockTag: 'promised_quit_smoking',
        },
      },
      {
        id: 'personal_choice',
        text: '"个人生活不需要交代"',
        subtext: '强硬回应',
        emoji: '😎',
        outcome: {
          narration: '路人觉得说得对，粉丝觉得不够在乎他们的感受。一场"偶像到底该不该有私生活"的大讨论开始了。',
          statChanges: { prRisk: 8, fanLoyalty: -10, commercialValue: 3 },
        },
      },
    ],
  },
];
