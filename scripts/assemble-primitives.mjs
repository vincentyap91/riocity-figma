import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const c1 = JSON.parse(readFileSync(path.join(dir, "prim-chunk-1.json"), "utf8"));
const c2 = JSON.parse(readFileSync(path.join(dir, "prim-chunk-2.json"), "utf8"));

const payload = { mode: "Value", variables: [...c1, ...c2] };
writeFileSync(path.join(dir, "export-primitives.json"), JSON.stringify(payload, null, 2));
console.log("export-primitives.json:", payload.variables.length);
