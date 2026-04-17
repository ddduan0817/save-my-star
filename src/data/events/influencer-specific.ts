import type { GameEvent } from '@/types/game';

// 冷冰凝（网红转型/女）专属事件
export const influencerSpecificEvents: GameEvent[] = [
  {
    id: 'influencer_not_real_celeb',
    category: 'drama',
    severity: 'medium',
    title: '"她也配叫明星？"',
    description: '一位老牌女演员在采访中说"现在什么人都能叫明星了"，虽然没点名，但所有人都觉得在说冷冰凝。话题#网红和明星的区别#已经有5亿阅读量了。',
    emoji: '😒',
    forArtist: 'influencer',
    minDay: 5,
    choices: [
      {
        id: 'prove_worth',
        text: '用成绩回应',
        subtext: '晒出商业数据和作品',
        outcome: {
          narration: '你整理了冷冰凝的品牌合作列表、带货数据和短片作品。"网红怎么了？数据不会说谎"的回应让不少人改观。',
          statChanges: { commercialValue: 3, fanLoyalty: 3, prRisk: -3 },
        },
      },
      {
        id: 'self_deprecate',
        text: '自嘲化解',
        subtext: '"对对对我就是网红"',
        outcome: {
          narration: '冷冰凝发了一条视频：穿着睡衣吃泡面，配文"网红的真实生活"。播放量破亿，连那位老牌演员的粉丝都笑了。这波操作格局太大了。',
          statChanges: { fanLoyalty: 5, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'fire_back_celeb',
        text: '正面回怼',
        subtext: '"票房不如我带货，凭什么瞧不起？"',
        outcome: {
          narration: '火药味十足的回应引爆了舆论。年轻粉丝觉得"太飒了"，但传统娱乐圈的大门可能就此关上了。',
          statChanges: { fanLoyalty: 3, commercialValue: -3, prRisk: 4 },
        },
      },
    ],
  },
  {
    id: 'influencer_livestream_disaster',
    category: 'crisis',
    severity: 'high',
    title: '直播翻车！产品当场出问题',
    description: '冷冰凝在直播带货时，推荐的面膜被一个观众现场试用后过敏了。观众发红的脸出现在直播画面里，弹幕瞬间炸了。直播还在继续，你需要立刻做决定。',
    emoji: '📺',
    forArtist: 'influencer',
    minDay: 6,
    choices: [
      {
        id: 'stop_and_address',
        text: '暂停直播处理',
        subtext: '立刻道歉+下架产品',
        outcome: {
          narration: '冷冰凝当场道歉并宣布全额退款。虽然损失了一笔钱，但"网红带货的良心标杆"成了新标签。品牌方吓坏了，赔了一大笔。',
          statChanges: { money: -40000, fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
          twist: {
            chance: 0.3,
            narration: '过敏的观众后来发微博说："小鱼姐第一时间处理，还私下联系我赔偿了医药费。以后只在她的直播间买东西。"这条微博被转发了50万次。',
            statChanges: { fanLoyalty: 4, commercialValue: 3 },
          },
        },
      },
      {
        id: 'blame_brand',
        text: '甩锅给品牌方',
        subtext: '"是他们的产品有问题"',
        outcome: {
          narration: '你让冷冰凝把责任推给了品牌方。品牌方一怒之下放出了你们签合同时根本没看质检报告的证据。"翻车还甩锅"成了热搜。',
          statChanges: { prRisk: 7, fanLoyalty: -4, commercialValue: -3 },
        },
      },
    ],
  },
  {
    id: 'influencer_old_video',
    category: 'crisis',
    severity: 'medium',
    title: '早期低俗视频被扒出来了',
    description: '有人翻出了冷冰凝三年前为了涨粉拍的一些擦边内容。虽然已经删了，但录屏在到处传。"这就是你们支持的明星"的帖子已经有十万转发了。',
    emoji: '📹',
    forArtist: 'influencer',
    minDay: 8,
    choices: [
      {
        id: 'own_past',
        text: '坦然面对过去',
        subtext: '发长文讲述转型心路',
        outcome: {
          narration: '冷冰凝写了一篇两千字的长文，讲述了从最开始拍视频到现在的心路历程。"谁不是从不完美开始的"引发了大量共鸣。路人好感反而上升了。',
          statChanges: { fanLoyalty: 4, prRisk: -3, commercialValue: 3 },
        },
      },
      {
        id: 'deny_old_video',
        text: '否认是本人',
        subtext: '"视频是AI生成的"',
        outcome: {
          narration: '这个时代谁信AI生成的说法啊...原始平台的数据被扒出来了，实锤就是本人。说谎比视频本身更让人反感。',
          statChanges: { prRisk: 7, fanLoyalty: -4 },
        },
      },
      {
        id: 'growth_narrative',
        text: '包装成"成长故事"',
        subtext: '请媒体做专访讲述转型',
        outcome: {
          narration: '你安排了一个深度采访，主题是"从草根到明星的蜕变"。虽然有人觉得是洗白，但大部分人被她的真实和努力打动了。',
          statChanges: { fanLoyalty: 3, prRisk: 3, commercialValue: 3, money: -14000 },
        },
      },
    ],
  },
  {
    id: 'influencer_variety_mockery',
    category: 'drama',
    severity: 'low',
    title: '综艺上被当面嘲讽',
    description: '冷冰凝参加一档脱口秀节目，一个嘉宾当面调侃"你是不是走错片场了？这里是娱乐圈不是直播间"。现场气氛凝固了，镜头正对着冷冰凝的脸。',
    emoji: '🎭',
    forArtist: 'influencer',
    choices: [
      {
        id: 'witty_comeback',
        text: '机智回怼',
        subtext: '用幽默化解',
        outcome: {
          narration: '"是啊，不过直播间的观众可比这多多了呢。"全场笑翻，连调侃她的人都竖了大拇指。"综艺感炸裂"上了当晚热搜。',
          statChanges: { fanLoyalty: 4, commercialValue: 4, prRisk: -3 },
        },
      },
      {
        id: 'stay_silent_mock',
        text: '尴尬微笑',
        subtext: '不回应，笑笑就好',
        outcome: {
          narration: '她没回嘴，只是笑了笑。这个片段被反复播放，大家都觉得她"好委屈"。同情分倒是赚了不少。',
          statChanges: { fanLoyalty: 3, prRisk: 3 },
        },
      },
    ],
  },
];
