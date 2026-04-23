# PXL Sweeper Project Rules

This repository builds the PXL Sweeper game.

## Authoritative project files

- `REQUIREMENTS.md` — what the project must do
- `IMPLEMENTATION_PLAN.md` — planned route of work, phase-organized
- `TODO.md` — active execution queue, refreshed from the plan
- `DONE.md` — verified completed work only

## Stack

- React 19 + TypeScript (strict) + Vite 6
- Vitest + React Testing Library + jsdom for tests
- ESLint 9 flat config
- Deployed to GitHub Pages

## Commands

- `npm install` — install dependencies
- `npm run dev` — local dev server
- `npm run build` — typecheck + production build to `dist/`
- `npm run preview` — preview production build
- `npm test` — run Vitest in watch mode
- `npm test -- --run` — run Vitest once (use for CI and agent verification)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint over the repo

## Project rules

- Keep one `TODO.md` item small enough for one review cycle.
- Refresh `TODO.md` from the current phase in `IMPLEMENTATION_PLAN.md`.
- Update `TODO.md` before starting a new implementation chunk.
- Update `TODO.md` and `DONE.md` after implementation.
- Move an item to `DONE.md` only after the required checks, review, and doc updates are complete.
- `DONE.md` holds only verified work.
- Update `REQUIREMENTS.md` when scope or acceptance criteria change.
- Update `IMPLEMENTATION_PLAN.md` when the order or grouping of work changes.
- For narrow tasks, pass the exact authoritative files in the prompt instead of retyping context.
- Ask before making a large refactor, changing the directory structure, or removing tests.
- Before moving work to `DONE.md`, review the diff, run the required checks, and update docs if the change affected scope or structure.
- Commit to git after each completed phase or big step, not mid-step.
- Before starting a dev server, check for and kill any existing `vite` or `node` dev processes left running from prior sessions.

## Agent behavior

### 1. Think before coding
- State assumptions. If uncertain, ask.
- If multiple interpretations exist, present them — do not pick silently.
- If a simpler approach exists, say so. Push back when warranted.

### 2. Simplicity first
- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No error handling for impossible scenarios.

### 3. Surgical changes
- Touch only what the task requires.
- Do not refactor unrelated code or adjust unrelated formatting.
- Match existing style even if you would do it differently.
- When your changes orphan imports/variables, remove them. Do not delete pre-existing dead code unless asked.

### 4. Goal-driven execution
- Turn tasks into verifiable goals and loop until the check passes.
- For multi-step tasks, state the plan and the per-step verification before starting.

### 5. Testing rules
- New implementation ships with new tests.
- Never weaken a test to make it pass. If a test fails, fix the code or fix the test with justification, not by deleting assertions.
- Keep engine tests pure: no DOM, no React, no `Math.random` — use the seedable RNG.
