#!/usr/bin/env node
// ============================================================================
// generate.mjs — render the Garamond Goods editorial images via Replicate.
// ============================================================================
// Run from site/:
//   node tools/generate.mjs                    # every shot, high quality
//   node tools/generate.mjs --only hero,method # just these
//   node tools/generate.mjs --quality low      # cheap, fast test pass
//   node tools/generate.mjs -n 2               # 2 variants each (id.webp, id-2.webp)
//
// Token — never printed, never committed. First match wins:
//   1. $REPLICATE_API_TOKEN
//   2. ../.replicate-token   (Garamond_Goods/, OUTSIDE the git repo)  ← recommended
//   3. ./.replicate-token    (site/, gitignored)
//
// Writes .webp files into site/img/. Requires Node 18+ (global fetch).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PREAMBLE, SHOTS } from "./shots.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dirname, "..");
const IMG_DIR = path.join(SITE, "img");
const ENDPOINT = "https://api.replicate.com/v1/models/openai/gpt-image-2/predictions";

// ---- args ----
const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const only = flag("--only", "").split(",").map((s) => s.trim()).filter(Boolean);
const quality = flag("--quality", "high");
const count = parseInt(flag("-n", "1"), 10) || 1;
const format = flag("--format", "jpeg"); // jpeg keeps photographic stills small + correctly served
const concurrency = parseInt(flag("--concurrency", "4"), 10) || 4;

// ---- token ----
// Accept either a bare token or a pasted `export REPLICATE_API_TOKEN="r8_..."`
// line — pull the r8_ token out of whatever was provided.
function sanitizeToken(raw) {
  const s = String(raw).trim();
  const m = s.match(/r8_[A-Za-z0-9._-]+/);
  if (m) return m[0];
  return s.replace(/^export\s+/i, "").replace(/^[A-Za-z0-9_]+\s*=\s*/, "").replace(/^['"]|['"]$/g, "").trim();
}
function loadToken() {
  if (process.env.REPLICATE_API_TOKEN) return sanitizeToken(process.env.REPLICATE_API_TOKEN);
  for (const p of [path.join(SITE, "..", ".replicate-token"), path.join(SITE, ".replicate-token")]) {
    try {
      const t = fs.readFileSync(p, "utf8");
      if (t.trim()) return sanitizeToken(t);
    } catch {}
  }
  console.error(
    "No Replicate token. From site/ run:\n" +
      "  printf '%s' 'r8_your_token' > ../.replicate-token\n" +
      "or set REPLICATE_API_TOKEN in the environment."
  );
  process.exit(1);
}
const TOKEN = loadToken();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DONE = new Set(["succeeded", "failed", "canceled"]);

// Name the file by what actually came back, not what we asked for.
function extFor(buf, requested) {
  if (buf.length >= 12) {
    if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
    if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
    if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  }
  return requested === "jpeg" ? "jpg" : requested;
}

async function poll(url) {
  for (let i = 0; i < 150; i++) {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const p = await r.json();
    if (DONE.has(p.status)) return p;
    await sleep(2000);
  }
  throw new Error("timed out waiting on prediction");
}

async function run(shot) {
  const payload = JSON.stringify({
    input: {
      prompt: `${shot.preamble ?? PREAMBLE}\n\n${shot.prompt}`,
      aspect_ratio: shot.aspect_ratio,
      quality,
      number_of_images: count,
      output_format: format === "jpg" ? "jpeg" : format,
    },
  });
  let res, pred;
  for (let attempt = 0; ; attempt++) {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait", // block up to ~60s so most predictions return inline
      },
      body: payload,
    });
    if (res.status === 429 && attempt < 5) {
      await sleep(3000 * (attempt + 1)); // back off on rate limit, then retry
      continue;
    }
    pred = await res.json();
    break;
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(pred).slice(0, 300)}`);
  if (!DONE.has(pred.status)) pred = await poll(pred.urls.get);
  if (pred.status !== "succeeded") throw new Error(`${pred.status}: ${pred.error || "unknown"}`);

  const outputs = [].concat(pred.output).filter(Boolean);
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const written = [];
  for (let i = 0; i < outputs.length; i++) {
    const img = await fetch(outputs[i]);
    if (!img.ok) throw new Error(`download ${img.status}`);
    const buf = Buffer.from(await img.arrayBuffer());
    const stem = i === 0 ? shot.id : `${shot.id}-${i + 1}`;
    const name = `${stem}.${extFor(buf, format)}`;
    fs.writeFileSync(path.join(IMG_DIR, name), buf);
    written.push(`img/${name}`);
  }
  return written;
}

const queue = SHOTS.filter((s) => !only.length || only.includes(s.id));
if (!queue.length) {
  console.error(`No shots match --only ${only.join(",")}. Ids: ${SHOTS.map((s) => s.id).join(", ")}`);
  process.exit(1);
}

console.log(`Generating ${queue.length} shot(s) · quality=${quality} · ${count}/shot · concurrency=${concurrency} → site/img/`);
let ok = 0;
let next = 0;
async function worker() {
  while (next < queue.length) {
    const shot = queue[next++];
    try {
      const files = await run(shot);
      console.log(`  ✓ ${shot.id.padEnd(20)} ${files.join(", ")}`);
      ok++;
    } catch (e) {
      console.log(`  ✗ ${shot.id.padEnd(20)} ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
console.log(`Done: ${ok}/${queue.length} succeeded.`);
