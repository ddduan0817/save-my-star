import type { EndingId } from '@/types/game';

const ENDINGS_KEY = 'celebrity-sim-endings';

export function loadUnlockedEndings(): EndingId[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(ENDINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUnlockedEnding(endingId: EndingId): EndingId[] {
  const current = loadUnlockedEndings();
  if (!current.includes(endingId)) {
    current.push(endingId);
    localStorage.setItem(ENDINGS_KEY, JSON.stringify(current));
  }
  return current;
}
