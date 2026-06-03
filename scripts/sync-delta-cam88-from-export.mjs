/**
 * Merge live CAM88 export chunks → figma-variables.json, regenerate theme-cam88.css, print deltas.
 * Usage: node scripts/sync-delta-cam88-from-export.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "..");
const jsonPath = path.join(root, "figma-variables.json");
const themePath = path.join(root, "theme-cam88.css");

function parseSemFromChunks(prefix) {
  const text = [0, 1, 2, 3]
    .map((i) =>
      Buffer.from(
        fs.readFileSync(path.join(dir, `${prefix}-chunk-${i}.b64`), "utf8").trim(),
        "base64"
      ).toString("utf8")
    )
    .join("\n");
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("\t");
      return { name: line.slice(0, i), aliasTo: line.slice(i + 1) };
    });
}

const semantics = parseSemFromChunks("cam88-sem");
const oldJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const oldTheme = fs.readFileSync(themePath, "utf8");
const exportedAt = new Date().toISOString().slice(0, 10);

const oldSem = new Map(
  (oldJson["02 Semantic CAM88"]?.variables ?? []).map((v) => [v.name, v.aliasTo])
);

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
  exportedAt,
  "02 Semantic CAM88": {
    mode: "CAM88",
    variables: semantics,
  },
};

fs.writeFileSync(jsonPath, JSON.stringify(nextJson, null, 2) + "\n");

const oldCssVars = new Set(
  [...oldTheme.matchAll(/^  (--[\w-]+):/gm)].map((m) => m[1])
);

execSync("node generate-theme-css.mjs --cam88", { cwd: root, stdio: "inherit" });

const newTheme = fs.readFileSync(themePath, "utf8");
const addedCssVars = [...newTheme.matchAll(/^  (--[\w-]+):/gm)]
  .map((m) => m[1])
  .filter((n) => !oldCssVars.has(n));

console.log("\n--- CAM88 delta summary ---");
console.log(`Exported: ${exportedAt}`);
console.log(
  `CAM88 semantics: ${oldSem.size} → ${semantics.length} (+${changedSem.filter((c) => c.kind === "added").length} new, ${changedSem.filter((c) => c.kind === "changed").length} changed, ${removedSem.length} removed)`
);
console.log(`CSS variables added: ${addedCssVars.length}`);

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
if (!changedSem.length && !removedSem.length) {
  console.log("\nNo CAM88 changes — theme-cam88.css format unchanged.");
}
