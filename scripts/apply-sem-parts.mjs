import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const { p1, p2 } = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "_sem-parts.json"), "utf8")
);
fs.writeFileSync(path.join(root, "scripts", "_sem.b64"), p1 + p2);
const r = spawnSync(process.execPath, ["scripts/apply-b64-export.mjs"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(r.status ?? 1);
