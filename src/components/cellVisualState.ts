import type { Cell, GameStatus } from '../engine/types';

export type CellVisualState =
  | 'hidden'
  | 'flagged'
  | 'wrong-flag'
  | 'revealed-empty'
  | 'mine'
  | 'mine-exploded'
  | `number-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

export function getCellVisualState(
  cell: Cell,
  isExploded: boolean,
  gameStatus: GameStatus,
): CellVisualState {
  if (cell.state === 'flagged') {
    if (gameStatus === 'lost' && !cell.mine) return 'wrong-flag';
    return 'flagged';
  }
  if (cell.state === 'hidden') return 'hidden';
  if (cell.mine) return isExploded ? 'mine-exploded' : 'mine';
  if (cell.adjacent === 0) return 'revealed-empty';
  return `number-${cell.adjacent as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
}

const CELL_TEXT: Record<string, string> = {
  hidden: '',
  flagged: '⚑',
  'wrong-flag': '✗',
  'revealed-empty': '',
  mine: '✱',
  'mine-exploded': '✹',
};

export function getCellText(vs: CellVisualState): string {
  return CELL_TEXT[vs] ?? vs.replace('number-', '');
}

export function getCellAriaLabel(cell: Cell, vs: CellVisualState): string {
  const pos = `row ${cell.row + 1}, column ${cell.col + 1}`;
  switch (vs) {
    case 'hidden':
      return `Hidden cell, ${pos}`;
    case 'flagged':
      return `Flagged cell, ${pos}`;
    case 'wrong-flag':
      return `Incorrectly flagged cell, ${pos}`;
    case 'revealed-empty':
      return `Empty cell, ${pos}`;
    case 'mine':
      return `Mine, ${pos}`;
    case 'mine-exploded':
      return `Exploded mine, ${pos}`;
    default: {
      const n = vs.replace('number-', '');
      return `${n} adjacent mine${n === '1' ? '' : 's'}, ${pos}`;
    }
  }
}
