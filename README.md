# PXL Sweeper

A tiny static browser Minesweeper-style game built as a one-page JavaScript app.

## Commands

- `npm run build` creates the deployable static artifact in `dist/`.
- `npm test` runs the automated tests.
- `npm start` serves the project locally at `http://localhost:4173`.
- `npm run preview` serves the built `dist/` output at `http://localhost:4174`.

## Gameplay

- Primary click reveals a hidden tile.
- Secondary click flags or unflags a hidden tile.
- Reset starts a fresh board without reloading the page.
- Clear every safe tile to win. Reveal a mine and the run ends immediately.

## Requirements Coverage

- Static frontend-only application with no backend dependency.
- One visible board with reveal, flag, win, loss, and reset behavior.
- Pure gameplay engine separated from DOM rendering for easier testing.
- Automated tests for board generation, gameplay transitions, and UI rendering helpers.

## Current Structure

- `src/main.js` holds the current app bootstrap.
- `src/game/` holds pure game engine modules with no DOM dependencies.
- `tests/` holds automated tests run by Node's built-in test runner.

## Engine Scope

- `src/game/board.js` handles board generation and adjacency calculation.
- `src/game/state.js` holds the game-state container and derived counters.
- `src/game/actions.js` handles reveal and flag transitions without touching the DOM.

## UI Scope

- `src/ui/render.js` maps engine state into visible board, status, and metric output.
- `src/ui/events.js` handles delegated click, secondary-click, and reset interactions.
- `src/styles.css` defines the one-page visual system for the playable board.

## Local Verification

- Run `npm test` to execute the automated suites.
- Run `npm start`, then open `http://localhost:4173`.
- Confirm the board renders, tiles reveal, right-click flags, reset creates a fresh board, and win/loss states lock the board.

## GitHub Pages Deployment

- The repository includes [.github/workflows/deploy-pages.yml](/home/th7bo/pxl-codex/.github/workflows/deploy-pages.yml), which follows GitHub's current Pages Actions flow using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.
- `npm run build` prepares `dist/` so deployment uploads only the site assets instead of the whole repository.
- On GitHub, open repository `Settings` -> `Pages` and ensure the source is GitHub Actions.
- Push the deployment workflow to the default branch to trigger the first Pages deployment.
