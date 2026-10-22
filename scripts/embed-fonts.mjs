/**
 * Inlines fonts/*.woff2 into index.html as data URIs.
 *
 * Why: the demo is opened by double-clicking index.html, so it runs on file://.
 * Chrome and Firefox refuse @font-face files loaded from a subdirectory over
 * file://, which silently drops the page back to Georgia / Segoe UI. Embedding
 * the faces removes the last external dependency — no fonts/ folder to lose in
 * the zip, no CDN, no network.
 *
 * Run after adding or replacing any .woff2:  node scripts/embed-fonts.mjs [page.html]
 * (the page defaults to index.html).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = process.argv[2] || "index.html";

/* Red Hat Text ships one variable file per subset, so one rule covers 300–500.
   The unicode-range of every file comes from fonts/manifest.json, which
   scripts/fetch-fonts.mjs wrote straight from Google's own stylesheet — never
   re-typed here, because a range that disagrees with its file is invisible
   until someone reads the wrong glyphs on a projector. */
const FACES = [
  ["Libre Bodoni", "normal", "400", "libre-bodoni"],
  ["Libre Bodoni", "italic", "400", "libre-bodoni-italic"],
  ["Red Hat Text", "normal", "300 500", "red-hat-text"],
  ["Red Hat Text", "italic", "300 500", "red-hat-text-italic"],
];

const manifest = JSON.parse(readFileSync(join(root, "fonts", "manifest.json"), "utf8"));
const find = (file) => {
  const row = manifest.find((m) => m.file === file);
  if (!row) throw new Error(`${file} is not in fonts/manifest.json — run scripts/fetch-fonts.mjs`);
  return row;
};

let css = "";
let bytes = 0;
let count = 0;
for (const [family, style, weight, slug] of FACES) {
  for (const subset of ["latin", "latin-ext"]) {
    const row = find(`${slug}-${subset}.woff2`);
    const buf = readFileSync(join(root, "fonts", row.file));
    if (buf.length !== row.bytes) {
      throw new Error(`${row.file} is ${buf.length} B but the manifest says ${row.bytes} B`);
    }
    bytes += buf.length;
    count++;
    css +=
      `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};` +
      `font-display:block;src:url(data:font/woff2;base64,${buf.toString("base64")}) format('woff2');` +
      `unicode-range:${row.range}}\n`;
  }
}

const START = "<!--fonts:start-->";
const END = "<!--fonts:end-->";
const html = readFileSync(join(root, page), "utf8");
const a = html.indexOf(START);
const b = html.indexOf(END);
if (a === -1 || b === -1) throw new Error(`${page} is missing the ${START} / ${END} markers`);

const block = `${START}\n<style>\n${css}</style>\n${END}`;
writeFileSync(join(root, page), html.slice(0, a) + block + html.slice(b + END.length));

console.log(
  `${page}: embedded ${count} files · ${(bytes / 1024).toFixed(0)} KB raw ` +
  `→ ${(css.length / 1024).toFixed(0)} KB base64`
);
