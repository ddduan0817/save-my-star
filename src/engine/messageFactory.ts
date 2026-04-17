import type { GameEvent, GameMessage } from '@/types/game';

export function createMessages(events: GameEvent[], day: number): GameMessage[] {
  return events.map((event) => ({
    id: `msg-d${day}-${event.id}`,
    event,
    status: 'unread' as const,
    isUrgent: event.category === 'crisis' || !!event.isBreaking,
    dayReceived: day,
  }));
}
