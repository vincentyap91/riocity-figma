/**
 * Generate VARIABLES.md from figma-variables.json + theme.css gradient list.
 * Run: node scripts/generate-variables-doc.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = path.join(root, "figma-variables.json");
const themePath = path.join(root, "theme.css");
const outPath = path.join(root, "VARIABLES.md");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const themeCss = fs.readFileSync(themePath, "utf8");

function figmaToCssVar(figmaName) {
  return `--${figmaName.replace(/\//g, "-")}`;
}

function primGroup(name) {
  if (name.startsWith("mono/") || name.startsWith("Surface/")) return "mono";
  if (name.startsWith("brand/")) return "brand";
  if (name.startsWith("accent/")) return "accent";
  if (name.startsWith("support/")) return "support";
  if (name.startsWith("overlay/")) return "overlay";
  if (name.startsWith("raw-gradient/")) return "raw-gradient";
  if (name.startsWith("raw-") || name.startsWith("raw/")) return "raw";
  return "other";
}

function semGroup(name) {
  const parts = name.split("/");
  if (parts.length >= 3) return `${parts[0]}/${parts[1]}`;
  return parts[0];
}

const prim = data["01 Primitives"].variables;
const defSem = data["02 Semantic"].variables;
const camSem = data["02 Semantic CAM88"].variables;
const exportedAt = data.exportedAt ?? "unknown";

const defMap = new Map(defSem.map((v) => [v.name, v.aliasTo]));
const camMap = new Map(camSem.map((v) => [v.name, v.aliasTo]));

const gradientVars = [...themeCss.matchAll(/^\s+(--color-gradient-[^:]+):/gm)].map(
  (m) => m[1]
);

const primByGroup = {};
for (const p of prim) {
  const g = primGroup(p.name);
  (primByGroup[g] ??= []).push(p);
}

const semNames = [...new Set([...defMap.keys(), ...camMap.keys()])].sort();
const semByGroup = {};
for (const name of semNames) {
  const g = semGroup(name);
  (semByGroup[g] ??= []).push(name);
}

const lines = [];

lines.push("# Riocity 设计变量参考（CSS Custom Properties）");
lines.push("");
lines.push(`> 自动生成自 \`figma-variables.json\`，导出日期：**${exportedAt}**`);
lines.push(
  "> 重新生成：`node scripts/generate-variables-doc.mjs`（Figma 同步后建议重跑）"
);
lines.push(">");
lines.push(
  "> **命名与跨网站复用规则（手写、稳定）：** [VARIABLE-RULES.md](./VARIABLE-RULES.md)"
);
lines.push("");

lines.push("## 1. 在其他网页如何使用");
lines.push("");
lines.push("### 引入样式");
lines.push("");
lines.push("```html");
lines.push('<link rel="stylesheet" href="/path/to/theme.css" />');
lines.push('<link rel="stylesheet" href="/path/to/theme-cam88.css" />');
lines.push("```");
lines.push("");
lines.push("### 切换主题");
lines.push("");
lines.push("| Figma Mode | HTML `data-theme` | 样式文件 |");
lines.push("|------------|-------------------|----------|");
lines.push("| Default（RioCity9） | `default` 或省略 | `theme.css` |");
lines.push("| CAM88 | `cam88` | `theme-cam88.css` |");
lines.push("");
lines.push("```html");
lines.push('<!-- Default -->');
lines.push('<html data-theme="default">');
lines.push("");
lines.push('<!-- CAM88 -->');
lines.push('<html data-theme="cam88">');
lines.push("```");
lines.push("");
lines.push("### CSS 用法（推荐语义变量）");
lines.push("");
lines.push("```css");
lines.push(".card {");
lines.push("  background: var(--color-surface);");
lines.push("  color: var(--color-text-primary);");
lines.push("  border: 1px solid var(--color-border);");
lines.push("}");
lines.push("");
lines.push(".cta {");
lines.push("  background: var(--color-primary);");
lines.push("  color: var(--color-text-cta-inverse);");
lines.push("}");
lines.push("```");
lines.push("");
lines.push(
  "**原则：** 页面组件只引用 `--color-*` 语义变量，不要写死 hex。换主题时只改 `data-theme`，同一套变量名会自动解析到不同颜色。"
);
lines.push("");

lines.push("## 2. 命名对照（Figma → CSS）");
lines.push("");
lines.push("| 层级 | Figma 集合 | Figma 变量名示例 | CSS 自定义属性 |");
lines.push("|------|------------|------------------|----------------|");
lines.push("| 原始色 | `01 Primitives` | `mono/700` | `--mono-700` |");
lines.push("| 原始色 | `01 Primitives` | `brand/500` | `--brand-500` |");
lines.push("| 原始色 | `01 Primitives` | `raw-brand-cam` | `--raw-brand-cam` |");
lines.push("| 语义色 | `02 Semantic` | `color/text/primary` | `--color-text-primary` |");
lines.push("| 语义色 | `02 Semantic` | `color/surface/base` | `--color-surface-base` |");
lines.push("| 渐变 | `02 Semantic` | `color/gradient/home/cta/start` + `/end` | `--color-gradient-home-cta` |");
lines.push("");
lines.push("规则：`/` 替换为 `-`，前缀加 `--`。");
lines.push("");

lines.push("## 3. 变量统计");
lines.push("");
lines.push(`| 类型 | 数量 |`);
lines.push(`|------|------|`);
lines.push(`| 01 Primitives（原始色） | ${prim.length} |`);
lines.push(`| 02 Semantic Default | ${defSem.length} |`);
lines.push(`| 02 Semantic CAM88 | ${camSem.length} |`);
lines.push(`| 渐变合成（\`--color-gradient-*\`） | ${gradientVars.length} |`);
lines.push("");

const onlyDef = semNames.filter((n) => defMap.has(n) && !camMap.has(n));
const onlyCam = semNames.filter((n) => camMap.has(n) && !defMap.has(n));
if (onlyDef.length || onlyCam.length) {
  lines.push("### 仅存在于某一 Mode 的语义变量");
  lines.push("");
  if (onlyDef.length) {
    lines.push("**仅 Default：**");
    for (const n of onlyDef) lines.push(`- \`${figmaToCssVar(n)}\` ← Figma \`${n}\``);
    lines.push("");
  }
  if (onlyCam.length) {
    lines.push("**仅 CAM88：**");
    for (const n of onlyCam) lines.push(`- \`${figmaToCssVar(n)}\` ← Figma \`${n}\``);
    lines.push("");
  }
}

lines.push("## 4. 01 Primitives — 原始色（`--mono-*` / `--brand-*` / …）");
lines.push("");
lines.push(
  "定义于 `:root` / `[data-theme=\"default\"]` 与 `[data-theme=\"cam88\"]`（两主题共用同一套原始色表）。**组件层一般不要直接使用**，除非做调试或特殊场景。"
);
lines.push("");

const groupLabels = {
  mono: "mono / Surface",
  brand: "brand",
  accent: "accent",
  support: "support",
  overlay: "overlay",
  "raw-gradient": "raw-gradient",
  raw: "raw（CAM88 等扩展色）",
  other: "other",
};

for (const g of Object.keys(primByGroup).sort()) {
  lines.push(`### ${groupLabels[g] ?? g}（${primByGroup[g].length}）`);
  lines.push("");
  lines.push("| CSS 变量 | Figma 名 | 色值 |");
  lines.push("|----------|----------|------|");
  for (const p of primByGroup[g]) {
    lines.push(`| \`${figmaToCssVar(p.name)}\` | \`${p.name}\` | \`${p.css}\` |`);
  }
  lines.push("");
}

lines.push("## 5. 02 Semantic — 语义色（`--color-*`）");
lines.push("");
lines.push(
  "这是**页面应引用的主要变量**。下表列出 Figma 名、CSS 变量名，以及 Default / CAM88 各自 alias 到的原始/语义 token（与 `figma-variables.json` 一致）。"
);
lines.push("");

for (const g of Object.keys(semByGroup).sort()) {
  lines.push(`### \`${g}/*\`（${semByGroup[g].length}）`);
  lines.push("");
  lines.push("| CSS 变量 | Figma 名 | Default alias | CAM88 alias |");
  lines.push("|----------|----------|---------------|-------------|");
  for (const name of semByGroup[g]) {
    const css = figmaToCssVar(name);
    const d = defMap.get(name) ?? "—";
    const c = camMap.get(name) ?? "—";
    lines.push(`| \`${css}\` | \`${name}\` | \`${d}\` | \`${c}\` |`);
  }
  lines.push("");
}

lines.push("## 6. 渐变变量（`--color-gradient-*`）");
lines.push("");
lines.push(
  "由 Figma 中成对的 `color/gradient/.../start` + `.../end` 合成，值为 `linear-gradient(90deg, …)`。"
);
lines.push("");
lines.push("| CSS 变量 |");
lines.push("|----------|");
for (const v of gradientVars.sort()) {
  lines.push(`| \`${v}\` |`);
}
lines.push("");

lines.push("## 7. 常用语义变量速查");
lines.push("");
lines.push("| 用途 | CSS 变量 | Figma 名 |");
lines.push("|------|----------|----------|");
const quick = [
  ["页面背景", "color/surface"],
  ["主文字", "color/text/primary"],
  ["次要文字", "color/text/secondary"],
  ["弱化文字", "color/text/muted"],
  ["品牌主色 / CTA", "color/primary"],
  ["边框", "color/border"],
  ["卡片浮层", "color/surface/float"],
  ["输入框背景", "color/surface/input"],
  ["链接", "color/text/link"],
  ["错误", "color/error/strong"],
  ["成功", "color/success/strong"],
  ["警告", "color/warning"],
  ["Sticky 导航背景", "color/sticky-nav"],
  ["Sticky 导航文字", "color/text/sticky-nav-text"],
  ["滚动条", "color/scrollbar"],
  ["遮罩", "color/overlay"],
];
for (const [use, figmaName] of quick) {
  if (defMap.has(figmaName) || camMap.has(figmaName)) {
    lines.push(`| ${use} | \`${figmaToCssVar(figmaName)}\` | \`${figmaName}\` |`);
  }
}
lines.push("");

lines.push("## 8. 维护流程");
lines.push("");
lines.push("1. 在 Figma **Riocity-MCP** 修改 `01 Primitives` / `02 Semantic` 变量");
lines.push("2. 运行同步：`node scripts/renew-both-themes.mjs`");
lines.push("3. 重新生成本文档：`node scripts/generate-variables-doc.mjs`");
lines.push("4. 页面无需改变量名，只需确保 `data-theme` 与 CSS 文件已引入");
lines.push("");

fs.writeFileSync(outPath, lines.join("\n") + "\n");
console.log(`Wrote ${outPath} — ${prim.length} primitives, ${semNames.length} semantics, ${gradientVars.length} gradients`);
