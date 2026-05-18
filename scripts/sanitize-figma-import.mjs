/**
 * Build Figma-importable variable JSON from export.json.
 * Strips fields that break re-import (library refs, Figma internal IDs).
 *
 * Run: node scripts/sanitize-figma-import.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcPath = path.join(root, "export.json");
const outPath = path.join(root, "RioCity9.figma-import.json");

const data = JSON.parse(fs.readFileSync(srcPath, "utf8"));

function sanitizeToken(token) {
  const out = {
    $type: token.$type,
    $value: token.$value,
  };
  if (token.$codeSyntax) out.$codeSyntax = token.$codeSyntax;
  if (token.$scopes) out.$scopes = token.$scopes;
  return out;
}

function sanitizeCollection(coll) {
  const collName = Object.keys(coll)[0];
  const collBody = coll[collName];
  const modes = {};
  for (const [modeName, tokens] of Object.entries(collBody.modes)) {
    modes[modeName] = {};
    for (const [tokenName, token] of Object.entries(tokens)) {
      if (!token || typeof token !== "object" || !token.$type) continue;
      modes[modeName][tokenName] = sanitizeToken(token);
    }
  }
  return { [collName]: { modes } };
}

const out = data.map((block) => sanitizeCollection(block));

// Fix alias target used in Figma export (raw-text-dark) vs repo primitive name (raw-text-rtp)
const primitives = out.find((b) => b["01 Primitives"])?.["01 Primitives"]?.modes?.Value;
if (primitives && primitives["raw-text-rtp"] && !primitives["raw-text-dark"]) {
  primitives["raw-text-dark"] = { ...primitives["raw-text-rtp"] };
}

const semantic = out.find((b) => b["02 Semantic"])?.["02 Semantic"]?.modes?.RioCity9;
if (semantic?.["text-rtp"]?.$value === "{raw-text-dark}" && primitives?.["raw-text-dark"]) {
  // already valid once primitive exists
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
console.log("Wrote", outPath);
