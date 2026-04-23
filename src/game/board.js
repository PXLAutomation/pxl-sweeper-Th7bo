import {
  DEFAULT_COLUMNS,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROWS,
  TILE_VISIBILITY,
} from "./constants.js";

function createTile(row, column) {
  return {
    row,
    column,
    id: `${row}:${column}`,
    hasMine: false,
    adjacentMines: 0,
    visibility: TILE_VISIBILITY.HIDDEN,
  };
}

export function createEmptyBoard(rows = DEFAULT_ROWS, columns = DEFAULT_COLUMNS) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, column) => createTile(row, column)),
  );
}

export function getNeighborCoordinates(row, column, rows, columns) {
  const neighbors = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (rowOffset === 0 && columnOffset === 0) {
        continue;
      }

      const nextRow = row + rowOffset;
      const nextColumn = column + columnOffset;

      if (
        nextRow >= 0 &&
        nextRow < rows &&
        nextColumn >= 0 &&
        nextColumn < columns
      ) {
        neighbors.push([nextRow, nextColumn]);
      }
    }
  }

  return neighbors;
}

export function placeMines(board, mineCoordinates) {
  for (const [row, column] of mineCoordinates) {
    board[row][column].hasMine = true;
  }

  return board;
}

export function calculateAdjacentMineCounts(board) {
  const rows = board.length;
  const columns = board[0]?.length ?? 0;

  for (const boardRow of board) {
    for (const tile of boardRow) {
      if (tile.hasMine) {
        tile.adjacentMines = 0;
        continue;
      }

      tile.adjacentMines = getNeighborCoordinates(
        tile.row,
        tile.column,
        rows,
        columns,
      ).filter(([neighborRow, neighborColumn]) => board[neighborRow][neighborColumn].hasMine)
        .length;
    }
  }

  return board;
}

export function createBoardFromMineCoordinates(
  rows,
  columns,
  mineCoordinates,
) {
  const board = createEmptyBoard(rows, columns);
  placeMines(board, mineCoordinates);

  return calculateAdjacentMineCounts(board);
}

function createCoordinatePool(rows, columns) {
  return Array.from({ length: rows * columns }, (_, index) => [
    Math.floor(index / columns),
    index % columns,
  ]);
}

export function selectMineCoordinates(
  rows,
  columns,
  mineCount = DEFAULT_MINE_COUNT,
  random = Math.random,
) {
  const coordinatePool = createCoordinatePool(rows, columns);

  for (let index = coordinatePool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [coordinatePool[index], coordinatePool[swapIndex]] = [
      coordinatePool[swapIndex],
      coordinatePool[index],
    ];
  }

  return coordinatePool.slice(0, mineCount);
}

export function createBoard({
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
  mineCount = DEFAULT_MINE_COUNT,
  random = Math.random,
} = {}) {
  const mineCoordinates = selectMineCoordinates(rows, columns, mineCount, random);

  return createBoardFromMineCoordinates(rows, columns, mineCoordinates);
}
