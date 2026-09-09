# Symptom section — design 02

Three items of direct client feedback. Designed against the code as it stands
after design-01 was built (HEAD `4d507233`). Nothing here undoes a design-01
decision; where one is adjusted, it is named and the reason given.

Only the auditor writes to the site. No site file was edited to produce this.

## Baseline re-measured before designing

Chromium via Playwright against `localhost:5000`, every non-localhost request
aborted. Viewports 390x844, 768x1024, 1280x800, plus 320x568 as the small case.

| | 390x844 | 768x1024 | 1280x800 |
|---|---|---|---|
| index page height | 5,369 | 4,649 | 4,689 |
| `.sc-index` band height | **1,953** | 1,839 | 1,781 |
| `.sym-find-input` top | 591 | 655 | 758 |
| first common tile `li` top | **772** | 824 | 927 |
| fever page height | 4,092 | 3,387 | 3,324 |
| `.sym-embed-frame` top / height | 730 / **460** | 748 / 560 | 744 / 560 |
| `.sym-next` band height | **1,173** | 769 | 746 |

Two obstructions that every number below has to respect, measured not assumed:

- The theme's `<header>` is `position: sticky`, **58px** at 390, **63px** at 768,
  **116px** at 320 (it wraps), and **not sticky at 1280**.
- `.ctadock` is `position: fixed`, 56px tall, sitting 16px off the bottom, so it
  covers the **bottom 72px** of the fold at 390, 768 and 1024. It is absent at
  1280. Usable fold height is therefore 714px at 390x844, 889px at 768x1024,
  380px at 320x568, and 800px at 1280x800.

Consequence worth recording, because design-01 finding 5 claimed otherwise: the
first common tile row already begins at exactly **y=772 at 390**, which is
exactly where the CTA dock starts. There is **no unobstructed tile pixel on the
first screen today**. Finding 5's "a full 48px row visible" was measured against
the 844 fold without the dock.

## Reuse, stated before anything new was invented

The section has ~50 `.sym-*` / `.sc-*` classes. What follows is what I am reusing
rather than adding to that count.

| existing | reused for | why |
|---|---|---|
| `.sym-embed-stage` panel: `#f4f5f6`-family fill, `1px #e4e7ea`, radius 14 | `.sc-find-plinth` and the browse panel | the section already has exactly one panel shape; these are a third and fourth *content*, not a third and fourth style |
| `.sym-alert`'s `border-top: 3px solid` accent band | the plinth's blue top edge | a recorded idiom for "this strip is a thing in its own right" |
| the page's white/grey band alternation with a hairline seam | grey plinth / white common / grey panel, one level down inside `.sc-index` | this *is* the recorded fix for "no dividers between sections", applied where the client says it does not reach |
| `.sym-sec` uppercase label + `2px #eef0f2` rule | unchanged, gains a 44px accent segment | the section already has one way to say "label, not heading" |
| `.sym-call-list` / `-item` / `-office` / `-num` / `-note` | unchanged geometry, tightened, re-parented | item 2 moves the grid, it does not restyle it |
| `.sc-routes` bullet list with a bold lead-in | becomes the only structure in `.sym-next` | one list idiom instead of a list plus a labelled grid plus a button row |
| `.sym-embed-frame` single `height` declaration | item 3a changes the value, not the mechanism | no new element, no new class, no JS |
| `tools/check-symptom-links.mjs` | the shape of `tools/measure-frames.mjs` — a dev-only script that hits AAP, validates the response and reports per slug | the repo already has a tool that does exactly this kind of job |
| `hidden` in markup, JS reveals | untouched | UI_RULES 4 |

**No new class is introduced except `.sc-find-plinth`.** Item 2 introduces none.
Item 3a introduces none.

No dependency, no bundler, no theme file, and nothing that requires the iframe to
have loaded.

## Build order

```
1   CSS + one wrapper div in symptomIndexList()      index only
2   CSS + markup in renderSymptomPage()/callList()   164 pages, below the frame
3a  three CSS declarations                           158 pages, the frame
3b  a new dev-only tool, cannot be run here          strictly optional, later
```

Each is buildable alone and none depends on another. 3b is a pure enhancement
over 3a and the section is correct and finished without it.

---

# 1. The index runs search, common and categories together on one white field

## The problem

> "The main symptom page needs better UI specifically under the categories. the
> search bar, common issues, and categories are all in one section but they lack
> color to divide them up and make it obvious what is going on."

Measured: `.sc-index` is a single **1,953px** band at 390. Inside it,
`getComputedStyle().backgroundColor` is `rgb(255,255,255)` on the band and
`rgba(0,0,0,0)` on `.sym-common`, `.sym-browse` and `.sym-group-toggle`. There is
no surface change anywhere inside it. The only internal boundary is the
`2px #eef0f2` rule under the two `.sym-sec` labels — `#eef0f2` on white is about
**1.09:1**, which is a boundary a designer can see in a diff and a frightened
parent cannot see on a phone.

UI_RULES records "no dividers between sections, so the whole index merged into
one block" as a fixed fault. It was fixed with a hairline plus generous padding
**at the band seams**. The client is reporting the identical fault one level
down. design-01 finding 5 tightened the spacing inside `.sc-index` by 154px,
which is very likely what made it visible.

## The design in one sentence

Three functions get three surfaces — grey plinth, white field, grey panel — which
is the page's own band alternation applied inside the band, plus one saturated
brand accent on each zone's entry point.

## The markup

`src/render/symptoms.ts`, `symptomIndexList()`. One wrapper `<div>` and one
`</div>`; the `<noscript>` moves inside it. Nothing else in the fragment changes.

```html
<div class="sc-find-plinth">
	<div class="sym-find">
		<label class="visually-hidden" for="sym-find-input">Type what you are seeing</label>
		<div class="sym-find-box"> ... unchanged ... </div>
		<p class="sym-find-hint">Everyday words work: &#8220;throwing up&#8221;, &#8220;poop&#8221;, &#8220;bug bite&#8221;, &#8220;hit head&#8221;.</p>
		<p class="sym-find-count" role="status" aria-live="polite"></p>
	</div>
	<noscript><p class="sym-find-off">Type-to-search needs JavaScript. Every one of the ${symptoms.length} pages is listed below, grouped by what you can see or hear.</p></noscript>
	<div class="sym-emergency" hidden> ... unchanged ... </div>
	<div class="sym-none" hidden> ... unchanged ... </div>
</div>
<div class="sym-group sym-common"> ... unchanged ... </div>
<div class="sym-browse"> ... unchanged ... </div>
```

The `<noscript>` moving inside the plinth is load-bearing, not tidying: `build.ts`
line 67 ships `<noscript><style>…​.sym-find{display:none}</style></noscript>`, so
with scripting off an empty plinth would otherwise render as a bare grey box with
a blue edge and nothing in it. With the paragraph inside, the plinth becomes the
box that explains itself. **`build.ts` is not touched.** Verified by serving the
page with `javaScriptEnabled: false` and rewriting the response — the plinth
renders holding the explanatory sentence, with no empty box.

`.sym-emergency` and `.sym-none` move inside because they are the search's
*output*. `site.js` reaches all four of these with document-scoped
`querySelector` (lines 1268–1279), so **no JavaScript change is required.**

## The CSS

Mobile first. Breakpoint at 768 only, and only for padding.

```css
/*
 * The client's report: search, common and categories "are all in one section
 * but they lack color to divide them up". Measured, that is literally true —
 * `.sc-index` is 1,953px of one white field at 390 and every child computes to
 * a transparent background. The two `.sym-sec` rules that were doing the
 * dividing are `#eef0f2` on white, about 1.09:1.
 *
 * The answer is the page's own alternation, one level down: the tool sits on a
 * plinth, the twelve common topics stay on the page's white, and the thirteen
 * categories sit in a panel. Grey, white, grey. The panel shape is
 * `.sym-embed-stage`'s, so this is a third content in an existing shape rather
 * than a third card style.
 */
.sc-find-plinth {
  max-width: 660px;
  margin: 0 0 18px 0;
  padding: 12px;
  background: #f4f5f6;
  border: 1px solid #e4e7ea;
  border-top: 3px solid #2b93d1;   /* `.sym-alert`'s idiom, in the other brand colour */
  border-radius: 14px;
}

.sc-find-plinth .sym-find { margin: 0; max-width: none; }
.sc-find-plinth .sym-find-hint,
.sc-find-plinth .sym-find-count { margin: 6px 4px 0 4px; }

/* White-on-#f4f5f6 is 1.06:1. The input keeps its own edge. */
.sc-find-plinth .sym-find-input { border-color: #c9ced4; }

/* Its own surface would vanish into the plinth's; the answers are white now. */
.sc-find-plinth .sym-none { background: #ffffff; }
.sc-find-plinth .sym-none,
.sc-find-plinth .sym-emergency { margin: 12px 0 0 0; max-width: none; }

/* Only ever inside <noscript>. The plinth supplies the surface it used to. */
.sc-index .sc-find-plinth .sym-find-off {
  margin: 0;
  padding: 0;
  max-width: none;
  background: none;
  border-radius: 0;
}

/* Recovering most of the plinth's own height from copy above it. */
.sc-index h2 { margin-bottom: 6px; }        /* was 10 */
.sc-index .sc-lead { margin-bottom: 10px; } /* was 18 */
.sc-index .sym-common { margin-bottom: 28px; }

.sc-index .sym-browse {
  margin: 0;
  padding: 16px 14px 6px 14px;
  background: #f4f5f6;
  border: 1px solid #e4e7ea;
  border-radius: 14px;
}

/* Thirteen rows reading as one machine rather than thirteen stray lines. */
.sc-index .sym-browse .sym-group-toggle {
  margin-bottom: 8px;
  background: #ffffff;
  border: 1px solid #e4e7ea;
  border-radius: 10px;
}

/*
 * Caused by this change, not a separate fix: this heading is only visible with
 * scripting off, and `#8a8a8c` was already 3.44:1 on white. On the panel it
 * would be 3.16:1. `#5a5b5d` is 6.23:1 on `#f4f5f6`.
 */
.sc-index .sym-browse .sym-group-title { color: #5a5b5d; }

/* The saturated cue the client asked for, on the two entry points that have a
   label. Decoration on top of the surface and the label, never the only signal. */
.sc-index .sym-sec { position: relative; }
.sc-index .sym-sec:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 44px;
  height: 2px;
  background: #2b93d1;
}
.sc-index .sym-common .sym-sec:after { background: #f58220; }

@media (min-width: 768px) {
  .sc-find-plinth { padding: 16px; }
  .sc-index .sym-browse { padding: 22px 20px 10px 20px; }
}
```

`.sc-index h2`, `.sc-index .sc-lead` and `.sym-sec` already exist at site.css
5295–5311; those three are **edits in place**, not duplicate rules.

`.sc-index` scoping matters: `.sym-sec` is index-only today but the prefix costs
nothing and keeps a bare `.sym-sec:after` out of the cascade.

## The behavior

None. There is no JavaScript in this design, and none is changed. Content ships
functional: with scripting off the plinth holds the sentence explaining why the
box is missing, both panels are `hidden` attributes the browser honours without
script, all 164 tiles are expanded, and the browse panel is a grey surface behind
thirteen expanded groups. Verified with `javaScriptEnabled: false`.

## The states

| state | what happens |
|---|---|
| empty (no query) | plinth holds input + hint; `.sym-find-count:empty` stays hidden; the plinth is 140px at 390 |
| loading | nothing loads. All markup is server-rendered; the plinth has a fixed height from its content, so nothing shifts |
| error | there is no request to fail |
| no match | `.sym-none` appears **inside** the plinth on white, immediately under the input. Verified: the panel is on the first screen and reads as "the box answered", which is what design-01 finding 6 was for |
| emergency word | `.sym-emergency` appears inside the plinth, cream on grey with its `2px #f58220` border. Verified with `seizure` at 390 |
| long content | the plinth grows downward only; nothing above it moves. The browse panel with all 13 groups open is ~9,000px of grey surface, which is a surface, not a fault |
| short content | the plinth's minimum is input + hint = 140px at 390 |
| longest plausible string | at **320** the browse panel is 296px wide and its toggles measure **266 x 51px** — "Ears, nose, mouth and teeth" still sits on one line with its count badge, above the 44px minimum. A 40-char pasted query is already truncated by `.sym-none-q` and `overflow-wrap: anywhere` |

## Theme

The site has **no dark mode**: `prefers-color-scheme` appears zero times in both
`site.css` and the vendored theme. Light only.

Contrast, computed:

| | on `#f4f5f6` | verdict |
|---|---|---|
| `.sym-sec` `#636466` 15px/700 | **5.43:1** | AA |
| `.sym-find-hint` `#636466` | 5.43:1 | AA |
| `.sym-group-title` `#5a5b5d` (JS off) | **6.23:1** | AA, up from 3.16 |
| `.sym-group-toggle` `#4a4b4d` on its white card | 8.73:1 unchanged | AA |
| `.sym-find-count` `#1a6f9f` | 5.04:1 (design-01) | AA |
| plinth top edge `#2b93d1` (non-text) | ~3.2:1 on white | 1.4.11 |

Brand handling: `#2B93D1` and `#F58220` are used **exactly**, as fills only, on
the plinth edge and the two accents. The greys are the existing `#f4f5f6` /
`#e4e7ea` panel tokens, not new colours. Green is deliberately not used: on this
site green means "book an appointment" and is spoken for by the CTA dock.

Honest limit: the `2px #f58220` accent is 2.59:1 against white and would fail
1.4.11 **if it were carrying meaning on its own**. It is not. Each zone is named
in text at 5.43:1 and separated by a surface change; the accent is the colour the
client asked for, layered on top.

Forced-colors mode replaces the fills and borders with system colours; the zones
survive because each is a bordered box with a text label.

## What it costs

- **CSS**: 1,420 bytes raw, **481 gzipped**, on a 133,181 / 38,093 file (+1.3%).
- **HTML**: `<div class="sc-find-plinth">` + `</div>` = **32 bytes**, on one page.
- **Reflow**: none. Every dimension is static and resolved at first style pass.
  The panels grow downward on user input only, so nothing above the caret moves.
  No layout shift after paint.
- **Vertical cost**, measured before/after with the tuned values above:

| | first tile `li` top | `.sc-index` height | page height |
|---|---|---|---|
| 390 | 772 → **786** (+14) | 1,953 → 1,992 | 5,369 → 5,408 |
| 768 | 824 → **846** (+22) | 1,839 → 1,896 | 4,649 → 4,706 |
| 1280 | 927 → **949** (+22) | 1,781 → 1,838 | 4,689 → 4,746 |

The +14px at 390 is spent below y=772, which is where the CTA dock starts, so it
moves nothing that was visible into a place that is not. Both before and after,
the first tile row is behind the dock. Stated plainly so nobody records this as
"design-02 pushed the tiles off the first screen": they were already off it.

If an auditor wants strict parity, `.sc-index { padding-top: 18px }` (from 24)
recovers 6 of the 14 and `.sc-lead { margin-bottom: 6px }` recovers 4 more. I am
not proposing them, because 10px of air above the H2 is worth more than 10px of
a row nothing can see.

## What I rejected

- **Colour-filled zone headers** (a blue bar behind "COMMON RIGHT NOW"). This is
  the design that turns a medical page into a chart. It also puts white text on
  `#2B93D1`, which caps at 3.53:1 and is a theme-wide constraint out of scope.
- **A third `.sym-sec` label above the search box** ("SEARCH"). Three parallel
  labels would be the clearest information design and it costs ~42px directly
  above the fold, on the one page where design-01 spent a whole finding buying
  that space back.
- **Different fills per zone** (e.g. blue-tinted search, orange-tinted common).
  Four surfaces on one band, two of them tints of alarm colours, on a page a
  parent reads at 3am.
- **Full-bleed coloured bands inside `.sc-index`.** They would need negative
  margins out of `.container` and would fight the band's own `border-top` seam,
  reopening the recorded divider fault at the outer level to fix it at the inner.
- **Splitting `.sc-index` into three `<section>`s** with the theme's `whitebg` /
  `graybg` utilities. That is the correct shape in principle, but the fragment is
  injected into `src/content/symptom-checker.html` at `{{SYMPTOM_LIST}}` inside
  one `.col-12`; three real bands means restructuring a hand-edited copied file
  that `tools/sync-from-live.py` empties. Higher risk, same visual result.
- **Making the browse panel white with a border and leaving the plinth grey.**
  Then the plinth and the panel do not read as siblings and the middle zone has
  no boundary at all.
- **Restyling `.sym-tiles a`** to sit better on the panel. The tiles are not on
  the panel; `.sym-common` deliberately stays on the page's white so that the
  fast path is the one thing not in a box.

---

# 2. "Getting your child seen" is cluttered

## The problem

> "The 'Getting your child seen' of the individual symptoms page is also not very
> pretty and needs some work. it looks very cluttered."

Measured on `/symptom-checker/fever/`, identical on all 164:

| | value |
|---|---|
| `.sym-next` height at 390 | **1,173px** — 1.39 phone screens, **28.7%** of the 4,092px page |
| height at 768 / 1280 | 769 / 746 |
| elements inside | **54** |
| words | 143 |
| links | **13**, to **11 distinct destinations** |
| headings before any content | **2** (H2, then `.sym-call-title`) |
| type treatments | **5** — blue H2, uppercase grey label, orange bold lead-in, blue underlined inline links, grey italic — plus two white-on-blue pills |

Three specific faults behind the word "cluttered":

1. **Two headings in a row.** `.sym-call-title` reads "CALL YOUR OFFICE — A NURSE
   ANSWERS AT ANY HOUR" (36px over two lines at 390). The first route 400px below
   reads "Talk to a nurse now, at any hour." The band says the same thing twice,
   in two different type treatments, with the eight numbers stranded between
   them — the grid arrives **before** the sentence that explains it.
2. **Two links are duplicates.** `.sym-acts` at the foot is
   `/medical-care/sick-visits/` and `/locations/`. Both are already linked in the
   prose above: `same-day appointments` and `Hours, addresses and directions`.
   105px plus a 26px margin, spent on nothing new, in the loudest treatment in
   the band, on the route a parent at 3am wants least — which design-01 finding
   10 fought over one level up.
3. **The `#sym-call` anchor lands on a wrapper, not on an answer.** The hero
   button jumps to a `<div>` whose first child is a heading duplicating the text
   below it.

## The design in one sentence

One heading, one list: the phone grid moves inside the first route, where the
sentence that explains it already is, and the duplicate button row goes.

Everything the brief requires is kept: eight `tel:` links reachable at any hour,
the same-day route, the After Hours route, and the "if you are worried, call"
reassurance.

## The markup

`src/render/symptoms.ts`. `callList()` loses its wrapper and its heading and
returns only the grid and the note:

```ts
/**
 * Eight offices, eight main numbers, and the nurse line answers on each.
 * There is no practice-wide number to give; the page gives the choice.
 *
 * This sits inside the first route rather than above the list, because the
 * sentence that tells a parent to call is that route's own first line. It was
 * previously introduced by a second heading that said the same thing in
 * different words, 400px above the words themselves.
 */
function callList(): string {
	const items = offices
		.map((office) => {
			const name = locationNames[office.slug] ?? office.slug;
			return `<li><a class="sym-call-item" href="tel:${office.phone}"><span class="sym-call-office">${escapeAttribute(name)}</span><span class="sym-call-num">${formatPhone(office.phone)}</span></a></li>`;
		})
		.join("");

	return `<ul class="sym-call-list">${items}</ul>
						<p class="sym-call-note">Any office will help if yours is not on your mind. <a href="/locations/">Hours, addresses and directions</a>.</p>`;
}
```

The band becomes:

```html
<div class="whitebg padme90 sym-next">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="dent-band-title">Getting your child seen</h2>
				<ul class="sc-routes">
					<li class="sc-route-now" id="sym-call"><strong>Talk to a nurse now, at any hour.</strong> Call your office&#8217;s main number, nights, weekends and holidays included. You will reach a nurse or a physician, not an answering service.
						${callList()}
					</li>
					<li><strong>Be seen today.</strong> Every office keeps <a href="/medical-care/sick-visits/">same-day appointments</a> for illness and injury.</li>
					<li><strong>This evening or at the weekend.</strong> Most offices run <a href="/medical-care/after-hours-care/">After Hours Care</a>. It is by appointment rather than walk-in, and the hours differ by office.</li>
				</ul>
				<p class="sc-trust">If you are worried, call. We would rather answer a question that turns out to be nothing than have you sit up all night deciding whether it was.</p>
			</div>
		</div>
	</div>
</div>
```

Deleted: `<div class="sym-call" id="sym-call">`, its `</div>`, the
`<h3 class="sym-call-title">`, and the whole `<p class="sym-acts">` row.
`id="sym-call"` moves onto the `<li>`, so the hero's `href="#sym-call"` and the
alert band's link both still resolve. No JavaScript references either.

## The CSS

```css
/*
 * `.sc-routes li` was a descendant selector, so a nested list inherited the
 * bullet, the 20px indent and 18px/28px type. Narrowed to the child combinator
 * so the phone grid can live inside a route. Checked on the index: `.sc-reach`
 * has no nested list and its height is 1,024px before and after, unchanged.
 */
.sc-routes > li {
  position: relative;
  margin-bottom: 14px;
  padding: 0 0 0 20px;
  font-size: 18px;
  line-height: 28px;
  color: #4a4b4d;
}

.sc-routes > li:before {
  content: "";
  position: absolute;
  left: 0;
  top: 11px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2b93d1;
}

.sc-routes > .sc-route-now {
  padding-left: 22px;
  margin-bottom: 26px;   /* the grid needs more air after it than a sentence does */
  scroll-margin-top: 72px;  /* moved off the deleted `.sym-call`; the header is sticky below 1200 */
}

.sc-routes > .sc-route-now:before {
  width: 10px;
  height: 10px;
  top: 10px;
  background: #f58220;
}

/*
 * The grid itself is unchanged in shape — same 2-up / 4-up, same tile geometry
 * and palette. It is tightened, and its type is pinned because it now inherits
 * a route's 28px line-height instead of the band's.
 */
.sc-routes .sym-call-list { margin: 12px 0 0 0; gap: 8px; }
.sc-routes .sym-call-item { min-height: 56px; padding: 9px 12px; gap: 1px; }
.sc-routes .sym-call-office { font-size: 12px; line-height: 16px; letter-spacing: 0.4px; }
.sc-routes .sym-call-num { font-size: 17px; line-height: 22px; }
.sc-routes .sym-call-note { margin: 8px 0 0 0; font-size: 15px; line-height: 22px; }

/* With `.sym-acts` gone this is the band's only route to /locations/, so it has
   to be a real target. 237 x 17px becomes 237 x 44px; the negative margin keeps
   the line rhythm. */
.sc-routes .sym-call-note a { display: inline-block; padding: 11px 2px; margin: -5px 0; }

.sym-next .sc-trust { margin: 0; }
```

**Delete** as dead: `.sym-call { … }` and `.sym-call-title { … }` (site.css
5366–5379). `.sym-call-list`'s 4-column rule at 5476 stays and still applies.
`.sym-acts` is untouched — it is shared with `.sym-emergency` and `.sc-reach`;
only the markup is removed from `.sym-next`, so nothing ships hidden.

## The behavior

None. No JavaScript in this design and none changed. With scripting off the band
is identical: eight `tel:` links, three routes, a reassurance, all server
rendered. `href="#sym-call"` is a fragment link the browser resolves without
script.

## The states

| state | what happens |
|---|---|
| empty | not possible — the band is static and identical on all 164 pages |
| loading | nothing loads |
| error | nothing can fail |
| long content | the routes are fixed copy; only the office list is data-driven. A ninth office fills the grid's fifth row and leaves one orphan cell at 2-up and three at 4-up — acceptable, and the same as today |
| short content | seven offices leaves an orphan at 2-up; unchanged from today |
| longest plausible string | "Grow Up Great" is the longest office label. At **320** the cell is 133px wide and the label wraps, giving an **81px** cell — a larger tap target, not a fault. At 390 the cell is 168 x 59px, at 1280 268 x 59px |
| someone lands on `#sym-call` | the browser scrolls the first route to 72px below the sticky header, so the parent reads "Talk to a nurse now, at any hour" and then sees eight numbers, instead of landing on a heading |

## Theme

Light only. Nothing in the band changes colour; every value here is an existing
one. The `#F58220` dot and `#2B93D1` dots keep their design-01 roles. The blue
numbers stay `#1a6f9f` (5.50:1 on white). `.sym-call-office` drops 13px→12px and
stays `#636466` at 5.92:1 — under 14px it is still well over the 4.5:1
small-text minimum.

Under a glance, the band's survivors go from *two blue underlined inline links
plus two solid blue buttons* to *the blue H2, the orange dot and its bold orange
line, and eight blue phone numbers*. The band's loudest object is now the one it
is for. That is a continuation of design-01 finding 10, not a re-solve of it.

## What it costs

- **CSS**: 980 bytes raw, **415 gzipped**, minus ~250 raw deleted. Net ~+730 raw.
- **HTML**: about **−300 bytes per page**, on 164 pages. The fever page goes from
  23,617 to roughly 23,320.
- **Reflow**: none. All static.
- **Vertical**, measured:

| | `.sym-next` height | page height |
|---|---|---|
| 390x844 | 1,173 → **948** (−225, −19%) | 4,092 → 3,867 |
| 768x1024 | 769 → **648** (−121) | 3,387 → 3,266 |
| 1280x800 | 746 → **625** (−121) | 3,324 → 3,203 |
| 320x568 | 1,333 → **1,215** (−118) | 4,550 → 4,431 |

- **Complexity**: elements 54 → **49**, links 13 → **11**, and all 11 destinations
  are now distinct. Headings 2 → 1. Type treatments 5 → 3.
- **Index unaffected**: `.sc-reach` measures 1,024px at 390 before and after.
  Verified, because `.sc-routes` is shared.

## What I rejected

- **Keeping `.sym-acts` and cutting the phone grid to four offices.** The brief
  requires a way to call each office; a picker that omits half of them sends a
  Park City parent to the wrong number at 3am.
- **Collapsing the grid behind a "Show all offices" control.** Hiding eight phone
  numbers behind an interaction a frightened parent has to discover is the exact
  thing the brief forbids.
- **One column of eight single-line rows.** Arithmetic: 8 × 56 + 7 × 8 = 504px
  against 248px for the 2-up grid. Two columns is both shorter and, at 168px, wide
  enough for the longest label at 390.
- **A `<select>` of offices, or remembering the last one used.** design-01 3b
  already specified the remembering enhancement and it was not built; adding it
  here would be solving a problem the client did not raise.
- **Moving the grid above the H2**, so it is the first thing in the band. It would
  read as a directory dropped on the page, and the sentence explaining that a
  nurse answers these numbers at any hour would follow the numbers again.
- **Keeping `.sym-call-title` and deleting the first route's sentence instead.**
  The route sentence carries the fact that matters — "not an answering service" —
  and the label carries nothing the route does not.
- **Restyling `.sc-reach` on the index to match.** The client named the individual
  symptom page. On the index those two buttons are not duplicates in the same way,
  and changing a band the client did not mention is out of scope. Said plainly so
  the auditor knows the divergence is deliberate.
- **Replacing the italic `.sc-trust` with something louder.** It is the point of
  the whole section and it is quiet on purpose.

---

# 3. The iframe almost always requires scrolling

## The problem

> "The iframe almost always requires scrolling; and i think it might be beneficial
> for the size of the iframe to be automatically calculated each time the data is
> called to get the right size of iframe each time."

**The literal request is not possible and must not be built.** The AAP viewer is
`https://www.healthychildren.org/...`, a different origin. There is no
`postMessage` contract from healthychildren.org, same-origin access to
`contentDocument` is forbidden by the browser, and UI_RULES hard constraint 3
forbids anything that depends on the frame having loaded. `site.js` has no
`message` listener today and must not gain one. **Nothing in this design reads,
times, or listens to the frame.**

Measured today: the frame is a flat **460px at ≤575px and 560px everywhere else**
(site.css 5064 and 5211), identical for all 158 topics at every screen size. At
390x844 the usable fold — after the 58px sticky header and the 72px the CTA dock
covers — is **714px**. The frame is using **64%** of it. The reader scrolls
inside a 460px window while 254px of their screen shows nothing.

The answer splits in two.

---

## 3a. Fit the frame to the screen the reader actually has

This ships now, needs no network, no tooling, no measurement and no data. It is
the primary answer to the client's complaint.

### The design

The frame height becomes a `clamp()` of the viewport, floored at today's value so
it can never regress, capped at 720px so it can never become the oversized box
UI_RULES records as a fixed fault, and reduced by the exact obstruction each
breakpoint carries.

### The markup

Unchanged. There is no markup in this design.

### The CSS

Three declarations, mobile case included in the first rule's fallback.

```css
/*
 * The client: "the iframe almost always requires scrolling". It was a flat
 * 460/560px on 158 pages at every screen size. At 390x844 the usable fold is
 * 714px — 844 less the 58px sticky header and the 72px the fixed CTA dock
 * covers — so the frame was spending 64% of the screen and asking the reader to
 * scroll inside the other 36%.
 *
 * `svh` and not `dvh`: `dvh` changes every time a mobile URL bar collapses, so
 * the frame would resize under the reader's thumb mid-scroll. `svh` is the
 * viewport with the browser chrome shown and does not move during a scroll, so
 * this reflows exactly never after first paint.
 *
 * The static declaration first is the fallback: a browser that does not know
 * `svh` drops the second declaration at parse time and gets today's height. No
 * JavaScript, no @supports, no feature test.
 *
 * The floor is today's value at each breakpoint, so no viewport anywhere can
 * end up with less frame than it has now. The 720px ceiling is deliberate:
 * UI_RULES records "the frame previously sat in an oversized box that dominated
 * the page without being usable", and a cap is what stops that returning on a
 * tall desktop.
 */
.sym-embed-frame {
  height: 560px;
  height: clamp(560px, calc(100svh - 158px), 720px);
}

@media (max-width: 575px) {
  /* 58px sticky header + 72px dock + 16px so the frame's own bottom edge shows */
  .sym-embed-frame {
    height: 460px;
    height: clamp(460px, calc(100svh - 146px), 720px);
  }
}

@media (min-width: 1200px) {
  /* Measured: the header is not sticky here and the dock is not rendered. */
  .sym-embed-frame {
    height: 560px;
    height: clamp(560px, calc(100svh - 96px), 720px);
  }
}

/* `.sym-modal-body iframe` is already `height: 100%` inside a flex dialog and is
   not touched. The full-screen view keeps its own sizing. */
```

The existing rule at site.css 5064 and the `max-width: 575px` override at 5211 are
edited in place; source order is already correct.

### Measured result

Every viewport either gains or stays where it is. Nothing shrinks anywhere.

| viewport | frame now | frame new | usable fold | fits fold | page height |
|---|---|---|---|---|---|
| 320x568 | 460 | **460** | 380 | over, unchanged | 4,550 → 4,550 |
| 360x640 | 460 | **494** | 510 | yes | +34 |
| 375x667 | 460 | **521** | 537 | yes | +61 |
| **390x844** | 460 | **698** | 714 | yes | 4,092 → 4,330 |
| 414x896 | 460 | **720** | 766 | yes | +260 |
| 430x932 | 460 | **720** | 802 | yes | +260 |
| 600x800 | 560 | **642** | 670 | yes | +82 |
| 768x1024 | 560 | **720** | 889 | yes | 3,387 → 3,547 |
| 1024x768 | 560 | **610** | 633 | yes | +50 |
| 1280x800 | 560 | **704** | 800 | yes | 3,324 → 3,468 |
| 1440x900 | 560 | **720** | 900 | yes | +160 |
| 1920x1080 | 560 | **720** | 1,080 | yes | +160 |

At 390x844 that is **+238px, +52% more of the AAP's tool per screenful**, and the
frame now fits inside the usable fold rather than overflowing it. At 320x568 the
usable fold is only 380px because the header wraps to 116px there; the floor
holds the frame at today's 460 rather than shrinking it, which is the right error
to make.

The frame's **top position is unchanged at 730 / 748 / 744**, so design-01
finding 4 is not touched: the 114px of frame visible before any scroll at 390
(42px of it clear of the dock) is exactly what it was.

**Built together with item 2, the page height barely moves**, measured on
`/symptom-checker/fever/`:

| | page height | frame | `.sym-next` |
|---|---|---|---|
| 390x844 | 4,092 → **4,105** (+13) | 460 → 698 | 1,173 → 948 |
| 768x1024 | 3,387 → **3,426** (+39) | 560 → 720 | 769 → 648 |
| 1280x800 | 3,324 → **3,347** (+23) | 560 → 704 | 625 |

The frame's 238px is paid for almost exactly by the routing band's 225px.

### The behavior

None. No JavaScript. Content ships functional; there is no script to enhance it.
With scripting off the frame is the same height, because a CSS `clamp()` needs no
script. The "Full screen" button's behaviour and the modal are untouched.

### The states

| state | what happens |
|---|---|
| frame never loads | `.sym-embed-fallback` sits behind it, `inset: 0`, so it now fills a larger box and stays vertically centred. It reads better at 698px than at 460 |
| frame loads short content | the AAP's own white page fills the frame; `.sym-embed-stage` is also `#ffffff`, so unfilled space reads as white panel, not as a hole. This is the design's main risk and the 720px cap is what bounds it |
| frame loads tall content | the reader scrolls inside a 698px window instead of a 460px one. The client's complaint is reduced, not eliminated — honestly stated |
| browser without `svh` (pre-Chrome 108 / Safari 15.4 / Firefox 101) | gets 460/560 exactly as today. The declaration is dropped at parse time |
| landscape phone, 844x390 | `100svh` is 390; `clamp(560, 232, 720)` floors at 560, so the frame is taller than the fold and the reader scrolls the page. Same as today, and landscape is not the case this section is designed for |
| orientation change | the frame resizes once. This is the only reflow the design can cause and it is user-initiated |
| `prefers-reduced-motion` | nothing animates |

### What it costs

- **CSS**: 321 bytes raw, **160 gzipped**.
- **HTML**: zero.
- **Reflow risk**: zero after first paint. `svh` is fixed for the orientation and
  resolved during the first style pass, before layout. This is the whole reason
  `dvh` was rejected.
- **Page height**: +34 to +260px depending on viewport, on 158 pages. Net +13px
  at 390 once item 2 is built.

### What I rejected

- **`postMessage` height negotiation.** No contract exists on the AAP side. It
  cannot be built from here at all.
- **`100dvh`.** It resizes the frame every time a mobile URL bar collapses or
  expands, which is a reflow of the tallest element on the page, under the
  reader's thumb, during a scroll.
- **`aspect-ratio` on the frame.** The AAP content is a fixed-width column of
  prose; its height has nothing to do with its width in a ratio.
- **`height: 100vh` with no cap.** On a 1920x1080 desktop that is a 1,080px frame
  of a narrow column, which is the oversized box UI_RULES records as a fixed
  fault.
- **Removing the floor** so short screens get a shorter frame. It would make
  320x568 worse than today for the sake of tidiness in the formula.
- **`resize` listener in `site.js` writing a pixel height.** It reintroduces a
  layout-shifting script for something CSS does natively, and it would be a
  runtime calculation of exactly the kind the constraint forbids.
- **Shrinking the alert band, the hero or the heading to fit a taller frame in the
  same page height.** design-01 already took what was available there, and the
  alert band is explicitly not to be shrunk.

---

## 3b. A build-time per-topic height (designed, not verifiable here)

### Read this first

**This section could not be run or verified in this environment, and it is not a
runtime calculation.** Chromium here cannot reach the outside network at all:
`page.goto` returns `net::ERR_CONNECTION_RESET` for
`https://www.healthychildren.org/...` on every one of 24 attempts across 8 topics
and 3 widths. `curl` reaches the same URL fine (HTTP 200, 153,646 bytes), so the
proxy serves command-line tools but not the browser. **No height figure appears
anywhere in this section, because I could not measure one and I will not invent
one.** Whether topic heights actually differ from each other is, as of this
document, **unknown**.

`tools/measure-frames.mjs` therefore needs a machine with ordinary outbound
network access. Until somebody runs it there, **every topic uses 3a's viewport
sizing and the section is complete**. 3b is an enhancement over 3a, never a
replacement for it, and the CSS below is written so that a missing measurement
produces byte-identical rendering to 3a.

Anyone reading this later: this is a **build-time snapshot refreshed by re-running
a tool**. The browser never measures the frame. If you find this behaving like a
runtime calculation, something other than this design was built.

### What the tool does

A dev-only script, in `tools/` next to `check-symptom-links.mjs`, which is the
existing precedent for a script that talks to the AAP and validates what comes
back. It is never imported by `src/`, so **the shipped site gains no dependency**;
it uses the Playwright already installed for measurement and exits with a clear
message if that import fails, rather than becoming a build requirement.

```
node tools/measure-frames.mjs          # measure all, write the file
node tools/measure-frames.mjs --check  # re-measure a 10-topic sample, report drift
```

1. Imports `symptoms` from `../src/data/symptoms.ts` and **`aapFrameUrl` from
   `../src/render/symptoms.ts`**, so the URL is never re-derived. (`check-symptom-links.mjs`
   rebuilds it by hand; that is a bug waiting to happen and this one should not
   copy it.)
2. Skips the six `noTool` topics. 158 remain.
3. For each topic, loads the frame URL in Chromium at **three widths** and reads
   `document.documentElement.scrollHeight` after `waitUntil: "load"` plus a
   1,200ms settle:

   | band | site CSS band | frame content widths in that band | measure at |
   |---|---|---|---|
   | s | `max-width: 575px` | ~294 – 549px | **294** |
   | m | 576 – 1199px | ~504 – 860px | **504** |
   | l | `min-width: 1200px` | 858px fixed | **858** |

   **Measure at the narrowest width in each band, not the middle.** Narrower means
   more wrapping means taller, so the number over-shoots for wider viewports in
   the band rather than under-shooting. That is the right direction of error: an
   over-tall frame wastes some white space and is capped by 3a's viewport clamp
   anyway, while an under-tall frame reintroduces exactly the inner scrolling the
   client complained about. This is the answer to "what happens at widths between
   the measured ones".
4. Writes `scrollHeight + 24` — a little slack so the AAP's own bottom padding is
   not clipped and a small content change does not immediately put the scrollbar
   back.

### How a topic that fails or times out is handled

A number is accepted only if **all** of these hold, otherwise the topic is skipped
entirely and prints `SKIP <slug> <width> <reason>`:

- HTTP status is 200.
- The response is at least **20,000 bytes** — the same stub test
  `check-symptom-links.mjs` uses, because the viewer answers 200 with a short
  disclaimer page for topics it has no tool for.
- The height is within **[300, 1600]**. Anything outside is implausible and is
  discarded rather than shipped.
- Two reads at the same width agree within **8px**. If not, one retry; if that
  disagrees too, discard.

Navigation timeout 30s. Concurrency 3, one browser, a fresh context per load so
nothing carries over. A skipped topic **gets no field at all** — it is never
written with a guess, a default, or a neighbour's number.

Whole-run guard: if **more than 25% of topics fail**, the tool exits non-zero and
**writes nothing**, so a network outage or an AAP redesign cannot silently empty
the file. The file is written once at the end via a temp file and a rename, so a
crash mid-run cannot leave a half-written module.

### The data field

**Not by rewriting `src/data/symptoms.ts`.** That file is 2,556 lines of
hand-authored prose for 164 topics, guarded by `tools/check-copy.mjs`, and a
machine rewriting it to inject numbers risks the copy for no benefit. A generated
sibling module instead:

```ts
// src/data/frameHeights.ts
/**
 * GENERATED by tools/measure-frames.mjs. Do not edit by hand.
 *
 * A build-time snapshot of how tall the AAP viewer renders for each topic, at
 * the narrowest frame width in each of the site's three CSS bands. This is NOT
 * a runtime measurement — the frame is cross-origin and cannot be measured by
 * the browser. Re-run the tool to refresh it.
 */
export const FRAME_MEASURED = "2026-09-09";

/** slug -> [narrow, medium, wide], in px, +24px slack. Absent = unmeasured. */
export const frameHeights: Record<string, [number, number, number]> = {
  // ...
};
```

`Symptom` gains nothing. `renderSymptomPage()` reads the map and, only when the
slug is present, emits three custom properties on the frame:

```html
<iframe class="sym-embed-frame" style="--sym-fh-s:NNNpx;--sym-fh-m:NNNpx;--sym-fh-l:NNNpx" title="..." src="..." loading="lazy"></iframe>
```

Custom properties and not a `height` attribute or an inline `height`, because
they have to interact with 3a's clamp rather than override it.

### How the height reaches the CSS

3a's three rules gain one `min()` each. Nothing else changes.

```css
.sym-embed-frame {
  height: 560px;
  height: clamp(560px, min(var(--sym-fh-m, 9999px), calc(100svh - 158px)), 720px);
}

@media (max-width: 575px) {
  .sym-embed-frame {
    height: 460px;
    height: clamp(460px, min(var(--sym-fh-s, 9999px), calc(100svh - 146px)), 720px);
  }
}

@media (min-width: 1200px) {
  .sym-embed-frame {
    height: 560px;
    height: clamp(560px, min(var(--sym-fh-l, 9999px), calc(100svh - 96px)), 720px);
  }
}
```

Read the relation carefully, because it is the whole point:

- **Unmeasured topic** → `var()` falls back to `9999px` → `min()` returns the
  viewport term → **byte-identical rendering to 3a**. The fallback is not a
  degraded path; it is 3a exactly.
- **Measured shorter than the fold** → the frame is the height of the content, so
  no inner scrollbar and no trailing white space.
- **Measured taller than the fold** → the viewport term wins, so the frame never
  exceeds the usable fold. A measurement can shorten the frame; it can never
  make it overflow.
- **Measured absurdly small** → `clamp()`'s floor holds it at 460/560, so a bad
  number cannot produce an unusable frame.

So the worst a wrong number can do is bounded on both sides by 3a.

### What happens when the AAP changes underneath a stale number

| the AAP | the number becomes | the reader gets | severity |
|---|---|---|---|
| adds content | too small | an inner scrollbar again | degrades **to today's behaviour**, nothing breaks |
| removes content | too large | some white below the content, inside a white panel | cosmetic |
| retitles the topic | irrelevant — `check-symptom-links.mjs` already catches a dead topic name | | |
| redesigns the viewer | both of the above | | |

Neither failure is worse than shipping no measurement at all, which is the
property that makes 3b safe to leave stale.

**Refresh cadence.** Re-run alongside `check-symptom-links.mjs` — before a launch
and quarterly. `FRAME_MEASURED` is in the generated file so the age is checkable;
`--check` re-measures a 10-topic sample and reports any topic whose height has
moved more than 15%, which is the cheap signal that a full re-run is due.

### If the heights turn out not to differ per topic

The tool prints the spread at each width. **Decision rule, so nobody has to
judge:** if the interquartile range across the 158 topics at a given width is
under **60px**, the per-topic field is not worth 158 style attributes and a
generated module — drop 3b for that width entirely and instead set 3a's `720px`
ceiling to the 90th-percentile measured height. That would be a one-token change
to three declarations and no new file, no new data and no new tool output. The
tool would still be worth having as a `--check` for drift.

### The states

| state | what happens |
|---|---|
| `frameHeights` is `{}` (ship day, and today) | every page renders exactly as 3a |
| 40 of 158 measured | those 40 fit their content; the other 118 render as 3a. Mixed is a valid state, not a broken one |
| the run fails on >25% | nothing is written; the previous file stands |
| a topic measured once and skipped on a later run | the tool preserves an existing entry it could not re-measure and prints `KEPT <slug> (stale since <date>)`, rather than deleting a good number because a single load timed out |
| a browser without `svh` | drops the whole clamp declaration and gets 460/560, ignoring the custom properties. Measured heights are enhancement-only, twice over |
| a browser without `var()` (pre-2016) | same |

### What it costs

- **Shipped CSS**: about **90 bytes** more than 3a.
- **Shipped HTML**: one `style` attribute of about **62 bytes** on 158 pages.
- **Repo**: one generated file, roughly 6 KB, and one tool file. Neither is served.
- **Reflow**: zero. The number is in the document at first paint.
- **Runtime**: zero. Nothing is fetched, measured, listened to or computed.

### What I rejected

- **A `message` listener in `site.js`** waiting for a height the AAP does not
  send. Dead code that would look like a feature.
- **Rewriting `src/data/symptoms.ts` in place.** A machine editing 164 blocks of
  hand-written clinical prose to insert three integers each.
- **A generated stylesheet with 158 `[data-sym-slug]` rules.** ~15 KB on the
  shared stylesheet, downloaded by every page in order to use one rule.
- **An inline `height` attribute or inline `style="height:..."`.** It would win
  over 3a's clamp and let a stale measurement overflow the fold. The `min()`
  relation is the entire reason for using custom properties.
- **Measuring at the widest width in each band.** It under-shoots for narrow
  viewports in the band, which puts the scrollbar back for the phone reader —
  the one this section is designed for.
- **Measuring at every one of a dozen widths and shipping a table.** Twelve
  numbers per topic to remove some white space; three bands are what the CSS has.
- **Running the tool during the build.** It would make 158 network requests a
  precondition for `node src/index.ts` and make an AAP outage a build failure.
- **Skipping 3a and doing only 3b.** Then the client's complaint stays unanswered
  on every topic until a tool that cannot be run here has been run somewhere else.

---

## Files a full build touches

None of them the vendored theme.

- `public/assets/site.css` — items 1, 2, 3a (and 3b's three `min()` if ever built)
- `src/render/symptoms.ts` — items 1 and 2
- `src/data/frameHeights.ts` — 3b only, generated
- `tools/measure-frames.mjs` — 3b only, dev-only, never imported by `src/`

`public/assets/site.js` is **not touched by any of the three**.
`src/build.ts` is **not touched**; item 1's `<noscript>` placement is what avoids
it. `src/content/symptom-checker.html` is **not touched**; item 1 works entirely
inside `{{SYMPTOM_LIST}}`.

## Combined effect, measured on /symptom-checker/fever/ and /symptom-checker/

| | 390x844 | 768x1024 | 1280x800 |
|---|---|---|---|
| symptom page height | 4,092 → **4,105** | 3,387 → **3,426** | 3,324 → **3,347** |
| AAP frame height | 460 → **698** | 560 → **720** | 560 → **704** |
| frame top (unchanged) | 730 | 748 | 744 |
| `.sym-next` height | 1,173 → **948** | 769 → **648** | 746 → **625** |
| index page height | 5,369 → **5,408** | 4,649 → **4,706** | 4,689 → **4,746** |
| `.sc-index` band | 1,953 → **1,992** | 1,839 → **1,896** | 1,781 → **1,838** |
| total CSS added | +2,721 bytes raw, **+1,056 gzipped** on 38,093 (+2.8%) | | |
| total HTML | index +32 bytes; each symptom page **−300** | | |
| JavaScript changed | **none** | | |
