import type { CompanyUpgrade } from '@/types/game';

export const companyUpgradesData: CompanyUpgrade[] = [
  {
    id: 'pr_team',
    name: '公关团队',
    emoji: '🛡️',
    maxLevel: 3,
    costs: [30000, 60000, 100000],
    descriptions: [
      '每日风险自然衰减+1',
      '每日风险自然衰减+2',
      '每日风险自然衰减+3',
    ],
  },
  {
    id: 'data_analysis',
    name: '数据分析',
    emoji: '📊',
    maxLevel: 1,
    costs: [50000],
    descriptions: [
      '事件选项显示数值变化方向提示',
    ],
  },
  {
    id: 'network',
    name: '人脉网络',
    emoji: '🤝',
    maxLevel: 2,
    costs: [40000, 80000],
    descriptions: [
      '商务事件出现概率提升',
      '商务事件出现概率大幅提升',
    ],
  },
  {
    id: 'legal',
    name: '法务部',
    emoji: '💼',
    maxLevel: 1,
    costs: [80000],
    descriptions: [
      '危机事件风险惩罚减少30%',
    ],
  },
];
