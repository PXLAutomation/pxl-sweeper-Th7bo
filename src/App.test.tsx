import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the PXL Sweeper title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /pxl sweeper/i })).toBeInTheDocument();
  });
});
