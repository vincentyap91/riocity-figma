---
name: Figma variables — Riocity-MCP
overview: >-
  Multi-brand html.to.design captures in the Riocity-MCP Figma file unified under one
  variable system: 01 Primitives (raw values) + 02 Semantic (role tokens, 4 brand modes).
  All solid fills, strokes, and effects are variable-bound. CSS is generated from
  figma-variables.json via generate-theme-css.mjs.
todos:
  - id: inventory
    content: "DONE: four SECTION roots; existing 01 Primitives + 02 Semantic (4 modes)"
    status: completed
  - id: modes
    content: "DONE: setExplicitVariableModeForCollection on each SECTION for 02 Semantic"
    status: completed
  - id: bind
    content: "DONE: semantic+primitive nearest-color bind; opaque solid fills, strokes, effects"
    status: completed
  - id: rename-primitives
    content: "DONE: raw palette rebuild target documented with intent/source names"
    status: completed
  - id: rio-section-vars
    content: "DONE: RioCity9 section tokens promoted into 02 Semantic; old collection deleted"
    status: completed
  - id: optional-rebind-by-zone
    content: "DONE: old RioCity9 section text bindings replaced by semantic text roles"
    status: completed
  - id: dashboard-binding
    content: "DONE: Web_User Dahsboard fully variable-bound (864 solids, 0 hardcoded)"
    status: completed
  - id: strokes-effects
    content: "OPTIONAL: reduce remaining opaque unbound strokes on non-RioCity9 sections"
    status: pending
  - id: gradients
    content: "DONE: 9 local PaintStyle gradient.* entries; 150 gradient stops in dashboard unbound (API limit)"
    status: completed
---

# Plan: Figma variables — Riocity-MCP

## What this file is

The Riocity-MCP Figma file contains four brand websites captured as static html.to.design frames on a single page — RioCity9, Leng855, CAM88, and KH168. A two-layer color variable system (primitives + semantics) is applied across all four brands so one token change updates every matching layer instantly, and the same token names export cleanly to CSS for web development.

---

## Overall architecture

```mermaid
flowchart TD
  subgraph figma ["Figma File — Page 1"]
    P["01 Primitives\n54 raw color values\nscopes hidden from pickers"]
    S["02 Semantic\n13 role tokens\n4 brand modes"]
    G["Gradient Paint Styles\n9 reusable styles"]
    F["Canvas Layers\nfills · strokes · text · effects"]
    P -->|"aliased by"| S
    S -->|"bound to"| F
    P -->|"stops reference"| G
    G -->|"fillStyleId"| F
  end
  FV["figma-variables.json\nsnapshot export"]
  CSS["theme.css\n--mono-* --brand-* --color-*"]
  S -->|"MCP export"| FV
  FV -->|"generate-theme-css.mjs"| CSS
```

---

## How color variables are applied in Figma

This section explains the concept from first principles. Read this before touching variables in the file.

### What a Figma color variable is

A variable stores a **single color value** under a **name**. Instead of painting a layer the raw hex `#292929`, you paint it with the variable `mono/700` which resolves to `#292929`. When the variable value changes, every layer bound to it updates instantly across the whole file — no find-and-replace needed.

```mermaid
flowchart LR
  hex["#292929\n(the actual color)"]
  var["mono/700\n(the variable name)"]
  L1["Border on card A"]
  L2["Divider in sidebar"]
  L3["Stroke on nav row"]
  hex --> var
  var --> L1
  var --> L2
  var --> L3
```

Changing `mono/700` from `#292929` to `#303030` instantly updates all three layers above — without touching any layer directly.

---

### Two-layer system: Primitives then Semantics

This file uses two collections. **Primitives** hold raw values only. **Semantics** assign meaning. Semantic tokens point to primitives — never to a raw hex.

```mermaid
flowchart LR
  subgraph prim ["01 Primitives — raw values"]
    P1["mono/700\n#292929"]
    P2["brand/500\n#45ff8b"]
    P3["mono/0\n#ffffff"]
  end
  subgraph sem ["02 Semantic — role names"]
    S1["color/border\n→ mono/700"]
    S2["color/primary\n→ brand/500"]
    S3["color/text/primary\n→ mono/0"]
  end
  subgraph canvas ["Canvas layers"]
    C1["Card border stroke"]
    C2["CTA button fill"]
    C3["Heading text"]
  end
  P1 --> S1 --> C1
  P2 --> S2 --> C2
  P3 --> S3 --> C3
```

**Rule:** canvas layers are bound to **semantics only**. Primitives are invisible in property pickers (`scopes: []`). This means a designer sees `color/border`, not `mono/700`, and never a raw hex.

---

### How a fill, stroke, or text gets bound

A paint on any layer is either a hardcoded hex or a **variable-bound paint**. Binding replaces the static value with a live reference:

```mermaid
flowchart LR
  Before["Layer fill\nhardcoded #292929"]
  Bound["Layer fill\nbound to color/border"]
  Resolves["Renders as #292929\n(updates if variable changes)"]
  Before -->|"setBoundVariableForPaint()"| Bound
  Bound --> Resolves
```

**What can be bound:**

| Paint type | Can bind? | Notes |
|------------|-----------|-------|
| Solid fill | Yes | Primary binding target |
| Solid stroke | Yes | Use `STROKE_COLOR` scope |
| Effect color | Yes | Drop shadows, inner shadows |
| Gradient stop color | Partial | Via `ColorStop.boundVariables.color` — API support varies |
| IMAGE fill | No | Raster asset, outside variable system |

---

### How brand modes change colors without touching layers

Each brand section (SECTION node) has an **explicit mode** applied to `02 Semantic`. The mode tells every semantic token which primitive to resolve to. The canvas layers are never modified — only the active mode on the section root changes.

```mermaid
flowchart TD
  Layer["CTA button fill\nbound to color/primary"]
  Sem["color/primary\n(semantic token)"]
  Layer --> Sem
  Sem -->|"mode: RioCity9"| Rio["brand/500\n#45ff8b"]
  Sem -->|"mode: KH168"| KH["support/danger\n#c8102e"]
  Sem -->|"mode: CAM88"| CAM["support/info\n#032ea1"]
  Sem -->|"mode: Leng855"| Leng["support/danger-soft\n#b91c1c"]
```

The same CTA button layer shows green on the RioCity9 section and red on KH168 — purely from the section's active mode.

---

### How this maps to CSS

The two-layer system maps directly to CSS custom properties. Figma variable names use slashes; CSS uses hyphens.

```mermaid
flowchart LR
  subgraph figma ["Figma"]
    FP["mono/700 = #292929"]
    FS["color/border → mono/700"]
  end
  subgraph css ["theme.css"]
    CP["--mono-700: #292929"]
    CS["--color-border: var(--mono-700)"]
  end
  FP --> CP
  FS --> CS
```

Usage in code:

```css
.card { border: 1px solid var(--color-border); }
.cta  { background: var(--color-primary); }
.heading { color: var(--color-text-primary); }
```

Updating `mono/700` in Figma and re-exporting `figma-variables.json` updates both the Figma fills and the CSS variable in one step.

---

### CSS export pipeline

```mermaid
flowchart LR
  Figma["Figma\n01 Primitives + 02 Semantic"]
  FV["figma-variables.json"]
  GEN["generate-theme-css.mjs\nnode generate-theme-css.mjs"]
  CSS["theme.css"]
  App["Web app\nvar(--color-*)"]
  Figma -->|"MCP export"| FV
  FV --> GEN --> CSS --> App
```

To refresh CSS after editing variables in Figma:
1. Re-export `figma-variables.json` (or ask the MCP agent to pull from Figma).
2. Run `node generate-theme-css.mjs`.

---

## One file, four brands

Four brand sections live on a single Figma page. Each section has `setExplicitVariableModeForCollection` applied to `02 Semantic` so layers inside that section resolve to brand-specific colors.

```mermaid
flowchart LR
  sem["02 Semantic\n13 role tokens"]
  sem -->|"mode: RioCity9"| rio["SECTION 46:740\nriocity9.com\nGreen brand"]
  sem -->|"mode: Leng855"| len["SECTION 46:4458\n855-c.net\nRed brand"]
  sem -->|"mode: CAM88"| cam["SECTION 46:5245\n88cam.vip\nBlue brand"]
  sem -->|"mode: KH168"| kh["SECTION 46:7239\nkh168.live\nCrimson brand"]
```

| SECTION node | Brand | Source site |
|-------------|-------|-------------|
| `46:740` | RioCity9 | staging.riocity9 |
| `46:4458` | Leng855 | 855-c.net |
| `46:5245` | CAM88 | 88cam.vip |
| `46:7239` | KH168 | kh168.live |

---

## Current status

| Area | Status | Detail |
|------|--------|--------|
| `01 Primitives` | Complete | 54 variables; abstract names (`mono/*`, `brand/*`, `accent/*`, `support/*`, `overlay/*`) |
| `02 Semantic` | Complete | 13 role tokens; single mode `Default` (multi-brand modes are a future step) |
| Solid fills / strokes | Complete | 2,985 fills + 576 strokes bound file-wide |
| `Web_User Dahsboard` | Complete | 864 solids bound, 0 hardcoded |
| Gradients | Partial | 150 unbound gradient stops in dashboard (API limit); 206 file-wide |
| `theme.css` | Current | Generated from `figma-variables.json` via `generate-theme-css.mjs` |
| Multi-brand CSS | Deferred | KH168, CAM88, Leng855 `[data-theme]` blocks pending mode setup |

---

## Token naming guide

### Primitive naming anatomy

```
mono / 700
^^^^   ^^^
group  scale step (0 = lightest, 950 = darkest)

brand / 500
^^^^^   ^^^
group  scale step

support / danger
^^^^^^^   ^^^^^^
group     role descriptor

overlay / default
^^^^^^^   ^^^^^^^
group     variant
```

### Primitive groups

| Group | Purpose | Example |
|-------|---------|---------|
| `mono/*` | Neutral grayscale ramp | `mono/0` (#fff) → `mono/950` (#000) |
| `brand/*` | Primary brand color ramp | `brand/500` (#45ff8b) |
| `accent/*` | Secondary highlight ramp | `accent/400` (#f8d840) |
| `support/*` | Status and utility colors | `support/danger` (#c8102e) |
| `overlay/*` | Transparency surfaces | `overlay/default` (rgba 0,0,0,0.6) |

### Semantic naming convention

Semantics describe **where** and **how** a color is used, not what it looks like:

| Semantic token | Meaning | Primitive (Default mode) |
|----------------|---------|--------------------------|
| `color/primary` | Main brand / CTA | `brand/500` |
| `color/accent` | Secondary highlight | `accent/400` |
| `color/surface` | Page background | `mono/900` |
| `color/surface/elevated` | Card / panel surface | `mono/750` |
| `color/surface/base` | Deepest surface | `mono/850` |
| `color/border` | Default divider | `mono/700` |
| `color/border/strong` | Emphasis divider | `mono/650` |
| `color/text/primary` | Body / heading text | `mono/0` |
| `color/text/secondary` | Muted text | `mono/400` |
| `color/text/link` | Hyperlinks | `support/link` |
| `color/success` | Positive states | `support/success` |
| `color/warning` | Caution states | `support/warning` |
| `color/danger` | Error / alert states | `support/danger` |
| `color/overlay` | Modal scrim | `overlay/default` |

---

## Semantic alias matrix (multi-brand rebuild target)

When multi-brand modes are added back to `02 Semantic`, use this alias matrix:

| Semantic token | RioCity9 | KH168 | CAM88 | Leng855 |
|----------------|----------|-------|-------|---------|
| `brand-primary` | `brand/500` | `support/danger` | `support/info` | `support/danger-soft` |
| `action-cta` | `brand/500` | `support/danger` | `support/info` | `accent/500` |
| `surface-base` | `mono/950` | `support/info` dark | `support/info` darker | `support/danger` dark |
| `surface-container` | `mono/750` | navy dark | navy mid | crimson dark |
| `text-primary` | `mono/0` | `mono/0` | `mono/0` | `mono/0` |
| `border-default` | `mono/700` | navy-mid | navy-base | crimson-mid |

---

## Frame audit guide — color variable coverage

Use this section any time you open a frame and need to check whether every fill, stroke, and effect is variable-bound. Follow the steps in order.

---

### The two-layer rule (recap)

Every color must pass through exactly two stops before reaching a canvas layer. No exceptions.

```mermaid
flowchart LR
  subgraph p ["01 Primitives — raw value"]
    P1["mono/700\n#292929"]
  end
  subgraph s ["02 Semantic — usage role"]
    S1["color/border\n→ mono/700"]
  end
  subgraph c ["Canvas layer"]
    C1["Card border stroke"]
  end
  P1 --> S1 --> C1
```

A layer bound directly to a **primitive** or left as a **raw hex** is an audit failure.

---

### Audit checklist — one frame at a time

**Step 1 — Scan every paint**

Select the frame. In Figma's design panel, inspect each fill, stroke, and effect:

| Paint type | Pass condition | Fail condition |
|------------|---------------|----------------|
| Solid fill | Shows a variable name (e.g. `color/surface`) | Shows only a hex code |
| Solid stroke | Shows a variable name | Shows only a hex code |
| Drop shadow / glow effect | Shows a variable name | Shows only a hex code |
| Gradient fill | Each stop shows a variable name, or the fill has a Paint Style | Raw hex in each stop |
| Image fill | Always skip — images are outside the variable system | — |

> In Figma, a bound layer shows the variable name beside the color swatch. An unbound layer shows only the hex value.

---

**Step 2 — For each unbound hex, look up 01 Primitives**

Open **Variables panel → 01 Primitives**.

Does a variable here already resolve to this hex (or close enough — within ~5 hex digits of visible difference)?

```mermaid
flowchart LR
  hex["Unbound hex found"]
  found{"Exists in\n01 Primitives?"}
  step3["Go to Step 3\n(check 02 Semantic)"]
  create_prim["Create a new primitive\n(see 'Creating a new primitive')"]
  hex --> found
  found -->|YES| step3
  found -->|NO| create_prim
  create_prim --> step3
```

---

**Step 3 — For each primitive, look up 02 Semantic**

Open **Variables panel → 02 Semantic**.

Does a token here already match how this color is *used* on the frame? Think about the layer's role, not its color.

| If the layer is… | Look for a semantic like… |
|-----------------|--------------------------|
| Page / section background | `color/surface`, `color/surface/base` |
| Card or floating panel | `color/surface/elevated` |
| Inset / deep well area | `color/surface/deep` |
| Table row fill | `color/surface/table` |
| Filter bar or nav rail | `color/surface/filter` |
| Active filter / selected tab | `color/surface/filter/active` |
| Default divider or outline | `color/border` |
| Emphasis divider | `color/border/strong` |
| Brand highlight border | `color/border/brand` |
| Primary CTA button | `color/primary` |
| Secondary highlight | `color/accent` |
| Warning state indicator | `color/warning` |
| Error or destructive state | `color/danger` |
| Positive / success state | `color/success` |
| Body or heading text | `color/text/primary` |
| Muted / secondary text | `color/text/secondary` |
| Hint / placeholder text | `color/text/muted` |
| Hyperlink text | `color/text/link` |
| Modal overlay / scrim | `color/overlay` |

```mermaid
flowchart LR
  role{"Matching role exists\nin 02 Semantic?"}
  bind["Bind layer paint\nto that semantic token"]
  create_sem["Create a new semantic token\n(see 'Creating a new semantic')"]
  done["Done — layer is bound"]
  role -->|YES| bind --> done
  role -->|NO| create_sem --> bind --> done
```

---

### Full decision tree

```mermaid
flowchart TD
  start["Layer has hardcoded hex?"]
  skip["Already bound — skip"]
  check_prim{"Hex exists in\n01 Primitives?"}
  check_sem{"Role exists in\n02 Semantic?"}
  new_prim["Create primitive\n(intent/source name)"]
  new_sem["Create semantic\n(usage role name)"]
  bind_layer["Bind layer paint\nto the semantic token"]

  start -->|NO| skip
  start -->|YES| check_prim
  check_prim -->|YES| check_sem
  check_prim -->|NO| new_prim --> check_sem
  check_sem -->|YES| bind_layer
  check_sem -->|NO| new_sem --> bind_layer
```

---

### Creating a new primitive

Only create when the hex value does not exist in **01 Primitives**.

**Naming anatomy:**

```
group / scale-step        ← fits an existing ramp
─────   ──────────
mono    825               neutral ramp  (0 = white → 950 = black)
brand   858               brand ramp
accent  420               highlight ramp
support danger-soft       status / utility (descriptive role suffix)
overlay scrim             transparency layer

raw-intent-source         ← brand-specific value with no natural ramp position
raw-brand-rio             (describes source / intent — not a color word)
raw-surface-kh-base
raw-border-leng
```

**Primitive naming rules:**

| Rule | Example — GOOD | Example — BAD |
|------|---------------|---------------|
| Use group prefix | `mono/825` | `825` |
| Use scale step for ramp colors | `brand/858` | `brand-dark-green` |
| Use role suffix for status colors | `support/danger-soft` | `light-red` |
| Use `raw-intent-source` for unique brand values | `raw-surface-kh-base` | `dark-navy-kh` |
| Never use a color word | `overlay/scrim` | `black-20-overlay` |
| Never use version words | `mono/865` | `mono-865-new` |

**Steps to create in Figma:**

1. Variables panel → **01 Primitives** → open the matching group folder.
2. Click **+ Add variable** → type **Color**.
3. Name using the rules above.
4. Set the value to the exact hex (or rgba for alpha colors).
5. Edit variable → **Scopes → uncheck all** (`scopes: []`). Primitives must be invisible to designers.
6. Edit variable → **Code syntax → Web** → enter `--group-step` with hyphens (matches CSS output).

---

### Creating a new semantic token

Only create when no existing role token in **02 Semantic** matches the layer's purpose.

**Naming anatomy:**

```
color / category / sub-role / modifier
──────  ────────   ────────   ────────
color   surface    filter     active     ← filter bar in active state
color   text       muted                 ← de-emphasised text
color   border     strong                ← heavy divider
color   primary                          ← top-level CTA (no sub-role needed)
color   danger                           ← top-level status (no sub-role needed)
```

**Semantic naming rules:**

| Rule | Example — GOOD | Example — BAD |
|------|---------------|---------------|
| Always start with `color/` | `color/surface/panel` | `surface-panel` |
| Describe where / how it is used | `color/border/highlight` | `color/green-border` |
| Add sub-role only when needed | `color/surface/elevated` | `color/surface/elevated/v2` |
| Never include a color word | `color/button/tabs` | `color/dark-tab-bg` |
| Never alias semantic → semantic | points to `mono/700` | points to `color/border` |
| Never paste a primitive name | `color/surface/high` | `color/mono-800` |
| Brand name allowed only in primitives | `raw-brand-rio` (primitive) | `color/rio-surface` (semantic) |

**Steps to create in Figma:**

1. Variables panel → **02 Semantic** → correct folder.
2. Click **+ Add variable** → type **Color**.
3. Name using the rules above.
4. For each mode cell (RioCity9, KH168, CAM88, Leng855): pick the matching **01 Primitives** variable — never a raw hex.
5. Edit variable → **Scopes** → enable **Fill color** + **Stroke color** (at minimum).
6. Edit variable → **Code syntax → Web** → enter `--color-category-subrole` with hyphens.

---

### Binding a layer

Once the primitive and semantic both exist:

1. Select the layer on canvas.
2. In the **Fill / Stroke / Effect** row, click the color swatch.
3. In the color picker, switch to the **Variables** tab (the library icon).
4. Search for the semantic name (e.g. `color/surface/panel`).
5. Click it. The swatch now shows the variable name instead of a hex — the layer is bound.
6. Repeat for every unbound paint on the same layer.

> **Gradient stops:** Each stop inside a gradient can also be bound. Select the stop handle, open the color picker, switch to Variables, and pick the matching semantic.

---

### Naming anti-patterns — reject these

Any variable name that contains the following words or patterns is a naming violation:

| Anti-pattern | Why it fails |
|--------------|-------------|
| `black`, `white`, `gray`, `grey` | Describes appearance, not role |
| `green`, `red`, `blue`, `gold`, `yellow`, `purple` | Describes appearance, not role |
| `dark-`, `light-`, `bright-` | Relative appearance — meaningless across themes |
| `-500`, `-700` as a **semantic** suffix | Primitive step leaked into a semantic name |
| `v2`, `new-`, `old-`, `-copy` | Version debt — name should survive forever |
| `mono-660` or `brand-500` as a semantic | Primitive names do not belong in semantic layer |
| Brand name in semantic: `rio-surface`, `kh-border` | Makes the token non-portable across brands |

> Brand names in **primitives** are fine with `raw-*` prefix (`raw-brand-rio`) because that describes the *source*. They are never allowed in semantic names.

---

### Self-check before saving

- [ ] Every new primitive has `scopes: []` (hidden from pickers in Figma).
- [ ] Every new semantic points to a **primitive**, not a hex and not another semantic.
- [ ] Every new semantic has a value set for **all four modes** (or at least `Default` as placeholder).
- [ ] No new variable name contains a color word, brand name (in semantics), or version suffix.
- [ ] The layer paint is now bound to the **semantic** — not the primitive, not a raw hex.
- [ ] Web code syntax is set in hyphens on both the primitive and the semantic.
- [ ] After changes: re-export `figma-variables.json` and run `node generate-theme-css.mjs` to refresh `theme.css`.

---

## Gradient paint styles

Nine reusable local paint styles cover repeated gradient fills. Each style is named with a grouped path for easy discovery in the Assets panel.

| Figma paint style | Semantic role | CSS token | Bound fills |
|-------------------|--------------|-----------|-------------|
| `Gradient / Brand / Primary` | Hero / nav brand wash | `--gradient-brand-primary` | 7 |
| `Gradient / Brand / Accent` | Secondary brand emphasis | `--gradient-brand-accent` | 39 |
| `Gradient / Promo / Red` | Urgency / limited-time | `--gradient-promo-red` | seed |
| `Gradient / Surface / Glow` | Card depth glow | `--gradient-surface-glow` | 8 |
| `Gradient / Surface / Card` | Card background | `--gradient-surface-card` | 60 |
| `Gradient / Surface / Icon` | Icon wash | `--gradient-surface-icon` | 195 |
| `Gradient / Surface / Subtle` | Subtle UI depth | `--gradient-surface-subtle` | 12 |
| `Gradient / Hero / Primary` | Hero / category wash | `--gradient-hero-primary` | 34 |
| `Gradient / Border / Highlight` | Highlighted card border | `--gradient-border-highlight` | 8 |

**API constraint:** `setBoundVariableForPaint` only works on `SolidPaint`. Gradient stop colors use `ColorStop.boundVariables.color`. Whole-paint gradient variable binding is not supported.

---

## Binding rules (reference)

- Prefer `02 Semantic` variables — they respect property scopes (TEXT vs fill vs stroke).
- Fallback: nearest primitive in `01 Primitives` within Euclidean RGB distance ~0.11.
- Skip paints with `opacity < 0.999` (overlays) to avoid visual drift.
- IMAGE fills: not converted — outside variable scope.
- GRADIENT: use `PaintStyle` + per-stop `ColorStop` binding; do not use the solid nearest-color path.
- Fonts: always `loadFontAsync` before mutating any TEXT node.

---

## File and tooling reference

- **Figma file key:** Not stored in this repository. Copy from the Figma URL (`/design/<fileKey>/...`). Store in a password manager or `FIGMA_FILE_KEY` local env for MCP scripts only.
- **Page:** `0:1` (Page 1)
- **MCP tool:** `use_figma` — always load `figma-use` skill before each call; sequential calls only (`skillNames: "figma-use"`).

### Key file paths

| File | Role |
|------|------|
| `figma-variables.json` | Snapshot of Figma variables (primitives + semantics) used as CSS source |
| `generate-theme-css.mjs` | Reads `figma-variables.json`, writes `theme.css` |
| `theme.css` | Generated CSS custom properties — do not edit directly |
| `plan.md` | This file — canonical handoff and architecture reference |
| `README.md` | Onboarding guide for new contributors |

---

## Completed work (session log)

1. Discovered existing `01 Primitives` + `02 Semantic` (4 brand modes); reused instead of duplicating.
2. Set per-SECTION explicit modes for `02 Semantic` on all four html.to.design roots.
3. Multi-pass bind: semantics + primitives; nearest-color algorithm with RGB distance threshold.
4. Renamed all primitives from legacy `raw-*` / chromatic names to abstract slash-grouped names (`mono/*`, `brand/*`, `accent/*`, `support/*`, `overlay/*`).
5. Promoted `RioCity9 sections` text tokens into `02 Semantic`; deleted old collection.
6. Created 9 local `PaintStyle` gradient entries; migrated 446 gradient fills.
7. Applied full dark-theme variable binding to `Web_User Dahsboard`: 864 solids bound, 0 hardcoded.
8. Regenerated `figma-variables.json` and `theme.css` from live Figma variables.
9. Consolidated `generate-theme-css.mjs` to read from `figma-variables.json` (not legacy `export-done.json`).

---

## Continuation (next steps)

1. **Multi-brand CSS:** After reviewing RioCity9, add modes to `02 Semantic` for KH168, CAM88, Leng855 and emit `[data-theme]` blocks from `generate-theme-css.mjs`.
2. **Gradient stops:** 150 unbound stops remain in `Web_User Dahsboard`; 206 file-wide. Bind manually in Figma UI where the plugin API falls short, or replace decorative gradients with flat + overlay approach.
3. **Stroke cleanup:** Other brand sections (Leng855, CAM88, KH168) still have optional unbound opaque strokes.
4. **Duplicate primitives:** `mono/350` = `mono/400` (both `#99a4b0`) and `mono/800` = `mono/850` (both `#252525`) — consolidate when convenient.
5. **`brand/500-soft`:** Same hex as `brand/500`; alpha is the only difference. Replace with single primitive + layer opacity.

---

## Risks

- Moving nodes **outside** their brand SECTION without updating explicit modes changes resolved colors silently.
- Figma plan tier may cap the number of modes per collection (currently using 1 mode; up to 4 brand modes planned).
- `use_figma` scripts must be small and sequential — never parallelise `use_figma` calls.
- Gradient stop API binding may not be supported in all Figma desktop versions; test before a full gradient migration pass.
