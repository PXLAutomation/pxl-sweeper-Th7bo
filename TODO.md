# TODO

Active execution queue. Refreshed from `IMPLEMENTATION_PLAN.md`.

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

## Phase 3 — React state layer
- [ ] Implement pure gameReducer dispatching to engine
- [ ] Implement useGame hook with timer and lifecycle cleanup
- [ ] Expose minesRemaining, elapsedSeconds, status, board, focus
- [ ] Unit-test reducer
- [ ] Test useGame with fake timers
- [ ] Minimal App.tsx wiring with debug status display

## Phase 4 — Mouse UI skeleton
- [ ] Implement Board component rendering grid from state
- [ ] Implement Cell component with state-to-visual mapping
- [ ] Implement HUD with mine counter, timer, new-game, difficulty select
- [ ] Wire left click to reveal
- [ ] Wire right click to toggle flag; suppress context menu
- [ ] Wire left+right click to chord reveal
- [ ] Integration-test all mouse interactions for all three difficulties
- [ ] Manual verification of full-game play on each difficulty

## Phase 5 — Keyboard controls
- [ ] Add moveFocus reducer action and bounds checks
- [ ] Render focus indicator on Cell
- [ ] Handle ArrowUp/Down/Left/Right at Board
- [ ] Handle Enter/Space → reveal, F → flag, C → chord
- [ ] Handle N → new game, 1/2/3 → difficulty select + new game
- [ ] Integration-test keyboard-only full game
- [ ] Document shortcuts in-app or in README

## Phase 6 — Pixel-art visual design
- [ ] Produce palette and theme.css via frontend-design skill
- [ ] Style Cell for all nine visual states
- [ ] Style HUD counter, timer, new-game control, difficulty selector
- [ ] Style board frame and background
- [ ] Verify all existing tests still pass unchanged
- [ ] Manual visual audit of every cell state at two viewport sizes

## Phase 7 — localStorage persistence
- [ ] Implement typed storage read/write with JSON guards
- [ ] Persist lastDifficulty on change
- [ ] Persist bestTime:<difficulty> on win when strictly better
- [ ] Load persisted state on app mount
- [ ] Handle missing, corrupted, and unavailable localStorage silently
- [ ] Display best time per difficulty in HUD
- [ ] Test all storage failure modes

## Phase 8 — GitHub Pages deploy
- [ ] Set vite base to /pxl-sweeper-Th7bo/
- [ ] Add deploy.yml workflow running typecheck, lint, test, build, deploy
- [ ] Configure Pages source = GitHub Actions (document in README)
- [ ] Verify deployed site plays a full game
- [ ] Confirm all assets load with 200

## Phase 9 — Stabilization and review
- [ ] Build requirement traceability mapping to tests
- [ ] Verify coverage targets (engine ≥ 95%, overall ≥ 85%)
- [ ] Run manual regression on all difficulties, mouse and keyboard
- [ ] Run accessibility spot check: focus, contrast, aria-labels
- [ ] Generate CODE_REVIEW.md and apply selected recommendations
- [ ] Update GEMINI.md and README.md as needed
- [ ] Tag v1.0.0 release
