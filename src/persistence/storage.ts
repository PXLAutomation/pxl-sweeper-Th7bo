import type { Difficulty } from '../engine/types';
import { DIFFICULTY_ORDER } from '../engine/difficulty';

const PREFIX = 'pxl-sweeper:';

function getItem(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    /* silently ignore */
  }
}

export function loadLastDifficulty(): Difficulty {
  const raw = getItem('lastDifficulty');
  if (raw !== null && (DIFFICULTY_ORDER as readonly string[]).includes(raw)) {
    return raw as Difficulty;
  }
  return 'beginner';
}

export function saveLastDifficulty(d: Difficulty): void {
  setItem('lastDifficulty', d);
}

export type BestTimes = Partial<Record<Difficulty, number>>;

export function loadBestTimes(): BestTimes {
  const raw = getItem('bestTimes');
  if (raw === null) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    const result: BestTimes = {};
    for (const d of DIFFICULTY_ORDER) {
      const v = (parsed as Record<string, unknown>)[d];
      if (typeof v === 'number' && Number.isFinite(v) && v > 0) {
        result[d] = Math.floor(v);
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function saveBestTimes(times: BestTimes): void {
  setItem('bestTimes', JSON.stringify(times));
}

export function maybeUpdateBestTime(
  times: BestTimes,
  difficulty: Difficulty,
  seconds: number,
): BestTimes {
  const current = times[difficulty];
  if (current !== undefined && current <= seconds) return times;
  return { ...times, [difficulty]: seconds };
}
