/**
 * The service registry.
 *
 * Every service the practice documents, in one place. Until now this list
 * existed only as hand-typed markup inside each of the eight location pages,
 * which is why it had drifted (Draper omitted Immunizations, two offices listed
 * behavioral health services with no behavioral health provider assigned).
 *
 * Everything that mentions a service reads from here: the menu, the pillar hub
 * pages and the service pages. `locations` is transcribed from the live
 * location pages and is the part still to be confirmed with the practice.
 */

export type Pillar = {
  slug: string;
  name: string;
  /** Landing page for the pillar; service pages hang off it. */
  href: string;
  /** One line, used in the menu panel and on cards. */
  blurb: string;
  /** Meta description for the hub page. */
  description: string;
  /**
   * Where the pillar's locations are documented, when it is not the usual
   * location page (dental care has its own office pages).
   */
  locationsHref?: string;
  /** Standing caveat shown beside the list of offices. */
  locationsNote?: string;
  /**
   * Location ids to match providers on, when the provider directory files them
   * somewhere other than the offices listed on the services. The dental team is
   * filed under its own "Dentistry & Orthodontics" location rather than under
   * the pediatric office it shares a building with.
   */
  providerLocationIds?: string[];
  /** Opening paragraph on the hub page. */
  intro: string;
  /**
   * Pillars whose landing page is a page copied from the live site. Those keep
   * their own markup and get a generated index of their services appended;
   * pillars without one get a fully generated hub.
   */
  contentSlug?: string;
};

export type Service = {
  slug: string;
  name: string;
  /** Pillar slug this service belongs to. */
  pillar: string;
  /** One line, used in the menu panel and on cards. */
  blurb: string;
  /** Meta description for the service page. */
  description: string;
  /** Location slugs, transcribed from the live location pages. */
  locations: string[];
  /** Category id in the provider filter, when providers map to this service. */
  providerCategory?: string;
  /** File in `src/authored/`, when the practice's own copy exists. */
  bodyFile?: string;
  /** Standing copy used when there is no authored body yet. */
  intro?: string;
  /** Services one office delivers on behalf of the others. */
  deliveredFrom?: string;
};

export const pillars: Pillar[] = [
  {
    slug: "medical-care",
    name: "Medical Care",
    href: "/services/",
    blurb: "Checkups, sick visits, immunizations and after-hours care.",
    description:
      "Pediatric medical care at Wasatch Pediatrics: Well Child Checkups, same-day sick visits, immunizations, after-hours care, newborn hospital care and in-office procedures.",
    intro:
      "Everyday pediatric care, from your baby's first hours in the hospital through the teenage years. Your pediatrician sees your child for checkups and for the unexpected, and coordinates the rest of their care around it.",
    contentSlug: undefined,
  },
  {
    slug: "behavioral-health",
    name: "Behavioral Health",
    href: "/behavioral-health/",
    blurb: "Therapy, psychiatry and testing, alongside your pediatrician.",
    description:
      "In-house behavioral health at Wasatch Pediatrics: consultation and screening, brief therapy, medication management, and psychological and autism testing.",
    intro:
      "We treat the body and the mind. Our therapists, pediatricians and mental health specialists work as one team, so behavioral health care happens alongside the rest of your child's care rather than somewhere else.",
    contentSlug: "behavioral-health",
  },
  {
    slug: "nutrition",
    name: "Nutrition & Lactation",
    href: "/nutrition/",
    blurb: "Dietitian consultations, lactation support and parent classes.",
    description:
      "Registered dietitian consultations, lactation support for newborn feeding, and parent education classes at Wasatch Pediatrics.",
    intro:
      "Feeding and growth questions rarely have a single answer. Our registered dietitians and lactation support work with your pediatrician on feeding difficulties, growth concerns, food allergies and sports nutrition.",
    contentSlug: undefined,
  },
  {
    slug: "dentistry",
    name: "Dentistry & Orthodontics",
    href: "/dentistry-orthodontics/",
    blurb: "Pediatric dentistry, braces and dental emergencies.",
    description:
      "Pediatric dentistry and orthodontics at Wasatch Pediatrics: first visits, cleanings, fillings, braces and clear aligners, and same-day dental emergencies.",
    intro:
      "Comprehensive care for every stage of your child's dental journey, from baby teeth to braces and beyond, in kid-friendly offices alongside the pediatric care you already know.",
    locationsHref: "/dentistry-orthodontics/",
    providerLocationIds: ["42"],
    locationsNote: "A second dental office in Salt Lake is coming soon.",
    contentSlug: "dentistry-orthodontics",
  },
];

export const services: Service[] = [
  // ------------------------------------------------------------ medical care
  {
    slug: "well-child",
    name: "Well Child Checkups",
    pillar: "medical-care",
    blurb: "Routine visits that track growth, development and whole health.",
    description:
      "Well Child Checkups at Wasatch Pediatrics track your child's growth, development and whole health, from newborn visits through annual exams to age 21.",
    locations: [
      "cottonwood",
      "draper",
      "farmington",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    providerCategory: "12",
    bodyFile: "well-child",
  },
  {
    slug: "sick-visits",
    name: "Same-Day Sick Visits",
    pillar: "medical-care",
    blurb: "Same-day appointments for illness and injury.",
    description:
      "Same-day appointments for illness and injury at Wasatch Pediatrics, from sore throats and wound care to concussions and initial fracture care.",
    locations: [
      "cottonwood",
      "draper",
      "farmington",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    providerCategory: "12",
    bodyFile: "sick-visits",
  },
  {
    slug: "after-hours-care",
    name: "After Hours Care",
    pillar: "medical-care",
    blurb: "Evenings, weekends and holidays, by appointment.",
    description:
      "After Hours Care at Wasatch Pediatrics covers weeknights, weekends and holidays by appointment, with a 24/7 on-call nurse and physician line.",
    locations: [
      "cottonwood",
      "draper",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    providerCategory: "12",
    bodyFile: "after-hours-care",
  },
  {
    slug: "immunizations",
    name: "Immunizations",
    pillar: "medical-care",
    blurb: "The AAP-recommended schedule, explained.",
    description:
      "Wasatch Pediatrics follows the evidence-based immunization schedule recommended by the American Academy of Pediatrics, and will talk through any question you have.",
    locations: [
      "cottonwood",
      "farmington",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    providerCategory: "12",
    bodyFile: "immunizations",
  },
  {
    slug: "newborn-hospital-care",
    name: "Newborn Hospital Care",
    pillar: "medical-care",
    blurb: "Your pediatrician sees your baby at the hospital.",
    description:
      "Our pediatricians care for newborns in the hospital as well as in the office, so your baby's first visit happens before you come home.",
    locations: [
      "cottonwood",
      "draper",
      "farmington",
      "grow-up-great",
      "salt-lake",
      "summit",
    ],
    providerCategory: "12",
    intro:
      "Our pediatricians care for newborns in the hospital as well as in the office, so the first visit happens before you come home. Which hospital your pediatrician rounds at depends on the office, so ask when you book your prenatal visit.",
  },
  {
    slug: "lab-tests-screenings",
    name: "Lab Tests & Screenings",
    pillar: "medical-care",
    blurb: "In-office testing, so most results come back the same visit.",
    description:
      "Routine labs and screenings are run in our own offices, which usually means results and a plan during the same appointment.",
    locations: [
      "cottonwood",
      "draper",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    intro:
      "Routine labs and screenings are run in the office rather than sent out, which usually means results and a plan during the same appointment instead of a second trip.",
  },
  {
    slug: "ear-piercing",
    name: "Ear Piercing",
    pillar: "medical-care",
    blurb: "Done in a medical office, by clinical staff.",
    description:
      "Ear piercing at Wasatch Pediatrics is performed in the office by clinical staff, with sterile technique and aftercare guidance.",
    locations: ["draper", "farmington", "southpoint", "willow-creek"],
    intro:
      "Ear piercing performed in the office by our clinical staff, with sterile single-use equipment and aftercare guidance — and a provider who already knows your child.",
  },
  {
    slug: "medical-home-coordination",
    name: "Medical Home Coordination",
    pillar: "medical-care",
    blurb: "One team coordinating specialists, records and care plans.",
    description:
      "For children who see multiple specialists, your Wasatch pediatrician acts as the medical home, coordinating referrals, records and care plans.",
    locations: [
      "cottonwood",
      "draper",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    intro:
      "For children who see several specialists, your pediatrician acts as the medical home — coordinating referrals, records and care plans so that nothing falls between providers.",
  },
  {
    slug: "in-office-procedures",
    name: "In-Office Procedures",
    pillar: "medical-care",
    blurb: "Laceration repair, Nexplanon, Accutane and asthma testing.",
    description:
      "Procedures Wasatch Pediatrics handles in the office rather than referring out, including laceration repair, Nexplanon, Accutane management and asthma testing.",
    locations: ["farmington", "grow-up-great", "salt-lake", "willow-creek"],
    intro:
      "Procedures we handle in the office rather than sending you elsewhere. Exactly which ones are offered varies by office, so check the location nearest you before booking.",
  },

  // ------------------------------------------------------- behavioral health
  {
    slug: "behavioral-consultation",
    name: "Consultation & Screening",
    pillar: "behavioral-health",
    blurb: "Assessment, treatment planning and referrals.",
    description:
      "Assessment and evaluation of behavioral and mental health concerns at Wasatch Pediatrics, with treatment planning, resources and referrals.",
    locations: [
      "cottonwood",
      "draper",
      "farmington",
      "grow-up-great",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    providerCategory: "14",
    intro:
      "Assessment and evaluation of behavioral and mental health concerns, treatment planning, and resource and referral information — including the behavioral health screenings offered during regular Well Child Checkups.",
  },
  {
    slug: "therapy",
    name: "Therapy",
    pillar: "behavioral-health",
    blurb: "Brief therapy for anxiety, depression, ADHD, sleep and more.",
    description:
      "Brief therapy at Wasatch Pediatrics for sleep concerns, parenting support, anxiety, depression, ADHD and other mental health concerns.",
    locations: [
      "cottonwood",
      "draper",
      "farmington",
      "grow-up-great",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    providerCategory: "14",
    intro:
      "Brief therapy — typically one to six scheduled sessions — for sleep concerns, sibling conflict, parenting support, back to school, a change of environment, bereavement, anxiety, depression, ADHD or more significant mental health concerns.",
  },
  {
    slug: "psychiatry",
    name: "Medication Management",
    pillar: "behavioral-health",
    blurb: "Psychiatric assessment and medication management.",
    description:
      "Medication management for behavioral and mental health disorders at Wasatch Pediatrics, provided by your pediatrician or in consultation with pediatric psychiatry.",
    locations: [
      "cottonwood",
      "draper",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    providerCategory: "14",
    intro:
      "Medications for behavioral and mental health disorders, provided by your pediatrician — in some cases by a psychiatric nurse practitioner or physician assistant, or in consultation with pediatric psychiatry.",
  },
  {
    slug: "autism-testing",
    name: "Psychological & Autism Testing",
    pillar: "behavioral-health",
    blurb: "Formal evaluation and diagnosis, at our Summit office.",
    description:
      "Formal psychological and autism evaluation at Wasatch Pediatrics Summit, including assessment, diagnosis and a written report.",
    locations: ["summit"],
    providerCategory: "14",
    intro:
      "Formal psychological and autism evaluation: structured assessment, a diagnosis where one applies, and a written report you can take to school or on to a specialist.",
  },

  // -------------------------------------------------------------- nutrition
  {
    slug: "dietitian",
    name: "Dietitian Consultation",
    pillar: "nutrition",
    blurb: "Registered dietitian support for feeding, growth and sports.",
    description:
      "Registered dietitian consultations at Wasatch Pediatrics for feeding difficulties, growth concerns, food allergies and sports nutrition.",
    locations: [
      "cottonwood",
      "draper",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    providerCategory: "13",
    deliveredFrom: "southpoint",
    intro:
      "Our registered dietitians work with families on feeding difficulties, growth concerns, food allergies and sports nutrition, with a plan your pediatrician can follow up on at the next visit.",
  },
  {
    slug: "lactation-consultation",
    name: "Lactation Consultation",
    pillar: "nutrition",
    blurb: "Feeding support for newborns and their parents.",
    description:
      "Lactation consultation at Wasatch Pediatrics: one-to-one help with latch, supply, pumping and feeding plans for newborns and infants.",
    locations: [
      "cottonwood",
      "grow-up-great",
      "salt-lake",
      "southpoint",
      "summit",
      "willow-creek",
    ],
    intro:
      "One-to-one help with latch, supply, pumping and feeding plans, for parents of newborns and infants — booked like any other appointment at your own office.",
  },
  {
    slug: "community-classes",
    name: "Community Classes",
    pillar: "nutrition",
    blurb: "Education classes for parents, run at our offices.",
    description:
      "Parent education classes held at Wasatch Pediatrics offices. Topics and schedules vary by location.",
    locations: [
      "draper",
      "grow-up-great",
      "salt-lake",
      "summit",
      "willow-creek",
    ],
    intro:
      "Education classes for parents and caregivers, held at our offices. Topics and schedules vary by location, so check with the office nearest you for what is running.",
  },

  // -------------------------------------------------------------- dentistry
  {
    slug: "pediatric-dentistry",
    name: "Pediatric Dentistry",
    pillar: "dentistry",
    blurb: "First visits, cleanings, fillings and sedation options.",
    description:
      "Pediatric dentistry at Wasatch Pediatrics: first dental visits and exams, cleanings, preventive care, fillings and crowns, and sedation options.",
    locations: ["southpoint"],
    providerCategory: "41",
    intro:
      "Complete dental care for children from the first tooth through adolescence: first visits and exams, cleanings and preventive care, fillings and crowns, wisdom teeth removal, and sedation options for children who need them.",
  },
  {
    slug: "orthodontics",
    name: "Orthodontics",
    pillar: "dentistry",
    blurb: "Braces and clear aligners for children and teens.",
    description:
      "Orthodontics at Wasatch Pediatrics: traditional braces, Invisalign, early intervention treatment and free consultations with a board-certified orthodontist.",
    locations: ["southpoint"],
    providerCategory: "41",
    intro:
      "Our board-certified pediatric orthodontist provides traditional braces and Invisalign, early intervention treatment, and free consultations — with after-hours phone support when something breaks.",
  },
  {
    slug: "dental-emergencies",
    name: "Dental Emergencies",
    pillar: "dentistry",
    blurb: "Same-day help for knocked-out teeth, pain and swelling.",
    description:
      "Same-day dental emergency appointments at Wasatch Pediatrics for toothaches, injuries and knocked-out teeth, with after-hours phone support.",
    locations: ["southpoint"],
    providerCategory: "41",
    intro:
      "Same-day appointments for toothaches, injuries and dental emergencies such as knocked-out or chipped teeth, swelling, and orthodontic problems like broken brackets and poking wires. After-hours phone support is available.",
  },
];

export const serviceBySlug = new Map(
  services.map((service) => [service.slug, service]),
);
export const pillarBySlug = new Map(
  pillars.map((pillar) => [pillar.slug, pillar]),
);

export function servicesInPillar(pillarSlug: string): Service[] {
  return services.filter((service) => service.pillar === pillarSlug);
}

/** Human-readable office names, matching the location pages. */
export const locationNames: Record<string, string> = {
  cottonwood: "Cottonwood",
  draper: "Draper",
  farmington: "Farmington",
  "grow-up-great": "Grow Up Great",
  "salt-lake": "Salt Lake",
  southpoint: "Southpoint",
  summit: "Summit",
  "willow-creek": "Willow Creek",
};

/** Location ids used by the provider filter, keyed by location slug. */
export const locationIds: Record<string, string> = {
  cottonwood: "5",
  draper: "6",
  farmington: "7",
  "grow-up-great": "8",
  "salt-lake": "9",
  southpoint: "10",
  summit: "11",
  "willow-creek": "4",
};

export function locationHref(slug: string): string {
  return `/locations/${slug}/`;
}

export function serviceHref(service: Service): string {
  const pillar = pillarBySlug.get(service.pillar);
  return `${pillar?.href ?? "/services/"}${service.slug}/`;
}
