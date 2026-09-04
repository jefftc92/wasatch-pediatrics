# Editorial rules

Rules earn their place here by being broken. Every entry below records a fault
that occurred in this repository more than once, or once with enough cost to be
worth preventing. The rewriter reads this file before starting. Reviewers cite
rule numbers so that repeat offences are visible.

Add a rule when the same fault appears in two rounds or on two pages. Do not add
a rule for a one-off; fix the sentence instead.

---

## 1. A sentence needs a subject, not an introductory phrase

An introductory prepositional phrase cannot stand in for the grammatical
subject. Every sentence needs an actor.

    BAD   During a roof inspection in Alpine is useful because we can find
          small problems before they become leaks.
    GOOD  A roof inspection finds small problems before they become leaks.

## 2. Do not make an abstract process perform a human action

Processes do not add, decide, recommend or arrange. People and organizations do.
When the actor changes mid-sentence, name the new one.

    BAD   The inspection examines what we can reach then adds photographs.
    GOOD  We examine what we can safely reach, then photograph it.

## 3. Name the noun; never leave the reader holding a pronoun

Every pronoun needs an unmistakable antecedent in the same sentence or the one
immediately before it. This applies to "one", "them", "those", "it" and to bare
measures.

    BAD   Wait twenty minutes, then start again with teaspoons.
                                                    Teaspoons of what?
    BAD   Strep rarely brings one.
    GOOD  Strep rarely causes a cough.

A measure or container with no substance named in the same sentence is a
critical fault, not a stylistic one. Automated check: `tools/check-copy.mjs`.

## 4. The first sentence answers the heading

On an informational page, the sentence after a heading answers that heading. It
does not approach it, set it up, or answer a different question that arrives
later.

    HEADING  What to do about a sore throat
    BAD      Check whether your child has a cough.
                 A different symptom, with no bridge back.

Corollary: do not open an informational answer with "Schedule...", "Have..." or
"Consider..." unless the heading itself asks for advice.

## 5. Do not duplicate a source the page already shows

Where a page frames or links a source that carries the same material, the page
must add something the source cannot. On symptom pages the AAP panel carries
Definition, When To Call and Care Advice; our copy therefore carries the
judgement behind a decision and what this practice does, not the treatment
steps. Measured overlap above roughly 20% of two-word phrases with the framed
source is a finding.

## 6. Restructure an or-chain; do not repunctuate it

When a sentence carries several alternatives or conditions, rebuild the thought.
Correct punctuation does not rescue a chain the reader has to hold in their
head.

    BAD   Consider an inspection when buying or selling a home or when the
          roof is aging or you do not know when it was installed.

Practical limit: about three items, or two conditions, per sentence.

## 7. Location earns its place or it goes

Do not insert a locality phrase to reinforce geographic relevance. Use a
location only where it changes the meaning: which office is closest, how long
the drive is, what the local air or altitude does. Where a human writer would
say "your child", "your office" or "the visit", write that.

    BAD   For families in Murray, a well-child visit is important.
    GOOD  Murray families are about four minutes from our Cottonwood office.

## 8. Do not write to a length

Filler that exists to lengthen a page is a fault even when every sentence in it
is true. If deleting a phrase costs the reader nothing, delete it. A closing
sentence that restates the paragraph is filler.

## 9. No em dashes, no semicolons

Both were used here to hold an aside inside a sentence that was already carrying
a list. Use a second sentence. This is a house rule rather than a grammatical
one, and it is absolute because the failure mode recurred 185 times.

## 10. Imperatives keep the verb first

An instruction addressed to the reader has an implied subject and is the most
direct construction available. "Call us if the rash spreads" is correct.
Rewriting it to "You should call us" is a regression, not an improvement.

Rule 10 constrains rule 1: rule 1 is about sentences whose subject is buried,
not about imperatives.

## 11. American spelling

The practice is in Utah. behavior, color, gray, labored, fiber, traveled, two
weeks rather than fortnight, and so on. This recurred after four separate
rewrites and is now checked automatically.

## 12. Improving one thing must not break another

Treat editorial work like regression testing. Simplifying must not drop a
qualification, an age threshold or a safety exception. Improving directness must
not produce a cumbersome sentence. Cutting repetition must not remove needed
context. Shortening must not open a logical gap.

Recorded regressions, all introduced while fixing something else:

  - splitting a long sentence removed the noun "fluid", leaving "teaspoons"
  - rewriting for active voice introduced "Behaviour", "grey", "fortnight"
  - restructuring for subject-first introduced three semicolons
  - condensing a red-flag list dropped "in a baby under three months"

## 13. Sentence length

No sentence over about 34 words. Median around 15 to 19. A red-flag list that
has grown past three items becomes two sentences, because a parent scans those
rather than reading them.

## 14. Facts are not editorial territory

Improving prose does not authorize inventing information. Anything asserted
about what this practice does, stocks, can do in an office, or how fast it can
see a child must be traceable to the repository's existing content or the
practice's published pages. A plausible clinical detail is not therefore true.

A number that changes during a rewrite is a critical fault even when the new
number is also plausible.

## 15. Never be less urgent than the source

Where our page and a source we frame disagree about urgency, the source wins.
We may be more cautious than it. We may never be less.

This rule exists because a factual review found six pages that had quietly
moved triage levels down while the prose was being improved. The head-injury
page listed four signs the AAP puts under Call 911 Now or Go to ER Now and told
the parent to call the office. The croup page sent an infant with stridor to a
phone call where the AAP sends them to an emergency room, and turned the AAP's
"drooling, spitting or great trouble swallowing" into "drools and cannot
swallow", so a drooling child who can still swallow no longer triggered 911.

Check every threshold, age, duration and route against the source rather than
against your sense of what is clinically reasonable.

## 16. A capability claim needs a published source

"We would far rather give it" asserted that this practice stocks and gives
steroids in an office. "We will get your child in" promised access on the
behavioral health page. Neither appears anywhere on the site. Both were written
because they sounded like things a pediatric practice would do.

Anything asserted about what the practice does, stocks, can do in an office, or
how quickly it can see a child must be traceable to a published page.

---

## Automated gates

`tools/check-copy.mjs` fails on any of: em dash, semicolon, British spelling,
sentence over 34 words, bare-pronoun subject, measure with no substance named,
duplicate heading or lead, or a "What to do about" heading on a page whose
source already answers it. Run it before committing copy changes.

## 17. The division of labour with the AAP panel

Both round-2 evaluators, working blind, reported the same fault on four of six
pages: our prose was re-saying the panel sitting directly below it. The fever
page transcribed the AAP *When To Call* tab in its own order with near-identical
wording; croup, diaper rash and constipation reproduced *Care Advice* almost
point for point. The client had said this in their own words before this system
existed: the content "might contain information that is already on the iframe."

This conflicted with rule 15, never be less urgent than the source, which had
been read as an instruction to state every AAP tier in prose. Following both at
once is impossible, and the oscillation between them is what round 2 spent
itself on. The division is therefore fixed:

**The prose carries the emergency floor and the judgement. The panel carries
everything else.**

- **Call 911 Now and Go to ER Now items belong in our prose, in full.** A parent
  must never have to find a tab, open it and scroll to learn that a sign means
  911. This is the half of rule 15 that survives.
- **Lower tiers belong to the panel.** Do not transcribe *Contact Doctor Within
  24 Hours*, *Contact Doctor During Office Hours* or *Self Care at Home*. Name
  the tab and let the parent open it.
- **Home treatment steps never appear in our prose.** No warm-mist routine, no
  rinsing method, no dosing. *Care Advice* holds all of it.
- **What only we can say, we must say:** how to judge this child rather than the
  number, why the body does this, what happens when you call us, and who is
  eligible for what.

`tools/check-triage.mjs` enforces both halves. It fails a page that routes a
sign below its AAP tier, and, since round 3, a page that omits a 911 or ER sign
altogether. The second half exists because deleting is what this rule asks for,
and deletion was previously invisible to the gate.
