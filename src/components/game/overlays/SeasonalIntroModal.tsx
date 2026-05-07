'use client';

// 开局"本季娱乐圈大环境"弹窗 —— startGame 之后如果抽到了 modifier 就会出现。
// 玩家点"Got it"后设置 showSeasonalIntro=false 并开始正常玩。

import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '@/stores/gameStore';

export default function SeasonalIntroModal() {
  const { show, modifiers, dismiss } = useGameStore(
    useShallow(s => ({
      show: s.showSeasonalIntro,
      modifiers: s.seasonalModifiers,
      dismiss: s.dismissSeasonalIntro,
    })),
  );

  if (!show || modifiers.length === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="seasonal-intro-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-400 via-rose-400 to-fuchsia-500 px-6 py-5 text-white">
              <div className="text-[11px] font-bold tracking-[0.2em] opacity-80">THIS SEASON</div>
              <div className="text-xl font-bold mt-1">本季娱乐圈大环境</div>
              <div className="text-xs opacity-90 mt-1.5 leading-relaxed">
                影响整局走向的关键词 · 这一局的"行情"已经定了
              </div>
            </div>

            {/* Modifier cards */}
            <div className="px-5 py-5 space-y-3 max-h-[55vh] overflow-y-auto">
              {modifiers.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl bg-gradient-to-br from-orange-50 to-rose-50/60 ring-1 ring-orange-200/60 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl leading-none shrink-0">{m.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-gray-800">{m.name}</div>
                      <div className="text-[11px] text-gray-500 italic mt-0.5 leading-snug">
                        {m.tagline}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-[12px] leading-relaxed text-gray-600">
                    {m.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer button */}
            <div className="px-5 pb-5 pt-1">
              <button
                onClick={dismiss}
                className="w-full py-3 rounded-full bg-gray-900 text-white text-sm font-semibold active:scale-[0.98] transition-transform"
              >
                我心里有数了
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                大环境会贯穿整局 20 天 · 顺着它打会更轻松
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
