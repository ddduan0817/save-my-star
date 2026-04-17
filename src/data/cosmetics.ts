import type { CosmeticProcedure, AppearanceTier } from '@/types/game';

export const cosmeticProcedures: CosmeticProcedure[] = [
  // ===== 轻度 =====
  {
    id: 'skincare_facial',
    name: '光子嫩肤',
    emoji: '✨',
    category: 'light',
    description: '基础医美项目，改善肤质提亮肤色',
    cost: 15000,
    appearanceGain: 5,
    failChance: 0.05,
    discoveryChance: 0.05,
    recoveryDays: 0,
    failAppearanceLoss: 2,
  },
  {
    id: 'micro_injection',
    name: '水光针',
    emoji: '💉',
    category: 'light',
    description: '皮肤注射补水，提升皮肤光泽度',
    cost: 20000,
    appearanceGain: 7,
    failChance: 0.08,
    discoveryChance: 0.10,
    recoveryDays: 0,
    failAppearanceLoss: 3,
  },

  // ===== 中度 =====
  {
    id: 'nose_filler',
    name: '鼻部填充',
    emoji: '👃',
    category: 'medium',
    description: '玻尿酸填充鼻梁，效果立竿见影',
    cost: 40000,
    appearanceGain: 10,
    failChance: 0.15,
    discoveryChance: 0.25,
    recoveryDays: 1,
    failAppearanceLoss: 5,
  },
  {
    id: 'jaw_botox',
    name: '瘦脸针',
    emoji: '💎',
    category: 'medium',
    description: '注射肉毒素瘦脸，打造精致V脸',
    cost: 35000,
    appearanceGain: 8,
    failChance: 0.12,
    discoveryChance: 0.20,
    recoveryDays: 1,
    failAppearanceLoss: 4,
  },

  // ===== 大型 =====
  {
    id: 'double_eyelid',
    name: '双眼皮手术',
    emoji: '👁️',
    category: 'major',
    description: '割双眼皮，眼睛放大效果显著，恢复期较长',
    cost: 60000,
    appearanceGain: 15,
    failChance: 0.20,
    discoveryChance: 0.40,
    recoveryDays: 3,
    failAppearanceLoss: 8,
  },
  {
    id: 'nose_job',
    name: '鼻综合整形',
    emoji: '🏥',
    category: 'major',
    description: '鼻部综合手术，效果脱胎换骨但风险不小',
    cost: 80000,
    appearanceGain: 18,
    failChance: 0.25,
    discoveryChance: 0.50,
    recoveryDays: 4,
    failAppearanceLoss: 12,
  },
  {
    id: 'facial_contour',
    name: '面部轮廓手术',
    emoji: '🔪',
    category: 'major',
    description: '削骨磨腮，脱胎换骨但极高风险',
    cost: 120000,
    appearanceGain: 25,
    failChance: 0.30,
    discoveryChance: 0.60,
    recoveryDays: 5,
    failAppearanceLoss: 15,
  },
];

export const APPEARANCE_TIERS: { tier: AppearanceTier; min: number; label: string; color: string }[] = [
  { tier: 'plain',   min: 0,  label: '素颜清秀', color: 'text-gray-400' },
  { tier: 'fresh',   min: 21, label: '清新自然', color: 'text-green-500' },
  { tier: 'refined', min: 41, label: '精致耐看', color: 'text-blue-500' },
  { tier: 'star',    min: 61, label: '明星脸',   color: 'text-purple-500' },
  { tier: 'top',     min: 81, label: '顶级颜值', color: 'text-amber-500' },
];

// 僵脸触发条件
export const STIFF_FACE_PROCEDURE_THRESHOLD = 3; // 5天内做≥3次
export const STIFF_FACE_WINDOW_DAYS = 5;
export const STIFF_FACE_DURATION_DAYS = 4;
