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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3.51 8.93C5.4 4.82 8.44 3 12 3c3.56 0 6.6 1.82 8.49 5.93.36.78.36 1.67 0 2.45-.5 1.08-1.23 2.01-2.1 2.73a1.5 1.5 0 01-1.94.05l-1.7-1.36a1.5 1.5 0 01-.55-1.15V9.4a6.12 6.12 0 00-4.4 0v2.25c0 .44-.2.86-.55 1.15l-1.7 1.36a1.5 1.5 0 01-1.94-.05 8.85 8.85 0 01-2.1-2.73 2.13 2.13 0 010-2.45z"
                    fill="white"
                  />
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 01.87-.27c.95.17 1.94.27 2.95.27a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.01.1 2 .27 2.95a1 1 0 01-.27.87l-2.2 2.2z"
                    fill="white"
                  />
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
