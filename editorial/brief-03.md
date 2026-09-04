# Revision brief 03 — six symptom pages

Both blind evaluators returned FAIL on round 2. Every quote they gave was checked
against `src/data/symptoms.ts` and all of them are real; there are no artifacts
this round. Their findings converge, which is why this brief is short: the same
six sentences appear on both lists.

Pages: fever, croup, diaper-rash, head-injury, suicide-concerns, constipation.
Field to change: `intro` (and `lead` where named below) in
`artifacts/web/src/data/symptoms.ts`.

## The decision that governs this round

Read rule 17 in EDITORIAL_RULES.md first. It is new and it settles the conflict
that consumed round 2.

**Our prose carries the emergency floor and the judgement. The AAP panel carries
everything else.** In practice, for these six pages:

- Keep every *Call 911 Now* and *Go to ER Now* sign, in prose.
- **Delete** the *within a day*, *office hours* and self-care material. Do not
  rewrite it, do not compress it. Name the tab instead: the *When To Call* tab
  lists the rest, the *Care Advice* tab has the home treatment in full.
- Delete every treatment step: the warm-mist routine on croup, the rinsing and
  cream method on diaper rash, the Miralax dosing on constipation.

This deletes roughly a third of the words on four pages. That is the intent. The
space it frees goes to the judgement paragraph, which is the only part of these
pages a parent cannot get from the panel.

## Blocking faults, both evaluators

**fever**
1. Paragraph 1 sends a limp or unrousable child to "needs to be seen." The AAP
   puts *Can't wake up* and *Not moving or too weak to stand* under Call 911 Now,
   and a parent scanning on a phone acts on paragraph 1. Route it to 911 there.
2. "Three fevers need care right away" asserts a closed set of three, and the
   AAP's list has at least six more entries. A parent whose child is shivering
   nonstop concludes they are not on the list. Do not enumerate a closed set of
   a list you are not reproducing in full. This resolves itself if you follow
   rule 17 and hand the whole tier to the panel.
3. Both evaluators independently could not tell which age rule applies to a
   10-month-old with a three-day fever, after three readings. Under rule 17 this
   material leaves the page. If any of it stays, one rule per age band, and the
   bands must not overlap.
4. "Give that baby no fever medicine before the visit" — nobody speaks this way,
   and the instruction runs against a parent's instinct, so it needs its reason
   in the same breath or it will be second-guessed at 2am.

**croup**
5. The lead is broken: "What decides how urgent it is comes not from the cough
   but from..." A deciding factor does not come from the cough. Rewrite the
   sentence, and give "it" a noun.
6. "you hear it on the way in rather than on the cough" — on the way in where.
   The lead already says "when your child breathes in." Say that.
7. The warm-mist paragraph goes, under rule 17. It also created a real hazard
   both evaluators caught: the page tells a parent to sit in a bathroom for 20
   minutes without ever saying "unless the stridor is severe."
8. "unless the drooling is from teething" hands a midnight airway judgement to a
   parent who cannot make it. Cut the exception.

**diaper-rash**
9. "Call right away too for yellow scabs, for spreading redness..." follows a
   sentence about babies under one month, so "too" inherits the age limit, and
   the next sentence's "At any age" confirms that reading by contrast. A
   six-month-old with yellow scabs then falls through. Under rule 17 most of
   this leaves; whatever stays must state its own age scope.
10. "Most rashes clear in about three days of that." Bare demonstrative, rule 3.
    It appears twice, in consecutive sentences, with the yeast description
    between them.

**head-injury**
11. "Watch closely for the first two hours after the injury, then wake your child
    after two hours of sleep." Two different two-hour clocks joined by "then,"
    which reads as sequence. Both evaluators had to reread it; the reader read
    four hours. This is the sentence the page exists for. Two sentences.
12. "call us during office hours if a headache lasts more than 24 hours" — the
    AAP has this at Contact Doctor Within 24 Hours, and read at 10pm on a Friday
    "office hours" means Monday. The practice has a nurse line at any hour.
13. "Two things about a lump change the answer" — no question was asked.

**suicide-concerns**
14. The first line of the page routes every reader to 988, including the parent
    of a child who attempted within 24 hours, which the AAP puts at Call 911 Now.
    911 must be in the lead alongside 988, with the distinction between them.
15. "so if your child is one" — two candidate antecedents, "our patient" and
    "established patients", in the two clauses before it, and the page has just
    drawn a distinction between them. Name the noun.
16. "Firearms cause most suicide deaths in North America, which is why they come
    first." The page explains its own ordering to a frightened parent. Cut the
    clause; keep the fact if it earns its place, but the ordering is not the
    reader's business.
17. The eligibility rule is the last thing on the page and reads as small print
    on a suicide page. Move it up, and make it a sentence about what happens
    when they call rather than about who qualifies.
18. "Lock away any firearms and make sure they are unloaded, and better still,
    store them with a relative or friend" reverses its own instruction
    mid-sentence. Say the strongest thing first.

**constipation**
19. The first sentence under "Why children hold stools back" is the AAP
    *Definition* tab restated, so the paragraph does not answer its heading until
    three sentences in. Rule 4. Open on the holding-back explanation, which both
    evaluators named as the best writing on any of the six pages.
20. The Miralax sentence: 34 words, "it" sits next to "water", and the page says
    call us first and then gives the full dose anyway. Under rule 17 the dosing
    goes. Keep "call us before you start a stool softener" and stop there.
21. "refusal to use school toilets" narrows the AAP's "public toilets" and
    excludes daycare, travel and relatives' houses.
22. "Vomiting is the one thing here that can mean an emergency" is not true of
    the sentence that follows it: green vomit is the emergency. "Here" signposts
    the paragraph. Cut the setup, keep the fact.

## The structural fault behind several of these

Evaluator B named it: the undifferentiated call-us pile-up. Five or six
consecutive sentences each opening with a routing instruction, in one paragraph,
with the urgency tier carried by an adverb phrase buried mid-sentence. It is on
fever, diaper-rash and constipation. A parent stops absorbing by the fourth.

Rule 17 removes most of it by removing the lower tiers. What remains — the 911
and ER items — must be grouped by urgency, not interleaved, and must not open
five sentences in a row with the same stem.

## Do not lose these

Both evaluators singled these out as the writing that works. Carry them through
unharmed:

- head-injury: the scalp blood-supply explanation. "The only place on any of
  these pages where I understood why and stopped being frightened."
- suicide-concerns: "asking the question does not put the idea in your child's
  head."
- constipation: the holding-back explanation.
- diaper-rash: the hard border distinguishing the two rashes.
- fever: the three questions that open the page.

## Gaps the new coverage check found

`tools/check-triage.mjs` now fails a page that omits a 911 or ER sign entirely,
not only one that under-routes it. Eight real omissions on these six pages:

- fever: soft spot bulging or swollen, under one year (ER).
- head-injury: major bleeding that cannot be stopped (911); suspected mild
  concussion, awake but not alert or slow to respond (ER); blurred or double
  vision over five minutes (ER); injury at high speed such as a car crash (ER);
  a large deep cut needing many stitches (ER).
- suicide-concerns: drug or alcohol use suspected with symptoms now (ER); psych
  hospital needed in the past for similar symptoms (ER).

Add each of these. They are additions, not rewrites, and they are the reason the
deletion work above is safe to do.

## Corrections to earlier briefs

The round-2 rewriter was right twice against my brief and I record it so the
error is not reintroduced: "more than a week" for constipation **is** in the
source's *Call Your Doctor If* list, and green vomit is **Go to ER Now**, not
911. If a brief and the source disagree, the source wins, and say so.
