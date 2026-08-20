/**
 * The locations index: a map of the eight offices, and what each one offers.
 *
 * The registry files locations under each service, so the question "what can I
 * get at Southpoint?" had no answer anywhere on the site — it was spread across
 * nineteen service pages. This page asks it the other way round, for every
 * office at once, and lets you narrow to the one service you actually need.
 *
 * The map is an enhancement, not the page. Every office, its address, its phone
 * number and its full list of services are in the HTML whether or not Leaflet
 * loads, and the filter is a real form that round-trips through the server, so
 * `?service=therapy` is a page a crawler can read and a visitor can link to.
 * The script upgrades that in place: it draws the map, and it filters without
 * the reload.
 */

import {
  locationHref,
  locationNames,
  pillarBySlug,
  pillars,
  serviceBySlug,
  serviceHref,
  services,
  servicesAtLocation,
  type Service,
} from "../data/services.ts";
import {
  careCategories,
  categoriesAtLocation,
} from "../data/careCategories.ts";
import {
  directionsHref,
  formatAddress,
  formatPhone,
  officeBySlug,
  offices,
  type Office,
} from "../data/offices.ts";
import { buildId, googleMapsId, googleMapsKey } from "../build.ts";
import type { SearchEntry } from "../data/searchIndex.ts";
import {
  escapeAttribute,
  renderBreadcrumbs,
  type Crumb,
  type GeneratedPage,
} from "./generated.ts";

export const LOCATIONS_HREF = "/locations/";

const BODY_CLASS =
  "wp-singular page-template page-template-page-flex page-template-page-flex-php page wp-theme-wasatch";

/** Locations stays highlighted in the main nav while you are on this page. */
const MENU = {
  classes: {
    "110":
      "menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-110",
  },
  currentIds: [] as string[],
};

/** The offices, in the order the menu lists them. */
function officesInMenuOrder(): Office[] {
  return Object.keys(locationNames)
    .map((slug) => officeBySlug.get(slug))
    .filter((office): office is Office => Boolean(office));
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

/**
 * What an office offers, grouped under the pillar each service belongs to.
 *
 * The grouping is the "care types" half of the question: four headings tell you
 * at a glance whether an office does behavioural health at all, and the links
 * under each tell you exactly which parts of it.
 */
function offersMarkup(offered: Service[]): string {
  return pillars
    .map((pillar) => {
      const mine = offered.filter((service) => service.pillar === pillar.slug);
      if (!mine.length) return "";

      const links = mine
        .map(
          (service) =>
            `<li data-service="${service.slug}"><a href="${serviceHref(service)}">${escapeAttribute(service.name)}</a></li>`,
        )
        .join("");

      return `<div class="loc-group" data-pillar="${pillar.slug}">
					<p class="loc-group-head">${escapeAttribute(pillar.name)}</p>
					<ul class="loc-group-list">${links}</ul>
				</div>`;
    })
    .filter(Boolean)
    .join("\n\t\t\t\t\t");
}

/**
 * The office's care categories as a row of chips, in the pin's own colours —
 * so a pin on the map and a card in the list are recognisably the same office
 * without having to read either.
 */
function categoryChips(locationSlug: string): string {
  const chips = categoriesAtLocation(locationSlug)
    .map(
      (category) =>
        `<li class="loc-chip" data-category="${category.slug}"><span class="loc-badge" style="background:${category.color}"><svg aria-hidden="true" focusable="false"><use href="/assets/icons.svg#i-${category.icon}"></use></svg></span>${escapeAttribute(category.name)}</li>`,
    )
    .join("");
  return `<ul class="loc-chips">${chips}</ul>`;
}

function officeCard(office: Office, active: Service | null): string {
  const name = locationNames[office.slug] ?? office.slug;
  const offered = servicesAtLocation(office.slug);
  const offers = offered.map((service) => service.slug).join(" ");
  const matches = !active || offered.some((s) => s.slug === active.slug);
  const suite = office.suite ? `${escapeAttribute(office.suite)}<br />` : "";

  return `<li class="loc-hit" data-office="${office.slug}" data-services="${offers}"${matches ? "" : " hidden"}>
	<article class="loc-card" id="office-${office.slug}" tabindex="-1">
		<h2 class="loc-card-title"><a href="${locationHref(office.slug)}">${escapeAttribute(name)}</a></h2>
		<p class="loc-card-addr">${escapeAttribute(office.street)}<br />${suite}${escapeAttribute(office.city)}, ${office.state} ${office.zip}</p>
		<p class="loc-card-tel"><a href="tel:${office.phone}">${formatPhone(office.phone)}</a></p>
		${categoryChips(office.slug)}
		<div class="loc-offers">
			${offersMarkup(offered)}
		</div>
		<p class="loc-card-links"><a href="${locationHref(office.slug)}">Office details</a><a href="${directionsHref(office)}" rel="noopener" target="_blank">Directions</a></p>
	</article>
</li>`;
}

/** The one control: every service, grouped under its pillar. */
function filterControl(active: Service | null): string {
  const groups = pillars
    .map((pillar) => {
      const options = services
        .filter((service) => service.pillar === pillar.slug)
        .map(
          (service) =>
            `<option value="${service.slug}"${active?.slug === service.slug ? " selected" : ""}>${escapeAttribute(service.name)}</option>`,
        )
        .join("");
      return `<optgroup label="${escapeAttribute(pillar.name)}">${options}</optgroup>`;
    })
    .join("");

  return `<form class="loc-filter" method="get" action="${LOCATIONS_HREF}">
					<label class="loc-filter-label" for="loc-service">Show offices offering</label>
					<span class="loc-filter-field">
						<select class="loc-filter-select" id="loc-service" name="service">
							<option value=""${active ? "" : " selected"}>All services</option>
							${groups}
						</select>
					</span>
					<button class="btn blue loc-filter-go" type="submit">Show offices</button>
				</form>`;
}

function countLine(shown: number, active: Service | null): string {
  if (!active) return "All eight offices.";
  if (shown === 0) return `No office currently offers ${active.name}.`;
  if (shown === 8) return `All eight offices offer ${active.name}.`;
  return `${shown} of 8 offices offer ${active.name}.`;
}

export function renderLocationsIndex(active: Service | null): string {
  const all = officesInMenuOrder();
  const shown = active
    ? all.filter((office) =>
        servicesAtLocation(office.slug).some((s) => s.slug === active.slug),
      )
    : all;

  /* Everything the map needs, so the script never re-derives it from the DOM. */
  const pins = all.map((office) => ({
    slug: office.slug,
    name: locationNames[office.slug] ?? office.slug,
    lat: office.lat,
    lng: office.lng,
    address: formatAddress(office),
    phone: office.phone,
    phoneText: formatPhone(office.phone),
    href: locationHref(office.slug),
    directions: directionsHref(office),
    services: servicesAtLocation(office.slug).map((s) => s.slug),
    /* Legend order, so every pin reads its segments the same way round. */
    colors: categoriesAtLocation(office.slug).map((c) => c.color),
    categories: categoriesAtLocation(office.slug).map((c) => c.name),
  }));

  /*
   * The legend, server-rendered rather than drawn by the script: it is the key
   * to the whole map and it is real text, so it belongs in the HTML whether or
   * not Google Maps ever loads.
   */
  const legend = careCategories
    .map(
      (category) =>
        `<li><span class="loc-badge" style="background:${category.color}"><svg aria-hidden="true" focusable="false"><use href="/assets/icons.svg#i-${category.icon}"></use></svg></span>${escapeAttribute(category.name)}</li>`,
    )
    .join("\n\t\t\t\t\t\t");

  return `${heroSection("Locations", [{ name: "Locations" }])}
<div class="whitebg loc-intro">
	<div class="container">
		<div class="row">
			<div class="col-lg-9">
				<div class="pagebody">
					<p>Eight offices along the Wasatch Front, from Farmington to Draper and
					east to Park City. Every office covers general pediatrics; behavioral
					health, nutrition and dental care are at some and not others, so pick a
					service below to see where it is offered.</p>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="whitebg padme90 loc-index">
	<div class="container">
		<div class="row">
			<div class="col-12">
				${filterControl(active)}
				<p class="loc-count" role="status">${countLine(shown.length, active)}</p>
				<div class="loc-mapwrap">
					<div class="loc-map${googleMapsKey ? "" : " is-off"}" id="loc-map" data-active="${active?.slug ?? ""}" data-maps-key="${escapeAttribute(googleMapsKey)}" data-maps-id="${escapeAttribute(googleMapsId)}" data-offices="${escapeAttribute(JSON.stringify(pins))}">
						${googleMapsKey ? "" : `<p class="loc-map-off">The map needs a Google Maps key to draw. Every office is listed below with its address, phone number and everything it offers.</p>`}
					</div>
					<div class="loc-key">
						<p class="loc-key-head">What each office offers</p>
						<ul class="loc-key-list">
						${legend}
						</ul>
					</div>
				</div>
				<ol class="loc-list">
${all.map((office) => officeCard(office, active)).join("\n")}
				</ol>
				<p class="loc-empty"${shown.length ? " hidden" : ""}>No office currently offers that. <a href="${LOCATIONS_HREF}">Show all eight offices</a>.</p>
			</div>
		</div>
	</div>
</div>`;
}

export function locationsDocument(
  serviceSlug: string,
): GeneratedPage & { route: string } {
  const active = serviceSlug ? (serviceBySlug.get(serviceSlug) ?? null) : null;
  const pillar = active ? pillarBySlug.get(active.pillar) : null;

  return {
    route: LOCATIONS_HREF,
    title: active
      ? `Locations offering ${active.name} - Wasatch Pediatrics`
      : "Locations - Wasatch Pediatrics",
    description: active
      ? `Which Wasatch Pediatrics offices offer ${active.name}${pillar ? `, part of ${pillar.name.toLowerCase()}` : ""} — with addresses, phone numbers and directions.`
      : "All eight Wasatch Pediatrics offices on one map, with the services each one offers, addresses, phone numbers and directions.",
    bodyClass: BODY_CLASS,
    menu: MENU,
    breadcrumbs: [{ name: "Locations" }],
    content: renderLocationsIndex(active),
  };
}

/**
 * One entry, so a search for an office name or "locations" lands on the map
 * rather than only on the eight individual office pages.
 */
export function locationsSearchEntry(): SearchEntry {
  const names = Object.values(locationNames).join(", ");

  return {
    route: LOCATIONS_HREF,
    title: "Locations",
    type: "page",
    image: "",
    date: "",
    category: "",
    excerpt:
      "All eight offices on one map, with the services each one offers, addresses, phone numbers and directions.",
    text: `Locations. ${names}. ${offices.map((office) => formatAddress(office)).join(". ")}.`,
    links: offices.map((office) => locationHref(office.slug)).join(" "),
  };
}
