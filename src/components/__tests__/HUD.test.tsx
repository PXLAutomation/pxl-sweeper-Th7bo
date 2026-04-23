import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HUD } from '../HUD';

const base = {
  minesRemaining: 10,
  elapsedSeconds: 42,
  status: 'playing' as const,
  difficulty: 'beginner' as const,
  onNewGame: vi.fn(),
  onSelectDifficulty: vi.fn(),
};

describe('HUD', () => {
  it('displays the mine counter', () => {
    render(<HUD {...base} />);
    expect(screen.getByTestId('mine-counter')).toHaveTextContent('10');
  });

  it('displays the timer', () => {
    render(<HUD {...base} />);
    expect(screen.getByTestId('timer')).toHaveTextContent('42');
  });

  it('shows "Playing" status while playing', () => {
    render(<HUD {...base} />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('Playing');
  });

  it('shows "Ready" when idle', () => {
    render(<HUD {...base} status="idle" />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('Ready');
  });

  it('shows win indicator', () => {
    render(<HUD {...base} status="won" />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('You win!');
  });

  it('shows loss indicator', () => {
    render(<HUD {...base} status="lost" />);
    expect(screen.getByTestId('game-status')).toHaveTextContent('Game over');
  });

  it('calls onNewGame when new-game button is clicked', async () => {
    const onNewGame = vi.fn();
    render(<HUD {...base} onNewGame={onNewGame} />);
    await userEvent.click(screen.getByTestId('new-game'));
    expect(onNewGame).toHaveBeenCalledOnce();
  });

  it('renders difficulty buttons for all levels', () => {
    render(<HUD {...base} />);
    expect(screen.getByTestId('difficulty-beginner')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-intermediate')).toBeInTheDocument();
    expect(screen.getByTestId('difficulty-expert')).toBeInTheDocument();
  });

  it('marks the current difficulty as pressed', () => {
    render(<HUD {...base} difficulty="intermediate" />);
    expect(screen.getByTestId('difficulty-intermediate')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('difficulty-beginner')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('difficulty-expert')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onSelectDifficulty with the chosen level', async () => {
    const onSelect = vi.fn();
    render(<HUD {...base} onSelectDifficulty={onSelect} />);
    await userEvent.click(screen.getByTestId('difficulty-expert'));
    expect(onSelect).toHaveBeenCalledWith('expert');
  });
});
