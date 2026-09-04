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
| 1 | Symptom sample | fever, croup, diaper-rash, head-injury, suicide-concerns, constipation | round 2 rewrite | 2 |
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

## Packet construction: a mistake to not repeat

Round 1's evaluation packet carried only the heading, lead and two intro
paragraphs. It did not carry the rest of the page. Evaluator B's most emphatic
finding was that four of six pages say "call us" and never say how to reach
anyone, which is true of the intro copy and false of the page: every symptom
page ends with a "Getting your child seen" band carrying the 24/7 nurse line,
the same-day route, After Hours Care, and a Find your office link.

The finding was correct about what it was shown. The packet was wrong.

Two consequences. Evaluation packets must carry the whole rendered page, not
the fields being edited. And the correct round 2 action is the opposite of what
the finding suggests: the fever page's paragraph 2 repeats the nurse-line
explanation verbatim from the band below it, so that sentence comes out rather
than being added to the other five.

Check a finding's premise before acting on it. An evaluator can only judge what
it was handed.

## Round 1 outcome

Both blind evaluators returned FAIL.

Evaluator A found 13 critical and 15 editorial faults. The critical ones were
mostly things round 1 introduced while fixing the urgency levels: a fall
threshold ("higher than your child is tall"), an overnight watch where the
source says two hours, a one-week duration for constipation, and 104F levelled
down from seek-care-now to same day. It also caught that "hard to wake up", a
911 item, had been dropped from head-injury while the paragraph still opened by
telling a parent to watch how their child wakes.

Evaluator B found that head-injury never answers whether a child can sleep,
that croup never says what to do in the next ten minutes, and that fever's
second paragraph is eight instructions at three urgency levels in one block
that it read twice without being able to say afterwards which were which.

Three of their findings were artifacts of the packet and are recorded in
brief-02 as not to be acted on. Checking those premises surfaced a real one:
the site says behavioral health services are for established patients only, and
the suicide page does not say so.

The pattern worth naming: round 1 traded invented facts for different invented
facts. That is now explicit in the round 2 brief.
