/**
 * Patch figma-variables.json with Daily Check-in tokens from Figma export.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const varsPath = path.join(root, "figma-variables.json");
const data = JSON.parse(fs.readFileSync(varsPath, "utf8"));

const newPrims = [
  { name: "mono/453", css: "#454545" },
  { name: "mono/468", css: "#8d8d8d" },
  { name: "mono/471", css: "#8b8b8b" },
  { name: "mono/636", css: "#363636" },
  { name: "mono/647", css: "#7a7a7a" },
  { name: "brand/646", css: "#2b3c2b" },
  { name: "brand/761", css: "#039940" },
  { name: "brand/809", css: "#0e510e" },
  { name: "brand/811", css: "#114617" },
  { name: "brand/812", css: "#00742f" },
  { name: "brand/831", css: "#334c33" },
  { name: "brand/846", css: "#1c8649" },
  { name: "brand/847", css: "#34774f" },
  { name: "brand/856", css: "#2eac61" },
  { name: "brand/862", css: "#72e0a0" },
  { name: "accent/470", css: "#ffda29" },
  { name: "accent/475", css: "#dd8545" },
  { name: "accent/476", css: "#ae5300" },
];

const newSems = [
  { name: "color/accent/check-in/reward", aliasTo: "accent/470" },
  { name: "color/gradient/check-in/day/end", aliasTo: "brand/811" },
  { name: "color/gradient/check-in/day/start", aliasTo: "brand/846" },
  { name: "color/gradient/check-in/reward/end", aliasTo: "accent/476" },
  { name: "color/gradient/check-in/reward/start", aliasTo: "accent/475" },
  { name: "color/icon/check-in/active", aliasTo: "brand/856" },
  { name: "color/icon/check-in/muted", aliasTo: "mono/468" },
  { name: "color/icon/check-in/star-deep", aliasTo: "brand/812" },
  { name: "color/surface/check-in/cell", aliasTo: "mono/453" },
  { name: "color/surface/check-in/cell-active", aliasTo: "brand/831" },
  { name: "color/surface/check-in/cell-alt", aliasTo: "mono/855" },
  { name: "color/surface/check-in/cell-hover", aliasTo: "mono/636" },
  { name: "color/surface/check-in/cta", aliasTo: "brand/761" },
  { name: "color/surface/check-in/day-bg", aliasTo: "brand/646" },
  { name: "color/surface/check-in/day-current", aliasTo: "brand/847" },
  { name: "color/surface/check-in/footer", aliasTo: "brand/809" },
  { name: "color/text/check-in/day-active", aliasTo: "brand/862" },
  { name: "color/text/check-in/day-muted", aliasTo: "mono/475" },
  { name: "color/text/check-in/day-past", aliasTo: "mono/471" },
  { name: "color/text/check-in/reward", aliasTo: "mono/647" },
];

data.exportedAt = "2026-05-22";

const primByName = new Map(data["01 Primitives"].variables.map((v) => [v.name, v]));
for (const p of newPrims) primByName.set(p.name, p);
data["01 Primitives"].variables = [...primByName.values()].sort((a, b) =>
  a.name.localeCompare(b.name)
);

const semByName = new Map(data["02 Semantic"].variables.map((v) => [v.name, v]));
for (const s of newSems) semByName.set(s.name, s);
data["02 Semantic"].variables = [...semByName.values()].sort((a, b) =>
  a.name.localeCompare(b.name)
);

fs.writeFileSync(varsPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Patched ${varsPath} — ${data["01 Primitives"].variables.length} primitives, ${data["02 Semantic"].variables.length} semantics`
);
