import type { GameEvent } from '@/types/game';

export const insaneEvents: GameEvent[] = [
  {
    id: 'insane_fake_stalker',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    title: '【理智崩溃】造神计划',
    description: '看着惨淡的数据，你脑子里冒出一个疯狂的想法：自导自演一场私生饭跟踪事件，用虐粉来固粉。',
    emoji: '🎭',
    choices: [
      {
        id: 'do_it',
        text: '立刻雇人去酒店蹲点演戏',
        outcome: {
          narration: '热搜爆了。粉丝心疼得疯狂做数据，忠诚度瞬间拉满。但这颗雷，埋下了。',
          statChanges: { fanLoyalty: 100, prRisk: -20 },
          unlockTag: 'fake_stalker_bomb'
        }
      }
    ]
  },
  {
    id: 'insane_leak_rival',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    title: '【理智崩溃】围魏救赵',
    description: '公关部束手无策，为了压下现在的热搜，你决定把对家影帝的致命黑料匿名发给狗仔。',
    emoji: '💣',
    choices: [
      {
        id: 'leak_it',
        text: '按下发送键，让他替我们死',
        outcome: {
          narration: '全网都在吃新瓜，你们的危机瞬间解除了。但业内都知道是你干的，你上了资本的黑名单。',
          statChanges: { prRisk: -100 },
          unlockTag: 'industry_enemy'
        }
      }
    ]
  },
  {
    id: 'insane_extreme_pua',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    title: '【理智崩溃】PUA 大师',
    description: '艺人抱怨太累，你直接把两亿违约金合同拍在桌上：“想走？先把钱结了。”',
    emoji: '👹',
    choices: [
      {
        id: 'threaten',
        text: '冷酷地逼迫TA服从',
        outcome: {
          narration: '艺人被吓住了，彻底变成了听话的机器。但TA的眼神里，有什么东西死掉了。',
          statChanges: { commercialValue: 20 },
          mentalEffect: { cooperation: 100, burnout: 80, stress: 80, mood: -100, trust: -100 }
        }
      }
    ]
  },
  {
    id: 'insane_scorched_earth',
    category: 'crisis',
    severity: 'critical',
    isBreaking: true,
    title: '【理智崩溃】同归于尽',
    description: '公司高层让你引咎辞职来平息众怒。你看着抽屉里的阴阳合同副本，冷笑了一声。',
    emoji: '🔥',
    choices: [
      {
        id: 'report_all',
        text: '实名举报，大家一起死',
        outcome: {
          narration: '你带着材料走进了税务局。',
          statChanges: {},
          unlockTag: 'trigger_flipped_board'
        }
      }
    ]
  }
];
