# budget

A simple iOS PWA Amy uses to track discretionary spending across a billing cycle.

## Quick start

```sh
npm install
npm run dev
```

To test on iPhone over LAN: `npm run dev -- --host` and open the printed network URL in Safari.

## Scripts

| Command           | What it does                                                                      |
| ----------------- | --------------------------------------------------------------------------------- |
| `npm run dev`     | Vite dev server.                                                                  |
| `npm run check`   | Type-check the project.                                                           |
| `npm run build`   | Production build into `build/`.                                                   |
| `npm run preview` | Preview the production build locally.                                             |
| `npm run ship`    | Build, then rsync `build/` to `ajko@ovid.u.washington.edu:~/public_html/budget/`. |
| `npm run format`  | Prettier across the repo.                                                         |

## Installing as an iOS PWA

1. Open `https://faculty.washington.edu/ajko/budget/` in Safari on iPhone.
2. Share → **Add to Home Screen**.
3. Launch from the home-screen icon. The app runs standalone, full-screen, and works offline.

## Stack

Svelte 5 (runes) · SvelteKit 2 (`adapter-static`) · TypeScript · Vite · Prettier.

See `CLAUDE.md` for the developer guide.
