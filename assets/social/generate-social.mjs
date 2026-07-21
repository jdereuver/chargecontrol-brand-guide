#!/usr/bin/env node
// ChargeControl social media asset generator (Task #4895).
//
// Generates ALL 20 files in assets/social/ (5 platforms × profile+cover × SVG+PNG)
// from per-platform layout definitions with EXPLICIT safe-zone constants.
// Mirrors the icon-set approach (assets/iconset/generate-icons.mjs): never edit the
// SVG/PNG outputs by hand — change this script and re-run.
//
//   node generate-social.mjs        (writes into ./assets/social relative to CWD)
//
// Design rules:
//  - The mark is ALWAYS the canonical arc+bolt paths from
//    client/src/components/ui/chargecontrol-logo.tsx (stroke 5, round caps). Never redrawn.
//  - Fonts: Outfit (headings/wordmark). PNGs are rasterized with sharp; Outfit must be
//    installed in ~/.fonts (fc-cache -f) or text falls back to a system font.
//  - Palette: navy #0B2347, ink #070F1F, cyan #0EA5E9, sky #38BDF8, white.
//
// Safe-zone constants (why each composition looks the way it does):
//  - LinkedIn cover 1584×396: the profile photo overlaps the BOTTOM-LEFT (~400px wide,
//    from y≈200 down on desktop; worse on mobile). All critical content sits right of
//    x=460 and above y=320.
//  - X cover 1500×500: the profile photo overlaps bottom-left AND different devices
//    crop top/bottom (~60px). Critical content stays in the CENTER band
//    (x 380–1120, y 120–380).
//  - Instagram "cover" 1080×1080 is a square POST template (uncropped) — it is a
//    feed-post design, not a banner.
//  - Facebook cover 820×312: profile photo overlaps bottom-left (~180×180 from
//    x≈24,y≈150). Critical content right of x=250 and above y=280.
//  - YouTube channel art 2560×1440: TVs show all of it, mobile shows ONLY the centered
//    1546×423 window (x 507–2053, y 508.5–931.5). ALL text + logo must fit inside.
//  - Profile pictures: every platform crops to a CIRCLE — the mark is centered and
//    sized ≤62% of the canvas so nothing clips at the circle edge.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "assets", "social");
fs.mkdirSync(OUT, { recursive: true });

// ---- canonical mark (NEVER redraw) ----
const ARC1 = "M16 4C22.6274 4 28 9.37258 28 16C28 18.068 27.4755 20.012 26.545 21.716";
const ARC2 = "M23.95 25.5C21.84 27.08 19.1 28 16 28C9.37258 28 4 22.6274 4 16C4 11.2 6.8 7.1 10.9 5.2";
const BOLT = "M17.5 8L11 17h5.5l-1 7L22 15h-5.5l1-7z";

const NAVY = "#0B2347", INK = "#070F1F", CYAN = "#0EA5E9", SKY = "#38BDF8", WHITE = "#FFFFFF";

function mark({ x = 0, y = 0, scale = 1, arc1 = CYAN, arc2 = NAVY, bolt = CYAN, opacity = 1 }) {
  return `<g transform="translate(${x},${y}) scale(${scale})"${opacity !== 1 ? ` opacity="${opacity}"` : ""}>
<path d="${ARC1}" stroke="${arc1}" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="${ARC2}" stroke="${arc2}" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="${BOLT}" fill="${bolt}"/>
</g>`;
}
// center the 32-unit mark box at (cx,cy) with the mark spanning `size` px
function markCentered(cx, cy, size, colors = {}) {
  const s = size / 32;
  return mark({ x: cx - 16 * s, y: cy - 16 * s, scale: s, ...colors });
}
const svgOpen = (w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`;
const t = (x, y, size, fill, text, { weight = 600, ls = 0, anchor = "start", family = "Outfit" } = {}) =>
  `<text x="${x}" y="${y}" font-family="${family}, sans-serif" font-weight="${weight}" font-size="${size}"${
    ls ? ` letter-spacing="${ls}"` : ""}${anchor !== "start" ? ` text-anchor="${anchor}"` : ""} fill="${fill}">${text}</text>`;

// =====================================================================
// PROFILE PICTURES — circle-crop safe: mark centered, ≤62% of canvas.
// Each platform gets a genuinely different treatment.
// =====================================================================

// LinkedIn 400×400 — corporate: deep navy, primary mark w/ white navy-arc, inner cyan keyline ring.
function linkedinProfile() {
  const S = 400, c = S / 2;
  return `${svgOpen(S, S)}
<defs><radialGradient id="lg" cx="35%" cy="30%" r="90%"><stop offset="0%" stop-color="#123564"/><stop offset="60%" stop-color="${NAVY}"/><stop offset="100%" stop-color="${INK}"/></radialGradient></defs>
<rect width="${S}" height="${S}" fill="url(#lg)"/>
<circle cx="${c}" cy="${c}" r="${S * 0.44}" fill="none" stroke="${CYAN}" stroke-width="3" opacity="0.55"/>
${markCentered(c, c, S * 0.58, { arc1: CYAN, arc2: WHITE, bolt: CYAN })}
</svg>`;
}

// X 400×400 — minimal near-black, all-cyan mono mark with a soft glow.
function xProfile() {
  const S = 400, c = S / 2;
  return `${svgOpen(S, S)}
<defs><radialGradient id="xg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#0C1A30"/><stop offset="100%" stop-color="${INK}"/></radialGradient>
<radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${CYAN}" stop-opacity="0.28"/><stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/></radialGradient></defs>
<rect width="${S}" height="${S}" fill="url(#xg)"/>
<circle cx="${c}" cy="${c}" r="${S * 0.40}" fill="url(#glow)"/>
${markCentered(c, c, S * 0.58, { arc1: CYAN, arc2: CYAN, bolt: CYAN })}
</svg>`;
}

// Instagram 320×320 — vivid cyan→navy diagonal gradient, all-white mark.
function instagramProfile() {
  const S = 320, c = S / 2;
  return `${svgOpen(S, S)}
<defs><linearGradient id="ig" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${SKY}"/><stop offset="45%" stop-color="${CYAN}"/><stop offset="100%" stop-color="${NAVY}"/></linearGradient></defs>
<rect width="${S}" height="${S}" fill="url(#ig)"/>
${markCentered(c, c, S * 0.60, { arc1: WHITE, arc2: WHITE, bolt: WHITE })}
</svg>`;
}

// Facebook 320×320 — clean white, full-color primary mark, thin navy keyline ring.
function facebookProfile() {
  const S = 320, c = S / 2;
  return `${svgOpen(S, S)}
<rect width="${S}" height="${S}" fill="${WHITE}"/>
<circle cx="${c}" cy="${c}" r="${S * 0.45}" fill="none" stroke="${NAVY}" stroke-width="2.5" opacity="0.25"/>
${markCentered(c, c, S * 0.58, { arc1: CYAN, arc2: NAVY, bolt: CYAN })}
</svg>`;
}

// YouTube 800×800 — navy with strong centered cyan glow behind a big primary mark.
function youtubeProfile() {
  const S = 800, c = S / 2;
  return `${svgOpen(S, S)}
<defs><linearGradient id="yg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0E2E5C"/><stop offset="100%" stop-color="${INK}"/></linearGradient>
<radialGradient id="yglow" cx="50%" cy="46%" r="46%"><stop offset="0%" stop-color="${CYAN}" stop-opacity="0.35"/><stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/></radialGradient></defs>
<rect width="${S}" height="${S}" fill="url(#yg)"/>
<circle cx="${c}" cy="${S * 0.46}" r="${S * 0.42}" fill="url(#yglow)"/>
${markCentered(c, c, S * 0.60, { arc1: CYAN, arc2: WHITE, bolt: CYAN })}
</svg>`;
}

// =====================================================================
// COVERS — one composition per platform, driven by its real safe zone.
// =====================================================================

// LinkedIn 1584×396 — corporate wide banner. Profile photo overlaps bottom-left,
// so ALL content sits right of x=460 and above y=320; left third carries only a
// large low-opacity mark motif that may be covered.
function linkedinCover() {
  const W = 1584, H = 396;
  const tx = 640; // text block start — well right of the 460px overlap zone
  return `${svgOpen(W, H)}
<defs><linearGradient id="lbg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${INK}"/><stop offset="45%" stop-color="${NAVY}"/><stop offset="100%" stop-color="#0E2E5C"/></linearGradient>
<linearGradient id="lbar" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${CYAN}" stop-opacity="0"/><stop offset="100%" stop-color="${CYAN}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#lbg)"/>
${mark({ x: 60, y: -95, scale: 18, arc1: WHITE, arc2: WHITE, bolt: WHITE, opacity: 0.05 })}
<line x1="588" y1="70" x2="588" y2="326" stroke="${CYAN}" stroke-width="3" opacity="0.5"/>
${markCentered(tx + 44, 152, 108, { arc1: CYAN, arc2: WHITE, bolt: CYAN })}
${t(tx + 122, 178, 74, WHITE, "ChargeControl", { weight: 700 })}
${t(tx + 4, 258, 26, SKY, "THE INTELLIGENT ENERGY PLATFORM", { weight: 500, ls: 5 })}
${t(tx + 4, 300, 22, "#9FB4CC", "EV charging · Home energy · Fleet reimbursement", { weight: 400, family: "Outfit" })}
<rect x="${W - 560}" y="${H - 10}" width="560" height="10" fill="url(#lbar)"/>
</svg>`;
}

// X 1500×500 — compact banner. Content centered in the safe band (y 120–380),
// nothing near edges; thin horizontal energy line pierces the lockup.
function xCover() {
  const W = 1500, H = 500, cx = W / 2;
  return `${svgOpen(W, H)}
<defs><radialGradient id="xbg" cx="50%" cy="50%" r="75%"><stop offset="0%" stop-color="#0C2247"/><stop offset="100%" stop-color="${INK}"/></radialGradient>
<linearGradient id="xline" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${CYAN}" stop-opacity="0"/><stop offset="50%" stop-color="${CYAN}" stop-opacity="0.8"/><stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#xbg)"/>
<rect x="150" y="248" width="1200" height="4" fill="url(#xline)"/>
${markCentered(cx - 285, 250, 120, { arc1: CYAN, arc2: WHITE, bolt: CYAN })}
${t(cx - 200, 274, 68, WHITE, "ChargeControl", { weight: 700 })}
${t(cx, 344, 24, SKY, "THE INTELLIGENT ENERGY PLATFORM", { weight: 500, ls: 5, anchor: "middle" })}
</svg>`;
}

// Instagram 1080×1080 — square feed-post template (uncropped): header lockup,
// big headline, giant bolt watermark, gradient footer bar with URL.
function instagramCover() {
  const W = 1080, H = 1080;
  return `${svgOpen(W, H)}
<defs><linearGradient id="ibg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0E2E5C"/><stop offset="55%" stop-color="${NAVY}"/><stop offset="100%" stop-color="${INK}"/></linearGradient>
<linearGradient id="ibar" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${CYAN}"/><stop offset="100%" stop-color="${SKY}"/></linearGradient>
<linearGradient id="ibolt" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${SKY}" stop-opacity="0.30"/><stop offset="100%" stop-color="${CYAN}" stop-opacity="0.06"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#ibg)"/>
<g transform="translate(430,120) scale(38)"><path d="${BOLT}" fill="url(#ibolt)"/></g>
${markCentered(120, 118, 76, { arc1: CYAN, arc2: WHITE, bolt: CYAN })}
${t(174, 136, 46, WHITE, "ChargeControl", { weight: 600 })}
${t(84, 560, 108, WHITE, "Charge smarter.", { weight: 700 })}
${t(84, 680, 108, SKY, "Every day.", { weight: 700 })}
${t(84, 780, 34, "#9FB4CC", "One platform for EV charging, home energy", { weight: 400 })}
${t(84, 828, 34, "#9FB4CC", "and automatic reimbursement.", { weight: 400 })}
<rect x="84" y="924" width="360" height="8" rx="4" fill="url(#ibar)"/>
${t(84, 996, 32, WHITE, "chargecontrol.ai", { weight: 500, family: "JetBrains Mono" })}
</svg>`;
}

// Facebook 820×312 — light variant. Profile photo overlaps bottom-left
// (~180px square from x≈24,y≈150): content sits right of x=250, above y=280.
function facebookCover() {
  const W = 820, H = 312;
  return `${svgOpen(W, H)}
<defs><linearGradient id="fbar" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${CYAN}"/><stop offset="100%" stop-color="${SKY}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="#F4F8FC"/>
${mark({ x: 585, y: -60, scale: 9.5, arc1: CYAN, arc2: NAVY, bolt: CYAN, opacity: 0.08 })}
${markCentered(310, 128, 84, { arc1: CYAN, arc2: NAVY, bolt: CYAN })}
${t(368, 148, 52, NAVY, "ChargeControl", { weight: 700 })}
${t(262, 208, 19, "#0A6E9E", "THE INTELLIGENT ENERGY PLATFORM", { weight: 600, ls: 3.4 })}
${t(262, 246, 18, "#4A5E78", "EV charging · Home energy · Fleet reimbursement", { weight: 400 })}
<rect x="262" y="268" width="300" height="6" rx="3" fill="url(#fbar)"/>
</svg>`;
}

// YouTube 2560×1440 — channel art. ALL text + logo inside the centered mobile-safe
// window 1546×423 (x 507–2053, y 508.5–931.5); outer area is decoration only.
function youtubeCover() {
  const W = 2560, H = 1440, cx = W / 2;
  const SAFE = { x: 507, y: 508.5, w: 1546, h: 423 }; // TV→mobile safe area
  const midY = SAFE.y + SAFE.h / 2; // 720
  return `${svgOpen(W, H)}
<defs><radialGradient id="ybg" cx="50%" cy="50%" r="72%"><stop offset="0%" stop-color="#0E2E5C"/><stop offset="55%" stop-color="${NAVY}"/><stop offset="100%" stop-color="${INK}"/></radialGradient>
<linearGradient id="ybeam" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${CYAN}" stop-opacity="0"/><stop offset="50%" stop-color="${CYAN}" stop-opacity="0.30"/><stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#ybg)"/>
<g transform="rotate(-14 ${cx} ${H / 2})"><rect x="-300" y="330" width="3160" height="90" fill="url(#ybeam)"/></g>
<g transform="rotate(-14 ${cx} ${H / 2})"><rect x="-300" y="1030" width="3160" height="90" fill="url(#ybeam)"/></g>
${mark({ x: 130, y: 990, scale: 11, arc1: WHITE, arc2: WHITE, bolt: WHITE, opacity: 0.05 })}
${mark({ x: 2080, y: 80, scale: 11, arc1: WHITE, arc2: WHITE, bolt: WHITE, opacity: 0.05 })}
${markCentered(cx - 425, midY - 40, 170, { arc1: CYAN, arc2: WHITE, bolt: CYAN })}
${t(cx - 310, midY - 4, 118, WHITE, "ChargeControl", { weight: 700 })}
${t(cx, midY + 106, 38, SKY, "THE INTELLIGENT ENERGY PLATFORM", { weight: 500, ls: 8, anchor: "middle" })}
</svg>`;
}

// =====================================================================
const FILES = {
  "linkedin-profile.svg": linkedinProfile(),
  "linkedin-cover.svg": linkedinCover(),
  "twitter-x-profile.svg": xProfile(),
  "twitter-x-cover.svg": xCover(),
  "instagram-profile.svg": instagramProfile(),
  "instagram-cover.svg": instagramCover(),
  "facebook-profile.svg": facebookProfile(),
  "facebook-cover.svg": facebookCover(),
  "youtube-profile.svg": youtubeProfile(),
  "youtube-cover.svg": youtubeCover(),
};

const DIMS = {
  "linkedin-profile": [400, 400], "linkedin-cover": [1584, 396],
  "twitter-x-profile": [400, 400], "twitter-x-cover": [1500, 500],
  "instagram-profile": [320, 320], "instagram-cover": [1080, 1080],
  "facebook-profile": [320, 320], "facebook-cover": [820, 312],
  "youtube-profile": [800, 800], "youtube-cover": [2560, 1440],
};

for (const [name, svg] of Object.entries(FILES)) {
  const base = name.replace(/\.svg$/, "");
  const [w, h] = DIMS[base];
  fs.writeFileSync(path.join(OUT, name), svg);
  const png = await sharp(Buffer.from(svg), { density: 96 }).resize(w, h).png().toBuffer();
  fs.writeFileSync(path.join(OUT, `${base}.png`), png);
  const meta = await sharp(png).metadata();
  if (meta.width !== w || meta.height !== h) throw new Error(`${base}.png is ${meta.width}x${meta.height}, expected ${w}x${h}`);
  console.log(`${base}: svg ${svg.length}b, png ${png.length}b ${meta.width}x${meta.height}`);
}
console.log("Done →", OUT);
