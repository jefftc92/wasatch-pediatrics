import { mainNav, type NavItem } from "../data/nav.ts";

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

function menuItem(item: NavItem, menu: MenuState): string {
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
