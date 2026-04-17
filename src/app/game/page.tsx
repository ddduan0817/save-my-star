'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import StatsBar from '@/components/game/StatsBar';
import DayHeader from '@/components/game/DayHeader';
import EventCard from '@/components/game/EventCard';
import EventOutcome from '@/components/game/EventOutcome';
import AchievementToast from '@/components/game/AchievementToast';
import { sfxAchievement } from '@/lib/sounds';

export default function GamePage() {
  const router = useRouter();
  const gamePhase = useGameStore(s => s.gamePhase);
  const currentDay = useGameStore(s => s.currentDay);
  const currentEvents = useGameStore(s => s.currentEvents);
  const currentEventIndex = useGameStore(s => s.currentEventIndex);
  const ending = useGameStore(s => s.ending);
  const advanceDay = useGameStore(s => s.advanceDay);
  const pendingAchievement = useGameStore(s => s.pendingAchievement);
  const dismissAchievement = useGameStore(s => s.dismissAchievement);

  // Redirect if no game started
  useEffect(() => {
    if (gamePhase === 'not_started') {
      router.replace('/');
    }
  }, [gamePhase, router]);

  // Navigate to ending page when game ends
  useEffect(() => {
    if (gamePhase === 'ended' && ending) {
      router.push('/ending');
    }
  }, [gamePhase, ending, router]);

  // 成就解锁音效 + 自动消失
  useEffect(() => {
    if (pendingAchievement) {
      sfxAchievement();
      const timer = setTimeout(dismissAchievement, 3500);
      return () => clearTimeout(timer);
    }
  }, [pendingAchievement, dismissAchievement]);

  if (gamePhase === 'not_started') return null;

  const currentEvent = currentEvents[currentEventIndex];

  return (
    <div className="min-h-screen flex flex-col pb-8">
      <StatsBar />

      {/* 成就通知 */}
      <AchievementToast
        achievement={pendingAchievement}
        onDismiss={dismissAchievement}
      />

      <AnimatePresence mode="wait">
        {gamePhase === 'day_transition' && (
          <DayHeader
            key={`day-${currentDay}`}
            day={currentDay}
            onComplete={advanceDay}
          />
        )}

        {gamePhase === 'playing' && currentEvent && (
          <div key={`event-${currentEvent.id}`} className="flex-1 flex flex-col justify-center py-6">
            <EventCard event={currentEvent} />
            {currentEvents.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {currentEvents.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentEventIndex ? 'bg-gray-400' : i < currentEventIndex ? 'bg-gray-300' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {gamePhase === 'showing_outcome' && (
          <div key="outcome" className="flex-1 flex flex-col justify-center py-6">
            <EventOutcome />
          </div>
        )}

        {gamePhase === 'showing_twist' && (
          <div key="twist" className="flex-1 flex flex-col justify-center py-6">
            <EventOutcome isTwist />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
