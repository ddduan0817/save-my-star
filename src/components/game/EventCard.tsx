'use client';

import { motion } from 'framer-motion';
import type { GameEvent, EventChoice } from '@/types/game';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/stores/gameStore';
import { CATEGORY_LABEL } from '@/data/constants';
import { formatMoney } from '@/lib/utils';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, ...(isBreaking ? { scale: 0.95 } : {}) }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={cn(
        "mx-4 rounded-2xl overflow-hidden shadow-sm",
        isBreaking && "ring-2 ring-orange-300 shadow-md shadow-orange-100",
        !isBreaking && isCrisis && "ring-1 ring-red-200 animate-pulse-red",
        !isBreaking && isBusiness && "ring-1 ring-amber-200 animate-shimmer-gold",
        !isBreaking && !isCrisis && !isBusiness && "ring-1 ring-gray-200"
      )}
    >
      {/* Breaking event banner */}
      {isBreaking && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 tracking-widest flex items-center gap-2"
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
          className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 tracking-widest"
        >
          BREAKING · {CATEGORY_LABEL[event.category]}
        </motion.div>
      )}

      {/* Normal category badge */}
      {!showUrgentBanner && (
        <div className={cn(
          "text-xs font-medium px-4 py-2 tracking-wider",
          isBusiness ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-500"
        )}>
          {CATEGORY_LABEL[event.category]}
        </div>
      )}

      {/* Event content */}
      <div className={cn(
        "p-4",
        isBreaking ? "bg-orange-50" : "bg-white"
      )}>
        <h2 className={cn(
          "text-lg font-bold mb-3",
          isBreaking && "text-orange-700",
          !isBreaking && isCrisis && "text-red-600 animate-shake"
        )}>
          {event.title}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          {event.description}
        </p>

        {/* Choices */}
        <div className="space-y-2.5">
          {event.choices.map((choice, i) => {
            const available = isChoiceAvailable(choice);
            return (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                onClick={() => available && selectChoice(choice)}
                disabled={!available}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all",
                  available
                    ? isBreaking
                      ? "border-orange-200 bg-orange-50/50 hover:bg-orange-100 hover:border-orange-300 active:scale-[0.98]"
                      : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300 active:scale-[0.98]"
                    : "border-gray-100 bg-gray-50/30 opacity-40 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{choice.text}</div>
                    {choice.subtext && (
                      <div className="text-xs text-gray-500 mt-0.5">{choice.subtext}</div>
                    )}
                    {!available && choice.requireMinMoney && (
                      <div className="text-xs text-red-500 mt-0.5">
                        需要 ¥{formatMoney(choice.requireMinMoney)}（当前不足）
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
