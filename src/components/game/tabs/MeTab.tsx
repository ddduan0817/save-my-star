'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import { achievements, loadUnlockedAchievements } from '@/data/achievements';
import { useMemo } from 'react';

function getManagerTitle(day: number, stats: { commercialValue: number; fanLoyalty: number; prRisk: number }): { title: string; emoji: string } {
  if (stats.prRisk > 70) return { title: '危机经纪人', emoji: '🔥' };
  if (day >= 15 && stats.commercialValue >= 60 && stats.fanLoyalty >= 60) return { title: '金牌经纪人', emoji: '🏆' };
  if (day >= 8) return { title: '资深经纪人', emoji: '💼' };
  if (day >= 4) return { title: '初级经纪人', emoji: '👔' };
  return { title: '实习经纪人', emoji: '🐣' };
}

export default function MeTab() {
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const weiboTrends = useGameStore(s => s.weiboTrends);
  const fanComments = useGameStore(s => s.fanComments);
  const artist = useGameStore(s => s.artist);

  const manager = getManagerTitle(currentDay, stats);

  const unlockedIds = useMemo(() => {
    if (typeof window === 'undefined') return new Set<string>();
    return new Set(loadUnlockedAchievements());
  }, []);

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-24">
      {/* Manager Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm text-center"
      >
        <span className="text-4xl">{manager.emoji}</span>
        <div className="text-sm font-bold text-gray-800 mt-2">{manager.title}</div>
        <div className="text-[10px] text-gray-400 mt-1">
          {artist?.name}的经纪人 · 第{currentDay}天
        </div>
      </motion.div>

      {/* Weibo Trending */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="px-4 py-3 border-b border-gray-100/60 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 tracking-wider">微博热搜</span>
          <span className="text-[10px] text-orange-400">🔥 实时</span>
        </div>
        <div>
          {weiboTrends.map((trend) => (
            <div
              key={trend.rank}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0"
            >
              <span className={cn(
                "text-xs font-bold w-5 text-center tabular-nums",
                trend.rank <= 3 ? "text-red-500" : "text-gray-400"
              )}>
                {trend.rank}
              </span>
              <span className="flex-1 text-xs text-gray-700 truncate">{trend.title}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-gray-400">{trend.heat}</span>
                {trend.isHot && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1 rounded">热</span>
                )}
                {trend.sentiment === 'negative' && (
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1 rounded">沸</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Fan Comments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="px-4 py-3 border-b border-gray-100/60">
          <span className="text-xs font-medium text-gray-400 tracking-wider">粉丝评论区</span>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {fanComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-lg shrink-0 mt-0.5">{comment.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-500">{comment.nickname}</span>
                </div>
                <p className={cn(
                  "text-xs mt-0.5",
                  comment.sentiment === 'supportive' ? "text-gray-600"
                    : comment.sentiment === 'angry' ? "text-orange-600"
                    : comment.sentiment === 'hate' ? "text-red-500"
                    : "text-gray-500"
                )}>
                  {comment.content}
                </p>
              </div>
              <span className="text-[10px] text-gray-300 shrink-0 tabular-nums">{comment.likes}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="text-xs font-medium text-gray-400 tracking-wider mb-3">成就柜</div>
        <div className="flex flex-wrap gap-2">
          {achievements.map(ach => {
            const unlocked = unlockedIds.has(ach.id);
            return (
              <div
                key={ach.id}
                title={unlocked ? `${ach.title}: ${ach.description}` : '???'}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all",
                  unlocked
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm ring-1 ring-amber-200/40"
                    : "bg-gray-100 opacity-30 grayscale",
                )}
              >
                {unlocked ? ach.emoji : '?'}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
