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
 * Icons are Phosphor regular where the subject is an object -- a thermometer,
 * a toilet, an ear, a shield -- and Healthicons outline where it is anatomy,
 * which Phosphor does not draw. Both are MIT and both are inlined into
 * `/assets/icons.svg`; each symbol keeps its own viewBox, 256 for Phosphor and
 * 48 for Healthicons, so nothing has to be redrawn to a common grid.
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
    icon: "shield-plus",
    color: ORANGE,
    blurb: "Fevers, infections and feeling unwell",
  },
  "Coughs and breathing": {
    icon: "lungs",
    color: BLUE,
    blurb: "Coughs, colds, croup and noisy breathing",
  },
  "Stomach and bowels": {
    icon: "stomach",
    color: GREEN,
    blurb: "Stomach pain, vomiting and diarrhea",
  },
  "Skin and rashes": {
    icon: "skin-spots",
    color: ORANGE,
    blurb: "Rashes, spots, eczema and skin conditions",
  },
  "Ears, nose, mouth and teeth": {
    icon: "ear",
    color: BLUE,
    blurb: "Earache, toothache, mouth ulcers and sinus pain",
  },
  Eyes: {
    icon: "eye-anat",
    color: GREEN,
    blurb: "Pink eye, styes, allergies and eye injuries",
  },
  "Knocks, pain and injuries": {
    icon: "bandaids",
    color: ORANGE,
    blurb: "Head injuries, cuts, burns, and aches and pains",
  },
  "Bites and stings": {
    icon: "mosquito",
    color: GREEN,
    blurb: "Insect bites, stings, ticks and animal bites",
  },
  "Babies and newborns": {
    icon: "baby",
    color: BLUE,
    blurb: "Crying, jaundice, teething and newborn worries",
  },
  "Feeding and growth": {
    icon: "nutrition",
    color: GREEN,
    blurb: "Breastfeeding, bottles, solids and swallowed objects",
  },
  "Peeing and private parts": {
    icon: "bladder",
    color: BLUE,
    blurb: "Peeing, bladder infections and genital care",
  },
  "Feelings and mental health": {
    icon: "mind",
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
 * The anatomy comes from Healthicons (MIT, Resolve to Save Lives), a set
 * drawn for exactly this: lungs for a cough, a stomach for vomiting, the
 * intestines for a stomach ache, the ear-nose-throat profile for a sore
 * throat, spotted skin for a rash. Phosphor has none of those -- no throat,
 * no lungs, no stomach -- which is why an earlier pass had to reach for a
 * spiral and a head-with-sound. Its outline weight sits with Phosphor's
 * regular closely enough to mix in one row; both were measured side by side
 * before anything was swapped in.
 *
 * The colour still comes from the group, so a tile and its category card are
 * still visibly the same family; only the picture is now the symptom's own.
 */
export const symptomIcon: Record<string, string> = {
  fever: "thermometer-simple",
  cough: "lungs",
  vomiting: "stomach",
  diarrhea: "toilet",
  rash: "skin-spots",
  "sore-throat": "throat",
  earache: "ear",
  "stomach-pain": "intestines",
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
