import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const primB64 = fs.readFileSync(path.join(__dirname, "prim.b64"), "utf8").trim();
const semB64 = fs.readFileSync(path.join(__dirname, "sem.b64"), "utf8").trim();

function linesFromB64(b64) {
  return Buffer.from(b64, "base64").toString("utf8").split("\n");
}

const primLines = linesFromB64(primB64);
const semLines = linesFromB64(semB64);

const primitives = primLines.map((line) => {
  const i = line.indexOf("\t");
  return { name: line.slice(0, i), css: line.slice(i + 1) };
});
const semantics = semLines.map((line) => {
  const i = line.indexOf("\t");
  return { name: line.slice(0, i), aliasTo: line.slice(i + 1) };
});

const jsonPath = path.join(root, "figma-variables.json");
const themePath = path.join(root, "theme.css");
const oldJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const oldTheme = fs.readFileSync(themePath, "utf8");

const exportedAt = new Date().toISOString().slice(0, 10);
const nextJson = {
  source: "Figma MCP export — 01 Primitives (Value) + 02 Semantic (Default)",
  exportedAt,
  "01 Primitives": { mode: "Value", variables: primitives },
  "02 Semantic": {
    mode: "Default",
    modes: ["Default", "CAM88"],
    variables: semantics,
  },
};

fs.writeFileSync(jsonPath, JSON.stringify(nextJson, null, 2) + "\n");

const oldP = new Set(oldJson["01 Primitives"].variables.map((v) => v.name));
const oldS = new Set(oldJson["02 Semantic"].variables.map((v) => v.name));
const newP = primitives.filter((p) => !oldP.has(p.name));
const newS = semantics.filter((s) => !oldS.has(s.name));
const oldVars = new Set(
  [...oldTheme.matchAll(/^  (--[\w-]+):/gm)].map((m) => m[1])
);

execSync("node generate-theme-css.mjs", { cwd: root, stdio: "inherit" });

const newTheme = fs.readFileSync(themePath, "utf8");
const addedVars = [...newTheme.matchAll(/^  (--[\w-]+):/gm)]
  .map((m) => m[1])
  .filter((n) => !oldVars.has(n));

console.log(`Exported: ${exportedAt}`);
console.log(`Primitives: ${primitives.length} (+${newP.length} new)`);
console.log(`Semantics: ${semantics.length} (+${newS.length} new)`);
console.log(`New CSS custom properties: ${addedVars.length}`);
if (newP.length) {
  console.log("\nNew primitives:");
  newP.forEach((p) => console.log(`  ${p.name}`));
}
if (newS.length) {
  console.log("\nNew semantics:");
  newS.forEach((s) => console.log(`  ${s.name}`));
}
if (addedVars.length) {
  console.log("\nNew CSS variables:");
  addedVars.sort().forEach((v) => console.log(`  ${v}`));
}
