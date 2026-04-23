import { useCallback, useRef } from 'react';
import type { Board as BoardType, GameStatus, Position } from '../engine/types';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardType;
  status: GameStatus;
  explodedAt: Position | null;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
}

function getCellCoords(e: React.MouseEvent): { row: number; col: number } | null {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-row]');
  if (!el) return null;
  const row = Number(el.dataset.row);
  const col = Number(el.dataset.col);
  if (Number.isNaN(row) || Number.isNaN(col)) return null;
  return { row, col };
}

export function Board({
  board,
  status,
  explodedAt,
  onReveal,
  onToggleFlag,
  onChord,
}: BoardProps) {
  const chordPending = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.buttons === 3) {
      chordPending.current = true;
    } else if (e.buttons === 1 || e.buttons === 2) {
      chordPending.current = false;
    }
  }, []);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (e.buttons !== 0) return;

      const coords = getCellCoords(e);
      if (!coords) {
        chordPending.current = false;
        return;
      }

      if (chordPending.current) {
        onChord(coords.row, coords.col);
      } else if (e.button === 0) {
        onReveal(coords.row, coords.col);
      } else if (e.button === 2) {
        onToggleFlag(coords.row, coords.col);
      }

      chordPending.current = false;
    },
    [onReveal, onToggleFlag, onChord],
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleMouseLeave = useCallback(() => {
    chordPending.current = false;
  }, []);

  return (
    <div
      className="board"
      role="grid"
      aria-label="Minesweeper board"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onMouseLeave={handleMouseLeave}
    >
      {board.cells.map((row, r) => (
        <div key={r} className="board-row" role="row">
          {row.map((cell) => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              isExploded={
                explodedAt !== null &&
                explodedAt.row === cell.row &&
                explodedAt.col === cell.col
              }
              gameStatus={status}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
