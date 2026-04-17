'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';

const statConfig = [
  { key: 'commercialValue' as const, label: '商业', color: 'bg-amber-400', trackColor: 'bg-amber-100', max: 100 },
  { key: 'fanLoyalty' as const, label: '粉丝', color: 'bg-pink-400', trackColor: 'bg-pink-100', max: 100 },
  { key: 'prRisk' as const, label: '风险', color: 'bg-red-400', trackColor: 'bg-red-100', max: 100, inverse: true },
];

export default function StatsBar() {
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const lastStatChanges = useGameStore(s => s.lastStatChanges);

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
          Day {currentDay}
        </span>
        <div className="flex items-center gap-1.5 relative">
          <span className={cn(
            "text-sm font-bold tabular-nums",
            stats.money < 0 ? "text-red-500" : "text-amber-600"
          )}>
            ¥{formatMoney(stats.money)}
          </span>
          {lastStatChanges?.money && lastStatChanges.money !== 0 && (
            <motion.span
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className={cn(
                "text-xs font-bold absolute -right-1 -top-3",
                lastStatChanges.money > 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {lastStatChanges.money > 0 ? '+' : ''}{formatMoney(lastStatChanges.money)}
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        {statConfig.map(({ key, label, color, trackColor, max, inverse }) => {
          const value = stats[key];
          const pct = (value / max) * 100;
          const change = lastStatChanges?.[key];
          const isDanger = inverse ? value > 70 : value < 25;

          return (
            <div key={key} className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-gray-500">{label}</span>
                <div className="relative">
                  <span className={cn(
                    "text-[11px] font-bold tabular-nums",
                    isDanger ? "text-red-500" : "text-gray-700"
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
                        (inverse ? change < 0 : change > 0) ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {change > 0 ? '+' : ''}{change}
                    </motion.span>
                  )}
                </div>
              </div>
              <div className={cn("h-1.5 rounded-full overflow-hidden", trackColor)}>
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
