# PXL Sweeper Requirements

## Overview

PXL Sweeper is a small one-page browser game inspired by classic Minesweeper.
The player reveals tiles on a hidden grid, marks suspected mines with flags, and tries to clear every safe tile without revealing a mine.

## Product Goal

- Deliver a static browser game that can be opened locally or deployed as a simple static site.
- Keep the project small, understandable, and easy to review in a course setting.
- Stay close to the core Minesweeper gameplay loop without adding unnecessary systems.

## Core Gameplay

### Player Goal

- Reveal all non-mine tiles on the board.

### Loss Condition

- The game is lost immediately when the player reveals a mine.

### Win Condition

- The game is won immediately when every non-mine tile has been revealed.

### Main Game Loop

- The player starts a new game and sees a hidden tile grid.
- The player reveals tiles one at a time.
- If a revealed tile has adjacent mines, the tile displays the mine count.
- If a revealed tile has zero adjacent mines, the game reveals the connected empty area and its bordering numbered tiles.
- The player may mark hidden tiles as suspected mines.
- The game continues until the player either reveals a mine or clears all safe tiles.

## In-Scope Features

- A single-page browser UI.
- One game board visible on screen at a time.
- Left-click or equivalent primary action to reveal a tile.
- Right-click or equivalent secondary action to toggle a flag on a hidden tile.
- A visible game state that distinguishes active play, win, and loss.
- Numbered tiles that show adjacent mine counts from 1 to 8.
- Automatic reveal expansion for zero-adjacent-mine tiles.
- A new game or reset control that creates a fresh board.
- A visible mine counter, remaining mines counter, or equivalent flag status display.
- A visible timer is optional for the first version and is not required.
- A layout that works in modern desktop browsers.

## Out-of-Scope Features

- Multiplayer.
- Backend services, accounts, or cloud persistence.
- Leaderboards.
- Difficulty presets beyond the initial default board unless later requirements add them.
- Custom board editors.
- Touch-first mobile UX optimization.
- Animations, sound systems, or visual effects beyond simple gameplay feedback.
- Monetization, ads, telemetry, or analytics.

## Functional Requirements

### Board Setup

- The game shall generate a hidden grid of tiles for each new game.
- The game shall place a fixed number of mines on the board for the default mode.
- The game shall calculate and store the adjacent mine count for every non-mine tile.
- The game shall reset all tile state, counters, and end-state indicators when a new game starts.

### Tile Interaction

- The player shall be able to reveal any hidden, unflagged tile.
- Revealing a mine tile shall end the game in a loss state.
- Revealing a non-mine tile shall show that tile as revealed.
- Revealing a non-mine tile with zero adjacent mines shall reveal the connected empty region and its bordering numbered tiles.
- The player shall be able to toggle a flag on a hidden tile.
- The game shall prevent a flagged tile from being revealed by the standard reveal action unless it is unflagged first.
- The game shall prevent further board interactions after a win or loss, except for starting a new game.

### Game State and Feedback

- The game shall display whether the current game is in progress, won, or lost.
- The game shall provide clear visual distinction between hidden, revealed, and flagged tiles.
- The game shall reveal the board outcome clearly after a loss.
- The game shall indicate when all safe tiles have been revealed.

## Control Scheme

- Primary action: reveal the selected tile.
- Secondary action: toggle a flag on the selected hidden tile.
- Reset action: start a fresh board without reloading the page.

## Browser and Platform Assumptions

- The game shall run as a static frontend-only site.
- The game shall not require a backend, database, or server-side rendering.
- The game shall work in current desktop versions of major evergreen browsers such as Chrome, Firefox, and Edge.
- The game shall be usable with a mouse or trackpad.
- The first version may treat mobile support as best-effort rather than a release requirement.

## Non-Functional Requirements

- The implementation shall remain simple enough for review in small, incremental phases.
- Core gameplay logic shall be structured so that it can be tested outside the rendering layer.
- The game shall load from local project files or a static host without build-time server dependencies.
- The UI shall provide clear readable contrast between tile states and game status text.

## Acceptance Criteria

- A user can start a new game in the browser and see a hidden grid of tiles.
- A user can reveal a safe tile and see the correct numbered result or empty-area expansion.
- A user can flag and unflag hidden tiles using the secondary action.
- Revealing a mine ends the game and clearly communicates a loss.
- Revealing all safe tiles ends the game and clearly communicates a win.
- The board stops accepting normal play actions after the game is over.
- A user can start another game without refreshing the page.
- The project remains a static one-page JavaScript application with no backend dependency.

## Project Setup Requirements

- The project shall include a `package.json` file in the repository root.
- The `package.json` file shall define the project's runnable commands in a consistent way.
- The `package.json` file shall include at least a `test` script so the same test command can be run every time.
- If the project uses ES module imports in JavaScript, `package.json` shall set `"type": "module"`.
- The project shall remain compatible with a plain JavaScript, static-site workflow.
