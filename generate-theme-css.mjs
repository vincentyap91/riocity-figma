/**
 * Generates theme.css from figma-variables.json (Figma 01 Primitives + 02 Semantic).
 *
 * Architecture:
 *   --primitive-*  resolved raw values (01 Primitives) — do not use in components
 *   --color-*      semantic roles (02 Semantic) — use these in UI code
 *   --{group}-*    legacy aliases → primitives (optional migration)
 *
 * Refresh figma-variables.json from Figma (use_figma export), then:
 *   node generate-theme-css.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "figma-variables.json");
const outPath = path.join(__dirname, "theme.css");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

/** Figma `mono/400` → `mono-400` */
function figmaToLegacyName(figmaName) {
  return figmaName.replace(/\//g, "-");
}

/** Figma `mono/400` → `primitive-mono-400` */
function figmaToPrimitiveName(figmaName) {
  const legacy = figmaToLegacyName(figmaName);
  if (legacy.startsWith("Surface-")) {
    return `primitive-surface-${legacy.slice("Surface-".length).toLowerCase()}`;
  }
  return `primitive-${legacy}`;
}

/** Figma `color/text/primary` → `color-text-primary` */
function figmaToSemanticName(figmaName) {
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

const primitiveByFigmaName = new Map(
  primitives.map((p) => [p.name, p])
);

let css = "";
css += "/**\n";
css += " * Design tokens — generated from Figma Variables\n";
css += ` * Source: figma-variables.json (exported ${exportedAt})\n`;
css += ` * Figma collections: 01 Primitives (${primMode}), 02 Semantic (${semModes.join(", ")})\n`;
css += " *\n";
css += " * Usage in application code:\n";
css += " *   Use --color-* only (semantic layer). Never hardcode hex in components.\n";
css += " *   --primitive-* are raw values for theme authoring / debugging only.\n";
css += " *\n";
css += " * Regenerate: node generate-theme-css.mjs\n";
css += " */\n\n";

css += "/* =============================================================================\n";
css += "   Default theme (Figma mode: " + semMode + ")\n";
css += "   Future: duplicate block under [data-theme=\"brand\"] when multi-mode export exists\n";
css += "   ============================================================================= */\n\n";

css += ":root,\n";
css += '[data-theme="default"] {\n';

css += "  /* ---------------------------------------------------------------------------\n";
css += "     01 Primitives — resolved values (hidden in Figma pickers)\n";
css += "     Map: Figma mono/* ≈ neutral scale, brand/*, accent/*, support/*, overlay/*\n";
css += "     --------------------------------------------------------------------------- */\n";

let lastGroup = "";
for (const v of primitives) {
  const parts = v.name.split("/");
  const g = parts.length > 1 ? parts[0] : v.name.split("-")[0];
  const groupLabel =
    g === "mono"
      ? "neutral (mono)"
      : g === "Surface"
        ? "surface"
        : g;
  if (groupLabel !== lastGroup) {
    if (lastGroup) css += "\n";
    css += `  /* ${groupLabel} */\n`;
    lastGroup = groupLabel;
  }
  const primVar = `--${figmaToPrimitiveName(v.name)}`;
  css += `  ${primVar}: ${v.css};\n`;
}

css += "\n  /* ---------------------------------------------------------------------------\n";
css += "     02 Semantic — role tokens (bind UI to these)\n";
css += "     Each aliases a primitive via var(--primitive-*)\n";
css += "     --------------------------------------------------------------------------- */\n";

let lastSemGroup = "";
for (const v of semantics) {
  const top = v.name.split("/")[1] ?? "misc";
  if (top !== lastSemGroup) {
    if (lastSemGroup) css += "\n";
    css += `  /* ${top} */\n`;
    lastSemGroup = top;
  }
  const semVar = `--${figmaToSemanticName(v.name)}`;
  const aliasPrim = v.aliasTo
    ? `--${figmaToPrimitiveName(v.aliasTo)}`
    : null;
  if (!aliasPrim || !primitiveByFigmaName.has(v.aliasTo)) {
    css += `  /* WARN: missing primitive for ${v.name} → ${v.aliasTo} */\n`;
    continue;
  }
  css += `  ${semVar}: var(${aliasPrim});\n`;
}

css += "}\n\n";

css += "/* ---------------------------------------------------------------------------\n";
css += "   Legacy primitive aliases (Figma slash names as flat CSS vars)\n";
css += "   Prefer --color-* in new code; these ease migration from older theme.css\n";
css += "   --------------------------------------------------------------------------- */\n\n";

css += ":root {\n";
lastGroup = "";
for (const v of primitives) {
  const g = v.name.split("/")[0];
  if (g !== lastGroup) {
    if (lastGroup) css += "\n";
    css += `  /* ${g} */\n`;
    lastGroup = g;
  }
  const legacy = `--${figmaToLegacyName(v.name)}`;
  const primVar = `--${figmaToPrimitiveName(v.name)}`;
  css += `  ${legacy}: var(${primVar});\n`;
}
css += "}\n\n";

css += "/* ---------------------------------------------------------------------------\n";
css += "   Placeholder: light theme / additional brand modes\n";
css += "   Export additional Figma modes to figma-variables.json, then extend generator.\n";
css += "   Example:\n";
css += '   [data-theme="light"] { --color-surface: #ffffff; ... }\n';
css += "   --------------------------------------------------------------------------- */\n";

fs.writeFileSync(outPath, css);
console.log(
  `Wrote ${outPath} (${primitives.length} primitives, ${semantics.length} semantics)`
);
