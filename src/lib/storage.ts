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
    try {
      localStorage.setItem(ENDINGS_KEY, JSON.stringify(current));
    } catch {
      // 容器限制/存储写满时静默降级：本局仍返回最新列表，只是不落盘
    }
  }
  return current;
}
