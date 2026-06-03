/**
 * Audit theme.css vs theme-cam88.css against figma-variables.json and report gaps.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "figma-variables.json"), "utf8"));

function figmaToCss(name) {
  return `--${name.replace(/\//g, "-")}`;
}

function isGradientStop(name) {
  return (
    /^color\/gradient\/.+\/(start|end)$/.test(name) ||
    /^color\/table\/highlight\/(start|end)$/.test(name)
  );
}

function gradientPath(name) {
  let m = name.match(/^color\/gradient\/(.+)\/(start|end)$/);
  if (m) return m[1];
  if (/^color\/table\/highlight\/(start|end)$/.test(name)) return "table";
  return null;
}

function expectedCssFromJson(semantics) {
  const flat = semantics.filter((v) => !isGradientStop(v.name));
  const css = flat.map((v) => figmaToCss(v.name));

  const byPath = new Map();
  for (const v of semantics) {
    const p = gradientPath(v.name);
    if (!p) continue;
    const role = v.name.endsWith("/start") ? "start" : "end";
    if (!byPath.has(p)) byPath.set(p, {});
    byPath.get(p)[role] = v;
  }
  for (const p of byPath.keys()) {
    const pair = byPath.get(p);
    if (pair.start && pair.end) css.push(`--color-gradient-${p.replace(/\//g, "-")}`);
  }
  const hasTable = byPath.has("table") && byPath.get("table").start && byPath.get("table").end;
  if (hasTable) css.push("--color-table-highlight");
  return css.sort();
}

function cssVarsInFile(file) {
  const t = fs.readFileSync(path.join(root, file), "utf8");
  return [...t.matchAll(/^  (--[\w-]+):/gm)].map((m) => m[1]).sort();
}

const defSem = data["02 Semantic"].variables;
const camSem = data["02 Semantic CAM88"].variables;
const prim = data["01 Primitives"].variables;

const expDefSem = expectedCssFromJson(defSem);
const expCamSem = expectedCssFromJson(camSem);
const expPrim = prim.map((p) => figmaToCss(p.name));

const actDef = cssVarsInFile("theme.css");
const actCam = cssVarsInFile("theme-cam88.css");

const actDefSem = actDef.filter((v) => v.startsWith("--color-"));
const actCamSem = actCam.filter((v) => v.startsWith("--color-"));
const actDefPrim = actDef.filter((v) => !v.startsWith("--color-"));
const actCamPrim = actCam.filter((v) => !v.startsWith("--color-"));

function diff(expected, actual, label) {
  const exp = new Set(expected);
  const act = new Set(actual);
  const missing = expected.filter((v) => !act.has(v));
  const extra = actual.filter((v) => !exp.has(v));
  console.log(`\n=== ${label} ===`);
  console.log(`expected ${expected.length}, actual ${actual.length}`);
  if (missing.length) {
    console.log(`MISSING (${missing.length}):`);
    missing.forEach((v) => console.log(`  ${v}`));
  }
  if (extra.length) {
    console.log(`EXTRA (${extra.length}):`);
    extra.forEach((v) => console.log(`  ${v}`));
  }
  if (!missing.length && !extra.length) console.log("OK — matches JSON");
  return missing;
}

diff(expPrim, actDefPrim, "theme.css primitives");
diff(expDefSem, actDefSem, "theme.css semantics");
diff(expPrim, actCamPrim, "theme-cam88.css primitives");
diff(expCamSem, actCamSem, "theme-cam88.css semantics");

const defNames = new Set(defSem.map((v) => v.name));
const camNames = new Set(camSem.map((v) => v.name));
console.log("\n=== JSON Default vs CAM88 semantic names ===");
const defaultOnly = [...defNames].filter((n) => !camNames.has(n));
const camOnly = [...camNames].filter((n) => !defNames.has(n));
console.log("Default only (no CAM88 mode in Figma):", defaultOnly);
console.log("CAM88 only:", camOnly);

const defSemCss = new Set(expDefSem);
const camSemCss = new Set(expCamSem);
const cssDefaultOnly = expDefSem.filter((v) => !camSemCss.has(v));
const cssCamOnly = expCamSem.filter((v) => !defSemCss.has(v));
console.log("\n=== Expected CSS semantic vars (from JSON) ===");
console.log("In theme.css not theme-cam88.css:", cssDefaultOnly);
console.log("In theme-cam88.css not theme.css:", cssCamOnly);
