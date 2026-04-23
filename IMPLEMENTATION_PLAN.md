# Implementation Plan — PXL Sweeper

## Overview

PXL Sweeper is a single-page, static Minesweeper clone built with React + TypeScript + Vite, deployed via GitHub Pages. Gameplay follows classic Minesweeper rules with three fixed difficulty levels, first-click safety, chord reveal, mouse and keyboard input, and localStorage persistence for last-used difficulty and best times. Visual design is pixel-art and is executed through the `frontend-design` skill.

This plan breaks delivery into dependency-ordered phases, each small enough for one review cycle. Core game logic is isolated from React so it can be fully unit-tested before any UI is wired. Risk is front-loaded: engine correctness (flood reveal, first-click safety, chord reveal) is built and tested before presentational work.

## Assumptions

- Node.js and npm available locally; Node 20 LTS target.
- Repository has existing agent instruction files and `REQUIREMENTS.md` committed.
- GitHub Pages publishing source will be branch-based from `main`, serving built output from `/docs` after build step writes there, or a `gh-pages` branch — finalized in Phase 8. Default assumption: GitHub Actions builds and deploys to `gh-pages` branch, Pages serves from `gh-pages` root.
- Deployed base path equals `/pxl-sweeper-Th7bo/`.
- Review cadence: one reviewer, per-phase PR-style review before moving items to `DONE.md`. Each phase sized to review in under one hour.
- No TypeScript-strict exceptions permitted. `"strict": true` in `tsconfig.json`.
- Testing: Vitest + React Testing Library + jsdom. No Playwright or Cypress.
- Linter: ESLint with `@typescript-eslint` and `eslint-plugin-react-hooks`. Formatter: Prettier (optional, non-blocking).
- Pixel-art palette and asset definitions are produced in Phase 6, not earlier.

## Delivery Strategy

Hybrid: **layered for the engine, vertical slices for UI**.

- Phases 1–2 are strictly layered: tooling, then pure-domain engine. This lets us exhaust engine correctness under unit tests before any React code depends on it. Minesweeper flood-reveal, first-click safety, and chord reveal are the highest-risk items in the project and benefit from isolated testing.
- Phases 3–7 are vertical slices: each phase ships one user-observable capability end to end (basic play, keyboard control, pixel-art visuals, persistence), keeping the app demoable after every phase.
- Deployment (Phase 8) and stabilization (Phase 9) are isolated as the plan's last two phases so no earlier phase is blocked on infra work.

This strategy fits the project because (a) engine bugs are cheap to find with unit tests and expensive to find through the UI, and (b) the UI is small enough that one-cycle vertical slices are realistic.

## Phase List

- **Phase 1** — Project scaffold and tooling
- **Phase 2** — Pure engine: board, mines, reveal, flag, chord, flood, win/loss
- **Phase 3** — React state layer: game controller, difficulty, timer
- **Phase 4** — Mouse-driven UI skeleton: board grid, HUD, new game
- **Phase 5** — Keyboard controls and focus handling
- **Phase 6** — Pixel-art visual design via `frontend-design` skill
- **Phase 7** — localStorage persistence: last difficulty, best times
- **Phase 8** — GitHub Pages deployment pipeline
- **Phase 9** — Stabilization, regression, traceability, release review

## Detailed Phases

### Phase 1 — Project scaffold and tooling

**Goal.** Produce a working Vite + React + TypeScript project with all required scripts and checks green on an empty app.

**Scope.**
- Scaffold Vite React-TS project at repository root.
- Configure `tsconfig.json` with `"strict": true`, `"noUncheckedIndexedAccess": true`.
- Configure `package.json` with `dev`, `build`, `preview`, `test`, `typecheck`, `lint` scripts.
- Install Vitest, jsdom, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.
- Configure `vitest.config.ts` with jsdom environment and setup file importing `@testing-library/jest-dom/vitest`.
- Configure ESLint (`eslint.config.js`) for TS + React hooks.
- Add `.gitignore` covering `node_modules`, `dist`, `coverage`, `.vite`.
- Minimal `App.tsx` that renders "PXL Sweeper" title, one smoke test asserting it renders.
- Create empty `TODO.md` refreshed from this plan, empty `DONE.md`.

**Expected files to change.**
- `package.json` (new)
- `package-lock.json` (new, generated)
- `tsconfig.json` (new)
- `tsconfig.node.json` (new)
- `vite.config.ts` (new)
- `vitest.config.ts` (new) or merged into `vite.config.ts`
- `eslint.config.js` (new)
- `index.html` (new)
- `src/main.tsx` (new)
- `src/App.tsx` (new)
- `src/App.test.tsx` (new)
- `src/setupTests.ts` (new)
- `.gitignore` (new)
- `TODO.md` (new, populated from this plan)
- `DONE.md` (new, empty)
- `GEMINI.md` (updated: run/test/build commands)

**Dependencies.** `REQUIREMENTS.md` committed. Node 20 available. No intra-project dependencies.

**Risks.** Low. Tooling drift between Vite / Vitest / ESLint major versions can break templates; pin to current stable majors and run all scripts after scaffold.

**Tests and checks to run.**
- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npm run build`
- Open `npm run dev`, confirm title renders in browser.

**Review check before moving work to `DONE.md`.**
- All scripts succeed locally.
- Smoke test present and passing.
- No leftover Vite template code unrelated to the project (default counter, template images).
- `.gitignore` excludes build and dependency dirs.
- `GEMINI.md` lists the exact commands.
- Reviewer confirms phase goal is met and no scope from later phases leaked in (no game logic yet).

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 1 — Project scaffold and tooling
- [ ] Scaffold Vite + React + TypeScript project at repository root
- [ ] Configure tsconfig with strict and noUncheckedIndexedAccess
- [ ] Define package.json scripts: dev, build, preview, test, typecheck, lint
- [ ] Install and configure Vitest + React Testing Library + jsdom
- [ ] Add ESLint config for TS + React hooks
- [ ] Add .gitignore for node_modules, dist, coverage, .vite
- [ ] Implement minimal App.tsx rendering "PXL Sweeper" title
- [ ] Write smoke test for App render
- [ ] Create empty TODO.md and DONE.md
- [ ] Update GEMINI.md with run/test/build commands
- [ ] Verify npm install, typecheck, lint, test, build all pass
```

**Exit criteria for moving items to `DONE.md`.**
- `npm run typecheck`, `npm run lint`, `npm test -- --run`, `npm run build` all exit 0.
- `src/App.test.tsx` present, passes, asserts title text.
- `package.json` contains all six required scripts.
- `tsconfig.json` sets `strict` and `noUncheckedIndexedAccess`.
- Phase committed with a single commit ending the phase.

---

### Phase 2 — Pure engine: board, mines, reveal, flag, chord, flood, win/loss

**Goal.** A fully unit-tested pure TypeScript engine that implements every Minesweeper rule required by `REQUIREMENTS.md`, with no React dependency.

**Scope.**
- Define domain types: `Cell`, `Board`, `GameState`, `Difficulty`, `DifficultyPreset`, `GameStatus` ∈ {`idle`, `playing`, `won`, `lost`}, `RevealResult`.
- Implement difficulty presets: Beginner 9×9/10, Intermediate 16×16/40, Expert 16×30/99.
- Implement mine placement deferred until first reveal, guaranteeing first revealed tile and its 8 neighbors are mine-free (when grid permits; Expert permits, all three presets permit).
- Implement `revealTile(state, row, col)` with flood reveal on 0-adjacent tiles.
- Implement `toggleFlag(state, row, col)` — flag toggle only on hidden tiles.
- Implement `chordReveal(state, row, col)` — fires only on revealed numbered tile where adjacent flag count equals tile number; reveals all unflagged neighbors.
- Implement win detection: all non-mine cells revealed → `won`; auto-flag remaining mines for display.
- Implement loss detection: revealed mine → `lost`; expose `explodedAt` for UI; mark wrong flags and remaining mines.
- Input guards: reveal/flag/chord are no-ops when status ∈ {`won`, `lost`}.
- Deterministic RNG interface: `placeMines` accepts an injected RNG so tests are reproducible.
- No React, no DOM references in `src/engine/**`.

**Expected files to change.**
- `src/engine/types.ts` (new)
- `src/engine/difficulty.ts` (new)
- `src/engine/board.ts` (new) — create, neighbor iteration, adjacency counts
- `src/engine/mines.ts` (new) — deterministic mine placement with safe-zone exclusion
- `src/engine/reveal.ts` (new) — reveal + flood
- `src/engine/flag.ts` (new) — flag toggle
- `src/engine/chord.ts` (new) — chord reveal
- `src/engine/game.ts` (new) — `newGame`, `reveal`, `toggleFlag`, `chord`, `status`
- `src/engine/rng.ts` (new) — seedable RNG
- `src/engine/__tests__/board.test.ts` (new)
- `src/engine/__tests__/mines.test.ts` (new)
- `src/engine/__tests__/reveal.test.ts` (new)
- `src/engine/__tests__/flag.test.ts` (new)
- `src/engine/__tests__/chord.test.ts` (new)
- `src/engine/__tests__/game.test.ts` (new) — full-game scenarios
- `src/engine/__tests__/fixtures.ts` (new) — hand-authored boards

**Dependencies.** Phase 1 complete.

**Risks.** Medium. Flood reveal recursion depth on 16×30 can exceed call stack if implemented naively — use iterative BFS. First-click safety edge cases when mine count is near grid size — asserted by tests. Off-by-one errors in neighbor iteration are classic; tested via hand-authored fixtures.

**Tests and checks to run.**
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run src/engine`
- Coverage check on engine directory ≥ 95% statements/branches.

**Review check before moving work to `DONE.md`.**
- No React, DOM, `window`, or `document` references in `src/engine/**`.
- Every requirement in `REQUIREMENTS.md` that concerns rules is traceable to at least one test name.
- Flood reveal implemented iteratively, not recursively.
- First-click safety test covers Beginner and Expert, including corner cells.
- Chord reveal tests cover: satisfied number (success), unsatisfied number (no-op), chord revealing a mine (loss), chord on hidden tile (no-op), chord on 0-adjacent (no-op).
- RNG is injected; no test relies on `Math.random` directly.
- Reviewer confirms no UI concerns leaked into engine.

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 2 — Pure engine
- [ ] Define engine types: Cell, Board, GameState, Difficulty, GameStatus
- [ ] Add difficulty presets (Beginner, Intermediate, Expert)
- [ ] Implement seedable RNG
- [ ] Implement board creation and adjacency count
- [ ] Implement deferred mine placement with first-click safe zone
- [ ] Implement iterative flood reveal
- [ ] Implement flag toggle with hidden-only guard
- [ ] Implement chord reveal with satisfied-number guard
- [ ] Implement win detection and auto-flag remaining mines
- [ ] Implement loss detection with explodedAt marker
- [ ] Guard reveal/flag/chord against won/lost status
- [ ] Author engine unit tests including first-click safety edge cases
- [ ] Author chord-reveal scenario tests
- [ ] Author full-game integration scenarios against hand-authored fixtures
- [ ] Verify engine coverage ≥ 95%
```

**Exit criteria for moving items to `DONE.md`.**
- All engine tests pass; coverage target met.
- `grep -R "document\|window\|react" src/engine` returns no matches.
- `npm run typecheck`, `npm run lint` exit 0.
- Phase committed.

---

### Phase 3 — React state layer: game controller, difficulty, timer

**Goal.** A single `useGame` hook (or reducer + context) that exposes game state, input commands, difficulty selection, new-game, and timer, without rendering any board UI yet.

**Scope.**
- Implement `useGame()` backed by `useReducer` dispatching engine calls.
- Actions: `newGame(difficulty)`, `reveal(r, c)`, `toggleFlag(r, c)`, `chord(r, c)`, `selectDifficulty(d)`.
- Timer: starts on first successful reveal, stops on `won` or `lost`, resets on `newGame`. Internal tick via `setInterval` at 1 Hz, cleaned up on unmount.
- Expose derived values: `minesRemaining`, `elapsedSeconds`, `status`, `board`, `focus` (for Phase 5 but defined now with default center).
- Reducer itself is pure and unit-testable.

**Expected files to change.**
- `src/state/useGame.ts` (new)
- `src/state/gameReducer.ts` (new, pure)
- `src/state/__tests__/gameReducer.test.ts` (new)
- `src/state/__tests__/useGame.test.tsx` (new, RTL `renderHook`)
- `src/App.tsx` (updated: minimal wiring, still no real board UI — use a debug panel showing status and mine count)

**Dependencies.** Phases 1–2 complete.

**Risks.** Medium. Timer interval leaks and fake-timer test flakiness. Mitigated by Vitest `vi.useFakeTimers()` in timer tests.

**Tests and checks to run.**
- `npm run typecheck`, `npm run lint`, `npm test -- --run`
- Hook tests cover: new-game resets state, reveal before timer start does not tick, timer ticks only while `playing`, timer stops on win and loss, difficulty switch triggers fresh engine state, inputs are no-ops when status not `playing`.

**Review check before moving work to `DONE.md`.**
- Reducer has zero timer logic; timer lives in hook.
- No direct engine type leakage out of `src/state/**` except re-exports needed by UI.
- `App.tsx` wiring remains minimal and unstyled.
- Reviewer confirms no visual or pixel-art work sneaked in.

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 3 — React state layer
- [ ] Implement pure gameReducer dispatching to engine
- [ ] Implement useGame hook with timer and lifecycle cleanup
- [ ] Expose minesRemaining, elapsedSeconds, status, board, focus
- [ ] Unit-test reducer
- [ ] Test useGame with fake timers
- [ ] Minimal App.tsx wiring with debug status display
```

**Exit criteria for moving items to `DONE.md`.**
- Reducer tests pass and cover all actions.
- Hook tests pass with fake timers, asserting start/stop/reset behavior.
- Status, minesRemaining, elapsedSeconds visible in dev-mode App render.
- Phase committed.

---

### Phase 4 — Mouse-driven UI skeleton: board grid, HUD, new game

**Goal.** A playable game via mouse input with an unstyled but correct board and HUD. Classic Minesweeper play is possible on all three difficulties.

**Scope.**
- `Board` component renders a grid of `Cell` buttons based on `state.board`.
- `Cell` component renders hidden / revealed-number / revealed-empty / flagged / mine states.
- `HUD` component with mine counter, timer, new-game control, difficulty selector.
- Left click → `reveal`, right click (`onContextMenu`, prevented) → `toggleFlag`, simultaneous left+right (or `mousedown` tracking both buttons) → `chord`.
- Prevent context menu on the board.
- Basic non-pixel-art CSS only (functional layout). No pixel-art assets yet.

**Expected files to change.**
- `src/components/Board.tsx` (new)
- `src/components/Cell.tsx` (new)
- `src/components/HUD.tsx` (new)
- `src/components/DifficultySelect.tsx` (new)
- `src/components/__tests__/Board.test.tsx` (new)
- `src/components/__tests__/Cell.test.tsx` (new)
- `src/components/__tests__/HUD.test.tsx` (new)
- `src/App.tsx` (updated: composes HUD + Board)
- `src/styles/base.css` (new, minimal layout only)

**Dependencies.** Phases 1–3 complete.

**Risks.** Medium. Chord via simultaneous left+right click is finicky across browsers; use `MouseEvent.buttons` bitmask and track `mousedown`/`mouseup` on the cell. Right-click context menu must be suppressed at the board level, not globally.

**Tests and checks to run.**
- `npm run typecheck`, `npm run lint`, `npm test -- --run`
- Integration tests via RTL:
  - Starting Beginner renders 81 cells.
  - Left-click on a hidden cell reveals it.
  - Right-click toggles flag and does not reveal.
  - Left+right click on satisfied number reveals neighbors.
  - Winning displays a win indicator; losing displays a loss indicator.
  - New-game resets grid.
- Manual UX check across Beginner/Intermediate/Expert at 1280×800.

**Review check before moving work to `DONE.md`.**
- No styling beyond functional layout; pixel-art deferred.
- `Cell` component is a pure function of props.
- All mouse event handlers call through the hook, not the engine directly.
- Accessibility minimum: each cell is a `<button>` with `aria-label`.
- Reviewer confirms phase stays within mouse-only scope.

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 4 — Mouse UI skeleton
- [ ] Implement Board component rendering grid from state
- [ ] Implement Cell component with state-to-visual mapping
- [ ] Implement HUD with mine counter, timer, new-game, difficulty select
- [ ] Wire left click to reveal
- [ ] Wire right click to toggle flag; suppress context menu
- [ ] Wire left+right click to chord reveal
- [ ] Integration-test all mouse interactions for all three difficulties
- [ ] Manual verification of full-game play on each difficulty
```

**Exit criteria for moving items to `DONE.md`.**
- All component and integration tests pass.
- Manual full-game playthrough of each difficulty succeeds.
- Context menu does not appear over the board.
- Phase committed.

---

### Phase 5 — Keyboard controls and focus handling

**Goal.** Full keyboard play with visible focus, per `REQUIREMENTS.md` controls.

**Scope.**
- Focus cursor in `GameState` (already stubbed in Phase 3) drives a visible focused-cell indicator.
- Arrow keys move focus; bounded to grid.
- Enter/Space reveals focused cell.
- F toggles flag on focused cell.
- C chords on focused cell.
- N starts new game with current difficulty.
- 1 / 2 / 3 selects Beginner / Intermediate / Expert and starts a new game.
- Key handling attached at the board container, not `window`, unless focus is in the board.
- Focus visually distinct from hover.

**Expected files to change.**
- `src/components/Board.tsx` (updated: keydown handler, focus class)
- `src/components/Cell.tsx` (updated: focused visual state)
- `src/state/gameReducer.ts` (updated: `moveFocus` action, keyboard chord/flag/reveal dispatchers if needed)
- `src/state/__tests__/gameReducer.test.ts` (updated)
- `src/components/__tests__/keyboard.test.tsx` (new)

**Dependencies.** Phases 1–4 complete.

**Risks.** Low to medium. Key event bubbling conflicts with the global `N` / `1-3` shortcuts. Scope those shortcuts to `window`, but gate arrow/F/C/Enter/Space to focus within the board.

**Tests and checks to run.**
- `npm run typecheck`, `npm run lint`, `npm test -- --run`
- Keyboard integration tests using `@testing-library/user-event` covering arrow navigation, reveal, flag, chord, new game, and difficulty shortcuts.
- Manual: play a full game using only the keyboard on each difficulty.

**Review check before moving work to `DONE.md`.**
- No duplicated state: focus lives only in reducer.
- No `document.addEventListener` without cleanup in a `useEffect`.
- Focus visually visible.
- Shortcuts documented in an in-app help element or README.
- Reviewer confirms no visual polish work leaked in.

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 5 — Keyboard controls
- [ ] Add moveFocus reducer action and bounds checks
- [ ] Render focus indicator on Cell
- [ ] Handle ArrowUp/Down/Left/Right at Board
- [ ] Handle Enter/Space → reveal, F → flag, C → chord
- [ ] Handle N → new game, 1/2/3 → difficulty select + new game
- [ ] Integration-test keyboard-only full game
- [ ] Document shortcuts in-app or in README
```

**Exit criteria for moving items to `DONE.md`.**
- Full keyboard-only game completable.
- All keyboard tests pass.
- Focus indicator always visible while board has focus.
- Phase committed.

---

### Phase 6 — Pixel-art visual design via `frontend-design` skill

**Goal.** Final pixel-art visual design covering all cell states and HUD, via the `frontend-design` skill. Functional behavior unchanged.

**Scope.**
- Invoke `frontend-design` skill to produce:
  - Pixel-art palette and CSS variables.
  - Cell visuals for hidden, revealed-empty, revealed-number (1..8, distinct colors), flagged, mine-revealed, mine-exploded, mine-wrong-flag, focused.
  - HUD visuals: 7-segment-like counter for mines remaining, same for timer, new-game face button or equivalent, difficulty selector styling.
  - Board background and frame.
- Implement as CSS modules or a single stylesheet, purely driven by data-attributes or class names on Cell/HUD.
- No behavioral change; visual regression only.

**Expected files to change.**
- `src/styles/theme.css` (new)
- `src/styles/board.css` (new)
- `src/styles/hud.css` (new)
- `src/styles/cell.css` (new)
- `src/components/Cell.tsx` (updated: data-state attribute mapping; no logic change)
- `src/components/HUD.tsx` (updated: class hooks for the counter and timer)
- `assets/` (new if raster/SVG assets are introduced)

**Dependencies.** Phase 4 complete (UI must exist). Phase 5 recommended to ensure focus state gets styled too.

**Risks.** Low to medium. Accidental behavior change when refactoring markup for styling — mitigated because the existing component tests must still pass.

**Tests and checks to run.**
- `npm run typecheck`, `npm run lint`, `npm test -- --run` (all existing tests must still pass).
- Manual visual check of every cell state on a game rigged to show all states.
- Manual check at 1024×700 (Expert minimum) and 1920×1080.

**Review check before moving work to `DONE.md`.**
- No component logic changes beyond class/data-state bindings.
- All cell states visually distinct, including wrong-flag vs correct-flag post-loss.
- Focus ring visible against every cell state.
- Reviewer confirms no scope creep into feature work.

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 6 — Pixel-art visual design
- [ ] Produce palette and theme.css via frontend-design skill
- [ ] Style Cell for all nine visual states
- [ ] Style HUD counter, timer, new-game control, difficulty selector
- [ ] Style board frame and background
- [ ] Verify all existing tests still pass unchanged
- [ ] Manual visual audit of every cell state at two viewport sizes
```

**Exit criteria for moving items to `DONE.md`.**
- All tests still pass.
- Every documented cell state visually distinct in a manual audit.
- Phase committed.

---

### Phase 7 — localStorage persistence: last difficulty, best times

**Goal.** Persist last-selected difficulty and best time per difficulty across page reloads; tolerate absence or corruption.

**Scope.**
- Keys under `pxl-sweeper:` namespace.
- `lastDifficulty` written on difficulty change.
- `bestTime:<difficulty>` written on win only if strictly better.
- Load at app startup; fall back to `beginner` and no best times on failure.
- Feature-detect localStorage; if unavailable, skip silently.
- Display best time per difficulty in HUD or difficulty selector.

**Expected files to change.**
- `src/persistence/storage.ts` (new) — get/set with JSON schema guards
- `src/persistence/__tests__/storage.test.ts` (new)
- `src/state/useGame.ts` (updated: load on mount, write on relevant events)
- `src/components/HUD.tsx` (updated: best-time display)
- `src/components/__tests__/persistence.test.tsx` (new: RTL tests with mocked localStorage)

**Dependencies.** Phases 3 and 4 complete; Phase 6 optional.

**Risks.** Low. Corrupted JSON handling is the main failure mode; tested explicitly.

**Tests and checks to run.**
- `npm run typecheck`, `npm run lint`, `npm test -- --run`.
- Tests cover: empty storage, valid storage, corrupted JSON, unsupported-storage path (stubbed throws).
- Manual: win a game, refresh, verify best time persists.

**Review check before moving work to `DONE.md`.**
- No writes on every render or tick; writes only on real state changes.
- Corrupted data never crashes the app.
- No PII or unrelated data written.
- Reviewer confirms key prefix is consistent.

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 7 — localStorage persistence
- [ ] Implement typed storage read/write with JSON guards
- [ ] Persist lastDifficulty on change
- [ ] Persist bestTime:<difficulty> on win when strictly better
- [ ] Load persisted state on app mount
- [ ] Handle missing, corrupted, and unavailable localStorage silently
- [ ] Display best time per difficulty in HUD
- [ ] Test all storage failure modes
```

**Exit criteria for moving items to `DONE.md`.**
- All persistence tests pass, including corrupted-data path.
- Manual refresh after win shows persisted best time.
- Phase committed.

---

### Phase 8 — GitHub Pages deployment pipeline

**Goal.** Production build deploys to GitHub Pages via CI, reachable at the project Pages URL.

**Scope.**
- Set `vite.config.ts` `base: '/pxl-sweeper-Th7bo/'`.
- Add `.github/workflows/deploy.yml` using official `actions/deploy-pages` flow.
- Workflow steps: checkout, setup-node 20, `npm ci`, `npm run typecheck`, `npm run lint`, `npm test -- --run`, `npm run build`, upload `dist/` as Pages artifact, deploy.
- Configure repository Pages source to GitHub Actions (manual step, documented in README).
- Post-deploy smoke step: fetch the index.html and assert HTTP 200 (optional, if straightforward).

**Expected files to change.**
- `vite.config.ts` (updated: base path)
- `.github/workflows/deploy.yml` (new)
- `README.md` (new or updated: how to deploy, Pages source setting)

**Dependencies.** Phases 1–4 complete at minimum for a meaningful deploy. Ideally after Phase 7.

**Risks.** Medium. Wrong `base` path produces broken asset URLs at the deployed site. CI permissions on `pages: write` must be set. Cache keys must include `package-lock.json` hash.

**Tests and checks to run.**
- Workflow dry-run via a branch push and PR preview (or initial deploy to a staging branch).
- Post-deploy: load the site, load a full game, confirm assets 200 (not 404).

**Review check before moving work to `DONE.md`.**
- CI runs typecheck, lint, tests, and build before deploy; deploy is blocked on any failure.
- No secrets checked in.
- Base path matches the repository name.
- Reviewer confirms the deployed site plays a full game.

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 8 — GitHub Pages deploy
- [ ] Set vite base to /pxl-sweeper-Th7bo/
- [ ] Add deploy.yml workflow running typecheck, lint, test, build, deploy
- [ ] Configure Pages source = GitHub Actions (document in README)
- [ ] Verify deployed site plays a full game
- [ ] Confirm all assets load with 200
```

**Exit criteria for moving items to `DONE.md`.**
- Deployed URL serves a functional game.
- CI workflow green on `main`.
- Phase committed.

---

### Phase 9 — Stabilization, regression, traceability, release review

**Goal.** One consolidated pass that locks in quality before declaring the project done.

**Scope.**
- Requirement traceability: every acceptance criterion in `REQUIREMENTS.md` mapped to at least one test or manual check.
- Coverage audit: overall statement coverage ≥ 85%, engine ≥ 95%.
- Manual regression: full playthrough of all three difficulties, mouse and keyboard, win and loss, refresh persistence, chord reveal, first-click safety on corner.
- Accessibility audit: tab order, focus visibility, `aria-label` correctness, color contrast on numbers and focus ring.
- Run the `CODE_REVIEW.md` prompt from the course doc; apply selected recommendations.
- Update `GEMINI.md` if any rules changed.
- Tag release `v1.0.0`.

**Expected files to change.**
- `CODE_REVIEW.md` (new)
- `REQUIREMENTS.md` (updated if traceability gaps surface)
- `GEMINI.md` (updated as needed)
- Any files touched by accepted review recommendations
- `README.md` (updated: shortcuts, run, deploy)

**Dependencies.** Phases 1–8 complete.

**Risks.** Medium. Review commonly surfaces bugs that expand scope; cap recommendations applied to a small, reviewable set — defer the rest to follow-up issues.

**Tests and checks to run.**
- Full test suite + coverage report.
- Manual regression checklist.
- Accessibility spot check.

**Review check before moving work to `DONE.md`.**
- Traceability table or mapping present.
- Coverage targets met.
- `CODE_REVIEW.md` committed with executive summary and applied-vs-deferred recommendations.
- Reviewer confirms no silent scope cuts from earlier phases.

**Exact `TODO.md` entries to refresh from this phase.**
```
## Phase 9 — Stabilization and review
- [ ] Build requirement traceability mapping to tests
- [ ] Verify coverage targets (engine ≥ 95%, overall ≥ 85%)
- [ ] Run manual regression on all difficulties, mouse and keyboard
- [ ] Run accessibility spot check: focus, contrast, aria-labels
- [ ] Generate CODE_REVIEW.md and apply selected recommendations
- [ ] Update GEMINI.md and README.md as needed
- [ ] Tag v1.0.0 release
```

**Exit criteria for moving items to `DONE.md`.**
- Coverage targets met.
- Regression checklist complete with no open P0/P1.
- `CODE_REVIEW.md` committed.
- Release tagged.

## Dependency Notes

- Phase 2 requires Phase 1 (tooling must exist).
- Phase 3 requires Phase 2 (hook calls engine).
- Phase 4 requires Phase 3 (UI consumes hook).
- Phase 5 requires Phase 4 (keyboard decorates existing UI).
- Phase 6 requires Phase 4; Phase 5 strongly recommended before Phase 6 so focus state gets styled in the same pass.
- Phase 7 requires Phases 3 and 4; independent of Phase 6.
- Phase 8 requires Phases 1–4 at minimum; best scheduled after Phase 7 so persistence ships with the first public deploy.
- Phase 9 requires all earlier phases.
- Phases 6 and 7 are independent of each other and could be parallelized if more than one contributor were on the project; in a single-agent flow, run Phase 6 before Phase 7 so visual test baselines include the final theme.

## Review Policy

- One reviewer per phase; review targets one-hour maximum.
- If a phase PR exceeds ~400 changed lines (excluding lockfile), split before merge.
- Oversized phases must be split into sub-phases with their own `TODO.md` entries before any implementation continues.
- Tests and review are gates; no item moves to `DONE.md` without both.
- If a phase introduces a previously undocumented rule or command, update `GEMINI.md` in the same phase.

## Definition of Done for the Plan

- All nine phases complete with their exit criteria met.
- `npm run typecheck`, `npm run lint`, `npm test -- --run`, `npm run build` all pass on CI on `main`.
- Engine coverage ≥ 95%, overall coverage ≥ 85%.
- Deployed GitHub Pages URL plays a full game on Beginner, Intermediate, and Expert, mouse and keyboard.
- localStorage persists last difficulty and best times across reloads.
- `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`, `TODO.md`, `DONE.md`, `CODE_REVIEW.md`, `README.md`, `GEMINI.md` all present and current.
- `v1.0.0` tag pushed.

## Open Questions

- Pages publishing mechanism: GitHub Actions `actions/deploy-pages` vs `gh-pages` branch. Default: Actions. Non-blocking; decided at start of Phase 8.
- Coverage tool: Vitest built-in `v8` provider vs `istanbul`. Default: `v8`. Non-blocking.
- Whether to add Prettier. Default: add, non-blocking on CI. Decided at end of Phase 1.
- Exact pixel-art palette and assets. Blocking only for Phase 6, produced inside that phase via the `frontend-design` skill.
