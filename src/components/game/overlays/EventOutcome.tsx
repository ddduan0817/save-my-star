'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';
import { sfxPositive, sfxNegative, sfxTwist, sfxClick } from '@/lib/sounds';

interface EventOutcomeProps {
  isTwist?: boolean;
}

export default function EventOutcome({ isTwist = false }: EventOutcomeProps) {
  const narration = useGameStore(s => s.lastOutcomeNarration);
  const statChanges = useGameStore(s => s.lastStatChanges);
  const mentalEffect = useGameStore(s => s.lastMentalEffect);
  const dismissOutcome = useGameStore(s => s.dismissOutcome);
  const dismissTwist = useGameStore(s => s.dismissTwist);
  const pendingTwist = useGameStore(s => s.pendingTwist);

  const changes = statChanges ? Object.entries(statChanges).filter(([, v]) => v && v !== 0) : [];
  const mentalChanges = mentalEffect
    ? Object.entries(mentalEffect).filter(([, v]) => typeof v === 'number' && v !== 0)
    : [];

  const statLabels: Record<string, string> = {
    commercialValue: '商业价值',
    fanLoyalty: '粉丝忠诚',
    prRisk: '舆论风险',
    money: '资金',
  };

  // 心理状态维度：正向方向不同（压力/倦怠"上升"是坏事）
  const mentalMeta: Record<string, { label: string; emoji: string; goodWhenUp: boolean }> = {
    mood: { label: '心情', emoji: '😊', goodWhenUp: true },
    energy: { label: '体力', emoji: '⚡', goodWhenUp: true },
    trust: { label: '信任', emoji: '🤝', goodWhenUp: true },
    cooperation: { label: '配合度', emoji: '🤲', goodWhenUp: true },
    stress: { label: '压力', emoji: '😰', goodWhenUp: false },
    burnout: { label: '倦怠', emoji: '🥵', goodWhenUp: false },
  };

  const handleDismiss = isTwist ? dismissTwist : dismissOutcome;
  const hasTwistPending = !isTwist && !!pendingTwist;

  // 结果出现时播放音效
  useEffect(() => {
    if (isTwist) {
      sfxTwist();
      return;
    }
    // 判断总体结果是正面还是负面
    if (statChanges) {
      const net = (statChanges.commercialValue ?? 0) + (statChanges.fanLoyalty ?? 0)
        - (statChanges.prRisk ?? 0) + ((statChanges.money ?? 0) > 0 ? 1 : (statChanges.money ?? 0) < 0 ? -1 : 0);
      if (net >= 0) sfxPositive();
      else sfxNegative();
    }
  }, [narration, isTwist, statChanges]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        "mx-4 rounded-3xl overflow-hidden",
        isTwist
          ? "ring-2 ring-orange-300/70 bg-gradient-to-b from-orange-50 to-white shadow-lg shadow-orange-100/40"
          : "ring-1 ring-gray-200/60 bg-white shadow-lg shadow-gray-100/40"
      )}
    >
      {/* Twist banner */}
      {isTwist && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white text-xs font-bold px-4 py-2 tracking-widest"
        >
          ⚡ 反转！剧情突变
        </motion.div>
      )}

      <div className="p-5">
        <div className={cn(
          "text-xs font-medium mb-3 tracking-wider",
          isTwist ? "text-orange-500" : "text-gray-300"
        )}>
          {isTwist ? '但是——' : '事件结果'}
        </div>

        {/* Twist dramatic entrance */}
        {isTwist ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">
              {narration}
            </p>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-gray-500 leading-relaxed whitespace-pre-line"
          >
            {narration}
          </motion.p>
        )}

        {/* Stat changes */}
        {changes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {changes.map(([key, value], i) => {
              const v = value as number;
              const isRisk = key === 'prRisk';
              const isPositive = isRisk ? v < 0 : v > 0;
              const displayValue = key === 'money' ? formatMoney(v) : String(v);

              return (
                <motion.div
                  key={key}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 350, damping: 22 }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm",
                    isPositive
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 ring-1 ring-green-200/60"
                      : "bg-gradient-to-r from-red-50 to-orange-50 text-red-500 ring-1 ring-red-200/60"
                  )}
                >
                  {statLabels[key]} {v > 0 ? '+' : ''}{displayValue}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mental state changes — separate row so players can see the psychological cost */}
        {mentalChanges.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] text-gray-300 tracking-wider mb-1.5">艺人状态</div>
            <div className="flex flex-wrap gap-2">
              {mentalChanges.map(([key, value], i) => {
                const v = value as number;
                const meta = mentalMeta[key] ?? { label: key, emoji: '•', goodWhenUp: true };
                const isPositive = meta.goodWhenUp ? v > 0 : v < 0;
                return (
                  <motion.div
                    key={key}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (changes.length + i) * 0.08, type: 'spring', stiffness: 350, damping: 22 }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm",
                      isPositive
                        ? "bg-gradient-to-r from-sky-50 to-indigo-50 text-indigo-600 ring-1 ring-indigo-200/60"
                        : "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-500 ring-1 ring-rose-200/60"
                    )}
                  >
                    <span className="mr-0.5">{meta.emoji}</span>
                    {meta.label} {v > 0 ? '+' : ''}{v}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { sfxClick(); handleDismiss(); }}
          className={cn(
            "w-full mt-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300",
            hasTwistPending
              ? "bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 text-white shadow-md shadow-orange-200/40 hover:shadow-lg hover:shadow-orange-200/60"
              : "bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-600 shadow-sm shadow-gray-100/40"
          )}
        >
          {hasTwistPending ? '但是……' : '返回消息'}
        </motion.button>
      </div>
    </motion.div>
  );
}
