'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { sfxPhoneRing, sfxPhoneHangUp, sfxClick } from '@/lib/sounds';

export default function PhoneCallOverlay() {
  const show = useGameStore(s => s.showPhoneCall);
  const phoneCall = useGameStore(s => s.pendingPhoneCall);
  const answerPhoneCall = useGameStore(s => s.answerPhoneCall);
  const hangUpPhoneCall = useGameStore(s => s.hangUpPhoneCall);
  const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Play ring sound repeatedly while overlay is shown
  useEffect(() => {
    if (show) {
      sfxPhoneRing();
      ringIntervalRef.current = setInterval(() => {
        sfxPhoneRing();
      }, 2500);
      return () => {
        if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
      };
    } else {
      if (ringIntervalRef.current) {
        clearInterval(ringIntervalRef.current);
        ringIntervalRef.current = null;
      }
    }
  }, [show]);

  if (!phoneCall?.phoneCallMeta) return null;

  const meta = phoneCall.phoneCallMeta;

  const handleAnswer = () => {
    sfxClick();
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    answerPhoneCall();
  };

  const handleHangUp = () => {
    sfxPhoneHangUp();
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    hangUpPhoneCall();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[55] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
          {/* Pulsing ring behind avatar */}
          <div className="relative mb-8">
            <motion.div
              className="absolute inset-0 rounded-full bg-white/10"
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 120, height: 120, left: -10, top: -10 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-white/5"
              initial={{ scale: 1, opacity: 0.2 }}
              animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{ width: 120, height: 120, left: -10, top: -10 }}
            />
            <motion.div
              className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-5xl ring-2 ring-white/20"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            >
              {meta.callerAvatar}
            </motion.div>
          </div>

          {/* Caller info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-2"
          >
            <div className="text-white text-xl font-bold">{meta.callerName}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <div className="text-white/50 text-sm">{meta.ringDescription}</div>
            <motion.div
              className="text-white/30 text-xs mt-2"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              来电中...
            </motion.div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
            className="flex items-center gap-16"
          >
            {/* Hang up */}
            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleHangUp}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M3.68 16.07l3.92-3.11a1 1 0 011.28.08l1.94 1.93a13 13 0 004.6-4.6L13.5 8.43a1 1 0 01-.08-1.28l3.11-3.92A1 1 0 0117.82 3C20.13 4.41 21.5 6.73 21.5 9.5 21.5 15.85 15.85 21.5 9.5 21.5c-2.77 0-5.09-1.37-6.5-3.68a1 1 0 01.68-1.75z" transform="rotate(135 12 12)" />
                </svg>
              </motion.button>
              <span className="text-red-400 text-xs">挂断</span>
            </div>

            {/* Answer */}
            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M3.68 16.07l3.92-3.11a1 1 0 011.28.08l1.94 1.93a13 13 0 004.6-4.6L13.5 8.43a1 1 0 01-.08-1.28l3.11-3.92A1 1 0 0117.82 3C20.13 4.41 21.5 6.73 21.5 9.5 21.5 15.85 15.85 21.5 9.5 21.5c-2.77 0-5.09-1.37-6.5-3.68a1 1 0 01.68-1.75z" />
                </svg>
              </motion.button>
              <span className="text-green-400 text-xs">接听</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
