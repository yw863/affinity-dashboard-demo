/**
 * Builds specimens/font-proof.html.
 *
 * The page takes the font bytes straight out of index.html's embedded block — not a
 * fresh download — and puts them against Google Fonts' own copy at the same size,
 * first side by side, then overlaid in two colours. If the shapes are the same font,
 * the overlay is a single clean outline; if they are not, it smears.
 *
 *   node scripts/make-font-proof.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const block = html.slice(html.indexOf("<!--fonts:start-->"), html.indexOf("<!--fonts:end-->"));

const re =
  /@font-face\{font-family:'([^']+)';font-style:([a-z]+);font-weight:([^;]+);font-display:block;src:url\((data:font\/woff2;base64,[A-Za-z0-9+/=]+)\)[^}]*unicode-range:([^}]+)\}/g;

const faces = [];
let m;
while ((m = re.exec(block))) {
  faces.push({ family: m[1], style: m[2], weight: m[3], uri: m[4], range: m[5] });
}
if (!faces.length) throw new Error("no embedded faces found in index.html");

/* Only the latin subset of each family is needed to set the proof's sample text. */
const pick = (family, style) =>
  faces.find((f) => f.family === family && f.style === style && /U\+0000-00FF/.test(f.range));

const lb = pick("Libre Bodoni", "normal");
const rht = pick("Red Hat Text", "normal");
if (!lb || !rht) throw new Error("could not find the latin faces in the embedded block");

const sha = (uri) =>
  createHash("sha256").update(Buffer.from(uri.split(",")[1], "base64")).digest("hex").slice(0, 16);

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Font proof</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400&family=Red+Hat+Text:wght@300..500&display=block" rel="stylesheet">
<style>
@font-face { font-family:'Shipped Bodoni'; font-weight:400; font-display:block; src:url(${lb.uri}) format('woff2'); }
@font-face { font-family:'Shipped RHT'; font-weight:300 500; font-display:block; src:url(${rht.uri}) format('woff2'); }

:root { --paper:#F5F3F7; --ink:#2A2634; --ink2:#6E6878; --hair:#DCD9E0; }
* { box-sizing:border-box; }
body { margin:0; background:var(--paper); color:var(--ink); font-family:'Shipped RHT', system-ui, sans-serif; }
main { padding:44px 56px 120px; max-width:1500px; }
h1 { font-size:13px; letter-spacing:.07em; color:var(--ink2); font-weight:500; margin:0 0 10px; }
.lede { font-size:14px; color:var(--ink2); line-height:1.65; max-width:820px; margin:0 0 44px; }
.lede b { color:var(--ink); }
h2 { font-size:13px; letter-spacing:.05em; color:var(--ink2); font-weight:500; margin:48px 0 0;
     padding-bottom:10px; border-bottom:1px solid var(--ink); }
.pair { display:grid; grid-template-columns:150px 1fr; gap:28px; align-items:center;
        padding:22px 0; border-bottom:1px solid var(--hair); }
.who { font-size:13px; color:var(--ink2); line-height:1.5; }
.who b { color:var(--ink); display:block; font-size:14px; margin-bottom:3px; }
.sample { font-weight:400; font-variant-numeric:normal; }
.big { font-size:44px; line-height:1.15; }
.mid { font-size:22px; line-height:1.3; }

.a-lb { font-family:'Shipped Bodoni', serif; }
.b-lb { font-family:'Libre Bodoni', serif; }
.a-rht { font-family:'Shipped RHT', sans-serif; }
.b-rht { font-family:'Red Hat Text', sans-serif; }

/* Overlay: shipped in ink, Google in magenta on top. Same font = one crisp outline. */
.stack { position:relative; height:70px; }
.stack > span { position:absolute; inset:0; font-size:48px; line-height:70px; white-space:nowrap; font-variant-numeric:normal; }
.stack .under { color:var(--ink); }
.stack .over { color:#E0218A; mix-blend-mode:multiply; opacity:.55; }

table { border-collapse:collapse; font-size:13px; margin-top:22px; }
td, th { text-align:left; padding:7px 26px 7px 0; border-bottom:1px solid var(--hair); }
th { color:var(--ink2); font-weight:400; }
code { font-family:ui-monospace, Menlo, monospace; font-size:12px; }
#verdict { margin-top:34px; font-size:15px; line-height:1.7; padding:18px 20px; border:1px solid var(--hair); border-radius:5px; }
#verdict.ok { border-color:#2A2634; }
#verdict b { font-size:16px; }
</style>
</head>
<body>
<main>
  <h1>FONT PROOF</h1>
  <p class="lede">
    The rows marked <b>shipped</b> use the exact font bytes embedded inside
    <code>index.html</code> — extracted from the file, not downloaded again. The rows marked
    <b>Google</b> load the same families live from Google Fonts. If these are the same fonts,
    the two rows are indistinguishable and the overlay at the bottom is a single clean outline.
    Needs internet for the Google rows only; the shipped rows work offline.
  </p>

  <h2>Libre Bodoni — display face</h2>
  <div class="pair"><div class="who"><b>shipped</b>embedded in index.html</div>
    <div class="sample big a-lb">Foundation Affinity × AI-lization</div></div>
  <div class="pair"><div class="who"><b>Google</b>fonts.googleapis.com</div>
    <div class="sample big b-lb">Foundation Affinity × AI-lization</div></div>
  <div class="pair"><div class="who"><b>shipped</b>numerals</div>
    <div class="sample big a-lb">83% &nbsp; 53 &nbsp; ~70% &nbsp; 88% &nbsp; 0123456789</div></div>
  <div class="pair"><div class="who"><b>Google</b>numerals</div>
    <div class="sample big b-lb">83% &nbsp; 53 &nbsp; ~70% &nbsp; 88% &nbsp; 0123456789</div></div>

  <h2>Red Hat Text — data face</h2>
  <div class="pair"><div class="who"><b>shipped</b>embedded in index.html</div>
    <div class="sample mid a-rht">Acceptance rate · within ±0.5 on the 0–6 scale · COVERAGE · 3.1 / 3.2</div></div>
  <div class="pair"><div class="who"><b>Google</b>fonts.googleapis.com</div>
    <div class="sample mid b-rht">Acceptance rate · within ±0.5 on the 0–6 scale · COVERAGE · 3.1 / 3.2</div></div>

  <h2>Overlaid — shipped in black, Google in magenta</h2>
  <div class="pair"><div class="who"><b>Libre Bodoni</b>one outline = same font</div>
    <div class="stack"><span class="under a-lb">Foundation 83%</span><span class="over b-lb">Foundation 83%</span></div></div>
  <div class="pair"><div class="who"><b>Red Hat Text</b>one outline = same font</div>
    <div class="stack"><span class="under a-rht">Acceptance rate 0.23</span><span class="over b-rht">Acceptance rate 0.23</span></div></div>

  <table>
    <tr><th>face</th><th>bytes embedded</th><th>sha256 (first 16)</th></tr>
    <tr><td>Libre Bodoni · latin</td><td>${Buffer.from(lb.uri.split(",")[1], "base64").length} B</td><td><code>${sha(lb.uri)}</code></td></tr>
    <tr><td>Red Hat Text · latin</td><td>${Buffer.from(rht.uri.split(",")[1], "base64").length} B</td><td><code>${sha(rht.uri)}</code></td></tr>
  </table>

  <p id="verdict">measuring…</p>
</main>

<script>
function width(fam, text) {
  const s = document.createElement("span");
  s.style.cssText = "position:absolute;visibility:hidden;white-space:pre;font-size:300px;font-weight:400;font-variant-numeric:normal;font-family:" + fam;
  s.textContent = text;
  document.body.appendChild(s);
  const w = s.getBoundingClientRect().width;
  s.remove();
  return w;
}
const T1 = "Foundation Affinity 83%", T2 = "Acceptance rate 0.23";
document.fonts.ready.then(async () => {
  await Promise.all([
    document.fonts.load("400 300px 'Shipped Bodoni'"),
    document.fonts.load("400 300px 'Libre Bodoni'"),
    document.fonts.load("400 300px 'Shipped RHT'"),
    document.fonts.load("400 300px 'Red Hat Text'"),
  ]);
  const a = width("'Shipped Bodoni'", T1), b = width("'Libre Bodoni'", T1);
  const c = width("'Shipped RHT'", T2),    d = width("'Red Hat Text'", T2);
  const serifOk = Math.abs(a - b) < 0.5, sansOk = Math.abs(c - d) < 0.5;
  const v = document.getElementById("verdict");
  v.className = serifOk && sansOk ? "ok" : "";
  v.innerHTML =
    "At 300px — Libre Bodoni: shipped <b>" + a.toFixed(1) + "px</b> vs Google <b>" + b.toFixed(1) + "px</b>. " +
    "Red Hat Text: shipped <b>" + c.toFixed(1) + "px</b> vs Google <b>" + d.toFixed(1) + "px</b>.<br><br>" +
    (serifOk && sansOk
      ? "<b>Both faces match Google's exactly.</b> The dashboard is rendering the fonts you chose. If it still looks wrong, you are looking at a cached copy — hard-reload it (Cmd-Shift-R), or reopen the index.html file that was saved most recently."
      : "<b>Mismatch: " + (serifOk ? "" : "Libre Bodoni ") + (sansOk ? "" : "Red Hat Text ") +
        "does not match.</b> The wrong file is embedded — rerun scripts/fetch-fonts.mjs and scripts/embed-fonts.mjs.");
});
</script>
</body>
</html>
`;

writeFileSync(join(root, "specimens", "font-proof.html"), page);
console.log(`specimens/font-proof.html · ${(page.length / 1024).toFixed(0)} KB`);
console.log(`  Libre Bodoni latin ${sha(lb.uri)}`);
console.log(`  Red Hat Text latin ${sha(rht.uri)}`);
