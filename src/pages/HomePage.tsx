import { Link } from 'react-router-dom';
import { DIFFICULTIES, DIFFICULTY_ORDER } from '../engine/difficulty';
import '../styles/home.css';

const GRID_SYMBOLS = ['💣', '🚩', '1', '2', '3', '💎', '✦', '◆'];

function MineGrid() {
  const cells = Array.from({ length: 64 }, (_, i) => {
    const symbol = GRID_SYMBOLS[i % GRID_SYMBOLS.length]!;
    const delay = (Math.floor(i / 8) * 0.06 + (i % 8) * 0.08).toFixed(2);
    return (
      <span key={i} className="deco-cell" style={{ animationDelay: `${delay}s` }} aria-hidden="true">
        {symbol}
      </span>
    );
  });
  return <div className="deco-grid" aria-hidden="true">{cells}</div>;
}

const difficultyMeta: Record<string, { emoji: string; description: string }> = {
  beginner: { emoji: '🟢', description: 'Ease in. Small grid, few mines.' },
  intermediate: { emoji: '🟡', description: 'The real deal. Bigger board, sharper focus.' },
  expert: { emoji: '🔴', description: 'No mercy. Massive grid, mines everywhere.' },
};

export function HomePage() {
  return (
    <div className="home">
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className="hero">
        <MineGrid />
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-pxl">PXL</span>
            <span className="title-sweeper">Sweeper</span>
          </h1>
          <p className="hero-tagline">
            Classic minesweeper. Pixel-perfect precision.
            <span className="blink" aria-hidden="true">_</span>
          </p>
          <Link to="/app" className="play-btn" role="button">
            <span className="play-btn-icon" aria-hidden="true">&#9654;</span>
            Play Now
          </Link>
        </div>
      </header>

      <section className="difficulties" aria-labelledby="diff-heading">
        <h2 id="diff-heading" className="section-heading">Choose Your Challenge</h2>
        <div className="diff-cards">
          {DIFFICULTY_ORDER.map((d) => {
            const preset = DIFFICULTIES[d];
            const meta = difficultyMeta[d]!;
            return (
              <Link key={d} to={`/app?difficulty=${d}`} className="diff-card" aria-label={`Play ${d} difficulty`}>
                <span className="diff-emoji" aria-hidden="true">{meta.emoji}</span>
                <h3 className="diff-name">{d.charAt(0).toUpperCase() + d.slice(1)}</h3>
                <p className="diff-stats">
                  {preset.rows}&times;{preset.cols} &middot; {preset.mines} mines
                </p>
                <p className="diff-desc">{meta.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="controls-preview" aria-labelledby="controls-heading">
        <h2 id="controls-heading" className="section-heading">Controls</h2>
        <div className="controls-grid">
          <div className="control-group">
            <h3 className="control-group-title">Mouse</h3>
            <ul className="control-list">
              <li><kbd>Left click</kbd> Reveal tile</li>
              <li><kbd>Right click</kbd> Toggle flag</li>
              <li><kbd>L+R click</kbd> Chord reveal</li>
            </ul>
          </div>
          <div className="control-group">
            <h3 className="control-group-title">Keyboard</h3>
            <ul className="control-list">
              <li><kbd>Arrows</kbd> Move focus</li>
              <li><kbd>Enter</kbd> Reveal</li>
              <li><kbd>F</kbd> Flag</li>
              <li><kbd>C</kbd> Chord</li>
              <li><kbd>N</kbd> New game</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>
          Built with React + TypeScript + Vite &middot;
          <span className="footer-pixel" aria-hidden="true">&#9632;</span>
        </p>
      </footer>
    </div>
  );
}
