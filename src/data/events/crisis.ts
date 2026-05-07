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
          statChanges: { prRisk: 5, fanLoyalty: -3 },
          unlockTag: 'denied_relationship',
          twist: {
            chance: 0.35,
            narration: '更多约会照曝光了！这次是正脸高清图，否认都否认不了了。"打脸来得太快"冲上热搜，品牌方开始考虑解约。',
            statChanges: { prRisk: 5, commercialValue: -4, fanLoyalty: -4 },
          },
        },
      },
      {
        id: 'admit',
        text: '大方官宣',
        subtext: '直接公开恋情',
        outcome: {
          narration: '艺人亲自发微博："是的，我恋爱了，谢谢大家关心。"一部分粉丝送祝福，但脱粉的也不少。不过路人好感度倒是上来了。',
          statChanges: { prRisk: -3, fanLoyalty: -5, commercialValue: -4 },
          unlockTag: 'public_relationship',
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 70 },
              narration: '艺人官宣恋情。因为粉丝忠诚度极高，脱粉的人意外地少。"我家哥哥/姐姐幸福就好"刷屏了，路人也被这份成熟的粉丝关系感动。',
              statChanges: { prRisk: -4, fanLoyalty: -3, commercialValue: 3 },
              unlockTag: 'public_relationship',
            },
            {
              condition: { maxFanLoyalty: 30 },
              narration: '官宣恋情后，本来就不多的粉丝跑了一大半。"连粉丝都留不住还谈恋爱"的讽刺满天飞。',
              statChanges: { prRisk: 3, fanLoyalty: -7, commercialValue: -5 },
              unlockTag: 'public_relationship',
            },
          ],
        },
      },
      {
        id: 'suppress',
        text: '花钱压热搜',
        subtext: '联系平台撤热搜 (-8万)',
        requireMinMoney: 56000,
        outcome: {
          narration: '热搜被撤了，但"404"反而引发了更大的好奇心。大家都在问：到底是谁这么有能量？',
          statChanges: { prRisk: 3, money: -56000 },
        },
      },
      {
        id: 'misdirect',
        text: '转移注意力',
        subtext: '放出新歌/新戏的物料',
        outcome: {
          narration: '紧急发布了新歌MV预告，粉丝们的注意力被成功转移了一部分。但八卦博主可不会这么轻易放过...',
          statChanges: { prRisk: 3, commercialValue: 3 },
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
          statChanges: { prRisk: 4, fanLoyalty: -3, commercialValue: -4 },
          conditionalOutcomes: [
            {
              condition: { maxPrRisk: 20 },
              narration: '由于之前一直口碑很好，道歉信发出后路人基本都接受了。"谁年轻时没说过蠢话"成了主流声音。危机平稳化解。',
              statChanges: { prRisk: 3, fanLoyalty: 3 },
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
          statChanges: { prRisk: 9, fanLoyalty: -4 },
        },
      },
      {
        id: 'stay_silent',
        text: '沉默以对',
        subtext: '冷处理，等热度过去',
        outcome: {
          narration: '沉默被解读为"心虚"。但好消息是，三天后新的瓜出来了，注意力转移了。坏消息是，这颗雷还埋着。',
          statChanges: { prRisk: 5 },
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
          statChanges: { prRisk: 4, money: -70000, fanLoyalty: 3 },
        },
      },
      {
        id: 'sue',
        text: '法律手段',
        subtext: '发律师函警告造谣者',
        outcome: {
          narration: '律师函一发，网友更来劲了："怎么，被说中了急了？"舆论进一步发酵。',
          statChanges: { prRisk: 7, money: -40000 },
        },
      },
      {
        id: 'live_proof',
        text: '直播飙高音',
        subtext: '开直播唱一段证明实力',
        outcome: {
          narration: '艺人开了一场直播清唱，高音稳得一批。"打脸来得太快"刷屏弹幕，风评逆转！',
          statChanges: { prRisk: -4, fanLoyalty: 4, commercialValue: 3 },
          twist: {
            chance: 0.25,
            narration: '直播清唱炸了！一个音乐制作人在线下单："就凭这个live水平，我要给TA出专辑！"一份价值百万的音乐合约正在路上。',
            statChanges: { commercialValue: 4, money: 70000, fanLoyalty: 3 },
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
    description: '某八卦号凌晨发了个长图——你艺人的"阴阳合同"片段、对公账户截图、某个工作室空壳公司注册地。# 是不是又一个 # 已经挂上热搜第 6。法务那边的电话还没打过去，财务总监先慌了："这截图……来源不像营销号。"你盯着屏幕心算了一下：去年那部戏的尾款，确实没走对路子。',
    emoji: '📋',
    minDay: 15,
    choices: [
      {
        id: 'cooperate',
        text: '主动自查 + 工作室小作文',
        subtext: '凌晨发"已配合补缴"长文 (-14万)',
        outcome: {
          narration: '工作室连夜发"已主动配合相关部门完成自查与补缴，恳请大众监督"小作文，配截图的纳税完税证明。官媒一条短评点赞"知错能改"，#XX 主动补税# 反向冲了热搜正面位。粉丝超话连夜发"理智追星"教程。这一关算是过了，钱包很疼。',
          statChanges: { money: -140000, prRisk: 3, commercialValue: -3 },
        },
      },
      {
        id: 'sister_speak',
        text: '让圈内大佬下场带节奏',
        subtext: '求 X 姐转一条"我了解 TA"',
        outcome: {
          narration: '你打了个三年没打的电话。两小时后，某德高望重的前辈发了条状态："这孩子我带过半年，账目认真到给助理塞发票。" 转发瞬间过万。话题从"逃税"被掰回"被恶意举报"，营销号开始反水。但你欠下的人情，以后是要还的。',
          statChanges: { money: -40000, prRisk: -2, fanLoyalty: 3 },
          unlockTag: 'owe_industry_favor',
        },
      },
      {
        id: 'lawyer',
        text: '律师函 + 报警立案',
        subtext: '对造谣源头硬刚',
        outcome: {
          narration: '律师函下午就挂了官博，配文"已向公安机关报案"。营销号删稿了一半，但留下来的那半把法务函截图二创成"急了急了"的表情包。# XX 律师函警告# 反而给瓜带了一波热度。',
          statChanges: { money: -70000, prRisk: 4 },
        },
      },
      {
        id: 'deny_tax',
        text: '工作室硬刚否认',
        subtext: '"从未存在阴阳合同"',
        outcome: {
          narration: '你让工作室发了"严正声明"，措辞强硬到接近威胁。两小时后举报人放出第二批材料——这次有银行流水。"打脸来得太快"冲到第 1 位。三个品牌方连夜走"不可抗力"解约流程。',
          statChanges: { prRisk: 11, commercialValue: -5 },
          twist: {
            chance: 0.4,
            narration: '官方账号点名通报。工作室门口被记者堵了一整天，你艺人的微博头像都被换成黑色。这可能是职业生涯最黑暗的时刻。',
            statChanges: { prRisk: 7, money: -110000, commercialValue: -7 },
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
    description: '机场接机场面失控——你家站姐和对家的"反黑组"在行李转盘旁动了手。现场视频 30 秒内就冲上热搜第 3：# XX 粉丝机场打架#。官媒账号的抖音已经转了。工作室群里后援会会长连发 5 条"会长求稳"，但你知道她手里还捏着一份对家拉踩的录音没放出来。',
    emoji: '👊',
    choices: [
      {
        id: 'condemn',
        text: '艺人亲自发长文呼吁理智',
        subtext: '"饭圈不是法外之地"',
        outcome: {
          narration: '艺人手写长文上传，开头"作为哥哥/姐姐我必须说几句"——措辞诚恳，官媒秒转。路人缘涨了，但后援会内部群"偶像站对家了吗"的阴阳怪气开始冒头。激进粉脱粉 20%。',
          statChanges: { prRisk: -3, fanLoyalty: -3, commercialValue: 3 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 80 },
              narration: '艺人发长文。因为超话向心力极高，连核心大粉都连夜出教程"如何不给哥哥/姐姐添麻烦"置顶超话。# XX 粉丝自律# 反而被官媒夸成"饭圈新风气"。',
              statChanges: { prRisk: -5, fanLoyalty: 3, commercialValue: 4 },
            },
          ],
        },
      },
      {
        id: 'release_audio',
        text: '让大粉把对家拉踩录音放出来',
        subtext: '舆论反打，咬回去',
        outcome: {
          narration: '会长 10 分钟后放出 47 秒录音——对家站姐清清楚楚在骂你艺人。风向三小时内完全反转，对家工作室被迫出声明。但"粉丝互撕升级"的锅两家都得背，官媒点了"饭圈乱象"。',
          statChanges: { prRisk: 4, fanLoyalty: 5, commercialValue: -2 },
          specialEffect: 'fan_war',
        },
      },
      {
        id: 'blame_other',
        text: '工作室暗示"是对方先动手"',
        subtext: '一句话给粉丝撑腰',
        outcome: {
          narration: '工作室发了条"理性追星，但请勿纵容恶意挑衅"的声明——懂的都懂。粉丝们觉得被撑腰了，战斗力拉满。但对家粉和路人都在骂你"拉偏架"，官媒二条点名批评。',
          statChanges: { prRisk: 5, fanLoyalty: 4 },
        },
      },
      {
        id: 'ignore_fight',
        text: '沉默 + 关后援会超话',
        subtext: '让这事自然烂尾',
        outcome: {
          narration: '工作室没发声。后援会超话主动进入"静默三日"状态。沉默被解读成"默许"，官媒批评"艺人有引导粉丝的责任"。热度持续了三天才消退，大粉群开始分裂。',
          statChanges: { prRisk: 4, fanLoyalty: -2 },
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
          statChanges: { prRisk: 3, fanLoyalty: -3 },
          unlockTag: 'promised_quit_smoking',
        },
      },
      {
        id: 'personal_choice',
        text: '"个人生活不需要交代"',
        subtext: '强硬回应',
        outcome: {
          narration: '路人觉得说得对，粉丝觉得不够在乎他们的感受。一场"偶像到底该不该有私生活"的大讨论开始了。',
          statChanges: { prRisk: 3, fanLoyalty: -4, commercialValue: 3 },
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
          statChanges: { fanLoyalty: 3, prRisk: 3 },
        },
      },
      {
        id: 'deny_drunk',
        text: '声称视频被恶意剪辑',
        subtext: '否认真实性',
        outcome: {
          narration: '原视频的完整版被放了出来...更尴尬了。"越描越黑"成了热搜联想词。',
          statChanges: { prRisk: 7, fanLoyalty: -3 },
        },
      },
      {
        id: 'apologize_drunk',
        text: '向被模仿的同行道歉',
        subtext: '主动联系对方化解',
        outcome: {
          narration: '被模仿的同行大度回复"模仿得还挺像"，两人互动上了热搜正面位。危机变成了营销。',
          statChanges: { prRisk: -2, commercialValue: 3, fanLoyalty: 3 },
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
          statChanges: { prRisk: 3, fanLoyalty: -3, money: -10000 },
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
