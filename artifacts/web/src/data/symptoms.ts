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
  /**
   * Set where the AAP viewer has no decision tool for this topic. Six of the
   * topics we link are advice articles rather than symptom trees, and the
   * viewer returns a 132-word stub for them: a disclaimer and nothing else.
   * Embedding that is worse than embedding nothing, so those pages link to
   * the AAP instead of framing it.
   */
  noTool?: true;
};

export const symptoms: Symptom[] = [
  {
    slug: "fever",
    title: "Fever in Children",
    short: "Fever",
    group: "Fever and infection",
    heading: "Judging a fever by your child, not the thermometer",
    aap: "Fever",
    lead: "Most childhood fevers come from ordinary viruses, and how your child drinks, responds and plays tells you more about this one than the number does.",
    description: "Most childhood fevers come from ordinary viruses. Which fevers need care right away, which can wait a day, and what counts as a fever in a young baby.",
    intro: [
      "Three questions settle most fevers at home. Is your child drinking? Do they respond to you normally? Do they play a little once fever medicine has taken the edge off? A child who does all three is usually well enough to watch at home, whatever the thermometer says. Call 911 for a child who cannot be woken, or who has gone too weak to stand or move, even when the reading looks unremarkable.",
      "Call 911 as well if your child is struggling for each breath and can barely speak or cry, or if purple or blood-colored spots appear on the skin. Go straight to an emergency room for a stiff neck or a seizure during the fever. Go as well for a child who is hard to wake, is not alert when awake, or acts or talks confused. Go too if your baby is under a year old and the soft spot on the head is bulging or swollen. Any fever in a baby under 12 weeks means calling us at whatever hour, because at that age we check rather than wait. Hold the fever medicine until we have seen your baby, since bringing the temperature down first makes the fever harder for us to read. The When To Call tab below lists the fevers that need a call within a day, and the Care Advice tab covers comfort and dosing.",
    ],
  },
  {
    slug: "fever-under-1",
    title: "Fever in Babies Under 12 Months",
    short: "Fever under 12 months",
    group: "Fever and infection",
    heading: "Why we see babies with fevers rather than wait",
    aap: "Fever (0-12 Months)",
    lead:
      "Call us about any fever in a baby under three months. At that age we check rather than wait.",
    description:
      "Fever in a baby under a year is handled differently from fever in an older child. Under three months it means calling us straight away. Wasatch Pediatrics answers 24 hours a day.",
    intro: [
      "A small baby cannot tell you where it hurts, and the signs that would be obvious in a four-year-old are muted or missing altogether. We set the threshold lower and see babies sooner precisely so that you are not left judging it at home. Hold the fever medicine until we have seen your baby, because bringing the temperature down first makes the fever harder for us to read.",
      "Watch feeding and alertness above everything else between three and twelve months. A baby who feeds as usual and wakes normally is reassuring, whatever the thermometer says. Call us if your baby has gone floppy, is hard to wake, or has stopped taking milk. Our nurse line answers on your office's own number at any hour, and nobody minds the call.",
    ],
  },
  {
    slug: "cough",
    title: "Cough in Children",
    short: "Cough",
    group: "Coughs and breathing",
    heading: "The breathing matters more than the cough",
    aap: "Cough",
    lead:
      "A dramatic cough frightens parents far more than the quiet, effortful breathing that actually worries us.",
    description:
      "Coughs in children often last three weeks and that is normal. What the different coughs mean, what to watch in your child's breathing, and when to bring them in.",
    intro: [
      "Watch your child's chest rather than listening to the cough. A loud, barking, hacking cough in a child who is playing, eating and talking in full sentences is doing no harm at all. The signs that change what we do are different ones. Watch for fast breathing, skin sucking in between or under the ribs, nostrils flaring with each breath, or a baby who cannot finish a feed without stopping for air. A child can show all four while barely coughing.",
      "Call us straight away about any of those breathing signs, at whatever hour. Call as well about a cough that was clearly improving and then turned worse again, because that is the pattern that occasionally proves to be pneumonia. A cough still hanging on three weeks after a cold is ordinary, and it does not mean we missed anything.",
    ],
  },
  {
    slug: "croup",
    title: "Croup in Children",
    short: "Croup",
    group: "Coughs and breathing",
    heading: "Listen to the breathing in, not the cough",
    aap: "Croup",
    lead: "Croup makes a barking, seal-like cough that gets worse at night. The cough is not what decides how urgent croup is. Listen instead for stridor, a harsh, raspy sound your child makes when breathing in.",
    description: "Croup's barking cough and noisy breathing: what stridor sounds like, what to do in the next twenty minutes, and which signs mean 911 or an emergency room.",
    intro: [
      "Stridor is the sign that matters, and you hear it when your child breathes in, not on the cough itself. Crying makes stridor louder, so comfort your child first and listen again once they have settled. Never dismiss stridor because your child happened to be crying when you first heard it. Stridor that is loud or constant means severe croup, and so does stridor you can hear while your child is calm and resting.",
      "Call 911 if your child is struggling for each breath, if the stridor is constant and severe, or if your child passes out or stops breathing. Lips or a face turning bluish when your child is not coughing mean 911 as well, and so do drooling, spitting or great trouble swallowing. Croup that began suddenly after a bee sting, a new medicine, or a food your child is allergic to is also a 911 call. Go straight to an emergency room if your baby is under a year old and has stridor. Go as well if the ribs pull in with each breath, or if your child may have choked on a small object. If your child is over a year old and you hear stridor now, call your office's main number at any hour. Most children with stridor need a steroid, so expect a visit rather than a phone call alone. The Care Advice tab below has the home steps in full.",
    ],
  },
  {
    slug: "sore-throat",
    title: "Sore Throat in Children",
    short: "Sore throat",
    group: "Fever and infection",
    heading: "Which sore throats are worth a strep swab",
    aap: "Sore Throat",
    lead:
      "A sore throat alongside a runny nose and a cough is almost always viral. One that arrives on its own with a fever is worth testing.",
    description:
      "Sore throats in children: which ones are viral, which are worth testing for strep, and how to get a same-day swab at Wasatch Pediatrics.",
    intro: [
      "Nobody can tell strep from a viral sore throat by looking, including us, which is why we swab rather than guess. Strep rarely causes a cough, so the combination that makes us want to test is a sore throat with a fever and no cough. A headache or a stomach ache alongside it strengthens the case, and a fine sandpapery rash settles it.",
      "Book a swab rather than waiting it out. We take it in the office in minutes and give you the result before you leave. Treating strep shortens the illness and prevents the complications that follow an untreated infection. Call the same day if your child is drooling, cannot swallow, or cannot open their mouth fully, because those point past an ordinary sore throat.",
    ],
  },
  {
    slug: "strep-throat",
    title: "Strep Throat in Children",
    short: "Strep throat",
    group: "Fever and infection",
    heading: "Why the whole course of antibiotics matters",
    aap: "Strep Throat Infection",
    lead:
      "Only a swab confirms strep, so book the test rather than guessing. Treating strep prevents complications that a viral sore throat never causes.",
    description:
      "Strep throat in children: how it differs from a viral sore throat, why a swab is the only way to know, and same-day testing at Wasatch Pediatrics.",
    intro: [
      "Strep is one of the few childhood throat infections where treatment changes the outcome rather than only the comfort. Your child should feel better within a day or two of starting the antibiotic. They stop being contagious after about 24 hours of it, which is the mark most schools use to decide when a child can return.",
      "Finish the whole course even once your child feels well, because we treat strep to prevent the kidney and heart complications that follow a half-treated infection, not merely to settle the throat. Call us if the fever is still there after two full days of antibiotics, if a rash appears, or if your child cannot swallow their own saliva.",
    ],
  },
  {
    slug: "earache",
    title: "Earache in Children",
    short: "Earache",
    group: "Ears, nose, mouth and teeth",
    heading: "Why an earache does not always mean antibiotics",
    aap: "Earache",
    lead:
      "Ear pain usually arrives a few days after a cold, and in a baby it looks like pulling at the ear and a night nobody sleeps through.",
    description:
      "Ear pain in children: why it follows colds, what it looks like in a baby who cannot tell you, and how to get seen the same day.",
    intro: [
      "Pain relief matters more than the antibiotic question in the first hours, because a child who is not hurting will drink and sleep, and both of those help them recover. The antibiotic question is genuinely open. Many ear infections clear without one, and for a child over two with a mild infection in one ear, waiting 48 hours with good pain relief works as well as treating straight away.",
      "Book a visit so we can look in the ear, because a red painful ear and a blocked painful ear look identical from outside and only one needs treating. We will often agree a plan of pain relief now and a call back in two days rather than a prescription today. Call us sooner if fluid drains from the ear, or if the bone behind the ear becomes swollen, red or tender.",
    ],
  },
  {
    slug: "vomiting",
    title: "Vomiting in Children",
    short: "Vomiting",
    group: "Stomach and bowels",
    heading: "Dehydration is what we watch, not the vomiting",
    aap: "Vomiting Without Diarrhea",
    lead:
      "Most vomiting settles on its own within a day. Whether your child is keeping enough fluid down is the part that decides anything.",
    description:
      "Vomiting in children without diarrhea: how to keep a child hydrated, what to offer and when, and the signs that mean calling us.",
    intro: [
      "Count wet diapers, or trips to the toilet, rather than counting vomits. A child who is still passing urine, whose lips stay moist and who can still make tears is keeping up, however grim the night has been. Dry diapers, a dry mouth, no tears, or a child too sleepy to drink are what tell us a child is falling behind.",
      "Call us when those signs of dehydration appear, and call the same day about any vomiting in a baby under three months. Tell us if the vomit is green or contains blood, if your child's belly is swollen or tender, or if the vomiting followed a head injury. Each of those sends us looking somewhere different. We can give fluids in the office for most children rather than sending you to an emergency room.",
    ],
  },
  {
    slug: "vomiting-and-diarrhea",
    title: "Vomiting and Diarrhea in Children",
    short: "Vomiting with diarrhea",
    group: "Stomach and bowels",
    heading: "Why oral rehydration solution beats juice and water",
    aap: "Vomiting With Diarrhea",
    lead:
      "Use oral rehydration solution rather than juice, sports drinks or soda, because the sugar in those makes diarrhea worse.",
    description:
      "Vomiting with diarrhea in children: how to keep fluids going, how long it usually lasts, and when a child needs to be seen.",
    intro: [
      "Not all fluids replace what a child is losing. Oral rehydration solution carries salt and sugar in the proportions the gut absorbs best. Plain water dilutes what little salt is left, and undiluted juice or soda pulls more water into the bowel and makes the diarrhea worse. The drink you choose therefore matters more here than the amount.",
      "Call us if your child cannot keep fluids down at all, passes no urine for eight hours, or has gone quiet and floppy. We can give fluids in the office rather than sending you to an emergency room. Ask us as well before restricting food, since the bland-diet advice you may remember has gone: ordinary eating speeds the gut's recovery rather than slowing it.",
    ],
  },
  {
    slug: "diarrhea",
    title: "Diarrhea in Children",
    short: "Diarrhea",
    group: "Stomach and bowels",
    heading: "How long diarrhea runs, and when to call us",
    aap: "Diarrhea",
    lead:
      "Loose stools carry on for about a week after everything else improves, and that tail is recovery rather than a relapse.",
    description:
      "Diarrhea in children: how long it normally lasts, how to keep your child hydrated, and the signs worth a call to Wasatch Pediatrics.",
    intro: [
      "Diarrhea worries parents most around day four or five, when the child seems otherwise better but the stools are still loose. Diarrhea takes that shape because the lining of the gut recovers more slowly than the rest of your child does. Watch how your child is doing rather than what the stool looks like, because a child who is drinking, playing and passing urine is winning even with several loose stools a day.",
      "Call us about blood in the stool, about diarrhea alongside a high fever or severe stomach pain, and about a child who cannot keep fluids down. Call the same day about any diarrhea in a baby under three months. Tell us if your child has traveled recently, because diarrhea after a trip gets investigated differently and often needs a stool sample.",
    ],
  },
  {
    slug: "colds",
    title: "Colds in Children",
    short: "Colds",
    group: "Coughs and breathing",
    heading: "The shape of a cold, and when it breaks",
    aap: "Colds",
    lead:
      "Six to ten colds a year is normal for a small child, and green mucus is not a reason for antibiotics.",
    description:
      "Colds in children: why so many are normal, what green mucus does and does not mean, and when a cold is worth a call.",
    intro: [
      "A cold has a shape, and knowing it saves most parents a phone call. Symptoms build for about three days, peak, then ease over the following week, and the cough outlasts everything else by two weeks. Green mucus arrives in the middle of that and means the cold is running its normal course, not that it has turned bacterial.",
      "Call us when the shape breaks. A child who was recovering and then clearly went downhill is the pattern we want to hear about. So is a fever that arrives several days into a cold that had been settling. That turn is the one that occasionally proves to be an ear infection or a pneumonia. Call us about any cold in a baby under three months as well, whatever the shape.",
    ],
  },
  {
    slug: "flu",
    title: "Flu in Children",
    short: "Flu",
    group: "Fever and infection",
    heading: "How fast flu arrives, and why that matters",
    aap: "Influenza - Seasonal",
    lead:
      "Call us on the first day if you think your child has flu, because antiviral treatment only helps when it starts early.",
    description:
      "Flu in children: how it differs from a cold, why timing matters for antiviral treatment, and same-day appointments at Wasatch Pediatrics.",
    intro: [
      "Recognize flu by how fast it arrives. A child who was fine at lunchtime is flat on the sofa by evening with a high fever, aching limbs and a headache. Flu arrives that fast, while a cold builds over several days.",
      "Call us on the first day if you think your child has flu, because antiviral treatment only works when it starts within about 48 hours. We will tell you whether it suits your child, since it helps some children a great deal and others hardly at all. Expect several days of fever and aching regardless, and a cough that hangs on a week or two after everything else has cleared.",
    ],
  },
  {
    slug: "rsv",
    title: "RSV and Bronchiolitis in Babies",
    short: "RSV and bronchiolitis",
    group: "Coughs and breathing",
    heading: "Why RSV gets worse before it gets better",
    aap: "RSV-Bronchiolitis",
    lead:
      "Watch how your baby feeds. A baby working hard to breathe cannot feed well, so feeding is usually the first thing to change.",
    description:
      "RSV and bronchiolitis in babies: what to watch in breathing and feeding, why days three to five matter most, and when to call us.",
    intro: [
      "RSV worsens before it improves, usually peaking around day three to five. That course catches parents out every winter. A baby who seemed to be coping on Monday can need looking at again by Wednesday, and the first day tells you very little about how the week will go.",
      "Call us if your baby takes noticeably less than usual, takes much longer over each feed, or stops partway through to breathe. Feeding is the first thing to fail when the work of breathing rises. We can check an oxygen level in the office and watch your baby feed. Nothing shortens bronchiolitis, so the two weeks it runs are about keeping your baby fed, hydrated and comfortable.",
    ],
  },
  {
    slug: "covid-19",
    title: "COVID-19 in Children",
    short: "COVID-19",
    group: "Fever and infection",
    heading: "Which children we want to hear about early",
    aap: "COVID-19 Diagnosed or Suspected",
    lead:
      "Most children get through COVID at home like any other winter virus. Age and existing conditions are what change that.",
    description:
      "COVID-19 in children: what to expect at home, what to watch for, how long to keep a child off school, and when to call Wasatch Pediatrics.",
    intro: [
      "Most children get through COVID-19 like any other winter virus, and age and existing conditions are what change that. Call us early rather than waiting if your child is a baby, or has a significant heart, lung or immune condition, because treatment for those children works best started early.",
      "Check your school or daycare's own rules before you plan a return, since public health guidance changes and individual schools often set their own on top of it. Call us about breathing that is fast or labored, about a child who will not drink, and about a fever that returns after your child had recovered.",
    ],
  },
  {
    slug: "head-injury",
    title: "Head Injury in Children",
    short: "Head injury",
    group: "Knocks, pain and injuries",
    heading: "The lump matters less than how your child acts",
    aap: "Head Injury",
    lead: "Most head injuries damage only the scalp, and what your child does over the next few hours shows whether this one did more.",
    description: "Head injuries in children: which signs mean 911 or an emergency room, whether your child can sleep afterward, and when to call us.",
    intro: [
      "Watch how your child wakes, talks, walks and keeps food down. Call 911 if your child had a seizure, was knocked out for more than a minute, or is hard to wake. Call 911 as well if your child is confused, is slurring words, is walking unsteadily, or is weak in an arm or leg right now. Major bleeding you cannot stop is a 911 call too. If your child is not moving the neck normally, call 911 and keep the neck still. Go straight to an emergency room for neck pain after the injury. A child who is awake but not alert, unfocused or slow to respond may have a mild concussion, and that also means an emergency room. So does confused talk, slurred speech, unsteady walking or weakness that has now passed off. An emergency room is right as well for vomiting two or more times, a severe headache, or crying that will not stop. Go too if your child cannot remember what happened, or if blurred or double vision lasts more than five minutes. An injury at high speed, such as a car crash, and a cut deep enough to need many stitches both belong in an emergency room.",
      "A big soft lump on the scalp looks frightening and usually means very little. The scalp has a large blood supply and bleeds easily into the loose tissue beneath, so a small injury can raise a large swelling. The skull bone separates that swelling from the brain. Two things about a lump do change what we do. One is how wide the swelling has spread, and the When To Call tab below gives the width that matters. The other is a dent you can feel in the skull. Your child can sleep. Watch your child closely for the first two hours after the injury. Separately, if your child falls asleep, wake them after two hours of sleep and check that they know you and can talk and walk normally. Sleep in the same room the first night. Call our nurse line at any hour if a headache lasts more than 24 hours, rather than waiting for office hours.",
    ],
  },
  {
    slug: "rash",
    title: "Rashes in Children",
    short: "Rashes",
    group: "Skin and rashes",
    heading: "The glass test, and the child underneath the rash",
    aap: "Rash or Redness - Widespread",
    lead:
      "A rash that stays visible when you press a glass against it needs emergency care now. Almost every other rash can wait until morning.",
    description:
      "Widespread rashes in children: which are ordinary viral rashes, the ones that need urgent attention, and how to get seen the same day.",
    intro: [
      "Press a clear drinking glass firmly against the spots and look through the bottom of it. Most viral rashes go pale under that pressure and color back in when you let go. Spots that stay visible through the glass mean calling 911 or going straight to an emergency room, particularly in a child who is unwell with them. A non-fading rash is how meningococcal disease shows on the skin.",
      "Look at your child rather than at the rash for everything else. A dramatic rash on a child who is eating, playing and comfortable is a very different thing from the same rash on a child who has gone floppy and feverish. Call us the same day about a rash with a fever, one that blisters or weeps, or any rash in a baby under three months. We will look at it here rather than guess from a photograph.",
    ],
  },
  {
    slug: "hives",
    title: "Hives in Children",
    short: "Hives",
    group: "Skin and rashes",
    heading: "Hives alone, and hives that mean anaphylaxis",
    aap: "Hives",
    lead:
      "Hives with swelling of the lips or face, or any trouble breathing, mean 911. Hives on their own usually mean an antihistamine.",
    description:
      "Hives in children: why they travel, what usually triggers them, what helps the itch, and the swelling that means an emergency.",
    intro: [
      "Hives on their own and hives as part of anaphylaxis look the same on the skin, so what else is happening decides everything. Hives by themselves are usually a reaction to a virus rather than to any food. They come in waves as they settle, which makes them look as though they are returning before they finally go.",
      "Hives alongside swelling of the lips, tongue or face, difficulty breathing or swallowing, or vomiting and floppiness, is anaphylaxis until proven otherwise. Call 911, and use epinephrine first if your child has been prescribed it. Call us about hives that keep returning for more than six weeks, because that pattern is worth investigating rather than treating over and over.",
    ],
  },
  {
    slug: "pink-eye",
    title: "Pink Eye in Children",
    short: "Pink eye",
    group: "Eyes",
    heading: "Which pink eye needs drops, and which does not",
    aap: "Eye - Pus or Discharge",
    lead:
      "Most pink eye clears on its own. The kind that glues the lashes shut overnight is the kind that may need drops.",
    description:
      "Pink eye in children: telling viral from bacterial, whether drops are needed, and when a child can go back to school.",
    intro: [
      "What the eye produces separates the two kinds. Thick yellow or green discharge that glues the lashes shut overnight suggests a bacterial infection, which may need prescription drops. A watery, gritty red eye alongside a cold is viral and clears on its own, and drops do nothing for it. Itching in both eyes points to allergy instead.",
      "Come in and we will tell you which kind your child has, since the three look similar from a photograph and lead to three different answers. Call us rather than waiting for genuine eye pain rather than irritation, for any change in vision, or for light that hurts. Call the same day about any red eye that follows an injury, and about any red eye in a newborn.",
    ],
  },
  {
    slug: "constipation",
    title: "Constipation in Children",
    short: "Constipation",
    group: "Stomach and bowels",
    heading: "Why children hold stools back, and why that keeps constipation going",
    aap: "Constipation",
    lead: "A child who has had one painful stool will often hold the next one back, and holding back is what turns a bad week into a pattern.",
    description: "Constipation in children: what actually counts as constipated, why a child starts holding back, and when to call us.",
    intro: [
      "Holding back works for an evening and fails over a week. A child who goes four or five days almost always meets pain and hard straining when the stool finally comes, and that pain is the reason to hold on again. Pain is one trigger. A power struggle is the other, and it is the most common cause of repeated constipation. The struggle usually starts over toilet training, or over a toilet your child refuses at daycare, at school, at a relative's house or on a trip. Pressure and punishment make holding back worse. Praise, treats and small rewards are what persuade a child to stop holding back.",
      "Go straight to an emergency room if your child's vomit is green. Changes to food and a calmer routine come first at home, and the Care Advice tab below has them. Call us before you start a stool softener, so that we can go over which one suits your child and how much to give. Breastfed babies over a month old are the exception to all of this, and they can go several days between soft, painless stools. The When To Call tab below covers everything else, including belly pain, bleeding and constipation that will not shift.",
    ],
  },
  {
    slug: "asthma-attack",
    title: "Asthma Attacks in Children",
    short: "Asthma attack",
    group: "Coughs and breathing",
    heading: "Judging whether the reliever inhaler worked",
    aap: "Asthma Attack",
    lead:
      "Follow your child's action plan and give the reliever first, then judge how well it worked by their breathing rather than their cough.",
    description:
      "Asthma attacks in children: using the action plan, judging whether the inhaler is working, and when an attack needs urgent care.",
    intro: [
      "Give the reliever inhaler, then check three things a few minutes later: can your child speak in full sentences, are they calm, and have they stopped using their neck and ribs to breathe? The reliever is working if all three hold. Call 911 if your child cannot finish a sentence, or goes quiet and still.",
      "Bring the action plan and the inhalers to any appointment and ask us to watch your child use them. A spacer used properly delivers far more of the drug to the lungs than an inhaler held alone. Poor technique is one of the commonest reasons an attack appears not to respond to treatment that should have worked.",
    ],
  },
  {
    slug: "teething",
    title: "Teething in Babies",
    short: "Teething",
    group: "Babies and newborns",
    heading: "What teething causes, and what it does not",
    aap: "Teething",
    lead:
      "Teething makes gums sore and babies miserable. Teething does not cause a high fever, diarrhea or a cough.",
    description:
      "Teething in babies: what it really causes, what helps, and why blaming a fever on teething is how something else gets missed.",
    intro: [
      "Give your baby something cold and firm to bite: a chilled teething ring, a clean cold washcloth, or your own clean finger rubbed along the gum. Avoid teething gels, and do not use amber necklaces at all, because they are a choking and strangulation risk.",
      "Treat a fever, diarrhea or a cough as a separate illness rather than blaming the teeth, because that assumption is exactly how something else gets missed. Call us about any of the three in a baby who is also teething. Expect the timing to vary enormously as well: a first tooth anywhere between three months and a year is entirely normal.",
    ],
  },
  {
    slug: "newborn-jaundice",
    title: "Jaundice in Newborns",
    short: "Newborn jaundice",
    group: "Babies and newborns",
    heading: "Why we measure jaundice rather than judge it",
    aap: "Jaundiced Newborn",
    lead:
      "Feed your baby often. Jaundice clears through the stool, so a well-fed baby filling diapers is doing exactly what is needed.",
    description:
      "Jaundice in newborns: why it is so common, why it still gets checked, and how quickly Wasatch Pediatrics sees new babies.",
    intro: [
      "Nobody judges a jaundice level by eye, including us. Skin tone, the light in the room and how recently your baby fed all change how yellow a newborn looks, which is why we measure instead of estimating. What you can usefully watch is feeding and diapers, because jaundice leaves the body in the stool.",
      "Call us the same day if the yellow appeared in the first 24 hours, if it is deepening after the first week, or if your baby has become hard to wake for feeds. We check a level with a forehead meter in the office and send a blood level if that reading runs high. Most babies who need treatment need only a few days of light therapy.",
    ],
  },
  {
    slug: "crying-baby",
    title: "A Crying Baby Under 3 Months",
    short: "A baby who will not stop crying",
    group: "Babies and newborns",
    heading: "Crying that is different, not crying that is long",
    aap: "Crying Baby - Before 3 Months Old",
    lead:
      "Crying peaks at about six weeks, and hours a day can be normal. Put your baby down somewhere safe and call us if you reach the end of your rope.",
    description:
      "A baby under three months who will not stop crying: what is normal, what helps, and when to call. Wasatch Pediatrics answers 24 hours a day.",
    intro: [
      "Crying peaks at around six weeks and then eases, which is the single most useful thing to know while you are in the middle of it. Hours a day of it can be entirely normal at that age and says nothing about your baby or about you. Movement, noise and a different pair of arms settle more babies than anything sold for the purpose.",
      "Call us about crying that is different rather than crying that is long. Tell us about a weak or high-pitched cry, a baby gone floppy or hard to rouse, or crying alongside a fever. A sudden change in a baby who had been settled counts too. We would far rather examine a baby than reassure you over the phone. Put your baby down somewhere safe and call us if you reach the end of your rope, which is a reason to ring us, not a failure.",
    ],
  },
  {
    slug: "immunization-reactions",
    title: "Reactions After Immunizations",
    short: "After immunizations",
    group: "Babies and newborns",
    heading: "Which reactions we want to hear about",
    aap: "Immunization Reactions",
    lead:
      "A sore leg, a small fever and a grumpy day or two after vaccines are expected, and they pass on their own.",
    description:
      "What is normal after a child's immunizations, how long it lasts, what helps, and the reactions worth telling us about.",
    intro: [
      "A sore arm or leg, a mild fever and a grumpy day or two are the vaccine doing its work, and they pass within 48 hours. Fever medicine is fine for comfort and does not stop a vaccine working, whatever you may have read. What we want to hear about is anything that outlasts or outsizes that ordinary picture.",
      "Tell us about anything beyond the ordinary: redness spreading up the limb, a fever lasting more than a couple of days, or a baby inconsolable for hours in a way that is unlike them. We record it, and it shapes how we plan the next visit.",
    ],
  },
  {
    slug: "insect-bites",
    title: "Insect Bites in Children",
    short: "Insect bites",
    group: "Bites and stings",
    heading: "Telling an ordinary bite from an infected one",
    aap: "Insect Bite",
    lead:
      "An ordinary bite swells within a day and then settles. An infected bite grows redder and more painful after two or three days.",
    description:
      "Insect bites and stings in children: telling a normal reaction from an infection, what helps the itch, and when to be seen.",
    intro: [
      "Watch which way the bite is heading over the next few days. A big reaction that appears quickly and then starts improving is normal, especially in a small child. A bite that is more painful, redder and warmer on day three, sometimes with a spreading edge or a fever, needs looking at.",
      "Call us about a bite heading the wrong way, and we will tell you whether it needs an antibiotic. Most do not. Cut your child's fingernails short in the meantime, because most infected bites we see began as scratched ones rather than as bad bites.",
    ],
  },
  {
    slug: "tick-bites",
    title: "Tick Bites in Children",
    short: "Tick bites",
    group: "Bites and stings",
    heading: "Removing a tick, and what to do with it afterwards",
    aap: "Tick Bite",
    lead:
      "Pull a tick straight out with fine tweezers held close to the skin. Use no heat, no petroleum jelly, and no twisting.",
    description:
      "Tick bites in children: how to remove a tick properly, what to watch for in the weeks afterward, and when to call us.",
    intro: [
      "Grip as close to the skin as you can and pull steadily upwards. Do not twist, and do not try to make the tick let go first: those methods leave mouthparts behind or make the tick regurgitate into the bite.",
      "Keep the tick in a bag or taped to a card and write down the date. Knowing what bit your child and when changes what we look for if a rash or an illness follows weeks later. Call us about an expanding rash, especially one with a clear center, or fever, headache and aching in the weeks afterward.",
    ],
  },
  {
    slug: "nosebleeds",
    title: "Nosebleeds in Children",
    short: "Nosebleeds",
    group: "Knocks, pain and injuries",
    heading: "Why nosebleeds restart, and how to prevent the next one",
    aap: "Nosebleed",
    lead:
      "Pinch the soft part of the nose, not the bridge, and hold for a full ten minutes without letting go to check.",
    description:
      "Nosebleeds in children: how to stop one properly, why dry Utah air causes so many, and when a nosebleed needs to be seen.",
    intro: [
      "Sit your child up and lean them forward rather than back. Pinch just below the bony bridge, where the nose is soft, and time ten minutes on a clock. Most nosebleeds that seem unstoppable were simply released too early.",
      "Prevent the next nosebleed with moisture. Utah's dry air causes most of them. A humidifier at night, saline spray, and a little petroleum jelly inside the nostril through the winter stop far more nosebleeds than anything you do once one has started.",
    ],
  },
  {
    slug: "headache",
    title: "Headaches in Children",
    short: "Headaches",
    group: "Knocks, pain and injuries",
    heading: "One headache, or a pattern worth investigating",
    aap: "Headache",
    lead:
      "A single headache usually means sleep, food, water or screens. Bring us a pattern instead, particularly headaches that wake your child at night.",
    description:
      "Headaches in children: the ordinary causes, the patterns worth attention, and when to book an appointment at Wasatch Pediatrics.",
    intro: [
      "A single headache almost never means anything, and a pattern often does. Sleep, missed meals, not enough to drink, hours on a screen and school stress account for the great majority of childhood headaches, and going through those five honestly is worth more than any scan. Fixing any one of them helps your child regardless of what else is going on.",
      "Book an appointment if the headaches wake your child from sleep, come with vomiting in the early morning, followed a head injury, or are becoming steadily more frequent or more severe over weeks. A run of headaches over weeks tells us something a single bad afternoon cannot.",
    ],
  },
  {
    slug: "eczema",
    title: "Eczema in Children",
    short: "Eczema",
    group: "Skin and rashes",
    heading: "Why eczema flares come back, and what we prescribe",
    aap: "Eczema",
    lead:
      "Moisturize every single day, not only when the skin flares, because dry skin is what lets eczema start.",
    description:
      "Eczema in children: the daily moisturizing that prevents flares, how to use steroid creams without fear, and when to bring your child in.",
    intro: [
      "Eczema is a barrier problem before it is an inflammation problem. Skin that cannot hold water cracks, lets irritants in, and flares. Daily moisturizing on skin that is not currently red therefore does more to prevent the next flare than anything you apply once one has started. An ointment or a heavy cream holds water where a lotion evaporates.",
      "Use the steroid cream we prescribe for as long as we tell you, rather than stopping the moment the redness fades. Parents commonly under-treat a flare from worry about steroids, and under-treating drags the flare out. Call us if the skin weeps, crusts yellow, or your child develops a fever, because eczema that is infected needs different treatment.",
    ],
  },
  {
    slug: "diaper-rash",
    title: "Diaper Rash",
    short: "Diaper rash",
    group: "Skin and rashes",
    heading: "Ordinary diaper rash, and the yeast kind",
    aap: "Diaper Rash",
    lead: "Two different rashes wear the same name, and they need different treatment.",
    description: "Diaper rash in babies: how to tell an ordinary rash from a yeast infection, which rashes need to be seen right away, and when to call us.",
    intro: [
      "Ordinary diaper rash comes from stool sitting against the skin, so wetness on its own is rarely the problem. Getting the stool off the skin at every change is most of the treatment, and the Care Advice tab below gives the method. A yeast rash behaves differently. Its redness runs deeper, and its border is a hard line rather than a fade. The skin inside that border can look raw and wet, and separate red spots or small pimples sit just outside the border.",
      "Time tells you which rash your baby has. A rash that is no better after three days of ordinary cleaning and air has probably picked up yeast, because yeast does not clear with cleaning alone. The two rashes need different creams, and the Care Advice tab covers both. The When To Call tab lists the signs that need us, and blisters, open sores, yellow scabs and spreading redness sit on that list at every age, not only in newborns.",
    ],
  },
  {
    slug: "cradle-cap",
    title: "Cradle Cap",
    short: "Cradle cap",
    group: "Skin and rashes",
    heading: "Why cradle cap looks worse than it is",
    aap: "Cradle Cap",
    lead:
      "Cradle cap is harmless, does not itch, and clears on its own. Soften the scale with oil and brush it gently rather than picking at it.",
    description:
      "Cradle cap in babies: how to loosen the scale safely, what not to do, and the rare signs that mean calling us.",
    intro: [
      "Cradle cap bothers parents far more than it bothers babies. The thick yellow scale looks like a skin condition that must be uncomfortable, and it causes no itching, no pain and no harm at all. It clears on its own over weeks to months, and softening the scale with oil before a bath only speeds up something that was going to happen anyway.",
      "Never pick dry scale off, because picking breaks the skin and invites infection. Call us if the scalp becomes red and weepy, if the rash spreads down onto the face and body, or if your baby seems itchy. Cradle cap itself does not itch, so an itchy baby has something else going on.",
    ],
  },
  {
    slug: "heat-rash",
    title: "Heat Rash in Children",
    short: "Heat rash",
    group: "Skin and rashes",
    heading: "Why creams make heat rash worse",
    aap: "Heat Rash",
    lead:
      "Cool your child down and take a layer off. Heat rash clears within a day or two once the skin stops sweating.",
    description:
      "Heat rash in children: how to cool the skin, what to avoid putting on it, and how to tell heat rash from a rash that needs looking at.",
    intro: [
      "Heat rash is blocked sweat glands, not an infection or an allergy, which is why the instinct to put something on it works against you. Creams and ointments seal the ducts that are already blocked and trap the heat underneath. Cooling the skin and letting it breathe unblocks them, and the rash goes within a day or two.",
      "Skip creams and ointments, which trap heat against the skin and make heat rash worse rather than better. Call us if the little bumps turn into pustules, if the skin becomes painful or swollen, or if your child runs a fever. Those changes point to an infection rather than to blocked sweat glands.",
    ],
  },
  {
    slug: "hand-foot-and-mouth",
    title: "Hand, Foot and Mouth Disease",
    short: "Hand, foot and mouth",
    group: "Skin and rashes",
    heading: "The mouth ulcers matter, not the spots",
    aap: "Hand-Foot-and-Mouth Disease-Viral Rash",
    lead:
      "Keep your child drinking, because the mouth ulcers hurt more than the spots and dehydration is the real risk.",
    description:
      "Hand, foot and mouth disease: managing the mouth pain so your child keeps drinking, how long it lasts, and when to call us.",
    intro: [
      "The mouth ulcers cause the trouble, not the spots everyone photographs. A child with a painful mouth stops drinking, and dehydration rather than the virus is what brings almost every one of these children in to see us. So time pain medicine before meals rather than after, and count wet diapers or trips to the toilet rather than watching the rash.",
      "Call us if your child refuses all fluids, stops passing urine, or becomes floppy and hard to rouse, and we will judge whether they need fluids here. Nothing shortens the virus itself, so the whole job is keeping your child drinking for the week it runs. Fingernails and toenails that peel off a few weeks later surprise parents every year and mean nothing at all.",
    ],
  },
  {
    slug: "chickenpox",
    title: "Chickenpox in Children",
    short: "Chickenpox",
    group: "Skin and rashes",
    heading: "The two medicines to avoid in chickenpox",
    aap: "Chickenpox",
    lead:
      "Treat the itch, and never give ibuprofen or aspirin for chickenpox, because both raise the risk of serious complications.",
    description:
      "Chickenpox in children: safe pain relief, controlling the itch, how long a child stays contagious, and when to call us.",
    intro: [
      "Two medicines matter here, and both are about what to avoid. Ibuprofen carries a link to severe skin infection in chickenpox, and aspirin carries a risk of Reye syndrome at any age, so acetaminophen is the one to reach for. Everything else is about the itch, and short fingernails do more for that than anything you put on the skin.",
      "Call us the same day if a spot turns hot, red and spreading, or if a fever arrives after the rash had already settled. Both point to a skin infection on top of the chickenpox. Tell us straight away if your child is a newborn, is pregnant, or has a weakened immune system, since those three get antiviral treatment that other children do not need. Your child can return once every blister has crusted, usually about a week from the first spot.",
    ],
  },
  {
    slug: "impetigo",
    title: "Impetigo in Children",
    short: "Impetigo",
    group: "Skin and rashes",
    heading: "Why impetigo always needs a prescription",
    aap: "Impetigo - Infected Sores",
    lead:
      "Impetigo spreads on fingers and towels, so cover the sores, wash hands often, and call us for the antibiotic that clears it.",
    description:
      "Impetigo in children: the honey-crusted sores, how to stop it spreading through the house, and when your child can go back to school.",
    intro: [
      "Impetigo is a bacterial infection of the surface of the skin, so unlike most childhood rashes it will not clear on its own. The crust gives it away: it looks like dried honey stuck to red skin, most often around the nose and mouth, and it spreads to wherever your child's fingers carry it next.",
      "Call us, and we will prescribe a cream for a small patch or tablets for anything more widespread. Give your child their own towel and washcloth in the meantime, since impetigo travels around a household on shared linen. Most schools ask that a child stay home until 24 hours after treatment starts, or until the sores have crusted over and are covered.",
    ],
  },
  {
    slug: "ringworm",
    title: "Ringworm in Children",
    short: "Ringworm",
    group: "Skin and rashes",
    heading: "Why ringworm comes back, and when cream will not work",
    aap: "Ringworm",
    lead:
      "Ringworm is a fungus, not a worm, and an antifungal cream clears it. Keep applying the cream for two weeks after the ring disappears.",
    description:
      "Ringworm in children: what the ring looks like, which cream to use and for how long, and why scalp ringworm needs a prescription.",
    intro: [
      "Ringworm is a fungus and not a worm, and it clears with an over-the-counter antifungal cream in most cases. It comes back because families stop at the wrong moment. The visible ring disappears well before the fungus does. Treatment has to carry on for two full weeks after the skin looks clear, and out about an inch beyond where the edge used to be.",
      "Call us for ringworm on the scalp, which shows up as a scaly bald patch and never responds to cream. Scalp ringworm needs an oral antifungal prescription. Call us too if the patch is spreading despite two weeks of treatment, or if the skin becomes swollen and tender.",
    ],
  },
  {
    slug: "scabies",
    title: "Scabies in Children",
    short: "Scabies",
    group: "Skin and rashes",
    heading: "Why everyone in the house gets treated at once",
    aap: "Scabies-Itch Mite Rash",
    lead:
      "Scabies itches worst at night, and everyone in the house needs treating on the same day, whether or not they itch.",
    description:
      "Scabies in children: recognizing the intense night-time itch, treating the whole household at once, and why the itch outlasts the mites.",
    intro: [
      "Call us for the prescription cream, then treat every person in the household on the same day, including anyone with no rash. Mites take weeks to cause itching, and an untreated person will simply reinfect everyone else. Apply the cream from the neck down, and over the scalp too in babies.",
      "Expect the itch to carry on for two to four weeks after successful treatment, which catches almost every family out. That itch is an allergic reaction to dead mites in the skin rather than a sign of live ones, so returning for a second course rarely helps. Wash bedding, towels and clothing from the previous three days in hot water, and dry them on high heat.",
    ],
  },
  {
    slug: "molluscum",
    title: "Molluscum in Children",
    short: "Molluscum",
    group: "Skin and rashes",
    heading: "Why we usually leave molluscum alone",
    aap: "Molluscum",
    lead:
      "Molluscum bumps clear on their own without treatment, though clearing can take six months to two years.",
    description:
      "Molluscum in children: why we usually leave the bumps alone, how to stop them spreading, and when treatment is worth it.",
    intro: [
      "Leave the bumps alone in most cases. Molluscum is a harmless virus, and the treatments available are uncomfortable enough that watching and waiting usually serves a child better. Stop your child scratching, because scratching spreads the virus to new patches of skin.",
      "Cover bumps under clothing for sports, keep towels and baths separate from siblings, and treat any eczema nearby, since broken skin is where molluscum spreads fastest. Talk to us about treatment if the bumps are on the face, are spreading rapidly, or are causing your child distress.",
    ],
  },
  {
    slug: "warts",
    title: "Warts in Children",
    short: "Warts",
    group: "Skin and rashes",
    heading: "Why wart treatment takes three months",
    aap: "Warts",
    lead:
      "Most warts disappear on their own within two years, and salicylic acid speeds that up if you use it daily for weeks.",
    description:
      "Warts in children: the treatment that works at home, how long it takes, and which warts to bring in.",
    intro: [
      "Warts fail to clear for one reason far more often than any other: the family stopped too soon. Salicylic acid works by taking the wart down a layer at a time, so eight to twelve weeks of daily treatment is the normal course rather than a sign that something is wrong. A wart treated for three weeks and abandoned will simply still be there.",
      "Bring your child in for warts on the face or genitals, warts that bleed or change shape, or warts that have not budged after three months of daily treatment. Do not use over-the-counter freezing kits on a small child's face or hands without asking us first.",
    ],
  },
  {
    slug: "poison-ivy",
    title: "Poison Ivy, Oak and Sumac",
    short: "Poison ivy",
    group: "Skin and rashes",
    heading: "Why poison ivy seems to spread, and does not",
    aap: "Poison Ivy - Oak - Sumac",
    lead:
      "Wash the oil off with soap and cool water within an hour, and wash whatever your child was wearing. The rash spreads from lingering oil, not from the blisters.",
    description:
      "Poison ivy, oak and sumac in children: washing the oil off in time, calming the rash, and the reactions that need to be seen.",
    intro: [
      "Scrub the skin with soap and cool water as soon as you realize what happened, then wash the clothes, shoes and anything else that touched the plant. The rash cannot spread from one part of the body to another, and blister fluid is not contagious. New patches appear because oil is still on something your child keeps touching.",
      "Call us if the rash covers a large area, reaches the face or the genitals, or swells your child's eyes shut. A reaction that widespread needs oral steroids rather than anything you can buy. Call as well if the skin turns yellow-crusted or increasingly painful, which means a bacterial infection has moved in on top of the rash.",
    ],
  },
  {
    slug: "fifth-disease",
    title: "Fifth Disease",
    short: "Fifth disease",
    group: "Skin and rashes",
    heading: "The rash means your child is no longer contagious",
    aap: "Fifth Disease-Viral Rash",
    lead:
      "Your child stops being contagious by the time the bright red cheeks appear, and needs no treatment.",
    description:
      "Fifth disease in children: the slapped-cheek rash, why your child can stay in school, and who does need to avoid it.",
    intro: [
      "The rash marks the end of this, not the beginning. Fifth disease spreads during the ordinary-looking cold of the week before, so by the time the bright cheeks appear your child has stopped being infectious and can go back to school. Parents are told to keep children home for it every spring, and that advice is exactly backwards.",
      "Tell anyone pregnant who has been around your child. The virus carries a risk to a pregnancy that it does not carry for your child, and they will want to speak to their own doctor. Call us if your child has sickle cell disease or a weakened immune system, since fifth disease behaves quite differently in both. Expect the lacy rash on the arms and body to fade and return for weeks, flaring in a warm bath or in sunlight.",
    ],
  },
  {
    slug: "roseola",
    title: "Roseola",
    short: "Roseola",
    group: "Skin and rashes",
    heading: "The roseola pattern: fever first, rash after",
    aap: "Roseola-Viral Rash",
    lead:
      "Roseola runs three days of high fever and then breaks into a rash just as your child starts to feel better.",
    description:
      "Roseola in babies and toddlers: the pattern of high fever then rash, why the rash is good news, and what to watch during the fever.",
    intro: [
      "Roseola runs in a sequence that identifies it, and the sequence is what reassures parents rather than any single feature. A high fever comes first and lasts two or three days with very little else to show for it. The fever then breaks, and within a day a pink rash appears on the trunk and spreads outward while your child is visibly getting better.",
      "Expect the rash to fade in one to three days and to need no treatment at all. Call us during the fever phase if your baby is under three months, becomes hard to rouse, or has a seizure. Febrile seizures happen in a small number of children with roseola and always need assessing, even though most cause no lasting harm.",
    ],
  },
  {
    slug: "hair-loss",
    title: "Hair Loss in Children",
    short: "Hair loss",
    group: "Skin and rashes",
    heading: "What the bare patch itself tells us",
    aap: "Hair Loss",
    lead:
      "Bring your child in so we can look at the scalp. The cause of the hair loss decides the treatment, and the causes call for quite different things.",
    description:
      "Hair loss in children: the common causes, what the scalp tells us, and why a look in person settles it faster than anything else.",
    intro: [
      "Look at the bare patch before you call. A scaly, broken-off patch usually means scalp ringworm, which needs an oral prescription. Smooth, completely bald circles suggest alopecia areata. Hair that thinned all over a few months after an illness, an operation or a stressful stretch is usually telogen effluvium, which recovers on its own.",
      "Tell us if your child twists or pulls at their hair, because habit-related hair pulling is common and we treat it quite differently from the rest. Bring your child in either way, because these conditions look similar in a photograph and quite different under a light.",
    ],
  },
  {
    slug: "dry-skin",
    title: "Dry and Cracked Skin",
    short: "Dry skin",
    group: "Skin and rashes",
    heading: "Why Utah winters crack children's skin",
    aap: "Cracked or Dry Skin",
    lead:
      "Shorten the bath, drop the soap, and moisturize while the skin is still damp. Utah's air does the rest of the damage on its own.",
    description:
      "Dry and cracked skin in children: the bathing routine that helps, which moisturizers work, and when dry skin is something else.",
    intro: [
      "Dry air pulls water out of skin faster than skin can replace it, and Utah supplies that air for half the year. A bath adds water to the skin and then takes more away as it evaporates, which is why the three minutes after a bath decide whether the bath helped or hurt. Anything thick and unscented applied inside that window traps the water your child just soaked up.",
      "Run a humidifier in the bedroom through the winter. Call us if the skin cracks deeply enough to bleed, or if patches turn red, weepy or crusted. Call as well if the dryness itches enough to wake your child, because a persistent itch usually means eczema rather than dry skin alone.",
    ],
  },
  {
    slug: "sunburn",
    title: "Sunburn in Children",
    short: "Sunburn",
    group: "Skin and rashes",
    heading: "Sunburn gets worse before it gets better",
    aap: "Sunburn",
    lead:
      "Cool the skin, push fluids, and give ibuprofen early. The redness you can see at bedtime will look worse in the morning.",
    description:
      "Sunburn in children: cooling the skin, easing the pain, what not to put on a burn, and when a sunburn needs to be seen.",
    intro: [
      "Sunburn keeps developing for a day after the sun goes in, so the redness you see at bedtime is not the redness you will see in the morning. Judging a burn too early is how parents miss a bad one. Ibuprofen taken in those first few hours does more for the pain and the swelling than anything applied to the surface, because it works on the inflammation rather than on the skin.",
      "Never use butter, petroleum jelly or anything numbing that ends in caine, and leave blisters alone rather than popping them. Call us for a sunburn with widespread blistering, a burn on a baby under a year, or a sunburned child who develops a fever, chills, headache or confusion.",
    ],
  },
  {
    slug: "boil",
    title: "Boils in Children",
    short: "Boils",
    group: "Skin and rashes",
    heading: "Why squeezing a boil makes it worse",
    aap: "Boil",
    lead:
      "Hold a warm compress on a boil for fifteen minutes four times a day, and never squeeze it.",
    description:
      "Boils in children: the warm compresses that bring one to a head, why squeezing makes it worse, and when a boil needs draining.",
    intro: [
      "Warmth and patience beat squeezing every time. Heat draws a boil to the surface so it opens on its own, which is exactly the outcome you want, and squeezing drives the infection deeper instead. More boils turn into something needing a scalpel because somebody pressed on them than for any other reason.",
      "Call us if a boil is bigger than a large coin, sits on the face or along the spine, comes with a fever, or has not opened after three days of warm compresses. We can numb the skin and open one in the office, which takes minutes and hurts far less than parents expect. Tell us if boils keep coming back, because that pattern is worth investigating rather than treating one at a time.",
    ],
  },
  {
    slug: "skin-lump",
    title: "Skin Lumps in Children",
    short: "Skin lumps",
    group: "Skin and rashes",
    heading: "Which lumps are lymph nodes doing their job",
    aap: "Skin Lump",
    lead:
      "Most lumps under a child's skin are swollen lymph nodes or harmless cysts, but let us feel any lump that keeps growing.",
    description:
      "Lumps under the skin in children: which ones are ordinary, what to note before you call, and the ones we want to examine.",
    intro: [
      "Note four things before you call: where the lump sits, how big it is against a coin, whether it moves when you press it, and whether your child was recently ill. A soft, mobile lump in the neck after a cold is almost always a lymph node doing its job.",
      "Book an appointment for a lump that keeps growing over weeks, one that feels hard and fixed in place, or one sitting above the collarbone. Book one too for a lump alongside night sweats, weight loss, or a fever that will not settle. Call sooner if the skin over the lump turns red, hot and painful, which points to an infection.",
    ],
  },
  {
    slug: "blisters",
    title: "Blisters in Children",
    short: "Blisters",
    group: "Skin and rashes",
    heading: "Why an intact blister should stay intact",
    aap: "Blisters",
    lead:
      "Leave a blister intact if you can, because the roof of it is the best dressing your child has.",
    description:
      "Blisters in children: when to leave one alone, how to drain a painful one safely, and the signs of infection.",
    intro: [
      "The roof of a blister is a better dressing than anything you can buy. It keeps bacteria out, it keeps the raw skin underneath from being touched, and it separates on its own once new skin has formed. Popping one trades a day of discomfort for a week of risk.",
      "Call us if the skin around a blister turns red and that redness spreads, if pus appears, or if your child develops a fever. An infected blister needs an antibiotic rather than a bigger dressing. Come in for a blister raised by a burn, one on a palm or sole that stops your child walking or gripping, or a crop of blisters that arrived without an obvious rub.",
    ],
  },
  {
    slug: "mosquito-bites",
    title: "Mosquito Bites in Children",
    short: "Mosquito bites",
    group: "Bites and stings",
    heading: "Which direction the bite is heading",
    aap: "Mosquito Bite",
    lead:
      "Children swell far more than adults do after a mosquito bite, and a large firm lump is still an ordinary reaction.",
    description:
      "Mosquito bites in children: why the swelling looks alarming, what stops the itch, and how to tell a big reaction from an infection.",
    intro: [
      "Direction matters more than size. A bite that swells fast, itches hard and starts settling by the next day is an ordinary reaction, even when the lump reaches the size of a plum. Children react far more strongly than adults do. A bite that is hotter, redder and more painful on day two or three is heading the other way.",
      "Call us about a bite heading the wrong way, or about red streaks running out from one, and we will tell you whether it needs an antibiotic. Most do not. Come in the same day for a bite beside an eye that swells it shut. Call straight away for swelling of the lips or face, trouble breathing, or widespread hives after any bite or sting.",
    ],
  },
  {
    slug: "bee-sting",
    title: "Bee and Wasp Stings",
    short: "Bee and wasp stings",
    group: "Bites and stings",
    heading: "Local swelling, and the swelling that means 911",
    aap: "Bee or Yellow Jacket Sting",
    lead:
      "Scrape a bee's stinger out sideways with a card rather than pulling it, then watch your child for fifteen minutes.",
    description:
      "Bee and wasp stings in children: removing the stinger, easing the pain and swelling, and the reaction that means calling 911.",
    intro: [
      "A stung limb that swells over a day or two and stays swollen for several more frightens parents into thinking their child is allergic. A large local reaction is not an allergy. A large local reaction stays confined to the limb that was stung and is uncomfortable rather than dangerous. An allergic reaction shows up somewhere the sting was not.",
      "Call 911 immediately if your child has trouble breathing, swelling of the lips, tongue or throat, widespread hives, vomiting, or goes pale and floppy. That combination is anaphylaxis, and epinephrine cannot wait. Local swelling that spreads over a day or two and stays confined to the stung limb is uncomfortable but not dangerous.",
    ],
  },
  {
    slug: "spider-bite",
    title: "Spider Bites in Children",
    short: "Spider bites",
    group: "Bites and stings",
    heading: "Most spider bites are not spider bites",
    aap: "Spider Bite",
    lead:
      "Most bites blamed on spiders are not spider bites at all. They are skin infections, and they need treating as such.",
    description:
      "Spider bites in children: what most 'spider bites' actually are, first aid for a genuine bite, and the two spiders that matter in Utah.",
    intro: [
      "Wash the area, apply a cold pack and give pain relief. Then look again in a day. A single painful lump with a spreading red edge that grows over 48 hours is almost always a skin infection rather than a bite, so call us: that needs an antibiotic.",
      "Call us straight away if your child was bitten by a black widow or a brown recluse, or if you cannot rule them out. Severe muscle cramps and stomach pain suggest a widow bite. A bite that darkens into an ulcer over days suggests a recluse. Bring the spider if you safely can.",
    ],
  },
  {
    slug: "fire-ant-sting",
    title: "Fire Ant Stings",
    short: "Fire ant stings",
    group: "Bites and stings",
    heading: "The pustules are normal, and picking them is not",
    aap: "Fire Ant Sting",
    lead:
      "Fire ant stings turn into small pus-filled blisters within a day, and those blisters are the normal reaction rather than an infection.",
    description:
      "Fire ant stings in children: expecting the pustules, easing the burn and itch, and the reaction that needs 911.",
    intro: [
      "Wash the stings, apply a cold pack for twenty minutes, and give an antihistamine for the itch. Expect a small pustule to form on each sting within 24 hours. Leave the pustules alone, because opening them is what leads to infection.",
      "Call 911 if your child develops widespread hives, trouble breathing, or swelling of the face and mouth after being stung. Call us if a sting site becomes hot and spreading over days, which points to a genuine skin infection on top of the stings.",
    ],
  },
  {
    slug: "bed-bug-bites",
    title: "Bed Bug Bites",
    short: "Bed bug bites",
    group: "Bites and stings",
    heading: "The bite pattern that gives bed bugs away",
    aap: "Bed Bug Bite",
    lead:
      "Bed bug bites come in lines or clusters on skin that was uncovered in bed, and treating the room matters more than treating the skin.",
    description:
      "Bed bug bites in children: recognizing the pattern, easing the itch, and dealing with the room the bites came from.",
    intro: [
      "Bed bug bites are recognized by their arrangement rather than by any single bite. Three or four in a straight line, or in a tight cluster, on skin that was outside the covers overnight, is the pattern. Arms, shoulders, neck and legs collect them, and the same person can be bitten repeatedly while nobody else in the bed reacts at all.",
      "Deal with the room, because bites will keep appearing until you do. Strip and hot-wash all bedding, vacuum the mattress and frame, and arrange professional treatment, because bed bugs rarely go away with home remedies. Call us if bites become infected from scratching.",
    ],
  },
  {
    slug: "scorpion-sting",
    title: "Scorpion Stings",
    short: "Scorpion stings",
    group: "Bites and stings",
    heading: "Which scorpion decides everything that follows",
    aap: "Scorpion Sting",
    lead:
      "Wash the sting, apply a cold pack, and call Poison Control. They will tell you whether this particular scorpion needs more than home care.",
    description:
      "Scorpion stings in children: immediate first aid, calling Poison Control, and the symptoms that mean an emergency room.",
    intro: [
      "Which scorpion stung your child decides everything that follows, and only a handful of species in this region cause more than a painful lump. Poison Control answers on 1-800-222-1222 around the clock, and they know the species that matter in Utah. Poison Control will tell you within a minute whether this needs a cold pack at home or a trip in. Call them before you call anyone else.",
      "Go to an emergency room now for muscle twitching, jerking limbs, eyes that rove, drooling, difficulty swallowing or trouble breathing. Small children react far more severely than adults to the stings that matter, and an antivenom exists for exactly this picture, so those signs need treating rather than watching.",
    ],
  },
  {
    slug: "jellyfish-sting",
    title: "Jellyfish Stings",
    short: "Jellyfish stings",
    group: "Bites and stings",
    heading: "Why fresh water makes a jellyfish sting worse",
    aap: "Jellyfish Sting",
    lead:
      "Rinse the sting with seawater rather than fresh water, lift off any tentacles, and soak the area in hot water for twenty minutes.",
    description:
      "Jellyfish stings in children: rinsing correctly, removing tentacles, easing the pain, and the reaction that needs 911.",
    intro: [
      "Rinse with seawater, not tap water, because fresh water makes undischarged stinging cells fire. Lift visible tentacles off with tweezers or a gloved hand rather than rubbing them, then soak the area in water as hot as your child can comfortably stand for twenty minutes.",
      "Skip the folk remedies. Urine, alcohol and meat tenderizer either do nothing or make the sting worse. Call 911 if your child has trouble breathing, chest pain, widespread hives, or was stung across a large part of the body.",
    ],
  },
  {
    slug: "animal-bite",
    title: "Animal and Human Bites",
    short: "Animal and human bites",
    group: "Bites and stings",
    heading: "Why a bite gets antibiotics before it looks infected",
    aap: "Animal or Human Bite",
    lead:
      "Wash any bite that breaks the skin under running water for five full minutes, then call us. Bites that break the skin usually need antibiotics.",
    description:
      "Animal and human bites in children: washing the wound properly, why most need to be seen, and what we need to know about the animal.",
    intro: [
      "A bite that breaks the skin is a puncture, and punctures seal over the bacteria pushed in with them. A bite can therefore look almost closed and still be infected underneath by the next day. Cat bites and bites to the hand get antibiotics from us before any redness appears, rather than afterwards. Five full minutes under running water does more than anything else you can do at home.",
      "Call us with whatever you know about the animal, because that decides the rest. A pet with vaccination records, a stray, and wildlife each lead somewhere different on rabies, and we will also check when your child last had a tetanus shot. Report any bite by a stray or wild animal to animal control, who can trace and observe the animal in a way that spares your child treatment.",
    ],
  },
  {
    slug: "swimmers-itch",
    title: "Swimmer's Itch",
    short: "Swimmer's itch",
    group: "Bites and stings",
    heading: "Why the rash stops at the swimsuit line",
    aap: "Swimmer's Itch - Lakes and Oceans",
    lead:
      "Swimmer's itch appears within hours of a lake swim, itches intensely for a few days, and cannot spread to anybody else.",
    description:
      "Swimmer's itch after lake swimming: what causes the bumps, how to settle the itch, and how to avoid it next time.",
    intro: [
      "The rash maps exactly onto the skin a swimsuit left bare, which is what identifies it. A parasite in fresh water burrows into the skin as the water evaporates off it, so covered skin stays clear and everything else comes up in small red itchy bumps within a few hours. It settles over about a week and cannot pass to anyone else.",
      "Prevent the next round by toweling off briskly straight out of the water and rinsing with clean water, since the parasite burrows in as lake water evaporates on the skin. Call us if the bumps become infected from scratching, or if your child develops a fever.",
    ],
  },
  {
    slug: "pinworms",
    title: "Pinworms in Children",
    short: "Pinworms",
    group: "Bites and stings",
    heading: "Why the itch keeps to the small hours",
    aap: "Pinworms",
    lead:
      "Night-time bottom itching in a school-age child is usually pinworms, and everybody in the house gets treated at once.",
    description:
      "Pinworms in children: confirming it with a flashlight, treating the whole household, and the laundry that stops reinfection.",
    intro: [
      "Itching that arrives at night and stops by morning is the giveaway. Pinworms come out to lay eggs while your child sleeps, which is why the itch keeps to those hours. A flashlight two or three hours after bedtime settles the question. The adult worms look like short white threads. Clear tape pressed against the skin before your child gets up works too.",
      "Call us and we will prescribe for the whole household at once, which is the part families most often get wrong. Eggs survive about two weeks on bedding, towels and fingers, so a single treated child simply catches it again from everybody else. Treat everyone the same day, repeat in two weeks, and expect reinfection rather than failed medicine if the itching returns.",
    ],
  },
  {
    slug: "head-lice",
    title: "Head Lice in Children",
    short: "Head lice",
    group: "Bites and stings",
    heading: "Why combing matters more than the treatment",
    aap: "Head Lice",
    lead:
      "Comb wet, conditioned hair with a fine-toothed lice comb every three days for two weeks. Combing removes what any treatment misses.",
    description:
      "Head lice in children: the wet-combing that actually clears them, using treatments correctly, and what schools now expect.",
    intro: [
      "No lice treatment kills eggs reliably, which is why treatment alone fails so often. Eggs already laid hatch over the following week or so, and the combing is what catches those newly hatched lice before they can lay in turn. Conditioner in the hair stuns them long enough for a metal lice comb to pull them out.",
      "Use an over-the-counter treatment alongside the combing and repeat it after nine days, following the instructions exactly. Most treatment failures come from using too little or rinsing too soon. Do not bag toys or spray furniture, because lice die within a day off a head. Most schools no longer send children home, so check yours rather than assuming.",
    ],
  },
  {
    slug: "eye-red-no-pus",
    title: "A Red Eye Without Discharge",
    short: "Red eye, no discharge",
    group: "Eyes",
    heading: "Telling allergy from a virus in a red eye",
    aap: "Eye - Red Without Pus",
    lead:
      "A pink eye with no pus is usually viral or allergic, and cool compresses do more for it than any drop.",
    description:
      "A red eye without discharge in children: telling viral from allergic, what helps, and the signs that need to be seen today.",
    intro: [
      "Two very different things produce a red eye with nothing coming out of it, and the history separates them. Allergy itches, takes both eyes at once, and arrives with a running nose and sneezing. A virus feels gritty rather than itchy, follows a cold, and usually starts in one eye before crossing to the other a day or two later.",
      "Call us today for real eye pain rather than grittiness, for changed vision, or for light that hurts. Call too if the eyelid is swelling shut, or if only one eye turned red after a knock. Pain, changed vision, light sensitivity, a closing eyelid and a recent injury each point to something deeper in the eye than surface irritation.",
    ],
  },
  {
    slug: "eye-allergy",
    title: "Eye Allergies in Children",
    short: "Eye allergies",
    group: "Eyes",
    heading: "Why rubbing allergic eyes makes them worse",
    aap: "Eye Allergy",
    lead:
      "Itching in both eyes is the sign that separates allergy from infection. Infected eyes feel gritty, allergic eyes feel itchy.",
    description:
      "Eye allergies in children: telling allergy from infection, which drops help, and how to reduce what sets it off.",
    intro: [
      "Rubbing is the reason allergic eyes get worse through the day. Pressure on the eye releases more histamine from the cells already primed in the lid, so each rub buys a few seconds of relief and then more itching than before. Breaking that loop matters more than any drop, and a cold compress does it faster than telling a child to stop.",
      "Reduce the exposure where you can: wash hair before bed in pollen season, keep bedroom windows shut on high-pollen days, and wipe pets down after they have been outside. Call us if only one eye is affected, if you see pus, or if your child's vision changes.",
    ],
  },
  {
    slug: "eye-foreign-object",
    title: "Something in a Child's Eye",
    short: "Something in the eye",
    group: "Eyes",
    heading: "Why the feeling lasts after the speck has gone",
    aap: "Eye - Foreign Object",
    lead:
      "Flush the eye with clean lukewarm water for several minutes and never try to pick anything off the colored part of the eye.",
    description:
      "Getting something out of a child's eye: flushing safely, what not to touch, and when a foreign object needs removing by us.",
    intro: [
      "Water gets almost everything out. A speck caught under the lid feels exactly like a scratch on the eye itself. So a child who still feels something after a thorough rinse is not making it up. The sensation carries on because the surface has been grazed. Rinsing costs nothing and settles most of these at home.",
      "Come in the same day if the feeling has not gone after rinsing. We put a drop of dye in the eye and look with a blue light, which shows a scratch in seconds and tells us whether anything is still there. Come straight away for anything metal, anything that arrived at speed, or a chemical splash, and never let anyone lift something off the colored part of the eye at home.",
    ],
  },
  {
    slug: "chemical-in-eye",
    title: "A Chemical in the Eye",
    short: "Chemical in the eye",
    group: "Eyes",
    heading: "Why the first twenty minutes decide the damage",
    aap: "Chemical in eye",
    lead:
      "Flush the eye with running water for a full twenty minutes before you do anything else, including phoning.",
    description:
      "A chemical splash in a child's eye: flushing for twenty minutes, calling Poison Control, and why every chemical splash gets seen.",
    intro: [
      "Get your child under running lukewarm water immediately and hold the eyelid open. Flush for twenty full minutes by a clock. A shower, a tap or a clean jug all work. Do not stop early to look, and do not stop to make a phone call first, because the first minutes decide how much damage a chemical does.",
      "Have somebody else call Poison Control at 1-800-222-1222 while you keep flushing, and have the container to hand. Every chemical eye injury needs examining afterward, so go to an emergency room once you have finished the twenty minutes, even if the eye looks normal.",
    ],
  },
  {
    slug: "eye-injury",
    title: "Eye Injuries in Children",
    short: "Eye injury",
    group: "Eyes",
    heading: "Why nothing should press on an injured eye",
    aap: "Eye Injury",
    lead:
      "Cover an injured eye with a shield rather than a pad, keep your child from rubbing it, and have us look at it the same day.",
    description:
      "Eye injuries in children: protecting the eye, what never to do, and which injuries go straight to an emergency room.",
    intro: [
      "Pressure is the thing to avoid. A pad or a hand over an injured eye presses on the eyeball. Pressure on a cut surface can force out what should stay inside. Standard first aid is therefore the bottom of a paper cup taped over the socket, which shields the eye and touches nothing. Stop your child rubbing, and rinse nothing, press nothing and pull nothing out.",
      "Go to an emergency room now for a cut on the eyeball, blood pooling inside the colored part, or a pupil that has changed shape. Go for anything stuck in the eye, or any change in vision. Do not stop to clean anything up. Call us the same day for a black eye, for an eye that keeps watering after a knock, or for the gritty feeling of a scratched surface. We can look at all three here, with dye and a blue light.",
    ],
  },
  {
    slug: "eyelid-swelling",
    title: "A Swollen Eyelid",
    short: "Swollen eyelid",
    group: "Eyes",
    heading: "The swollen eyelid that needs seeing today",
    aap: "Eyelid Swelling",
    lead:
      "A swollen eyelid with a fever, or an eyelid that has swollen shut, needs to be seen the same day rather than watched.",
    description:
      "Swollen eyelids in children: the harmless causes, the infection that needs treating quickly, and what to check at home.",
    intro: [
      "Most swollen eyelids are allergy or a sty and settle at home. One picture does not: a single eyelid that is red, warm and painful, especially alongside a fever. That combination can mean infection spreading into the tissue around the eye socket, which moves quickly and needs treating the same day rather than watching overnight.",
      "Call us the same day for swelling in one eyelid that is red, warm and painful, particularly with a fever. An infection spreading around the eye socket needs treating quickly. Go to an emergency room if your child cannot open the eye, cannot move it in every direction, or complains of double vision.",
    ],
  },
  {
    slug: "sty",
    title: "Styes in Children",
    short: "Sty",
    group: "Eyes",
    heading: "Why a sty needs warmth, not an antibiotic",
    aap: "Sty",
    lead:
      "Hold a warm compress on a sty for ten minutes four times a day and never squeeze it.",
    description:
      "Styes in children: the warm compresses that clear one, why squeezing is a bad idea, and when a lump on the lid needs seeing.",
    intro: [
      "A sty is a blocked oil gland rather than an infection, which is why antibiotic ointment does so little for one. Warmth softens the blockage until the gland drains itself, and that is what clears it. Squeezing pushes the contents deeper into the lid and is the usual reason a simple sty turns into something that needs treating.",
      "Never squeeze a sty, and skip antibiotic ointments unless we have prescribed one. Most styes are blockages rather than infections. Call us if the whole eyelid becomes red and swollen, if your child has a fever, if vision changes, or if the lump is still there after two weeks.",
    ],
  },
  {
    slug: "blocked-tear-duct",
    title: "A Blocked Tear Duct in Babies",
    short: "Blocked tear duct",
    group: "Eyes",
    heading: "Why a baby's eye waters, and when it stops",
    aap: "Tear Duct - Blocked",
    lead:
      "A baby with a constantly watery eye and no redness almost always has a blocked tear duct, and almost all of them open on their own within the first year.",
    description:
      "Blocked tear ducts in babies: the gentle massage that helps, what is normal, and the signs that mean an infection.",
    intro: [
      "Nearly one baby in five is born with a tear duct that has not opened yet, so tears pool and spill instead of draining into the nose. The eye therefore waters constantly while staying white and comfortable. Almost all of these ducts open on their own during the first year, and massage over the duct helps them along rather than being the thing that fixes it.",
      "Expect a watery eye with no redness and a comfortable baby. Call us if the white of the eye turns red, if the eyelid becomes swollen or tender, or if thick discharge appears alongside redness. Call as well if the eye is still watering by your baby's first birthday.",
    ],
  },
  {
    slug: "earwax",
    title: "Earwax Buildup",
    short: "Earwax",
    group: "Ears, nose, mouth and teeth",
    heading: "Why cotton buds cause the blockages they clear",
    aap: "Earwax Buildup",
    lead:
      "Never put a cotton bud in your child's ear. A cotton bud pushes wax against the eardrum, and that is how most wax blockages start.",
    description:
      "Earwax in children: why cotton buds make it worse, what safely softens wax, and when a blockage needs removing here.",
    intro: [
      "Ears clean themselves. Wax forms at the outer part of the canal and migrates outward on its own, so a canal left alone almost never blocks. A cotton bud reverses that: it takes a little wax out and pushes the rest inward against the eardrum, which is how most of the blockages we remove got there. Ear candling does nothing at all and burns children.",
      "Soften genuinely blocked wax with a few drops of mineral oil or an over-the-counter wax softener for several nights. Call us if your child's hearing has changed, if the ear hurts, or if you can see wax pressed hard against the canal. We can remove wax safely, and removing it at home is where eardrums get perforated.",
    ],
  },
  {
    slug: "swimmers-ear",
    title: "Swimmer's Ear",
    short: "Swimmer's ear",
    group: "Ears, nose, mouth and teeth",
    heading: "The tug test that tells the two ear pains apart",
    aap: "Ear - Swimmer's",
    lead:
      "Pain when you tug your child's earlobe points to swimmer's ear rather than a middle ear infection, and swimmer's ear needs prescription drops.",
    description:
      "Swimmer's ear in children: the tug test that identifies it, why it needs drops rather than tablets, and how to prevent the next one.",
    intro: [
      "Tug gently on the outer ear. Sharp pain from that tug means the infection sits in the ear canal rather than behind the eardrum, which changes the treatment completely. Give pain relief and call us for antibiotic ear drops, since tablets do not reach the canal well.",
      "Keep the ear dry while it heals, with no swimming until we say so, and a shower cap or a cotton ball smeared with petroleum jelly for washing. Prevent the next infection by tilting the head to drain each ear after swimming and drying the outer ear thoroughly.",
    ],
  },
  {
    slug: "ear-discharge",
    title: "Discharge From a Child's Ear",
    short: "Ear discharge",
    group: "Ears, nose, mouth and teeth",
    heading: "Why the pain stops when the ear starts draining",
    aap: "Ear - Discharge",
    lead:
      "Fluid draining from an ear usually means the eardrum has perforated, which relieves the pain and needs us to look.",
    description:
      "Discharge from a child's ear: what it usually means, why the pain suddenly stopped, and what to do while you wait to be seen.",
    intro: [
      "Wipe the outer ear clean and put nothing at all into the canal, meaning no drops, no cotton buds and no plugs, until we have looked. Expect the ear pain to have eased suddenly, because pressure behind a bulging eardrum is what hurt, and a perforation releases it.",
      "Call us today. Most perforations from an ear infection heal on their own within a few weeks, but your child needs the right treatment meanwhile and a check that it has closed. Call sooner if the discharge is bloody after an injury, or if your child has a fever with pain and swelling behind the ear.",
    ],
  },
  {
    slug: "ear-congestion",
    title: "Ear Congestion and Pressure",
    short: "Ear congestion",
    group: "Ears, nose, mouth and teeth",
    heading: "Why fluid lingers for months after an ear infection",
    aap: "Ear - Congestion",
    lead:
      "Blocked, popping ears after a cold or a flight are usually fluid behind the eardrum, and that fluid drains on its own over weeks.",
    description:
      "Blocked or popping ears in children: what causes the pressure, what helps it clear, and when persistent fluid needs checking.",
    intro: [
      "The tube that drains the middle ear runs almost flat in a young child and only opens when they swallow or yawn. A cold blocks that tube easily, pressure builds behind it on a plane's descent, and fluid can sit behind the eardrum for weeks after the infection itself has gone. The tube steepens as a child grows, and the problem fades with it.",
      "Expect fluid after an ear infection to take up to three months to clear, without needing treatment. Call us if your child's hearing seems reduced for more than a few weeks, if speech seems to be slipping, or if pressure comes with pain and fever.",
    ],
  },
  {
    slug: "ear-injury",
    title: "Ear Injuries in Children",
    short: "Ear injury",
    group: "Ears, nose, mouth and teeth",
    heading: "Why nothing should go into the canal",
    aap: "Ear Injury",
    lead:
      "Put nothing into an injured ear, and call us the same day for anything that involves the canal or the drum.",
    description:
      "Ear injuries in children: cuts and knocks to the outer ear, objects pushed into the canal, and what needs seeing today.",
    intro: [
      "Clean a cut on the outer ear with water, press gently to stop bleeding, and cover it. Apply a cold pack to a bruised ear. Leave the canal alone entirely. Never try to retrieve an object with tweezers or a cotton bud, because pushing the object deeper is far easier than pulling it out.",
      "Call us the same day for an object stuck in the ear, blood or clear fluid coming from the canal, hearing loss after a knock, or a swollen bruise on the ear itself. Go to an emergency room for an ear that is partly torn away or a head injury alongside the ear injury.",
    ],
  },
  {
    slug: "toothache",
    title: "Toothache in Children",
    short: "Toothache",
    group: "Ears, nose, mouth and teeth",
    heading: "A toothache does not settle on its own",
    aap: "Toothache",
    lead:
      "Give ibuprofen, rinse with warm salt water, and book a dentist, because a toothache does not settle by itself.",
    description:
      "Toothache in children: relieving the pain tonight, what not to put on the gum, and the swelling that needs urgent care.",
    intro: [
      "Toothache means decay or infection that has reached the nerve, and neither resolves by itself. Pain relief buys a night's sleep and changes nothing underneath, so the appointment is the treatment. Never place an aspirin against the gum while you wait, which is an old remedy that burns the tissue it touches.",
      "Book a dental appointment, because pain from a tooth means decay or infection that will keep returning. Call us if your child's face or jaw is swelling, or if a fever arrives with the toothache. Go to an emergency room if the swelling reaches the eye or makes swallowing difficult.",
    ],
  },
  {
    slug: "tooth-injury",
    title: "A Knocked or Broken Tooth",
    short: "Tooth injury",
    group: "Ears, nose, mouth and teeth",
    heading: "Minutes decide whether a permanent tooth survives",
    aap: "Tooth Injury",
    lead:
      "A knocked-out permanent tooth is a genuine emergency. Put the tooth back in the socket or in milk, and get to a dentist within the hour.",
    description:
      "Knocked-out and broken teeth in children: what to do in the first hour, why baby teeth are handled differently, and where to go.",
    intro: [
      "Minutes decide whether a permanent tooth survives. A tooth reseated within about fifteen minutes usually takes, one left out for an hour usually does not, and drying out is what kills it. Hold it by the crown so you do not damage the fibers along the root, and put it back in the socket yourself if you can bear to.",
      "Call us while you are on the way to a dentist rather than afterwards, and we will help you find one who is open. Bring your child here for a knocked-out baby tooth, which must never go back in. The question then is whether the permanent tooth developing above it took any damage, and that is worth checking the same day.",
    ],
  },
  {
    slug: "mouth-ulcers",
    title: "Mouth Ulcers in Children",
    short: "Mouth ulcers",
    group: "Ears, nose, mouth and teeth",
    heading: "Ulcers stop children drinking, and that is the risk",
    aap: "Mouth Ulcers",
    lead:
      "Keep your child drinking, because mouth ulcers stop children swallowing and dehydration is the reason most of them end up needing us.",
    description:
      "Mouth ulcers in children: managing the pain so your child keeps drinking, what to avoid, and when ulcers need looking at.",
    intro: [
      "Mouth ulcers rarely cause trouble in themselves. They cause trouble because a child with a painful mouth quietly stops drinking, and dehydration is what actually brings these children in to see us. Timing pain relief about twenty minutes before meals rather than after them is what keeps a child drinking through the week the ulcers take.",
      "Count wet diapers or trips to the toilet rather than counting ulcers. Call us if your child will not drink, has not passed urine for eight hours, has ulcers alongside a high fever, or has ulcers that keep coming back month after month.",
    ],
  },
  {
    slug: "mouth-injury",
    title: "Mouth Injuries in Children",
    short: "Mouth injury",
    group: "Ears, nose, mouth and teeth",
    heading: "Why mouth injuries look so much worse than they are",
    aap: "Mouth Injury",
    lead:
      "Press a gauze pad or a cold wet cloth against the bleeding spot for ten minutes without lifting it to check.",
    description:
      "Cuts to a child's lip, tongue or mouth: stopping the bleeding, which cuts need closing, and the injuries that need seeing today.",
    intro: [
      "Mouths bleed dramatically and stop reliably, which is why these injuries frighten parents far more than they harm children. Ten minutes of steady pressure by the clock settles almost all of them, and lifting the pad to check is the usual reason the bleeding appears to start again. The blood mixed with saliva always looks like more than it is.",
      "Come in the same day for a cut that crosses the lip border, where the red meets the skin, because that line has to be repaired exactly or it heals crooked. Come in too for a cut longer than about half an inch, a puncture in the roof or the back of the throat, or bleeding that outlasts ten minutes of pressure. We can numb and repair most mouth injuries in the office.",
    ],
  },
  {
    slug: "thrush",
    title: "Thrush in Babies",
    short: "Thrush",
    group: "Ears, nose, mouth and teeth",
    heading: "Telling thrush from milk on the tongue",
    aap: "Thrush",
    lead:
      "White patches in a baby's mouth that will not wipe away are thrush, and thrush needs a prescription antifungal.",
    description:
      "Thrush in babies: telling it from milk residue, treating baby and mother together, and stopping it coming back.",
    intro: [
      "Try wiping a patch gently with a clean damp cloth. Milk residue lifts away. Thrush stays put and may leave a raw red spot. Call us for an antifungal gel or drops, because thrush does not clear on its own.",
      "Treat both sides at once if you are breastfeeding. Thrush passes back and forth between a baby's mouth and the nipple, so ask us about treating yourself at the same time. Sterilize bottle teats and pacifiers daily, and replace them after a week of treatment.",
    ],
  },
  {
    slug: "sinus-pain",
    title: "Sinus Pain and Congestion",
    short: "Sinus pain",
    group: "Ears, nose, mouth and teeth",
    heading: "The shape of the illness, not the face pain",
    aap: "Sinus Pain or Congestion",
    lead:
      "Most sinus pain is a cold and needs no antibiotic. The pattern that changes our mind is a cold that improved and then clearly got worse again.",
    description:
      "Sinus pain and congestion in children: what helps, why antibiotics usually are not the answer, and the pattern that means calling us.",
    intro: [
      "The shape of the illness decides this, not how bad the face pain feels. A cold that peaks around day three and eases from there is a cold, however much pressure your child describes on the way. A cold that improved for a day or two and then turned back, with a fever and worsening pain, has become something else. That turn is what would bring us to see your child.",
      "Call us if congestion runs past ten days without improving, or if that turn for the worse happens. We look in the nose and the throat, and we prescribe an antibiotic only for the pattern above, because sinus pain by itself almost never needs one. Bring your child in the same day for redness or swelling in the skin around an eye, which is the one complication we move quickly on.",
    ],
  },
  {
    slug: "hoarseness",
    title: "Hoarseness in Children",
    short: "Hoarseness",
    group: "Ears, nose, mouth and teeth",
    heading: "Why whispering strains the voice more than talking",
    aap: "Hoarseness",
    lead:
      "Rest the voice and add moisture to the air. Most hoarseness follows shouting or a virus and clears within a week.",
    description:
      "Hoarseness and lost voice in children: what helps it recover, why whispering does not, and when a hoarse voice needs checking.",
    intro: [
      "Whispering is the instinct and the wrong one. It holds the vocal cords apart under tension rather than resting them, so it strains an already inflamed voice more than talking quietly does. Quiet ordinary speech, moist air and no smoke give the cords the three to seven days they need to recover.",
      "Call us if hoarseness lasts more than two weeks, if it comes with drooling, difficulty swallowing or noisy breathing, or if your child sounds hoarse and is struggling to breathe. That combination needs urgent assessment rather than voice rest.",
    ],
  },
  {
    slug: "nose-injury",
    title: "Nose Injuries in Children",
    short: "Nose injury",
    group: "Ears, nose, mouth and teeth",
    heading: "Why a broken nose is judged after the swelling goes",
    aap: "Nose Injury",
    lead:
      "Stop the bleeding by pinching the soft part of the nose for ten minutes, then apply ice. Have us look if the shape of the nose has changed.",
    description:
      "Nose injuries in children: stopping the bleeding, reducing swelling, and the signs of a break that needs setting.",
    intro: [
      "Sit your child up and lean them forward, pinch the soft part of the nose below the bone for ten unbroken minutes, then hold a cold pack across the bridge for twenty. Give acetaminophen rather than ibuprofen in the first hours, since ibuprofen encourages more bleeding.",
      "A nose swells enough in the first days to hide its own shape, so nobody can judge whether it is broken until that settles. Look from in front and from above after two or three days, and come in if the shape has changed or your child cannot breathe through one side. Come the same day for clear fluid dripping from the nose after a hard knock, or for a swollen bulge inside the nostril, since both need attention before the swelling story plays out.",
    ],
  },
  {
    slug: "cuts-and-scrapes",
    title: "Cuts, Scrapes and Bruises",
    short: "Cuts and scrapes",
    group: "Knocks, pain and injuries",
    heading: "Why lifting the pad restarts the bleeding",
    aap: "Cut, Scrape, or Bruise",
    lead:
      "Press on a bleeding cut for ten minutes without lifting the cloth, then wash it under running water for several minutes.",
    description:
      "Cuts, scrapes and bruises in children: stopping bleeding, cleaning a wound properly, and which cuts need closing today.",
    intro: [
      "Press firmly with clean gauze for ten minutes by a clock. Lifting the pad to look is why bleeding seems to restart. Hold the wound under running water for several minutes once the bleeding stops, to flush the dirt out, then apply petroleum jelly and a bandage. Wounds heal faster kept moist and covered than left to scab in the air.",
      "Come in the same day for a cut that gapes open, is longer than half an inch, sits on the face, crosses a joint, or came from something dirty or rusty. Call us too if your child has not had a tetanus shot in five years and the wound is deep or dirty.",
    ],
  },
  {
    slug: "scrape",
    title: "Scrapes and Grazes",
    short: "Scrapes",
    group: "Knocks, pain and injuries",
    heading: "Why grit left in a scrape stays for life",
    aap: "Scrape",
    lead:
      "Scrub the grit out under running water. Dirt left in a scrape is what causes both infection and permanent tattooing of the skin.",
    description:
      "Scrapes and grazes in children: cleaning grit out properly, keeping the wound moist, and the signs of infection.",
    intro: [
      "Run the scrape under lukewarm water and wash gently with soap, using a clean wet gauze pad to lift out embedded grit. Washing a scrape stings, so give pain relief first and warn your child. Any dirt left behind can stay visible in the skin for life.",
      "Come in if you cannot get the grit out yourself, because we can numb the area and clean it properly, and that is far easier than living with the mark. Skip hydrogen peroxide and alcohol meanwhile, which damage the healing tissue they are meant to protect. Call us if the scrape covers a large area, or if the edges turn red, swollen and increasingly painful after two days.",
    ],
  },
  {
    slug: "puncture-wound",
    title: "Puncture Wounds",
    short: "Puncture wounds",
    group: "Knocks, pain and injuries",
    heading: "Why a puncture is riskier than a cut",
    aap: "Puncture Wound",
    lead:
      "A puncture wound looks trivial and carries the highest infection risk of any small injury. Call us about any puncture that goes through a shoe.",
    description:
      "Puncture wounds in children: why they get infected, tetanus timing, and which punctures need to be seen.",
    intro: [
      "A cut opens and drains. A puncture seals itself over whatever went in with it. A wound the size of a pinhead therefore carries the highest infection risk of any small injury, and tetanus prevention exists mainly for this shape of wound. A puncture through a shoe is the classic one, because it carries sock fibers and foot bacteria deep into the sole.",
      "Call us for any puncture through a shoe, any wound from a nail, needle or animal tooth, anything that might have left material inside, and any puncture to the foot, hand, chest or abdomen. Watch for redness, swelling and increasing pain over the next two days.",
    ],
  },
  {
    slug: "arm-injury",
    title: "Arm Injuries in Children",
    short: "Arm injury",
    group: "Knocks, pain and injuries",
    heading: "What your child does with the arm, not what they say",
    aap: "Arm Injury",
    lead:
      "A child who will not use an arm at all needs an X-ray, whatever the arm looks like from outside.",
    description:
      "Arm injuries in children: what points to a break, first aid before you come in, and the injuries that go straight to an emergency room.",
    intro: [
      "Watch what your child does with the arm rather than listening to what they say about it. A young child who keeps using an arm has almost never broken it. One who holds it still and will not lift it often has, with no swelling and no bruise to show for it. Behavior tells you far more at this age than any pain score.",
      "Come in the same day if your child will not use the arm, and we will X-ray it here rather than sending you on somewhere else. A toddler who suddenly will not straighten an arm after being swung or pulled up by the hand usually has a nursemaid's elbow, which we put back in seconds. Go straight to an emergency room for an obvious deformity, bone through skin, or a hand that is numb, pale or cold.",
    ],
  },
  {
    slug: "leg-injury",
    title: "Leg Injuries in Children",
    short: "Leg injury",
    group: "Knocks, pain and injuries",
    heading: "One test sorts most leg injuries",
    aap: "Leg Injury",
    lead:
      "A child who will not put weight on a leg needs to be seen, even when nothing looks broken.",
    description:
      "Leg injuries in children: what limping tells us, first aid at home, and which injuries need an emergency room.",
    intro: [
      "One test sorts most leg injuries: ask your child to walk a few steps and watch. A child who bears weight, even with a limp, has almost never broken anything. A child who refuses to put the foot down has often broken something, and swelling tells you very little either way, since a badly sprained ankle swells more than most fractures do.",
      "Come in the same day if your child will not walk, or if a limp is still there the next morning, and we will X-ray the leg here. A limp with a fever gets seen the same day whatever caused it, because an infected joint behaves like an injury for a day or two and cannot wait. Go to an emergency room for an obvious deformity, bone through skin, or a foot that is numb, pale or cold.",
    ],
  },
  {
    slug: "finger-injury",
    title: "Finger Injuries in Children",
    short: "Finger injury",
    group: "Knocks, pain and injuries",
    heading: "Take the ring off before anything else",
    aap: "Finger Injury",
    lead:
      "Rings come off now, before swelling makes that impossible, and a crushed fingertip usually needs looking at.",
    description:
      "Finger injuries in children: removing rings, easing a crushed fingertip, and which finger injuries need to be seen.",
    intro: [
      "A finger swells fast, and a ring that slid off easily an hour ago can trap blood in the finger by evening. Take any ring off before you do anything else, including looking at the injury properly. A cold pack and a hand raised above the heart then do more than anything else, and buddy-taping the hurt finger to the one beside it keeps it still.",
      "Come in the same day for a finger that looks crooked or will not straighten, a cut through a nail bed, a nail torn partly off, or blood under more than half the nail. Blood under a nail often needs releasing to relieve the pressure. Go to an emergency room for an amputated fingertip, bringing the piece wrapped in damp gauze inside a bag on ice.",
    ],
  },
  {
    slug: "toe-injury",
    title: "Toe Injuries in Children",
    short: "Toe injury",
    group: "Knocks, pain and injuries",
    heading: "Why a big toe injury matters more than the others",
    aap: "Toe Injury",
    lead:
      "Most broken toes need buddy-taping and stiff shoes rather than a cast, but a crooked toe or a nail-bed cut needs seeing.",
    description:
      "Toe injuries in children: taping, ice and shoes, plus the toe injuries that need to be examined.",
    intro: [
      "Tape the hurt toe to the one beside it, with a little gauze between them. Apply a cold pack, keep the foot raised, and put your child in a stiff-soled shoe rather than something soft. Give ibuprofen for the first few days.",
      "Come in the same day for a toe that points the wrong way, a cut through the nail bed, or a nail torn off. Come in for any injury to the big toe as well, since it carries more of a child's weight than the other four together. Call us if your child still will not walk on the foot after two days.",
    ],
  },
  {
    slug: "neck-pain",
    title: "Neck Pain and Stiffness",
    short: "Neck pain",
    group: "Knocks, pain and injuries",
    heading: "The chin-to-chest test, and what it rules out",
    aap: "Neck Pain or Stiffness",
    lead:
      "A stiff neck with a fever needs to be seen now. A stiff neck after a night in an odd position does not.",
    description:
      "Neck pain and stiffness in children: separating a strain from something urgent, what helps, and when to seek care immediately.",
    intro: [
      "Ask your child to look down and touch their chin to their chest. A child who can do that comfortably almost never has meningitis. Treat an ordinary strain with heat, gentle movement and ibuprofen, and check whether a pillow or a screen position is the cause.",
      "Seek care immediately for neck stiffness with fever, headache, vomiting, a rash, drowsiness or dislike of bright light. Go to an emergency room for neck pain after a fall or crash, or with numbness, tingling or weakness in the arms or legs. Do not move your child yourself after a significant injury.",
    ],
  },
  {
    slug: "back-pain",
    title: "Back Pain in Children",
    short: "Back pain",
    group: "Knocks, pain and injuries",
    heading: "Why back pain in a child is taken seriously",
    aap: "Back Pain",
    lead:
      "Back pain in a child deserves more attention than back pain in an adult, because far fewer children get it without a reason.",
    description:
      "Back pain in children: what usually causes it, what helps, and the patterns that need investigating.",
    intro: [
      "Back pain is ordinary in adults and less so in children, which is why we ask more questions about it than you might expect. Most of it still turns out to be a heavy backpack worn on one shoulder, a growth spurt, a new sport, or hours hunched over a screen. Gentle movement beats bed rest for all four.",
      "Book an appointment if the pain wakes your child at night, lasts more than a week, or follows an injury. Book one for pain alongside fever or weight loss, and for numbness, weakness, or any change in using the toilet. Night pain, fever, weight loss and numbness all need looking into rather than a few days of rest.",
    ],
  },
  {
    slug: "chest-pain",
    title: "Chest Pain in Children",
    short: "Chest pain",
    group: "Knocks, pain and injuries",
    heading: "Chest pain in children is almost never the heart",
    aap: "Chest Pain",
    lead:
      "Chest pain in children is almost never the heart. The cause is usually muscle, rib or lung, and the pattern tells you which.",
    description:
      "Chest pain in children: the common harmless causes, how to tell them apart, and the symptoms that need urgent care.",
    intro: [
      "Press on the spot. Pain that gets worse when you press it, or when your child takes a deep breath or twists, comes from muscle or rib and settles with rest and ibuprofen. Pain with a cough and fever points to the lungs. Burning behind the breastbone after meals points to reflux.",
      "Seek care immediately for chest pain with fainting, palpitations, breathlessness at rest, or pain during exercise. Call us the same day for chest pain with a fever, or in a child with a heart condition, sickle cell disease or a family history of sudden cardiac death.",
    ],
  },
  {
    slug: "burn",
    title: "Burns in Children",
    short: "Burns",
    group: "Knocks, pain and injuries",
    heading: "Why twenty minutes of cool water changes the burn",
    aap: "Burn",
    lead:
      "Hold the burn under cool running water for twenty minutes. Use no ice and no butter, and do not stop at two minutes.",
    description:
      "Burns in children: cooling for twenty minutes, what never to apply, and which burns need to be seen straight away.",
    intro: [
      "Run cool water, not cold water, over the burn for a full twenty minutes, removing clothing and jewelry from the area unless fabric is stuck to the skin. Cooling properly in the first hour genuinely reduces how deep a burn goes. Cover the burn afterward with plastic wrap laid loosely on top, or a clean non-fluffy cloth.",
      "Never apply ice, butter, toothpaste or ointment, and do not burst blisters. Go to an emergency room for any burn larger than your child's palm, and for any burn on the face, hands, feet, genitals or across a joint. Go for a burn that looks white or leathery, and for every electrical or chemical burn.",
    ],
  },
  {
    slug: "frostbite",
    title: "Frostbite in Children",
    short: "Frostbite",
    group: "Knocks, pain and injuries",
    heading: "Why rubbing frostbitten skin causes damage",
    aap: "Frostbite",
    lead:
      "Rewarm frostbitten skin in warm water rather than rubbing it, and never rewarm a part that might freeze again.",
    description:
      "Frostbite in children: rewarming safely, what damages the tissue further, and which cases need an emergency room.",
    intro: [
      "Frozen tissue is full of ice crystals, and rubbing drags them through the cells around them, which is why the instinct to warm hands by rubbing does real damage here. Direct heat from a fire, radiator or hairdryer burns skin that cannot feel it yet. Warm water at about 40°C, comfortable to your own elbow, rewarms without either risk. Never rewarm feet your child then has to walk out on, because refreezing does more harm than staying frozen.",
      "Expect rewarming to hurt, and give ibuprofen for it. Go to an emergency room for skin that stays white, gray or hard after rewarming, for blisters, or for numbness that persists. Go straight away if your child is also shivering uncontrollably, confused or drowsy, which points to hypothermia.",
    ],
  },
  {
    slug: "heat-illness",
    title: "Heat Exhaustion and Heatstroke",
    short: "Heat illness",
    group: "Knocks, pain and injuries",
    heading: "Heat exhaustion, and the heatstroke that follows it",
    aap: "Heat Exposure and Reactions",
    lead:
      "A child who stops sweating, becomes confused, or collapses in the heat has heatstroke. Call 911 and start cooling immediately.",
    description:
      "Heat exhaustion and heatstroke in children: cooling fast, the difference between the two, and when to call 911.",
    intro: [
      "Move your child into shade or air conditioning, take off extra clothing, give cool water or a sports drink in small sips, and put cool wet cloths on the neck, armpits and groin. Heat exhaustion looks like heavy sweating, pale clammy skin, headache, nausea and weakness, and it improves within half an hour of cooling.",
      "Call 911 for heatstroke, which looks different: hot skin that may have stopped sweating, a temperature above 104°F, confusion, slurred speech, seizures or collapse. Keep cooling your child while you wait, rather than leaving the cooling to the ambulance crew.",
    ],
  },
  {
    slug: "sliver",
    title: "Slivers and Splinters",
    short: "Slivers and splinters",
    group: "Knocks, pain and injuries",
    heading: "Which splinters to leave alone",
    aap: "Sliver or Splinter",
    lead:
      "Pull a splinter out along the same line it went in, using tweezers sterilized with alcohol.",
    description:
      "Splinters in children: removing one cleanly, when to leave it alone, and the signs it needs professional removal.",
    intro: [
      "Wash your hands and the skin, sterilize fine tweezers with alcohol, and grip the splinter as close to the skin as possible, pulling along the angle it entered. Sterilize a needle and gently lift the skin over the tip first if the end is buried. Wash the area again afterward.",
      "Leave a tiny surface splinter alone, because the skin will push it out within a few days. Call us for a splinter you cannot reach, one under a nail, one made of glass or metal, anything deeply embedded, or a site that becomes red, swollen and increasingly painful.",
    ],
  },
  {
    slug: "skin-foreign-object",
    title: "Something Embedded in the Skin",
    short: "Something in the skin",
    group: "Knocks, pain and injuries",
    heading: "What to pull out, and what to leave alone",
    aap: "Skin Foreign Object",
    lead:
      "Leave anything large or deeply embedded exactly where it is and come in. Pulling an object out can cause more damage than it did going in.",
    description:
      "Objects embedded in a child's skin: what you can safely remove, what to leave alone, and how to protect the area on the way in.",
    intro: [
      "Remove only a small, superficial object you can grip easily with sterilized tweezers. Leave anything large, deep, or made of glass or metal exactly where it is. Pad around a protruding object and tape the padding down so nothing presses on it while you travel.",
      "Come in the same day. Go to an emergency room instead for an object in the eye, the neck, the chest or the abdomen, for heavy bleeding, or for a fish hook past the barb. Check your child's tetanus history before you come, because we will ask.",
    ],
  },
  {
    slug: "wound-infection",
    title: "An Infected Wound",
    short: "Infected wound",
    group: "Knocks, pain and injuries",
    heading: "Wounds improve after day one; infections do not",
    aap: "Wound Infection",
    lead:
      "Redness that spreads, pain that increases after day two, and a wound that is warm to touch all mean infection, so call us rather than waiting.",
    description:
      "Infected wounds in children: what infection actually looks like, why the timing matters, and what needs urgent care.",
    intro: [
      "Watch the direction of travel. A wound is normally most painful and most red on day one and improves after that. Infection reverses the pattern: more redness, more pain and more swelling on day two or three, often with warmth, pus and a fever.",
      "Draw a line around the redness with a pen and note the time, so you can tell us whether the edge is moving and how fast. Call us today if the redness, the pain or the swelling is increasing. Seek care immediately for red streaks running from the wound, spreading redness with a fever, or a wound that has become severely painful out of proportion to how it looks.",
    ],
  },
  {
    slug: "suture-care",
    title: "Looking After Stitches",
    short: "Stitches",
    group: "Knocks, pain and injuries",
    heading: "Why the removal date matters",
    aap: "Suture Questions",
    lead:
      "Keep stitches clean and dry for the first day, then wash gently every day. Know the date the stitches need to come out.",
    description:
      "Caring for a child's stitches: keeping the wound clean, when it can get wet, removal timing, and the signs of infection.",
    intro: [
      "Stitches have a window. Taken out too early, a wound can open. Left in too long, the threads leave their own marks in the skin, and that second half is the part families forget. Write the date down when the stitches go in, because nobody remembers it a week later, and the appointment is easy to arrange only if you know when it should be.",
      "Write the removal date down. Face stitches usually come out in about five days, arms and legs in about ten, and joints in about fourteen. Leaving stitches in too long marks the skin. Call us for spreading redness, pus, a fever, or a wound that opens up.",
    ],
  },
  {
    slug: "dizziness",
    title: "Dizziness in Children",
    short: "Dizziness",
    group: "Knocks, pain and injuries",
    heading: "What happened in the minute before",
    aap: "Dizziness",
    lead:
      "Have your child lie down and drink. Most childhood dizziness is standing up too fast on an empty stomach.",
    description:
      "Dizziness in children: the common causes, what helps immediately, and the symptoms that need investigating.",
    intro: [
      "Lay your child down with their legs raised until the feeling passes, then give fluids and something to eat. Ask what happened just before: standing up quickly, a hot shower, a skipped meal or a hard practice explain the great majority.",
      "Book an appointment if dizziness keeps returning, comes with the room spinning, or follows a head injury. Seek care immediately for dizziness with chest pain, palpitations, fainting during exercise, difficulty speaking, weakness on one side, or a severe headache.",
    ],
  },
  {
    slug: "fainting",
    title: "Fainting in Children",
    short: "Fainting",
    group: "Knocks, pain and injuries",
    heading: "The faints that need a heart check",
    aap: "Fainting",
    lead:
      "Fainting during exercise is different from fainting while standing still, and it needs checking rather than watching.",
    description:
      "Fainting in children: what to do at the time, the common harmless pattern, and the faints that need investigating.",
    intro: [
      "Lay your child flat and raise their legs until color returns, then let them sit up slowly and drink. Ask about the circumstances: standing a long time, a hot room, the sight of blood or a needle, or getting up quickly all point to ordinary fainting, which is common in teenagers.",
      "Book an appointment after any faint so we can check the heart and take a history. Seek care immediately for fainting during exercise, or fainting with chest pain or palpitations. The same goes for a faint that came with no warning at all, or one that lasted more than a minute. Tell us about any family history of sudden death in a young person.",
    ],
  },
  {
    slug: "weakness-and-fatigue",
    title: "Weakness and Fatigue in Children",
    short: "Weakness and fatigue",
    group: "Knocks, pain and injuries",
    heading: "Tired and weak are different problems",
    aap: "Weakness and Fatigue",
    lead:
      "Tell us whether your child is tired or actually weak. Being unable to climb stairs is a different problem from wanting to sleep all day.",
    description:
      "Tiredness and weakness in children: separating the two, the common causes of each, and what needs seeing quickly.",
    intro: [
      "Work out which one you are seeing. Fatigue means low energy and wanting to rest, and usually follows a virus, poor sleep, low iron or a period of stress. Weakness means muscles that will not do their job, as in a child who cannot climb the stairs they managed last week, or whose face droops.",
      "Seek care immediately for true weakness, especially on one side, or for weakness that is spreading upward from the feet. Book an appointment for fatigue lasting more than two weeks, or fatigue with weight loss, fever, night sweats, bruising or pale skin.",
    ],
  },
  {
    slug: "stomach-pain",
    title: "Stomach Pain in Children",
    short: "Stomach pain",
    group: "Stomach and bowels",
    heading: "Where the pain sits tells us most of it",
    aap: "Stomach Pain - Male",
    lead:
      "Ask your child to point with one finger. Pain they can localize to the lower right needs seeing today.",
    description:
      "Stomach pain in children: locating the pain, the harmless causes, and the pattern that suggests appendicitis.",
    intro: [
      "Ask your child to point to the sore spot with one finger, and watch where the finger lands. Pain spread around the navel that comes and goes is usually constipation, a virus or anxiety. Pain your child can pin to one spot in the lower right is the one we want to see today. The case is stronger still if the pain began near the navel and moved there over several hours, which is how appendicitis classically behaves.",
      "Call us before giving anything for severe pain, because pain relief softens the very findings we examine for. We can feel the belly, test the urine and arrange imaging from the office. Seek care immediately for a rigid, board-like belly, for blood in vomit or stool, or for green vomit. Go too for pain that wakes your child from sleep, or for a boy with pain in the groin or a testicle.",
    ],
  },
  {
    slug: "stomach-pain-female",
    title: "Stomach Pain in Girls and Young Women",
    short: "Stomach pain in girls",
    group: "Stomach and bowels",
    heading: "Why her cycle changes what we look for",
    aap: "Stomach Pain - Female",
    lead:
      "Stomach pain in a girl who has started periods has causes that a younger child's does not, so tell us about her cycle when you call.",
    description:
      "Stomach pain in girls and young women: what the menstrual cycle adds, the causes we consider, and the pain that needs urgent care.",
    intro: [
      "Note where the pain sits, how it relates to her cycle, and when her last period was. Mid-cycle pain on one side for a day or two is usually ovulation. Cramping in the few days around a period is usually normal menstrual pain and responds to ibuprofen started early.",
      "Seek care immediately for sudden severe one-sided pelvic pain, which can mean a twisted ovary and does not wait. Book the same day for pain with fever, vomiting, pain on passing urine, unusual discharge, or a missed period with pain.",
    ],
  },
  {
    slug: "blood-in-stool",
    title: "Blood in a Child's Stool",
    short: "Blood in stool",
    group: "Stomach and bowels",
    heading: "Where the blood sits tells us most of it",
    aap: "Stools - Blood In",
    lead:
      "Bright red streaks on hard stool are almost always a small tear from constipation. Dark, tarry or mixed-in blood is different, and it needs seeing.",
    description:
      "Blood in a child's stool: the common harmless cause, what different colors mean, and what needs urgent assessment.",
    intro: [
      "Where the blood sits tells you most of what matters. Bright red streaks on the outside of a hard stool, or on the paper, come from a small tear at the anus and travel with constipation almost every time. Blood mixed through the stool, black tarry stool, or blood alongside diarrhea comes from higher up, and that is a different problem.",
      "Call us today for anything other than streaks on a hard stool. We look at the anus, which usually settles the question inside a minute, and we treat the constipation behind it, because the tear keeps reopening until the stool softens. Seek care immediately for large amounts of blood, blood with severe stomach pain, or a child who is pale, floppy or passing jelly-like red stool.",
    ],
  },
  {
    slug: "unusual-stool-color",
    title: "Unusual Stool Colors",
    short: "Stool color",
    group: "Stomach and bowels",
    heading: "Only three stool colors matter",
    aap: "Stools - Unusual Color",
    lead:
      "Green, yellow, orange and brown stools are all normal. The three colors that matter are red, black and white.",
    description:
      "Unusual stool colors in children: which colors are normal, which three need a call, and what food explains most of it.",
    intro: [
      "Think about what your child ate in the last day or two. Beets and red gelatin turn stool red, spinach and food coloring turn it green, iron supplements turn it black, and none of that means anything. Breastfed babies produce mustard-yellow stool and formula-fed babies tan or green, both normal.",
      "Call us about three colors: red or black that food does not explain, and white or chalky pale stool at any age. Pale stool in a baby needs seeing quickly, because it can mean bile is not reaching the gut.",
    ],
  },
  {
    slug: "decreased-fluid-intake",
    title: "A Child Who Will Not Drink",
    short: "Not drinking enough",
    group: "Stomach and bowels",
    heading: "Counting output, not intake",
    aap: "Drinking Fluids - Decreased",
    lead:
      "Count wet diapers or trips to the toilet rather than counting cups, because output tells you what intake cannot.",
    description:
      "A child who will not drink: how to tell whether they are dehydrated, what to offer, and when to call us.",
    intro: [
      "Track how often your child passes urine. A baby should wet a diaper at least every six to eight hours, and an older child should use the toilet at least three or four times a day. Moist lips, tears when crying and normal energy all say your child is keeping up.",
      "Call us if your child has passed no urine for eight hours, has a dry mouth, cries without tears, seems unusually sleepy, or is a baby whose soft spot looks sunken. We can weigh your child against their last visit, which tells us how much fluid they have actually lost. For most children we can then give fluids here rather than sending you to an emergency room.",
    ],
  },
  {
    slug: "reflux",
    title: "Reflux and Spitting Up in Babies",
    short: "Reflux and spitting up",
    group: "Stomach and bowels",
    heading: "Spitting up that is laundry, and spitting up that is not",
    aap: "Reflux (Spitting Up)",
    lead:
      "A baby who spits up but is gaining weight and content is a laundry problem, not a medical one.",
    description:
      "Reflux and spitting up in babies: what is normal, what actually helps, and the signs that mean something more.",
    intro: [
      "Almost all spitting up is a laundry problem rather than a medical one. A baby who brings milk back after most feeds, and who is gaining weight and content between them, has a valve at the top of the stomach that has not tightened up yet. Time is the only treatment. Spitting up peaks around four months and settles once a baby sits upright and eats solids.",
      "Call us if your baby is not gaining weight, arches and screams during feeds, or refuses to feed. Call about blood or green color in the vomit, coughing and choking with feeds, or vomiting that travels across the room. Forceful vomiting in a young baby needs assessing quickly.",
    ],
  },
  {
    slug: "vomiting-baby",
    title: "Vomiting in Babies Under 12 Months",
    short: "Vomiting under 12 months",
    group: "Stomach and bowels",
    heading: "Why babies dehydrate faster than older children",
    aap: "Vomiting (0-12 Months)",
    lead:
      "Give a baby small amounts of milk or oral rehydration solution very often, and call us sooner than you would for an older child.",
    description:
      "Vomiting in babies under a year: keeping fluids in, telling spitting up from vomiting, and the signs that need same-day care.",
    intro: [
      "A baby holds far less fluid in reserve than an older child and loses it proportionally faster. A day of vomiting that a five-year-old shrugs off can leave a three-month-old genuinely dry. We set the threshold for seeing babies much lower for that reason, and counting wet diapers matters more here than counting vomits.",
      "Call us today for any vomiting in a baby under three months. Call too for forceful vomiting after every feed, green or bloody vomit, or a swollen or tender belly. Call straight away for fewer than four wet diapers a day, or a baby who is difficult to rouse.",
    ],
  },
  {
    slug: "diarrhea-baby",
    title: "Diarrhea in Babies Under 12 Months",
    short: "Diarrhea under 12 months",
    group: "Stomach and bowels",
    heading: "What normal looks like for your own baby",
    aap: "Diarrhea (0-12 Months)",
    lead:
      "Keep breast or formula feeds going through diarrhea rather than stopping them, because babies need the calories and the fluid.",
    description:
      "Diarrhea in babies under a year: continuing feeds, telling normal stool from diarrhea, and when a baby needs seeing.",
    intro: [
      "Work out what normal looks like for your baby before you decide anything is wrong. A breastfed baby can pass a loose yellow stool after every single feed and be perfectly well. Diarrhea means a clear jump in how many and how watery, measured against your baby's own usual pattern rather than against another baby's.",
      "Call us about any diarrhea in a baby under three months, and about blood or mucus in the stool at any age. Babies lose fluid far faster than older children, so we would rather weigh yours and look at them than talk it through over the phone. Call straight away for fewer than four wet diapers a day, a sunken soft spot, or a baby who has gone limp or hard to wake.",
    ],
  },
  {
    slug: "colds-baby",
    title: "Colds in Babies Under 12 Months",
    short: "Colds under 12 months",
    group: "Stomach and bowels",
    heading: "Why a blocked nose matters more in a baby",
    aap: "Colds (0-12 Months)",
    lead:
      "Use saline drops and a bulb syringe before every feed, because a baby with a blocked nose cannot breathe and feed at the same time.",
    description:
      "Colds in babies under a year: clearing the nose so a baby can feed, what medicines to avoid, and when to call us.",
    intro: [
      "Babies breathe through the nose, and they cannot breathe and feed at the same time with a blocked one. An ordinary cold that would barely slow a toddler therefore stops a baby feeding, and clearing the nose before a feed does more than anything else you can offer. Suction before feeds and before sleep rather than constantly, since over-suctioning swells the lining further.",
      "Give no over-the-counter cough or cold medicine to a baby, and no honey under a year. Call us for any fever in a baby under three months, fast or labored breathing, ribs pulling in, pauses in breathing, feeding much less than usual, or fewer than four wet diapers a day.",
    ],
  },
  {
    slug: "cough-baby",
    title: "Cough in Babies Under 12 Months",
    short: "Cough under 12 months",
    group: "Stomach and bowels",
    heading: "Count the breaths, not the coughs",
    aap: "Cough (0-12 Months)",
    lead:
      "Count your baby's breaths for a full minute. The number matters more than the sound of the cough.",
    description:
      "Cough in babies under a year: counting breathing, clearing the nose, and the signs that need same-day care.",
    intro: [
      "Watch your baby's chest for a full minute while they are calm and count the breaths. Then look for ribs or the hollow above the breastbone pulling in, nostrils flaring, or grunting at the end of each breath. Pulling, flaring and grunting all mean call us, whatever the cough sounds like.",
      "Give no cough medicine at all under six, and no honey under a year, because neither is safe at those ages. Call us today for any fever in a baby under three months, for pauses in breathing, for a blue tinge around the lips, or for a baby feeding much less than usual. We can check an oxygen level in the office and watch your baby feed, which tells us more than any description over the phone.",
    ],
  },
  {
    slug: "motion-sickness",
    title: "Motion Sickness in Children",
    short: "Motion sickness",
    group: "Stomach and bowels",
    heading: "Prevention works, and treatment barely does",
    aap: "Motion Sickness",
    lead:
      "Prevention works and treatment barely does, so give the medicine an hour before you set off rather than once your child feels sick.",
    description:
      "Motion sickness in children: preventing it before a journey, seating and food that help, and what to do once it starts.",
    intro: [
      "Give an over-the-counter motion sickness medicine one hour before departure if your child has a history of it, and ask us about dosing for children under two. Seat your child where the motion is least: the middle seat looking forward in a car, over the wing on a plane, midship on a boat.",
      "Motion sickness comes from a mismatch between what the eyes report and what the inner ear feels. Looking down at a screen or a book widens that gap and makes it far worse. Looking at the horizon closes it. The medicine has to go in before the journey for the same reason, because once the mismatch has started nothing catches up with it.",
    ],
  },
  {
    slug: "travellers-diarrhea",
    title: "Diarrhea After Travel",
    short: "Diarrhea after travel",
    group: "Stomach and bowels",
    heading: "Why diarrhea after a trip is investigated differently",
    aap: "Diarrhea Diseases from Travel",
    lead:
      "Tell us where your child traveled and when they got back, because diarrhea after a trip is investigated differently from an ordinary bug.",
    description:
      "Diarrhea after travel in children: rehydration, what to tell us, and which travel-related diarrhea needs testing.",
    intro: [
      "Keep fluids going with oral rehydration solution and let your child eat normally. Then call us with the details: which country, which dates, whether anyone else on the trip is ill, and whether your child swam in fresh water or drank untreated water.",
      "Call us the same day for bloody diarrhea, a fever above 102°F, diarrhea lasting more than a week, or severe stomach pain. Travel diarrhea can need stool testing and specific treatment, which ordinary childhood diarrhea does not.",
    ],
  },
  {
    slug: "urinary-tract-infection",
    title: "Urinary Tract Infections in Children",
    short: "Urinary tract infection",
    group: "Peeing and private parts",
    heading: "Why a urine sample settles this and guessing does not",
    aap: "Urinary Tract Infection - Female",
    lead:
      "A urine sample is the only way to confirm a urinary infection, so call us rather than starting cranberry juice and hoping.",
    description:
      "Urinary tract infections in children: the symptoms at different ages, why a sample matters, and when a UTI becomes urgent.",
    intro: [
      "Call us for a urine test if your child has burning when passing urine, is going far more often, is suddenly wetting again after being dry, or has smelly or cloudy urine. A urinary infection in a baby often shows only as an unexplained fever, poor feeding or vomiting.",
      "Never start a leftover antibiotic while you wait, because it clouds the sample without curing anything, and we then cannot tell what we are treating. Seek care the same day for a fever alongside back or side pain, for vomiting with urinary symptoms, and for any fever in a baby under three months. Each suggests the infection has reached the kidney.",
    ],
  },
  {
    slug: "painful-urination",
    title: "Pain When Passing Urine",
    short: "Pain passing urine",
    group: "Peeing and private parts",
    heading: "Burning inside the bladder, or soreness outside it",
    aap: "Urination Pain - Female",
    lead:
      "Get a urine sample tested rather than guessing, because a urinary infection and simple skin irritation feel identical to a child.",
    description:
      "Pain when passing urine in children: the two common causes, what helps at home, and why a test settles it.",
    intro: [
      "Call us for a urine test. Burning can come from an infection inside the bladder or from irritated skin outside it, and the treatments are completely different. Only a sample tells the two apart.",
      "Meanwhile, have your child sit in a shallow warm bath without soap or bubble bath, drink plenty, and try passing urine while sitting in the bath if it hurts too much otherwise. Stop bubble baths and scented soaps, which cause a good share of these cases in young girls.",
    ],
  },
  {
    slug: "penis-and-scrotum-symptoms",
    title: "Penis and Scrotum Symptoms in Boys",
    short: "Penis and scrotum symptoms",
    group: "Peeing and private parts",
    heading: "The testicle pain that cannot wait for an appointment",
    aap: "Penis-Scrotum Symptoms-Child",
    lead:
      "Sudden pain or swelling in a testicle is an emergency. Go to an emergency room rather than waiting for an appointment.",
    description:
      "Penis and scrotum symptoms in boys: the emergency that cannot wait, the ordinary causes, and what to do at home.",
    intro: [
      "Go to an emergency room immediately for sudden severe pain or swelling in a testicle, particularly with vomiting. A twisted testicle has only a few hours before the damage becomes permanent, and no appointment is quicker than an emergency room.",
      "Call us the same day for redness, swelling or discharge at the tip, pain passing urine, a foreskin that will not go back forward, or a painless swelling in the scrotum. Wash gently with plain water and avoid soap in the meantime.",
    ],
  },
  {
    slug: "vaginal-symptoms",
    title: "Vaginal Symptoms in Girls",
    short: "Vaginal symptoms",
    group: "Peeing and private parts",
    heading: "Why soap causes most of this",
    aap: "Vaginal Symptoms-Child",
    lead:
      "Most itching and soreness in young girls comes from soap, bubble bath and damp clothing rather than from an infection.",
    description:
      "Vaginal itching, soreness and discharge in girls: the common causes, what to change at home, and what needs seeing.",
    intro: [
      "Soap causes most of this. Bubble baths, scented washes and shampoo left sitting in the bath water strip a young girl's skin. The soreness that follows gets mistaken for an infection, and then treated with creams that make it worse. Plain warm water, cotton underwear and nothing at all overnight settle the great majority within a week.",
      "Call us if a week of those changes has not helped, and we will look rather than guess. A thread of tissue or a small object accounts for a fair number of the cases that refuse to settle. Call the same day for discharge with a strong smell, for a sore that will not heal, and for any bleeding in a girl who has not started puberty. Tell us straight away if anything about how a symptom or an injury happened concerns you.",
    ],
  },
  {
    slug: "circumcision-problems",
    title: "Circumcision Questions",
    short: "Circumcision care",
    group: "Peeing and private parts",
    heading: "The yellow film is healing, not infection",
    aap: "Circumcision Problems",
    lead:
      "Apply petroleum jelly at every diaper change for the first week so the healing skin does not stick to the diaper.",
    description:
      "Caring for a newly circumcised baby: what normal healing looks like, the petroleum jelly routine, and when to call us.",
    intro: [
      "A yellow-white film forms over the healing tip within a day or two and alarms almost every parent, who reasonably reads it as pus. The film is granulation tissue, which is what healing looks like on this kind of surface, and it clears on its own over a week or so. Petroleum jelly at every change stops the tip sticking to the diaper while that happens.",
      "Call us for bleeding beyond a few spots, for swelling that increases after the second day, or for no urine passed in twelve hours. Call too for a foul smell, for any fever, or for a ring device still attached after two weeks.",
    ],
  },
  {
    slug: "foreskin-care",
    title: "Foreskin Care in Boys",
    short: "Foreskin care",
    group: "Peeing and private parts",
    heading: "Why forcing a foreskin back causes the problem",
    aap: "Foreskin Care Questions",
    lead:
      "Never force a young boy's foreskin back. The foreskin separates on its own, usually somewhere between three and five years old.",
    description:
      "Foreskin care in uncircumcised boys: why not to retract it, what is normal at each age, and the problems that need us.",
    intro: [
      "Wash the outside with plain water and leave the foreskin alone. Forcing it back tears the skin and causes the scarring that later needs treating. Teach your son to pull the foreskin back, rinse and return it forward once it retracts easily on its own.",
      "Expect white lumps under the skin, which are shed skin cells working their way out and need no treatment. Call us for redness and swelling at the tip, pain passing urine, ballooning of the foreskin when urinating, or a foreskin pulled back that will not go forward. A foreskin stuck back needs seeing straight away.",
    ],
  },
  {
    slug: "taking-a-temperature",
    title: "How to Take a Child's Temperature",
    short: "Taking a temperature",
    group: "Fever and infection",
    heading: "How to take your child's temperature",
    aap: "Fever - How to Take the Temperature",
    lead:
      "Use a rectal thermometer for a baby under three months, because no other method is accurate enough at the age it matters most.",
    description:
      "Taking a child's temperature: which method suits which age, how to do each one properly, and what counts as a fever.",
    intro: [
      "Choose by age. A baby under three months needs a rectal temperature, taken with a digital thermometer, a little petroleum jelly and half an inch of insertion. A rectal reading stays most accurate from three months to four years, though a forehead scanner is reasonable. An oral reading works from four years, provided your child can hold the probe under the tongue with a closed mouth.",
      "Skip ear thermometers under six months and skip forehead strips at any age. Wait thirty minutes after a bath or a hot drink. A fever means 100.4°F or above however you measure it, and add nothing to the reading to correct it. Tell us the number and the method you used.",
    ],
    noTool: true,
  },
  {
    slug: "fever-myths",
    title: "Fever Myths and Facts",
    short: "Fever myths",
    group: "Fever and infection",
    heading: "What to believe about fevers",
    aap: "Fever - Myths Versus Facts",
    lead:
      "Fever itself does not cause brain damage, and treating a fever is about comfort rather than about preventing harm.",
    description:
      "Fever myths in children: what fever does and does not do, why the number matters less than parents expect, and what actually needs attention.",
    intro: [
      "Set aside four common beliefs. Ordinary fevers from infection do not cause brain damage. A high number does not mean a serious illness, because a mild virus can produce 104°F while a serious infection produces very little. Teething does not cause a fever above 100.4°F. And a fever that does not come all the way down with medicine is not a sign of anything sinister.",
      "Treat your child rather than the thermometer. Give fever medicine when your child is uncomfortable, and skip it when they are playing. Call us about how your child looks and behaves, meaning floppy, hard to rouse, refusing fluids or breathing hard, rather than about the reading alone.",
    ],
    noTool: true,
  },
  {
    slug: "emergency-symptoms",
    title: "Emergency Symptoms Not to Miss",
    short: "Emergency symptoms",
    group: "Fever and infection",
    heading: "The symptoms that need help now",
    aap: "Emergency Symptoms Not to Miss",
    lead:
      "Some symptoms mean call 911 rather than call us, and knowing which ones in advance saves the minutes that matter.",
    description:
      "The childhood symptoms that need emergency care: what to call 911 for, what needs an emergency room, and what a nurse call can settle.",
    intro: [
      "Call 911 for a child who is struggling to breathe, turning blue around the lips, unresponsive, or having a seizure that will not stop. Call 911 too for heavy bleeding, and for a rash that does not fade when you press a glass against it. Do not drive a child who cannot breathe.",
      "Go to an emergency room for a serious injury, a possible broken bone through skin, a burn larger than a palm, sudden severe pain, or a head injury with vomiting or confusion. Call our nurse line for everything else at any hour. We would far rather talk it through than have you guess.",
    ],
    noTool: true,
  },
  {
    slug: "antibiotics",
    title: "When Antibiotics Help",
    short: "When antibiotics help",
    group: "Fever and infection",
    heading: "When antibiotics help and when they do not",
    aap: "Antibiotics: When Do They Help?",
    lead:
      "Antibiotics kill bacteria and do nothing at all to viruses, which cause the great majority of childhood illness.",
    description:
      "Antibiotics for children: which illnesses need them, why green mucus is not a reason, and the cost of taking them when they will not help.",
    intro: [
      "Expect no antibiotic for colds, most sore throats, most coughs, flu, croup or bronchiolitis, because viruses cause all of those illnesses. Green or yellow mucus is part of an ordinary cold and does not call for one either. Expect an antibiotic for strep throat confirmed by a swab, most urinary infections, and skin infections such as impetigo or cellulitis.",
      "Finish any course we do prescribe, and never use a leftover prescription or somebody else's. Antibiotics taken when they cannot help still cause diarrhea, rashes and yeast infections, and they make the bacteria your child carries harder to treat next time.",
    ],
    noTool: true,
  },
  {
    slug: "cough-medicine",
    title: "Cough Medicines and Home Remedies",
    short: "Cough medicines",
    group: "Coughs and breathing",
    heading: "What actually helps a cough",
    aap: "Coughs: Meds or Home Remedies?",
    lead:
      "Do not give over-the-counter cough or cold medicine to a child under six. Honey works better and is safer from age one.",
    description:
      "Cough medicines for children: why they are not recommended, what honey and fluids do instead, and when to call us.",
    intro: [
      "Give half a teaspoon to a teaspoon of honey to a child over one, straight or in warm water, especially at bedtime. Trials show honey beats the cough syrups sold for the purpose. Never give honey under a year because of the risk of infant botulism.",
      "Skip over-the-counter cough and cold medicines under six years, since they do not work in young children and cause real side effects. Run a humidifier, keep fluids going, and prop the head of the bed slightly. Call us if the cough comes with fast or labored breathing, wheezing, or a fever lasting more than three days.",
    ],
    noTool: true,
  },
  {
    slug: "wheezing",
    title: "Wheezing in Children",
    short: "Wheezing",
    group: "Coughs and breathing",
    heading: "Telling a wheeze from the other noisy breathing",
    aap: "Wheezing (Other Than Asthma)",
    lead:
      "Wheezing is a whistling sound as your child breathes out, and a first episode in a child without asthma needs to be assessed.",
    description:
      "Wheezing in children without asthma: what it sounds like, the common causes, and when wheezing becomes an emergency.",
    intro: [
      "Listen with your ear near your child's open mouth. Wheezing is a high musical whistle on the way out, and it differs from the harsh noise of croup on the way in, and from the rattle of mucus in the throat. Note whether a cold came first, whether the wheeze started suddenly, and whether your child was eating small objects.",
      "Call 911 for wheezing with severe breathing difficulty, blue lips, or an inability to speak or feed. Go to an emergency room if the wheeze began suddenly with choking, which suggests something inhaled. Call us the same day for a first wheeze in any child, and for any wheeze in a baby.",
    ],
  },
  {
    slug: "breathing-trouble",
    title: "Trouble Breathing in Children",
    short: "Trouble breathing",
    group: "Coughs and breathing",
    heading: "Watch the chest, not the nose or the cough",
    aap: "Breathing Trouble",
    lead:
      "Undress your child's chest and watch it. Skin pulling in between the ribs is the sign that decides how urgent this is.",
    description:
      "Trouble breathing in children: the signs to look for on the chest, counting breaths, and when to call 911.",
    intro: [
      "Lift your child's shirt and watch the chest for a full minute. Look for skin sucking in between the ribs, under them, or at the base of the throat. Look for nostrils flaring with each breath, grunting at the end of one, or a child sitting forward to breathe. Count the breaths as well.",
      "Call 911 for blue or gray lips, a child too breathless to speak, feed or cry, pauses in breathing, or a child becoming drowsy while working hard to breathe. Call us the same day for any of the pulling-in signs without those, and for a baby breathing faster than usual.",
    ],
  },
  {
    slug: "lymph-nodes",
    title: "Swollen Lymph Nodes in Children",
    short: "Swollen glands",
    group: "Fever and infection",
    heading: "Which lumps in the neck are doing their job",
    aap: "Lymph Nodes - Swollen",
    lead:
      "Small movable lumps in the neck after an illness are lymph nodes doing their job, and they stay enlarged for weeks afterward.",
    description:
      "Swollen lymph nodes in children: which are ordinary, how long they last, and the ones we want to examine.",
    intro: [
      "Feel the swollen gland. Nodes that are pea to grape sized, soft, movable and appear during or after an infection are normal, and they shrink slowly over four to six weeks. Do not keep squeezing them, since handling keeps them irritated.",
      "Book an appointment for a node bigger than an inch, a node that keeps growing after two weeks, a node that feels hard and fixed, or any node above the collarbone. Call the same day if the skin over it is red and hot, or if swollen nodes come with night sweats, weight loss or a fever that will not settle.",
    ],
  },
  {
    slug: "strep-exposure",
    title: "Exposure to Strep Throat",
    short: "Strep exposure",
    group: "Fever and infection",
    heading: "Why we do not swab a well child",
    aap: "Strep Throat Exposure",
    lead:
      "Do not test or treat a child who has been exposed to strep but has no symptoms. Wait until they actually feel ill.",
    description:
      "After exposure to strep throat: why we do not test well children, what to watch for, and when to call.",
    intro: [
      "Watch and wait. A well child who was near somebody with strep needs no swab and no antibiotic. Many healthy children carry strep in the throat without being ill, so testing them leads to treatment that helps nobody.",
      "Call us if your child develops a sore throat with fever and no cough, or a headache or stomach ache alongside one. Call about a fine sandpapery rash too. Symptoms usually arrive two to five days after exposure. Wash hands and keep drinking cups separate meanwhile.",
    ],
  },
  {
    slug: "flu-exposure",
    title: "Exposure to Flu",
    short: "Flu exposure",
    group: "Fever and infection",
    heading: "The 48-hour window for preventive treatment",
    aap: "Influenza Exposure",
    lead:
      "Call us within 48 hours of an exposure if your child is high risk, because preventive antiviral treatment only works inside that window.",
    description:
      "After exposure to flu: who needs preventive treatment, the window that matters, and what to watch for.",
    intro: [
      "Call us within two days of the exposure if your child is under two, has asthma, a heart condition, diabetes, or a weakened immune system. Preventive antiviral medicine can help those children, and the window for starting it is short.",
      "Watch everybody else for symptoms rather than treating them. Flu shows up one to four days after exposure and arrives suddenly, with high fever, aching, headache and exhaustion. Get your child vaccinated if they are not already, since it still helps during a season.",
    ],
  },
  {
    slug: "infection-exposure",
    title: "Exposure to an Infection",
    short: "Exposure to infection",
    group: "Fever and infection",
    heading: "Which exposures change what we do",
    aap: "Infection Exposure Questions",
    lead:
      "Tell us what your child was exposed to and when, because the answer depends almost entirely on which infection and how long ago.",
    description:
      "After a child is exposed to an infection: the details we need, which exposures need action quickly, and which need only watching.",
    intro: [
      "Note three things before you call: which illness, when the contact happened, and how close it was. Then check your child's immunization record, because for measles, chickenpox and whooping cough, being up to date changes the advice completely.",
      "Call us the same day for exposure to measles, chickenpox, whooping cough, meningitis or tuberculosis, and for any exposure in a baby under three months or a child with a weakened immune system. Watch for symptoms after most ordinary childhood viruses, rather than acting in advance.",
    ],
    noTool: true,
  },
  {
    slug: "newborn-illness",
    title: "Telling if a Newborn Is Unwell",
    short: "Is my newborn unwell?",
    group: "Babies and newborns",
    heading: "How to tell if your newborn is unwell",
    aap: "Newborn Illness - How to Recognize",
    lead:
      "Newborns show illness through feeding, color and how easily they wake, rather than through the symptoms an older child would give you.",
    description:
      "Recognizing illness in a newborn: the signs that actually matter at this age, why any fever means calling, and what to watch each day.",
    intro: [
      "Watch four things every day: how well your baby feeds, how many wet diapers they produce, what color their skin is, and how easily they rouse. A newborn who is feeding well, wetting six or more diapers and waking for feeds is almost always well, whatever else you notice.",
      "Call us straight away for any temperature of 100.4°F or above. Call us too for a baby who will not feed or has to be woken for every feed, for grunting or fast breathing, or for yellow skin deepening after the first week. Call about fewer than six wet diapers a day, and about a baby who has simply gone quiet and floppy. Give no fever medicine before that visit, for the same reason. We would far rather check a newborn than wait.",
    ],
  },
  {
    slug: "newborn-appearance",
    title: "Newborn Appearance Questions",
    short: "How newborns look",
    group: "Babies and newborns",
    heading: "What is normal in how a newborn looks",
    aap: "Newborn Appearance Questions",
    lead:
      "Swollen genitals, a cone-shaped head, crossed eyes and peeling skin all look alarming on a new baby, and all of them are normal and pass within weeks.",
    description:
      "Newborn appearance: the odd-looking things that are normal, how long each lasts, and the few worth asking about.",
    intro: [
      "Expect a head molded into a cone by the birth, puffy eyelids, and swollen breasts and genitals from your hormones. Expect peeling skin in the first week, and eyes that wander or cross in the early months. All of those features settle on their own and need nothing done.",
      "Ask us about anything that is not settling. Eyes still crossing after four months, or a head shape growing more uneven rather than less, both want checking. So does a soft spot that looks sunken, or one that bulges while your baby is calm and upright. Tell us as well if one arm or leg consistently moves less than the other.",
    ],
  },
  {
    slug: "newborn-reflexes",
    title: "Newborn Reflexes and Behavior",
    short: "Newborn reflexes",
    group: "Babies and newborns",
    heading: "What newborn reflexes and behavior mean",
    aap: "Newborn Reflexes and Behavior",
    lead:
      "Startling, hiccupping, sneezing, jerky movements and noisy sleep are all normal newborn behavior rather than signs of a problem.",
    description:
      "Newborn reflexes and behavior: what is normal in the early weeks, what each reflex is for, and the movements that need checking.",
    intro: [
      "Expect your baby to fling both arms out when startled, root toward anything touching the cheek, grip your finger hard, hiccup daily, sneeze often, and make a great deal of noise while asleep. Jerky, twitchy movements while drifting off are ordinary too.",
      "Call us about movements that look different from the ones above. Rhythmic jerking that carries on when you hold the limb still, or stiffening with staring, both want checking today. So does a baby who has turned floppy or unusually stiff, or one arm or leg that consistently moves less than the other.",
    ],
  },
  {
    slug: "newborn-rashes",
    title: "Newborn Rashes and Birthmarks",
    short: "Newborn rashes",
    group: "Babies and newborns",
    heading: "Which newborn rashes need nothing at all",
    aap: "Newborn Rashes and Birthmarks",
    lead:
      "Blotchy spots, tiny white bumps and baby acne cover almost every rash of the first weeks, and all of them clear without treatment and need nothing on them.",
    description:
      "Newborn rashes and birthmarks: which are normal and self-clearing, what to leave alone, and the ones that need checking.",
    intro: [
      "Leave the common newborn rashes alone. Blotchy red patches with a small pale center, tiny white bumps across the nose, and baby acne at three to six weeks all clear by themselves. Wash with plain water and skip creams, oils and lotions, which usually make baby acne worse.",
      "Call us about a rash with blisters or pus, and about any rash in a baby who also has a fever. Call straight away about spots that do not fade when you press a glass against them. Ask us as well about a birthmark that is growing quickly, or any birthmark near the eye, nose or mouth.",
    ],
  },
  {
    slug: "umbilical-cord",
    title: "Umbilical Cord Care",
    short: "Umbilical cord",
    group: "Babies and newborns",
    heading: "Air separates a cord faster than cleaning",
    aap: "Umbilical Cord Symptoms",
    lead:
      "Keep the cord stump dry and open to the air, and fold the diaper down below it. That is the whole of the care.",
    description:
      "Umbilical cord care in newborns: keeping the stump dry, what normal separation looks like, and the signs of infection.",
    intro: [
      "Air does the work, so the whole job is leaving the stump alone and uncovered. Folding the diaper down below it, and skipping the bath until it drops off, separates a cord faster than cleaning ever did. The alcohol swabs your parents used are no longer advised for that reason. A stump that turns black, smells faintly and leaves a few drops of blood behind is doing all of that normally.",
      "Call us the same day for redness spreading onto the belly, for pus, or for a genuinely foul smell. Call for any fever at this age too. An infection at the cord moves quickly in a newborn. Call too if the stump is still attached after three weeks. A moist red lump left behind afterwards is usually a granuloma, and we can treat one in the office in a couple of minutes.",
    ],
  },
  {
    slug: "breath-holding",
    title: "Breath-Holding Spells",
    short: "Breath-holding spells",
    group: "Babies and newborns",
    heading: "A breath-holding spell is not a seizure",
    aap: "Breath-holding Spell",
    lead:
      "Lay your child on their side and wait. A breath-holding spell frightens the parent far more than it harms the child.",
    description:
      "Breath-holding spells in toddlers: what happens, what to do during one, and why they are not tantrums or seizures.",
    intro: [
      "Lay your child flat on their side, clear the area around them, and stay calm. Breathing restarts on its own within a minute. Do not shake your child, splash water, or put anything in their mouth. A brief stiffening or twitching at the end of a spell is common and does not mean epilepsy.",
      "Understand what triggers them: pain, fright, frustration or anger. A child cannot do this on purpose, so punishing a spell achieves nothing. Book an appointment after a first spell so we can check for iron deficiency, which is common in these children and treatable. Call 911 if breathing does not restart within a minute.",
    ],
  },
  {
    slug: "crying-older-baby",
    title: "A Crying Child Over 3 Months",
    short: "Crying after 3 months",
    group: "Babies and newborns",
    heading: "Undress the baby and look everywhere",
    aap: "Crying Child - 3 Months and Older",
    lead:
      "Colic ends by three or four months, so persistent inconsolable crying in an older baby has a cause worth finding.",
    description:
      "Inconsolable crying in a baby over three months: the causes to check at home, and why this age needs looking at rather than waiting out.",
    intro: [
      "Undress your baby completely and check them over. Look for a hair wrapped tightly around a finger, toe or penis, a scratched cornea, an ear that hurts when touched, a swelling in the groin, and any sore or bruise. Check the temperature and think about teething, constipation and a recent vaccine.",
      "Call us if you cannot find a cause and your baby will not settle, because we treat unexplained inconsolable crying at this age as a symptom rather than a phase. Call the same day if crying comes with a fever, vomiting, a swollen belly, or a baby who is limp between bouts.",
    ],
  },
  {
    slug: "breastfeeding",
    title: "Breastfeeding Questions",
    short: "Breastfeeding",
    group: "Feeding and growth",
    heading: "Diapers and the scale answer the real question",
    aap: "Breast-Feeding Questions",
    lead:
      "Judge feeding by diapers and weight rather than by minutes at the breast or by how full you feel.",
    description:
      "Breastfeeding questions: knowing your baby is getting enough, fixing a painful latch, and the lactation support we offer.",
    intro: [
      "Diapers and the scale answer the question that worries most parents, which is whether the baby is getting enough. Minutes at the breast do not, and neither does whether your breasts feel full, because both change as your supply settles. Six or more wet diapers a day from day five, and birth weight regained by two weeks, mean feeding is working.",
      "Ask for our lactation consultants at any visit, and ask early rather than once you are ready to give up. They work alongside your child's provider in the same offices, they can watch a whole feed, and they fix most latch problems in one appointment. Call the same day for a hard red painful area with a fever, which is mastitis and needs treating rather than waiting out.",
    ],
  },
  {
    slug: "bottle-feeding",
    title: "Bottle Feeding and Formula",
    short: "Bottle feeding",
    group: "Feeding and growth",
    heading: "Why the formula measurements are not approximate",
    aap: "Bottle-Feeding (Formula) Questions",
    lead:
      "Mix formula exactly to the instructions, because adding extra water or extra powder is genuinely dangerous to a baby.",
    description:
      "Bottle feeding and formula: mixing safely, how much a baby needs, paced feeding, and when to call us.",
    intro: [
      "Formula is a medicine as much as a food, and the ratio on the tin is not a suggestion. Watering it down to make it last dilutes the sodium in a baby's blood and can cause seizures. Making it stronger loads kidneys that cannot yet concentrate urine. Add the water first and then the powder, every time, because doing it the other way changes the ratio.",
      "Feed on your baby's cues rather than to a schedule, holding the bottle horizontally and pausing often so your baby controls the pace. Call us before switching formulas, since most parents switch for symptoms that formula will not fix. Call too for forceful vomiting, blood in the stool, or poor weight gain.",
    ],
  },
  {
    slug: "solid-foods",
    title: "Starting Solid Foods",
    short: "Starting solids",
    group: "Feeding and growth",
    heading: "Why peanut and egg go in early now",
    aap: "Solid Foods (Baby Foods)",
    lead:
      "Start solids around six months, and introduce peanut and egg early rather than delaying them, because waiting raises the risk of allergy.",
    description:
      "Starting solid foods: when to begin, introducing allergens early, choking risks to avoid, and how much milk still matters.",
    intro: [
      "Look for the signs rather than the date: sitting with support, good head control, and interest in your food, usually around six months. Offer iron-rich foods first, introduce one new food every few days, and include smooth peanut butter and well-cooked egg early. Current advice is that delaying those foods increases allergy risk rather than reducing it.",
      "Keep breast milk or formula as the main nutrition through the first year, and give no honey, no cow's milk as a drink, and no whole nuts, grapes, popcorn or raw carrot. Call us if your baby gags constantly, refuses all textures, or develops hives, vomiting or swelling after a new food.",
    ],
  },
  {
    slug: "food-allergy",
    title: "Food Allergies in Children",
    short: "Food allergy",
    group: "Feeding and growth",
    heading: "Timing separates allergy from intolerance",
    aap: "Food Allergy",
    lead:
      "Hives, vomiting or swelling within minutes of a food is an allergy. A stomach ache hours later usually is not.",
    description:
      "Food allergies in children: what a real reaction looks like, when to use epinephrine, and how allergy is properly diagnosed.",
    intro: [
      "Note the timing. A genuine allergic reaction begins within minutes to two hours and produces hives, swelling, vomiting, coughing or wheezing. Bloating, loose stool or discomfort many hours later points to intolerance rather than allergy, and the two are investigated quite differently.",
      "Use epinephrine first and call 911 for any trouble breathing, swelling of the lips or tongue, repeated vomiting or collapse after a food. Antihistamines do not treat anaphylaxis. Book an appointment before cutting foods out, because unnecessary elimination causes its own problems and makes proper testing harder.",
    ],
  },
  {
    slug: "medicine-refusal",
    title: "A Child Who Refuses Medicine",
    short: "Refusing medicine",
    group: "Feeding and growth",
    heading: "Where the syringe points decides this",
    aap: "Medicine - Refusal to Take",
    lead:
      "Use a syringe against the inside of the cheek rather than a spoon, and give it in small squirts your child can swallow between.",
    description:
      "Getting medicine into a child: the syringe technique that works, what you can mix it with, and what to do about a dose brought back up.",
    intro: [
      "Where the syringe points decides whether this works. Aimed at the back of the throat, a syringe triggers a gag and the medicine comes straight back. Tucked between the cheek and the gum, it goes down almost every time. Give it in small squirts so your child can swallow between them, and blunt the taste with something cold beforehand.",
      "Ask us before you hide a medicine in food or drink. Milk and juice stop some antibiotics working altogether, and a bottle your child abandons halfway takes half the dose with it. Ask us about flavoring as well, since most pharmacies can add one to a liquid antibiotic. Call us if your child vomits within fifteen minutes of a dose, because whether to give it again depends on the medicine.",
    ],
  },
  {
    slug: "swallowed-object",
    title: "A Swallowed Object",
    short: "Swallowed object",
    group: "Feeding and growth",
    heading: "Batteries and magnets, and everything else",
    aap: "Swallowed Foreign Object",
    lead:
      "A swallowed button battery or magnet is an emergency. Go straight to an emergency room rather than waiting to see.",
    description:
      "When a child swallows something: which objects are emergencies, which pass on their own, and what to watch for.",
    intro: [
      "Two things turn a swallowed object into an emergency, and neither looks urgent from outside. A button battery burns through the wall of the esophagus within hours of lodging there, and two or more magnets pinch a loop of bowel between them and cut off its blood supply. Both need an emergency room now, not a phone call first.",
      "Call us about anything else your child swallows and we will tell you whether it needs an X-ray or only watching. A small smooth object such as a coin usually passes within a few days and shows up in a diaper. Seek care immediately for drooling, refusing food or drink, pain in the chest or throat, vomiting, or any difficulty breathing, all of which suggest the object has lodged rather than passed.",
    ],
  },
  {
    slug: "swallowed-substance",
    title: "A Swallowed Household Substance",
    short: "Swallowed a substance",
    group: "Feeding and growth",
    heading: "Call Poison Control before you call us",
    aap: "Swallowed Harmless Substance",
    lead:
      "Call Poison Control on 1-800-222-1222 before you do anything else, and never make your child vomit.",
    description:
      "When a child swallows a household substance: calling Poison Control first, what never to do, and which substances need an emergency room.",
    intro: [
      "Call Poison Control at 1-800-222-1222 straight away, with the container in your hand. Poison Control answers around the clock, charges nothing, and will tell you within a minute whether your child needs watching at home or a trip to the hospital. Never induce vomiting and never give syrup of ipecac.",
      "Go to an emergency room now, calling on the way, if your child swallowed a drain cleaner, oven cleaner or other caustic substance, anything containing petrol or lamp oil, or an adult medicine. Go as well for any child who is drowsy, vomiting, having a seizure or struggling to breathe.",
    ],
  },
  {
    slug: "depression",
    title: "Depression in Children and Teens",
    short: "Depression",
    group: "Feelings and mental health",
    heading: "Asking about self-harm does not plant the idea",
    aap: "Depression",
    lead:
      "Ask your child directly whether they have thought about hurting themselves. Asking does not plant the idea, and it is the question that opens the conversation.",
    description:
      "Depression in children and teenagers: what it looks like at different ages, how to start the conversation, and how to reach help now.",
    intro: [
      "Ask about self-harm plainly and without flinching. Parents worry that raising it plants the idea. Research is clear that it does not, and most young people are relieved somebody noticed. Stay with your child if they say yes, remove medicines and firearms from the house, and call the 988 Suicide and Crisis Lifeline by phone or text.",
      "Look for depression in what has changed rather than in sadness alone. Withdrawal from friends, irritability, sleeping far more or far less, dropping grades, losing interest in things they used to love, and unexplained aches all count at this age. Book an appointment with us. Our behavioral health team works alongside your child's pediatrician, so the first conversation can start here.",
    ],
  },
  {
    slug: "suicide-concerns",
    title: "Suicide Concerns",
    short: "Suicide concerns",
    group: "Feelings and mental health",
    heading: "Getting help tonight, and making the house safer",
    aap: "Suicide Concerns",
    lead: "Call 911 now if your child attempted suicide in the past 24 hours, or is acting or talking confused. If you are worried your child may be suicidal and there has been no attempt, call or text 988. The Suicide and Crisis Lifeline answers 24 hours a day.",
    description: "If you are worried your child may be suicidal: 988, when to call 911 or go to an emergency room, making the home safer, and what to say.",
    intro: [
      "Go to an emergency room if your child attempted suicide in the past week, has threatened suicide, or has a plan such as drugs or a weapon. Go as well if you suspect drug or alcohol use and your child has symptoms now, or if your child has needed a psychiatric hospital before for symptoms like these. Do not leave your child alone. If your child is an established patient at Wasatch Pediatrics, call us too and we will talk with you about what comes next. 988, 911 and the emergency room are open to every family, whether or not your child is our patient. Then go through the house. Best of all, move any firearms out of the house to a relative or a friend for now. If a firearm stays, unload it and lock it away. Firearms cause most suicide deaths in North America. Lock up medicines and alcohol too, and for an older teen, consider holding on to the car keys.",
      "Ask your child directly whether they are thinking of killing themselves. Plain words are safer than careful ones, and asking the question does not put the idea in your child's head. Listen without arguing. Do not promise to keep what your child tells you secret, and say that you are getting help because you love them. Thoughts of suicide, talk of having no reason to live, and themes of death in what your child draws or writes all need attention now. Call or text 988 at any hour.",
    ],
  },
  {
    slug: "anxiety-attack",
    title: "Anxiety Attacks in Children",
    short: "Anxiety attacks",
    group: "Feelings and mental health",
    heading: "Lengthen the out-breath, not the in-breath",
    aap: "Anxiety Attack",
    lead:
      "Slow your child's breathing out rather than in, because a long exhale is what switches the body's alarm off.",
    description:
      "Anxiety attacks in children: what to do in the moment, why breathing out matters, and getting help between episodes.",
    intro: [
      "Sit with your child and breathe out slowly and audibly, asking them to match you, in for four and out for six or eight. Lengthening the out-breath calms the nervous system, while telling a child to take deep breaths in often makes things worse. Name what is happening: this is anxiety, it is horrible, and it will pass.",
      "Book an appointment once the episode is over. Anxiety in children responds well to treatment, and doing nothing between attacks usually means more of them. Go to an emergency room instead if this is a first episode with chest pain, fainting or a racing heart that will not settle, so the heart can be checked.",
    ],
  },
  {
    slug: "panic-attack",
    title: "Panic Attacks in Children",
    short: "Panic attacks",
    group: "Feelings and mental health",
    heading: "A panic attack peaks and passes",
    aap: "Panic Attack",
    lead:
      "A panic attack peaks within about ten minutes and cannot harm your child, however convincingly it feels otherwise.",
    description:
      "Panic attacks in children and teens: what to do while one is happening, why it feels so physical, and what helps prevent the next.",
    intro: [
      "Stay calm, keep your voice low, and ride the attack out with your child. Slow the out-breath, get them to name five things they can see and four they can hear, and remind them that this peaks in about ten minutes and then fades. Do not have them breathe into a paper bag.",
      "Book an appointment afterward. Panic attacks respond well to treatment, and left alone they tend to spread, because children start avoiding places where an attack happened. Go to an emergency room for a first attack with chest pain, fainting or an irregular heartbeat, so we can rule out a physical cause.",
    ],
  },
  {
    slug: "mental-health-problems",
    title: "Mental Health Concerns in Children",
    short: "Mental health concerns",
    group: "Feelings and mental health",
    heading: "Start here rather than searching for a specialist",
    aap: "Mental Health Problems",
    lead:
      "Start with your pediatrician rather than searching for a specialist, because mental health care is part of what we do here.",
    description:
      "Mental health concerns in children: what to notice, how to raise it, and the behavioral health team inside the practice.",
    intro: [
      "Book an appointment and say plainly what you are worried about when you call, so we can allow enough time. Bring specifics rather than impressions: what changed, when it started, how it shows at home and at school, and what you have already tried.",
      "Expect the conversation to continue with people in this practice. Our behavioral health team of therapists, psychiatric providers and psychologists who do testing works alongside your child's pediatrician, so a referral stays inside the same records. Call 988 or go to an emergency room at any hour if your child is at immediate risk.",
    ],
  },
  {
    slug: "behavioral-health-problems",
    title: "Behavior Concerns in Children",
    short: "Behavior concerns",
    group: "Feelings and mental health",
    heading: "A week of notes beats any description",
    aap: "Behavioral Health Problems",
    lead:
      "Write down what happens immediately before and after the behavior for a week. That record tells us more than any description.",
    description:
      "Behavior concerns in children: keeping a useful record, what to bring to the appointment, and how we assess it.",
    intro: [
      "Keep a simple log for a week: what happened just before, what your child did, how long it lasted, and what happened afterward. Patterns show up in that record that nobody notices in the moment, and it turns a difficult conversation into a specific one.",
      "Bring school reports and any teacher comments with you. Behavior that appears at home and school both points somewhere different from behavior confined to one. Book a longer appointment when you call, and tell us if sleep, screens, a new sibling, a move or a loss have changed recently.",
    ],
  },
  {
    slug: "menstrual-cramps",
    title: "Menstrual Cramps",
    short: "Period cramps",
    group: "Growing up",
    heading: "Why ibuprofen has to go in early",
    aap: "Menstrual Cramps",
    lead:
      "Start ibuprofen the day before a period is due, or at the very first cramp. Taken early, ibuprofen prevents pain rather than chasing it.",
    description:
      "Period cramps in teenagers: the timing that makes ibuprofen work, what else helps, and cramps that need investigating.",
    intro: [
      "Give ibuprofen with food at the start of the period, or the day before if her cycle is predictable. Carry on at regular intervals through the first two days rather than waiting for the pain to build. Ibuprofen blocks the chemical that causes cramping, so it works far better before that chemical is released. Add a heat pack and gentle exercise.",
      "Book an appointment if cramps keep her home from school, if ibuprofen taken properly does not control them, if pain begins days before bleeding, or if periods have become steadily more painful over time. Cramps that severe, or that early, can point to something treatable rather than to bad luck.",
    ],
  },
  {
    slug: "missed-period",
    title: "A Missed or Late Period",
    short: "Missed period",
    group: "Growing up",
    heading: "What counts as irregular in the first years",
    aap: "Menstrual Period - Missed or Late",
    lead:
      "Irregular periods are normal for the first two years after they start, and a pregnancy test is still worth doing whenever pregnancy is possible.",
    description:
      "Missed and late periods in teenagers: what is normal early on, when to test, and the causes worth investigating.",
    intro: [
      "Expect irregularity in the first couple of years. Cycles anywhere from 21 to 45 days, and the occasional skipped month, are both normal while a cycle settles. Do a home pregnancy test if pregnancy is possible at all, because that answer changes everything that follows.",
      "Book an appointment for no period at all by age fifteen, or for three missed months after periods had been regular. Book one too for cycles consistently longer than 45 days. Tell us if missed periods arrive alongside significant weight change, heavy exercise, or acne with unwanted hair growth.",
    ],
  },
  {
    slug: "vaginal-bleeding",
    title: "Unexpected Vaginal Bleeding",
    short: "Unexpected bleeding",
    group: "Growing up",
    heading: "Bleeding before puberty always needs examining",
    aap: "Vaginal Bleeding",
    lead:
      "Any vaginal bleeding before puberty needs to be seen, and so does bleeding heavy enough to soak a pad every hour.",
    description:
      "Unexpected vaginal bleeding in girls: what needs seeing straight away, tracking heavy periods, and what we look for.",
    intro: [
      "Call us the same day for any bleeding in a girl who has not started puberty. Bleeding before puberty always needs examining, whatever the likely explanation seems to be.",
      "Track a teenager's bleeding. Count pads or tampons a day, note whether any are soaked through in under an hour, whether clots run larger than a quarter, and how many days the bleeding has lasted. Seek care immediately for soaking a pad hourly for several hours, dizziness or fainting, or bleeding with severe pain, and call us for periods lasting beyond seven days.",
    ],
  },
  {
    slug: "breast-symptoms",
    title: "Breast Symptoms in Children and Teens",
    short: "Breast symptoms",
    group: "Growing up",
    heading: "What is ordinary in a developing chest",
    aap: "Breast Symptoms-Teen",
    lead:
      "Uneven breast development and tenderness during puberty are normal in girls, and temporary breast tissue in boys is normal too.",
    description:
      "Breast changes in children and teenagers: what puberty normally produces, what boys can expect, and the changes we want to see.",
    intro: [
      "Expect asymmetry, tenderness and lumps that come and go with the cycle in a developing girl. One side commonly starts months before the other and evens out over a couple of years. A tender disc of tissue under the nipple is common in boys in early puberty, and usually settles within a year or two.",
      "Book an appointment for a hard fixed lump, any discharge from the nipple, redness and pain with a fever, breast development before age eight, or no development by age thirteen. Call us for a boy whose breast tissue is enlarging beyond early puberty or causing him distress.",
    ],
  },
  {
    slug: "sti-exposure",
    title: "Possible STI Exposure",
    short: "STI exposure",
    group: "Growing up",
    heading: "Why the timing of this call matters",
    aap: "STI Exposure",
    lead:
      "Book a confidential appointment quickly, because some exposures have treatment that only works within days.",
    description:
      "After possible sexually transmitted infection exposure: how quickly to be seen, what confidentiality means for teens, and what testing involves.",
    intro: [
      "Call us and ask for an appointment as soon as possible. Timing matters: emergency contraception, HIV prevention medicine and treatment after an assault all have windows measured in hours or days rather than weeks. Say on the phone that it is time-sensitive.",
      "Know that teenagers can discuss sexual health confidentially with us, and we will explain exactly what that covers at the visit. Testing is usually a urine sample or a swab rather than anything invasive. Go to an emergency room now for an assault, severe pain, or fever with pelvic pain.",
    ],
  },
  {
    slug: "sexually-transmitted-infections",
    title: "Sexually Transmitted Infections in Teens",
    short: "STIs",
    group: "Growing up",
    heading: "Why we test before symptoms appear",
    aap: "Sexually Transmitted Infections",
    lead:
      "Most sexually transmitted infections cause no symptoms at all, so testing is the only way a teenager finds out.",
    description:
      "Sexually transmitted infections in teenagers: why symptoms are unreliable, what testing involves, and confidential care here.",
    intro: [
      "Book a test rather than waiting for symptoms, because chlamydia in particular usually causes none and is the commonest one we find. Testing is straightforward, needing only a urine sample or a self-collected swab, and treatment for most is a single course of antibiotics.",
      "Call us the same day for pelvic or testicular pain, unusual discharge, sores, pain passing urine, or fever with pelvic pain. Teenagers can talk to us confidentially about sexual health, and we will be clear at the start of the visit about what that means.",
    ],
  },
  {
    slug: "acne",
    title: "Acne in Children and Teens",
    short: "Acne",
    group: "Growing up",
    heading: "Treat the area, not the spots",
    aap: "Acne",
    lead:
      "Treat the whole area rather than individual spots, and give any treatment eight to twelve weeks before deciding it has failed.",
    description:
      "Acne in teenagers: what actually works, how long it takes, the myths to ignore, and when to come in.",
    intro: [
      "Acne treatment prevents the next breakout rather than shrinking today's, which is why dabbing it on visible spots achieves so little. The blocked pores that become next week's spots are already forming in skin that looks clear now, so the whole area gets treated. Expect two weeks of dryness while the skin adjusts, and expect eight to twelve weeks before judging whether the treatment works.",
      "Ignore the food myths. Chocolate and greasy food do not cause acne, though skim milk and high-sugar diets show a weak link. Book an appointment for deep painful lumps, scarring, acne that has not improved after three months of consistent treatment, or acne that is affecting your teenager's mood.",
    ],
  },
  {
    slug: "arm-pain",
    title: "Arm Pain Without an Injury",
    short: "Arm pain",
    group: "Knocks, pain and injuries",
    heading: "Arm pain with no injury behind it",
    aap: "Arm Pain",
    lead:
      "Arm pain with no injury behind it is usually overuse or a virus, but pain that wakes your child at night needs looking at.",
    description:
      "Arm pain in children without an injury: the usual causes, what helps, and the patterns that need investigating.",
    intro: [
      "Ask what your child has been doing. A new sport, hours on a keyboard or a controller, or a growth spurt explain most arm pain, and rest, ibuprofen and a few days off the activity settle it. Aching in both arms during a viral illness is common and passes with the illness.",
      "Book an appointment for pain that wakes your child from sleep, pain in one arm lasting more than a week, swelling or warmth over a joint, or arm pain with fever or weight loss. Seek care immediately for a limb your child will not move at all, or a limb that is numb, pale or cold.",
    ],
  },
  {
    slug: "leg-pain",
    title: "Leg Pain Without an Injury",
    short: "Leg pain",
    group: "Knocks, pain and injuries",
    heading: "The growing-pains pattern, and what breaks it",
    aap: "Leg Pain",
    lead:
      "Growing pains happen in both legs, in the evening, and never make a child limp. Leg pain that behaves differently deserves a look.",
    description:
      "Leg pain in children without an injury: recognizing growing pains, what helps, and the pain that needs assessing.",
    intro: [
      "Check three things against the growing-pains pattern: both legs rather than one, evenings or night rather than mornings, and a child who runs normally the next day. Massage, a warm bath and ibuprofen at bedtime settle those, and they cause no lasting harm.",
      "Book an appointment for pain in one leg only, a limp, a swollen or warm joint, pain that is worse in the morning, or pain with fever, weight loss or night sweats. Seek care the same day for a child who refuses to bear weight, or leg pain with a fever.",
    ],
  },
  {
    slug: "ear-infections",
    title: "Ear Infection Questions",
    short: "Ear infections",
    group: "Ears, nose, mouth and teeth",
    heading: "What to know about ear infections",
    aap: "Ear Infection Questions",
    lead:
      "Many ear infections clear without antibiotics, so we often treat the pain first and reassess in a day or two.",
    description:
      "Ear infections in children: why antibiotics are not automatic, how long fluid lasts afterward, and when tubes get discussed.",
    intro: [
      "Expect a conversation rather than an automatic prescription. Watching for 48 hours with good pain relief works as well as antibiotics for a child over two with a mild infection in one ear, and avoids the side effects. Babies, severe pain, both ears, and a perforated eardrum usually get treated straight away.",
      "Expect fluid to stay behind the eardrum for up to three months after the infection clears, muffling hearing without causing pain. Call us if your child has three infections in six months, four in a year, or hearing and speech concerns. Those thresholds are where we start discussing ear tubes.",
    ],
  },
  {
    slug: "ear-piercing",
    title: "Ear Piercing Problems",
    short: "Ear piercing",
    group: "Ears, nose, mouth and teeth",
    heading: "Why the earring stays in when it gets sore",
    aap: "Ear Piercing Symptoms",
    lead:
      "Clean a new piercing with saline twice a day and leave the earring in, because taking it out traps infection inside a closing hole.",
    description:
      "Sore and infected ear piercings: cleaning routine, keeping the earring in, and the signs that need antibiotics.",
    intro: [
      "Wash your hands, then clean front and back with saline twice a day and turn the earring gently. Keep the earring in even if the site is sore, because removing it lets the channel close over an infection. Use hypoallergenic posts and skip alcohol and hydrogen peroxide, which irritate healing skin.",
      "Call us for spreading redness, pus, increasing pain, a fever, or an earring back that has become embedded in the lobe. An embedded back needs removing here rather than at home. Seek care the same day for infection in a cartilage piercing at the top of the ear, which is more serious than a lobe infection.",
    ],
  },
  {
    slug: "hay-fever",
    title: "Hay Fever in Children",
    short: "Hay fever",
    group: "Fever and infection",
    heading: "Why hay fever medicine goes in before the season",
    aap: "Hay Fever",
    lead:
      "Start allergy medicine two weeks before your child's usual season rather than waiting for the sneezing.",
    description:
      "Hay fever in children: starting treatment early, which medicines work, and reducing pollen at home.",
    intro: [
      "Begin a daily non-drowsy antihistamine, or the steroid nasal spray we recommend, about two weeks before the season your child reacts to. Both work far better as prevention than as rescue. Use a saline rinse to wash pollen out, and teach your child to aim a nasal spray away from the septum.",
      "Cut the exposure where you can: shut bedroom windows on high-pollen days, wash hair before bed, and change clothes after long spells outside. Book an appointment if symptoms persist despite daily treatment, if your child is missing school, or if hay fever is setting off asthma.",
    ],
  },
  {
    slug: "athletes-foot",
    title: "Athlete's Foot",
    short: "Athlete's foot",
    group: "Skin and rashes",
    heading: "Why athlete's foot keeps coming back",
    aap: "Athlete's Foot",
    lead:
      "Keep the feet dry and keep applying antifungal cream for two weeks after the skin looks normal.",
    description:
      "Athlete's foot in children: the cream and the routine that clear it, why it comes back, and when to come in.",
    intro: [
      "The fungus lives in warm damp skin, so it returns to whatever stays warm and damp. Shoes worn two days running never dry out, and socks pulled onto feet that were dried in a hurry keep the space between the toes wet all day. Treating the skin without changing those two things clears athlete's foot for two weeks at most.",
      "Call us if the skin cracks and weeps, if the foot becomes red, swollen and painful, or if two weeks of consistent treatment has changed nothing. Bring in a child with diabetes rather than treating the foot at home.",
    ],
  },
  {
    slug: "jock-itch",
    title: "Jock Itch",
    short: "Jock itch",
    group: "Skin and rashes",
    heading: "Jock itch usually travels up from the feet",
    aap: "Jock Itch",
    lead:
      "Treat the feet at the same time as the groin, because jock itch usually travels up from athlete's foot on a towel or a pair of shorts.",
    description:
      "Jock itch in children and teens: treating it and its source, keeping the area dry, and what needs seeing.",
    intro: [
      "Apply an antifungal cream twice a day for two weeks past clearing, and check the feet at the same time, since the same fungus usually lives there. Put socks on before underwear so the fungus does not travel, wash athletic clothing after every use, and dry the groin thoroughly.",
      "Call us if the rash weeps or blisters, if it spreads onto the scrotum or penis, or if two weeks of treatment has changed nothing. A rash that does not respond to antifungal cream is usually something other than jock itch.",
    ],
  },
  {
    slug: "ingrown-toenail",
    title: "Ingrown Toenails",
    short: "Ingrown toenail",
    group: "Knocks, pain and injuries",
    heading: "Why the nail is cut straight across",
    aap: "Toenail - Ingrown",
    lead:
      "Soak the foot in warm salt water and cut toenails straight across, never curved down at the corners.",
    description:
      "Ingrown toenails in children: soaking, correct nail cutting, roomier shoes, and when a nail needs a small procedure.",
    intro: [
      "A toenail curved down at the corners digs into the skin beside it as it grows forward, and the instinct to trim that painful corner shorter makes the next growth dig in deeper still. Cutting straight across, level with the end of the toe, is what breaks the cycle. Tight shoes press the skin onto the nail and do the rest.",
      "Call us for pus, spreading redness, a fever, or a toe that is too painful to walk on. An ingrown nail that keeps coming back usually needs a small procedure to remove the edge permanently, which a doctor does under local anesthetic in a single visit.",
    ],
  },
];

export const symptomBySlug = new Map(symptoms.map((s) => [s.slug, s]));
