# PXL Sweeper Project Rules

This repository builds the PXL Sweeper browser game.
Do not start a different project unless the project requirements explicitly change.

## Authoritative project files

- `REQUIREMENTS.md`
- `IMPLEMENTATION_PLAN.md`
- `TODO.md`
- `DONE.md`

## Current project structure

- `index.html` is the static page entry point.
- `src/game/` contains pure gameplay logic and state transitions.
- `src/ui/` contains rendering and DOM event wiring only.
- `tests/` contains automated tests run through Node's built-in test runner.

## Project workflow rules

- `REQUIREMENTS.md` is the source of truth for scope and acceptance criteria.
- `IMPLEMENTATION_PLAN.md` is the source of truth for delivery order and review-sized phases.
- `TODO.md` holds the active execution queue and should stay aligned with the current plan phase.
- `DONE.md` holds only verified completed work.
- Move work from `TODO.md` to `DONE.md` only after the relevant checks pass.
- Keep changes review-sized and avoid mixing unrelated work in one phase.
- Ask before large refactors, directory restructures, or removing tests.

## Implementation rules

- Keep gameplay rules out of the DOM layer.
- Extend `src/game/` for engine behavior and `src/ui/` for presentation or browser interaction.
- Prefer simple plain JavaScript and static-site compatibility over extra tooling.
- Do not add backend services, accounts, analytics, multiplayer, or difficulty systems unless requirements change.
- Keep the UI as one visible board with reset, reveal, flag, win, and loss behavior.

## Verification rules

- Run `npm test` after implementation changes.
- When UI behavior changes, also verify the static page through `npm start` or an equivalent local static server.
- When deployment files change, also verify `npm run build` and preview the built `dist/` output locally.
- Treat runtime verification as part of done for user-facing changes, not optional follow-up.

## Current commands

- `npm run build`
- `npm run preview`
- `npm test`
- `npm start`

## Deployment notes

- GitHub Pages deployment is handled through `.github/workflows/deploy-pages.yml`.
- The deployable artifact is `dist/`, created by `scripts/build-pages.mjs`.
- Prefer deploying only built site assets, not the entire repository root.
