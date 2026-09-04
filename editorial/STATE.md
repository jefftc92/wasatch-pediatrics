# Editorial workflow state

Resumable record of where each batch is. Update as batches move.

Status values: not started | in review | in rewrite | in evaluation | passed

## Batches

| # | Batch | Pages | Status | Rounds | Notes |
|---|-------|-------|--------|--------|-------|
| 1 | Symptom pages, sample | fever, croup, diaper-rash, head-injury, suicide-concerns, constipation | in rewrite | 1 | Chosen to span an emergency page, a reassurance page, a judgement page, a routine-care page and a mental-health page |
| 2 | Well-child, sample | murray, bountiful, kamas | packet built | 0 | Chosen to span an office-in-town city, a nearby city and a distant one |
| 3 | Symptom pages, remainder | 158 | not started | 0 | Batch after the first two establish the recurring rules |
| 4 | Well-child, remainder | well-child parent page + 24 cities | not started | 0 | |

## Cross-page review

Runs after individual pages pass. Not started.

## How to resume

1. `node artifacts/web/tools/check-copy.mjs` must be green before and after any
   copy change.
2. Packets live in `editorial/packet-NN-*.md`. Each carries the page purpose,
   the reader, the search intent and the facts that must survive.
3. Reviewer roles are in `.claude/agents/editorial-*.md`. Send each the packet
   and nothing else. Their first pass must be independent.
4. Findings are consolidated into `editorial/brief-NN.md`, which is what the
   rewriter receives alongside the original and the purpose.
5. Blind evaluators receive the revised text, the purpose, the constraints and
   the rubric. They do not receive the brief, the rewriter's reasoning, or any
   earlier round.
6. Both must return PASS. If either fails, only the unresolved findings go back
   to the rewriter, and two fresh evaluations follow.
7. A fault seen twice becomes a rule in EDITORIAL_RULES.md rather than another
   patch.
