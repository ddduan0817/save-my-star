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
        outcome: {
          narration: '工作室紧急发声明否认恋情。但网友扒出更多细节，"此地无银三百两"的评论占满了评论区。',
          statChanges: { prRisk: 15, fanLoyalty: -5 },
          unlockTag: 'denied_relationship',
          twist: {
            chance: 0.35,
            narration: '更多约会照曝光了！这次是正脸高清图，否认都否认不了了。"打脸来得太快"冲上热搜，品牌方开始考虑解约。',
            statChanges: { prRisk: 15, commercialValue: -10, fanLoyalty: -10 },
          },
        },
      },
      {
        id: 'admit',
        text: '大方官宣',
        subtext: '直接公开恋情',
        outcome: {
          narration: '艺人亲自发微博："是的，我恋爱了，谢谢大家关心。"一部分粉丝送祝福，但脱粉的也不少。不过路人好感度倒是上来了。',
          statChanges: { prRisk: -5, fanLoyalty: -15, commercialValue: -10 },
          unlockTag: 'public_relationship',
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 70 },
              narration: '艺人官宣恋情。因为粉丝忠诚度极高，脱粉的人意外地少。"我家哥哥/姐姐幸福就好"刷屏了，路人也被这份成熟的粉丝关系感动。',
              statChanges: { prRisk: -10, fanLoyalty: -5, commercialValue: 3 },
              unlockTag: 'public_relationship',
            },
            {
              condition: { maxFanLoyalty: 30 },
              narration: '官宣恋情后，本来就不多的粉丝跑了一大半。"连粉丝都留不住还谈恋爱"的讽刺满天飞。',
              statChanges: { prRisk: 5, fanLoyalty: -20, commercialValue: -15 },
              unlockTag: 'public_relationship',
            },
          ],
        },
      },
      {
        id: 'suppress',
        text: '花钱压热搜',
        subtext: '联系平台撤热搜 (-8万)',
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
        outcome: {
          narration: '艺人手写了一封道歉信，承认年少无知。大部分路人接受了，但"道歉有用要警察干嘛"的声音也不小。',
          statChanges: { prRisk: 10, fanLoyalty: -5, commercialValue: -10 },
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 20 },
              narration: '由于之前一直口碑很好，道歉信发出后路人基本都接受了。"谁年轻时没说过蠢话"成了主流声音。危机平稳化解。',
              statChanges: { prRisk: 5, fanLoyalty: 3 },
            },
          ],
        },
      },
      {
        id: 'claim_hacked',
        text: '声称被盗号',
        subtext: '说不是本人发的',
        outcome: {
          narration: '"盗号"的说法没人信，反而被群嘲"娱乐圈盗号宇宙"。事情进一步发酵，你现在是互联网笑话了。',
          statChanges: { prRisk: 25, fanLoyalty: -10 },
        },
      },
      {
        id: 'stay_silent',
        text: '沉默以对',
        subtext: '冷处理，等热度过去',
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
        outcome: {
          narration: '发了一条长微博解释当天音响出了问题，并宣布免费重办一场。大部分粉丝买账了，但"花钱买假唱"的梗已经传开了。',
          statChanges: { prRisk: 10, money: -100000, fanLoyalty: 5 },
        },
      },
      {
        id: 'sue',
        text: '法律手段',
        subtext: '发律师函警告造谣者',
        outcome: {
          narration: '律师函一发，网友更来劲了："怎么，被说中了急了？"舆论进一步发酵。',
          statChanges: { prRisk: 20, money: -50000 },
        },
      },
      {
        id: 'live_proof',
        text: '直播飙高音',
        subtext: '开直播唱一段证明实力',
        outcome: {
          narration: '艺人开了一场直播清唱，高音稳得一批。"打脸来得太快"刷屏弹幕，风评逆转！',
          statChanges: { prRisk: -10, fanLoyalty: 10, commercialValue: 5 },
          twist: {
            chance: 0.25,
            narration: '直播清唱炸了！一个音乐制作人在线下单："就凭这个live水平，我要给TA出专辑！"一份价值百万的音乐合约正在路上。',
            statChanges: { commercialValue: 10, money: 100000, fanLoyalty: 5 },
          },
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
        outcome: {
          narration: '主动找税务部门自查补缴，态度诚恳。虽然花了大钱，但这件事被控制住了。官媒评价"知错能改"。',
          statChanges: { money: -200000, prRisk: 5, commercialValue: -5 },
        },
      },
      {
        id: 'lawyer',
        text: '请顶级律师',
        subtext: '法律团队全面介入 (-10万)',
        outcome: {
          narration: '律师团队介入后发现确实有问题，但及时补救了。不过"请得起顶级律师说明赚得够多"的讨论又起来了。',
          statChanges: { money: -100000, prRisk: 10 },
        },
      },
      {
        id: 'deny_tax',
        text: '否认一切',
        subtext: '声明从未逃税',
        outcome: {
          narration: '否认之后，举报人放出了更多证据。这下连官媒都点名了。你正在走一条非常危险的路。',
          statChanges: { prRisk: 30, commercialValue: -15 },
          twist: {
            chance: 0.4,
            narration: '税务部门正式介入调查。三个品牌连夜解约，工作全面停摆。这可能是职业生涯最黑暗的时刻。',
            statChanges: { prRisk: 20, money: -150000, commercialValue: -20 },
          },
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
        outcome: {
          narration: '艺人发长文谴责暴力行为，呼吁大家理性追星。官媒点赞，路人好感上升，但一部分激进粉丝觉得"偶像不向着我们"。',
          statChanges: { prRisk: -5, fanLoyalty: -8, commercialValue: 5 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 80 },
              narration: '艺人公开谴责暴力。由于粉丝忠诚度极高，连激进粉都说"偶像说的对"。这种正面引导让官媒专门发文表扬，你的艺人成了"饭圈正能量"代表。',
              statChanges: { prRisk: -15, fanLoyalty: 5, commercialValue: 10 },
            },
          ],
        },
      },
      {
        id: 'blame_other',
        text: '暗示是对方先动手',
        subtext: '让粉丝觉得被支持',
        outcome: {
          narration: '粉丝们觉得被偶像撑腰了，战斗力更强了。但对方粉丝和路人都在骂你拉偏架。',
          statChanges: { prRisk: 15, fanLoyalty: 10 },
        },
      },
      {
        id: 'ignore_fight',
        text: '装作没看到',
        subtext: '冷处理',
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
        outcome: {
          narration: '路人觉得说得对，粉丝觉得不够在乎他们的感受。一场"偶像到底该不该有私生活"的大讨论开始了。',
          statChanges: { prRisk: 8, fanLoyalty: -10, commercialValue: 3 },
        },
      },
    ],
  },
  {
    id: 'crisis_drunk_video',
    category: 'crisis',
    severity: 'high',
    title: '醉酒视频流出！',
    description: '不知道谁拍的，你的艺人在私人聚会上喝多了的视频流出来了。视频里说了一些不太得体的话，还模仿了几个同行，虽然很搞笑但...这要是被当事人看到就不好了。',
    emoji: '🍺',
    minDay: 10,
    choices: [
      {
        id: 'humor_drunk',
        text: '自嘲化解',
        subtext: '"喝多了说的话不算数嘛"',
        outcome: {
          narration: '艺人发了条自嘲微博，配了个喝水的照片："从今天起只喝白开水。"网友觉得真实又可爱，风评反而变好了。',
          statChanges: { fanLoyalty: 5, prRisk: 5 },
        },
      },
      {
        id: 'deny_drunk',
        text: '声称视频被恶意剪辑',
        subtext: '否认真实性',
        outcome: {
          narration: '原视频的完整版被放了出来...更尴尬了。"越描越黑"成了热搜联想词。',
          statChanges: { prRisk: 18, fanLoyalty: -8 },
        },
      },
      {
        id: 'apologize_drunk',
        text: '向被模仿的同行道歉',
        subtext: '主动联系对方化解',
        outcome: {
          narration: '被模仿的同行大度回复"模仿得还挺像"，两人互动上了热搜正面位。危机变成了营销。',
          statChanges: { prRisk: -3, commercialValue: 5, fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'crisis_sasaeng',
    category: 'crisis',
    severity: 'medium',
    title: '私生饭闯入住所！',
    description: '一个疯狂粉丝想方设法闯入了你艺人的公寓楼层，虽然被保安拦住了，但你的艺人被吓得不轻。更糟的是，这件事如果处理不好会被扣上"不爱粉丝"的帽子。',
    emoji: '😱',
    minDay: 8,
    choices: [
      {
        id: 'report_police',
        text: '报警处理',
        subtext: '走法律途径',
        outcome: {
          narration: '报警后艺人发了长文呼吁理性追星。大部分粉丝支持，但私生饭的朋友们开始在网上造谣"XX耍大牌报警抓粉丝"。',
          statChanges: { prRisk: 8, fanLoyalty: -3, money: -10000 },
        },
      },
      {
        id: 'gentle_reject',
        text: '温柔劝退',
        subtext: '私下沟通，不闹大',
        outcome: {
          narration: '你安排助理私下和对方谈了谈，对方流着泪说"我只是太喜欢了"。事情暂时平息了，但你知道这不是最后一次。',
          statChanges: { fanLoyalty: 3, prRisk: 3 },
        },
      },
    ],
  },
];
