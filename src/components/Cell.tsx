import type { Cell as CellType, GameStatus } from '../engine/types';
import { getCellVisualState, getCellText, getCellAriaLabel } from './cellVisualState';

interface CellProps {
  cell: CellType;
  isExploded: boolean;
  gameStatus: GameStatus;
}

export function Cell({ cell, isExploded, gameStatus }: CellProps) {
  const vs = getCellVisualState(cell, isExploded, gameStatus);

  return (
    <button
      type="button"
      className={`cell cell-${vs}`}
      data-state={vs}
      data-row={cell.row}
      data-col={cell.col}
      data-testid={`cell-${cell.row}-${cell.col}`}
      aria-label={getCellAriaLabel(cell, vs)}
    >
      {getCellText(vs)}
    </button>
  );
}
