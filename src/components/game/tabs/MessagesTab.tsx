'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from '@/stores/gameStore';
import EventCard from '@/components/game/events/EventCard';
import EventOutcome from '@/components/game/overlays/EventOutcome';
import MessageRow from '@/components/game/events/MessageRow';
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
    dailyBriefing,
    seasonalModifiers,
  } = useGameStore(
    useShallow(s => ({
      gamePhase: s.gamePhase,
      messages: s.messages,
      openMessage: s.openMessage,
      currentDay: s.currentDay,
      showDayBanner: s.showDayBanner,
      dismissDayBanner: s.dismissDayBanner,
      currentEvent: s.currentEvents[0],
      dailyBriefing: s.dailyBriefing,
      seasonalModifiers: s.seasonalModifiers,
    })),
  );

  // Swipe-to-dismiss state (resolved messages only)
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isSwiping = useRef(false);
  // 'unknown' = 还没决定方向; 'horizontal' = 锁死成滑删; 'vertical' = 让位给页面滚动
  const swipeAxis = useRef<'unknown' | 'horizontal' | 'vertical'>('unknown');

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
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    isSwiping.current = true;
    swipeAxis.current = 'unknown';
    setSwipedId(msgId);
    setSwipeOffset(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const dx = x - touchStartX.current;
    const dy = y - touchStartY.current;

    // 首次移动超过阈值时锁定方向，避免"滑删 vs 页面滚动"争抢同一笔手势
    if (swipeAxis.current === 'unknown') {
      const AXIS_LOCK_PX = 8;
      if (Math.abs(dx) > AXIS_LOCK_PX || Math.abs(dy) > AXIS_LOCK_PX) {
        // 水平滑动更明显 → 锁定为滑删；垂直更明显 → 让位给页面滚动
        swipeAxis.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      } else {
        return;
      }
    }

    if (swipeAxis.current !== 'horizontal') {
      // 垂直滚动：不处理滑删，让页面正常滚动
      return;
    }

    // 锁定为水平后阻止后续垂直滚动（passive 事件下浏览器可能忽略，
    // 但 React 这里 cancelable 的 touchmove 一般仍能生效）
    if (e.cancelable) e.preventDefault();

    touchCurrentX.current = x;
    // Only allow left swipe (negative diff), clamp at 0
    const clampedDiff = Math.min(0, dx);
    setSwipeOffset(clampedDiff);
  }, []);

  const handleTouchEnd = useCallback((msgId: string) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const axis = swipeAxis.current;
    swipeAxis.current = 'unknown';

    // 如果这一笔本来就是垂直滚动，直接收尾，不触发删除动画
    if (axis !== 'horizontal') {
      setSwipeOffset(0);
      setSwipedId(null);
      return;
    }

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

        {/* Morning Briefing —— 持续展示直到下一天，不强制 dismiss */}
        {!isViewingMessage && dailyBriefing && (
          <motion.div
            key={`briefing-${currentDay}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mx-3 mt-2"
          >
            <div className="rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-rose-50/80 ring-1 ring-amber-200/50 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-orange-500/80">MORNING DESK</span>
                  <span className="text-[10px] text-orange-400/60">·</span>
                  <span className="text-[10px] text-orange-500/70">DAY {currentDay}</span>
                </div>
                {seasonalModifiers.length > 0 && (
                  <div className="flex items-center gap-1">
                    {seasonalModifiers.map((m) => (
                      <span
                        key={m.id}
                        title={m.name}
                        className="text-[11px] leading-none"
                      >
                        {m.emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-[12.5px] leading-relaxed text-gray-700 whitespace-pre-line">
                {dailyBriefing}
              </div>
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
