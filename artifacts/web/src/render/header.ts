import { mainNav, type NavItem } from "../data/nav.ts";
import {
  ALL_SERVICES_HREF,
  pillars,
  serviceHref,
  services,
  type Pillar,
} from "../data/services.ts";

export type MenuState = {
  /** Menu item classes that replace the defaults on this route. */
  classes: Record<string, string>;
  /** Menu items whose links carry aria-current="page". */
  currentIds: string[];
};

export const NO_MENU_STATE: MenuState = { classes: {}, currentIds: [] };

/** The site search form, which appears twice in the header. */
function searchForm(): string {
  return `<form class="mainsearch search-form" role="search" method="get" action="/">
	<div class="searchwrap">
		<div class="searchclose">&#x2715;</div>
		<input type="search" class="search-field navsearch" title="Search Site" value="" name="s" />
		<button class="searchbutton"><img src="/wp-content/themes/wasatch/images/icon_magnify.svg" alt="Search" /></button>
	</div>
</form>`;
}

/**
 * Menu item ids for the pillar links. The first three are the ids WordPress
 * gave "Medical Services", "Behavioral Health" and "Dentistry & Orthodontics"
 * under Services, so the current-page state stored per route in pages.ts keeps
 * pointing at the right column. Nutrition is new and has no WordPress id.
 */
/** Service names carry ampersands; WordPress escapes them in menu markup. */
function esc(value: string): string {
  return value.replace(/&/g, "&#038;");
}

export const PILLAR_MENU_IDS: Record<string, string> = {
  "medical-care": "145",
  "behavioral-health": "375",
  dentistry: "1437",
  nutrition: "nutrition",
};

/**
 * The Services panel: the four pillars on the left, a short list of the pages
 * families come for most on the right.
 *
 * Kept deliberately spare — a menu is read at a glance, so it carries names and
 * nothing else. Listing every service under every pillar turned it into a
 * directory; the four categories teach how care is organised, the shortcuts
 * cover the common journeys, and the pill leads to /services/, which carries
 * the full filterable list.
 *
 * Nothing else lives here. Find a provider and the symptom checker are already
 * in the main nav under Providers and Resources, and scheduling now sits in the
 * header where it is reachable from every page rather than only from this
 * panel.
 *
 * It is still a `.sub-menu`, so the theme's own scripts open it — hover on
 * desktop, tap on mobile — with no change to script.js. The lists inside are
 * `.mega-list` rather than nested `.sub-menu`s for the same reason: the theme's
 * mobile handler slides every descendant `.sub-menu`, and a second level would
 * fight it. On a phone the two groups stack, each with its own heading.
 */
function pillarLink(pillar: Pillar, menu: MenuState): string {
  const id = PILLAR_MENU_IDS[pillar.slug] ?? pillar.slug;
  const current = menu.currentIds.includes(id) ? ' aria-current="page"' : "";
  return `<li id="menu-item-${id}"><a class="mega-pillar" href="${pillar.href}"${current}>${esc(pillar.name)}</a></li>`;
}

/**
 * The panel chrome, shared by every dropdown in the main nav.
 *
 * Locations, Services and Resources all render the same way: a full-width white
 * surface that comes out from under the grey nav bar, one or more groups with an
 * uppercase heading, and the links in a plain list. Only the content differs.
 *
 * Each is still a `.sub-menu`, so the theme's own scripts open them — hover on
 * desktop, tap on mobile — with no change to script.js. The lists inside are
 * `.mega-list` rather than nested `.sub-menu`s for the same reason: the theme's
 * mobile handler slides every descendant `.sub-menu`, and a second level would
 * fight it. On a phone the groups stack, each keeping its heading.
 */
function panel(item: NavItem, classes: string, body: string): string {
  return `<li id="menu-item-${item.id}" class="${classes} mega"><a href="${item.href}">${item.label}</a>
<ul class="sub-menu megamenu">
<li class="megamenu-inner">
	<div class="container">
${body}
	</div>
</li>
</ul>
</li>`;
}

/**
 * The Services panel: the four pillars on the left, a short list of the pages
 * families come for most on the right.
 *
 * Kept deliberately spare — a menu is read at a glance, so it carries names and
 * nothing else. Listing every service under every pillar turned it into a
 * directory; the four categories teach how care is organised, the shortcuts
 * cover the common journeys, and the pill leads to /services/, which carries
 * the full filterable list.
 *
 * Nothing else lives here. Find a provider and the symptom checker are already
 * in the main nav under Providers and Resources, and scheduling sits in the
 * header where it is reachable from every page rather than only from this panel.
 */
function servicesPanel(item: NavItem, menu: MenuState): string {
  const classes = menu.classes[item.id] ?? item.classes;

  const pillarLinks = pillars
    .map((pillar) => pillarLink(pillar, menu))
    .join("\n\t\t\t\t\t");

  const popular = services
    .filter((service) => service.popular)
    .map(
      (service) =>
        `<li><a href="${serviceHref(service)}">${esc(service.name)}</a></li>`,
    )
    .join("\n\t\t\t\t\t");

  return panel(
    item,
    classes,
    `		<div class="mega-grid">
			<div class="mega-col mega-browse">
				<p class="mega-head">Browse by care</p>
				<ul class="mega-list">
					${pillarLinks}
				</ul>
			</div>
			<div class="mega-col mega-popular">
				<p class="mega-head">Popular services</p>
				<ul class="mega-list mega-list-split">
					${popular}
				</ul>
				<div class="mega-cta-wrap">
					<a class="btn blue mega-cta" href="${ALL_SERVICES_HREF}">View All Services</a>
				</div>
			</div>
		</div>`,
  );
}

/**
 * Locations and Resources: one group, the item's own children, in as many
 * columns as the list length warrants. Same surface and same type as Services,
 * so moving between the three menus feels like one menu.
 */
function listPanel(item: NavItem, menu: MenuState): string {
  const classes = menu.classes[item.id] ?? item.classes;
  const links = (item.children ?? [])
    .map((child) => menuItem(child, menu))
    .join("\n\t\t\t\t\t");

  return panel(
    item,
    classes,
    `		<div class="mega-grid mega-grid-single">
			<div class="mega-col">
				<p class="mega-head">${esc(item.panelHeading ?? item.label)}</p>
				<ul class="mega-list mega-list-${item.panelColumns ?? 2}">
					${links}
				</ul>
			</div>
		</div>`,
  );
}

function menuItem(item: NavItem, menu: MenuState): string {
  if (item.mega) return servicesPanel(item, menu);
  if (item.panelHeading) return listPanel(item, menu);

  const classes = menu.classes[item.id] ?? item.classes;
  const current = menu.currentIds.includes(item.id)
    ? ' aria-current="page"'
    : "";
  const target = item.external ? ' target="_blank"' : "";
  const submenu = item.children
    ? `\n<ul class="sub-menu">\n${item.children.map((child) => menuItem(child, menu)).join("\n")}\n</ul>\n`
    : "";

  return `<li id="menu-item-${item.id}" class="${classes}"><a${target} href="${item.href}"${current}>${item.label}</a>${submenu}</li>`;
}

/**
 * The site header. Identical on every page apart from the menu's current-page
 * classes, which WordPress varies per route.
 */
export function renderHeader(menu: MenuState = NO_MENU_STATE): string {
  return `	<section class="page-load"></section>
	<header id="header">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div id="logo">
						<a href="/"><img src="/wp-content/themes/wasatch/images/wasatchlogo.svg" alt="Wasatch Pediatrics"></a>
					</div>
					<div id="topmenuwrap">
						<div id="topmenu">
							<a class="btn green header-cta" href="/contact-us/"><span class="header-cta-full">Schedule An Appointment</span><span class="header-cta-short">Schedule</span></a>
							<ul  class="desktop" id="navbuttons">
								<li><a href="/contact-us"><img src="/wp-content/themes/wasatch/images/fb.svg" alt="Facebook Icon" /></a></li>
								<li><a href="/contact-us"><img src="/wp-content/themes/wasatch/images/ig.svg" alt="Instagram Icon" /></a></li>
								<div id="searchformwrap" title="Search">
									${searchForm()}
								</div>
							</ul>
							<div id="mobileburger">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="graynav">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div id="mobilesearch" class="mobile">
							${searchForm()}
						</div>
						<div id="navwrap">
							<div class="menu-main-nav-container"><ul id="menu-main-nav" class="mainnav">${mainNav
                .map((item) => menuItem(item, menu))
                .join("\n")}</ul></div>						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
	<div class="ctadock">
		<a class="ctadock-btn" href="/contact-us/" aria-label="Schedule an appointment">
			<svg class="ctadock-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M8 3v4M16 3v4M3 10h18"></path></svg>
			<span class="ctadock-label">Schedule An Appointment</span>
		</a>
	</div>`;
}
