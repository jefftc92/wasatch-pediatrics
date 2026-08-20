/**
 * The care categories the map draws.
 *
 * The registry has four pillars and nineteen services. Neither is the right
 * grain for a pin: four is too coarse to tell two offices apart, and nineteen
 * is a list nobody reads off a map. These eight sit in between — they are the
 * things a parent actually chooses an office for, and, unlike the pillars, they
 * genuinely differ between offices.
 *
 * Membership is derived from `services.ts` rather than typed again here, so an
 * office that gains or loses a service changes its pin without anything else
 * being edited. This file is the one place to change what the map shows: add a
 * category, or move a service between them, and the pins, the legend, the
 * filter and the cards all follow.
 *
 * The colours are the brand's, extended only where eight distinguishable ones
 * were needed: a lighter and a deeper blue, a deeper green, a rust, the grey,
 * and the one red the design system already uses for an alert — which is the
 * right colour for a dental emergency anyway.
 */

import { services, type Service } from "./services.ts";

export type CareCategory = {
  slug: string;
  name: string;
  /** Segment colour on the pin, and the swatch in the legend. */
  color: string;
  /** Symbol id in /assets/icons.svg. */
  icon: string;
  /** Service slugs that put an office in this category. */
  members: string[];
};

export const careCategories: CareCategory[] = [
  {
    slug: "pediatrics",
    name: "Pediatrics",
    color: "#2b93d1",
    icon: "stethoscope",
    members: [
      "well-child",
      "sick-visits",
      "immunizations",
      "newborn-hospital-care",
      "lab-tests-screenings",
      "medical-home-coordination",
      "in-office-procedures",
      "ear-piercing",
    ],
  },
  {
    slug: "after-hours",
    name: "After Hours Care",
    color: "#7fcdf2",
    icon: "moon",
    members: ["after-hours-care"],
  },
  {
    slug: "behavioral-health",
    name: "Behavioral Health",
    color: "#8dc63f",
    icon: "heart",
    members: [
      "behavioral-consultation",
      "therapy",
      "psychiatry",
      "autism-testing",
    ],
  },
  {
    slug: "nutrition",
    name: "Nutrition",
    color: "#4e8b1e",
    icon: "sparkle",
    members: ["dietitian", "community-classes"],
  },
  {
    slug: "lactation",
    name: "Lactation Support",
    color: "#f58220",
    icon: "baby",
    members: ["lactation-consultation"],
  },
  {
    slug: "dentistry",
    name: "Pediatric Dentistry",
    color: "#b8480e",
    icon: "tooth",
    members: ["pediatric-dentistry"],
  },
  {
    slug: "orthodontics",
    name: "Orthodontics",
    color: "#6e7073",
    icon: "smiley",
    members: ["orthodontics"],
  },
  {
    slug: "dental-emergencies",
    name: "Dental Emergencies",
    color: "#d0342c",
    icon: "first-aid-kit",
    members: ["dental-emergencies"],
  },
];

const byMember = new Map<string, CareCategory>();
for (const category of careCategories) {
  for (const slug of category.members) byMember.set(slug, category);
}

/** Which categories an office falls into, in legend order. */
export function categoriesAtLocation(locationSlug: string): CareCategory[] {
  const hit = new Set<string>();
  for (const service of services) {
    if (!service.locations.includes(locationSlug)) continue;
    const category = byMember.get(service.slug);
    if (category) hit.add(category.slug);
  }
  return careCategories.filter((category) => hit.has(category.slug));
}

/** The category a service belongs to, if the map shows one for it. */
export function categoryForService(service: Service): CareCategory | undefined {
  return byMember.get(service.slug);
}

/**
 * Services the map cannot place. Nothing should be here: a service with no
 * category is one a filtered pin would silently drop.
 */
export function uncategorisedServices(): Service[] {
  return services.filter((service) => !byMember.has(service.slug));
}
