#!/usr/bin/env node
/**
 * ChargeControl Icon Set generator — the ONLY way new brand icons are made.
 *
 * Usage:
 *   node generate-icons.mjs                # writes SVGs + manifest.json next to this script
 *   ICONSET_OUT=/some/dir node generate-icons.mjs
 *
 * Design rules (every icon MUST follow these — no exceptions):
 *   - 24x24 viewBox, geometry drawn on the 24px grid with ~2px padding.
 *   - stroke 2, round caps + round joins, no fills except deliberate accent fills.
 *   - Primary variant: navy #0B2347 strokes; ONE cyan #0EA5E9 accent element max
 *     (the "energy" element: bolt, arrow, wave, pulse or highlight dot).
 *   - White-on-dark variant: navy -> white, cyan accent STAYS cyan.
 *   - Charge/energy motif = the small filled zap via the bolt() helper below.
 *     NEVER redraw or approximate the ChargeControl logo (broken-ring arc + bolt)
 *     inside an icon — the logo lives only in the canonical logo assets.
 *   - Naming: cc-icon-<slug>.svg + cc-icon-<slug>-white.svg (kebab-case slug).
 *   - No banned terms in labels (use "Home Energy Hub", never legacy codenames).
 *
 * Adding an icon:
 *   1. Add an entry to NEW below: [slug, domain, label, [elements...]] using the
 *      P/C/R/L helpers ({accent:true} = cyan, {fill:true} = filled shape).
 *   2. Run this script, visually QA the new SVG at 24px and 48px.
 *   3. Rebuild icon-set-preview.svg/png + chargecontrol-icon-set.zip and add the
 *      icon's card to the #iconset grid in index.html (same markup as siblings).
 *
 * The 17 original icons (EXISTING below) predate this generator and are kept
 * byte-identical — this script never overwrites them, it only lists them in
 * manifest.json for the grid/zip tooling. (home-energy was migrated to NEW
 * when it was redesigned to match the Home Energy Hub sub-brand mark.)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const NAVY = '#0B2347', CYAN = '#0EA5E9';
const OUT = process.env.ICONSET_OUT || path.dirname(fileURLToPath(import.meta.url));
fs.mkdirSync(OUT, { recursive: true });

// element helpers: every element -> {tag, attrs, accent, fill}
const P = (d, o = {}) => ({ tag: 'path', attrs: { d }, ...o });
const C = (cx, cy, r, o = {}) => ({ tag: 'circle', attrs: { cx, cy, r }, ...o });
const R = (x, y, w, h, rx = 0, o = {}) => ({ tag: 'rect', attrs: { x, y, width: w, height: h, rx }, ...o });
const L = (x1, y1, x2, y2, o = {}) => ({ tag: 'line', attrs: { x1, y1, x2, y2 }, ...o });
// distinct mini-bolt motif (NOT the logo bolt) — filled zap, same family as cc-icon-charging
const bolt = (cx, cy, s = 1, o = {}) => P(
  `M${(cx + 0.6 * s).toFixed(2)} ${(cy - 3.6 * s).toFixed(2)} L${(cx - 2.2 * s).toFixed(2)} ${(cy + 0.6 * s).toFixed(2)} h${(2 * s).toFixed(2)} l-${(0.6 * s).toFixed(2)} ${(3 * s).toFixed(2)} L${(cx + 2.2 * s).toFixed(2)} ${(cy - 0.6 * s).toFixed(2)} h-${(2 * s).toFixed(2)} z`,
  { accent: true, fill: true, ...o }
);

const DOMAINS = [
  ['charging', 'EV Charging'],
  ['solar', 'Solar & Battery'],
  ['home', 'Home Energy'],
  ['grid', 'Grid, V2G & Trading'],
  ['fleet', 'Fleet & Workplace'],
  ['payments', 'Payments & ChargeBack'],
  ['crm', 'CRM & Partners'],
  ['install', 'Installation & Service'],
  ['club', 'Sports Club'],
  ['sustain', 'Sustainability'],
  ['users', 'Users, Roles & Settings'],
  ['ai', 'AI & Insights'],
  ['status', 'Notifications & Status'],
  ['actions', 'UI Actions'],
];

// existing icons kept as-is (files already downloaded) — listed for grid/zip/domain mapping
const EXISTING = [
  ['charging', 'charging', 'EV Charging'],
  ['charge-point', 'charging', 'Charge Point'],
  ['ev-car', 'charging', 'Electric Vehicle'],
  ['roaming', 'charging', 'Roaming & Locations'],
  ['solar', 'solar', 'Solar'],
  ['battery', 'solar', 'Battery Storage'],
  ['grid', 'grid', 'Grid / VPP'],
  ['v2g', 'grid', 'Vehicle-to-Grid'],
  ['trading', 'grid', 'Energy Trading'],
  ['smart-tariff', 'grid', 'Smart Tariffs'],
  ['fleet', 'fleet', 'Fleet'],
  ['drivers', 'fleet', 'Drivers & Teams'],
  ['payments', 'payments', 'Payments & Billing'],
  ['chargeback', 'payments', 'ChargeBack'],
  ['sustainability', 'sustain', 'Sustainability'],
  ['analytics', 'ai', 'Insights & Reporting'],
  ['sparky-ai', 'ai', 'Sparky AI Advisor'],
];

const NEW = [
  // ---------- EV Charging ----------
  ['charging-cable', 'charging', 'Charging Cable', [
    R(9, 2, 6, 7, 1), L(11, 2, 11, 1), L(13, 2, 13, 1),
    P('M12 9v3c0 4.5-8 3-8 8', { accent: true }),
  ]],
  ['connector-type2', 'charging', 'Type 2 Connector', [
    C(12, 12, 9), C(9, 9.5, 1.1, { accent: true, fill: true }), C(15, 9.5, 1.1, { accent: true, fill: true }),
    C(7.5, 14, 1.1, { accent: true, fill: true }), C(12, 14.5, 1.1, { accent: true, fill: true }), C(16.5, 14, 1.1, { accent: true, fill: true }),
  ]],
  ['rfid-card', 'charging', 'RFID Card', [
    R(2, 5, 20, 14, 2), R(5, 9, 4, 3, 0.5),
    P('M14 10a4 4 0 0 1 0 4', { accent: true }), P('M16.5 8a7 7 0 0 1 0 8', { accent: true }),
  ]],
  ['charging-session', 'charging', 'Charging Session', [C(12, 12, 9), bolt(12, 12, 0.9)]],
  ['charging-socket', 'charging', 'Wallbox Socket', [
    R(4, 4, 16, 16, 3), C(12, 12, 5),
    C(10, 13, 1, { accent: true, fill: true }), C(14, 13, 1, { accent: true, fill: true }), C(12, 10, 1, { accent: true, fill: true }),
  ]],
  ['dc-fast-charging', 'charging', 'DC Fast Charging', [
    P('M9.1 5.4 6.9 9.6h2l-.6 3 2.8-4.2h-2z'), bolt(14.8, 13.4, 1.15),
  ]],
  ['charging-schedule', 'charging', 'Charging Schedule', [
    R(3, 4, 18, 17, 2), L(3, 9, 21, 9), L(8, 2, 8, 6), L(16, 2, 16, 6), bolt(12, 15.5, 0.75),
  ]],
  ['kwh-meter', 'charging', 'kWh Meter', [
    P('M4.6 16.6a9 9 0 1 1 14.8 0'), L(12, 13, 15.8, 9.2, { accent: true }), C(12, 13, 1.2, { fill: true }),
    L(4, 21, 20, 21),
  ]],
  ['public-charging', 'charging', 'Public Charging', [
    P('M20 10c0 5.8-8 12-8 12S4 15.8 4 10a8 8 0 0 1 16 0z'), bolt(12, 10.4, 0.8),
  ]],
  ['charging-network', 'charging', 'Charging Network', [
    C(5, 6, 2.5), C(19, 6, 2.5), C(12, 18, 2.5, { accent: true }),
    L(7.5, 6, 16.5, 6), L(6.3, 8.2, 10.8, 16), L(17.7, 8.2, 13.2, 16),
  ]],
  ['smart-charging', 'charging', 'Smart Charging', [
    P('M17.5 18.5H9a6.5 6.5 0 1 1 6.23-8.36h2.27a4.18 4.18 0 1 1 0 8.36z'), bolt(12.6, 12.6, 0.75),
  ]],
  // ---------- Solar & Battery ----------
  ['solar-panel', 'solar', 'Solar Panel', [
    R(3, 4, 18, 12, 1), L(3, 10, 21, 10, { accent: true }), L(9, 4, 9, 16, { accent: true }), L(15, 4, 15, 16, { accent: true }),
    L(12, 16, 12, 20), L(8, 20, 16, 20),
  ]],
  ['inverter', 'solar', 'Inverter', [
    R(4, 4, 16, 16, 2), L(8, 9, 11, 9), L(13, 9, 16, 9),
    P('M8 14.5c1.3-2.6 2.7-2.6 4 0s2.7 2.6 4 0', { accent: true }),
  ]],
  ['battery-charging', 'solar', 'Battery Charging', [
    R(2, 8, 16, 8, 2), P('M21 11v2'), bolt(10, 12, 0.75),
  ]],
  ['energy-storage', 'solar', 'Energy Storage', [
    R(4, 4, 16, 7, 1.5), R(4, 13, 16, 7, 1.5),
    C(8, 7.5, 1, { accent: true, fill: true }), C(8, 16.5, 1, { accent: true, fill: true }),
    L(12, 7.5, 16.5, 7.5), L(12, 16.5, 16.5, 16.5),
  ]],
  ['self-consumption', 'solar', 'Self-Consumption', [
    P('M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z'),
    C(12, 15, 2.6, { accent: true }), L(12, 10.8, 12, 12), L(12, 18, 12, 19.2),
  ]],
  ['solar-yield', 'solar', 'Solar Yield', [
    C(7, 6.5, 2.6, { accent: true }), L(7, 1.5, 7, 2.3), L(2, 6.5, 2.8, 6.5), L(3.5, 3, 4.1, 3.6), L(10.5, 3, 9.9, 3.6),
    P('M3 21h18'), P('M5 17.5l4.5-4.5 3.5 2.5 6-6.5'),
  ]],
  // ---------- Home Energy ----------
  // home-energy mirrors the Home Energy Hub sub-brand mark (hub starburst):
  // central house + mini bolt with six radiating spokes ending in cyan nodes.
  ['home-energy', 'home', 'Home Energy Hub', [
    P('M12 7.8 8.6 10.8v4.9a.9.9 0 0 0 .9.9h5a.9.9 0 0 0 .9-.9v-4.9z'),
    bolt(12, 12.4, 0.62),
    L(12, 6.2, 12, 4.9), C(12, 3.4, 1.1, { accent: true, fill: true }),
    L(12, 18.3, 12, 19.1), C(12, 20.6, 1.1, { accent: true, fill: true }),
    L(16.4, 9.3, 17.8, 8.5), C(19.3, 7.6, 1.1, { accent: true, fill: true }),
    L(7.6, 9.3, 6.2, 8.5), C(4.7, 7.6, 1.1, { accent: true, fill: true }),
    L(16.4, 15.1, 17.8, 15.9), C(19.3, 16.8, 1.1, { accent: true, fill: true }),
    L(7.6, 15.1, 6.2, 15.9), C(4.7, 16.8, 1.1, { accent: true, fill: true }),
  ]],
  ['smart-meter', 'home', 'Smart Meter', [
    R(5, 3, 14, 18, 2), R(8, 6, 8, 4, 0.5, { accent: true }),
    C(9, 15, 1, { fill: true }), C(12, 15, 1, { fill: true }), C(15, 15, 1, { fill: true }),
  ]],
  ['p1-connection', 'home', 'P1 Connection', [
    R(6, 3, 12, 14, 2), L(9.5, 3, 9.5, 7, { accent: true }), L(12, 3, 12, 7, { accent: true }), L(14.5, 3, 14.5, 7, { accent: true }),
    P('M12 17v5'),
  ]],
  ['dynamic-load-balancing', 'home', 'Dynamic Load Balancing', [
    L(6, 4, 6, 20), L(12, 4, 12, 20), L(18, 4, 18, 20),
    C(6, 9, 2, { accent: true, fill: true }), C(12, 15, 2, { accent: true, fill: true }), C(18, 7, 2, { accent: true, fill: true }),
  ]],
  ['home-consumption', 'home', 'Home Consumption', [
    P('M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z'),
    P('M9 17a3 3 0 0 1 6 0', { accent: true }), L(12, 17, 13.7, 15.3, { accent: true }),
  ]],
  ['heat-pump', 'home', 'Heat Pump', [
    R(3, 6, 18, 12, 2), C(14.5, 12, 3.6, { accent: true }), C(14.5, 12, 1, { accent: true, fill: true }),
    L(6, 9.5, 8.5, 9.5), L(6, 12, 8.5, 12), L(6, 14.5, 8.5, 14.5),
  ]],
  ['smart-home', 'home', 'Smart Home', [
    P('M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z'),
    P('M9.4 13.9a4 4 0 0 1 5.2 0', { accent: true }), C(12, 16.5, 1, { accent: true, fill: true }),
  ]],
  ['energy-monitor', 'home', 'Energy Monitor', [
    R(2, 4, 20, 13, 2), L(12, 17, 12, 21), L(8, 21, 16, 21),
    P('M6 13 9 10l2.5 2L16 7.5', { accent: true }),
  ]],
  // ---------- Grid, V2G & Trading ----------
  ['virtual-power-plant', 'grid', 'Virtual Power Plant', [
    C(12, 12, 3, { accent: true }), C(4.5, 5, 2), C(19.5, 5, 2), C(4.5, 19, 2), C(19.5, 19, 2),
    L(6, 6.4, 9.7, 9.8), L(18, 6.4, 14.3, 9.8), L(6, 17.6, 9.7, 14.2), L(18, 17.6, 14.3, 14.2),
  ]],
  ['price-curve', 'grid', 'Price Curve', [
    P('M3 3v18h18'), P('M7 16l3.5-6.5 3 3.5 4.5-8', { accent: true }),
  ]],
  ['epex-day-ahead', 'grid', 'EPEX Day-Ahead', [
    P('M17.5 6.5a6.5 6.5 0 1 0 0 11'), L(7.5, 10.5, 14.5, 10.5, { accent: true }), L(7.5, 13.5, 13.5, 13.5, { accent: true }),
  ]],
  ['grid-flexibility', 'grid', 'Flexibility', [
    P('M8 18V6m0 0L5 9m3-3 3 3'), P('M16 6v12m0 0 3-3m-3 3-3-3', { accent: true }),
  ]],
  ['peak-shaving', 'grid', 'Peak Shaving', [
    P('M3 18c3.5 0 3-8 6.5-8h5c3.5 0 3 8 6.5 8'), L(8, 7, 16, 7, { accent: true, dash: '2.5 2.5' }),
  ]],
  ['grid-connection', 'grid', 'Grid Connection', [
    L(12, 3, 7, 21), L(12, 3, 17, 21), L(8.7, 9, 15.3, 9, { accent: true }), L(7.4, 14, 16.6, 14), L(5, 21, 19, 21),
  ]],
  // ---------- Fleet & Workplace ----------
  ['workplace-charging', 'fleet', 'Workplace Charging', [
    R(3, 3, 12, 18, 2), L(6.5, 7.5, 8.5, 7.5), L(9.5, 7.5, 11.5, 7.5), L(6.5, 11.5, 8.5, 11.5), L(9.5, 11.5, 11.5, 11.5),
    P('M7 21v-4h4v4'), bolt(19, 14, 0.85),
  ]],
  ['charging-depot', 'fleet', 'Charging Depot', [
    P('M3 21V8.5L12 3l9 5.5V21'), P('M8 21v-7h8v7', { accent: true }), L(8, 17, 16, 17, { accent: true }),
  ]],
  ['route-planning', 'fleet', 'Route Planning', [
    C(6, 19, 2.5), C(18, 5, 2.5, { accent: true }),
    P('M8.3 17.2C13.5 13.5 9.5 9.5 15.7 6.6', { dash: '3 3' }),
  ]],
  ['company-car', 'fleet', 'Lease & Company Cars', [
    P('M4 16.5H3a1 1 0 0 1-1-1V12l2.5-5.5h11L19.5 12H21a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1h-1'),
    C(7, 17, 2), C(17, 17, 2), L(9, 17, 15, 17), L(11.5, 6.5, 11.5, 12, { accent: true }),
  ]],
  ['mileage-log', 'fleet', 'Mileage Log', [
    R(3, 7, 18, 10, 2), L(7, 10.5, 7, 13.5, { accent: true }), L(10.3, 10.5, 10.3, 13.5, { accent: true }),
    L(13.7, 10.5, 13.7, 13.5, { accent: true }), L(17, 10.5, 17, 13.5, { accent: true }),
  ]],
  ['driver-app', 'fleet', 'Driver App', [
    R(7, 2, 10, 20, 2), L(11, 18.5, 13, 18.5), bolt(12, 10.5, 0.8),
  ]],
  // ---------- Payments & ChargeBack ----------
  ['invoice', 'payments', 'Invoice', [
    P('M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z'), P('M14 2v6h6'),
    L(8, 13, 14, 13, { accent: true }), L(8, 17, 12, 17, { accent: true }),
  ]],
  ['receipt', 'payments', 'Receipt', [
    P('M5 2v20l2-1.5 2.5 1.5 2.5-1.5 2.5 1.5 2.5-1.5 2 1.5V2l-2 1.5L14.5 2 12 3.5 9.5 2 7 3.5z'),
    L(9, 9, 15, 9, { accent: true }), L(9, 13, 13.5, 13, { accent: true }),
  ]],
  ['wallet', 'payments', 'Wallet', [
    R(3, 6, 18, 13, 2), P('M3 8V6.5A2.5 2.5 0 0 1 5.5 4H17'),
    C(16.5, 12.5, 1.1, { accent: true, fill: true }),
  ]],
  ['bank-reconciliation', 'payments', 'Bank & Reconciliation', [
    P('M3 9l9-6 9 6', { accent: true }), L(5, 12, 5, 17), L(9.7, 12, 9.7, 17), L(14.3, 12, 14.3, 17), L(19, 12, 19, 17),
    L(3, 21, 21, 21),
  ]],
  ['reimbursement', 'payments', 'Reimbursement', [
    P('M20.5 12A8.5 8.5 0 1 1 18 6'), P('M18 2v4h-4'),
    P('M13.8 9.8a3 3 0 1 0 0 4.4', { accent: true }), L(9.5, 11.6, 13, 11.6, { accent: true }),
  ]],
  ['payout', 'payments', 'Payout', [
    R(2, 7, 20, 10, 2), C(12, 12, 2.6, { accent: true }), C(5.8, 12, 0.6, { fill: true }), C(18.2, 12, 0.6, { fill: true }),
  ]],
  ['calculator', 'payments', 'Calculator', [
    R(6, 2, 12, 20, 2), L(9, 6.5, 15, 6.5),
    C(9.5, 11, 0.9, { fill: true }), C(14.5, 11, 0.9, { fill: true }),
    C(9.5, 14.5, 0.9, { fill: true }), C(14.5, 14.5, 0.9, { fill: true }),
    L(9, 18.5, 15, 18.5, { accent: true }),
  ]],
  ['billing-cycle', 'payments', 'Billing Cycle', [
    R(3, 4, 18, 17, 2), L(3, 9, 21, 9), L(8, 2, 8, 6), L(16, 2, 16, 6),
    P('M13.8 13.6a2.6 2.6 0 1 0 0 3.8', { accent: true }), L(10.4, 15.5, 13, 15.5, { accent: true }),
  ]],
  ['vat-tax', 'payments', 'VAT & Tax', [
    L(6, 18, 18, 6), C(7.5, 7.5, 2.5, { accent: true }), C(16.5, 16.5, 2.5),
  ]],
  // ---------- CRM & Partners ----------
  ['lead-capture', 'crm', 'Lead Capture', [
    C(9, 8, 4), P('M2 21a7 7 0 0 1 14 0'),
    L(19, 6, 19, 12, { accent: true }), L(16, 9, 22, 9, { accent: true }),
  ]],
  ['sales-pipeline', 'crm', 'Sales Pipeline', [
    P('M3 4h18l-7 8h-4z'), P('M10 12v8.5l4-2V12', { accent: true }),
  ]],
  ['deal-won', 'crm', 'Deals & Wins', [
    C(12, 12, 9), P('m8.5 12.5 2.5 2.5 5-5', { accent: true }),
  ]],
  ['contract-signature', 'crm', 'Contracts & Signatures', [
    P('M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z'), P('M14 2v6h6'),
    P('M8 16.5c1.5-2.5 2.5 1 4-1s2.5 1 4-1', { accent: true }),
  ]],
  ['partner-network', 'crm', 'Partner Network', [
    C(7, 8, 3), C(17, 8, 3), P('M2 20a5 5 0 0 1 10 0'), P('M12 20a5 5 0 0 1 10 0'),
    L(10, 8, 14, 8, { accent: true }),
  ]],
  ['email-campaign', 'crm', 'Email Campaigns', [
    R(2, 5, 16, 12, 2), P('M2 7.5 10 12.5 18 7.5'),
    P('M17.5 19.5h5m0 0-2-2m2 2-2 2', { accent: true }),
  ]],
  ['phone-call', 'crm', 'Calls', [
    P('M21.5 16.5v2.7a1.8 1.8 0 0 1-2 1.8 17.8 17.8 0 0 1-7.75-2.76 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3.6 5.1a1.8 1.8 0 0 1 1.8-2h2.7a1.8 1.8 0 0 1 1.8 1.55c.11.86.32 1.71.63 2.53a1.8 1.8 0 0 1-.4 1.9L9 10.2a14.4 14.4 0 0 0 5.4 5.4l1.12-1.13a1.8 1.8 0 0 1 1.9-.4c.82.3 1.67.52 2.53.63a1.8 1.8 0 0 1 1.55 1.8z'),
    P('M14.5 6.5a4 4 0 0 1 3 3', { accent: true }),
  ]],
  ['conversations', 'crm', 'Conversations', [
    P('M14 9a2 2 0 0 1-2 2H6l-4 3V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z'),
    P('M18 9h2a2 2 0 0 1 2 2v9l-4-3h-6a2 2 0 0 1-2-2v-2', { accent: true }),
  ]],
  ['organization', 'crm', 'Organizations', [
    R(4, 2, 16, 20, 2), L(8, 7, 10, 7), L(14, 7, 16, 7), L(8, 11, 10, 11), L(14, 11, 16, 11),
    P('M10 22v-4h4v4', { accent: true }),
  ]],
  // ---------- Installation & Service ----------
  ['installation', 'install', 'Installation', [
    P('M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'),
    bolt(19.6, 18, 0.6),
  ]],
  ['installer', 'install', 'Installer', [
    P('M5 14a7 7 0 0 1 14 0'), P('M3 17.5h18'), L(12, 7.5, 12, 12, { accent: true }), L(8.5, 21, 15.5, 21),
  ]],
  ['site-survey', 'install', 'Site Survey', [
    R(5, 4, 14, 17, 2), R(9, 2, 6, 4, 1),
    P('M12 9.5c1.9 0 3.4 1.4 3.4 3.1 0 2.3-3.4 5.1-3.4 5.1s-3.4-2.8-3.4-5.1c0-1.7 1.5-3.1 3.4-3.1z', { accent: true }),
  ]],
  ['commissioning', 'install', 'Commissioning', [
    R(5, 4, 14, 17, 2), R(9, 2, 6, 4, 1),
    P('m8.5 11 1.5 1.5 3-3', { accent: true }), P('m8.5 16.5 1.5 1.5 3-3', { accent: true }),
  ]],
  ['service-maintenance', 'install', 'Service & Maintenance', [
    P('M12 3.5l1.2 2.4a6.6 6.6 0 0 1 2.3 1.33l2.64-.5 1.5 2.6-1.87 1.94a6.6 6.6 0 0 1 0 2.66l1.87 1.94-1.5 2.6-2.64-.5a6.6 6.6 0 0 1-2.3 1.33L12 21.5l-1.2-2.16a6.6 6.6 0 0 1-2.3-1.33l-2.64.5-1.5-2.6 1.87-1.94a6.6 6.6 0 0 1 0-2.66L4.36 9.37l1.5-2.6 2.64.5a6.6 6.6 0 0 1 2.3-1.33z'),
    C(12, 12.5, 2.8, { accent: true }),
  ]],
  ['support-ticket', 'install', 'Support Tickets', [
    P('M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z'),
    L(14.5, 6, 14.5, 18, { accent: true, dash: '2.5 2.5' }),
  ]],
  ['warranty', 'install', 'Warranty', [
    P('M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z'), P('m9 11.5 2 2 4-4', { accent: true }),
  ]],
  ['firmware-update', 'install', 'Firmware Update', [
    R(7, 7, 10, 10, 1.5), L(9, 7, 9, 4), L(12, 7, 12, 4), L(15, 7, 15, 4), L(9, 17, 9, 20), L(12, 17, 12, 20), L(15, 17, 15, 20),
    P('M12 14.8v-4.2m0 0-1.8 1.8m1.8-1.8 1.8 1.8', { accent: true }),
  ]],
  ['inspection', 'install', 'Inspections', [
    C(10.5, 10.5, 6.5), L(15.4, 15.4, 21, 21), P('m8 10.5 2 2 3.5-3.5', { accent: true }),
  ]],
  ['service-van', 'install', 'Service Van', [
    P('M14 17H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h11z'), P('M14 8h3.5l4.5 4.5V16a1 1 0 0 1-1 1h-2'),
    C(6.5, 17, 2), C(17, 17, 2), L(17.5, 8, 17.5, 12.5, { accent: true }),
  ]],
  // ---------- Sports Club ----------
  ['club-badge', 'club', 'Club Badge', [
    P('M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z'),
    P('M12 7.6l1.2 2.3 2.5.4-1.8 1.8.4 2.5-2.3-1.2-2.3 1.2.4-2.5-1.8-1.8 2.5-.4z', { accent: true, fill: true }),
  ]],
  ['team', 'club', 'Teams', [
    C(9, 7, 4), P('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'),
    P('M22 21v-2a4 4 0 0 0-3-3.87', { accent: true }), P('M16 3.13a4 4 0 0 1 0 7.75', { accent: true }),
  ]],
  ['player', 'club', 'Players', [
    C(9, 7, 3.5), P('M3 21a6 6 0 0 1 12 0'), C(18, 16, 3.5, { accent: true }), C(18, 16, 0.9, { accent: true, fill: true }),
  ]],
  ['coach', 'club', 'Coaches', [
    C(8, 7, 3), P('M2 21a6 6 0 0 1 12 0'), R(14, 6, 7, 8, 1),
    L(16, 8.5, 17.4, 9.9, { accent: true }), L(17.4, 8.5, 16, 9.9, { accent: true }), C(18.8, 11.8, 0.9, { accent: true }),
  ]],
  ['match-day', 'club', 'Match Day', [
    R(3, 4, 18, 17, 2), L(3, 9, 21, 9), L(8, 2, 8, 6), L(16, 2, 16, 6), C(12, 15, 2.6, { accent: true }),
  ]],
  ['training', 'club', 'Training', [
    P('M9.8 4h4.4L17 20H7z'), L(8.4, 12.5, 15.6, 12.5, { accent: true }), L(4.5, 20, 19.5, 20),
  ]],
  ['club-charging', 'club', 'Club Charging', [
    P('M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z'), bolt(12, 11.4, 0.85),
  ]],
  ['federation', 'club', 'Federations', [
    R(9, 3, 6, 5, 1, { accent: true }), R(2, 16, 6, 5, 1), R(16, 16, 6, 5, 1),
    P('M12 8v4M5 16v-2h14v2'),
  ]],
  ['scoreboard', 'club', 'Scoreboard', [
    R(3, 5, 18, 12, 2), L(12, 5, 12, 17), C(7.5, 11, 1.2, { accent: true, fill: true }), C(16.5, 11, 1.2, { accent: true, fill: true }),
    L(8, 21, 16, 21), L(12, 17, 12, 21),
  ]],
  // ---------- Sustainability ----------
  ['co2-reduction', 'sustain', 'CO₂ Reduction', [
    P('M17.5 14H9a5.5 5.5 0 1 1 5.27-7.1H16a4.05 4.05 0 0 1 1.5 7.1z'),
    P('M12 16v5.5m0 0-2.2-2.2m2.2 2.2 2.2-2.2', { accent: true }),
  ]],
  ['green-energy', 'sustain', 'Green Energy', [
    P('M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z'),
    P('M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12', { accent: true }),
  ]],
  ['carbon-report', 'sustain', 'Carbon Reporting', [
    P('M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z'), P('M14 2v6h6'),
    P('M9 17.5c0-2.8 2.2-5 5-5 0 2.8-2.2 5-5 5z', { accent: true }), L(9, 17.5, 7.8, 18.7, { accent: true }),
  ]],
  ['renewable-cycle', 'sustain', 'Renewable Cycle', [
    P('M20.5 12A8.5 8.5 0 1 1 18 6'), P('M18 2v4h-4'),
    P('M10 13.5c0-2.2 1.8-4 4-4 0 2.2-1.8 4-4 4z', { accent: true }),
  ]],
  ['ev-transition', 'sustain', 'EV Transition', [
    P('M4 17.5H3a1 1 0 0 1-1-1V13l2.5-5h11l3 5H21a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1h-1'),
    C(7, 18, 2), C(17, 18, 2), L(9, 18, 15, 18),
    P('M13.5 4.5c0-1.7 1.3-3 3-3 0 1.7-1.3 3-3 3z', { accent: true }),
  ]],
  // ---------- Users, Roles & Settings ----------
  ['user-profile', 'users', 'User Profile', [
    C(12, 8, 4), P('M4 21a8 8 0 0 1 16 0', { accent: true }),
  ]],
  ['user-roles', 'users', 'User Roles', [
    C(9, 7.5, 3.5), P('M3 21a6 6 0 0 1 9-5.2'),
    P('M17 10.5l3.5 1.3v2.9c0 2.2-1.4 4.1-3.5 4.7-2.1-.6-3.5-2.5-3.5-4.7v-2.9z', { accent: true }),
  ]],
  ['permissions', 'users', 'Permissions', [
    C(7.5, 15.5, 4), L(10.4, 12.6, 20, 3), L(16, 7, 18.5, 9.5, { accent: true }), L(19, 4, 21, 6, { accent: true }),
  ]],
  ['settings', 'users', 'Settings', [
    L(4, 7, 20, 7), L(4, 12, 20, 12), L(4, 17, 20, 17),
    C(9, 7, 2, { accent: true, fill: true }), C(15, 12, 2, { accent: true, fill: true }), C(7, 17, 2, { accent: true, fill: true }),
  ]],
  ['security', 'users', 'Security', [
    R(5, 11, 14, 9, 2), P('M8 11V7a4 4 0 0 1 8 0v4'), C(12, 15.5, 1.4, { accent: true, fill: true }),
  ]],
  ['developer-api', 'users', 'Developer API', [
    P('m8 8-4 4 4 4'), P('m16 8 4 4-4 4'), L(13.5, 5.5, 10.5, 18.5, { accent: true }),
  ]],
  ['multi-language', 'users', 'Multi-Language', [
    C(12, 12, 9), L(3, 12, 21, 12), P('M12 3a15.3 15.3 0 0 1 0 18 15.3 15.3 0 0 1 0-18z', { accent: true }),
  ]],
  ['activity-log', 'users', 'Activity Log', [
    L(9, 6, 20, 6), L(9, 12, 20, 12), L(9, 18, 20, 18),
    C(4.5, 6, 1.1, { accent: true, fill: true }), C(4.5, 12, 1.1, { accent: true, fill: true }), C(4.5, 18, 1.1, { accent: true, fill: true }),
  ]],
  // ---------- AI & Insights ----------
  ['reporting', 'ai', 'Reporting', [
    L(3, 21, 21, 21), L(6.5, 20, 6.5, 13), L(12, 20, 12, 5, { accent: true }), L(17.5, 20, 17.5, 9),
  ]],
  ['forecast', 'ai', 'Forecast', [
    P('M3 17l6-6 4 4 8-8'), P('M15 7h6v6', { accent: true }),
  ]],
  ['ai-automation', 'ai', 'AI Automation', [
    R(5, 8, 14, 11, 2), L(12, 8, 12, 5), C(12, 3.8, 1, { accent: true, fill: true }),
    C(9.5, 13, 1, { accent: true, fill: true }), C(14.5, 13, 1, { accent: true, fill: true }), L(10, 16, 14, 16),
  ]],
  // ---------- Notifications & Status ----------
  ['notification', 'status', 'Notifications', [
    P('M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'), P('M10.3 21a1.94 1.94 0 0 0 3.4 0', { accent: true }),
  ]],
  ['alert', 'status', 'Alerts', [
    P('m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z'),
    L(12, 9, 12, 13, { accent: true }), C(12, 17, 0.9, { accent: true, fill: true }),
  ]],
  ['success', 'status', 'Success', [
    C(12, 12, 9), P('m8 12.5 2.5 2.5 5.5-5.5', { accent: true }),
  ]],
  ['error-state', 'status', 'Errors', [
    C(12, 12, 9), L(9.5, 9.5, 14.5, 14.5, { accent: true }), L(14.5, 9.5, 9.5, 14.5, { accent: true }),
  ]],
  ['status-online', 'status', 'Online Status', [
    L(5, 20, 5, 16), L(10, 20, 10, 12), L(15, 20, 15, 8, { accent: true }), L(20, 20, 20, 4, { accent: true }),
  ]],
  ['offline-mode', 'status', 'Offline', [
    P('M5 10a11 11 0 0 1 14 0'), P('M8.5 13.5a6.5 6.5 0 0 1 7 0'), C(12, 17.5, 1, { fill: true }),
    L(4, 4, 20, 20, { accent: true }),
  ]],
  ['pending-status', 'status', 'Pending', [
    C(12, 12, 9), P('M12 7v5l3 3', { accent: true }),
  ]],
  ['sync-status', 'status', 'Sync', [
    P('M21 12a9 9 0 1 1-2.64-6.36'), P('M21 3v5h-5', { accent: true }),
  ]],
  // ---------- UI Actions ----------
  ['search', 'actions', 'Search', [C(10.5, 10.5, 6.5), L(15.4, 15.4, 21, 21, { accent: true })]],
  ['filter', 'actions', 'Filter', [P('M3 5h18l-7 8v6l-4 2v-8z'), L(10, 5, 14, 5, { accent: true })]],
  ['download', 'actions', 'Download', [
    P('M12 3v12m0 0-4-4m4 4 4-4', { accent: true }), P('M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2'),
  ]],
  ['upload', 'actions', 'Upload', [
    P('M12 15V3m0 0-4 4m4-4 4 4', { accent: true }), P('M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2'),
  ]],
  ['edit', 'actions', 'Edit', [
    P('M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z'), L(14.5, 5.5, 18.5, 9.5, { accent: true }),
  ]],
  ['delete', 'actions', 'Delete', [
    P('M3 6h18'), P('M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'), P('M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'),
    L(10, 11, 10, 17, { accent: true }), L(14, 11, 14, 17, { accent: true }),
  ]],
  ['add', 'actions', 'Add', [C(12, 12, 9), L(12, 8, 12, 16, { accent: true }), L(8, 12, 16, 12, { accent: true })]],
  ['close', 'actions', 'Close', [L(6, 6, 18, 18), L(18, 6, 6, 18, { accent: true })]],
  ['share', 'actions', 'Share', [
    C(6, 12, 2.5), C(18, 5, 2.5, { accent: true }), C(18, 19, 2.5),
    L(8.2, 10.7, 15.8, 6.3), L(8.2, 13.3, 15.8, 17.7),
  ]],
  ['link', 'actions', 'Link', [
    P('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'),
    P('M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71', { accent: true }),
  ]],
  ['copy', 'actions', 'Copy', [
    R(9, 9, 12, 12, 2), P('M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1', { accent: true }),
  ]],
  ['export', 'actions', 'Export', [
    P('M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z'), P('M14 2v6h6'),
    P('M12 17.5v-6m0 0-2 2m2-2 2 2', { accent: true }),
  ]],
  ['calendar', 'actions', 'Calendar', [
    R(3, 4, 18, 17, 2), L(8, 2, 8, 6), L(16, 2, 16, 6), L(3, 9, 21, 9, { accent: true }),
  ]],
  ['more-options', 'actions', 'More Options', [
    C(5, 12, 1.5, { fill: true }), C(12, 12, 1.5, { accent: true, fill: true }), C(19, 12, 1.5, { fill: true }),
  ]],
];

function renderEl(el, white) {
  const navy = white ? '#FFFFFF' : NAVY;
  const stroke = el.accent ? CYAN : navy;
  const a = { ...el.attrs };
  let attrs = Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ');
  if (el.fill) {
    return `<${el.tag} ${attrs} fill="${stroke}" stroke="${stroke}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const dash = el.dash ? ` stroke-dasharray="${el.dash}"` : '';
  return `<${el.tag} ${attrs} fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${dash}/>`;
}

function renderIcon(els, white) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">${els.map(e => renderEl(e, white)).join('')}</svg>`;
}

const manifest = [];
for (const [slug, domain, label] of EXISTING) {
  manifest.push({ slug, domain, label, existing: true });
}
for (const [slug, domain, label, els] of NEW) {
  fs.writeFileSync(path.join(OUT, `cc-icon-${slug}.svg`), renderIcon(els, false));
  fs.writeFileSync(path.join(OUT, `cc-icon-${slug}-white.svg`), renderIcon(els, true));
  manifest.push({ slug, domain, label, existing: false });
}

// order manifest by domain order then label
const dIndex = Object.fromEntries(DOMAINS.map(([id], i) => [id, i]));
manifest.sort((a, b) => (dIndex[a.domain] - dIndex[b.domain]) || a.label.localeCompare(b.label));
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ domains: DOMAINS, icons: manifest }, null, 1));
console.log(`icons total: ${manifest.length} (new: ${NEW.length}, existing: ${EXISTING.length})`);
const files = fs.readdirSync(OUT).filter(f => f.endsWith('.svg'));
console.log('svg files:', files.length);

/* ============================================================================
 * DERIVED OUTPUTS — preview sheet, PNG, ZIP, and the #iconset grid in
 * index.html are ALL regenerated here from the manifest so they can never
 * drift from the set (Task #4869). Everything below is deterministic:
 * running this script twice in a row produces byte-identical outputs.
 * ==========================================================================*/
import zlib from 'zlib';
import crypto from 'crypto';

const writeIfChanged = (file, content) => {
  const buf = Buffer.isBuffer(content) ? content : Buffer.from(content);
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buf)) return false;
  fs.writeFileSync(file, buf);
  return true;
};
const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const domainLabel = Object.fromEntries(DOMAINS);
const iconInner = slug => {
  const s = fs.readFileSync(path.join(OUT, `cc-icon-${slug}.svg`), 'utf8');
  return s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
};

/* ---------- 1. icon-set-preview.svg (8 cells/row, 148x104 grid) ---------- */
const CELL_W = 148, ROW_H = 104, LEFT = 58, TOP_GAP = 24, SECTION_GAP = 128;
const byDomain = DOMAINS.map(([id, label]) => [id, label, manifest.filter(m => m.domain === id)])
  .filter(([, , icons]) => icons.length > 0);

let body = '', headerY = 134;
for (const [, label, icons] of byDomain) {
  body += `<text x="16" y="${headerY}" font-family="Outfit" font-size="17" font-weight="600" fill="#0B2347">${xml(label)}</text>\n`;
  body += `<text x="${32 + 7.5 * label.length}" y="${headerY}" font-family="Inter" font-size="12" fill="#64748B">${icons.length} icons</text>\n`;
  let rowY = headerY + TOP_GAP;
  icons.forEach((m, i) => {
    const col = i % 8;
    if (i > 0 && col === 0) rowY += ROW_H;
    const x = LEFT + col * CELL_W;
    body += `<g transform="translate(${x},${rowY}) scale(2)">${iconInner(m.slug)}</g>\n`;
    body += `<text x="${x + 24}" y="${rowY + 66}" text-anchor="middle" font-family="Inter" font-size="10.5" fill="#334155">${xml(m.label)}</text>\n`;
  });
  headerY = rowY + SECTION_GAP;
}
const totalH = headerY - SECTION_GAP + 130;
const previewSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${totalH}" viewBox="0 0 1200 ${totalH}">\n` +
  `<rect width="100%" height="100%" fill="#FFFFFF"/>\n` +
  `<rect x="0" y="0" width="1200" height="84" fill="#0B2347"/>\n` +
  `<text x="16" y="36" font-family="Outfit" font-size="24" font-weight="700" fill="#FFFFFF">ChargeControl Icon Set</text>\n` +
  `<text x="16" y="62" font-family="Inter" font-size="13" fill="#7DD3FC">${manifest.length} icons \u00b7 24px grid \u00b7 stroke 2 \u00b7 round caps \u00b7 navy #0B2347 + cyan #0EA5E9 \u00b7 primary and white-on-dark variants</text>\n` +
  body + `</svg>`;
const previewPath = path.join(OUT, 'icon-set-preview.svg');
const svgChanged = writeIfChanged(previewPath, previewSvg);
console.log(`icon-set-preview.svg: ${svgChanged ? 'UPDATED' : 'unchanged'} (${totalH}px tall)`);

/* ---------- 2. icon-set-preview.png (sharp; only when the SVG changed) ---- */
const pngPath = path.join(OUT, 'icon-set-preview.png');
if (svgChanged || !fs.existsSync(pngPath)) {
  try {
    let sharp;
    try {
      sharp = (await import('sharp')).default;
    } catch {
      // fall back to resolving from the CWD (e.g. a workspace with sharp installed)
      const { createRequire } = await import('module');
      sharp = createRequire(path.join(process.cwd(), 'noop.js'))('sharp');
    }
    // Outfit/Inter must be installed as system fonts (e.g. ~/.fonts + fc-cache)
    const png = await sharp(Buffer.from(previewSvg), { density: 96 }).png().toBuffer();
    fs.writeFileSync(pngPath, png);
    console.log(`icon-set-preview.png: rasterized (${png.length} bytes)`);
  } catch (e) {
    console.error(`icon-set-preview.png: FAILED to rasterize — ${e.message}`);
    console.error('Install sharp + Outfit/Inter fonts (~/.fonts, fc-cache -f) and re-run.');
    process.exitCode = 1;
  }
} else {
  console.log('icon-set-preview.png: unchanged (SVG identical)');
}

/* ---------- 3. chargecontrol-icon-set.zip (deterministic, stored) --------- */
function buildZip(entries) { // entries: [name, Buffer] sorted; fixed DOS date
  const dosTime = 0, dosDate = (2026 - 1980) << 9 | (1 << 5) | 1; // 2026-01-01 00:00
  const files = [], central = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const nameBuf = Buffer.from(name);
    const crc = zlib.crc32 ? zlib.crc32(data) : (() => { // node <20.15 fallback
      let c = ~0; for (const b of data) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)); } return ~c >>> 0;
    })();
    const comp = zlib.deflateRawSync(data, { level: 9 });
    const method = comp.length < data.length ? 8 : 0;
    const payload = method === 8 ? comp : data;
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(method, 8); lh.writeUInt16LE(dosTime, 10); lh.writeUInt16LE(dosDate, 12);
    lh.writeUInt32LE(crc >>> 0, 14); lh.writeUInt32LE(payload.length, 18); lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26); lh.writeUInt16LE(0, 28);
    files.push(lh, nameBuf, payload);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(0, 8);
    ch.writeUInt16LE(method, 10); ch.writeUInt16LE(dosTime, 12); ch.writeUInt16LE(dosDate, 14);
    ch.writeUInt32LE(crc >>> 0, 16); ch.writeUInt32LE(payload.length, 20); ch.writeUInt32LE(data.length, 24);
    ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt32LE(offset, 42);
    central.push(ch, nameBuf);
    offset += 30 + nameBuf.length + payload.length;
  }
  const cd = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(entries.length, 8); eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12); eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...files, cd, eocd]);
}
const zipNames = manifest.flatMap(m => [`cc-icon-${m.slug}.svg`, `cc-icon-${m.slug}-white.svg`]).sort();
const zipEntries = zipNames.map(n => [n, fs.readFileSync(path.join(OUT, n))]);
const zipPath = path.join(OUT, 'chargecontrol-icon-set.zip');
const zipChanged = writeIfChanged(zipPath, buildZip(zipEntries));
console.log(`chargecontrol-icon-set.zip: ${zipChanged ? 'UPDATED' : 'unchanged'} (${zipEntries.length} files)`);

/* ---------- 4. index.html #iconset grid + icon counts --------------------- */
// ?v= stamps use the same 10-char git blob sha convention as
// scripts/version-brand-guide-assets.mjs (idempotent with it).
const REPO_ROOT = path.resolve(OUT, '..', '..');
const INDEX = path.join(REPO_ROOT, 'index.html');
const blobV = rel => {
  const buf = fs.readFileSync(path.join(REPO_ROOT, rel));
  return crypto.createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex').slice(0, 10);
};
if (!fs.existsSync(INDEX) || !fs.existsSync(path.join(OUT, 'manifest.json'))) {
  console.log('index.html: skipped (not running inside the brand-guide repo)');
} else {
  let html = fs.readFileSync(INDEX, 'utf8');
  const N = manifest.length;
  // counts (4 spots)
  html = html.replace(/\d+ product-domain icons/, `${N} product-domain icons`);
  html = html.replace(/all \d+ icons, both variants/, `all ${N} icons, both variants`);
  html = html.replace(/Search \d+ icons&hellip;/, `Search ${N} icons&hellip;`);
  html = html.replace(/(id="icon-count"[^>]*>)\d+ icons</, `$1${N} icons<`);
  // iconset asset refs (preview png/svg, zip, generator, manifest) — restamp ?v
  for (const rel of ['assets/iconset/icon-set-preview.png', 'assets/iconset/icon-set-preview.svg',
    'assets/iconset/chargecontrol-icon-set.zip', 'assets/iconset/generate-icons.mjs',
    'assets/iconset/manifest.json']) {
    html = html.replaceAll(new RegExp(`${rel.replace(/[./]/g, '\\$&')}(\\?v=[0-9a-f]+)?`, 'g'), `${rel}?v=${blobV(rel)}`);
  }
  // domain pills
  const pills = `  <div id="icon-pills" style="margin-bottom:20px"><span class="pill active" data-dom="" onclick="ccIconDomain(this)">All</span>` +
    byDomain.map(([id, label]) => `<span class="pill" data-dom="${id}" onclick="ccIconDomain(this)">${xml(label)}</span>`).join('') + `</div>`;
  html = html.replace(/^ {2}<div id="icon-pills".*$/m, pills);
  // icon groups (between the pills line and the #icon-empty line)
  const groups = byDomain.map(([id, label, icons]) => {
    const cards = icons.map(m => {
      const lbl = xml(m.label);
      const v1 = blobV(`assets/iconset/cc-icon-${m.slug}.svg`);
      const v2 = blobV(`assets/iconset/cc-icon-${m.slug}-white.svg`);
      const src = `assets/iconset/cc-icon-${m.slug}.svg?v=${v1}`;
      return `    <div class="card icon-card" data-dom="${id}" data-s="${xml(m.label.toLowerCase())} ${m.slug}">` +
        `<div class="preview" style="min-height:76px;padding:14px"><img src="${src}" alt="${lbl}" style="width:40px;height:40px" loading="lazy"></div>` +
        `<div class="pad" style="padding:10px 12px"><h4 style="font-size:.8rem">${lbl}</h4>` +
        `<a class="dl" href="${src}" download>SVG</a>` +
        `<a class="dl" href="assets/iconset/cc-icon-${m.slug}-white.svg?v=${v2}" download>White</a></div></div>`;
    }).join('\n');
    return `  <div class="icon-group" data-dom="${id}"><h3>${xml(label)} <span class="meta" style="font-weight:400;font-size:.8rem">&middot; ${icons.length}</span></h3>\n  <div class="grid g6">\n${cards}\n  </div></div>`;
  }).join('\n');
  html = html.replace(
    /(^ {2}<div id="icon-pills".*$\n)[\s\S]*?(^ {2}<p id="icon-empty")/m,
    (m, a, b) => `${a}${groups}\n${b}`
  );
  const htmlChanged = writeIfChanged(INDEX, html);
  console.log(`index.html #iconset: ${htmlChanged ? 'UPDATED' : 'unchanged'}`);
}
