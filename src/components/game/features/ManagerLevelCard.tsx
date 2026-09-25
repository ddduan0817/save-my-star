'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import {
  MANAGER_LEVELS,
  getLevelFromXp,
  getNextLevel,
  getLevelProgress,
  matchSpecialTitle,
} from '@/engine/managerProgression';

export default function ManagerLevelCard() {
  const stats = useGameStore(s => s.stats);
  const currentDay = useGameStore(s => s.currentDay);
  const artist = useGameStore(s => s.artist);
  const managerXp = useGameStore(s => s.managerXp);
  const recentXpDeltas = useGameStore(s => s.recentXpDeltas);

  const special = matchSpecialTitle(stats);
  const level = getLevelFromXp(managerXp);
  const nextLevel = getNextLevel(level.lv);
  const progress = getLevelProgress(managerXp, level.lv);
  const recentNet = recentXpDeltas.reduce((sum, value) => sum + value, 0);
  const slumping = recentXpDeltas.length === 3 && recentNet < 0;
  const managerLabel = artist ? `${artist.name}的经纪人` : '经纪人';

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 ring-1 ring-gray-100/60 shadow-sm"
      aria-label="经纪人等级"
    >
      {special ? (
        <div className="text-center">
          <span className="text-4xl" aria-hidden>{special.emoji}</span>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-sm font-bold text-gray-800">{special.title}</span>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
              状态异常
            </span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1.5">
            {managerLabel} · 第{currentDay}天
          </div>
          <div className="text-[10px] text-red-400 mt-1">
            原等级 {level.title}（Lv.{level.lv}）· 先把状态扳回来
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none" aria-hidden>{level.emoji}</span>
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

          <div className="mt-3">
            <div
              className="h-1.5 rounded-full bg-gray-100 overflow-hidden"
              role="progressbar"
              aria-label="经纪人升级进度"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange-300 to-orange-500"
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 18 }}
              />
            </div>
            <div className="flex items-center justify-between gap-3 mt-1">
              <span className="text-[10px] text-gray-400 min-w-0">
                {nextLevel
                  ? `距离${nextLevel.title}还差 ${Math.max(0, nextLevel.minXp - managerXp)} 经验`
                  : '已达最高等级 · 结局有专属彩蛋'}
              </span>
              <span className="text-[10px] text-gray-400 shrink-0">
                第{currentDay}天
              </span>
            </div>
          </div>

          {slumping && (
            <div className="mt-3 px-3 py-1.5 bg-amber-50 rounded-lg text-[10px] text-amber-600">
              最近 3 天状态滑坡（净 {recentNet} XP）· 老板在看你
            </div>
          )}

          <div className="mt-3 text-[10px] text-gray-400 text-center">
            {managerLabel}
          </div>
        </div>
      )}
    </motion.section>
  );
}
