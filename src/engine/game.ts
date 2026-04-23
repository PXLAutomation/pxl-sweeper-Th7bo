import type { Board, Difficulty, GameState } from './types';
import { cellAt, createBoard, forEachCell, forEachNeighbor } from './board';
import { DIFFICULTIES } from './difficulty';
import { placeMines } from './mines';
import type { Rng } from './rng';

function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

export function newGame(difficulty: Difficulty): GameState {
  const preset = DIFFICULTIES[difficulty];
  return {
    difficulty,
    board: createBoard(preset.rows, preset.cols),
    status: 'idle',
    minesPlaced: false,
    totalMines: preset.mines,
    explodedAt: null,
  };
}

function floodReveal(board: Board, startR: number, startC: number): void {
  const stack: Array<[number, number]> = [[startR, startC]];
  while (stack.length > 0) {
    const popped = stack.pop();
    if (!popped) break;
    const [r, c] = popped;
    const cell = cellAt(board, r, c);
    if (!cell) continue;
    if (cell.state !== 'hidden') continue;
    if (cell.mine) continue;
    cell.state = 'revealed';
    if (cell.adjacent === 0) {
      forEachNeighbor(board, r, c, (n) => {
        if (n.state === 'hidden' && !n.mine) {
          stack.push([n.row, n.col]);
        }
      });
    }
  }
}

function finishLoss(state: GameState, r: number, c: number): void {
  state.status = 'lost';
  state.explodedAt = { row: r, col: c };
  forEachCell(state.board, (cell) => {
    if (cell.mine && cell.state === 'hidden') {
      cell.state = 'revealed';
    }
  });
}

function countRevealedNonMines(board: Board): number {
  let n = 0;
  for (const row of board.cells) {
    for (const cell of row) {
      if (cell.state === 'revealed' && !cell.mine) n++;
    }
  }
  return n;
}

function maybeFinishWin(state: GameState): void {
  const target = state.board.rows * state.board.cols - state.totalMines;
  if (countRevealedNonMines(state.board) !== target) return;
  state.status = 'won';
  forEachCell(state.board, (cell) => {
    if (cell.mine && cell.state === 'hidden') {
      cell.state = 'flagged';
    }
  });
}

export function reveal(state: GameState, r: number, c: number, rng: Rng): GameState {
  if (state.status === 'won' || state.status === 'lost') return state;
  const cell = cellAt(state.board, r, c);
  if (!cell) return state;
  if (cell.state !== 'hidden') return state;
  const next = cloneState(state);
  if (!next.minesPlaced) {
    placeMines(next.board, r, c, next.totalMines, rng);
    next.minesPlaced = true;
    next.status = 'playing';
  }
  const target = cellAt(next.board, r, c);
  if (!target) return next;
  if (target.mine) {
    target.state = 'revealed';
    finishLoss(next, r, c);
    return next;
  }
  floodReveal(next.board, r, c);
  maybeFinishWin(next);
  return next;
}

export function toggleFlag(state: GameState, r: number, c: number): GameState {
  if (state.status === 'won' || state.status === 'lost') return state;
  const cell = cellAt(state.board, r, c);
  if (!cell) return state;
  if (cell.state === 'revealed') return state;
  const next = cloneState(state);
  const target = cellAt(next.board, r, c);
  if (!target) return state;
  target.state = target.state === 'flagged' ? 'hidden' : 'flagged';
  return next;
}

export function chord(state: GameState, r: number, c: number): GameState {
  if (state.status !== 'playing') return state;
  const src = cellAt(state.board, r, c);
  if (!src || src.state !== 'revealed' || src.mine) return state;
  let flagCount = 0;
  const toReveal: Array<[number, number]> = [];
  forEachNeighbor(state.board, r, c, (n) => {
    if (n.state === 'flagged') flagCount++;
    else if (n.state === 'hidden') toReveal.push([n.row, n.col]);
  });
  if (flagCount !== src.adjacent) return state;
  if (toReveal.length === 0) return state;
  const next = cloneState(state);
  let exploded: [number, number] | null = null;
  for (const [nr, nc] of toReveal) {
    const ncell = cellAt(next.board, nr, nc);
    if (!ncell || ncell.state !== 'hidden') continue;
    if (ncell.mine) {
      ncell.state = 'revealed';
      exploded = [nr, nc];
      break;
    }
    floodReveal(next.board, nr, nc);
  }
  if (exploded) {
    finishLoss(next, exploded[0], exploded[1]);
  } else {
    maybeFinishWin(next);
  }
  return next;
}

export function countFlags(state: GameState): number {
  let n = 0;
  forEachCell(state.board, (cell) => {
    if (cell.state === 'flagged') n++;
  });
  return n;
}

export function minesRemaining(state: GameState): number {
  return state.totalMines - countFlags(state);
}
