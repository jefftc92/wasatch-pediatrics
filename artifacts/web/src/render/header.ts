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
 * cover the common journeys, and the link below them leads to /services/, which
 * carries the full filterable list.
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
  return `<li id="menu-item-${item.id}" class="${classes} mega"><a href="${item.href}">${item.label}</a><button class="navtoggle" type="button" aria-expanded="false"><span class="navtoggle-label">Show what is under ${item.label}</span></button>
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
 * cover the common journeys, and the link below them leads to /services/, which
 * carries the full filterable list.
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
			</div>
		</div>
		<div class="mega-foot">
			<a class="mega-cta" href="${ALL_SERVICES_HREF}">View all services<svg class="mega-cta-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3l5 5-5 5"></path></svg></a>
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
		</div>${
      item.panelFooter
        ? `
		<div class="mega-foot">
			<a class="mega-cta" href="${item.panelFooter.href}">${esc(item.panelFooter.label)}<svg class="mega-cta-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3l5 5-5 5"></path></svg></a>
		</div>`
        : ""
    }`,
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
/**
 * A section's own navigation, when a page belongs to one.
 *
 * On these pages the global nav steps back to a quiet row beside the logo and
 * the section takes the main bar, named on its left — so the whole chrome says
 * which part of the practice you are in rather than making you read the
 * breadcrumb to find out. The pattern is the one large content sites use when a
 * section is deep enough to be its own site.
 */
export type SectionNav = {
  name: string;
  href: string;
  items: SectionItem[];
  /** Rendered in the strip under the bar, so a page need not repeat them. */
  crumbs: Array<{ name: string; href?: string }>;
};

export type SectionItem = {
  name: string;
  href: string;
  current?: boolean;
  /** Topics, and the pages under each, for the flyout's two panels. */
  groups?: Array<{
    name: string;
    href: string;
    pages: Array<{ name: string; href: string }>;
  }>;
};

/**
 * How many services stand in the bar before the rest fold into "More".
 *
 * Measured rather than guessed: at 1280 the container is 1140px, and the
 * section name plus Overview leaves about 830px — four services at their
 * average width. Three of the four pillars have three or four services and fit
 * whole; medical care has nine and would need 1869px.
 */
/*
 * How many services the bar renders inline before folding the rest into More.
 *
 * Three, because that is what fits without wrapping in the narrowest container
 * the bar appears in — 960px, between 992 and 1199 — with the longest section
 * name beside it. Behavioral Health needed 1093px for its five items and wrapped
 * onto a second line there, which read as a mistake rather than as a menu.
 *
 * It is a floor, not the final count: site.js measures the row once the page is
 * up and pulls items back out of More while they fit, so a wide window shows
 * everything. Folding here rather than only in the browser means the bar is
 * never wrong on the first frame, and is still usable with no script at all.
 */
const BAR_LIMIT = 3;

function flyout(item: SectionItem): string {
  const groups = item.groups ?? [];
  if (!groups.length) return "";

  /*
   * Open on the first topic that has pages. Several sections begin with a
   * single-page topic — First Dental Visit, Same-Day Appointments — and
   * starting there left the right panel empty on the way in.
   */
  const first = Math.max(
    groups.findIndex((group) => group.pages.length),
    0,
  );

  const left = groups
    .map(
      (group, index) =>
        `<li${index === first ? ' class="on"' : ""}><a href="${group.href}" data-group="${index}">${esc(group.name)}</a></li>`,
    )
    .join("");

  const right = groups
    .map((group, index) => {
      const pages = group.pages
        .map(
          (page) => `<li><a href="${page.href}">${esc(page.name)}</a></li>`,
        )
        .join("");
      return `<div class="secfly-pages" data-group="${index}"${index === first ? "" : " hidden"}>
							<p class="secfly-head">In ${esc(group.name)}</p>
							${pages ? `<ul>${pages}</ul>` : `<p class="secfly-none">One page, and you are on the way to it.</p>`}
						</div>`;
    })
    .join("\n");

  return `<div class="secfly">
						<ul class="secfly-topics">${left}</ul>
						<div class="secfly-right" data-first="${first}">
${right}
						</div>
					</div>`;
}

function sectionItem(item: SectionItem): string {
  const classes = [
    "secbar-item",
    item.groups?.length ? "has-fly" : "",
    item.current ? "on" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<li class="${classes}"><a href="${item.href}">${esc(item.name)}</a>${flyout(item)}</li>`;
}

function sectionBar(section: SectionNav): string {
  const shown =
    section.items.length > BAR_LIMIT
      ? section.items.slice(0, BAR_LIMIT - 1)
      : section.items;
  const rest =
    section.items.length > BAR_LIMIT ? section.items.slice(BAR_LIMIT - 1) : [];

  const more = rest.length
    ? `<li class="secbar-item has-fly secbar-more"><a href="${section.href}">More</a><div class="secfly secfly-plain">
						<ul class="secfly-topics">${rest
              .map(
                (item) =>
                  `<li${item.current ? ' class="on"' : ""}><a href="${item.href}">${esc(item.name)}</a></li>`,
              )
              .join("")}</ul>
					</div></li>`
    : "";

  return `		<div id="secbar">
			<div class="container">
				<div class="secbar-in">
					<a class="secbar-name" href="${section.href}">${esc(section.name)}</a>
					<button class="secbar-toggle" type="button" aria-expanded="false" aria-controls="secbar-list"><span class="secbar-toggle-label">Menu</span></button>
					<ul class="secbar-list" id="secbar-list">
						<li class="secbar-item${section.crumbs.length === 1 ? " on" : ""}"><a href="${section.href}">Overview</a></li>
						${shown.map(sectionItem).join("\n\t\t\t\t\t\t")}
						${more}
					</ul>
				</div>
			</div>
		</div>`;
}

function globalNav(menu: MenuState): string {
  return `<div class="menu-main-nav-container"><ul id="menu-main-nav" class="mainnav">${mainNav
    .map((item) => menuItem(item, menu))
    .join("\n")}</ul></div>`;
}

/*
 * The utility strip: search and the social links, right-aligned on a shallow
 * grey band. Bill Pay is not repeated here — it is a main menu item, and one
 * link in two places is one more thing to keep in step.
 */
function utilityTools(): string {
  return `<ul  class="desktop" id="navbuttons">
								<li><a href="/contact-us"><img src="/wp-content/themes/wasatch/images/fb.svg" alt="Facebook Icon" /></a></li>
								<li><a href="/contact-us"><img src="/wp-content/themes/wasatch/images/ig.svg" alt="Instagram Icon" /></a></li>
								<div id="searchformwrap" title="Search">
									<span class="searchlabel" aria-hidden="true">Search</span>
									${searchForm()}
								</div>
							</ul>`;
}

/* The one action, at the end of the row the menu is in: logo, menu, book. */
const HEADER_CTA = `<a class="btn green header-cta" href="/contact-us/"><span class="header-cta-full">Schedule An Appointment</span><span class="header-cta-short">Schedule</span></a>`;

const BURGER = `<div id="mobileburger">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>`;

const LOGO = `<div id="logo">
						<a href="/"><img src="/wp-content/themes/wasatch/images/wasatchlogo.svg" alt="Wasatch Pediatrics"></a>
					</div>`;

const DOCK = `	<div class="ctadock">
		<a class="ctadock-btn" href="/contact-us/" aria-label="Schedule an appointment">
			<svg class="ctadock-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="16" rx="3"></rect><path d="M8 3v4M16 3v4M3 10h18"></path></svg>
			<span class="ctadock-label">Schedule An Appointment</span>
		</a>
	</div>`;

export function renderHeader(
  menu: MenuState = NO_MENU_STATE,
  section?: SectionNav,
): string {
  /*
   * One header, on every page: the tools on a quiet line of their own, then
   * the logo with the menu beside it, then the section bar when there is one.
   *
   * All three live in the same row element so that a phone can lay them out
   * the way the theme expects — logo, burger, and the menu below when the
   * burger opens it. A desktop turns that row into a grid and puts the tools
   * above the other two.
   */
  return `	<section class="page-load"></section>
	<header id="header"${section ? ' class="has-section"' : ""}>
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div class="secheadrow">
						<div id="topmenuwrap">
							<div id="topmenu">
							${utilityTools()}
							</div>
						</div>
						${LOGO}
						<div id="graynav">
							<div id="mobilesearch" class="mobile">
								${searchForm()}
							</div>
							<div id="navwrap">
								${globalNav(menu)}
							</div>
						</div>
						${HEADER_CTA}
						${BURGER}
					</div>
				</div>
			</div>
		</div>
${section ? sectionBar(section) : ""}	</header>
${DOCK}`;
}
