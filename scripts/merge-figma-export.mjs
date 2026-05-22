/**
 * Merge figma-export-live.json (primitives + semantics) into figma-variables.json
 * Usage: node scripts/merge-figma-export.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const livePath = path.join(root, "figma-export-live.json");
const varsPath = path.join(root, "figma-variables.json");

const live = JSON.parse(fs.readFileSync(livePath, "utf8"));
const data = JSON.parse(fs.readFileSync(varsPath, "utf8"));

data.exportedAt = live.exportedAt ?? data.exportedAt;
if (live.primitives) {
  data["01 Primitives"].variables = live.primitives;
  data["01 Primitives"].mode = data["01 Primitives"].mode ?? "Value";
}
if (live.semantics) {
  data["02 Semantic"].variables = live.semantics;
  data["02 Semantic"].mode = data["02 Semantic"].mode ?? "Default";
  data["02 Semantic"].modes = data["02 Semantic"].modes ?? ["Default"];
}

fs.writeFileSync(varsPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Merged ${varsPath} — ${data["01 Primitives"].variables.length} primitives, ${data["02 Semantic"].variables.length} semantics`
);
