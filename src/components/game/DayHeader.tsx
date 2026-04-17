'use client';

import { motion } from 'framer-motion';

interface DayHeaderProps {
  day: number;
  onComplete: () => void;
}

export default function DayHeader({ day, onComplete }: DayHeaderProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf8f5]"
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
        <div className="text-gray-400 text-sm mb-2 tracking-widest font-medium">DAY</div>
        <div className="text-7xl font-black text-gray-800 mb-3 tabular-nums">{day}</div>
        <motion.div
          className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"
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
        className="mt-10 text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium"
      >
        点击继续
      </motion.button>
    </motion.div>
  );
}
