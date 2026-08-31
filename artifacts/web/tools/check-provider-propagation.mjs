/**
 * Does a change to a provider reach every page that names them?
 *
 * The city pages under a service list the pediatricians at the offices they
 * plot, in two places at once: the cards a reader sees, and the `Physician`
 * nodes a search engine reads. Both are built from `src/data/providers.ts` at
 * render time, so in principle an arrival, a departure or a corrected name
 * reaches all of them the moment it reaches the data.
 *
 * "In principle" is what this checks. It renders the pages, changes the
 * provider list three ways, renders again, and asserts that the right pages
 * changed and no others did — so that if somebody later caches a provider
 * list, hard-codes a name, or reads the roster from a second place, this
 * fails instead of the site quietly going stale.
 *
 *     node tools/check-provider-propagation.mjs
 *
 * It mutates the imported array in memory and puts it back afterwards. No file
 * on disk is touched.
 */

import { providers } from "../src/data/providers.ts";
import { serviceRoutes } from "../src/render/services.ts";
import { locationIds, services } from "../src/data/services.ts";
import { areaHref, areasForService } from "../src/render/serviceAreas.ts";

/*
 * The exact set of service-area routes, taken from the registry rather than
 * guessed from the shape of a path — three segments also describes a dentistry
 * topic page, and counting those as city pages made this tool report a number
 * that was not true.
 */
const AREA_ROUTES = new Set(
  services.flatMap((service) =>
    areasForService(service).map((area) => areaHref(service, area)),
  ),
);
const isArea = (route) => AREA_ROUTES.has(route);

/** Every city page, as {route: {cards:Set<slug>, physicians:Set<slug>}}. */
function build() {
  const out = new Map();
  for (const page of serviceRoutes()) {
    if (!isArea(page.route)) continue;
    const band = /class="[^"]*area-docs[\s\S]*/.exec(page.content)?.[0] ?? "";
    const cards = new Set(
      [...band.matchAll(/class="area-doc" href="\/providers\/([a-z0-9-]+)\//g)].map((m) => m[1]),
    );
    const physicians = new Set(
      (page.extraSchema ?? [])
        .filter((n) => n["@type"] === "Physician")
        .map((n) => n["@id"].replace(/^.*\/providers\/([a-z0-9-]+)\/.*$/, "$1")),
    );
    out.set(page.route, { cards, physicians });
  }
  return out;
}

function pagesNaming(snapshot, slug) {
  return [...snapshot]
    .filter(([, v]) => v.cards.has(slug))
    .map(([route]) => route)
    .sort();
}

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : "  FAIL"} ${label}${detail ? "  — " + detail : ""}`);
  if (!ok) failures += 1;
};

const before = build();
console.log(`${before.size} city pages, ${[...before.values()].reduce((n, v) => n + v.cards.size, 0)} provider cards\n`);

/* Cards and schema must already agree, everywhere. */
let mismatched = 0;
for (const [route, v] of before) {
  if (v.cards.size !== v.physicians.size || [...v.cards].some((s) => !v.physicians.has(s))) {
    mismatched += 1;
    console.log(`  cards and Physician nodes disagree on ${route}`);
  }
}
check("every page's cards and Physician nodes match", mismatched === 0);

/* ---- 1. a departure ---- */
const victim = providers.find(
  (p) => p.categoryIds.includes("12") && p.locationIds.includes(locationIds["willow-creek"]),
);
const wasOn = pagesNaming(before, victim.slug);
const at = providers.indexOf(victim);
providers.splice(at, 1);
let after = build();
check(
  `removing ${victim.displayName} clears them from all ${wasOn.length} pages that named them`,
  wasOn.every((r) => !after.get(r).cards.has(victim.slug) && !after.get(r).physicians.has(victim.slug)),
);
check(
  "and changes no page that did not name them",
  [...before].every(([r, v]) => wasOn.includes(r) || v.cards.size === after.get(r).cards.size),
);
providers.splice(at, 0, victim);
check("restoring them puts every page back", JSON.stringify([...build()].map(([r, v]) => [r, [...v.cards].sort()])) === JSON.stringify([...before].map(([r, v]) => [r, [...v.cards].sort()])));

/* ---- 2. an arrival ---- */
const arrival = {
  ...victim,
  slug: "test-new-provider",
  name: "Test Arrival",
  displayName: "Test Arrival",
  cardName: "Test Arrival, MD",
  credentials: "MD",
  locationIds: [locationIds.draper],
  categoryIds: ["12"],
};
providers.push(arrival);
after = build();
const draperPages = [...after].filter(([, v]) => v.cards.has("galina-hornyik")).map(([r]) => r).sort();
check(
  `adding a Draper provider reaches all ${draperPages.length} pages that plot Draper`,
  draperPages.length > 0 && draperPages.every((r) => after.get(r).cards.has(arrival.slug) && after.get(r).physicians.has(arrival.slug)),
);
check(
  "and reaches no page that does not plot Draper",
  [...after].every(([r, v]) => draperPages.includes(r) || !v.cards.has(arrival.slug)),
);
providers.pop();

/* ---- 3. an update ---- */
const renamed = providers.find((p) => p.categoryIds.includes("12"));
const oldName = renamed.displayName;
renamed.displayName = "Renamed Provider";
const pages = serviceRoutes().filter((p) => isArea(p.route));
const showing = pages.filter((p) => p.content.includes("Renamed Provider"));
const stillOld = pages.filter((p) => p.content.includes(`>${oldName}<`));
check(
  `renaming ${oldName} updates all ${showing.length} pages that show them`,
  showing.length > 0 && stillOld.length === 0,
  stillOld.length ? `${stillOld.length} still show the old name` : "",
);
check(
  "and the Physician nodes carry the new name too",
  showing.every((p) => (p.extraSchema ?? []).some((n) => n["@type"] === "Physician" && n.name === "Renamed Provider")),
);
renamed.displayName = oldName;

console.log(
  failures
    ? `\n${failures} check(s) failed — a provider change would not reach the pages.`
    : "\nEvery provider change reaches the cards and the schema on exactly the pages that name them.",
);
process.exit(failures ? 1 : 0);
