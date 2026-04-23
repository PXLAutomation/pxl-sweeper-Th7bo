# PXL Sweeper — Requirements

## Overview

PXL Sweeper is a single-page browser game. Minesweeper clone, classic rules, pixel-art visual theme. Static site, frontend only, no backend.

## Player Goal

Reveal every non-mine tile on the grid without detonating a mine.

## Game Loop

1. Player selects difficulty and starts a new game.
2. Player reveals tiles and flags suspected mines.
3. Revealing a numbered tile shows count of adjacent mines.
4. Revealing an empty (0-adjacent) tile flood-reveals connected empty region and its numbered border.
5. Revealing a mine ends the run as loss; all mines shown.
6. Revealing last non-mine tile ends run as win; remaining mines auto-flagged.
7. Player may start new game at any time.

## In-Scope Features

### Core Gameplay
- Rectangular grid of tiles, hidden at start.
- Reveal action on hidden tile.
- Flag toggle action on hidden tile (none → flag → none).
- Number on revealed tile = count of mines in 8 neighbors.
- Flood-reveal (recursive) from revealed 0-adjacent tile.
- Chord reveal: on a revealed numbered tile, if count of adjacent flags equals tile number, a chord action reveals all unflagged adjacent tiles. If any of those is a mine, the game is lost. Chord trigger: left+right click simultaneously (mouse) or C key on focused tile (keyboard).
- First-click safety: first revealed tile is never a mine, and is never adjacent to a mine if grid size permits. Mine placement deferred until after first reveal.
- Win detection: all non-mine tiles revealed.
- Loss detection: mine revealed.
- End-of-game state shows all mines; incorrectly flagged tiles distinguishable from correctly flagged tiles.

### Difficulty Levels
- Beginner: 9×9 grid, 10 mines.
- Intermediate: 16×16 grid, 40 mines.
- Expert: 16×30 grid, 99 mines.
- Player selects level from UI before starting game.

### HUD
- Mine counter: mines remaining = total mines − flags placed.
- Timer: starts on first reveal, stops on win/loss, displays elapsed seconds.
- New game control.
- Current difficulty indicator.

### Controls
- Mouse:
  - Left click: reveal tile.
  - Right click: toggle flag on hidden tile.
  - Left+right click simultaneously on revealed numbered tile: chord reveal.
  - Context menu suppressed over board.
- Keyboard:
  - Arrow keys: move focus cursor across grid.
  - Enter or Space: reveal focused tile.
  - F: toggle flag on focused tile.
  - C: chord reveal on focused revealed numbered tile.
  - N: new game.
  - 1 / 2 / 3: select Beginner / Intermediate / Expert and start new game.
  - Focused tile visibly highlighted.
- No mobile or touch support.

### Persistence (localStorage)
- Last selected difficulty.
- Best time per difficulty (seconds, integer).
- Data namespaced under `pxl-sweeper:` key prefix.
- Corrupted or missing values fall back to defaults without error.

### Visual Design
- Pixel-art theme.
- Visual design executed via the `frontend-design` skill at implementation time.
- Distinct visual states: hidden, revealed-empty, revealed-number (1..8 with per-number color), flagged, mine-revealed, mine-exploded, mine-wrong-flag, focused.

## Out-of-Scope

- Multiplayer or networked play.
- User accounts or authentication.
- Backend, database, server-side logic.
- Sound or music.
- Mobile or touch input.
- Leaderboards beyond local best times.
- Animations beyond simple state transitions.
- Custom board dimensions or custom mine counts.
- Internationalization.

## Browser Assumptions

- Modern evergreen desktop browsers: latest Chrome, Firefox, Edge, Safari.
- JavaScript enabled.
- localStorage available; graceful degradation if disabled (game still playable, persistence silently skipped).
- Keyboard and mouse input available.
- Minimum viewport 1024×700 for Expert level without scrolling; smaller viewports may scroll.

## Acceptance Criteria

- Starting any difficulty produces a grid of the correct dimensions and mine count.
- First reveal never detonates a mine.
- Flood-reveal expands fully across connected 0-adjacent region and stops at numbered border.
- Flag toggle does not reveal tile.
- Chord reveal fires only on revealed numbered tile whose adjacent flag count equals its number; otherwise chord input is a no-op.
- Chord reveal that uncovers a mine triggers loss.
- Mine counter updates on every flag change and never goes below a visible negative if over-flagging (display as-is).
- Timer starts on first reveal only, not on game load or difficulty select.
- Win triggers only when every non-mine tile is revealed.
- Loss triggers only on revealing a mine.
- After win or loss, no further reveal or flag input modifies board.
- New game control resets board, timer, and mine counter.
- Keyboard-only play completes a full game from new-game to win or loss.
- Best time writes to localStorage only on win, only if strictly better than stored value for that difficulty.
- Page refresh restores last selected difficulty from localStorage.

## Project Setup Requirements

- Repository root contains `package.json`.
- `package.json` defines runnable commands consistently.
- `package.json` includes at minimum `test`, `build`, `dev`, `lint`, and `typecheck` scripts.
- `package.json` sets `"type": "module"`.
- Stack: React (with Vite as build tool).
- Source in `src/`, tests in `src/` colocated or in `tests/` — finalized in `IMPLEMENTATION_PLAN.md`.
- Static build output deployable to GitHub Pages from the repository.
- Vite `base` config set to match GitHub Pages path for the deployed repo.

## Technology Constraints

- Language: TypeScript (ES modules, strict mode).
- UI framework: React.
- Build tool: Vite.
- Testing: Vitest + React Testing Library for unit and integration tests. No end-to-end framework.
- Type checking: `tsc --noEmit` runs as part of checks.
- No backend, no server runtime at play time.
- Deployment: GitHub Pages, branch-based publishing from repository.

## Open Questions

- Exact color palette and pixel-art asset source: decide in design phase via `frontend-design` skill.
