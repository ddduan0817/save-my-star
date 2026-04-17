'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';

interface EventOutcomeProps {
  isTwist?: boolean;
}

export default function EventOutcome({ isTwist = false }: EventOutcomeProps) {
  const narration = useGameStore(s => s.lastOutcomeNarration);
  const statChanges = useGameStore(s => s.lastStatChanges);
  const dismissOutcome = useGameStore(s => s.dismissOutcome);
  const dismissTwist = useGameStore(s => s.dismissTwist);
  const pendingTwist = useGameStore(s => s.pendingTwist);

  const changes = statChanges ? Object.entries(statChanges).filter(([, v]) => v && v !== 0) : [];

  const statLabels: Record<string, string> = {
    commercialValue: '商业价值',
    fanLoyalty: '粉丝忠诚',
    prRisk: '舆论风险',
    money: '资金',
  };

  const handleDismiss = isTwist ? dismissTwist : dismissOutcome;
  const hasTwistPending = !isTwist && !!pendingTwist;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "mx-4 rounded-2xl border overflow-hidden",
        isTwist
          ? "border-orange-500/30 bg-[#1a1410]"
          : "border-white/10 bg-[#141420]"
      )}
    >
      {/* Twist banner */}
      {isTwist && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold px-4 py-2 tracking-widest"
        >
          ⚡ 反转！剧情突变！
        </motion.div>
      )}

      <div className="p-5">
        <div className={cn(
          "text-xs mb-3 tracking-wider",
          isTwist ? "text-orange-400" : "text-[#8888aa]"
        )}>
          {isTwist ? '🔄 但是！' : '📋 事件结果'}
        </div>

        {/* Twist dramatic entrance */}
        {isTwist ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-[#eeeeee] leading-relaxed whitespace-pre-line font-medium">
              {narration}
            </p>
          </motion.div>
        ) : (
          <p className="text-sm text-[#ccccdd] leading-relaxed whitespace-pre-line">
            {narration}
          </p>
        )}

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
          onClick={handleDismiss}
          className={cn(
            "w-full mt-5 py-3 rounded-xl text-sm font-medium transition-colors active:scale-[0.98]",
            hasTwistPending
              ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-300"
              : "bg-white/10 hover:bg-white/15"
          )}
        >
          {hasTwistPending ? '但是……' : '继续'}
        </motion.button>
      </div>
    </motion.div>
  );
}
