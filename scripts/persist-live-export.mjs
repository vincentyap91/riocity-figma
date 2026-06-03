/**
 * Write prim.b64 + sem-chunk-*.b64 from Figma MCP live export text files.
 * Run: node scripts/persist-live-export.mjs && node scripts/sync-delta-from-export.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

function readLines(name) {
  return fs.readFileSync(path.join(dir, name), "utf8").trim();
}

const primText = [0, 1].map((i) => readLines(`_live-prim-${i}.txt`)).join("\n");
fs.writeFileSync(
  path.join(dir, "prim.b64"),
  Buffer.from(primText, "utf8").toString("base64")
);

let total = 0;
for (let i = 0; i < 4; i++) {
  const text = readLines(`_live-sem-${i}.txt`);
  const lines = text.split("\n").filter(Boolean);
  total += lines.length;
  fs.writeFileSync(
    path.join(dir, `sem-chunk-${i}.b64`),
    Buffer.from(text, "utf8").toString("base64")
  );
  console.log(`sem chunk ${i}: ${lines.length} lines`);
}
console.log(
  `prim: ${primText.split("\n").filter(Boolean).length} lines, sem total: ${total}`
);
