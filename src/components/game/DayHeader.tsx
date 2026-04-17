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
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Decorative background circles */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-orange-100/40 to-transparent blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 160, damping: 14 }}
        className="text-center relative z-10"
      >
        <motion.div
          className="text-gray-300 text-sm mb-2 tracking-[0.3em] font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          DAY
        </motion.div>
        <motion.div
          className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-gray-500 mb-4 tabular-nums"
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 12 }}
        >
          {day}
        </motion.div>
        <motion.div
          className="w-20 h-0.5 bg-gradient-to-r from-transparent via-orange-300 to-transparent mx-auto rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="mt-12 text-sm text-gray-300 hover:text-gray-600 transition-colors duration-300 font-medium relative z-10 px-6 py-2 rounded-full hover:bg-gray-100/50"
      >
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          点击继续
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
