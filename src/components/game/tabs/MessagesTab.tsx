'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import EventCard from '@/components/game/EventCard';
import EventOutcome from '@/components/game/EventOutcome';
import MessageRow from '@/components/game/MessageRow';
import { sfxDayTransition } from '@/lib/sounds';
import { useEffect } from 'react';

export default function MessagesTab() {
  const gamePhase = useGameStore(s => s.gamePhase);
  const messages = useGameStore(s => s.messages);
  const activeMessageId = useGameStore(s => s.activeMessageId);
  const openMessage = useGameStore(s => s.openMessage);
  const currentDay = useGameStore(s => s.currentDay);
  const showDayBanner = useGameStore(s => s.showDayBanner);
  const dismissDayBanner = useGameStore(s => s.dismissDayBanner);

  const currentEvent = useGameStore(s => s.currentEvents[0]);

  // Auto-dismiss day banner
  useEffect(() => {
    if (showDayBanner) {
      sfxDayTransition();
      const timer = setTimeout(dismissDayBanner, 2000);
      return () => clearTimeout(timer);
    }
  }, [showDayBanner, dismissDayBanner]);

  const isViewingMessage = gamePhase === 'processing_message' || gamePhase === 'showing_outcome' || gamePhase === 'showing_twist';

  // Sort: unresolved urgent first, then unresolved normal, then resolved
  const sortedMessages = [...messages].sort((a, b) => {
    if (a.status === 'resolved' && b.status !== 'resolved') return 1;
    if (a.status !== 'resolved' && b.status === 'resolved') return -1;
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col">
      <AnimatePresence mode="popLayout">
        {/* Day Banner */}
        {showDayBanner && !isViewingMessage && (
          <motion.div
            key={`day-banner-${currentDay}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mx-4 mt-4 mb-2 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100/80 to-amber-100/60 ring-1 ring-orange-200/40">
              <span className="text-xs font-bold text-orange-500 tracking-wider">DAY {currentDay}</span>
              <span className="text-xs text-orange-400/70">新的一天开始了</span>
            </div>
          </motion.div>
        )}

        {/* Message Detail View */}
        {isViewingMessage && currentEvent && (
          <motion.div
            key="message-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-center py-4"
          >
            {gamePhase === 'processing_message' && (
              <EventCard event={currentEvent} />
            )}
            {gamePhase === 'showing_outcome' && (
              <EventOutcome />
            )}
            {gamePhase === 'showing_twist' && (
              <EventOutcome isTwist />
            )}
          </motion.div>
        )}

        {/* Message List */}
        {!isViewingMessage && (
          <motion.div
            key="message-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            {sortedMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                <span className="text-3xl mb-3">📭</span>
                <span className="text-sm">暂无新消息</span>
              </div>
            ) : (
              <div className="bg-white/60 rounded-2xl mx-3 mt-3 overflow-hidden ring-1 ring-gray-100/60">
                {sortedMessages.map((msg, i) => (
                  <MessageRow
                    key={msg.id}
                    message={msg}
                    index={i}
                    onOpen={openMessage}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
