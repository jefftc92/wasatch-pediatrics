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
import { PILLAR_MENU_IDS, type SectionNav } from "./header.ts";
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
 * The breadcrumb trail, as it appears inside a hero band.
 *
 * It had a strip of its own under the section bar for a while. That strip cost
 * every page 50px of chrome to say something the hero could carry for nothing,
 * and it pushed the photograph further down the page. Here it sits on the same
 * wash the title does, so it reads against any picture underneath.
 */
function heroCrumbs(crumbs: Crumb[]): string {
  const items = crumbs
    .map((crumb) =>
      crumb.href
        ? `<li><a href="${crumb.href}">${escapeAttribute(crumb.name)}</a></li>`
        : `<li>${escapeAttribute(crumb.name)}</li>`,
    )
    .join("");

  return `<nav class="crumbs hero-crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${items}</ol></nav>`;
}

function dentalCrumbs(crumbs: Crumb[]): string {
  return heroCrumbs(crumbs);
}

/**
 * The band a page's title sits in.
 *
 * It was a flat blue rectangle, which is what the theme does for every interior
 * page. On a service that is the one place a picture earns its keep: these are
 * pages about being looked after, and the migrated dentistry pages had proved
 * the pattern already — so this is the same band they use, with the service's
 * own photograph behind it.
 *
 * A page with no photograph gets `.dent-hero-plain`, which is the wash alone —
 * near enough to the old blue rectangle that nothing regresses.
 */
function heroSection(
  title: string,
  crumbs: Crumb[],
  art?: { hero?: string; eyebrow?: string; lead?: string },
): string {
  const image = art?.hero
    ? `<img class="dent-hero-img" src="${art.hero}" alt="" aria-hidden="true" loading="eager" decoding="async" />`
    : "";
  const eyebrow = art?.eyebrow
    ? `<p class="dent-hero-eyebrow">${escapeAttribute(art.eyebrow)}</p>`
    : "";
  const lead = art?.lead
    ? `<p class="dent-hero-lead">${escapeAttribute(art.lead)}</p>`
    : "";

  return `<div class="dent-hero${art?.hero ? "" : " dent-hero-plain"}">
	${image}
	<div class="dent-hero-wash"></div>
	<div class="container dent-hero-inner">
		${heroCrumbs(crumbs)}
		${eyebrow}
		<h1 class="dent-hero-title">${title}</h1>
		${lead}
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

/** Links across to the other three pillars, on every hub and service page. */
/**
 * The pages alongside this one, as cards at the foot of the page.
 *
 * The strip above the title and the pills on the hero both did this job and
 * both were wrong for it: a bar of small links between the nav and the page's
 * own name reads as a third menu, and there is no room for one. Cards at the
 * end are where somebody is when they have finished reading and want the next
 * thing, which is when sideways movement is actually wanted.
 */
function siblingCards(
  heading: string,
  items: Array<{ name: string; href: string; blurb?: string }>,
  currentHref: string,
  bg = "graybg",
): string {
  const others = items.filter((item) => item.href !== currentHref);
  if (others.length < 1) return "";

  const cards = others
    .map(
      (item) => `<div class="col-lg-4 col-md-6">
	<div class="svc-card">
		<h2 class="svc-card-title"><a href="${item.href}">${escapeAttribute(item.name)}</a></h2>
		${item.blurb ? `<p class="svc-card-blurb">${escapeAttribute(item.blurb)}</p>` : ""}
	</div>
</div>`,
    )
    .join("\n");

  return `<div class="${bg} padme90 svc-index">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">${escapeAttribute(heading)}</h2>
			</div>
		</div>
		<div class="row">
${cards}
		</div>
	</div>
</div>`;
}

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
 * The section descriptor for any page inside a pillar.
 *
 * Every level of the tree builds the same bar — the pillar named on the left,
 * its services across it, and the topics of whichever service you point at in
 * the flyout — so the chrome does not change shape as you go deeper. What
 * changes is which item is marked and what the breadcrumb strip says.
 */
function sectionFor(
  pillar: Pillar,
  crumbs: Crumb[],
  currentService?: Service,
): SectionNav {
  return {
    name: pillar.name,
    href: pillar.href,
    crumbs,
    items: servicesInPillar(pillar.slug).map((service) => ({
      name: service.name,
      href: serviceHref(service),
      current: service.slug === currentService?.slug,
      groups: (service.topics ?? []).map((topic) => ({
        name: topic.name,
        href: topicHref(service, topic),
        pages: topic.items.map((item) => ({
          name: item.name,
          href: topicItemHref(service, topic, item),
        })),
      })),
    })),
  };
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

  const body =
    storedContent === undefined
      ? `<div class="whitebg svc-intro">
	<div class="container">
		<div class="row">
			<div class="col-lg-9">
				<div class="pagebody">
					<p>${escapeAttribute(pillar.intro)}</p>
				</div>
			</div>
		</div>
	</div>
</div>`
      : withoutTitleBand(storedContent);

  /*
   * No index of the pillar's services here. The hub carried one as a grid of
   * tiles directly under the hero, which was the way in before the section bar
   * existed; the bar now names the same services in the same order on this page
   * and on every page below it, so the grid was the second copy.
   */
  return `${pillarHero(pillar, crumbs)}
${body}
${otherPillars(pillar.slug)}`;
}

/** The hub's own hero: the pillar's photograph, name and opening line. */
function pillarHero(pillar: Pillar, crumbs: Crumb[]): string {
  return heroSection(escapeAttribute(pillar.name), crumbs, {
    hero: pillar.hero,
    eyebrow: "Services",
    lead: pillar.blurb,
  });
}

/**
 * A stored landing page with its `.bluebg` title band removed.
 *
 * Both kinds of pillar page used to start with one — a stored page because that
 * is how the live site builds a title, a generated one because `heroSection`
 * did. The hub now draws its own photographic band, so the stored rectangle
 * would be a second title above the page's copy.
 *
 * The band is found by counting div tags rather than by matching whatever
 * follows it, which differs between the stored pages. A page without one is
 * returned untouched.
 */
function withoutTitleBand(markup: string): string {
  const open = markup.indexOf('<div class="bluebg"');
  if (open === -1) return markup;

  const tag = /<div\b|<\/div>/g;
  tag.lastIndex = open;
  let depth = 0;
  let match: RegExpExecArray | null;
  while ((match = tag.exec(markup))) {
    depth += match[0] === "</div>" ? -1 : 1;
    if (depth === 0) {
      return markup.slice(0, open) + markup.slice(match.index + match[0].length);
    }
  }
  return markup;
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


  // The body is white, so the sections after it alternate grey and white
  // rather than running together into one long grey block.
  const siblingSection = (bg: string) =>
    siblingCards(
      `More in ${pillar.name}`,
      servicesInPillar(pillar.slug).map((other) => ({
        name: other.name,
        href: serviceHref(other),
        blurb: other.blurb,
      })),
      serviceHref(service),
      bg,
    );

  /*
   * The way on goes directly under the hero rather than at the foot. On a
   * service that is its own topics if it has any, and the pillar's other
   * services if it does not — one set, whichever is the level below where you
   * are standing. The rest of the page follows it.
   */
  const hasTopics = Boolean(service.topics?.length);
  const navSection = hasTopics
    ? topicSectionsFor("whitebg")
    : siblingSection("whitebg");

  const sections = [
    ...(hasTopics ? [siblingSection] : []),
    teamSection,
    otherPillarsSection,
  ]
    .reduce<string[]>((out, build) => {
      const markup = build(out.length % 2 === 0 ? "graybg" : "whitebg");
      if (markup) out.push(markup);
      return out;
    }, [])
    .join("\n");

  const head = heroSection(escapeAttribute(service.name), crumbs, {
    hero: service.hero ?? pillar.hero,
    eyebrow: pillar.name,
    lead: service.blurb,
  });

  /*
   * A migrated service brings its own bands, and the topic shelf, the team and
   * the other pillars follow them.
   */
  if (migrated) {
    return `${renderDentalPage(
      migrated,
      service.name,
      dentalCrumbs(crumbs),
      { name: service.name, href: serviceHref(service) },
      pillar,
      navSection,
    )}
${sections}`;
  }

  return `${head}
${navSection}
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


  const crumbs: Crumb[] = [
    { name: pillar.name, href: pillar.href },
    { name: service.name, href: serviceHref(service) },
    { name: topic.name },
  ];

  const migrated = dentalPage(topicHref(service, topic));

  const items = topic.items.length
    ? `<div class="whitebg padme90 svc-index">
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

  const navSection = topic.items.length
    ? items
    : siblingCards(
        `More in ${service.name}`,
        (service.topics ?? []).map((other) => ({
          name: other.name,
          href: topicHref(service, other),
          blurb: other.blurb,
        })),
        topicHref(service, topic),
        "whitebg",
      );

  const tail = topic.items.length
    ? siblingCards(
        `More in ${service.name}`,
        (service.topics ?? []).map((other) => ({
          name: other.name,
          href: topicHref(service, other),
          blurb: other.blurb,
        })),
        topicHref(service, topic),
        "graybg",
      )
    : "";

  const head = heroSection(escapeAttribute(topic.name), crumbs, {
    hero: service.hero ?? pillar.hero,
    eyebrow: service.name,
    lead: topic.blurb,
  });

  /*
   * A migrated topic keeps its own bands and puts the list of pages under them,
   * on grey so it reads as a shelf below the page rather than part of it.
   */
  if (migrated) {
    return `${renderDentalPage(
      migrated,
      topic.name,
      dentalCrumbs(crumbs),
      { name: service.name, href: serviceHref(service) },
      pillar,
      navSection,
    )}
${tail}
${otherPillars(pillar.slug, tail ? "whitebg" : "graybg")}`;
  }

  return `${head}
${navSection}
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
${tail}
${otherPillars(pillar.slug, tail ? "whitebg" : "graybg")}`;
}

/** The deepest page: one question, answered. */
export function renderTopicItemPage(
  service: Service,
  topic: Topic,
  item: TopicItem,
): string {
  const pillar = pillarBySlug.get(service.pillar);
  if (!pillar) throw new Error(`unknown pillar: ${service.pillar}`);

  const navSection = siblingCards(
    `More in ${topic.name}`,
    topic.items.map((other) => ({
      name: other.name,
      href: topicItemHref(service, topic, other),
      blurb: other.blurb,
    })),
    topicItemHref(service, topic, item),
    "whitebg",
  );

  const crumbs: Crumb[] = [
    { name: pillar.name, href: pillar.href },
    { name: service.name, href: serviceHref(service) },
    { name: topic.name, href: topicHref(service, topic) },
    { name: item.name },
  ];

  const head = heroSection(escapeAttribute(item.name), crumbs, {
    hero: service.hero ?? pillar.hero,
    eyebrow: topic.name,
    lead: item.blurb,
  });
  const migrated = dentalPage(topicItemHref(service, topic, item));

  if (migrated) {
    return `${renderDentalPage(
      migrated,
      item.name,
      dentalCrumbs(crumbs),
      { name: service.name, href: serviceHref(service) },
      pillar,
      navSection,
    )}
${otherPillars(pillar.slug, "graybg")}`;
  }

  return `${head}
${navSection}
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
${otherPillars(pillar.slug, "graybg")}`;
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

  return `${heroSection("Services", [{ name: "Services" }], {
    hero: "/wp-content/uploads/2022/05/WAS21-0020_Website_Header_New-Patients_v1.jpg",
    eyebrow: "Wasatch Pediatrics",
    lead: "Medical, behavioral, nutrition and dental care for children, from newborn through the teenage years.",
  })}
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
/** The section bar for a pillar whose landing page is a copied content page. */
export function pillarSection(pillar: Pillar): SectionNav {
  return sectionFor(pillar, [{ name: pillar.name }]);
}

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
    section: sectionFor(pillar, [{ name: pillar.name }]),
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
    section: sectionFor(
      pillar,
      [{ name: pillar.name, href: pillar.href }, { name: service.name }],
      service,
    ),
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
    section: sectionFor(
      pillar,
      [
        { name: pillar.name, href: pillar.href },
        { name: service.name, href: serviceHref(service) },
        { name: topic.name },
      ],
      service,
    ),
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
    section: sectionFor(
      pillar,
      [
        { name: pillar.name, href: pillar.href },
        { name: service.name, href: serviceHref(service) },
        { name: topic.name, href: topicHref(service, topic) },
        { name: item.name },
      ],
      service,
    ),
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
