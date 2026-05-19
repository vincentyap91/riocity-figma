import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const prim = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "export-primitives.json"), "utf8")
);
const sem = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "export-semantics.json"), "utf8")
);

const payload = {
  source: "Figma MCP export — 01 Primitives (Value) + 02 Semantic (Default)",
  exportedAt: "2026-05-19",
  "01 Primitives": { mode: prim.mode, variables: prim.variables },
  "02 Semantic": {
    mode: sem.mode,
    modes: sem.modes,
    variables: sem.variables,
  },
};

fs.writeFileSync(path.join(root, "figma-variables.json"), JSON.stringify(payload, null, 2));
console.log(
  "figma-variables.json:",
  prim.variables.length,
  "primitives,",
  sem.variables.length,
  "semantics"
);
