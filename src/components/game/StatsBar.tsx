'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';

const statConfig = [
  { key: 'commercialValue' as const, label: '商业', icon: '💰', color: 'bg-amber-500', max: 100 },
  { key: 'fanLoyalty' as const, label: '粉丝', icon: '💖', color: 'bg-pink-500', max: 100 },
  { key: 'prRisk' as const, label: '风险', icon: '⚠️', color: 'bg-red-500', max: 100, inverse: true },
];

export default function StatsBar() {
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const lastStatChanges = useGameStore(s => s.lastStatChanges);

  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-white/5 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#8888aa]">第 {currentDay} 天</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#8888aa]">💵</span>
          <span className={cn(
            "text-sm font-bold tabular-nums",
            stats.money < 0 ? "text-red-400" : "text-amber-400"
          )}>
            ¥{formatMoney(stats.money)}
          </span>
          {lastStatChanges?.money && lastStatChanges.money !== 0 && (
            <motion.span
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className={cn(
                "text-xs font-bold absolute right-4 -top-1",
                lastStatChanges.money > 0 ? "text-green-400" : "text-red-400"
              )}
            >
              {lastStatChanges.money > 0 ? '+' : ''}{formatMoney(lastStatChanges.money)}
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {statConfig.map(({ key, label, icon, color, max, inverse }) => {
          const value = stats[key];
          const pct = (value / max) * 100;
          const change = lastStatChanges?.[key];
          const isDanger = inverse ? value > 70 : value < 25;

          return (
            <div key={key} className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#8888aa]">{icon} {label}</span>
                <div className="relative">
                  <span className={cn(
                    "text-[11px] font-bold tabular-nums",
                    isDanger ? "text-red-400" : "text-white/80"
                  )}>
                    {value}
                  </span>
                  {change && change !== 0 && (
                    <motion.span
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -16 }}
                      transition={{ duration: 1 }}
                      className={cn(
                        "text-[10px] font-bold absolute -right-1 -top-3",
                        (inverse ? change < 0 : change > 0) ? "text-green-400" : "text-red-400"
                      )}
                    >
                      {change > 0 ? '+' : ''}{change}
                    </motion.span>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", color, isDanger && "animate-pulse")}
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
