'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { endings } from '@/data/endings';
import { cn } from '@/lib/utils';

export default function CollectionPage() {
  const router = useRouter();
  const unlockedEndings = useGameStore(s => s.unlockedEndings);
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
    common: 'ring-gray-200',
    rare: 'ring-purple-300',
    legendary: 'ring-amber-300',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-xl font-bold mb-1 text-gray-800">结局图鉴</h1>
        <p className="text-xs text-gray-500">
          已解锁 {unlockedEndings.length}/{endings.length} 个结局
        </p>
        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-gray-100 rounded-full mx-auto mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedEndings.length / endings.length) * 100}%` }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {endings.map((ending, i) => {
          const unlocked = unlockedEndings.includes(ending.id);
          return (
            <motion.div
              key={ending.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-xl ring-1 p-4 text-center shadow-sm",
                unlocked ? rarityBorder[ending.rarity] : "ring-gray-100",
                unlocked ? "bg-white" : "bg-gray-50"
              )}
            >
              <div className={cn("text-3xl mb-2", !unlocked && "blur-sm opacity-30")}>
                {unlocked ? ending.emoji : '?'}
              </div>
              <div className={cn(
                "text-sm font-bold mb-0.5",
                unlocked ? "text-gray-800" : "text-gray-300"
              )}>
                {unlocked ? ending.title : '???'}
              </div>
              <div className="text-[10px]">
                {unlocked ? (
                  <span className={cn(
                    "font-medium",
                    ending.rarity === 'legendary' && 'text-amber-600',
                    ending.rarity === 'rare' && 'text-purple-600',
                    ending.rarity === 'common' && 'text-gray-500',
                  )}>
                    {rarityLabel[ending.rarity]}
                  </span>
                ) : (
                  <span className="text-gray-400">未解锁</span>
                )}
              </div>
              {unlocked && (
                <p className="text-[10px] text-gray-400 mt-2 line-clamp-2">
                  {ending.subtitle}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => router.push('/')}
        className="w-full mt-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors active:scale-[0.98]"
      >
        回到首页
      </motion.button>
    </div>
  );
}
