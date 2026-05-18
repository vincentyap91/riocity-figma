/**
 * Generates theme.css from figma-variables.json (Figma 01 Primitives + 02 Semantic).
 * Refresh figma-variables.json from Figma MCP export, then run:
 *   node generate-theme-css.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "figma-variables.json");
const outPath = path.join(__dirname, "theme.css");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

/** Figma `mono/400` → CSS custom property name `mono-400` */
function figmaToCssName(figmaName) {
  return figmaName.replace(/\//g, "-");
}

function groupOrder(name) {
  if (name.startsWith("mono/")) return 0;
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

const primitives = [...data["01 Primitives"].variables].sort((a, b) => {
  const ga = groupOrder(a.name);
  const gb = groupOrder(b.name);
  if (ga !== gb) return ga - gb;
  if (ga === 0) return monoSortKey(a.name) - monoSortKey(b.name);
  return a.name.localeCompare(b.name);
});

const semantics = [...data["02 Semantic"].variables].sort((a, b) =>
  a.name.localeCompare(b.name)
);

const primMode = data["01 Primitives"].mode;
const semMode = data["02 Semantic"].mode;

let css = "";
css += "/**\n";
css += " * Theme CSS generated from figma-variables.json\n";
css += ` * Figma: 01 Primitives (${primMode}) + 02 Semantic (${semMode})\n`;
css += " * Regenerate: node generate-theme-css.mjs\n";
css += " */\n\n";

css += ":root {\n";
css += "  /* 01 Primitives — resolved values */\n";
let lastGroup = "";
for (const v of primitives) {
  const g = v.name.split("/")[0];
  if (g !== lastGroup) {
    if (lastGroup) css += "\n";
    css += `  /* ${g} */\n`;
    lastGroup = g;
  }
  css += `  --${figmaToCssName(v.name)}: ${v.css};\n`;
}

css += "\n  /* 02 Semantic — alias primitives only */\n";
for (const v of semantics) {
  const aliasVar = `--${figmaToCssName(v.aliasTo)}`;
  css += `  --${figmaToCssName(v.name)}: var(${aliasVar});\n`;
}
css += "}\n";

fs.writeFileSync(outPath, css);
console.log("Wrote", outPath);
