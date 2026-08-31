/**
 * Pages for a service in a particular city.
 *
 * The point of one of these pages is the last section on it. A parent in
 * Cottonwood Heights already knows what a checkup is; what they do not know is
 * whether Willow Creek or the Murray office is the better morning, and no page
 * that serves the whole Wasatch Front can tell them. So each page answers the
 * same six questions the service page answers — what, who, why, when, how,
 * where — but answers them from one city, and ends by working through the
 * office choice with real distances and a real drive.
 *
 * Three things keep these from being the thin, duplicated city pages that
 * search engines rightly treat as spam, and all three are enforced here rather
 * than left to good intentions:
 *
 *   - A page is only built when `areaContent.ts` carries copy written for that
 *     city. There is no template with a name substituted into it, and a city
 *     with nothing of its own to say gets no page.
 *   - The office pairing and the distances come from `serviceAreas.ts`, which
 *     works them out from the coordinates in `offices.ts`.
 *   - The headings name the city, and each section opens by answering the
 *     question the heading asks, so the page is readable from any entry point.
 *
 * The layout is the one `renderDentalPage` builds, because these are long-form
 * pages and that is the site's long-form layout. Nothing new was invented for
 * them.
 */

import { googleMapsId, googleMapsKey } from "../build.ts";
import { areaContent, type AreaCopy } from "../data/areaContent.ts";
import { providers, type Provider } from "../data/providers.ts";
import { directionsHref, formatAddress, offices } from "../data/offices.ts";
import {
  serviceAreas,
  type AreaOffice,
  type ServiceArea,
} from "../data/serviceAreas.ts";
import {
  locationIds,
  locationNames,
  pillarBySlug,
  type Pillar,
  type Service,
} from "../data/services.ts";
import type { DentalPage } from "../data/dentalContent.ts";
import { renderDentalPage } from "./dental.ts";
import { escapeAttribute } from "./generated.ts";

const officeBySlug = new Map(offices.map((office) => [office.slug, office]));

/** /medical-care/well-child/murray/ */
export function areaHref(service: Service, area: ServiceArea): string {
  const pillar = pillarBySlug.get(service.pillar);
  if (!pillar) throw new Error(`unknown pillar: ${service.pillar}`);
  return `${pillar.href}${service.slug}/${area.slug}/`;
}

/** "Well Child Checkups in Murray, Utah" — the H1 and the title. */
export function areaTitle(service: Service, area: ServiceArea): string {
  return `${service.name} in ${area.name}, ${area.state}`;
}

/**
 * The cities this service has pages for: the ones the copy was written for,
 * in the order `serviceAreas.ts` lists them, which is by county and then by
 * geography rather than alphabetically.
 */
export function areasForService(service: Service): ServiceArea[] {
  if (!service.serviceAreas) return [];
  const copy = areaContent[service.slug];
  if (!copy) return [];
  return serviceAreas.filter((area) => copy[area.slug]);
}

export function areaCopy(
  service: Service,
  area: ServiceArea,
): AreaCopy | undefined {
  return areaContent[service.slug]?.[area.slug];
}

/* ------------------------------------------------------------ headings -- */

/**
 * The heading for each section.
 *
 * A parent's question, in a parent's words, addressed to us — "What do you
 * check during a well-child visit?" rather than "What a visit covers". A
 * heading that asks something is the only kind a reader can skim and still know
 * what they are about to get, and phrasing it the way somebody would type it
 * into a search box costs nothing.
 *
 * The city appears in three of the six. Putting it in all of them reads as
 * machinery; the three it belongs in are the ones whose answer genuinely
 * changes from one city to the next.
 */
function headings(
  service: Service,
  area: ServiceArea,
): Record<"what" | "who" | "why" | "when" | "how" | "where", string> {
  const visit = service.visitNoun ?? service.name.toLowerCase().replace(/s$/, "");
  return {
    what: `What do you check during a ${visit}?`,
    who: "Who will my child see?",
    why: `Why do these visits matter for families in ${area.name}?`,
    when: "When should my child come in?",
    how: `How do I book a visit from ${area.name}?`,
    where: `Which office is closest to ${area.name}?`,
  };
}

/* ------------------------------------------------------------------ map -- */

/**
 * Which offices go on the map: every one within twelve miles, at least one and
 * at most three.
 *
 * The page's copy and the map answer different questions, so they are allowed
 * to carry different numbers of offices. The copy can usefully name a fallback
 * thirty miles away — from Kamas, an office in the valley is worth knowing
 * about even though nobody drives it for a checkup. A map cannot: plotting that
 * pin zooms the view out until Kamas and Park City are the same dot, and the
 * one thing the map is for — showing how near the near office is — is lost.
 *
 * Twelve miles is where that starts to happen along this valley. The floor of
 * one keeps a map on the pages where nothing else is close.
 */
export function plottedOffices(area: ServiceArea): AreaOffice[] {
  const near = area.offices.filter((office) => office.miles <= 12);
  return (near.length ? near : area.offices.slice(0, 1)).slice(0, 3);
}

/**
 * The map band: the city, and the offices worth driving to from it.
 *
 * It sits directly above the office cards, which carry the same offices as
 * text — addresses, drive times, phone numbers. That is deliberate. The map is
 * an enhancement and never the only copy of anything, so a reader with no
 * JavaScript, no Google Maps key, or a blocked maps host still has every
 * answer the band exists to give.
 */
function mapBand(area: ServiceArea, plotted: AreaOffice[]): string {
  const pins = plotted.map((entry) => {
    const office = officeBySlug.get(entry.slug)!;
    return {
      slug: office.slug,
      name: `${locationNames[office.slug] ?? office.slug} office`,
      lat: office.lat,
      lng: office.lng,
      address: formatAddress(office),
      phoneText: formatPhone(office.phone),
      phone: office.phone,
      href: `/locations/${office.slug}/`,
      drive: entry.drive,
      here: area.officeInTown === office.slug,
    };
  });

  const data = {
    city: { name: `${area.name}, ${area.state}`, lat: area.lat, lng: area.lng },
    offices: pins,
  };

  const off = googleMapsKey
    ? ""
    : `<p class="area-map-off">The map needs a Google Maps key to draw. Every office below has its address, its drive time from ${escapeAttribute(area.name)} and a phone number.</p>`;

  return `		<div class="area-mapwrap">
			<div class="area-map${googleMapsKey ? "" : " is-off"}" id="area-map" data-maps-key="${escapeAttribute(googleMapsKey)}" data-maps-id="${escapeAttribute(googleMapsId)}" data-area="${escapeAttribute(JSON.stringify(data))}">${off}</div>
		</div>
`;
}

/* ------------------------------------------------------------ providers -- */

/**
 * The pediatricians and advanced practice providers at one office.
 *
 * This list is exactly as accurate as the practice's own category data: a
 * provider appears here because they are tagged into category 12, and the
 * band above claims only that they are based at that office, not what they
 * do there. If somebody is in the wrong category on /providers/, they will be
 * in the wrong place here too, and fixing it there fixes it here.
 *
 * Category 12 is the general-pediatrics list; the therapists, dietitians and
 * dental providers are in their own categories and do not belong on a page
 * about checkups. Read from the provider data at build time, so an arrival or
 * a departure reaches these pages the moment it reaches /providers/ and there
 * is no second list of names to keep in step.
 */
export function pediatriciansAt(officeSlug: string): Provider[] {
  const id = locationIds[officeSlug];
  if (!id) return [];
  return providers.filter(
    (provider) =>
      provider.locationIds.includes(id) && provider.categoryIds.includes("12"),
  );
}

/**
 * Who your child could see, office by office.
 *
 * This is the question the copy above it cannot answer and the one a parent
 * choosing between two offices actually has. It also does something the prose
 * cannot: a Sandy page listing Draper's and Willow Creek's providers and a
 * Herriman page listing Southpoint's are different pages by construction,
 * rather than by how carefully they were written.
 */
function providerBand(area: ServiceArea, plotted: AreaOffice[]): string {
  const groups = plotted
    .map((entry) => {
      const team = pediatriciansAt(entry.slug);
      if (!team.length) return "";
      const name = locationNames[entry.slug] ?? entry.slug;
      const cards = team
        .map(
          (provider) => `				<div class="col-lg-3 col-md-4 col-6">
					<a class="area-doc" href="/providers/${provider.slug}/">
						<span class="area-doc-photo"><img src="${provider.image}" alt="" loading="lazy" width="300" height="300" /></span>
						<span class="area-doc-name">${escapeAttribute(provider.displayName || provider.name)}</span>
						<span class="area-doc-cred">${escapeAttribute(provider.credentials)}</span>
					</a>
				</div>`,
        )
        .join("\n");

      return `		<div class="row">
			<div class="col-12">
				<h3 class="area-doc-office">${escapeAttribute(name)} office <span class="area-doc-count">${team.length} provider${team.length === 1 ? "" : "s"}</span></h3>
			</div>
		</div>
		<div class="row area-doc-row">
${cards}
		</div>`;
    })
    .filter(Boolean)
    .join("\n");

  if (!groups) return "";

  /*
   * "Who your child could see" read as though the practice does the choosing.
   * It does not: a family picks who they want, and the whole point of putting
   * faces on the page is to let them. The heading says so, and carries the
   * city beside the word somebody would have typed to get here.
   */
  const heading = `Choose a pediatrician ${plotted.length > 1 ? "near" : "in"} ${escapeAttribute(area.name)}`;

  return `<div class="{{bg}} padme90 svc-index area-docs">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">${heading}</h2>
				<p class="area-index-lead">You choose who your child sees. These are the pediatricians and advanced practice providers based at the ${plotted.length > 1 ? "offices" : "office"} below — tap a name for their background, training and the ages they see.</p>
			</div>
		</div>
${groups}
	</div>
</div>`;
}

/* -------------------------------------------------------------- offices -- */

/**
 * The band that closes the page: the nearest offices as cards, with the
 * distance, the drive and the way there, then the neighbouring cities.
 *
 * Offices and neighbours share one band on one ground because they are one
 * thought — where to go, and where to look if this is not your city. Splitting
 * them would put two headings and two colour changes on what a reader takes in
 * as a single decision.
 */
function officeBand(service: Service, area: ServiceArea): string {
  const plotted = plottedOffices(area);
  /* Three offices need thirds of the row; two are better as halves. */
  const span = area.offices.length > 2 ? "col-lg-4 col-md-6" : "col-lg-6";

  const plottedSlugs = new Set(plotted.map((office) => office.slug));

  const cards = area.offices
    .map((entry, index) => {
      const office = officeBySlug.get(entry.slug);
      if (!office) return "";
      /*
       * "Cottonwood office" rather than "Cottonwood", because on the
       * Cottonwood Heights page a card headed "Cottonwood" reads as the city
       * the reader is standing in rather than an office in Murray. The word
       * turns a place name back into a name.
       */
      const name = `${locationNames[entry.slug] ?? entry.slug} office`;
      const here = area.officeInTown === entry.slug;
      const street = [office.street, office.suite].filter(Boolean).join(", ");
      /*
       * The number the pin carries, on the card that describes it. Only the
       * offices actually on the map get one — a card for an office too far to
       * plot has no pin to match, and a number pointing at nothing is worse
       * than no number.
       */
      const team = pediatriciansAt(entry.slug).length;
      const rank = plottedSlugs.has(entry.slug)
        ? `<span class="area-office-rank" aria-hidden="true">${index + 1}</span>`
        : "";

      return `			<div class="${span}">
				<div class="svc-card area-office">
					<h3 class="svc-card-title">${rank}<a href="/locations/${entry.slug}/">${escapeAttribute(name)}</a>${here ? ' <span class="area-office-tag">In town</span>' : ""}</h3>
					<p class="area-office-drive">${escapeAttribute(entry.drive)} from ${escapeAttribute(area.name)}</p>
					<p class="svc-card-blurb">${escapeAttribute(entry.landmark.charAt(0).toUpperCase() + entry.landmark.slice(1))}.</p>
					<p class="svc-card-where">${escapeAttribute(street)}, ${escapeAttribute(office.city)}, ${office.state} ${office.zip}</p>
					${team ? `<p class="area-office-team">${team} pediatrician${team === 1 ? "" : "s"} and advanced practice provider${team === 1 ? "" : "s"}</p>` : ""}
					<p class="area-office-act">
						<a class="area-office-go" href="${directionsHref(office)}" target="_blank" rel="noopener">Get directions</a>
						<a class="area-office-tel" href="tel:${office.phone}">Call ${formatPhone(office.phone)}</a>
						<a class="area-office-more" href="/locations/${entry.slug}/">Office details, hours and services</a>
					</p>
				</div>
			</div>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<div class="{{bg}} padme90 svc-index area-offices">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">Getting there from ${escapeAttribute(area.name)}</h2>
${mapBand(area, plotted)}			</div>
		</div>
		<div class="row">
${cards}
		</div>
	</div>
</div>`;
}

/** (801) 747-8700 from the digits the office record stores. */
function formatPhone(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/* ----------------------------------------------------------------- page -- */

/**
 * The city's copy in the shape the long-form renderer wants.
 *
 * No promises and no questions: the service page carries both, and repeating
 * them here would be the duplication these pages have to avoid. What is here
 * is the six sections and nothing else.
 */
function areaPage(
  service: Service,
  area: ServiceArea,
  copy: AreaCopy,
): DentalPage {
  const head = headings(service, area);

  return {
    description: copy.description,
    eyebrow: `${service.name} · ${area.county}`,
    lead: copy.lead,
    hero: service.hero,
    sections: [
      { heading: head.what, body: copy.what },
      { heading: head.who, body: copy.who },
      { heading: head.why, body: copy.why },
      { heading: head.when, body: copy.when },
      { heading: head.how, body: copy.how },
      { heading: head.where, body: copy.where },
    ],
  };
}

export function renderAreaPage(
  service: Service,
  area: ServiceArea,
  pillar: Pillar,
  crumbs: string,
): string {
  const copy = areaCopy(service, area);
  if (!copy) throw new Error(`no copy for ${service.slug}/${area.slug}`);

  return renderDentalPage(
    areaPage(service, area, copy),
    areaTitle(service, area),
    crumbs,
    { name: service.name, href: `${pillar.href}${service.slug}/` },
    pillar,
    "",
    [
      providerBand(area, plottedOffices(area)),
      officeBand(service, area),
      areaIndexBand(service, "{{bg}}"),
    ],
  );
}

/* ------------------------------------------------- the index on the hub -- */

/**
 * The list of cities, shown on the service page under its "where" section.
 *
 * Grouped by county because that is how the drive works: the choice of office
 * is a Davis County choice or a Salt Lake County choice, and a single
 * alphabetical list of twenty-seven cities hides that.
 */
export function areaIndexBand(service: Service, bg: string): string {
  const areas = areasForService(service);
  if (!areas.length) return "";

  const names: string[] = [];
  const byRegion = new Map<string, ServiceArea[]>();
  for (const area of areas) {
    if (!byRegion.has(area.region)) {
      byRegion.set(area.region, []);
      names.push(area.region);
    }
    byRegion.get(area.region)!.push(area);
  }

  /*
   * Each region gets the full width and flows its cities into columns, rather
   * than each region taking a third of the row. Three side-by-side columns made
   * the shape of the list an accident of how many cities a county happens to
   * have — seventeen down one side and three down another, with a fourth group
   * wrapping onto a line of its own.
   */
  const groups = names
    .map((region) => {
      /*
       * The registry's own order, which runs north to south down the valley
       * and then out to the mountains. Alphabetical was tried and rejected:
       * within a county the geographic run is how somebody who knows the area
       * reads it, and it keeps the two pages carrying this band identical.
       */
      const links = byRegion
        .get(region)!
        .map(
          (area) =>
            `<li><a href="${areaHref(service, area)}">${escapeAttribute(area.name)}</a></li>`,
        )
        .join("");

      return `			<div class="col-12">
				<h3 class="area-group-title">${escapeAttribute(region)}</h3>
				<ul class="area-group">${links}</ul>
			</div>`;
    })
    .join("\n");

  return `<div class="${bg} padme90 svc-index area-index">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">Areas we serve</h2>
				<p class="area-index-lead">Which office is closest, how long the drive takes, and what to weigh when two are close — city by city.</p>
			</div>
		</div>
		<div class="row">
${groups}
		</div>
	</div>
</div>`;
}

/* ----------------------------------------------------------- structured -- */

/**
 * `MedicalClinic` for each office on the page, and `Physician` for each
 * provider listed under it.
 *
 * The page already says all of this in words; the mark-up says it in the form
 * a search engine can act on, which for a local query is the difference
 * between being read and being understood. The two are generated from the same
 * data as the visible cards, so they cannot drift apart: an office that is not
 * plotted contributes no clinic node, and a provider who is not shown
 * contributes no physician node.
 *
 * `areaServed` is the city the page is about, which is the one claim here that
 * the offices themselves do not make.
 */
export function areaSchema(
  service: Service,
  area: ServiceArea,
  siteUrl: string,
): object[] {
  const nodes: object[] = [];

  for (const entry of plottedOffices(area)) {
    const office = officeBySlug.get(entry.slug);
    if (!office) continue;
    const clinicId = `${siteUrl}/locations/${office.slug}/#clinic`;
    const team = pediatriciansAt(office.slug);

    nodes.push({
      "@type": "MedicalClinic",
      "@id": clinicId,
      name: `Wasatch Pediatrics — ${locationNames[office.slug] ?? office.slug}`,
      url: `${siteUrl}/locations/${office.slug}/`,
      telephone: `+1-${office.phone.slice(0, 3)}-${office.phone.slice(3, 6)}-${office.phone.slice(6)}`,
      medicalSpecialty: "Pediatric",
      address: {
        "@type": "PostalAddress",
        streetAddress: [office.street, office.suite].filter(Boolean).join(", "),
        addressLocality: office.city,
        addressRegion: office.state,
        postalCode: office.zip,
        addressCountry: "US",
      },
      geo: { "@type": "GeoCoordinates", latitude: office.lat, longitude: office.lng },
      areaServed: {
        "@type": "City",
        name: area.name,
        containedInPlace: { "@type": "AdministrativeArea", name: `${area.county}, ${area.state}` },
      },
      availableService: {
        "@type": "MedicalProcedure",
        name: service.name,
        url: siteUrl + `${pillarBySlug.get(service.pillar)?.href ?? "/"}${service.slug}/`,
      },
      ...(team.length
        ? {
            employee: team.map((provider) => ({
              "@id": `${siteUrl}/providers/${provider.slug}/#physician`,
            })),
          }
        : {}),
    });

    for (const provider of team) {
      nodes.push({
        "@type": "Physician",
        "@id": `${siteUrl}/providers/${provider.slug}/#physician`,
        name: provider.displayName || provider.name,
        url: `${siteUrl}/providers/${provider.slug}/`,
        ...(provider.image ? { image: siteUrl + provider.image } : {}),
        medicalSpecialty: "Pediatric",
        worksFor: { "@id": clinicId },
      });
    }
  }

  return nodes;
}

/** Everything a city page contributes to the site search. */
export function areaSearchText(copy: AreaCopy): string {
  return [copy.lead, ...copy.what, ...copy.who, ...copy.why, ...copy.when, ...copy.how, ...copy.where].join(" ");
}
