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
  /** Meta description. */
  description: string;
  /** Ours: what the parent is looking at, and why they are here. */
  intro: string[];
};

export const symptoms: Symptom[] = [
  {
    slug: "fever",
    title: "Fever in Children",
    aap: "Fever",
    description: "What a fever in a child usually means, how to use the AAP Symptom Checker for it, and when to call Wasatch Pediatrics or come in the same day.",
    intro: [
      "A fever is the body doing its job — the temperature rises because the immune system has started work, and in most children it is a sign of an ordinary infection rather than of something dangerous. What matters more than the number on the thermometer is how your child looks and behaves: a child who is drinking, responding to you and playing between doses of paracetamol is telling you something reassuring, whatever the reading says.",
      "Most parents arrive here at an awkward hour wanting to know whether this can wait until morning. Work through the questions below and they will take you to an answer.",
    ],
  },
  {
    slug: "fever-under-1",
    title: "Fever in Babies Under 12 Months",
    aap: "Fever (0-12 Months)",
    description: "Fever in a baby under a year is treated differently from fever in an older child. Use the AAP Symptom Checker and call Wasatch Pediatrics — we answer 24 hours a day.",
    intro: [
      "Fever in the first year is handled differently from fever in an older child, and the younger the baby the more carefully. A newborn's immune system has less to draw on, the signs of serious illness are quieter, and a baby cannot tell you where it hurts — so the thresholds that apply to a four-year-old do not apply here.",
      "If your baby is under three months and has any fever at all, call us rather than reading. The questions below are the AAP's own, and they will say the same thing.",
    ],
  },
  {
    slug: "cough",
    title: "Cough in Children",
    aap: "Cough",
    description: "Coughs in children: what the different kinds sound like, when a cough needs a doctor, and how to reach Wasatch Pediatrics day or night.",
    intro: [
      "Coughing is how the airway clears itself, which is why most coughs are useful and most do not need treating. What tells you something is the kind of cough and what comes with it: a loose, wet cough at the end of a cold is a different thing from a dry one that will not let a child sleep, and both are different from a cough that comes with fast or laboured breathing.",
      "Coughs also outlast the illness that caused them — three weeks is common and not a sign that something has been missed. The questions below sort the ordinary from the ones worth a phone call.",
    ],
  },
  {
    slug: "croup",
    title: "Croup in Children",
    aap: "Croup",
    description: "Croup's barking cough and noisy breathing, why it is worse at night, and when to call Wasatch Pediatrics or seek urgent care.",
    intro: [
      "Croup is unmistakable once you have heard it: a hoarse, barking cough that parents almost always describe as a seal, often with a harsh noise when the child breathes in. It is caused by swelling in the upper airway, which is why it sounds so much more alarming than the cold that usually precedes it.",
      "It is also famously worse in the evening and the small hours, and famously better by the time you reach a waiting room. That is normal and it is not a reason to doubt what you heard. The questions below cover what to watch for.",
    ],
  },
  {
    slug: "sore-throat",
    title: "Sore Throat in Children",
    aap: "Sore Throat",
    description: "Sore throats in children, what usually causes them, when a test for strep is worth doing, and how to get a same-day appointment at Wasatch Pediatrics.",
    intro: [
      "Most sore throats are viral and come as part of a cold, with a runny nose and a cough alongside them. The ones that make a parent think about strep tend to arrive on their own — a sore throat with fever and no cough at all, sometimes with a stomach ache or a rash.",
      "That distinction matters because it decides whether a swab is worth doing, and a swab is a same-day appointment rather than something to wonder about for a week. Work through the questions below first.",
    ],
  },
  {
    slug: "strep-throat",
    title: "Strep Throat in Children",
    aap: "Strep Throat Infection",
    description: "Strep throat in children: how it differs from a viral sore throat, why testing matters, and same-day appointments at Wasatch Pediatrics.",
    intro: [
      "Strep is a bacterial infection rather than a virus, which is what makes it different from the sore throats that come and go with colds — it is treatable with antibiotics, and treating it shortens the illness and prevents the complications that make it worth catching.",
      "It cannot be diagnosed by looking, including by us. It takes a swab, and that is a short appointment. The questions below will tell you whether one is worth booking.",
    ],
  },
  {
    slug: "earache",
    title: "Earache in Children",
    aap: "Earache",
    description: "Ear pain in children, what usually causes it, and when to bring your child in. Same-day appointments and a 24/7 nurse line at Wasatch Pediatrics.",
    intro: [
      "Ear pain is one of the most common reasons a child wakes in the night, and one of the most common reasons a parent calls us before breakfast. It often follows a cold by a few days, because the same congestion that blocks a nose also blocks the tube that drains the middle ear.",
      "A younger child who cannot say their ear hurts may pull at it, wake repeatedly, or simply be inconsolable in a way that does not fit the rest of the illness. The questions below cover both.",
    ],
  },
  {
    slug: "vomiting",
    title: "Vomiting in Children",
    aap: "Vomiting Without Diarrhea",
    description: "Vomiting in children without diarrhea: what usually causes it, keeping a child hydrated, and when to call Wasatch Pediatrics.",
    intro: [
      "Vomiting on its own — without the diarrhea that usually accompanies a stomach bug — has a wider range of causes, which is why it is worth a few questions rather than an assumption. In most children it still settles by itself within a day.",
      "The thing to watch is not how many times but whether fluids are staying down, because dehydration is what turns an unpleasant night into a medical problem. The questions below focus on exactly that.",
    ],
  },
  {
    slug: "vomiting-and-diarrhea",
    title: "Vomiting and Diarrhea in Children",
    aap: "Vomiting With Diarrhea",
    description: "Vomiting with diarrhea in children — the usual stomach bug, how to keep fluids going, and when to call Wasatch Pediatrics.",
    intro: [
      "Vomiting and diarrhea together is the ordinary stomach bug, and it is usually viral, unpleasant and self-limiting. It spreads through a household with remarkable efficiency, which is why it often arrives twice.",
      "Almost all of the management is fluid: small amounts, often, for as long as it takes. The questions below cover how much is enough and what would change the plan.",
    ],
  },
  {
    slug: "diarrhea",
    title: "Diarrhea in Children",
    aap: "Diarrhea",
    description: "Diarrhea in children, how long it normally lasts, keeping your child hydrated, and when to call Wasatch Pediatrics.",
    intro: [
      "Diarrhea without vomiting usually means a bug that has settled lower down, and it can carry on for longer than parents expect — a week is not unusual, and loose stools often lag behind the rest of the recovery.",
      "As with any of these, the question is fluid rather than frequency. The questions below will tell you whether your child is keeping up.",
    ],
  },
  {
    slug: "colds",
    title: "Colds in Children",
    aap: "Colds",
    description: "Colds in children: how long they normally last, what helps, what does not, and when a cold is worth a call to Wasatch Pediatrics.",
    intro: [
      "Small children get somewhere between six and ten colds a year, and more once they start nursery or school. That rate is normal and is not a sign of a weak immune system — it is what happens when a person meets viruses for the first time.",
      "A cold that runs its course over a week or ten days, including several days of thick or coloured mucus, is behaving normally. Coloured mucus on its own is not a reason for antibiotics. What is worth attention is a cold that gets better and then clearly worse again, and the questions below cover that.",
    ],
  },
  {
    slug: "flu",
    title: "Flu in Children",
    aap: "Influenza - Seasonal",
    description: "Seasonal flu in children, how it differs from a cold, when antiviral treatment is worth asking about, and same-day appointments at Wasatch Pediatrics.",
    intro: [
      "Flu tends to announce itself rather than creep up: a child who was fine at lunchtime is flat on the sofa by evening, with a high fever, aching limbs and a headache. That abruptness is the most useful thing separating it from an ordinary cold.",
      "Timing matters more with flu than with most winter illnesses, because antiviral treatment is only worth considering early and only for some children. If you think it is flu, it is worth calling on the first day rather than the third.",
    ],
  },
  {
    slug: "rsv",
    title: "RSV and Bronchiolitis in Babies",
    aap: "RSV-Bronchiolitis",
    description: "RSV and bronchiolitis in babies: what to watch for in breathing, why the first days matter most, and how to reach Wasatch Pediatrics at any hour.",
    intro: [
      "RSV is a common winter virus that most children meet before their second birthday. In older children it is a cold. In babies it can settle into the smallest airways — bronchiolitis — and produce wheezing, fast breathing and difficulty feeding.",
      "The pattern that catches parents out is that it often gets worse before it gets better, usually around the third to fifth day, so a baby who seemed to be coping can need reassessing. Breathing and feeding are what to watch, and the questions below are about both.",
    ],
  },
  {
    slug: "covid-19",
    title: "COVID-19 in Children",
    aap: "COVID-19 Diagnosed or Suspected",
    description: "COVID-19 in children — what to do after a positive test, what to watch for, and when to call Wasatch Pediatrics.",
    intro: [
      "In most children COVID-19 looks like another respiratory virus: fever, a cough, a sore throat, tiredness, sometimes a stomach upset. Most recover at home without needing to be seen.",
      "What parents most often want to know is what to watch for, how long to keep a child home, and whether this particular child — because of age or an existing condition — needs more attention than the average. The questions below cover the first two, and a phone call covers the third.",
    ],
  },
  {
    slug: "head-injury",
    title: "Head Injury in Children",
    aap: "Head Injury",
    description: "After a bump to the head: what to watch for, when a child needs to be seen, and how to reach Wasatch Pediatrics day or night.",
    intro: [
      "Children hit their heads. Most of the bumps that terrify a parent — the fall from the sofa, the collision in the playground — do no lasting harm, and a large egg-shaped swelling on the forehead is more about where the skull bleeds easily than about how hard the knock was.",
      "What matters is what happens afterwards rather than the sound it made: whether your child was knocked out, how they are behaving in the hours since, and whether anything is changing. The questions below walk through exactly that, and anything involving unconsciousness or a seizure is an emergency room rather than a phone call.",
    ],
  },
  {
    slug: "rash",
    title: "Rashes in Children",
    aap: "Rash or Redness - Widespread",
    description: "Widespread rashes in children, what usually causes them, which ones need to be seen, and same-day appointments at Wasatch Pediatrics.",
    intro: [
      "Most widespread rashes in children come with or just after a viral illness, appear over a day or two, and fade without treatment. They look far more dramatic than they are, particularly on a feverish child.",
      "A few do need attention quickly, and the distinguishing features are things you can check at home — whether the spots fade when pressed, how the child is otherwise, and how fast it is spreading. The questions below go through them.",
    ],
  },
  {
    slug: "hives",
    title: "Hives in Children",
    aap: "Hives",
    description: "Hives in children — raised itchy welts that come and go, what triggers them, and when hives need urgent care. Wasatch Pediatrics answers 24/7.",
    intro: [
      "Hives are raised, itchy welts that appear suddenly, move around, and often vanish from one spot while turning up in another. That travelling quality is what distinguishes them from most other rashes.",
      "They are usually a reaction to a virus rather than to anything eaten, which surprises most parents. The exception matters though: hives with any swelling of the face or mouth, or with trouble breathing, is an emergency and not something to look up.",
    ],
  },
  {
    slug: "pink-eye",
    title: "Pink Eye in Children",
    aap: "Eye - Pus or Discharge",
    description: "Pink eye and eye discharge in children: what causes it, whether drops are needed, school rules, and same-day appointments at Wasatch Pediatrics.",
    intro: [
      "A red eye with discharge is usually conjunctivitis, and most of it is viral — it comes with a cold, runs for a week and clears on its own. Bacterial conjunctivitis, the kind that glues eyelashes together overnight, is the one that sometimes needs drops.",
      "Parents usually need two answers: whether this needs treating and when a child can go back to school. The questions below cover the first, and your school's own rule decides the second.",
    ],
  },
  {
    slug: "constipation",
    title: "Constipation in Children",
    aap: "Constipation",
    description: "Constipation in children — what counts as constipated, why it becomes a cycle, and when to see Wasatch Pediatrics about it.",
    intro: [
      "Constipation is about how hard and how difficult, not about how often. Children vary enormously in frequency, and a child who goes every third day comfortably is not constipated while one who goes daily in pain may well be.",
      "It matters because it becomes self-reinforcing: passing something painful makes a child hold on, which makes the next one harder. That cycle is worth breaking early, and it is a very common reason to see us.",
    ],
  },
  {
    slug: "asthma-attack",
    title: "Asthma Attacks in Children",
    aap: "Asthma Attack",
    description: "Asthma attacks in children: using the action plan, what the inhaler should do, and when an attack needs urgent care. Wasatch Pediatrics answers 24/7.",
    intro: [
      "If your child has asthma, you likely have an action plan already, and the first step in an attack is the plan rather than this page. Use the reliever inhaler as it directs.",
      "What the questions below help with is the judgement that follows: whether the inhaler is working as it should, how soon to repeat it, and at what point an attack stops being something to manage at home. Severe breathing difficulty is an emergency room, not a phone call.",
    ],
  },
  {
    slug: "teething",
    title: "Teething in Babies",
    aap: "Teething",
    description: "Teething in babies: what it does and does not cause, what helps, and when a symptom blamed on teething deserves a look.",
    intro: [
      "Teething causes sore gums, dribbling, chewing on everything, and a baby who is harder to settle. It is uncomfortable and it comes in waves as each tooth arrives.",
      "It is also blamed for a great deal it does not cause. Teething does not produce a high fever, diarrhea or a cough, and treating those as teething is how something else gets missed. If a baby has both, treat them as separate.",
    ],
  },
  {
    slug: "newborn-jaundice",
    title: "Jaundice in Newborns",
    aap: "Jaundiced Newborn",
    description: "Jaundice in a newborn: why it is common, what the yellow colour means, and when it needs checking. Wasatch Pediatrics sees newborns quickly.",
    intro: [
      "Most newborns go a little yellow in the first week. It is common, usually harmless, and it fades as a brand-new liver gets up to speed.",
      "It still gets checked, because the level matters and it cannot be judged reliably by eye — particularly on darker skin, where the whites of the eyes and the gums say more than the face does. Newborn visits are where this is followed, and we see new babies quickly.",
    ],
  },
  {
    slug: "crying-baby",
    title: "A Crying Baby Under 3 Months",
    aap: "Crying Baby - Before 3 Months Old",
    description: "A baby under three months who will not stop crying: what is normal, what helps, and when to call Wasatch Pediatrics. We answer 24 hours a day.",
    intro: [
      "Crying peaks at around six weeks and it is, genuinely, normal — several hours a day in a well baby, often clustered in the evening, often for no reason anyone can find. Knowing that does not make it easier at eleven at night.",
      "What the questions below sort out is whether this crying is that, or whether it is a baby telling you something. Either way: if you are at the end of your rope, put the baby down somewhere safe and call us. That is what the line is for.",
    ],
  },
  {
    slug: "immunization-reactions",
    title: "Reactions After Immunizations",
    aap: "Immunization Reactions",
    description: "What is normal after a child's vaccines, how long it lasts, and when a reaction is worth calling Wasatch Pediatrics about.",
    intro: [
      "A sore arm or leg, a small amount of swelling and redness at the injection site, a mild fever and a grumpy day or two are all expected after vaccines. They mean the immune system has noticed, and they settle without treatment.",
      "The questions below say how much of this is ordinary and how long it should last. If your child had a reaction we should know about, tell us — it goes in the notes and shapes the next visit.",
    ],
  },
  {
    slug: "insect-bites",
    title: "Insect Bites in Children",
    aap: "Insect Bite",
    description: "Insect bites and stings in children: normal swelling versus infection, what helps the itch, and when to be seen at Wasatch Pediatrics.",
    intro: [
      "A bite that swells, reddens and itches for a couple of days is doing what bites do. Children react more than adults, and a mosquito bite on a small child can swell impressively without anything being wrong.",
      "The two things worth separating are an ordinary large reaction and an infection — which arrives later, spreads, and gets more rather than less painful. The questions below cover both, along with the rarer allergic reaction that needs an emergency room.",
    ],
  },
  {
    slug: "tick-bites",
    title: "Tick Bites in Children",
    aap: "Tick Bite",
    description: "Tick bites in children: removing a tick properly, what to watch for afterwards, and when to call Wasatch Pediatrics.",
    intro: [
      "Ticks come home from the canyons and the foothills, and the important part is removing the whole thing promptly — steady traction with fine tweezers close to the skin, not heat, petroleum jelly or twisting.",
      "After that it is a matter of watching the spot and the child over the following weeks. The questions below cover removal and what would be worth a call later.",
    ],
  },
  {
    slug: "nosebleeds",
    title: "Nosebleeds in Children",
    aap: "Nosebleed",
    description: "Nosebleeds in children: how to stop one properly, why they happen so often in dry air, and when a nosebleed needs to be seen.",
    intro: [
      "Nosebleeds are common in children and much more common in dry air, which along a high desert valley means most of the winter. The blood vessels at the front of the nose sit close to the surface and a dry crust, a cold, or a finger is enough.",
      "Most stop with the right technique, which is firmer and longer than most people apply — and pinching the soft part of the nose rather than the bridge. The questions below give the method and the exceptions.",
    ],
  },
  {
    slug: "headache",
    title: "Headaches in Children",
    aap: "Headache",
    description: "Headaches in children: the common causes, the patterns worth attention, and when to book with Wasatch Pediatrics.",
    intro: [
      "Most childhood headaches come from the ordinary things — a virus, a missed meal, not enough sleep, not enough water, or a long stretch of screen. They pass, and they respond to the obvious remedies.",
      "What is worth attention is a pattern rather than an episode: headaches that keep waking a child at night, that come with vomiting in the morning, or that are getting steadily more frequent. The questions below separate the two.",
    ],
  },
];

export const symptomBySlug = new Map(symptoms.map((s) => [s.slug, s]));
