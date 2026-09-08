# Editorial system — state

## The loop

    packet  ->  seven independent reviews  ->  consolidated brief
            ->  rewriter  ->  revision file
            ->  apply-revision.mjs  ->  copy gate + triage gate
            ->  two blind evaluators, fresh each round
            ->  both PASS ? done : unresolved findings back to the rewriter

A revision passes only when both evaluators, independently and without access to
the brief or to each other, conclude it meets the standard.

## Batch 1 — six symptom pages

fever, croup, diaper-rash, head-injury, suicide-concerns, constipation.

| round | gates | evaluator A (editor) | evaluator B (reader) |
|-------|-------|----------------------|----------------------|
| 1 | fail | FAIL, invented facts | FAIL |
| 2 | pass | FAIL, 14 critical | FAIL, 9 high |
| 3 | running | | |

Round 2's decisive finding, raised independently by both evaluators and by
neither brief: four of six pages were re-saying the AAP panel below them. That
is rule 17, and it settles the standing conflict with rule 15.

## Gates

`tools/check-copy.mjs` — 164 pages. Em dashes, semicolons, British spelling,
sentences over 34 words, bare pronouns and demonstratives, a measure with no
substance named, duplicate headings and leads. Green.

`tools/check-triage.mjs` — 158 pages with a cached AAP source. Two checks:
1. Under-routing: a sign our page sends below its AAP tier. **87 places.**
2. Omission (added round 3): a 911 or ER sign our prose never mentions at all.
   **379 signs.** Added because rule 17 asks for deletion, and deletion was
   invisible to check 1.

Both numbers are for the whole site. The six batch-1 pages are clear of check 1
and have eight known gaps under check 2, which round 3 fixes.

## Queue

1. **Batch 1 round 3** — in progress.
2. **Batch 2, the 87 under-routing places** across roughly 27 pages:
   fever-under-1, sore-throat, vomiting, newborn-jaundice, spider-bite,
   scorpion-sting, tooth-injury, hoarseness, arm-injury, leg-injury, neck-pain,
   burn, dizziness, fainting, weakness-and-fatigue, stomach-pain, reflux,
   vomiting-baby, colds-baby, cough-baby, urinary-tract-infection,
   penis-and-scrotum-symptoms, foreskin-care, newborn-illness,
   swallowed-object, vaginal-bleeding.
3. **The 379 omissions**, which will overlap batch 2 heavily.
4. **Well-child pages** — packet-02-wellchild.md is built (murray, bountiful,
   kamas) and no reviews have run against it. Parent page plus 24 more cities.
5. **The other 158 symptom pages** through the loop.
6. **Cross-page review.** Watch list: three of six headings run "X, not Y";
   "at whatever hour" appears four times; every page's second paragraph opens
   with "Call us".

## Recorded process faults

- A packet that under-describes the page produces confident false findings. The
  round-1 evaluators' loudest complaints were artifacts of a packet that omitted
  the shared routing band. Packets now carry the whole rendered page, and a
  finding's premise is checked against the source file before it reaches a brief.
- The brief is not authoritative over the AAP source. The round-2 rewriter
  corrected the brief twice, correctly, with citations.
- A gate that only inspects what is present cannot see what was removed.
