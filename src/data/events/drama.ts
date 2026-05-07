import type { GameEvent } from '@/types/game';

export const dramaEvents: GameEvent[] = [
  {
    id: 'drama_rival_diss',
    category: 'drama',
    severity: 'medium',
    title: '同行内涵你的艺人了！',
    description: '另一位当红艺人在采访中说了一句"有些人红是因为运气好"，虽然没点名，但所有人都觉得在说你。你的粉丝已经炸了，等你一声令下。',
    emoji: '😒',
    minDay: 5,
    choices: [
      {
        id: 'fire_back',
        text: '直接回怼',
        subtext: '社交媒体上隔空喊话',
        outcome: {
          narration: '艺人发了一条意味深长的微博："运气是留给有准备的人的。"粉丝嗨了，对方粉丝也嗨了，一场骂战正式开始。',
          statChanges: { prRisk: 5, fanLoyalty: 3, commercialValue: 3 },
          specialEffect: 'fan_war',
          twist: {
            chance: 0.3,
            narration: '骂战升级了！对方粉丝扒出你艺人以前的黑料反击，两边都在掉路人。综艺节目紧急取消了你们俩的同台邀约。',
            statChanges: { prRisk: 4, commercialValue: -3 },
          },
        },
      },
      {
        id: 'high_road',
        text: '高姿态无视',
        subtext: '用实力说话',
        outcome: {
          narration: '"不回应就是最好的回应。"路人纷纷站你这边，"格局大"的评价让你的艺人路人缘又涨了。',
          statChanges: { prRisk: -3, fanLoyalty: 3, commercialValue: 3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 70 },
              narration: '你选择高姿态无视。紧接着你的艺人拿下了一个顶级代言，用实力完成了最佳回应。"数据就是最好的反击"成了经典语录。',
              statChanges: { prRisk: -3, fanLoyalty: 3, commercialValue: 4, money: 60000 },
            },
          ],
        },
      },
      {
        id: 'weaponize_fans',
        text: '暗示粉丝出击',
        subtext: '不公开表态但私下暗示',
        outcome: {
          narration: '粉丝们"自发"出击，把对方的黑料扒了个底朝天。虽然赢了这一仗，但"粉丝太疯了"的标签也贴上来了。',
          statChanges: { prRisk: 4, fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'drama_cp_war',
    category: 'drama',
    severity: 'medium',
    title: 'CP粉 vs 唯粉大战！',
    description: '你的艺人和合作过的另一位艺人被磕CP磕出圈了。CP超话已经有百万粉丝。但唯粉们不干了——"我家哥哥/姐姐不需要绑定别人"。粉圈内战一触即发。',
    emoji: '💔',
    artistVariants: {
      idol: {
        description: '甄帅和综艺里那位搭档的 CP 超话冲到 180 万粉，#甄帅某某CP锁死# 常驻热搜。但甄帅唯粉撑不住了——"我哥是万人迷体质，不是用来绑定的"。两边超话隔空对线到凌晨 3 点，代拍开始恶意放同框图引战。',
      },
      actor: {
        description: '郝美丽和那部新剧男主的古装剧播出后 CP 粉暴涨。但两边唯粉都在骂——"演员搞 CP 炒作太 low"。#郝美丽某某磕死我了# 和 #郝美丽不搞CP# 两个词条同时在榜。豆瓣短评已经开始控不住评分。',
      },
      singer: {
        description: '高八度和合作综艺的那位女歌手被磕 CP 磕疯了——两人合唱的片段 B 站播放破千万。但歌迷分裂了：纯音乐粉说"专注音乐"，CP 粉在催合作专辑。#高八度某某 组合出道吧# 冲到热搜第 9。制作人那边已经在问"要不要真的给他们出首合作曲蹭一波"。',
      },
      influencer: {
        description: '冷冰凝和某男网红在双十一联合直播后被磕出了 CP——"冷冰某某营业情侣"超话一天涨粉 30 万。但冷冰凝自己的带货粉不干了——"主播谈恋爱粉丝黏性就没了"。带货圈的人设经济你懂的。',
      },
      socialite: {
        description: '南陌格和古偶剧里的女主被磕 CP 磕得全网都在截屏——戏外互动的甜度比戏里还高。"南陌格某某 现实版贵公子CP" 挂在热搜榜中部不肯下。但南陌格唯粉怕的是"贵公子只能磕我们自己"，那位女主的粉丝怕的是"我姐姐被拉低咖位"——两边谁都不干。',
      },
    },
    choices: [
      {
        id: 'clarify_cp',
        text: '"只是好同事"',
        subtext: '澄清关系',
        outcome: {
          narration: '声明发了，CP粉心碎了，唯粉满意了。但CP热度带来的流量也没了...这笔账怎么算？',
          statChanges: { fanLoyalty: -3, prRisk: -3, commercialValue: -3 },
        },
      },
      {
        id: 'play_along',
        text: '顺水推舟',
        subtext: '不否认，偶尔互动一下',
        outcome: {
          narration: '暧昧的互动让CP粉疯了，热度飙升！但唯粉开始脱粉回踩："偶像为了热度什么都做得出来。"',
          statChanges: { commercialValue: 3, fanLoyalty: -3, prRisk: 3 },
        },
      },
      {
        id: 'let_burn',
        text: '不管，让他们吵',
        subtext: '有热度就行',
        outcome: {
          narration: '粉圈内战越演越烈，终于闹上了热搜。不是正面热搜，是"XX粉丝又撕起来了"。这下品牌方也看到了...',
          statChanges: { prRisk: 4, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'drama_staff_leak',
    category: 'drama',
    severity: 'high',
    title: '团队出现内鬼！',
    description: '你发现最近艺人的行程、私人照片频繁被泄露给狗仔。一定是团队里有人在卖信息。你需要尽快找出这个人。',
    emoji: '🐀',
    minDay: 8,
    choices: [
      {
        id: 'fire_all',
        text: '大换血',
        subtext: '换掉所有可疑人员',
        outcome: {
          narration: '你开掉了三个人，团队元气大伤。新招的人需要磨合期，这段时间工作效率下降了不少。不过至少泄密停了。',
          statChanges: { money: -40000, prRisk: -3 },
        },
      },
      {
        id: 'investigate',
        text: '暗中调查',
        subtext: '放假消息，顺藤摸瓜',
        outcome: {
          narration: '你给每个人发了不同版本的假行程，结果——助理小王的版本出现在了八卦号上。抓到你了！处理掉内鬼后，团队士气反而上升了。',
          statChanges: { prRisk: -3, fanLoyalty: 3 },
        },
      },
      {
        id: 'feed_fake',
        text: '将计就计',
        subtext: '通过内鬼放假消息',
        outcome: {
          narration: '你通过内鬼放出了一条假新闻，结果狗仔信以为真发了出来，被打脸后信誉大损。"这经纪人有点东西"成了圈内评价。',
          statChanges: { prRisk: -4, commercialValue: 3 },
          twist: {
            chance: 0.25,
            narration: '内鬼发现被将计就计后恼羞成怒，把手里存的真料全爆了出来。虽然都不是大事，但一次性曝出十几条也够头疼的。',
            statChanges: { prRisk: 4 },
          },
        },
      },
    ],
  },
  {
    id: 'drama_award_snub',
    category: 'drama',
    severity: 'medium',
    title: '颁奖典礼落选了',
    description: '今年最重要的颁奖典礼提名名单公布，你的艺人竟然没有入围！粉丝们群情激愤，"暗箱操作"的阴谋论满天飞。',
    emoji: '🏆',
    minDay: 12,
    artistVariants: {
      idol: {
        description: '微博之夜"年度人气偶像"提名名单公布——甄帅不在其中。粉丝连夜扒出提名名单里有三个数据还不如甄帅的爱豆，开始猜测"是不是公司没做好公关"。#甄帅 微博之夜# 冲到热搜第 7，粉丝超话置顶是"哥哥数据这么好凭什么不提名"。',
      },
      actor: {
        description: '金鸡奖提名名单今天出了——郝美丽主演的那部文艺片，"最佳女主角"名单里没有她。被提名的是几位正在主演商业大剧的流量小花。#金鸡 公平性# 被圈内业内吵上热搜。一个影评人刚发了长文"什么时候起奖项也要看咖位了"。',
      },
      singer: {
        description: '金曲奖入围名单出来——高八度这张自认为最满意的专辑，"最佳国语男歌手"没进。反而是一张口水歌专辑入了围。#高八度 金曲奖# 冲到热搜第 4。音乐评论圈集体发声，乐迷在 QQ 音乐专辑评论区把该专辑顶到了"年度最佳"。',
      },
      influencer: {
        description: '金鹰奖"观众最喜爱女演员"投票榜出来了，冷冰凝当初客串的那部爆款剧她不在候选名单。粉丝扒出"只有正剧演员才能投"的规则细则——"网红转型本来就算正剧演员吗"成了年度金句。',
      },
      socialite: {
        description: '时尚芭莎年度盛典的座位表流出——南陌格从去年的前排，滑到了今年的第三排偏角。#南陌格 时尚芭莎 座位# 冲到第 12。圈内一眼就能看懂:"是南陌格那边资源线出了问题"。三个合作的高奢品牌的市场负责人都在观望你怎么处理。',
      },
    },
    choices: [
      {
        id: 'congratulate',
        text: '大度祝贺获奖者',
        subtext: '展现风度',
        outcome: {
          narration: '艺人大方转发祝贺，被获奖者在领奖台上公开感谢。"这才是体面"的评价让路人好感飙升。',
          statChanges: { fanLoyalty: 3, commercialValue: 3, prRisk: -3 },
          twist: {
            chance: 0.3,
            narration: '获奖者私下联系你说想一起合作一部电影！这个项目如果成了，商业价值会飙升。意外之喜！',
            statChanges: { commercialValue: 4, money: 40000 },
          },
        },
      },
      {
        id: 'shade',
        text: '暗讽评委不公',
        subtext: '发一条意味深长的微博',
        outcome: {
          narration: '一条"有些奖不发也罢"的微博引爆了舆论。粉丝觉得偶像太酷了，但组委会把你的艺人拉进了黑名单。',
          statChanges: { fanLoyalty: 3, commercialValue: -4, prRisk: 4 },
        },
      },
      {
        id: 'boycott',
        text: '宣布不参加典礼',
        subtext: '用行动表达态度',
        outcome: {
          narration: '缺席成了最大的新闻。有人说"有骨气"，有人说"输不起"。这波操作评价两极分化严重。',
          statChanges: { prRisk: 3, fanLoyalty: 3, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'drama_collab_scandal',
    category: 'drama',
    severity: 'high',
    title: '合作方突然塌房了！',
    description: '你的艺人正在拍的电视剧男/女主角突然被曝出严重丑闻，整部剧面临停播风险。你的艺人虽然没有问题，但"同一部戏"的标签已经贴上来了。',
    emoji: '🎬',
    minDay: 10,
    choices: [
      {
        id: 'distance',
        text: '立刻切割',
        subtext: '声明与对方只是工作关系',
        outcome: {
          narration: '切割声明发得很快，但有人觉得"太绝情了"。不过至少保住了自己的代言不受牵连。',
          statChanges: { prRisk: 3, commercialValue: -3 },
        },
      },
      {
        id: 'stand_by',
        text: '公开力挺',
        subtext: '"在事情查清前不做评价"',
        outcome: {
          narration: '你选择了义气，但对方的丑闻越爆越大。现在连你的艺人都被拖下水了——"物以类聚"的评论满天飞。',
          statChanges: { prRisk: 7, fanLoyalty: -3 },
          twist: {
            chance: 0.35,
            narration: '事情反转了！对方被证明是清白的，当初力挺对方的你成了"患难见真情"的典范。全网好感度暴增！',
            statChanges: { prRisk: -9, fanLoyalty: 5, commercialValue: 4 },
          },
        },
      },
      {
        id: 'no_comment',
        text: '不表态',
        subtext: '低调等事情过去',
        outcome: {
          narration: '沉默是金。等对方的事情处理完了，你的艺人也没受到太大影响。虽然这部剧可能要凉了....',
          statChanges: { prRisk: 3, money: -20000 },
        },
      },
    ],
  },
  {
    id: 'drama_trainee_scandal',
    category: 'drama',
    severity: 'medium',
    title: '前练习生爆料内幕',
    description: '一个曾经和你艺人一起练习的淘汰选手在社交媒体上爆料："那个人当年根本不努力，全靠公司砸资源。"帖子正在发酵...',
    emoji: '🗣️',
    minDay: 8,
    choices: [
      {
        id: 'show_evidence',
        text: '放出练习视频',
        subtext: '用事实打脸',
        outcome: {
          narration: '团队翻出了当年的练习室视频——凌晨三点还在练舞。"努力的人不需要解释"刷屏了，爆料人被反噬。',
          statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'ignore_trainee',
        text: '不搭理',
        subtext: '让子弹飞一会',
        outcome: {
          narration: '帖子热度持续了两天就自然消退了。毕竟网友的记忆只有三秒，新的瓜更香。',
          statChanges: { prRisk: 3 },
        },
      },
    ],
  },
  {
    id: 'drama_dating_rumor_costar',
    category: 'drama',
    severity: 'high',
    title: '和搭档暧昧上热搜',
    description: '你的艺人和新剧的搭档最近互动频繁，粉丝开始磕CP。但今天两人被拍到深夜同回酒店，虽然可能只是剧组聚餐后一起回去，但标题已经写好了："实锤！"',
    emoji: '💑',
    minDay: 12,
    choices: [
      {
        id: 'use_cp_heat',
        text: '借势炒CP',
        subtext: '反正对新剧有利',
        outcome: {
          narration: 'CP热搜带飞了新剧预告的播放量。唯粉在哭，CP粉在笑，但数据是真的好看。',
          statChanges: { commercialValue: 4, fanLoyalty: -4, prRisk: 3 },
        },
      },
      {
        id: 'professional_boundary',
        text: '专业声明',
        subtext: '"只是工作关系"',
        outcome: {
          narration: '声明中规中矩，但搭档的经纪团队没有同步发声明，显得你在"单方面否认"。气氛更暧昧了。',
          statChanges: { prRisk: 3, fanLoyalty: -3 },
        },
      },
      {
        id: 'humor_deflect',
        text: '玩梗带过',
        subtext: '发搞笑合照化解',
        outcome: {
          narration: '两人合发了一张恶搞表情包，配文"我们真的只是同事啦"。CP粉和唯粉竟然都笑了，这波操作满分。',
          statChanges: { fanLoyalty: 3, prRisk: -3, commercialValue: 3 },
        },
      },
    ],
  },
];
