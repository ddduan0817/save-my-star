import type { ScheduleActivity } from '@/types/game';

export const scheduleActivities: ScheduleActivity[] = [
  {
    id: 'filming',
    name: '拍戏',
    emoji: '🎬',
    description: '参与影视剧拍摄，提升商业价值',
    durationDays: 2,
    statChanges: { commercialValue: 4 },
  },
  {
    id: 'variety',
    name: '上综艺',
    emoji: '📺',
    description: '参加综艺节目，涨粉但可能引发话题',
    durationDays: 1,
    statChanges: { fanLoyalty: 3, prRisk: 1 },
  },
  {
    id: 'endorsement',
    name: '接代言',
    emoji: '💄',
    description: '拍摄品牌广告，赚钱但有翻车风险',
    durationDays: 1,
    statChanges: { money: 30000, prRisk: 1 },
  },
  {
    id: 'rest',
    name: '休息',
    emoji: '🛏️',
    description: '让艺人休息调整，降低风险',
    durationDays: 1,
    statChanges: { prRisk: -4, commercialValue: -1 },
  },
  {
    id: 'training',
    name: '训练充电',
    emoji: '📚',
    description: '参加培训课程，稳步提升实力',
    durationDays: 1,
    statChanges: { commercialValue: 1, fanLoyalty: 1, prRisk: -1 },
  },
];
