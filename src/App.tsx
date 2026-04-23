import { useEffect, useRef, useState } from 'react';
import { useGame } from './state/useGame';
import { Board } from './components/Board';
import { HUD } from './components/HUD';
import {
  loadLastDifficulty,
  saveLastDifficulty,
  loadBestTimes,
  saveBestTimes,
  maybeUpdateBestTime,
} from './persistence/storage';
import './styles/theme.css';
import './styles/base.css';

export function App() {
  const [initialDifficulty] = useState(loadLastDifficulty);
  const game = useGame(initialDifficulty);
  const boardRef = useRef<HTMLDivElement>(null);
  const difficultyRef = useRef(game.difficulty);
  difficultyRef.current = game.difficulty;

  const [bestTimes, setBestTimes] = useState(loadBestTimes);

  useEffect(() => {
    saveLastDifficulty(game.difficulty);
  }, [game.difficulty]);

  const prevStatusRef = useRef(game.status);
  useEffect(() => {
    if (prevStatusRef.current !== 'won' && game.status === 'won') {
      setBestTimes((prev) => {
        const updated = maybeUpdateBestTime(prev, game.difficulty, game.elapsedSeconds);
        if (updated !== prev) saveBestTimes(updated);
        return updated;
      });
    }
    prevStatusRef.current = game.status;
  }, [game.status, game.difficulty, game.elapsedSeconds]);

  const { newGame, selectDifficulty } = game;
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.key) {
        case 'n':
        case 'N':
          e.preventDefault();
          newGame(difficultyRef.current);
          boardRef.current?.focus();
          break;
        case '1':
          e.preventDefault();
          selectDifficulty('beginner');
          boardRef.current?.focus();
          break;
        case '2':
          e.preventDefault();
          selectDifficulty('intermediate');
          boardRef.current?.focus();
          break;
        case '3':
          e.preventDefault();
          selectDifficulty('expert');
          boardRef.current?.focus();
          break;
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [newGame, selectDifficulty]);

  return (
    <main className="app">
      <h1>PXL Sweeper</h1>
      <HUD
        minesRemaining={game.minesRemaining}
        elapsedSeconds={game.elapsedSeconds}
        status={game.status}
        difficulty={game.difficulty}
        bestTime={bestTimes[game.difficulty]}
        onNewGame={() => game.newGame(game.difficulty)}
        onSelectDifficulty={game.selectDifficulty}
      />
      <Board
        board={game.board}
        status={game.status}
        explodedAt={game.explodedAt}
        focus={game.focus}
        boardRef={boardRef}
        onReveal={game.reveal}
        onToggleFlag={game.toggleFlag}
        onChord={game.chord}
        onMoveFocus={game.moveFocus}
      />
      <details className="shortcuts-help">
        <summary>Keyboard shortcuts</summary>
        <ul>
          <li><kbd>Arrow keys</kbd> Move focus</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> Reveal cell</li>
          <li><kbd>F</kbd> Toggle flag</li>
          <li><kbd>C</kbd> Chord reveal</li>
          <li><kbd>N</kbd> New game</li>
          <li><kbd>1</kbd> / <kbd>2</kbd> / <kbd>3</kbd> Beginner / Intermediate / Expert</li>
        </ul>
      </details>
    </main>
  );
}
