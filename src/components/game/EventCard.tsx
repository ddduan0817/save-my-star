'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameEvent, EventChoice } from '@/types/game';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/stores/gameStore';
import { CATEGORY_LABEL } from '@/data/constants';
import { formatMoney } from '@/lib/utils';
import { sfxSelect, sfxCrisisAlert, sfxBreaking } from '@/lib/sounds';

interface EventCardProps {
  event: GameEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const selectChoice = useGameStore(s => s.selectChoice);
  const stats = useGameStore(s => s.stats);

  const isCrisis = event.category === 'crisis';
  const isBusiness = event.category === 'business';
  const isBreaking = !!event.isBreaking;

  const isChoiceAvailable = (choice: EventChoice) => {
    if (choice.requireMinMoney && stats.money < choice.requireMinMoney) return false;
    if (choice.requireMinFanLoyalty && stats.fanLoyalty < choice.requireMinFanLoyalty) return false;
    if (choice.requireMaxPrRisk && stats.prRisk > choice.requireMaxPrRisk) return false;
    return true;
  };

  const showUrgentBanner = isCrisis || isBreaking;

  // 事件出现时播放音效
  useEffect(() => {
    if (isBreaking) sfxBreaking();
    else if (isCrisis) sfxCrisisAlert();
  }, [event.id, isBreaking, isCrisis]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, ...(isBreaking ? { scale: 0.95 } : {}) }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      className={cn(
        "mx-4 rounded-3xl overflow-hidden",
        isBreaking && "ring-2 ring-orange-300/70 shadow-lg shadow-orange-100/60",
        !isBreaking && isCrisis && "ring-1 ring-red-200/60 animate-pulse-red shadow-lg shadow-red-50/40",
        !isBreaking && isBusiness && "ring-1 ring-amber-200/60 animate-shimmer-gold shadow-lg shadow-amber-50/40",
        !isBreaking && !isCrisis && !isBusiness && "ring-1 ring-gray-200/60 shadow-lg shadow-gray-100/40"
      )}
    >
      {/* Breaking event banner */}
      {isBreaking && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
          className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white text-xs font-bold px-4 py-2 tracking-widest flex items-center gap-2"
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            ●
          </motion.span>
          BREAKING · 突发快讯
        </motion.div>
      )}

      {/* Crisis banner (non-breaking) */}
      {!isBreaking && isCrisis && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold px-4 py-1.5 tracking-widest"
        >
          BREAKING · {CATEGORY_LABEL[event.category]}
        </motion.div>
      )}

      {/* Normal category badge */}
      {!showUrgentBanner && (
        <div className={cn(
          "text-xs font-medium px-4 py-2 tracking-wider",
          isBusiness ? "bg-amber-50/80 text-amber-600" : "bg-gray-50/80 text-gray-400"
        )}>
          {CATEGORY_LABEL[event.category]}
        </div>
      )}

      {/* Event content */}
      <div className={cn(
        "p-5",
        isBreaking ? "bg-gradient-to-b from-orange-50 to-white" : "bg-white"
      )}>
        <h2 className={cn(
          "text-lg font-bold mb-3",
          isBreaking && "text-orange-700",
          !isBreaking && isCrisis && "text-red-600 animate-shake"
        )}>
          {event.emoji && <span className="mr-1.5">{event.emoji}</span>}
          {event.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">
          {event.description}
        </p>

        {/* Choices */}
        <div className="space-y-3">
          {event.choices.map((choice, i) => {
            const available = isChoiceAvailable(choice);
            return (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                whileHover={available ? { scale: 1.015, y: -1 } : undefined}
                whileTap={available ? { scale: 0.975 } : undefined}
                onClick={() => {
                  if (!available) return;
                  sfxSelect();
                  selectChoice(choice);
                }}
                disabled={!available}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all duration-300",
                  available
                    ? isBreaking
                      ? "border-orange-200/60 bg-gradient-to-r from-orange-50/80 to-amber-50/40 hover:from-orange-100/80 hover:to-amber-50/60 hover:border-orange-300/70 hover:shadow-md hover:shadow-orange-100/30"
                      : "border-gray-200/50 bg-gradient-to-r from-gray-50/60 to-white hover:from-gray-100/60 hover:to-gray-50/40 hover:border-gray-300/60 hover:shadow-md hover:shadow-gray-100/30"
                    : "border-gray-100/40 bg-gray-50/20 opacity-35 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-3">
                  {available && (
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200/60 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{choice.text}</div>
                    {choice.subtext && (
                      <div className="text-xs text-gray-400 mt-0.5">{choice.subtext}</div>
                    )}
                    {!available && choice.requireMinMoney && (
                      <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                        需要 ¥{formatMoney(choice.requireMinMoney)}（当前不足）
                      </div>
                    )}
                  </div>
                  {available && (
                    <motion.div
                      className="mt-1 text-gray-300"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                      ›
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
