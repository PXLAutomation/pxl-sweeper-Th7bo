import type { Board } from './types';
import { cellAt, recomputeAdjacency } from './board';
import type { Rng } from './rng';

export function placeMines(
  board: Board,
  safeRow: number,
  safeCol: number,
  mineCount: number,
  rng: Rng,
): void {
  const candidates: Array<[number, number]> = [];
  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      if (Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1) continue;
      candidates.push([r, c]);
    }
  }
  if (mineCount > candidates.length) {
    throw new Error(
      `Cannot place ${mineCount} mines: only ${candidates.length} candidates outside safe zone`,
    );
  }
  for (let i = 0; i < mineCount; i++) {
    const j = i + Math.floor(rng() * (candidates.length - i));
    const tmp = candidates[i]!;
    candidates[i] = candidates[j]!;
    candidates[j] = tmp;
    const [r, c] = candidates[i]!;
    const cell = cellAt(board, r, c);
    if (cell) cell.mine = true;
  }
  recomputeAdjacency(board);
}

export function placeMinesAt(board: Board, positions: Iterable<[number, number]>): void {
  for (const [r, c] of positions) {
    const cell = cellAt(board, r, c);
    if (cell) cell.mine = true;
  }
  recomputeAdjacency(board);
}
