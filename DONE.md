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
- [x] 59 engine tests pass; engine coverage 98.4% statements / 93.75% branches (≥ 95% target)
- [x] No React, DOM, `window`, or `document` references in `src/engine/**` (grep verified)
- [x] Deviation from plan: `reveal`, `flag`, `chord` consolidated into `src/engine/game.ts` instead of separate files. Rationale: each would be a single small function; separate files added no testability or clarity. Internal helpers (`floodReveal`, `finishLoss`, `maybeFinishWin`) are module-private.
- [x] Verified: typecheck, lint, 59/59 tests, build all pass
