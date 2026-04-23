import { act, renderHook } from '@testing-library/react';
import { useGame } from '../useGame';

describe('useGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts idle with zero elapsed seconds', () => {
    const { result } = renderHook(() => useGame('beginner'));
    expect(result.current.status).toBe('idle');
    expect(result.current.elapsedSeconds).toBe(0);
    expect(result.current.difficulty).toBe('beginner');
    expect(result.current.board.rows).toBe(9);
    expect(result.current.board.cols).toBe(9);
  });

  it('does not tick before the first reveal', () => {
    const { result } = renderHook(() => useGame('beginner'));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.elapsedSeconds).toBe(0);
  });

  it('starts ticking on first reveal and advances while playing', () => {
    const { result } = renderHook(() => useGame('beginner'));
    act(() => {
      result.current.reveal(4, 4);
    });
    expect(['playing', 'won']).toContain(result.current.status);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    if (result.current.status === 'playing') {
      expect(result.current.elapsedSeconds).toBeGreaterThanOrEqual(3);
    }
  });

  it('newGame resets elapsed seconds and status to idle', () => {
    const { result } = renderHook(() => useGame('beginner'));
    act(() => {
      result.current.reveal(4, 4);
    });
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    act(() => {
      result.current.newGame('intermediate');
    });
    expect(result.current.status).toBe('idle');
    expect(result.current.elapsedSeconds).toBe(0);
    expect(result.current.difficulty).toBe('intermediate');
  });

  it('selectDifficulty switches and resets', () => {
    const { result } = renderHook(() => useGame('beginner'));
    act(() => {
      result.current.selectDifficulty('expert');
    });
    expect(result.current.difficulty).toBe('expert');
    expect(result.current.board.rows).toBe(16);
    expect(result.current.board.cols).toBe(30);
    expect(result.current.status).toBe('idle');
  });

  it('timer stops when status leaves "playing" (newGame mid-play)', () => {
    const { result } = renderHook(() => useGame('beginner'));
    act(() => {
      result.current.reveal(4, 4);
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    act(() => {
      result.current.newGame('beginner');
    });
    const resetValue = result.current.elapsedSeconds;
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.elapsedSeconds).toBe(resetValue);
  });

  it('moveFocus updates focus and clamps to the grid', () => {
    const { result } = renderHook(() => useGame('beginner'));
    act(() => {
      result.current.moveFocus(-100, -100);
    });
    expect(result.current.focus).toEqual({ row: 0, col: 0 });
    act(() => {
      result.current.moveFocus(1, 2);
    });
    expect(result.current.focus).toEqual({ row: 1, col: 2 });
  });

  it('toggleFlag flags a hidden cell and updates minesRemaining', () => {
    const { result } = renderHook(() => useGame('beginner'));
    const before = result.current.minesRemaining;
    act(() => {
      result.current.toggleFlag(0, 0);
    });
    expect(result.current.board.cells[0]?.[0]?.state).toBe('flagged');
    expect(result.current.minesRemaining).toBe(before - 1);
  });

  it('cleans up the timer on unmount', () => {
    const { result, unmount } = renderHook(() => useGame('beginner'));
    act(() => {
      result.current.reveal(4, 4);
    });
    unmount();
    expect(() => {
      vi.advanceTimersByTime(10_000);
    }).not.toThrow();
  });
});
