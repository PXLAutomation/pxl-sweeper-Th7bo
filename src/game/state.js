import { GAME_STATUS, TILE_VISIBILITY } from "./constants.js";
import { createBoard } from "./board.js";

function countTiles(board, predicate) {
  return board.flat().filter(predicate).length;
}

export function cloneBoard(board) {
  return board.map((row) => row.map((tile) => ({ ...tile })));
}

export function countFlags(board) {
  return countTiles(board, (tile) => tile.visibility === TILE_VISIBILITY.FLAGGED);
}

export function countMines(board) {
  return countTiles(board, (tile) => tile.hasMine);
}

export function countHiddenSafeTiles(board) {
  return countTiles(
    board,
    (tile) => !tile.hasMine && tile.visibility !== TILE_VISIBILITY.REVEALED,
  );
}

export function createGameState(options = {}) {
  const board = createBoard(options);

  return {
    board,
    status: GAME_STATUS.READY,
    mineCount: countMines(board),
    flagsUsed: countFlags(board),
    hiddenSafeTiles: countHiddenSafeTiles(board),
  };
}

export function createGameStateFromBoard(board) {
  return {
    board: cloneBoard(board),
    status: GAME_STATUS.READY,
    mineCount: countMines(board),
    flagsUsed: countFlags(board),
    hiddenSafeTiles: countHiddenSafeTiles(board),
  };
}

export function summarizeState(board, status) {
  return {
    board,
    status,
    mineCount: countMines(board),
    flagsUsed: countFlags(board),
    hiddenSafeTiles: countHiddenSafeTiles(board),
  };
}
