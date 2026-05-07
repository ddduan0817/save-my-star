// 心理状态阈值触发的"被动事件"。
// 不进入普通事件池竞争，而是在 selectEventsForDay 里根据 mentalState 阈值
// 强制注入为当日第一条消息（参考 milestone / trouble 注入模式）。
//
// 阈值 → 事件 ID 的映射在 selectEventsForDay 里维护，这里只放事件数据。

import type { GameEvent } from '@/types/game';

export const mentalTriggerEvents: GameEvent[] = [
  // ===== 触发条件：mood < 20 连续 3 天 =====
  {
    id: 'mental_trigger_insomnia_post',
    category: 'crisis',
    severity: 'medium',
    title: '艺人凌晨发了一条诡异的微博',
    description: '凌晨3:47，TA发了一句歌词："如果我消失了，会有人记得我吗？"配图是窗外漆黑的天。3分钟内没删。粉丝群已经炸了，#XX怎么了# 正在以肉眼可见的速度往热搜爬。',
    emoji: '🌑',
    minDay: 5,
    choices: [
      {
        id: 'force_delete',
        text: '团队内部直接秒删',
        subtext: '不解释',
        outcome: {
          narration: '微博被删了，但截图已经满天飞。"心虚删博"的话题反而比原文更火。TA冷冷发来一句："哦，知道了。"',
          statChanges: { prRisk: 5, fanLoyalty: -3 },
          mentalEffect: { mood: -10, trust: -20, stress: 8 },
        },
      },
      {
        id: 'rush_to_artist',
        text: '立刻打车去TA家',
        subtext: '凌晨4点',
        outcome: {
          narration: '你按了40分钟门铃才有人开。TA披着毯子坐在沙发上，眼睛肿得像桃子。你陪着喝了一晚上奶茶，没说工作的事。第二天TA主动发了"昨天矫情了，谢谢大家关心"。',
          statChanges: { fanLoyalty: 4, prRisk: -3 },
          mentalEffect: { mood: 18, trust: 25, stress: -15, burnout: -8 },
        },
      },
      {
        id: 'pr_spin',
        text: '让团队发"剧本台词截屏"圆场',
        subtext: '商业公关',
        outcome: {
          narration: '通稿发出去了——"原来是新剧台词"。粉丝信了一半，但路人议论"硬洗"。TA看到通稿冷笑："连这种事也要演。"',
          statChanges: { prRisk: 2, commercialValue: 1 },
          mentalEffect: { trust: -15, mood: -8, cooperation: -10 },
        },
      },
      {
        id: 'let_it_breathe',
        text: '不删，让TA自己处理',
        subtext: '尊重',
        outcome: {
          narration: '一小时后TA自己发了："睡不着随便发的，吓到大家了对不起。"评论区清一色"哥/姐你要好好的"。这种真实反而拉了好感。',
          statChanges: { fanLoyalty: 6, commercialValue: 2 },
          mentalEffect: { mood: 12, trust: 18, stress: -10 },
        },
      },
    ],
  },

  // ===== 触发条件：trust < 15 =====
  {
    id: 'mental_trigger_bypass_manager',
    category: 'crisis',
    severity: 'high',
    title: '品牌方直接联系了艺人',
    description: '某代言品牌的市场总监发了你一条微信："你艺人昨晚私下加了我微信，说以后报价直接谈，不走经纪公司。"——你的艺人在你毫不知情的情况下，开始绕过你了。',
    emoji: '📵',
    minDay: 8,
    choices: [
      {
        id: 'confront_artist',
        text: '当面质问"你想干嘛？"',
        subtext: '强硬',
        outcome: {
          narration: 'TA冷冷地说："你抽成20%，我自己谈能多拿15%，凭什么不？"信任彻底破碎。之后但凡有合作，TA都会越过你直接对接。',
          statChanges: { commercialValue: -8, prRisk: 3 },
          mentalEffect: { trust: -15, cooperation: -25, mood: -10, stress: 10 },
        },
      },
      {
        id: 'lobby_brand',
        text: '私下让品牌方"配合一下"',
        subtext: '截胡',
        outcome: {
          narration: '品牌方答应了，但艺人很快发现合作还是经过你的手。TA觉得你在背后玩手段，关系跌到冰点。',
          statChanges: { commercialValue: 2 },
          mentalEffect: { trust: -25, cooperation: -15, mood: -8 },
        },
      },
      {
        id: 'soul_search',
        text: '约TA吃饭，认真聊一次',
        subtext: '先不谈钱',
        outcome: {
          narration: '吃了三个小时，TA说了很多——你只关心数据、从不问TA累不累、把TA当摇钱树。你没辩解，认真听完，然后说："以后每周三晚上不安排工作，我们就吃饭聊天，不谈合同。"TA愣了一下，眼眶红了。',
          statChanges: { commercialValue: -2, fanLoyalty: 3 },
          mentalEffect: { trust: 35, mood: 15, cooperation: 15, stress: -10 },
        },
      },
      {
        id: 'rewrite_contract',
        text: '主动提出降低分成、放权部分接洽',
        subtext: '让利',
        outcome: {
          narration: '你把分成从20%降到12%，并允许TA自主接洽小型合作。TA表情复杂："你早这么干会少很多麻烦。"信任在缓慢回流。',
          statChanges: { money: -50000, commercialValue: -2 },
          mentalEffect: { trust: 25, cooperation: 18, mood: 10 },
        },
      },
    ],
  },

  // ===== 触发条件：burnout > 80 =====
  {
    id: 'mental_trigger_quit_screenshot',
    category: 'crisis',
    severity: 'critical',
    title: '"我真的不想干了"截图流出',
    description: 'TA和好友的聊天记录被流出——"经纪人天天逼我营业""每天都在演别人想看的我""攒够这一笔我就跑路"。截图正在饭圈四散传播，#XX想退圈# 已经冲到热搜第8。',
    emoji: '📲',
    minDay: 10,
    choices: [
      {
        id: 'deny_screenshot',
        text: '通稿"P图诬陷"，律师函警告',
        subtext: '硬扛',
        outcome: {
          narration: '通稿发了，但聊天记录字体、时间戳全部对得上，路人一眼就看出是真的。TA本人沉默不发声，热搜越挂越久。',
          statChanges: { prRisk: 12, fanLoyalty: -8 },
          mentalEffect: { trust: -20, burnout: 5, mood: -10, stress: 15 },
        },
      },
      {
        id: 'admit_and_apologize',
        text: '让TA亲自道歉，承认压力大',
        subtext: '走真实路线',
        outcome: {
          narration: 'TA发了一条长文，承认那段话是真的，但解释是低谷期的发泄。粉丝有的脱粉，有的反而抱得更紧。"原来TA也是普通人"成了新热搜。',
          statChanges: { prRisk: -3, fanLoyalty: -2, commercialValue: -3 },
          mentalEffect: { mood: 8, stress: -12, burnout: -10, trust: 12 },
        },
      },
      {
        id: 'force_hiatus',
        text: '直接安排休假1个月，停掉所有工作',
        subtext: '损失代言',
        outcome: {
          narration: '你单方面取消了未来一个月的所有行程。代言违约金赔得心疼，但TA第一次主动给你发了"谢谢"。',
          statChanges: { money: -120000, commercialValue: -5 },
          mentalEffect: { burnout: -30, stress: -25, energy: 25, trust: 20, mood: 18 },
        },
      },
      {
        id: 'gaslight_artist',
        text: '内部施压："现在退出违约金1500万"',
        subtext: '威胁',
        outcome: {
          narration: 'TA没说话，但你能看出眼神死了。之后的工作TA都按部就班完成，但再也没有主动跟你说过一句话。',
          statChanges: { commercialValue: 3, prRisk: 2 },
          mentalEffect: { burnout: 10, trust: -30, mood: -20, cooperation: -20 },
        },
      },
    ],
  },

  // ===== 触发条件：stress > 85 && energy < 20 =====
  {
    id: 'mental_trigger_breakdown_live',
    category: 'crisis',
    severity: 'critical',
    title: '综艺现场情绪崩溃',
    description: '录制到一半，主持人开了个老梗玩笑，TA突然安静下来，然后开始无声流泪。导播切了画面但已经晚了——花絮组的工作人员把片段录了下来，半小时后流出。#XX综艺崩溃# 直接冲到热搜第3。',
    emoji: '😭',
    minDay: 12,
    choices: [
      {
        id: 'spin_as_acting',
        text: '通稿："为剧情入戏太深"',
        subtext: '硬洗',
        outcome: {
          narration: '没人信。综艺里又不是演戏。"经纪人在洗"成了新热搜。TA本人看完通稿：" 你连我哭都要拿来用。"',
          statChanges: { prRisk: 8, fanLoyalty: -5 },
          mentalEffect: { mood: -15, trust: -25, stress: 5 },
        },
      },
      {
        id: 'public_apology_for_artist',
        text: '替TA发声："最近压力太大，请大家给点空间"',
        subtext: '坦诚',
        outcome: {
          narration: '微博发出去后，路人破天荒地一边倒地理解。"明星也是人""愿意给TA时间"刷屏。但商务方面，三个还在洽谈的代言原地暂停。',
          statChanges: { fanLoyalty: 8, commercialValue: -8, prRisk: -5 },
          mentalEffect: { stress: -15, burnout: -10, trust: 18, mood: 10 },
        },
      },
      {
        id: 'private_clinic',
        text: '安排TA做心理评估，对外保密',
        subtext: '医疗介入',
        outcome: {
          narration: '医生诊断为重度焦虑+轻度抑郁，建议立刻停工治疗。你按住了所有商务，把TA安排到外地疗养。两周后TA给你发了一张海边日出的照片。',
          statChanges: { money: -80000, commercialValue: -6 },
          mentalEffect: { stress: -30, energy: 30, burnout: -20, mood: 20, trust: 25 },
        },
      },
      {
        id: 'push_through',
        text: '让TA加录补救镜头："今天必须录完"',
        subtext: '赶进度',
        outcome: {
          narration: '后半场TA强撑着完成了，但状态肉眼可见地差。导演组心疼，节目组直接发声明"理解艺人"——但这反衬出经纪人冷血。你被骂上了热搜词条。',
          statChanges: { prRisk: 10, fanLoyalty: -8, commercialValue: 2 },
          mentalEffect: { stress: 15, burnout: 15, energy: -15, trust: -25, cooperation: -20 },
        },
      },
    ],
  },
];

/**
 * 阈值判定 —— 在 selectEventsForDay 里调用。
 * 返回应该触发的事件 ID 列表（可能为空）。
 *
 * 注意：每个 trigger 只在阈值"刚被跨过"时触发一次，借助 eventUsageMap 去重
 * （selectEventsForDay 里 isEventEligible 已经实现了 EVENT_COOLDOWN=999 的"单局不重复"）。
 */
export function getActiveMentalTriggers(args: {
  mood: number;
  trust: number;
  burnout: number;
  stress: number;
  energy: number;
  lowMoodStreak: number;
}): string[] {
  const ids: string[] = [];
  if (args.lowMoodStreak >= 3) ids.push('mental_trigger_insomnia_post');
  if (args.trust < 15) ids.push('mental_trigger_bypass_manager');
  if (args.burnout > 80) ids.push('mental_trigger_quit_screenshot');
  if (args.stress > 85 && args.energy < 20) ids.push('mental_trigger_breakdown_live');
  return ids;
}

export const mentalTriggerIds = new Set(mentalTriggerEvents.map(e => e.id));
