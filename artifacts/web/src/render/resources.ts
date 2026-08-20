/**
 * The Resources index.
 *
 * Locations and Services both have a page that stands behind their menu, and
 * Resources did not — so clicking it in the main nav had nowhere to go. The
 * five entries here are read from the menu itself rather than listed again, so
 * adding a resource to `nav.ts` adds its card, and the blurbs are the meta
 * descriptions those pages already carry.
 */

import { mainNav, type NavItem } from "../data/nav.ts";
import { contentPageByRoute } from "../data/pages.ts";
import {
  escapeAttribute,
  renderBreadcrumbs,
  type Crumb,
  type GeneratedPage,
} from "./generated.ts";
import type { SearchEntry } from "../data/searchIndex.ts";

export const RESOURCES_HREF = "/resources/";

/** The menu item these cards are the index for. */
const RESOURCES_MENU_ID = "1376";

const BODY_CLASS =
  "wp-singular page-template page-template-page-flex page-template-page-flex-php page wp-theme-wasatch";

/** Resources stays highlighted in the main nav while you are on this page. */
const MENU = {
  classes: {
    [RESOURCES_MENU_ID]:
      "menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-1376",
  },
  currentIds: [] as string[],
};

/**
 * The one page under Resources with no meta description of its own — it is a
 * post listing rather than a page, so WordPress never gave it one.
 */
const BLURBS: Record<string, string> = {
  "/blog/":
    "Articles from our pediatricians, dietitians and therapists on keeping children healthy, from newborn sleep to teenage anxiety.",
};

function resourceItems(): NavItem[] {
  const resources = mainNav.find((item) => item.id === RESOURCES_MENU_ID);
  return resources?.children ?? [];
}

function blurb(href: string): string {
  return BLURBS[href] ?? contentPageByRoute.get(href)?.description ?? "";
}

function card(item: NavItem): string {
  return `<div class="col-lg-4 col-md-6">
	<div class="svc-card">
		<h2 class="svc-card-title"><a href="${item.href}">${item.label}</a></h2>
		<p class="svc-card-blurb">${escapeAttribute(blurb(item.href))}</p>
		<a class="btn blue" href="${item.href}">Open</a>
	</div>
</div>`;
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

export function renderResources(): string {
  return `${heroSection("Resources", [{ name: "Resources" }])}
<div class="whitebg svc-intro">
	<div class="container">
		<div class="row">
			<div class="col-lg-9">
				<div class="pagebody">
					<p>Forms to fill in before a visit, what to expect as a new patient, and
					somewhere to start when you are not sure whether to be seen.</p>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="whitebg padme90 svc-index">
	<div class="container">
		<div class="row">
${resourceItems().map(card).join("\n")}
		</div>
	</div>
</div>`;
}

export function resourcesDocument(): GeneratedPage & { route: string } {
  return {
    route: RESOURCES_HREF,
    title: "Resources - Wasatch Pediatrics",
    description:
      "Patient forms, new patient information, a symptom checker and reading from the Wasatch Pediatrics team, in one place.",
    bodyClass: BODY_CLASS,
    menu: MENU,
    breadcrumbs: [{ name: "Resources" }],
    content: renderResources(),
  };
}

/** So the index is findable by name, not only through the menu. */
export function resourcesSearchEntry(): SearchEntry {
  const items = resourceItems();

  return {
    route: RESOURCES_HREF,
    title: "Resources",
    type: "page",
    image: "",
    date: "",
    category: "",
    excerpt:
      "Patient forms, new patient information, a symptom checker and reading from the team, in one place.",
    text: `Resources. ${items.map((item) => `${item.label}. ${blurb(item.href)}`).join(" ")}`,
    links: items.map((item) => item.href).join(" "),
  };
}
