import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../App';
import { Board } from '../Board';
import type { Board as BoardType, Cell } from '../../engine/types';

function getCells() {
  return screen.getAllByTestId(/^cell-/);
}

function makeBoardData(
  rows: number,
  cols: number,
  overrides?: (r: number, c: number) => Partial<Cell>,
): BoardType {
  const cells: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        mine: false,
        adjacent: 0,
        state: 'hidden',
        ...(overrides?.(r, c) ?? {}),
      });
    }
    cells.push(row);
  }
  return { rows, cols, cells };
}

// ---------------------------------------------------------------------------
// Integration tests — full App (mouse interactions)
// ---------------------------------------------------------------------------

describe('App integration: grid sizes', () => {
  it('renders 81 cells for Beginner', () => {
    render(<App />);
    expect(getCells()).toHaveLength(81);
  });

  it('renders 256 cells for Intermediate', async () => {
    render(<App />);
    await userEvent.click(screen.getByTestId('difficulty-intermediate'));
    expect(getCells()).toHaveLength(256);
  });

  it('renders 480 cells for Expert', async () => {
    render(<App />);
    await userEvent.click(screen.getByTestId('difficulty-expert'));
    expect(getCells()).toHaveLength(480);
  });
});

describe('App integration: mouse actions', () => {
  it('left-click reveals a hidden cell', () => {
    render(<App />);
    const cell = screen.getByTestId('cell-4-4');
    expect(cell).toHaveAttribute('data-state', 'hidden');

    fireEvent.mouseDown(cell, { button: 0, buttons: 1 });
    fireEvent.mouseUp(cell, { button: 0, buttons: 0 });

    expect(cell).not.toHaveAttribute('data-state', 'hidden');
  });

  it('right-click toggles flag on a hidden cell without revealing', () => {
    render(<App />);
    const cell = screen.getByTestId('cell-0-0');
    expect(cell).toHaveAttribute('data-state', 'hidden');

    fireEvent.mouseDown(cell, { button: 2, buttons: 2 });
    fireEvent.mouseUp(cell, { button: 2, buttons: 0 });

    expect(cell).toHaveAttribute('data-state', 'flagged');
  });

  it('right-clicking a flagged cell unflags it', () => {
    render(<App />);
    const cell = screen.getByTestId('cell-0-0');

    fireEvent.mouseDown(cell, { button: 2, buttons: 2 });
    fireEvent.mouseUp(cell, { button: 2, buttons: 0 });
    expect(cell).toHaveAttribute('data-state', 'flagged');

    fireEvent.mouseDown(cell, { button: 2, buttons: 2 });
    fireEvent.mouseUp(cell, { button: 2, buttons: 0 });
    expect(cell).toHaveAttribute('data-state', 'hidden');
  });

  it('mine counter decrements when a cell is flagged', () => {
    render(<App />);
    expect(screen.getByTestId('mine-counter')).toHaveTextContent('10');

    const cell = screen.getByTestId('cell-0-0');
    fireEvent.mouseDown(cell, { button: 2, buttons: 2 });
    fireEvent.mouseUp(cell, { button: 2, buttons: 0 });

    expect(screen.getByTestId('mine-counter')).toHaveTextContent('9');
  });

  it('new game resets all cells to hidden', async () => {
    render(<App />);
    const cell = screen.getByTestId('cell-4-4');

    fireEvent.mouseDown(cell, { button: 0, buttons: 1 });
    fireEvent.mouseUp(cell, { button: 0, buttons: 0 });
    expect(cell).not.toHaveAttribute('data-state', 'hidden');

    await userEvent.click(screen.getByTestId('new-game'));

    getCells().forEach((c) => {
      expect(c).toHaveAttribute('data-state', 'hidden');
    });
  });

  it('shows "Ready" status before first reveal', () => {
    render(<App />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('Ready');
  });
});

// ---------------------------------------------------------------------------
// Board component isolation: chord detection
// ---------------------------------------------------------------------------

describe('Board: chord detection via left+right click', () => {
  it('fires onChord when both buttons are pressed and released', () => {
    const board = makeBoardData(3, 3, (r, c) => {
      if (r === 1 && c === 1) return { state: 'revealed', adjacent: 1 };
      if (r === 0 && c === 0) return { state: 'flagged', mine: true };
      return {};
    });

    const onChord = vi.fn();
    render(
      <Board
        board={board}
        status="playing"
        explodedAt={null}
        onReveal={vi.fn()}
        onToggleFlag={vi.fn()}
        onChord={onChord}
      />,
    );

    const cell = screen.getByTestId('cell-1-1');

    fireEvent.mouseDown(cell, { button: 0, buttons: 1 });
    fireEvent.mouseDown(cell, { button: 2, buttons: 3 });
    fireEvent.mouseUp(cell, { button: 2, buttons: 1 });
    fireEvent.mouseUp(cell, { button: 0, buttons: 0 });

    expect(onChord).toHaveBeenCalledWith(1, 1);
  });

  it('does not fire onReveal or onToggleFlag during a chord', () => {
    const board = makeBoardData(3, 3);
    const onReveal = vi.fn();
    const onToggleFlag = vi.fn();
    const onChord = vi.fn();

    render(
      <Board
        board={board}
        status="playing"
        explodedAt={null}
        onReveal={onReveal}
        onToggleFlag={onToggleFlag}
        onChord={onChord}
      />,
    );

    const cell = screen.getByTestId('cell-1-1');

    fireEvent.mouseDown(cell, { button: 0, buttons: 1 });
    fireEvent.mouseDown(cell, { button: 2, buttons: 3 });
    fireEvent.mouseUp(cell, { button: 2, buttons: 1 });
    fireEvent.mouseUp(cell, { button: 0, buttons: 0 });

    expect(onReveal).not.toHaveBeenCalled();
    expect(onToggleFlag).not.toHaveBeenCalled();
    expect(onChord).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// Board: context menu suppression
// ---------------------------------------------------------------------------

describe('Board: context menu', () => {
  it('prevents the default context menu on the board', () => {
    const board = makeBoardData(3, 3);
    render(
      <Board
        board={board}
        status="playing"
        explodedAt={null}
        onReveal={vi.fn()}
        onToggleFlag={vi.fn()}
        onChord={vi.fn()}
      />,
    );

    const grid = screen.getByRole('grid');
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const wasNotPrevented = grid.dispatchEvent(event);
    expect(wasNotPrevented).toBe(false);
  });
});
