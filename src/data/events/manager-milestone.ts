// Lv4（金牌经纪人）专属事件。
// 设计思路：只在玩家累计 XP 400+ 时才会在 activeTags 里出现 'manager_lv4' 标签，
// 这里用它当 requiredTags 的硬门槛，正常的 weighted selector 只会给 “已升到金牌”
// 的玩家看到。内容倾向“行业顶层资源才找你谈”，给高手局一个强烈的升级反馈。

import type { GameEvent } from '@/types/game';

export const managerMilestoneEvents: GameEvent[] = [
  {
    id: 'manager_lv4_poaching',
    category: 'business',
    severity: 'high',
    title: '对家大公司来挖你',
    description:
      '一家比你现在公司大三倍的经纪公司老总亲自约你在陆家嘴吃饭。“我们给你翻倍的底薪、独立工作室、以及……” TA 把一份艺人名单推过来，上面有 3 个你这两年一直仰望的顶流。“带着你的艺人一起过来，资源我们配齐。”',
    emoji: '🪙',
    minDay: 10,
    requiredTags: ['manager_lv4'],
    choices: [
      {
        id: 'manager_lv4_jump',
        text: '跳槽 · 带艺人走',
        subtext: '翻倍底薪 + 顶流资源池',
        outcome: {
          narration:
            '你递了辞职信。新公司兑现了承诺，艺人接到了原本只有顶流才能碰到的年框代言。同行开始在饭局上叫你“总”。',
          statChanges: { money: 180000, commercialValue: 8, prRisk: 3 },
          unlockTag: 'manager_lv4_jumped',
        },
      },
      {
        id: 'manager_lv4_counter',
        text: '用 offer 跟现公司谈涨薪',
        subtext: '博一笔签字费',
        outcome: {
          narration:
            '你把 offer 拍在 CEO 桌上。对方沉默了十秒，第二天给你批了签字费和股权，但所有人都知道你心已经在外面了。',
          statChanges: { money: 90000, commercialValue: 3 },
          unlockTag: 'manager_lv4_countered',
          twist: {
            chance: 0.25,
            narration:
              '两周后 CEO 借故把你调离了艺人一线，“升你做总监，去管新人吧”。体面的流放。',
            statChanges: { commercialValue: -4, fanLoyalty: -2 },
          },
        },
      },
      {
        id: 'manager_lv4_loyal',
        text: '婉拒 · 把艺人当自己人',
        subtext: '“带不走，TA 是我签下来的”',
        outcome: {
          narration:
            '你礼貌地推掉了。艺人第二天听说后给你发了一条长语音，“我以为你会走。” 你们两个的信任第一次有了那种“过命”的颜色。',
          statChanges: { fanLoyalty: 4, commercialValue: 2 },
          unlockTag: 'manager_lv4_stayed',
          mentalEffect: { trust: 8, cooperation: 4 },
        },
      },
    ],
  },
  {
    id: 'manager_lv4_tycoon_dinner',
    category: 'business',
    severity: 'high',
    title: '资本局 · 一桌顶流的经纪人',
    description:
      '你被某平台副总裁拉进了一个只有 6 个人的饭局，在座的每一位，带的都是年度 S+ 项目的艺人。副总裁碰杯时说：“咱们这一桌，可以决定明年谁能进到那几个剧组。” 所有人都看着你。',
    emoji: '🥂',
    minDay: 10,
    requiredTags: ['manager_lv4'],
    choices: [
      {
        id: 'manager_lv4_pitch',
        text: '当场推艺人 · 拿项目',
        subtext: '赌一把',
        outcome: {
          narration:
            '你把艺人的 demo 当场摆出来。副总裁看了 20 秒，点头：“S+ 第三番位可以给 TA。” 席间其他经纪人露出了“这人是什么路子”的眼神。',
          statChanges: { commercialValue: 10, money: 60000, prRisk: 4 },
          unlockTag: 'manager_lv4_pitched',
        },
      },
      {
        id: 'manager_lv4_trade_favors',
        text: '互换资源 · 做局内人',
        subtext: '答应帮对方压热搜',
        outcome: {
          narration:
            '你答应了帮忙。作为回报，对方帮你把艺人送上了某热播综艺的常驻。你已经不再是孤军奋战的经纪人了，你在局里了。',
          statChanges: { commercialValue: 5, prRisk: 6, fanLoyalty: -2 },
          unlockTag: 'manager_lv4_dealmaker',
        },
      },
      {
        id: 'manager_lv4_leave_early',
        text: '早退 · “艺人还在等我”',
        subtext: '拒绝进局',
        outcome: {
          narration:
            '你放下酒杯走了。第二天饭局在圈里传开，“那个经纪人居然真的走了。” 你艺人在车里问你怎么了，你只说了一句：“不是所有饭局都值得。”',
          statChanges: { fanLoyalty: 3, prRisk: -2 },
          mentalEffect: { trust: 5 },
          unlockTag: 'manager_lv4_walked_away',
        },
      },
    ],
  },
];
