# PXL Sweeper

A classic Minesweeper clone with a pixel-art theme, built with React + TypeScript + Vite.

## Play

Deployed at: `https://<username>.github.io/pxl-sweeper-Th7bo/`

## Controls

### Mouse

| Action | Input |
|---|---|
| Reveal tile | Left click |
| Toggle flag | Right click |
| Chord reveal | Left + Right click on a numbered tile |

### Keyboard

| Action | Key |
|---|---|
| Move focus | Arrow keys |
| Reveal | Enter / Space |
| Toggle flag | F |
| Chord reveal | C |
| New game | N |
| Beginner | 1 |
| Intermediate | 2 |
| Expert | 3 |

## Development

```bash
npm install
npm run dev          # start dev server
npm run build        # production build
npm run preview      # preview production build
npm run test         # run tests (watch mode)
npm test -- --run    # run tests once
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
```

## Deployment

The site deploys automatically to GitHub Pages via the `.github/workflows/deploy.yml` workflow on every push to `main`.

**One-time setup:** In the repository settings, go to **Pages** and set the source to **GitHub Actions**.

## Difficulties

| Level | Grid | Mines |
|---|---|---|
| Beginner | 9 x 9 | 10 |
| Intermediate | 16 x 16 | 40 |
| Expert | 16 x 30 | 99 |

## Persistence

Last selected difficulty and best time per difficulty are saved to `localStorage` under the `pxl-sweeper:` key prefix. Corrupted or missing data falls back to defaults silently.
