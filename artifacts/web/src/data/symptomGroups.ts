/**
 * What each symptom group looks like on the index, and what it covers.
 *
 * The index used to list thirteen group names and nothing else, so a parent
 * had to already know which card a symptom lives under. The blurb says it, in
 * the words somebody would search with.
 *
 * Every blurb names symptoms this group actually contains, checked against
 * `symptoms.ts` rather than written from the group's title. The first draft
 * was written from the titles and sent parents the wrong way eight times over:
 * it offered "sore throats" and "nosebleeds" under ears and nose, when a sore
 * throat is filed under fever and infection and a nosebleed under injuries;
 * it offered appetite, weight, sleep, vision, puberty and diapers, none of
 * which is a page anywhere on the site.
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
    blurb: "Earache, toothache, mouth ulcers and sinus pain",
  },
  Eyes: {
    icon: "eye",
    color: GREEN,
    blurb: "Pink eye, styes, allergies and eye injuries",
  },
  "Knocks, pain and injuries": {
    icon: "bandaids",
    color: ORANGE,
    blurb: "Head injuries, cuts, burns, and aches and pains",
  },
  "Bites and stings": {
    icon: "bug",
    color: GREEN,
    blurb: "Insect bites, stings, ticks and animal bites",
  },
  "Babies and newborns": {
    icon: "baby",
    color: BLUE,
    blurb: "Crying, jaundice, teething and newborn worries",
  },
  "Feeding and growth": {
    icon: "ruler",
    color: GREEN,
    blurb: "Breastfeeding, bottles, solids and swallowed objects",
  },
  "Peeing and private parts": {
    icon: "drop",
    color: BLUE,
    blurb: "Peeing, bladder infections and genital care",
  },
  "Feelings and mental health": {
    icon: "brain",
    color: ORANGE,
    blurb: "Depression, anxiety, panic attacks and behavior",
  },
  "Growing up": {
    icon: "person-simple-run",
    color: GREY,
    blurb: "Periods, acne and teenage health",
  },
};

/**
 * The glyph a named symptom is drawn with, where Phosphor has one that says
 * the symptom itself rather than the group it sits in.
 *
 * Before this, every common tile borrowed its group's disc, so the row showed
 * one bowl on "Vomiting", "Diarrhea" and "Stomach pain", and one thermometer
 * on both "Fever" and "Sore throat". Three tiles carrying the same picture
 * teaches a parent nothing and looks like an oversight.
 *
 * Two of the eight have no literal glyph to borrow, because Phosphor has no
 * throat, no lungs and no stomach: "Sore throat" takes `user-sound`, the head
 * with sound coming from it, which at least sits beside `ear` as the other
 * head symptom in its group, and "Stomach pain" takes `spiral` for a churning
 * middle. Both are read with their label beside them, never alone. If the
 * practice wants exact anatomy, these two are the ones to have drawn.
 *
 * The colour still comes from the group, so a tile and its category card are
 * still visibly the same family; only the picture is now the symptom's own.
 */
export const symptomIcon: Record<string, string> = {
  fever: "thermometer-simple",
  cough: "wind",
  vomiting: "toilet",
  diarrhea: "toilet-paper",
  rash: "dots-three-outline",
  "sore-throat": "user-sound",
  earache: "ear",
  "stomach-pain": "spiral",
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
