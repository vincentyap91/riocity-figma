/**
 * Generates theme.css from figma-variables.json (Figma 01 Primitives + 02 Semantic).
 *
 * Naming (matches legacy theme.css):
 *   --mono-*, --brand-*, --accent-*, --support-*, --overlay-*  → raw palette
 *   --color-*  → semantic roles; always var(--mono-*) / var(--brand-*) / …
 *   Gradients:  Figma color/gradient/.../start+end pairs → --color-gradient-*
 *               as linear-gradient(90deg, var(--start) 0%, var(--end) 100%)
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
  if (name.startsWith("raw-gradient/")) return 5;
  if (name.startsWith("vip/")) return 6;
  return 7;
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
const semanticByFigmaName = new Map(semantics.map((s) => [s.name, s]));

/** Resolve semantic → semantic → … → primitive (Figma alias chains) */
function resolveToPrimitive(figmaName, depth = 0) {
  if (!figmaName || depth > 16) return null;
  if (primitiveByFigmaName.has(figmaName)) return figmaName;
  const sem = semanticByFigmaName.get(figmaName);
  if (!sem?.aliasTo) return null;
  return resolveToPrimitive(sem.aliasTo, depth + 1);
}

const semanticGroupOrder = [
  "text",
  "surface",
  "primary",
  "border",
  "accent",
  "button",
  "popup",
  "progress",
  "success",
  "danger",
  "error",
  "warning",
  "overlay",
  "muted",
  "info",
  "effect",
  "gradient",
  "vip",
  "table",
  "icon",
  "transparent",
];

/** `color/gradient/home/card/start` → `home/card`; table highlight → `table` */
function gradientPath(figmaName) {
  let m = figmaName.match(/^color\/gradient\/(.+)\/(start|end)$/);
  if (m) return m[1];
  if (/^color\/table\/highlight\/(start|end)$/.test(figmaName)) return "table";
  return null;
}

/** `home/card` → `--color-gradient-home-card` */
function gradientCssVar(path) {
  return `--color-gradient-${path.replace(/\//g, "-")}`;
}

function isGradientStop(figmaName) {
  return (
    /^color\/gradient\/.+\/(start|end)$/.test(figmaName) ||
    /^color\/table\/highlight\/(start|end)$/.test(figmaName)
  );
}

function semanticGroup(name) {
  if (name.startsWith("color/gradient/")) return "gradient";
  if (name.startsWith("color/vip/")) return "vip";
  if (name.startsWith("color/table/")) return "table";
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

const flatSemantics = semantics.filter((v) => !isGradientStop(v.name));
const sortedSemantics = [...flatSemantics].sort(sortSemantics);

/** Build composite linear-gradient tokens from start/end pairs */
function buildGradientTokens() {
  const byPath = new Map();
  for (const v of semantics) {
    const path = gradientPath(v.name);
    if (!path) continue;
    const role = v.name.endsWith("/start") ? "start" : "end";
    if (!byPath.has(path)) byPath.set(path, {});
    byPath.get(path)[role] = v;
  }

  const entries = [];
  for (const [path, pair] of byPath) {
    if (!pair.start?.aliasTo || !pair.end?.aliasTo) {
      entries.push({
        cssVar: gradientCssVar(path),
        error: `missing start/end for color/gradient/${path}`,
      });
      continue;
    }
    const startPrim = resolveToPrimitive(pair.start.aliasTo);
    const endPrim = resolveToPrimitive(pair.end.aliasTo);
    if (!startPrim || !endPrim) {
      entries.push({
        cssVar: gradientCssVar(path),
        error: `missing primitive for color/gradient/${path} (${pair.start.aliasTo} → ${pair.end.aliasTo})`,
      });
      continue;
    }
    const startVar = legacyVarName(startPrim);
    const endVar = legacyVarName(endPrim);
    entries.push({
      cssVar: gradientCssVar(path),
      value: `linear-gradient(90deg, var(${startVar}) 0%, var(${endVar}) 100%)`,
    });
  }

  return entries.sort((a, b) => a.cssVar.localeCompare(b.cssVar));
}

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
    g === "mono"
      ? "mono"
      : g === "Surface"
        ? "Surface"
        : g === "raw-gradient"
          ? "raw-gradient"
          : g === "vip"
            ? "vip"
            : g;
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
  const primName = resolveToPrimitive(v.aliasTo);
  if (!primName) {
    css += `  /* missing primitive: ${v.name} → ${v.aliasTo} */\n`;
    continue;
  }
  const primVar = legacyVarName(primName);
  css += `  ${semVar}: var(${primVar});\n`;
}

const gradientTokens = buildGradientTokens();
if (gradientTokens.length) {
  if (lastSemGroup) css += "\n";
  css += "  /* gradient */\n";
  const pad = Math.max(...gradientTokens.map((g) => g.cssVar.length));
  for (const g of gradientTokens) {
    if (g.error) {
      css += `  /* ${g.error} */\n`;
      continue;
    }
    const gap = " ".repeat(Math.max(1, pad - g.cssVar.length + 1));
    css += `  ${g.cssVar}:${gap}${g.value};\n`;
  }
}

css += "}\n";

fs.writeFileSync(outPath, css);
const gradientCount = gradientTokens.filter((g) => !g.error).length;
console.log(
  `Wrote ${outPath} — ${primitives.length} primitives, ${sortedSemantics.length} flat semantics, ${gradientCount} gradient composites`
);
