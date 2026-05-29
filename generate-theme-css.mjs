/**
 * Generates theme.css from figma-variables.json (Figma 01 Primitives + 02 Semantic).
 *
 * Naming (matches legacy theme.css):
 *   --mono-*, --brand-*, --accent-*, --support-*, --overlay-*  → raw palette
 *   --color-*  → semantic roles; always var(--mono-*) / var(--brand-*) / …
 *   Gradients:  Figma color/gradient/.../start+end pairs → --color-gradient-*
 *               as linear-gradient(90deg, var(--start) 0%, var(--end) 100%)
 *
 * Regenerate:
 *   node generate-theme-css.mjs           → theme.css (Default)
 *   node generate-theme-css.mjs --cam88   → theme-cam88.css (CAM88)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "figma-variables.json");

const profiles = {
  default: {
    outFile: "theme.css",
    semanticKey: "02 Semantic",
    semMode: "Default",
    selectors: ':root,\n[data-theme="default"]',
    fileLabel: "theme.css",
  },
  cam88: {
    outFile: "theme-cam88.css",
    semanticKey: "02 Semantic CAM88",
    semMode: "CAM88",
    selectors: '[data-theme="cam88"]',
    fileLabel: "theme-cam88.css",
  },
};

const activeProfiles = process.argv.includes("--cam88")
  ? process.argv.includes("--default")
    ? ["default", "cam88"]
    : ["cam88"]
  : ["default"];

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
const primMode = data["01 Primitives"].mode ?? "Value";
const exportedAt = data.exportedAt ?? "unknown";
const primitiveByFigmaName = new Map(primitives.map((p) => [p.name, p]));

/** Resolve semantic → semantic → … → primitive (Figma alias chains) */
function resolveToPrimitive(figmaName, semanticByFigmaName, depth = 0) {
  if (!figmaName || depth > 16) return null;
  if (primitiveByFigmaName.has(figmaName)) return figmaName;
  const sem = semanticByFigmaName.get(figmaName);
  if (!sem?.aliasTo) return null;
  return resolveToPrimitive(sem.aliasTo, semanticByFigmaName, depth + 1);
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

/** Build composite linear-gradient tokens from start/end pairs */
function buildGradientTokens(semantics, semanticByFigmaName) {
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
    const startPrim = resolveToPrimitive(pair.start.aliasTo, semanticByFigmaName);
    const endPrim = resolveToPrimitive(pair.end.aliasTo, semanticByFigmaName);
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

function generateThemeCss(profile) {
  const semantics = [...data[profile.semanticKey].variables].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const semanticByFigmaName = new Map(semantics.map((s) => [s.name, s]));
  const flatSemantics = semantics.filter((v) => !isGradientStop(v.name));
  const sortedSemantics = [...flatSemantics].sort(sortSemantics);
  const gradientTokens = buildGradientTokens(semantics, semanticByFigmaName);

  let css = "";
  css += "/**\n";
  css += ` * ${profile.fileLabel} — design tokens from Figma\n`;
  css += ` * Exported: ${exportedAt} | Primitives: ${primMode} | Semantic: ${profile.semMode}\n`;
  css += " *\n";
  css += " * Palette (raw):  --mono-*, --brand-*, --accent-*, --support-*, --overlay-*\n";
  css += " * UI (semantic):  --color-*  →  var(--mono-*) / var(--brand-*) / …\n";
  css += " *\n";
  css += " *   background: var(--color-surface);\n";
  css += " *   color:      var(--color-text-primary);\n";
  css += " *   border:     var(--color-border);\n";
  css += " *   CTA:        var(--color-primary);\n";
  css += " *\n";
  css += " * Regenerate: node generate-theme-css.mjs";
  if (profile.semMode !== "Default") css += ` --${profile.semMode.toLowerCase()}`;
  css += "\n";
  css += " */\n\n";

  css += `${profile.selectors} {\n`;

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
    const primName = resolveToPrimitive(v.aliasTo, semanticByFigmaName);
    if (!primName) {
      css += `  /* missing primitive: ${v.name} → ${v.aliasTo} */\n`;
      continue;
    }
    const primVar = legacyVarName(primName);
    css += `  ${semVar}: var(${primVar});\n`;
  }

  if (gradientTokens.length) {
    if (lastSemGroup) css += "\n";
    css += "  /* gradient */\n";
    const pad = Math.max(...gradientTokens.map((g) => g.cssVar.length));
    let tableGradientVar = null;
    for (const g of gradientTokens) {
      if (g.error) {
        css += `  /* ${g.error} */\n`;
        continue;
      }
      const gap = " ".repeat(Math.max(1, pad - g.cssVar.length + 1));
      css += `  ${g.cssVar}:${gap}${g.value};\n`;
      if (g.cssVar === "--color-gradient-table") tableGradientVar = g.cssVar;
    }

    if (tableGradientVar) {
      css += "\n  /* table */\n";
      css += `  --color-table-highlight: var(${tableGradientVar});\n`;
    }
  }

  css += "}\n";

  const outPath = path.join(__dirname, profile.outFile);
  fs.writeFileSync(outPath, css);
  const gradientCount = gradientTokens.filter((g) => !g.error).length;
  console.log(
    `Wrote ${outPath} — ${primitives.length} primitives, ${sortedSemantics.length} flat semantics, ${gradientCount} gradient composites`
  );
}

for (const key of activeProfiles) {
  generateThemeCss(profiles[key]);
}
