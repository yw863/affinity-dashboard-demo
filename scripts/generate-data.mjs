// Mock data generator for Affinity × AI demo.
// Usage: node scripts/generate-data.mjs
// Writes data-core.js + one data-<id>.js per formula into the project root,
// then re-loads those files from disk and prints the verification report.
//
// Output format: classic scripts attaching to window.AFFINITY_DATA
// (works when index.html is opened via file://, unlike ES modules).
// Load order in index.html: data-core.js first, then each data-<id>.js.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ATTRIBUTES = [
  "COVERAGE", "REFLECTION vs. BARE", "UNEVEN SKINTONE", "POWDERY",
  "CAKEY", "FLAKE", "IMBED INTO LINES", "CLOG INTO PORES",
];
const TIMES = ["T0", "T3", "T6"];
const TOLERANCE = 0.5;

// ---- Panel ground truth ---------------------------------------------------
// T0 baselines. LANCOME TIU follows the shape of the real panel chart
// (coverage ~4, everything else clustered ~0.5–1.3).
const FORMULAS = [
  { id: "nars-lightr",   name: "NARS LightR",   ours: false, wear: 1.0,
    t0: [3.3, 1.5, 1.4, 0.9, 0.8, 0.7, 0.5, 0.6] },   // light, radiant
  { id: "lancome-tiu",   name: "LANCOME TIU",   ours: true,  wear: 1.0,
    t0: [4.0, 1.0, 1.2, 1.3, 1.1, 0.9, 0.5, 0.7] },   // from real chart
  { id: "ysl-all-hours", name: "YSL All Hours", ours: true,  wear: 1.4,
    t0: [4.5, 0.8, 1.0, 1.6, 1.4, 1.2, 0.9, 1.0] },   // full-cover matte
];

// Cells the user adjusted by hand after reviewing the output, kept here so a re-run
// reproduces the approved data instead of silently reverting them. Applied after the
// draw, so they never shift the seed search. Indices are [time][attribute].
const OVERRIDES = {
  "lancome-tiu": { T0: { 0: { panel: 4.3, ai: 4.1 } } },   // COVERAGE
};

// Wear drift from T0, [T3, T6], scaled by formula.wear.
// Coverage fades; shine breaks through; texture defects accumulate.
const DRIFT = [
  [-0.10, -0.25], [0.05, 0.15], [0.05, 0.15], [0.10, 0.30],
  [0.10, 0.30],   [0.05, 0.20], [0.10, 0.30], [0.10, 0.25],
];

// ---- AI error model -------------------------------------------------------
// error = per (formula, attribute) bias  +  per-time jitter.
// The shared bias keeps T0/T3/T6 AI curves similar, like a real model would.
// REFLECTION vs. BARE (index 1) is intentionally noisier.
const SIGMA_BIAS = [0.25, 0.32, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25];
const SIGMA_TIME = [0.20, 0.25, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20];
const PANEL_JITTER = 0.05;

// ---- Seeded RNG -----------------------------------------------------------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (rng) => {
  const u = 1 - rng(), v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const r1 = (x) => Math.round(Math.min(6, Math.max(0, x)) * 10) / 10;
// Compare in tenths to avoid float noise (0.5 must count as accepted).
const diffTenths = (c) => Math.abs(Math.round(c.ai * 10) - Math.round(c.panel * 10));
const accepted = (c) => diffTenths(c) <= TOLERANCE * 10;

function generate(seed) {
  const rng = mulberry32(seed);
  return FORMULAS.map((f) => {
    const bias = ATTRIBUTES.map((_, a) => gauss(rng) * SIGMA_BIAS[a]);
    const scores = {};
    TIMES.forEach((t, ti) => {
      scores[t] = ATTRIBUTES.map((_, a) => {
        const drift = ti === 0 ? 0 : DRIFT[a][ti - 1] * f.wear;
        const panel = r1(f.t0[a] + drift + gauss(rng) * PANEL_JITTER);
        const ai = r1(panel + bias[a] + gauss(rng) * SIGMA_TIME[a]);
        return { panel, ai };
      });
    });
    const over = OVERRIDES[f.id];
    if (over) {
      for (const t of Object.keys(over)) {
        for (const a of Object.keys(over[t])) scores[t][a] = { ...over[t][a] };
      }
    }
    return { id: f.id, name: f.name, ours: f.ours, scores };
  });
}

// ---- Metrics (same definitions the front end will use, DESIGN §4.3) ------
function metrics(formulas) {
  const cells = [];
  formulas.forEach((f) => TIMES.forEach((t) =>
    f.scores[t].forEach((c, a) => cells.push({ f, t, a, c }))));
  const acc = (xs) => xs.filter((x) => accepted(x.c)).length / xs.length;
  return {
    global: { acc: acc(cells), hit: cells.filter((x) => accepted(x.c)).length, n: cells.length },
    perAttr: ATTRIBUTES.map((_, a) => {
      const xs = cells.filter((x) => x.a === a);
      return { acc: acc(xs), hit: xs.filter((x) => accepted(x.c)).length, n: xs.length };
    }),
    perFormula: formulas.map((f) => {
      const xs = cells.filter((x) => x.f === f);
      const mae = Object.fromEntries(TIMES.map((t) =>
        [t, f.scores[t].reduce((s, c) => s + diffTenths(c) / 10, 0) / 8]));
      return { f, acc: acc(xs), hit: xs.filter((x) => accepted(x.c)).length, n: xs.length, mae };
    }),
    maxErr: Math.max(...cells.map((x) => diffTenths(x.c) / 10)),
  };
}

const WEAR = [3, 4, 5, 6, 7]; // POWDERY … CLOG
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

function storyHolds(formulas) {
  const m = metrics(formulas);
  if (m.global.acc < 0.83 || m.global.acc > 0.85) return false;
  // REFLECTION strictly the least accurate attribute, but only "a little"
  // noisier (5–6 of 9); others 7–9 of 9, and not a wall of perfect scores.
  const refl = m.perAttr[1];
  if (refl.hit < 5 || refl.hit > 6) return false;
  if (!m.perAttr.every((p, a) => a === 1 || p.hit >= 7)) return false;
  if (m.perAttr.filter((p) => p.hit === 9).length > 3) return false;
  if (m.maxErr > 0.8) return false;
  // Showcase formulas all look good; default view (NARS T0) strong.
  if (!m.perFormula.every((p) => p.acc >= 0.79 && Object.values(p.mae).every((v) => v <= 0.4))) return false;
  // Default view (NARS LightR, T0) is the best-looking formula.
  if (!m.perFormula.slice(1).every((p) => m.perFormula[0].acc > p.acc)) return false;
  if (formulas[0].scores.T0.filter(accepted).length < 7) return false;
  if (!formulas[0].scores.T0.every((c) => diffTenths(c) <= 6)) return false;
  for (const f of formulas) {
    // Physics: wear attributes rise T0→T6 (panel), coverage falls.
    if (!WEAR.every((a) => f.scores.T6[a].panel > f.scores.T0[a].panel)) return false;
    if (!(f.scores.T6[0].panel < f.scores.T0[0].panel)) return false;
  }
  // NOTE: an earlier version also required every `ours` formula to out-wear the
  // market ones at T6. That constraint is gone on purpose. `ours` is a presentation
  // label the user sets by hand, not a property of the simulated physics: YSL is
  // deliberately the worst-wearing formula here (full-cover matte, wear 1.4), so a
  // rule tying the label to the wear ranking made the two contradict each other and
  // pushed the seed search off the approved data. Wear behaviour is constrained
  // above, per formula; who owns a formula is not the generator's business.
  return true;
}

// ---- Search the first seed where the story holds -------------------------
let seed = 1;
let formulas;
for (; seed < 100000; seed++) {
  formulas = generate(seed);
  if (storyHolds(formulas)) break;
}
if (seed >= 100000) throw new Error("No seed satisfies the story constraints");

// ---- Write files ----------------------------------------------------------
const header = (what) =>
  `// ${what}\n// Generated by scripts/generate-data.mjs (seed ${seed}). Do not edit by hand.\n`;

fs.writeFileSync(path.join(ROOT, "data-core.js"),
  header("Affinity × AI — shared dimensions. Load before any data-<formula>.js.") +
  `window.AFFINITY_DATA = {\n` +
  `  attributes: ${JSON.stringify(ATTRIBUTES)},\n` +
  `  times: ${JSON.stringify(TIMES)},\n` +
  `  formulas: []\n};\n`);

for (const f of formulas) {
  const body = TIMES.map((t) =>
    `    ${t}: [\n` +
    f.scores[t].map((c, a) =>
      `      { panel: ${c.panel.toFixed(1)}, ai: ${c.ai.toFixed(1)} }, // ${ATTRIBUTES[a]}`).join("\n") +
    `\n    ]`).join(",\n");
  fs.writeFileSync(path.join(ROOT, `data-${f.id}.js`),
    header(`Affinity × AI — ${f.name}`) +
    `window.AFFINITY_DATA.formulas.push({\n` +
    `  id: ${JSON.stringify(f.id)},\n  name: ${JSON.stringify(f.name)},\n  ours: ${f.ours},\n` +
    `  scores: {\n${body}\n  }\n});\n`);
}

// ---- Verify from the written files (not from memory) ---------------------
const ctx = { window: {} };
vm.createContext(ctx);
for (const file of ["data-core.js", ...FORMULAS.map((f) => `data-${f.id}.js`)]) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), ctx, { filename: file });
}
const D = ctx.window.AFFINITY_DATA;
const m = metrics(D.formulas);
const pct = (x) => (x * 100).toFixed(1) + "%";
const pad = (s, n) => String(s).padEnd(n);

console.log(`seed ${seed} · tolerance ±${TOLERANCE} · ${D.formulas.length} formulas × ${D.times.length} times × ${D.attributes.length} attributes`);
console.log(`\nGLOBAL ACCURACY  ${pct(m.global.acc)}  (${m.global.hit}/${m.global.n})   max |Δ| ${m.maxErr.toFixed(1)}`);

console.log(`\nPER ATTRIBUTE`);
m.perAttr.forEach((p, a) => console.log(`  ${pad(D.attributes[a], 22)} ${pad(pct(p.acc), 7)} (${p.hit}/${p.n})`));

console.log(`\nPER FORMULA                accuracy        MAE T0 / T3 / T6`);
m.perFormula.forEach((p) => console.log(
  `  ${pad(p.f.name + (p.f.ours ? " ●" : " ○"), 22)} ${pad(pct(p.acc), 6)} (${p.hit}/${p.n})   ` +
  TIMES.map((t) => p.mae[t].toFixed(2)).join(" / ")));

console.log(`\nT0 vs T6 MEAN (panel / ai, across formulas)`);
D.attributes.forEach((name, a) => {
  const at = (t, k) => mean(D.formulas.map((f) => f.scores[t][a][k]));
  const d = at("T6", "panel") - at("T0", "panel");
  console.log(`  ${pad(name, 22)} T0 ${at("T0", "panel").toFixed(2)} / ${at("T0", "ai").toFixed(2)}   ` +
    `T6 ${at("T6", "panel").toFixed(2)} / ${at("T6", "ai").toFixed(2)}   Δpanel ${d >= 0 ? "+" : ""}${d.toFixed(2)}`);
});

console.log(`\nAFFINITY (mean panel of POWDERY…CLOG at T6, lower = better)`);
D.formulas.forEach((f) => console.log(
  `  ${pad(f.name + (f.ours ? " ●" : " ○"), 22)} ${mean(WEAR.map((a) => f.scores.T6[a].panel)).toFixed(2)}`));
