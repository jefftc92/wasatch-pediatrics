# The checklist

EDITORIAL_RULES.md records why each rule exists. This file says who enforces it
and when. Every rule from 17 onward was written after a blind evaluator found the
fault in shipped copy, one per round, because nothing in the pipeline checked for
it beforehand. That is what this file fixes.

Three columns of ownership. A rule belongs in exactly one.

## A. Mechanical, enforced by a gate before anything else runs

Run `node tools/check-copy.mjs && node tools/check-triage.mjs`. These fail the
build. No agent should spend attention on them.

| Rule | Check |
|------|-------|
| 3 | bare pronoun or demonstrative as subject; a measure with no substance named |
| 4 | heading of the banned "What to do" shape |
| 8 | duplicate heading, lead or title across pages |
| 9 | em dashes, semicolons |
| 11 | British spelling |
| 13 | sentence over 34 words |
| 15 | any sign routed below its AAP tier, down to the call-now tier |
| 17 | a 911 or ER sign the prose never mentions |
| 18 | a value named as mattering and handed to a tab; a meta description promising a threshold the prose never gives |

## B. Agent-owned, run on the draft BEFORE it is applied

These are the rules that cost six rounds. Each now has an owner that reads the
rewriter's output before it reaches the file.

| Rule | Owner | What it looks for |
|------|-------|-------------------|
| 15, 19, 19a, 21 | `editorial-triage` | routing fidelity against the source; splits the reader cannot make; collisions created by collapsing upward; a missing age rule; items taken from a tier while its siblings are dropped |
| 20, 4, 6 | `editorial-structure` | 911 items split across a paragraph break; the same list of signs printed twice; items counted out loud; a paragraph whose first sentence does not answer its heading |
| 5, 17, 18 | `editorial-panel` | prose that re-says a tab; a threshold withheld; an action the reader needs and cannot get; a description promising what the prose dropped |
| 14, 16 | `editorial-factual` | invented facts, altered meaning, dropped qualifications, unsourced capability claims |

## C. Judgment, run on the draft as independent specialists

The original seven. They last ran in round 1 and should run on every batch.

`editorial-sentence-logic`, `editorial-natural-language`, `editorial-directness`,
`editorial-concision`, `editorial-comprehension`, `editorial-seo`,
`editorial-factual`.

Rules 1, 2, 6, 7, 10, 12 live here.

## The order

    packet
      -> seven specialists (C) in parallel, on the CURRENT text
      -> consolidated brief
      -> rewriter
      -> four checkers (B) in parallel, on the DRAFT, before it is applied
      -> rewriter fixes what they found, still before applying
      -> apply, then gates (A)
      -> two blind evaluators
      -> both PASS or the unresolved findings go back

The change from rounds 2 to 7 is the two lines in the middle. Previously the
draft went straight from the rewriter into the file and then to the evaluators,
so a triage collision or a split emergency list could only be found by a reader
after it shipped.

## The standing questions any checker must answer

Written as questions because every one of them was a real failure.

1. Take each specific child the routing is meant to separate. Read the whole page
   as that child. Do they match two routes? None?
2. Does the page carry any item from a tier while dropping that tier's age rule?
3. Do the other pages in the batch share a shape this page breaks?
4. Is every 911 item in one uninterrupted run?
5. Does any list of signs appear twice?
6. Does the page name a number as mattering and then not give it?
7. Does the meta description promise anything the prose does not answer?
8. Is there one concrete action for a reader who has to do something tonight?
9. Did fixing the last round's finding create this round's?
