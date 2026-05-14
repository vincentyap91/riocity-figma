---
name: Figma Riocity-MCP tokens
overview: >-
  Multi-brand html.to.design captures in Figma file UAdiwF7uYbVMqq8ky3Fn0n:
  primitives (non-chromatic names), 02 Semantic per brand mode, bindings,
  RioCity9 layout-scoped section variables. Use use_figma (figma-use skill) to continue.
todos:
  - id: inventory
    content: "DONE: four SECTION roots; existing 01 Primitives + 02 Semantic (4 modes)"
    status: completed
  - id: modes
    content: "DONE: setExplicitVariableModeForCollection on each SECTION for 02 Semantic"
    status: completed
  - id: bind
    content: "DONE: semantic+primitive nearest-color bind (TH~0.11); opaque fills only"
    status: completed
  - id: rename-primitives
    content: "DONE: chromatic names removed from 01 Primitives (see Completed work)"
    status: completed
  - id: rio-section-vars
    content: "DONE: RioCity9 sections collection + promo-strip/* for last 2 text colors"
    status: completed
  - id: optional-rebind-by-zone
    content: "OPTIONAL: rebind existing text from semantics → top-game/text etc. by zone (bulk)"
    status: pending
  - id: strokes-effects
    content: "OPTIONAL: reduce remaining opaque unbound strokes; effect color variables"
    status: pending
  - id: semantic-rename
    content: "OPTIONAL: rename 02 Semantic vars (brand-primary → color/primary) if desired"
    status: pending
---

# Plan: Figma variables — Riocity-MCP

## File

- **URL:** https://www.figma.com/design/UAdiwF7uYbVMqq8ky3Fn0n/Riocity-MCP?node-id=0-1
- **fileKey:** `UAdiwF7uYbVMqq8ky3Fn0n`
- **Page:** `0:1` (Page 1)
- **Tool:** Figma MCP `use_figma` — load **figma-use** (and figma-generate-library) skill before each call; sequential calls only; `skillNames: "figma-use,figma-generate-library"`.

## Page structure (four brand roots)

| SECTION `id` | Brand mode (`02 Semantic`) | Source |
|--------------|---------------------------|--------|
| `46:740` | RioCity9 | staging.riocity9 |
| `46:4458` | Leng855 | 855-c.net |
| `46:5245` | CAM88 | 88cam.vip |
| `46:7239` | KH168 | kh168.live |

Each SECTION has `setExplicitVariableModeForCollection` for **`02 Semantic`** (`VariableCollectionId:56:2`) to the matching mode id.

## Collections (as left in file)

### `01 Primitives` (single mode `Value`; `scopes = []`)

Primitives were renamed to **avoid chromatic paint words** (no `dark-gray/700`, `crimson`, `slate`, etc.). Current names (29 tokens) include:

`accent/trace`, `accord/core`, `base/ink`, `base/paper`, `brand/pulse`, `brand/strike`, `depth/800`, `depth/840`, `depth/900`, `depth/920`, `mono/220`, `mono/300`, `mono/500`, `mono/650`, `mono/700`, `mono/800`, `partner/mark`, `signal/500`, `signal/600`, `signal/700`, `signal/900`, `signal/peak`, `state/caution`, `state/danger-soft`, `state/promo`, `state/promo-muted`, `state/success`, `tone/subtle`, `wash/400`

WEB `codeSyntax` pattern: `var(--{name-with-slashes-as-hyphens})`.

### `02 Semantic` (modes: RioCity9, KH168, CAM88, Leng855)

Variables: `brand-primary`, `action-cta`, `surface-base`, `surface-container`, `text-primary`, `text-on-emphasis`, `border-default` — each mode aliases into primitives.

WEB `codeSyntax` (semantic → app CSS):

- `brand-primary` → `var(--color-primary)`
- `action-cta` → `var(--color-accent)`
- `surface-base` → `var(--color-surface)`
- `surface-container` → `var(--color-surface-elevated)`
- `text-primary` → `var(--color-text-primary)`
- `text-on-emphasis` → `var(--color-text-on-emphasis)`
- `border-default` → `var(--color-border)`

### `RioCity9 sections` (`VariableCollectionId:101:2`)

Layout-scoped tokens for **RioCity9 board only** (`46:740`); mode `Default`; **`TEXT_FILL`** scope.

- `promo-strip/text-highlight` → `var(--promo-strip-text-highlight)` — bound “Daily Bonus Claim”
- `promo-strip/text-link` → `var(--promo-strip-text-link)` — bound “Download”

Section `46:740` also has explicit mode set for this collection.

**Zone slug rules** (for future vars like `top-game/text`): infer from **self or any ancestor** name (lowercase), first match:

- `top games` → `top-game`
- `recent big win` → `recent-big-win`
- `recent payout` → `recent-payout`
- `recommended slots` / `recommended arcade` → `recommended-slots` / `recommended-arcade`
- `hot games` → `hot-games`
- `banner`, `footer`, `header`/`navbar`, `sidebar`, `jackpot`, `promo`
- `maintenance`, `welcome bonus`, `daily bonus`, `download`, or `promo` → `promo-strip`
- else → `page`

Text **role** suffix: default `text`; `text-highlight` if copy suggests bonus/claim; `text-link` if “download”.

## Binding approach (reference for continuation)

- Prefer **`02 Semantic`** (respects scopes: TEXT vs fill vs stroke).
- Fallback: **nearest primitive** in `01 Primitives` within Euclidean distance **~0.11** in RGB 0–1 space.
- **Skip** paints with opacity **&lt; 0.999** (overlays) to avoid visual drift.
- **IMAGE** / **GRADIENT**: not converted.
- **Fonts:** `loadFontAsync` before mutating `TEXT`.

## Completed work (session summary)

1. Discovered existing `01 Primitives` + `02 Semantic` (4 brand modes); reused instead of duplicating.
2. Set per-SECTION explicit modes for `02 Semantic` on all four html.to.design roots.
3. Multi-pass bind: semantics + primitives; added primitives (`yellow`, `gold`, `navy-brand`, `slate`, `muted-gold`, `coral`, `emerald`, `gray`, `wash`, `mono/*`, `accent/trace`) then consolidated naming into non-chromatic **`01 Primitives`** names.
4. Renamed all primitives; updated WEB code syntax.
5. **`RioCity9 sections`**: two layout tokens for the last unbound RioCity9 text colors; **0** remaining opaque unbound text solids in `46:740`.

**Last reported opaque stats (file-wide, approximate):** bound fills increased into ~1700s; some opaque fills/strokes still unbound where color is outside threshold or role is stroke-heavy.

## Continuation (when you resume)

1. **Optional bulk rebind:** For RioCity9 only, find `TEXT` bound to `text-primary` / primitives whose ancestor chain matches `top games`, etc., **unbind** and bind to `RioCity9 sections` variables such as `top-game/text` (alias to same primitive or semantic for theme sync). High touch count — script in batches with returned `mutatedNodeIds`.
2. **Strokes:** Add stroke-scoped primitives or semantic `border-*` variants; rerun bind for `STROKE_COLOR` only.
3. **Semantics rename:** If you want Figma names to match `color/primary`, rename `02 Semantic` variables and refresh WEB `codeSyntax` (bindings follow variable id).
4. **Other three boards:** Optionally mirror `RioCity9 sections` as `KH168 sections`, etc., with the same zone-key logic adapted to their layer names.

## Risks / notes

- Moving nodes **outside** their brand `SECTION` without updating explicit modes can change resolved colors.
- Figma **plan mode limits** may cap modes per collection (already using 4 modes on `02 Semantic`).
- `use_figma` scripts must stay small; return structured JSON; never parallel `use_figma`.

## Related plan file (Cursor)

An earlier iteration of this plan also exists at:

`c:\Users\Vincent\.cursor\plans\figma_color_variables_3990b7f4.plan.md`

This **`plan.md`** in the repo is the **canonical handoff** for continuing later.
