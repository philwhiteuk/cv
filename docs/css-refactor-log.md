# CSS refactor log

Incremental, per-component migration of custom CSS to Tailwind v4 utilities.
Rules: no visual/behavioral changes; variables hoisted to `css/main.css`
(`@theme` for design tokens, `:root` for the rest), role-named, grouped by
category. One component per commit so each pass is independently revertible.

## Migration status

| Component | Status | Notes |
|---|---|---|
| Homepage interests section | ✅ migrated | `dl dt`, `dl img` rules → utilities; `.row` deleted (class kept in markup as JS / `prefers-reduced-motion` hook); dead `alternate` class removed; 2 redundant rules deleted (`background-attachment: fixed`, `dl text-align: left` — both already covered by broader rules) |
| Layout primitives (`.flex`, `.column`, `.break`, line-breaks) | ⏳ partial | `.column` rule still needed by aside + projects include; `.flex` shared by dialog/aside/projects incl. `max-width: 60rem` restack |
| Theme blocks (`.primary`/`.secondary` + a/button/svg/em descendants) | ⏳ partial | 3-way selector group with `dialog`; interests branches inert (its content has no a/button/svg/em). Future: `--color-accent` for `#7700ff` |
| Homepage section scroll-hint (bounce keyframes, `::after` dividers) | 🔒 custom | Pseudo-element + keyframes + odd/even border colours |
| Interests slide-in animation (`@keyframes slide-in`, `@supports (animation-timeline: view())`) | 🔒 custom | Scroll-driven, JS-toggled via `.slide-in` class; `--from-x` hoisted to `:root` |
| `prefers-reduced-motion` guards | 🔒 custom | `.row`/`.card` animation overrides |
| Header | ✅ migrated | `header.css` deleted, all rules → utilities in `_includes/header.html`; `.menu-link` `@apply` component class for the 5 menu items; `menu-open` state-only `@custom-variant` composed with `max-md:` at point of use; `sticky` was a no-op conditional (page layout never matched) — made unconditional; legacy `hide-md`/`hide-lg` breakpoints in `base.css` moved 53.125rem → 48rem to match `max-md` (flip verified coherent, crossing now at 768px instead of 850px) |
| Everything else (footer, dialog, aside, projects, tag, subpage, base) | ⏳ not started | |

## Variable master list

All declared in `css/main.css`. Role-named, grouped by category. Do not declare
variables elsewhere; do not name them after appearance or value.

### `@theme` (design tokens → matching utilities)

| Variable | Value | Role |
|---|---|---|
| `--color-gradient-start` | `#d16f00` | Brand gradient start (primary backgrounds, interests icon fill, line-break gradients) |
| `--color-gradient-end` | `#5105a7` | Brand gradient end |
| `--text-interest-term` | `clamp(1em, calc(0.95em + 0.25vw), 1.2em)` | Interests `dt` term size (`text-interest-term` utility) |
| `--color-accent` | `#7700ff` | Accent border/links (header border-top; base/tag still hard-coded — theme-block pass) |
| `--shadow-header` | `0 2px 10px rgba(0, 0, 0, 0.3)` | Header drop shadow (`shadow-header` utility) |

### `:root`

| Variable | Value | Role |
|---|---|---|
| `--fluid-step-0…6` | clamp scale | Pre-existing. Fluid type scale |
| `--fluid-gutter` | `clamp(1rem, 5vw, 4rem)` | Pre-existing. Base fluid gutter |
| `--fluid-gutter-sm` | `clamp(0.25rem, 3vw, 2rem)` | Pre-existing. Small gutter step |
| `--fluid-gutter-lg` | `clamp(1.5rem, 6vw, 5rem)` | Pre-existing. Large gutter step |
| `--fluid-gutter-xs` | `calc(var(--fluid-gutter-sm) * 0.5)` | Half-step gutter (was an inline expression in interests `dt` + base h3–h6) |
| `--from-x` | `-10vw` | Slide-in animation start offset (was declared inside `.slide-in` rule) |

## Flagged for later passes

- `#7700ff` (accent links/buttons in base, tag) → use existing `--color-accent`
  token — belongs to the theme-block pass.
- `max-width: 60rem` `.flex` restack → layout-primitives pass.
- Off-scale arbitrary values kept deliberately in header: `z-[100]` (legacy
  stacking context, one-off), `min-h-[7vh]` (viewport-proportional legacy value),
  `border-t-[0.2rem]` (legacy border width, no Tailwind step),
  `w-[clamp(2.5rem,2.5vw,4.5rem)]` / `w-[clamp(1.5rem,3vw,2.5rem)]` (fluid
  legacy sizes), `rounded-[50%]` (`rounded-full` would distort the non-square
  187×200 profile photo), `gap-[calc(var(--fluid-gutter-sm)*0.5)]` /
  `gap-[calc(var(--fluid-gutter-sm)*0.2)]` (fluid gutter fractions,
  `--fluid-gutter-xs` covers the former elsewhere).
- Duplicate `id="interests"` on the homepage section and `dl` (invalid HTML,
  currently harmless — JS targets `#interests .row` via the section).
- Off-scale arbitrary values kept deliberately in interests: `size-[clamp(3em,6vw,6em)]`
  (em/vw fluid icon size, one-off), `bg-[linear-gradient(...)]` (avoids
  Tailwind's `--tw-gradient-*` plumbing per element).
