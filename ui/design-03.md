# Symptom section — design 03

Three more items of direct client feedback. Designed against the code as it
stands after design-02 was built. Nothing here undoes a design-01 or design-02
decision silently; where one is adjusted or reversed, it is named, the earlier
reasoning is quoted, and the measurement that changed my mind is given.

Only the auditor writes to the site. No site file was edited to produce this.

## Baseline re-measured before designing

Chromium via Playwright against `localhost:5000`, every non-localhost request
aborted. Viewports 320x568, 375x667, 390x844, 768x1024, 992x800, 1280x800,
1440x900.

| | 390x844 | 320x568 | 768x1024 | 1280x800 |
|---|---|---|---|---|
| index page height | 5,408 | 6,096 | 4,706 | 4,746 |
| `.sym-find-input` top | **598** | 714 | 666 | **769** |
| `.sym-alert` top | 231 | 289 | 359 | 456 |
| first common tile top | 786 | 902 | 846 | 949 |
| fever page height | 4,105 | 4,431 | 3,426 | 3,347 |
| `.sym-embed-frame` top / height | 730 / **698** | 867 / 460 | 748 / 720 | 744 / 704 |
| `.sym-embed-cap` height | 21 | 21 | 25 | 25 |
| `.sym-next` height | **948** | 1,215 | 648 | 625 |

Obstructions, re-measured not assumed. The theme `<header>` is `position: sticky`
at **58px** (390), **63px** (768), **116px** (320 and 992, where it wraps), and
**not sticky at 1280**. `.ctadock` is fixed, 56px, 16px off the bottom, covering
the bottom **72px** below 1200. Usable fold: **714px** at 390x844, **380px** at
320x568, **537px** at 375x667, **889px** at 768x1024, **665px** at 992x800,
**800px** at 1280x800.

Two facts about the index hero that the brief's framing did not have, and which
decide item 1:

- **Below 992 there is no photographic hero and no visible `<h1>`.** The theme's
  `@media (max-width: 991px)` sets `.herowrap { display: none }` and
  `.mobileheromessage { display: block }`. What a phone shows is a
  `.mobileheromessage.bluebg` band — computed background **`rgb(43,147,209)`,
  exactly `#2B93D1`** — 77px tall, holding a `<p class="interiorpagetitle">`, and
  below it a separate 96px `#mobileheroimage` photograph. The `<h1>` exists in
  the DOM inside the hidden `.herowrap` and measures 0x0.
- **From 992 up** the hero is `.sc-herowrap`, 340px since design-01, with the H1
  on the wash.

So "in the main h1 header" means two different objects at the two ends, and on
the phone — the case that governs — it means the blue title band, not a
photograph. Nothing in this design puts an input on a photograph.

## Reuse, stated before anything new was invented

| existing | reused for | why |
|---|---|---|
| `.sc-find-plinth` (design-02) | item 1 keeps the class, the element and its contents; only its home and its fill change | it is literally the same object — the panel that holds the search and its two answers. Moving it is not a new card style |
| `.sym-find`, `.sym-find-box`, `-icon`, `-input`, `-clear`, `-hint`, `-count`, `-off` | unchanged, re-parented | item 1 changes no search markup at all |
| `.sym-none` / `.sym-emergency` panels | unchanged, travel with the plinth | one panel shape for "the box has something to tell you" |
| `.sym-call-list` / `-item` / `-office` / `-num` / `-note` | item 2 keeps every class and every tap target; only the borders move | the grid's geometry is design-01's and stays |
| `.sc-routes > li` bullet list | unchanged; item 2 moves one child inside one `<li>` | one list idiom |
| `.sym-embed-cap` | item 3 makes it the control bar it was before design-01, at 44px instead of 21px | no new element; the button that moves into it is the existing `.sym-embed-grow` |
| `.sym-embed-frame` single `clamp()` | item 3 changes three numbers | no new mechanism, no JS |
| `.sym-modal-bar` / `-foot` / `-done` | item 3 changes padding and one min-height | the dialog's construction is right; its chrome is too fat |
| `hidden` in markup, JS reveals | untouched | UI_RULES 4 |
| `#usergeneratedsection .sc-herowrap` id-for-specificity idiom | not needed here; every selector below is on our own class | |

**New classes introduced by all three items: one — `.sc-findband`.** Items 2 and
3 introduce none.

No dependency, no bundler, no theme file, nothing that requires the iframe to
have loaded, nothing hidden behind an interaction.

## Build order

```
1   symptoms.ts + one token in index.ts + one line in symptom-checker.html + CSS   index only
2   symptoms.ts (one markup move) + CSS                                            164 pages, below the frame
3   symptoms.ts (one markup move) + CSS                                            158 pages, the frame
```

Each is buildable alone, in any order, and none depends on another. Items 2 and 3
touch the same file but not the same band.

---

# 1. The search box moves into the hero

## The problem

> "on the main symptom checker page, lets stick the search bar in the main h1
> header."

Measured, the box is a long way from it. At 390x844 `.sym-find-input` sits at
**y=598**, which is 540px below the bottom of the title band and 88% of the way
down the usable fold. At 1280x800 it is at **y=769**, 31px above the fold with
its hint below it. Before a reader reaches it they pass a 77px title band, a 96px
photograph, a 170px alert band, 55px of white, a 32px H2 and a 70px lead.

The index is the page whose one job is "name what you are seeing". The control
that does that job is the last thing on the first screen.

Two consequences also measured, because they decide where the box can go:

- **Typing today scrolls the page.** With the input at 598 on a 390x844 phone,
  focusing it opens the keyboard over roughly the bottom half of the screen and
  the browser scrolls the input up to meet it, taking the title, the photograph
  and the 911 band off screen. With the input at 145 no scroll is needed at all.
- **The answers are below the fold.** `.sym-emergency` and `.sym-none` sit inside
  the plinth, so today they open at y≈700 and are cut by the CTA dock at 772.
  Measured with `seizure` typed: the emergency panel opens at 730 and 42px of it
  is visible.

## The design in one sentence

The plinth — the same element, the same contents — moves out of `.sc-index` and
into a full-bleed `#2B93D1` band that sits flush under the title band on a phone
and straddles the bottom edge of the photographic hero on a desktop, so the
search is part of the header at both ends and never sits on a photograph.

## What happens to the plinth, and to design-02's three surfaces

design-02 gave `.sc-index` three surfaces because the client said search, common
and categories "lack color to divide them up": **grey plinth → white common →
grey browse panel**. If the search leaves, the first of those three is not
deleted; it moves, and it changes colour with its background.

The division after this change is **blue band → white common → grey browse
panel**. Three surfaces, still, and the outermost one is now the strongest
colour on the page. design-02's `.sym-sec:after` accents — orange under COMMON
RIGHT NOW, blue under BROWSE BY CATEGORY — are untouched, and the browse panel is
untouched. The recorded fault "no dividers between sections" does not reopen at
either level.

The plinth's grey fill becomes white, and its `3px #2b93d1` top edge is dropped:
on a blue band a blue edge says nothing, and a white card on `#2B93D1` is a
**3.39:1** boundary on its own, above the 3:1 that WCAG 1.4.11 asks of a
non-text boundary. That edge was design-02's; it is removed because its
background moved, not because it was wrong.

## The markup

### `src/render/symptoms.ts` — one new exported function

The whole plinth block is lifted out of `symptomIndexList()` unchanged and
returned by a new function, wrapped in the band and a `.container`:

```ts
/**
 * The box, and the two panels that answer it.
 *
 * This is emitted separately from the tile list because it does not live with
 * the tiles any more: the client asked for the search to sit in the page's
 * header, and below 992 the header is the theme's blue `.mobileheromessage`
 * band rather than a photograph. The band is ours; the title band above it is
 * the theme's and is not touched, styled or depended on beyond the fact that
 * it is `#2B93D1`, which is hard constraint 5.
 *
 * `.sym-emergency` and `.sym-none` travel with the box because they are its
 * output. `site.js` reaches all of these with document-scoped `querySelector`,
 * so no JavaScript changes.
 */
export function symptomFindBox(): string {
  return `<div class="sc-findband">
	<div class="container">
		<div class="sc-find-plinth">
			<div class="sym-find">
				<label class="visually-hidden" for="sym-find-input">Type what you are seeing</label>
				<div class="sym-find-box">
					<svg class="sym-find-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6"></circle><path d="M13.5 13.5L18 18"></path></svg>
					<input id="sym-find-input" class="sym-find-input" type="search" autocomplete="off" placeholder="Type what you are seeing&#8230;">
					<button type="button" class="sym-find-clear" hidden>Clear<span class="visually-hidden"> the search</span></button>
				</div>
				<p class="sym-find-hint">Everyday words work: &#8220;throwing up&#8221;, &#8220;poop&#8221;, &#8220;bug bite&#8221;, &#8220;hit head&#8221;.</p>
				<p class="sym-find-count" role="status" aria-live="polite"></p>
			</div>
			<noscript><p class="sym-find-off">Type-to-search needs JavaScript. Every one of the ${symptoms.length} pages is listed below, grouped by what you can see or hear.</p></noscript>
			<div class="sym-emergency" hidden>
				<p class="sym-emergency-lead">This one is an emergency.</p>
				<p class="sym-emergency-body"></p>
				<p class="sym-acts"><a class="btn sym-emergency-call" href="tel:911">Call 911</a> <a class="btn blue" href="/locations/">Find your office</a></p>
			</div>
			<div class="sym-none" hidden>
				<p class="sym-none-lead">Nothing here matches <span class="sym-none-q">that word</span>.</p>
				<p>Try a plainer word: &#8220;rash&#8221; rather than the name of a rash, &#8220;tummy&#8221; rather than where it hurts. If you would rather just ask someone, call your office and a nurse will answer, whatever the hour.</p>
				<p class="sym-acts"><a class="btn blue" href="/locations/">Find your office</a></p>
			</div>
		</div>
	</div>
</div>`;
}
```

`symptomIndexList()` loses exactly that block. Its return value now begins at
`<div class="sym-group sym-common">`. Nothing else in it changes.

### `src/content/symptom-checker.html` — one line

A second token, inserted between the closing `</section>` of
`.mobileheromessage` (line 25) and the `#mobileheroimage` `<img>` (line 26):

```html
					</section>
					{{SYMPTOM_FIND}}
					<img id="mobileheroimage" class="sc-heroimg" src="…" alt="Mobile Hero Promotion" width="1000" height="400" />
```

That position is what makes one element serve both breakpoints. Below 992 the
band lands between the blue title band and the photograph, so title and search
are one uninterrupted blue block. From 992 up `.mobileheromessage` and
`#mobileheroimage` are both `display: none`, so the band lands directly under
`.sc-herowrap` and the plinth's negative top margin lifts it onto the hero's
bottom edge.

`src/content/` is emptied by `tools/sync-from-live.py`; this file already carries
hand edits from design-01, so the risk is pre-existing and is flagged, not new.

### `src/index.ts` — one line

```ts
    : pageContent(page.slug)
        .replace("{{SYMPTOM_FIND}}", () => symptomFindBox())
        .replace("{{SYMPTOM_LIST}}", () => symptomIndexList());
```

The function form of the replacement is deliberate: `String.prototype.replace`
treats `$&`, `$'` and `` $` `` specially in a string replacement. Neither
fragment contains a `$` today, and the existing `{{SYMPTOM_LIST}}` call has the
same latent hazard; closing it costs six characters.

## The CSS

Mobile first. One breakpoint, at 992, which is the theme's own hero swap.

```css
/* --------------------------------- symptom index: the search in the header -- */

/*
 * The client: "lets stick the search bar in the main h1 header". Measured, the
 * box was at y=598 on a 390x844 phone and y=769 at 1280x800 — the last thing on
 * the first screen on the page whose whole job it is.
 *
 * Below 992 the theme hides `.herowrap` and shows `.mobileheromessage`, whose
 * computed background is `rgb(43,147,209)`, exactly `#2B93D1`. The band below
 * carries the same fill and no top padding, so on a phone the title and the
 * search read as one block with no seam. From 992 up both of those are
 * `display: none` and the band lands under the photographic hero, where the
 * plinth is pulled up onto the hero's bottom edge.
 *
 * The input is never on the photograph. A white card on `#2B93D1` is a 3.39:1
 * boundary, and every word inside it keeps a white background: the hint at
 * `#636466` is 5.92:1 there and would be 1.9:1 on the blue.
 */
.sc-findband {
  background: #2b93d1;
  padding: 0 0 14px 0;
}

/*
 * design-02's plinth, moved. Its `#f4f5f6` fill and its `3px #2b93d1` top edge
 * both existed to separate it from the white band it sat in; on blue, white is
 * the separation and a blue edge says nothing.
 */
.sc-findband .sc-find-plinth {
  max-width: 660px;
  margin: 0;
  padding: 10px;
  background: #ffffff;
  border: 0;
  border-radius: 14px;
}

@media (min-width: 992px) {
  .sc-findband {
    padding: 0 0 22px 0;
  }

  /*
   * The card straddles the hero's bottom edge rather than sitting under it, so
   * the search is in the hero and not merely near it. Measured at 1280: the H1
   * ends at y=346 and the card starts at y=410, so they never touch.
   */
  .sc-findband .sc-find-plinth {
    margin-top: -46px;
    padding: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  }
}
```

### The re-scoping, which is the part an auditor must not skip

Ten rules in `site.css` scope these elements to `.sc-index`, and the elements are
leaving `.sc-index`. Each `.sc-index ` prefix becomes `.sc-pagebody `, which is
our own class on the section wrapper at `symptom-checker.html:1` and an ancestor
of **both** the new band and `.sc-index`. Specificity is unchanged at (0,2,0),
cascade position is unchanged, and the rules apply identically in either home.

| line | today | becomes |
|---|---|---|
| 4528 | `.sc-index .sym-find-hint` | `.sc-pagebody .sym-find-hint` |
| 4535 | `.sc-index .sym-find-count` | `.sc-pagebody .sym-find-count` |
| 4545 | `.sc-index .sym-find-count.is-none` | `.sc-pagebody .sym-find-count.is-none` |
| 4549 | `.sc-index .sym-find-count:empty` | `.sc-pagebody .sym-find-count:empty` |
| 4558 | `.sc-index .sym-find-off` | `.sc-pagebody .sym-find-off` |
| 4734 | `.sc-index .sym-emergency-body` | `.sc-pagebody .sym-emergency-body` |
| 4741 | `.sc-index .sym-emergency-body a` | `.sc-pagebody .sym-emergency-body a` |
| 5274 | `.sc-index .sym-find-count` | `.sc-pagebody .sym-find-count` |
| 5279 | `.sc-index .sym-find-hint` | `.sc-pagebody .sym-find-hint` |
| 5347 | `.sc-index .sym-find-off` | `.sc-pagebody .sym-find-off` |
| 5694 | `.sc-index .sc-find-plinth .sym-find-off` | `.sc-find-plinth .sym-find-off` |

This is not tidying. The comment at 4526 records why the prefix is there: "the
theme sets a 23px paragraph size inside `.usergenerated`, which a bare class
cannot outrank". Outside `.sc-index` the governing theme rule is
`.pagebody p, .pagebody ul li, .pagebody ol li` at `style.css:603`, specificity
(0,1,1), which still applies because the band is inside
`#usergeneratedsection.pagebody`. **Measured what happens if this step is
skipped:** the hint renders at the theme's 18px/23.4px, 60px tall at 1280
instead of 21px, and the whole band grows 39px. The prototype numbers below are
with the re-scoping in place.

The `@media (min-width: 768px) { .sc-find-plinth { padding: 16px } }` rule at
5759 is superseded by the 992 rule above and should be deleted; the design-02
block at 5652–5697 is edited in place, not duplicated.

## The behavior

**None. There is no JavaScript in this design and none is changed.**

Verified by reading `site.js:1268-1281`: `find`, `clear`, `count`, `common`,
`none`, `noneQ`, `emergency`, `emergencyBody` are all `document.querySelector`,
and `browse` is found independently. Nothing walks up from the input to a
container. Verified by running the prototype: typing `seizure` revealed
`.sym-emergency` inside the band and set the live region to "No pages match that
word"; typing `zzzq` revealed `.sym-none` alone.

**Before the JavaScript runs**, the band is a blue strip holding a white card
with an inert input, a hint and an empty status paragraph — its final geometry,
because nothing about it is script-computed. Nothing shifts when the script
arrives.

**If the script never runs**, `build.ts` line 67 already ships
`<noscript><style>…​.sym-find{display:none}</style></noscript>`, so the card
holds the `.sym-find-off` sentence instead. Verified with
`javaScriptEnabled: false` and the response rewritten to the designed shape: the
band renders **106px** tall, the card **92px**, holding "Type-to-search needs
JavaScript. Every one of the 164 pages is listed below, grouped by what you can
see or hear."; `.sym-find` computes to `display: none`; the alert band sits at
y=337; the page is 13,798px with all thirteen groups expanded; and
`document.elementFromPoint(195, 400)` returns the alert band's `<strong>`, so
design-01's `.page-load` fix is intact. There is no empty box and no control
that does nothing.

## The measurement

Prototyped by moving the live DOM and applying the CSS above.

| | input top | first tile top | alert top | alert visible in fold | page |
|---|---|---|---|---|---|
| **390x844** | 598 → **145** | 786 → **774** | 231 → 365 | 170 of 170 → **170 of 170** | 5,408 → 5,396 |
| 375x667 | 598 → **145** | 786 → 774 | 231 → 365 | 170 → 170 | 5,438 → 5,426 |
| 320x568 | 714 → **203** | 902 → 890 | 289 → 423 | 196 → **73 (37%)** | 6,096 → 6,084 |
| 768x1024 | 666 → **209** | 846 → 826 | 359 → 481 | 118 → 118 | 4,706 → 4,686 |
| 992x800 | 775 → **431** | 955 → 905 | 463 → 555 | 92 → 92 | 4,871 → 4,821 |
| 1280x800 | 769 → **424** | 949 → 899 | 456 → 548 | 92 → 92 | 4,746 → 4,696 |
| 1440x900 | 769 → **424** | 949 → 899 | 456 → 548 | 92 → 92 | 4,716 → 4,666 |

The box moves up **453px** at 390 and **345px** at 1280. review-01 finding 5's
desktop half — "at 1280 it does not show the search" — is answered outright: the
input is at 424 against an 800px fold.

**Finding 5's mobile half is not undone.** The first common tile moves from 786
to **774**, twelve pixels earlier, because the plinth's 128px plus its 18px
margin leave `.sc-index` while the band adds only 134px above. The page is 12px
shorter. This is the number the brief asked for and it is the right way round.

## The states

| state | what happens |
|---|---|
| empty | card holds input + hint, 120px at 390. `.sym-find-count:empty` stays hidden |
| loading | nothing loads. Everything is server-rendered and statically sized; no shift |
| error | there is no request to fail |
| no match | `.sym-none` opens **inside the card at y=284** at 390, fully on the first screen, and the live region says "No pages match that word". Today it opens at 730 and is cut by the dock |
| emergency word | `.sym-emergency` opens at y=284, cream with its `2px #f58220` border on blue. Typing `seizure` shows both panels; the band measures 837px and the emergency panel is entirely above the dock |
| long content | the band grows downward only. Both panels open = 837px of band at 390. Nothing above the caret moves |
| short content | minimum is input + hint = 120px at 390, 108px at 768 |
| longest plausible string | a pasted query is truncated to 40 characters by `.sym-none-q` with `overflow-wrap: anywhere` (design-01). At 320 the card is 276px wide and the input 254px; `.sym-find-input` keeps its 16px font at ≤575 so iOS does not zoom |
| keyboard open | the input is 87px below the sticky header, so the browser does not scroll to reveal it, and the answer panels open in the strip the keyboard does not cover |
| JavaScript off | see above: the card holds one sentence and the box is gone |

## Theme

The site has **no dark mode**: `prefers-color-scheme` appears zero times in both
`site.css` and the vendored `style.css`. Light only.

| | on | ratio | verdict |
|---|---|---|---|
| `.sym-find-hint` `#636466` | white card | **5.92:1** | AA |
| `.sym-find-count` `#1a6f9f` | white card | **5.50:1** | AA |
| `.sym-find-count.is-none` `#8a4b12` | white card | 6.4:1 | AA |
| `.sym-find-input` text `#4a4b4d` | white | 8.73:1 | AA |
| card edge `#ffffff` | `#2b93d1` | **3.39:1** | 1.4.11 |
| `.sym-emergency` cream `#fff4e8` | `#2b93d1` | 3.1:1 | 1.4.11, and it also carries a `2px #f58220` border |

Brand: the band is `#2B93D1` exactly, as a fill, which is what hard constraint 5
asks. `#F58220` keeps its emergency-panel border. Green is not used; on this site
green means "book an appointment" and belongs to the CTA dock.

**One thing I am not fixing, stated plainly.** The theme's `.interiorpagetitle`
in the band above computes to `#636466` on `#2B93D1` — **1.76:1**. It is
illegible today and my card makes it look worse by being crisp next to it. It is
a theme class on 272 pages, and UI_RULES forbids restyling the vendored theme's
own classes. I am not touching it and I am not routing around it. If the client
wants it fixed it is a separate, site-wide request.

Forced-colors mode replaces the band's fill and the card's fill with system
colours; the card survives as a bordered box because its border-radius and
box-shadow are decoration and its contents are text and a form control.

## What it costs

- **CSS**: +1,367 bytes raw, **+482 gzipped**, less roughly 700 raw deleted from
  the design-02 plinth block. Net ≈ +670 raw on 141,601 (+0.5%), on a 40,947-byte
  gzipped stylesheet.
- **HTML**: the band wrapper and its container are +96 bytes; the plinth's markup
  is unchanged and merely moves. One page.
- **JavaScript**: none, in either file.
- **Reflow**: none. Every dimension is static and resolved in the first style
  pass. The panels grow on user input only, below the caret. `#mobileheroimage`
  keeps design-01's fixed height, so its decode still shifts nothing.
- **Page height**: −12px at 390, −20 at 768, −50 at 992 and above.

## What I rejected

- **Putting the input on the hero photograph.** Below 992 there is no
  photographic hero to put it on — the theme hides it — so this could only ever
  be a desktop-only treatment needing a second design for phones. And a 14px
  hint over an uncontrolled image is the legibility problem the brief warned
  about. The white card on the hero's edge gets the same "in the hero" reading
  with a guaranteed background.
- **Duplicating the search markup into `.mobileheromessage` and
  `.heromessage`.** Two inputs sharing `id="sym-find-input"`, two live regions,
  and `site.js` would silently drive only the first.
- **Adding our own class to `.mobileheromessage` and styling it.** It would work
  and it is arguably within the letter of the rules, but item 1 does not need to
  change the theme's band at all, and not needing to is worth more than the 15px
  of margin it would save.
- **Moving `.sc-lead` into the band as the hero's subtitle.** It reads as the
  search's explanation and it is tempting. Measured, it costs 70px at 390 above
  the alert band, and the alert is the thing UI_RULES says must not be missed.
  The lead stays where it is. If the client wants the copy retuned so that
  "Start with what you can see" and its lead introduce the tiles rather than the
  box, that is an editorial change, it is not required for this design to be
  correct, and it is out of scope here.
- **Shortening the hint copy** to buy height at 320. Measured: with the
  re-scoping in place the hint is 42px at 390 and 42px at 320, two lines at both.
  Shortening saves nothing where it is needed.
- **Deleting the `#mobileheroimage` photograph** below 992. design-01 rejected
  this and its reason still holds — standing question 9 exists to stop this
  section becoming the odd page out.
- **Keeping the plinth grey inside the blue band.** `#f4f5f6` on `#2B93D1` is
  2.6:1 and the hint on it would be 5.04:1, so it would work; it would also look
  like a grey box someone forgot to finish.
- **A sticky search bar** that follows the reader down the index. A second fixed
  control, on a page that already has one, is review-01 finding 13 waiting to
  happen again.

## The one regression, and the option that would pay for it

At **320x568** the alert band goes from fully visible to **73 of 196px (37%)**
inside a 380px usable fold. At that width the wrapped header alone is 116px, 20%
of the screen, and something has to lose. What is gained is that the box the page
exists for is at y=203 instead of y=714.

If the auditor judges that trade wrong at 320, the cheapest correction is one
declaration, and I am naming it as an **option I am not proposing**, because it
adjusts a design-01 decision the client did not raise:

```css
@media (max-width: 575px) {
  #mobileheroimage.sc-heroimg { height: 72px; }   /* design-01 set 96px */
}
```

Measured: at 320 the alert recovers to 86px visible (44%) and the first tile
moves to 877; at 390 the alert moves to 341 and the first tile to 750. It costs
24px of photograph on phones and nothing anywhere else.

---

# 2. "Getting your child seen" still needs cleaning up

## The problem

> "Also this section needs to be cleaned up: Getting your child seen"

design-02 took this band from 1,173px to 948px at 390 by folding the eight phone
numbers into the first route and deleting a duplicate heading and a duplicate
button row. The client has looked at the result and says it still needs work. I
re-measured rather than assuming that round was enough.

| | 390x844 | 320x568 | 768x1024 | 1280x800 |
|---|---|---|---|---|
| `.sym-next` height | **948** | 1,215 | 648 | 625 |
| share of the page | 23% | 27% | 19% | 19% |
| `.sc-route-now` height | **478** | 660 | 266 | 238 |
| the eight cells | 260 | 364 | 126 | 126 |
| `.sc-trust` | 112 | 112 | 56 | 56 |

Three things are still wrong, and they are not the three design-02 fixed.

1. **Eight outlined cards are the loudest object in the band.** Each of the eight
   `.sym-call-item` cells carries its own `1px #dfe2e5` border and 14px radius,
   so the reader is given **eight separate objects** to scan, seven of which are
   the wrong answer. Measured, the grid plus its note is 316 of 948px — a third
   of the band — and under a 4px blur the eight blue numbers are the band's
   dominant texture.
2. **The reader must read four lines before reaching a number.** The route's own
   sentence — "Call your office's main number, nights, weekends and holidays
   included. You will reach a nurse or a physician, not an answering service." —
   measures **112px, four lines at 390**, and it sits between the bold promise
   ("Talk to a nurse now, at any hour.") and the delivery. At 3am the promise and
   the number should touch.
3. **The band's three routes are not visually three routes.** Route one is a
   478px block containing a paragraph, a grid and a note; routes two and three
   are 56px and 112px bullets. The list does not read as a list, which is a large
   part of what "cluttered" describes.

The client's own framing in the brief — that eight numbers may be too many things
to show a frightened parent at once — is right about the feeling and cannot be
answered by removing numbers. design-01 established, from `offices.ts`, that
there is no practice-wide number: eight offices, eight distinct `phone` fields,
and the section's own copy says the nurse line is reached through an office's
ordinary main number. Cutting the list would send a Park City parent to the wrong
office. So the answer is not *fewer numbers*, it is *one object instead of
eight*.

## The design in one sentence

The eight cards become one hairline-ruled directory, and it moves up to sit
directly under the promise, with the sentence that explains it following as a
caption.

## The markup

`src/render/symptoms.ts`. `callList()` is unchanged — every class, every
`tel:` link and every span stays exactly as it is. What changes is the order of
three children of one `<li>`, and two sentences that were loose text become part
of the existing `.sym-call-note` paragraph:

```html
<ul class="sc-routes">
	<li class="sc-route-now" id="sym-call"><strong>Talk to a nurse now, at any hour.</strong>
		${callList()}
	</li>
	<li><strong>Be seen today.</strong> Every office keeps <a href="/medical-care/sick-visits/">same-day appointments</a> for illness and injury.</li>
	<li><strong>This evening or at the weekend.</strong> Most offices run <a href="/medical-care/after-hours-care/">After Hours Care</a>. It is by appointment rather than walk-in, and the hours differ by office.</li>
</ul>
<p class="sc-trust">If you are worried, call. We would rather answer a question that turns out to be nothing than have you sit up all night deciding whether it was.</p>
```

and `callList()`'s trailing note absorbs the sentence that used to precede the
grid, with no word added, removed or reordered:

```ts
	return `<ul class="sym-call-list">${items}</ul>
						<p class="sym-call-note">Call your office&#8217;s main number, nights, weekends and holidays included. You will reach a nurse or a physician, not an answering service. Any office will help if yours is not on your mind. <a href="/locations/">Hours, addresses and directions</a>.</p>`;
```

Four sentences that were two paragraphs become one paragraph. **This is the
only copy-adjacent change in the design and it changes no words**; if an editor
objects to the merge, keeping them as two `<p class="sym-call-note">` elements
costs 10px and nothing else in this design depends on it.

**This reverses one design-02 decision and I am naming it.** design-02 rejected
"moving the grid above the sentence" on the grounds that "the sentence explaining
that a nurse answers these numbers at any hour would follow the numbers again".
The measurement that changed my mind: the sentence that introduces the numbers is
not that paragraph, it is the bold lead-in **"Talk to a nurse now, at any
hour."**, which still precedes them and now sits 38px above them instead of
154px. What follows the grid is reassurance — that it is nights and weekends too,
that it is not an answering service — and reassurance reads better after you can
see the number than before.

`id="sym-call"` stays on the `<li>`, so the hero's `href="#sym-call"` still
resolves to a line that reads "Talk to a nurse now, at any hour" followed
immediately by eight numbers.

## The CSS

Mobile first. One breakpoint at 768, which is where `.sym-call-list` already
goes from two columns to four.

```css
/*
 * The client, after design-02 had already taken this band from 1,173px to 948:
 * it still needs cleaning up. Re-measured, the remaining fault is not height,
 * it is that eight separately outlined cards are eight objects to scan when a
 * parent needs one, and that four lines of prose stood between the promise and
 * the numbers.
 *
 * So the eight cards become one directory: a single bordered panel with
 * hairlines between its cells. Nothing is removed — all eight `tel:` links stay
 * visible, because `offices.ts` holds eight distinct numbers and there is no
 * practice-wide one to give.
 *
 * The rules are drawn on the cells rather than as grid gaps showing the list's
 * background, so a ninth office would give the last row one bordered cell
 * rather than a solid grey block where the empty cell would be.
 */
.sc-routes .sym-call-list {
  margin: 10px 0 0 0;
  gap: 0;
  background: #ffffff;
  border: 1px solid #dfe2e5;
  border-radius: 14px;
  overflow: hidden;
}

.sc-routes .sym-call-item {
  min-height: 54px;
  padding: 8px 12px;
  gap: 0;
  border: 0;
  border-top: 1px solid #dfe2e5;
  border-left: 1px solid #dfe2e5;
  border-radius: 0;
  background: #ffffff;
}

.sc-routes .sym-call-list > li:nth-child(-n + 2) .sym-call-item { border-top: 0; }
.sc-routes .sym-call-list > li:nth-child(odd) .sym-call-item { border-left: 0; }

/* The cells no longer have their own border to recolour on hover. */
.sc-routes .sym-call-item:hover,
.sc-routes .sym-call-item:focus-visible {
  background: #f2f8fc;
  box-shadow: inset 0 0 0 2px #2b93d1;
}

.sc-routes .sym-call-office {
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.5px;
}

.sc-routes .sym-call-num {
  font-size: 17px;
  line-height: 23px;
}

/* Now the caption under the directory rather than the paragraph above it. */
.sc-routes .sym-call-note {
  margin: 10px 0 0 0;
  font-size: 15px;
  line-height: 22px;
}

.sym-next .sc-trust {
  margin: 0;
  font-size: 17px;
  line-height: 26px;
}

@media (min-width: 768px) {
  /* Four columns: the first row and the first column lose their rules instead. */
  .sc-routes .sym-call-list > li:nth-child(-n + 2) .sym-call-item { border-top: 1px solid #dfe2e5; }
  .sc-routes .sym-call-list > li:nth-child(odd) .sym-call-item { border-left: 1px solid #dfe2e5; }
  .sc-routes .sym-call-list > li:nth-child(-n + 4) .sym-call-item { border-top: 0; }
  .sc-routes .sym-call-list > li:nth-child(4n + 1) .sym-call-item { border-left: 0; }
}
```

design-02's block at site.css 5790–5817 is edited in place. The 44px tap padding
on `.sc-routes .sym-call-note a` at 5829 stays exactly as it is — measured, that
link's live area is **46px** tall, and it is still the band's only route to
`/locations/`.

## The behavior

**None. No JavaScript in this design, and none is changed.** Nothing in
`site.js` references `.sym-next`, `.sc-routes`, `.sym-call-list` or
`.sym-call-item`. With scripting off the band is byte-identical: eight `tel:`
links, three routes, one reassurance, all server-rendered, and `href="#sym-call"`
is a fragment the browser resolves without script. The band has no state before
the script runs because it has no state at all.

## The measurement

| | `.sym-next` | change | page height |
|---|---|---|---|
| **390x844** | 948 → **827** | **−121 (−12.8%)** | 4,105 → 3,984 |
| 320x568 | 1,215 → **1,080** | −135 | 4,431 → 4,296 |
| 768x1024 | 648 → **613** | −35 | 3,426 → 3,391 |
| 1280x800 | 625 → **596** | −29 | 3,347 → 3,318 |

Scan order at 390: the first phone number now appears at y=2,120 instead of
y=2,236, **116px earlier**, and 38px below the promise instead of 154px.

Objects in the first route: **8 bordered cards → 1 bordered directory.**
Type treatments in the band: unchanged at 3. Links: unchanged at 11, all
distinct. Tap targets: cells are **171 x 55px** at 390, 136 x 78px at 320,
168 x 55px at 768, 273 x 55px at 1280 — every one over 44px.

**The index is unaffected.** `.sc-routes` is shared with `.sc-reach` on
`/symptom-checker/`, which has no `.sym-call-list` and no `.sc-route-now`.
Measured before and after: `.sc-reach` is **1,024px at 390 in both**.

## The states

| state | what happens |
|---|---|
| empty | not possible; the band is static and identical on all 164 pages |
| loading / error | nothing loads, nothing can fail |
| long content | a ninth office fills a fifth 2-up row with one cell and one gap. The gap is empty page, not a grey block, because the rules are drawn on the cells. At 4-up a ninth office gives a third row of one cell |
| short content | seven offices leaves the last 2-up row with one cell; same |
| longest plausible string | "Grow Up Great" is the longest label. At 320 the cell is 136px wide, the label wraps, and the cell grows to 78px — a bigger target, not a fault. At 390 it fits on one line in 171px |
| `#sym-call` arrival | the browser scrolls the `<li>` to 72px below the sticky header (`scroll-margin-top`, design-02), so the reader lands on "Talk to a nurse now, at any hour" with the directory immediately under it |
| hover / focus | `:focus-visible` keeps the UA outline and adds a 2px inset ring and a tint; no geometry changes, so no reflow |
| high zoom / 200% text | the directory is a CSS grid of `1fr` columns; cells grow downward and the hairlines follow |

## Theme

Light only, as above. Every colour here already exists in the file.

| | on | ratio |
|---|---|---|
| `.sym-call-num` `#1a6f9f` 17px/700 | white | **5.50:1** |
| `.sym-call-office` `#636466` 12px/600 | white | **5.92:1** |
| `.sym-call-note` `#636466` 15px | white | 5.92:1 |
| `.sc-trust` `#636466` 17px italic | white | 5.92:1 |
| hairline `#dfe2e5` | white | 1.30:1 |

The hairlines are **decoration and are not the structure**: what separates one
office from the next is an uppercase label at 5.92:1 above a 17px bold number at
5.50:1, and each cell is its own link. If the rules vanished entirely — forced
colors, a high-contrast theme, a printout — the directory still reads as eight
labelled numbers. The panel's outer `#dfe2e5` edge is the same token the cells
carried before, so nothing new is being asked of it.

Under a 4px blur the band's survivors are the blue H2, the orange dot and its
bold orange line, then one rectangle of eight numbers instead of eight
rectangles. That continues design-01 finding 10 rather than re-solving it.

## What it costs

- **CSS**: +1,449 bytes raw, **+461 gzipped**, less roughly 430 raw replaced in
  design-02's block. Net ≈ +1,020 raw.
- **HTML**: about −60 bytes per page — one `</p><p class="sym-call-note">` pair
  removed — on 164 pages.
- **JavaScript**: none.
- **Reflow**: none. All static, all resolved at first style pass.
- **Page height**: −121px at 390 on 164 pages.

## What I rejected

- **Cutting the directory to four offices, or to the "nearest" office.** There is
  no practice-wide number and no way to know which office is the reader's. This
  is the same rejection design-01 made and the reason has not changed.
- **Collapsing the directory behind a "Show all offices" control**, or a
  `<select>`. Hiding eight phone numbers behind an interaction a frightened
  parent has to discover is the thing the brief forbids outright.
- **One column of eight single-line rows** (office left, number right). At 390 it
  is 8 × 44 + rules = 359px against the 2-up grid's 225px, and it makes the band
  taller to make it tidier.
- **Remembering the last office used** in `localStorage`, from design-01 3b.
  It is still a good idea and it is still not what the client asked for, and it
  does nothing on a first visit, which is the visit that matters here.
- **Adding a label above the directory** ("YOUR OFFICE'S MAIN NUMBER"). design-02
  deleted exactly that heading for saying the same thing as the route above it in
  a second type treatment. Putting it back to make the directory legible would
  concede that the directory is not legible.
- **Rewriting the two remaining routes into a shorter form.** "It is by
  appointment rather than walk-in, and the hours differ by office" is two lines
  of copy carrying two facts a parent needs before setting out. Cutting copy to
  win pixels is not cleaning up.
- **Replacing the italic `.sc-trust` with something louder**, or moving it above
  the routes. It is the point of the whole band and it is quiet on purpose;
  design-02 rejected this and I agree. Only its size and leading change, 18/28 to
  17/26, which is −34px and no change of voice.
- **Restyling `.sc-reach` on the index to match.** The client named the symptom
  page. `.sc-reach` has no directory and no first-route block, so there is
  nothing there for this design to do. Said plainly so the divergence is not read
  as an oversight.
- **Making the whole first route one big link.** It has eight destinations.

---

# 3. The frame is not automatically sized

> "the iframe is not being automatically sized; i can tell because i have to
> scroll up and down on the iframe just to see all the content"

The client is right that they scroll, right that no sizing is happening, and
wrong about what would fix it. This section gives the measurement first, because
the measurement decides the design and three of the four options in the brief are
eliminated by it.

## What is actually inside the frame

I extracted the structure of all 164 cached viewer pages in `/tmp/aap/`. These
are the pages the frame loads: their `<title>` is `symptomviewer`, and
`fever.html` is 76,851 bytes, byte-for-byte the size `curl` returns for the live
frame URL today.

**The AAP viewer is a three-tab widget, and it shows one tab at a time.** Its own
script, `AAP.SymptomChecker.js`, is 126 bytes in full:

```js
$(document).ready(function () {
    $("ul.symptom-tool-tabs").tabs("div.symptom-tool-panes > div.symptom-tool-pane");
});
```

The markup it drives is `<ul class="symptom-tool-tabs three-tabs">` with
**Definition**, **When To Call** and **Care Advice**, over three sibling
`.symptom-tool-pane` divs. The reader lands on Definition.

Visible text per topic, in characters, over the 158 topics that are not stubs —
the six that are (`antibiotics`, `cough-medicine`, `emergency-symptoms`,
`fever-myths`, `infection-exposure`, `taking-a-temperature`) are the `noTool`
set and carry no frame:

| | min | p25 | median | p75 | p90 | max |
|---|---|---|---|---|---|---|
| whole page | 3,905 | 5,980 | 7,514 | 9,282 | 11,849 | 21,636 |
| **Definition** (what the reader lands on) | 470 | 1,311 | **1,826** | 2,603 | 3,190 | 8,007 |
| When To Call | 303 | 910 | 1,164 | 1,466 | 1,717 | 2,230 |
| **Care Advice** (the long one) | 725 | 2,407 | **3,355** | 4,550 | 7,224 | **17,930** |
| tallest pane of the three | 1,331 | 2,519 | 3,394 | 4,825 | 7,445 | 17,930 |
| chrome outside the three panes | 622 | 670 | 692 | 716 | 749 | 824 |

Two things fall out of that table.

- **The Definition pane is a median 26% of the topic's text.** The parent brief's
  per-topic volumes — median 6,727 characters — are the whole document, and
  roughly three quarters of it is behind a tab click that happens inside the
  frame where we cannot see it.
- **The height of the frame's content is not a property of the topic. It is a
  property of which tab the reader has selected.** Within one topic it swings by
  1.8x at the median (1,826 → 3,355) and by 13.7x at the extreme (`breastfeeding`
  1,304 → 17,930).

One more fact, from the AAP's own `AAP.SymptomCheckerIframe.css`, fetched:

```css
@media (min-width: 768px) { .content-left { width: 675px !important; } }
```

At frame widths of 768 and above the AAP pins its content column to 675px. Our
frame is 364px wide at 390, 694px at 768 — both below the breakpoint, so fluid —
and **858px at 1280, where 183px of the frame, 21%, is empty margin**.

## Why "size the frame to its content" cannot be built

**(a) is rejected on measurement, not on principle.**

- A single height per topic must serve all three tabs. Size it to Definition and
  the reader who taps Care Advice — the tab that carries what to actually do —
  gets the inner scrollbar straight back, on the median topic, at 1.8x. Size it
  to the tallest pane and the frame is roughly three times taller than the tab
  the reader lands on: mostly white, on 158 pages, permanently.
- Sizing to the tallest pane on the worst topics means a frame of several
  thousand pixels. UI_RULES records "the frame previously sat in an oversized box
  that dominated the page without being usable" as a fixed fault. It would also
  push "Getting your child seen", and with it the eight phone numbers, from
  y=1,986 to somewhere past y=5,000 on a phone. That is a real harm to the reader
  this section is for, traded for a scrollbar.
- **Characters are not pixels, and I cannot calibrate the mapping from here.**
  Chromium in this environment cannot reach healthychildren.org — design-02
  recorded `net::ERR_CONNECTION_RESET` on 24 attempts, and I did not get a
  different answer. `curl` reaches it (verified: HTTP 200, 76,851 bytes), which
  is why the cached pages are trustworthy as *content*, but a content sample is
  not a rendered measurement. Any pixel figure I wrote would be arithmetic on an
  assumed characters-per-line and an assumed line-height for someone else's
  stylesheet, presented as if it were measured. I will not ship that, and a
  bounded estimate does not help either: the bound that keeps a bad guess safe is
  the viewport clamp we already have, which is the thing the estimate was
  supposed to replace.

design-02's 3b — a build-time per-topic height measured by a tool run on a
machine with network access — remains buildable and is not withdrawn. What this
section adds is that **it would not answer the client's complaint even if it
ran**, because it would measure the page as loaded, which is the Definition tab,
and the scrolling the client is describing is mostly the other two.

## Why full screen cannot be the answer either

**(c) is rejected on measurement.** design-01 sized the dialog when the inline
frame was 460px, and it was worth a 73% gain then. design-02's viewport fitting
collected that gain inline. Measured today, by opening the dialog and reading its
geometry:

| viewport | inline frame | dialog body | full screen gains |
|---|---|---|---|
| **390x844** | 698 | **700** | **+2px** |
| 320x568 | 460 | **403** | **−57px** |
| 768x1024 | 720 | 831 | +111 |
| 1280x800 | 704 | 699 | −5 |

On the baseline phone, promoting the dialog to the primary reading surface would
promote two pixels. At 320 it is worse than the inline frame. At 1280 the dialog
is 1,060px wide, and since the AAP pins its column to 675px above 768, every one
of those extra pixels is margin.

The dialog is spending **144px of an 844px phone on its own chrome** — a 71px bar
and a 73px footer.

## What I am designing instead

**(b), executed so that the nested scroll is bounded, visible and escapable.**
The honest sentence, which belongs in the reply to the client: *the AAP tool is a
document, not a widget; it will always scroll inside itself, and no frame height
on a phone can change that. What we can fix is that our page currently makes it
worse.*

Three measured faults it does fix:

1. **The way out is not on screen while you are reading.** Measured at 390x844:
   park the frame's top edge under the sticky header, which is the natural
   reading position, and "Full screen" lands at screen y=767–815 with the CTA
   dock starting at 772, while "Open on HealthyChildren.org" lands at 825–873,
   **entirely below the 844px fold** — `document.elementFromPoint` at its centre
   returns `null`. At 320x568 both controls are below the fold. The frame's two
   exits are 709px below the frame's top edge, and the frame is 698px tall.
2. **The caption above the frame is a 21px passive label.** At ≤575 it does not
   even name the topic (`.sym-embed-cap .sym-embed-topic { display: none }`), so
   it reads "AAP SYMPTOM CHECKER" and offers nothing.
3. **The dialog wastes 17% of a phone screen**, which is why escaping to it buys
   two pixels.

### The markup

`src/render/symptoms.ts`, inside the `.sym-embed` block. The existing
`.sym-embed-grow` button moves from `.sym-embed-acts` into `.sym-embed-cap`. It
is the same element with the same attributes; nothing is added and nothing is
removed.

```html
<div class="sym-embed">
	<p class="sym-embed-cap"><span class="sym-embed-name">AAP Symptom Checker</span><span class="sym-embed-topic">${symptom.short}</span><button type="button" class="sym-embed-act sym-embed-grow" data-sym-frame="…" data-sym-title="…" hidden>Read full screen<svg …></svg></button></p>
	<div class="sym-embed-stage">
		<div class="sym-embed-fallback">…unchanged…</div>
		<iframe class="sym-embed-frame" title="…" src="…" loading="lazy"></iframe>
	</div>
	<p class="sym-embed-acts">
		<a class="sym-embed-act sym-embed-open" href="${aapPageUrl(symptom)}" target="_blank" rel="noopener">Open on HealthyChildren.org<svg …></svg></a>
	</p>
</div>
```

`.sym-embed-cap` is a `<p>` containing a `<button>`; that is valid, a button is
phrasing content. If the auditor prefers, the element can become a `<div>` with
no CSS consequence — `.sym-embed-cap` sets its own `display: flex`.

The label changes from "Full screen" to **"Read full screen"**, three words that
say what the control does about the reader's problem. That is the only copy
change in item 3.

**This adjusts design-01 finding 8, which moved these controls from above the
frame to below it "where the hand is".** The measurement that changed:
design-01's frame was 460px, so "below the frame" was on screen with it. After
design-02 the frame is 698px, which is the whole usable fold, so "below the
frame" is off screen. The link that stays below — "Open on HealthyChildren.org",
the rescue when the frame shows nothing — keeps its 48px target and now takes the
full width on its own.

### The CSS

```css
/*
 * The client: "the iframe is not being automatically sized ... i have to scroll
 * up and down on the iframe just to see all the content".
 *
 * It cannot be sized to its content and this is why, recorded so nobody
 * re-derives it: the AAP viewer is a three-tab widget — its own 126-byte
 * AAP.SymptomChecker.js runs jQuery Tools `.tabs()` over Definition, When To
 * Call and Care Advice — and it shows one tab at a time. Across the 158 topics
 * with a tool, the tab the reader lands on holds a median 1,826 characters and
 * the Care Advice tab a median 3,355, up to 17,930. The height of the content
 * is a property of a click that happens inside a cross-origin frame, not of the
 * topic. A fixed height either restores the scrollbar on the long tab or leaves
 * a slab of white on the short one, and the tallest-pane figure would put the
 * routing band past y=5,000 on a phone.
 *
 * So the frame keeps design-02's viewport fit and gives back 44px of itself to
 * buy a control bar that stays on screen while the frame is being read.
 * Measured at 390x844: bar 44 + 9 gap + frame 654 + 2 border = 709 against a
 * 714px usable fold, so the whole frame and its way out are on one screen.
 *
 * `svh` and not `dvh`, and the static declaration first as the fallback, for
 * the reasons design-02 recorded; only the three subtrahends change.
 */
.sym-embed-cap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 8px 0;
  padding: 0 2px;
  min-height: 44px;
}

.sym-embed-cap .sym-embed-grow {
  flex: 0 0 auto;
  align-self: center;
  margin-left: auto;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid #dfe2e5;
  border-radius: 22px;
  background: #ffffff;
  color: #1a6f9f;
  font-size: 15px;
}

.sym-embed-cap .sym-embed-grow:hover,
.sym-embed-cap .sym-embed-grow:focus-visible {
  border-color: #2b93d1;
  color: #b3540c;
}

.sym-embed-cap .sym-embed-grow svg { width: 14px; height: 14px; }

.sym-embed-frame {
  height: 560px;
  height: clamp(560px, calc(100svh - 202px), 720px);
}

@media (max-width: 575px) {
  /* 58px sticky header + 72px dock + 44px bar + 9px gap + 7px of daylight */
  .sym-embed-frame {
    height: 460px;
    height: clamp(460px, calc(100svh - 190px), 720px);
  }
}

@media (min-width: 1200px) {
  /* No sticky header and no dock here, so the acts row fits below as well. */
  .sym-embed-frame {
    height: 560px;
    height: clamp(560px, calc(100svh - 140px), 720px);
  }
}

/*
 * The dialog was spending 144px of an 844px phone on a 71px bar and a 73px
 * footer, which is why escaping to full screen gained two pixels. The close
 * button stays 44x44 and the footer button stays a full-width 44px; only the
 * padding around them comes in.
 */
.sym-modal-bar { padding: 6px 12px; }
.sym-modal-foot { padding: 6px 12px calc(6px + env(safe-area-inset-bottom, 0px)); }
.sym-modal-done { min-height: 44px; border-radius: 22px; }
```

The `.sym-embed-frame` rules at site.css 5096 / 5245 / 5253 and the modal rules
at 5129 / 5186 / 5193 are edited in place.

### The behavior

`site.js:1208` reads `document.querySelector("[data-sym-frame]")` and
`document.querySelector(".sym-modal")` — both document-scoped. Moving the button
between two ancestors inside the same page requires **no JavaScript change**,
verified by driving the prototype: the button opened the dialog and the dialog
built its frame on first open exactly as before.

**Before the script runs**, the button is `hidden` in the markup, so the bar
holds only the label and the topic pill, at its final 44px height. Nothing moves
when the script reveals the button, because the bar's height is set by
`min-height`, not by its contents.

**If the script never runs**, the bar is a 44px label row and the way out of the
frame is the 48px "Open on HealthyChildren.org" link below it, which is a plain
`<a href>` that has never needed script. Content ships functional.

Nothing here reads, times, listens to, or waits for the frame. No `message`
listener is added and none exists.

### The measurement

Parked at the natural reading position — the bar's top edge at the bottom of the
sticky header:

| | frame height | bar | frame on screen | "Read full screen" on screen | dialog body |
|---|---|---|---|---|---|
| **390x844** | 698 → **654** | 21 → **44** | 661 of 698 → **654 of 654** | 5 of 48 → **44 of 44** | 700 → **730** |
| 375x667 | 521 → **477** | 21 → 44 | 484 → **477 of 477** | 0 → **44 of 44** | 551 |
| 320x568 | 460 → 460 | 21 → 66 | 305 of 460 | 0 → **66 of 66** | 403 → **452** |
| 768x1024 | 720 → 720 | 25 → 44 | 720 of 720 | 44 of 44 | 831 → **843** |
| 1280x800 | 704 → **660** | 25 → 44 | 660 of 660 | 44 of 44 | 699 → **711** |

After this, full screen is worth **+76px at 390**, +74 at 375, +123 at 768 and
+51 at 1280 — a real upgrade rather than two pixels — and at 320 it goes from
57px worse than the inline frame to 8px worse.

Page height, with item 2 also built, measured on `/symptom-checker/fever/`:

| | before | after |
|---|---|---|
| 390x844 | 4,105 | **3,905** |
| 320x568 | 4,431 | 4,261 |
| 768x1024 | 3,426 | 3,410 |
| 1280x800 | 3,347 | 3,293 |

**The one thing that gets worse, stated plainly.** The bar grows from 21px to
44px, so the frame's top moves from y=730 to y=753 at 390 and the frame visible
before any scroll falls from 42px to 19px. review-01 finding 4 was about that
number. I am spending 23 of its pixels because 42px of a frame is a colour, not a
reading position, and what the reader does next is scroll the frame under the
header — where the bar is now permanently in view. If the auditor disagrees,
`.sym-embed-cap { margin-bottom: 4px }` returns 4 of the 23 for nothing.

### The states

| state | what happens |
|---|---|
| frame never loads | `.sym-embed-fallback` still sits behind it at `inset: 0`, now in a 654px box. Unchanged, and design-01's honest limit still applies: an offline or DNS failure makes the browser paint its own error page over the message, which is why the 48px "Open on HealthyChildren.org" link below the frame is the rescue that depends on nothing. Verified in the prototype — with non-localhost blocked the stage is a grey rectangle and that link is the only thing on screen that helps |
| frame loads a short tab | the AAP's white page fills part of the frame; `.sym-embed-stage` is also `#ffffff`, so the remainder reads as panel, not as a hole |
| frame loads a long tab | the reader scrolls inside a 654px window, with the way out on screen throughout. Honestly stated: the complaint is reduced, not eliminated, and it cannot be eliminated |
| reader switches tab inside the frame | we get no signal and need none; the frame height does not change, so nothing on our page moves |
| script off | 44px label bar, no button, the "Open on HealthyChildren.org" link below at 48px |
| dialog open | body 730px at 390 with a 57px bar and a 57px footer; Escape, the footer button, the bar button and the backdrop all still close it (design-01) |
| browser without `svh` | drops the second declaration at parse time and gets 460/560 exactly as today |
| landscape phone 844x390 | `100svh` is 390, the clamp floors at 560, the page scrolls. Unchanged from design-02 and not the case this section is for |
| 320x568 | the bar wraps to 66px because "AAP SYMPTOM CHECKER" needs two lines at 296px, and the frame stays at its 460px floor inside a 380px fold. Both are the pre-existing 320 compromise; nothing new is broken |
| longest topic name | `.sym-embed-topic` is already `display: none` below 576. Measured at 768 on `swallowed-substance`, the longest, the bar stays one line at 44px |
| `prefers-reduced-motion` | nothing here animates |

### Theme

Light only. The bar's button is the existing `.sym-embed-act` palette: `#1a6f9f`
on white, **5.50:1**, in a `#dfe2e5` pill that matches the tile and cell edges
elsewhere in the section. Hover goes to `#b3540c`, **5.01:1**, which is
design-01's text-only orange; every orange and blue *fill* in the section stays
`#F58220` and `#2B93D1` exactly. `.sym-embed-name` stays `#636466` at 5.92:1 and
`.sym-embed-topic` stays white on `#2B93D1` as a non-text-critical pill whose
words are repeated in the H2 directly above it.

Under a 4px blur the tool band's survivors become the blue H2, the white pill of
the control bar, and the frame's edge — the way out is now one of the three
things that survive a glance, which it was not.

### What it costs

- **CSS**: +1,375 bytes raw, **+608 gzipped**, less roughly 300 raw replaced.
  Net ≈ +1,075 raw.
- **HTML**: zero net — one button moves; the label gains 5 characters, on 158
  pages.
- **JavaScript**: none.
- **Reflow**: zero after first paint. `svh` is fixed for the orientation and
  resolved before layout; the bar's height is `min-height`, not content-derived,
  so revealing the hidden button moves nothing. The only resize the design can
  cause is an orientation change, which is user-initiated.
- **Page height**: −44px at 390, 375 and 1280; unchanged at 320 and 768 where the
  floor and the ceiling bind.

### What I rejected

- **(a) A frame as tall as its content, from the cached character volumes.**
  Rejected above on measurement: the content height belongs to a tab click inside
  the frame, not to the topic, and no static height can track a 1.8x median swing
  and a 13.7x worst case. Separately, no rendered measurement is possible here,
  so the character-to-pixel mapping would be an assumption presented as a number.
- **(c) The dialog as the primary reading surface.** Rejected above on
  measurement: +2px at 390, −57px at 320. Item 3 makes the dialog worth entering;
  it does not pretend it is the answer.
- **Appending a fragment to the frame URL** — `#care-advice`, or the pane's own
  `read_content3` — to open the frame past the AAP's chrome and on the tab that
  matters. It works only by depending on ids and tab-plugin behaviour inside a
  cross-origin document, which hard constraint 3 forbids in terms. It is also the
  kind of thing that fails silently a year later.
- **`postMessage` height negotiation.** No contract exists on the AAP side, and
  `site.js` must not grow a `message` listener for a message nobody sends.
- **Widening the frame at ≥1200 to just under 768** so the AAP's column goes
  fluid at ~758px instead of pinned at 675px. It is a real 11% reduction in lines
  to scroll and I am not taking it: 758px at the AAP's 12px base is about 125
  characters a line, and fewer lines that are each harder to read is not a
  trade I will make for a frightened parent.
- **Narrowing the stage at ≥1200 to remove the 183px of empty margin.** Cosmetic,
  changes no scrolling, and the client did not raise it.
- **Making the frame shorter than the fold so a strip of page shows under it**,
  on the theory that a reader whose thumb is on the frame cannot scroll the page.
  I tested the premise rather than assuming it: in Chromium, wheel scrolling
  inside a cross-origin iframe chains to the parent once the frame reaches its
  end (page scroll went 400 → 2,254 after the inner frame hit 4,502). Synthetic
  touch events gave the opposite and clearly unreliable answer — the swipe drove
  the page and never reached the frame at all — so I will not build on either. No
  pixels are spent on an untested claim.
- **An overlay affordance on the frame** — a fade, a chevron, an inset shadow —
  to signal that it scrolls. Every version of it covers 8 to 24px of the AAP's
  own content, on 158 pages, permanently, to say something the scrollbar already
  says.
- **A timer or a load handler** to swap in the fallback. Hard constraint 3, and a
  cross-origin frame gives no trustworthy signal.
- **Removing the frame on phones and linking out instead.** That is a different
  section, not a fix to this one.

---

## Files a full build touches

None of them the vendored theme, and `public/assets/site.js` is not touched by
any of the three.

- `public/assets/site.css` — items 1, 2 and 3
- `src/render/symptoms.ts` — items 1, 2 and 3
- `src/content/symptom-checker.html` — item 1 only, one line
- `src/index.ts` — item 1 only, one line

`src/build.ts` is not touched; item 1's `<noscript>` stays inside the plinth,
which is what avoids it.

## Combined effect, measured

| | 390x844 | 320x568 | 768x1024 | 1280x800 |
|---|---|---|---|---|
| index: search input top | 598 → **145** | 714 → **203** | 666 → **209** | 769 → **424** |
| index: first tile top | 786 → **774** | 902 → 890 | 846 → 826 | 949 → 899 |
| index: page height | 5,408 → **5,396** | 6,096 → 6,084 | 4,706 → 4,686 | 4,746 → 4,696 |
| fever: `.sym-next` | 948 → **827** | 1,215 → 1,080 | 648 → 613 | 625 → 596 |
| fever: frame height | 698 → **654** | 460 → 460 | 720 → 720 | 704 → 660 |
| fever: dialog body | 700 → **730** | 403 → **452** | 831 → 843 | 699 → 711 |
| fever: page height | 4,105 → **3,905** | 4,431 → 4,261 | 3,426 → 3,410 | 3,347 → 3,293 |
| CSS added | +4,191 raw, less ~1,430 raw replaced in place. Gzipped separately the three blocks are 482 + 461 + 608 = **1,551**, which is an upper bound: gzipped together against the existing 40,947-byte stylesheet the real figure is lower | | | |
| JavaScript changed | **none** | | | |
