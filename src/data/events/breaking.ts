import type { GameEvent } from '@/types/game';

// 突发快讯：随机插入，打断正常节奏，制造紧迫感
export const breakingEvents: GameEvent[] = [
  {
    id: 'breaking_live_accident',
    category: 'breaking',
    severity: 'high',
    title: '直播事故！正在直播中！',
    description: '你的艺人正在直播，突然说错了话——把还没官宣的新代言品牌名字说了出来！品牌方正在疯狂打电话过来，直播间弹幕已经截图了，你有30秒做决定！',
    emoji: '🔴',
    isBreaking: true,
    choices: [
      {
        id: 'cut_stream',
        text: '立刻断直播',
        subtext: '假装网络故障',
        outcome: {
          narration: '"网络好像出了点问题——"画面突然黑了。粉丝们一脸懵，但截图已经传出去了。',
          statChanges: { prRisk: 3, money: -20000 },
          twist: {
            chance: 0.4,
            narration: '但是！有粉丝录了屏，完整视频已经上了热搜。品牌方要求赔偿违约金。',
            statChanges: { prRisk: 4, money: -56000 },
          },
        },
      },
      {
        id: 'play_dumb',
        text: '装傻糊弄过去',
        subtext: '"啊我说什么了？"',
        outcome: {
          narration: '"哈？我刚说啥了？大家听错了吧～"虽然很假，但直播间的节奏被带过去了。',
          statChanges: { prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 70 },
              narration: '粉丝们默契十足，弹幕齐刷"我们什么都没听到"。高忠诚度的粉丝就是你最好的公关团队。截图贴？不存在的。',
              statChanges: { prRisk: -2, fanLoyalty: 3 },
            },
            {
              condition: { maxFanLoyalty: 30 },
              narration: '粉丝根本不配合，弹幕全是"别装了都截图了"。低人气的代价就是没人替你圆场。',
              statChanges: { prRisk: 5 },
            },
          ],
        },
      },
      {
        id: 'own_it',
        text: '大方承认',
        subtext: '"嘻嘻剧透了"',
        outcome: {
          narration: '"好吧被你们发现了～过两天就官宣了啦～"品牌方一开始很生气，但直播间的兴奋反应让他们看到了热度的价值。',
          statChanges: { commercialValue: 3, prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minCommercialValue: 70 },
              narration: '"好吧被你们发现了～"品牌方看到直播间瞬间涌入50万人，本来要发的怒火变成了惊喜。紧急改方案，直接直播间首发！商业价值拉满。',
              statChanges: { commercialValue: 4, money: 40000, fanLoyalty: 3 },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'breaking_trending_negative',
    category: 'breaking',
    severity: 'critical',
    title: '紧急！你被挂上热搜第一了',
    description: '一个匿名大V发了一条微博："某顶流背后的真面目"，配了几张模糊的聊天截图。虽然没有指名道姓，但所有的线索都指向你的艺人。10分钟内阅读量已经破亿。',
    emoji: '🔴',
    isBreaking: true,
    minDay: 8,
    choices: [
      {
        id: 'immediate_response',
        text: '第一时间回应',
        subtext: '抢在发酵前声明',
        outcome: {
          narration: '30分钟内发出了律师声明，否认一切指控并保留追究法律责任的权利。速度之快让网友印象深刻。',
          statChanges: { prRisk: 4, money: -40000 },
          conditionalOutcomes: [
            {
              condition: { minPrRisk: 60 },
              narration: '30分钟内发了声明，但由于你的艺人之前就有不少争议，网友们并不买账。"做贼心虚才这么快回应吧"成了高赞评论。',
              statChanges: { prRisk: 7, money: -40000, fanLoyalty: -4 },
            },
            {
              condition: { maxPrRisk: 20 },
              narration: '30分钟内发了声明。由于你的艺人一直口碑很好，大量路人主动站出来说"我不信"。大V被反扒出有竞争对手背景，剧情反转！',
              statChanges: { prRisk: 3, fanLoyalty: 4, commercialValue: 3 },
            },
          ],
          twist: {
            chance: 0.3,
            narration: '反转来了！大V账号被扒出是竞争对手花钱买的水军号，截图是PS的。全网舆论180度翻转，你的艺人成了"被害者"。',
            statChanges: { prRisk: -5, fanLoyalty: 4 },
          },
        },
      },
      {
        id: 'wait_and_see',
        text: '先观察',
        subtext: '看看对方还有没有后手',
        outcome: {
          narration: '你选择按兵不动，但沉默被解读为心虚。一小时后，第二波"证据"放出来了...',
          statChanges: { prRisk: 5 },
          twist: {
            chance: 0.5,
            narration: '但出人意料的是，第二波"证据"太假了，连路人都看出来是故意黑的。舆论风向开始转变："这是有组织的抹黑吧？"',
            statChanges: { prRisk: -4, fanLoyalty: 3 },
          },
        },
      },
      {
        id: 'counter_attack',
        text: '反击！扒对方',
        subtext: '调查大V背景，反将一军',
        outcome: {
          narration: '你的团队连夜调查，发现大V和竞争对手有利益关系。反击的微博配上证据链，阅读量瞬间超过了对方。',
          statChanges: { prRisk: 3, commercialValue: 3 },
          conditionalOutcomes: [
            {
              condition: { minMoney: 200000 },
              narration: '你花重金请了最好的公关团队和网络调查公司。48小时内，完整的证据链被呈现在公众面前——大V是竞品花50万买的。舆论彻底反转，你的艺人成了受害者英雄。',
              statChanges: { prRisk: -4, fanLoyalty: 5, commercialValue: 4, money: -56000 },
            },
          ],
        },
      },
    ],
  },
  {
    id: 'breaking_viral_moment',
    category: 'breaking',
    severity: 'low',
    title: '刚刚！你的艺人上了热搜！',
    description: '你的艺人在机场被拍到帮一个迷路的小朋友找妈妈，全程温柔耐心。视频在20分钟内播放量破千万，评论区全是"嫁给我"和"好温柔啊啊啊"。',
    emoji: '💫',
    isBreaking: true,
    choices: [
      {
        id: 'stay_humble',
        text: '低调处理',
        subtext: '不回应，保持自然',
        outcome: {
          narration: '什么都不做反而是最好的操作。视频靠自来水传播了一整天，"好人设是装不出来的"成了全网共识。',
          statChanges: { fanLoyalty: 5, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'thank_publicly',
        text: '发微博感谢关注',
        subtext: '顺势表达态度',
        outcome: {
          narration: '一条简单的"举手之劳，希望小朋友以后不会再迷路啦"获得百万转发。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: -3 },
          twist: {
            chance: 0.3,
            narration: '但是！有人扒出小朋友的妈妈是你们工作人员。"摆拍"的质疑声出来了...虽然不是真的，但解释成本很高。',
            statChanges: { prRisk: 4, fanLoyalty: -3 },
          },
        },
      },
    ],
  },
  {
    id: 'breaking_competitor_fall',
    category: 'breaking',
    severity: 'medium',
    title: '竞争对手突然塌房！',
    description: '你最大的竞争对手刚刚被爆出重大丑闻，全网震动。品牌方们正在紧急寻找替代人选——这是千载难逢的机会，但吃"人血馒头"的风险也不小。',
    emoji: '📰',
    isBreaking: true,
    minDay: 10,
    choices: [
      {
        id: 'seize_opportunity',
        text: '抢夺资源',
        subtext: '主动联系品牌方',
        outcome: {
          narration: '你第一时间联系了对方的三个代言品牌，成功拿下其中两个。效率惊人，钱包也鼓了。',
          statChanges: { money: 140000, commercialValue: 4 },
          conditionalOutcomes: [
            {
              condition: { minFanLoyalty: 60 },
              narration: '你迅速拿下了对方的代言资源。粉丝们欢呼"终于轮到我们了"，但路人觉得"趁人之危不太好"。不过，商业就是商业。',
              statChanges: { money: 140000, commercialValue: 4, prRisk: 3 },
            },
            {
              condition: { maxFanLoyalty: 30 },
              narration: '你试图抢对方的资源，但品牌方查了你的数据...粉丝量太少了，委婉拒绝了。没有粉丝基数，机会来了也接不住。',
              statChanges: { commercialValue: -3 },
            },
          ],
          twist: {
            chance: 0.35,
            narration: '但是！对方粉丝认出了你是第一个来"抢食"的人，集体冲到你的艺人超话下面开骂。一场粉丝混战正在形成。',
            statChanges: { prRisk: 4, fanLoyalty: -3 },
          },
        },
      },
      {
        id: 'show_sympathy',
        text: '表示同情',
        subtext: '发声支持对手',
        outcome: {
          narration: '"希望真相能早日水落石出，也请大家给当事人一些空间。"这条微博让你的艺人收获了巨大的路人好感。',
          statChanges: { fanLoyalty: 4, commercialValue: 3, prRisk: -3 },
        },
      },
      {
        id: 'stay_out',
        text: '完全不表态',
        subtext: '事不关己',
        outcome: {
          narration: '你选择置身事外。几天后，风波平息了。你没吃到红利，但也没沾上麻烦。',
          statChanges: {},
        },
      },
    ],
  },
  {
    id: 'breaking_fan_donation',
    category: 'breaking',
    severity: 'low',
    title: '粉丝以你的名义捐了100万！',
    description: '你的粉丝后援会以艺人名义向某灾区捐了100万善款，消息上了新闻联播！虽然是好事，但这个操作事先没有和你沟通过...',
    emoji: '💰',
    isBreaking: true,
    minDay: 6,
    choices: [
      {
        id: 'match_donation',
        text: '艺人再捐100万',
        subtext: '配捐表诚意 (-100万)',
        requireMinMoney: 70000,
        outcome: {
          narration: '艺人宣布个人再捐100万，"偶像和粉丝双向奔赴"的故事感动了全网。官媒点名表扬。',
          statChanges: { money: -70000, fanLoyalty: 7, prRisk: -5, commercialValue: 4 },
        },
      },
      {
        id: 'thank_fans_donation',
        text: '感谢粉丝善举',
        subtext: '发文称赞粉丝',
        outcome: {
          narration: '艺人发微博感谢粉丝的善举，但有人质疑"100万都让粉丝出，自己一分没捐？"',
          statChanges: { fanLoyalty: 3, prRisk: 3 },
          conditionalOutcomes: [
            {
              condition: { minMoney: 300000 },
              narration: '艺人发了感谢微博。但网友扒出你的艺人身价过千万，"粉丝倒贴100万偶像一分不出"的话题被顶上了热搜。有钱不捐比没钱更扎眼。',
              statChanges: { fanLoyalty: -3, prRisk: 5 },
            },
          ],
        },
      },
    ],
  },
];
