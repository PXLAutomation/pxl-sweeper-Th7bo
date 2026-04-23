import { getNeighborCoordinates } from "./board.js";
import { GAME_STATUS, TILE_VISIBILITY } from "./constants.js";
import { cloneBoard, summarizeState } from "./state.js";

function isGameOver(status) {
  return status === GAME_STATUS.WON || status === GAME_STATUS.LOST;
}

function revealConnectedSafeTiles(board, startRow, startColumn) {
  const rows = board.length;
  const columns = board[0]?.length ?? 0;
  const queue = [[startRow, startColumn]];
  const visited = new Set();

  while (queue.length > 0) {
    const [row, column] = queue.shift();
    const visitKey = `${row}:${column}`;

    if (visited.has(visitKey)) {
      continue;
    }

    visited.add(visitKey);

    const tile = board[row][column];

    if (
      tile.visibility === TILE_VISIBILITY.FLAGGED ||
      tile.visibility === TILE_VISIBILITY.REVEALED
    ) {
      continue;
    }

    tile.visibility = TILE_VISIBILITY.REVEALED;

    if (tile.adjacentMines !== 0 || tile.hasMine) {
      continue;
    }

    for (const [neighborRow, neighborColumn] of getNeighborCoordinates(
      row,
      column,
      rows,
      columns,
    )) {
      const neighbor = board[neighborRow][neighborColumn];

      if (!neighbor.hasMine && neighbor.visibility !== TILE_VISIBILITY.FLAGGED) {
        queue.push([neighborRow, neighborColumn]);
      }
    }
  }
}

function revealAllMines(board) {
  for (const row of board) {
    for (const tile of row) {
      if (tile.hasMine) {
        tile.visibility = TILE_VISIBILITY.REVEALED;
      }
    }
  }
}

export function revealTile(state, row, column) {
  if (isGameOver(state.status)) {
    return state;
  }

  const board = cloneBoard(state.board);
  const tile = board[row]?.[column];

  if (!tile || tile.visibility === TILE_VISIBILITY.FLAGGED) {
    return state;
  }

  if (tile.visibility === TILE_VISIBILITY.REVEALED) {
    return summarizeState(board, state.status);
  }

  if (tile.hasMine) {
    tile.visibility = TILE_VISIBILITY.REVEALED;
    revealAllMines(board);
    return summarizeState(board, GAME_STATUS.LOST);
  }

  if (tile.adjacentMines === 0) {
    revealConnectedSafeTiles(board, row, column);
  } else {
    tile.visibility = TILE_VISIBILITY.REVEALED;
  }

  const nextStatus =
    summarizeState(board, GAME_STATUS.IN_PROGRESS).hiddenSafeTiles === 0
      ? GAME_STATUS.WON
      : GAME_STATUS.IN_PROGRESS;

  return summarizeState(board, nextStatus);
}

export function toggleFlag(state, row, column) {
  if (isGameOver(state.status)) {
    return state;
  }

  const board = cloneBoard(state.board);
  const tile = board[row]?.[column];

  if (!tile || tile.visibility === TILE_VISIBILITY.REVEALED) {
    return state;
  }

  tile.visibility =
    tile.visibility === TILE_VISIBILITY.FLAGGED
      ? TILE_VISIBILITY.HIDDEN
      : TILE_VISIBILITY.FLAGGED;

  const nextStatus =
    state.status === GAME_STATUS.READY ? GAME_STATUS.READY : GAME_STATUS.IN_PROGRESS;

  return summarizeState(board, nextStatus);
}
