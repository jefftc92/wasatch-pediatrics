/**
 * Do the AAP deep links still resolve?
 *
 * Each symptom page embeds the American Academy of Pediatrics' own Symptom
 * Checker, opened at one topic by name:
 *
 *     symptomviewer.aspx?symptom=Croup
 *
 * The name is theirs, spelled their way, and it is the one part of this that
 * can break without anything in this repository changing — a retitled topic
 * ("Hand-Foot-and-Mouth Disease" is really "Hand-Foot-and-Mouth Disease-Viral
 * Rash") leaves a page whose frame opens on nothing.
 *
 *     node tools/check-symptom-links.mjs
 *
 * It fetches each one and checks three things: that it answers, that it is a
 * real page rather than an error stub, and that the topic name appears in what
 * comes back. Run it before launch and occasionally afterwards; it needs
 * network access and takes a minute.
 */

import { symptoms } from "../src/data/symptoms.ts";

const VIEWER =
  "https://www.healthychildren.org/English/tips-tools/symptom-checker/IFrame/Pages/symptomviewer.aspx";
const KEY = "3E16EA89-5AEB-4342-8B5B-E0503CA3D59A";

/** The words of a topic name that ought to appear in its own page. */
function keywords(name) {
  return name
    .replace(/\(.*?\)/g, " ")
    .split(/[^A-Za-z]+/)
    .filter((word) => word.length > 3 && !/^(and|the|with|without|from|questions|months)$/i.test(word));
}

let failures = 0;

for (const symptom of symptoms) {
  const url = `${VIEWER}?${new URLSearchParams({ symptom: symptom.aap, style: "iframe", key: KEY })}`;
  let status = 0;
  let body = "";
  try {
    const response = await fetch(url, { redirect: "follow" });
    status = response.status;
    body = await response.text();
  } catch (error) {
    console.log(`  FAIL ${symptom.slug.padEnd(24)} ${error.message}`);
    failures += 1;
    continue;
  }

  const text = body.replace(/<[^>]+>/g, " ").toLowerCase();
  const words = keywords(symptom.aap);
  const found = words.filter((word) => text.includes(word.toLowerCase()));
  const issues = [];
  if (status !== 200) issues.push(`status ${status}`);
  if (body.length < 20000) issues.push(`only ${body.length} bytes — probably an error page`);
  if (words.length && !found.length) issues.push(`none of ${words.join("/")} appears in the response`);

  if (issues.length) {
    failures += 1;
    console.log(`  FAIL ${symptom.slug.padEnd(24)} ${symptom.aap} — ${issues.join("; ")}`);
  } else {
    console.log(`  ok   ${symptom.slug.padEnd(24)} ${symptom.aap}`);
  }
}

console.log(
  failures
    ? `\n${failures} of ${symptoms.length} deep links are broken — the AAP has renamed or removed a topic.`
    : `\nAll ${symptoms.length} deep links resolve to the topic they name.`,
);
process.exit(failures ? 1 : 0);
