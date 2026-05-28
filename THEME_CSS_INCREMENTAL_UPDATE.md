# theme.css — incremental update rules (DO NOT rename existing vars)

This repo treats `theme.css` as the **source of truth for CSS variable names** used by the app.
When syncing from Figma, **only append new variables** and **never rename/remove** existing ones,
even if Figma variable names change.

Last confirmed naming snapshot (git): **`main` @ commit `4eee956`**.

---

## What must stay stable

- **Selector**: `:root, [data-theme="default"]`
- **Primitive var naming**: `01 Primitives` `group/name` → `--group-name`  
  Examples: `mono/700` → `--mono-700`, `raw-brand-cam` → `--raw-brand-cam`
- **Semantic var naming**: `02 Semantic` `color/...` → `--color-...`  
  Example: `color/text/primary` → `--color-text-primary`
- **Gradient composites**: `color/gradient/*/(start|end)` and `color/table/highlight/(start|end)`  
  become `--color-gradient-*` tokens.
- **Back-compat alias**: keep `--color-table-highlight` available.
  - Current rule: `--color-table-highlight: var(--color-gradient-table);`

---

## Incremental update workflow (from Figma → repo)

### 1) Export variables from Figma

Export **01 Primitives** and **02 Semantic** (aliases) from the Figma file, then write them to:

- `figma-primitives-live.json`
- `figma-semantics-live.json`

### 2) Merge into `figma-variables.json`

```bash
node sync-figma-variables.mjs
```

### 3) Regenerate `theme.css`

```bash
node generate-theme-css.mjs
```

---

## How to ensure “new variables only”

Before updating, capture the current CSS variable name list, then compare after regeneration.

### PowerShell (recommended)

```powershell
# snapshot current var names
Select-String -Path .\theme.css -Pattern '^\s*--' |
  ForEach-Object { ($_.Line -split ':')[0].Trim() } |
  Set-Content .\theme.css.vars.before.txt

# ...do Figma export + sync + generate...

# snapshot updated var names
Select-String -Path .\theme.css -Pattern '^\s*--' |
  ForEach-Object { ($_.Line -split ':')[0].Trim() } |
  Set-Content .\theme.css.vars.after.txt

# show ONLY newly added vars
Compare-Object (Get-Content .\theme.css.vars.before.txt) (Get-Content .\theme.css.vars.after.txt) |
  Where-Object SideIndicator -eq '=>' |
  Select-Object -ExpandProperty InputObject
```

### Rule for accepting a sync

- Allowed: **only** `=>` (added) variables
- Not allowed: any removed (`<=`) or renamed variables  
  If you see removals/renames, update the generator to preserve the old name by aliasing
  (same pattern as `--color-table-highlight`).

