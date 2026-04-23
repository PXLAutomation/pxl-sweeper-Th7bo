import type { Cell as CellType, GameStatus } from '../engine/types';
import { getCellVisualState, getCellText, getCellAriaLabel } from './cellVisualState';

interface CellProps {
  cell: CellType;
  isExploded: boolean;
  isFocused: boolean;
  gameStatus: GameStatus;
}

export function Cell({ cell, isExploded, isFocused, gameStatus }: CellProps) {
  const vs = getCellVisualState(cell, isExploded, gameStatus);

  return (
    <button
      type="button"
      className={`cell cell-${vs}${isFocused ? ' cell-focused' : ''}`}
      data-state={vs}
      data-focused={isFocused || undefined}
      data-row={cell.row}
      data-col={cell.col}
      data-testid={`cell-${cell.row}-${cell.col}`}
      aria-label={getCellAriaLabel(cell, vs)}
      tabIndex={-1}
    >
      {getCellText(vs)}
    </button>
  );
}
