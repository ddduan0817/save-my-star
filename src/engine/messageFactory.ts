import type { GameEvent, GameMessage } from '@/types/game';

let messageSeq = 0;
function nextSeq(): string {
  messageSeq = (messageSeq + 1) % Number.MAX_SAFE_INTEGER;
  return messageSeq.toString(36);
}

export function createMessages(events: GameEvent[], day: number): GameMessage[] {
  return events.map((event) => ({
    // include a global monotonic seq + a small random suffix so the same event
    // re-appearing on the same day (carry-over, follow-ups) doesn't collide.
    id: `msg-d${day}-${event.id}-${nextSeq()}-${Math.random().toString(36).slice(2, 6)}`,
    event,
    status: 'unread' as const,
    isUrgent: event.category === 'crisis' || !!event.isBreaking,
    dayReceived: day,
  }));
}
