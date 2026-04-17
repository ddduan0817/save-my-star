'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { endings } from '@/data/endings';
import { achievements } from '@/data/achievements';
import { cn } from '@/lib/utils';

export default function CollectionPage() {
  const router = useRouter();
  const unlockedEndings = useGameStore(s => s.unlockedEndings);
  const unlockedAchievements = useGameStore(s => s.unlockedAchievements);
  const loadCollection = useGameStore(s => s.loadCollection);

  useEffect(() => {
    loadCollection();
  }, [loadCollection]);

  const rarityLabel = {
    common: '普通',
    rare: '稀有',
    legendary: '传说',
  };
  const rarityBorder = {
    common: 'ring-gray-200/50',
    rare: 'ring-purple-300/60',
    legendary: 'ring-amber-300/60 animate-soft-glow',
  };
  const achRarityColor = {
    common: 'from-gray-100 to-gray-50 text-gray-600',
    rare: 'from-purple-50 to-purple-100/50 text-purple-700',
    legendary: 'from-amber-50 to-amber-100/50 text-amber-700',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* 结局图鉴 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mb-6"
      >
        <h1 className="text-xl font-bold mb-1.5 text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-gray-600">结局图鉴</h1>
        <p className="text-xs text-gray-400">
          已解锁 {unlockedEndings.length}/{endings.length} 个结局
        </p>
        <div className="w-48 h-2 bg-gray-100/60 rounded-full mx-auto mt-3 overflow-hidden">
          <motion.div
            className="h-full stat-bar-amber rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedEndings.length / endings.length) * 100}%` }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3.5">
        {endings.map((ending, i) => {
          const unlocked = unlockedEndings.includes(ending.id);
          return (
            <motion.div
              key={ending.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 22 }}
              whileHover={unlocked ? { scale: 1.03, y: -2 } : undefined}
              className={cn(
                "rounded-2xl ring-1 p-4 text-center transition-all duration-300",
                unlocked ? rarityBorder[ending.rarity] : "ring-gray-100/40",
                unlocked ? "bg-white shadow-md shadow-gray-100/30 hover:shadow-lg" : "bg-gray-50/50"
              )}
            >
              <div className={cn("text-3xl mb-2", !unlocked && "blur-sm opacity-20")}>
                {unlocked ? ending.emoji : '?'}
              </div>
              <div className={cn(
                "text-sm font-bold mb-0.5",
                unlocked ? "text-gray-800" : "text-gray-200"
              )}>
                {unlocked ? ending.title : '???'}
              </div>
              <div className="text-[10px]">
                {unlocked ? (
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded-full",
                    ending.rarity === 'legendary' && 'text-amber-600 bg-amber-50',
                    ending.rarity === 'rare' && 'text-purple-600 bg-purple-50',
                    ending.rarity === 'common' && 'text-gray-500 bg-gray-50',
                  )}>
                    {rarityLabel[ending.rarity]}
                  </span>
                ) : (
                  <span className="text-gray-300">未解锁</span>
                )}
              </div>
              {unlocked && (
                <p className="text-[10px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {ending.subtitle}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 成就系统 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center mt-10 mb-6"
      >
        <h2 className="text-xl font-bold mb-1.5 text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-gray-600">成就</h2>
        <p className="text-xs text-gray-400">
          已解锁 {unlockedAchievements.length}/{achievements.length} 个成就
        </p>
        <div className="w-48 h-2 bg-gray-100/60 rounded-full mx-auto mt-3 overflow-hidden">
          <motion.div
            className="h-full stat-bar-pink rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      <div className="space-y-2.5">
        {achievements.map((ach, i) => {
          const unlocked = unlockedAchievements.includes(ach.id);
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.03, type: 'spring', stiffness: 200, damping: 22 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                unlocked
                  ? cn("bg-gradient-to-r ring-1 ring-gray-200/30 shadow-sm", achRarityColor[ach.rarity])
                  : "bg-gray-50/50 ring-1 ring-gray-100/30"
              )}
            >
              <span className={cn("text-2xl", !unlocked && "blur-sm opacity-20")}>
                {unlocked ? ach.emoji : '🔒'}
              </span>
              <div className="flex-1 min-w-0">
                <div className={cn("text-sm font-semibold", unlocked ? "text-gray-800" : "text-gray-300")}>
                  {unlocked ? ach.title : '???'}
                </div>
                <div className={cn("text-[10px]", unlocked ? "text-gray-400" : "text-gray-200")}>
                  {unlocked ? ach.description : '继续游戏解锁'}
                </div>
              </div>
              {unlocked && (
                <span className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  ach.rarity === 'legendary' && 'text-amber-600 bg-amber-100/60',
                  ach.rarity === 'rare' && 'text-purple-600 bg-purple-100/60',
                  ach.rarity === 'common' && 'text-gray-500 bg-gray-200/60',
                )}>
                  {rarityLabel[ach.rarity]}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/')}
        className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-sm font-semibold text-gray-600 transition-all duration-300 shadow-sm"
      >
        回到首页
      </motion.button>
    </div>
  );
}
