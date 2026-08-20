/**
 * The care types the map draws, and their colours.
 *
 * These are the four pillars — the same four the menu and the service pages
 * are organised by — so a colour on the map means the same thing as a heading
 * everywhere else on the site. Four is also few enough that a pin divided
 * between them stays readable at 40px, which eight was not.
 *
 * Colours are the brand's four, one each, so nothing new was invented: the
 * blue, the green and the orange the site already uses, and the grey it uses
 * for text. Membership is derived from `services.ts` rather than typed again,
 * so an office that gains or loses a service changes its pin with nothing else
 * edited.
 */

import { pillars, services, type Pillar, type Service } from "./services.ts";

export type CareCategory = {
  slug: string;
  name: string;
  /** Segment colour on the pin, and the swatch in the key. */
  color: string;
  /** Symbol id in /assets/icons.svg. */
  icon: string;
};

const LOOK: Record<string, { color: string; icon: string }> = {
  "medical-care": { color: "#2b93d1", icon: "stethoscope" },
  "behavioral-health": { color: "#8dc63f", icon: "heart" },
  nutrition: { color: "#f58220", icon: "baby" },
  dentistry: { color: "#636466", icon: "tooth" },
};

export const careCategories: CareCategory[] = pillars.map((pillar: Pillar) => ({
  slug: pillar.slug,
  name: pillar.name,
  color: LOOK[pillar.slug]?.color ?? "#636466",
  icon: LOOK[pillar.slug]?.icon ?? "circle-dashed",
}));

const byCategory = new Map(careCategories.map((c) => [c.slug, c]));

/** Which care types an office has, in the menu's own order. */
export function categoriesAtLocation(locationSlug: string): CareCategory[] {
  const hit = new Set<string>();
  for (const service of services) {
    if (service.locations.includes(locationSlug)) hit.add(service.pillar);
  }
  return careCategories.filter((category) => hit.has(category.slug));
}

/** The care type a service belongs to. */
export function categoryForService(service: Service): CareCategory | undefined {
  return byCategory.get(service.pillar);
}

/**
 * Services the map cannot place. Nothing should be here: a service outside
 * every care type is one a filtered pin would silently drop.
 */
export function uncategorisedServices(): Service[] {
  return services.filter((service) => !byCategory.has(service.pillar));
}
