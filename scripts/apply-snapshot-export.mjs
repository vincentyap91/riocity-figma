/**
 * Reads scripts/figma-snapshot-data.mjs and writes export JSON + theme.css
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { prim, sem } from "./figma-snapshot-data.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

fs.writeFileSync(
  path.join(root, "scripts", "export-primitives.json"),
  JSON.stringify(prim, null, 2)
);
fs.writeFileSync(
  path.join(root, "scripts", "export-semantics.json"),
  JSON.stringify(sem, null, 2)
);

const payload = {
  source: "Figma MCP export — 01 Primitives (Value) + 02 Semantic (Default)",
  exportedAt: new Date().toISOString().slice(0, 10),
  "01 Primitives": { mode: prim.mode, variables: prim.variables },
  "02 Semantic": {
    mode: sem.mode,
    modes: sem.modes,
    variables: sem.variables,
  },
};

fs.writeFileSync(
  path.join(root, "figma-variables.json"),
  JSON.stringify(payload, null, 2)
);

const gen = spawnSync(process.execPath, ["generate-theme-css.mjs"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(gen.status ?? 1);
