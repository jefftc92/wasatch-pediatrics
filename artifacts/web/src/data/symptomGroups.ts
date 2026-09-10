/**
 * What each symptom group looks like on the index, and what it covers.
 *
 * The index used to list thirteen group names and nothing else, so a parent
 * had to already know that "Ears, nose, mouth and teeth" is where a sore
 * throat lives. The blurb says it, in the words somebody would search with.
 *
 * Colours are the brand's own — the blue, the green, the orange and the grey
 * `careCategories.ts` already assigns to the four pillars on the locations
 * map. Nothing new is invented here for the same reason it was not invented
 * there: a colour on this page has to mean the same as a colour on that one,
 * which it can only do if there are four of them. They are spread so no two
 * touching cards share one, and they are decoration — every card is also
 * named in text and every icon is `aria-hidden`.
 *
 * Icons are Phosphor regular, the set `/assets/icons.svg` already holds, at
 * the same 256 viewBox. Nine were added for this page rather than forcing a
 * near-match: a thermometer for fever reads instantly, and `i-shield` for it
 * would not.
 */

export type SymptomGroupLook = {
  /** Symbol id in /assets/icons.svg, without the `i-` prefix. */
  icon: string;
  /** One of the brand's four. */
  color: string;
  /** What a parent would find under this group, in their words. */
  blurb: string;
};

const BLUE = "#2b93d1";
const GREEN = "#8dc63f";
const ORANGE = "#f58220";
const GREY = "#636466";

export const symptomGroupLook: Record<string, SymptomGroupLook> = {
  "Fever and infection": {
    icon: "thermometer-simple",
    color: ORANGE,
    blurb: "Fevers, infections and feeling unwell",
  },
  "Coughs and breathing": {
    icon: "wind",
    color: BLUE,
    blurb: "Coughs, colds, croup and noisy breathing",
  },
  "Stomach and bowels": {
    icon: "bowl-food",
    color: GREEN,
    blurb: "Stomach pain, vomiting, diarrhea and constipation",
  },
  "Skin and rashes": {
    icon: "dots-three-outline",
    color: ORANGE,
    blurb: "Rashes, spots, eczema and skin conditions",
  },
  "Ears, nose, mouth and teeth": {
    icon: "ear",
    color: BLUE,
    blurb: "Earache, sore throats, nosebleeds and teeth",
  },
  Eyes: {
    icon: "eye",
    color: GREEN,
    blurb: "Red or sticky eyes, swelling and vision",
  },
  "Knocks, pain and injuries": {
    icon: "bandaids",
    color: ORANGE,
    blurb: "Head injuries, cuts, burns, sprains and pain",
  },
  "Bites and stings": {
    icon: "bug",
    color: GREEN,
    blurb: "Insect bites, stings, ticks and animal bites",
  },
  "Babies and newborns": {
    icon: "baby",
    color: BLUE,
    blurb: "Crying, colic, jaundice and newborn worries",
  },
  "Feeding and growth": {
    icon: "ruler",
    color: GREEN,
    blurb: "Feeding, appetite, weight and growing well",
  },
  "Peeing and private parts": {
    icon: "drop",
    color: BLUE,
    blurb: "Peeing, diapers and genital concerns",
  },
  "Feelings and mental health": {
    icon: "brain",
    color: ORANGE,
    blurb: "Mood, behavior, sleep and mental health",
  },
  "Growing up": {
    icon: "person-simple-run",
    color: GREY,
    blurb: "Puberty, development and older children",
  },
};

/** Never throws on a group nobody has given a look yet. */
export function lookFor(group: string): SymptomGroupLook {
  return (
    symptomGroupLook[group] ?? {
      icon: "circle-dashed",
      color: GREY,
      blurb: "",
    }
  );
}
