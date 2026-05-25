# Budget — guide for AI-assisted development

## What this is

A single-user iOS PWA Amy uses to track discretionary spending across a billing cycle. One screen, runs offline once installed to the home screen, persists everything to `localStorage`. Deployed to the UW faculty Apache server at `https://faculty.washington.edu/ajko/budget/`.

## Stack

- Svelte 5 with **runes** (`$state`, `$derived`, `$effect`, `$props`).
- SvelteKit 2 with `@sveltejs/adapter-static` (`fallback: 'index.html'`, `prerender = true`, `ssr = false`). Output is a true static SPA in `build/`.
- TypeScript strict.
- Prettier + `prettier-plugin-svelte`. Tabs, single quotes, no trailing commas, 100 cols.
- Vite 8.
- No test framework yet. Pure helpers in `src/lib/budget.ts` are written to be Vitest-friendly when you do add one.

## Commands

- `npm run dev` — local dev server. Add `-- --host` to test on iPhone over LAN.
- `npm run check` — `svelte-kit sync && svelte-check`. Run this before committing.
- `npm run build` — production build into `build/`.
- `npm run preview` — preview the production build locally.
- `npm run ship` — runs `build`, then rsyncs `build/` to `ajko@ovid.u.washington.edu:~/public_html/budget/` with `--delete`.
- `npm run format` — Prettier across the repo.

## Deployment quirks

- Base path is `/ajko/budget` in production, `''` in dev. Set in `svelte.config.js`.
- The parent `~/public_html/.htaccess` has a catch-all rewrite that would otherwise send `/ajko/budget/` to the parent site's `index.html`. The local `static/.htaccess` overrides this so the bare directory URL resolves to the app's `index.html`.
- The PWA manifest's `start_url` and `scope` are both `/ajko/budget/` — keep them in sync with `paths.base` if you ever move the app.
- `--delete` is intentional on `npm run ship`: it cleans up old hashed assets so the remote stays lean. Don't put anything in the remote `budget/` directory you want to keep around.

## Data model

`localStorage` has two keys:

- `history`: `Entry[]` where `Entry = { day: number, category: Category, amount: number }`. Income entries are positive, spending entries are negative.
- `paydate`: integer string in `[1, 28]`. Day of the month the cycle resets.

`src/lib/storage.ts` reads both. It accepts and migrates the original v1 tuple format (`[day, category, amount]`) so existing user data survives. Don't break that path without a one-time migration step.

## Categories

`src/lib/categories.ts` is the single source of truth for the list of categories and their colors. Adding a category = adding an entry to `categoryColors` and `categoryLabels` and adding it to the `Category` union in `src/lib/types.ts`. Removing one is harder because of legacy data — leave the type entry in place and add a migration if you really want to retire one.

## Component map

| File                                         | Role                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/routes/+page.svelte`                    | App shell. Owns the in-progress entry (`amount`, `sign`, `category`) and the confirm-dialog visibility. |
| `src/lib/components/Keypad.svelte`           | 3×4 numeric keypad with sign and delete.                                                                |
| `src/lib/components/Chart.svelte`            | Bar chart of non-income entries with per-bar vertical amount labels (label sits inside the bar at the top when the bar is tall enough — driven by a CSS `@container (min-height: ...)` query — and floats above the bar with `--padding` gap when it isn't). Bars have a `min-height` floor so $1 entries are still visible. Tap to open confirm dialog. |
| `src/lib/components/CategoryButton.svelte`   | Current category indicator. Tap to cycle.                                                               |
| `src/lib/components/RemainingDisplay.svelte` | Top-right: amount remaining + days until payday. Tap to bump payday.                                    |
| `src/lib/components/TodayDisplay.svelte`     | Top-left: today's "net" (remaining minus expected income through end of cycle).                         |
| `src/lib/components/AmountInput.svelte`      | Currently-typed amount. Tap to commit.                                                                  |
| `src/lib/components/ConfirmDialog.svelte`    | keep / undo / reset.                                                                                    |

## State

`src/lib/state.svelte.ts` exports a singleton `budget` store. It owns the persisted state (`history`, `payDate`) and the derived values (`amountRemaining`, `daysRemaining`, `net`, `perDay`, etc.). Components own ephemeral working state only (digits being typed, dialog visibility).

Persistence is automatic: `$effect` calls in the store mirror `history` and `payDate` to `localStorage` on every change. There's also a 1-minute `setInterval` that re-evaluates "today" so the derived values stay correct if the app is left open across midnight.

Pure date and money helpers live in `src/lib/budget.ts` and accept `today` and `payDate` as arguments — keep them pure so they stay testable.

## iOS conventions

- `viewport-fit=cover` + `env(safe-area-inset-*)` padding on `main` so the layout clears the notch and the home indicator.
- The page is a 4-row grid: `auto 1fr auto auto` (header, chart-area, entry-row, keypad). The chart row takes the `1fr` so it expands to fill, while the entry row and keypad sit pinned at the bottom for one-handed thumb reach. The keypad has an explicit `height: 40vh` since auto-sizing a grid of `1fr` rows would collapse to 0.
- A `--padding` custom property on `main` (currently `20px`) is the single source of truth for spacing. It's applied to the grid row gap _and_ the four outer edges of `main` via `max(env(safe-area-inset-*), var(--padding))` — meaning notched/home-indicator devices still get their full safe-area when it exceeds `--padding`, but everything else (left/right in portrait, top/bottom on non-notched devices) falls back to the `--padding` value. Sections no longer need their own horizontal padding; everything inside `main` (including the keypad) is inset uniformly. Change `--padding` to retune the whole layout.
- The amount-displaying components (`TodayDisplay`, `RemainingDisplay`, `AmountInput`) use **container queries** to keep the app fixed-width: each component's outer element gets `container-type: inline-size`, and the amount font uses `clamp(min, Ncqi, max)` so the digits scale to fit the column rather than overflowing when balances grow past 5+ digits. The top row uses `grid-template-columns: 1fr 1fr` (instead of flex `space-between`) so each half is a determined width that `cqi` can resolve against. When adding any new large-number display, follow this same pattern — never let intrinsic content width drive the layout.
- `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent` on every tap target.
- Use `onclick`, not `ontouchend`. Modern iOS Safari doesn't have the legacy 300ms tap delay when `viewport` is correctly configured, and `onclick` keeps the app testable in desktop browsers.
- Font sizes use `clamp(min, vw, max)` so the layout scales across iPhone widths.
- `apple-mobile-web-app-status-bar-style: black-translucent` so the standalone PWA looks like a real iOS app.

## Bug history (don't reintroduce)

- The v1 `dayToString` returned `"11th"` for 11, 12, and 13. The fix in `formatOrdinal` is to check `n % 100` for the 11–13 special case before `n % 10`.
- v1's `plot()` shadowed the global `amount` with a loop-local of the same name, which is why the "last amount" label sometimes showed the wrong value. Components in v2 receive everything as props — never share global names.
- v1's `toggleKeypad` referenced DOM nodes (`history`, `reset`) that didn't exist in the HTML. That feature is gone; reintroduce it as a real Svelte component if you want it back.
- v1 used the deprecated AppCache manifest. v2 uses a real service worker (`src/service-worker.ts`) registered by SvelteKit.

## Conventions

- No comments unless the **why** is non-obvious. Don't narrate **what** the code does — names should carry that.
- Don't add features the task didn't ask for. Don't refactor outside the task's scope.
- Prefer editing existing files over creating new ones.
- Keep components small and prop-driven. The store owns persisted state; components own only ephemeral working state.
- When adding a feature: extend the store and add (or extend) one focused component. Wire it in `+page.svelte`.
