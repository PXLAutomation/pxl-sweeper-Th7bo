import { cellAt } from '../board';
import { countFlags, minesRemaining, reveal, toggleFlag } from '../game';
import { mulberry32 } from '../rng';
import { makeCustomGame } from './fixtures';

describe('toggleFlag', () => {
  it('toggles hidden → flagged → hidden', () => {
    const s0 = makeCustomGame(2, 2, [[0, 0]]);
    const s1 = toggleFlag(s0, 1, 1);
    expect(cellAt(s1.board, 1, 1)?.state).toBe('flagged');
    const s2 = toggleFlag(s1, 1, 1);
    expect(cellAt(s2.board, 1, 1)?.state).toBe('hidden');
  });

  it('is a no-op on revealed cells', () => {
    const s0 = makeCustomGame(3, 3, [[0, 0]]);
    const s1 = reveal(s0, 2, 2, mulberry32(1));
    const s2 = toggleFlag(s1, 2, 2);
    expect(s2).toBe(s1);
  });

  it('is a no-op for out-of-bounds positions', () => {
    const s0 = makeCustomGame(2, 2, []);
    const s1 = toggleFlag(s0, 5, 5);
    expect(s1).toBe(s0);
  });

  it('is a no-op once the game is won or lost', () => {
    const s0 = makeCustomGame(2, 2, [[0, 0]]);
    const lost = reveal(s0, 0, 0, mulberry32(1));
    expect(lost.status).toBe('lost');
    const again = toggleFlag(lost, 1, 1);
    expect(again).toBe(lost);
  });

  it('countFlags and minesRemaining reflect flag state', () => {
    const s0 = makeCustomGame(3, 3, [[0, 0], [2, 2]]);
    expect(countFlags(s0)).toBe(0);
    expect(minesRemaining(s0)).toBe(2);
    const s1 = toggleFlag(s0, 0, 0);
    expect(countFlags(s1)).toBe(1);
    expect(minesRemaining(s1)).toBe(1);
    const s2 = toggleFlag(s1, 1, 1);
    expect(countFlags(s2)).toBe(2);
    expect(minesRemaining(s2)).toBe(0);
    // Over-flagging produces negative minesRemaining per the design (display as-is).
    const s3 = toggleFlag(s2, 2, 1);
    expect(minesRemaining(s3)).toBe(-1);
  });
});
