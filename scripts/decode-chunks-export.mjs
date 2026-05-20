/**
 * Decode scripts/_export-chunks.json → _prim.b64 / _sem.b64 → apply-b64-export
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const { primChunks, semChunks } = JSON.parse(
  fs.readFileSync(path.join(root, "scripts", "_export-chunks.json"), "utf8")
);

fs.writeFileSync(path.join(root, "scripts", "_prim.b64"), primChunks.join(""));
fs.writeFileSync(path.join(root, "scripts", "_sem.b64"), semChunks.join(""));

const r = spawnSync(process.execPath, ["scripts/apply-b64-export.mjs"], {
  cwd: root,
  stdio: "inherit",
});
process.exit(r.status ?? 1);
