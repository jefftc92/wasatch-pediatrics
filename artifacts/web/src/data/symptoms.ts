/**
 * The symptoms we publish a page for, and what we say about each.
 *
 * The division of labour is deliberate and is the reason these pages are worth
 * having at all:
 *
 *   The American Academy of Pediatrics owns the clinical guidance. Their
 *   Symptom Checker is embedded on each page, opened straight at the matching
 *   symptom, and they keep it current. Nothing clinical is copied out of it —
 *   what to do about a fever at 2am is their sentence to write and to update,
 *   not ours to freeze into a file.
 *
 *   We own the introduction and the what-next. The introduction says what a
 *   parent is actually looking at and why they are here; the what-next says
 *   where the problem goes in *this* practice — the 24/7 nurse line, a
 *   same-day visit, After Hours Care, or an emergency room.
 *
 * That split is also what keeps these pages from being 187 copies of each
 * other. The AAP frame differs by a query parameter, which no search engine
 * can see; the introductions have to do the differentiating, so each one is
 * written for its own symptom and none of them is a template.
 *
 * What is deliberately absent: thresholds. No "call us if the temperature is
 * above", no "go to the emergency room when". Those belong in the frame, from
 * the people who revise them, and putting our own numbers beside theirs would
 * only create two sources that can disagree.
 */

export type Symptom = {
  /** URL segment: /symptom-checker/<slug>/ */
  slug: string;
  /** The page's H1. */
  title: string;
  /**
   * The AAP's own name for this topic, passed to their viewer verbatim.
   * `tools/check-symptom-links.mjs` verifies each one still resolves.
   */
  aap: string;
  /**
   * One sentence under the title, and the most useful thing on the page.
   *
   * Not the meta description. That was the first mistake here: a description
   * written for a search result — "what a fever means, how to use the Symptom
   * Checker, and when to call us" — was shown to the reader as well, where it
   * reads as a table of contents for a page they can already see. This is the
   * sentence a parent would want if they only read one.
   */
  lead: string;
  /** Meta description. Written for a search result, still worth reading. */
  description: string;
  /** Ours: what the parent is looking at, and why they are here. */
  intro: string[];
};

export const symptoms: Symptom[] = [
  {
    slug: "fever",
    title: "Fever in Children",
    aap: "Fever",
    lead:
      "Most fevers are the immune system doing its job — how your child is behaving tells you more than the number on the thermometer.",
    description:
      "Most childhood fevers are ordinary infections, and how a child is acting matters more than the reading. What to watch for, and how to reach a Wasatch Pediatrics nurse at any hour.",
    intro: [
      "\u201cBehaving\u201d is the part worth watching, and it is more specific than it sounds: a child who is drinking, responding to you and playing a little between doses of fever medicine is reassuring almost whatever the thermometer says. A child who is limp, hard to rouse, or refusing all fluids is worth a call even when the reading is unremarkable.",
      "Fever medicine is for comfort, not for the number. Bringing a temperature part of the way down so a child will drink and sleep has done the job; a fever that does not vanish entirely has not failed to respond. Most fevers from ordinary infections settle within two to three days.",
    ],
  },
  {
    slug: "fever-under-1",
    title: "Fever in Babies Under 12 Months",
    aap: "Fever (0-12 Months)",
    lead:
      "In the first months a fever is treated more carefully than at any later age — under three months, any fever means call us tonight.",
    description:
      "Fever in a baby under a year is handled differently from fever in an older child. Under three months it means calling us straight away. Wasatch Pediatrics answers 24 hours a day.",
    intro: [
      "The reason is that a small baby has fewer ways to show you they are unwell. The signs that would be obvious in a four-year-old — saying where it hurts, looking flushed, going quiet — are muted or absent, so the threshold for being checked is deliberately lower.",
      "Feeding and alertness carry most of the information at this age. A baby who is feeding as usual and waking normally is telling you something different from one who has gone floppy, is difficult to rouse, or has stopped taking milk.",
    ],
  },
  {
    slug: "cough",
    title: "Cough in Children",
    aap: "Cough",
    lead:
      "Most coughs are the airway clearing itself and outlast the illness by weeks — it is the breathing underneath that tells you something.",
    description:
      "Coughs in children often last three weeks and that is normal. What the different coughs mean, what to watch in your child's breathing, and when to bring them in.",
    intro: [
      "Look at the child rather than the cough. Fast breathing, ribs pulling in with each breath, flaring nostrils, or a baby too breathless to finish a feed all matter more than how dramatic the noise is. A loud cough in a child who is playing is a good sign.",
      "Coughs also outstay their welcome. Three weeks after a cold is common and is not a sign that something has been missed, though a cough that improves and then clearly worsens is worth a second look.",
    ],
  },
  {
    slug: "croup",
    title: "Croup in Children",
    aap: "Croup",
    lead:
      "That barking, seal-like cough is croup — it is worse at night, better by morning, and almost always sounds far worse than it is.",
    description:
      "Croup's barking cough and noisy breathing, why it peaks in the small hours, what helps at home, and when a child needs to be seen tonight.",
    intro: [
      "What helps in the moment is calm and cool air. Upset makes the airway noise worse, so sitting with your child, keeping them upright, and opening a window or stepping outside often settles things within minutes.",
      "The sound to take seriously is not the cough but the breathing between coughs — a harsh noise while breathing in when the child is calm and at rest, rather than only when crying, is a different thing from the barking itself.",
    ],
  },
  {
    slug: "sore-throat",
    title: "Sore Throat in Children",
    aap: "Sore Throat",
    lead:
      "Most sore throats come with a cold and clear on their own — it is the ones without a cough that are worth a strep swab.",
    description:
      "Sore throats in children: which ones are viral, which are worth testing for strep, and how to get a same-day swab at Wasatch Pediatrics.",
    intro: [
      "The pattern that suggests strep is a sore throat with fever and no cough at all, often with a headache or a stomach ache, sometimes with a fine sandpapery rash. A sore throat arriving with a streaming nose and a cough is almost always viral.",
      "Strep matters because it is treatable and because treating it prevents complications, but it cannot be told apart by looking — a swab is what settles it, and that is a short appointment rather than something to wonder about for a week.",
    ],
  },
  {
    slug: "strep-throat",
    title: "Strep Throat in Children",
    aap: "Strep Throat Infection",
    lead:
      "Strep cannot be diagnosed by looking, including by us — it takes a swab, and that is a short same-day visit.",
    description:
      "Strep throat in children: how it differs from a viral sore throat, why a swab is the only way to know, and same-day testing at Wasatch Pediatrics.",
    intro: [
      "Once treatment starts, most children feel better within a day or two and are no longer contagious after about 24 hours of antibiotics, which is usually what decides a return to school.",
      "Finishing the course matters more here than with most prescriptions. The point of treating strep is not only to shorten the sore throat but to prevent the complications that follow an infection left half-treated.",
    ],
  },
  {
    slug: "earache",
    title: "Earache in Children",
    aap: "Earache",
    lead:
      "Ear pain often arrives a few days after a cold, and in a younger child it shows up as pulling at the ear or a night nobody sleeps.",
    description:
      "Ear pain in children: why it follows colds, what it looks like in a baby who cannot tell you, and how to get seen the same day.",
    intro: [
      "Not every painful ear needs antibiotics. Many ear infections clear on their own, and a common approach is to treat the pain properly and reassess in a day or two — which is a conversation worth having rather than an argument to head off.",
      "Pain relief in the meantime does more than comfort: a child who is not in pain will sleep and drink, and both help. Fluid draining from the ear, or pain with swelling behind the ear, changes the picture and is worth a call.",
    ],
  },
  {
    slug: "vomiting",
    title: "Vomiting in Children",
    aap: "Vomiting Without Diarrhea",
    lead:
      "With vomiting the question is never how many times — it is whether fluids are staying down.",
    description:
      "Vomiting in children without diarrhea: how to keep a child hydrated, what to offer and when, and the signs that mean calling us.",
    intro: [
      "Small amounts, often, beats a glass at a time — a few teaspoons every few minutes stays down when a full drink comes straight back. Wait a short while after a vomit before starting again.",
      "Wet diapers or trips to the toilet are the practical measure of whether it is working. A child who is passing urine, has moist lips and is producing tears is keeping up, however unpleasant the night has been.",
    ],
  },
  {
    slug: "vomiting-and-diarrhea",
    title: "Vomiting and Diarrhea in Children",
    aap: "Vomiting With Diarrhea",
    lead:
      "Almost all of a stomach bug is fluid — small amounts, often, for as long as it takes.",
    description:
      "Vomiting with diarrhea in children: how to keep fluids going, how long it usually lasts, and when a child needs to be seen.",
    intro: [
      "Oral rehydration solution is better than juice, sports drinks or flat soda, all of which are too sugary and can make diarrhea worse. Plain water alone is not ideal either for a child losing a lot of fluid.",
      "Food can come back as soon as your child wants it, and does not need to be bland — the old advice to restrict the diet for days has gone. Getting back to normal eating helps the gut recover.",
    ],
  },
  {
    slug: "diarrhea",
    title: "Diarrhea in Children",
    aap: "Diarrhea",
    lead:
      "Loose stools often lag a week behind the rest of the recovery, which is normal — hydration is what matters.",
    description:
      "Diarrhea in children: how long it normally lasts, how to keep your child hydrated, and the signs worth a call to Wasatch Pediatrics.",
    intro: [
      "Recovery is gradual and untidy, and it is easy to mistake for a relapse. Several days of gradually firming stools is the ordinary course, not a sign the bug has come back.",
      "What changes the picture is blood in the stool, diarrhea that comes with a high fever or severe stomach pain, or a child who is not keeping fluids up. Those are worth a call rather than a wait.",
    ],
  },
  {
    slug: "colds",
    title: "Colds in Children",
    aap: "Colds",
    lead:
      "Six to ten colds a year is normal, and thick green mucus is not a reason for antibiotics — a cold that improves then clearly worsens is.",
    description:
      "Colds in children: why so many are normal, what green mucus does and does not mean, and when a cold is worth a call.",
    intro: [
      "A cold usually peaks around day three and eases from there. The shape that deserves a second look is the opposite one — a child who was on the mend and then goes downhill again, or a fever that turns up late in an illness that had been settling.",
      "Very little shortens a cold. Fluids, rest, saline drops and a humidifier help a child through it; over-the-counter cough and cold medicines are not recommended for young children and do more harm than good.",
    ],
  },
  {
    slug: "flu",
    title: "Flu in Children",
    aap: "Influenza - Seasonal",
    lead:
      "Flu arrives all at once rather than creeping up — and if it is flu, day one is the day to call, not day three.",
    description:
      "Flu in children: how it differs from a cold, why timing matters for antiviral treatment, and same-day appointments at Wasatch Pediatrics.",
    intro: [
      "Antiviral treatment, where it is appropriate, works best started within the first day or two, which is why the timing matters more with flu than with the illnesses it resembles. It is not right for every child, and that is a conversation rather than a given.",
      "Flu also tends to knock a child flat for longer than a cold — several days of fever and aching is normal — and the cough can linger a week or two after everything else has passed.",
    ],
  },
  {
    slug: "rsv",
    title: "RSV and Bronchiolitis in Babies",
    aap: "RSV-Bronchiolitis",
    lead:
      "RSV in a baby often gets worse before it gets better, around day three to five — watch the breathing and the feeding.",
    description:
      "RSV and bronchiolitis in babies: what to watch in breathing and feeding, why days three to five matter most, and when to call us.",
    intro: [
      "The reason feeding matters so much is mechanical: a baby cannot work hard at breathing and feed well at the same time. Taking noticeably less than usual, or much longer over each bottle, is often the first thing to change.",
      "Nothing shortens bronchiolitis — antibiotics do not touch it and inhalers usually do not either. Care is about keeping a baby fed, hydrated and breathing comfortably while it runs its course, which is a week or two.",
    ],
  },
  {
    slug: "covid-19",
    title: "COVID-19 in Children",
    aap: "COVID-19 Diagnosed or Suspected",
    lead:
      "For most children COVID looks like another winter virus and passes at home — age and existing conditions are what change that.",
    description:
      "COVID-19 in children: what to expect at home, what to watch for, how long to keep a child off school, and when to call Wasatch Pediatrics.",
    intro: [
      "Age and existing conditions are what change the picture. A baby, or a child with a significant heart, lung or immune condition, is worth a phone call early rather than a wait-and-see.",
      "Isolation guidance changes, and your child's school or daycare may have its own rules that differ from the public health advice. It is worth checking both rather than assuming.",
    ],
  },
  {
    slug: "head-injury",
    title: "Head Injury in Children",
    aap: "Head Injury",
    lead:
      "What matters after a bump is not the size of the lump but how your child has been in the hours since.",
    description:
      "Head injuries in children: what to watch for in the hours afterwards, which signs mean an emergency room, and when to call us.",
    intro: [
      "The hours afterwards are what to watch: repeated vomiting, a worsening headache, unusual drowsiness, confusion, unsteadiness, or a child who is simply not themselves in a way you cannot put your finger on.",
      "A big soft swelling on the forehead looks alarming and usually is not — the scalp bleeds easily. Any loss of consciousness, a seizure, or a fall from a significant height is different, and belongs in an emergency room rather than a phone call.",
    ],
  },
  {
    slug: "rash",
    title: "Rashes in Children",
    aap: "Rash or Redness - Widespread",
    lead:
      "Most rashes come with a virus and fade on their own — the useful test is whether the spots fade when you press them.",
    description:
      "Widespread rashes in children: which are ordinary viral rashes, the ones that need urgent attention, and how to get seen the same day.",
    intro: [
      "Use a glass or a finger to check. Anything that stays visible under pressure needs urgent attention, particularly in a child who is unwell with it — that one sign carries more weight than what the rash looks like.",
      "How the child is otherwise carries most of the weight. A widespread rash on a child who is eating, playing and comfortable is a different thing from the same rash on a child who is floppy, feverish and getting worse.",
    ],
  },
  {
    slug: "hives",
    title: "Hives in Children",
    aap: "Hives",
    lead:
      "Hives move around — appearing in one place as they fade from another — and are usually a reaction to a virus, not to food.",
    description:
      "Hives in children: why they travel, what usually triggers them, what helps the itch, and the swelling that means an emergency.",
    intro: [
      "Antihistamines are the usual treatment and often need to be continued for several days rather than a single dose, because hives tend to come in waves as they settle.",
      "Swelling of the lips, tongue or face, any difficulty breathing or swallowing, or hives with vomiting and floppiness is anaphylaxis until proven otherwise — that is 911, and adrenaline if your child has been prescribed it.",
    ],
  },
  {
    slug: "pink-eye",
    title: "Pink Eye in Children",
    aap: "Eye - Pus or Discharge",
    lead:
      "Most pink eye is viral and clears on its own; the kind that glues the lashes shut overnight is the kind that may need drops.",
    description:
      "Pink eye in children: telling viral from bacterial, whether drops are needed, and when a child can go back to school.",
    intro: [
      "Most of the management is hygiene rather than medicine. Wiping from the inner corner outwards with a clean cloth each time, separate towels, and washed hands keep it from crossing to the other eye and around the household.",
      "Pain rather than irritation, changed vision, marked light sensitivity, or a red eye after an injury or in a newborn are all different and should be looked at rather than waited out.",
    ],
  },
  {
    slug: "constipation",
    title: "Constipation in Children",
    aap: "Constipation",
    lead:
      "Constipation is about how hard and how painful, not how often — and it becomes a cycle if it is left alone.",
    description:
      "Constipation in children: what actually counts as constipated, why holding on makes it worse, and how we help break the cycle.",
    intro: [
      "Withholding is the part parents most often miss. A child who has had one painful stool will hold on to avoid another, which makes the next harder still — so the crossed legs and the hiding behind the sofa are usually avoidance rather than straining.",
      "Treatment takes longer than most families expect, often months rather than days, because the aim is to keep stools soft long enough for a stretched bowel to recover and for a child to stop expecting pain.",
    ],
  },
  {
    slug: "asthma-attack",
    title: "Asthma Attacks in Children",
    aap: "Asthma Attack",
    lead:
      "Start with the action plan and the reliever — this page is for the judgement that comes after.",
    description:
      "Asthma attacks in children: using the action plan, judging whether the inhaler is working, and when an attack needs urgent care.",
    intro: [
      "What tells you whether the reliever is working is the breathing rather than the cough: a child who is talking in full sentences, calm and comfortable a few minutes after the inhaler has responded. One who cannot finish a sentence, is using their neck or ribs to breathe, or is going quiet has not.",
      "It is worth bringing the plan and the inhalers to any visit, and worth asking about the technique — a spacer, used properly, delivers far more of the dose than an inhaler alone, and poor technique is a common reason an attack seems not to respond.",
    ],
  },
  {
    slug: "teething",
    title: "Teething in Babies",
    aap: "Teething",
    lead:
      "Teething causes sore gums and a miserable baby — it does not cause a high fever, diarrhea or a cough.",
    description:
      "Teething in babies: what it really causes, what helps, and why blaming a fever on teething is how something else gets missed.",
    intro: [
      "What helps is pressure and cold: a chilled teething ring, a clean cold washcloth to chew, or a gum rubbed with a clean finger. Teething gels and amber necklaces are not recommended, and the necklaces are a strangulation and choking risk.",
      "The timing is very variable. A first tooth anywhere between three months and a year is normal, and so is a baby who gets several in a fortnight and then none for months.",
    ],
  },
  {
    slug: "newborn-jaundice",
    title: "Jaundice in Newborns",
    aap: "Jaundiced Newborn",
    lead:
      "Most newborns go a little yellow in the first week; it is checked rather than eyeballed, because the level is what matters.",
    description:
      "Jaundice in newborns: why it is so common, why it still gets checked, and how quickly Wasatch Pediatrics sees new babies.",
    intro: [
      "Feeding is what clears it, because it is passed out in the stool — so a well-fed baby who is filling diapers is doing exactly what is needed, and jaundice that comes with poor feeding is more of a concern than jaundice alone.",
      "Timing matters as much as color. Jaundice in the first 24 hours of life, jaundice that is deepening after the first week, or a baby who is difficult to wake for feeds should be checked rather than watched.",
    ],
  },
  {
    slug: "crying-baby",
    title: "A Crying Baby Under 3 Months",
    aap: "Crying Baby - Before 3 Months Old",
    lead:
      "Crying peaks at about six weeks and hours a day can be normal — and if you are at the end of your rope, that is what our line is for.",
    description:
      "A baby under three months who will not stop crying: what is normal, what helps, and when to call. Wasatch Pediatrics answers 24 hours a day.",
    intro: [
      "Work through the ordinary causes first — hungry, wet, too hot or cold, wind, wanting to be held — and then accept that sometimes there is no cause to find. Movement, a carrier, white noise, a walk outside and a change of arms all help more often than not.",
      "Crying that is different is what to call about: a weak or high-pitched cry, a baby who has gone floppy or is difficult to rouse, crying with a fever, or a sudden change in a baby who was settled.",
    ],
  },
  {
    slug: "immunization-reactions",
    title: "Reactions After Immunizations",
    aap: "Immunization Reactions",
    lead:
      "A sore leg, a small fever and a grumpy day or two after vaccines are expected and settle on their own.",
    description:
      "What is normal after a child's immunizations, how long it lasts, what helps, and the reactions worth telling us about.",
    intro: [
      "Comfort is most of it. Moving the limb, a cool cloth, extra feeds and cuddles all help, and fever medicine is fine if your child is uncomfortable — it does not stop the vaccine working.",
      "What is worth telling us about is a reaction beyond the ordinary: a large area of redness spreading up a limb, a high fever lasting beyond a couple of days, or a baby who is inconsolable for hours in a way that is unlike them.",
    ],
  },
  {
    slug: "insect-bites",
    title: "Insect Bites in Children",
    aap: "Insect Bite",
    lead:
      "Children react to bites more than adults do — a big swelling is usually ordinary; one that spreads and hurts more after a day or two is not.",
    description:
      "Insect bites and stings in children: telling a normal reaction from an infection, what helps the itch, and when to be seen.",
    intro: [
      "An ordinary large reaction appears within a day, peaks, and starts to settle. An infected bite goes the other way — it gets more painful, redder and warmer after two or three days, sometimes with a spreading edge or a fever.",
      "For the itch, a cold compress and an antihistamine do more than most creams. Keeping fingernails short matters more than it sounds, because most infected bites started as scratched ones.",
    ],
  },
  {
    slug: "tick-bites",
    title: "Tick Bites in Children",
    aap: "Tick Bite",
    lead:
      "Take the whole tick off promptly with fine tweezers close to the skin — no heat, no petroleum jelly, no twisting.",
    description:
      "Tick bites in children: how to remove a tick properly, what to watch for in the weeks afterwards, and when to call us.",
    intro: [
      "Save the tick if you can, in a bag or taped to a card, and note the date. If a rash or an illness follows in the weeks afterwards, knowing what bit your child and when is genuinely useful.",
      "A small red mark at the site for a few days is normal. An expanding rash, particularly one with a clear center, or fever, headache and aching in the weeks after a bite, is worth a call.",
    ],
  },
  {
    slug: "nosebleeds",
    title: "Nosebleeds in Children",
    aap: "Nosebleed",
    lead:
      "Most nosebleeds stop with pressure held longer and lower than people expect — on the soft part of the nose, not the bridge.",
    description:
      "Nosebleeds in children: how to stop one properly, why dry Utah air causes so many, and when a nosebleed needs to be seen.",
    intro: [
      "The technique is the whole thing: lean forward, not back, and pinch the soft part of the nose just below the bone — firmly, without letting go to check — for a full ten minutes by the clock. Most that seem unstoppable were released too early.",
      "Prevention is mostly moisture. A humidifier at night, saline spray, and a little petroleum jelly inside the nostril in winter prevent more nosebleeds than anything done after one starts.",
    ],
  },
  {
    slug: "headache",
    title: "Headaches in Children",
    aap: "Headache",
    lead:
      "One headache is usually sleep, food, water or a screen — it is a pattern, especially one that wakes a child, that is worth looking at.",
    description:
      "Headaches in children: the ordinary causes, the patterns worth attention, and when to book an appointment at Wasatch Pediatrics.",
    intro: [
      "Go through the ordinary causes honestly before looking further: sleep, meals, water, screens, and stress at school account for the great majority, and they are worth fixing in their own right.",
      "The patterns worth a look are headaches that wake a child from sleep, that come with vomiting in the early morning, that follow a head injury, or that are becoming steadily more frequent or more severe over weeks.",
    ],
  },
];

export const symptomBySlug = new Map(symptoms.map((s) => [s.slug, s]));
