'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useEffect } from 'react';

export default function RivalActionNotice() {
  const showRivalAction = useGameStore(s => s.showRivalAction);
  const rivalActionNarration = useGameStore(s => s.rivalActionNarration);
  const rival = useGameStore(s => s.rival);
  const dismissRivalAction = useGameStore(s => s.dismissRivalAction);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (showRivalAction) {
      const timer = setTimeout(() => dismissRivalAction(), 4000);
      return () => clearTimeout(timer);
    }
  }, [showRivalAction, dismissRivalAction]);

  if (!rival) return null;

  return (
    <AnimatePresence>
      {showRivalAction && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm"
        >
          <button
            onClick={dismissRivalAction}
            className="w-full text-left bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg ring-1 ring-gray-200/60"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{rival.avatar}</span>
              <span className="text-xs font-bold text-gray-700">对手动态</span>
              <span className="ml-auto text-[10px] text-gray-400">点击关闭</span>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              {rivalActionNarration}
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
