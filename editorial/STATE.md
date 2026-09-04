# Editorial workflow state

Resumable record. Update as batches move. Nothing is finished until both blind
evaluators return PASS and both gates are green.

## Gates

Run before and after every applied revision. Both must be green to accept.

    node artifacts/web/tools/check-copy.mjs      mechanical rules
    node artifacts/web/tools/check-triage.mjs    urgency against the source

Current: check-copy green at 164. check-triage reports 56 places on 29 pages.

## The loop

    packet  ->  seven independent reviews  ->  consolidated brief
            ->  rewriter  ->  revision file
            ->  apply-revision.mjs  ->  both gates
            ->  two blind evaluators
            ->  both PASS ? done : unresolved findings back to the rewriter

An evaluator never sees the brief, the rewriter's reasoning or an earlier
round. A fault seen twice becomes a rule in EDITORIAL_RULES.md rather than
another patch.

## Batches

| # | Batch | Pages | Status | Rounds |
|---|-------|-------|--------|--------|
| 1 | Symptom sample | fever, croup, diaper-rash, head-injury, suicide-concerns, constipation | in rewrite | 1 |
| 2 | Well-child sample | murray, bountiful, kamas | packet built | 0 |
| 3 | Triage repairs | the 29 pages check-triage reports | not started | 0 |
| 4 | Symptom remainder | the rest of the 164 | not started | 0 |
| 5 | Well-child remainder | parent page + 24 cities | not started | 0 |

## Batch 3: pages the triage gate reports

fever, fever-under-1, sore-throat, vomiting, head-injury, newborn-jaundice,
spider-bite, scorpion-sting, tooth-injury, hoarseness, arm-injury, leg-injury,
neck-pain, burn, dizziness, fainting, weakness-and-fatigue, stomach-pain,
reflux, vomiting-baby, colds-baby, cough-baby, urinary-tract-infection,
penis-and-scrotum-symptoms, foreskin-care, newborn-illness, swallowed-object,
suicide-concerns, vaginal-bleeding

Every hit needs confirming before it is acted on. The gate matches on content
words, so a page that discusses a sign without triaging it appears here too.
The factual reviewer confirms; the gate only finds.

## Cross-page review

Runs after the individual batches pass. Not started. Watch list already
recorded from round 1: three of six headings run "X, not Y"; "at whatever
hour" appears four times across three pages; every page's second paragraph
opens with "Call us".

## Known open items outside the editorial loop

- The nine agent definitions in .claude/agents/ register as named agent types
  only after a session restart. Rounds run before that use isolated agents
  carrying the same definitions, which preserves independence.
- The AAP source cache in /tmp/aap is not persistent. Refetch with
  tools/fetch-aap.sh equivalent before a session that needs it.
