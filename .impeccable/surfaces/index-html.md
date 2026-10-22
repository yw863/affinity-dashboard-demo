---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["index2.html"]
---

## Scope

`index2.html` — the whole product, rebuilt from scratch against `DESIGN.md` v2 alongside the untouched v1 `index.html` (the v1 page is evidence of the font, stage-scaling and glass machinery only; its layout, tiles, panel-vs-AI story and right-hand card are discarded). One fixed 1920 × 1050 screen, scaled to fit, no page scroll. Visitor mode: **Operate** — a working toolbox for the sensory team — judged as **Persuade** underneath, because the author demonstrates it live to leadership and it must impress on sight.

## Audience, job, constraints

- **Task.** Import a formula's AI readings, then either track one formula across T0 / T3 / T6 (Dynamic) or judge up to two formulas against one bench (Comparison), and lift the chart into a slide.
- **Watcher.** A non-technical leader who sees it once, assumes nothing, and must read *where formulas differ and whether that is good or bad* from the drawing alone.
- **Constraints.** Windows ThinkPad (~13–14"), offline, `file://` double-click, shipped as a zip; fonts embedded; mock data labelled as mock; fake upload, real selection / significance / export. Legibility on the 13" ThinkPad outranks density: the 1920 canvas renders at roughly 0.7×, so nothing that must be read may be set small (user: "too dense / small" is what would make it feel wrong).

## Direction contract

**THESIS.** A vertical sensory profile drawn straight on lilac paper, compared series against a dashed bench line: a point whose difference reaches its attribute's threshold is significant, and a soft halo says better or worse. The controls are one editorial sentence — *Compare [A] and [B] against [Bench]* / *Track [Formula] over [T0][T3][T6]* — at once selector, chart title and legend. It refuses the category default (a filter sidebar, a KPI card row, a carded chart with a legend box) and its timid opposite, the bare academic plot.

**OWN-WORLD.** Lilac paper `#F5F3F7`, opaque surface `#FCFBFD` for standing controls, white `#FFFFFF` for the bench pill, hairlines `#DCD9E0`, ink `#2A2537` for text; the bench line a lighter dashed `#8E85A2`. Series A brand violet `#625492`, series B slate `#61829E`; verdict pair sage `#74936C` (better) and clay red `#B15D59` (worse), carried by halos and always spelled out in words. Libre Bodoni 400 upright and italic, never tracked, for title, connective words, verdict, display numerals; Red Hat Text tabular for formula IDs, data and controls; uppercase tracking only for the eight attribute names. Smoked-vellum glass for everything that follows the pointer and leaves; no decorative cards. Ornament: a fine 0–6 ruler, faint Didone T0 / T3 / T6 band numerals in each block's lower-right corner, with the two-item Better / Worse key on the last one's baseline, ink-drop pills, a breathing bench slot.

**STORY.** The screen opens empty and grammatical. A file is dropped; a counter rolls to 24 readings; `Lancome TIU #PO_01_Anker 4.15` writes itself into the library and into A; the bench slot breathes. The presenter clicks `b53176_NARS #L2`; both lines draw down the profile, halos bloom where they part, and a one-line verdict and counting tally arrive. The leader understands at a glance which attributes differ and which way, believes the team could use this tomorrow, and the chart is copied straight into a slide.

**FIRST VIEWPORT.** The whole product is the first viewport. A one-line top bar: the title in Bodoni with its subtitle on the same baseline at the left; the Dynamic | Comparison capsule and the quiet model badge at the right. Beneath, three columns parted by full-height hairlines: a narrow library (search, dashed drop zone, *Uploaded*, scrolling *History*, template link); then the sentence spanning the remaining width as the title of everything below it; under it the chart and the findings sharing that width about equally. The chart carries the ruler across its top and attribute labels with polarity arrows down its right edge — 24 rows in three time blocks for Comparison, 8 taller rows plus the formula record for Dynamic. Findings: Bodoni verdict, Didone tally, better / worse lists, then the library-position strips. On first load the primary action is the drop zone; afterwards it is the breathing bench slot.

**FORM.** Brief-pinned: `DESIGN.md` v2 is the user's own specification, authored through discussion, and pins world, composition, palette, type, interaction and motion, so no concept roll or tournament ran. Seed key: none (pinned brief, no roll). Code-led build (`buildPath: code`), so the ambition lives here and in the signature moment: the **first comparison** — lines draw down the profile, halos bloom in reading order, then verdict and tally — backed by one easing curve, lines that *flow* to new positions on every selection change, and one shared highlight linking chart, findings, strips and library. Anti-slop is binding, and so is its counterweight: under-design is an equal failure.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- User direction on 2026-10-22 superseded parts of DESIGN.md §8 and §10 (no white corridor, straight continuous polylines, dashed light bench, no Dynamic record); DESIGN.md §16 records them.

- Everything in `DESIGN.md` §15.
- Documenter boundary: `DESIGN.md` is user-authored and authoritative. At finish the documenter extends it (token sections, `.impeccable/design.json`) and corrects only what the build proves different, with the user's approval — it does not replace the v2 spec.
- Windows ThinkPad check (rendering, pointer precision, clipboard, PNG export) is the author's; it cannot be run from the build machine.
