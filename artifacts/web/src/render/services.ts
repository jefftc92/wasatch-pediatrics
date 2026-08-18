/**
 * Pillar hub pages and service pages.
 *
 * Both are generated from `src/data/services.ts`, so adding a service to the
 * registry adds its menu entry, its card on the hub, and its page — there is no
 * second place to update.
 *
 * Two of the four pillars already have a landing page copied from the live site
 * (`/behavioral-health/` and `/dentistry-orthodontics/`). Those keep their own
 * markup and get the generated index appended, so no copy is lost; the other
 * two are generated in full.
 */

import {
  locationHref,
  locationIds,
  locationNames,
  pillarBySlug,
  pillars,
  services,
  serviceHref,
  servicesInPillar,
  type Pillar,
  type Service,
} from "../data/services.ts";
import { providers } from "../data/providers.ts";
import { PILLAR_MENU_IDS } from "./header.ts";
import type { GeneratedPage } from "./generated.ts";
import type { SearchEntry } from "../data/searchIndex.ts";
import {
  authoredBody,
  escapeAttribute,
  renderBreadcrumbs,
  type Crumb,
} from "./generated.ts";
import { renderProviderCard } from "./providers.ts";

/** Providers who offer this service, by category and by where they work. */
export function providersForService(service: Service) {
  if (!service.providerCategory) return [];
  const pillar = pillarBySlug.get(service.pillar);
  const wanted =
    pillar?.providerLocationIds ??
    service.locations.map((slug) => locationIds[slug] ?? "");
  return providers.filter(
    (provider) =>
      provider.categoryIds.includes(service.providerCategory as string) &&
      provider.locationIds.some((id) => wanted.includes(id)),
  );
}

function heroSection(title: string, crumbs: Crumb[]): string {
  return `<div class="bluebg">
	<div class="container">
		<div class="row">
			<div class="col-12">
				${renderBreadcrumbs(crumbs)}
				<h1 class="interiorpagetitle">${title}</h1>
			</div>
		</div>
	</div>
</div>`;
}

function serviceCard(service: Service): string {
  const offices =
    service.locations.length === 8
      ? "All eight offices"
      : `${service.locations.length} office${service.locations.length === 1 ? "" : "s"}`;

  return `<div class="col-lg-4 col-md-6">
	<div class="svc-card">
		<h2 class="svc-card-title"><a href="${serviceHref(service)}">${escapeAttribute(service.name)}</a></h2>
		<p class="svc-card-blurb">${escapeAttribute(service.blurb)}</p>
		<p class="svc-card-where">${offices}</p>
		<a class="btn blue" href="${serviceHref(service)}">Learn more</a>
	</div>
</div>`;
}

/** The card grid of everything in a pillar. */
export function renderServiceIndex(pillar: Pillar, heading: string): string {
  const cards = servicesInPillar(pillar.slug).map(serviceCard).join("\n");

  return `<div class="whitebg padme90 svc-index">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">${heading}</h2>
			</div>
		</div>
		<div class="row">
${cards}
		</div>
	</div>
</div>`;
}

/** Links across to the other three pillars, on every hub and service page. */
function otherPillars(current: string): string {
  const links = pillars
    .filter((pillar) => pillar.slug !== current)
    .map(
      (pillar) =>
        `<li><a href="${pillar.href}"><span class="svc-other-name">${escapeAttribute(pillar.name)}</span><span class="svc-other-blurb">${escapeAttribute(pillar.blurb)}</span></a></li>`,
    )
    .join("");

  return `<div class="graybg padme50 svc-other">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">Other ways we help</h2>
				<ul class="svc-other-list">${links}</ul>
			</div>
		</div>
	</div>
</div>`;
}

/**
 * A pillar landing page. `storedContent` is the copied page body for the two
 * pillars that already have one; the generated index follows it.
 */
export function renderPillarPage(
  pillar: Pillar,
  storedContent?: string,
): string {
  const crumbs: Crumb[] = [{ name: pillar.name }];

  const opening =
    storedContent ??
    `${heroSection(escapeAttribute(pillar.name), crumbs)}
<div class="whitebg svc-intro">
	<div class="container">
		<div class="row">
			<div class="col-lg-9">
				<div class="pagebody">
					<p>${escapeAttribute(pillar.intro)}</p>
				</div>
			</div>
		</div>
	</div>
</div>`;

  return `${opening}
${renderServiceIndex(pillar, storedContent ? `Explore ${pillar.name}` : "What we offer")}
${otherPillars(pillar.slug)}`;
}

function locationList(service: Service, pillar: Pillar): string {
  const items = service.locations
    .map((slug) => {
      const name = locationNames[slug] ?? slug;
      const href = pillar.locationsHref ?? locationHref(slug);
      return `<li><a href="${href}">${name}</a></li>`;
    })
    .join("");

  const notes = [
    service.deliveredFrom
      ? `Appointments are held at our ${locationNames[service.deliveredFrom]} office, for families from any location.`
      : "",
    pillar.locationsNote ?? "",
  ]
    .filter(Boolean)
    .map((note) => `<p class="svc-aside-note">${note}</p>`)
    .join("");

  return `<div class="svc-aside">
	<h2 class="svc-aside-title">Where we offer this</h2>
	<ul class="svc-office-list">${items}</ul>
	${notes}
	<a class="btn green" href="/contact-us/">Schedule an appointment</a>
</div>`;
}

/** A single service page. */
export function renderServicePage(service: Service): string {
  const pillar = pillarBySlug.get(service.pillar);
  if (!pillar) throw new Error(`unknown pillar: ${service.pillar}`);

  const crumbs: Crumb[] = [
    { name: pillar.name, href: pillar.href },
    { name: service.name },
  ];

  // Services with the practice's own copy get the meta description as a lead
  // paragraph above it; the rest would only be repeating themselves.
  const body = service.bodyFile
    ? `<p class="svc-lead">${escapeAttribute(service.description)}</p>
					${authoredBody(service.bodyFile)}`
    : `<p>${escapeAttribute(service.intro ?? service.blurb)}</p>`;

  const team = providersForService(service);
  const shown = team.slice(0, 8);
  const teamSection = shown.length
    ? `<div class="graybg padme90 svc-team">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">Who provides this care</h2>
			</div>
		</div>
		<div class="row">${shown.map(renderProviderCard).join("")}</div>
		<div class="row">
			<div class="col-12 svc-team-more">
				<a class="btn blue" href="/providers/">See all providers</a>
			</div>
		</div>
	</div>
</div>`
    : "";

  const siblings = servicesInPillar(pillar.slug).filter(
    (other) => other.slug !== service.slug,
  );
  const siblingSection = siblings.length
    ? `<div class="whitebg padme50 svc-siblings">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">More in ${escapeAttribute(pillar.name)}</h2>
				<ul class="svc-sibling-list">${siblings
          .map(
            (other) =>
              `<li><a href="${serviceHref(other)}">${escapeAttribute(other.name)}</a></li>`,
          )
          .join("")}</ul>
			</div>
		</div>
	</div>
</div>`
    : "";

  return `${heroSection(escapeAttribute(service.name), crumbs)}
<div class="whitebg padme90 svc-body">
	<div class="container">
		<div class="row">
			<div class="col-lg-8">
				<div class="pagebody" style="margin-top:0px">
					${body}
				</div>
			</div>
			<div class="col-lg-4">
				${locationList(service, pillar)}
			</div>
		</div>
	</div>
</div>
${teamSection}
${siblingSection}
${otherPillars(pillar.slug)}`;
}

/* --------------------------------------------------------------- routing -- */

/** WordPress puts these on any page built from the flexible page template. */
const BODY_CLASS =
  "wp-singular page-template page-template-page-flex page-template-page-flex-php page wp-theme-wasatch";

/** Services is an ancestor of every page below, so its item stays highlighted. */
function menuState(pillarSlug: string) {
  return {
    classes: {
      "111":
        "menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-111",
    },
    currentIds: [PILLAR_MENU_IDS[pillarSlug] ?? pillarSlug],
  };
}

/** Pillars whose landing page this project renders in full. */
export const generatedPillars = pillars.filter((pillar) => !pillar.contentSlug);

/** Pillars that append their index to a page copied from the live site. */
export const pillarByContentSlug = new Map(
  pillars
    .filter((pillar) => pillar.contentSlug)
    .map((pillar) => [pillar.contentSlug as string, pillar]),
);

export function pillarDocument(
  pillar: Pillar,
): GeneratedPage & { route: string } {
  return {
    route: pillar.href,
    title: `${pillar.name} - Wasatch Pediatrics`,
    description: pillar.description,
    bodyClass: BODY_CLASS,
    menu: menuState(pillar.slug),
    breadcrumbs: [{ name: pillar.name }],
    content: renderPillarPage(pillar),
  };
}

export function serviceDocument(
  service: Service,
): GeneratedPage & { route: string } {
  const pillar = pillarBySlug.get(service.pillar);
  if (!pillar) throw new Error(`unknown pillar: ${service.pillar}`);

  return {
    route: serviceHref(service),
    title: `${service.name} - Wasatch Pediatrics`,
    description: service.description,
    bodyClass: BODY_CLASS,
    menu: menuState(service.pillar),
    breadcrumbs: [
      { name: pillar.name, href: pillar.href },
      { name: service.name },
    ],
    content: renderServicePage(service),
  };
}

/** Every route this module owns: the generated hubs, and all service pages. */
export function serviceRoutes(): Array<GeneratedPage & { route: string }> {
  return [
    ...generatedPillars.map(pillarDocument),
    ...services.map(serviceDocument),
  ];
}

/* ---------------------------------------------------------------- search -- */

function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Search entries for the pages this project adds. `src/data/searchIndex.ts` is
 * regenerated from the live site and cannot know about them, so the site search
 * merges these in — built from the registry rather than from the rendered page,
 * so the shared "more in this pillar" links do not make every service match
 * every other one.
 */
export function serviceSearchEntries(): SearchEntry[] {
  const entry = (
    route: string,
    title: string,
    description: string,
    body: string,
  ): SearchEntry => ({
    route,
    title,
    type: "page",
    image: "",
    date: "",
    category: "",
    excerpt: description,
    text: plainText(`${description} ${body}`).toLowerCase(),
    links: "",
  });

  return [
    ...generatedPillars.map((pillar) =>
      entry(
        pillar.href,
        pillar.name,
        pillar.description,
        `${pillar.intro} ${servicesInPillar(pillar.slug)
          .map((service) => service.name)
          .join(" ")}`,
      ),
    ),
    ...services.map((service) =>
      entry(
        serviceHref(service),
        service.name,
        service.description,
        `${service.bodyFile ? authoredBody(service.bodyFile) : (service.intro ?? "")} ${service.locations
          .map((slug) => locationNames[slug] ?? slug)
          .join(" ")}`,
      ),
    ),
  ];
}

/** Every route the merged search index should describe rather than the copy. */
export const generatedSearchRoutes = new Set(
  serviceRoutes().map((page) => page.route),
);
