'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import StatsBar from '@/components/game/StatsBar';
import DayHeader from '@/components/game/DayHeader';
import EventCard from '@/components/game/EventCard';
import EventOutcome from '@/components/game/EventOutcome';

export default function GamePage() {
  const router = useRouter();
  const gamePhase = useGameStore(s => s.gamePhase);
  const currentDay = useGameStore(s => s.currentDay);
  const currentEvents = useGameStore(s => s.currentEvents);
  const currentEventIndex = useGameStore(s => s.currentEventIndex);
  const ending = useGameStore(s => s.ending);
  const advanceDay = useGameStore(s => s.advanceDay);

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

  if (gamePhase === 'not_started') return null;

  const currentEvent = currentEvents[currentEventIndex];

  return (
    <div className="min-h-screen flex flex-col pb-8">
      <StatsBar />

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
                      i === currentEventIndex ? 'bg-white' : i < currentEventIndex ? 'bg-white/30' : 'bg-white/10'
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
      </AnimatePresence>
    </div>
  );
}
