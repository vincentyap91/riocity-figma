/**
 * Merge live Figma semantics export into figma-variables.json.
 * Usage: node sync-figma-variables.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const primPath = path.join(__dirname, "figma-primitives-live.json");
const semPath = path.join(__dirname, "figma-semantics-live.json");
const varsPath = path.join(__dirname, "figma-variables.json");

const data = JSON.parse(fs.readFileSync(varsPath, "utf8"));
let exportedAt = data.exportedAt;

if (fs.existsSync(primPath)) {
  const prim = JSON.parse(fs.readFileSync(primPath, "utf8"));
  exportedAt = prim.exportedAt ?? exportedAt;
  if (prim.primitives) data["01 Primitives"].variables = prim.primitives;
}
if (fs.existsSync(semPath)) {
  const sem = JSON.parse(fs.readFileSync(semPath, "utf8"));
  exportedAt = sem.exportedAt ?? exportedAt;
  if (sem.semantics) data["02 Semantic"].variables = sem.semantics;
}

data.exportedAt = exportedAt;
data["01 Primitives"].mode = data["01 Primitives"].mode ?? "Value";
data["02 Semantic"].mode = data["02 Semantic"].mode ?? "Default";
data["02 Semantic"].modes = data["02 Semantic"].modes ?? ["Default"];

fs.writeFileSync(varsPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Updated ${varsPath} — ${data["01 Primitives"].variables.length} primitives, ${data["02 Semantic"].variables.length} semantics (${exportedAt})`
);
