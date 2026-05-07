import type { GameEvent } from '@/types/game';

export const crisisEvents: GameEvent[] = [
  {
    id: 'crisis_leaked_photo',
    category: 'crisis',
    severity: 'high',
    title: '恋爱石锤！疑似约会照曝光',
    description: '狗仔拍到你的艺人和某神秘人深夜牵手逛街，照片已经在微博疯传，热搜正在往上爬。粉丝群已经炸了，品牌方开始打电话来问情况...',
    emoji: '📸',
    artistVariants: {
      idol: {
        description: '狗仔半夜发了 9 宫格——甄帅和一个戴口罩的女生从他公寓楼下停车场出来，手牵手走进便利店。#甄帅疑似恋情# 40 分钟冲到热搜第 2，超话内部已经开始"自杀式脱粉"直播。后援会会长连发 5 条"稳住"，但你知道她本人也在哭。品牌方市场部已经开了三个紧急会议，一个护肤代言的法务部电话打过来问"解约条款怎么走"。',
      },
      actor: {
        description: '某娱记小号凌晨发了一组图——郝美丽和一个男人从京郊某私宅出来。构图很糊，但脸能辨认。娱记配文:"恭喜某影后姐姐恋爱"。热搜挂到第 14 位就没再往上，微博正文下面最高赞评论是 "人家都 32 了谈个恋爱怎么了"。反而是品牌方那边先紧张——一个家用电器代言的商务总监打电话来委婉地问"那位男士的背景方便了解下吗"。',
      },
      singer: {
        description: '一个搞现场饭拍的博主发了组模糊视频——高八度和一个短发女生散场后在后台更衣室门口拥抱。粉丝群分成两派：一派说"姐姐谈恋爱人之常情"，一派说"八哥的感情线都该写进歌里不该漏出来"。#高八度恋情# 第 6 位，反而带火了一首老专里的情歌，QQ 音乐日榜第 3。现在品牌方没打电话，但下一张专辑的预售商在观望。',
      },
      influencer: {
        description: '一个搞内娱的营销号发了模糊直拍——冷冰凝深夜和某男子进了同一个小区。评论区第一反应不是愤怒，而是"啊？原来冰冰还能谈恋爱？"。#冷冰凝恋爱# 没冲上前 10，但她直播间连掉 3000 粉。带货品牌方倒没慌——他们的风控说："网红人设没有偶像包袱，问题不大"。反而是合作的综艺制作人打电话说:"姐你能不能先稳一周别官宣，我们录完再说。"',
      },
      socialite: {
        description: '代拍放了组清晰的大图——南陌和某位圈内富二代千金一起从某酒店出来，两人合拍的当季新款手表、包款被扒出来刚好是情侣系列。#南陌 某某某# 冲到热搜第 7。粉丝超话里的声音很微妙："门当户对我磕我磕"和"贵公子不能塌"各占一半。高奢品牌方反倒松了一口气——他们最怕你谈的是网红，谈同圈富二代反而"符合品牌调性"。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '黑粉扒出甄帅 2019 年练习生时期的小号——三条对女团选秀选手的"咖位嘲讽"截图。#甄帅 内涵前辈# 挂热搜第 4。原话不重要，"踩一捧一"的标签贴上去就撕不下来。后援会大粉群里已经开始内讧——"哥哥那时候才 18"和"再小也不该说这种话"互不让步。被内涵的那位前辈的工作室刚发了条"祝大家都好"，这个时机太微妙了。',
      },
      actor: {
        description: '一个豆瓣鹅组的帖子扒出郝美丽 2018 年微博——一条疑似阴阳某著名男导演"会演戏才叫演员"的小作文。截图配上她当年那部跟该导演互别苗头的文艺片，#郝美丽 心眼小# 冲到热搜第 6。圈内那位前辈导演这两年正主导一个奖项的评委席。你太知道这意味着什么了。',
      },
      singer: {
        description: '一个老乐迷扒出高八度 2017 年的豆瓣音乐日记——三条对某流量歌手"靠脸"的暗讽长评，每条几百字、有理有据。#高八度 恃才傲物# 第 9 位。乐迷觉得"这才是搞音乐的人该说的话"，路人觉得"行业内卷不需要你嘴硬"。被内涵的那位流量这两年转型成了某选秀节目导师，他工作室的人开始在微博点赞嘲讽八哥的帖子了。',
      },
      influencer: {
        description: '一个比她还早入行的网红博主扒出冷冰凝 2020 年小号——"那些粉丝越穷越爱给主播刷礼物"配某直播间礼物截图。#冷冰凝 看不起穷粉# 冲到热搜第 3。她直播间私信全是举报截图，直接掉了 1.2 万粉。最难处理的是——她直播主推的某价格亲民的国货品牌方，刚发邮件问"是否需要紧急讨论合作调性"。',
      },
      socialite: {
        description: '某私密群截图流出——南陌出道前在某个"圈内饭局群"里说过几句对女嘉宾的轻浮评价，时间是 2021 年。#南陌 油腻男# 挂上热搜第 5。这次连贵公子粉丝都不太敢洗，"贵公子人设"和"群里说骚话"完全反着来。一个高奢女装品牌已经在内部发起"代言人重新评估"流程。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '一个野生站子的代拍发了组九宫格——甄帅在一家西餐厅门口抽烟，姿势还挺老练。9 张图。#甄帅 抽烟# 冲到热搜第 8。粉丝超话最高赞是"我哥都 25 了"，下面跟着 200 条"再大也不该这样"。新代言的牛奶品牌方已经在群里发"风险评估中"。',
      },
      actor: {
        description: '一个剧组路透流出——郝美丽在剧组休息棚外抽烟，旁边几个工作人员陪着抽。圈内人看了第一反应是"职业病"，娱记圈的反应是"成熟女演员的常态"。#郝美丽 抽烟# 第 19 位就被挤下去了，但一个家用电器代言的家庭品牌方还是发了条委婉的邮件:"建议未来公开场合多注意形象。"',
      },
      singer: {
        description: '一段后台视频流出——高八度在演唱会后台抽烟，手抖得厉害，嗓子有点哑。乐迷反应居然是心疼:"哥这是嗓子不舒服在压。"#高八度 后台抽烟# 第 22 位，但被歌迷冲了一波正面 tag #守护八哥的嗓子#。代言方那边相对宽容——音乐圈这点事不算事。',
      },
      influencer: {
        description: '一个粉丝偷拍流出——冷冰凝在一家咖啡店外抽电子烟，被一个明显是来打卡的素人拍到。#冷冰凝 抽电子烟# 冲到热搜第 11。带货圈最敏感的就是"健康人设"——她推过的几款健康食品的品牌方连夜在群里要求她"先把这事处理了"。',
      },
      socialite: {
        description: '酒会后的代拍图——南陌站在某 club 外面抽雪茄，旁边几个圈内贵公子陪同。#南陌 抽雪茄# 上了热搜第 6。粉丝两极分化，"贵公子就该有这样调调"和"塌人设了"五五开。但高奢品牌方反而觉得这场景"和品牌调性不冲突"——他们上一组大片就是雪茄馆背景。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '一个 15 秒视频在微信群里流传了三天后终于被营销号拿到——甄帅在某工作室生日趴上喝多了，模仿同公司三位师兄的出道 solo，"版权律师见谅"冲到热搜第 4。粉丝一半在笑一半在哭，被模仿的那位师兄的工作室已经私下打电话过来"沟通一下"。',
      },
      actor: {
        description: '一段三分钟的视频被剪出来发在 B 站——郝美丽在某杀青宴上喝多，点名道姓吐槽跟她合作过的一个男演员"背词靠提词器、感情戏全靠导演喊卡"。被吐槽的那位现在还在主演央视黄金档大剧。#郝美丽 酒后真言# 冲到热搜第 2。圈内各种"吃瓜看戏"，但被点名那位的经纪人已经连发 3 个微博同仇敌忾的小作文。',
      },
      singer: {
        description: '一段 2 分钟的视频流出——高八度在某地下酒吧喝多，拿着话筒模仿某选秀出身的唱跳男团成员"假唱划水"，还当场清唱了一段那位的成名曲给他"正音"。#高八度 酒后发狠# 第 5 位。乐迷觉得炸裂精彩，粉圈那边直接宣战，被内涵那位的粉丝开始冲八哥超话。',
      },
      influencer: {
        description: '某网红聚会直播录屏——冷冰凝喝多，对着镜头吐槽另一位头部带货网红"佣金抽得比谁都狠还装姐妹"。#冷冰凝 撕 X# 冲到热搜第 3。带货圈最怕这个，直播平台那边已经打电话来问"是不是需要先暂停几天直播"。',
      },
      socialite: {
        description: '某 high-end 会所内部流出——南陌喝多，拿着酒杯模仿京圈某老牌阔太太"姐姐我这杯敬您"的客套腔，还补了一句"她们就爱年轻人陪"。圈子很小，被模仿的那位第二天就在朋友圈冷笑："这孩子酒量不行话也不行。"热搜挂到第 12 位就被撤了，但该阔太太资源圈的门基本关上了。',
      },
    },
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
    artistVariants: {
      idol: {
        description: '一个粉丝凌晨爬窗进了甄帅的公寓楼道，被物业拦下时手里还拿着一束花和一本"未来婚后生活计划书"。物业把视频流给了你。粉丝群里这个事已经传开——大粉一半喊报警，一半在求"哥哥别太狠了那也是爱"。被吓到的甄帅这两天没怎么吃饭。',
      },
      actor: {
        description: '一个自称"研究表演的迷弟"想潜入郝美丽租的剧组别墅，被保安抓住时背包里有相机、长焦镜头、还有"演技笔记"。这事在豆瓣鹅组快传开了，但圈内反应是"演员还能遇到这种？"——不算大热搜，但你需要表态，不然女演员的人身安全话题会被发酵。',
      },
      singer: {
        description: '一个老粉混进了高八度的录音棚——靠的是伪造一张录音师的工作证。被发现时她手里抱着自己十年前的演唱会门票根，哭着说"就想看八哥录歌"。八哥本人没受惊吓，但他刚找回的录音状态被打断了。',
      },
      influencer: {
        description: '一个直播间老粉摸到了冷冰凝的小区，假装快递员混进单元楼，被电梯监控拍到。她的诉求很离谱:"想给冰冰送我自制的护肤品试用装"。带货圈最敏感这种"粉丝能直接接触主播"的设定——一旦坐实"管理混乱"，复购率会跌。',
      },
      socialite: {
        description: '一个自称是某富二代千金的女生，伪造邀请函混进了南陌出席的私人晚宴现场。当晚被场地保安请出去时，她身上穿的是和南陌当天造型同色系的礼服。这事圈子里很快传开了，"南陌身边还能混进这种人"的私下议论开始影响他在圈内顶级局的入场资格。',
      },
    },
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
