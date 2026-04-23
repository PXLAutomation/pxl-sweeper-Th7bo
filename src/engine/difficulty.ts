import type { Difficulty, DifficultyPreset } from './types';

export const DIFFICULTIES: Record<Difficulty, DifficultyPreset> = {
  beginner: { id: 'beginner', rows: 9, cols: 9, mines: 10 },
  intermediate: { id: 'intermediate', rows: 16, cols: 16, mines: 40 },
  expert: { id: 'expert', rows: 16, cols: 30, mines: 99 },
};

export const DIFFICULTY_ORDER: readonly Difficulty[] = ['beginner', 'intermediate', 'expert'];
