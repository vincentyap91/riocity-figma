/**
 * Persist Figma MCP export from scripts/mcp-export.json → live files → theme.css
 * mcp-export.json: { exportedAt, primitives: [{name,css}], semantics: [{name,aliasTo}] }
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const exportPath = path.join(root, "scripts", "mcp-export.json");
const data = JSON.parse(fs.readFileSync(exportPath, "utf8"));

fs.writeFileSync(
  path.join(root, "figma-primitives-live.json"),
  JSON.stringify({ exportedAt: data.exportedAt, primitives: data.primitives }) + "\n"
);
fs.writeFileSync(
  path.join(root, "figma-semantics-live.json"),
  JSON.stringify({ exportedAt: data.exportedAt, semantics: data.semantics }) + "\n"
);

console.log(
  `Live export: ${data.primitives.length} primitives, ${data.semantics.length} semantics`
);

execSync("node scripts/apply-figma-live-export.mjs", { cwd: root, stdio: "inherit" });
execSync("node generate-theme-css.mjs", { cwd: root, stdio: "inherit" });
