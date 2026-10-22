# Foundation Affinity × AI-lization — Design Spec v2

A toolbox for pulling and comparing AI sensory readings of foundation. A DINOv2-based model reads Optiscreen photographs and scores the eight sensory attributes; the human panel is no longer part of the picture. Users import a formula's AI readings, then either track one formula across wear time (**Dynamic**) or compare formulas against a benchmark (**Comparison**).

Status: v2, 2026-10-22. Supersedes v1 entirely (archived by the author). This document sets direction — layout, visual system, interaction logic. Exact sizes, timings and copy are implementation choices. Items marked **[TBD]** are open.

**Two purposes, held at once.** On the surface it is a working tool for the sensory team and must read as one: real controls, real data flow, real export. Underneath, it is a demo for leadership and must impress on sight. Whatever would need a backend (upload parsing, model card, record metadata) is faked convincingly; whatever can be real in the browser (selection, significance, export) is real.

---

## 1. Principles

- **A tool, not a pitch.** The screen answers working questions — *how does this formula wear?*, *how does it compare to that one?* No accuracy claims beyond one quiet model badge.
- **Fool-proof by structure.** The viewer is assumed to know nothing. Rules are expressed by the shape of the controls (a bench slot that cannot be emptied, a sentence that is always grammatical), never by help text.
- **One mode, one chart.** Dynamic and Comparison are separate modes behind one switch; their charts never share the screen.
- **The sensory team's orientation.** Profiles are drawn vertically, as the team draws them: scale across the top, attributes down the right.
- **Colour means something.** Line colour identifies a series; a separate colour pair marks significant differences (better / worse). The baseline series carries no colour.
- **Editorial, Morandi, and rich.** Fashion-editorial luxury: lilac paper, Didone display type, hairlines, generous space. Restraint is not the goal — motion, ornament and considered detail are wanted wherever they make the page more refined. Under-designed is as much a failure as AI slop.
- **No unnecessary containers.** Cards are not a default. Structure comes from hairlines, surface contrast and whitespace. Only floating things (menus, pointer-following overlays) get a surface of their own.

---

## 2. Canvas & Layout

One fixed **1920 × 1050** canvas, no page scroll, scaled to fit whatever screen it lands on.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TOP BAR   Title / subtitle               [ Dynamic | Comparison ]  Model │
├─────────────┬────────────────────────────────────────────────────────────┤
│ LIBRARY     │ SENTENCE   Compare [ A ▾ ] and [ + ] against [ Bench ▾ ]   │
│             ├─────────────────────────────┬──────────────────────────────┤
│ Search      │ CHART                       │ FINDINGS                     │
│ Import zone │ scale 0–6 across the top    │ Verdict sentence             │
│ Uploaded    │ attributes down the right   │ Tally                        │
│ History     │                             │ Better / Worse lists         │
│  (scrolls)  │ (Dynamic: shorter chart,    │ ─────────────                │
│             │  Formula record beneath)    │ Library position (strips)    │
└─────────────┴─────────────────────────────┴──────────────────────────────┘
```

- Three columns: a narrow **library** on the left; the **chart** and the **findings** sharing the rest roughly equally. Full-height hairlines between columns.
- The **sentence** spans the chart and findings columns — it is the title of everything beneath it.
- Both modes use the **same chart width**. Comparison's chart fills the full height; Dynamic's is shorter, with the **Formula record** (§10) beneath it.
- The library list is the only region that scrolls, internally. The page never scrolls.

---

## 3. Visual System

### 3.1 Palette

| Role | Hex | Notes |
|---|---|---|
| Paper | `#F5F3F7` | page ground, warm lilac-grey |
| Surface | `#FCFBFD` | menus, pills |
| Corridor | `#FFFFFF` | the significance corridor only (§8.4) |
| Edge / Hairline | `#E6E3EB` / `#DCD9E0` | 1px structure |
| Ink / Ink 2 | `#2A2537` / `#6B5E82` | text; ink is also the **baseline series** |
| Series A — violet | `#625492` | first compared series (brand purple) |
| Series B — slate | `#61829E` | second compared series |
| Sig better — sage | `#74936C` | Morandi green |
| Sig worse — clay red | `#B15D59` | Morandi red |

- Brand purple is the page's identity: Series A, the mode switch, the *Uploaded* wash, ornament.
- Better / worse is never carried by colour alone — tooltips and lists always spell out *Better* / *Worse* and the signed difference.

### 3.2 Typography

- **Libre Bodoni 400**, upright and italic: title, mode labels, the sentence's connective words (italic), the verdict sentence, display numerals. Never letter-spaced (tracked runs lose their ligatures).
- **Red Hat Text 300–500**, tabular figures: formula IDs (they are codes, not names), data, labels, controls.
- **Uppercase + tracking only for the eight attribute names**, as the sensory lexicon writes them. Everything else is sentence case.
- Both families ship Latin only: any glyph outside it (arrows, Δ, chevrons) is drawn, never typed.

### 3.3 Material

- **Smoked vellum** — ink-tinted frosted glass with a soft drop and a faint cut-edge highlight — for everything that follows the pointer and leaves: tooltips, hover previews, the model card. Content inside is typeset, not boxed.
- **Standing surfaces** (menus, pills, mode switch thumb) are opaque with a 1px edge. That contrast is what makes the glass read as temporary.
- Depth is rare: the mode switch thumb, lifted pills, floating menus.

### 3.4 Ornament

- The 0–6 axis drawn as a fine **ruler** with minor ticks.
- Large faint Didone **time-band numerals** (T0 / T3 / T6) in the Comparison chart's margin, like section numbers in a magazine.
- The **white corridor** itself — a pale path through the lilac page.
- **Ink-drop** fill when a pill receives a formula; a gently **breathing** empty bench slot when it is the thing blocking the chart.

All ornament and motion respect `prefers-reduced-motion`.

---

## 4. Data

### 4.1 Formulas

- Identified by **formula ID only** (no brand-name field, no ours / market distinction):
  - `b53176_NARS #L2`, `993472_YSL all hours LC1` — history.
  - `Lancome TIU #PO_01_Anker 4.15` — hidden until the fake upload reveals it.
  - `Product 0001` … `Product 0020` — placeholder history (generated mock data), standing in for the ~50 formulas to come.
- In running text (the verdict) the ID-number prefix is dropped (`b53176_NARS #L2` → `NARS #L2`). Everywhere else the full ID is shown.

### 4.2 Readings and rules

- Formulas × 3 time points (T0 / T3 / T6) × 8 fixed attributes, **AI score only**, 0–6 to one decimal.
- **Significance:** `|x − base| ≥ threshold` for that attribute. Per-attribute thresholds are **mock** until the sensory team supplies them.
- **Polarity:** COVERAGE and REFLECTION vs. BARE are better when higher; the other six are better when lower. Better / worse = the sign of the difference × polarity.
- **Base** = the bench at the same time point (Comparison), or the baseline time of the same formula (Dynamic).
- Everything derived is computed in the page, never stored — replacing the data files is enough to update everything.
- The model badge's acceptance figure (83.4%) is mock copy.

---

## 5. Top Bar

- **Left:** title **Foundation Affinity × AI-lization** with subtitle *AI readings powered by DINOv2*, on one line.
- **Right:** the **mode switch** (Dynamic | Comparison) as a capsule with a sliding thumb, and the **model badge** — quiet, *DINOv2 · 83.4% acceptance*. Hovering the badge opens a model card explaining what acceptance means; it is the only place the panel or accuracy is mentioned. Unconfirmed details are visibly marked as placeholders.

---

## 6. Left Column — Library

Top to bottom: **search**, **import zone**, **Uploaded**, **History**, a *Download template* link.

- **Search** filters both groups live.
- **Uploaded** appears only after an import; its rows are tagged *New* and tinted, so imported formulas are told apart from history at a glance (same in the dropdowns). Placeholder rows are set lighter than real ones.
- Rows already in the sentence show their series glyph. **Click** a row to place it (§7.4). Hovering a row previews its profile and highlights it in the library strips (§9.3).

### 6.1 The fake upload

A dashed drop zone, *Drop AI readings (.xlsx)*. Any file, dropped anywhere on the page or picked, starts an import; its contents are never read.

The whole sequence happens **inside the zone and the list — no card or modal**: the filename appears, a counter rolls up to *24 readings* (8 attributes × 3 time points) over a hairline progress rule, then `Lancome TIU #PO_01_Anker 4.15` writes itself into a newly opened *Uploaded* group and lands in the sentence. The record (§10) shows the dropped filename as its source. Importing again does not duplicate; it points at the existing row.

The template link is a real download of an empty readings template.

---

## 7. The Sentence — the Control

The sentence is the selector, the chart title and the legend at once. Connective words in Bodoni italic; slots are pills holding formula IDs, coloured like their lines.

### 7.1 Comparison

> *Compare* [ A ▾ ] *and* [ B ▾ ] *against* [ Bench ▾ ]

- **Bench:** white (the corridor's colour) with an ink edge and a *Bench* caption. It has no remove button — it can only be replaced or swapped. This is how "always exactly one bench" is taught without words.
- **A / B:** tinted with their series colour, removable. B appears only once A is filled; removing A promotes B.
- **Empty slots** are dashed *+ Add formula* / *+ Choose bench*, so the sentence is always grammatical.
- **Make bench (⇄)** on an A or B pill swaps it with the bench.
- Up to three formulas in total: one bench plus at most two compared.

### 7.2 Dynamic

> *Track* [ Formula ▾ ] *over* [T0] [T3] [T6]

- One formula; three time toggles, all on by default; at least one always stays on.
- The **earliest selected time is the baseline** and is styled like the bench; later times take the series colours in order.

### 7.3 Dropdowns

Each pill opens a floating menu with search and the same *Uploaded* / *History* sections. Choosing a formula that already sits in another slot **swaps** the two rather than duplicating.

### 7.4 Placement rules

| Event | Comparison | Dynamic |
|---|---|---|
| Library click | Fills the **bench** if empty, else A, else B. When all three are taken, nothing is replaced: the pills nudge and a hint asks to remove one. | Replaces the formula. |
| Upload | The new formula goes into **A** (the old A moves to B). The bench is untouched — the new formula is what gets judged against a known one. | Becomes the formula. |

- Each mode keeps its own selection. An upload also fills Dynamic's slot if it is empty, so switching modes after the demo upload is never blank.
- A newly filled pill flashes (ink-drop), so the eye catches where the formula landed.

### 7.5 First load and the demo path

Everything starts empty: *Compare [+ Add formula] against [+ Choose bench]*, the chart a pale skeleton with one hint, the findings a quiet prompt. A chart hint appears only while the chart is empty; once anything is drawn, the breathing bench slot and the findings do the asking.

**Demo path:** drop any file → Lancome lands in A and the bench slot breathes → click `b53176_NARS #L2` → the corridor unrolls, both lines draw, and the differences light up.

---

## 8. Centre — Chart

### 8.1 Shared anatomy

- **Vertical profile:** score 0–6 across the top (the ruler), attributes top to bottom in fixed order, **labels on the right**.
- Each attribute label carries a drawn **polarity arrow pointing to the better end of the scale** (→ higher is better, ← lower is better), so better / worse is defined on the page itself.
- Lines are gentle monotone curves that never overshoot a reading. **No value labels on lines** — numbers live in the tooltip.
- **Baseline series** (bench / baseline time): thin ink line, hollow markers. **Compared series:** series colour, slightly heavier, filled markers.
- Above the chart: a short caption, the *Sig only* toggle and the export actions.

### 8.2 Comparison

- **24 rows:** T0's eight attributes, then T3's, then T6's, separated into three blocks by a rule and a gap.
- **Lines break between blocks** — CLOG at T0 does not connect to COVERAGE at T3.
- Bench + up to two compared series.

### 8.3 Dynamic

- **8 rows**, with roughly twice Comparison's row height so the two charts keep a related shape.
- One line per selected time; each later time is judged against the baseline time.

### 8.4 The corridor

- Around the baseline runs a **white corridor**, extending **± each attribute's threshold**, so its width changes row to row and the thresholds can be read off the drawing.
- Pure white with **feathered edges**, beneath all lines, following the baseline's curve; it breaks between blocks like the lines.
- Reading rule, stated in the chart's key: *a point outside the white band is a significant difference.*
- Only the baseline has a corridor; every compared series is judged against it.

### 8.5 Significance

- A significant point gets a **soft halo** behind its marker — sage for better, clay red for worse. The line keeps its series colour; the halo carries the verdict.
- Non-significant points stay plain.
- A small key (within threshold / better / worse) sits in the plot's emptiest corner once there is something to compare.

### 8.6 Hover

- The target is the **mark**, not the row. Hovering lifts the point and its counterpart on the baseline, links them, and opens a vellum tooltip with every series' reading for that attribute and time, the difference against the base, and the verdict with its threshold.
- A hover also highlights the matching finding and library strip (§11).

### 8.7 Sig only

A toggle that veils every row without a significant point, leaving only the differences at full strength. A presenter control for the dense 24-row chart.

### 8.8 Export (real)

- **Export PNG** and **Copy image** produce a slide-ready image: the sentence as its title, a series legend, the chart with its key, a small footer. It uses the page's own fonts.
- If the clipboard is blocked (corporate policy, `file://`), Copy falls back to a download and says so.
- Must be verified on the Windows ThinkPad.

---

## 9. Right Column — Findings

Uncarded; sections separated by hairlines. Two questions answered: *how different?* (verdict, tally, lists) and *where does it stand overall?* (library position).

### 9.1 Verdict

One Bodoni sentence generated from the data:

- **Comparison:** about A against the bench — its most significant better and worse difference (largest relative to threshold).
  *Lancome TIU #PO_01_Anker 4.15 covers more than NARS #L2 by T3, but turns more powdery by T6.*
- **Dynamic:** the most significant changes across all later times against the baseline.
- Variants for only-better, only-worse and no difference. Attribute phrasing comes from a phrase table — **[TBD wording with the sensory team]**.
- Before there is anything to compare, this area holds a quiet prompt for the next step.

### 9.2 Tally and lists

- **Tally:** one line per compared series — *n better · n worse · n on par* in Didone numerals.
- **Better / Worse lists** side by side: attribute, time, signed difference, series glyph; sorted by significance, capped with *+n more*.
- Hovering an item lifts the matching point on the chart; clicking pulses it. Built for narration: *"look here."*

### 9.3 Library position

*Where they sit in the library* — eight horizontal strips (one per attribute) on the same 0–6 scale, at a chosen time point (default T6, where wear separates formulas most).

- Every library formula is a faint dot; the bench is a ring; A and B are dots in their series colours.
- **Dynamic** (*How it moves in the library*): the formula's positions at T0, T3 and T6 on each strip, joined by a thin line, coloured as in the chart.
- Hovering a strip gives each selected formula's rank in the library for that attribute (best first) and lights up the matching chart row.

This is information the chart cannot show — and it grows more useful as the library fills, which is itself the case for importing the remaining formulas.

---

## 10. Formula Record (Dynamic only)

Beneath the Dynamic chart, an editorial colophon rather than a card: the formula ID in Bodoni, then source file, import date, readings, image count, model — placeholders visibly marked — and the actions **Export readings (.csv)** (real) and **Export PNG**.

---

## 11. Linking

One highlight state shared by the chart, the findings lists, the library strips and the library list. Hovering any one of them lights up the same attribute / point in the others; leaving restores everything. The screen reads as one connected instrument rather than three panels.

---

## 12. Motion

One easing curve everywhere. Motion is the richness of the page; these are the signature moments:

- **Page load:** the regions arrive composed, in a short stagger.
- **First comparison:** the corridor unrolls top to bottom, the lines draw down it, halos bloom in reading order, then the verdict and the counting tally arrive. This is the climax of the demo.
- **Selection changes:** lines and corridor *flow* to their new positions rather than redraw; new series draw in along their path; removed ones fade.
- **Upload:** the counter rolls, the ID types itself into the library, the pill ink-drops, the line draws.
- **Mode switch:** the thumb glides and the chart re-forms; ideally the sentence re-types its connective words.
- **⇄ swap:** ideally the two pills physically trade places while the corridor moves to the new bench.

`prefers-reduced-motion`: every change is instant; nothing pulses or breathes.

---

## 13. Presenter Affordances

Hidden keyboard shortcuts for rehearsal and the live demo: `R` reset to the first-load state (Lancome un-imported), `1` / `2` switch modes, `S` toggle Sig only. No visible UI.

---

## 14. Implementation Constraints

- One self-contained `index.html` (inline CSS and JS, hand-drawn SVG, no chart library), plus data files as classic scripts on `window.AFFINITY_DATA`. Opens by double-click from `file://` on a Windows ThinkPad, offline. Shipped as a zip.
- Fonts are OFL and embedded as data URIs (`scripts/fetch-fonts.mjs`, `scripts/embed-fonts.mjs`); no runtime CDN.
- Mock data comes from `scripts/generate-data.mjs` (seeded and reproducible). The three named formulas keep the approved v1 AI readings.
- UI copy in English.

---

## 15. Open Items [TBD]

- Real significance thresholds per attribute.
- Sage / clay red checked on the Windows projector.
- Verdict phrasing.
- Model card contents and version.
- Real IDs and data for the remaining ~30 history formulas.
- Whether placeholders stay selectable or become list-only.
- Whether *Export readings* should be `.xlsx` rather than `.csv`.

---

## 16. Amendments from the build (user-approved, 2026-10-22)

Directed by the user after seeing the build. Each amendment supersedes the matching line above; the lines above are kept as written.

- **§8.1 Lines.** Lines are straight polylines between readings, not monotone curves. The baseline series (bench / baseline time) is a lighter dashed line, `#8E85A2`, 1.5px, dash 5 4, with hollow markers; it no longer uses ink. Markers are small (baseline r 3.3, compared series r 3.7, 2.2px line); significance halos are small (r 11).
- **§8.2 / §8.4 Continuity.** Lines run continuously from T0 through T3 to T6; they do not break between blocks. (This round also ran the white corridor continuously; the third round removes the corridor.) The blocks stay separated by a rule, a gap and the band numerals only.
- **§8.1 Attribute labels.** Set lighter: ink 2, weight 400.
- **§10 Formula record.** Removed. The Dynamic chart uses the full column height, like Comparison. *Readings .csv* sits in the chart toolbar and is shown in Dynamic only.
- **§2 Proportions.** Chart and findings are about 1.42 : 1, not equal. Column gaps are wider: library 348px, with 44px before its hairline and 52px after; chart / findings 48px before the hairline and 52px after.
- **§9.1 Verdict.** Set smaller and read as a caption to the chart, not a headline (22px in this round; 21px / 1.45 after the second round below).
- **§7.5 Empty findings.** Show only the quiet prompt.
- **§14 Mock data.** The Lancome and YSL mock readings were retuned in `scripts/generate-data.mjs` so a comparison shows a handful of significant differences: Lancome vs NARS is 4 better · 1 worse · 19 on par. NARS keeps the v1 readings.
- **§6 / §15 Import and export.** The drop zone reads *.xlsx / .csv*; the template download and the readings export are `.csv`; placeholder formulas can be selected.

**Second round (user-approved, 2026-10-22).**

- **§8.1 Polarity arrows.** Removed from beside the attribute labels; the labels start at the label column. The plot spans x 30 to the width less 214px. Better / worse is still spelled out in tooltips and lists, and the library-strip tooltip says *Higher is better* / *Lower is better*.
- **§3.4 Band numerals.** Moved from the left margin to the lower-right corner of each block, inside the plot, baseline 12px above the block's bottom (58px at 6px inside the plot edge in this round; size, inset and key placement superseded by the third round).
- **§9 Findings, calmer.** Verdict 21px / 1.45. Tally numerals Bodoni 24px, tally words 14px, tally IDs 15px in ink 2. Better / Worse heads Bodoni 18px with an 18px halo swatch. List attributes 14px caps in ink 2, time 14px, signed difference 15px / 500; list rows at least 31px tall.

**Third round (user-approved, 2026-10-22).**

- **§8.4 / §3.4 / §8.6 Corridor removed.** No white band, no feather filter, no unroll. Significance is shown only by the halos; the tooltip still states the threshold (*beyond / within the ±x threshold*). The first-comparison moment is now: lines draw down, halos bloom, verdict and tally arrive.
- **§8.5 Key.** Two items only, *Better* and *Worse* (halo swatch, Red Hat Text 15px in ink 2), on one line. In Comparison it sits on the T6 band numeral's baseline, 22px to its left; in Dynamic, which has no numerals, at the plot's lower-right. The *Within threshold* swatch and the reading-rule sentence are gone.
- **§3.4 Band numerals.** Libre Bodoni 66px, ink at .13, right-aligned 18px inside the plot's right edge, baseline 12px above the block's bottom.
- **Tokens.** The `corridor` colour is renamed `white` (`#FFFFFF`), used only by the bench pill and the baseline time toggle.
- **Tooltip.** The on-par icon is a small ink-2 ring (r 3.4, 1.2px stroke).
- **§9 Findings.** Verdict, tally and lists sit at the top of the column as one group (no vertical centring: it left large empty gaps). The library strips follow 28px below and absorb the remaining height: their row pitch stretches from 24px up to 46px. The verdict has no minimum height; the tally starts 24px below it.

---

## Design tokens (recorded from the build)

The sections below record the shipped `index2.html` as the token layer of this spec, in the canonical DESIGN.md order. They describe; §1–§16 decide. The machine-readable form would normally open the file as YAML frontmatter; it is kept here instead so the authored spec above stays untouched, and is mirrored in `.impeccable/design.json`.

```yaml
name: Foundation Affinity × AI-lization
description: A toolbox for pulling and comparing AI sensory readings of foundation.
colors:
  paper: "#F5F3F7"
  surface: "#FCFBFD"
  white: "#FFFFFF"
  edge: "#E6E3EB"
  hair: "#DCD9E0"
  ink: "#2A2537"
  ink-2: "#6B5E82"
  series-a-violet: "#625492"
  series-b-slate: "#61829E"
  bench-line: "#8E85A2"
  better-sage: "#74936C"
  worse-clay: "#B15D59"
  a-wash: "rgba(98,84,146,.10)"
  b-wash: "rgba(97,130,158,.12)"
  tint: "rgba(42,37,55,.045)"
  glass: "rgba(47,41,61,.035)"
typography:
  display:   { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "35px", fontWeight: 400, lineHeight: 1, letterSpacing: "0" }
  sentence:  { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "32px", fontWeight: 400, lineHeight: 1, letterSpacing: "0" }
  headline:  { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "27px", fontWeight: 400, lineHeight: 1, letterSpacing: "0" }
  verdict:   { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "21px", fontWeight: 400, lineHeight: 1.45, letterSpacing: "0" }
  title:     { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "21px", fontWeight: 400, lineHeight: 1.15, letterSpacing: "0" }
  numeral:   { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "30px", fontWeight: 400, lineHeight: 1, letterSpacing: "0", fontFeature: "lnum, pnum" }
  tally-numeral: { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "24px", fontWeight: 400, lineHeight: 1, letterSpacing: "0", fontFeature: "lnum, pnum" }
  findings-head: { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "18px", fontWeight: 400, lineHeight: 1, letterSpacing: "0" }
  band-numeral: { fontFamily: "Libre Bodoni, Georgia, serif", fontSize: "66px", fontWeight: 400, lineHeight: 1, letterSpacing: "0" }
  body:      { fontFamily: "Red Hat Text, Segoe UI, system-ui, sans-serif", fontSize: "16px", fontWeight: 400, lineHeight: 1.3, fontFeature: "lnum, tnum" }
  id:        { fontFamily: "Red Hat Text, Segoe UI, system-ui, sans-serif", fontSize: "17px", fontWeight: 500, lineHeight: 1, fontFeature: "lnum, tnum" }
  subtitle:  { fontFamily: "Red Hat Text, Segoe UI, system-ui, sans-serif", fontSize: "18px", fontWeight: 300, lineHeight: 1, letterSpacing: "0.01em" }
  caption:   { fontFamily: "Red Hat Text, Segoe UI, system-ui, sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: 1.5, fontFeature: "lnum, tnum" }
  attribute: { fontFamily: "Red Hat Text, Segoe UI, system-ui, sans-serif", fontSize: "15.5px", fontWeight: 400, letterSpacing: "0.9px" }
  label-caps: { fontFamily: "Red Hat Text, Segoe UI, system-ui, sans-serif", fontSize: "16px", fontWeight: 500, letterSpacing: "0.075em" }
  list-attribute: { fontFamily: "Red Hat Text, Segoe UI, system-ui, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: 1.25, letterSpacing: "0.04em" }
rounded:
  capsule: "999px"
  menu: "14px"
  glass: "12px"
  hint: "10px"
  row: "8px"
  item: "7px"
  sm: "6px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "40px"
  s8: "56px"
components:
  pill-bench:    { backgroundColor: "{colors.white}", textColor: "{colors.ink}", typography: "{typography.id}", rounded: "{rounded.capsule}", height: "48px", padding: "0 14px 0 16px" }
  pill-series-a: { backgroundColor: "{colors.a-wash}", textColor: "{colors.ink}", typography: "{typography.id}", rounded: "{rounded.capsule}", height: "48px", padding: "0 14px 0 16px" }
  pill-series-b: { backgroundColor: "{colors.b-wash}", textColor: "{colors.ink}", typography: "{typography.id}", rounded: "{rounded.capsule}", height: "48px", padding: "0 14px 0 16px" }
  pill-empty:    { textColor: "{colors.ink-2}", typography: "{typography.body}", rounded: "{rounded.capsule}", height: "48px", padding: "0 14px 0 16px" }
  time-toggle:   { textColor: "{colors.ink-2}", rounded: "{rounded.capsule}", height: "48px", padding: "0 20px" }
  mode-switch:   { backgroundColor: "{colors.tint}", textColor: "{colors.ink-2}", rounded: "{rounded.capsule}", padding: "4px", width: "300px" }
  mode-switch-thumb: { backgroundColor: "{colors.surface}", textColor: "{colors.ink}", rounded: "{rounded.capsule}", width: "150px", height: "42px" }
  tool:          { textColor: "{colors.ink-2}", typography: "{typography.caption}", rounded: "{rounded.capsule}", height: "36px", padding: "0 12px" }
  tool-hover:    { backgroundColor: "{colors.tint}", textColor: "{colors.ink}" }
  library-row:   { textColor: "{colors.ink}", typography: "{typography.body}", rounded: "{rounded.row}", height: "38px", padding: "7px 10px" }
  library-row-new: { backgroundColor: "{colors.a-wash}", textColor: "{colors.ink}", rounded: "{rounded.row}" }
  drop-zone:     { textColor: "{colors.ink}", rounded: "{rounded.glass}", padding: "18px 20px 16px" }
  menu:          { backgroundColor: "{colors.surface}", rounded: "{rounded.menu}", width: "380px", padding: "10px 8px 8px" }
  vellum-tooltip: { backgroundColor: "{colors.glass}", textColor: "{colors.ink}", rounded: "{rounded.glass}", padding: "14px 18px 15px" }
  search-field:  { textColor: "{colors.ink}", height: "46px", padding: "0 2px" }
```

## Colors

Lilac paper and ink, one brand violet, one cool slate, and a Morandi verdict pair that appears only as halos. Values are the `:root` custom properties and the chart constants `C` / `ROLE`.

### Primary
- **Brand Violet** (`series-a-violet`): series A's line, filled markers, pill wash and glyph; the Sig-only switch when on; focus outlines, caret and selection; the drop zone's dashed edge and arrow; the *Uploaded* wash and *New* tag. The page's identity.

### Secondary
- **Weathered Slate** (`series-b-slate`): series B only — line, markers, pill wash. Never decorative.

### Tertiary
- **Morandi Sage** (`better-sage`) and **Clay Red** (`worse-clay`): the verdict pair. Carried by halos (radial gradient, stops .72 / .42 / 0, with a .5-opacity ring), the list-head dots and the verdict underlines (sage at .75, clay at .7). Always spelled out in words beside them.

### Neutral
- **Lilac Paper** (`paper`): page ground; also the veil colour for Sig only.
- **Vellum White** (`surface`): standing surfaces — menus, pills, the mode-switch thumb, toggle knobs.
- **White** (`white`): the bench pill and the baseline time toggle only. (Formerly `corridor`; the corridor is removed, §16.)
- **Edge** (`edge`) and **Hair** (`hair`): 1px structure. Hair draws the column hairlines, group and section rules, chart verticals; edge outlines standing surfaces.
- **Ink** (`ink`): text, the ruler, band numerals at .13 opacity (lower-right of each block), library strip dots at .22.
- **Ink 2** (`ink-2`): secondary text, attribute labels (chart and findings lists), tally IDs, captions, placeholder rows.
- **Bench Grey-Violet** (`bench-line`): the baseline series line and hollow markers only (§16).
- **Washes**: `a-wash` and `b-wash` tint series pills and new rows; `tint` (ink at 4.5%) is the one hover / pressed-ground colour; row highlight bands use violet at 7.5%.

### Named Rules
**The Halo Carries the Verdict Rule.** Sage and clay red never colour a line, a pill or text; they appear only as halos, the list-head dots and the verdict underline. The line keeps its series colour.

**The Uncoloured Baseline Rule.** The baseline is grey-violet, dashed and hollow; it never takes a series colour or the verdict pair.

## Typography

**Display Font:** Libre Bodoni 400, upright and italic (with Georgia, Times New Roman)
**Body Font:** Red Hat Text 300–500 (with Segoe UI, system-ui)

**Character:** A Didone that sets the page's voice — title, connective words, verdict, numerals — against a quiet humanist sans that carries every code, figure and control in tabular lining figures. Both are embedded as data URIs; Bodoni ships an italic, Red Hat Text a variable 300–500 axis.

### Hierarchy
- **Display** (Bodoni 400, 35px, line-height 1): the title only.
- **Sentence** (Bodoni italic 400, 32px; 29px when the sentence tightens): the connective words *Compare / and / against / Track / over*.
- **Headline** (Bodoni 400, 27px): *Library*; section heads at 22px (*Where they sit in the library*), 21px (drop-zone title), 20px (mode labels), 19px (Uploaded / History groups), 18px (Better / Worse).
- **Verdict** (Bodoni 400, 21px, line-height 1.45; prompt in italic 21px, ink 2): a caption to the chart (§16).
- **Numerals** (Bodoni 400, lining proportional): upload counter 30px, tally 24px, model-card figure 46px, ruler integers 19px, band numerals T0 / T3 / T6 66px at .13 opacity, right-aligned in each block's lower-right corner.
- **Body** (Red Hat Text 400, 16px, line-height 1.3, tabular): formula IDs in library rows; tooltips at 15.5px; tally IDs at 15px in ink 2.
- **ID in a pill** (Red Hat Text 500, 17px).
- **Subtitle** (Red Hat Text 300, 18px, ink 2, +0.01em).
- **Caption** (Red Hat Text 400, 15px, ink 2): chart caption, tool labels, counts, *+n more*, model-card text (line-height 1.5); tally words at 14px.
- **Attribute** (Red Hat Text 400, uppercase, 15.5px with 0.9px tracking in Comparison, 17px with 1.1px in Dynamic, ink 2): chart labels; 16px with 0.6px in the library strips; findings list items 14px with 0.04em, time 14px, signed difference 15px / 500 in ink.

### Named Rules
**The Untracked Didone Rule.** Libre Bodoni is always `letter-spacing: 0`, with common and contextual ligatures on and proportional numerals.

**The Tabular Sans Rule.** Red Hat Text always runs lining tabular figures, so columns of readings align without a table.

## Layout

One fixed 1920 × 1050 stage scaled to fit by a transform, never reflowed; padding 30px top, 56px sides, 34px bottom. Rows: a 64px top bar, a 22px gap, then the work area. The work area is a 348px library and the main column; the library keeps 44px before its full-height hairline and the main column starts 52px after it. The main column stacks an 84px sentence band (hairline beneath, 20px gap) over the content grid, chart : findings at 1.42fr : 1fr, with 48px before the hairline and 52px after. The library list is the only scrolling region; its bottom 36px fades out through a mask.

Spacing runs on a 4px base (`s1`–`s8`: 4, 8, 12, 16, 24, 32, 40, 56). Larger column gutters (44 / 48 / 52) are deliberate breathing room on the 13" target, where the canvas renders near 0.7×.

Chart geometry: a 54px top band for the ruler, 24px gaps between Comparison's three blocks, plot from x 30 to the width less 214px, with the label column 24px past the plot's right edge. Band numerals sit inside the plot at each block's lower-right corner. Comparison has 24 rows, Dynamic 8 rows at roughly three times the height; both fill the column.

## Elevation & Depth

Flat paper with two depth materials. Standing surfaces are opaque with a 1px edge and, where they lift, a short ambient drop; things that follow the pointer and leave are smoked-vellum glass. The plot itself is flat: halos are the only soft light in it.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 8px 22px rgba(42,37,55,.10), 0 1px 2px rgba(42,37,55,.06)`): the mode-switch thumb.
- **Menu** (`box-shadow: 0 10px 22px rgba(42,37,55,.12), 0 1px 3px rgba(42,37,55,.06)`): floating dropdown menus, with the 1px edge.
- **Vellum drop** (`box-shadow: 0 10px 28px rgba(42,37,55,.13), 0 1px 2px rgba(42,37,55,.06), inset 0 1px 0 rgba(255,255,255,.65)`; `backdrop-filter: blur(14px) saturate(1.2) brightness(1.07)` over `rgba(47,41,61,.035)`): tooltips, model card, hints, toast. The inset line is the cut edge.
- **Bench rest** (`box-shadow: 0 1px 0 rgba(42,37,55,.04)`): the bench pill's hairline footing.
- **Knob** (`box-shadow: 0 1px 2px rgba(42,37,55,.25)`): the Sig-only switch knob.

### Named Rules
**The Glass Is Temporary Rule.** Vellum only on what appears under the pointer and leaves; anything that stands on the page is opaque.

## Shapes

Capsules for everything you press or choose (pills, mode switch, tools, time toggles, mini segment, tags: 999px). Soft rectangles for floating and hover grounds: menus 14px, vellum and the drop zone 12px, hints 10px, library rows 8px, findings items 7px, strip highlight bands and focus rings 6px. Dashed 1px borders mean "empty, fill me" (empty pills, off time toggles, the drop zone, the page drag frame at 18px). Chart marks are circles; arrows, chevrons, swap and close marks are drawn SVG strokes (1.1–1.4px, round caps), never typed glyphs.

## Components

### Pills (the sentence slots)
- **Shape:** capsule, 48px tall, 1px border.
- **Bench:** white with an ink border and an italic Bodoni *Bench* caption behind a hairline; no remove button.
- **Series A / B:** surface with the series wash; border in the series colour at .42 / .48.
- **Empty:** transparent, dashed ink at .32, ink-2 label; hover turns the border to ink. When it is what blocks the chart it breathes (1.5s each way, alternating, on the one curve; a 7px violet ring at .09).
- **Tools:** 30px circular swap / remove buttons, ink 2, ink-at-7% hover.
- **Fill:** ink-drop — a circle floods from the glyph outward over .9s, then fades.

### Time toggles (Dynamic)
- Capsule, 48px, Red Hat Text 500 18px. Off: dashed, ink 2. On: solid, taking bench / series styling in order of time.

### Mode switch
- A 4px-padded capsule on the ink tint with two 150px Bodoni 20px buttons; the thumb is surface with edge and Lift and glides .5s on the house curve.

### Tools (chart toolbar)
- Ghost capsule buttons, 36px, caption type with a 16px drawn icon; hover fills with tint and inks the text. Sig only carries a 34 × 20px switch that turns violet when on. *Readings .csv* appears only in Dynamic (§16).

### Search field
- Underline only: a 46px row with a hair rule that turns ink on focus; a drawn magnifier in ink 2; light 300 placeholder.

### Drop zone
- Dashed violet at .45, 12px radius, Bodoni 21px title with a drawn arrow, caption *.xlsx / .csv*. Hover and page drag fill it with the violet wash. While importing, the filename, a rolling Bodoni counter and a 2px violet progress rule replace the idle copy.

### Library rows
- 38px min, 8px radius, tint on hover or link highlight. Placeholder rows in ink 2 weight 300. Uploaded rows carry the violet wash and flash on arrival.

### Menus
- 380px surface panel, 14px radius, edge plus Menu shadow, opening with a .2s fade and slight scale from the top left; same search and groups as the library.

### Vellum tooltip
- 12px glass plate, 14px 18px padding; content typeset in a grid (glyph, who, value, difference) with a hair rule above the Bodoni verdict line: a halo swatch for Better / Worse, a small ink-2 ring for On par, and the threshold in words. Fades in .18s; leaves the same way.

### Chart (signature)
- Ruler: ink baseline at .55, integer ticks at .7 and minor ticks at .38, Bodoni integers 19px. Verticals in hair. Band numerals T0 / T3 / T6 at 66px, .13, right-aligned 18px inside the plot's right edge with the baseline 12px above the block's bottom.
- No corridor (§16): significance is read from the halos alone; thresholds are stated in the tooltip.
- Series: straight polylines; baseline `bench-line` 1.5px dashed 5 4 with hollow r 3.3 markers; compared series 2.2px with filled r 3.7 markers. Lifted markers grow 1.6×, halos (r 11) 1.25×.
- Labels: the uppercase attribute name in ink 2, weight 400, starting at the label column; no polarity arrow (§16). Polarity is spelled out in tooltips, lists and the strip tooltip (*Higher / Lower is better*).
- Hover: a violet 7.5% row band, the counterpart linked by a dashed ink connector (2 3).
- Key: *Better* and *Worse* on one line, each an 8.5px-radius halo swatch with an ink dot and Red Hat Text 15px in ink 2, 20px apart; on the T6 numeral's baseline 22px to its left, or at the plot's lower-right in Dynamic. No backing plate.

### Findings
- Verdict, tally and lists form one top-aligned group (verdict without a minimum height; tally 24px below it); the strips sit 28px below and stretch their row pitch (24–46px) to fill the column. Verdict caption, then a tally row per series (48px min; glyph, ID 15px in ink 2, Bodoni 24px numerals with 14px words), Better / Worse lists side by side (Bodoni 18px heads with an 18px halo swatch; 22px glyph column, 31px items, 14px caps attribute in ink 2, signed difference 15px / 500), and the library strips: faint ink dots per formula, a dashed ink ring for the bench, series dots in colour.

### Motion
One curve, `cubic-bezier(.16,1,.3,1)` (JS uses the matching exponential ease-out). Durations: fast .16s (hover grounds), state .3s (borders, toggles, veils), flow .65s (lines moving to new values), thumb .5s, vellum .18s, menus .2s, arrival .7s staggered .06 / .14 / .22 / .30s, line draw 1.0s (1.3s on the first comparison). `prefers-reduced-motion` makes every change instant.

## Do's and Don'ts

### Do:
- **Do** keep every new colour inside the palette above; washes are the series colours at 10–12% and hover grounds are ink at 4.5%.
- **Do** draw arrows, chevrons and marks as SVG strokes; both families ship Latin only.
- **Do** use capsules for anything pressed or chosen and dashed borders for anything empty.
- **Do** move with the one curve and the fast / state / flow durations.
- **Do** give halos, not lines, the verdict colours, and spell *Better* / *Worse* out beside them.

### Don't:
- **Don't** track Libre Bodoni or set it in a weight other than 400.
- **Don't** put a card behind a region; structure comes from hairlines, surface contrast and space.
- **Don't** use vellum glass for anything that stays on the page, or an opaque surface for anything that follows the pointer.
- **Don't** set text in uppercase except the eight attribute names.
- **Don't** break the lines between time blocks (§16).
