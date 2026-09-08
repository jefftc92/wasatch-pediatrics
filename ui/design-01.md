# Symptom section — design 01

Designed against `ui/review-01.md`, findings 2 to 14. Finding 1 is fixed and not
designed for.

## Baseline re-measured before designing

| | measured now | review said |
|---|---|---|
| fever frame top @390x844 | **1,306px** | 1,334px |
| fever page height @390 | 3,782px | 3,529-3,834 |
| index height @390 | 5,523px | 5,523 |
| index .sym-find top @390 / @1280 | 713 / 982 | same |
| index first tile top @390 | 857 | 857 |
| hero height, all 164 | 420px min-height | 420 |

The 28px difference is finding 1's marker removal. All arithmetic uses 1,306.

## Reuse, stated before anything new was invented

| existing | reused for | why |
|---|---|---|
| `.sym-tiles a` 48px pill, 1px #dfe2e5, radius 24, white | `.sym-call-item` copies its geometry and palette | three card idioms already exist; the phone list is a fourth content, not a fourth style |
| `.sym-none` panel | `.sym-emergency` in the alert band's cream | one panel shape for "the search has something to tell you" |
| `.sym-sec` uppercase label | `.sym-call-title`, `.sym-embed-cap` | the section already has one way to say "label, not heading" |
| `hidden` in markup, JS reveals | search box, emergency panel | UI_RULES 4 names this as the pattern |
| `.sym-find-count[role=status]` | zero-hit announcement | no second live region |
| `.sym-acts` pill row | emergency panel, modal footer | exists because a shared pill leaked padding; that fault must not return |
| `offices`, `formatPhone`, `locationNames` | all of finding 3 | `/locations/` builds tel: from exactly these |

No new dependency, no bundler, no theme file touched, nothing requiring the
iframe to have loaded.

## One shared token

Finding 11 needs a text-only blue. **`#1a6f9f`** — 5.50:1 on white, 5.04 on
`#f4f5f6`, 5.00 on the theme's `#F4F4F4`, 5.07 on the alert cream. Fills,
borders, the hero wash and the topic pill stay `#2B93D1` exactly. Text hover
becomes `#b3540c` (5.01:1); fills stay `#F58220`.

## Build order

```
11, 12, 13, 14   CSS/JS only, no dependencies, buildable first, any order
2                head + one markup change
3a               render helper + CSS  ->  3b (JS)  ->  3c (index)
8 + 9 + 4c       all three edit .sym-embed; build as one commit
4a 4b 4d 4e      4b IS 12's mobile half, count once
5, 6, 7          index only; 6 and 7 share apply()
10               needs 3a for its call grid
```

---

## 2. JavaScript off gives a blank white screen

The overlay's **markup is ours** (`src/render/header.ts:417` emits
`<section class="page-load"></section>`); only the stylesheet rule is the
theme's. We may not edit the stylesheet; we may add our own rule from our head.

In `src/build.ts`, appended to the `siteAssets` array, which both
`render/generated.ts:122` and `render/document.ts:66` consume, so generated and
copied pages get it from one edit:

```html
<noscript><style>.page-load{display:none!important}</style></noscript>
```

Second order, the search box. Wrap it so nothing ships that does nothing:

```html
<div class="sym-find-slot">
  <div class="sym-find" hidden> ... unchanged ... </div>
  <noscript>
    <p class="sym-find-off">Type-to-search needs JavaScript. Every one of the
    164 pages is listed below, grouped by what you can see or hear.</p>
  </noscript>
</div>
```

```css
.sym-find-slot { min-height: 124px; margin: 0 0 18px 0; }
.sc-index .sym-find-off {
  margin: 0; max-width: 620px; padding: 16px 18px; border-radius: 14px;
  background: #f4f5f6; font-size: 16px; line-height: 24px; color: #4a4b4d;
}
@media (min-width: 768px) { .sym-find-slot { min-height: 112px; } }
```

JS reveals `.sym-find` at the top of the existing index IIFE (site.js:1244)
before `apply()`. The slot reserves the height so nothing jumps.

**Rejected:** deleting `.page-load` from `header.ts` (changes 272 pages);
`@media (scripting: none)` (unsupported before Chrome 120 / Safari 17, and the
reader is on an old phone); leaving the box visible and inert (rule 4 forbids
it); a server-side `?q=` filter (duplicates the matcher in two languages while
finding 7 is changing it).

---

## 3. No phone number anywhere in the section

### The judgement asked for: can a single number be resolved at render time?

**No, and inventing one would be dishonest.** `src/data/offices.ts` holds eight
offices with eight distinct `phone` fields. `renderFooter()` and
`renderHeader()` contain no `tel:` at all. There is no practice-wide number in
the data or the copied site, and the section's own copy says why: "you reach it
through your office's ordinary main number, so there is no separate number to
find."

So the design is **all eight, as `tel:` links, on the page**. The picker is the
answer. Plus an optional enhancement that remembers which one was used.

New helper in `src/render/symptoms.ts`, placed inside `.sym-next` immediately
after the H2 and before `<ul class="sc-routes">`:

```ts
import { offices, formatPhone } from "../data/offices.ts";
import { locationNames } from "../data/services.ts";

/**
 * Eight offices, eight main numbers, and the 24/7 nurse line answers on each.
 * There is no practice-wide number to give, so the page gives the choice
 * rather than a link to a page that has the numbers on it.
 */
function callList(): string {
  const items = offices.map((office) => {
    const name = locationNames[office.slug] ?? office.slug;
    return `<li><a class="sym-call-item" href="tel:${office.phone}" data-sym-office="${office.slug}"><span class="sym-call-office">${escapeAttribute(name)}</span><span class="sym-call-num">${formatPhone(office.phone)}</span></a></li>`;
  }).join("");

  return `<div class="sym-call" id="sym-call">
	<h3 class="sym-call-title">Call your office &#8212; a nurse answers at any hour</h3>
	<ul class="sym-call-list">${items}</ul>
	<p class="sym-call-note">Any office will help if yours is not on your mind. <a href="/locations/">Hours, addresses and directions</a>.</p>
</div>`;
}
```

Two zero-height anchors to it: the alert band's existing words become a link to
`#sym-call`, and the hero gains a first button before the existing ghost:

```html
<p class="dent-hero-act"><a class="btn sym-hero-call" href="#sym-call">Call a nurse</a> <a class="btn dent-hero-ghost" href="/symptom-checker/">All symptoms</a></p>
```

```css
.sym-call { margin: 0 0 26px 0; scroll-margin-top: 72px; }
.sym-call-title {
  margin: 0 0 12px 0; font-family: "Montserrat", sans-serif; font-size: 15px;
  font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; color: #636466;
}
.sym-call-list {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
}
.sym-call-item {
  display: flex; flex-direction: column; justify-content: center; gap: 2px;
  min-height: 64px; padding: 10px 12px; border: 1px solid #dfe2e5;
  border-radius: 14px; background: #ffffff; text-decoration: none;
  transition: border-color 0.15s ease;
}
.sym-call-item:hover, .sym-call-item:focus-visible { border-color: #2b93d1; text-decoration: none; }
.sym-call-office { font-size: 13px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: #636466; }
.sym-call-num { font-size: 17px; font-weight: 700; color: #1a6f9f; }
.sym-call-note { margin: 14px 0 0 0; font-size: 15px; line-height: 24px; color: #636466; }
.sym-call-note a { color: #1a6f9f; }
.sym-call-item.is-yours { border-color: #2b93d1; box-shadow: inset 0 0 0 1px #2b93d1; }
.sym-call-item.is-yours .sym-call-office:after { content: " · yours"; color: #1a6f9f; }
.sym-alert-link { color: #8a4b12; text-decoration: underline; text-underline-offset: 2px; }
.sym-hero-call { background: #ffffff; color: #1a6f9f !important; border: 2px solid #ffffff; }
@media (max-width: 767px) {
  .sym-hero .dent-hero-act { flex-wrap: nowrap; gap: 12px; }
  .sym-hero .dent-hero-act .btn { width: auto; flex: 1 1 0; min-width: 0; padding: 13px 10px; text-align: center; }
}
@media (min-width: 768px) { .sym-call-list { grid-template-columns: repeat(4, 1fr); } }
```

**3b, optional and separately buildable.** Remembers the office in
`localStorage` under `wp-office`, set only when a number is tapped, promotes it
to first with an `is-yours` mark, and repoints the hero button's `href` and
`aria-label`. The visible label never changes, so no reflow. Storage access is
wrapped in try/catch because private mode throws.

**Measured effect:** taps to a call go from 2 taps plus 1,852 + 2,621 + 1,117px
of scrolling onto a 17px target, to **2 taps and no scroll journey** onto a
178x69px cell. With 3b, **1 tap** from the first screen.

**Rejected:** inventing a main number (would send a Park City parent to the
wrong office at 3am); a `<select>` picker (hides content behind an interaction,
needs JS); geolocation (permission prompt at 3am, wrong when travelling);
putting the grid above the frame (spends the space finding 4 exists to recover);
a sticky call bar (a second floating control is finding 13 twice).

---

## 4. Zero pixels of the AAP frame visible before scrolling

The alert band is not touched. Its 170px, 7.36:1 and 6.25:1 are unchanged.

### The arithmetic, applied to the live server and re-measured

| step | what | frame top @390 |
|---|---|---|
| — | today | **1,306** |
| 4a | hero min-height released, eyebrow dropped <=767, padding 52/40 -> 40/28 | 1,211 |
| 4b | band padding above the frame 50 -> 30 (**this is finding 12's mobile half, counted once**) | 1,151 |
| 4c | AAP lead moves below the frame; the 62px bar becomes a 28px caption | 1,015 |
| 4d | `.sym-flow` order swap: the tool band paints before the intro band | **709** |

| viewport | frame top | visible before scroll |
|---|---|---|
| 390x844 fever | 709 | **135px** |
| 390x844 scabies (longest lead) | 736 | **108px** |
| 768x1024 fever | 743 | **281px** |
| 1280x800 fever | 739 | **61px** |

**Steps 4a to 4c alone leave it at 1,015px, still zero visible.** An auditor who
stops after 4c has bought scroll and a shorter page but has not answered finding
4. Stated so nobody claims otherwise.

```html
<div class="sym-flow">
  <div class="whitebg padme90 sym-intro"> ... our words, unchanged ... </div>
  <div class="graybg padme90 sym-tool"> ... heading, frame, controls ... </div>
</div>
```

```css
/*
 * Paint order, not document order. The frame is the reason the page exists and
 * it began 1,306px down; our own paragraph, which has no focusable content,
 * now follows it on screen while still preceding it in the document.
 */
.sym-flow { display: flex; flex-direction: column; }
.sym-flow > .sym-tool { order: 1; background: #ffffff; border-top: 0; }
.sym-flow > .sym-intro { order: 2; background: #f4f4f4; border-top: 1px solid #e4e7ea; }

/*
 * The hero was a fixed 420px box holding 330-384px of content, so every page
 * carried 36-90px of empty blue below its button.
 */
.sym-hero .dent-hero-inner { min-height: 0; }

@media (max-width: 767px) {
  .sym-hero .dent-hero-eyebrow { display: none; }  /* the trail two lines above already says it */
  .sym-hero .dent-hero-inner { padding-top: 40px; padding-bottom: 28px; }
  .sym-hero .hero-crumbs { top: 12px; }
  .sym-hero .dent-hero-act { margin-top: 24px; }
}
```

DOM order is unchanged, so our own words still precede the frame for crawlers
and screen readers. `.sym-intro` contains no focusable element, so visual and
focus order do not diverge for anyone.

The alternation cream, white, grey, white, grey is preserved, so "no dividers
between sections" does not reopen: every seam carries either the alert band's
border-bottom or a `#e4e7ea` hairline.

**Rejected:** shrinking the alert band; hiding the hero lead on mobile (hiding
content to make room for a frame is the wrong trade); a DOM reorder instead of
CSS `order` (puts a cross-origin frame ahead of the only unique indexable prose);
making the frame shorter (460px is what makes it usable); lazy-mounting on
scroll (anything conditional on the frame breaches hard constraint 3).

---

## 5. The index first screen shows no topics

| | today | designed |
|---|---|---|
| 390 search input top | 713 | **599** |
| 390 first tile top | 857, 13 below fold | **772**, a full 48px row visible |
| 1280 search top | 982, 182 below fold | **724** |
| index height @390 | 5,523 | 5,369 |

```css
.sc-index { padding-top: 24px; }
.sc-index-head h2 { margin-bottom: 10px; }
.sc-index .sc-lead { margin-bottom: 18px; font-size: 17px; line-height: 26px; }
.sc-index .sym-find-hint { margin: 10px 4px 0 4px; font-size: 13px; line-height: 18px; }
.sym-find { margin: 0 0 18px 0; }
.sym-sec { margin: 0 0 14px 0; padding: 0 0 8px 0; }

@media (max-width: 767px) {
  /* The photograph stays. It is the page's identity and every other page has
     one. It stays at the height a phone can spare. */
  #mobileheroimage.sc-heroimg { height: 96px; object-fit: cover; object-position: center 30%; }
}
@media (min-width: 992px) {
  .sc-index { padding-top: 34px; }
  #usergeneratedsection .sc-herowrap { height: 340px; }
}
```

Cascade note for the auditor: `#usergeneratedsection .sc-herowrap` is (1,1,0)
against the theme's (1,1,0) `.herowrap`; `site.css` is emitted after
`style.css` in both `generated.ts:122` and `document.ts:84`, so ours wins on
order. The id supplies specificity only; the class styled is ours.

Fixing `#mobileheroimage`'s height **removes** an existing layout shift, since
the image currently reserves nothing until it decodes.

**Rejected:** deleting the mobile photograph (standing question 9 exists to stop
this section becoming the odd one out); moving search above the H2 (a box before
the sentence explaining it); collapsing "Common right now" into results (hides
content behind an interaction); autofocus (opens the keyboard over the tiles).

---

## 6. The no-match state produces no visible change

Move the existing `.sym-none` block from the end of the fragment to directly
after `.sym-find-slot`, and name the query back:

```html
<p class="sym-none-lead">Nothing here matches <span class="sym-none-q"></span>.</p>
```

```css
.sym-none {
  max-width: 620px; margin: 0 0 26px 0; padding: 22px 24px 6px 24px;
  border-radius: 16px; background: #f4f5f6; border-left: 4px solid #f58220;
}
.sym-none-q { font-style: italic; color: #2b2c2e; overflow-wrap: anywhere; }
.sc-index .sym-find-count { margin: 12px 4px 0 4px; font-size: 14px; line-height: 1.5; font-weight: 600; color: #1a6f9f; }
.sc-index .sym-find-count.is-none { color: #8a4b12; }
.sc-index .sym-find-count:empty { display: none; }
```

In `apply()` (site.js:1298), replace the two lines that clear the count:

```js
if (none) {
  none.hidden = hits > 0;
  var q = none.querySelector(".sym-none-q");
  if (q) q.textContent = "“" + find.value.trim().slice(0, 40) + "”";
}
if (count) {
  count.classList.toggle("is-none", hits === 0);
  count.textContent = hits
    ? hits + (hits === 1 ? " page matches" : " pages match")
    : "No pages match that word";
}
```

Zero hits now put the panel at ~640px, on screen, and the existing polite live
region announces "No pages match that word" instead of being emptied. The query
text is deliberately not in the live region, so a fast typist is not read their
own keystrokes back. A 300-character paste truncates at 40 chars, and
`overflow-wrap: anywhere` stops an unbroken token widening the layout.

**Rejected:** leaving the panel where it was and scrolling to it (programmatic
scroll fights the reader's thumb); a red input border (colour alone, and red is
the alarm this section deliberately does not use); `aria-live="assertive"`.

---

## 7. Search misses emergency words and compound variants

Two different failures, two different answers.

1. **Inflections and compounds** (`constipated`, `vomitting`, `pukes`,
   `diarrhoea`, `pinkeye`, `ear ache`, `stomachache`) — the page exists, the
   query shape misses it. Fix the matcher.
2. **`seizure`, `choking`** — no page exists and none should. These are 911,
   which our own alert band says 400px above. Give a purpose-built answer, not a
   forced match.

The term data file is never opened. A derived index is built at runtime:

```js
/*
 * Everything a tile can be found by, plus its adjacent pairs joined up, so
 * "pinkeye" reaches a tile whose terms say "pink eye". Built once, in memory:
 * nothing is added to the 164 data-terms attributes.
 */
var index = tiles.map(function (tile) {
  var words = (tile.getAttribute("data-terms") || "").split(" ").filter(Boolean);
  var tokens = words.slice();
  for (var i = 0; i < words.length - 1; i++) tokens.push(words[i] + words[i + 1]);
  return " " + tokens.join(" ");
});

var SPELLING = { diarrhoea: "diarrhea", vomitting: "vomiting", vomitted: "vomited", oedema: "edema", faeces: "feces", diarhea: "diarrhea" };

// Shortest useful root: "constipated" -> "constipat", "pukes" -> "puke".
function stem(word) {
  if (word.length < 5) return word;
  if (/ies$/.test(word)) return word.slice(0, -3) + "y";
  if (/(ing|ed)$/.test(word)) {
    var cut = word.replace(/(ing|ed)$/, "");
    if (/(.)\1$/.test(cut)) cut = cut.slice(0, -1);   // "vomitting" -> "vomit"
    return cut;
  }
  if (/es$/.test(word)) return word.slice(0, -2);
  if (/s$/.test(word)) return word.slice(0, -1);
  return word;
}

function has(terms, word) {
  return terms.indexOf(" " + word) !== -1 || terms.indexOf(" " + stem(word)) !== -1;
}

function matches(terms, words) {
  var all = words.every(function (word) { return has(terms, word); });
  return all || (words.length > 1 && has(terms, words.join("")));   // "ear ache" vs "earache"
}
```

Stemming is a **fallback**, tried only after the current exact test fails, so
the 41 of 49 queries that already work are unchanged.

The emergency panel, shipping `hidden` and revealed only by typing:

```html
<div class="sym-emergency" hidden>
  <p class="sym-emergency-lead">This one is an emergency.</p>
  <p class="sym-emergency-body"></p>
  <p class="sym-acts"><a class="btn sym-emergency-call" href="tel:911">Call 911</a> <a class="btn blue" href="#sym-call">Call your office</a></p>
</div>
```

```js
var EMERGENCY = [
  { words: ["seizure","seizures","seizing","convulsion","convulsions","fitting"],
    body: "A seizure that is happening now, a first seizure, or one lasting more than five minutes: call 911. Lay your child on their side, do not put anything in their mouth, and note the time it started." },
  { words: ["choking","choke","choked","notbreathing","cantbreathe","bluelips","unconscious","drowning","unresponsive"],
    body: "If your child cannot breathe, cough or cry, cannot be woken, or has blue lips: call 911 now. If something has been swallowed but breathing is normal, the Swallowed object page below covers what to watch for." }
];
```

`choking` shows the panel **and** the Swallowed object tile.

```css
.sym-emergency { max-width: 620px; margin: 0 0 26px 0; padding: 22px 24px 8px 24px; border-radius: 16px; background: #fff4e8; border: 2px solid #f58220; }
.sym-emergency-lead { margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #8a4b12; }
.sym-emergency-body { margin: 0; font-size: 17px; line-height: 26px; color: #6b4a24; }
.sym-emergency .btn.sym-emergency-call { background: #a63d08; color: #ffffff !important; }
```

`sleep`, `wont eat`, `not eating`, `shaking` **still return 0** — no page covers
them, and they land in finding 6's rebuilt panel. Said plainly: term data is out
of bounds and inventing a match would be worse than an honest miss.

Index build cost: 164 tiles x ~30 tokens, one time, ~3ms. **No bytes added to
the data-terms attributes**; the index page stays 72KB.

**Rejected:** adding the words to `symptomTerms.ts` (forbidden, and for
`seizure` mapping a 911 word onto a symptom page is worse than the miss); a
Porter stemmer or Levenshtein (a dependency in spirit, and it makes 41 correct
queries less predictable); de-spacing the whole terms string ("hit head" +
"ache" becomes `hitheadache`); a `tel:911` autodial or confirm dialog (a modal
between a parent and 911 is indefensible).

---

## 8. The frame's escape hatches are ~21px, and Close is the only exit

Build with 9 and 4c; all three rewrite `.sym-embed`.

The caption moves above the frame, the controls below it where the thumb is, and
the dialog gains a full-width footer exit:

```html
<p class="sym-embed-cap"><span class="sym-embed-name">AAP Symptom Checker</span><span class="sym-embed-topic">${symptom.short}</span></p>
<div class="sym-embed-stage">
  <div class="sym-embed-fallback"> ... finding 9 ... </div>
  <iframe class="sym-embed-frame" title="..." src="..." loading="lazy"></iframe>
</div>
<p class="sym-embed-acts">
  <button type="button" class="sym-embed-act sym-embed-grow" ... hidden>Full screen</button>
  <a class="sym-embed-act sym-embed-open" href="..." target="_blank" rel="noopener">Open on HealthyChildren.org</a>
</p>
<p class="sym-tool-lead">${symptom.aapLead}</p>
...
<div class="sym-modal-foot">
  <button type="button" class="sym-modal-done" data-sym-close>Close and go back</button>
</div>
```

```css
.sym-embed-cap { display: flex; align-items: center; gap: 10px; margin: 0 0 8px 0; padding: 0 2px; }
.sym-embed-acts { display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0 0 0; }
.sym-embed-act {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  flex: 1 1 auto; min-height: 48px; padding: 12px 18px;
  border: 1px solid #dfe2e5; border-radius: 24px; background: #ffffff;
  color: #1a6f9f; font-family: "Montserrat", sans-serif; font-size: 15px;
  font-weight: 600; line-height: 22px; text-align: center; text-decoration: none; cursor: pointer;
}
.sym-modal-close { width: 44px; height: 44px; border-radius: 22px; }
/*
 * A phone has no Escape key and, at 100vw, no backdrop to tap. The way out is
 * a full-width control at the bottom, where the hand is.
 */
.sym-modal-foot { flex: 0 0 auto; padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px)); background: #f4f5f6; border-top: 1px solid #e4e7ea; }
.sym-modal-done { display: block; width: 100%; min-height: 52px; border: 0; border-radius: 26px; background: #1a6f9f; color: #ffffff; font-size: 16px; font-weight: 700; text-transform: uppercase; cursor: pointer; }
@media (max-width: 575px) { .sym-modal .sym-embed-topic { display: inline-block; margin-left: 8px; } }
@media (min-width: 768px) { .sym-embed-act { flex: 0 0 auto; } .sym-modal-foot { display: none; } }
```

`site.js` needs one change: `querySelector("[data-sym-close]")` returns only the
first button, so it becomes a loop over `querySelectorAll`.

Dialog body 798 -> 742 after the 56px footer, still a **61% gain** on the inline
460. The topic name returns inside the dialog below 575px, where it had said
only "SYMPTOM CHECKER".

**Rejected:** enlarging the 21px links in place (leaves the only exit in the
top-right corner and spends finding 4's space); a backdrop gutter on mobile
(shrinks the one thing full screen is for); swipe-to-dismiss (undiscoverable,
needs JS); closing on browser Back (history manipulation for a control with
three exits).

---

## 9. When the frame fails, the reader gets a wordless grey rectangle

Nothing below reads, times, or listens to the frame. No load handler, no timer.

```css
.sym-embed-stage { position: relative; border-radius: 14px; overflow: hidden; background: #ffffff; border: 1px solid #e4e7ea; }

/*
 * Behind the frame, not instead of it. Nothing here asks whether the frame
 * loaded: when it does, the AAP's own white page covers this; when it never
 * does, this is what was always there.
 */
.sym-embed-fallback { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 10px; padding: 24px 22px; background: #f8f9fa; }
.sym-embed-fallback-lead { margin: 0; font-size: 17px; font-weight: 700; color: #4a4b4d; }
.sym-embed-fallback p { margin: 0; max-width: 40em; font-size: 16px; line-height: 25px; color: #636466; }

/* The frame must not paint its own fill, or it covers the message. */
.sym-embed-frame { position: relative; display: block; width: 100%; height: 560px; border: 0; background: transparent; }
@media (max-width: 575px) { .sym-embed-frame { height: 460px; } }
```

The border and radius move from the iframe to the stage, so the panel's edge is
identical whether or not anything loads.

**Honest limit, stated by the designer:** offline or DNS failure makes Chromium
paint its own error page inside the frame, covering the message. That is why the
always-visible `Open on HealthyChildren.org` control from finding 8 sits
directly below the frame at 48px and 5.50:1. That control, not the panel, is the
guaranteed rescue.

**Rejected:** a load/error handler or timer (forbidden by hard constraint 3);
`onerror` on the iframe (does not fire cross-origin for HTTP errors, it would
lie); `navigator.onLine` (reports the NIC, not the AAP).

---

## 10. Under a glance the routing band inverts its own priority

Depends on 3a for its content. The pixels the call grid moves are counted under
3; this design adds ~26px of its own.

```css
/*
 * The most urgent route was the least visible: bold grey with no colour, no
 * link and no number, under two blue underlined links.
 */
.sc-routes .sc-route-now { padding-left: 22px; }
.sc-routes .sc-route-now:before { width: 10px; height: 10px; top: 10px; background: #f58220; }
.sc-routes .sc-route-now strong { display: block; margin-bottom: 2px; font-size: 19px; color: #8a4b12; }

/* "911" at 17px/300 did not survive a 4px blur. Band height measured 170px
   before and after, so finding 4's arithmetic is unaffected. */
.sym-911 { white-space: nowrap; font-weight: 700; box-shadow: inset 0 -2px 0 #f58220; }
```

Blur test after: the routing band's survivors become the blue H2, the eight blue
phone numbers, the orange dot and orange bold line, then the two inline links.
The first screen's survivors become the H1, the white "Call a nurse" pill, the
alert band with a marked "call 911 now", the ghost outline, and the green dock.
The hierarchy no longer says "book an appointment" first.

**Rejected:** recolouring or hiding the `.ctadock` (site-wide chrome; a
per-section exception is what standing question 9 catches); making the whole
first route a link (it has no single destination, which is finding 3's problem);
red for the alert band; enlarging the alert band's type (adds a line to a band
finding 4 must not grow).

---

## 11. Contrast

```css
/*
 * #2B93D1 is hard constraint 5 and stays exactly that as a fill, a border, the
 * hero wash and the topic pill. Text is the one place it fails: 3.39:1.
 */
.sym-tiles a, .sym-find-clear, .sym-others .area-group a,
.sym-embed-act, .sc-index .sym-find-count { color: #1a6f9f; }

.sym-sec-note, .sc-index .sym-find-hint { color: #636466; }   /* 2.78 and 3.41 -> 5.92 */
.sym-group-count { color: #5a5b5d; }                          /* 3.61 -> 5.95 on #eef0f2 */

/* Hover was #F58220 on white at 2.59:1. Text-only shade at 5.01:1; every
   orange fill and rule stays #F58220. */
.sym-tiles a:hover, .sym-find-clear:hover, .sym-others .area-group a:hover,
.sym-embed-open:hover, .sym-embed-grow:hover { color: #b3540c; }
```

`#1a6f9f` was chosen over the existing hover `#1c7cb4` because that measures
4.57 on white but **4.16 on `#F4F4F4`**, and the section is half made of grey
bands.

**Rejected:** darkening `#2B93D1` itself; bumping text to 18.66px for the
large-text threshold (reflows 164 tiles to avoid a colour change); a custom
property (the file has none; a new convention for five rules).

---

## 12. Band padding sized for copy that no longer exists

Shared with finding 4: the mobile half of this rule **is** step 4b, counted once.

```css
/*
 * padme90 is 90px, 50px below 768. It was sized for pages with three
 * paragraphs; these have one, of 16 to 52 words, and the band was up to 65%
 * padding. The hairline at the seam is what fixed "no dividers between
 * sections", so it stays and the padding around it comes in.
 */
.sym-intro.padme90, .sym-tool.padme90, .sym-next.padme90, .sym-others.padme90 {
  padding-top: 30px; padding-bottom: 30px;
}

/* -18px pulled the lead into the heading: the gap measured -4px here and +15px
   for the identical pairing in the intro band. One rhythm. */
.sym-tool-lead { margin: 16px 0 0 0; color: #636466; font-size: 18px; line-height: 28px; max-width: 58em; }

@media (min-width: 768px) {
  .sym-intro.padme90, .sym-tool.padme90, .sym-next.padme90, .sym-others.padme90 {
    padding-top: 56px; padding-bottom: 56px;
  }
}
```

If 4c is **not** built and the lead is still above the frame, use
`margin: 0 0 26px 0` instead, which gives the same +14px rhythm from the other
side.

Selectors are anchored on our own band classes; `.padme90` only raises
specificity above the theme's. No bare utility selector is introduced.

/sty/ at 1280 goes 326px and 65% padding to 258px and 55%. Four bands at 390 go
400px of padding to 240px, **160px recovered**, 60 of it above the frame and
counted under 4.

**Rejected:** removing the padding entirely; overriding `.padme90` globally (a
theme edit by another route, 272 pages); per-page padding scaled to word count
(breaks the structural consistency the review calls already good).

---

## 13. The CTA dock swallows a tap for ~100ms after every scroll stop

```css
/*
 * While the button folds from 358px to 56px it is still 358px wide to a
 * finger, so a tap 80ms after a scroll stop landed on /contact-us/ instead of
 * the tile under it.
 */
.ctadock.is-folding .ctadock-btn { pointer-events: none; }
@media (prefers-reduced-motion: reduce) { .ctadock-btn, .ctadock-label { transition: none; } }
```

```js
var folding = null;
var syncDock = function () {
  var mini = !wide.matches && window.scrollY > 140;
  if (mini === dock.classList.contains("is-mini")) return;   // no work at rest
  dock.classList.toggle("is-mini", mini);
  dock.classList.add("is-folding");                          // 320 > 280ms
  window.clearTimeout(folding);
  folding = window.setTimeout(function () { dock.classList.remove("is-folding"); }, 320);
};
```

`transitionend` is deliberately **not** used: it does not fire when a transition
is interrupted by the reverse toggle, which is exactly what fast scrolling does,
and the button would be left permanently dead.

A missed tap is recoverable; a wrong navigation is not. Side benefit: the early
return removes a `classList.toggle` from every scroll frame.

**Rejected:** dropping `width` from the transition (the fold is a recorded design
decision); `transitionend`; a wrapper with a 56px live core (two overlapping hit
areas, wrong while expanded); removing the dock from symptom pages.

---

## 14. Small residuals

```css
/* 43px against a 44px minimum, on 5-11 links per page. The margin comes off by
   the same amount, so the list's rhythm is unchanged. */
.sym-others .area-group li a { padding: 9px 0; }

/* 67 x 32 inside a 52px input: the padding grows without growing the box. */
.sym-find-clear { min-height: 44px; min-width: 76px; padding: 11px 18px; }

/* 107 x 15 at y=95. Pinned, so the pad is absorbed by a negative margin and the
   hero does not grow. 35px is not 44; the 366x52 "All symptoms" button 250px
   below is the reachable route. */
.sym-hero .hero-crumbs a { display: inline-block; padding: 10px 2px; margin: -10px 0; }
```

`.area-group` elsewhere (`/locations/`, service areas) is untouched: the
selector is scoped to `.sym-others`.

**Rejected:** padding the crumbs to a full 44px (would overlap the H1 or push
the hero down, spending finding 4's recovery on a link finding 14 itself calls
mitigated); changing `.area-group li a` globally.

---

## Combined effect of 3, 4, 10 and 12, each counted once

Measured at 390x844 on `/symptom-checker/fever/`.

**Above the frame**

| step | owner | effect |
|---|---|---|
| hero min-height released, eyebrow dropped, padding tightened | 4a | −95 |
| band padding 50 -> 30 on the two bands above the frame | 4b = 12 mobile half | −60 |
| AAP lead below the frame; 62px bar -> 28px caption | 4c = 8 + 9 markup | −136 |
| `.sym-flow` order swap | 4d | −306 |
| alert band | — | **0, untouched** |
| **frame top** | | **1,306 -> 709**, 135px visible before any scroll |

**Whole page**

| step | owner | effect |
|---|---|---|
| everything above | 4 | −215 |
| band padding on the two bands below the frame | 12 other half | −100 |
| eight tel: cells and their heading | 3 | +354 |
| first route becomes a block | 10 | +26 |
| controls move from above to below the frame | 8 | −14 |
| residual link padding | 14 | +18 |
| **page height** | | **3,782 -> 3,851 (+69px, +1.8%)** |

The page is 69px taller, and 597px of it has moved from in front of the frame to
behind it. The section gains its first `tel:` link, on the first screen at one
tap's reach, and the first visible pixels of the tool it is built around.

**Files a full build touches**, none of them the vendored theme:

- `public/assets/site.css`
- `public/assets/site.js`
- `src/render/symptoms.ts`
- `src/build.ts` (finding 2, one line in `siteAssets`)
- `src/content/symptom-checker.html` (findings 3c and 5 only — flagged because
  `tools/sync-from-live.py` empties `src/content/`; the file already carries hand
  edits, so the risk is pre-existing)
