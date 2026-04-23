import { cellAt } from '../board';
import { chord, reveal, toggleFlag } from '../game';
import { mulberry32 } from '../rng';
import { makeCustomGame } from './fixtures';

describe('chord', () => {
  it('is a no-op on a hidden cell', () => {
    const s0 = makeCustomGame(3, 3, [[0, 0]]);
    const s1 = chord(s0, 1, 1);
    expect(s1).toBe(s0);
  });

  it('is a no-op on a flagged cell', () => {
    const s0 = makeCustomGame(3, 3, [[0, 0]]);
    const s1 = toggleFlag(s0, 1, 1);
    const s2 = chord(s1, 1, 1);
    expect(s2).toBe(s1);
  });

  it('is a no-op when adjacent flag count does not equal the number', () => {
    // Board:
    //   M . .
    //   . . .
    //   . . .
    // Reveal (0,1): shows number 1. No flag placed → chord is a no-op.
    const s0 = makeCustomGame(3, 3, [[0, 0]]);
    const s1 = reveal(s0, 0, 1, mulberry32(1));
    expect(cellAt(s1.board, 0, 1)?.adjacent).toBe(1);
    const s2 = chord(s1, 0, 1);
    expect(s2).toBe(s1);
  });

  it('reveals all unflagged neighbors when flag count equals the number', () => {
    //   M . .
    //   . . .
    //   . . .
    const s0 = makeCustomGame(3, 3, [[0, 0]]);
    const s1 = reveal(s0, 0, 1, mulberry32(1));
    const s2 = toggleFlag(s1, 0, 0);
    const s3 = chord(s2, 0, 1);
    // Neighbors of (0,1): (0,0) flagged, (1,0) (1,1) (1,2) (0,2) should be revealed.
    expect(cellAt(s3.board, 0, 0)?.state).toBe('flagged');
    expect(cellAt(s3.board, 0, 2)?.state).toBe('revealed');
    expect(cellAt(s3.board, 1, 0)?.state).toBe('revealed');
    expect(cellAt(s3.board, 1, 1)?.state).toBe('revealed');
    expect(cellAt(s3.board, 1, 2)?.state).toBe('revealed');
  });

  it('triggers loss when chord reveals a mine (wrong flag placement)', () => {
    //   M M .
    //   . . .
    //   . . .
    // Reveal (1,1): number 2. Flag (0,0) correctly, but place wrong flag on (1,0).
    // Chord on (1,1) reveals unflagged neighbors including mine (0,1) → loss.
    const s0 = makeCustomGame(3, 3, [[0, 0], [0, 1]]);
    const s1 = reveal(s0, 1, 1, mulberry32(1));
    expect(cellAt(s1.board, 1, 1)?.adjacent).toBe(2);
    const s2 = toggleFlag(s1, 0, 0);
    const s3 = toggleFlag(s2, 1, 0);
    const s4 = chord(s3, 1, 1);
    expect(s4.status).toBe('lost');
    expect(s4.explodedAt).toEqual({ row: 0, col: 1 });
  });

  it('is a no-op when all neighbors are already revealed', () => {
    //   . . .
    //   . . .
    //   . . M
    const s0 = makeCustomGame(3, 3, [[2, 2]]);
    const s1 = reveal(s0, 0, 0, mulberry32(1));
    // Chord on a revealed interior cell with all neighbors revealed/flagged.
    const s2 = chord(s1, 0, 1);
    expect(s2).toBe(s1);
  });

  it('is a no-op once the game has ended', () => {
    const s0 = makeCustomGame(2, 2, [[0, 0]]);
    const lost = reveal(s0, 0, 0, mulberry32(1));
    const again = chord(lost, 1, 1);
    expect(again).toBe(lost);
  });

  it('triggers win when chord completes the board correctly', () => {
    //   M . .
    //   . . .
    //   . . .
    // Flag (0,0). Reveal (0,1). Chord (0,1) → reveals all remaining safe cells → win.
    const s0 = makeCustomGame(3, 3, [[0, 0]]);
    const s1 = toggleFlag(s0, 0, 0);
    const s2 = reveal(s1, 0, 1, mulberry32(1));
    const s3 = chord(s2, 0, 1);
    expect(s3.status).toBe('won');
  });
});
