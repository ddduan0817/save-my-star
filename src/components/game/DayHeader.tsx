'use client';

import { motion } from 'framer-motion';

interface DayHeaderProps {
  day: number;
  onComplete: () => void;
}

export default function DayHeader({ day, onComplete }: DayHeaderProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="text-center"
      >
        <div className="text-[#8888aa] text-sm mb-2 tracking-widest">DAY</div>
        <div className="text-7xl font-black text-white mb-3 tabular-nums">{day}</div>
        <motion.div
          className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        className="mt-10 text-sm text-[#8888aa] hover:text-white transition-colors"
      >
        点击继续
      </motion.button>
    </motion.div>
  );
}
