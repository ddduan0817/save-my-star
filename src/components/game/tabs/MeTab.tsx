'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import {
  MANAGER_LEVELS,
  getLevelFromXp,
  getNextLevel,
  getLevelProgress,
  matchSpecialTitle,
} from '@/engine/managerProgression';

export default function MeTab() {
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const weiboTrends = useGameStore(s => s.weiboTrends);
  const fanComments = useGameStore(s => s.fanComments);
  const artist = useGameStore(s => s.artist);
  const dailyLedger = useGameStore(s => s.dailyLedger);
  const managerXp = useGameStore(s => s.managerXp);
  const recentXpDeltas = useGameStore(s => s.recentXpDeltas);

  // 先看特殊称号（状态异常 overlay 在普通等级之上）
  const special = matchSpecialTitle(stats);
  const level = getLevelFromXp(managerXp);
  const nextLevel = getNextLevel(level.lv);
  const progress = getLevelProgress(managerXp, level.lv);
  const recentNet = recentXpDeltas.reduce((a, b) => a + b, 0);
  const slumping = recentXpDeltas.length === 3 && recentNet < 0;

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-24">
      {/* Manager Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      >
        {special ? (
          // 特殊称号卡 —— 显眼红色，覆盖普通等级
          <div className="text-center">
            <span className="text-4xl">{special.emoji}</span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm font-bold text-gray-800">{special.title}</span>
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                状态异常
              </span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1.5">
              {artist?.name}的经纪人 · 第{currentDay}天
            </div>
            <div className="text-[10px] text-red-400 mt-1">
              原等级 {level.title}（Lv.{level.lv}）· 先把状态扳回来
            </div>
          </div>
        ) : (
          <div>
            {/* 头部：emoji + 等级 + XP */}
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{level.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-800 truncate">{level.title}</span>
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full shrink-0">
                    Lv.{level.lv}
                  </span>
                  {level.lv === MANAGER_LEVELS.length && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full shrink-0">
                      MAX
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                  {level.hint}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-gray-400">经验</div>
                <div className="text-xs font-bold text-gray-700 tabular-nums">
                  {managerXp}
                  {nextLevel && <span className="text-gray-300"> / {nextLevel.minXp}</span>}
                </div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mt-3">
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-orange-300 to-orange-500"
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-400">
                  {nextLevel
                    ? `距离${nextLevel.title}还差 ${Math.max(0, nextLevel.minXp - managerXp)} 经验`
                    : '已达最高等级 · 结局有专属彩蛋'}
                </span>
                <span className="text-[10px] text-gray-400">
                  第{currentDay}天
                </span>
              </div>
            </div>

            {/* 状态滑坡提示 */}
            {slumping && (
              <div className="mt-3 px-3 py-1.5 bg-amber-50 rounded-lg text-[10px] text-amber-600 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>最近 3 天状态滑坡（净 {recentNet} XP）· 老板在看你</span>
              </div>
            )}

            <div className="mt-3 text-[10px] text-gray-400 text-center">
              {artist?.name}的经纪人
            </div>
          </div>
        )}
      </motion.div>


      {/* Daily Ledger 今日账单 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-100/60 shadow-sm"
      >
        <div className="px-4 py-3 border-b border-gray-100/60 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 tracking-wider">今日账单</span>
          <span className="text-[10px] text-gray-400">
            第{currentDay}天
          </span>
        </div>
        {dailyLedger.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-gray-300">暂无收支记录</div>
        ) : (
          <>
            <div>
              {dailyLedger.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
                      entry.amount > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    )}>
                      {entry.amount > 0 ? '收入' : '支出'}
                    </span>
                    <span className="text-xs text-gray-600 truncate">{entry.label}</span>
                  </div>
                  <span className={cn(
                    "text-xs font-medium tabular-nums shrink-0 ml-2",
                    entry.amount > 0 ? "text-green-600" : "text-red-500"
                  )}>
                    {entry.amount > 0 ? '+' : ''}{entry.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            {/* Summary row */}
            <div className="px-4 py-2.5 bg-gray-50/80 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">今日净收入</span>
              {(() => {
                const total = dailyLedger.reduce((sum, e) => sum + e.amount, 0);
                return (
                  <span className={cn(
                    "text-xs font-bold tabular-nums",
                    total > 0 ? "text-green-600" : total < 0 ? "text-red-500" : "text-gray-500"
                  )}>
                    {total > 0 ? '+' : ''}{total.toLocaleString()}
                  </span>
                );
              })()}
            </div>
          </>
        )}
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
              <span className="shrink-0 mt-0.5">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill={comment.avatar} />
                  <circle cx="20" cy="16" r="7" fill="white" />
                  <path d="M6 44C6 30.27 13.37 24 20 24C26.63 24 34 30.27 34 44H6Z" fill="white" />
                </svg>
              </span>
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
              <div className="flex items-center gap-0.5 shrink-0">
                <span className="text-[10px] text-gray-300">♥</span>
                <span className="text-[10px] text-gray-300 tabular-nums">{comment.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
