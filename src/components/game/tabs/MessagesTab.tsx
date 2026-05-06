'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '@/stores/gameStore';
import EventCard from '@/components/game/EventCard';
import EventOutcome from '@/components/game/EventOutcome';
import MessageRow from '@/components/game/MessageRow';
import { sfxDayTransition } from '@/lib/sounds';
import { useCallback, useEffect, useRef, useState } from 'react';

const SWIPE_THRESHOLD_DELETE = 120;

export default function MessagesTab() {
  const {
    gamePhase,
    messages,
    openMessage,
    currentDay,
    showDayBanner,
    dismissDayBanner,
    currentEvent,
  } = useGameStore(
    useShallow(s => ({
      gamePhase: s.gamePhase,
      messages: s.messages,
      openMessage: s.openMessage,
      currentDay: s.currentDay,
      showDayBanner: s.showDayBanner,
      dismissDayBanner: s.dismissDayBanner,
      currentEvent: s.currentEvents[0],
    })),
  );

  // Swipe-to-dismiss state (resolved messages only)
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isSwiping = useRef(false);

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

  // Filter out locally dismissed resolved messages
  const visibleMessages = sortedMessages.filter(msg => !dismissedIds.has(msg.id));

  // Touch handlers for swipe-to-dismiss (only attached to resolved rows)
  const handleTouchStart = useCallback((e: React.TouchEvent, msgId: string) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    isSwiping.current = true;
    setSwipedId(msgId);
    setSwipeOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchCurrentX.current - touchStartX.current;
    // Only allow left swipe (negative diff), clamp at 0
    const clampedDiff = Math.min(0, diff);
    setSwipeOffset(clampedDiff);
  }, []);

  const handleTouchEnd = useCallback((msgId: string) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    if (swipeOffset <= -SWIPE_THRESHOLD_DELETE) {
      // Swipe exceeded delete threshold - dismiss the message
      setSwipeOffset(-500); // Animate off-screen
      setTimeout(() => {
        setDismissedIds(prev => new Set(prev).add(msgId));
        setSwipedId(null);
        setSwipeOffset(0);
      }, 250);
    } else {
      // Snap back
      setSwipeOffset(0);
      setTimeout(() => {
        setSwipedId(null);
      }, 300);
    }
  }, [swipeOffset]);

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
            {visibleMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                <span className="text-3xl mb-3">📭</span>
                <span className="text-sm">暂无新消息</span>
              </div>
            ) : (
              <div className="bg-white/60 rounded-2xl mx-3 mt-3 overflow-hidden ring-1 ring-gray-100/60">
                {visibleMessages.map((msg, i) => {
                  const isResolved = msg.status === 'resolved';

                  if (isResolved) {
                    return (
                      <div
                        key={msg.id}
                        className="relative overflow-hidden"
                        onTouchStart={(e) => handleTouchStart(e, msg.id)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(msg.id)}
                      >
                        {/* Red delete background */}
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 bg-red-500 rounded-r-xl">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-white mr-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="text-white text-sm font-medium">删除</span>
                        </div>
                        {/* Message row with swipe offset */}
                        <motion.div
                          animate={{ x: swipedId === msg.id ? swipeOffset : 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="relative bg-white"
                        >
                          <MessageRow
                            message={msg}
                            index={i}
                            onOpen={openMessage}
                          />
                        </motion.div>
                      </div>
                    );
                  }

                  return (
                    <MessageRow
                      key={msg.id}
                      message={msg}
                      index={i}
                      onOpen={openMessage}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
