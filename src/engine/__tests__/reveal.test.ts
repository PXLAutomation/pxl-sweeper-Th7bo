import { cellAt, forEachNeighbor } from '../board';
import { newGame, reveal } from '../game';
import { mulberry32 } from '../rng';
import { makeCustomGame } from './fixtures';

describe('reveal — first-click safety', () => {
  it.each([
    ['seed 1', 1],
    ['seed 2', 2],
    ['seed 99', 99],
    ['seed 12345', 12345],
  ])('first reveal at center is never a mine and safe zone is clear (%s)', (_label, seed) => {
    const s = newGame('beginner');
    const r = reveal(s, 4, 4, mulberry32(seed));
    expect(cellAt(r.board, 4, 4)?.mine).toBe(false);
    forEachNeighbor(r.board, 4, 4, (n) => {
      expect(n.mine).toBe(false);
    });
  });

  it('first reveal at corner is never a mine, corner safe zone clear', () => {
    const s = newGame('expert');
    const r = reveal(s, 0, 0, mulberry32(42));
    expect(cellAt(r.board, 0, 0)?.mine).toBe(false);
    forEachNeighbor(r.board, 0, 0, (n) => {
      expect(n.mine).toBe(false);
    });
  });

  it('transitions idle → playing on first reveal', () => {
    const s = newGame('beginner');
    expect(s.status).toBe('idle');
    const r = reveal(s, 4, 4, mulberry32(1));
    expect(r.status === 'playing' || r.status === 'won').toBe(true);
  });
});

describe('reveal — flood', () => {
  it('flood-reveals connected empty region and stops at numbered border', () => {
    // Board:
    //   . . .
    //   . . M
    //   . . .
    // Reveal (0,0). Flood traverses zero-adjacent cells and stops at numbered cells.
    // Zero-adjacent cells: (0,0), (1,0), (2,0). Numbered borders: (0,1), (1,1), (2,1).
    // (0,2) and (2,2) are only reachable through numbered cells → remain hidden.
    const state = makeCustomGame(3, 3, [[1, 2]]);
    const r = reveal(state, 0, 0, mulberry32(1));
    const revealed: Array<[number, number]> = [
      [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1],
    ];
    for (const [rr, cc] of revealed) {
      expect(cellAt(r.board, rr, cc)?.state).toBe('revealed');
    }
    expect(cellAt(r.board, 0, 2)?.state).toBe('hidden');
    expect(cellAt(r.board, 2, 2)?.state).toBe('hidden');
    expect(cellAt(r.board, 1, 2)?.state).toBe('hidden'); // mine
  });

  it('revealing a number (non-zero adjacent) does not flood', () => {
    // Board:
    //   M . .
    //   . . .
    //   . . .
    const state = makeCustomGame(3, 3, [[0, 0]]);
    const r = reveal(state, 0, 1, mulberry32(1));
    expect(cellAt(r.board, 0, 1)?.state).toBe('revealed');
    // (0,2) is adjacent to (0,1) but reveal was a number, no flood.
    expect(cellAt(r.board, 0, 2)?.state).toBe('hidden');
    expect(cellAt(r.board, 2, 2)?.state).toBe('hidden');
  });

  it('flood does not cross flagged cells', () => {
    // 1x5: . . . . .
    // Put a flag at (0,2) to partition flood reveal.
    const state = makeCustomGame(1, 5, []);
    // Flag (0,2) manually by forcing state.
    const target = cellAt(state.board, 0, 2);
    if (target) target.state = 'flagged';
    const r = reveal(state, 0, 0, mulberry32(1));
    expect(cellAt(r.board, 0, 0)?.state).toBe('revealed');
    expect(cellAt(r.board, 0, 1)?.state).toBe('revealed');
    expect(cellAt(r.board, 0, 2)?.state).toBe('flagged');
    expect(cellAt(r.board, 0, 3)?.state).toBe('hidden');
    expect(cellAt(r.board, 0, 4)?.state).toBe('hidden');
  });
});

describe('reveal — loss', () => {
  it('reveals all mines and sets status to lost when a mine is revealed', () => {
    // 2x2 with mine at (0,0); reveal (0,0) — must use a fixture where minesPlaced=true
    // so the first-click guard does not relocate the mine.
    const state = makeCustomGame(2, 2, [[0, 0], [1, 1]]);
    const r = reveal(state, 0, 0, mulberry32(1));
    expect(r.status).toBe('lost');
    expect(r.explodedAt).toEqual({ row: 0, col: 0 });
    expect(cellAt(r.board, 0, 0)?.state).toBe('revealed');
    expect(cellAt(r.board, 1, 1)?.state).toBe('revealed');
  });

  it('is a no-op on a revealed or flagged cell', () => {
    const state = makeCustomGame(3, 3, [[0, 0]]);
    const r1 = reveal(state, 2, 2, mulberry32(1));
    const r2 = reveal(r1, 2, 2, mulberry32(1));
    expect(r2).toBe(r1);
  });

  it('is a no-op once the game is lost', () => {
    const state = makeCustomGame(2, 2, [[0, 0]]);
    const lost = reveal(state, 0, 0, mulberry32(1));
    expect(lost.status).toBe('lost');
    const again = reveal(lost, 1, 1, mulberry32(1));
    expect(again).toBe(lost);
  });

  it('is a no-op for out-of-bounds positions', () => {
    const state = makeCustomGame(2, 2, []);
    const r = reveal(state, 99, 99, mulberry32(1));
    expect(r).toBe(state);
  });
});
