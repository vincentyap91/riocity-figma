/**
 * Apply live Figma export (primitives + semantics JSON files) to figma-variables.json
 * Usage:
 *   node scripts/apply-figma-live-export.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const varsPath = path.join(root, "figma-variables.json");
const primPath = path.join(root, "figma-primitives-live.json");
const semPath = path.join(root, "figma-semantics-live.json");

const data = JSON.parse(fs.readFileSync(varsPath, "utf8"));
const prim = JSON.parse(fs.readFileSync(primPath, "utf8"));
const sem = JSON.parse(fs.readFileSync(semPath, "utf8"));

data.source =
  "Figma MCP export — 01 Primitives (Value) + 02 Semantic (Default)";
data.exportedAt = prim.exportedAt ?? sem.exportedAt ?? data.exportedAt;
data["01 Primitives"].variables = prim.primitives;
data["01 Primitives"].mode = "Value";
data["02 Semantic"].variables = sem.semantics;
data["02 Semantic"].mode = "Default";
data["02 Semantic"].modes = ["Default"];

fs.writeFileSync(varsPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Updated ${varsPath} — ${prim.primitives.length} primitives, ${sem.semantics.length} semantics (${data.exportedAt})`
);
