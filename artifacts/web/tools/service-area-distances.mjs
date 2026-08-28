/**
 * Straight-line distance from each service area to each office.
 *
 * `src/data/serviceAreas.ts` states, for every city, which offices are nearest
 * and how far away they are. Those figures are not guesses and they are
 * not editorial: they come from this script, which reads the office coordinates
 * out of the data file and measures them against the city centres below.
 *
 * Run it when an office moves or a city is added:
 *
 *     node tools/service-area-distances.mjs
 *
 * It prints the four nearest offices per city, and flags any city whose stated
 * pairing or stated distance disagrees with the coordinates. It deliberately does not write
 * the data file — the pairing is a judgement (a city sometimes wants the office
 * on its own side of a freeway rather than the nearest one), and the copy on
 * each page is written around whichever pair was chosen. What this catches is
 * the case where the file and the map have drifted apart.
 *
 * The distances are straight-line. The drive times in the data file are not
 * derived from them mechanically — there is no routing API here — so they stay
 * authored, and stay ranges.
 */

import { offices } from "../src/data/offices.ts";
import { serviceAreas } from "../src/data/serviceAreas.ts";

const EARTH_MILES = 3958.8;
const rad = (deg) => (deg * Math.PI) / 180;

function miles(aLat, aLng, bLat, bLng) {
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_MILES * Math.asin(Math.sqrt(h));
}

let drifted = 0;

for (const area of serviceAreas) {
  const ranked = offices
    .map((office) => ({
      slug: office.slug,
      miles: miles(area.lat, area.lng, office.lat, office.lng),
    }))
    .sort((a, b) => a.miles - b.miles);

  const stated = area.offices.map((office) => office.slug).join(",");
  const nearest = ranked
    .slice(0, area.offices.length)
    .map((office) => office.slug)
    .join(",");

  /*
   * A stated pairing that is not the nearest pairing is only drift when nobody
   * has said why. With a `pairingNote` it is a decision, and the note is what
   * gets printed so it can be argued with.
   */
  const differs = stated !== nearest;
  const note = differs
    ? area.pairingNote
      ? `  <- states ${stated}: ${area.pairingNote}`
      : `  <- states ${stated}`
    : "";
  if (differs && !area.pairingNote) drifted += 1;

  console.log(
    `${area.name.padEnd(20)} ${ranked
      .slice(0, 4)
      .map((office) => `${office.slug}=${office.miles.toFixed(1)}mi`)
      .join("  ")}${note}`,
  );

  for (const office of area.offices) {
    const measured = ranked.find((entry) => entry.slug === office.slug);
    if (measured && Math.abs(measured.miles - office.miles) > 0.15) {
      console.log(
        `${"".padEnd(20)} ${office.slug}: file says ${office.miles}mi, measured ${measured.miles.toFixed(1)}mi`,
      );
      drifted += 1;
    }
  }
}

console.log(
  drifted
    ? `\n${drifted} discrepancies — the data file and the coordinates disagree.`
    : "\nEvery city's stated offices and distances match the coordinates.",
);
