import type { Board, Cell } from './types';

export function createBoard(rows: number, cols: number): Board {
  if (rows <= 0 || cols <= 0) {
    throw new Error(`Invalid board size: ${rows}x${cols}`);
  }
  const cells: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ row: r, col: c, mine: false, adjacent: 0, state: 'hidden' });
    }
    cells.push(row);
  }
  return { rows, cols, cells };
}

export function inBounds(board: Board, r: number, c: number): boolean {
  return r >= 0 && r < board.rows && c >= 0 && c < board.cols;
}

export function cellAt(board: Board, r: number, c: number): Cell | undefined {
  return board.cells[r]?.[c];
}

export function forEachCell(board: Board, fn: (cell: Cell) => void): void {
  for (const row of board.cells) {
    for (const cell of row) {
      fn(cell);
    }
  }
}

export function forEachNeighbor(
  board: Board,
  r: number,
  c: number,
  fn: (cell: Cell) => void,
): void {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const n = cellAt(board, r + dr, c + dc);
      if (n) fn(n);
    }
  }
}

export function recomputeAdjacency(board: Board): void {
  forEachCell(board, (cell) => {
    if (cell.mine) {
      cell.adjacent = 0;
      return;
    }
    let count = 0;
    forEachNeighbor(board, cell.row, cell.col, (n) => {
      if (n.mine) count++;
    });
    cell.adjacent = count;
  });
}
