# PXL Sweeper Implementation Plan

## Overview

This plan delivers PXL Sweeper as a small static JavaScript browser game with a single-page UI, testable gameplay logic, and a low-friction path to local execution and static deployment.
The work is split into review-sized phases so each phase ends in a verifiable checkpoint before more complexity is added.

## Assumptions

- The initial release uses one default board size and one default mine count.
- The first release targets desktop browsers and mouse or trackpad interaction.
- The project uses plain JavaScript and a minimal test setup.
- A build step may exist for consistency, but the deployed output remains a static site.
- A timer is not required for the first release.
- Accessibility improvements should cover semantic controls and readable status feedback, but full keyboard gameplay support is not required unless later added to requirements.

## Delivery Strategy

This plan uses a hybrid strategy with mostly layered implementation and thin vertical verification.
The core engine and test harness are established first because Minesweeper logic has correctness risks that should be isolated before the UI depends on it. Each later phase still ends with a user-visible or reviewable outcome so integration cost does not accumulate until the end. This fits a small project with frequent review checkpoints and avoids late rework in recursive reveal logic or end-state handling.

## Phase List

- Phase 1: Establish static app scaffold and test workflow
- Phase 2: Implement board generation and pure game-state engine
- Phase 3: Add reveal, flag, and game-ending rules with engine tests
- Phase 4: Build the one-page UI and connect engine interactions
- Phase 5: Stabilize UX, docs, and release readiness

## Detailed Phases

## Phase 1: Establish static app scaffold and test workflow

### Goal

Create the repository structure, package scripts, static entry page, and a runnable automated test setup.

### Scope

- Add the root `package.json`.
- Add the static browser entry file and source folders.
- Add a minimal test runner configuration and one passing smoke test.
- Keep this phase focused on project structure, not gameplay behavior.

### Expected files to change

- `package.json`
- `index.html`
- `src/`
- `tests/`
- `.gitignore`
- `README.md`

### Dependencies

- Depends on `REQUIREMENTS.md`.
- No earlier implementation phase is required.

### Risks

- Low risk.
- The main failure mode is picking a setup that is heavier than needed for a plain static JavaScript project.

### Tests and checks to run

- `npm test`
- Manual smoke check that `index.html` opens and shows the base app shell

### Review check before moving work to `DONE.md`

- Confirm the scaffold matches the static-site requirements and does not introduce backend or framework complexity.
- Confirm package scripts are concrete and reusable for later phases.
- Confirm the test setup is working rather than placeholder-only.
- Confirm docs mention how to run the project locally if that changed.
- Confirm no speculative feature work leaked into this phase.
- Confirm unfinished setup work is written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- [ ] Add `package.json` with consistent project scripts including `test`
- [ ] Add static app entry files for the one-page game shell
- [ ] Add a minimal automated test setup and one passing smoke test
- [ ] Verify the scaffold loads locally and `npm test` passes

### Exit criteria for moving items to `DONE.md`

- `package.json` exists at the repository root and defines a working `test` script.
- Static entry files exist and open as a one-page app shell without backend dependencies.
- At least one automated test runs and passes through the documented test command.
- The phase diff has been reviewed for scope and kept limited to setup concerns.

## Phase 2: Implement board generation and pure game-state engine

### Goal

Create the core board model and pure state helpers that generate a valid Minesweeper board and expose the data needed by the UI.

### Scope

- Define tile and board state structures.
- Implement board creation, mine placement, and adjacent-count calculation.
- Keep the engine pure and independent from DOM code.
- Add unit tests for board structure and count correctness.

### Expected files to change

- `src/game/board.js`
- `src/game/constants.js`
- `src/game/types.js` or equivalent lightweight shape documentation module if needed
- `tests/board.test.js` or `tests/game/board.test.js`
- `README.md`

### Dependencies

- Depends on completion of Phase 1.
- Requires the test command and source layout from the scaffold phase.

### Risks

- Medium risk.
- Incorrect adjacency calculation or mine placement will corrupt every later gameplay behavior.

### Tests and checks to run

- `npm test`
- Unit tests for mine counts, board dimensions, and valid tile metadata

### Review check before moving work to `DONE.md`

- Confirm the engine logic is isolated from rendering and event handling.
- Confirm each board cell has a clear, consistent state shape.
- Confirm test coverage checks real adjacency outcomes rather than only object existence.
- Confirm no reveal, flag, or DOM behavior slipped into this phase.
- Confirm documentation mentions any agreed default board settings.
- Confirm unfinished engine follow-ups are written to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- [ ] Implement a pure board generator for the default grid and mine count
- [ ] Compute adjacent mine counts for every non-mine tile
- [ ] Define a stable tile state shape for engine and UI integration
- [ ] Add unit tests covering board generation and adjacency correctness

### Exit criteria for moving items to `DONE.md`

- The engine can create a complete board state for a new game without touching the DOM.
- Every non-mine tile receives the correct adjacent mine count in automated tests.
- Automated tests cover at least one deterministic board scenario with explicit expected counts.
- The phase diff stays limited to board-state generation concerns.

## Phase 3: Add reveal, flag, and game-ending rules with engine tests

### Goal

Implement the gameplay state transitions that control reveal expansion, flag toggling, win detection, loss detection, and post-game interaction locking.

### Scope

- Add reveal action logic for hidden, safe, and mine tiles.
- Add recursive or iterative zero-tile expansion logic.
- Add flag toggling rules.
- Add win and loss detection.
- Add protection against further gameplay actions after game over.
- Cover the behavior with unit and integration-style engine tests.

### Expected files to change

- `src/game/actions.js`
- `src/game/board.js`
- `src/game/state.js`
- `tests/game/actions.test.js`
- `tests/game/state.test.js`
- `README.md`

### Dependencies

- Depends on completion of Phase 2.
- Requires stable board-state structures and the test harness.

### Risks

- High risk.
- Reveal expansion can produce infinite loops, duplicate processing, or missed tiles.
- State transitions can easily become inconsistent around flagged tiles or game-over behavior.

### Tests and checks to run

- `npm test`
- Unit tests for revealing numbered, empty, and mined tiles
- Unit tests for flag toggle behavior
- Integration-style engine tests for win, loss, and locked post-game state

### Review check before moving work to `DONE.md`

- Confirm reveal and flag logic remain DOM-independent.
- Confirm expansion logic is explicitly tested for boundary and visited-tile behavior.
- Confirm flagged tiles cannot be revealed through the standard reveal path.
- Confirm win and loss states are binary and block normal play afterwards.
- Confirm requirement traceability for tile interaction rules and game outcome rules.
- Confirm unfinished edge cases are written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- [ ] Implement reveal behavior for safe, empty, and mine tiles
- [ ] Implement zero-tile expansion without duplicate or infinite processing
- [ ] Implement flag toggling and prevent reveal on flagged tiles
- [ ] Implement win and loss state detection with post-game interaction lock
- [ ] Add engine tests for reveal, flag, expansion, and game-over rules

### Exit criteria for moving items to `DONE.md`

- Revealing a mine deterministically produces a loss state in automated tests.
- Revealing a zero-adjacent tile reveals the correct connected region and bordering numbered tiles in automated tests.
- Flag toggling works only on hidden tiles and flagged tiles are not revealed by normal reveal actions.
- The engine transitions to a win state when all non-mine tiles are revealed.
- Further reveal and flag actions are blocked after win or loss in automated tests.

## Phase 4: Build the one-page UI and connect engine interactions

### Goal

Render the playable game in the browser and wire the UI to the tested engine actions.

### Scope

- Build the page layout for title, status area, controls, and board.
- Render hidden, revealed, flagged, win, and loss states clearly.
- Connect primary and secondary tile actions to engine operations.
- Add reset behavior.
- Add minimal integration tests if the chosen setup supports them cleanly.
- Use the `frontend-design` skill during this phase to keep the UI intentional rather than generic while preserving project simplicity.

### Expected files to change

- `index.html`
- `src/main.js`
- `src/ui/render.js`
- `src/ui/events.js`
- `src/styles.css`
- `tests/ui/` or equivalent DOM-oriented test files
- `README.md`

### Dependencies

- Depends on completion of Phase 3.
- Requires stable engine APIs for rendering and interactions.

### Risks

- Medium risk.
- UI code can accidentally absorb engine behavior and make later testing harder.
- Secondary-click behavior can regress across browsers if event handling is sloppy.

### Tests and checks to run

- `npm test`
- Manual browser check for reveal, flag, win, loss, and reset behavior
- Manual check that right-click does not trigger the browser context menu on tiles if custom flagging relies on that interaction

### Review check before moving work to `DONE.md`

- Confirm UI responsibilities are limited to rendering and event wiring.
- Confirm the DOM reflects engine state instead of duplicating game rules.
- Confirm visual tile states and end-state messaging are clear and requirement-aligned.
- Confirm browser interaction behavior matches the control scheme.
- Confirm no out-of-scope features such as difficulty modes or timers were added silently.
- Confirm leftover UI follow-ups are written back to `TODO.md`.

### Exact `TODO.md` entries to refresh from this phase

- [ ] Build the one-page game layout with status and reset controls
- [ ] Render board tiles for hidden, revealed, flagged, win, and loss states
- [ ] Wire primary reveal and secondary flag interactions to the engine
- [ ] Add reset behavior that starts a fresh board without page reload
- [ ] Verify the playable browser flow manually and through any lightweight DOM tests

### Exit criteria for moving items to `DONE.md`

- The browser UI renders a playable board from engine state.
- Primary and secondary tile actions update the UI through engine state transitions.
- Reset creates a fresh game without reloading the page.
- Manual verification confirms visible win, loss, and locked post-game behavior.
- Automated tests continue to pass after UI integration.

## Phase 5: Stabilize UX, docs, and release readiness

### Goal

Tighten the project for delivery by improving clarity, documentation, and release checks without expanding scope.

### Scope

- Review requirement coverage against the implemented game.
- Refine text labels, status feedback, and basic accessibility semantics.
- Ensure local run and test instructions are accurate.
- Prepare the project for static hosting verification.
- Refresh `TODO.md` and `DONE.md` to reflect verified work.

### Expected files to change

- `README.md`
- `DONE.md`
- `TODO.md`
- `index.html`
- `src/ui/`
- `src/styles.css`
- deployment or CI files if added and still in scope

### Dependencies

- Depends on completion of Phase 4.
- Requires the game to be playable in the browser already.

### Risks

- Low risk if scope is controlled.
- The main failure mode is hiding unfinished core behavior inside a vague polish pass.

### Tests and checks to run

- `npm test`
- Manual browser smoke test of full game flow
- Static hosting smoke check using the intended publish structure

### Review check before moving work to `DONE.md`

- Confirm every requirement is either implemented or explicitly deferred with approval.
- Confirm documentation matches the actual commands and file layout.
- Confirm accessibility and UX tweaks did not weaken gameplay behavior.
- Confirm release-readiness work does not introduce new feature scope.
- Confirm any non-critical follow-up work remains in `TODO.md` rather than being silently dropped.
- Confirm the project outcome matches the plan goal and stated scope.

### Exact `TODO.md` entries to refresh from this phase

- [ ] Review implemented behavior against `REQUIREMENTS.md` and close any remaining gaps
- [ ] Refine status text and basic accessibility semantics for the one-page UI
- [ ] Update run, test, and project overview documentation
- [ ] Perform final manual smoke checks and refresh `DONE.md` with verified work

### Exit criteria for moving items to `DONE.md`

- All in-scope requirements have matching implementation evidence or an approved documented deferment.
- The documented run and test commands work as written.
- Final manual smoke checks pass for start, reveal, flag, win, loss, and reset flows.
- `DONE.md` contains only verified completed work and `TODO.md` contains any remaining approved follow-up items.

## Dependency Notes

- Phase 1 must complete before any implementation because it defines the shared commands and repo structure.
- Phase 2 must complete before any UI work because the board model is the foundation for all interactions.
- Phase 3 must complete before UI wiring because reveal and state-transition rules are the highest-risk gameplay logic.
- Phase 4 depends on stable engine APIs from Phases 2 and 3.
- Phase 5 depends on a playable UI and should not be used to hide incomplete gameplay work.

## Review Policy

Each phase is intended to fit within one review cycle and one focused commit series.
If a phase expands beyond a small, reviewable diff or begins to include a second primary deliverable, it must be split before implementation starts. Oversized phases are not allowed to proceed unchanged. The expected review size is a small set of cohesive source files plus tests and any necessary doc updates, not a mixed repository-wide rewrite.

## Definition of Done for the Plan

The project is complete when:

- PXL Sweeper is playable as a static one-page browser game.
- The implemented behavior satisfies the requirements for reveal, flag, win, loss, reset, and visible game state.
- Core gameplay logic is covered by automated tests that run through the shared project test command.
- The repository includes current documentation for running and testing the project.
- `TODO.md` and `DONE.md` reflect actual verified project state.
- The project is ready to be served from a static host such as GitHub Pages without backend dependencies.

## Open Questions

- What exact default board dimensions and mine count should the first release use.
- Whether first-click safety is required for the first release; it is not currently specified in `REQUIREMENTS.md`.
- Whether the first release should include a visible timer or keep the status area limited to game state and flag information.
