export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface DifficultyPreset {
  id: Difficulty;
  rows: number;
  cols: number;
  mines: number;
}

export type CellState = 'hidden' | 'revealed' | 'flagged';

export interface Cell {
  row: number;
  col: number;
  mine: boolean;
  adjacent: number;
  state: CellState;
}

export interface Board {
  rows: number;
  cols: number;
  cells: Cell[][];
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  difficulty: Difficulty;
  board: Board;
  status: GameStatus;
  minesPlaced: boolean;
  totalMines: number;
  explodedAt: Position | null;
}
