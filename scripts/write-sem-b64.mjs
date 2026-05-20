import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
// Written by agent from Figma MCP export (2026-05-20)
const semB64 = process.env.SEM_B64;
if (!semB64) {
  console.error("Set SEM_B64 env var");
  process.exit(1);
}
fs.writeFileSync(path.join(root, "scripts", "_sem.b64"), semB64);
const r = spawnSync(process.execPath, ["scripts/apply-b64-export.mjs"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(r.status ?? 1);
