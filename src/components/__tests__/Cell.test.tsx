import { render, screen } from '@testing-library/react';
import { Cell } from '../Cell';
import { getCellVisualState } from '../cellVisualState';
import type { Cell as CellType } from '../../engine/types';

function makeCell(overrides: Partial<CellType> = {}): CellType {
  return { row: 0, col: 0, mine: false, adjacent: 0, state: 'hidden', ...overrides };
}

describe('getCellVisualState', () => {
  it('returns hidden for a hidden cell', () => {
    expect(getCellVisualState(makeCell(), false, 'playing')).toBe('hidden');
  });

  it('returns flagged for a flagged cell during play', () => {
    expect(getCellVisualState(makeCell({ state: 'flagged' }), false, 'playing')).toBe('flagged');
  });

  it('returns flagged for a correctly flagged mine on loss', () => {
    expect(getCellVisualState(makeCell({ state: 'flagged', mine: true }), false, 'lost')).toBe('flagged');
  });

  it('returns wrong-flag for a flagged non-mine on loss', () => {
    expect(getCellVisualState(makeCell({ state: 'flagged', mine: false }), false, 'lost')).toBe('wrong-flag');
  });

  it('returns revealed-empty for a revealed cell with 0 adjacent', () => {
    expect(getCellVisualState(makeCell({ state: 'revealed' }), false, 'playing')).toBe('revealed-empty');
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8] as const)('returns number-%i for adjacent=%i', (n) => {
    expect(getCellVisualState(makeCell({ state: 'revealed', adjacent: n }), false, 'playing')).toBe(`number-${n}`);
  });

  it('returns mine for a revealed mine that is not the exploded cell', () => {
    expect(getCellVisualState(makeCell({ state: 'revealed', mine: true }), false, 'lost')).toBe('mine');
  });

  it('returns mine-exploded for the exploded mine cell', () => {
    expect(getCellVisualState(makeCell({ state: 'revealed', mine: true }), true, 'lost')).toBe('mine-exploded');
  });
});

describe('Cell component', () => {
  it('renders a hidden cell with empty text', () => {
    render(<Cell cell={makeCell()} isExploded={false} gameStatus="playing" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-state', 'hidden');
    expect(btn).toHaveTextContent('');
  });

  it('renders a flagged cell with flag symbol', () => {
    render(<Cell cell={makeCell({ state: 'flagged' })} isExploded={false} gameStatus="playing" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-state', 'flagged');
    expect(btn).toHaveTextContent('⚑');
  });

  it('renders a numbered cell with the digit', () => {
    render(<Cell cell={makeCell({ state: 'revealed', adjacent: 3 })} isExploded={false} gameStatus="playing" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-state', 'number-3');
    expect(btn).toHaveTextContent('3');
  });

  it('renders an exploded mine cell', () => {
    render(<Cell cell={makeCell({ state: 'revealed', mine: true })} isExploded={true} gameStatus="lost" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'mine-exploded');
  });

  it('renders wrong-flag on loss', () => {
    render(<Cell cell={makeCell({ state: 'flagged', mine: false })} isExploded={false} gameStatus="lost" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-state', 'wrong-flag');
    expect(btn).toHaveTextContent('✗');
  });

  it('includes position in the aria-label', () => {
    render(<Cell cell={makeCell({ row: 2, col: 5 })} isExploded={false} gameStatus="playing" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Hidden cell, row 3, column 6');
  });

  it('sets data-row and data-col attributes', () => {
    render(<Cell cell={makeCell({ row: 4, col: 7 })} isExploded={false} gameStatus="playing" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-row', '4');
    expect(btn).toHaveAttribute('data-col', '7');
  });
});
