import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../../App';

beforeEach(() => {
  localStorage.clear();
});

function getBoard() {
  return screen.getByRole('grid');
}

function focusedCell() {
  return document.querySelector<HTMLElement>('[data-focused="true"]');
}

function focusBoard() {
  getBoard().focus();
}

function pressKey(key: string) {
  fireEvent.keyDown(getBoard(), { key });
}

// ---------------------------------------------------------------------------
// Arrow key navigation
// ---------------------------------------------------------------------------

describe('Keyboard: arrow navigation', () => {
  it('moves focus down with ArrowDown', () => {
    render(<App />);
    focusBoard();

    const initial = focusedCell();
    expect(initial).toBeTruthy();
    const initialRow = Number(initial!.getAttribute('data-row'));

    pressKey('ArrowDown');

    const next = focusedCell();
    expect(Number(next!.getAttribute('data-row'))).toBe(initialRow + 1);
  });

  it('moves focus up with ArrowUp', () => {
    render(<App />);
    focusBoard();

    pressKey('ArrowDown');
    pressKey('ArrowDown');

    const before = focusedCell();
    const row = Number(before!.getAttribute('data-row'));

    pressKey('ArrowUp');

    const after = focusedCell();
    expect(Number(after!.getAttribute('data-row'))).toBe(row - 1);
  });

  it('moves focus right with ArrowRight', () => {
    render(<App />);
    focusBoard();

    const initial = focusedCell();
    const initialCol = Number(initial!.getAttribute('data-col'));

    pressKey('ArrowRight');

    const next = focusedCell();
    expect(Number(next!.getAttribute('data-col'))).toBe(initialCol + 1);
  });

  it('moves focus left with ArrowLeft', () => {
    render(<App />);
    focusBoard();

    pressKey('ArrowRight');
    pressKey('ArrowRight');

    const before = focusedCell();
    const col = Number(before!.getAttribute('data-col'));

    pressKey('ArrowLeft');

    const after = focusedCell();
    expect(Number(after!.getAttribute('data-col'))).toBe(col - 1);
  });

  it('clamps focus at grid boundaries', () => {
    render(<App />);
    focusBoard();

    for (let i = 0; i < 20; i++) pressKey('ArrowUp');
    for (let i = 0; i < 20; i++) pressKey('ArrowLeft');

    const topLeft = focusedCell();
    expect(topLeft!.getAttribute('data-row')).toBe('0');
    expect(topLeft!.getAttribute('data-col')).toBe('0');

    pressKey('ArrowUp');
    pressKey('ArrowLeft');
    expect(focusedCell()!.getAttribute('data-row')).toBe('0');
    expect(focusedCell()!.getAttribute('data-col')).toBe('0');
  });
});

// ---------------------------------------------------------------------------
// Reveal, flag, chord via keyboard
// ---------------------------------------------------------------------------

describe('Keyboard: reveal, flag, chord', () => {
  it('Enter reveals the focused cell', () => {
    render(<App />);
    focusBoard();

    const fc = focusedCell()!;
    expect(fc.getAttribute('data-state')).toBe('hidden');

    pressKey('Enter');

    expect(fc.getAttribute('data-state')).not.toBe('hidden');
  });

  it('Space reveals the focused cell', () => {
    render(<App />);
    focusBoard();

    const fc = focusedCell()!;
    expect(fc.getAttribute('data-state')).toBe('hidden');

    pressKey(' ');

    expect(fc.getAttribute('data-state')).not.toBe('hidden');
  });

  it('F flags the focused cell', () => {
    render(<App />);
    focusBoard();

    for (let i = 0; i < 10; i++) pressKey('ArrowUp');
    for (let i = 0; i < 10; i++) pressKey('ArrowLeft');

    expect(focusedCell()!.getAttribute('data-state')).toBe('hidden');

    pressKey('f');

    expect(focusedCell()!.getAttribute('data-state')).toBe('flagged');
  });

  it('F unflags a flagged cell', () => {
    render(<App />);
    focusBoard();

    for (let i = 0; i < 10; i++) pressKey('ArrowUp');
    for (let i = 0; i < 10; i++) pressKey('ArrowLeft');

    pressKey('f');
    expect(focusedCell()!.getAttribute('data-state')).toBe('flagged');

    pressKey('f');
    expect(focusedCell()!.getAttribute('data-state')).toBe('hidden');
  });

  it('C dispatches chord on the focused cell (no-op on hidden)', () => {
    render(<App />);
    focusBoard();

    const fc = focusedCell()!;
    expect(fc.getAttribute('data-state')).toBe('hidden');

    pressKey('c');

    expect(fc.getAttribute('data-state')).toBe('hidden');
  });
});

// ---------------------------------------------------------------------------
// Global shortcuts: N, 1, 2, 3
// ---------------------------------------------------------------------------

describe('Keyboard: global shortcuts', () => {
  it('N starts a new game, resetting all cells', () => {
    render(<App />);
    focusBoard();

    pressKey('Enter');
    expect(screen.getByTestId('game-status')).toHaveTextContent('Playing');

    fireEvent.keyDown(document, { key: 'n' });

    expect(screen.getByTestId('game-status')).toHaveTextContent('Ready');
    screen.getAllByTestId(/^cell-/).forEach((c) => {
      expect(c).toHaveAttribute('data-state', 'hidden');
    });
  });

  it('1 switches to Beginner and resets', () => {
    render(<App />);

    fireEvent.keyDown(document, { key: '2' });
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(256);

    fireEvent.keyDown(document, { key: '1' });
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(81);
  });

  it('2 switches to Intermediate', () => {
    render(<App />);

    fireEvent.keyDown(document, { key: '2' });
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(256);
  });

  it('3 switches to Expert', () => {
    render(<App />);

    fireEvent.keyDown(document, { key: '3' });
    expect(screen.getAllByTestId(/^cell-/)).toHaveLength(480);
  });
});

// ---------------------------------------------------------------------------
// Focus indicator visibility
// ---------------------------------------------------------------------------

describe('Keyboard: focus indicator', () => {
  it('exactly one cell has data-focused at any time', () => {
    render(<App />);
    const focused = screen.getByRole('grid').querySelectorAll('[data-focused="true"]');
    expect(focused).toHaveLength(1);
  });

  it('focus indicator follows arrow key movement', () => {
    render(<App />);
    focusBoard();

    const first = focusedCell()!;
    const r1 = first.getAttribute('data-row');
    const c1 = first.getAttribute('data-col');

    pressKey('ArrowRight');

    const second = focusedCell()!;
    expect(second.getAttribute('data-col')).toBe(String(Number(c1) + 1));
    expect(second.getAttribute('data-row')).toBe(r1);
  });

  it('board has tabIndex 0 for keyboard accessibility', () => {
    render(<App />);
    expect(getBoard()).toHaveAttribute('tabindex', '0');
  });
});
