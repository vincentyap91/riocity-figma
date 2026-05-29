import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chunksPath = path.join(__dirname, "export-chunks.json");
const outPath = path.join(__dirname, "..", "figma-variables.json");

const chunks = JSON.parse(fs.readFileSync(chunksPath, "utf8"));
const b64 = chunks.join("");
const json = Buffer.from(b64, "base64").toString("utf8");
const data = JSON.parse(json);
fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Wrote ${outPath} — ${data["01 Primitives"].variables.length} primitives, ${data["02 Semantic"].variables.length} semantics`
);
