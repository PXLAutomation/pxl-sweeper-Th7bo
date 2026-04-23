import { gameReducer, initReducerState } from '../gameReducer';
import { mulberry32 } from '../../engine/rng';

describe('gameReducer', () => {
  describe('NEW_GAME', () => {
    it('initializes with center focus and idle status', () => {
      const s0 = initReducerState('beginner');
      expect(s0.focus).toEqual({ row: 4, col: 4 });
      expect(s0.game.status).toBe('idle');
      expect(s0.game.difficulty).toBe('beginner');
    });

    it('switching difficulty resets focus to new grid center', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'NEW_GAME', difficulty: 'intermediate' });
      expect(s1.focus).toEqual({ row: 8, col: 8 });
      expect(s1.game.difficulty).toBe('intermediate');
      expect(s1.game.status).toBe('idle');
    });

    it('expert grid centers focus correctly (16x30)', () => {
      const s = initReducerState('expert');
      expect(s.focus).toEqual({ row: 8, col: 15 });
    });
  });

  describe('REVEAL', () => {
    it('transitions idle → playing on first reveal', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'REVEAL', row: 4, col: 4, rng: mulberry32(1) });
      expect(['playing', 'won']).toContain(s1.game.status);
      expect(s1.focus).toEqual({ row: 4, col: 4 });
    });

    it('returns the same state reference when engine returns the same state', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'REVEAL', row: 4, col: 4, rng: mulberry32(1) });
      const s2 = gameReducer(s1, { type: 'REVEAL', row: 4, col: 4, rng: mulberry32(1) });
      expect(s2).toBe(s1);
    });
  });

  describe('TOGGLE_FLAG', () => {
    it('flags a hidden cell and moves focus', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'TOGGLE_FLAG', row: 0, col: 0 });
      expect(s1.game.board.cells[0]?.[0]?.state).toBe('flagged');
      expect(s1.focus).toEqual({ row: 0, col: 0 });
    });
  });

  describe('CHORD', () => {
    it('is a no-op when not playing', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'CHORD', row: 4, col: 4 });
      expect(s1).toBe(s0);
    });
  });

  describe('MOVE_FOCUS', () => {
    it('clamps to top-left corner', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'MOVE_FOCUS', dr: -100, dc: -100 });
      expect(s1.focus).toEqual({ row: 0, col: 0 });
    });

    it('clamps to bottom-right corner', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'MOVE_FOCUS', dr: 100, dc: 100 });
      expect(s1.focus).toEqual({ row: 8, col: 8 });
    });

    it('returns the same reference when the move has no effect at the boundary', () => {
      const s0 = gameReducer(initReducerState('beginner'), { type: 'MOVE_FOCUS', dr: -100, dc: -100 });
      const s1 = gameReducer(s0, { type: 'MOVE_FOCUS', dr: -1, dc: -1 });
      expect(s1).toBe(s0);
    });

    it('moves focus by the requested delta', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'MOVE_FOCUS', dr: 1, dc: -1 });
      expect(s1.focus).toEqual({ row: 5, col: 3 });
    });
  });

  describe('SET_FOCUS', () => {
    it('sets focus to the requested cell', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'SET_FOCUS', row: 2, col: 7 });
      expect(s1.focus).toEqual({ row: 2, col: 7 });
    });

    it('is a no-op for out-of-bounds requests', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'SET_FOCUS', row: -1, col: 0 });
      expect(s1).toBe(s0);
    });

    it('is a no-op when the focus is already at the requested cell', () => {
      const s0 = initReducerState('beginner');
      const s1 = gameReducer(s0, { type: 'SET_FOCUS', row: 4, col: 4 });
      expect(s1).toBe(s0);
    });
  });
});
