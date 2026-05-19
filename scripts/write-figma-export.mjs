/**
 * Writes export JSON from Figma MCP inline payload (run after pasting JSON into PAYLOAD below).
 * Prefer: node scripts/decode-export.mjs with scripts/_export.b64
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// Populated by generate-write-figma-export runner
const PAYLOAD = null;

if (!PAYLOAD) {
  console.error("PAYLOAD empty — run via decode-export.mjs or merge-export.mjs");
  process.exit(1);
}
