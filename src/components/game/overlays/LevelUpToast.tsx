'use client';

// 经纪人升级 toast —— 当 managerLevel 跨过等级门槛时，endDay / selectChoice
// 会把升级信息写进 pendingLevelUp。这里监听并弹 4 秒自动消失的庆祝卡片。

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function LevelUpToast() {
  const pendingLevelUp = useGameStore(s => s.pendingLevelUp);
  const dismiss = useGameStore(s => s.dismissLevelUp);

  useEffect(() => {
    if (pendingLevelUp) {
      const timer = setTimeout(dismiss, 4500);
      return () => clearTimeout(timer);
    }
  }, [pendingLevelUp, dismiss]);

  return (
    <AnimatePresence>
      {pendingLevelUp && (
        <motion.div
          className="fixed top-16 left-0 right-0 z-[100] flex justify-center px-4"
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <motion.button
            onClick={dismiss}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white shadow-xl shadow-amber-300/50 max-w-[92%]"
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="text-3xl leading-none"
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {pendingLevelUp.emoji}
            </motion.span>
            <div className="text-left min-w-0">
              <div className="text-[10px] font-bold text-white/80 tracking-[0.18em]">
                经纪人升级 · LV.{pendingLevelUp.lv}
              </div>
              <div className="text-sm font-bold mt-0.5">{pendingLevelUp.title}</div>
              <div className="text-[11px] text-white/90 mt-0.5 leading-snug truncate">
                {pendingLevelUp.perk}
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
