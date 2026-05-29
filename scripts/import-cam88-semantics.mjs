/**
 * Decode CAM88 semantic export chunks → figma-variables.json["02 Semantic CAM88"]
 * Usage: node scripts/import-cam88-semantics.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "..");
const varsPath = path.join(root, "figma-variables.json");

const chunks = [0, 1, 2, 3].map((i) =>
  fs.readFileSync(path.join(dir, `cam88-sem-chunk-${i}.b64`), "utf8").trim()
);

const text = chunks.map((b64) => Buffer.from(b64, "base64").toString("utf8")).join("\n");
const semantics = text
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const i = line.indexOf("\t");
    return { name: line.slice(0, i), aliasTo: line.slice(i + 1) };
  });

const data = JSON.parse(fs.readFileSync(varsPath, "utf8"));
data["02 Semantic CAM88"] = {
  mode: "CAM88",
  variables: semantics,
};

fs.writeFileSync(varsPath, JSON.stringify(data, null, 2) + "\n");
console.log(`Updated ${varsPath} — CAM88 semantics: ${semantics.length}`);
