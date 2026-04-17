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

  const isChoiceAvailable = (choice: EventChoice) => {
    if (choice.requireMinMoney && stats.money < choice.requireMinMoney) return false;
    if (choice.requireMinFanLoyalty && stats.fanLoyalty < choice.requireMinFanLoyalty) return false;
    if (choice.requireMaxPrRisk && stats.prRisk > choice.requireMaxPrRisk) return false;
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={cn(
        "mx-4 rounded-2xl border overflow-hidden",
        isCrisis && "border-red-500/30 animate-pulse-red",
        isBusiness && "border-amber-500/30 animate-shimmer-gold",
        !isCrisis && !isBusiness && "border-white/10"
      )}
    >
      {/* Breaking banner for crisis */}
      {isCrisis && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 tracking-widest"
        >
          🚨 BREAKING · {CATEGORY_LABEL[event.category]}
        </motion.div>
      )}

      {/* Normal category badge */}
      {!isCrisis && (
        <div className={cn(
          "text-xs font-medium px-4 py-1.5 tracking-wider",
          isBusiness ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-[#8888aa]"
        )}>
          {event.emoji} {CATEGORY_LABEL[event.category]}
        </div>
      )}

      {/* Event content */}
      <div className="p-4 bg-[#141420]">
        <h2 className={cn(
          "text-lg font-bold mb-3",
          isCrisis && "text-red-400 animate-shake"
        )}>
          {event.emoji} {event.title}
        </h2>
        <p className="text-sm text-[#ccccdd] leading-relaxed mb-5">
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
                  "w-full text-left p-3 rounded-xl border transition-all",
                  available
                    ? "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                    : "border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-2">
                  {choice.emoji && <span className="text-base mt-0.5">{choice.emoji}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{choice.text}</div>
                    {choice.subtext && (
                      <div className="text-xs text-[#8888aa] mt-0.5">{choice.subtext}</div>
                    )}
                    {!available && choice.requireMinMoney && (
                      <div className="text-xs text-red-400 mt-0.5">
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
