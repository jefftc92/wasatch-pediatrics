/**
 * The cities we serve, and which offices are nearest to each.
 *
 * A service area is a city near one of the eight offices. It is not a marketing
 * boundary — every entry here is a real municipality whose families drive to a
 * real office, and the office pairing is worked out from the coordinates in
 * `offices.ts` rather than asserted. `tools/service-area-distances.mjs`
 * regenerates the `miles` figures; if an office moves, re-run it and the
 * pairings below will disagree with the file until they are corrected.
 *
 * Two things here are authored rather than computed, and both should be checked
 * before they go live:
 *
 *   `drive`      An approximate driving time. There is no routing API in this
 *                project, so these are estimates from road distance at valley
 *                traffic speeds, written as ranges to stay honest. They are the
 *                one number on these pages a parent will actually plan around.
 *   `landmark`   How people in that city describe the way there. Verified
 *                against the office addresses, but a local will spot a wrong
 *                one instantly.
 */

export type AreaOffice = {
  /** Office slug, matching `offices.ts` and `/locations/<slug>/`. */
  slug: string;
  /** Straight-line miles from the city centre, from the coordinates. */
  miles: number;
  /** Approximate driving time, as a range. Authored — see the note above. */
  drive: string;
  /** The way there, from a landmark people in this city navigate by. */
  landmark: string;
};

export type ServiceArea = {
  /** URL segment, under the service: /medical-care/well-child/<slug>/. */
  slug: string;
  name: string;
  /** Spelled out, because the H1 on these pages says the state in full. */
  state: string;
  county: string;
  /**
   * How the site groups these cities: by the office cluster they belong to,
   * not strictly by county. Heber City is in Wasatch County and is the only
   * one, so on its own it would be a group of one on the index and a city page
   * with no neighbours to offer — it belongs with Park City and Kamas, which
   * is where its families drive anyway.
   */
  region: string;
  /**
   * The city centre, so the map has somewhere to put the reader and something
   * to measure the offices against. These are the only coordinates in the
   * project not transcribed from something the practice publishes — they are
   * the point a distance is measured from, and they are what
   * `tools/service-area-distances.mjs` checks the office pairings against.
   */
  lat: number;
  lng: number;
  /**
   * Set when one of our offices is inside this city. Those pages talk about
   * getting to an office in town; the rest talk about choosing between two.
   */
  officeInTown?: string;
  /** Nearest offices, nearest first. Two, unless the city has one of its own. */
  offices: AreaOffice[];
  /**
   * Why this city's second office is not the second-nearest one.
   *
   * Straight-line distance and driving time part company where a canyon or a
   * freeway is involved, and when they do the drive wins. Recording the reason
   * here keeps `tools/service-area-distances.mjs` from reporting a deliberate
   * choice as drift, and keeps the choice reviewable.
   */
  pairingNote?: string;
};

export const serviceAreas: ServiceArea[] = [
  /* ------------------------------------------------- Salt Lake County -- */
  {
    slug: "murray",
    name: "Murray",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6669,
    lng: -111.888,
    officeInTown: "cottonwood",
    offices: [
      { slug: "cottonwood", miles: 1.2, drive: "about 5 minutes", landmark: "from Murray Park, straight up State Street to 5400 South" },
      { slug: "salt-lake", miles: 1.6, drive: "about 8 minutes", landmark: "from Fashion Place Mall, north on State Street then east on 3900 South" },
    ],
  },
  {
    slug: "millcreek",
    name: "Millcreek",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6892,
    lng: -111.833,
    offices: [
      { slug: "salt-lake", miles: 2.2, drive: "about 7 to 9 minutes", landmark: "from Millcreek Common, south on 900 East to 3900 South" },
      { slug: "cottonwood", miles: 4.4, drive: "about 10 to 13 minutes", landmark: "from the 3300 South I-15 on-ramp, two exits south to 5300 South" },
      { slug: "willow-creek", miles: 4.7, drive: "about 12 to 16 minutes", landmark: "from Millcreek Common, east to Highland Drive and south past Fort Union" },
    ],
  },
  {
    slug: "holladay",
    name: "Holladay",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6689,
    lng: -111.8247,
    offices: [
      { slug: "salt-lake", miles: 3.0, drive: "about 8 to 11 minutes", landmark: "from Holladay Village, west on Murray Holladay Road then north on 700 East" },
      { slug: "willow-creek", miles: 3.3, drive: "about 9 to 12 minutes", landmark: "from Holladay Village, south on Highland Drive past Fort Union" },
      { slug: "cottonwood", miles: 4.2, drive: "about 11 to 15 minutes", landmark: "from Holladay Village, west on Murray Holladay Road to State Street, then south to 5400 South" },
    ],
  },
  {
    slug: "cottonwood-heights",
    name: "Cottonwood Heights",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6197,
    lng: -111.8102,
    offices: [
      { slug: "willow-creek", miles: 1.4, drive: "about 5 to 7 minutes", landmark: "from the mouth of Big Cottonwood Canyon, down Fort Union to Highland Drive" },
      { slug: "cottonwood", miles: 5.4, drive: "about 13 to 17 minutes", landmark: "from Brighton High School, west on Fort Union to I-215 and north to 5300 South" },
      { slug: "salt-lake", miles: 5.8, drive: "about 14 to 18 minutes", landmark: "from Fort Union Boulevard, north on Highland Drive to 3900 South" },
    ],
  },
  {
    slug: "midvale",
    name: "Midvale",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6111,
    lng: -111.8994,
    offices: [
      { slug: "southpoint", miles: 2.3, drive: "about 7 to 10 minutes", landmark: "from Midvale City Park, west on 7200 South then south on I-15 to 9000 South" },
      { slug: "cottonwood", miles: 3.0, drive: "about 9 to 12 minutes", landmark: "from Fort Union Boulevard, north on State Street to 5400 South" },
      { slug: "willow-creek", miles: 3.3, drive: "about 9 to 13 minutes", landmark: "from Fort Union Boulevard, east to Highland Drive" },
    ],
  },
  {
    slug: "sandy",
    name: "Sandy",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.5649,
    lng: -111.8389,
    offices: [
      { slug: "draper", miles: 3.9, drive: "about 10 to 13 minutes", landmark: "from South Towne Center, south on I-15 to the 12300 South exit" },
      { slug: "willow-creek", miles: 3.9, drive: "about 10 to 14 minutes", landmark: "from Sandy City Hall, north on Highland Drive to Fort Union" },
      { slug: "southpoint", miles: 4.9, drive: "about 12 to 16 minutes", landmark: "from Sandy City Hall, west on 9000 South across I-15" },
    ],
  },
  {
    slug: "draper",
    name: "Draper",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.5247,
    lng: -111.8638,
    officeInTown: "draper",
    offices: [
      { slug: "draper", miles: 1.4, drive: "about 5 minutes", landmark: "one turn off the 12300 South exit on I-15" },
      { slug: "southpoint", miles: 5.4, drive: "about 12 to 16 minutes", landmark: "from Draper Peaks, north on I-15 to the 9000 South exit" },
      { slug: "willow-creek", miles: 6.8, drive: "about 15 to 20 minutes", landmark: "from Draper Peaks, north on I-15 to 7200 South and east to Highland Drive" },
    ],
  },
  {
    slug: "south-jordan",
    name: "South Jordan",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.5622,
    lng: -111.9297,
    offices: [
      { slug: "southpoint", miles: 1.7, drive: "about 6 to 9 minutes", landmark: "from Daybreak, east on 10400 South then north on Bangerter to 9000 South" },
      { slug: "draper", miles: 3.4, drive: "about 10 to 13 minutes", landmark: "from the South Jordan FrontRunner station, east to I-15 and south to 12300 South" },
    ],
  },
  {
    slug: "west-jordan",
    name: "West Jordan",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6097,
    lng: -111.9391,
    officeInTown: "southpoint",
    offices: [
      { slug: "southpoint", miles: 1.7, drive: "about 6 to 9 minutes", landmark: "from Jordan Landing, east on 9000 South almost to I-15" },
      { slug: "cottonwood", miles: 3.6, drive: "about 12 to 16 minutes", landmark: "from 7000 South, east to I-15 and north to the 5300 South exit" },
    ],
  },
  {
    slug: "riverton",
    name: "Riverton",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.5219,
    lng: -111.9391,
    offices: [
      { slug: "draper", miles: 2.6, drive: "about 9 to 12 minutes", landmark: "from Riverton City Park, east on 12600 South across I-15" },
      { slug: "southpoint", miles: 4.5, drive: "about 11 to 15 minutes", landmark: "from Riverton Hospital, north on Bangerter to 9000 South" },
    ],
  },
  {
    slug: "herriman",
    name: "Herriman",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.5141,
    lng: -112.033,
    offices: [
      { slug: "southpoint", miles: 7.4, drive: "about 16 to 21 minutes", landmark: "from Herriman City Hall, north on Mountain View Corridor then east on 9000 South" },
      { slug: "draper", miles: 7.5, drive: "about 17 to 22 minutes", landmark: "from Butterfield Park, east on 13400 South to I-15" },
    ],
  },
  {
    slug: "bluffdale",
    name: "Bluffdale",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.4899,
    lng: -111.9388,
    offices: [
      { slug: "draper", miles: 3.5, drive: "about 9 to 13 minutes", landmark: "from 14600 South, north on Redwood Road then east across I-15" },
      { slug: "southpoint", miles: 6.7, drive: "about 15 to 19 minutes", landmark: "from the Point of the Mountain, north on I-15 to the 9000 South exit" },
    ],
  },
  {
    slug: "taylorsville",
    name: "Taylorsville",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6677,
    lng: -111.9388,
    offices: [
      { slug: "cottonwood", miles: 2.1, drive: "about 8 to 11 minutes", landmark: "from Taylorsville City Hall, east on 5400 South straight to the door" },
      { slug: "salt-lake", miles: 3.6, drive: "about 11 to 15 minutes", landmark: "from Valley Fair Mall, east on 3500 South then south to 3900 South" },
    ],
  },
  {
    slug: "west-valley-city",
    name: "West Valley City",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6916,
    lng: -112.0011,
    offices: [
      { slug: "cottonwood", miles: 5.8, drive: "about 14 to 19 minutes", landmark: "from Valley Fair Mall, south on Redwood Road then east on 5400 South" },
      { slug: "salt-lake", miles: 6.6, drive: "about 15 to 21 minutes", landmark: "from the Maverik Center, east on 3500 South to I-15 and south one exit" },
      { slug: "southpoint", miles: 8.2, drive: "about 17 to 22 minutes", landmark: "from Hunter, south on Bangerter Highway then east on 9000 South" },
    ],
  },
  {
    slug: "kearns",
    name: "Kearns",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.6597,
    lng: -112.0011,
    offices: [
      { slug: "cottonwood", miles: 5.2, drive: "about 13 to 18 minutes", landmark: "from the Utah Olympic Oval, east on 5400 South the whole way" },
      { slug: "southpoint", miles: 6.4, drive: "about 15 to 19 minutes", landmark: "from Kearns High School, south on 5600 West then east on 9000 South" },
      { slug: "salt-lake", miles: 6.9, drive: "about 16 to 21 minutes", landmark: "from 5400 South, east to I-215 and north to the 3900 South exit" },
    ],
  },
  {
    slug: "salt-lake-city",
    name: "Salt Lake City",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.7608,
    lng: -111.891,
    officeInTown: "salt-lake",
    offices: [
      { slug: "salt-lake", miles: 5.1, drive: "about 12 to 18 minutes", landmark: "from downtown, south on I-15 to the 3900 South exit then east" },
      { slug: "cottonwood", miles: 7.4, drive: "about 15 to 21 minutes", landmark: "from Sugar House Park, south on 1300 East then west on 5400 South" },
    ],
  },
  {
    slug: "south-salt-lake",
    name: "South Salt Lake",
    state: "Utah",
    county: "Salt Lake County",
    region: "Salt Lake County",
    lat: 40.7188,
    lng: -111.8883,
    offices: [
      { slug: "salt-lake", miles: 2.3, drive: "about 7 to 10 minutes", landmark: "from the Central Pointe TRAX station, south on State Street then east on 3900 South" },
      { slug: "cottonwood", miles: 4.5, drive: "about 11 to 15 minutes", landmark: "from 3300 South, south on I-15 to the 5300 South exit" },
    ],
  },
  /* ----------------------------------------------------- Davis County -- */
  {
    slug: "north-salt-lake",
    name: "North Salt Lake",
    state: "Utah",
    county: "Davis County",
    region: "Davis County",
    lat: 40.848,
    lng: -111.9069,
    offices: [
      { slug: "grow-up-great", miles: 3.3, drive: "about 8 to 11 minutes", landmark: "from Foxboro, north on Redwood Road then east on 500 South in Bountiful" },
      { slug: "farmington", miles: 9.9, drive: "about 15 to 19 minutes", landmark: "from the Legacy Parkway on-ramp, north to the Park Lane exit" },
    ],
  },
  {
    slug: "woods-cross",
    name: "Woods Cross",
    state: "Utah",
    county: "Davis County",
    region: "Davis County",
    lat: 40.8716,
    lng: -111.9022,
    offices: [
      { slug: "grow-up-great", miles: 2.0, drive: "about 6 to 9 minutes", landmark: "from the Woods Cross FrontRunner station, east on 500 South to Medical Drive" },
      { slug: "farmington", miles: 8.3, drive: "about 13 to 17 minutes", landmark: "from 1500 South, north on I-15 to the Park Lane exit" },
    ],
  },
  {
    slug: "bountiful",
    name: "Bountiful",
    state: "Utah",
    county: "Davis County",
    region: "Davis County",
    lat: 40.8894,
    lng: -111.8808,
    officeInTown: "grow-up-great",
    offices: [
      { slug: "grow-up-great", miles: 0.6, drive: "about 4 minutes", landmark: "on Medical Drive, the hospital street off 500 South" },
      { slug: "farmington", miles: 7.1, drive: "about 12 to 16 minutes", landmark: "from 500 South, north on I-15 to the Park Lane exit" },
    ],
  },
  {
    slug: "centerville",
    name: "Centerville",
    state: "Utah",
    county: "Davis County",
    region: "Davis County",
    lat: 40.918,
    lng: -111.8722,
    offices: [
      { slug: "grow-up-great", miles: 2.2, drive: "about 7 to 10 minutes", landmark: "from Founders Park, south on Main Street then west on 500 South" },
      { slug: "farmington", miles: 5.3, drive: "about 10 to 14 minutes", landmark: "from Parrish Lane, north on I-15 one exit to Park Lane" },
    ],
  },
  {
    slug: "farmington",
    name: "Farmington",
    state: "Utah",
    county: "Davis County",
    region: "Davis County",
    lat: 40.9805,
    lng: -111.8874,
    officeInTown: "farmington",
    offices: [
      { slug: "farmington", miles: 1.0, drive: "about 4 to 6 minutes", landmark: "just off Park Lane behind Station Park" },
      { slug: "grow-up-great", miles: 6.6, drive: "about 12 to 16 minutes", landmark: "from Station Park, south on I-15 to the 500 South exit in Bountiful" },
    ],
  },
  {
    slug: "kaysville",
    name: "Kaysville",
    state: "Utah",
    county: "Davis County",
    region: "Davis County",
    lat: 41.0352,
    lng: -111.9385,
    offices: [
      { slug: "farmington", miles: 3.6, drive: "about 8 to 11 minutes", landmark: "from Kaysville Main Street, south on Highway 89 or I-15 to Park Lane" },
      { slug: "grow-up-great", miles: 10.9, drive: "about 16 to 21 minutes", landmark: "from 200 North, south on I-15 to the 500 South exit in Bountiful" },
    ],
  },
  {
    slug: "layton",
    name: "Layton",
    state: "Utah",
    county: "Davis County",
    region: "Davis County",
    lat: 41.0602,
    lng: -111.9711,
    offices: [
      { slug: "farmington", miles: 6.0, drive: "about 11 to 15 minutes", landmark: "from Layton Hills Mall, south on I-15 two exits to Park Lane" },
      { slug: "grow-up-great", miles: 13.1, drive: "about 19 to 25 minutes", landmark: "from Antelope Drive, south on I-15 to the 500 South exit in Bountiful" },
    ],
  },
  /* ------------------------------------------ Summit & Wasatch County -- */
  {
    slug: "park-city",
    name: "Park City",
    state: "Utah",
    county: "Summit County",
    region: "Summit & Wasatch",
    lat: 40.6461,
    lng: -111.498,
    officeInTown: "summit",
    offices: [
      { slug: "summit", miles: 3.2, drive: "about 8 to 12 minutes", landmark: "at Quinn's Junction, next to the hospital where SR-248 meets US-40" },
      { slug: "willow-creek", miles: 17.9, drive: "about 35 to 45 minutes", landmark: "down Parley's Canyon on I-80, then south on I-215 to Fort Union" },
    ],
  },
  {
    slug: "heber-city",
    name: "Heber City",
    state: "Utah",
    county: "Wasatch County",
    region: "Summit & Wasatch",
    lat: 40.507,
    lng: -111.4133,
    offices: [
      { slug: "summit", miles: 12.7, drive: "about 20 to 27 minutes", landmark: "north on US-40 over Silver Creek to Quinn's Junction" },
      { slug: "willow-creek", miles: 23.6, drive: "about 50 to 60 minutes", landmark: "north on US-40 to I-80, down Parley's Canyon and south on I-215" },
    ],
  },
  {
    slug: "kamas",
    name: "Kamas",
    state: "Utah",
    county: "Summit County",
    region: "Summit & Wasatch",
    lat: 40.6427,
    lng: -111.2805,
    offices: [
      { slug: "summit", miles: 10.2, drive: "about 18 to 24 minutes", landmark: "west on SR-248 over Browns Canyon to Quinn's Junction" },
      { slug: "salt-lake", miles: 31.3, drive: "about 55 to 70 minutes", landmark: "north to I-80, down Parley's Canyon and south on I-215 to 3900 South" },
    ],
    pairingNote:
      "Willow Creek is two miles nearer in a straight line, but everything from Kamas arrives down Parley's Canyon, and 3900 South is the earlier exit off I-215. Salt Lake is the shorter drive despite the longer distance.",
  },
];

export const serviceAreaBySlug = new Map(
  serviceAreas.map((area) => [area.slug, area]),
);
