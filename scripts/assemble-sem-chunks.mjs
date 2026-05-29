import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const dir = path.dirname(fileURLToPath(import.meta.url));
const chunks = [0, 1, 2, 3].map((i) =>
  fs.readFileSync(path.join(dir, `sem-chunk-${i}.b64`), "utf8").trim()
);

const text = chunks.map((b64) => Buffer.from(b64, "base64").toString("utf8")).join("\n");

const lines = text.split("\n").filter(Boolean);
fs.writeFileSync(path.join(dir, "sem.b64"), Buffer.from(text, "utf8").toString("base64"));

console.log("sem lines:", lines.length);

const rebuild = spawnSync(process.execPath, ["rebuild-from-b64.mjs"], {
  cwd: dir,
  stdio: "inherit",
});
process.exit(rebuild.status ?? 1);
