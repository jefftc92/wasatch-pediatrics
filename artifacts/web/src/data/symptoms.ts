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
   * The label on the index. "Fever", not "Fever in Children" — a grid of
   * twenty-eight titles that all end in the same three words is a grid nobody
   * can scan, and the page you are on already says these are children.
   */
  short: string;
  /** Which group it sits under on the index. */
  group: string;
  /**
   * The heading over our own words.
   *
   * Written rather than generated. Deriving it from the title produced "What
   * rsv and bronchiolitis usually means" and "What crying baby under 3 months
   * usually means" — and, once the copy became instructions rather than
   * description, it promised an explanation the section no longer gives.
   */
  heading: string;
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
    short: "Fever",
    group: "Fever and infection",
    heading: "What to do about a fever",
    aap: "Fever",
    lead:
      "Judge a fever by how your child is behaving, not by the number on the thermometer.",
    description:
      "Most childhood fevers are ordinary infections, and how a child is acting matters more than the reading. What to watch for, and how to reach a Wasatch Pediatrics nurse at any hour.",
    intro: [
      "Look for three things: is your child drinking, do they respond to you, and do they play a little once fever medicine has taken the edge off? If all three hold, stop watching the thermometer. If your child goes limp, you cannot rouse them, or they refuse every drink, call us — even when the reading looks unremarkable.",
      "Give fever medicine for comfort rather than to chase a number down. If it brings the temperature far enough down that your child will drink and sleep, it has done its job, even though the fever has not gone. Expect most fevers from ordinary infections to settle within two to three days.",
    ],
  },
  {
    slug: "fever-under-1",
    title: "Fever in Babies Under 12 Months",
    short: "Fever under 12 months",
    group: "Fever and infection",
    heading: "What to do about a fever in a baby",
    aap: "Fever (0-12 Months)",
    lead:
      "Call us about any fever in a baby under three months — at that age we check rather than wait.",
    description:
      "Fever in a baby under a year is handled differently from fever in an older child. Under three months it means calling us straight away. Wasatch Pediatrics answers 24 hours a day.",
    intro: [
      "A small baby cannot tell you where it hurts, and the signs that would be obvious in a four-year-old are muted or missing altogether. We set the threshold lower and see babies sooner precisely so that you are not left judging it at home.",
      "Between three and twelve months, watch feeding and alertness above everything else. A baby who feeds as usual and wakes normally is telling you one thing. A baby who has gone floppy, is hard to wake, or has stopped taking milk is telling you another — call us about the second.",
    ],
  },
  {
    slug: "cough",
    title: "Cough in Children",
    short: "Cough",
    group: "Coughs and breathing",
    heading: "What to do about a cough",
    aap: "Cough",
    lead:
      "Watch how hard your child is working to breathe rather than listening to the cough itself.",
    description:
      "Coughs in children often last three weeks and that is normal. What the different coughs mean, what to watch in your child's breathing, and when to bring them in.",
    intro: [
      "Look for fast breathing, skin pulling in between or under the ribs, nostrils flaring, or a baby who cannot finish a feed without stopping for air. Call us if you see any of them. A loud, dramatic cough in a child who is playing and eating is far less concerning than quiet, effortful breathing.",
      "Expect the cough to outlast the illness that caused it. Three weeks after a cold is ordinary and does not mean we missed something. Do call if the cough was improving and then clearly got worse again — that is a different pattern and worth a look.",
    ],
  },
  {
    slug: "croup",
    title: "Croup in Children",
    short: "Croup",
    group: "Coughs and breathing",
    heading: "What to do about croup",
    aap: "Croup",
    lead:
      "Croup makes a barking, seal-like cough that always sounds worse at night and almost always sounds worse than it is.",
    description:
      "Croup's barking cough and noisy breathing, why it peaks in the small hours, what helps at home, and when a child needs to be seen tonight.",
    intro: [
      "Calm your child first, because crying tightens the airway and makes the noise worse. Sit them upright, hold them, and take them into cool air — an open window or a few minutes on the front step settles most attacks.",
      "Listen between the coughs rather than to them. If you hear a harsh, rasping noise as your child breathes in while they are calm and at rest, call us. The same noise only while they are crying is much less concerning.",
    ],
  },
  {
    slug: "sore-throat",
    title: "Sore Throat in Children",
    short: "Sore throat",
    group: "Fever and infection",
    heading: "What to do about a sore throat",
    aap: "Sore Throat",
    lead:
      "A sore throat with a runny nose and a cough is almost always viral; one that arrives alone with a fever is worth a strep swab.",
    description:
      "Sore throats in children: which ones are viral, which are worth testing for strep, and how to get a same-day swab at Wasatch Pediatrics.",
    intro: [
      "Check whether your child has a cough. Strep rarely brings one, so a sore throat with fever and no cough — often with a headache or a stomach ache, sometimes with a fine sandpapery rash — is the combination that makes us want to test.",
      "Book the swab rather than waiting it out. Nobody can tell strep from a viral sore throat by looking, including us, and the test takes minutes. Treating strep shortens the illness and prevents the complications that follow one left alone.",
    ],
  },
  {
    slug: "strep-throat",
    title: "Strep Throat in Children",
    short: "Strep throat",
    group: "Fever and infection",
    heading: "What to do about strep throat",
    aap: "Strep Throat Infection",
    lead:
      "Only a swab confirms strep, so book one rather than guessing — treating it prevents complications a viral sore throat never causes.",
    description:
      "Strep throat in children: how it differs from a viral sore throat, why a swab is the only way to know, and same-day testing at Wasatch Pediatrics.",
    intro: [
      "Expect your child to feel better within a day or two of starting antibiotics, and to stop being contagious after about 24 hours of them. Most schools use that 24 hours to decide when a child can return.",
      "Finish the whole course even after your child feels well. We treat strep not only to settle the sore throat but to prevent the kidney and heart complications that can follow an infection left half-treated.",
    ],
  },
  {
    slug: "earache",
    title: "Earache in Children",
    short: "Earache",
    group: "Skin, eyes and ears",
    heading: "What to do about an earache",
    aap: "Earache",
    lead:
      "Ear pain usually arrives a few days after a cold, and in a baby it looks like pulling at the ear and a night nobody sleeps through.",
    description:
      "Ear pain in children: why it follows colds, what it looks like in a baby who cannot tell you, and how to get seen the same day.",
    intro: [
      "Treat the pain properly while you decide what to do next. A child who is not hurting will drink and sleep, and both help them recover — so give pain relief now rather than saving it for later.",
      "Do not assume antibiotics are the answer. Many ear infections clear without them, and we will often treat the pain and reassess in a day or two. Call sooner if fluid drains from the ear, or if the area behind the ear becomes swollen or tender.",
    ],
  },
  {
    slug: "vomiting",
    title: "Vomiting in Children",
    short: "Vomiting",
    group: "Stomach and bowels",
    heading: "What to do when your child is vomiting",
    aap: "Vomiting Without Diarrhea",
    lead:
      "Give small amounts of fluid often — a few teaspoons every few minutes will stay down when a full glass comes straight back.",
    description:
      "Vomiting in children without diarrhea: how to keep a child hydrated, what to offer and when, and the signs that mean calling us.",
    intro: [
      "Wait about twenty minutes after a vomit, then start again with teaspoons and build up slowly. If your child gulps a whole drink, expect to lose it and begin again.",
      "Count wet diapers rather than vomits. A child who is passing urine, has moist lips and still makes tears is keeping up, however grim the night has been. Call us when the diapers stay dry, the mouth looks dry, or your child is too sleepy to drink.",
    ],
  },
  {
    slug: "vomiting-and-diarrhea",
    title: "Vomiting and Diarrhea in Children",
    short: "Vomiting with diarrhea",
    group: "Stomach and bowels",
    heading: "What to do about vomiting and diarrhea",
    aap: "Vomiting With Diarrhea",
    lead:
      "Use oral rehydration solution rather than juice, sports drinks or soda — the sugar in those makes diarrhea worse.",
    description:
      "Vomiting with diarrhea in children: how to keep fluids going, how long it usually lasts, and when a child needs to be seen.",
    intro: [
      "Buy oral rehydration solution before you need it and keep it in the cupboard. Give it in small, frequent amounts. Water alone is not enough for a child losing a lot of fluid, and undiluted juice actively works against you.",
      "Feed your child as soon as they want to eat, and do not restrict what they have. The old advice about bland diets and clear fluids for days has gone — returning to ordinary food helps the gut recover faster.",
    ],
  },
  {
    slug: "diarrhea",
    title: "Diarrhea in Children",
    short: "Diarrhea",
    group: "Stomach and bowels",
    heading: "What to do about diarrhea",
    aap: "Diarrhea",
    lead:
      "Expect loose stools to carry on for about a week after everything else improves — that is recovery, not a relapse.",
    description:
      "Diarrhea in children: how long it normally lasts, how to keep your child hydrated, and the signs worth a call to Wasatch Pediatrics.",
    intro: [
      "Keep fluids going and let your child eat normally. Stools that firm up gradually over several days are behaving exactly as they should, and restricting the diet while it happens does not help.",
      "Call us if you see blood in the stool, if the diarrhea comes with a high fever or severe stomach pain, or if your child will not keep fluids down. Those change the picture and are worth a call rather than a wait.",
    ],
  },
  {
    slug: "colds",
    title: "Colds in Children",
    short: "Colds",
    group: "Coughs and breathing",
    heading: "What to do about a cold",
    aap: "Colds",
    lead:
      "Six to ten colds a year is normal for a small child, and green mucus is not a reason for antibiotics.",
    description:
      "Colds in children: why so many are normal, what green mucus does and does not mean, and when a cold is worth a call.",
    intro: [
      "Expect a cold to peak around day three and ease from there. Help your child through it with fluids, rest, saline drops and a humidifier. Skip over-the-counter cough and cold medicines — they do not work in young children and can do harm.",
      "Call us about a different shape of illness: a child who was recovering and then clearly went downhill, or a fever that appears several days into a cold that had been settling.",
    ],
  },
  {
    slug: "flu",
    title: "Flu in Children",
    short: "Flu",
    group: "Fever and infection",
    heading: "What to do about flu",
    aap: "Influenza - Seasonal",
    lead:
      "Call us on the first day if you think it is flu — antiviral treatment only helps when it starts early.",
    description:
      "Flu in children: how it differs from a cold, why timing matters for antiviral treatment, and same-day appointments at Wasatch Pediatrics.",
    intro: [
      "Recognize flu by how fast it arrives. A child who was fine at lunchtime is flat on the sofa by evening with a high fever, aching limbs and a headache. That abruptness separates it from a cold, which builds over days.",
      "Do not expect a quick recovery. Several days of fever and aching is normal, and the cough often hangs on a week or two after everything else has passed. Antivirals do not suit every child — call and we will tell you whether they suit yours.",
    ],
  },
  {
    slug: "rsv",
    title: "RSV and Bronchiolitis in Babies",
    short: "RSV and bronchiolitis",
    group: "Coughs and breathing",
    heading: "What to do about RSV and bronchiolitis",
    aap: "RSV-Bronchiolitis",
    lead:
      "Watch how your baby feeds — a baby working hard to breathe cannot feed well, so feeding is usually the first thing to change.",
    description:
      "RSV and bronchiolitis in babies: what to watch in breathing and feeding, why days three to five matter most, and when to call us.",
    intro: [
      "Expect RSV to worsen before it improves, usually around day three to five. A baby who seemed to be coping on Monday may need looking at again by Wednesday, so keep watching rather than assuming the worst has passed.",
      "Call us if your baby takes noticeably less than usual, takes much longer over each feed, or stops partway through to breathe. Nothing shortens bronchiolitis — not antibiotics, and usually not inhalers — so the job is keeping your baby fed, hydrated and breathing comfortably for the week or two it runs.",
    ],
  },
  {
    slug: "covid-19",
    title: "COVID-19 in Children",
    short: "COVID-19",
    group: "Fever and infection",
    heading: "What to do about COVID-19",
    aap: "COVID-19 Diagnosed or Suspected",
    lead:
      "Most children get through COVID at home like any other winter virus; age and existing conditions are what change that.",
    description:
      "COVID-19 in children: what to expect at home, what to watch for, how long to keep a child off school, and when to call Wasatch Pediatrics.",
    intro: [
      "Call us early rather than waiting if your child is a baby, or has a significant heart, lung or immune condition. For everyone else, treat it as you would any respiratory virus — fluids, rest, and fever medicine for comfort.",
      "Check your school or daycare's own rules before you plan a return. Public health guidance changes and individual schools often set their own, so the two do not always agree.",
    ],
  },
  {
    slug: "head-injury",
    title: "Head Injury in Children",
    short: "Head injury",
    group: "Knocks and bleeds",
    heading: "What to do after a head injury",
    aap: "Head Injury",
    lead:
      "Judge a head injury by how your child behaves in the hours afterward, not by the size of the lump.",
    description:
      "Head injuries in children: what to watch for in the hours afterward, which signs mean an emergency room, and when to call us.",
    intro: [
      "Watch for repeated vomiting, a headache that keeps worsening, unusual drowsiness, confusion, unsteadiness on their feet, or a child who is simply not themselves in a way you cannot name. Call us about any of those.",
      "Do not be alarmed by a large soft swelling on the forehead — the scalp bleeds easily and it usually means very little. Do go straight to an emergency room if your child lost consciousness, had a seizure, or fell from a significant height.",
    ],
  },
  {
    slug: "rash",
    title: "Rashes in Children",
    short: "Rashes",
    group: "Skin, eyes and ears",
    heading: "What to do about a rash",
    aap: "Rash or Redness - Widespread",
    lead:
      "Press a glass against the spots — a rash that stays visible under pressure needs urgent attention.",
    description:
      "Widespread rashes in children: which are ordinary viral rashes, the ones that need urgent attention, and how to get seen the same day.",
    intro: [
      "Do the glass test first on any widespread rash. Most viral rashes go pale under pressure and return when you let go. Spots that do not fade, particularly in a child who is unwell with them, mean calling 911 or going straight to an emergency room.",
      "Then look at your child rather than at the rash. A dramatic rash on a child who is eating, playing and comfortable is a very different thing from the same rash on a child who is floppy, feverish and getting worse.",
    ],
  },
  {
    slug: "hives",
    title: "Hives in Children",
    short: "Hives",
    group: "Skin, eyes and ears",
    heading: "What to do about hives",
    aap: "Hives",
    lead:
      "Hives with swelling of the lips or face, or any trouble breathing, mean 911 — hives on their own usually mean an antihistamine.",
    description:
      "Hives in children: why they travel, what usually triggers them, what helps the itch, and the swelling that means an emergency.",
    intro: [
      "Give an antihistamine and keep giving it for several days rather than stopping after one dose. Hives arrive in waves as they settle, so they will look as though they are coming back before they finally go.",
      "Look at what else is happening. Hives alone are usually a reaction to a virus rather than to food. Hives with swelling of the lips, tongue or face, difficulty breathing or swallowing, or vomiting and floppiness, is anaphylaxis until proven otherwise — call 911, and use epinephrine if your child has been prescribed it.",
    ],
  },
  {
    slug: "pink-eye",
    title: "Pink Eye in Children",
    short: "Pink eye",
    group: "Skin, eyes and ears",
    heading: "What to do about pink eye",
    aap: "Eye - Pus or Discharge",
    lead:
      "Most pink eye clears on its own; the kind that glues the lashes shut overnight is the kind that may need drops.",
    description:
      "Pink eye in children: telling viral from bacterial, whether drops are needed, and when a child can go back to school.",
    intro: [
      "Wipe from the inner corner outwards with a clean cloth each time, give your child their own towel, and wash your hands often. That stops it crossing to the other eye and around the house better than any drop will.",
      "Call us rather than waiting if your child has real pain rather than irritation, if their vision has changed, if bright light hurts them, if the eye was injured, or if your baby is a newborn.",
    ],
  },
  {
    slug: "constipation",
    title: "Constipation in Children",
    short: "Constipation",
    group: "Stomach and bowels",
    heading: "What to do about constipation",
    aap: "Constipation",
    lead:
      "Constipation is about how hard and how painful, not how often — and a child hurt once will hold on, which makes the next one worse.",
    description:
      "Constipation in children: what actually counts as constipated, why holding on makes it worse, and how we help break the cycle.",
    intro: [
      "Watch for holding on rather than straining. Crossed legs, going stiff, hiding behind the sofa — these look like a child trying to go, and they are almost always a child trying not to. Breaking that cycle is the whole of the treatment.",
      "Expect it to take months rather than days. We keep stools soft for long enough that a stretched bowel recovers and your child stops expecting pain. Stopping treatment early is the commonest reason constipation comes straight back.",
    ],
  },
  {
    slug: "asthma-attack",
    title: "Asthma Attacks in Children",
    short: "Asthma attack",
    group: "Coughs and breathing",
    heading: "What to do during an asthma attack",
    aap: "Asthma Attack",
    lead:
      "Follow your child's action plan and give the reliever first, then judge how well it worked by their breathing rather than their cough.",
    description:
      "Asthma attacks in children: using the action plan, judging whether the inhaler is working, and when an attack needs urgent care.",
    intro: [
      "Check three things a few minutes after the inhaler: can your child speak in full sentences, are they calm, and have they stopped using their neck and ribs to breathe? If all three hold, the reliever is working. If your child cannot finish a sentence, or goes quiet and still, call 911.",
      "Bring the plan and the inhalers to any appointment and ask us to watch your child use them. A spacer used properly delivers far more of the dose than an inhaler alone, and poor technique is one of the commonest reasons an attack seems not to respond.",
    ],
  },
  {
    slug: "teething",
    title: "Teething in Babies",
    short: "Teething",
    group: "Babies",
    heading: "What to do about teething",
    aap: "Teething",
    lead:
      "Teething makes gums sore and babies miserable — it does not cause a high fever, diarrhea or a cough.",
    description:
      "Teething in babies: what it really causes, what helps, and why blaming a fever on teething is how something else gets missed.",
    intro: [
      "Give your baby something cold and firm to bite: a chilled teething ring, a clean cold washcloth, or your own clean finger rubbed along the gum. Avoid teething gels, and do not use amber necklaces at all — they are a choking and strangulation risk.",
      "Treat a fever, diarrhea or a cough as a separate illness rather than blaming the teeth, because that assumption is how something else gets missed. Expect the timing to vary widely too: a first tooth anywhere between three months and a year is normal.",
    ],
  },
  {
    slug: "newborn-jaundice",
    title: "Jaundice in Newborns",
    short: "Newborn jaundice",
    group: "Babies",
    heading: "What to do about newborn jaundice",
    aap: "Jaundiced Newborn",
    lead:
      "Feed your baby often — jaundice clears through the stool, so a well-fed baby filling diapers is doing exactly what is needed.",
    description:
      "Jaundice in newborns: why it is so common, why it still gets checked, and how quickly Wasatch Pediatrics sees new babies.",
    intro: [
      "Watch feeding and diapers rather than trying to judge the color yourself. Skin tone makes yellow hard to read, so look at the whites of the eyes and the gums, and tell us what you see rather than deciding on it.",
      "Call us the same day if the jaundice appeared in the first 24 hours of life, if it is deepening after the first week, or if your baby is hard to wake for feeds. We would far rather measure a level than estimate one.",
    ],
  },
  {
    slug: "crying-baby",
    title: "A Crying Baby Under 3 Months",
    short: "A baby who will not stop crying",
    group: "Babies",
    heading: "What to do when your baby will not stop crying",
    aap: "Crying Baby - Before 3 Months Old",
    lead:
      "Crying peaks at about six weeks and hours a day can be normal — if you reach the end of your rope, put your baby down somewhere safe and call us.",
    description:
      "A baby under three months who will not stop crying: what is normal, what helps, and when to call. Wasatch Pediatrics answers 24 hours a day.",
    intro: [
      "Work through the ordinary causes first: hungry, wet, too hot, too cold, wind, or wanting to be held. Then try movement — a carrier, a walk outside, white noise, or simply a different pair of arms. Those work more often than anything else you can buy.",
      "Call us about crying that is different rather than crying that is long: a weak or high-pitched cry, a baby who has gone floppy or is hard to rouse, crying alongside a fever, or a sudden change in a baby who had been settled.",
    ],
  },
  {
    slug: "immunization-reactions",
    title: "Reactions After Immunizations",
    short: "After immunizations",
    group: "Babies",
    heading: "What to do after immunizations",
    aap: "Immunization Reactions",
    lead:
      "A sore leg, a small fever and a grumpy day or two after vaccines are expected, and they pass on their own.",
    description:
      "What is normal after a child's immunizations, how long it lasts, what helps, and the reactions worth telling us about.",
    intro: [
      "Move the limb, offer extra feeds, and hold a cool cloth against the spot. Give fever medicine if your child is uncomfortable — it does not stop the vaccine working, whatever you may have read.",
      "Tell us about anything beyond the ordinary: redness spreading up the limb, a fever lasting more than a couple of days, or a baby inconsolable for hours in a way that is unlike them. We record it, and it shapes how we plan the next visit.",
    ],
  },
  {
    slug: "insect-bites",
    title: "Insect Bites in Children",
    short: "Insect bites",
    group: "Skin, eyes and ears",
    heading: "What to do about insect bites",
    aap: "Insect Bite",
    lead:
      "An ordinary bite swells within a day and then settles; an infected one grows redder and more painful after two or three days.",
    description:
      "Insect bites and stings in children: telling a normal reaction from an infection, what helps the itch, and when to be seen.",
    intro: [
      "Watch which direction it is heading. A big reaction that appears quickly and then starts improving is normal, especially in a small child. A bite that is more painful, redder and warmer on day three, sometimes with a spreading edge or a fever, needs looking at.",
      "Use a cold compress and an antihistamine for the itch rather than a cream. Cut your child's fingernails short as well — most infected bites began as scratched ones.",
    ],
  },
  {
    slug: "tick-bites",
    title: "Tick Bites in Children",
    short: "Tick bites",
    group: "Skin, eyes and ears",
    heading: "What to do about a tick bite",
    aap: "Tick Bite",
    lead:
      "Pull a tick straight out with fine tweezers close to the skin — no heat, no petroleum jelly, and no twisting.",
    description:
      "Tick bites in children: how to remove a tick properly, what to watch for in the weeks afterward, and when to call us.",
    intro: [
      "Grip as close to the skin as you can and pull steadily upwards. Do not twist, and do not try to make the tick let go first: those methods leave mouthparts behind or make the tick regurgitate into the bite.",
      "Keep the tick in a bag or taped to a card and write down the date. If a rash or an illness follows weeks later, knowing what bit your child and when changes what we look for. Call us about an expanding rash, especially one with a clear center, or fever, headache and aching in the weeks afterward.",
    ],
  },
  {
    slug: "nosebleeds",
    title: "Nosebleeds in Children",
    short: "Nosebleeds",
    group: "Knocks and bleeds",
    heading: "What to do about a nosebleed",
    aap: "Nosebleed",
    lead:
      "Pinch the soft part of the nose, not the bridge, and hold for a full ten minutes without letting go to check.",
    description:
      "Nosebleeds in children: how to stop one properly, why dry Utah air causes so many, and when a nosebleed needs to be seen.",
    intro: [
      "Sit your child up and lean them forward rather than back. Pinch just below the bony bridge, where the nose is soft, and time ten minutes on a clock. Most nosebleeds that seem unstoppable were simply released too early.",
      "Prevent the next one with moisture. A humidifier at night, saline spray, and a little petroleum jelly inside the nostril through the winter stop far more nosebleeds than anything you do once one has started — Utah's dry air causes most of them.",
    ],
  },
  {
    slug: "headache",
    title: "Headaches in Children",
    short: "Headaches",
    group: "Knocks and bleeds",
    heading: "What to do about headaches",
    aap: "Headache",
    lead:
      "One headache usually means sleep, food, water or screens — bring us a pattern instead, especially one that wakes your child at night.",
    description:
      "Headaches in children: the ordinary causes, the patterns worth attention, and when to book an appointment at Wasatch Pediatrics.",
    intro: [
      "Go through the ordinary causes honestly before looking further. Ask about sleep, missed meals, how much your child drank, hours on a screen, and what is happening at school. Those account for the great majority, and fixing them is worth doing regardless.",
      "Book an appointment if the headaches wake your child from sleep, come with vomiting in the early morning, followed a head injury, or are becoming steadily more frequent or more severe over weeks. That pattern is what we want to look at, rather than a single bad afternoon.",
    ],
  },
];

export const symptomBySlug = new Map(symptoms.map((s) => [s.slug, s]));
