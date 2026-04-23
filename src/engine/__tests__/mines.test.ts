import { createBoard, forEachCell } from '../board';
import { placeMines, placeMinesAt } from '../mines';
import { mulberry32 } from '../rng';

function countMines(board: ReturnType<typeof createBoard>): number {
  let n = 0;
  forEachCell(board, (c) => {
    if (c.mine) n++;
  });
  return n;
}

describe('placeMines', () => {
  it('places exactly mineCount mines', () => {
    const b = createBoard(9, 9);
    placeMines(b, 4, 4, 10, mulberry32(1));
    expect(countMines(b)).toBe(10);
  });

  it('never places a mine inside the 3x3 safe zone around the first click', () => {
    const b = createBoard(9, 9);
    placeMines(b, 4, 4, 10, mulberry32(7));
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        expect(b.cells[4 + dr]?.[4 + dc]?.mine).toBe(false);
      }
    }
  });

  it('keeps the corner safe zone (4 cells) mine-free', () => {
    const b = createBoard(9, 9);
    placeMines(b, 0, 0, 10, mulberry32(13));
    expect(b.cells[0]?.[0]?.mine).toBe(false);
    expect(b.cells[0]?.[1]?.mine).toBe(false);
    expect(b.cells[1]?.[0]?.mine).toBe(false);
    expect(b.cells[1]?.[1]?.mine).toBe(false);
  });

  it('is deterministic for the same seed', () => {
    const b1 = createBoard(9, 9);
    const b2 = createBoard(9, 9);
    placeMines(b1, 4, 4, 10, mulberry32(99));
    placeMines(b2, 4, 4, 10, mulberry32(99));
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        expect(b1.cells[r]?.[c]?.mine).toBe(b2.cells[r]?.[c]?.mine);
      }
    }
  });

  it('computes adjacency on non-mine cells after placement', () => {
    const b = createBoard(9, 9);
    placeMines(b, 4, 4, 10, mulberry32(21));
    // Sum of all adjacency values must equal 8 * mineCount capped by grid edges.
    // Weaker assertion: at least one non-mine neighbor of a mine has adjacent > 0.
    let anyAdjacent = 0;
    forEachCell(b, (cell) => {
      if (!cell.mine && cell.adjacent > 0) anyAdjacent++;
    });
    expect(anyAdjacent).toBeGreaterThan(0);
  });

  it('throws when mineCount exceeds available candidates', () => {
    const b = createBoard(3, 3);
    // 9 cells total, safe zone around (1,1) = all 9 → 0 candidates.
    expect(() => placeMines(b, 1, 1, 1, mulberry32(1))).toThrow();
  });

  it('can place up to the maximum allowed count', () => {
    const b = createBoard(9, 9);
    // corner safe zone is 4 cells → 77 candidates → 77 mines fits.
    placeMines(b, 0, 0, 77, mulberry32(5));
    expect(countMines(b)).toBe(77);
  });
});

describe('placeMinesAt', () => {
  it('places mines at exactly the specified positions and computes adjacency', () => {
    const b = createBoard(3, 3);
    placeMinesAt(b, [[0, 0], [2, 2]]);
    expect(b.cells[0]?.[0]?.mine).toBe(true);
    expect(b.cells[2]?.[2]?.mine).toBe(true);
    expect(b.cells[0]?.[1]?.adjacent).toBe(1);
    expect(b.cells[1]?.[1]?.adjacent).toBe(2);
    expect(b.cells[2]?.[1]?.adjacent).toBe(1);
  });

  it('silently skips out-of-bounds positions', () => {
    const b = createBoard(2, 2);
    placeMinesAt(b, [[0, 0], [5, 5]]);
    expect(countMines(b)).toBe(1);
  });
});
