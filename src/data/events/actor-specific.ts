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
];
