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
 *
 * Depth below a service lives on the page rather than in the menu: a service
 * with `topics` renders them as sections, each topic gets a page listing what
 * is under it, and a section nav under the header carries sideways movement at
 * whatever level you are on. The dropdown never goes past the service.
 */

import {
  ALL_SERVICES_HREF,
  locationHref,
  locationIds,
  locationNames,
  pillarBySlug,
  pillars,
  services,
  serviceHref,
  servicesInPillar,
  topicHref,
  topicItemHref,
  type Pillar,
  type Service,
  type Topic,
  type TopicItem,
} from "../data/services.ts";
import { providers } from "../data/providers.ts";
import { PILLAR_MENU_IDS } from "./header.ts";
import { dentalFaqSchema, dentalPage, renderDentalPage } from "./dental.ts";
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

/**
 * The breadcrumb trail for a migrated page, which carries it on its hero rather
 * than in a strip above one. On these pages the trail is the whole of the
 * upward navigation, so it is the one thing that has to be there.
 */
function dentalCrumbs(crumbs: Crumb[]): string {
  return `\t\t${renderBreadcrumbs(crumbs)}`;
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
function otherPillars(current: string, bg = "graybg"): string {
  const links = pillars
    .filter((pillar) => pillar.slug !== current)
    .map(
      (pillar) =>
        `<li><a href="${pillar.href}"><span class="svc-other-name">${escapeAttribute(pillar.name)}</span><span class="svc-other-blurb">${escapeAttribute(pillar.blurb)}</span></a></li>`,
    )
    .join("");

  return `<div class="${bg} padme50 svc-other">
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

  const nav = renderSectionNav(
    { name: pillar.name, href: pillar.href },
    [
      {
        items: servicesInPillar(pillar.slug).map((service) => ({
          name: service.name,
          href: serviceHref(service),
        })),
      },
    ],
    pillar.href,
  );

  return `${nav}
${opening}
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
  // paragraph above it; the rest would only be repeating themselves. Copy
  // migrated from the dentistry site carries its own lead and wins over both.
  const migrated = dentalPage(serviceHref(service));
  const body = service.bodyFile
    ? `<p class="svc-lead">${escapeAttribute(service.description)}</p>
					${authoredBody(service.bodyFile)}`
    : `<p>${escapeAttribute(service.intro ?? service.blurb)}</p>`;

  const team = providersForService(service);
  const shown = team.slice(0, 8);
  const topicSectionsFor = (bg: string) => topicSections(service, bg);
  const otherPillarsSection = (bg: string) => otherPillars(pillar.slug, bg);
  const teamSection = (bg: string) =>
    shown.length
      ? `<div class="${bg} padme90 svc-team">
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

  // Sideways movement lives in the section nav now, so the old chip list of
  // sibling services would just say the same thing twice.
  const nav = renderSectionNav(
    { name: pillar.name, href: pillar.href },
    [
      {
        items: servicesInPillar(pillar.slug).map((other) => ({
          name: other.name,
          href: serviceHref(other),
        })),
      },
      {
        label: `In ${service.name}`,
        items: (service.topics ?? []).map((topic) => ({
          name: topic.name,
          href: topicHref(service, topic),
        })),
      },
    ],
    serviceHref(service),
  );

  // The body is white, so the sections after it alternate grey and white
  // rather than running together into one long grey block.
  const sections = [topicSectionsFor, teamSection, otherPillarsSection]
    .reduce<string[]>((out, build) => {
      const markup = build(out.length % 2 === 0 ? "graybg" : "whitebg");
      if (markup) out.push(markup);
      return out;
    }, [])
    .join("\n");

  const head = `${nav}\n${heroSection(escapeAttribute(service.name), crumbs)}`;

  /*
   * A migrated service brings its own bands, and the topic shelf, the team and
   * the other pillars follow them.
   */
  if (migrated) {
    return `${renderDentalPage(migrated, service.name, dentalCrumbs(crumbs), { name: service.name, href: serviceHref(service) }, pillar)}
${sections}`;
  }

  return `${head}
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
${sections}`;
}

/* ----------------------------------------------------------- section nav -- */

export type SectionLink = { name: string; href: string };

/**
 * The bar under the main nav, showing where you are and what sits beside it.
 *
 * This is what lets the dropdown stop at two levels: sideways movement at the
 * current depth happens here instead. On a pillar hub it lists that pillar's
 * services; on a service page, its sibling services; on a topic page, the
 * sibling topics; on the deepest pages, the other pages in the same topic.
 * On a phone it scrolls sideways rather than wrapping into a wall of links.
 */
/**
 * The bar under the header that carries sideways movement inside a service.
 *
 * It used to be a single strip of whatever siblings the current page had, which
 * broke in three ways at once: on a service page it offered the *pillar's* other
 * services rather than the service's own topics, so nine orthodontic treatments
 * were unreachable from the page they belong to; three levels down it listed
 * eight siblings in a track that needed 1333px and had 873px, so it became a
 * horizontal scroller on a desktop; and at no depth did it say where you were.
 *
 * It is now a masthead for the section: the service named once, in the display
 * face, and beneath it the topics — wrapping rather than scrolling, so nothing
 * is hidden off an edge. On a page below a topic, a second row carries that
 * topic's own pages. Two rows is the most it can ever be, and together they read
 * as the path you took.
 */
export function renderSectionNav(
  section: SectionLink,
  rows: Array<{ label?: string; items: SectionLink[] }>,
  currentHref: string,
): string {
  const visible = rows.filter((row) => row.items.length);
  if (!visible.length) return "";

  const row = (items: SectionLink[], level: string) => {
    const links = items
      .map((item) => {
        // The row above the current page marks the branch it came down, so the
        // two rows together read as the path rather than as two flat lists.
        const state =
          item.href === currentHref
            ? ' class="secnav-current" aria-current="page"'
            : currentHref.startsWith(item.href)
              ? ' class="secnav-ancestor"'
              : "";
        return `<li><a href="${item.href}"${state}>${escapeAttribute(item.name)}</a></li>`;
      })
      .join("");
    return `<ul class="secnav-list secnav-${level}">${links}</ul>`;
  };

  const lists = visible
    .map((entry, index) =>
      index === 0
        ? `			${row(entry.items, "topics")}`
        : `			<div class="secnav-sub">
				${entry.label ? `<span class="secnav-sub-label">${escapeAttribute(entry.label)}</span>` : ""}
				${row(entry.items, "items")}
			</div>`,
    )
    .join("\n");

  /*
   * Collapsed on a phone, where showing everything ran to 384px — most of the
   * screen before the page began.
   *
   * It ships open and script closes it on a phone, rather than shipping closed
   * and being forced open by CSS on a desktop: a modern <details> hides its
   * content through ::details-content, which `display` on the children cannot
   * override, so the CSS-only version collapsed the bar at every width. This
   * way the no-script rendering is the honest one — everything visible — and
   * the collapse is the enhancement.
   */
  const count = visible.reduce((n, entry) => n + entry.items.length, 0);

  return `<nav class="secnav" aria-label="${escapeAttribute(section.name)}">
	<div class="container">
		<div class="secnav-inner">
			<a class="secnav-section lys" href="${section.href}">${escapeAttribute(section.name)}</a>
			<details class="secnav-browse" open>
				<summary class="secnav-summary">Browse this section<span class="secnav-count">${count}</span></summary>
				<div class="secnav-panel">
${lists}
				</div>
			</details>
		</div>
	</div>
</nav>`;
}

/* ---------------------------------------------------------------- topics -- */

function topicCard(service: Service, topic: Topic): string {
  const count = topic.items.length;
  const meta = count
    ? `<p class="svc-card-where">${count} page${count === 1 ? "" : "s"}</p>`
    : "";

  return `<div class="col-lg-4 col-md-6">
	<div class="svc-card">
		<h2 class="svc-card-title"><a href="${topicHref(service, topic)}">${escapeAttribute(topic.name)}</a></h2>
		<p class="svc-card-blurb">${escapeAttribute(topic.blurb)}</p>
		${meta}
		<a class="btn blue" href="${topicHref(service, topic)}">Learn more</a>
	</div>
</div>`;
}

/** The topic sections on a service page — the level the menu deliberately omits. */
function topicSections(service: Service, bg: string): string {
  if (!service.topics?.length) return "";

  return `<div class="${bg} padme90 svc-index">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">Explore ${escapeAttribute(service.name)}</h2>
			</div>
		</div>
		<div class="row">
${service.topics.map((topic) => topicCard(service, topic)).join("\n")}
		</div>
	</div>
</div>`;
}

/* ------------------------------------------------- topic and leaf pages -- */

function scheduleAside(service: Service, pillar: Pillar): string {
  return `<div class="svc-aside">
	<h2 class="svc-aside-title">Need to be seen?</h2>
	<p class="svc-aside-note">Call your office first — most ${escapeAttribute(service.name.toLowerCase())} are seen the same day.</p>
	<a class="btn green" href="/contact-us/">Schedule an appointment</a>
	<p class="svc-aside-note"><a href="${serviceHref(service)}">All ${escapeAttribute(service.name)}</a> &middot; <a href="${pillar.href}">${escapeAttribute(pillar.name)}</a></p>
</div>`;
}

/** A topic page: the group of pages under a service. */
export function renderTopicPage(service: Service, topic: Topic): string {
  const pillar = pillarBySlug.get(service.pillar);
  if (!pillar) throw new Error(`unknown pillar: ${service.pillar}`);

  const nav = renderSectionNav(
    { name: service.name, href: serviceHref(service) },
    [
      {
        items: (service.topics ?? []).map((other) => ({
          name: other.name,
          href: topicHref(service, other),
        })),
      },
      {
        label: `In ${topic.name}`,
        items: topic.items.map((other) => ({
          name: other.name,
          href: topicItemHref(service, topic, other),
        })),
      },
    ],
    topicHref(service, topic),
  );

  const crumbs: Crumb[] = [
    { name: pillar.name, href: pillar.href },
    { name: service.name, href: serviceHref(service) },
    { name: topic.name },
  ];

  const migrated = dentalPage(topicHref(service, topic));

  const items = topic.items.length
    ? `<div class="graybg padme90 svc-index">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">In this section</h2>
			</div>
		</div>
		<div class="row">
${topic.items
  .map(
    (item) => `<div class="col-lg-4 col-md-6">
	<div class="svc-card">
		<h2 class="svc-card-title"><a href="${topicItemHref(service, topic, item)}">${escapeAttribute(item.name)}</a></h2>
		<p class="svc-card-blurb">${escapeAttribute(item.blurb)}</p>
		<a class="btn blue" href="${topicItemHref(service, topic, item)}">Read more</a>
	</div>
</div>`,
  )
  .join("\n")}
		</div>
	</div>
</div>`
    : "";

  const head = `${nav}\n${heroSection(escapeAttribute(topic.name), crumbs)}`;

  /*
   * A migrated topic keeps its own bands and puts the list of pages under them,
   * on grey so it reads as a shelf below the page rather than part of it.
   */
  if (migrated) {
    return `${renderDentalPage(migrated, topic.name, dentalCrumbs(crumbs), { name: service.name, href: serviceHref(service) }, pillar)}
${items}
${otherPillars(pillar.slug, items ? "whitebg" : "graybg")}`;
  }

  return `${head}
<div class="whitebg padme90 svc-body">
	<div class="container">
		<div class="row">
			<div class="col-lg-8">
				<div class="pagebody" style="margin-top:0px">
					<p>${escapeAttribute(topic.intro)}</p>
				</div>
			</div>
			<div class="col-lg-4">
				${scheduleAside(service, pillar)}
			</div>
		</div>
	</div>
</div>
${items}
${otherPillars(pillar.slug, items ? "whitebg" : "graybg")}`;
}

/** The deepest page: one question, answered. */
export function renderTopicItemPage(
  service: Service,
  topic: Topic,
  item: TopicItem,
): string {
  const pillar = pillarBySlug.get(service.pillar);
  if (!pillar) throw new Error(`unknown pillar: ${service.pillar}`);

  /*
   * Three levels deep, so both rows earn their place: the first says which
   * topic of the service you are inside, the second which of its pages.
   */
  const nav = renderSectionNav(
    { name: service.name, href: serviceHref(service) },
    [
      {
        items: (service.topics ?? []).map((other) => ({
          name: other.name,
          href: topicHref(service, other),
        })),
      },
      {
        label: `In ${topic.name}`,
        items: topic.items.map((other) => ({
          name: other.name,
          href: topicItemHref(service, topic, other),
        })),
      },
    ],
    topicItemHref(service, topic, item),
  );

  const crumbs: Crumb[] = [
    { name: pillar.name, href: pillar.href },
    { name: service.name, href: serviceHref(service) },
    { name: topic.name, href: topicHref(service, topic) },
    { name: item.name },
  ];

  const head = `${nav}\n${heroSection(escapeAttribute(item.name), crumbs)}`;
  const migrated = dentalPage(topicItemHref(service, topic, item));

  if (migrated) {
    return `${renderDentalPage(migrated, item.name, dentalCrumbs(crumbs), { name: service.name, href: serviceHref(service) }, pillar)}
${otherPillars(pillar.slug)}`;
  }

  return `${head}
<div class="whitebg padme90 svc-body">
	<div class="container">
		<div class="row">
			<div class="col-lg-8">
				<div class="pagebody" style="margin-top:0px">
					<p class="svc-lead">${escapeAttribute(item.blurb)}</p>
					<p class="svc-pending">This page is waiting on the practice's own words. The
					copy for it already exists on the dentistry site and is queued for
					migration — the page, its place in the menu and its links are in
					place so the copy can drop straight in.</p>
				</div>
			</div>
			<div class="col-lg-4">
				${scheduleAside(service, pillar)}
			</div>
		</div>
	</div>
</div>
${otherPillars(pillar.slug)}`;
}

/* --------------------------------------------------- all services index -- */

/**
 * Every service on one page, filtered by pillar.
 *
 * The whole list is in the markup and the filter only hides rows, so a crawler
 * (and anyone without JavaScript) still sees all of it.
 */
export function renderAllServices(): string {
  const chips = [
    `<button type="button" class="svc-chip is-on" data-pillar="">Everything</button>`,
    ...pillars.map(
      (pillar) =>
        `<button type="button" class="svc-chip" data-pillar="${pillar.slug}">${escapeAttribute(pillar.name)}</button>`,
    ),
  ].join("");

  const cards = services
    .map((service) => {
      const pillar = pillarBySlug.get(service.pillar);
      const offices =
        service.locations.length === 8
          ? "All eight offices"
          : `${service.locations.length} office${service.locations.length === 1 ? "" : "s"}`;

      return `<div class="col-lg-4 col-md-6 svc-hit" data-pillar="${service.pillar}">
	<div class="svc-card">
		<p class="svc-card-pillar"><a href="${pillar?.href ?? "/services/"}">${escapeAttribute(pillar?.name ?? "")}</a></p>
		<h2 class="svc-card-title"><a href="${serviceHref(service)}">${escapeAttribute(service.name)}</a></h2>
		<p class="svc-card-blurb">${escapeAttribute(service.blurb)}</p>
		<p class="svc-card-where">${offices}</p>
		<a class="btn blue" href="${serviceHref(service)}">Learn more</a>
	</div>
</div>`;
    })
    .join("\n");

  return `${heroSection("Services", [{ name: "Services" }])}
<div class="whitebg svc-intro">
	<div class="container">
		<div class="row">
			<div class="col-lg-9">
				<div class="pagebody">
					<p>Everything we offer, in one place. Filter by the kind of care you are
					looking for, or browse the lot.</p>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="whitebg padme90 svc-index">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<div class="svc-chips">${chips}</div>
			</div>
		</div>
		<div class="row" id="svc-results">
${cards}
		</div>
		<div class="row">
			<div class="col-12">
				<p class="svc-empty" hidden>Nothing matches that filter.</p>
			</div>
		</div>
	</div>
</div>`;
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
    ...migratedMeta(serviceHref(service)),
  };
}

/** Every route this module owns: the generated hubs, and all service pages. */
export function topicDocument(
  service: Service,
  topic: Topic,
): GeneratedPage & { route: string } {
  const pillar = pillarBySlug.get(service.pillar);
  if (!pillar) throw new Error(`unknown pillar: ${service.pillar}`);

  return {
    route: topicHref(service, topic),
    title: `${topic.name} - Wasatch Pediatrics`,
    description: topic.description,
    bodyClass: BODY_CLASS,
    menu: menuState(service.pillar),
    breadcrumbs: [
      { name: pillar.name, href: pillar.href },
      { name: service.name, href: serviceHref(service) },
      { name: topic.name },
    ],
    content: renderTopicPage(service, topic),
    ...migratedMeta(topicHref(service, topic)),
  };
}

export function topicItemDocument(
  service: Service,
  topic: Topic,
  item: TopicItem,
): GeneratedPage & { route: string } {
  const pillar = pillarBySlug.get(service.pillar);
  if (!pillar) throw new Error(`unknown pillar: ${service.pillar}`);

  return {
    route: topicItemHref(service, topic, item),
    title: `${item.name} - Wasatch Pediatrics`,
    description: item.blurb,
    bodyClass: BODY_CLASS,
    menu: menuState(service.pillar),
    breadcrumbs: [
      { name: pillar.name, href: pillar.href },
      { name: service.name, href: serviceHref(service) },
      { name: topic.name, href: topicHref(service, topic) },
      { name: item.name },
    ],
    content: renderTopicItemPage(service, topic, item),
    ...migratedMeta(topicItemHref(service, topic, item)),
  };
}


/**
 * What a migrated page contributes to its document beyond the body: the
 * dentistry site's own meta description, which is written for the page rather
 * than reused from a card blurb, and a FAQPage node for the questions it
 * answers. Returns nothing for a route with no migrated copy.
 */
function migratedMeta(
  route: string,
): { description?: string; extraSchema?: object[] } {
  const migrated = dentalPage(route);
  if (!migrated) return {};

  const faq = dentalFaqSchema(migrated);
  return {
    ...(migrated.description ? { description: migrated.description } : {}),
    ...(faq ? { extraSchema: [faq] } : {}),
  };
}

export function allServicesDocument(): GeneratedPage & { route: string } {
  return {
    route: ALL_SERVICES_HREF,
    title: "Services - Wasatch Pediatrics",
    description:
      "Every service Wasatch Pediatrics offers, from Well Child Checkups and behavioral health to nutrition, dentistry and orthodontics — filterable by the kind of care you need.",
    bodyClass: BODY_CLASS,
    menu: {
      classes: {
        "111":
          "menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-111",
      },
      currentIds: [],
    },
    breadcrumbs: [{ name: "Services" }],
    content: renderAllServices(),
  };
}

/** Every route this module owns, from the index down to the deepest page. */
export function serviceRoutes(): Array<GeneratedPage & { route: string }> {
  const deep: Array<GeneratedPage & { route: string }> = [];
  for (const service of services) {
    for (const topic of service.topics ?? []) {
      deep.push(topicDocument(service, topic));
      for (const item of topic.items) {
        deep.push(topicItemDocument(service, topic, item));
      }
    }
  }

  return [
    allServicesDocument(),
    ...generatedPillars.map(pillarDocument),
    ...services.map(serviceDocument),
    ...deep,
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
    /*
     * The pages below a service. These carry most of the dentistry copy, and
     * without them a search for "knocked-out tooth" reached the pillar and
     * stopped. A migrated page is searched on its own words; one still waiting
     * on copy has only its name and blurb to offer.
     */
    ...services.flatMap((service) =>
      (service.topics ?? []).flatMap((topic) => [
        entry(
          topicHref(service, topic),
          topic.name,
          dentalPage(topicHref(service, topic))?.description ??
            topic.description,
          searchText(topicHref(service, topic), topic.intro),
        ),
        ...topic.items.map((item) =>
          entry(
            topicItemHref(service, topic, item),
            item.name,
            dentalPage(topicItemHref(service, topic, item))?.description ??
              item.blurb,
            searchText(topicItemHref(service, topic, item), item.blurb),
          ),
        ),
      ]),
    ),
  ];
}

/** Everything a migrated page says, flattened; its blurb if it has no copy. */
function searchText(route: string, fallback: string): string {
  const migrated = dentalPage(route);
  if (!migrated) return fallback;

  return [
    migrated.lead,
    ...(migrated.promises ?? []).map((p) => `${p.title} ${p.text}`),
    ...migrated.sections.flatMap((section) => [
      section.heading,
      ...(section.body ?? []),
      ...(section.steps ?? []).map((step) => `${step.title} ${step.text}`),
      section.callout ? `${section.callout.title} ${section.callout.text}` : "",
    ]),
    migrated.reassurance ?? "",
    ...(migrated.faqs ?? []).map((f) => `${f.q} ${f.a}`),
  ].join(" ");
}

/** Every route the merged search index should describe rather than the copy. */
export const generatedSearchRoutes = new Set(
  serviceRoutes().map((page) => page.route),
);
