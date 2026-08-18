/**
 * The "main-nav" and footer menus from wasatchpeds.net.
 *
 * `classes` is the class list WordPress prints for each item when it is not the
 * current page; per-route overrides live alongside each page in `pages.ts` and
 * `providers.ts`.
 */

export type NavItem = {
  id: string;
  label: string;
  href: string;
  classes: string;
  external?: boolean;
  children?: NavItem[];
  /** Rendered as the services mega panel rather than a plain sub-menu. */
  mega?: boolean;
  /**
   * Rendered as a panel like the services one, with this as the group heading.
   * Set on the other dropdowns so all three menus look and behave alike.
   */
  panelHeading?: string;
  /** How many columns the panel's list runs to on a wide screen. */
  panelColumns?: number;
};

const PAGE = "menu-item menu-item-type-post_type menu-item-object-page";
const CUSTOM = "menu-item menu-item-type-custom menu-item-object-custom";
const PARENT = `${CUSTOM} menu-item-has-children`;
const LOCATION =
  "menu-item menu-item-type-post_type menu-item-object-locations";

export const mainNav: NavItem[] = [
  {
    id: "196",
    label: "About",
    href: "/about/",
    classes: `${PAGE} menu-item-196`,
  },
  {
    id: "110",
    label: "Locations",
    href: "#",
    classes: `${PARENT} menu-item-110`,
    panelHeading: "Our offices",
    panelColumns: 3,
    children: [
      {
        id: "292",
        label: "Cottonwood",
        href: "/locations/cottonwood/",
        classes: `${LOCATION} menu-item-292`,
      },
      {
        id: "291",
        label: "Draper",
        href: "/locations/draper/",
        classes: `${LOCATION} menu-item-291`,
      },
      {
        id: "290",
        label: "Farmington",
        href: "/locations/farmington/",
        classes: `${LOCATION} menu-item-290`,
      },
      {
        id: "289",
        label: "Grow Up Great",
        href: "/locations/grow-up-great/",
        classes: `${LOCATION} menu-item-289`,
      },
      {
        id: "287",
        label: "Salt Lake",
        href: "/locations/salt-lake/",
        classes: `${LOCATION} menu-item-287`,
      },
      {
        id: "286",
        label: "Southpoint",
        href: "/locations/southpoint/",
        classes: `${LOCATION} menu-item-286`,
      },
      {
        id: "288",
        label: "Summit",
        href: "/locations/summit/",
        classes: `${LOCATION} menu-item-288`,
      },
      {
        id: "285",
        label: "Willow Creek",
        href: "/locations/willow-creek/",
        classes: `${LOCATION} menu-item-285`,
      },
      {
        id: "1438",
        label: "Dentistry &#038; Orthodontics",
        href: "/dentistry-orthodontics/",
        classes: `${PAGE} menu-item-1438`,
      },
    ],
  },
  {
    id: "111",
    label: "Services",
    href: "#",
    classes: `${PARENT} menu-item-111`,
    // Rendered as the mega panel in render/header.ts, built from the service
    // registry rather than listed here. The panel reuses the menu item ids
    // WordPress gave the three links it replaces, so the per-route menu state
    // stored in pages.ts still marks the current pillar.
    mega: true,
  },
  {
    id: "1376",
    label: "Resources",
    href: "#",
    classes: `${PARENT} menu-item-1376`,
    panelHeading: "Resources",
    panelColumns: 2,
    children: [
      {
        id: "147",
        label: "New Patients",
        href: "/new-patients/",
        classes: `${PAGE} menu-item-147`,
      },
      {
        id: "146",
        label: "Office Forms",
        href: "/office-forms/",
        classes: `${PAGE} menu-item-146`,
      },
      {
        id: "144",
        label: "Symptom Checker",
        href: "/symptom-checker/",
        classes: `${PAGE} menu-item-144`,
      },
      {
        id: "143",
        label: "Helpful Links",
        href: "/helpful-links/",
        classes: `${PAGE} menu-item-143`,
      },
      {
        id: "919",
        label: "Blog",
        href: "/blog/",
        classes: `${PAGE} menu-item-919`,
      },
    ],
  },
  {
    id: "112",
    label: "Providers",
    href: "/providers",
    classes: `${CUSTOM} menu-item-112`,
  },
  {
    id: "113",
    label: "Bill Pay",
    href: "https://wasatchpeds.goredde.com/",
    classes: `${CUSTOM} menu-item-113`,
    external: true,
  },
  {
    id: "295",
    label: "Contact Us",
    href: "/contact-us/",
    classes: `${PAGE} menu-item-295`,
  },
];

export const footerNav: Array<{
  label: string;
  href: string;
  external?: boolean;
}> = [
  { label: "Careers", href: "/careers" },
  {
    label: "Employee Login",
    href: "http://sharepoint.wasatchpeds.net/",
    external: true,
  },
  { label: "Terms of Service", href: "/terms-of-use-privacy-statement/" },
  { label: "Privacy Statement", href: "/terms-of-use-privacy-statement/" },
];
