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

import { areaContent, type AreaCopy } from "../data/areaContent.ts";
import { offices } from "../data/offices.ts";
import {
  serviceAreas,
  type ServiceArea,
} from "../data/serviceAreas.ts";
import {
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
 * The heading for each section, with the city in it.
 *
 * They are questions because the copy answers questions, and a heading that
 * asks one is the only kind a reader can skim and still know what they are
 * about to get. The city appears in three of the six rather than all of them:
 * repeating it in every heading reads as machinery, and the two that matter
 * most for someone comparing offices are the last two.
 */
function headings(service: Service, area: ServiceArea): Record<keyof AreaCopy & ("what"|"who"|"why"|"when"|"how"|"where"), string> {
  const lower = service.name.toLowerCase();
  return {
    what: `What does a ${lower.replace(/s$/, "")} cover?`,
    who: "Who will my child see?",
    why: `Why do these visits matter for ${area.name} families?`,
    when: "When should we come in?",
    how: `How do we book from ${area.name}?`,
    where: `Where do we go, and which office?`,
  };
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
  const cards = area.offices
    .map((entry) => {
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

      return `			<div class="col-lg-6">
				<div class="svc-card area-office">
					<h3 class="svc-card-title"><a href="/locations/${entry.slug}/">${escapeAttribute(name)}</a>${here ? ' <span class="area-office-tag">In town</span>' : ""}</h3>
					<p class="area-office-drive">${escapeAttribute(entry.drive)} from ${escapeAttribute(area.name)}</p>
					<p class="svc-card-blurb">${escapeAttribute(entry.landmark.charAt(0).toUpperCase() + entry.landmark.slice(1))}.</p>
					<p class="svc-card-where">${escapeAttribute(street)}, ${escapeAttribute(office.city)}, ${office.state} ${office.zip}</p>
					<p class="area-office-act"><a href="tel:${office.phone}">${formatPhone(office.phone)}</a></p>
				</div>
			</div>`;
    })
    .filter(Boolean)
    .join("\n");

  const neighbours = areasForService(service)
    .filter((other) => other.slug !== area.slug && other.region === area.region)
    .map(
      (other) =>
        `<li><a href="${areaHref(service, other)}">${escapeAttribute(other.name)}</a></li>`,
    )
    .join("");

  const nearby = neighbours
    ? `		<div class="row">
			<div class="col-12">
				<h3 class="area-nearby-title">${escapeAttribute(service.name)} elsewhere in ${escapeAttribute(area.region)}</h3>
				<ul class="area-nearby">${neighbours}</ul>
			</div>
		</div>`
    : "";

  return `<div class="{{bg}} padme90 svc-index area-offices">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">Getting there from ${escapeAttribute(area.name)}</h2>
			</div>
		</div>
		<div class="row">
${cards}
		</div>
${nearby}	</div>
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
    [officeBand(service, area)],
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

/** Everything a city page contributes to the site search. */
export function areaSearchText(copy: AreaCopy): string {
  return [copy.lead, ...copy.what, ...copy.who, ...copy.why, ...copy.when, ...copy.how, ...copy.where].join(" ");
}
