/*
 * Applies an approved revision to src/data/symptoms.ts.
 *
 * Until this existed, every agent finding had to be turned into hand-written
 * string replacements, which is where regressions kept entering. The loop now
 * closes: an agent returns a revision file, this writes it, and the gates run
 * against the result.
 *
 * Input is the packet format the rewriter returns:
 *
 *   ### croup
 *   Heading: ...
 *   Meta description: ...
 *   Lead: ...
 *   Paragraph 1: ...
 *   Paragraph 2: ...
 *
 *   node tools/apply-revision.mjs editorial/revision-01.md [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , inputPath, ...flags] = process.argv;
const dry = flags.includes("--dry");
if (!inputPath) {
  console.error("usage: node tools/apply-revision.mjs <revision.md> [--dry]");
  process.exit(2);
}

const revisionText = readFileSync(inputPath, "utf8");
const target = new URL("../src/data/symptoms.ts", import.meta.url);
let src = readFileSync(target, "utf8");

/* --- parse the revision ------------------------------------------------- */

const revisions = [];
for (const chunk of revisionText.split(/^###\s+/m).slice(1)) {
  const slug = chunk.split(/\s|\n/)[0].trim();
  const grab = (label) => {
    const m = chunk.match(new RegExp(`^${label}:[ \\t]*(.+?)\\s*$`, "m"));
    return m ? m[1].trim() : null;
  };
  const paras = [...chunk.matchAll(/^Paragraph \d+:[ \t]*(.+?)\s*$/gm)].map((m) => m[1].trim());
  revisions.push({
    slug,
    heading: grab("Heading"),
    description: grab("Meta description"),
    lead: grab("Lead"),
    intro: paras,
  });
}

if (!revisions.length) {
  console.error("no ### <slug> sections found in the revision file");
  process.exit(2);
}

/* --- write each field --------------------------------------------------- */

// TypeScript string literal, matching the file's own escaping.
const lit = (s) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

// Find one entry's block so replacements cannot leak into a neighbour.
function blockRange(slug) {
  const start = src.indexOf(`    slug: "${slug}",`);
  if (start < 0) return null;
  const end = src.indexOf("\n  },\n", start);
  return end < 0 ? null : [start, end];
}

let applied = 0;
const problems = [];

for (const rev of revisions) {
  const range = blockRange(rev.slug);
  if (!range) {
    problems.push(`${rev.slug}: not found in symptoms.ts`);
    continue;
  }
  let [start, end] = range;
  let block = src.slice(start, end);
  const before = block;

  const setScalar = (name, value) => {
    if (value == null) return;
    const re = new RegExp(`(    ${name}:)\\s*\\n?\\s*"(?:[^"\\\\]|\\\\.)*"`);
    if (!re.test(block)) {
      problems.push(`${rev.slug}: no ${name} field`);
      return;
    }
    block = block.replace(re, `$1 ${lit(value)}`);
  };

  setScalar("heading", rev.heading);
  setScalar("description", rev.description);
  setScalar("lead", rev.lead);

  if (rev.intro.length) {
    const re = /(    intro: \[)[\s\S]*?(\n    \],)/;
    if (!re.test(block)) {
      problems.push(`${rev.slug}: no intro array`);
    } else {
      const body = rev.intro.map((p) => `\n      ${lit(p)},`).join("");
      block = block.replace(re, `$1${body}$2`);
    }
  }

  if (block !== before) {
    src = src.slice(0, start) + block + src.slice(end);
    applied++;
  }
}

if (problems.length) {
  console.error("problems:");
  for (const p of problems) console.error("  " + p);
  console.error("\nnothing written.");
  process.exit(1);
}

if (dry) {
  console.log(`dry run: ${applied} of ${revisions.length} entries would change.`);
  process.exit(0);
}

writeFileSync(target, src);
console.log(`applied ${applied} of ${revisions.length} entries to src/data/symptoms.ts`);
console.log("now run: node tools/check-copy.mjs && node tools/check-triage.mjs");
