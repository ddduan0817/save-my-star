'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AchievementToastProps {
  achievement: {
    title: string;
    description: string;
    emoji: string;
    rarity: 'common' | 'rare' | 'legendary';
  } | null;
  onDismiss: () => void;
}

export default function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  if (!achievement) return null;

  const rarityColor = {
    common: 'from-gray-600 to-gray-500',
    rare: 'from-purple-600 to-purple-500',
    legendary: 'from-amber-500 to-yellow-400',
  };

  const rarityGlow = {
    common: 'shadow-gray-300/40',
    rare: 'shadow-purple-300/40',
    legendary: 'shadow-amber-300/50',
  };

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed top-16 left-0 right-0 z-[100] flex justify-center px-4"
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <motion.button
            onClick={onDismiss}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-2xl",
              "bg-gradient-to-r text-white shadow-xl",
              rarityColor[achievement.rarity],
              rarityGlow[achievement.rarity],
            )}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {achievement.emoji}
            </motion.span>
            <div className="text-left">
              <div className="text-[10px] font-medium text-white/70 tracking-wider">成就解锁</div>
              <div className="text-sm font-bold">{achievement.title}</div>
              <div className="text-[10px] text-white/80">{achievement.description}</div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
