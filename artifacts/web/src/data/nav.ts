/** Main navigation, mirroring the "main-nav" menu on wasatchpeds.net. */

export type NavItem = {
  id: number;
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  { id: 196, label: "About", href: "/about/" },
  {
    id: 110,
    label: "Locations",
    href: "#",
    children: [
      { id: 292, label: "Cottonwood", href: "/locations/cottonwood/" },
      { id: 291, label: "Draper", href: "/locations/draper/" },
      { id: 290, label: "Farmington", href: "/locations/farmington/" },
      { id: 289, label: "Grow Up Great", href: "/locations/grow-up-great/" },
      { id: 287, label: "Salt Lake", href: "/locations/salt-lake/" },
      { id: 286, label: "Southpoint", href: "/locations/southpoint/" },
      { id: 288, label: "Summit", href: "/locations/summit/" },
      { id: 285, label: "Willow Creek", href: "/locations/willow-creek/" },
      {
        id: 1438,
        label: "Dentistry & Orthodontics",
        href: "/dentistry-orthodontics/",
      },
    ],
  },
  {
    id: 111,
    label: "Services",
    href: "#",
    children: [
      { id: 145, label: "Medical Services", href: "/services/" },
      { id: 375, label: "Behavioral Health", href: "/behavioral-health/" },
      {
        id: 1437,
        label: "Dentistry & Orthodontics",
        href: "/dentistry-orthodontics/",
      },
    ],
  },
  {
    id: 1376,
    label: "Resources",
    href: "#",
    children: [
      { id: 147, label: "New Patients", href: "/new-patients/" },
      { id: 146, label: "Office Forms", href: "/office-forms/" },
      { id: 144, label: "Symptom Checker", href: "/symptom-checker/" },
      { id: 143, label: "Helpful Links", href: "/helpful-links/" },
      { id: 919, label: "Blog", href: "/blog/" },
    ],
  },
  { id: 112, label: "Providers", href: "/providers" },
  {
    id: 113,
    label: "Bill Pay",
    href: "https://wasatchpeds.goredde.com/",
    external: true,
  },
  { id: 295, label: "Contact Us", href: "/contact-us/" },
];

export const footerNav: NavItem[] = [
  { id: 1, label: "Careers", href: "/careers" },
  {
    id: 2,
    label: "Employee Login",
    href: "http://sharepoint.wasatchpeds.net/",
    external: true,
  },
  {
    id: 3,
    label: "Terms of Service",
    href: "/terms-of-use-privacy-statement/",
  },
  {
    id: 4,
    label: "Privacy Statement",
    href: "/terms-of-use-privacy-statement/",
  },
];
