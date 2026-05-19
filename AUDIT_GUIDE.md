# Frame Audit Guide — Color Variable Coverage

Use this guide any time you open a frame and want to make sure every fill, stroke,
and effect color is wired to the variable system — not left as a hardcoded hex.

---

## 1. Before you start — understand the two-layer rule

Every color in the file must travel through exactly **two stops** before reaching a canvas layer:

```
01 Primitives        02 Semantic          Canvas layer
─────────────        ───────────          ────────────
mono/700 #292929 ──► color/border   ────► Card border stroke
brand/500 #45ff8b──► color/primary  ────► CTA button fill
mono/0   #ffffff ──► color/text/primary──► Heading text
```

- **Primitives** store raw values only. They are hidden from pickers (`scopes: []`).  
  A designer never picks a primitive directly.
- **Semantics** describe usage role. Layers bind to semantics, not primitives.
- Hardcoded hex values on a layer mean the audit failed for that layer.

---

## 2. Audit checklist per frame

Work through these steps in order for every frame you touch.

### Step 1 — Scan fills and strokes

Select the frame. Open the **Selection** panel or run the Figma plugin Dev Mode inspector.
For each paint listed:

| Paint type | What to look for |
|------------|-----------------|
| Solid fill | Check if it shows a variable name (e.g. `color/surface`). If it shows a hex, it is unbound. |
| Solid stroke | Same check. |
| Effect (shadow, glow) | Same check. Color should show a variable. |
| Gradient fill | Note the hex values of each gradient stop for later review. |
| Image fill | Skip — images are outside the variable system. |

> **Tip:** In Figma, bound layers show the variable name next to the swatch. Unbound layers show only the hex code.

---

### Step 2 — For each unbound hex, check 01 Primitives

Open the **Variables** panel → **01 Primitives** collection.

Ask: Does a variable in this collection already resolve to this hex value (within ~5 hex digits of visible difference)?

```
Found?
  YES → note its name, move to Step 3
  NO  → you need to create a new primitive first (see Section 3)
```

---

### Step 3 — For each primitive, check 02 Semantic

Open the **Variables** panel → **02 Semantic** collection.

Ask: Is there already a semantic token whose **role** matches how this color is used on the frame?

Think about what the layer *does*, not what it *looks like*:

| If the layer is… | Look for a semantic named like… |
|------------------|---------------------------------|
| Page or section background | `color/surface`, `color/surface/base` |
| Card or floating panel | `color/surface/elevated` |
| Inset / deep well | `color/surface/deep` |
| Table row background | `color/surface/table` |
| Filter bar or navigation | `color/surface/filter` |
| Default divider or outline | `color/border` |
| Emphasis divider | `color/border/strong` |
| Brand highlight border | `color/border/brand` |
| Primary CTA fill | `color/primary` |
| Secondary highlight | `color/accent` |
| Warning state | `color/warning` |
| Error or danger state | `color/danger` |
| Success / positive state | `color/success` |
| Body text | `color/text/primary` |
| Muted / secondary text | `color/text/secondary` |
| Tertiary / hint text | `color/text/muted` |
| Hyperlink text | `color/text/link` |
| Modal overlay / scrim | `color/overlay` |

```
Found a matching semantic?
  YES → bind the layer paint to that semantic variable. Done.
  NO  → you need to create a new semantic token (see Section 4)
```

---

## 3. Creating a new primitive

Do this only when the hex value does not exist in **01 Primitives**.

### Naming rules for primitives

Primitive names describe **where the value comes from or what role it serves in the raw palette**, not what color it is.

| DO — intent/source names | DON'T — color names |
|--------------------------|---------------------|
| `mono/825` | `gray-dark` |
| `brand/858` | `green-strong` |
| `raw-surface-rio-raised` | `dark-green-bg` |
| `raw-brand-cam` | `blue-cam` |
| `support/danger-soft` | `light-red` |
| `overlay/scrim` | `black-20` |

**Naming anatomy:**

```
group / scale-step
─────   ──────────
mono    900          ← neutral ramp (0 = lightest → 950 = darkest)
brand   500          ← brand color ramp
accent  400          ← highlight / gold ramp
support danger       ← utility/status colors (descriptive role suffix)
overlay default      ← transparency layers

raw-intent-source    ← for unique one-brand colors with no obvious ramp step
                       (raw-brand-rio, raw-surface-kh-base, raw-border-leng)
```

**Rules:**
1. Never use a color word (`green`, `red`, `blue`, `gold`, `dark`, `light`).
2. Use the existing group prefix (`mono`, `brand`, `accent`, `support`, `overlay`, `raw-*`).
3. If the value fits an existing ramp, pick the closest step number — do not invent a new group.
4. If the value is brand-specific and has no natural ramp position, use `raw-intent-source` format.
5. Set `scopes: []` (hidden from pickers) — designers must never pick primitives directly.

### How to create the primitive in Figma

1. Open **Variables** panel → **01 Primitives** → group folder that fits.
2. Click **+ Add variable** → set type to **Color**.
3. Name it following the rules above.
4. Set the value to the exact hex (or rgba for alpha colors).
5. Set `scopes: []` (Edit variable → Scopes → uncheck all).
6. Set **Web** code syntax to `--your-name` using hyphens (matches CSS output).

---

## 4. Creating a new semantic token

Do this only when no existing semantic matches the usage role.

### Naming rules for semantics

Semantic names describe **how and where** a color is used — not its appearance, not its source.

| DO — usage role names | DON'T — appearance or source names |
|-----------------------|------------------------------------|
| `color/surface/panel` | `color/dark-panel` |
| `color/border/highlight` | `color/green-border` |
| `color/text/placeholder` | `color/gray-text` |
| `color/button/tabs` | `color/mono-660` |
| `color/surface/filter/active` | `color/brand-bg` |

**Naming anatomy:**

```
color / category / sub-role / modifier
──────  ────────   ────────   ────────
color   surface    filter     active
color   text       muted
color   border     strong
color   primary    (none — top-level intent)
color   danger     (none)
```

**Rules:**
1. Always start with `color/`.
2. Use the category that describes the UI zone: `surface`, `text`, `border`, `icon`.
3. Add a sub-role only when needed to distinguish from the base token: `/elevated`, `/strong`, `/muted`, `/active`.
4. Never include a color word in the name.
5. Never alias a semantic to another semantic — point to a primitive only.
6. Scopes should be **All** (or specific: `FILL`, `STROKE_COLOR`) so designers can pick these.

### How to create the semantic in Figma

1. Open **Variables** panel → **02 Semantic** → correct folder.
2. Click **+ Add variable** → type **Color**.
3. Name it following the rules above.
4. For each mode (RioCity9, KH168, CAM88, Leng855): click the mode cell and select the matching primitive from **01 Primitives**.
   - If a mode does not apply yet, use the `Default` mode value as a placeholder.
5. Set scopes to **Fill color** + **Stroke color** (at minimum).
6. Set **Web** code syntax to `--color-category-subrole` (hyphens, matches CSS).

---

## 5. Decision tree — quick reference

```
Layer has a hardcoded hex?
│
├─ NO → already variable-bound. Skip.
│
└─ YES ──► Does 01 Primitives have this hex?
           │
           ├─ YES (close enough) ──► Does 02 Semantic have a matching usage role?
           │                        │
           │                        ├─ YES ──► Bind layer to that semantic. Done.
           │                        │
           │                        └─ NO ──► Create semantic (Section 4)
           │                                  then bind layer to it. Done.
           │
           └─ NO ──► Create primitive (Section 3)
                     then create semantic (Section 4)
                     then bind layer to the new semantic. Done.
```

---

## 6. Binding the layer in Figma

Once both the primitive and semantic exist:

1. Select the layer on canvas.
2. In the **Fill** (or **Stroke** / **Effect**) panel, click the color swatch.
3. In the color picker, switch to the **Variables** tab (library icon).
4. Search for the semantic name (e.g. `color/surface/panel`).
5. Click it. The swatch now shows the variable name instead of a hex.
6. Repeat for every unbound paint on the layer.

> **Gradient stops:** Each stop inside a gradient can also be bound. Select the gradient stop handle, then open the color picker and bind to a semantic variable the same way.

---

## 7. Naming anti-patterns — full list

Reject any name that contains:

| Anti-pattern | Reason |
|--------------|--------|
| `black`, `white`, `gray`, `grey` | Color word — not role |
| `green`, `red`, `blue`, `gold`, `yellow`, `purple` | Color word — not role |
| `dark-`, `light-`, `bright-` | Relative appearance — changes across themes |
| `-500`, `-700` as a semantic suffix | That's a primitive step, not a role |
| `v2`, `new-`, `old-`, `-copy` | Version word — creates naming debt |
| `mono-660`, `brand-500` | Primitive name leaked into semantic |
| Brand name in semantic: `rio-surface`, `kh-border` | Makes token non-portable across brands |

Brand names are allowed **only** in primitives with the `raw-*` prefix (e.g. `raw-brand-rio`),
because that name is describing the *source* of a value — not a usage role.

---

## 8. Quick self-check before you commit

Before saving your work, verify:

- [ ] Every new primitive has `scopes: []` (hidden from pickers).
- [ ] Every new semantic points to a primitive (not a hex, not another semantic).
- [ ] Every new semantic has a value set for **all four modes** (or at least `Default`).
- [ ] No name contains a color word.
- [ ] The layer is now bound to the semantic, not the primitive.
- [ ] Web code syntax is set (hyphen format) on both primitive and semantic.
- [ ] `theme.css` can be regenerated by running `node generate-theme-css.mjs`.