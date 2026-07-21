#!/usr/bin/env node
// ChargeControl social asset verification gate (Task #4896).
//
// Guards assets/social/ against regressions of the safe-zone rules encoded in
// generate-social.mjs. Run from the main ChargeControl workspace root (so
// `sharp` resolves from its node_modules):
//
//   node <brand-guide-checkout>/assets/social/check-social.mjs [--repo <checkout-dir>]
//
// What it checks (exit 1 on any failure):
//  1. Regeneration byte-stability: copies generate-social.mjs into a temp dir
//     under the workspace, re-runs it, and asserts every committed SVG is
//     byte-identical to the fresh output (i.e. outputs were never hand-edited
//     and the generator is deterministic).
//  2. PNG dimensions: every committed PNG has the exact per-platform size.
//  3. Safe-zone invariants, parsed from the generated SVGs:
//     - profiles: exactly one full-opacity mark, centered, spanning <=62% of
//       the canvas (circular crop safety);
//     - linkedin-cover: content right of x=460 and above y=320 (bottom-left
//       profile-photo overlap);
//     - twitter-x-cover: content inside the center band x 380-1120, y 120-380;
//     - facebook-cover: content right of x=250 and above y=280;
//     - instagram-cover: square post — all text inside a 24px inner margin;
//     - youtube-cover: content inside the 1546x423 mobile window
//       (x 507-2053, y 508.5-931.5).
//     "Content" = marks with opacity >= 0.5 and all <text> elements.
//     Decorative low-opacity motifs may sit anywhere. Text extents are
//     estimated (0.55em average glyph width + letter-spacing) — conservative
//     for Outfit; if a legit design trips the estimate, tighten the design,
//     not the check.

import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";
import { createRequire } from "module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const repoIdx = argv.indexOf("--repo");
const REPO = repoIdx >= 0 ? path.resolve(argv[repoIdx + 1]) : path.resolve(HERE, "../..");
const SOCIAL = path.join(REPO, "assets", "social");
const GEN = path.join(SOCIAL, "generate-social.mjs");

// Resolve sharp from the CWD (workspace root), not from this file's location.
const req = createRequire(path.join(process.cwd(), "noop.js"));
let sharp;
try {
  sharp = (await import(pathToFileURL(req.resolve("sharp")).href)).default;
} catch {
  console.error("FAIL: cannot resolve `sharp` from " + process.cwd() +
    " — run this check from the ChargeControl workspace root.");
  process.exit(1);
}

const DIMS = {
  "linkedin-profile": [400, 400], "linkedin-cover": [1584, 396],
  "twitter-x-profile": [400, 400], "twitter-x-cover": [1500, 500],
  "instagram-profile": [320, 320], "instagram-cover": [1080, 1080],
  "facebook-profile": [320, 320], "facebook-cover": [820, 312],
  "youtube-profile": [800, 800], "youtube-cover": [2560, 1440],
};
const BASES = Object.keys(DIMS);

let failures = 0;
const fail = (msg) => { failures++; console.error("FAIL: " + msg); };
const ok = (msg) => console.log("  ok: " + msg);

// ---- 1. regenerate in a temp dir under the workspace and diff SVG bytes ----
console.log("[1/3] regenerating from " + GEN);
if (!fs.existsSync(GEN)) { console.error("FAIL: generator not found: " + GEN); process.exit(1); }
const tmp = fs.mkdtempSync(path.join(process.cwd(), ".social-check-"));
try {
  fs.copyFileSync(GEN, path.join(tmp, "generate-social.mjs"));
  execFileSync(process.execPath, [path.join(tmp, "generate-social.mjs")], {
    cwd: tmp, stdio: ["ignore", "ignore", "inherit"],
  });
  const freshDir = path.join(tmp, "assets", "social");
  for (const base of BASES) {
    const name = base + ".svg";
    const committed = path.join(SOCIAL, name);
    if (!fs.existsSync(committed)) { fail(name + " missing from " + SOCIAL); continue; }
    const a = fs.readFileSync(committed);
    const b = fs.readFileSync(path.join(freshDir, name));
    if (!a.equals(b)) fail(name + " differs from a fresh generator run — regenerate and commit (never hand-edit outputs)");
  }
  if (!failures) ok("all 10 committed SVGs byte-identical to a fresh run");

  // ---- 2. PNG dimensions ----
  console.log("[2/3] PNG dimensions");
  for (const base of BASES) {
    const [w, h] = DIMS[base];
    const p = path.join(SOCIAL, base + ".png");
    if (!fs.existsSync(p)) { fail(base + ".png missing"); continue; }
    const meta = await sharp(p).metadata();
    if (meta.width !== w || meta.height !== h)
      fail(`${base}.png is ${meta.width}x${meta.height}, expected ${w}x${h}`);
  }
  if (!failures) ok("all 10 PNGs have exact expected dimensions");
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ---- 3. safe-zone invariants (parse the committed SVGs) ----
console.log("[3/3] safe-zone invariants");

function parseSvg(base) {
  const svg = fs.readFileSync(path.join(SOCIAL, base + ".svg"), "utf8");
  const m = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
  if (!m) { fail(base + ": no viewBox"); return null; }
  const [W, H] = [Number(m[1]), Number(m[2])];
  const [ew, eh] = DIMS[base];
  if (W !== ew || H !== eh) fail(`${base}.svg viewBox ${W}x${H}, expected ${ew}x${eh}`);

  // marks: <g transform="translate(x,y) scale(s)"[ opacity="o"]> containing an arc stroke
  const marks = [];
  const gRe = /<g transform="translate\((-?[\d.]+),(-?[\d.]+)\) scale\(([\d.]+)\)"(?: opacity="([\d.]+)")?>([\s\S]*?)<\/g>/g;
  for (let g; (g = gRe.exec(svg)); ) {
    const [, x, y, s, op, body] = g;
    if (!/stroke-width="5"/.test(body)) continue; // bolt-only watermark groups are decoration
    marks.push({
      x: Number(x), y: Number(y), size: 32 * Number(s),
      opacity: op === undefined ? 1 : Number(op),
    });
  }

  // texts
  const texts = [];
  const tRe = /<text x="(-?[\d.]+)" y="(-?[\d.]+)"[^>]*font-size="([\d.]+)"([^>]*)>([^<]*)<\/text>/g;
  for (let t; (t = tRe.exec(svg)); ) {
    const [, x, y, size, attrs, content] = t;
    const ls = (attrs.match(/letter-spacing="([\d.]+)"/) || [])[1];
    const anchor = (attrs.match(/text-anchor="(\w+)"/) || [])[1] || "start";
    const n = content.length;
    const width = n * Number(size) * 0.55 + (ls ? Number(ls) * (n - 1) : 0);
    const bx = Number(x), by = Number(y), fs_ = Number(size);
    const left = anchor === "middle" ? bx - width / 2 : anchor === "end" ? bx - width : bx;
    texts.push({ text: content, left, right: left + width, top: by - fs_ * 0.75, bottom: by, size: fs_ });
  }
  return { W, H, marks, texts };
}

const contentMarks = (p) => p.marks.filter((m) => m.opacity >= 0.5);
const box = (m) => ({ left: m.x, top: m.y, right: m.x + m.size, bottom: m.y + m.size });

function assertInside(base, kind, b, zone) {
  const bad = [];
  if (zone.left !== undefined && b.left < zone.left) bad.push(`left ${b.left.toFixed(1)} < ${zone.left}`);
  if (zone.right !== undefined && b.right > zone.right) bad.push(`right ${b.right.toFixed(1)} > ${zone.right}`);
  if (zone.top !== undefined && b.top < zone.top) bad.push(`top ${b.top.toFixed(1)} < ${zone.top}`);
  if (zone.bottom !== undefined && b.bottom > zone.bottom) bad.push(`bottom ${b.bottom.toFixed(1)} > ${zone.bottom}`);
  if (bad.length) fail(`${base}: ${kind} outside safe zone (${bad.join("; ")})`);
}

for (const base of BASES.filter((b) => b.endsWith("-profile"))) {
  const p = parseSvg(base);
  if (!p) continue;
  const cm = contentMarks(p);
  if (cm.length !== 1) { fail(`${base}: expected exactly 1 full-opacity mark, found ${cm.length}`); continue; }
  const m = cm[0];
  if (m.size > p.W * 0.62 + 0.01)
    fail(`${base}: mark spans ${(100 * m.size / p.W).toFixed(1)}% of canvas (max 62% for circular crops)`);
  const cx = m.x + m.size / 2, cy = m.y + m.size / 2;
  if (Math.abs(cx - p.W / 2) > 1 || Math.abs(cy - p.H / 2) > 1)
    fail(`${base}: mark not centered (center ${cx.toFixed(1)},${cy.toFixed(1)} vs ${p.W / 2},${p.H / 2})`);
}
ok("profiles: single centered mark <=62% of canvas");

const COVER_ZONES = {
  // LinkedIn 1584x396: profile photo overlaps bottom-left -> content right of 460, above 320.
  "linkedin-cover": { left: 460, bottom: 320 },
  // X 1500x500: bottom-left overlap + top/bottom device crops -> center band.
  "twitter-x-cover": { left: 380, right: 1120, top: 120, bottom: 380 },
  // Facebook 820x312: ~180px profile photo from x~24,y~150 -> right of 250, above 280.
  "facebook-cover": { left: 250, bottom: 280 },
  // Instagram 1080x1080 square post (uncropped): keep text off the very edges.
  "instagram-cover": { left: 24, right: 1056, top: 24, bottom: 1056 },
  // YouTube 2560x1440: mobile shows only the centered 1546x423 window.
  "youtube-cover": { left: 507, right: 2053, top: 508.5, bottom: 931.5 },
};

for (const [base, zone] of Object.entries(COVER_ZONES)) {
  const p = parseSvg(base);
  if (!p) continue;
  for (const m of contentMarks(p)) assertInside(base, `mark @${m.x},${m.y}`, box(m), zone);
  for (const t of p.texts) assertInside(base, `text "${t.text}"`, t, zone);
  if (!p.texts.length) fail(`${base}: no <text> elements found — parser or design regression`);
}
ok("covers: all full-opacity marks and texts inside their platform safe zones");

if (failures) {
  console.error(`\n${failures} failure(s).`);
  process.exit(1);
}
console.log("\nAll social asset checks passed (10 SVGs byte-stable, 10 PNGs sized, safe zones held).");
