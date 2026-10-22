/**
 * Downloads the OFL webfont subsets this dashboard ships, straight from Google Fonts.
 *
 * The subset name is written as a CSS comment BEFORE its @font-face block, so the
 * parser has to pair each `/* name *\/` with the block that follows it. Getting that
 * pairing wrong silently ships the wrong subset under the right filename — the page
 * still renders a serif, just not the one you chose.
 *
 *   node scripts/fetch-fonts.mjs        # writes fonts/*.woff2 + fonts/manifest.json
 *   node scripts/embed-fonts.mjs        # then inline them into index.html
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = join(root, "fonts");
mkdirSync(fontsDir, { recursive: true });

/* A desktop Chrome UA is what makes Google serve woff2 rather than ttf. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const REQUESTS = [
  { slug: "libre-bodoni", query: "family=Libre+Bodoni:wght@400" },
  { slug: "libre-bodoni-italic", query: "family=Libre+Bodoni:ital,wght@1,400" },
  { slug: "red-hat-text", query: "family=Red+Hat+Text:wght@300..500" },
  { slug: "red-hat-text-italic", query: "family=Red+Hat+Text:ital,wght@1,300..500" },
];

/* Only the subsets the dashboard's copy actually needs. */
const WANTED = new Set(["latin", "latin-ext"]);

async function get(url, asText) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return asText ? res.text() : Buffer.from(await res.arrayBuffer());
}

/** Split the stylesheet into { subset, url, range } — comment first, then its block. */
function parse(css) {
  const out = [];
  const re = /\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const body = m[2];
    const url = /src:\s*url\(([^)]+)\)/.exec(body);
    const range = /unicode-range:\s*([^;]+);/.exec(body);
    if (url && range) out.push({ subset: m[1], url: url[1].trim(), range: range[1].trim() });
  }
  return out;
}

const manifest = [];
for (const req of REQUESTS) {
  const css = await get(`https://fonts.googleapis.com/css2?${req.query}&display=block`, true);
  const faces = parse(css);
  if (!faces.length) throw new Error(`no @font-face blocks parsed for ${req.slug}`);

  for (const face of faces) {
    if (!WANTED.has(face.subset)) continue;
    const file = `${req.slug}-${face.subset}.woff2`;
    const buf = await get(face.url, false);
    writeFileSync(join(fontsDir, file), buf);
    const sha = createHash("sha256").update(buf).digest("hex").slice(0, 16);
    manifest.push({ file, subset: face.subset, bytes: buf.length, sha256: sha, range: face.range, source: face.url });
    console.log(`${file.padEnd(34)} ${String(buf.length).padStart(6)} B  ${sha}`);
  }
}

writeFileSync(join(fontsDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${manifest.length} files + fonts/manifest.json`);
