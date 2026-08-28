/**
 * Straight-line distance from each service area to each office.
 *
 * `src/data/serviceAreas.ts` states, for every city, which two offices are
 * nearest and how far away they are. Those figures are not guesses and they are
 * not editorial: they come from this script, which reads the office coordinates
 * out of the data file and measures them against the city centres below.
 *
 * Run it when an office moves or a city is added:
 *
 *     node tools/service-area-distances.mjs
 *
 * It prints the three nearest offices per city. It deliberately does not write
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

/**
 * City centres. These are the only coordinates in the project that are not
 * transcribed from something the practice publishes, so they live here rather
 * than in `src/data/` — they are an input to a check, not site content.
 */
const centres = {
  murray: [40.6669, -111.888],
  millcreek: [40.6892, -111.833],
  holladay: [40.6689, -111.8247],
  "cottonwood-heights": [40.6197, -111.8102],
  midvale: [40.6111, -111.8994],
  sandy: [40.5649, -111.8389],
  draper: [40.5247, -111.8638],
  "south-jordan": [40.5622, -111.9297],
  "west-jordan": [40.6097, -111.9391],
  riverton: [40.5219, -111.9391],
  herriman: [40.5141, -112.033],
  bluffdale: [40.4899, -111.9388],
  taylorsville: [40.6677, -111.9388],
  "west-valley-city": [40.6916, -112.0011],
  kearns: [40.6597, -112.0011],
  "salt-lake-city": [40.7608, -111.891],
  "south-salt-lake": [40.7188, -111.8883],
  "north-salt-lake": [40.848, -111.9069],
  "woods-cross": [40.8716, -111.9022],
  bountiful: [40.8894, -111.8808],
  centerville: [40.918, -111.8722],
  farmington: [40.9805, -111.8874],
  kaysville: [41.0352, -111.9385],
  layton: [41.0602, -111.9711],
  "park-city": [40.6461, -111.498],
  "heber-city": [40.507, -111.4133],
  kamas: [40.6427, -111.2805],
};

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
  const centre = centres[area.slug];
  if (!centre) {
    console.log(`${area.name.padEnd(20)} no centre recorded — add one above`);
    drifted += 1;
    continue;
  }

  const ranked = offices
    .map((office) => ({
      slug: office.slug,
      miles: miles(centre[0], centre[1], office.lat, office.lng),
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
      .slice(0, 3)
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
