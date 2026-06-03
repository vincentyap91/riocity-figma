/**
 * Merge live Figma export (prim text + sem chunks) into figma-variables.json,
 * regenerate theme.css, print only deltas.
 *
 * Usage:
 *   node scripts/sync-delta-from-export.mjs
 *     (reads scripts/prim.b64 + scripts/sem-chunk-*.b64)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "..");
const jsonPath = path.join(root, "figma-variables.json");
const themePath = path.join(root, "theme.css");

function linesFromB64(file) {
  return Buffer.from(fs.readFileSync(file, "utf8").trim(), "base64")
    .toString("utf8")
    .split("\n")
    .filter(Boolean);
}

function parsePrim(lines) {
  return lines.map((line) => {
    const i = line.indexOf("\t");
    return { name: line.slice(0, i), css: line.slice(i + 1) };
  });
}

function parseSem(lines) {
  return lines.map((line) => {
    const i = line.indexOf("\t");
    return { name: line.slice(0, i), aliasTo: line.slice(i + 1) };
  });
}

const primLines = linesFromB64(path.join(dir, "prim.b64"));
const semText = [0, 1, 2, 3]
  .map((i) =>
    Buffer.from(
      fs.readFileSync(path.join(dir, `sem-chunk-${i}.b64`), "utf8").trim(),
      "base64"
    ).toString("utf8")
  )
  .join("\n");
const semLines = semText.split("\n").filter(Boolean);

const primitives = parsePrim(primLines);
const semantics = parseSem(semLines);

const oldJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const oldTheme = fs.readFileSync(themePath, "utf8");
const exportedAt = new Date().toISOString().slice(0, 10);

const oldPrim = new Map(oldJson["01 Primitives"].variables.map((v) => [v.name, v.css]));
const oldSem = new Map(
  oldJson["02 Semantic"].variables.map((v) => [v.name, v.aliasTo])
);

const newPrimNames = new Set();
const changedPrim = [];
for (const p of primitives) {
  newPrimNames.add(p.name);
  const prev = oldPrim.get(p.name);
  if (prev === undefined) changedPrim.push({ kind: "added", ...p });
  else if (prev !== p.css) changedPrim.push({ kind: "changed", ...p, was: prev });
}

const removedPrim = [...oldPrim.keys()].filter((n) => !newPrimNames.has(n));

const newSemNames = new Set();
const changedSem = [];
for (const s of semantics) {
  newSemNames.add(s.name);
  const prev = oldSem.get(s.name);
  if (prev === undefined) changedSem.push({ kind: "added", ...s });
  else if (prev !== s.aliasTo) changedSem.push({ kind: "changed", ...s, was: prev });
}

const removedSem = [...oldSem.keys()].filter((n) => !newSemNames.has(n));

const nextJson = {
  ...oldJson,
  source: "Figma MCP export — 01 Primitives (Value) + 02 Semantic (Default)",
  exportedAt,
  "01 Primitives": { mode: "Value", variables: primitives },
  "02 Semantic": {
    ...(oldJson["02 Semantic"] ?? {}),
    mode: "Default",
    modes: oldJson["02 Semantic"]?.modes ?? ["Default", "CAM88"],
    variables: semantics,
  },
};

fs.writeFileSync(jsonPath, JSON.stringify(nextJson, null, 2) + "\n");

const oldCssVars = new Set(
  [...oldTheme.matchAll(/^  (--[\w-]+):/gm)].map((m) => m[1])
);

execSync("node generate-theme-css.mjs", { cwd: root, stdio: "inherit" });

const newTheme = fs.readFileSync(themePath, "utf8");
const addedCssVars = [...newTheme.matchAll(/^  (--[\w-]+):/gm)]
  .map((m) => m[1])
  .filter((n) => !oldCssVars.has(n));
const removedCssVars = [...oldCssVars].filter(
  (n) => ![...newTheme.matchAll(/^  (--[\w-]+):/gm)].some((m) => m[1] === n)
);

console.log("\n--- Delta summary ---");
console.log(`Exported: ${exportedAt}`);
console.log(
  `Primitives: ${oldPrim.size} → ${primitives.length} (+${changedPrim.filter((c) => c.kind === "added").length} new, ${changedPrim.filter((c) => c.kind === "changed").length} changed, ${removedPrim.length} removed)`
);
console.log(
  `Semantics: ${oldSem.size} → ${semantics.length} (+${changedSem.filter((c) => c.kind === "added").length} new, ${changedSem.filter((c) => c.kind === "changed").length} changed, ${removedSem.length} removed)`
);
console.log(`CSS variables added: ${addedCssVars.length}`);

if (changedPrim.length) {
  console.log("\nPrimitive changes:");
  for (const p of changedPrim) {
    if (p.kind === "added") console.log(`  + ${p.name} → ${p.css}`);
    else console.log(`  ~ ${p.name}: ${p.was} → ${p.css}`);
  }
}
if (removedPrim.length) {
  console.log("\nPrimitives removed:");
  removedPrim.forEach((n) => console.log(`  - ${n} (${oldPrim.get(n)})`));
}
if (changedSem.length) {
  console.log("\nSemantic changes:");
  for (const s of changedSem) {
    if (s.kind === "added") console.log(`  + ${s.name} → ${s.aliasTo}`);
    else console.log(`  ~ ${s.name}: ${s.was} → ${s.aliasTo}`);
  }
}
if (removedSem.length) {
  console.log("\nSemantics removed:");
  removedSem.forEach((n) => console.log(`  - ${n} (${oldSem.get(n)})`));
}
if (addedCssVars.length) {
  console.log("\nNew CSS custom properties:");
  addedCssVars.sort().forEach((v) => console.log(`  ${v}`));
}

if (
  !changedPrim.length &&
  !removedPrim.length &&
  !changedSem.length &&
  !removedSem.length
) {
  console.log("\nNo changes — theme.css format unchanged.");
}
