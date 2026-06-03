/** Persist full Figma CAM88 export (313 lines, parity with Default). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const chunks = [
  fs.readFileSync(path.join(dir, "_live-cam88-sem-0.txt"), "utf8").trim(),
  fs.readFileSync(path.join(dir, "_live-cam88-sem-1.txt"), "utf8").trim(),
  fs.readFileSync(path.join(dir, "_live-cam88-sem-2.txt"), "utf8").trim(),
  fs.readFileSync(path.join(dir, "_live-cam88-sem-3.txt"), "utf8").trim(),
];

let total = 0;
chunks.forEach((text, i) => {
  const lines = text.split("\n").filter(Boolean);
  total += lines.length;
  fs.writeFileSync(
    path.join(dir, `cam88-sem-chunk-${i}.b64`),
    Buffer.from(text, "utf8").toString("base64")
  );
  console.log(`cam88 chunk ${i}: ${lines.length}`);
});
console.log("total:", total);
