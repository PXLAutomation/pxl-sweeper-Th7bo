import { DIFFICULTY_ORDER } from './engine/difficulty';
import { useGame } from './state/useGame';

export function App() {
  const game = useGame('beginner');
  return (
    <main>
      <h1>PXL Sweeper</h1>
      <section aria-label="status">
        <p data-testid="status-difficulty">Difficulty: {game.difficulty}</p>
        <p data-testid="status-state">Status: {game.status}</p>
        <p data-testid="status-mines">Mines remaining: {game.minesRemaining}</p>
        <p data-testid="status-timer">Time: {game.elapsedSeconds}s</p>
      </section>
      <section aria-label="controls">
        <button type="button" onClick={() => game.newGame(game.difficulty)}>
          New game
        </button>
        {DIFFICULTY_ORDER.map((d) => (
          <button key={d} type="button" onClick={() => game.selectDifficulty(d)}>
            {d}
          </button>
        ))}
      </section>
    </main>
  );
}
