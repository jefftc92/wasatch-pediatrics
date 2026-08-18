import { mainNav, type NavItem } from "../data/nav.ts";
import {
  ALL_SERVICES_HREF,
  pillars,
  serviceHref,
  servicesInPillar,
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

function megaColumn(pillar: Pillar, menu: MenuState): string {
  const id = PILLAR_MENU_IDS[pillar.slug] ?? pillar.slug;
  const current = menu.currentIds.includes(id) ? ' aria-current="page"' : "";
  const all = servicesInPillar(pillar.slug);
  // The panel lists what families come for most; "All <pillar>" and the full
  // index carry the rest, so the menu never becomes a directory.
  const shown = all.filter((service) => service.popular);
  const links = (shown.length ? shown : all)
    .map(
      (service) =>
        `<li><a href="${serviceHref(service)}">${esc(service.name)}</a></li>`,
    )
    .join("\n\t\t\t\t\t\t\t\t\t");

  return `<div class="mega-col" id="menu-item-${id}">
						<a class="mega-pillar" href="${pillar.href}"${current}>${esc(pillar.name)}</a>
						<ul class="mega-list">
							${links}
						</ul>
					</div>`;
}

/**
 * The Services panel: one column per pillar, the services families come for
 * most under each.
 *
 * Kept deliberately spare. A menu is read at a glance, so it carries names and
 * nothing else — no descriptions, and one button rather than two competing for
 * the eye. The pillar heading is itself the link to that pillar, so there is no
 * separate "all of this" link beside it.
 *
 * It is still a `.sub-menu`, so the theme's own scripts open it — hover on
 * desktop, tap on mobile — with no change to script.js. The lists inside are
 * `.mega-list` rather than nested `.sub-menu`s for the same reason: the theme's
 * mobile handler slides every descendant `.sub-menu`, and a second level would
 * fight it. On a phone the panel is one stacked column with the pillar name as
 * each group heading.
 */
function megaPanel(item: NavItem, menu: MenuState): string {
  const classes = menu.classes[item.id] ?? item.classes;
  const columns = pillars
    .map((pillar) => megaColumn(pillar, menu))
    .join("\n\t\t\t\t\t");

  return `<li id="menu-item-${item.id}" class="${classes} mega"><a href="${item.href}">${item.label}</a>
<ul class="sub-menu megamenu">
<li class="megamenu-inner">
	<div class="container">
		<div class="mega-grid">
					${columns}
		</div>
		<div class="mega-foot">
			<a class="btn green" href="/contact-us/">Schedule An Appointment</a>
			<a class="mega-foot-link" href="${ALL_SERVICES_HREF}">View all services</a>
			<a class="mega-foot-link" href="/providers/">Find a provider</a>
			<a class="mega-foot-link" href="/symptom-checker/">Symptom Checker</a>
		</div>
	</div>
</li>
</ul>
</li>`;
}

function menuItem(item: NavItem, menu: MenuState): string {
  if (item.mega) return megaPanel(item, menu);

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
	</header>`;
}
