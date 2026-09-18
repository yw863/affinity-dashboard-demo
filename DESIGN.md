# Foundation Affinity × AI-lization — Dashboard Design Spec

Demo dashboard for the Foundation Affinity project: a DINOv3-based model that scores foundation wear from images, compared against sensory panel scores. Single-screen (1920 × 1050), no scroll. Audience: non-data stakeholders. Goal: in under a minute, convey "the AI agrees with the panel" and "this is worth investing in."

Status: v1 spec, 2026-09-18. Items marked **[TBD]** are open and non-blocking.

---

## 1. Principles

- **One story, one screen.** Stat tiles state the value; the line chart is the evidence; the right panel is the close-up. Nothing else.
- **Positive framing.** Every element shows *agreement*, never *error*. No red, no warning states. Residuals are shown as "AI dot inside the panel ring" (a hit), not as a distance bar.
- **Color only for products.** Everything else (AI vs panel, hierarchy, emphasis) is encoded by line style, weight, and opacity. Max three products on screen → max three hues.
- **Quiet, editorial, luxury.** Light paper background, high-contrast Didone display type, generous whitespace, hairlines. Restraint over decoration. Motion is the richness: lines flow, controls glide.
- **Whitespace is intentional.** The chart is allowed to breathe. Density comes from within the chart (gridlines, value labels, fill band), not from adding components.

---

## 2. Canvas & Layout

Fixed 1920 × 1050. Outer margin **76px left/right, 52px top, 64px bottom** — deeper at the foot so the page sits rather than floats. Column gap **56px**. Internal spacing follows a 4-unit scale (4 / 8 / 12 / 16 / 24 / 32 / 44 / 56 / 72), tight inside a group and generous between groups; font sizes and radii are left to implementation.

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOP BAR  (h 72)   Title / subtitle                   Overlay|Split|Radar│
├────────────────────────────────────────────────────────────────────────┤
│ TILE ROW (h 84)   83% Acceptance rate │ 53 Formulas… │ ~70% Time saved │
├──────────┬──────────────────────────────────────────┬──────────────────┤
│ LEFT     │ CENTER                                   │ RIGHT            │
│ w 288    │ flexible (~1012)                         │ w 420            │
│          │                                          │                  │
│ Formula  │ Chart header: title · legend (draggable) │ Bottle + name    │
│ search   │                                          │                  │
│ Chips ×3 │ Main chart                               │ Agreement        │
│          │ (line / split / radar)                   │ profile ×8 rows  │
│ Time     │                                          │                  │
│ control  │                                          │                  │
│          │                                          │ Acceptance · Diff│
│ Attribute│                                          │                  │
│ list ×8  │                                          │                  │
└──────────┴──────────────────────────────────────────┴──────────────────┘
```

Heights: top bar 72, tile row 84, row gap 32, work area = remainder (**714**). Right column 420 (adjust if the agreement profile needs more; not hard-coded). Left column 288.

The centre column carries, top to bottom: chart header, the plot at a fixed **496px** — deliberately wide and shallow, because the data is one high attribute and seven low ones, so a tall plot pushes the whole picture into the bottom of the screen — then whitespace, then the closing line (§7.5) anchored to the foot.

Containers: the right panel is a card on a surface color with a 1px edge — **no drop shadow**; separation comes from the edge and the surface/paper contrast alone. The **tile row is not carded** — three numbers printed directly on the paper, separated by vertical hairlines (editorial, not dashboard); nothing materializes beneath a tile on hover (see §5.2). The center chart sits directly on the paper, no card, so the lines feel like they're drawn on the page. Left column is uncarded as well; its groups are separated by hairlines and section labels.

---

## 3. Visual System

### 3.1 Palette

| Role | Hex | Notes |
|---|---|---|
| Paper (page bg) | `#F5F3F7` | warm lilac-grey white |
| Surface (cards) | `#FCFBFD` | one step lighter than paper |
| Card edge | `#E6E3EB` | 1px |
| Ink (primary text) | `#2A2634` | purple-grey black, ~13:1 on paper |
| Ink 2 (secondary text, axis labels) | `#6E6878` | ~4.9:1 |
| Hairline (grid, dividers) | `#DCD9E0` | ≈ ink @ 12% on paper |
| Product 1 — violet | `#625492` | primary; deeper than the paper so the main series reads first |
| Product 2 — slate | `#61869E` | cooler neighbor |
| Product 3 — rose | `#A66E79` | warmer neighbor |

Product colors are assigned by **selection order** (1st selected = lavender, 2nd = slate, 3rd = rose), and swap when the user reorders products (see §6.3).

Fill band (AI ↔ panel area of the main product): product color at 8% opacity.
Comparator products: entire line group at ~45% opacity.
Hover/selection background tint: ink at ~4%.
Never use color to mark "ours" vs "market" — see §6.1.

### 3.2 Typography

- **Display / serif:** Libre Bodoni, **weight 400 everywhere** (the family's lightest weight). Didone, matching beauty-industry vernacular; chosen over Bodoni Moda for sturdier hairlines on Windows + projector. Hierarchy comes from size, not weight. Used for: page title, tile numbers, product names (everywhere they appear: list, chips, legend, right panel), the right-panel acceptance-rate number.
- **Data / sans:** Red Hat Text, 300–400, `font-variant-numeric: tabular-nums`. Chosen for its open, generous letterforms and small-size legibility (replaces Inter as too generic). Used for: all numbers in charts and tooltips, axis labels, attribute names, section labels, UI controls (casing per the rule below).
- **Casing rule:** uppercase + letter-spacing is reserved for the **8 attribute names** (COVERAGE, POWDERY, …) — that is how the sensory lexicon is written, so it carries meaning. Every other label (section labels "Formula" / "Time" / "Attributes", tile labels, tags, buttons, tooltip labels) is **sentence case**. Exceptions: the time points T0 / T3 / T6, and the tags "Our formula" / "Market" which stay sentence case.
- **No tracking on the display face.** Chrome and Safari silently drop ligatures from any text run with a non-zero `letter-spacing`, which breaks `ffi` in *Affinity*. Libre Bodoni is therefore never letter-spaced; it carries `font-variant-ligatures: common-ligatures contextual` and `font-variant-numeric: normal` (it has no `tnum`, and tabular figures are a Red Hat Text rule that must not inherit into it). Optical spacing on display type goes into the words, not between the letters.
- **Platform constraint:** the demo runs on a Windows ThinkPad, possibly offline. Only OFL fonts. The `.woff2` files are **embedded in `index.html` as data URIs** (`scripts/fetch-fonts.mjs` downloads, `scripts/embed-fonts.mjs` inlines): `file://` blocks `@font-face` files loaded from a subdirectory, so a linked stylesheet silently falls back to Georgia. No system-only fonts (e.g. Bodoni 72), no runtime dependency on Google Fonts, nothing to lose out of the zip. `specimens/font-proof.html` verifies the embedded bytes against Google's own copy.

### 3.3 Depth — used exactly twice

1. **Segmented time control thumb.** A solid surface-colored capsule with a 1px edge, sitting in a recessed track (track = ink at ~4%, no inner shadow on the thumb). Flat and modern, not glossy: no inner shadow, no top highlight, no gradient. The affordance comes from the thumb reading as a physical object in a track, plus `cursor: grab` / `grabbing`, and a slight scale-down (~0.98) while dragging.
2. **Product image in the right panel** (§8.1): a very light drop shadow, so it sits on the page like an object.

Everything else is flat: no card shadows, no glassmorphism, no gradients as decoration, no glow. Hierarchy is carried by hairlines, surface color and whitespace.

---

## 4. Data

### 4.1 Dimensions

- **Formulas:** 53. Named ones: `NARS LightR`, `LANCOME TIU`, `YSL All Hours`, `DPDP Oil-control`; the rest `Product 5` … `Product 53`. `LANCOME TIU` and `YSL All Hours` are flagged `ours: true`; `NARS LightR` and all others `ours: false`. **`ours` is a presentation label, not a property of the data** — the generator must never constrain the simulated wear ranking by it, or the label and the physics contradict each other.

> Only the three named formulas above are mocked (3 × 3 × 8 = 72 pairs). The 53 / 1,272 figures on the tiles are demo copy the sensory team will replace; this is known and accepted, not an inconsistency to "fix".
- **Time points:** `T0`, `T3`, `T6` (hours after application).
- **Attributes (fixed order everywhere):**
  1. COVERAGE
  2. REFLECTION vs. BARE
  3. UNEVEN SKINTONE
  4. POWDERY
  5. CAKEY
  6. FLAKE
  7. IMBED INTO LINES
  8. CLOG INTO PORES
- **Scores:** 0.0 – 6.0, one decimal. Each cell has `panel` (mean of 15 panelists — averaging is upstream, not our concern) and `ai`.

### 4.2 Schema (`data.js`)

```js
{
  attributes: ["COVERAGE", "REFLECTION vs. BARE", ...],   // 8, fixed order
  times: ["T0", "T3", "T6"],
  formulas: [
    {
      id: "nars-lightr",
      name: "NARS LightR",
      ours: true,
      scores: {
        T0: [ { panel: 4.2, ai: 4.0 }, ... ],   // 8 entries, attribute order
        T3: [ ... ],
        T6: [ ... ]
      }
    },
    ...
  ]
}
```

Derived metrics are computed in the front end, never stored, so swapping in real data means replacing only `data.js`.

### 4.3 Metric definitions

- **Tolerance:** `|ai − panel| ≤ 0.5` counts as *accepted*. **[TBD: confirm the sensory team's own Acceptance Rate definition]**
- **Acceptance Rate (global):** accepted pairs ÷ all pairs (53 × 3 × 8 = 1272). Shown in tile 1, **to one decimal** — a whole number reads as rounded-off marketing, a decimal reads as measured. "Acceptance Rate" is the wording everywhere in the UI — never "accuracy", which reads as right/wrong.
- **Acceptance Rate (per formula):** accepted pairs ÷ 24 for that formula (all times), shown in the right panel. Same definition, same words, so the tile and the panel are consistent.
- **Average Difference (per formula, per selected time):** mean of `|ai − panel|` over the 8 attributes — MAE internally, but always labelled "Average Difference" in the UI, and `Diff` where the tooltip needs it short. Right panel small number.

### 4.4 Mock data "story"

Generate mock data so it looks physically plausible and flatters the model without lying:

- T6 scores for POWDERY / CAKEY / FLAKE / IMBED / CLOG are higher than T0 (wear degrades). COVERAGE drifts down slightly.
- `ours` formulas have slightly better affinity than the market mean.
- AI tracks panel closely: per-cell noise such that the global Acceptance Rate lands at **83–85%**. One or two attributes (e.g. REFLECTION vs. BARE) carry a little more noise than the rest, so the profile isn't unrealistically perfect.
- A few "showcase" formulas (the four named ones) are on the accurate end so the default view looks great.
- Seeded RNG so the demo is reproducible.

---

## 5. Top Bar & Stat Tiles

### 5.1 Top bar

- Left: title **Foundation Affinity × AI-lization** (Libre Bodoni) and the subtitle `AI-model powered by DINOv3 vs. Optiscreen Panel` (Red Hat Text, secondary ink) on **one line, sharing a baseline**, parted by a hairline-coloured `/`. Stacking them cost 34px of height that the chart needed; side by side the whole identity reads as one stroke across the top.
- Right: view toggle **Overlay | Split | Radar** (see §7.4), built as the **same capsule-in-a-recessed-track** as the time control (§3.3) — the two segmented controls on screen must read as one kind of thing — set a step larger and heavier than body text (17px / 500) because it is a control, not a caption. Radar is disabled (greyed, tooltip "single formula only") when more than one formula is selected.

### 5.2 Stat tiles (3)

Layout: the number and its label sit **side by side**, label to the right of the numeral, their **cap lines aligned** (not baselines). This keeps the row to 84px and hands the height to the chart. Number in Libre Bodoni 58, label 24, secondary line 16.

| Tile | Value | Label | Tooltip (how it's computed) |
|---|---|---|---|
| 1 | **83.4%** | Acceptance rate | "Share of all 1,272 attribute scores where the AI prediction is within ±0.5 of the panel mean." Secondary line under the label: `within ±0.5 on the 0–6 scale`. |
| 2 | **53** | Formulas covered | "Formulas evaluated, including our products and market benchmarks." **[TBD: split into ours / market counts?]** |
| 3 | **~70%** | Time saved | "Panel test cycle vs. image inference per formula." Demo placeholder — the real basis comes from the sensory team; don't invent numbers. |

Labels are sentence case (see §3.2), not uppercase.

Behavior:
- **Count-up** animation on page load (numbers roll from 0 to target, ~1.2 s, ease-out). Runs once. Kept deliberately: stakeholders read it as polish. Revisit if it starts to feel gimmicky in review.
- **Pinned.** Tiles never change with selection. They represent the whole project; the chart represents the evidence.
- **Hover:** no 3D tilt, no perspective transform. The tooltip / computation note fades in below the tile (~150 ms), and the tile's hairline separator darkens to ink. Nothing moves.

---

## 6. Left Column — Selectors

Three groups top to bottom: **Formula**, **Time**, **Attributes**. Groups are separated by hairlines with sentence-case labels ("Formula", "Time", "Attributes").

### 6.1 Formula selector

- **Closed state: a framed field, not a search box.** A bordered surface-coloured field reading *Select formula…* in **italic** Red Hat Text with a chevron at the right. It has to say "choose something here" before anyone touches it; a bare search line does not.
- **Open state:** the frame disappears and becomes the search line — underline only, italic *Search formulas…* placeholder — with the list beneath it. Typing filters live (case-insensitive substring); no match shows a quiet italic line naming what was typed. Escape or a click outside closes it.
- The list **floats over the column** on its own surface with a 1px edge and no shadow; it must not push the chips, time control and attribute list down.
- Dropdown list has two sections: **Our formulas** (top) and **Market**, separated by a hairline and a sentence-case label. Ours always listed first. Already-selected rows are marked *selected*; when three are chosen the rest go quiet and read *max 3*.
- **Ours vs. market glyph:** a small **filled circle** (ink color) before ours; a **hollow ring** before market. This glyph is used consistently in the list, chips, legend, and right panel header. Never color-coded.
- Selecting adds the formula as a **chip** below the search box. Max **3** chips; when 3 are selected, further list items are disabled with a hint "max 3".
- Chip order = product rank: 1st chip = **main** product (lavender), 2nd and 3rd = **comparators** (slate, rose). Each chip shows a color dot in its product color, the ours/market glyph, the name in Libre Bodoni, and a remove ×.
- Chips are **drag-reorderable**; reordering is mirrored live in the chart legend and in the chart (colors, z-order, opacity swap). The legend is also draggable — same state, two entry points.
- Removing the main chip promotes the next chip to main.
- Hover on a list item / chip: 4% ink background tint.

### 6.2 Time control

Segmented control **T0 | T3 | T6** with a sliding thumb (see §3.3 for the thumb's material). Track and thumb are **fully rounded capsules** (`border-radius: 999px`), not soft rectangles. The thumb must read as draggable before anyone touches it — that is what the recessed track, the solid raised thumb and the grab cursor are for; a plain underline marker would not say "you can slide this."

- **Click** on a segment: toggles selection (multi-select allowed only in single-formula mode, see §6.4).
- **Drag** the thumb: single-select; the thumb glides between segments and the chart lines flow in real time as the thumb passes each segment. Release snaps to nearest segment.
- In multi-select the thumb stretches to cover contiguous selected segments, or shows separate thumbs for non-contiguous ones (implementation detail; either is fine).

### 6.3 Selection modes (derived, never toggled by the user)

The user never picks a "mode." Whichever selector has more than one item selected **owns the legend**; the other is forced to single-select.

| Formulas selected | Times selected | Legend shows | Lines on chart |
|---|---|---|---|
| 1 | 1 | one entry | 2 (AI + panel) |
| 1 | 2–3 | time points | 2 × times (4 or 6) |
| 2–3 | 1 | formulas | 2 × formulas (4 or 6) |
| 2–3 | 2–3 | **not allowed** | — |

Rules:
- Selecting a 2nd formula while 2+ times are selected collapses time to the **most recently selected** time (thumb animates to it).
- Selecting a 2nd time while 2+ formulas are selected: not possible — the time control is in single-select mode (click behaves as a radio). A small hint appears on hover: "Deselect formulas to compare times."
- The selector that owns the legend shows a color dot on each selected item matching its line color. Time-mode colors reuse the same three product colors in order (T0 → lavender, T3 → slate, T6 → rose) — the palette is "up to three series," whatever the series are.

### 6.4 Attribute list (hover preview)

Eight rows, fixed order, Red Hat Text uppercase + letter-spacing (the one place uppercase is used, §3.2). Not a filter — the chart always shows all 8 attributes.

- **Hover** on a row: in the chart, all other attributes' points and line segments drop to ~30% opacity, and a soft vertical band (ink at ~4%) appears at that attribute's x-position. Right-panel row for the same attribute also highlights. Sweeping the mouse down the list produces a "scanning" effect — designed for live presentation.
- Mouse leave: everything restores with a short ease.
- Click: no action in v1 **[TBD: could pin the highlight]**.

---

## 7. Center — Chart

### 7.1 Chart header

- Left: chart title in Libre Bodoni (e.g. the main formula name, or "T0 · T3 · T6" in time mode) and a secondary line with the current time point / formula count.
- Right: **legend**, in **two rows of fixed height**. Row 1 holds the main series and nothing else; row 2 holds the comparators side by side, and stays empty when only one formula is selected. The block therefore keeps its height whether one series is shown or three, so **the chart never changes size or position when the selection changes** — a chart that shrinks each time a comparator is added reads as unstable, and the eye notices the jump more than the new line. Entry = series swatch + ours/market glyph (formula mode only) + name in Libre Bodoni; comparator names are set one step smaller. Legend entries are **drag-reorderable** (same state as chips, §6.1).
- **Line-style key** (`—— AI` / `‐ ‐ Panel`): drawn **inside the plot, upper right**, not in the header. Coverage runs high at the left of every formula, so the right shoulder is the emptiest corner of a 0–6 chart. It is a paper-filled box with a 1px hairline edge — it **masks the gridlines it sits on**, which is correct: it is a caption on the drawing, not part of it. Set in ink at 17px, not secondary grey at 14px; it has to be readable from the back of a room. It costs no layout height, which is what keeps the header fixed (above). A later refinement could label the two lines directly at their ends instead; at T0 the series converge to within 0.2 at the right edge, so those labels would collide today.

### 7.2 Line chart (Overlay view, default)

- x-axis: 8 attributes in fixed order, labels in Red Hat Text uppercase with letter-spacing, spread across the full width. Labels are horizontal; if width requires, break "REFLECTION vs. BARE" onto two lines rather than rotating.
- y-axis: 0–6, hairline gridlines at every 1.0, labels in secondary ink. No axis line, no tick marks — only gridlines and labels.
- Per series (formula or time) two lines. **The main series is drawn heavier than its comparators**, so rank reads off the line weight itself and not only off opacity:
  - **AI:** solid — main ~2.4px, comparators ~1.4px — filled circle markers (r 4.2 / 3.2).
  - **Panel:** dashed — main ~1.6px, comparators ~1px — hollow circle markers (r 4 / 3).
- **Main series** (rank 1): 100% opacity, drawn on top, plus the **fill band** between its AI and panel lines at 8% product color. Main series' AI points carry small value labels (Red Hat Text, secondary ink). The band is the visual "gap"; the tighter it is, the better the model looks.
- **Comparators** (rank 2–3): ~45% opacity, no fill band, no value labels, drawn beneath.
- Lines use a gentle curve (monotone cubic, Fritsch–Carlson) — not sharp polylines, not over-smoothed, and never overshooting a data point.
- Value labels carry a paper-coloured stroke behind them (`paint-order: stroke`) so they stay legible where the lines crowd.

### 7.5 Closing line

One sentence in Libre Bodoni sits below the plot, separated by a hairline and anchored to the foot of the centre column:

> Across eight attributes, the model never parts from the panel by more than 0.6 of a point.

It is **computed from the data**, not written into the markup, so it stays true when the data is replaced. It gives the foot of the page something to land on and hands a time-poor viewer one sentence they can carry out of the room. It describes the chart above it — the main formula at the selected time — never the whole project.

### 7.3 Interactions

**Point hover** (any series, any line): both the AI and panel points of that series at that attribute enlarge/highlight, and a tooltip appears:

```
NARS LightR · T3          (serif name, small time tag)
COVERAGE
AI      4.2
Panel   4.0
Diff    +0.2
Match.
```
The third row is labelled **`Diff`**, never `Δ`: neither Libre Bodoni nor Red Hat Text carries a Greek delta (Google ships latin / latin-ext only), so `Δ` would fall back to a system font — one stray glyph in the wrong typeface, most visibly on the Windows machine this is presented from.

Tooltip in a small surface card, ink text, Red Hat Text tabular numbers. The closing line reads **"Match."** and appears only when the pair is accepted (no negative wording when not — just omit the line).

**Line hover on a comparator:** only the hovered line (e.g. the panel line of product 2) rises to 100% opacity and gains ~0.5px weight. Its sibling line (the AI line of the same product) stays as-is. Leave restores.

**Click on a comparator line:** that product **swaps rank with the main product** — colors, z-order, opacity, fill band, value labels, legend order, and chip order all swap together, animated (~500 ms). This is the same operation as dragging the chip/legend entry to position 1.

**Series transition ("flow"):** whenever the selection changes (formula swap, time change, rank swap, thumb drag), lines animate from their old y-positions to the new ones (~600 ms, ease-in-out) rather than redrawing. Added series fade in along their path; removed series fade out. The fill band morphs with the lines.

**Attribute hover** (from left list, §6.4): dims other attributes, shows vertical band.

**Empty state:** if no formula is selected, chart shows the axes and gridlines only with a centered secondary-ink hint "Select a formula." On load, default selection = `NARS LightR`, `T0`.

### 7.4 View toggle: Overlay | Split | Radar

- **Overlay** (default): everything above in one chart.
- **Split:** the chart area divides into 1–3 side-by-side panes (one per series), shared y-axis, each pane showing that series' AI + panel lines plus its own fill band (every series gets the band in split, since there's no overlap). The transition **animates**: lines travel from their overlaid positions into their own pane. Attribute labels in split may need abbreviation **[TBD: abbreviations, e.g. COVER / REFL / UNEVEN / POWD / CAKEY / FLAKE / LINES / PORES]**. Single-series Split is identical to Overlay.
- **Radar:** 8-axis spider plot, one polygon for AI (solid, 8% fill) and one for panel (dashed, no fill), main product only. Radial scale 0–6. **v1: single formula only**; disabled with tooltip when 2+ formulas selected. Multi-formula radar (as small multiples) is a later iteration. Transition from line to radar: fade/cross-dissolve is acceptable; a true morph is optional.

Hover/tooltip behavior in Split and Radar mirrors Overlay where applicable.

---

## 8. Right Column — Formula Panel

Always describes the **main** series (rank 1). In time mode it describes the main formula at the highlighted time (rank-1 time).

### 8.1 Header

- **Product image slot.** In the demo this is a generic bottle silhouette (original SVG, not brand packaging), tinted in the product color, with a light drop shadow. It is a **placeholder**: the sensory team will drop in real product photography, which is faster to recognise than a name. Build it as a fixed-size image slot (one `<img>` / SVG swap per formula id) so replacing art means replacing files, not layout.
- Formula name in Libre Bodoni, ours/market glyph, tag "Our formula" / "Market" (sentence case).
- Current time point tag.

### 8.2 Agreement profile (8 rows)

One row per attribute, fixed order, aligned with the chart's x-axis order.

Each row: attribute label (Red Hat Text uppercase) · a hairline track representing the 0–6 scale · **panel score as a hollow ring**, **AI score as a filled dot**, both positioned on the track by value · two small numbers at the right (`AI / panel`, tabular).

- When `|Δ| ≤ tolerance`, the dot sits inside the ring — a **hit**. The row reads as a bullseye. Numbers in ink.
- When outside tolerance, dot and ring are visibly separated. Numbers in secondary ink. **No red, no icon, no warning.**
- Dot uses the main product color; ring uses ink at reduced opacity.
- **Comparators** (when present): their AI scores appear as small dots in their own colors at ~40% opacity on the same tracks — dots only, no rings — so cross-product agreement can be read without switching.
- Rows respond to attribute hover from the left list (highlight) and from chart point hover.
- Dots/rings animate along the track when selection changes (same easing as the chart).

### 8.3 Summary numbers

- **Acceptance rate** (per formula, §4.3) as a large Libre Bodoni number **to one decimal**, e.g. `87.5%`, with the label "Acceptance rate", a secondary line "within ±0.5 of the panel" and a small `21 / 24`.
- **Average difference** as a small Red Hat Text number for the current time point (MAE internally — never shown as "MAE").

---

## 9. Motion Summary

| Trigger | Motion | Duration |
|---|---|---|
| Page load | Tiles count up; chart lines draw in (stroke-dashoffset) | ~1.2 s |
| Selection change | Lines flow to new positions; band morphs; panel dots slide | ~600 ms ease-in-out |
| Thumb drag | Lines follow thumb continuously | real-time |
| Rank swap (click/drag) | Color, opacity, z-order, band, legend/chip order all cross-fade/reorder together | ~500 ms |
| Overlay → Split | Lines travel into panes | ~700 ms |
| Attribute hover | Dim + vertical band | ~150 ms in, ~250 ms out |
| Tile hover | Tooltip fades in below the tile; hairline separator darkens. **Nothing moves** (§5.2) | ~150 ms |
| Line/point hover | Opacity/weight lift; tooltip | ~120 ms |

Easing: prefer a single custom cubic-bezier used everywhere for consistency. Respect `prefers-reduced-motion` (skip flow animations, keep state changes instant).

---

## 10. Implementation Notes

- Single self-contained `index.html` (inline CSS + JS, fonts embedded as data URIs) plus `data-core.js` and one `data-<formula>.js` per formula (mock data on `window.AFFINITY_DATA`, swappable). Ship as a zip; opens by double-click on Windows.
- Scripts (all plain Node, no dependencies):
  - `scripts/generate-data.mjs` — seeded mock data + printed verification. Seed 13488. Hand-tuned cells live in its `OVERRIDES` table so a re-run reproduces the approved data byte for byte instead of reverting it.
  - `scripts/fetch-fonts.mjs` — downloads the woff2 subsets and records each one's real `unicode-range` in `fonts/manifest.json`. Google writes the subset name in a comment **before** its `@font-face` block; pairing them wrong ships the wrong subset under the right filename, which renders as a plausible but wrong face.
  - `scripts/embed-fonts.mjs` — inlines those files into `index.html`, reading ranges from the manifest and failing loudly if a file's size disagrees with it.
  - `scripts/make-font-proof.mjs` — builds `specimens/font-proof.html` from the bytes actually embedded in `index.html`, against Google's live copy.
- Charts drawn with SVG (D3 or hand-rolled) — needed for path morphing, per-point hover, and the fill band. Canvas not required at this size.
- Fixed 1920 × 1050 canvas; scale-to-fit the viewport with `transform: scale()` on a wrapper so it demos cleanly on any projector without reflow.
- No external chart-template libraries (license). Visual references (hairline, countable-unit, editorial whitespace) are reproduced in spirit only.
- Tooltips and hint texts in English.

---

## 11. Iteration Plan

1. ~~**Static skeleton**~~ — **done.** Layout, tiles, left column, line chart with main + one comparator, right panel, closing line; the formula picker is live (open / search / select / remove, max 3) and redraws everything. Fonts embedded and verified. Remaining from this round: the bottle silhouette is a rough placeholder, and the tooltip label is settled as `Diff` (§7.3).
2. **Core interactions** — formula/time selection with mode rules, flow transitions, point/line hover + tooltip, rank swap via click/drag, attribute hover preview, tile count-up + tilt.
3. **Views** — Split with animated transition; Radar (single formula).
4. **Polish** — thumb skeuomorphism, bottle silhouette, reduced-motion, edge cases (max-3 hint, empty state).

---

## 12. Open Items [TBD]

- Tolerance value and the exact Acceptance Rate definition from the sensory team.
- Subtitle text under the title.
- Tile 3 "Time saved" basis (X days vs. Y minutes).
- Whether tile 2 should split ours / market counts.
- Attribute abbreviations for Split view.
- Whether attribute-row click should pin the highlight.
- Optional: a 30px sparkline in the chart header showing the main formula's acceptance rate across T0 → T3 → T6, if the header feels empty after step 1.
