/**
 * Merge live Figma semantics export into figma-variables.json.
 * Usage: node sync-figma-variables.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const livePath = path.join(__dirname, "figma-semantics-live.json");
const varsPath = path.join(__dirname, "figma-variables.json");

const live = JSON.parse(fs.readFileSync(livePath, "utf8"));
const data = JSON.parse(fs.readFileSync(varsPath, "utf8"));

data.exportedAt = live.exportedAt;
data["02 Semantic"].variables = live.semantics;
data["02 Semantic"].mode = data["02 Semantic"].mode ?? "Default";
data["02 Semantic"].modes = data["02 Semantic"].modes ?? ["Default"];

fs.writeFileSync(varsPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Updated ${varsPath} — ${data["01 Primitives"].variables.length} primitives, ${live.semantics.length} semantics (${live.exportedAt})`
);
