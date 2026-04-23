import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { Difficulty } from '../engine/types';
import { minesRemaining as calcMinesRemaining } from '../engine/game';
import { mulberry32, type Rng } from '../engine/rng';
import { gameReducer, initReducerState } from './gameReducer';

function createRng(): Rng {
  return mulberry32((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
}

export function useGame(initialDifficulty: Difficulty) {
  const [state, dispatch] = useReducer(gameReducer, initialDifficulty, initReducerState);
  const rngRef = useRef<Rng>(createRng());
  const startRef = useRef<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (state.game.status === 'playing' && startRef.current === null) {
      startRef.current = Date.now();
    }
  }, [state.game.status]);

  useEffect(() => {
    if (state.game.status !== 'playing') return;
    const id = setInterval(() => {
      if (startRef.current !== null) {
        setElapsedSeconds(Math.floor((Date.now() - startRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [state.game.status]);

  const newGame = useCallback((difficulty: Difficulty) => {
    rngRef.current = createRng();
    startRef.current = null;
    setElapsedSeconds(0);
    dispatch({ type: 'NEW_GAME', difficulty });
  }, []);

  const reveal = useCallback((row: number, col: number) => {
    dispatch({ type: 'REVEAL', row, col, rng: rngRef.current });
  }, []);

  const toggleFlag = useCallback((row: number, col: number) => {
    dispatch({ type: 'TOGGLE_FLAG', row, col });
  }, []);

  const chord = useCallback((row: number, col: number) => {
    dispatch({ type: 'CHORD', row, col });
  }, []);

  const moveFocus = useCallback((dr: number, dc: number) => {
    dispatch({ type: 'MOVE_FOCUS', dr, dc });
  }, []);

  const setFocus = useCallback((row: number, col: number) => {
    dispatch({ type: 'SET_FOCUS', row, col });
  }, []);

  return {
    status: state.game.status,
    board: state.game.board,
    difficulty: state.game.difficulty,
    focus: state.focus,
    explodedAt: state.game.explodedAt,
    totalMines: state.game.totalMines,
    minesRemaining: calcMinesRemaining(state.game),
    elapsedSeconds,
    newGame,
    selectDifficulty: newGame,
    reveal,
    toggleFlag,
    chord,
    moveFocus,
    setFocus,
  };
}

export type UseGameReturn = ReturnType<typeof useGame>;
