# Importing variables back into Figma

## Why `RioCity9.tokens.json` fails

That file is a **Figma round-trip export** of one mode (`02 Semantic` / RioCity9). It is **not** safe to import as-is because:

1. **Missing primitives** — Every token uses `com.figma.aliasData` pointing at **`01 Primitives`** (`raw-brand-rio`, `raw-dark-color`, …). Those primitives are **not included** in `RioCity9.tokens.json`, so Figma cannot resolve aliases.
2. **Stale internal IDs** — Fields like `com.figma.variableId` and `targetVariableId` (`VariableID:…/-1:-1`) belong to a **previous** file session. Re-import often errors when IDs do not match the open file.
3. **Wrong shape for import** — Import expects **collection + mode** structure (or a full multi-collection export), not a flat mode object with `$extensions.com.figma.modeName` at the root.

Do **not** use `RioCity9.tokens.json` for Variables → Import unless you only need a reference dump.

## What to import instead

Use **`RioCity9.figma-import.json`** (generated from `export.json`):

```bash
node scripts/sanitize-figma-import.mjs
```

That file contains:

- **`01 Primitives`** / mode `Value` — literal hex/rgba values
- **`02 Semantic`** / mode `RioCity9` — aliases like `{raw-brand-rio}` (no Figma internal IDs)

### Steps in Figma

1. Open your target file → **Local variables** (or Variables panel).
2. **Import** → choose **`RioCity9.figma-import.json`**.
3. Map collections if prompted: create or merge into `01 Primitives` and `02 Semantic`.
4. Confirm mode names: `Value` and `RioCity9`.

If import still fails, try importing **`export.json`** directly (same structure, may include extra metadata).

### Alias fix included

`text-rtp` in Figma referenced `raw-text-dark` while the repo primitive is `raw-text-rtp`. The generated import file adds **`raw-text-dark`** as a duplicate of `raw-text-rtp` so that alias resolves.

## Regenerating after token changes

1. Export variables from Figma to `export.json` (your usual export path).
2. Run `node scripts/sanitize-figma-import.mjs`.
3. Import `RioCity9.figma-import.json` into Figma.
