/**
 * Decode scripts/_export.b64 (from Figma MCP) → export JSON + figma-variables.json + theme.css
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const b64Path = path.join(root, "scripts", "_export.b64");
if (!fs.existsSync(b64Path)) {
  console.error("Missing scripts/_export.b64");
  process.exit(1);
}

const payload = JSON.parse(
  Buffer.from(fs.readFileSync(b64Path, "utf8").trim(), "base64").toString("utf8")
);

fs.writeFileSync(
  path.join(root, "scripts", "export-primitives.json"),
  JSON.stringify(payload.primitives, null, 2)
);
fs.writeFileSync(
  path.join(root, "scripts", "export-semantics.json"),
  JSON.stringify(payload.semantics, null, 2)
);

const merged = {
  source: "Figma MCP export — 01 Primitives (Value) + 02 Semantic (Default)",
  exportedAt: payload.exportedAt,
  "01 Primitives": {
    mode: payload.primitives.mode,
    variables: payload.primitives.variables,
  },
  "02 Semantic": {
    mode: payload.semantics.mode,
    modes: payload.semantics.modes,
    variables: payload.semantics.variables,
  },
};

fs.writeFileSync(
  path.join(root, "figma-variables.json"),
  JSON.stringify(merged, null, 2)
);

console.log(
  "Wrote figma-variables.json:",
  payload.primitives.variables.length,
  "primitives,",
  payload.semantics.variables.length,
  "semantics"
);

const gen = spawnSync(process.execPath, ["generate-theme-css.mjs"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(gen.status ?? 1);
