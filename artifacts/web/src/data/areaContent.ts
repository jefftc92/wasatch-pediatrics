/**
 * What a well child checkup looks like from each city we serve.
 *
 * These pages exist because the decision a parent is actually making is not
 * "should my child have a checkup" — it is "which office, and how long is that
 * going to take me on a Tuesday morning". That question has a different answer
 * in Herriman than it does in Bountiful, and a page that gives the same answer
 * everywhere is not worth publishing.
 *
 * So every entry here is written from scratch. None of it is a template with a
 * city name substituted in, and none of the six sections on one page repeats a
 * section on another. Where two cities genuinely share a fact — both are
 * nearest to Southpoint, say — they say it about their own geography, their own
 * schools and their own drive, because that is what a reader from that city
 * came to find out.
 *
 * The section order matches the service page: what, who, why, when, how, where.
 * The renderer builds the headings and names the city in them; each section
 * here opens by answering the question its heading asks, so a reader skimming
 * or landing mid-page is never reading a continuation of something above.
 *
 * `where` is the section these pages are really for. It ends every page and it
 * is the only one allowed to talk about offices at length: which two are
 * closest, what the drive is actually like, and — where the choice is genuinely
 * close — how to pick. Drive times come from `serviceAreas.ts` and are
 * estimates; see the note at the top of that file.
 */

export type AreaCopy = {
  /** Meta description for this city's page. */
  description: string;
  /** The hero line, under the title. */
  lead: string;
  what: string[];
  who: string[];
  why: string[];
  when: string[];
  how: string[];
  where: string[];
};

/** Keyed by service slug, then by service-area slug. */
export const areaContent: Record<string, Record<string, AreaCopy>> = {
  "well-child": {
    /* --------------------------------------------- Salt Lake County -- */
    murray: {
      description:
        "Well child checkups in Murray, Utah. Our Cottonwood office is on 5400 South, about five minutes from Murray Park — newborn visits through age 21, with the Salt Lake office as a second option.",
      lead: "Murray is where our Cottonwood office has stood for years, on 5400 South a few blocks off State Street.",
      what: [
        "What a checkup covers for a Murray family is everything we would rather find early: growth measured against your child's own history, a head-to-toe exam, vision and hearing, developmental and mental-health screening at the ages they are due, vaccines, and the questions you have been saving up.",
        "We can also sign off school and sports paperwork for Murray School District while you are in the room, which saves a second trip in August when every family in the district needs the same form.",
      ],
      who: [
        "Who your child sees is their own pediatrician or advanced practice provider at our Cottonwood office, and we hold that pairing steady on purpose. Many of the families we see in Murray have been with the same provider since a newborn visit, and that history is the thing that turns an odd measurement into either reassurance or a plan.",
        "If your child needs a dietitian, a therapist or a specialist outside the practice, your provider arranges it from the checkup rather than sending you off to start again.",
      ],
      why: [
        "Why these visits matter is that almost nothing we screen for announces itself. A flattening growth curve, a hearing loss sitting behind slow speech, scoliosis in a fast-growing eleven-year-old, anxiety in a quiet teenager — none of those bring a family to the office on their own.",
        "Being close to an office makes the schedule easy to keep, and keeping the schedule is most of the benefit. A Murray family that never misses a year has fourteen data points on their child by high school; that is what makes the fifteenth one meaningful.",
      ],
      when: [
        "When to come is often in the first two years and then annually. Newborn and two-week visits, then 1, 2, 4, 6 and 9 months, the first-birthday visit, 15, 18, 24 and 30 months, and once a year from age 3 through 21.",
        "Book the annual visit before the sports physical rush. Murray High and Hillcrest paperwork lands on us in the same three weeks every summer, and a checkup in the spring gets you the same signature without the wait.",
      ],
      how: [
        "How you book is by calling the Cottonwood office or scheduling online, and if you are already a patient the fastest route is to book next year's checkup at the desk before you leave. It takes twenty seconds and it is the single thing that keeps families on schedule.",
        "Bring your child's shot record if you are new to us, any forms that need signing, and a written list of your questions. Everyone forgets one otherwise.",
      ],
      where: [
        "Where you go in Murray is 301 West 5400 South — our Cottonwood office, just west of State Street. From Murray Park it is about five minutes straight up State; from Fashion Place Mall it is barely longer. There is parking at the door, which matters more than it sounds when you are carrying an infant seat and a toddler.",
        "The Salt Lake office at 3838 South 700 East is your other option and it is only about eight minutes from most of Murray — north on State, then east on 3900 South. If your morning already takes you toward Millcreek or the university, it can be the easier of the two even though it is further away on paper.",
        "Between them, pick by traffic rather than distance. Cottonwood is the simpler drive if you are anywhere west of State Street. Salt Lake is the better choice if you are coming from east Murray, because you skip the State Street lights entirely.",
      ],
    },
    millcreek: {
      description:
        "Well child checkups in Millcreek, Utah. Our Salt Lake office sits at 3838 South 700 East, inside Millcreek itself — about seven minutes from Millcreek Common.",
      lead: "The office named Salt Lake is actually in Millcreek, at 700 East and 3900 South.",
      what: [
        "What happens at the visit is a full look at a well child: growth plotted against their own curve, a complete physical exam, the screenings due at that age — vision, hearing, development, mood — immunizations, and time for whatever you have been meaning to ask.",
        "Nothing about it is rushed toward a diagnosis, because usually there is not one. The point is to have a careful record of a healthy child, so that the year something changes we can see it against fourteen years of normal.",
      ],
      who: [
        "Who you will see is your own pediatrician at the Salt Lake office, kept the same from visit to visit wherever the schedule allows. That continuity is worth defending: the provider who saw your baby at four months is the one who will notice at four years that something is different.",
        "They also stay in charge of everything else. Referrals to our dietitians, our behavioral health team or a specialist elsewhere get made from the checkup and followed up at the next one.",
      ],
      why: [
        "Why bother when your child is fine is the fair question, and the answer is that being fine is what we are measuring. Screening only works on well children — once a problem is obvious it no longer needs finding.",
        "There is a second reason that matters more in a neighbourhood like this one, where families move house often but stay in the area: keeping the same practice through a move means your child's history moves with them. Changing addresses does not have to mean starting over.",
      ],
      when: [
        "When to come in is set by age, not by how your child seems. Newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, and annually from three through twenty-one.",
        "The 30-month visit is the one families skip most often, because a two-and-a-half-year-old seems past the fragile stage. It is actually one of the most useful, because speech and social development have moved a long way since the two-year visit.",
      ],
      how: [
        "How to book is a phone call to the Salt Lake office or a request online. If you are a new family, mention it when you call — new-patient checkups get a longer slot so there is room to take a proper history rather than rushing it.",
        "Come with the shot record, any school forms, and your questions written down. Half of what parents most want to ask surfaces in the car on the way home.",
      ],
      where: [
        "Where Millcreek families go is 3838 South 700 East, Suite 200 — close enough that many of you pass it already. From Millcreek Common it is about seven to nine minutes south on 900 East and over to 3900 South.",
        "If you are in the eastern part of Millcreek up toward the canyon, our Cottonwood office on 5400 South is about ten to thirteen minutes and is often the faster drive, because you can drop onto I-15 at 3300 South and come off at 5300 South rather than crossing town on surface streets.",
        "For most of Millcreek the Salt Lake office wins on every measure and there is no real decision to make. It is worth knowing the second option exists mainly for the days when the appointment you want is not available where you expected it.",
      ],
    },
    holladay: {
      description:
        "Well child checkups in Holladay, Utah. Two offices sit within about ten minutes of Holladay Village — Salt Lake on 3900 South and Willow Creek on Highland Drive.",
      lead: "Holladay sits almost exactly between two of our offices, which makes the choice a question of which way you are already driving.",
      what: [
        "What we do at a checkup is take a whole child seriously for half an hour. Height, weight and head circumference where it applies, blood pressure, a full physical, vision and hearing checks, developmental screening in the early years and mental-health screening in the later ones, plus any vaccines due.",
        "You get the results in the room, in plain language, with the growth chart on the screen so you can see the line rather than be told about it.",
      ],
      who: [
        "Who leads the visit is your child's own provider, and we work hard to keep it the same one. Families here often stay with us from a first baby through a last teenager, and by the end that provider knows a family's pattern well enough to tell the difference between a bad month and a real change.",
        "Behind them sit the rest of us — dietitians, lactation consultants, therapists, psychologists doing testing — all reachable through your provider rather than through a separate referral you have to chase.",
      ],
      why: [
        "Why they matter is that this is where quiet things get caught. Vision problems that a child has simply adapted to. A heart murmur worth a second listen. Iron deficiency in a picky eater. Low mood in a teenager who is still getting good grades.",
        "The visits are also the only structured chance most families get to ask about sleep, screens, food and behaviour without having to justify the appointment. That conversation is a real part of the care, not a filler around the exam.",
      ],
      when: [
        "When to book is by the standard schedule: frequent visits through the first two and a half years, then one a year to twenty-one. The early ones track the fastest changes; the later ones track a person becoming responsible for their own health.",
        "For high-schoolers, aim for spring rather than August. The visit is calmer, the provider has more time, and the sports form is signed months before anyone needs it.",
      ],
      how: [
        "How to arrange it is to call whichever of the two offices suits you and ask for a well child visit; you do not have to be assigned to that location to be seen there for a checkup.",
        "Bring the shot record if you are new, the forms if there are any, and your list. If your child is old enough to have their own questions, tell them they will get time alone with the provider if they want it — it changes how the visit goes.",
      ],
      where: [
        "Where Holladay families go is either our Salt Lake office at 3838 South 700 East or our Willow Creek office at 7138 South Highland Drive, and the two are within a few minutes of each other from most of the city.",
        "From Holladay Village, Salt Lake is about eight to eleven minutes — west on Murray Holladay Road, then north on 700 East. Willow Creek is about nine to twelve, straight south on Highland Drive past Fort Union. Neither drive involves a freeway, which in this part of the valley is an advantage in the morning.",
        "Choose by direction of travel rather than by the clock. If your day carries on north or west — downtown, the university, the airport — take Salt Lake. If it carries on south or up a canyon, take Willow Creek. If it makes no difference, book whichever has your own provider that week.",
      ],
    },
    "cottonwood-heights": {
      description:
        "Well child checkups in Cottonwood Heights, Utah. Our Willow Creek office is about five minutes from the mouth of Big Cottonwood Canyon, with the Cottonwood office in Murray as the second choice.",
      lead: "Cottonwood Heights has no office of its own, but Willow Creek sits just down Fort Union from the canyon mouth.",
      what: [
        "What the visit covers is the full preventive picture: growth, a head-to-toe exam, vision and hearing, development or mental health depending on age, immunizations, and time to talk. For families here we spend more of that time than average on sport and activity, because a lot of these children ski, climb and ride from the age they can stand.",
        "Concussion history, joint and back complaints, and the general question of how much training a growing body should take are all fair game at a checkup rather than something to save for an injury.",
      ],
      who: [
        "Who your child sees is their own provider at Willow Creek. Keeping the pairing constant matters here for a specific reason: an active child accumulates a history of knocks and strains, and one provider who has watched that accumulate reads it very differently from one seeing it fresh.",
        "When something needs more than us — sports medicine, orthopaedics, a psychologist for testing — the referral comes from that provider and the follow-up comes back to them.",
      ],
      why: [
        "Why the annual visit is worth keeping is that active children are the ones whose parents most often assume everything is fine. Fitness hides a lot. Blood pressure, growth that has quietly stalled, disordered eating in an athlete, the early scoliosis curve in a twelve-year-old — all of them are compatible with a child who skis well.",
        "The visit is also where we can talk honestly about altitude, dehydration and head injuries with families who are up a canyon most weekends of the winter.",
      ],
      when: [
        "When to come is the standard schedule — newborn through 30 months at intervals, then once a year to twenty-one. For families here, we usually suggest booking the annual visit in late spring or early autumn, outside the ski season, when neither you nor the office is at its busiest.",
        "If your child plays a school sport at Brighton or Cottonwood High, the annual checkup covers the physical, so there is no reason to arrange both.",
      ],
      how: [
        "How to book is to call Willow Creek or request a visit online. Morning slots are the ones that go first here, because so many families want to be done before the day starts.",
        "Bring the shot record if you are new to us, school or sports forms, and a note of anything you have been meaning to raise — including injuries that were never quite bad enough to bring in at the time.",
      ],
      where: [
        "Where you go from Cottonwood Heights is our Willow Creek office at 7138 South Highland Drive, just north of Fort Union Boulevard. From the mouth of Big Cottonwood Canyon it is about five to seven minutes down Fort Union and onto Highland Drive, and from most addresses in the city it is under ten.",
        "The second option is our Cottonwood office at 301 West 5400 South in Murray, about thirteen to seventeen minutes away — west on Fort Union to I-215, then north and off at 5300 South. It is a longer trip, but it is nearly all freeway, so it is more predictable in bad weather than the surface route.",
        "For almost every family here, Willow Creek is the answer: it is closer, it is on the side of the valley you already live on, and it is the office your neighbours use. Cottonwood is worth considering in two cases — if you work west or downtown and would rather drive against the traffic, or if the appointment you need is available there sooner. In winter, when Fort Union backs up with canyon traffic on a powder morning, the I-215 route to Cottonwood can genuinely be the faster of the two.",
      ],
    },
    midvale: {
      description:
        "Well child checkups in Midvale, Utah. Our Southpoint office in West Jordan is about seven minutes away and the Cottonwood office in Murray about ten — checkups from newborn to 21.",
      lead: "Midvale sits between our Southpoint and Cottonwood offices, both a short drive and neither more than a few miles.",
      what: [
        "What a checkup gives you is a complete look at your child once a year, or more often when they are small: measurements plotted on their own curve, a physical exam, hearing and vision, the age-appropriate screening questionnaires, vaccines, and a conversation about anything at home that has been on your mind.",
        "It is deliberately unhurried. Most of what we find at these visits, we find because there was time to ask a second question.",
      ],
      who: [
        "Who you see is your assigned pediatrician or advanced practice provider, at whichever of the two offices you choose. We keep families with the same provider between visits because the alternative — a different clinician each year — throws away the one thing that makes a growth chart useful.",
        "That provider is also the person who coordinates the rest: our dietitians, our behavioral health team, and specialists outside the practice.",
      ],
      why: [
        "Why keep the visits is that they are the only appointment nobody has to be persuaded to cancel — and the only one designed to find what nobody is looking for. Anaemia, hearing loss, high blood pressure, a mood that has slipped, a vaccine gap that will matter at a school registration desk.",
        "For working families the practical case is just as strong: a checkup is a planned half hour, and the conditions it heads off are the ones that otherwise arrive as an unplanned day off.",
      ],
      when: [
        "When to come is the recommended schedule, which front-loads the first two and a half years and then settles into one visit a year through age twenty-one. Newborn, two weeks, 1, 2, 4, 6, 9, 12, 15, 18, 24, 30 months, then annually.",
        "If getting away in the day is hard, ask about the first appointment of the morning. Those slots exist for exactly this and they are the easiest to work a shift around.",
      ],
      how: [
        "How to book is by phone or online, and if you are already with us, at the front desk on the way out. Booking a year ahead sounds excessive and is the reason some families have never missed a visit.",
        "Bring immunization records if you are new, any forms, and your questions on paper. Ten minutes into a visit with a toddler, nobody remembers what they meant to ask.",
      ],
      where: [
        "Where Midvale families go is usually our Southpoint office at 9071 South 1300 West in West Jordan — about seven to ten minutes, west on 7200 South and then down I-15 to the 9000 South exit. It sits right by the freeway, so the drive is short and predictable.",
        "Our Cottonwood office at 301 West 5400 South in Murray is the other option, about nine to twelve minutes north on State Street from Fort Union. It is barely further, and for anyone in eastern Midvale it is often closer.",
        "The honest way to choose is by which side of State Street you live on. West of it, Southpoint and the freeway; east of it, Cottonwood on the surface streets. If you commute north in the morning, Cottonwood keeps you pointed the right way; if you commute south or west, Southpoint does.",
      ],
    },
    sandy: {
      description:
        "Well child checkups in Sandy, Utah. Our Draper and Willow Creek offices are each about ten minutes from central Sandy — newborn visits, annual exams and sports physicals through age 21.",
      lead: "Sandy is the one city where two of our offices sit almost exactly the same distance away, in opposite directions.",
      what: [
        "What we cover is growth, a full examination, vision and hearing, the screenings due at that age, immunizations, and the questions you brought. For school-age children in Sandy that increasingly means sport: how much is too much, how to handle a suspected concussion, and whether a nagging knee is growth or injury.",
        "The annual checkup is also where school, sports and camp forms get signed, so one visit covers both the medicine and the paperwork.",
      ],
      who: [
        "Who your child will see is their own provider, at whichever office you choose. That relationship is the reason a teenager will answer a question honestly at seventeen — they have been answering the same person's questions since they were four.",
        "For the referrals a growing athlete sometimes needs, your provider makes the connection and stays in the loop rather than handing the problem off.",
      ],
      why: [
        "Why the annual visit earns its place is that the teenage years are when the most gets missed. Sport hides fatigue, school hides anxiety, and a fifteen-year-old who is never ill has no other reason to see a doctor.",
        "The visit is also where a teenager gets time alone with their provider if they want it. For a lot of families that twenty minutes turns out to be the most valuable part of the year.",
      ],
      when: [
        "When to come is often in the first two and a half years, then once a year to twenty-one. The younger schedule runs newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months.",
        "For Alta, Jordan and Hillcrest athletes, book the annual visit in spring. August is when every family in the district wants the same appointment and the same signature.",
      ],
      how: [
        "How to book is a call to either office or a request online. Say which location suits you — you are not restricted to one, and for a checkup we can usually place you wherever your provider is that week.",
        "Bring the shot record, any forms, and a list. If your teenager has questions of their own, tell them beforehand that they can ask them privately.",
      ],
      where: [
        "Where Sandy families go is either our Draper office at 114 East 12450 South or our Willow Creek office at 7138 South Highland Drive, and from the middle of the city they are within a minute or two of each other.",
        "Draper is about ten to thirteen minutes: south on I-15 from South Towne and off at the 12300 South exit, one turn from the freeway. Willow Creek is about ten to fourteen minutes north on Highland Drive to Fort Union, on surface streets the whole way.",
        "So choose on conditions rather than distance. Draper is the better bet in winter and in bad weather because the drive is nearly all freeway and gets cleared first. Willow Creek is better in the afternoon rush, when I-15 southbound through Sandy is the worst road in the valley and Highland Drive is moving fine. If you live west of State Street, take Draper; east of 1300 East, take Willow Creek; in between, take whichever has the appointment you want.",
      ],
    },
    draper: {
      description:
        "Well child checkups in Draper, Utah. Our Draper office is one turn off the 12300 South exit on I-15 — newborn visits through annual exams to age 21.",
      lead: "Our Draper office is at 114 East 12450 South, a minute off the freeway at 12300 South.",
      what: [
        "What a checkup involves is the whole child rather than one complaint: measurements on their own growth curve, a full physical, vision and hearing, developmental or mental-health screening for the age, vaccines, and a proper conversation.",
        "For families new to Draper — and there are a lot of them — the first visit is also where we take a full history, so the chart we build is yours rather than a summary of somebody else's records.",
      ],
      who: [
        "Who you will see is your own pediatrician or advanced practice provider here in Draper, and we keep it the same person visit after visit. In a city that has grown as fast as this one, a provider who has followed a child for years is a genuinely scarce thing and worth holding on to.",
        "That provider coordinates whatever else is needed, from our dietitians and behavioral health team to specialists elsewhere.",
      ],
      why: [
        "Why the visits matter is that they are built to find what nobody has noticed. Growth that has flattened, a hearing loss behind slow speech, scoliosis, high blood pressure, anxiety in a child who is doing well at school.",
        "They are also how vaccination actually keeps happening. The schedule is pinned to checkup ages, so families who keep their visits stay up to date without ever having to think about it.",
      ],
      when: [
        "When to come in is newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then annually from three to twenty-one.",
        "The annual visit doubles as the school, sports, camp and mission physical. If your child needs a form this year, book the checkup and you will get both.",
      ],
      how: [
        "How to book is by phone or online, or at the desk before you leave your last visit. Being one turn off the freeway means this office suits a lunchtime appointment better than most, which is worth knowing if taking a whole morning off is difficult.",
        "Bring the shot record if you are new, forms that need signing, and your questions written down.",
      ],
      where: [
        "Where you go is 114 East 12450 South, Suite 100 — take the 12300 South exit off I-15 and you are effectively there. From Draper Peaks or the Corner Canyon side of town it is about five minutes; from anywhere in the city it is under ten.",
        "If Draper is full or your provider is working elsewhere that week, our Southpoint office at 9071 South 1300 West is about twelve to sixteen minutes north on I-15 to the 9000 South exit — the same freeway, three exits up.",
        "There is not much of a decision here. Draper is your office, and the only reason to look north is timing. Families at the south end of the city, near the point of the mountain, sometimes find Southpoint no worse in the morning because they are driving against the commute rather than into it.",
      ],
    },
    "south-jordan": {
      description:
        "Well child checkups in South Jordan, Utah. Our Southpoint office is about seven minutes from Daybreak and the Draper office about ten — newborn visits through age 21.",
      lead: "South Jordan has more young children per household than almost anywhere we serve, and two offices within a few minutes.",
      what: [
        "What a checkup covers is broadest in the first two years, and that is the stretch most South Jordan families are in. Weight, length and head circumference at every visit, feeding and sleep, developmental milestones, hearing and vision, and the vaccines that come due at 2, 4, 6 and 12 months.",
        "It is also where the questions get answered — the ones about whether a baby is eating enough, waking too often, or behind where a cousin was at the same age.",
      ],
      who: [
        "Who you will see is your own provider, held constant from the newborn visit onward. With babies that matters more than at any other age, because so much of the assessment is comparison: this child against how this child looked six weeks ago.",
        "Lactation support and our dietitians sit behind the same provider, so a feeding problem raised at a checkup gets handled inside the practice.",
      ],
      why: [
        "Why they matter most in the early years is that this is when growth and development move fastest and when catching something early changes the outcome most. Hip dysplasia, a heart murmur, a hearing loss, a feeding problem quietly costing weight — all of them are ordinary findings at a routine visit and difficult ones later.",
        "For families in Daybreak with several children close together, the visits are also the thread that keeps everyone on schedule when the household is at its busiest.",
      ],
      when: [
        "When to come in the first two years is often: within days of coming home, at two weeks, then 1, 2, 4, 6, 9 and 12 months, then 15, 18, 24 and 30 months. After that it is once a year to twenty-one.",
        "If you have more than one child due, ask to stack the appointments. We can usually put siblings back to back, which turns three trips into one.",
      ],
      how: [
        "How to book is a phone call or an online request. New parents can be seen at either office and do not have to decide which is theirs — the chart follows the child, not the building.",
        "Bring the hospital discharge paperwork for a newborn, the shot record if you are transferring in, and your questions. Sleep-deprived is not the state in which anyone remembers a list.",
      ],
      where: [
        "Where South Jordan families go is usually our Southpoint office at 9071 South 1300 West in West Jordan. From Daybreak it is about six to nine minutes — east on 10400 South, north on Bangerter, then east on 9000 South.",
        "Our Draper office at 114 East 12450 South is about ten to thirteen minutes from the east side of the city: I-15 south from the South Jordan station area, off at 12300 South.",
        "The dividing line is roughly Bangerter Highway. West of it — Daybreak, the west bench — Southpoint is clearly closer and the drive avoids the freeway entirely, which is easier with a car full of small children. East of it, the two are close enough that the appointment time should decide. If you are coming with a newborn in winter, take Southpoint: less freeway, fewer merges, and you can park at the door.",
      ],
    },
    "west-jordan": {
      description:
        "Well child checkups in West Jordan, Utah. Our Southpoint office at 9071 South 1300 West is minutes from Jordan Landing — checkups from newborn through age 21.",
      lead: "Our Southpoint office is West Jordan's own, just off the 9000 South exit on I-15.",
      what: [
        "What we do at a well child visit is measure, examine, screen and talk. Growth against your child's own history, a full physical, vision and hearing, the developmental or mental-health screening due at that age, immunizations, and time for whatever you brought.",
        "School forms for Jordan District are part of it. Bring the paperwork to the annual visit and it goes home signed.",
      ],
      who: [
        "Who your child will see is their own pediatrician or advanced practice provider at Southpoint. This is a big office serving a big city, and keeping families with one provider is how we stop it feeling like one.",
        "Everything else runs through that provider — dietitians, lactation, behavioral health, and referrals out of the practice.",
      ],
      why: [
        "Why the visits are worth the morning is that they catch what has no symptoms yet. Vision problems a child has adapted around, anaemia in a picky eater, blood pressure that should not be that high at fourteen, a mood that has been sliding since autumn.",
        "They are also the appointment where nothing is wrong, which makes them the one where there is finally room to ask about sleep, screens, eating and behaviour without a fever taking up the time.",
      ],
      when: [
        "When to come is on the schedule: newborn and two weeks, 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then once a year from three through twenty-one.",
        "Aim away from August if you can. Every family in the district wants a physical in the same fortnight, and a spring appointment is calmer, longer and easier to get.",
      ],
      how: [
        "How to book is a call to Southpoint or a request online, and the reliable trick is to book the next one before you leave this one.",
        "Bring the immunization record if you are new to us, any forms, and a written list of questions.",
      ],
      where: [
        "Where you go is 9071 South 1300 West, Suite 301, a couple of minutes off the 9000 South exit on I-15. From Jordan Landing it is about six to nine minutes straight east on 9000 South.",
        "For families at the north end of the city, near 7000 South, our Cottonwood office at 301 West 5400 South in Murray is about twelve to sixteen minutes — east to I-15 and north to the 5300 South exit.",
        "For nearly everyone in West Jordan, Southpoint is the office and there is no decision to make. The exception is the north-east corner of the city, where Cottonwood is close enough that whichever has the earlier appointment is the right answer.",
      ],
    },
    riverton: {
      description:
        "Well child checkups in Riverton, Utah. Our Draper office is about nine minutes east across I-15, with Southpoint in West Jordan about twelve minutes north.",
      lead: "Riverton's nearest office is Draper, which surprises families who assume the west-side office must be closer.",
      what: [
        "What a checkup does is give a healthy child half an hour of undivided attention: growth measured and plotted, a full examination, vision and hearing, the screening due at that age, immunizations, and the conversation you came for.",
        "For older children we spend part of it on the things a busy family never gets to — sleep, screens, food, and how school is actually going as opposed to how the grades look.",
      ],
      who: [
        "Who your child sees is their own provider, and we keep the pairing steady. A child seen by the same person from infancy has a chart that means something; a child seen by whoever was free has a stack of unrelated snapshots.",
        "Anything beyond a checkup — a dietitian, a therapist, a specialist referral — is arranged by that provider and comes back to them.",
      ],
      why: [
        "Why these visits are worth keeping is simple: nearly everything they catch is silent. Scoliosis in a growth spurt, a hearing loss behind slow speech, high blood pressure, low iron, anxiety in a child who never complains.",
        "They are also how the vaccine schedule works in practice — it is pinned to checkup ages, so families who keep their appointments never have to think about it, and families who skip a year usually discover the gap at a school deadline.",
      ],
      when: [
        "When to come in is the standard schedule: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then annually to twenty-one.",
        "The annual visit covers school, sports and camp physicals, so a spring booking gets the form signed long before the Riverton and Herriman school deadlines land in the same week.",
      ],
      how: [
        "How to book is by phone or online, at either office. If the drive is what makes it difficult, ask for the first appointment of the day — the roads out here are quiet at that hour and the office is running exactly on time.",
        "Bring the shot record if you are new, the forms, and a written list.",
      ],
      where: [
        "Where Riverton families go is most often our Draper office at 114 East 12450 South. From Riverton City Park it is about nine to twelve minutes east on 12600 South and across I-15 — a straight run with no freeway driving at all.",
        "Our Southpoint office at 9071 South 1300 West is about eleven to fifteen minutes: north on Bangerter Highway, then east on 9000 South. It feels like it ought to be closer because it is the west-side office, but the geography does not agree.",
        "Take Draper if you live east of Redwood Road, which is most of the city; 12600 South gets you there without a freeway merge, and the office is a single turn off the road. Take Southpoint if you are in the north of the city near 11400 South, or if your day is heading toward West Jordan or Taylorsville afterwards — Bangerter is fast outside the rush and you end up pointed the right way.",
      ],
    },
    herriman: {
      description:
        "Well child checkups in Herriman, Utah. Our Southpoint and Draper offices are both about twenty minutes away — checkups from newborn to age 21, worth booking early in the day.",
      lead: "Herriman is the furthest of our service areas from any office, which makes planning the trip part of the advice.",
      what: [
        "What the visit covers is everything preventive in one appointment, which matters more when getting there takes twenty minutes each way. Growth, a full exam, vision and hearing, the age-appropriate screening, vaccines, and all your questions — not the two you can fit in.",
        "If more than one of your children is due, say so when you book. We would rather see three siblings in one morning than have you make the drive three times.",
      ],
      who: [
        "Who you will see is your own pediatrician or advanced practice provider, kept the same across visits. For a family who comes in less often because of the distance, that continuity does more work than usual: the provider is holding the thread between appointments that are further apart.",
        "They also handle the referrals, so a specialist visit does not turn into a second set of phone calls from you.",
      ],
      why: [
        "Why not to skip a year, even with the drive, is that the checkup is the only appointment designed to find what has not announced itself — and a family that comes in rarely has fewer other chances to be seen.",
        "Herriman has grown faster than almost anywhere in the state, and many families here moved from somewhere else with an incomplete record. The checkup is where that record gets rebuilt properly rather than assumed.",
      ],
      when: [
        "When to come is the recommended schedule — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then once a year to twenty-one.",
        "Book the first slot of the morning. Mountain View Corridor and Bangerter both move well before eight and neither does at half past.",
      ],
      how: [
        "How to book is by phone or online, and it is worth booking further ahead than a closer family would. A specific early appointment with your own provider is what makes this trip workable; whatever is left at short notice usually is not.",
        "Bring the shot record, any forms, and your list — and ask about anything at all while you are in the room, because a phone call afterwards is a poor substitute.",
      ],
      where: [
        "Where Herriman families go is either our Southpoint office at 9071 South 1300 West in West Jordan or our Draper office at 114 East 12450 South, and they are within a minute of each other in driving time.",
        "Southpoint is about sixteen to twenty-one minutes: north on Mountain View Corridor from around Herriman City Hall, then east on 9000 South. Draper is about seventeen to twenty-two: east on 13400 South from the Butterfield Park side of the city, across to I-15 and one exit.",
        "The decision is really about which road you trust. Mountain View Corridor to Southpoint is the more consistent drive — fewer lights, no freeway, and it is rarely congested outside the school run. The Draper route is faster on a good morning but puts you on 13400 South and then onto I-15, both of which can go badly at once. Families in the north of Herriman, up toward 11800 South, should take Southpoint; families on the Rosecrest side or south toward Bluffdale usually find Draper quicker. If you are making the trip with a newborn, take Southpoint — it is the calmer road.",
      ],
    },
    bluffdale: {
      description:
        "Well child checkups in Bluffdale, Utah. Our Draper office is about ten minutes across I-15, with Southpoint in West Jordan about fifteen minutes north.",
      lead: "Bluffdale sits at the point of the mountain, and its nearest office is just up the freeway in Draper.",
      what: [
        "What a checkup covers is the whole of a well child: growth against their own curve, a full physical examination, vision and hearing, the screening due at that age, immunizations, and time for the things you have been wondering about.",
        "Because Bluffdale families are split between two school districts, we are used to signing whichever form your child's school actually wants. Bring it and we will do it in the room.",
      ],
      who: [
        "Who your child will see is their own provider, held constant from visit to visit. That is what makes the growth chart mean something rather than being a series of numbers taken by different people.",
        "The same provider arranges anything further — our dietitians, our behavioral health team, or a specialist outside the practice — and follows it up at the next visit.",
      ],
      why: [
        "Why the visits matter is that being well is the condition under which screening works. Once a problem is obvious, it does not need finding; the point of a checkup is the year before that.",
        "For a city growing as quickly as this one, there is a second reason. Many families here are new to Utah, and the annual visit is where a scattered medical history gets turned into one record that somebody is actually watching.",
      ],
      when: [
        "When to come is often at first — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months — and then once a year through age twenty-one.",
        "Book the annual well before August. The sports and school physical rush is a fortnight long and it takes every appointment in the south end of the valley with it.",
      ],
      how: [
        "How to book is a call or an online request to the Draper office, and the easiest version is to book next year's before you leave this one.",
        "Bring immunization records if you are transferring in, forms that need a signature, and a written list of questions.",
      ],
      where: [
        "Where Bluffdale families go is our Draper office at 114 East 12450 South. From around 14600 South it is about nine to thirteen minutes — north on Redwood Road, then east across I-15 — and it is one turn off the 12300 South exit if you take the freeway instead.",
        "Our Southpoint office at 9071 South 1300 West is the alternative, about fifteen to nineteen minutes north on I-15 from the point of the mountain.",
        "Draper is the obvious choice for nearly the whole city: it is closer, the drive is short, and the office is beside the freeway you are already on. Southpoint only makes sense if your morning takes you north anyway — toward West Jordan, Taylorsville or the airport — in which case you are not really adding a trip, you are stopping on the way.",
      ],
    },
    taylorsville: {
      description:
        "Well child checkups in Taylorsville, Utah. Our Cottonwood office is a straight run east on 5400 South, about eight minutes from Taylorsville City Hall.",
      lead: "5400 South runs from Taylorsville straight to our Cottonwood office door.",
      what: [
        "What the visit involves is a full preventive check: measurements plotted on your child's own curve, a head-to-toe examination, vision and hearing, developmental or mental-health screening for the age, immunizations, and the questions you brought with you.",
        "School and sports forms for Granite District are handled at the same visit — there is no need to book a separate physical.",
      ],
      who: [
        "Who your child sees is their own pediatrician or advanced practice provider at our Cottonwood office, the same one each year wherever we can manage it.",
        "That provider is the hub. Referrals to our dietitians, lactation consultants and behavioral health team, or to a specialist elsewhere, all start and finish with them.",
      ],
      why: [
        "Why keep the annual visit is that it is aimed at what has no symptoms. Low iron, a hearing loss, blood pressure that is too high for a fourteen-year-old, a vision problem the child has quietly worked around, a mood that has been sliding.",
        "It is also the visit where a parent gets to ask about the ordinary things. Sleep, screens, eating, siblings, behaviour — the questions that never justify their own appointment but shape a family's year.",
      ],
      when: [
        "When to come is by age rather than by how your child seems: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then annually from three through twenty-one.",
        "For teenagers, a spring appointment is easier to get and less rushed than an August one, and the sports form lasts just as long.",
      ],
      how: [
        "How to book is by calling us or asking online. If mornings are hard, the last appointment of the afternoon is usually easier to get than the first of the day and works better around a school pickup.",
        "Bring the shot record if you are new to us, the forms, and your list of questions.",
      ],
      where: [
        "Where Taylorsville families go is our Cottonwood office at 301 West 5400 South in Murray. From Taylorsville City Hall it is about eight to eleven minutes straight east on 5400 South — the same road, the whole way, with no freeway and no clever route to remember.",
        "Our Salt Lake office at 3838 South 700 East is about eleven to fifteen minutes: east on 3500 South from around Valley Fair, then south. It is the better option if your day carries on toward Sugar House or the university.",
        "For most of the city there is no real contest — Cottonwood is closer, the drive is simpler, and 5400 South is a road you already use. Salt Lake is worth it only if you live at the northern edge of Taylorsville near 3500 South, where the two are close to even and the east-west drive is no longer.",
      ],
    },
    "west-valley-city": {
      description:
        "Well child checkups in West Valley City, Utah. Our Cottonwood office in Murray is about fifteen minutes east and the Salt Lake office about eighteen — checkups from newborn to 21.",
      lead: "West Valley is the largest city we serve without an office of its own, and two offices sit within about fifteen minutes of it.",
      what: [
        "What a checkup gives you is one appointment that covers everything preventive: growth, a complete physical, vision and hearing, the screening questionnaires due at that age, immunizations, and a real conversation about how your child is doing.",
        "If English is not the language you would rather have that conversation in, tell us when you book. It is easier to arrange interpretation in advance than to work around it in the room.",
      ],
      who: [
        "Who your child will see is their own provider, at whichever of the two offices you choose, and we keep that the same person across visits.",
        "Everything else — dietitians, lactation support, behavioral health, referrals outside the practice — is arranged by that provider rather than left for you to chase.",
      ],
      why: [
        "Why the visits matter is that they are the only structured chance to find what nobody has noticed. In a city with as many young families as this one, the commonest things we catch at checkups are hearing and vision problems, iron deficiency, and vaccine gaps that would otherwise show up at a school registration desk.",
        "They are also cheaper than the alternative in every sense. Preventive visits are covered by most plans with no copay; the illnesses they head off are not.",
      ],
      when: [
        "When to come is the standard schedule — newborn, two weeks, 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then once a year from three to twenty-one.",
        "Granite District forms are signed at the annual visit. If several of your children are due, book them together and make one trip of it.",
      ],
      how: [
        "How to book is by telephone or through the website. Because the drive is fifteen minutes rather than five, it is worth asking for a specific time with your own provider rather than taking whatever is next available.",
        "Bring the shot record if you are new to us, any school forms, and your questions written down.",
      ],
      where: [
        "Where West Valley families go is either our Cottonwood office at 301 West 5400 South in Murray or our Salt Lake office at 3838 South 700 East. Cottonwood is about fourteen to nineteen minutes — south on Redwood Road from Valley Fair, then east on 5400 South. Salt Lake is about fifteen to twenty-one — east on 3500 South, onto I-15 and south one exit.",
        "The city is big enough that the answer changes depending on where in it you live. South of 3500 South — Hunter, Granger, the area toward Taylorsville — Cottonwood is closer and the drive is all surface streets. North of 3500 South, and especially near the Maverik Center, the Salt Lake office is the shorter trip and the freeway leg makes it more predictable.",
        "If it is genuinely even, take Cottonwood. It has more appointment slots, more parking, and the 5400 South approach avoids the I-15 merge that makes the other drive unreliable between half seven and nine.",
      ],
    },
    kearns: {
      description:
        "Well child checkups in Kearns, Utah. Our Cottonwood office is a straight run east on 5400 South, about fifteen minutes from the Utah Olympic Oval.",
      lead: "From Kearns, 5400 South runs due east to our Cottonwood office with barely a turn in it.",
      what: [
        "What the visit covers is growth, a full examination, vision and hearing, the developmental or mental-health screening due at that age, any immunizations, and time to talk through what is on your mind.",
        "It is one appointment rather than several, which is the point: the physical, the vaccines and the school form all happen in the same half hour.",
      ],
      who: [
        "Who your child will see is their own pediatrician or advanced practice provider at Cottonwood, kept the same from year to year so that somebody is genuinely following your child rather than reading a file.",
        "If they need a dietitian, a therapist or a specialist elsewhere, that provider makes the arrangement and stays involved.",
      ],
      why: [
        "Why the annual visit is worth the drive is that it is the appointment designed to find the things you would not bring a child in for. Anaemia, a hearing loss, high blood pressure, a growth curve that has quietly flattened.",
        "It is also where vaccination stays on track without effort. Miss two years of checkups and the gap usually surfaces at a school deadline; keep them and it never comes up.",
      ],
      when: [
        "When to come is on the schedule: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, and once a year from three through twenty-one.",
        "Granite District paperwork is covered by the annual visit. Booking it in spring avoids the August crush entirely.",
      ],
      how: [
        "How to book is one phone call, or a request left online. With a fifteen-minute drive, an early appointment is worth asking for — 5400 South is quick before eight and slow after.",
        "Bring the immunization record if you are new to us, forms, and a list of your questions.",
      ],
      where: [
        "Where Kearns families go is our Cottonwood office at 301 West 5400 South in Murray. From the Utah Olympic Oval it is about thirteen to eighteen minutes, east on 5400 South the entire way — no freeway, no navigation, one road.",
        "Our Southpoint office at 9071 South 1300 West in West Jordan is about fifteen to nineteen minutes: south on 5600 West from around Kearns High, then east on 9000 South.",
        "Cottonwood is the simpler drive and the one most families here use, particularly with small children, because a single straight road is easier than a route with turns in it. Southpoint is the better choice from the south end of Kearns, below 6200 South, where you are already closer to 9000 South than to 5400 — and it is the better choice any morning when 5400 South is backed up at Redwood Road, which happens often enough to be worth having a second option.",
      ],
    },
    "salt-lake-city": {
      description:
        "Well child checkups in Salt Lake City, Utah. Our Salt Lake office at 3838 South 700 East sees children from newborn through age 21, about fifteen minutes from downtown.",
      lead: "Our Salt Lake office is at 3838 South 700 East, south of the city centre and just off 3900 South.",
      what: [
        "What we do at a checkup is look at the whole child once a year: growth on their own curve, a full physical, vision and hearing, the screening due at that age, immunizations, and a conversation about how things actually are at home and at school.",
        "For families across the district, the annual visit covers the school and sports forms too, so there is no separate physical to arrange.",
      ],
      who: [
        "Who your child sees is their own pediatrician or advanced practice provider, and we protect that pairing. In a city where families move between neighbourhoods often, the constant is the provider rather than the address.",
        "That provider coordinates the rest — our dietitians, our lactation consultants, our behavioral health team, and specialists outside the practice.",
      ],
      why: [
        "Why keep the visits is that they are the appointment that finds things nobody was looking for: a hearing loss behind slow speech, iron deficiency, scoliosis in a growth spurt, blood pressure that should not be that high, depression in a teenager whose grades are still fine.",
        "They also carry the vaccine schedule. Immunization ages are checkup ages, so families who keep the appointments never have to reconstruct where they got to.",
      ],
      when: [
        "When to come is newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then annually from three through twenty-one — including every year of high school.",
        "The teenage visits are the ones most families let slide, and they are the ones where the mental-health screening lives. They are worth the hour.",
      ],
      how: [
        "How to book takes a call or a couple of minutes online. Ask at the desk on your way out and next year's visit is already made — the single habit that most reliably keeps a family on schedule.",
        "Bring the shot record if you are new to us, forms that need signing, and your questions on paper.",
      ],
      where: [
        "Where you go is 3838 South 700 East, Suite 200 — from downtown, south on I-15 to the 3900 South exit and then east, about twelve to eighteen minutes depending on the hour.",
        "Our Cottonwood office at 301 West 5400 South in Murray is about fifteen to twenty-one minutes and is the closer of the two for anyone in the south of the city; from Sugar House Park it is straight south on 1300 East and west on 5400 South.",
        "For the Avenues, downtown, Rose Park and the university, Salt Lake is your office and the freeway leg makes it quicker than the map suggests. South of about 3300 South, the two are close enough that whichever has your provider that week should decide. If you are travelling by transit rather than car, take the Salt Lake office — it is a much shorter walk from a bus route than Cottonwood is.",
      ],
    },
    "south-salt-lake": {
      description:
        "Well child checkups in South Salt Lake, Utah. Our Salt Lake office at 3838 South 700 East is about eight minutes away — newborn visits through annual exams to age 21.",
      lead: "South Salt Lake is closer to our Salt Lake office than almost anywhere else in the valley.",
      what: [
        "What a checkup covers is everything we would rather find before it becomes a problem: growth measured and plotted, a complete examination, vision and hearing, the age-appropriate screening, vaccines, and the questions you came in with.",
        "It is a planned half hour rather than a reaction to something, which is why it is the visit where the useful conversations actually happen.",
      ],
      who: [
        "Who you will see is your child's own provider, the same one visit after visit. That is not administrative tidiness — it is what lets a clinician say with confidence that a change is a change rather than a normal variation.",
        "The rest of the practice sits behind them: dietitians, lactation support, therapists and psychologists, all reachable through the checkup.",
      ],
      why: [
        "Why they matter here is access. A short drive is the difference between a family that keeps every appointment and one that keeps most of them, and keeping every one is what makes the record worth having.",
        "The visits also find the quiet things — low iron, hearing loss, vision that has been slowly worsening, anxiety — none of which would bring anyone to a clinic on their own.",
      ],
      when: [
        "When to come is the standard schedule: newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then once a year from three to twenty-one.",
        "If your child is behind, come anyway. There is a catch-up schedule for every vaccine and being behind is both common and fixable.",
      ],
      how: [
        "How to book is by phone or online, and being this close to the office makes a same-week cancellation slot genuinely usable — it is worth asking whether there is one.",
        "Bring the shot record if you are new, any forms, and your list.",
      ],
      where: [
        "Where South Salt Lake families go is our Salt Lake office at 3838 South 700 East, Suite 200. From the Central Pointe TRAX station it is about seven to ten minutes — south on State Street, then east on 3900 South.",
        "Our Cottonwood office at 301 West 5400 South in Murray is about eleven to fifteen minutes, south on I-15 from 3300 South and off at 5300 South.",
        "There is little to decide: Salt Lake is closer from every part of the city and the drive avoids the freeway altogether. Cottonwood is the fallback when the appointment you need is not available here, and for families near 3300 South and I-15 it is barely further, since the freeway does the work.",
      ],
    },
    /* -------------------------------------------------- Davis County -- */
    "north-salt-lake": {
      description:
        "Well child checkups in North Salt Lake, Utah. Our Grow Up Great office in Bountiful is about ten minutes away — newborn visits through annual exams to age 21.",
      lead: "North Salt Lake's nearest office is Grow Up Great, just over the line in Bountiful.",
      what: [
        "What a checkup covers is the full preventive picture in one appointment: growth against your child's own history, a head-to-toe examination, vision and hearing, the screening due at that age, immunizations, and time for your questions.",
        "Davis District school and sports forms are signed at the same visit, so the paperwork and the medicine happen together.",
      ],
      who: [
        "Who your child will see is their own pediatrician or advanced practice provider at Grow Up Great, and we keep it the same person from year to year.",
        "That provider coordinates anything else your child needs — our dietitians, our behavioral health team, or a specialist outside the practice — rather than handing you a list to work through.",
      ],
      why: [
        "Why the visits matter is that they are built around finding what has not shown itself yet: a hearing loss sitting behind slow speech, a growth curve that has flattened, low iron, blood pressure that is too high for a teenager, anxiety in a child who is coping well on the surface.",
        "For a city that has grown as fast as North Salt Lake, they also do the unglamorous job of turning a scattered medical history into one record that somebody is watching.",
      ],
      when: [
        "When to come is often in the early years — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months — and then annually from three through twenty-one.",
        "Book the annual before the summer. Davis District physicals and the same fortnight of appointments collide every August.",
      ],
      how: [
        "How to book is a call to Grow Up Great or a request online, and the reliable habit is to book next year's on the way out of this one.",
        "Bring the shot record if you are new to us, forms that need a signature, and a written list of questions.",
      ],
      where: [
        "Where North Salt Lake families go is our Grow Up Great office at 620 Medical Drive in Bountiful, on the hospital street off 500 South. From Foxboro it is about eight to eleven minutes — north on Redwood Road, then east on 500 South.",
        "Our Farmington office at 491 West Bourne Circle is the second option, about fifteen to nineteen minutes north up I-15 or Legacy Parkway to the Park Lane exit.",
        "Grow Up Great is the obvious choice for the whole city, and the drive is short in either direction you approach from. Farmington is worth considering only if your morning already takes you north — if you work in Layton or Ogden, stopping at Farmington on the way is less time out of the day than doubling back to Bountiful, even though the map says otherwise.",
      ],
    },
    "woods-cross": {
      description:
        "Well child checkups in Woods Cross, Utah. Our Grow Up Great office in Bountiful is about seven minutes east on 500 South — checkups from newborn to age 21.",
      lead: "Woods Cross is a few minutes from Grow Up Great, straight east on 500 South.",
      what: [
        "What happens at the visit is measuring, examining, screening and talking. Growth on your child's own curve, a full physical, vision and hearing, the developmental or mental-health screening due at that age, immunizations, and the questions you brought.",
        "Nothing is squeezed. The half hour exists so that the second and third question get asked, which is usually where the useful ones are.",
      ],
      who: [
        "Who you will see is your own provider, kept the same visit after visit. A clinician who has watched a child for six years reads a growth chart differently from one seeing it for the first time.",
        "They also run everything else: referrals to our dietitians, lactation consultants or behavioral health team, and to specialists outside the practice.",
      ],
      why: [
        "Why keep them is that checkups are the appointment aimed at silence. Vision that has slowly worsened, a hearing loss, anaemia in a fussy eater, scoliosis in a growth spurt — none of them arrive with a symptom that sends a family to the doctor.",
        "They are also, for most insurance plans, preventive care with no copay, which makes them the least expensive appointment your child will have all year.",
      ],
      when: [
        "When to come is by age: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then once a year from three to twenty-one.",
        "The annual visit is the school and sports physical. There is no reason to book both, and spring is easier than August for either.",
      ],
      how: [
        "How to book is a call or an online request. If you have more than one child due, ask to see them back to back — with a seven-minute drive, one trip is genuinely one trip.",
        "Bring immunization records if you are transferring in, the forms, and a list of questions.",
      ],
      where: [
        "Where Woods Cross families go is our Grow Up Great office at 620 Medical Drive, Suite 100 in Bountiful. From the Woods Cross FrontRunner station it is about six to nine minutes east on 500 South, and from anywhere in the city it is under ten.",
        "Our Farmington office at 491 West Bourne Circle is about thirteen to seventeen minutes north — onto I-15 at 1500 South and off at Park Lane.",
        "Grow Up Great is your office in every practical sense. The only real argument for Farmington is scheduling: it is a different appointment book, and if your child needs to be seen this week rather than next, it is fifteen minutes up a freeway that is usually moving.",
      ],
    },
    bountiful: {
      description:
        "Well child checkups in Bountiful, Utah. Our Grow Up Great office is at 620 Medical Drive, minutes from anywhere in the city — newborn visits through age 21.",
      lead: "Grow Up Great is Bountiful's own office, on Medical Drive just off 500 South.",
      what: [
        "What a well child checkup covers is your child as a whole: growth plotted against their own history, a complete physical exam, vision and hearing, the developmental and mental-health screening appropriate to their age, immunizations, and however long the questions take.",
        "It is also the visit where school, sports, camp and mission forms are signed, so families do not need a separate appointment for paperwork.",
      ],
      who: [
        "Who your child will see is their own pediatrician or advanced practice provider, the same one each year. Many Bountiful families have been with the same provider across two or three children, and that accumulated familiarity is a real clinical asset rather than a nicety.",
        "Anything beyond a checkup runs through them: dietitians, lactation support, therapists, psychologists doing testing, and referrals outside the practice.",
      ],
      why: [
        "Why the visits matter is that nearly everything they catch is asymptomatic. A murmur worth a second listen, low iron, a hearing loss, a spine starting to curve, a low mood that has not yet become a crisis.",
        "They are also where the relationship gets built. A sixteen-year-old will talk to a doctor they have known since preschool in a way they will not talk to a stranger in an urgent care room, and that is bought one ordinary visit at a time.",
      ],
      when: [
        "When to come is set by age: the newborn and two-week visits, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, and one visit a year from three through twenty-one.",
        "The 30-month visit and the teenage visits are the two most often skipped, and both are among the most useful — one for speech and social development, the other for mental health.",
      ],
      how: [
        "How to book is by phone or online, or at the front desk before you leave. Being minutes away makes a short-notice cancellation slot practical, so it is always worth asking.",
        "Bring the shot record if you are new to us, any forms, and your questions written down.",
      ],
      where: [
        "Where you go is 620 Medical Drive, Suite 100 — the hospital street off 500 South, about four minutes from most of Bountiful and with parking at the door.",
        "Our Farmington office at 491 West Bourne Circle is about twelve to sixteen minutes north on I-15 to the Park Lane exit, and it is the sensible fallback when the appointment you want is not available here.",
        "For Bountiful there is no decision worth making: Grow Up Great is in your city, it is the office your neighbours use, and every route to it is short. Farmington matters only for timing — a family who needs to be seen sooner, or who works north and would rather stop on the way than turn around.",
      ],
    },
    centerville: {
      description:
        "Well child checkups in Centerville, Utah. Our Grow Up Great office in Bountiful is about eight minutes south and Farmington about twelve minutes north.",
      lead: "Centerville sits between our two Davis County offices, with one exit of I-15 in either direction.",
      what: [
        "What the visit covers is growth, a full examination, vision and hearing, the screening due at that age, immunizations, and the conversation you came for — all in one appointment rather than several.",
        "Davis District forms are signed at the annual visit, which for most families is the practical reason the appointment gets made at all.",
      ],
      who: [
        "Who your child sees is their own provider, at whichever of the two offices suits you. Being between offices does not mean being between providers: the pairing stays the same and the chart follows the child.",
        "That provider arranges anything further — dietitians, lactation consultants, behavioral health, or a specialist elsewhere.",
      ],
      why: [
        "Why they earn the morning is that the checkup is the only appointment designed for a well child, and therefore the only one that finds problems before they declare themselves.",
        "For families with several children, the annual visits are also the mechanism that keeps everybody's vaccinations aligned. Miss a couple of years across three children and the reconstruction is a job; keep them and it never becomes one.",
      ],
      when: [
        "When to come is the standard schedule — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then annually from three to twenty-one.",
        "If your children are due within a few months of each other, pull them together into one appointment block. From Centerville that turns two drives into one for the price of a slightly earlier visit for someone.",
      ],
      how: [
        "How to book is a call to whichever office you fancy. Say which you would prefer and which you would accept — with both within about a quarter of an hour, being flexible usually gets you a better time.",
        "Bring the shot record if you are new, forms, and a written list of questions.",
      ],
      where: [
        "Where Centerville families go is either our Grow Up Great office at 620 Medical Drive in Bountiful or our Farmington office at 491 West Bourne Circle, and Centerville is one of the few cities where both are genuinely close.",
        "Grow Up Great is about seven to ten minutes: south on Main Street from Founders Park, then west on 500 South. Farmington is about ten to fourteen: north on I-15 from Parrish Lane, one exit to Park Lane, behind Station Park.",
        "South of Parrish Lane, take Bountiful — it is closer and the surface route is quicker than getting on the freeway for a single exit. North of Parrish Lane, take Farmington, particularly if you are combining the visit with anything at Station Park, which is thirty seconds from the office door. If your child needs a same-week appointment, ask both: two nearby offices means two appointment books, and that is the real advantage of living here.",
      ],
    },
    farmington: {
      description:
        "Well child checkups in Farmington, Utah. Our Farmington office is at 491 West Bourne Circle, just off Park Lane behind Station Park — newborn visits through age 21.",
      lead: "Our Farmington office is behind Station Park, a few minutes from anywhere in the city.",
      what: [
        "What a checkup involves is the whole child in one sitting: measurements on their own growth curve, a head-to-toe exam, vision and hearing, the screening due at that age, immunizations, and time for the questions you have been saving.",
        "School, sports, camp and mission forms are part of the same visit. Bring them and they go home signed.",
      ],
      who: [
        "Who your child will see is their own pediatrician or advanced practice provider here in Farmington, and we hold that pairing steady across the years so that somebody is actually following your child.",
        "The rest of the practice sits behind them — dietitians, lactation consultants, therapists and psychologists — reachable through the checkup rather than through a separate process.",
      ],
      why: [
        "Why they matter is that the findings are quiet ones. A flattening growth curve, a hearing loss behind slow speech, high blood pressure at fourteen, iron deficiency, scoliosis, low mood in a child who is still functioning well.",
        "The visits also carry the vaccine schedule, which is pinned to checkup ages. Keep the appointments and your child stays protected without anyone having to track it.",
      ],
      when: [
        "When to come is on the schedule that starts with the newborn and two-week visits, runs through 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, and then settles into one visit a year to twenty-one.",
        "Book the annual visit outside July and August if you can. The physical is valid just as long and the appointment is longer and calmer.",
      ],
      how: [
        "How to book is by phone or online, or at the desk on your way out. Being off Park Lane makes this office unusually easy to fit into an errand — the visit does not have to be the only reason you are out.",
        "Bring immunization records if you are new to us, any forms, and your list.",
      ],
      where: [
        "Where you go is 491 West Bourne Circle, Suite 1, just off Park Lane behind Station Park — about four to six minutes from most of Farmington, and a straight run from the FrontRunner station if you are coming by train.",
        "Our Grow Up Great office at 620 Medical Drive in Bountiful is about twelve to sixteen minutes south on I-15, off at 500 South.",
        "Farmington is your office and there is not much to weigh. Bountiful is the one to call when you need an appointment sooner than Farmington can offer, or when your day is heading south anyway — the freeway run is quick outside the rush, and it is the same practice, the same records and, often enough, the same provider.",
      ],
    },
    kaysville: {
      description:
        "Well child checkups in Kaysville, Utah. Our Farmington office is about nine minutes south on Highway 89 or I-15 — checkups from newborn through age 21.",
      lead: "Kaysville families are a short run down Highway 89 or I-15 from our Farmington office.",
      what: [
        "What a well child visit covers is growth against your child's own curve, a full physical examination, vision and hearing, the developmental or mental-health screening due at that age, immunizations, and the questions you brought with you.",
        "It is one appointment for all of it, including the school and sports forms, which is the difference between a morning out and two.",
      ],
      who: [
        "Who your child sees is their own provider at our Farmington office, the same one from visit to visit. Continuity is what makes a chart into a story rather than a set of numbers.",
        "That provider is also who arranges a dietitian, a therapist, or a referral outside the practice, and who follows it up next time you are in.",
      ],
      why: [
        "Why the visits are worth keeping is that they look for things nobody has noticed. Anaemia, hearing loss, a spine beginning to curve, blood pressure that is too high, a mood that has been slipping since the autumn.",
        "For a town where a lot of children play a lot of sport, they are also the only routine chance to talk about training load, old head injuries and eating properly for growth rather than for performance.",
      ],
      when: [
        "When to come is the schedule: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, and annually from three through twenty-one.",
        "For Davis and Farmington High athletes, a spring appointment gets the form signed and the conversation had months before the season starts.",
      ],
      how: [
        "How to book is a call to Farmington or a request through the website. Ask for a morning slot if the drive matters to you — southbound I-15 out of Kaysville is fine early and much less so at half past eight.",
        "Bring the shot record if you are new, forms that need signing, and your questions on paper.",
      ],
      where: [
        "Where Kaysville families go is our Farmington office at 491 West Bourne Circle, Suite 1, behind Station Park. From Kaysville Main Street it is about eight to eleven minutes, and you can take either Highway 89 or I-15 south to Park Lane depending on which side of town you start from.",
        "Our Grow Up Great office at 620 Medical Drive in Bountiful is about sixteen to twenty-one minutes further south on I-15, off at 500 South.",
        "Farmington is the sensible choice by a wide margin — it is half the drive and the office is right off the road you are already on. Bountiful is a real option only when Farmington cannot see you soon enough; from the east side of Kaysville the Highway 89 approach makes Farmington faster still, so take that over the freeway when it is available to you.",
      ],
    },
    layton: {
      description:
        "Well child checkups in Layton, Utah. Our Farmington office is about twelve minutes south on I-15 — newborn visits, annual exams and sports physicals through age 21.",
      lead: "Layton is the northern edge of what we serve, two exits up I-15 from our Farmington office.",
      what: [
        "What the visit covers is everything preventive in one appointment: growth measured and plotted, a complete physical, vision and hearing, the age-appropriate screening, immunizations, and time to talk through whatever has been on your mind.",
        "Because the drive is longer than most of our families make, we would rather you brought every question you have than saved some for a phone call.",
      ],
      who: [
        "Who your child will see is their own pediatrician or advanced practice provider at Farmington, kept the same across visits so that the relationship survives the gaps between them.",
        "They also coordinate anything further — our dietitians, our behavioral health team, or a specialist elsewhere — so a referral does not become a second project for you.",
      ],
      why: [
        "Why come at all when your child is well is that being well is the condition screening depends on. Hearing loss, vision problems, anaemia, scoliosis, high blood pressure, anxiety — all of them are compatible with a child who seems entirely fine.",
        "For a family that has moved to Layton from elsewhere, and many have, the annual visit is also where an incomplete history becomes a proper record.",
      ],
      when: [
        "When to come is on the standard schedule — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then once a year from three to twenty-one.",
        "Book further ahead than you think you need to. A specific time with your own provider is what makes a twelve-minute drive worth doing; whatever is left at short notice usually is not.",
      ],
      how: [
        "How to book is a call or an online request to the Farmington office, and it is worth asking to stack siblings into one morning if more than one is due.",
        "Bring immunization records if you are transferring in, forms, and your list of questions.",
      ],
      where: [
        "Where Layton families go is our Farmington office at 491 West Bourne Circle, Suite 1, behind Station Park. From Layton Hills Mall it is about eleven to fifteen minutes, two exits south on I-15 to Park Lane.",
        "Our Grow Up Great office at 620 Medical Drive in Bountiful is about nineteen to twenty-five minutes from Antelope Drive, and it is a long way to go past a closer office.",
        "Farmington is the answer for the whole city. The only thing worth planning around is the hour: southbound I-15 from Layton is slow between about seven and nine, so a first-thing appointment can take twelve minutes and a nine o'clock one can take twenty-five. If you are coming from west Layton, the Legacy Parkway approach to Farmington avoids the worst of it.",
      ],
    },
    /* --------------------------------------- Summit & Wasatch County -- */
    "park-city": {
      description:
        "Well child checkups in Park City, Utah. Our Summit office is at Quinn's Junction next to the hospital — newborn visits through annual exams and sports physicals to age 21.",
      lead: "Our Summit office is at Quinn's Junction, where SR-248 meets US-40, next to the hospital.",
      what: [
        "What a checkup covers is the whole child: growth on their own curve, a full examination, vision and hearing, the screening due at that age, immunizations, and time for whatever you brought.",
        "In Park City it also covers a set of things the rest of the valley rarely raises — altitude and hydration, head injuries and how many is too many, and the eating patterns of children who train seriously from a young age.",
      ],
      who: [
        "Who your child will see is their own provider here at Summit. In a town this size that continuity is easy to take for granted and hard to replace: your provider will have seen the same child ski, grow, get hurt and recover across several years.",
        "When something needs more than a checkup — imaging, sports medicine, a psychologist for testing — they arrange it and follow it up.",
      ],
      why: [
        "Why the annual visit matters for a mountain family is that fitness is an excellent disguise. A child who skis all winter and rides all summer can be anaemic, under-fuelled, sleeping badly or quietly anxious, and none of it will show on the hill.",
        "The visit is also where a concussion history gets recorded properly, in one place, by someone who will still be looking at it in three years.",
      ],
      when: [
        "When to come is newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then once a year from three through twenty-one.",
        "For a household whose year runs on the ski season, the practical answer for the annual visit is late spring or early autumn — after the lifts close or before they open, when neither your family nor the office is at its busiest.",
      ],
      how: [
        "How to book is by phone or online at the Summit office, and booking the next one before you leave is worth more here than most places, because the calendar fills around the season rather than around the school year.",
        "Bring the shot record if you are new to us, school or team forms, and a note of any injuries from the winter — including the ones that never quite justified a visit at the time.",
      ],
      where: [
        "Where you go is 750 Round Valley Drive, Suite 102, at Quinn's Junction beside the hospital where SR-248 meets US-40. From Old Town it is about eight to twelve minutes; from Kimball Junction it is closer to twenty, and the whole way is on roads that get cleared early.",
        "The nearest office off the mountain is Willow Creek at 7138 South Highland Drive, about thirty-five to forty-five minutes down Parley's Canyon on I-80 and then south on I-215.",
        "For a checkup, use Summit — it is your office, and there is no reason to drive a canyon for a routine visit. Willow Creek is worth knowing about for a different reason: if you work down in the valley, an appointment near the end of your day there can be easier than a mid-morning one up here, and in a bad storm the canyon is exactly the thing you do not want between you and an appointment. Check the canyon before you commit to the drive either way.",
      ],
    },
    "heber-city": {
      description:
        "Well child checkups in Heber City, Utah. Our Summit office at Quinn's Junction is about twenty-five minutes north on US-40 — checkups from newborn through age 21.",
      lead: "Heber is a straight run north on US-40 to our Summit office at Quinn's Junction.",
      what: [
        "What the visit covers is growth, a complete physical, vision and hearing, the developmental or mental-health screening due at that age, immunizations, and the questions you came with — all in one appointment, which matters when the round trip is the better part of an hour.",
        "If more than one of your children is due, tell us when you book and we will put them together.",
      ],
      who: [
        "Who your child will see is their own pediatrician or advanced practice provider at Summit, held constant from visit to visit. For families who come from further away and therefore see us less often, that continuity carries more weight, not less.",
        "That provider is also the person who arranges anything beyond a checkup and who follows it up the next time you are in.",
      ],
      why: [
        "Why make the drive is that the checkup is the appointment built to find what has no symptoms — and a family that lives further from care has fewer incidental chances to be seen.",
        "It is also the visit that keeps immunizations on schedule without anyone tracking them, and that puts a growing, active child's history in one place rather than spread across whoever was nearest at the time.",
      ],
      when: [
        "When to come is the same schedule we use everywhere: the newborn and two-week visits, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months, then one a year through twenty-one.",
        "Book early in the day and early in the year. US-40 over Silver Creek is quick in good weather and slow in bad, and a morning appointment gives you the best of it.",
      ],
      how: [
        "How to book is by phone or through the website. Ask for a specific time with your own provider rather than the next available — with a twenty-five minute drive, a well-chosen appointment is worth waiting an extra fortnight for.",
        "Bring the shot record if you are new to us, forms that need signing, and every question you have. A phone call afterwards is a poor substitute for being in the room.",
      ],
      where: [
        "Where Heber families go is our Summit office at 750 Round Valley Drive, Suite 102, at Quinn's Junction. It is about twenty to twenty-seven minutes north on US-40 over Silver Creek, and the office sits right where SR-248 meets the highway, so you do not have to go into Park City to reach it.",
        "The alternative is a long way further: our Willow Creek office at 7138 South Highland Drive is about fifty to sixty minutes, north on US-40 to I-80, down Parley's Canyon and south on I-215.",
        "For a routine visit, Summit is the only sensible choice — it is less than half the drive and none of it involves a canyon. The valley offices are worth considering only if your work already takes you down there regularly, in which case an appointment at the end of a workday costs you nothing extra. In winter, always take the US-40 route to Summit rather than planning around Parley's.",
      ],
    },
    kamas: {
      description:
        "Well child checkups in Kamas, Utah. Our Summit office at Quinn's Junction is about twenty minutes west on SR-248 — newborn visits through annual exams to age 21.",
      lead: "From the Kamas Valley it is about twenty minutes west over Browns Canyon to our Summit office.",
      what: [
        "What a well child visit covers is the whole child at once: growth against their own history, a full examination, vision and hearing, the screening due at that age, immunizations, and time to talk — one appointment doing the work of several.",
        "For families in the Kamas Valley we also use the visit to cover the practical things that come with living further out: what to do about an injury at the weekend, when a fever is worth the drive, and what we can handle by phone.",
      ],
      who: [
        "Who your child sees is their own provider at Summit, the same one visit after visit. Distance makes continuity more valuable, not less — the provider is holding the thread across appointments that are further apart than most families'.",
        "They also arrange anything further and follow it up rather than leaving it with you.",
      ],
      why: [
        "Why keep the annual visit is that it finds what nobody would drive twenty minutes to report. Slow speech masking a hearing loss, a growth curve flattening, low iron, a spine starting to curve, a teenager who has quietly stopped enjoying anything.",
        "It is also the one appointment a healthy child is guaranteed to have, which for a rural family is often the only regular contact with the practice at all.",
      ],
      when: [
        "When to come is often in the first two and a half years — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24 and 30 months — and then once a year through twenty-one.",
        "Plan around the weather rather than the calendar. SR-248 over Browns Canyon is straightforward most of the year and worth avoiding in a storm, so an autumn or spring appointment is the easiest to keep.",
      ],
      how: [
        "How to book is by phone or online at the Summit office. If you have several children, book them into one block — the drive is the expensive part of the visit, not the visit.",
        "Bring the shot record if you are new, any forms, and a written list of everything you meant to ask.",
      ],
      where: [
        "Where Kamas Valley families go is our Summit office at 750 Round Valley Drive, Suite 102, at Quinn's Junction. It is about eighteen to twenty-four minutes west on SR-248 over Browns Canyon, and because the office sits at the junction with US-40 you arrive without driving through Park City at all.",
        "The nearest valley office is a long way past that: our Salt Lake office at 3838 South 700 East is roughly fifty-five to seventy minutes, north to I-80, down Parley's Canyon and south on I-215.",
        "There is no real choice to make for a routine checkup — Summit is a quarter of the drive and the road to it is the one you use anyway. The reason to know the valley offices exist is scheduling and weather: if SR-248 is closed or the appointment you need is weeks out at Summit, an office in the valley is the same practice with the same records, and it is worth asking rather than skipping the year.",
      ],
    },
  },
};
