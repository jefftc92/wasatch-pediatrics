/*
 * Copy gate. Fails on the faults that recurred often enough to be written into
 * EDITORIAL_RULES.md. Every check here exists because the fault was introduced
 * while fixing something else, so this runs before any copy change is committed.
 *
 *   node tools/check-copy.mjs
 */
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/data/symptoms.ts", import.meta.url), "utf8");

const entries = src
  .split("\n  {\n")
  .slice(1)
  // The split eats the newline that begins each block; the field patterns
  // anchor on it, so put it back.
  .map((raw) => "\n" + raw)
  .map((block) => {
    const field = (name) =>
      (block.match(new RegExp(`\\n    ${name}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`)) || [])[1] || "";
    const introBlock = (block.match(/\n    intro: \[([\s\S]*?)\n    \],/) || [])[1] || "";
    return {
      slug: field("slug"),
      heading: field("heading"),
      lead: field("lead"),
      title: field("title"),
      description: field("description"),
      intro: [...introBlock.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
    };
  })
  .filter((e) => e.slug);

const sentences = (text) => text.split(/(?<=[.!?]) /).map((s) => s.trim()).filter(Boolean);
const words = (text) => text.match(/[A-Za-z']+/g) || [];

/* Rule 3: a measure needs its substance in the same sentence. */
const MEASURE = /\b(teaspoons?|tablespoons?|spoonfuls?|sips?|doses?)\b/i;
const SUBSTANCE =
  /\b(water|fluid|milk|formula|solution|juice|honey|medicine|medication|antibiotic|ibuprofen|acetaminophen|saline|drink|rehydration|liquid|steroid|laxative|antihistamine|reliever|epinephrine|vaccine|sports drink)\b/i;

/* Rule 3: a demonstrative used as a bare subject. "That film is normal" is
 * fine, because a noun follows. "That is why..." is not. */
const BARE_SUBJECT = /^(It|They|This|That|These|Those)\s+(is|are|was|were|means|needs|can|will|does|do|has|have)\b/;

const BRITISH =
  /\b(fibres?|colour\w*|behaviour\w*|paediatric\w*|laboured|grey|neighbour\w*|fortnight|travelled|whilst|amongst|yoghurt|centre|litre|metre|practise|signall\w*|labell\w*|modell\w*|cancell\w*|travell\w*|marvell\w*|counsell\w*|fuell\w*|organis\w*|recognis\w*|realis\w*|analys\w*|apologis\w*|defence|offence|licence|programme|storey|kerb|plough|draught)\b/i;

const checks = [];
const fail = (rule, slug, quote, detail) => checks.push({ rule, slug, quote, detail });

const seen = { heading: new Map(), lead: new Map(), title: new Map() };

for (const e of entries) {
  const all = [e.lead, ...e.intro];

  /*
   * Rule 18. Rule 17 moved the AAP's lower tiers onto the panel and took the
   * numbers with them. The round 3 reader, holding a thermometer reading 103.2,
   * finished the fever page without learning what counts as a fever, and the
   * head injury page told them a width mattered and sent them to a tab for it.
   * Two shapes are mechanical enough to catch.
   */

  // A sentence that says a specific value matters and hands it to the panel.
  const VALUE = /\b(width|number|amount|dose|dosage|temperature|reading|size|how much|how many|how long|how wide|how old)\b/i;
  for (const text of [e.lead, ...e.intro]) {
    for (const s of sentences(text)) {
      if (/\btabs?\b/i.test(s) && VALUE.test(s) && !/\d/.test(s)) {
        fail(18, e.slug, s.slice(0, 80), "names a value that matters and sends the reader to a tab for it");
      }
    }
  }

  // The meta description is a promise. If it offers a definition or a
  // threshold, the prose has to carry the figure that answers it. 911 and 988
  // are routing numbers, not thresholds, so they do not count as an answer.
  const prose = e.intro.join(" ").replace(/\b(911|988)\b/g, "");
  const PROMISES = [
    [/counts as a fever/i, /\d+(\.\d+)?\s*(°|degrees)/i, "a temperature"],
    [/how long/i, /\b\d+\s*(to\s*\d+\s*)?(minute|hour|day|week|month)/i, "a duration"],
    [/what counts as|how much|how many/i, /\d/, "a figure"],
  ];
  for (const [promise, answer, what] of PROMISES) {
    if (promise.test(e.description) && !answer.test(prose)) {
      fail(18, e.slug, e.description.slice(0, 80), `description promises ${what} the prose never gives`);
      break;
    }
  }

  if (/^What to do/i.test(e.heading)) {
    fail(4, e.slug, e.heading, "heading promises instructions the framed source already gives");
  }

  for (const key of ["heading", "lead", "title"]) {
    const prior = seen[key].get(e[key]);
    if (prior) fail(8, e.slug, e[key], `duplicate ${key}, also on ${prior}`);
    else seen[key].set(e[key], e.slug);
  }

  for (const text of all) {
    if (text.includes("—")) fail(9, e.slug, text.slice(0, 60), "em dash");
    if (text.includes(";")) fail(9, e.slug, text.slice(0, 60), "semicolon");

    const brit = text.match(BRITISH);
    if (brit) fail(11, e.slug, brit[0], "British spelling");

    for (const s of sentences(text)) {
      const n = words(s).length;
      if (n > 34) fail(13, e.slug, s.slice(0, 70), `${n}-word sentence`);
      if (MEASURE.test(s) && !SUBSTANCE.test(s)) {
        fail(3, e.slug, s.slice(0, 70), `"${s.match(MEASURE)[0]}" with no substance named`);
      }
    }
  }

  for (const p of e.intro) {
    for (const s of sentences(p)) {
      if (BARE_SUBJECT.test(s)) fail(3, e.slug, s.slice(0, 70), "bare pronoun as subject");
    }
  }

  const headingBrit = e.heading.match(BRITISH);
  if (headingBrit) fail(11, e.slug, e.heading, "British spelling in heading");
}

if (checks.length === 0) {
  console.log(`copy gate: ${entries.length} pages, no findings.`);
  process.exit(0);
}

const byRule = checks.reduce((acc, c) => ((acc[c.rule] ||= []).push(c), acc), {});
console.log(`copy gate: ${checks.length} findings across ${new Set(checks.map((c) => c.slug)).size} pages\n`);
for (const rule of Object.keys(byRule).sort((a, b) => a - b)) {
  console.log(`  rule ${rule} — ${byRule[rule].length}`);
  for (const c of byRule[rule].slice(0, 6)) console.log(`      [${c.slug}] ${c.detail}: ${c.quote}`);
  if (byRule[rule].length > 6) console.log(`      … and ${byRule[rule].length - 6} more`);
}
process.exit(1);
