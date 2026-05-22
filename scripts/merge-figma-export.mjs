/**
 * Merge figma-export-live.json (primitives + semantics) into figma-variables.json
 * Usage: node scripts/merge-figma-export.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const varsPath = path.join(root, "figma-variables.json");
const primPath = path.join(root, "figma-primitives-live.json");
const semPath = path.join(root, "figma-semantics-live.json");
const combinedPath = path.join(root, "figma-export-live.json");

const data = JSON.parse(fs.readFileSync(varsPath, "utf8"));
let exportedAt = data.exportedAt;

if (fs.existsSync(combinedPath)) {
  const live = JSON.parse(fs.readFileSync(combinedPath, "utf8"));
  exportedAt = live.exportedAt ?? exportedAt;
  if (live.primitives) data["01 Primitives"].variables = live.primitives;
  if (live.semantics) data["02 Semantic"].variables = live.semantics;
} else {
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
}

data.exportedAt = exportedAt;
data["01 Primitives"].mode = data["01 Primitives"].mode ?? "Value";
data["02 Semantic"].mode = data["02 Semantic"].mode ?? "Default";
data["02 Semantic"].modes = data["02 Semantic"].modes ?? ["Default"];

fs.writeFileSync(varsPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Merged ${varsPath} — ${data["01 Primitives"].variables.length} primitives, ${data["02 Semantic"].variables.length} semantics`
);
