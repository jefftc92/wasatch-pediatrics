# UI review 01 — symptom section

Measured with Chromium via Playwright against localhost:5000, every non-localhost
request aborted, so these are fallback-font metrics and also the slow-connection
case. Baseline 390x844, also checked 768x1024 and 1280x800.

## Two premises corrected by measurement

- **No page carries three paragraphs.** All 164 have exactly one. Word counts run
  16 (sty, hoarseness, painful-urination) to 52 (fever-under-1). fever is 37,
  head-injury 33.
- **The page-height figures in UI_RULES are still accurate.** Index 5,523px =
  6.54 screens. Symptom pages 3,529 to 3,834px, median ~3,700. What is stale is
  the composition those numbers were built for. See finding 12.

## 1. AAP IFRAME FOLLOWS published as body copy on 158 pages — ALREADY FIXED

Every aapLead ended with the literal marker, rendering at 18px directly above the
frame. Caused by a parser that stopped a field at the next line ending in a
colon; the marker has none. Removed from all 164 and verified in served HTML
before this review was filed. **No design needed. Listed for the record.**

## 2. JavaScript off gives a blank white screen on every page in the section

The vendored theme ships `<section class="page-load">` at
`public/wp-content/themes/wasatch/style.css:37`, `position:fixed`, 100% by 100%,
`z-index:9999`, `background:#fff`, removed only by
`jQuery(".page-load").fadeOut("slow")`.

With scripting off the DOM is complete, 13,066px on the index and 3,789px on
fever, and 100% of it is covered. `document.elementFromPoint(195, 400)` returns
`SECTION.page-load`.

Violates hard constraint 4 outright. Standing question 7 currently has a failing
answer.

**Do not** edit the theme stylesheet. The overlay can be neutralised from our own
generated head with a noscript-scoped rule, which is our code.

**Second order:** with JS off the search box still renders with placeholder and
hint and does nothing. Rule 4 requires every interactive element to state what it
does without script.

**Severity: blocks the task, totally, for everyone it reaches.**

## 3. No phone number anywhere in the section

`a[href^="tel:"]` count is **0** on all 164 pages and the index. The alert band
says "our nurse line answers on your office's own number". The routing band's
strongest line says "Call your office's main number". Neither gives one.

Measured route to a call from /symptom-checker/fever/:
- scroll 1,852px to .sym-next, then 2,621px to .sym-acts, tap "Find your office"
- /locations/ loads at 6,172px, first tel: at y=1,117, scroll again
- tap a **109 x 17px** phone link

Two taps, two scroll journeys, final target 17px against a 44px minimum.

Open question the designer should resolve: whether a single main number can be
resolved per office at render time. If it cannot, the fix is a tel: on the
reader's chosen office rather than nothing.

**Severity: blocks the task the section says is its own recommended path.**

## 4. Zero pixels of the AAP frame visible before scrolling, at every viewport

At 390x844 on fever: frame top 1,334px, height 460px, bottom 1,794px.
Intersection with the first screen = **0px**. 490px of scroll to its first pixel.

| region | px | share |
|---|---|---|
| above the frame | 1,334 | 35% |
| the frame | 460 | 12% |
| below the frame | 2,016 | 53% |

Of the 1,334px above, ~1,114px is identical on all 164 pages: 58px header offset,
420px hero at fixed min-height with 45-85px of empty blue below its button, 170px
alert band, ~336px of tool-band chrome (50px padme90, a 51-80px heading, an
84-112px lead, the label bar).

768x1024: frame top 1,246px against a 1,024px fold. 1280x800: top 1,273px against
an 800px fold. Zero visible at all three.

**Do not** shrink the alert band to buy space. It is at 7.36:1 and 6.25:1 and is
the one thing that must not be missed. The cheap space is the fixed hero and the
tool-band preamble.

## 5. The index first screen shows no topics; at 1280 it does not show the search

390x844: 57px title band, 156px hero photo, 170px alert band, H2 at y=562, lead at
y=624, search input y=713-765. First topic tile at y=857, **13px below the fold**.
Topic links visible before scroll: **zero**. 711px, 84% of the screen, spent
before the input.

1280x800: `.sym-find` top = 982px against an 800px fold. The reader sees a 512px
photograph and a 911 banner and nothing indicating the page does anything.

## 6. The no-match state produces no visible change

In site.js `apply()`, a zero-hit query sets `count.textContent = ""`, and
`.sc-index .sym-find-count:empty { display: none }` hides it. The only feedback,
`.sym-none`, measures top **857px** against an 844px fold.

Typing `seizure` produces a screen pixel-identical to the empty state except for
the input. Because `.sym-find-count` is the `role="status" aria-live="polite"`
region and it is cleared rather than filled, a screen reader user is told nothing
either.

## 7. Search misses emergency words and compound variants

68 lay queries run. **41 of 49** in the first batch returned the right page first,
so the term data is good. The failures cluster:

| query | hits | note |
|---|---|---|
| seizure / seizures | 0 | the exact word in the alert band 400px above |
| choking / choke | 0 | Swallowed object exists |
| pinkeye | 0 | "pink eye" works |
| ear ache | 0 | "earache" works |
| stomachache | 0 | "stomach ache" works |
| constipated | 0 | "constipation" works |
| diarrhoea | 0 | British spelling |
| vomitting | 0 | commonest misspelling |
| pukes | 0 | "puke" works |
| sleep, wont eat, not eating, cant sleep, shaking | 0 | |

The matcher is `terms.indexOf(" " + word)`, a word-prefix test, so a shorter
fragment works (`constipat` matches) but any longer inflection or a joined or
split compound fails.

`seizure` and `choking` returning nothing, invisibly per finding 6, is the
sharpest case: two of the four words in our own 911 sentence.

**Do not** touch the matching mechanism's term data. Fix the gaps.

## 8. The frame's three escape hatches are ~21px, and Close is the only exit

| control | measured | against |
|---|---|---|
| .sym-embed-grow "Full screen" | 94 x **21**px, 3.08:1 | 44px, 4.5:1 |
| .sym-embed-open "New tab" | 74 x **21**px, 3.08:1 | 44px, 4.5:1 |
| .sym-modal-close "Close" | 58 x **21**px | 44px |

The modal at 390 is `width:100vw; height:100vh`, so `getBoundingClientRect()`
returns 390x844 and there is **no backdrop to tap**. A phone has no Escape key.
The 58x21px Close sits in the extreme top-right of an 844px phone, the least
reachable zone one-handed.

The full-screen view is worth reaching: `.sym-modal-body` is 798px against the
inline 460px, a **73% gain**. But `.sym-embed-topic` is `display:none` below
575px, so inside the dialog the bar reads only "SYMPTOM CHECKER" and no longer
says which symptom.

## 9. When the frame fails, the reader gets a wordless grey rectangle

With non-localhost blocked, which is the offline, blocker-installed, AAP-down and
slow-connection case, `.sym-embed-frame` renders as a 366x460px grey box with
Chromium's broken-document glyph and no text. No fallback message. The only
rescue is the 74x21px "New tab" link above it at 3.08:1, which reads as chrome.

**Do not** add a fallback that replaces the frame on a timer. Hard constraint 3
forbids depending on the frame having loaded, and a cross-origin frame gives no
trustworthy load or error signal. A message that sits behind the frame, revealed
only because the frame's own background covers it when it succeeds, respects the
constraint.

## 10. Under a two-second glance the routing band inverts its own priority

Blurred at 4px, the survivors in `.sym-next` are the two blue underlined inline
links, "same-day appointments" and "After Hours Care", plus the blue H2. "Talk to
a nurse now, at any hour" is bold #2b2c2e with no link, no colour and no number,
so it is the **least** salient of the three routes despite being first and most
urgent.

Same test on the child-page first screen: survivors are the H1, the "ALL
SYMPTOMS" ghost outline, and by a wide margin the green SCHEDULE AN APPOINTMENT
dock. The alert band survives as a colour zone but its words do not; 911 is not
distinguishable at 17px/300.

The first screen's visual hierarchy says "book an appointment", the one route a
parent does not want at 3am.

## 11. Contrast: 164 tile labels and five other classes fail AA

| selector | ratio | size/weight |
|---|---|---|
| .sym-sec-note | **2.78** | 13px/600 |
| .sym-embed-grow / .sym-embed-open | **3.08** | 14px/600 |
| .area-group a | **3.08** | 18px/700, under the 18.66px large threshold |
| .sym-tiles a x164 | **3.39** | 16px/600 |
| .sym-find-clear | **3.39** | 14px/600 |
| .sym-find-hint | **3.41** | 14px/400 |
| .sym-group-count | **3.61** | 12px/600 |

Passing and worth keeping: .sym-alert p 7.36, .sym-alert strong 6.25, .sc-routes
li 8.73, .sym-group-toggle 8.73, .sym-find-input 8.73, .sc-trust 5.92,
.sym-tool-lead 5.39.

**Do not** darken the brand. `#2B93D1` is hard constraint 5. Hover `#1c7cb4` is
~4.3:1, still short. A text-only shade near `#1a6f9f` reaches ~5:1 while fills,
borders and the hero stay brand-exact. White on `#2B93D1` caps at 3.53:1, which
is a theme-wide constraint on 272 pages and out of scope.

## 12. padme90 and the tool-lead negative margin were sized for longer copy

| page | viewport | band height | content | padding share |
|---|---|---|---|---|
| /sty/ (16 words) | 1280 | 326px | 116px | **65%** |
| /sty/ | 390 | 251px | 121px | **52%** |
| /fever/ (37 words) | 1280 | 385px | 175px | **55%** |
| /antibiotics/ | 1280 | 355px | 145px | **59%** |

Four padme90 bands per page at 390 = 400px of pure padding on a 3,529-3,834px
page, ~11%, and ~100px of it sits in the 1,334px above the frame.

Separately `.sym-tool-lead { margin: -18px 0 26px 0 }` is now wrong everywhere.
Gap between the tool-band H2 and its lead measures **-4px** on all 164 pages at
both 390 and 1280. The identical pairing in the intro band 300px above measures
**+15px**. Two rhythms on one page.

**Do not** delete the band padding wholesale. The hairline border-top plus
generous padding is what fixed the recorded fault "no dividers between sections".
Tightening 90 to 56 keeps the seam; removing it reopens a fault UI_RULES says
must not return.

## 13. The CTA dock swallows a tap for ~100ms after every scroll stop

`.ctadock` is fixed with `pointer-events:none` on the wrapper and `auto` on the
button, correct at rest. But `.ctadock-btn` animates `width 0.28s ease` when
`.is-mini` is applied, and during the transition the live hit area is still up to
358px wide. Reproduced with real taps on the index at scroll 400:

| delay after scroll | tapped | landed on |
|---|---|---|
| 80ms | "Head injury" | **/contact-us/** |
| 150ms | "Head injury" | /symptom-checker/head-injury/ |
| 250 / 400 / 700ms | "Head injury" | /symptom-checker/head-injury/ |

Narrow window, but it fires exactly on the fast-scan behaviour this section is
built for.

## 14. Small residuals

- `.sym-others .area-group a` are 366 x **43px**, 1px under the minimum, on 5-11
  links per page.
- The hero breadcrumb "Symptom Checker" is 107 x **15px** at y=95. Mitigated by
  the 366x52px "All symptoms" button 270px below.
- `.sym-find-clear` is 67 x **32px**.
- The hero is a fixed `min-height:420px` with 45-85px of empty blue below the
  button, varying by lead length.

## Already good, do not undo

- **Structural consistency.** All 164 render the identical six-band shape, four
  H2s, one intro paragraph. Only variance is sibling count, 5-11, correctly
  driven by group size, and the 158/6 tool split. Standing question 9 is clean.
- **The search term data is the best thing in the section.** 41 of 49 lay queries
  right first: "throwing up", "hit head", "barking cough", "tummy ache", "pee
  hurts", "snot", "conjunctivitis", "fussy baby". Fix the gaps in 7, leave the
  mechanism.
- **Index tap targets are right.** Tiles 48px tall, accordion toggles 366x50px.
- **The alert band has the strongest contrast on the page**, and orange rather
  than red was correct.
- **The accordion works.** 5,523px collapsed, 6.54 screens; opening the 26-item
  group adds 1,068px. Without it the index is 13,066px, 15.5 screens.
- **Fast and light.** fever 21.5KB, DCL 105ms, load 177ms. Index 72KB, load 183ms.
- **The full-screen dialog is correctly built:** showModal(), Escape closes,
  overflow hidden both axes, backdrop click handled, frame built lazily on first
  open, button ships hidden and is revealed only where dialog works. Its problems
  are size and reach, not construction.
- **Removing the frame from the index was right.**
- **Group ordering by commonness** puts Fever and infection first at y=1,341 and
  Growing up last at y=2,354.
