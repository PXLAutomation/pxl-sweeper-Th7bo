import { useEffect, useRef } from 'react';
import { useGame } from './state/useGame';
import { Board } from './components/Board';
import { HUD } from './components/HUD';
import './styles/theme.css';
import './styles/base.css';

export function App() {
  const game = useGame('beginner');
  const boardRef = useRef<HTMLDivElement>(null);
  const difficultyRef = useRef(game.difficulty);
  difficultyRef.current = game.difficulty;

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
