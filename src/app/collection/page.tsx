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
  const rarityColor = {
    common: 'border-[#8888aa]/20',
    rare: 'border-purple-500/30',
    legendary: 'border-amber-500/30',
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-xl font-bold mb-1">📚 结局图鉴</h1>
        <p className="text-xs text-[#8888aa]">
          已解锁 {unlockedEndings.length}/{endings.length} 个结局
        </p>
        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-full"
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
                "rounded-xl border p-4 text-center",
                unlocked ? rarityColor[ending.rarity] : "border-white/5",
                unlocked ? "bg-[#141420]" : "bg-[#141420]/50"
              )}
            >
              <div className={cn("text-3xl mb-2", !unlocked && "blur-sm opacity-30")}>
                {unlocked ? ending.emoji : '❓'}
              </div>
              <div className={cn(
                "text-sm font-bold mb-0.5",
                !unlocked && "text-[#8888aa]/50"
              )}>
                {unlocked ? ending.title : '???'}
              </div>
              <div className="text-[10px] text-[#8888aa]">
                {unlocked ? (
                  <span className={cn(
                    ending.rarity === 'legendary' && 'text-amber-400',
                    ending.rarity === 'rare' && 'text-purple-400',
                  )}>
                    {rarityLabel[ending.rarity]}
                  </span>
                ) : (
                  '未解锁'
                )}
              </div>
              {unlocked && (
                <p className="text-[10px] text-[#8888aa]/70 mt-2 line-clamp-2">
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
        className="w-full mt-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors active:scale-[0.98]"
      >
        🎭 回到首页
      </motion.button>
    </div>
  );
}
