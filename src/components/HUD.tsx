import type { Difficulty, GameStatus } from '../engine/types';
import { DifficultySelect } from './DifficultySelect';

interface HUDProps {
  minesRemaining: number;
  elapsedSeconds: number;
  status: GameStatus;
  difficulty: Difficulty;
  bestTime: number | undefined;
  onNewGame: () => void;
  onSelectDifficulty: (d: Difficulty) => void;
}

function statusLabel(status: GameStatus): string {
  switch (status) {
    case 'idle':
      return 'Ready';
    case 'playing':
      return 'Playing';
    case 'won':
      return 'You win!';
    case 'lost':
      return 'Game over';
  }
}

export function HUD({
  minesRemaining,
  elapsedSeconds,
  status,
  difficulty,
  bestTime,
  onNewGame,
  onSelectDifficulty,
}: HUDProps) {
  return (
    <header className="hud" aria-label="Game information">
      <div className="hud-counter" data-testid="mine-counter">
        <span className="hud-label">Mines:</span>
        <span className="hud-value">{minesRemaining}</span>
      </div>

      <div className="hud-center">
        <button
          type="button"
          className="hud-new-game"
          data-testid="new-game"
          onClick={onNewGame}
        >
          New Game
        </button>
        <p className="hud-status" data-testid="game-status" aria-live="polite">
          {statusLabel(status)}
        </p>
      </div>

      <div className="hud-counter" data-testid="timer">
        <span className="hud-label">Time:</span>
        <span className="hud-value">{elapsedSeconds}</span>
      </div>

      {bestTime !== undefined && (
        <div className="hud-counter" data-testid="best-time">
          <span className="hud-label">Best:</span>
          <span className="hud-value">{bestTime}</span>
        </div>
      )}

      <DifficultySelect current={difficulty} onSelect={onSelectDifficulty} />
    </header>
  );
}
