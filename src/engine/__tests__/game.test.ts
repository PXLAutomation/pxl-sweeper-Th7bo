import { cellAt, forEachCell } from '../board';
import { DIFFICULTIES } from '../difficulty';
import { countFlags, minesRemaining, newGame, reveal, toggleFlag } from '../game';
import { mulberry32 } from '../rng';
import { makeCustomGame } from './fixtures';

describe('newGame', () => {
  it.each(Object.values(DIFFICULTIES))(
    'initializes a fresh idle game for %o',
    (preset) => {
      const s = newGame(preset.id);
      expect(s.difficulty).toBe(preset.id);
      expect(s.status).toBe('idle');
      expect(s.minesPlaced).toBe(false);
      expect(s.totalMines).toBe(preset.mines);
      expect(s.board.rows).toBe(preset.rows);
      expect(s.board.cols).toBe(preset.cols);
      let mines = 0;
      forEachCell(s.board, (c) => {
        expect(c.state).toBe('hidden');
        if (c.mine) mines++;
      });
      expect(mines).toBe(0);
    },
  );
});

describe('full-game scenarios', () => {
  it('wins by revealing all non-mine cells; auto-flags remaining mines', () => {
    //   M . .
    //   . . .
    //   . . .
    const s0 = makeCustomGame(3, 3, [[0, 0]]);
    const s1 = reveal(s0, 2, 2, mulberry32(1));
    // Single reveal at (2,2): flood reveals the whole empty region and stops at (0,1), (1,0), (1,1).
    // Not all 8 non-mine cells revealed yet: (0,1), (1,0), (1,1) are numbered.
    // Reveal the remaining numbered cells to complete the win.
    let s = s1;
    for (const [r, c] of [[0, 1], [1, 0], [1, 1]] as Array<[number, number]>) {
      const cell = cellAt(s.board, r, c);
      if (cell?.state === 'hidden') {
        s = reveal(s, r, c, mulberry32(1));
      }
    }
    expect(s.status).toBe('won');
    expect(cellAt(s.board, 0, 0)?.state).toBe('flagged');
    expect(countFlags(s)).toBe(1);
    expect(minesRemaining(s)).toBe(0);
  });

  it('loses by revealing a mine; remaining mines become revealed', () => {
    const s0 = makeCustomGame(3, 3, [[0, 0], [2, 2]]);
    const lost = reveal(s0, 0, 0, mulberry32(1));
    expect(lost.status).toBe('lost');
    expect(cellAt(lost.board, 0, 0)?.state).toBe('revealed');
    expect(cellAt(lost.board, 2, 2)?.state).toBe('revealed');
  });

  it('freezes inputs after win', () => {
    const s0 = makeCustomGame(2, 2, [[0, 0]]);
    // Reveal all non-mine cells.
    let s = reveal(s0, 0, 1, mulberry32(1));
    s = reveal(s, 1, 0, mulberry32(1));
    s = reveal(s, 1, 1, mulberry32(1));
    expect(s.status).toBe('won');
    const after = reveal(s, 0, 1, mulberry32(1));
    expect(after).toBe(s);
    const flagged = toggleFlag(s, 0, 1);
    expect(flagged).toBe(s);
  });

  it('random beginner game with fixed seed produces a deterministic state', () => {
    const s0 = newGame('beginner');
    const a = reveal(s0, 4, 4, mulberry32(777));
    const b = reveal(s0, 4, 4, mulberry32(777));
    // Same structure: same mines and same revealed cells.
    for (let r = 0; r < a.board.rows; r++) {
      for (let c = 0; c < a.board.cols; c++) {
        expect(a.board.cells[r]?.[c]?.mine).toBe(b.board.cells[r]?.[c]?.mine);
        expect(a.board.cells[r]?.[c]?.state).toBe(b.board.cells[r]?.[c]?.state);
      }
    }
  });
});
