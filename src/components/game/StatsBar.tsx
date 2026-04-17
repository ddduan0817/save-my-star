'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';
import { sfxDisaster } from '@/lib/sounds';

const statConfig = [
  { key: 'commercialValue' as const, label: '商业', barClass: 'stat-bar-amber', trackColor: 'bg-amber-100/60', max: 100 },
  { key: 'fanLoyalty' as const, label: '粉丝', barClass: 'stat-bar-pink', trackColor: 'bg-pink-100/60', max: 100 },
  { key: 'prRisk' as const, label: '风险', barClass: 'stat-bar-red', trackColor: 'bg-red-100/60', max: 100, inverse: true },
];

export default function StatsBar() {
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const lastStatChanges = useGameStore(s => s.lastStatChanges);
  const barRef = useRef<HTMLDivElement>(null);
  const prevRiskRef = useRef(stats.prRisk);

  // 风险突破80时震屏
  useEffect(() => {
    if (stats.prRisk >= 80 && prevRiskRef.current < 80) {
      sfxDisaster();
      barRef.current?.classList.add('animate-shake');
      setTimeout(() => barRef.current?.classList.remove('animate-shake'), 500);
    }
    prevRiskRef.current = stats.prRisk;
  }, [stats.prRisk]);

  return (
    <div ref={barRef} className="sticky top-0 z-50 glass-card border-b border-gray-100/60 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-400 bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1 rounded-full shadow-sm shadow-gray-100/50">
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
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -24, scale: 0.8 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
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
        {statConfig.map(({ key, label, barClass, trackColor, max, inverse }) => {
          const value = stats[key];
          const pct = (value / max) * 100;
          const change = lastStatChanges?.[key];
          const isDanger = inverse ? value > 70 : value < 25;

          return (
            <div key={key} className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium text-gray-400">{label}</span>
                <div className="relative">
                  <span className={cn(
                    "text-[11px] font-bold tabular-nums transition-colors duration-300",
                    isDanger ? "text-red-500" : "text-gray-600"
                  )}>
                    {value}
                  </span>
                  {change && change !== 0 && (
                    <motion.span
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -18, scale: 0.8 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
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
              <div className={cn("h-2 rounded-full overflow-hidden", trackColor)}>
                <motion.div
                  className={cn("h-full rounded-full", barClass, isDanger && "animate-pulse")}
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
