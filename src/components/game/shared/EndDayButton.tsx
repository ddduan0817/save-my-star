'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';
import { sfxClick } from '@/lib/sounds';

export default function EndDayButton() {
  const endDay = useGameStore(s => s.endDay);
  const messages = useGameStore(s => s.messages);
  const gamePhase = useGameStore(s => s.gamePhase);

  const hasUnresolvedUrgent = messages.some(m => m.isUrgent && m.status !== 'resolved');
  const isProcessing = gamePhase === 'processing_message' || gamePhase === 'showing_outcome' || gamePhase === 'showing_twist';

  if (isProcessing) return null;

  return (
    <div className="fixed bottom-[76px] left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="w-full max-w-lg flex justify-center px-4 pb-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={!hasUnresolvedUrgent ? { scale: 1.03, y: -1 } : undefined}
          whileTap={!hasUnresolvedUrgent ? { scale: 0.97 } : undefined}
          onClick={() => {
            if (hasUnresolvedUrgent) return;
            sfxClick();
            endDay();
          }}
          disabled={hasUnresolvedUrgent}
          className={cn(
            "pointer-events-auto px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all duration-300",
            hasUnresolvedUrgent
              ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-gray-100/40"
              : "bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 text-white shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60",
          )}
        >
          {hasUnresolvedUrgent ? (
            '有紧急消息未处理'
          ) : (
            <span className="inline-flex items-center gap-1.5">
              下班
              <svg
                width="22"
                height="16"
                viewBox="0 0 28 20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* 月牙 */}
                <path
                  d="M13 11.5 A6 6 0 1 1 6.8 5.5 A4.5 4.5 0 0 0 13 11.5 Z"
                  strokeWidth="1.8"
                />
                {/* 飘起来的 Zzz —— 从小到大、往右上飘 */}
                <path d="M15 15.5 h2.5 l-2.5 2.5 h2.5" strokeWidth="1.6" />
                <path d="M18.5 9.5 h3 l-3 3 h3" strokeWidth="1.7" />
                <path d="M22 3 h4 l-4 4 h4" strokeWidth="1.8" />
              </svg>
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
