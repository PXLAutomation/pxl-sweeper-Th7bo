import { useGame } from './state/useGame';
import { Board } from './components/Board';
import { HUD } from './components/HUD';
import './styles/base.css';

export function App() {
  const game = useGame('beginner');

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
        onReveal={game.reveal}
        onToggleFlag={game.toggleFlag}
        onChord={game.chord}
      />
    </main>
  );
}
