# CSS refactor log

Incremental, per-component migration of custom CSS to Tailwind v4 utilities.
Rules: no visual/behavioral changes; variables hoisted to `css/main.css`
(`@theme` for design tokens, `:root` for the rest), role-named, grouped by
category. One component per commit so each pass is independently revertible.

## Migration status

| Component | Status | Notes |
|---|---|---|
| Homepage Welcome section | ✅ migrated | `main#homepage > section` + `.wrapper` layout rules → utilities on all 3 homepage sections/wrappers (shared homepage layout, so also covers `#interests` + `#recent-projects` shells); `.term-caret` → `animate-caret-blink` (`@theme` token, keyframes renamed `slow-blink`→`caret-blink`) + `before:content-['\_']`; dead `.typing-effect` + `@keyframes typing` deleted; component imports moved into `layer(components)` so utilities reliably win |
| Homepage interests section | ✅ migrated | `dl dt`, `dl img` rules → utilities; `.row` deleted (class kept in markup as JS / `prefers-reduced-motion` hook); dead `alternate` class removed; 2 redundant rules deleted (`background-attachment: fixed`, `dl text-align: left` — both already covered by broader rules) |
| Layout primitives (`.flex`, `.column`, `.break`, line-breaks) | ⏳ partial | `.column` rule still needed by aside + projects include; `.flex` shared by dialog/aside/projects incl. `max-width: 60rem` restack |
| Theme blocks (`.primary`/`.secondary` + a/button/svg/em descendants) | ⏳ partial | 3-way selector group with `dialog`; interests branches inert (its content has no a/button/svg/em). Future: `--color-accent` for `#7700ff` |
| Homepage section scroll-hint (bounce keyframes, `::after` dividers) | 🔒 custom | Pseudo-element + keyframes + odd/even border colours |
| Interests slide-in animation (`@keyframes slide-in`, `@supports (animation-timeline: view())`) | 🔒 custom | Scroll-driven, JS-toggled via `.slide-in` class; `--from-x` hoisted to `:root` |
| `prefers-reduced-motion` guards | 🔒 custom | `.row`/`.card` animation overrides |
| Header | ✅ migrated | `header.css` deleted, all rules → utilities in `_includes/header.html`; `.menu-link` `@apply` component class for the 5 menu items; `menu-open` state-only `@custom-variant` composed with `max-md:` at point of use; `sticky` was a no-op conditional (page layout never matched) — made unconditional; legacy `hide-md`/`hide-lg` breakpoints in `base.css` moved 53.125rem → 48rem to match `max-md` (flip verified coherent, crossing now at 768px instead of 850px) |
| Tag page layout | ✅ migrated | `main#tag > section` → utilities on `_layouts/tag.html` section; `css/tag.css` deleted + import removed |
| Subpage layout | ✅ migrated | `section.subpage` → utilities on `_layouts/subpage.html` + `pages/all-projects.html` (only other `subpage` user); `section.subpage .wrapper` → utilities on the layout's wrapper; `css/subpage.css` deleted + import removed |
| Line-break dividers/spacers | 🗑 removed | Owner decision (PR #13 review): concept removed entirely — `_includes/line-break.html` deleted, both `line-break-md` spacers (aside, subpage layout) and the gradient divider above the aside dropped, all 5 `css/base.css` rules deleted. Intentional visual change, not a refactor |
| Footer | ✅ migrated | All 5 `body > footer` rules → utilities in `_includes/footer.html`; `css/footer.css` deleted + import removed from `main.css`; social anchors get `bg-none bg-transparent` (old `background: none` shorthand) and `hover:after:content-none` (kills base `a[href^="https:"]` hover arrow on icons) |
| Contact dialog | ✅ migrated | All rules → utilities in `_includes/dialog.html` (`open:` variant for `dialog[open]`, `backdrop:bg-[rgba(0,0,0,0.85)]` for the backdrop); dead `animation: fade-in` deleted — no `@keyframes fade-in` exists anywhere, so it was a no-op; kept custom: `dialog button.close i` (close.svg background-image composite) as the last rule in `css/dialog.css`; `dialog header` guards `flex-row! flex-nowrap!` against the `.flex` wrap default |
| Project card | ✅ migrated | All 24 rules in `css/projects.css` → utilities on `_includes/projects.html`; file deleted + import removed. `article.project`, `.flex.column` kept as class names (JS hooks in `assets/projects-filter.js`). New tokens: `--color-card-surface`, `--color-tag-chip` (also used by filters pass), `--text-meta`. Redundant declarations dropped (already covered by base): chip `color:#fff`, `background:none`, `border:none`, hover underline. `summary` marker tricks via arbitrary variants; `[open]` state via `[&[open]>summary]:hidden`; content-paragraph margins via `[&_p]:my-(--fluid-gutter-sm)` |
| Everything else (aside, filters, base) | ⏳ not started | |

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
| `--color-field-border` | `#ccc` | Dialog form input/textarea border |
| `--color-scrim` | `rgba(0, 0, 0, 0.85)` | Dialog backdrop dim layer (`bg-scrim` utility) |
| `--color-icon-plate` | `#fff` | Close-icon backing plate |
| `--color-social-icon-fill` | `#000` | Footer social icon SVG fill (was built-in `fill-black`) |
| `--color-card-surface` | `rgba(0, 0, 0, 0.2)` | Project card translucent background (`bg-card-surface` utility) |
| `--color-tag-chip` | `rgba(255, 255, 255, 0.2)` | Project tag chips + active filter chips (`bg-tag-chip` utility) |
| `--text-meta` | `clamp(0.75rem, calc(0.7rem + 0.25vw), 0.95rem)` | Small meta text: external links, tag chips, filter chips (`text-meta` utility) |

### `:root`

| Variable | Value | Role |
|---|---|---|
| `--fluid-step-0…6` | clamp scale | Pre-existing. Fluid type scale |
| `--fluid-gutter` | `clamp(1rem, 5vw, 4rem)` | Pre-existing. Base fluid gutter |
| `--fluid-gutter-sm` | `clamp(0.25rem, 3vw, 2rem)` | Pre-existing. Small gutter step |
| `--fluid-gutter-lg` | `clamp(1.5rem, 6vw, 5rem)` | Pre-existing. Large gutter step |
| `--fluid-gutter-xs` | `calc(var(--fluid-gutter-sm) * 0.5)` | Half-step gutter (was an inline expression in interests `dt` + base h3–h6) |
| `--fluid-gutter-2xs` | `calc(var(--fluid-gutter-sm) * 0.25)` | Quarter-step gutter (footer social gap; also recurs in projects-filter `.active-tag`/`.remove-tag` — use it there in the filter pass) |
| `--from-x` | `-10vw` | Slide-in animation start offset (was declared inside `.slide-in` rule) |
| `--home-section-height` | `95vh` | Homepage section min-height (was hard-coded in `main#homepage > section`) |
| `--home-section-scroll-offset` | `7vh` | Homepage section scroll-margin-top (was hard-coded) |
| `--home-section-overlap` | `-1vh` | Homepage section overlap/scroll-margin-bottom — one role, used by both the section utilities and the kept-custom scroll-hint rule (was hard-coded `-1vh` in two places) |
| `--home-wrapper-gap` | `calc(var(--fluid-gutter) * 3)` | Homepage wrapper column-gap (was inline in `main#homepage > section .wrapper`) |

## Flagged for later passes
- **`@keyframes bounce` name collision (pre-existing, live on `main`)**: the custom
  scroll-hint keyframes in `css/homepage.css` share a name with Tailwind's
  default `bounce`; the default wins, so the authored `translateX(-50%)`
  centered bounce is currently not what renders. Fixing it is a behavior
  change — needs an explicit decision (rename to e.g. `section-divider-bounce`).

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
- `dialog[open]`'s `animation: fade-in` was dead (no keyframes defined) — deleted rather than reproduced. If an open animation is wanted later, add keyframes + an `--animate-*` token.
- Off-scale arbitrary values kept deliberately in dialog: `my-[25vh]`, `mx-[clamp(1rem,5vw,2rem)]`, `px-[calc(var(--fluid-gutter)*1.5)]`, `rounded-[0.2em]`, `h-[clamp(8em,15vh,12em)]` — one-off legacy values. Colours are tokens per the standing rule: `border-field-border`, `backdrop:bg-scrim`, close-icon plate uses `--color-icon-plate`.
- **Standing rule (owner)**: all colours must be root-level role-named tokens (`@theme` `--color-*` in `css/main.css`); no inline colour literals in classes or CSS.
- `@source not "../docs"` added to `css/main.css` — the refactor log's example class names were being picked up by the Tailwind scanner and emitted as dead utilities (`.fixed`, `.inline`, `.bg-[linear-gradient(...)]`, `.shadow`, various `gap-[...]`).
- Off-scale arbitrary values kept deliberately in interests: `size-[clamp(3em,6vw,6em)]`
  (em/vw fluid icon size, one-off), `bg-[linear-gradient(...)]` (avoids
  Tailwind's `--tw-gradient-*` plumbing per element).
