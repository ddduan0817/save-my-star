'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';

export default function EventOutcome() {
  const narration = useGameStore(s => s.lastOutcomeNarration);
  const statChanges = useGameStore(s => s.lastStatChanges);
  const dismissOutcome = useGameStore(s => s.dismissOutcome);

  const changes = statChanges ? Object.entries(statChanges).filter(([, v]) => v && v !== 0) : [];

  const statLabels: Record<string, string> = {
    commercialValue: '商业价值',
    fanLoyalty: '粉丝忠诚',
    prRisk: '舆论风险',
    money: '资金',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-4 rounded-2xl border border-white/10 overflow-hidden bg-[#141420]"
    >
      <div className="p-5">
        <div className="text-xs text-[#8888aa] mb-3 tracking-wider">📋 事件结果</div>
        <p className="text-sm text-[#ccccdd] leading-relaxed whitespace-pre-line">
          {narration}
        </p>

        {/* Stat changes */}
        {changes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {changes.map(([key, value]) => {
              const v = value as number;
              const isRisk = key === 'prRisk';
              const isPositive = isRisk ? v < 0 : v > 0;
              const displayValue = key === 'money' ? formatMoney(v) : String(v);

              return (
                <motion.div
                  key={key}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium",
                    isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  )}
                >
                  {statLabels[key]} {v > 0 ? '+' : ''}{displayValue}
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={dismissOutcome}
          className="w-full mt-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors active:scale-[0.98]"
        >
          继续
        </motion.button>
      </div>
    </motion.div>
  );
}
