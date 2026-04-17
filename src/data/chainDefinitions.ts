import type { StoryChainDefinition } from '@/types/game';

export const storyChainDefinitions: StoryChainDefinition[] = [
  // ===== 旧链（5 条） =====
  {
    id: 'chain_tax',
    title: '税务风波',
    emoji: '💰',
    description: '一场突如其来的税务调查，处理方式决定结局',
    totalSteps: 3,
    eventIds: ['chain_tax_1', 'chain_tax_2_investigate', 'chain_tax_2_deny', 'chain_tax_3_clear', 'chain_tax_3_penalty'],
    triggerEventId: 'chain_tax_1',
  },
  {
    id: 'chain_romance',
    title: '恋情曝光',
    emoji: '💕',
    description: '被拍到疑似恋情，公开还是隐藏？',
    totalSteps: 3,
    eventIds: ['chain_romance_1', 'chain_romance_2_public', 'chain_romance_2_secret', 'chain_romance_3_blessing', 'chain_romance_3_breakup'],
    triggerEventId: 'chain_romance_1',
  },
  {
    id: 'chain_variety',
    title: '综艺翻红',
    emoji: '📺',
    description: '综艺节目中的意外表现，能否借势翻红？',
    totalSteps: 2,
    eventIds: ['chain_variety_1', 'chain_variety_2_viral'],
    triggerEventId: 'chain_variety_1',
  },
  {
    id: 'chain_invest',
    title: '投资暴雷',
    emoji: '📉',
    description: '投资项目出了大问题，怎么善后？',
    totalSteps: 3,
    eventIds: ['chain_invest_1', 'chain_invest_2_bad', 'chain_invest_3_aftermath'],
    triggerEventId: 'chain_invest_1',
  },
  {
    id: 'chain_collab',
    title: '跨界合作',
    emoji: '🤝',
    description: '一次跨界合作的机会，成败在此一举',
    totalSteps: 2,
    eventIds: ['chain_collab_1', 'chain_collab_2_success', 'chain_collab_2_flop'],
    triggerEventId: 'chain_collab_1',
  },

  // ===== 新链（4 条） =====
  {
    id: 'chain_reality',
    title: '综艺真人秀',
    emoji: '🎪',
    description: '王牌综艺发来邀请，这是翻红还是翻车？',
    totalSteps: 3,
    eventIds: [
      'chain_reality_1', 'chain_reality_2_regular', 'chain_reality_2_captain',
      'chain_reality_3_finale', 'chain_reality_3_underdog', 'chain_reality_3_controversy',
    ],
    triggerEventId: 'chain_reality_1',
  },
  {
    id: 'chain_fancrisis',
    title: '粉丝危机',
    emoji: '😱',
    description: '私生饭越界了，粉丝生态面临崩塌',
    totalSteps: 3,
    eventIds: [
      'chain_fancrisis_1', 'chain_fancrisis_2_boundary', 'chain_fancrisis_2_escalate',
      'chain_fancrisis_2_backfire', 'chain_fancrisis_3_resolution', 'chain_fancrisis_3_mess',
    ],
    triggerEventId: 'chain_fancrisis_1',
  },
  {
    id: 'chain_empire',
    title: '商业帝国',
    emoji: '🏢',
    description: '自创品牌的机会来了，能否打造商业帝国？',
    totalSteps: 3,
    eventIds: [
      'chain_empire_1', 'chain_empire_2_fashion', 'chain_empire_2_food',
      'chain_empire_3_launch',
    ],
    triggerEventId: 'chain_empire_1',
  },
  {
    id: 'chain_scandal',
    title: '黑料危机',
    emoji: '🕵️',
    description: '匿名爆料帖出现，真相到底是什么？',
    totalSteps: 3,
    eventIds: [
      'chain_scandal_1', 'chain_scandal_2_investigate', 'chain_scandal_2_confess',
      'chain_scandal_2_legal', 'chain_scandal_3_expose', 'chain_scandal_3_settle',
      'chain_scandal_3_redemption', 'chain_scandal_3_court',
    ],
    triggerEventId: 'chain_scandal_1',
  },
];
