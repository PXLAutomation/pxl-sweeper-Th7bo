import { createBoard } from '../board';
import { placeMinesAt } from '../mines';
import { DIFFICULTIES } from '../difficulty';
import type { Difficulty, GameState } from '../types';

export function makeGame(
  difficulty: Difficulty,
  minePositions: Array<[number, number]>,
): GameState {
  const preset = DIFFICULTIES[difficulty];
  const board = createBoard(preset.rows, preset.cols);
  placeMinesAt(board, minePositions);
  return {
    difficulty,
    board,
    status: 'playing',
    minesPlaced: true,
    totalMines: minePositions.length,
    explodedAt: null,
  };
}

export function makeCustomGame(
  rows: number,
  cols: number,
  minePositions: Array<[number, number]>,
): GameState {
  const board = createBoard(rows, cols);
  placeMinesAt(board, minePositions);
  return {
    difficulty: 'beginner',
    board,
    status: 'playing',
    minesPlaced: true,
    totalMines: minePositions.length,
    explodedAt: null,
  };
}
