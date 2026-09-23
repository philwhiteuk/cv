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
| Layout primitives (`.flex`, `.column`, `.break`) | ✅ migrated | Superseded by the "Layout primitives" pass below |
| Homepage section scroll-hint (bounce keyframes, `::after` dividers) | ✅ `@apply` in `main.css` components layer | `::after` + `@keyframes bounce` can't be template utilities, but all declarations are `@apply` one-liners now (`animate-[bounce_2s_infinite]`, `border-(--color-on-primary)`/`border-accent` odd/even); `css/homepage.css` deleted |
| Interests slide-in animation (`@keyframes slide-in`, `@supports (animation-timeline: view())`) | ✅ `@apply` in `main.css` components layer | Scroll-driven, JS-toggled via `.slide-in` class; `--from-x` hoisted to `:root`; inner rule is `animate-[0.5s_linear_0.1s_both_slide-in]`, keyframes stay plain CSS in the layer |
| `prefers-reduced-motion` guards | ✅ `motion-reduce:` variant | `.row` guard is now `motion-reduce:animate-none` in the components layer (same compiled query); `.card` guard deleted in the dead-branch prune |
| Header | ✅ migrated | `header.css` deleted, all rules → utilities in `_includes/header.html`; `.menu-link` `@apply` component class for the 5 menu items; `menu-open` state-only `@custom-variant` composed with `max-md:` at point of use; `sticky` was a no-op conditional (page layout never matched) — made unconditional; legacy `hide-md`/`hide-lg` breakpoints in `base.css` moved 53.125rem → 48rem to match `max-md` (flip verified coherent, crossing now at 768px instead of 850px) |
| Tag page layout | ✅ migrated | `main#tag > section` → utilities on `_layouts/tag.html` section; `css/tag.css` deleted + import removed |
| Subpage layout | ✅ migrated | `section.subpage` → utilities on `_layouts/subpage.html` + `pages/all-projects.html` (only other `subpage` user); `section.subpage .wrapper` → utilities on the layout's wrapper; `css/subpage.css` deleted + import removed |
| Line-break dividers/spacers | 🗑 removed | Owner decision (PR #13 review): concept removed entirely — `_includes/line-break.html` deleted, both `line-break-md` spacers (aside, subpage layout) and the gradient divider above the aside dropped, all 5 `css/base.css` rules deleted. Intentional visual change, not a refactor |
| Footer | ✅ migrated | All 5 `body > footer` rules → utilities in `_includes/footer.html`; `css/footer.css` deleted + import removed from `main.css`; social anchors get `bg-none bg-transparent` (old `background: none` shorthand) and `hover:after:content-none` (kills base `a[href^="https:"]` hover arrow on icons) |
| Contact dialog | ✅ migrated | All rules → utilities in `_includes/dialog.html` (`open:` variant for `dialog[open]`, `backdrop:bg-[rgba(0,0,0,0.85)]` for the backdrop); dead `animation: fade-in` deleted — no `@keyframes fade-in` exists anywhere, so it was a no-op; `dialog button.close i` (close.svg background-image composite) now an `@apply` one-liner in the `main.css` components layer — `css/dialog.css` deleted; `dialog header` guards `flex-row! flex-nowrap!` against the `.flex` wrap default |
| Project card | ✅ migrated | All 24 rules in `css/projects.css` → utilities on `_includes/projects.html`; file deleted + import removed. `article.project`, `.flex.column` kept as class names (JS hooks in `assets/projects-filter.js`). New tokens: `--color-card-surface`, `--color-tag-chip` (also used by filters pass), `--text-meta`. Redundant declarations dropped (already covered by base): chip `color:#fff`, `background:none`, `border:none`, hover underline. `summary` marker tricks via arbitrary variants; `[open]` state via `[&[open]>summary]:hidden`; content-paragraph margins via `[&_p]:my-(--fluid-gutter-sm)` |
| Projects filter UI | ✅ migrated | All `css/projects-filter.css` rules → utilities in `pages/all-projects.html`; file deleted + import removed. Dead CSS removed: `.active-tags`/`.active-tag`/`.remove-tag` (5 rules) — markup never rendered by any template or JS. Tag-cloud dedupe: aside + filters copies replaced by one shared `@apply` component block in `main.css` (tiers must stay class-based — computed by Liquid). Active state via `aria-pressed:` variants (JS toggles `active` class + `aria-pressed` together). New tokens: chip/focus colour set + `--tag-cloud-gap`. `.project` transition moved to shared components block |
| Aside | ✅ fully migrated | Base rule → utilities on `_includes/aside.html` (`bg-scroll` etc.); `wrapper` mt-0, education `ml-[0.5em]`, training `list-[circle] ml-[1.5em]` → utilities; h2 icon chrome + per-section icons + `em` restore → semantic `@apply` block in `main.css` (`aside h2` keeps plain-CSS `background-position: -4px center` — keyword arbitrary values don't compile, but numeric `bg-[position:0_-530px]` does). Career-history branch-sprite also `@apply` one-liners in `main.css` now (data-driven `li` variant classes stay class-based — names come from `_data/career.yml`); `css/aside.css` deleted + import removed. Mobile override kept as plain `@media (max-width: 32rem)` (`max-[32rem]:` compiles to `min-width` negation — boundary differs at exactly 512px, same as the `.flex` restack); `bg-none!` replaces the old `background: 0 0` shorthand reset — equivalent since position/repeat are moot without an image |
| Layout primitives | ✅ migrated | `.wrapper` (12 usages) + `.flex`/`.column` (JS hooks + name collision with utilities — component-layer `@apply` definitions in `main.css`); `.flex` restack kept as plain `@media (max-width: 60rem)` (Tailwind `max-[60rem]:` compiles to `width < 60rem`, differs from `max-width` at exactly 960px); `.break` → inline `basis-full h-0` (2 usages); `.hide` → `hidden!`, `.hide-lg` → `min-md:hidden!`; `.hide-sm`/`.hide-md` deleted — zero usages |
| Theme blocks (`.primary`/`.secondary` + a/button/svg/em descendants) | ✅ migrated | 3-way selector group with `dialog` kept as-is (interests branches inert — its content has no a/button/svg/em); all 14 colour literals → tokens; dead `.card` reduced-motion guard deleted (`.card` has zero usages — only `article.project` exists) |
| Base globals (`css/base.css` element rules) | ✅ kept custom | Global element selectors (`html`, `*`, `a`, `button`, headings, `main > section` snap) apply site-wide, not per-component — utilities on templates can't replace them without duplicating on every element. Colours tokenised (`--color-link`, `--color-external-link-bg`); rest is typography/scroll-snap structure. `@keyframes reveal` + `.reveal` kept custom (scroll-driven, `prefers-reduced-motion` guard). Follow-up dead-branch prune (post-#21): removed `.primary svg` group + `main#homepage/tag > section` button/svg branches (no svgs or section-level buttons render in those contexts), `dialog a`/`dialog svg`/`dialog em` branches (dialog has only the close `<i>` background icon, no anchors/svgs/em), and all `main#homepage section#interests` a/button/svg/em branches (interests `dd` is raw text, no links/controls/icons). Orphaned token `--color-accent-soft` removed with it. Kept: `.primary em`/homepage/tag `em` (markdown `*emphasis*` renders real `em`s in all three), `dialog button` (Send + close), `.secondary a/button/svg` (header/footer) |
| Homepage scroll-hint dividers (`css/homepage.css`) | ✅ kept custom | Keyframes + `::after` dividers stay custom; divider border colours tokenised (`--color-on-primary`, `--color-accent`) |
| Intentionally-custom one-offs | ♻️ relocated + flagged | `.reveal` + `@keyframes reveal` (scroll-driven `view()` animation) and `body > *:not(dialog)` (body-level flex layout) moved out of layers into main.css as unlayered rules — no utility/theme equivalents, verified no markup utility conflicts. Kept in their layers on purpose (utilities must keep winning): `background-attachment: fixed` on `.primary`/`.secondary` (components layer — `bg-scroll`/`bg-fixed` utilities override it), `a[href^="https:"]:hover::after` arrow (base layer — footer's `hover:after:content-none` overrides it). All four annotated `/* Intentionally custom */` in source |
| Theme blocks → `@layer components` `@apply` | ♻️ migrated | `.primary`/`.secondary`/`dialog` + descendant rules (a/button/svg/em) rewritten with `@apply` against theme tokens (`text-on-primary`, `bg-accent`, `bg-surface-light`, `text-on-light`, `fill-icon-on-light`); selector grouping kept intact. Gradient stays a raw `linear-gradient(180deg, …)` declaration — `@apply bg-gradient-to-b` would emit `in oklab` interpolation and shift the orange→purple mid-tones; `background: none` shorthand on `.secondary` kept raw (resets bg-image before `bg-surface-light`). Only compiled diff: `background` → `background-color` longhand on the two button rules (no bg-image on buttons to reset) |
| Element defaults → `@layer base` | ♻️ migrated | `css/base.css` import flipped `layer(components)` → `layer(base)`; trimmed to pure element defaults (html, a/button, headings, `em`, `main > section/aside` scroll) referencing `@theme` tokens (`var(--font-sans)`, `--text-fluid-*`, `--spacing-fluid-*`). Duplicate `button { color }` collapsed into `a, button`. Non-element rules (`.primary`/`.secondary` groups, `.reveal`, `body > *:not(dialog)`) moved into `main.css` components layer verbatim — cascade-identical (base < components). Verified in compiled output: base rules after Preflight (so `line-height: 1.5em` still beats its unitless `1.5`), utilities after base (markup utilities still win) |
| Design tokens → `@theme` | ♻️ migrated | All `:root` design tokens moved into the `@theme` block with Tailwind namespaces, renamed atomically across all 8 usage files: `--fluid-step-N` → `--text-fluid-N`, `--fluid-gutter` → `--spacing-fluid` (`-sm/-lg/-xs/-2xs` follow), `--fluid-row-gap-*` → `--spacing-fluid-row-*`, `'Poppins'` literal → `--font-sans` (now drives Preflight's own `html` font rule via `--default-font-family`), plus `--text-base`/`--tracking-base`/`--leading-base` overrides. Utilities now auto-generate: `text-fluid-0…6`, `p-/m-/gap-fluid*`, `font-sans`, `tracking-base`, `leading-base`, `text-base`. Remaining `:root` vars are one-off layout metrics (`--tag-cloud-gap`, `--home-*`, `--from-x`), not design tokens. Dead Sass-era `_sass/default.scss` deleted (duplicated tokens; imports only files removed in e4a99d7; nothing referenced it) |
| Preflight-duplicate reset rules (`css/base.css`) | 🗑 removed | Preflight has been live since the Tailwind build (e4a99d7) — deleted the hand-rolled duplicates it was masking: `* { margin/padding/list-style }`, `a, button` background/border/font-inherit/text-decoration resets, `input, textarea` font reset. Deltas kept (Preflight doesn't cover them): `a, button { color/cursor/display }`, `button { padding }`, `html { line-height: 1.5em }` (unitless `1.5` would recompute per element). Also dropped redundant `box-border` (`.wrapper`), `border-0` (dialog markup) — Preflight box-sizes and zeroes borders. `_sass/default.scss` flagged dead (imports `_sass/theme/_*.scss` deleted in e4a99d7; site loads only the Tailwind-built `assets/css/main.css`) |

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
| `--color-chip-hover` | `rgba(255, 255, 255, 0.1)` | Tag-cloud chip hover background |
| `--color-chip-hover-strong` | `rgba(255, 255, 255, 0.3)` | Chip hover-while-active + reset-button hover background |
| `--color-chip-border` | `#fff` | Active chip / reset-button border |
| `--color-chip-border-idle` | `rgba(255, 255, 255, 0.4)` | Reset-button idle border |
| `--color-focus-ring` | `#fff` | Keyboard focus outline (chips, reset button) |
| `--tag-cloud-gap` | `calc(var(--fluid-gutter-sm) * 0.3)` | Tag-cloud gap (aside + filters, was duplicated inline) |
| `--color-link` | `#fff` | Default `a`/`button` text colour (base globals) |
| `--color-on-primary` | `#fff` | Text on gradient/primary surfaces (theme blocks, odd scroll-hint divider) |
| `--color-surface-light` | `#fff` | Light surface background (`.secondary`, dialog, interests) |
| `--color-on-light` | `#000` | Text on light surfaces (`.secondary` descendants, even scroll-hint divider uses `--color-accent`) |
| `--color-icon-on-light` | `#fff` | SVG icon fill on light surfaces (`.secondary` descendants: footer social icons) |
| `--color-external-link-bg` | `rgba(119, 0, 255, 0.5)` | External-link (`a[href^="https:"]`) background tint |

### `:root`

| Variable | Value | Role |
|---|---|---|
| ~~`--fluid-step-0…6`~~ | clamp scale | → `@theme` `--text-fluid-0…6` (design tokens pass) |
| ~~`--fluid-gutter*`~~ | clamp scale | → `@theme` `--spacing-fluid*` (design tokens pass) |
| ~~`--fluid-row-gap*`~~ | clamp scale | → `@theme` `--spacing-fluid-row*` (design tokens pass) |
| `--from-x` | `-10vw` | Slide-in animation start offset (was declared inside `.slide-in` rule) |
| `--home-section-height` | `95vh` | Homepage section min-height (was hard-coded in `main#homepage > section`) |
| `--home-section-scroll-offset` | `7vh` | Homepage section scroll-margin-top (was hard-coded) |
| `--home-section-overlap` | `-1vh` | Homepage section overlap/scroll-margin-bottom — one role, used by both the section utilities and the kept-custom scroll-hint rule (was hard-coded `-1vh` in two places) |
| `--home-wrapper-gap` | `calc(var(--spacing-fluid) * 3)` | Homepage wrapper column-gap (was inline in `main#homepage > section .wrapper`) |
| `--tag-cloud-gap` | `calc(var(--spacing-fluid-sm) * 0.3)` | Tag-cloud gap (aside + filters, was duplicated inline) |

## Flagged for later passes
- ~~`@keyframes bounce` name collision~~ — resolved in #20: keyframes moved
  into `@theme` in `css/main.css` (which wins over Tailwind's default) and
  re-centred via `translateX(-0%)` alongside the utility-positioned divider;
  compiled output now emits exactly one `bounce` definition.
- ~~`#7700ff` (accent links/buttons in base, tag)~~ — tokenised to
  `--color-accent` in the theme-block pass.
- ~~`max-width: 60rem` `.flex` restack~~ — handled in the layout-primitives pass.
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
