/**
 * Generates theme.css from figma-variables.json (Figma 01 Primitives + 02 Semantic).
 *
 * Naming (matches legacy theme.css):
 *   --mono-*, --brand-*, --accent-*, --support-*, --overlay-*  → raw palette
 *   --color-*  → semantic roles; always var(--mono-*) / var(--brand-*) / …
 *
 * Regenerate: node generate-theme-css.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "figma-variables.json");
const outPath = path.join(__dirname, "theme.css");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

/** Figma `mono/400` → `--mono-400` (legacy flat name) */
function figmaToLegacyName(figmaName) {
  return figmaName.replace(/\//g, "-");
}

function legacyVarName(figmaName) {
  return `--${figmaToLegacyName(figmaName)}`;
}

/** Figma `color/text/primary` → `color-text-primary` */
function figmaToSemanticCssName(figmaName) {
  return figmaToLegacyName(figmaName);
}

function groupOrder(name) {
  if (name.startsWith("mono/")) return 0;
  if (name.startsWith("Surface/")) return 0;
  if (name.startsWith("brand/")) return 1;
  if (name.startsWith("accent/")) return 2;
  if (name.startsWith("support/")) return 3;
  if (name.startsWith("overlay/")) return 4;
  return 5;
}

function monoSortKey(name) {
  const m = name.match(/^mono\/(\d+)/);
  return m ? Number(m[1]) : 9999;
}

function sortPrimitives(a, b) {
  const ga = groupOrder(a.name);
  const gb = groupOrder(b.name);
  if (ga !== gb) return ga - gb;
  if (ga === 0 && a.name.startsWith("mono/")) {
    return monoSortKey(a.name) - monoSortKey(b.name);
  }
  return a.name.localeCompare(b.name);
}

const primitives = [...data["01 Primitives"].variables].sort(sortPrimitives);
const semantics = [...data["02 Semantic"].variables].sort((a, b) =>
  a.name.localeCompare(b.name)
);

const primMode = data["01 Primitives"].mode ?? "Value";
const semMode = data["02 Semantic"].mode ?? "Default";
const semModes = data["02 Semantic"].modes ?? [semMode];
const exportedAt = data.exportedAt ?? "unknown";

const primitiveByFigmaName = new Map(primitives.map((p) => [p.name, p]));

const semanticGroupOrder = [
  "text",
  "surface",
  "primary",
  "border",
  "accent",
  "button",
  "success",
  "danger",
  "error",
  "warning",
  "overlay",
  "muted",
  "info",
];

function semanticGroup(name) {
  return name.split("/")[1] ?? "misc";
}

function sortSemantics(a, b) {
  const ga = semanticGroupOrder.indexOf(semanticGroup(a.name));
  const gb = semanticGroupOrder.indexOf(semanticGroup(b.name));
  const orderA = ga === -1 ? 999 : ga;
  const orderB = gb === -1 ? 999 : gb;
  if (orderA !== orderB) return orderA - orderB;
  return a.name.localeCompare(b.name);
}

const sortedSemantics = [...semantics].sort(sortSemantics);

let css = "";
css += "/**\n";
css += " * theme.css — design tokens from Figma\n";
css += ` * Exported: ${exportedAt} | Primitives: ${primMode} | Semantic: ${semModes.join(", ")}\n`;
css += " *\n";
css += " * Palette (raw):  --mono-*, --brand-*, --accent-*, --support-*, --overlay-*\n";
css += " * UI (semantic):  --color-*  →  var(--mono-*) / var(--brand-*) / …\n";
css += " *\n";
css += " *   background: var(--color-surface);\n";
css += " *   color:      var(--color-text-primary);\n";
css += " *   border:     var(--color-border);\n";
css += " *   CTA:        var(--color-primary);\n";
css += " *\n";
css += " * Regenerate: node generate-theme-css.mjs\n";
css += " */\n\n";

css += ":root,\n";
css += '[data-theme="default"] {\n';

css += "  /* ---------------------------------------------------------------------------\n";
css += "     01 Primitives — resolved values\n";
css += "     --------------------------------------------------------------------------- */\n";

let lastGroup = "";
for (const v of primitives) {
  const parts = v.name.split("/");
  const g = parts.length > 1 ? parts[0] : v.name.split("-")[0];
  const groupLabel =
    g === "mono" ? "mono" : g === "Surface" ? "Surface" : g;
  if (groupLabel !== lastGroup) {
    if (lastGroup) css += "\n";
    css += `  /* ${groupLabel} */\n`;
    lastGroup = groupLabel;
  }
  css += `  ${legacyVarName(v.name)}: ${v.css};\n`;
}

css += "\n  /* ---------------------------------------------------------------------------\n";
css += "     02 Semantic — role tokens (use in application code)\n";
css += "     --------------------------------------------------------------------------- */\n";

let lastSemGroup = "";
for (const v of sortedSemantics) {
  const group = semanticGroup(v.name);
  if (group !== lastSemGroup) {
    if (lastSemGroup) css += "\n";
    css += `  /* ${group} */\n`;
    lastSemGroup = group;
  }
  const semVar = `--${figmaToSemanticCssName(v.name)}`;
  if (!v.aliasTo || !primitiveByFigmaName.has(v.aliasTo)) {
    css += `  /* missing primitive: ${v.name} → ${v.aliasTo} */\n`;
    continue;
  }
  const primVar = legacyVarName(v.aliasTo);
  css += `  ${semVar}: var(${primVar});\n`;
}

css += "}\n";

fs.writeFileSync(outPath, css);
console.log(
  `Wrote ${outPath} — legacy --mono/--brand names, ${sortedSemantics.length} --color-* aliases`
);
