/**
 * Where the eight offices are.
 *
 * Street addresses, phone numbers and coordinates, transcribed from the eight
 * location pages copied from the live site — the coordinates out of the Google
 * Maps embed each page carries, which is the practice's own record of where
 * the pin belongs.
 *
 * `src/data/services.ts` already knows which services each office offers; this
 * is the other half, and together they are enough to draw the map. Office
 * names and the order they appear in stay in services.ts with `locationNames`,
 * so there is still one list of offices rather than two.
 */

export type Office = {
  /** Matches the keys of `locationNames` and the /locations/<slug>/ page. */
  slug: string;
  street: string;
  /** Suite or unit, where the office has one. */
  suite?: string;
  city: string;
  state: string;
  zip: string;
  /** Digits only, for the tel: link. */
  phone: string;
  /**
   * The office building, as photographed for the live site's own location
   * page — these are the header images those pages already carry, so no new
   * asset was introduced and none of them is a stock photograph.
   */
  photo: string;
  lat: number;
  lng: number;
};

export const offices: Office[] = [
  {
    slug: "cottonwood",
    street: "301 West 5400 South",
    city: "Murray",
    state: "UT",
    zip: "84107",
    phone: "8017478700",
    photo: "/wp-content/uploads/2022/04/WAS24-0068_Cottonwood_Moving-Header_Mobile_1000x400_v3.jpg",
    lat: 40.653893,
    lng: -111.902052,
  },
  {
    slug: "draper",
    street: "114 E 12450 S",
    suite: "Suite 100",
    city: "Draper",
    state: "UT",
    zip: "84020",
    phone: "8015233001",
    photo: "/wp-content/uploads/2022/04/Draper-Header_Mobile-1000x400-1.jpg",
    lat: 40.524187,
    lng: -111.889879,
  },
  {
    slug: "farmington",
    street: "491 W Bourne Cir",
    suite: "Suite 1",
    city: "Farmington",
    state: "UT",
    zip: "84025",
    phone: "8019399111",
    photo: "/wp-content/uploads/2022/04/Farmington-Header_Mobile-1000x400-1.jpg",
    lat: 40.991764,
    lng: -111.900474,
  },
  {
    slug: "grow-up-great",
    street: "620 Medical Dr",
    suite: "Suite 100",
    city: "Bountiful",
    state: "UT",
    zip: "84010",
    phone: "8012952888",
    photo: "/wp-content/uploads/2022/04/Grow-Up-Great-Header_Mobile-1000x400-1.jpg",
    lat: 40.886571,
    lng: -111.869210,
  },
  {
    slug: "salt-lake",
    street: "3838 South 700 East",
    suite: "Suite 200",
    city: "Salt Lake City",
    state: "UT",
    zip: "84106",
    phone: "8012648686",
    photo: "/wp-content/uploads/2022/04/mobile.png",
    lat: 40.687668,
    lng: -111.875289,
  },
  {
    slug: "southpoint",
    street: "9071 S 1300 W",
    suite: "Suite 301",
    city: "West Jordan",
    state: "UT",
    zip: "84088",
    phone: "8015651162",
    photo: "/wp-content/uploads/2022/04/Southpoint-Header_Mobile-1000x400-1.jpg",
    lat: 40.586281,
    lng: -111.927903,
  },
  {
    slug: "summit",
    street: "750 Round Valley Dr",
    suite: "Suite 102",
    city: "Park City",
    state: "UT",
    zip: "84060",
    phone: "4356550926",
    photo: "/wp-content/uploads/2022/04/Summit-Header_Mobile-1000x400-1.jpg",
    lat: 40.685849,
    lng: -111.467122,
  },
  {
    slug: "willow-creek",
    street: "7138 S Highland Dr",
    suite: "Suite 106",
    city: "Salt Lake City",
    state: "UT",
    zip: "84121",
    phone: "8019421800",
    photo: "/wp-content/uploads/2022/04/willowcreekmobile.jpg",
    lat: 40.621649,
    lng: -111.837205,
  },
];

export const officeBySlug = new Map(
  offices.map((office) => [office.slug, office] as const),
);

/** (801) 264-8686, from the digits the tel: link uses. */
export function formatPhone(phone: string): string {
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

/** "3838 South 700 East, Suite 200, Salt Lake City, UT 84106" */
export function formatAddress(office: Office): string {
  return [office.street, office.suite, `${office.city}, ${office.state} ${office.zip}`]
    .filter(Boolean)
    .join(", ");
}

/** Hands the address to whichever map app the visitor's device prefers. */
export function directionsHref(office: Office): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    formatAddress(office),
  )}`;
}
