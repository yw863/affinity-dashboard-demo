---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

## Scope

`index.html` — the entire product. One fixed 1920 × 1050 screen, no scroll, scaled to fit whatever projector it lands on. Visitor mode: **Persuade** (it is a demonstration that must win belief and budget), executed with Operate's instrument vocabulary because the argument it makes is made of measurements.

## Audience and job

One viewer: a senior, non-technical global leader with almost no time, watching once while the author talks over the screen. She is not operating anything. She must, within seconds, see that the AI line and the panel line sit on top of each other, and remember the project afterwards. Constraints: Windows ThinkPad, possibly offline, `file://` double-click, self-hosted OFL fonts, brand purple fixed, mock data labelled honestly, one-off (no error/empty/loading/responsive states beyond scale-to-fit).

## Direction contract

**THESIS.** The screen's one idea is *two lines that will not separate*: agreement is shown as a vanishing gap, never as an error bar, never as a score card. It refuses the category default of a KPI dashboard — a grid of equal cards each holding a metric — and refuses its predictable opposite, the bare academic plot on white. The stat row is printed type on paper, not tiles; the chart is drawn directly on the page with no container; the only card on the screen is the one panel that holds a physical object.

**OWN-WORLD.** Warm lilac-grey paper `#F5F3F7`, one step lighter surface `#FCFBFD`, purple-black ink `#2A2634`, hairlines `#DCD9E0`. Three product hues only — lavender `#7B6EA6`, slate `#61869E`, rose `#A66E79` — assigned by rank, never by meaning; AI-vs-panel is carried entirely by line style (solid + filled marker vs. dashed + hollow ring). Libre Bodoni 400 at every size for display and every number of consequence; Red Hat Text 300–400 tabular for data and labels; uppercase + tracking reserved exclusively for the eight sensory attribute names, because that is how the lexicon is written. Structure is hairlines, surface contrast and whitespace — no card shadows, no glass, no gradient, no glow. Depth appears exactly twice: the time control's thumb and the product object's drop shadow. Recognizable with all content removed by: lilac paper, vertical hairline column rules, a Didone number at 64px sitting directly on the ground, and one dashed line shadowing one solid line.

**STORY.** She sees a headline acceptance figure, then a chart where the dashed panel line and the solid AI line trace the same shape across eight attributes with a hair-thin tinted band between them. The right panel closes it: eight rows where a filled dot sits inside a hollow ring, over and over — a column of bullseyes. She understands that a model read a photograph and arrived where fifteen trained humans arrived. She believes the project works. She approves continuing it.

**FIRST VIEWPORT.** The whole product is the first viewport. Top bar, 80px: title in Libre Bodoni at the left with its DINOv3-vs-Optiscreen subtitle beneath; the Overlay | Split | Radar toggle at the far right. Tile row, 108px: three numbers — 83%, 53, ~70% — set in Libre Bodoni at display scale directly on the paper, separated by full-height vertical hairlines, sentence-case labels beneath, nothing carded. Work area below, three columns at 300 / ~1100 / 400 with 24px gutters: left holds Formula (search, chips), Time (segmented control), Attributes (eight uppercase rows), separated by hairlines; center holds the chart header (serif formula name, legend, line-style key) over the SVG plot — eight attributes across the full width, 0–6 gridlines, the main formula's AI and panel lines with an 8%-tint band sealed between them; right holds the one card on screen — bottle silhouette with its light shadow, formula name, eight agreement rows each reading as a dot-inside-ring, and the per-formula acceptance rate as a large Didone number. There is no call to action; the presenter is the action.

**FORM.** Brief-pinned. `DESIGN.md` is the user's own specification and pins world, composition, palette, type, interaction and motion; under new-work §3 a user-pinned direction beats the roll, and this is a precisely specified narrow request, so no concept-seed was run and no tournament applies. Anti-slop is an explicit binding constraint, and so is its counterweight: under-design is an equal failure — the viewer was promised a screen that looks *fancy*, so richness is added by making choices more specific, never by stripping until nothing can be criticized. Seed key: none (pinned brief, no roll).

**Signature interaction and motion grammar** (code-led, so the ambition lives here): the **flow** — every selection change animates the lines from their old y-positions to their new ones over ~600ms on one shared easing curve, the fill band morphing with them, rather than redrawing. Dragging the time thumb makes the whole chart follow the cursor in real time; that is the moment the screen stops being a picture. Secondary: sweeping the attribute list dims all but one attribute and drops a soft vertical band into the chart, a scanning motion built for live narration. One curve everywhere; `prefers-reduced-motion` skips the flow and keeps state changes instant.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- `DESIGN.md` §9 still lists "Tile hover: 3D tilt follows cursor; lift" while §5.2 explicitly removed it. §5.2 governs; §9's row needs correcting.
- §4.1 says 53 formulas and §4.3 says 1272 pairs; the mock data holds 3 formulas / 72 pairs. Known and accepted by the user — tiles 1 and 2 present the spec's numbers as demo copy.
- §12 items remain open and non-blocking: tolerance confirmation, tile-3 basis, tile-2 split, Split-view attribute abbreviations, attribute-row click.
- Fonts are still to be self-hosted as `.woff2`; round 1 may use a local/CDN load, but shipping requires the self-hosted files.
