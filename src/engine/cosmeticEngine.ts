import type { CosmeticProcedure, CosmeticState, CosmeticRecord, StatChange } from '@/types/game';
import {
  STIFF_FACE_PROCEDURE_THRESHOLD,
  STIFF_FACE_WINDOW_DAYS,
  STIFF_FACE_DURATION_DAYS,
  APPEARANCE_TIERS,
} from '@/data/cosmetics';

export interface ProcedureResult {
  newCosmeticState: CosmeticState;
  statChanges: StatChange;
  narration: string;
  succeeded: boolean;
  wasDiscovered: boolean;
}

/**
 * 判断是否触发僵脸
 */
function checkStiffFace(history: CosmeticRecord[], currentDay: number): boolean {
  const recentCount = history.filter(
    r => currentDay - r.day <= STIFF_FACE_WINDOW_DAYS
  ).length;
  return recentCount >= STIFF_FACE_PROCEDURE_THRESHOLD;
}

/**
 * 执行医美项目
 */
export function resolveProcedure(
  procedure: CosmeticProcedure,
  state: CosmeticState,
  currentDay: number,
): ProcedureResult {
  // 僵脸中时失败率提高 15%
  const effectiveFailChance = state.stiffFaceActive
    ? Math.min(procedure.failChance + 0.15, 0.80)
    : procedure.failChance;

  const succeeded = Math.random() >= effectiveFailChance;
  const wasDiscovered = Math.random() < procedure.discoveryChance;

  let newAppearance = state.appearance;
  const statChanges: StatChange = {};
  let narration: string;

  if (succeeded) {
    newAppearance = Math.min(100, newAppearance + procedure.appearanceGain);

    if (wasDiscovered) {
      // 成功但被发现
      const riskAdd = procedure.category === 'major' ? 12 : procedure.category === 'medium' ? 8 : 5;
      const fanLoss = procedure.category === 'major' ? -6 : procedure.category === 'medium' ? -4 : -2;
      statChanges.prRisk = riskAdd;
      statChanges.fanLoyalty = fanLoss;
      narration = `手术很成功，颜值+${procedure.appearanceGain}！但是……你的艺人被拍到走出医美机构，"整容实锤"的话题正在发酵。`;
    } else {
      narration = `${procedure.name}效果很好！颜值+${procedure.appearanceGain}。没有引起任何注意，一切悄悄进行。`;
    }
  } else {
    // 失败
    newAppearance = Math.max(0, newAppearance - procedure.failAppearanceLoss);
    const extraCost = Math.round(procedure.cost * 0.3);
    statChanges.prRisk = 5;
    statChanges.money = -extraCost;

    if (wasDiscovered) {
      statChanges.prRisk = 15;
      statChanges.fanLoyalty = -8;
      narration = `手术失败了！颜值-${procedure.failAppearanceLoss}，还额外花了¥${(extraCost / 10000).toFixed(1)}万处理并发症。更糟糕的是，整件事被媒体曝光了——"整容翻车"冲上热搜。`;
    } else {
      narration = `手术出了问题……颜值-${procedure.failAppearanceLoss}，还额外花了¥${(extraCost / 10000).toFixed(1)}万处理并发症。好在没有被发现。`;
    }
  }

  // 记录
  const record: CosmeticRecord = {
    procedureId: procedure.id,
    day: currentDay,
    succeeded,
    wasDiscovered,
  };
  const newHistory = [...state.procedureHistory, record];

  // 检查僵脸
  let stiffFaceActive = state.stiffFaceActive;
  let stiffFaceDaysRemaining = state.stiffFaceDaysRemaining;
  if (!stiffFaceActive && checkStiffFace(newHistory, currentDay)) {
    stiffFaceActive = true;
    stiffFaceDaysRemaining = STIFF_FACE_DURATION_DAYS;
    narration += '\n\n⚠️ 做太多了！你的艺人脸开始变僵，表情不自然。接下来几天商业和粉丝收益会下降20%。';
  }

  const newCosmeticState: CosmeticState = {
    appearance: newAppearance,
    procedureHistory: newHistory,
    stiffFaceActive,
    stiffFaceDaysRemaining,
    recoveryDaysRemaining: procedure.recoveryDays,
  };

  return { newCosmeticState, statChanges, narration, succeeded, wasDiscovered };
}

/**
 * 每日递减恢复天数和僵脸天数
 */
export function tickCosmeticState(state: CosmeticState): CosmeticState {
  let { recoveryDaysRemaining, stiffFaceActive, stiffFaceDaysRemaining } = state;

  if (recoveryDaysRemaining > 0) {
    recoveryDaysRemaining -= 1;
  }
  if (stiffFaceDaysRemaining > 0) {
    stiffFaceDaysRemaining -= 1;
    if (stiffFaceDaysRemaining === 0) {
      stiffFaceActive = false;
    }
  }

  return { ...state, recoveryDaysRemaining, stiffFaceActive, stiffFaceDaysRemaining };
}

/**
 * 颜值 → 商业/粉丝正向收益倍率
 */
export function getAppearanceMultiplier(appearance: number): number {
  if (appearance <= 20) return 0.85;
  if (appearance <= 40) return 0.95;
  if (appearance <= 60) return 1.00;
  if (appearance <= 80) return 1.10;
  return 1.20;
}

/**
 * 颜值 → 等级标签
 */
export function getAppearanceTier(appearance: number) {
  let result = APPEARANCE_TIERS[0];
  for (const tier of APPEARANCE_TIERS) {
    if (appearance >= tier.min) result = tier;
  }
  return result;
}
