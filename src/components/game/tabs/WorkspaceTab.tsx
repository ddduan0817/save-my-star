'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn, formatMoney } from '@/lib/utils';
import { companyUpgradesData } from '@/data/upgrades';
import { sfxClick, sfxMoney } from '@/lib/sounds';

const FAME_LABELS: Record<string, { text: string; color: string }> = {
  low: { text: '低迷', color: 'text-gray-400' },
  medium: { text: '中等', color: 'text-amber-500' },
  high: { text: '当红', color: 'text-orange-500' },
  top: { text: '顶流', color: 'text-red-500' },
};

export default function WorkspaceTab() {
  const stats = useGameStore(s => s.stats);
  const companyUpgrades = useGameStore(s => s.companyUpgrades);
  const purchaseUpgrade = useGameStore(s => s.purchaseUpgrade);
  const rival = useGameStore(s => s.rival);
  const cosmeticState = useGameStore(s => s.cosmeticState);

  // Active buffs
  const activeBuffs: string[] = [];
  if (companyUpgrades.pr_team > 0) activeBuffs.push(`🛡️ 风险衰减+${companyUpgrades.pr_team}/天`);
  if (companyUpgrades.data_analysis > 0) activeBuffs.push('📊 数值预览已开启');
  if (companyUpgrades.network > 0) activeBuffs.push(`🤝 商务加成Lv${companyUpgrades.network}`);
  if (companyUpgrades.legal > 0) activeBuffs.push('💼 危机减伤30%');
  if (cosmeticState.stiffFaceActive) activeBuffs.push(`😶 僵脸中(${cosmeticState.stiffFaceDaysRemaining}天)`);

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-24">
      {/* Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="text-xs font-medium text-gray-400 tracking-wider mb-3">财务概览</div>
        <div className="text-center">
          <div className="text-[10px] text-gray-400 mb-1">当前资金</div>
          <div className={cn(
            "text-3xl font-black tabular-nums",
            stats.money < 0 ? "text-red-500" : "text-amber-600"
          )}>
            ¥{formatMoney(stats.money)}
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="text-[10px] text-red-400 bg-red-50 px-2 py-1 rounded-full">
              日支出 ¥5,000
            </div>
            <div className="text-[10px] text-green-500 bg-green-50 px-2 py-1 rounded-full">
              {stats.fanLoyalty > 80 ? '粉丝收入 +¥3,000' : '粉丝收入 --'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Buffs */}
      {activeBuffs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex flex-wrap gap-1.5 px-1">
            {activeBuffs.map((buff, i) => (
              <span key={i} className="text-[10px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full ring-1 ring-green-100/60">
                {buff}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Rival Intel */}
      {rival && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
        >
          <div className="text-xs font-medium text-gray-400 tracking-wider mb-3">对手情报</div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-2xl">
              {rival.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">{rival.name}</span>
                <span className={cn("text-[10px] font-semibold", FAME_LABELS[rival.fameLevel]?.color)}>
                  {FAME_LABELS[rival.fameLevel]?.text}
                </span>
              </div>
              {/* Aggression bar */}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-gray-400 w-8 shrink-0">攻击性</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      rival.aggression > 70 ? "bg-red-400" : rival.aggression > 40 ? "bg-amber-400" : "bg-green-400"
                    )}
                    initial={false}
                    animate={{ width: `${rival.aggression}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 w-5 text-right tabular-nums">{rival.aggression}</span>
              </div>
            </div>
          </div>
          {/* Recent rival actions */}
          {rival.actionsLog.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5">
              {rival.actionsLog.slice(-3).reverse().map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="text-gray-300">Day {log.day}</span>
                  <span className={cn(
                    "flex-1 truncate",
                    log.affectedYou ? "text-red-400" : "text-gray-400"
                  )}>
                    {log.title}
                    {log.affectedYou && ' ⚡'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Company Upgrades */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="text-xs font-medium text-gray-400 tracking-wider mb-3">公司升级</div>
        <div className="grid grid-cols-1 gap-3">
          {companyUpgradesData.map(upgrade => {
            const currentLevel = companyUpgrades[upgrade.id] ?? 0;
            const isMaxed = currentLevel >= upgrade.maxLevel;
            const nextCost = isMaxed ? 0 : upgrade.costs[currentLevel];
            const canAfford = stats.money >= nextCost;

            return (
              <div
                key={upgrade.id}
                className={cn(
                  "p-3.5 rounded-xl border transition-all",
                  isMaxed
                    ? "border-green-100/60 bg-green-50/30"
                    : "border-gray-100/60",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-lg shrink-0">
                    {upgrade.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{upgrade.name}</span>
                      {/* Level dots */}
                      <div className="flex gap-0.5">
                        {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              i < currentLevel ? "bg-green-400" : "bg-gray-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {isMaxed ? '已满级' : upgrade.descriptions[currentLevel]}
                    </div>
                  </div>

                  {!isMaxed && (
                    <motion.button
                      whileHover={canAfford ? { scale: 1.05 } : undefined}
                      whileTap={canAfford ? { scale: 0.95 } : undefined}
                      onClick={() => {
                        if (!canAfford) return;
                        sfxClick();
                        sfxMoney();
                        purchaseUpgrade(upgrade.id);
                      }}
                      disabled={!canAfford}
                      className={cn(
                        "shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
                        canAfford
                          ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-sm"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed",
                      )}
                    >
                      ¥{formatMoney(nextCost)}
                    </motion.button>
                  )}

                  {isMaxed && (
                    <span className="shrink-0 text-[10px] font-medium text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                      MAX
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
