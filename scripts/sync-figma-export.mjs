/**
 * Writes export-primitives.json + export-semantics.json from stdin JSON blobs,
 * merges into figma-variables.json, runs generate-theme-css.mjs.
 *
 * Usage (after Figma MCP export saved to temp files):
 *   node scripts/sync-figma-export.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const primPath = path.join(root, "scripts", "export-primitives.json");
const semPath = path.join(root, "scripts", "export-semantics.json");

if (!fs.existsSync(primPath) || !fs.existsSync(semPath)) {
  console.error("Missing export-primitives.json or export-semantics.json");
  process.exit(1);
}

const prim = JSON.parse(fs.readFileSync(primPath, "utf8"));
const sem = JSON.parse(fs.readFileSync(semPath, "utf8"));

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
console.log(
  "figma-variables.json:",
  prim.variables.length,
  "primitives,",
  sem.variables.length,
  "semantics"
);

const gen = spawnSync(process.execPath, ["generate-theme-css.mjs"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(gen.status ?? 1);
