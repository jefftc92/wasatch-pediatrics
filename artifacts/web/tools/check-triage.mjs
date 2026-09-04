/*
 * Triage gate.
 *
 * A factual review of six pages found that several had quietly moved urgency
 * levels below the AAP page they sit above: signs the AAP routes to 911 were
 * being sent to a phone call. That review was done by hand on a sample. This
 * does it on all 164.
 *
 * It reads the AAP topic pages saved under /tmp/aap, extracts their triage
 * tiers, and for every item in the two most urgent tiers checks whether our
 * page mentions the same sign. Where it does, it compares the urgency our
 * sentence assigns against the AAP's, and reports anything less urgent.
 *
 * Matching is by distinctive content words rather than exact phrasing, because
 * our copy says "hard to rouse" where the AAP says "hard to wake up". That
 * makes this a finder, not a judge: every hit needs a human or a reviewer
 * agent to confirm. It is tuned to over-report rather than miss.
 *
 *   node tools/check-triage.mjs            all pages
 *   node tools/check-triage.mjs croup      one page
 */
import { readFileSync, existsSync } from "node:fs";

const AAP_DIR = "/tmp/aap";
const only = process.argv[2];

/* --- our copy ---------------------------------------------------------- */

const src = readFileSync(new URL("../src/data/symptoms.ts", import.meta.url), "utf8");
const pages = src
  .split("\n  {\n")
  .slice(1)
  .map((raw) => "\n" + raw)
  .map((block) => {
    const field = (n) =>
      (block.match(new RegExp(`\\n    ${n}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`)) || [])[1] || "";
    const introBlock = (block.match(/\n    intro: \[([\s\S]*?)\n    \],/) || [])[1] || "";
    return {
      slug: field("slug"),
      aap: field("aap"),
      text: [field("lead"), ...[...introBlock.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1])],
    };
  })
  .filter((p) => p.slug && (!only || p.slug === only));

/* --- the AAP tiers ------------------------------------------------------ */

const TIERS = [
  ["Call 911 Now", 4],
  ["Go to ER Now", 3],
  ["Call Doctor or Seek Care Now", 2],
  ["Contact Doctor Within 24 Hours", 1],
  ["Contact Doctor During Office Hours", 0],
  ["Self Care at Home", 0],
];

function aapTiers(slug) {
  const file = `${AAP_DIR}/${slug}.html`;
  if (!existsSync(file)) return null;
  let t = readFileSync(file, "utf8");
  t = t.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  t = t.replace(/<[^>]+>/g, "|").replace(/&nbsp;/g, " ");
  t = t.replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"');
  t = t.replace(/\s+/g, " ");

  const found = TIERS.map(([label, rank]) => ({ label, rank, at: t.indexOf(label) }))
    .filter((x) => x.at >= 0)
    .sort((a, b) => a.at - b.at);
  if (!found.length) return null;

  return found.map((tier, i) => {
    const end = i + 1 < found.length ? found[i + 1].at : tier.at + 1200;
    const body = t.slice(tier.at + tier.label.length, end);
    const items = body
      .split("|")
      .map((s) => s.trim())
      .filter((s) => s.length > 12 && /[a-z]/.test(s) && !/^Select New/.test(s));
    return { ...tier, items };
  });
}

/* --- what urgency does one of our sentences assign? --------------------- */

const OUR_URGENCY = [
  [/\b911\b/, 4], // any mention: "needs 911 too" is as much a 911 route as "call 911"
  [/emergency room|\bER\b|go to an emergency/i, 3],
  [/straight away|right away|same day|today|at any hour|any time, day or night|\bnow\b|immediately/i, 2],
  [/\bcall us\b|\bcall your\b|\bcall the\b|\btell us\b|\bcome in\b|\bbring your child\b/i, 1],
  [/book an appointment|book a|schedule/i, 0],
];

function urgencyOf(sentence) {
  for (const [re, rank] of OUR_URGENCY) if (re.test(sentence)) return rank;
  return -1;
}

/* --- does our sentence talk about the same sign? ------------------------ */

const STOP = new Set(
  ("the a an and or of to in for on with is are was were be been it its they them this that these those your you our we us if not no do does did can will would should have has had at as by from about into over under more most than then when what which who whom how child children age less year years old month months present caution note reason such example other your " +
   // Too generic to identify a sign. "Hard to wake up" matching a sentence
   // about a hard object is noise; "wake" alone still carries it.
   "hard large small big long high low new times normally sudden severe great").split(" ")
);

function keywords(item) {
  return [...new Set((item.toLowerCase().match(/[a-z']{4,}/g) || []).filter((w) => !STOP.has(w)))];
}

/* Synonym bridges, because our copy and the AAP say the same thing in
 * different words. Each maps an AAP word to words our copy uses for it. */
const SYNONYM = {
  unconscious: ["consciousness", "knocked", "passed", "blacked"],
  wake: ["rouse", "rousing", "waking", "woken"],
  confused: ["confusion", "confused"],
  slurred: ["slurred", "speech"],
  steady: ["unsteady", "unsteadiness", "steady", "balance"],
  weakness: ["weak", "weakness", "floppy"],
  vomited: ["vomit", "vomiting", "vomits", "sick"],
  drooling: ["drool", "drooling", "drools"],
  swallowing: ["swallow", "swallowing"],
  breathing: ["breathe", "breathing", "breaths"],
  stridor: ["stridor", "rasping", "harsh"],
  seizure: ["seizure", "fit", "convulsion"],
  bluish: ["blue", "bluish", "gray", "grey"],
  suicide: ["suicide", "suicidal", "killing", "ending"],
  attempted: ["attempt", "attempted"],
  threats: ["threat", "threats", "talked", "talking"],
  bleeding: ["bleed", "bleeding", "blood"],
  swelling: ["swell", "swelling", "swollen"],
  dehydration: ["dehydrated", "dehydration"],
  fever: ["fever", "temperature"],
};

function mentions(text, item) {
  const kw = keywords(item);
  if (!kw.length) return null;
  const lower = text.toLowerCase();
  const hits = kw.filter((w) => {
    if (lower.includes(w)) return true;
    const alts = SYNONYM[w];
    return alts ? alts.some((a) => lower.includes(a)) : false;
  });
  // Scale with the item's length. "Vomited 2 or more times" reduces to two
  // distinctive words, so a fixed threshold of two never fires on it, which
  // is how the first version of this tool missed every finding the hand
  // review had already made. Short items need one strong match; long ones
  // need proportionally more before we call it the same sign.
  const needed = Math.max(1, Math.ceil(kw.length * 0.4));
  return hits.length >= needed ? hits : null;
}

/* --- run ---------------------------------------------------------------- */

const sentences = (t) => t.split(/(?<=[.!?]) /).map((s) => s.trim()).filter(Boolean);
const findings = [];
let scanned = 0;
let noSource = [];

for (const page of pages) {
  const tiers = aapTiers(page.slug);
  if (!tiers) {
    noSource.push(page.slug);
    continue;
  }
  scanned++;
  const urgent = tiers.filter((t) => t.rank >= 3); // 911 and ER only

  for (const tier of urgent) {
    for (const item of tier.items) {
      // If the page already routes this same sign at the right urgency
      // somewhere, it is handled, and a looser match elsewhere is noise. This
      // is what separates "the page is less urgent than the source" from "the
      // word fever appears in another sentence".
      const alreadyHandled = page.text.some((para) =>
        sentences(para).some((s) => {
          if (!mentions(s, item)) return false;
          return urgencyOf(s) >= tier.rank;
        }),
      );
      if (alreadyHandled) continue;

      for (const para of page.text) {
        const ss = sentences(para);
        for (let i = 0; i < ss.length; i++) {
          const s = ss[i];
          const hit = mentions(s, item);
          if (!hit) continue;
          // The urgency for a list of signs is very often in the next
          // sentence ("... Call us if any of those appear"), or in the one
          // before it. Take the nearest marker within the paragraph, and the
          // most urgent of those if several are in reach.
          const window = [s, ss[i + 1], ss[i - 1]].filter(Boolean);
          const ranks = window.map(urgencyOf).filter((r) => r >= 0);
          const ours = ranks.length ? Math.max(...ranks) : -1;
          if (ours >= 0 && ours < tier.rank) {
            findings.push({
              slug: page.slug,
              aapTier: tier.label,
              aapItem: item.replace(/\s+/g, " ").slice(0, 90),
              ours: s.slice(0, 110),
              context: (ss[i + 1] || "").slice(0, 80),
              oursRank: ours,
              needs: tier.rank,
              matched: hit.slice(0, 4).join(", "),
            });
          }
        }
      }
    }
  }
}

const RANK_NAME = { 4: "911", 3: "ER now", 2: "same day / now", 1: "call us", 0: "routine" };

console.log(`triage gate: ${scanned} pages compared against their AAP source`);
if (noSource.length) console.log(`  no AAP source cached for ${noSource.length}: ${noSource.slice(0, 6).join(", ")}`);

if (!findings.length) {
  console.log("\nno page assigns a lower urgency than its source.");
  process.exit(0);
}

// One line per page/item pair, deduplicated.
const seen = new Set();
const unique = findings.filter((f) => {
  const k = f.slug + "|" + f.aapItem + "|" + f.ours;
  return seen.has(k) ? false : (seen.add(k), true);
});

console.log(`\n${unique.length} places where our page is less urgent than the AAP:\n`);
const byPage = unique.reduce((a, f) => ((a[f.slug] ||= []).push(f), a), {});
for (const [slug, list] of Object.entries(byPage)) {
  console.log(`  ${slug}`);
  for (const f of list) {
    console.log(`    AAP ${f.aapTier}: ${f.aapItem}`);
    console.log(`    ours (${RANK_NAME[f.oursRank]}): ${f.ours}`);
    if (f.context) console.log(`      next: ${f.context}`);
    console.log(`    matched on: ${f.matched}\n`);
  }
}
console.log("Every hit needs confirming. Matching is by content words, so a page");
console.log("that discusses a sign without triaging it will show up here too.");
process.exit(1);
