import { cellAt, createBoard, forEachCell, forEachNeighbor, inBounds } from '../board';
import { placeMinesAt } from '../mines';

describe('createBoard', () => {
  it('creates a grid of the requested size', () => {
    const b = createBoard(3, 4);
    expect(b.rows).toBe(3);
    expect(b.cols).toBe(4);
    expect(b.cells.length).toBe(3);
    expect(b.cells[0]?.length).toBe(4);
  });

  it('initializes every cell as hidden, non-mine, 0 adjacent with correct coordinates', () => {
    const b = createBoard(2, 2);
    forEachCell(b, (cell) => {
      expect(cell.state).toBe('hidden');
      expect(cell.mine).toBe(false);
      expect(cell.adjacent).toBe(0);
    });
    expect(b.cells[0]?.[0]?.row).toBe(0);
    expect(b.cells[0]?.[0]?.col).toBe(0);
    expect(b.cells[1]?.[1]?.row).toBe(1);
    expect(b.cells[1]?.[1]?.col).toBe(1);
  });

  it('rejects non-positive sizes', () => {
    expect(() => createBoard(0, 5)).toThrow();
    expect(() => createBoard(5, -1)).toThrow();
  });
});

describe('cellAt / inBounds', () => {
  const b = createBoard(3, 3);

  it('returns undefined for out-of-bounds access', () => {
    expect(cellAt(b, -1, 0)).toBeUndefined();
    expect(cellAt(b, 0, 3)).toBeUndefined();
    expect(cellAt(b, 3, 0)).toBeUndefined();
  });

  it('returns the cell for in-bounds access', () => {
    expect(cellAt(b, 1, 1)?.row).toBe(1);
  });

  it('inBounds matches expected edges', () => {
    expect(inBounds(b, 0, 0)).toBe(true);
    expect(inBounds(b, 2, 2)).toBe(true);
    expect(inBounds(b, 3, 0)).toBe(false);
    expect(inBounds(b, 0, -1)).toBe(false);
  });
});

describe('forEachNeighbor', () => {
  it('yields 8 neighbors for an interior cell and skips the center', () => {
    const b = createBoard(3, 3);
    const seen: Array<[number, number]> = [];
    forEachNeighbor(b, 1, 1, (n) => seen.push([n.row, n.col]));
    expect(seen).toHaveLength(8);
    expect(seen).not.toContainEqual([1, 1]);
  });

  it('yields 3 neighbors for a corner cell', () => {
    const b = createBoard(3, 3);
    const seen: Array<[number, number]> = [];
    forEachNeighbor(b, 0, 0, (n) => seen.push([n.row, n.col]));
    expect(seen).toHaveLength(3);
  });

  it('yields 5 neighbors for an edge cell', () => {
    const b = createBoard(3, 3);
    const seen: Array<[number, number]> = [];
    forEachNeighbor(b, 0, 1, (n) => seen.push([n.row, n.col]));
    expect(seen).toHaveLength(5);
  });
});

describe('recomputeAdjacency', () => {
  it('computes correct adjacent counts around a single mine', () => {
    const b = createBoard(3, 3);
    placeMinesAt(b, [[1, 1]]);
    const counts: number[] = [];
    forEachCell(b, (cell) => {
      if (!cell.mine) counts.push(cell.adjacent);
    });
    // Every non-mine cell around the center is adjacent to the mine → 1
    expect(counts).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('zeroes adjacency on mine cells', () => {
    const b = createBoard(2, 2);
    placeMinesAt(b, [[0, 0]]);
    expect(b.cells[0]?.[0]?.adjacent).toBe(0);
  });

  it('computes 2 for a cell between two mines', () => {
    const b = createBoard(1, 3);
    placeMinesAt(b, [[0, 0], [0, 2]]);
    expect(b.cells[0]?.[1]?.adjacent).toBe(2);
  });
});
