import type { Difficulty } from '../engine/types';
import { DIFFICULTY_ORDER } from '../engine/difficulty';

interface DifficultySelectProps {
  current: Difficulty;
  onSelect: (d: Difficulty) => void;
}

export function DifficultySelect({ current, onSelect }: DifficultySelectProps) {
  return (
    <div className="difficulty-select" role="radiogroup" aria-label="Difficulty">
      {DIFFICULTY_ORDER.map((d) => (
        <button
          key={d}
          type="button"
          className={`difficulty-btn${d === current ? ' difficulty-btn-active' : ''}`}
          aria-pressed={d === current}
          onClick={() => onSelect(d)}
          data-testid={`difficulty-${d}`}
        >
          {d.charAt(0).toUpperCase() + d.slice(1)}
        </button>
      ))}
    </div>
  );
}
