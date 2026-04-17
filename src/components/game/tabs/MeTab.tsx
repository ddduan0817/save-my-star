'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import WeiboCompose from '@/components/game/WeiboCompose';

// 经纪人等级定义（按优先级从高到低排列）
const MANAGER_LEVELS = [
  { lv: 1, title: '实习经纪人', emoji: '📋', minDay: 0, hint: '坚持到第3天晋升' },
  { lv: 2, title: '见习经纪人', emoji: '📝', minDay: 3, hint: '坚持到第6天晋升' },
  { lv: 3, title: '初级经纪人', emoji: '👔', minDay: 6, hint: '坚持到第12天晋升' },
  { lv: 4, title: '资深经纪人', emoji: '💼', minDay: 12, hint: '坚持到第15天且风险<30晋升' },
  { lv: 5, title: '稳健经纪人', emoji: '🛡️', minDay: 15, hint: '商业≥70+粉丝≥60晋升' },
  { lv: 6, title: '金牌经纪人', emoji: '🏆', minDay: 0, hint: '商业≥80+粉丝≥70+风险<20成为传奇' },
  { lv: 7, title: '传奇经纪人', emoji: '👑', minDay: 0, hint: '已达最高等级！' },
];

// 特殊称号（覆盖普通等级）
const SPECIAL_TITLES: { check: (d: number, s: { commercialValue: number; fanLoyalty: number; prRisk: number }, m: number) => boolean; title: string; emoji: string }[] = [
  { check: (_, s) => s.prRisk > 90, title: '走钢丝的疯子', emoji: '🤡' },
  { check: (_, __, m) => m < -50000, title: '负债经纪人', emoji: '💀' },
  { check: (_, s) => s.fanLoyalty <= 5, title: '全网最惨经纪人', emoji: '🪦' },
  { check: (_, s, m) => m > 300000 && s.fanLoyalty < 20, title: '黑心资本家', emoji: '🦈' },
  { check: (_, s) => s.prRisk > 70, title: '危机经纪人', emoji: '🔥' },
];

function getManagerInfo(day: number, stats: { commercialValue: number; fanLoyalty: number; prRisk: number }, money: number) {
  // 检查特殊称号
  for (const sp of SPECIAL_TITLES) {
    if (sp.check(day, stats, money)) {
      return { title: sp.title, emoji: sp.emoji, isSpecial: true, lv: 0, progress: 0, hint: '' };
    }
  }

  // 普通等级（从高往低匹配）
  let currentLv = 0;
  if (stats.commercialValue >= 80 && stats.fanLoyalty >= 70 && stats.prRisk < 20) currentLv = 6;
  else if (stats.commercialValue >= 70 && stats.fanLoyalty >= 60) currentLv = 5;
  else if (day >= 15 && stats.prRisk < 30) currentLv = 4;
  else if (day >= 12) currentLv = 3;
  else if (day >= 6) currentLv = 2;
  else if (day >= 3) currentLv = 1;
  else currentLv = 0;

  const level = MANAGER_LEVELS[currentLv];
  const nextLevel = MANAGER_LEVELS[Math.min(currentLv + 1, MANAGER_LEVELS.length - 1)];
  const isMax = currentLv >= MANAGER_LEVELS.length - 1;

  // 计算到下一级的进度
  let progress = 1;
  if (!isMax && nextLevel.minDay > 0) {
    const currentMin = level.minDay;
    const nextMin = nextLevel.minDay;
    progress = Math.min(1, Math.max(0, (day - currentMin) / (nextMin - currentMin)));
  }

  return {
    title: level.title,
    emoji: level.emoji,
    isSpecial: false,
    lv: level.lv,
    progress: isMax ? 1 : progress,
    hint: isMax ? '已达最高等级！' : `下一级：${nextLevel.title}`,
  };
}

export default function MeTab() {
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const weiboTrends = useGameStore(s => s.weiboTrends);
  const fanComments = useGameStore(s => s.fanComments);
  const artist = useGameStore(s => s.artist);

  const manager = getManagerInfo(currentDay, stats, stats.money);

  return (
    <div className="flex-1 px-4 py-4 space-y-4 pb-24">
      {/* Manager Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm text-center"
      >
        <span className="text-4xl">{manager.emoji}</span>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-sm font-bold text-gray-800">{manager.title}</span>
          {!manager.isSpecial && (
            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">
              Lv.{manager.lv}
            </span>
          )}
          {manager.isSpecial && (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
              特殊
            </span>
          )}
        </div>
        {!manager.isSpecial && (
          <div className="mt-2.5 px-6">
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange-300 to-orange-500"
                initial={false}
                animate={{ width: `${manager.progress * 100}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              />
            </div>
            <div className="text-[10px] text-gray-400 mt-1">{manager.hint}</div>
          </div>
        )}
        <div className="text-[10px] text-gray-400 mt-1.5">
          {artist?.name}的经纪人 · 第{currentDay}天
        </div>
      </motion.div>

      {/* Weibo Compose */}
      <WeiboCompose />

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
