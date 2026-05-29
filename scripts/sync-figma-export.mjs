/**
 * Rebuild figma-variables.json from compact Figma export lines,
 * regenerate theme.css, and print only newly added tokens.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const compactPath = path.join(__dirname, "figma-export-compact.json");
const jsonPath = path.join(root, "figma-variables.json");
const themePath = path.join(root, "theme.css");
const oldJsonPath = path.join(root, "figma-variables.json");
const oldThemePath = path.join(root, "theme.css");

const compact = JSON.parse(fs.readFileSync(compactPath, "utf8"));
const oldJson = fs.existsSync(jsonPath)
  ? JSON.parse(fs.readFileSync(jsonPath, "utf8"))
  : null;
const oldTheme = fs.existsSync(themePath) ? fs.readFileSync(themePath, "utf8") : "";

const primitives = compact.primLines.map((line) => {
  const i = line.indexOf("\t");
  return { name: line.slice(0, i), css: line.slice(i + 1) };
});
const semantics = compact.semLines.map((line) => {
  const i = line.indexOf("\t");
  return { name: line.slice(0, i), aliasTo: line.slice(i + 1) };
});

const nextJson = {
  source: "Figma MCP export — 01 Primitives (Value) + 02 Semantic (Default)",
  exportedAt: compact.exportedAt,
  "01 Primitives": { mode: "Value", variables: primitives },
  "02 Semantic": {
    mode: "Default",
    modes: ["Default", "CAM88"],
    variables: semantics,
  },
};

fs.writeFileSync(jsonPath, JSON.stringify(nextJson, null, 2) + "\n");

const oldPrimNames = new Set(
  oldJson?.["01 Primitives"]?.variables?.map((v) => v.name) ?? []
);
const oldSemNames = new Set(
  oldJson?.["02 Semantic"]?.variables?.map((v) => v.name) ?? []
);
const newPrimitives = primitives.filter((p) => !oldPrimNames.has(p.name));
const newSemantics = semantics.filter((s) => !oldSemNames.has(s.name));

execSync("node generate-theme-css.mjs", { cwd: root, stdio: "inherit" });

const newTheme = fs.readFileSync(themePath, "utf8");
const oldCssVars = new Set(
  [...oldTheme.matchAll(/^  (--[\w-]+):/gm)].map((m) => m[1])
);
const addedCssVars = [...newTheme.matchAll(/^  (--[\w-]+):/gm)]
  .map((m) => m[1])
  .filter((name) => !oldCssVars.has(name));

console.log("\n--- Delta summary ---");
console.log(
  `Primitives: ${primitives.length} total (${newPrimitives.length} new)`
);
console.log(`Semantics: ${semantics.length} total (${newSemantics.length} new)`);
console.log(`CSS variables added: ${addedCssVars.length}`);

if (newPrimitives.length) {
  console.log("\nNew primitives:");
  for (const p of newPrimitives) console.log(`  ${p.name} → ${p.css}`);
}
if (newSemantics.length) {
  console.log("\nNew semantics:");
  for (const s of newSemantics)
    console.log(`  ${s.name} → ${s.aliasTo}`);
}
if (addedCssVars.length) {
  console.log("\nNew CSS custom properties:");
  for (const v of addedCssVars.sort()) console.log(`  ${v}`);
}
