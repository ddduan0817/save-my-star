import type { GameEvent } from '@/types/game';

// 郝美丽（实力派演员/女）专属事件
export const actorSpecificEvents: GameEvent[] = [
  {
    id: 'actor_greasy_criticism',
    category: 'pr',
    severity: 'medium',
    title: '"油腻"争议上热搜',
    description: '一条"郝美丽新剧演技开始油了"的帖子突然火了，评论区一堆人在分析她的微表情哪里"不自然"。虽然有人反驳，但"实力派也会翻车"的话题已经起来了。',
    emoji: '😬',
    forArtist: 'actor',
    minDay: 6,
    choices: [
      {
        id: 'accept_criticism',
        text: '虚心接受',
        subtext: '发文表示会继续精进',
        outcome: {
          narration: '郝美丽发了一段很真诚的文字："演技是一辈子的修行，感谢批评的声音。"科班出身的态度征服了大部分人。',
          statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'show_range',
        text: '放出幕后花絮',
        subtext: '让大家看看真正的表演功底',
        outcome: {
          narration: '团队放出了她在片场反复揣摩角色的长视频。一条哭戏NG了十遍、每遍都不同的片段直接封神，"被批油腻的女演员到底有多努力"刷屏了。',
          statChanges: { fanLoyalty: 3, commercialValue: 4, prRisk: -3 },
        },
      },
      {
        id: 'ignore_critics',
        text: '不回应',
        subtext: '作品说话',
        outcome: {
          narration: '你选择沉默。争议持续了两天就被新的瓜盖过去了，但"郝美丽演技下滑"的标签已经被人记住了。',
          statChanges: { prRisk: 3, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'actor_film_festival',
    category: 'business',
    severity: 'medium',
    title: '三大电影节入围了！',
    description: '好消息！郝美丽主演的文艺片入围了国际电影节主竞赛单元。这是华语电影多年来的突破。但电影节宣传需要大量投入，而且如果空手而归会被说"陪跑"。',
    emoji: '🏆',
    forArtist: 'actor',
    minDay: 12,
    choices: [
      {
        id: 'go_all_in_festival',
        text: '全力冲奖',
        subtext: '重金投入宣传 (-15万)',
        requireMinMoney: 110000,
        outcome: {
          narration: '你们投入大量资源做了国际宣传。电影节评委对这部片赞不绝口，郝美丽的名字出现在了国际媒体上。',
          statChanges: { money: -110000, commercialValue: 5, fanLoyalty: 4, prRisk: -3 },
          twist: {
            chance: 0.3,
            narration: '她拿奖了！颁奖礼上的获奖感言视频在国内播放量破亿，"郝美丽为国争光"登顶热搜。整个娱乐圈都在为她鼓掌。',
            statChanges: { commercialValue: 5, fanLoyalty: 5, money: 140000 },
          },
        },
      },
      {
        id: 'low_key_festival',
        text: '低调出席',
        subtext: '去走走红毯就好',
        outcome: {
          narration: '没有大规模宣传，但郝美丽在红毯上的气场还是引起了国际媒体的注意。几家外国杂志找来约了拍摄。',
          statChanges: { commercialValue: 3, fanLoyalty: 3 },
        },
      },
    ],
  },
  {
    id: 'actor_director_blowup',
    category: 'drama',
    severity: 'high',
    title: '和导演片场大吵一架',
    description: '郝美丽在片场因为角色理解和导演爆发了激烈争论，路人视频已经传出去了。圈内分成两派：有人说她"有态度"，有人说她"不专业"。',
    emoji: '🎬',
    forArtist: 'actor',
    minDay: 8,
    choices: [
      {
        id: 'public_reconcile',
        text: '和导演公开和解',
        subtext: '一起发微博互相认可',
        outcome: {
          narration: '导演先发了微博："艺术上的争论是好事，郝美丽是我见过最认真的演员。"郝美丽转发："谢谢导演包容。"两人互动被赞"神仙组合"。',
          statChanges: { fanLoyalty: 3, commercialValue: 4, prRisk: -3 },
        },
      },
      {
        id: 'stay_firm',
        text: '坚持自己的理解',
        subtext: '"好演员就该对角色负责"',
        outcome: {
          narration: '郝美丽没有道歉，反而详细解释了她对角色的理解。一部分影评人力挺她，说"这才是真正的创作者"。但导演那边不太高兴。',
          statChanges: { fanLoyalty: 4, commercialValue: -3, prRisk: 3 },
        },
      },
    ],
  },
  {
    id: 'actor_commercial_pressure',
    category: 'business',
    severity: 'low',
    title: '品牌方嫌"不够有话题"',
    description: '一个大品牌的市场总监私下和你说："黛宁演技没问题，但微博互动数据太低了。能不能让她多发点日常？我们需要能带货的。"',
    emoji: '📊',
    forArtist: 'actor',
    choices: [
      {
        id: 'create_content',
        text: '安排日常内容营业',
        subtext: '拍摄生活化物料',
        outcome: {
          narration: '团队精心拍了一组"郝美丽的周末"系列。虽然不是她的风格，但互动数据确实涨了，品牌方满意了。',
          statChanges: { commercialValue: 3, fanLoyalty: -3 },
        },
      },
      {
        id: 'refuse_pander',
        text: '不迎合',
        subtext: '"用作品数据说话"',
        outcome: {
          narration: '你摆出了她主演的电影票房数据和口碑评分。品牌方想了想："行吧，调性确实比流量更持久。"合同签了，但代言费打了八折。',
          statChanges: { money: 70000, commercialValue: 3, fanLoyalty: 3 },
        },
      },
    ],
  },

  // ===== 招牌黑料：金鸡人情 + 剧组难搞 =====
  {
    id: 'actor_ex_director_shade',
    category: 'drama',
    severity: 'high',
    title: '前合作导演采访里阴阳她',
    description: '一位和郝美丽合作过的导演在综艺采访里说："现在有些演员，戏还没拍完就开始关心自己的海报占多少面积、C位站哪儿。"主持人追问"说谁呢"，他笑了笑没接话。全圈都知道在说谁。',
    emoji: '🎞️',
    forArtist: 'actor',
    minDay: 6,
    choices: [
      {
        id: 'counter_interview',
        text: '发采访正面回应',
        subtext: '"我关心的从来不是 C 位"',
        outcome: {
          narration: '郝美丽接受了一家主流媒体的专访，详细讲了当年和那位导演的合作细节——最后一句："他说的那个演员不是我，我不会为不存在的事情道歉。"态度强硬但有条理，影迷站她。',
          statChanges: { fanLoyalty: 4, prRisk: 3, commercialValue: -3 },
          unlockTag: 'publicly_defended',
        },
      },
      {
        id: 'call_director_apologize',
        text: '私下电话求和',
        subtext: '"老师我那时候不懂事"',
        outcome: {
          narration: '你让她给导演打了个电话。导演在电话里"呵呵"了半天，最后说："你们团队会做人。"第二天他发了条微博："那天采访被断章取义，和郝美丽合作愉快。"危机解了，但她在电话挂掉之后摔了杯子。',
          statChanges: { prRisk: -3, fanLoyalty: -3, commercialValue: 3 },
          unlockTag: 'bent_knee',
        },
      },
      {
        id: 'let_it_cool',
        text: '不回应等它冷',
        subtext: '舆论不会烧太久',
        outcome: {
          narration: '三天内有更大的瓜盖过去了。但"郝美丽耍大牌"的标签被人悄悄记下了——下次再有事，这会是第一条被翻出来的"旧账"。',
          statChanges: { prRisk: 3, fanLoyalty: -3 },
        },
      },
    ],
  },
  {
    id: 'actor_goldrooster_leak',
    category: 'crisis',
    severity: 'critical',
    title: '金鸡奖内部投票流出',
    description: '颁奖季前夕，一份"某届金鸡新人奖最终评委会名单和投票倾向"在圈内疯传。第一个被点名的就是郝美丽——那届评委里确实有她本科班导师，而且那位导师明确投了她。#金鸡人情奖 挂上主榜。',
    emoji: '🏆',
    forArtist: 'actor',
    minDay: 9,
    choices: [
      {
        id: 'prove_with_work',
        text: '作品回应',
        subtext: '晒出那届其他入围作品对比',
        outcome: {
          narration: '团队整理了一条长视频："郝美丽那部文艺片在海外三大电影节的评价、票房、豆瓣评分"——横向对比后确实站得住脚。影迷转发："评委是人情，但戏是真的好。"路人被说服了一部分。',
          statChanges: { prRisk: -3, fanLoyalty: 4, commercialValue: 3 },
        },
      },
      {
        id: 'mentor_statement',
        text: '让导师发声说明',
        subtext: '请导师发长文解释评委规则',
        outcome: {
          narration: '导师发了两千字长文："金鸡评委会的投票流程是双盲、多轮制，我投她因为那是她应得的。"这篇文有理有据，但"老师护犊子"的调子压不下去。',
          statChanges: { prRisk: 3, fanLoyalty: 3 },
        },
      },
      {
        id: 'return_award',
        text: '大动作——退还奖杯',
        subtext: '"如果这个奖有争议，我可以还回去"',
        outcome: {
          narration: '郝美丽发了一条微博："如果我的获奖让这个奖项本身承受了质疑，我愿意把它送回评委会。"这招把所有人都震住了。金鸡官方连夜发声明"郝美丽获奖合规"，反而帮她洗白了一轮。',
          statChanges: { fanLoyalty: 8, prRisk: -7, commercialValue: 5 },
          unlockTag: 'returned_award',
          twist: {
            chance: 0.3,
            narration: '但是！有人扒出她其实是提前知道评委会不会接受退还的。"作秀"的标签贴上来了。',
            statChanges: { fanLoyalty: -5, prRisk: 3 },
          },
        },
      },
    ],
  },
  {
    id: 'actor_old_feud_director',
    category: 'business',
    severity: 'high',
    title: '她当年得罪过的前辈拿着剧本找来了',
    description: '一部投资两亿的年度正剧，导演正是她五年前在片场顶撞过的那位老前辈——那次她当众说他"不懂女性角色"。现在对方亲自把剧本递过来，女一。剧本写得很好，但这个人——你真的敢让她接吗？',
    emoji: '🎭',
    forArtist: 'actor',
    minDay: 13,
    choices: [
      {
        id: 'take_the_role',
        text: '接！冰释前嫌',
        subtext: '借这部戏洗白"难搞"标签',
        outcome: {
          narration: '她接了。开机仪式上两人对镜头微笑握手，"捐弃前嫌"上了热搜。剧组第一周相安无事——你屏住呼吸等着看什么时候爆。',
          statChanges: { money: 400000, commercialValue: 6, prRisk: 3 },
          unlockTag: 'accepted_old_feud_project',
          twist: {
            chance: 0.45,
            narration: '第二周导演在围读会上故意把她的戏全改成群戏。她当场摔了剧本，"女演员片场摔剧本"视频疯传。剧要不要继续拍都成了问题。',
            statChanges: { prRisk: 12, commercialValue: -6, fanLoyalty: -5 },
          },
        },
      },
      {
        id: 'decline_politely',
        text: '礼貌推掉',
        subtext: '"档期不合适"',
        outcome: {
          narration: '她亲自给对方打了电话致谢并推了剧本。导演表面客气，背地里在圈内说"她果然还是那个毛病"。这件事没上热搜，但下一次奖项评选会变成暗伤。',
          statChanges: { prRisk: 3, fanLoyalty: 3 },
        },
      },
      {
        id: 'counter_offer',
        text: '提条件：换编剧',
        subtext: '"我接，但剧本必须我签过才行"',
        outcome: {
          narration: '导演没想到她敢提条件——更没想到是在行业会上当众提。现场一半人觉得"她疯了"，一半人觉得"有种"。最后导演真的让了一步：剧本由她和原编剧共同署名。这部戏还没拍，她先在圈内立住了一个新人设。',
          statChanges: { fanLoyalty: 6, commercialValue: 4, prRisk: 4 },
          unlockTag: 'earned_credit',
        },
      },
    ],
  },
];
