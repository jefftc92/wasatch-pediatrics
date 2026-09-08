# UI rules for the symptom section

Read by `ui-reviewer`, `ui-designer` and `ui-auditor`. The editorial system took
eight rounds partly because its rules were written after each failure and had no
owner. This file starts with the constraints already known, so the same debt is
not repeated here.

## The workflow

    review    ->  ranked, measured recommendations   (ui-reviewer)
    design    ->  markup, CSS, behavior, states      (ui-designer)
    audit     ->  constraints, reuse, collisions     (ui-auditor)
    implement ->  the designs that passed the audit  (ui-auditor)

Only the auditor writes to the site, and only after auditing. The stages are
separate because the editorial system's worst failures came from the same agent
proposing and applying in one step.

## Hard constraints

1. **The vendored WordPress theme is served byte for byte and is never edited.**
   Our own work lives in `public/assets/site.css` and `public/assets/site.js`.
   A design that needs a theme change is not a design, it is a request.
2. **No dependencies.** No bundler, no framework, no CDN. Node 24 with native
   type stripping, Express 5, plain CSS and plain JS.
3. **The AAP iframe is another origin.** Its internals cannot be styled, read or
   depended on. Nothing may require it to have loaded.
4. **Progressive enhancement.** Content ships expanded and functional. Script
   enhances. Every interactive element states what it does with JavaScript off.
   The full-screen frame button ships `hidden` and JS reveals it, and that is the
   pattern to follow.
5. **Brand.** Blue `#2B93D1`, orange `#F58220`, green `#8DC63F`, grey `#636466`.
   Montserrat, with LemonYellowSun on `.lys`.
6. **Namespacing.** New classes are `.sym-*` for a symptom page or `.sc-*` for
   the index. Never a bare element or utility selector that could reach the
   theme.

## The reader

A parent with a sick or worried child. On a phone. Often at night. One hand
free. No medical training, no patience, scanning for one answer. Design for that
person; the comfortable desktop case follows from it and not the reverse.

## Measurement, not opinion

Chromium is at `/opt/pw-browsers/chromium`, Playwright is configured, and
`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` is set. Never run `playwright install`.

Start the site with `node --experimental-strip-types src/index.ts` from
`artifacts/web` and drive `localhost:5000`. Block non-localhost requests so the
AAP frame cannot distort a measurement.

Baseline viewport 390x844. Every claim carries a number.

## What measurement has already established

Kept so nobody re-derives it, and so nobody undoes it by accident.

- The index was 17 screens on mobile and is now about 6.5. It is grouped into 13
  groups, commonest first, with search and accordions.
- A symptom page was 10,431px and is now about 3,781px.
- The AAP frame sits at 560px, 460px on small screens. Getting this wrong was a
  visible fault: the frame previously sat in an oversized box that dominated the
  page without being usable.
- The frame does not belong on the index. It was removed from there because it
  added nothing at that level.
- `.sym-acts` exists because a shared pill class from the office card leaked
  padding and made "Same-day sick visits" and "Find your office" bleed out of
  their pills.
- Both the search and the full-screen dialog set `overflow: hidden` on both axes.
- Every symptom page carries a shared "Getting your child seen" band below the
  frame with the 24/7 nurse line, same-day visits and After Hours Care. A page
  is not faulty for omitting a phone number; that band carries it.

## Faults already found and fixed, which must not return

- The index menu extended further down than on other pages.
- No dividers between sections, so the whole index merged into one block.
- Pill text bleeding onto the page.
- A 60px gap under the hero, which still exists on `/careers/` and
  `/new-patients/` and is out of scope here but should not be copied.

## Standing questions

Each is a real failure from this project, written as a question.

1. What is on the first screen at 390x844, before any scroll?
2. How many taps and how many seconds to reach a named symptom from the index?
3. How much of the AAP frame is visible before the reader scrolls?
4. Which elements survive a two-second glance?
5. How many taps from a child page to a phone call?
6. What does the page look like before the frame loads, and if it never does?
7. What does it do with JavaScript off?
8. Is any tap target under 44px?
9. Does a shape the other pages share get broken by this one?
10. Did fixing this break something the last change fixed?
