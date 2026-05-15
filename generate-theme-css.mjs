/**
 * One-off / repeatable: reads export-done.json, writes theme.css
 * Run: node riocity-figma/generate-theme-css.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "export-done.json");
const outPath = path.join(__dirname, "theme.css");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

/** Walk token tree under modes.Value and collect --name -> hex */
function flattenPrimitives(obj) {
  /** @type {Record<string, string>} */
  const out = {};
  function walk(node) {
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$")) continue;
      if (v && typeof v === "object" && v.$type === "color" && typeof v.$value === "string") {
        const web = v.$codeSyntax?.WEB;
        const m = typeof web === "string" ? web.match(/var\(--([^)]+)\)/) : null;
        const name = m ? m[1] : null;
        if (name) out[name] = v.$value;
      } else if (v && typeof v === "object") {
        walk(v);
      }
    }
  }
  walk(obj);
  return out;
}

/** `{brand.pulse}` -> `var(--brand-pulse)` */
function refToVar(ref) {
  if (typeof ref !== "string" || !ref.startsWith("{") || !ref.endsWith("}")) return null;
  const inner = ref.slice(1, -1);
  const primitiveName = inner.replace(/\./g, "-");
  return `var(--${readableRawAliases[primitiveName] ?? primitiveName})`;
}

function extractSemanticVarName(entry) {
  const web = entry?.$codeSyntax?.WEB;
  const m = typeof web === "string" ? web.match(/var\(--([^)]+)\)/) : null;
  return m ? m[1] : null;
}

const primBlock = data.find((x) => x["01 Primitives"]);
const semBlock = data.find((x) => x["02 Semantic"]);
if (!primBlock || !semBlock) throw new Error("Missing 01 Primitives or 02 Semantic in JSON");

const primitives = flattenPrimitives(primBlock["01 Primitives"].modes.Value);
const semanticModes = semBlock["02 Semantic"].modes;

// Intent/source CSS aliases for the raw palette.
// These avoid color names while staying readable for theme work.
// The original Figma primitive variable names stay available for compatibility.
const readableRawAliases = {
  "accent-jackpot-500": "raw-prize-highlight",
  "accent-link-500": "raw-link-standard",
  "accent-promo-400": "raw-promo-highlight",
  "accent-trace": "raw-border-highlight",
  "accord-core": "raw-brand-cam",
  "base-ink": "raw-foundation-ink",
  "base-paper": "raw-foundation-paper",
  "brand-pulse": "raw-brand-rio",
  "brand-strike": "raw-brand-kh",
  "depth-800": "raw-surface-kh-raised",
  "depth-840": "raw-surface-cam-raised",
  "depth-900": "raw-surface-kh-base",
  "depth-920": "raw-surface-cam-base",
  "mono-220": "raw-utility-soft",
  "mono-300": "raw-utility-subtle",
  "mono-500": "raw-text-muted",
  "mono-650": "raw-border-kh",
  "mono-700": "raw-border-rio",
  "mono-800": "raw-surface-rio-raised",
  "partner-mark": "raw-partner-mark",
  "signal-500": "raw-surface-leng-raised",
  "signal-600": "raw-brand-leng",
  "signal-700": "raw-border-leng",
  "signal-900": "raw-surface-leng-base",
  "signal-peak": "raw-action-leng-peak",
  "state-caution": "raw-alert-caution",
  "state-danger-soft": "raw-alert-soft",
  "state-promo": "raw-promo-strong",
  "state-promo-muted": "raw-promo-muted",
  "state-success": "raw-status-success",
  "tone-subtle": "raw-text-subtle",
  "wash-400": "raw-wash-soft",
};

const themeAttr = {
  RioCity9: "rio-city9",
  KH168: "kh168",
  CAM88: "cam88",
  Leng855: "leng855",
};

const activeModeName = "RioCity9";
const activeModeAttr = themeAttr[activeModeName];
const activeMode = semanticModes[activeModeName];
if (!activeMode) throw new Error(`Missing ${activeModeName} semantic mode`);

const activeRawNames = new Set();
for (const entry of Object.values(activeMode)) {
  if (!entry || typeof entry !== "object" || entry.$type !== "color") continue;
  const ref = entry.$value;
  if (typeof ref !== "string" || !ref.startsWith("{") || !ref.endsWith("}")) continue;
  const primitiveName = ref.slice(1, -1).replace(/\./g, "-");
  activeRawNames.add(readableRawAliases[primitiveName] ?? primitiveName);
}

let css = "";
css += "/**\n";
css += " * Theme CSS generated from export-done.json\n";
css += " * Scope: RioCity9 first pass only\n";
css += " * Future theme modes will be added after this theme is cleaned up\n";
css += " */\n\n";

css += ":root {\n";
css += "  /* Raw palette - RioCity9 tokens only, intent/source names, no color words */\n";
const emittedRawNames = new Set();
for (const [sourceName, aliasName] of Object.entries(readableRawAliases).sort((a, b) => a[1].localeCompare(b[1]))) {
  if (!activeRawNames.has(aliasName)) continue;
  const value = primitives[sourceName] ?? primitives[aliasName];
  if (!value) continue;
  css += `  --${aliasName}: ${value};\n`;
  emittedRawNames.add(aliasName);
}
css += "\n";
css += "  /* Original Figma primitive names - RioCity9 compatibility aliases */\n";
for (const [sourceName, aliasName] of Object.entries(readableRawAliases).sort()) {
  if (!emittedRawNames.has(aliasName)) continue;
  if (!primitives[sourceName] && !primitives[aliasName]) continue;
  css += `  --${sourceName}: var(--${aliasName});\n`;
}
css += "\n";
css += "  /* 02 Semantic - RioCity9 default */\n";
for (const entry of Object.values(activeMode)) {
  if (!entry || typeof entry !== "object" || entry.$type !== "color") continue;
  const semName = extractSemanticVarName(entry);
  const primitiveVar = refToVar(entry.$value);
  if (!semName || !primitiveVar) continue;
  css += `  --${semName}: ${primitiveVar};\n`;
}
css += "}\n\n";

css += `/* 02 Semantic - explicit ${activeModeName} hook */\n`;
css += `[data-theme="${activeModeAttr}"] {\n`;
for (const entry of Object.values(activeMode)) {
  if (!entry || typeof entry !== "object" || entry.$type !== "color") continue;
  const semName = extractSemanticVarName(entry);
  const primitiveVar = refToVar(entry.$value);
  if (!semName || !primitiveVar) continue;
  css += `  --${semName}: ${primitiveVar};\n`;
}
css += "}\n";

fs.writeFileSync(outPath, css);
console.log("Wrote", outPath);
