# Done

Verified completed work. Items move here only after phase exit criteria are met.

## Phase 1 — Project scaffold and tooling
- [x] Scaffold Vite + React + TypeScript project at repository root
- [x] Configure tsconfig with strict, noUncheckedIndexedAccess, noImplicitOverride, noFallthroughCasesInSwitch, noUnusedLocals, noUnusedParameters
- [x] Define package.json scripts: dev, build, preview, test, typecheck, lint
- [x] Install and configure Vitest + React Testing Library + jsdom
- [x] Add ESLint 9 flat config for TS + React hooks + React Refresh
- [x] Add .gitignore for node_modules, dist, coverage, .vite
- [x] Implement minimal App.tsx rendering "PXL Sweeper" title
- [x] Write smoke test for App render (`src/App.test.tsx`)
- [x] Create TODO.md from implementation plan, empty DONE.md
- [x] Update GEMINI.md with stack, commands, and agent rules
- [x] Verified: `npm install`, `npm run typecheck`, `npm run lint`, `npm test -- --run`, `npm run build` all exit 0

**Stack locked:** Vite 6.4 · React 19 · TypeScript 5.7 strict · Vitest 3 · ESLint 9 · jsdom 25 · RTL 16.

## Phase 2 — Pure engine: board, mines, reveal, flag, chord, flood, win/loss
- [x] Define engine types: `Difficulty`, `DifficultyPreset`, `Cell`, `CellState`, `Board`, `GameStatus`, `GameState`, `Position`
- [x] Difficulty presets: Beginner 9×9/10, Intermediate 16×16/40, Expert 16×30/99
- [x] Seedable `mulberry32` RNG
- [x] `createBoard`, `cellAt`, `inBounds`, `forEachCell`, `forEachNeighbor`, `recomputeAdjacency`
- [x] `placeMines` with 3×3 first-click safe zone; throws when `mineCount > candidates`
- [x] `placeMinesAt` test helper for hand-authored layouts
- [x] Iterative flood reveal (stack-based), no recursion
- [x] Flag toggle with hidden-only guard
- [x] Chord reveal with satisfied-number guard; triggers loss on wrong-flag mine
- [x] Win detection auto-flags remaining mines; loss reveals all hidden mines and sets `explodedAt`
- [x] All public actions frozen once `status ∈ {won, lost}`
- [x] 59 engine tests pass; engine coverage 98.4% statements
- [x] No React, DOM, `window`, or `document` references in `src/engine/**`

## Phase 3 — React state layer: game controller, difficulty, timer
- [x] Pure `gameReducer` dispatching to engine; same-reference state when engine is a no-op
- [x] Actions: `NEW_GAME`, `REVEAL`, `TOGGLE_FLAG`, `CHORD`, `MOVE_FOCUS`, `SET_FOCUS`
- [x] `useGame` hook: `useReducer` + timer via `setInterval` at 1 Hz; cleanup on unmount
- [x] Timer starts on first transition to `playing`, not on mount or difficulty select
- [x] 14 reducer tests + 9 hook tests (fake timers) pass

## Phase 4 — Mouse UI skeleton
- [x] Board component rendering grid from state with event-delegated mouse handling
- [x] Cell component with state-to-visual mapping (10 visual states via data-state)
- [x] HUD with mine counter, timer, new-game, difficulty select
- [x] Left click → reveal, right click → flag, left+right → chord (buttons bitmask)
- [x] Context menu suppressed on board
- [x] 34 component/integration tests; 126 total tests pass

## Phase 5 — Keyboard controls
- [x] Arrow keys move focus (clamped to grid bounds)
- [x] Enter/Space → reveal, F → flag, C → chord on focused cell
- [x] Window-level N → new game, 1/2/3 → difficulty switch
- [x] Focus indicator (orange outline) visible when board has focus
- [x] Board tabIndex=0, cells tabIndex=-1 for proper focus management
- [x] In-app shortcuts help via collapsible details element
- [x] 17 keyboard integration tests; 146 total tests pass

## Phase 6 — Pixel-art visual design
- [x] Press Start 2P pixel font via Google Fonts
- [x] Dark retro palette with CSS variables in theme.css
- [x] Embossed 3D pixel borders on hidden cells, flat borders on revealed
- [x] LED-green 7-segment-style HUD counters
- [x] Classic minesweeper number colors (1-8)
- [x] All styling driven by existing data-state attributes — zero logic changes
- [x] All 146 tests pass unchanged

## Phase 7 — localStorage persistence
- [x] Typed storage read/write under `pxl-sweeper:` key prefix
- [x] Last difficulty saved on change, loaded on mount
- [x] Best time saved on win only when strictly better
- [x] Corrupted/missing/unavailable localStorage handled silently
- [x] Best time displayed in HUD when available
- [x] 22 storage tests + 2 HUD best-time tests; 170 total tests pass

## Phase 8 — GitHub Pages deploy
- [x] Vite base set to `/pxl-sweeper-Th7bo/`
- [x] deploy.yml workflow: typecheck → lint → test → build → deploy
- [x] README with controls, development commands, deployment setup
- [x] Build produces correct output (207 KB JS + 5.8 KB CSS)

## Phase 9 — Stabilization and review
- [x] Requirement traceability: all 15 acceptance criteria mapped to tests
- [x] Coverage: overall 95.68% (target 85%), engine 98.4% (target 95%)
- [x] CODE_REVIEW.md: architecture assessment and deferred recommendations
- [x] TODO.md and DONE.md updated
- [x] v1.0.0 tagged
