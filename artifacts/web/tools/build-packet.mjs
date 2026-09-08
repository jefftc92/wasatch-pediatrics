/*
 * Builds an evaluation packet from the live content.
 *
 * The round 1 packet was assembled by hand and left out the routing band that
 * appears on every symptom page. Both evaluators then reported, confidently
 * and wrongly, that the pages never say how to reach the practice. A packet
 * that under-describes the page produces false findings, so the packet is
 * generated from src/data/symptoms.ts rather than transcribed.
 *
 *   node tools/build-packet.mjs fever croup ... > ../../editorial/eval-03.md
 */
import { readFileSync } from "node:fs";

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("usage: node tools/build-packet.mjs <slug> [slug...]");
  process.exit(2);
}

const src = readFileSync(new URL("../src/data/symptoms.ts", import.meta.url), "utf8");

function entry(slug) {
  const start = src.indexOf(`    slug: "${slug}",`);
  if (start < 0) throw new Error(`no entry for ${slug}`);
  const block = "\n" + src.slice(start, src.indexOf("\n  },\n", start));
  const field = (n) =>
    ((block.match(new RegExp(`\\n    ${n}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`)) || [])[1] || "")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  const introBlock = (block.match(/\n    intro: \[([\s\S]*?)\n    \],/) || [])[1] || "";
  const intro = [...introBlock.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) =>
    m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
  );
  return {
    slug,
    title: field("title"),
    heading: field("heading"),
    description: field("description"),
    lead: field("lead"),
    intro,
  };
}

const HEADER = `# Symptom pages for evaluation

## What each page is for

Each page sits above a live panel from the American Academy of Pediatrics
carrying three tabs on the same topic: Definition, When To Call, and Care
Advice. The AAP writes and updates that panel.

The division of labour is fixed by rule 17 and it is the point of this round.
Our prose carries the Call 911 Now and Go to ER Now signs in full, plus the
judgement behind a decision and what this practice does. Every lower AAP tier
and all home treatment belong to the panel, and our prose names the tab rather
than repeating it. A page that sends the reader to a named tab for lower-tier
guidance is following the rule, not omitting something.

## Who reads it

A parent with a sick or worried child. On a phone. Often at night. No medical
training, no patience, looking for one specific answer.

## Factual constraints

- Ages, temperatures, durations and thresholds must match the AAP source,
  cached at /tmp/aap/<slug>.html.
- Where our page and the AAP disagree about urgency, the AAP wins. We may be
  more cautious than the source. Never less.
- These claims are published on the site and are supported. Do not flag them:
  a 24/7 line reached on each office's own main number, on which "you will
  reach a nurse or a physician, not an answering service"; same-day sick
  visits at every office; After Hours Care at most offices, by appointment,
  no walk-ins; "behavioral health services are available at our Wasatch
  Pediatric offices", and those services "are for established patients only".
- Anything else asserted about what the practice does must be traceable to a
  published page.

## The whole page, not just the part under review

Below the two paragraphs shown for each page sits the AAP panel, and below
that a band that appears on every symptom page, reproduced once here:

    Getting your child seen
    Talk to a nurse now, at any hour. Call your office's main number, nights,
    weekends and holidays included. You will reach a nurse or a physician, not
    an answering service.
    Be seen today. Every office keeps same-day appointments for illness and
    injury.
    This evening or at the weekend. Most offices run After Hours Care. It is by
    appointment rather than walk-in, and the hours differ by office.
    If you are worried, call. We would rather answer a question that turns out
    to be nothing than have you sit up all night deciding whether it was.
    [Same-day sick visits]  [Find your office]

So the intro copy does not need to explain how to reach us. A page that omits
a phone number is not thereby faulty.

## The rubric

/home/user/wasatch-pediatrics/EDITORIAL_RULES.md

## The text under review
`;

let out = HEADER;
for (const slug of slugs) {
  const e = entry(slug);
  out += `\n### ${e.slug}\n\n`;
  out += `H1: ${e.title}\n`;
  out += `Meta description: ${e.description}\n`;
  out += `Heading: ${e.heading}\n\n`;
  out += `Lead: ${e.lead}\n`;
  e.intro.forEach((p, i) => {
    out += `\nParagraph ${i + 1}: ${p}\n`;
  });
}
process.stdout.write(out);
