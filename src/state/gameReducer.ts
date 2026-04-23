import type { Difficulty, GameState, Position } from '../engine/types';
import type { Rng } from '../engine/rng';
import { chord, newGame, reveal, toggleFlag } from '../engine/game';

export interface ReducerState {
  game: GameState;
  focus: Position;
}

export type GameAction =
  | { type: 'NEW_GAME'; difficulty: Difficulty }
  | { type: 'REVEAL'; row: number; col: number; rng: Rng }
  | { type: 'TOGGLE_FLAG'; row: number; col: number }
  | { type: 'CHORD'; row: number; col: number }
  | { type: 'MOVE_FOCUS'; dr: number; dc: number }
  | { type: 'SET_FOCUS'; row: number; col: number };

export function initReducerState(difficulty: Difficulty): ReducerState {
  const game = newGame(difficulty);
  return {
    game,
    focus: {
      row: Math.floor(game.board.rows / 2),
      col: Math.floor(game.board.cols / 2),
    },
  };
}

export function gameReducer(state: ReducerState, action: GameAction): ReducerState {
  switch (action.type) {
    case 'NEW_GAME':
      return initReducerState(action.difficulty);

    case 'REVEAL': {
      const nextGame = reveal(state.game, action.row, action.col, action.rng);
      if (nextGame === state.game) return state;
      return { ...state, game: nextGame, focus: { row: action.row, col: action.col } };
    }

    case 'TOGGLE_FLAG': {
      const nextGame = toggleFlag(state.game, action.row, action.col);
      if (nextGame === state.game) return state;
      return { ...state, game: nextGame, focus: { row: action.row, col: action.col } };
    }

    case 'CHORD': {
      const nextGame = chord(state.game, action.row, action.col);
      if (nextGame === state.game) return state;
      return { ...state, game: nextGame, focus: { row: action.row, col: action.col } };
    }

    case 'MOVE_FOCUS': {
      const { rows, cols } = state.game.board;
      const row = Math.max(0, Math.min(rows - 1, state.focus.row + action.dr));
      const col = Math.max(0, Math.min(cols - 1, state.focus.col + action.dc));
      if (row === state.focus.row && col === state.focus.col) return state;
      return { ...state, focus: { row, col } };
    }

    case 'SET_FOCUS': {
      const { rows, cols } = state.game.board;
      if (action.row < 0 || action.row >= rows || action.col < 0 || action.col >= cols) {
        return state;
      }
      if (action.row === state.focus.row && action.col === state.focus.col) return state;
      return { ...state, focus: { row: action.row, col: action.col } };
    }
  }
}
