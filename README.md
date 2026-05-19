# Riocity Figma tokens - repo guide

This folder documents and ships **design tokens** for the **Riocity-MCP** Figma file: four brand layouts (html.to.design captures) unified under one variable system.

**This README** is the onboarding surface (what files mean, how to use CSS). **[plan.md](./plan.md)** is the operator manual (Figma SECTION ids, gradients, MCP workflow, risks, optional follow-ups).

**Encoding:** Keep Markdown files here saved as **UTF-8** (not UTF-16). UTF-16 will look like blank or garbage text in many editors.

### TL;DR

| If you want to... | Start here |
|-----------------|------------|
| Understand token layers and what changed over time | **[plan.md](./plan.md)** |
| Use colors in a web app | **`theme.css`** + `data-theme` (see below) |
| Refresh CSS after editing tokens | Update **`figma-variables.json`** (Figma MCP export), then run **`node generate-theme-css.mjs`** |
| Automate Figma | Cursor/Figma MCP **`use_figma`** with **figma-use** (+ **figma-generate-library**) skills; never parallelize `use_figma` calls |

### Brand modes (`data-theme`)

| Figma `02 Semantic` mode | HTML attribute |
|--------------------------|----------------|
| RioCity9 | `data-theme="rio-city9"` |
| KH168 | `data-theme="kh168"` |
| CAM88 | `data-theme="cam88"` |
| Leng855 | `data-theme="leng855"` |

If you omit `data-theme`, **`theme.css`** still defines semantics on `:root` using the **RioCity9** mapping (same values as `rio-city9`).

---

## What lives in Figma (mental model)

| Layer | Collection | Role |
|-------|------------|------|
| Raw palette | **`01 Primitives`** | Physical hex values only; neutral names (`brand/pulse`, `mono/700`, ...); hidden from pickers where appropriate. Single mode `Value`. |
| Product UI roles | **`02 Semantic`** | Semantic colors (`brand-primary`, `surface-base`, `text-link`, ...); **four modes**: RioCity9, KH168, CAM88, Leng855. Each mode aliases into primitives. |
| Gradients | **Local paint styles** | Named styles (e.g. `Gradient / Brand / Primary`); stop colors tied to semantic/primitive variables where possible. |

**Flow:** primitives 뿯↽ semantic (per mode) 뿯↽ bound fills / strokes / text in each brand SECTION.

The legacy **`RioCity9 sections`** collection was **removed**; former layout-only text tokens live as **`02 Semantic`** tokens (`text-promo-highlight`, `text-link`, `text-prize-highlight`) with the same four-mode alias matrix.

For SECTION node IDs, gradient tables, binding rules, optional next steps, and MCP tooling notes, see **[plan.md](./plan.md)** - that file is the **detailed handoff**.

### `02 Semantic` variables (product-facing)

These exist **per brand mode** in Figma and map to **`theme.css`** names via `$codeSyntax.WEB`:

| Figma name | CSS variable (semantic) |
|------------|-------------------------|
| `brand-primary` | `--color-primary` |
| `action-cta` | `--color-accent` |
| `surface-base` | `--color-surface` |
| `surface-container` | `--color-surface-elevated` |
| `text-primary` | `--color-text-primary` |
| `text-on-emphasis` | `--color-text-on-emphasis` |
| `border-default` | `--color-border` |
| `text-promo-highlight` | `--color-text-promo-highlight` |
| `text-link` | `--color-text-link` |
| `text-prize-highlight` | `--color-text-prize-highlight` |

**Gradients** live as **Figma paint styles** (and Dev Mode descriptions), not as rows in `theme.css`. See **plan.md 뿯↽ Gradient tokens**.

### `export-done.json` shape (for tooling)

The file is a **JSON array** of two objects:

1. **`01 Primitives`** - `modes.Value` holds nested groups; each leaf has `$type`, `$value` (hex), and `$codeSyntax.WEB` (`var(--kebab-name)`).
2. **`02 Semantic`** - `modes.<Brand>` holds flat semantic keys; each entry references a primitive via **`$value`** like `{brand.pulse}` (dots become kebab in CSS: `var(--brand-pulse)`).

`generate-theme-css.mjs` only understands **color** tokens that follow this pattern.

---

## Security: file URL and `fileKey`

- Do **not** commit the live Figma URL or **`fileKey`** to public repos; anyone with the key can aim API/MCP calls at that file (access still depends on Figma permissions).
- Keep the key in **`FIGMA_FILE_KEY`** (local env), a password manager, or team secrets.

---

## Files in this folder

| File | Purpose |
|------|---------|
| **[plan.md](./plan.md)** | Canonical checklist: architecture, brand roots, semantic token table, gradients, risks, continuation items. |
| **`export-done.json`** | Snapshot of tokens in a tools-friendly shape: `01 Primitives` + `02 Semantic` (all modes). Update this when Figma variables change and you want the repo to stay in sync. |
| **`theme.css`** | Generated **CSS custom properties** for the web: primitives on `:root`, semantics under `[data-theme="..."]`. |
| **`generate-theme-css.mjs`** | Node script that reads `export-done.json` and overwrites `theme.css`. |

---

## Web usage: `theme.css`

**Scope:** solid **color** primitives + semantic aliases only. Gradients are separate (Figma styles / app CSS).

1. Import or link `theme.css` in your app.
2. **Primitives** are always available as `--base-paper`, `--brand-pulse`, ...
3. **Semantic** tokens (`--color-primary`, `--color-surface`, `--color-text-link`, ...) are defined:
   - on **`:root`** using the **RioCity9** mapping (default when you omit `data-theme`);
   - again under **`[data-theme="rio-city9" | "kh168" | "cam88" | "leng855"]`** for explicit switching.

Example:

```html
<html lang="en" data-theme="cam88">
```

```css
.button {
  background: var(--color-primary);
  color: var(--color-text-on-emphasis);
}
```

Regenerate CSS after editing `export-done.json`:

```bash
node riocity-figma/generate-theme-css.mjs
```

---

## Keeping JSON and CSS up to date

There is no automatic Figma 뿯↽ repo sync in this folder. When variables change in Figma:

1. Export or reconstruct the same JSON shape as **`export-done.json`** (primitives + semantic modes with `$value` references like `{brand.pulse}`).
2. Run **`generate-theme-css.mjs`**.
3. Adjust **`plan.md`** if architecture or naming changed materially.

---

## Related scripts (repo root)

Parent project may contain helpers such as **`four-theme-setup.js`** / **`four-theme-global-extractor.js`** for Figma/API workflows. This **`riocity-figma`** directory is the **documentation + CSS artifact** home; **`plan.md`** ties Figma state to file names and IDs.

---

## Glossary

| Term | Meaning |
|------|---------|
| Primitive | Raw hex in **`01 Primitives`**; in CSS, `--mono-700`, `--accent-promo-400`, ... |
| Semantic | Role token in **`02 Semantic`**; resolves differently per brand **mode** |
| Mode | One of RioCity9, KH168, CAM88, Leng855 - aligns with each html.to.design SECTION |
| `data-theme` | HTML attribute that swaps **semantic** CSS variables; primitives stay shared on `:root` |
