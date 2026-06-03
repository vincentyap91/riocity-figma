/**
 * Run full Default + CAM88 sync from _live-*.txt export files.
 * Run: node scripts/renew-both-themes.mjs
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

for (const script of [
  "persist-live-export.mjs",
  "sync-delta-from-export.mjs",
  "persist-cam88-figma-export.mjs",
  "sync-delta-cam88-from-export.mjs",
]) {
  const r = spawnSync(process.execPath, [script], { cwd: dir, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
