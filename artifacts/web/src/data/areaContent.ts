/**
 * What a well-child visit looks like from each city we serve.
 *
 * These pages exist because the decision a parent is actually making is not
 * "should my child have a checkup" — it is "which office, and how long will
 * that take me on a Tuesday morning". That question has a different answer in
 * Herriman than it does in Bountiful, and a page that gives the same answer
 * everywhere is not worth publishing.
 *
 * So every entry here is written from scratch. None of it is a template with a
 * city name substituted in, and no section repeats a section on another page.
 * Where two cities share a fact — both are nearest to Southpoint, say — each
 * says it about its own roads, its own schools and its own drive.
 *
 * How these are written, since it is easy to drift:
 *
 *   Answer first.      Open with the answer, not with a run-up to it. "We check
 *                      your child's growth, development, vision and hearing",
 *                      not "What a visit covers is...". The reader should not
 *                      have to work through a setup to reach the information.
 *   Verbs, not nouns.  "We perform a head-to-toe exam" rather than "a
 *                      head-to-toe exam" in a list of services. It makes us
 *                      active rather than making the visit a menu.
 *   We and your child.  First person throughout, addressed to a parent.
 *   Families in X, Utah, not "an X family". Nobody describes themselves as
 *                      "a Murray family", and the longer form places the city
 *                      without implying we have an office in it.
 *   Plain over clever. "Answer any questions you have", not "the questions you
 *                      have been saving up". A list introduced by a phrase has
 *                      to be a list that phrase actually describes.
 *
 * The section order matches the service page: what, who, why, when, how, where.
 * The renderer writes the headings; each section here answers the question its
 * heading asks, in its first sentence, so a reader who lands mid-page is never
 * reading the middle of something.
 *
 * `where` is what these pages are really for. It ends every page and it is the
 * only section allowed to talk about offices at length: which are closest, what
 * the drive is like, and — where the choice is genuinely close — how to pick.
 * Drive times come from `serviceAreas.ts` and are estimates; see the note at
 * the top of that file.
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
        "Well-child visits in Murray, Utah. Our Cottonwood office sits on 5400 South, about five minutes from Murray Park. We see children from birth through age 21.",
      lead: "Our Cottonwood office is on 5400 South in Murray, a few blocks west of State Street.",
      what: [
        "For families in Murray, Utah, a well-child visit gives us a chance to check your child's growth, development, vision, hearing, and overall health. We perform a head-to-toe physical exam, complete developmental and mental health screenings when appropriate, review vaccines, and answer any questions you have.",
        "We can also complete school, sports, camp, and mission forms during the same appointment, so you do not need a second visit when Murray School District asks for one.",
      ],
      who: [
        "Many of the families we see in Murray have been with the same provider since a newborn visit, and we work hard to keep it that way. Your child will see a pediatrician or advanced practice provider, and the same one from year to year wherever the schedule allows.",
        "That history is what turns a borderline measurement into either reassurance or a plan. If your child needs a dietitian, a therapist or a specialist outside our practice, we arrange it during the visit and follow up at the next one.",
      ],
      why: [
        "We look for problems that give no warning. At these visits we catch growth that has quietly flattened, hearing loss behind slow speech, curvature of the spine during a growth spurt, blood pressure that is too high for a teenager, and low mood in a child who is still doing well at school.",
        "Living a few minutes away also makes the schedule easy to keep, and keeping it is most of the benefit. By the time a child reaches high school we have more than a dozen visits to compare against, which is what makes the next one worth anything.",
      ],
      when: [
        "Bring your child in often for the first two years, then once a year after that. We see newborns within days of coming home and again at two weeks, then at 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and once a year from age 3 through 21.",
        "Schedule the annual visit before summer if your child plays a sport. Murray High and Hillcrest paperwork arrives in the same three weeks every year, and a spring appointment earns the same signature without the wait.",
      ],
      how: [
        "Call our Cottonwood office or request a visit online. If you already see us, schedule next year's visit at the front desk on your way out — it takes about twenty seconds and keeps families on track better than anything else we have tried.",
        "Bring your child's immunization record if you are new to us, any forms that need signing, and a written list of questions. Most parents think of one on the drive home otherwise.",
      ],
      where: [
        "Come to 301 West 5400 South, just west of State Street. The drive takes about five minutes from Murray Park and only a little longer from Fashion Place Mall. You can park at the door, which matters more than it sounds when you are carrying an infant seat and holding a toddler's hand.",
        "Our Salt Lake office at 3838 South 700 East is about eight minutes from most of Murray. Go north on State Street, then east on 3900 South. If your morning already takes you toward Millcreek or the university, it can be the easier of the two even though it is farther away.",
        "Choose by traffic rather than by distance. Cottonwood is the simpler drive from anywhere west of State Street. Salt Lake works better from east Murray, because you skip the State Street lights entirely.",
      ],
    },
    millcreek: {
      description:
        "Well-child visits in Millcreek, Utah. Our Salt Lake office sits at 3838 South 700 East, inside Millcreek itself, about seven minutes from Millcreek Common.",
      lead: "The office we call Salt Lake is actually in Millcreek, at 700 East and 3900 South.",
      what: [
        "We use a well-child visit to check how your child is growing and developing, test vision and hearing, and examine them from head to toe. We complete the screenings that are due at that age, bring immunizations up to date, and talk through anything you have noticed at home.",
        "Very little of it is dramatic, and that is the point. We are building a careful record of a healthy child so that the year something changes, we can see it against everything that came before.",
      ],
      who: [
        "The provider who examines your baby at four months is the one who will notice at four years that something is different. That is why a pediatrician or advanced practice provider takes the visit and why we try hard to make it the same person each time.",
        "They stay in charge of everything else too. Referrals to our dietitians, our behavioral health team or a specialist elsewhere are made from the visit itself, and we follow them up next time you are in.",
      ],
      why: [
        "Screening only works on a well child, which is why we ask you to come when nothing is wrong. Once a problem is obvious it no longer needs finding, and by then we have usually lost the easiest chance to treat it.",
        "There is a second reason that matters in a neighbourhood where families move house often but stay in the area. If you keep the same practice through a move, your child's history moves with you. Changing addresses does not have to mean starting over.",
      ],
      when: [
        "Come in on a schedule set by your child's age rather than by how they seem. We see newborns, then at two weeks, 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and once a year from three through twenty-one.",
        "Please do not skip the 30-month visit. Families often do, because a two-and-a-half-year-old seems past the fragile stage, but speech and social development have moved a long way since the two-year visit and this is where we check them.",
      ],
      how: [
        "Call our Salt Lake office or request a visit online. Tell us if you are a new family — we give new patients a longer appointment so there is room to take a proper history rather than rushing it.",
        "Bring the immunization record, any school forms, and your questions written down. Half of what parents most want to ask surfaces in the car on the way home.",
      ],
      where: [
        "Our address is 3838 South 700 East, Suite 200, and many of you already drive past it. From Millcreek Common the trip takes about seven to nine minutes, south on 900 East and over to 3900 South.",
        "If you live in the eastern part of Millcreek, up toward the canyon, our Cottonwood office on 5400 South takes about ten to thirteen minutes and is often the faster drive. You can join I-15 at 3300 South and leave it at 5300 South instead of crossing town on surface streets.",
        "Willow Creek, down Highland Drive past Fort Union, is the third within reach at about twelve to sixteen minutes. Ask for it if you live at the south-eastern edge of Millcreek, where it is no farther than Cottonwood and considerably easier to park at.",
        "For most of Millcreek the Salt Lake office wins on every measure and there is no real decision to make. Knowing the other two exist mainly helps on the days when the appointment you want is not available where you expected it.",
      ],
    },
    holladay: {
      description:
        "Well-child visits in Holladay, Utah. Two offices sit within about ten minutes of Holladay Village — Salt Lake on 3900 South and Willow Creek on Highland Drive.",
      lead: "Holladay sits almost exactly between two of our offices, which turns the choice into a question of which way you are already driving.",
      what: [
        "A well-child visit is where we look at your whole child rather than one problem. We measure height, weight, and head circumference where it applies, take blood pressure, examine your child head to toe, test vision and hearing, and screen for developmental or mental health concerns depending on their age.",
        "We give you the results in the room, in plain language, with the growth chart on the screen so you can see the line rather than be told about it.",
      ],
      who: [
        "Families in Holladay often stay with us from a first baby through a last teenager, and by then a provider knows a family well enough to tell a bad month from a real change. One of our pediatricians or advanced practice providers takes the visit, and we hold that steady across the years.",
        "Behind them sit our dietitians, lactation consultants, therapists and psychologists. You reach all of them through the visit rather than through a referral you have to chase yourself.",
      ],
      why: [
        "These visits are where we catch the quiet things. We find vision problems a child has simply adapted to, heart murmurs worth a second listen, iron deficiency in a picky eater, and low mood in a teenager who is still getting good grades.",
        "They are also the only structured chance most families get to ask about sleep, screens, food, and behaviour without having to justify the appointment. That conversation is part of the care, not filler around the exam.",
      ],
      when: [
        "Plan on frequent visits through the first two and a half years, then one a year until twenty-one. The early appointments track the fastest changes; the later ones track a person becoming responsible for their own health.",
        "For high-schoolers, aim for spring rather than August. The visit is calmer, your provider has more time, and we sign the sports form months before anyone needs it.",
      ],
      how: [
        "Call whichever of the two offices suits you and ask for a well-child visit. You do not have to be assigned to a location to be seen there.",
        "Bring the immunization record if you are new, the forms if there are any, and your list. If your child is old enough to have questions of their own, tell them beforehand that they can have time alone with the provider — it changes how the visit goes.",
      ],
      where: [
        "You can come to our Salt Lake office at 3838 South 700 East or our Willow Creek office at 7138 South Highland Drive. From most of Holladay the two are within a few minutes of each other.",
        "From Holladay Village, Salt Lake takes about eight to eleven minutes: west on Murray Holladay Road, then north on 700 East. Willow Creek takes about nine to twelve, straight south on Highland Drive past Fort Union. Neither drive involves a freeway, which in this part of the valley is an advantage in the morning.",
        "Cottonwood, on 5400 South in Murray, is about eleven to fifteen minutes. It rarely wins on distance from Holladay, but it is our largest office and holds the widest appointment book of the three, so it is worth naming when you need a particular week rather than a particular building.",
        "Choose by the direction you are travelling. If your day carries on north or west, toward downtown, the university, or the airport, take Salt Lake. If it carries on south or up a canyon, take Willow Creek. If it makes no difference, book wherever your own provider is working that week.",
      ],
    },
    "cottonwood-heights": {
      description:
        "Well-child visits in Cottonwood Heights, Utah. Our Willow Creek office is about five minutes from the mouth of Big Cottonwood Canyon, with two more within twenty.",
      lead: "We have no office in Cottonwood Heights, but Willow Creek sits just down Fort Union from the canyon mouth.",
      what: [
        "During a well-child visit we check growth, development, vision, and hearing, examine your child head to toe, screen for developmental or mental health concerns at the ages those apply, and review immunizations. For families in Cottonwood Heights we usually spend more of that time than average on sport and activity, because so many children here ski, climb, and ride from the age they can stand.",
        "Bring up old injuries even if they seemed minor. We would rather talk about a head knock, a sore back, or a joint that keeps complaining during a routine visit than meet it for the first time in an urgent one.",
      ],
      who: [
        "An active child accumulates a history of strains and knocks, and someone who has watched that build reads it very differently from someone seeing it fresh. Your child will see a pediatrician or advanced practice provider at Willow Creek, and the same one each visit wherever we can manage it.",
        "When a problem needs more than we can give — sports medicine, orthopaedics, a psychologist for testing — we make the referral and the follow-up comes back to us.",
      ],
      why: [
        "Fitness hides a great deal, and active children are the ones whose parents most often assume everything is fine. We regularly find high blood pressure, growth that has stalled, disordered eating in an athlete, or an early spinal curve in a twelve-year-old who skis beautifully.",
        "These visits are also where we can talk honestly about altitude, hydration, and head injuries with families who spend most winter weekends up a canyon.",
      ],
      when: [
        "Come in on the standard schedule: newborn through 30 months at intervals, then once a year until twenty-one. We usually suggest booking the annual visit in late spring or early autumn, outside the ski season, when neither you nor the office is at its busiest.",
        "If your child plays a school sport at Brighton or Cottonwood High, the annual visit covers the physical. There is no reason to arrange both.",
      ],
      how: [
        "Call Willow Creek or request a visit online. Morning appointments go first here, because so many families want to be finished before the day starts.",
        "Bring the immunization record if you are new to us, school or sports forms, and a note of anything you have been meaning to raise.",
      ],
      where: [
        "Come to our Willow Creek office at 7138 South Highland Drive, just north of Fort Union Boulevard. From the mouth of Big Cottonwood Canyon the drive takes about five to seven minutes, and from most addresses in the city it is under ten.",
        "Our Cottonwood office at 301 West 5400 South in Murray is about thirteen to seventeen minutes: west on Fort Union to I-215, then north and off at 5300 South. It is a longer trip, but nearly all of it is freeway, so it holds up better in bad weather than the surface route.",
        "There is a third within reach: our Salt Lake office at 3838 South 700 East, about fourteen to eighteen minutes straight north on Highland Drive. Take it when the same trip includes a drop-off at the university or anything else on the east bench.",
        "For almost everyone here, Willow Creek is the answer. It is closest, it is on the side of the valley you live on, and it is the office your neighbours use. Consider Cottonwood in two cases: if you work west or downtown and would rather drive against the traffic, or if it can see you sooner. In winter, when Fort Union backs up with canyon traffic on a powder morning, the I-215 route can genuinely be the faster of the two.",
      ],
    },
    midvale: {
      description:
        "Well-child visits in Midvale, Utah. Our Southpoint office is about seven minutes away and Cottonwood about ten. We see children from birth through age 21.",
      lead: "Midvale sits between our Southpoint and Cottonwood offices, and a third is only a few minutes farther.",
      what: [
        "We check your child's growth against their own history, examine them head to toe, test hearing and vision, work through the screening questionnaires that apply at their age, give any vaccines that are due, and talk about whatever has been on your mind at home.",
        "We do not rush it. Most of what we find at these visits, we find because there was time to ask a second question.",
      ],
      who: [
        "A different clinician every year throws away the one thing that makes a growth chart useful, so we keep families with the same pediatrician or advanced practice provider between visits.",
        "That provider also coordinates the rest: our dietitians, our behavioral health team, and specialists outside the practice.",
      ],
      why: [
        "This is the only appointment designed to find what nobody is looking for. We pick up anaemia, hearing loss, high blood pressure, a mood that has slipped, and vaccine gaps that would otherwise surface at a school registration desk.",
        "For working families the practical case is just as strong. A well-child visit is a planned half hour, and the conditions it heads off are the ones that otherwise arrive as an unplanned day off.",
      ],
      when: [
        "Follow the recommended schedule, which front-loads the first two and a half years and then settles into one visit a year through age twenty-one: newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months.",
        "If getting away during the day is hard, ask for the first appointment of the morning. Those slots exist for exactly this and they are the easiest to work a shift around.",
      ],
      how: [
        "Call either office or request a visit online, and if you already see us, book at the front desk on the way out. Scheduling a year ahead sounds excessive and is the reason some families have never missed a visit.",
        "Bring immunization records if you are new, any forms, and your questions on paper. Ten minutes into a visit with a toddler, nobody remembers what they meant to ask.",
      ],
      where: [
        "Most families here come to our Southpoint office at 9071 South 1300 West in West Jordan, about seven to ten minutes away: west on 7200 South, then down I-15 to the 9000 South exit. It sits right by the freeway, so the drive is short and predictable.",
        "Our Cottonwood office at 301 West 5400 South in Murray takes about nine to twelve minutes, north on State Street from Fort Union. It is barely farther, and from eastern Midvale it is often closer.",
        "Willow Creek on Highland Drive is the third, about nine to thirteen minutes east along Fort Union. From the eastern edge of the city it is the shortest of the three, and it is the only one you can reach without touching a freeway at all.",
        "The honest way to choose is by which side of State Street you live on. West of it, take Southpoint and the freeway. East of it, take Cottonwood or Willow Creek on the surface streets. If you commute north in the morning, Cottonwood keeps you pointed the right way; if you commute south or west, Southpoint does.",
      ],
    },
    sandy: {
      description:
        "Well-child visits in Sandy, Utah. Our Draper and Willow Creek offices are each about ten minutes from central Sandy, with Southpoint a few minutes farther.",
      lead: "Sandy is the one city where two of our offices sit about the same distance away, in opposite directions.",
      what: [
        "At a well-child visit we measure growth, examine your child from head to toe, test vision and hearing, complete the screenings due at that age, and review immunizations. For school-age children in Sandy that increasingly means talking about sport: how much training is too much, what to do about a suspected concussion, and whether a nagging knee is growth or injury.",
        "We sign school, sports, and camp forms at the same appointment, so one visit covers both the medicine and the paperwork.",
      ],
      who: [
        "A teenager answers a question honestly at seventeen because they have been answering the same person's questions since they were four. Keeping your child with one pediatrician or advanced practice provider is how that happens.",
        "When a growing athlete needs a referral, we make the connection and stay in the loop rather than handing the problem off.",
      ],
      why: [
        "The teenage years are when the most gets missed. Sport hides fatigue, school hides anxiety, and a fifteen-year-old who is never ill has no other reason to see a doctor all year.",
        "These visits are also where a teenager can have time alone with their provider if they want it. For a lot of families that twenty minutes turns out to be the most valuable part of the year.",
      ],
      when: [
        "Come often through the first two and a half years, then once a year to twenty-one. The younger schedule runs newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months.",
        "If your child plays for Alta, Jordan, or Hillcrest, book the annual visit in spring. In August every family in the district wants the same appointment and the same signature.",
      ],
      how: [
        "Call either office or request a visit online, and say which location suits you. You are not restricted to one, and for a well-child visit we can usually place you wherever your provider is working that week.",
        "Bring the immunization record, any forms, and a list. If your teenager has questions of their own, tell them beforehand that they can ask privately.",
      ],
      where: [
        "Two offices are open to you: Draper at 114 East 12450 South, and Willow Creek at 7138 South Highland Drive. From the middle of Sandy they are within a minute or two of each other.",
        "Draper takes about ten to thirteen minutes: south on I-15 from South Towne and off at the 12300 South exit, one turn from the freeway. Willow Creek takes about ten to fourteen, north on Highland Drive to Fort Union, on surface streets the whole way.",
        "Southpoint in West Jordan is the third option, about twelve to sixteen minutes west on 9000 South across I-15. Remember it if you live west of State Street, or if your morning carries on toward the west side anyway — of the three, it is the one drive that goes against the commute.",
        "Choose on conditions rather than distance. Draper is the better bet in winter, because the drive is nearly all freeway and gets cleared first. Willow Creek is better in the afternoon rush, when I-15 southbound through Sandy is the worst road in the valley and Highland Drive is moving fine.",
      ],
    },
    draper: {
      description:
        "Well-child visits in Draper, Utah. Our Draper office is one turn off the 12300 South exit on I-15. We see children from birth through age 21.",
      lead: "Our Draper office is at 114 East 12450 South, a minute off the freeway at 12300 South.",
      what: [
        "We look at the whole child rather than one complaint. At each visit we measure growth against your child's own curve, examine them head to toe, test vision and hearing, screen for developmental or mental health concerns depending on their age, review vaccines, and answer your questions.",
        "If you are new to Draper — and many families here are — we also take a full history at the first visit, so the chart we build is yours rather than a summary of somebody else's records.",
      ],
      who: [
        "In a city that has grown this fast, a clinician who has followed one child for years is genuinely scarce and worth holding on to. Your child will see one of the pediatricians or advanced practice providers here in Draper, visit after visit.",
        "They coordinate whatever else is needed, from our dietitians and behavioral health team to specialists elsewhere.",
      ],
      why: [
        "We are looking for what nobody has noticed: growth that has flattened, hearing loss behind slow speech, a curving spine, high blood pressure, or anxiety in a child who is doing well at school.",
        "These visits are also how vaccination keeps happening. The immunization schedule is pinned to well-child ages, so families who keep their appointments stay up to date without ever having to think about it.",
      ],
      when: [
        "We see your child at birth and two weeks, at 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and once a year from three to twenty-one.",
        "The annual visit doubles as the school, sports, camp, and mission physical. If your child needs a form this year, book the well-child visit and you will get both.",
      ],
      how: [
        "Call us or request a visit online, or book at the front desk before you leave your last appointment. Being one turn off the freeway makes this office suit a lunchtime visit better than most, which is worth knowing if taking a whole morning off is difficult.",
        "Bring the immunization record if you are new, forms that need signing, and your questions written down.",
      ],
      where: [
        "Come to 114 East 12450 South, Suite 100. Take the 12300 South exit off I-15 and you are effectively there. From Draper Peaks or the Corner Canyon side of town it is about five minutes, and from anywhere in the city it is under ten.",
        "If we are full here, or your provider is working elsewhere that week, our Southpoint office at 9071 South 1300 West is about twelve to sixteen minutes north on I-15 to the 9000 South exit — the same freeway, three exits up.",
        "Willow Creek at 7138 South Highland Drive is the farthest of the three at about fifteen to twenty minutes, north on I-15 and east at 7200 South. Families pick it when they would rather be on the east bench than beside the freeway.",
        "There is not much of a decision here. Draper is your office, and the only reason to look north is timing. If you live at the south end of the city, near the point of the mountain, Southpoint is often no worse in the morning because you are driving against the commute rather than into it.",
      ],
    },
    "south-jordan": {
      description:
        "Well-child visits in South Jordan, Utah. Our Southpoint office is about seven minutes from Daybreak and Draper about ten. We see newborns through age 21.",
      lead: "South Jordan has more young children per household than almost anywhere we serve, and two offices within a few minutes.",
      what: [
        "We cover the most ground in the first two years, and that is the stretch most families in South Jordan are in. At every visit we weigh and measure your baby, check head circumference, ask about feeding and sleep, watch for developmental milestones, test hearing and vision, and give the vaccines due at 2, 4, 6, and 12 months.",
        "We also answer the questions that come with a first baby: whether they are eating enough, waking too often, or behind where a cousin was at the same age.",
      ],
      who: [
        "With babies, continuity matters more than at any other age, because so much of the assessment is comparison — this child against how this child looked six weeks ago. One pediatrician or advanced practice provider looks after your baby from the newborn visit onward.",
        "Our lactation consultants and dietitians work alongside them, so a feeding problem raised at a well-child visit gets handled inside the practice.",
      ],
      why: [
        "The early years are when growth and development move fastest and when finding something early changes the outcome most. Hip dysplasia, a heart murmur, hearing loss, or a feeding problem quietly costing weight are all ordinary findings at a routine visit and difficult ones later.",
        "For families in Daybreak with several children close together, these visits are also the thread that keeps everyone on schedule when the household is at its busiest.",
      ],
      when: [
        "Come in within days of coming home, at two weeks, then at 1, 2, 4, 6, 9, and 12 months, then 15, 18, 24, and 30 months. After that it is once a year to twenty-one.",
        "If more than one of your children is due, ask us to stack the appointments. We can usually see siblings back to back, which turns three trips into one.",
      ],
      how: [
        "Book by phone or through the website. New parents can be seen at either office and do not have to decide which one is theirs — the chart follows the child, not the building.",
        "Bring the hospital discharge paperwork for a newborn, the immunization record if you are transferring in, and your questions. Sleep-deprived is not the state in which anyone remembers a list.",
      ],
      where: [
        "Most families here come to our Southpoint office at 9071 South 1300 West in West Jordan. From Daybreak the drive takes about six to nine minutes: east on 10400 South, north on Bangerter, then east on 9000 South.",
        "Our Draper office at 114 East 12450 South is about ten to thirteen minutes from the east side of the city, south on I-15 and off at 12300 South.",
        "Bangerter Highway is roughly the dividing line. West of it — Daybreak and the west bench — Southpoint is clearly closer and the drive avoids the freeway entirely, which is easier with a car full of small children. East of it, the two are close enough that the appointment time should decide. If you are coming with a newborn in winter, take Southpoint: less freeway, fewer merges, and you can park at the door.",
      ],
    },
    "west-jordan": {
      description:
        "Well-child visits in West Jordan, Utah. Our Southpoint office at 9071 South 1300 West is minutes from Jordan Landing. We see children from birth through age 21.",
      lead: "Our Southpoint office is West Jordan's own, just off the 9000 South exit on I-15.",
      what: [
        "We measure, examine, screen, and talk. At each visit we check growth against your child's own history, examine them head to toe, test vision and hearing, complete the developmental or mental health screening due at that age, review immunizations, and make time for whatever you brought with you.",
        "We complete Jordan District school forms at the same appointment. Bring the paperwork and it goes home signed.",
      ],
      who: [
        "Southpoint is a large office serving a large city, and keeping families with the same pediatrician or advanced practice provider is how we stop it feeling like one.",
        "Everything else runs through that provider: dietitians, lactation support, behavioral health, and referrals out of the practice.",
      ],
      why: [
        "Most of what we find has no symptoms yet: vision problems a child has adapted around, anaemia in a picky eater, blood pressure that should not be that high at fourteen, or a mood that has been sliding since autumn.",
        "This is also the one appointment where nothing is wrong, which makes it the one where there is finally room to ask about sleep, screens, eating, and behaviour without a fever taking up the time.",
      ],
      when: [
        "Follow the schedule: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, then once a year from three through twenty-one.",
        "Aim away from August if you can. Every family in the district wants a physical in the same fortnight, and a spring appointment is calmer, longer, and easier to get.",
      ],
      how: [
        "Call Southpoint or request a visit online. The reliable trick is to book the next visit before you leave this one.",
        "Bring the immunization record if you are new to us, any forms, and a written list of questions.",
      ],
      where: [
        "Come to 9071 South 1300 West, Suite 301, a couple of minutes off the 9000 South exit on I-15. From Jordan Landing the drive takes about six to nine minutes, straight east on 9000 South.",
        "If you live at the north end of the city, near 7000 South, our Cottonwood office at 301 West 5400 South in Murray is about twelve to sixteen minutes: east to I-15 and north to the 5300 South exit.",
        "For nearly everyone in West Jordan, Southpoint is the office and there is no decision to make. The exception is the north-east corner of the city, where Cottonwood is close enough that whichever has the earlier appointment is the right answer.",
      ],
    },
    riverton: {
      description:
        "Well-child visits in Riverton, Utah. Our Draper office is about nine minutes east across I-15, with Southpoint in West Jordan about twelve minutes north.",
      lead: "Riverton's nearest office is Draper, which surprises families who assume the west-side office must be closer.",
      what: [
        "We give a healthy child half an hour of undivided attention. We measure and plot growth, examine your child head to toe, test vision and hearing, complete the screening due at that age, review immunizations, and have the conversation you came for.",
        "With older children we spend part of the visit on the things a busy family never gets to: sleep, screens, food, and how school is actually going as opposed to how the grades look.",
      ],
      who: [
        "Whoever your child sees the first time is who they will see after that, wherever the schedule allows. A child seen by the same person since infancy has a chart that means something; a child seen by whoever was free has a stack of unrelated snapshots.",
        "Anything beyond the visit — a dietitian, a therapist, a specialist referral — we arrange, and it comes back to us afterwards.",
      ],
      why: [
        "Nearly everything we catch here is silent. We find curvature of the spine during a growth spurt, hearing loss behind slow speech, high blood pressure, low iron, and anxiety in a child who never complains.",
        "This is also how the vaccine schedule works in practice. It is pinned to well-child ages, so families who keep their appointments never have to think about it, and families who skip a year usually discover the gap at a school deadline.",
      ],
      when: [
        "Visits fall at birth and two weeks, at 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and then once a year to twenty-one.",
        "The annual visit covers school, sports, and camp physicals, so a spring booking gets the form signed long before the Riverton and Herriman school deadlines land in the same week.",
      ],
      how: [
        "Call either office or request a visit online. If the drive is what makes it difficult, ask for the first appointment of the day — the roads out here are quiet at that hour and we are running exactly on time.",
        "Bring the immunization record if you are new, the forms, and a written list.",
      ],
      where: [
        "Most families here come to our Draper office at 114 East 12450 South. From Riverton City Park the drive takes about nine to twelve minutes, east on 12600 South and across I-15 — a straight run with no freeway driving at all.",
        "Our Southpoint office at 9071 South 1300 West takes about eleven to fifteen minutes: north on Bangerter Highway, then east on 9000 South. It feels as though it ought to be closer because it is the west-side office, but the geography does not agree.",
        "Take Draper if you live east of Redwood Road, which is most of the city. Take Southpoint if you are in the north near 11400 South, or if your day heads toward West Jordan or Taylorsville afterwards — Bangerter moves quickly outside the rush and you end up pointed the right way.",
      ],
    },
    herriman: {
      description:
        "Well-child visits in Herriman, Utah. Our Southpoint and Draper offices are both about twenty minutes away, so it is worth booking early in the day.",
      lead: "Herriman is the farthest of our service areas from any office, which makes planning the trip part of the advice.",
      what: [
        "We cover everything preventive in one appointment, which matters more when getting here takes twenty minutes each way. We check growth, examine your child fully, test vision and hearing, complete the screening for their age, review vaccines, and answer all of your questions rather than the two you can fit in.",
        "If more than one of your children is due, tell us when you book. We would far rather see three siblings in one morning than have you make the drive three times.",
      ],
      who: [
        "You will see the same pediatrician or advanced practice provider each time you come. For a family who visits less often because of the distance, that continuity does more work than usual — the provider is holding the thread between appointments that are farther apart.",
        "We handle the referrals too, so seeing a specialist does not turn into a second set of phone calls from you.",
      ],
      why: [
        "Nothing else in a healthy child's year is designed to find what has not announced itself, and a family who comes in rarely has fewer other chances to be seen.",
        "Herriman has grown faster than almost anywhere in the state, and many families here moved from somewhere else with an incomplete record. We use the visit to rebuild that record properly rather than assume it.",
      ],
      when: [
        "Follow the recommended schedule: newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, then once a year to twenty-one.",
        "Book the first appointment of the morning. Mountain View Corridor and Bangerter both move well before eight and neither does at half past.",
      ],
      how: [
        "Book by phone or online, and do it farther ahead than a closer family would. A specific early appointment with your own provider is what makes this trip workable; whatever is left at short notice usually is not.",
        "Bring the immunization record, any forms, and your list — and ask about anything at all while you are in the room, because a phone call afterwards is a poor substitute.",
      ],
      where: [
        "Two offices are about equally far: Southpoint at 9071 South 1300 West in West Jordan, and Draper at 114 East 12450 South. They are within a minute of each other in driving time.",
        "Southpoint takes about sixteen to twenty-one minutes: north on Mountain View Corridor from around Herriman City Hall, then east on 9000 South. Draper takes about seventeen to twenty-two: east on 13400 South from the Butterfield Park side of the city, across to I-15 and one exit.",
        "The decision is really about which road you trust. Mountain View Corridor to Southpoint is the more consistent drive — fewer lights, no freeway, and rarely congested outside the school run. The Draper route is faster on a good morning but puts you on 13400 South and then onto I-15, both of which can go badly at once. From the north of Herriman, up toward 11800 South, take Southpoint; from Rosecrest or south toward Bluffdale, Draper is usually quicker. With a newborn, take Southpoint — it is the calmer road.",
      ],
    },
    bluffdale: {
      description:
        "Well-child visits in Bluffdale, Utah. Our Draper office is about ten minutes across I-15, with Southpoint in West Jordan about fifteen minutes north.",
      lead: "Bluffdale sits at the point of the mountain, and its nearest office is just up the freeway in Draper.",
      what: [
        "We check growth against your child's own curve, examine them from head to toe, test vision and hearing, complete the screening due at their age, review immunizations, and make time for whatever you have been wondering about.",
        "Because families here are split between two school districts, we are used to completing whichever form your child's school actually wants. Bring it and we will do it in the room.",
      ],
      who: [
        "One clinician looks after your child, visit after visit. That is what makes a growth chart mean something, rather than a series of numbers taken by different people.",
        "They also arrange anything further — our dietitians, our behavioral health team, or a specialist outside the practice — and follow it up at the next visit.",
      ],
      why: [
        "Being well is the condition screening depends on. Once a problem is obvious it does not need finding; the point of these visits is the year before that.",
        "For a city growing this quickly there is a second reason. Many families here are new to Utah, and we use the annual visit to turn a scattered medical history into one record that somebody is actually watching.",
      ],
      when: [
        "Come in often at first — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months — and then once a year through age twenty-one.",
        "Book the annual well before August. The sports and school physical rush lasts a fortnight and takes every appointment in the south end of the valley with it.",
      ],
      how: [
        "Call our Draper office or request a visit online. The easiest version is to book next year's before you leave this one.",
        "Bring immunization records if you are transferring in, forms that need a signature, and a written list of questions.",
      ],
      where: [
        "Head for 114 East 12450 South in Draper. From around 14600 South the drive takes about nine to thirteen minutes, north on Redwood Road and then east across I-15, or one turn off the 12300 South exit if you take the freeway instead.",
        "Our Southpoint office at 9071 South 1300 West is the alternative, about fifteen to nineteen minutes north on I-15 from the point of the mountain.",
        "Draper is the obvious choice for nearly the whole city: it is closer, the drive is short, and the office sits beside the freeway you are already on. Southpoint only makes sense if your morning takes you north anyway — toward West Jordan, Taylorsville, or the airport — in which case you are not adding a trip, you are stopping on the way.",
      ],
    },
    taylorsville: {
      description:
        "Well-child visits in Taylorsville, Utah. Our Cottonwood office is a straight run east on 5400 South, about eight minutes from Taylorsville City Hall.",
      lead: "5400 South runs from Taylorsville straight to our Cottonwood office door.",
      what: [
        "We plot your child's measurements on their own curve, examine them head to toe, test vision and hearing, complete the developmental or mental health screening for their age, review immunizations, and answer the questions you brought with you.",
        "We handle Granite District school and sports forms at the same visit. There is no need to book a separate physical.",
      ],
      who: [
        "Your child will see a pediatrician or advanced practice provider at our Cottonwood office, and the same one year after year wherever we can manage it.",
        "That provider is the hub. Referrals to our dietitians, lactation consultants and behavioral health team, or to a specialist elsewhere, all start and finish with them.",
      ],
      why: [
        "We are aiming at what has no symptoms: low iron, hearing loss, blood pressure that is too high for a fourteen-year-old, a vision problem your child has quietly worked around, or a mood that has been sliding.",
        "This is also the visit where you get to ask about the ordinary things — sleep, screens, eating, siblings, behaviour — the questions that never justify their own appointment but shape a family's year.",
      ],
      when: [
        "Come in by age rather than by how your child seems: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, then annually from three through twenty-one.",
        "For teenagers, a spring appointment is easier to get and less rushed than an August one, and the sports form lasts just as long.",
      ],
      how: [
        "Ring the office or send a request online. If mornings are hard, the last appointment of the afternoon is usually easier to get than the first of the day and works better around a school pickup.",
        "Bring the immunization record if you are new to us, the forms, and your list of questions.",
      ],
      where: [
        "Head east to 301 West 5400 South in Murray. From Taylorsville City Hall the drive takes about eight to eleven minutes, straight east on 5400 South — the same road the whole way, with no freeway and no clever route to remember.",
        "Our Salt Lake office at 3838 South 700 East takes about eleven to fifteen minutes: east on 3500 South from around Valley Fair, then south. It is the better option if your day carries on toward Sugar House or the university.",
        "For most of the city there is no real contest. Cottonwood is closer, the drive is simpler, and 5400 South is a road you already use. Salt Lake is worth it only if you live at the northern edge of Taylorsville near 3500 South, where the two are close to even.",
      ],
    },
    "west-valley-city": {
      description:
        "Well-child visits in West Valley City, Utah. Our Cottonwood office in Murray is about fifteen minutes east and Salt Lake about eighteen. We see children from birth through age 21.",
      lead: "West Valley is the largest city we serve without an office of its own, and three of ours sit within about twenty minutes.",
      what: [
        "One appointment covers everything preventive. We check growth, examine your child fully, test vision and hearing, work through the screening questionnaires due at that age, review immunizations, and have a real conversation about how your child is doing.",
        "If English is not the language you would rather have that conversation in, tell us when you book. We can arrange interpretation in advance far more easily than we can work around it in the room.",
      ],
      who: [
        "Care comes from a pediatrician or advanced practice provider who stays the same across visits. If English is not the language you would rather have that conversation in, tell us when you book and we will arrange interpretation in advance.",
        "We arrange everything else too — dietitians, lactation support, behavioral health, referrals outside the practice — rather than leaving it for you to chase.",
      ],
      why: [
        "These visits are the only structured chance we get to find what nobody has noticed. In a city with as many young families as this one, what we most often catch is hearing and vision problems, iron deficiency, and vaccine gaps that would otherwise surface at a school registration desk.",
        "They are also cheaper than the alternative in every sense. Most plans cover preventive visits with no copay; the illnesses they head off are not covered that way.",
      ],
      when: [
        "Follow the standard schedule — newborn, two weeks, 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, then once a year from three to twenty-one.",
        "We sign Granite District forms at the annual visit. If several of your children are due, book them together and make one trip of it.",
      ],
      how: [
        "Booking takes a phone call or a couple of minutes on the website. Because the drive is fifteen minutes rather than five, ask for a specific time with your own provider rather than taking whatever is next available.",
        "Bring the immunization record if you are new to us, any school forms, and your questions written down.",
      ],
      where: [
        "Two offices are in range: Cottonwood at 301 West 5400 South in Murray, and Salt Lake at 3838 South 700 East. Cottonwood takes about fourteen to nineteen minutes: south on Redwood Road from Valley Fair, then east on 5400 South. Salt Lake takes about fifteen to twenty-one: east on 3500 South, onto I-15 and south one exit.",
        "The city is big enough that the answer changes with where you live. South of 3500 South — Hunter, Granger, and the area toward Taylorsville — Cottonwood is closer and the drive is all surface streets. North of 3500 South, and especially near the Maverik Center, Salt Lake is the shorter trip and the freeway leg makes it more predictable.",
        "Southpoint at 9071 South 1300 West is the third, about seventeen to twenty-two minutes south on Bangerter Highway and east on 9000 South. From the southern edge of the city, down around 6200 South, it is closer than either of the other two.",
        "If it is genuinely even, take Cottonwood. It has more appointment slots, more parking, and the 5400 South approach avoids the I-15 merge that makes the other drive unreliable between half seven and nine.",
      ],
    },
    kearns: {
      description:
        "Well-child visits in Kearns, Utah. Our Cottonwood office is a straight run east on 5400 South, about fifteen minutes from the Utah Olympic Oval.",
      lead: "From Kearns, 5400 South runs due east to our Cottonwood office with barely a turn in it.",
      what: [
        "We check growth, examine your child head to toe, test vision and hearing, complete the developmental or mental health screening due at their age, give any immunizations that are due, and talk through what is on your mind.",
        "It is one appointment rather than several. The physical, the vaccines, and the school form all happen in the same half hour.",
      ],
      who: [
        "The same clinician sees your child year after year, so that somebody is genuinely following them rather than reading a file.",
        "If they need a dietitian, a therapist or a specialist elsewhere, we make the arrangement and stay involved.",
      ],
      why: [
        "We are looking for the things you would not bring a child in for: anaemia, hearing loss, high blood pressure, or a growth curve that has quietly flattened.",
        "It is also where vaccination stays on track without effort. Miss two years of visits and the gap usually surfaces at a school deadline; keep them and it never comes up.",
      ],
      when: [
        "The schedule is newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and one visit a year from three through twenty-one.",
        "The annual visit covers Granite District paperwork. Booking it in spring avoids the August crush entirely.",
      ],
      how: [
        "Phone the Cottonwood office or ask for a visit online. With a fifteen-minute drive, an early appointment is worth asking for — 5400 South is quick before eight and slow after.",
        "Bring the immunization record if you are new to us, any forms, and a list of your questions.",
      ],
      where: [
        "Our Cottonwood office is at 301 West 5400 South in Murray. From the Utah Olympic Oval the drive takes about thirteen to eighteen minutes, east on 5400 South the entire way — no freeway, no navigation, one road.",
        "Our Southpoint office at 9071 South 1300 West in West Jordan takes about fifteen to nineteen minutes: south on 5600 West from around Kearns High, then east on 9000 South.",
        "Our Salt Lake office at 3838 South 700 East is a third possibility, about sixteen to twenty-one minutes east to I-215 and north to the 3900 South exit. It is worth the extra few minutes only when your day already takes you to that side of the valley.",
        "Cottonwood is the simplest drive and the one most families here use, particularly with small children, because a single straight road is easier than a route with turns in it. Southpoint suits the south end of Kearns, below 6200 South, and it is the better choice any morning when 5400 South is backed up at Redwood Road.",
      ],
    },
    "salt-lake-city": {
      description:
        "Well-child visits in Salt Lake City, Utah. Our Salt Lake office at 3838 South 700 East sees children from birth through age 21, about fifteen minutes from downtown.",
      lead: "Our Salt Lake office is at 3838 South 700 East, south of the city centre and just off 3900 South.",
      what: [
        "Once a year we look at the whole child: growth on their own curve, a full physical exam, vision and hearing, the screening due at that age, immunizations, and a conversation about how things actually are at home and at school.",
        "We complete school and sports forms at the same visit, so there is no separate physical to arrange.",
      ],
      who: [
        "In a city where families move between neighbourhoods often, the constant worth keeping is the person who knows your child. A pediatrician or advanced practice provider takes the visit, and we protect that continuity.",
        "They coordinate the rest: our dietitians, our lactation consultants, our behavioral health team, and specialists outside the practice.",
      ],
      why: [
        "We find things nobody was looking for: hearing loss behind slow speech, iron deficiency, a spine curving during a growth spurt, blood pressure that should not be that high, or depression in a teenager whose grades are still fine.",
        "These visits also carry the vaccine schedule. Immunization ages are well-child ages, so families who keep the appointments never have to reconstruct where they got to.",
      ],
      when: [
        "Come in at birth and two weeks, then at 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, then annually from three through twenty-one — including every year of high school.",
        "Please keep the teenage visits. They are the ones families let slide, and they are where the mental health screening lives.",
      ],
      how: [
        "Reach us by phone or online, whichever is easier. Ask at the front desk on your way out and next year's visit is already made — the single habit that most reliably keeps a family on schedule.",
        "Bring the immunization record if you are new to us, forms that need signing, and your questions on paper.",
      ],
      where: [
        "Come to 3838 South 700 East, Suite 200. From downtown, take I-15 south to the 3900 South exit and then head east — about twelve to eighteen minutes depending on the hour.",
        "Our Cottonwood office at 301 West 5400 South in Murray takes about fifteen to twenty-one minutes and is the closer of the two if you live in the south of the city. From Sugar House Park it is straight south on 1300 East and west on 5400 South.",
        "For the Avenues, downtown, Rose Park, and the university, Salt Lake is your office, and the freeway leg makes it quicker than the map suggests. South of about 3300 South the two are close enough that whichever has your provider that week should decide. If you travel by transit rather than car, take Salt Lake — it is a much shorter walk from a bus route.",
      ],
    },
    "south-salt-lake": {
      description:
        "Well-child visits in South Salt Lake, Utah. Our Salt Lake office at 3838 South 700 East is about eight minutes away. We see children from birth through age 21.",
      lead: "South Salt Lake is closer to our Salt Lake office than almost anywhere else in the valley.",
      what: [
        "We measure and plot growth, examine your child completely, test vision and hearing, run the screening appropriate to their age, review immunizations, and answer the questions you came in with — all of it aimed at finding things before they become a problem.",
        "It is a planned half hour rather than a reaction to something, which is why it is the visit where the useful conversations actually happen.",
      ],
      who: [
        "Seeing the same clinician every visit is not administrative tidiness. It is what lets someone say with confidence that a change is a change rather than a normal variation.",
        "The rest of the practice sits behind them: dietitians, lactation support, therapists and psychologists, all reachable through the visit.",
      ],
      why: [
        "A short drive is the difference between a family who keeps every appointment and one who keeps most of them, and keeping every one is what makes the record worth having.",
        "The visits find the quiet things too — low iron, hearing loss, vision that has been slowly worsening, anxiety — none of which would bring anyone to a clinic on their own.",
      ],
      when: [
        "The schedule runs newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and then one visit a year until twenty-one.",
        "If your child is behind, come anyway. There is a catch-up schedule for every vaccine and we will build one at the visit.",
      ],
      how: [
        "A phone call or an online request is all it takes. Being this close to the office makes a same-week cancellation slot genuinely usable, so it is worth asking whether we have one.",
        "Bring the immunization record if you are new, any forms, and your list.",
      ],
      where: [
        "We are at 3838 South 700 East, Suite 200. From the Central Pointe TRAX station the drive takes about seven to ten minutes: south on State Street, then east on 3900 South.",
        "Our Cottonwood office at 301 West 5400 South in Murray takes about eleven to fifteen minutes, south on I-15 from 3300 South and off at 5300 South.",
        "There is little to decide. Salt Lake is closer from every part of the city and the drive avoids the freeway altogether. Cottonwood is the fallback when we cannot see you here soon enough, and for families near 3300 South and I-15 it is barely farther, since the freeway does the work.",
      ],
    },
    /* -------------------------------------------------- Davis County -- */
    "north-salt-lake": {
      description:
        "Well-child visits in North Salt Lake, Utah. Our Grow Up Great office in Bountiful is about ten minutes away. We see children from birth through age 21.",
      lead: "North Salt Lake's nearest office is Grow Up Great, just over the line in Bountiful.",
      what: [
        "In one appointment we check growth against your child's own history, examine them head to toe, test vision and hearing, complete the screening due at that age, review immunizations, and answer your questions.",
        "We sign Davis District school and sports forms at the same visit, so the paperwork and the medicine happen together.",
      ],
      who: [
        "A pediatrician or advanced practice provider at Grow Up Great looks after your child, and the same one from year to year.",
        "They coordinate anything else your child needs — our dietitians, our behavioral health team, or a specialist outside the practice — rather than handing you a list to work through.",
      ],
      why: [
        "What we find has usually not shown itself yet — hearing loss sitting behind slow speech, a growth curve that has flattened, low iron, blood pressure that is too high for a teenager, or anxiety in a child who is coping well on the surface.",
        "In a city that has grown as fast as North Salt Lake, these visits also do the unglamorous job of turning a scattered medical history into one record that somebody is watching.",
      ],
      when: [
        "Visits are frequent in the early years — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months — and then annual from three through twenty-one.",
        "Book the annual before the summer. Davis District physicals and the same fortnight of appointments collide every August.",
      ],
      how: [
        "Call Grow Up Great or request a visit online. The reliable habit is to book next year's on the way out of this one.",
        "Bring the immunization record if you are new to us, forms that need a signature, and a written list of questions.",
      ],
      where: [
        "Our Grow Up Great office is at 620 Medical Drive in Bountiful, on the hospital street off 500 South. From Foxboro the drive takes about eight to eleven minutes: north on Redwood Road, then east on 500 South.",
        "Our Farmington office at 491 West Bourne Circle is the second option, about fifteen to nineteen minutes north up I-15 or Legacy Parkway to the Park Lane exit.",
        "Grow Up Great is the obvious choice for the whole city, and the drive is short from any direction. Consider Farmington only if your morning already takes you north — if you work in Layton or Ogden, stopping there on the way costs less time than doubling back to Bountiful, even though the map says otherwise.",
      ],
    },
    "woods-cross": {
      description:
        "Well-child visits in Woods Cross, Utah. Our Grow Up Great office in Bountiful is about seven minutes east on 500 South. We see children from birth through age 21.",
      lead: "Woods Cross is a few minutes from Grow Up Great, straight east on 500 South.",
      what: [
        "A visit is four things: measuring, examining, screening, and talking. We plot growth on your child's own curve, examine them fully, test vision and hearing, complete the developmental or mental health screening due at that age, review immunizations, and answer the questions you brought.",
        "Nothing is squeezed. The half hour exists so that the second and third question get asked, which is usually where the useful ones are.",
      ],
      who: [
        "A clinician who has watched a child for six years reads a growth chart differently from one seeing it for the first time, so we keep your child with one of ours.",
        "They run everything else too: referrals to our dietitians, lactation consultants or behavioral health team, and to specialists outside the practice.",
      ],
      why: [
        "These visits are aimed at silence. Vision that has slowly worsened, hearing loss, anaemia in a fussy eater, and a curving spine during a growth spurt all arrive without a symptom that would send a family to the doctor.",
        "For most insurance plans they are also preventive care with no copay, which makes them the least expensive appointment your child will have all year.",
      ],
      when: [
        "Come in by age: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, then once a year from three to twenty-one.",
        "The annual visit is the school and sports physical. There is no reason to book both, and spring is easier than August for either.",
      ],
      how: [
        "Ring us or ask for a visit online. If you have more than one child due, ask to see them back to back — with a seven-minute drive, one trip is genuinely one trip.",
        "Bring immunization records if you are transferring in, the forms, and a list of questions.",
      ],
      where: [
        "Head for 620 Medical Drive, Suite 100 in Bountiful. From the Woods Cross FrontRunner station the drive takes about six to nine minutes east on 500 South, and from anywhere in the city it is under ten.",
        "Our Farmington office at 491 West Bourne Circle takes about thirteen to seventeen minutes north — onto I-15 at 1500 South and off at Park Lane.",
        "Grow Up Great is your office in every practical sense. The only real argument for Farmington is scheduling: it is a different appointment book, and if your child needs to be seen this week rather than next, it is fifteen minutes up a freeway that is usually moving.",
      ],
    },
    bountiful: {
      description:
        "Well-child visits in Bountiful, Utah. Our Grow Up Great office is at 620 Medical Drive, minutes from anywhere in the city. We see children from birth through age 21.",
      lead: "Grow Up Great is Bountiful's own office, on Medical Drive just off 500 South.",
      what: [
        "We look at your child as a whole. We plot growth against their own history, perform a complete physical exam, test vision and hearing, carry out developmental and mental health screening appropriate to their age, review immunizations, and take as long as the questions need.",
        "We also sign school, sports, camp, and mission forms at the same appointment, so you do not need a separate visit for paperwork.",
      ],
      who: [
        "Many Bountiful families have stayed with the same provider across two or three children. Your child will see a pediatrician or advanced practice provider at Grow Up Great, year after year.",
        "That accumulated familiarity is a real clinical asset rather than a nicety. Anything beyond the visit runs through them: dietitians, lactation support, therapists, psychologists doing testing, and referrals outside the practice.",
      ],
      why: [
        "Nearly everything we catch here is asymptomatic — a murmur worth a second listen, low iron, hearing loss, a spine starting to curve, or a low mood that has not yet become a crisis.",
        "These visits are also where the relationship gets built. A sixteen-year-old will talk to a doctor they have known since preschool in a way they will not talk to a stranger in an urgent care room, and that is bought one ordinary appointment at a time.",
      ],
      when: [
        "Come in at birth and two weeks, then at 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, then once a year from three through twenty-one.",
        "The 30-month visit and the teenage visits are the two families skip most often, and both are among the most useful — one for speech and social development, the other for mental health.",
      ],
      how: [
        "Call us, request a visit online, or book at the front desk before you leave. Being minutes away makes a short-notice cancellation slot practical, so it is always worth asking.",
        "Bring the immunization record if you are new to us, any forms, and your questions written down.",
      ],
      where: [
        "Come to 620 Medical Drive, Suite 100 — the hospital street off 500 South, about four minutes from most of Bountiful, with parking at the door.",
        "Our Farmington office at 491 West Bourne Circle is about twelve to sixteen minutes north on I-15 to the Park Lane exit, and it is the sensible fallback when we cannot fit you in here.",
        "For Bountiful there is no decision worth making. Grow Up Great is in your city, it is the office your neighbours use, and every route to it is short. Farmington matters only for timing — if you need to be seen sooner, or you work north and would rather stop on the way than turn around.",
      ],
    },
    centerville: {
      description:
        "Well-child visits in Centerville, Utah. Our Grow Up Great office in Bountiful is about eight minutes south and Farmington about twelve minutes north.",
      lead: "Centerville sits between our two Davis County offices, one exit of I-15 in either direction.",
      what: [
        "In one appointment we check growth, examine your child fully, test vision and hearing, complete the screening due at that age, review immunizations, and have the conversation you came for.",
        "We sign Davis District forms at the annual visit, which for most families is the practical reason the appointment gets made at all.",
      ],
      who: [
        "The chart follows the child, and so does the person reading it — a pediatrician or advanced practice provider who stays the same across visits.",
        "They arrange anything further: dietitians, lactation consultants, behavioral health, or a specialist elsewhere.",
      ],
      why: [
        "Nothing else is designed for a well child, which makes this the only appointment that finds problems before they declare themselves.",
        "For families with several children, the annual visits are also the mechanism that keeps everybody's vaccinations aligned. Miss a couple of years across three children and the reconstruction is a job; keep them and it never becomes one.",
      ],
      when: [
        "Visits fall at birth and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and once a year after that until twenty-one.",
        "If your children are due within a few months of each other, pull them into one appointment block. From Centerville that turns two drives into one.",
      ],
      how: [
        "Either office takes bookings by phone or online. Tell us which you would prefer and which you would accept — with both within about a quarter of an hour, being flexible usually gets you a better time.",
        "Bring the immunization record if you are new, forms, and a written list of questions.",
      ],
      where: [
        "You can come to our Grow Up Great office at 620 Medical Drive in Bountiful or our Farmington office at 491 West Bourne Circle. Centerville is one of the few cities where both are genuinely close.",
        "Grow Up Great takes about seven to ten minutes: south on Main Street from Founders Park, then west on 500 South. Farmington takes about ten to fourteen: north on I-15 from Parrish Lane, one exit to Park Lane, behind Station Park.",
        "South of Parrish Lane, take Bountiful — it is closer, and the surface route is quicker than joining the freeway for a single exit. North of Parrish Lane, take Farmington, particularly if you are combining the visit with anything at Station Park, which is thirty seconds from our door. If your child needs a same-week appointment, ask both: two nearby offices means two appointment books, and that is the real advantage of living here.",
      ],
    },
    farmington: {
      description:
        "Well-child visits in Farmington, Utah. Our Farmington office is at 491 West Bourne Circle, just off Park Lane behind Station Park. We see children from birth through age 21.",
      lead: "Our Farmington office is behind Station Park, a few minutes from anywhere in the city.",
      what: [
        "We see the whole child in one sitting. We plot measurements on your child's own growth curve, examine them head to toe, test vision and hearing, complete the screening due at that age, review immunizations, and leave time for your questions.",
        "School, sports, camp, and mission forms are part of the same visit. Bring them and they go home signed.",
      ],
      who: [
        "One of the pediatricians or advanced practice providers here in Farmington sees your child, and we hold that steady across the years, so that somebody is genuinely watching rather than reading a file.",
        "The rest of the practice sits behind them — dietitians, lactation consultants, therapists and psychologists — reachable through the visit rather than through a separate process.",
      ],
      why: [
        "What we find is usually quiet: a flattening growth curve, hearing loss behind slow speech, high blood pressure at fourteen, iron deficiency, a curving spine, or low mood in a child who is still functioning well.",
        "These visits also carry the vaccine schedule, which is pinned to well-child ages. Keep the appointments and your child stays protected without anyone having to track it.",
      ],
      when: [
        "We see your child at birth and two weeks, then at 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and once a year from three through twenty-one.",
        "Book the annual visit outside July and August if you can. The physical is valid just as long and the appointment is longer and calmer.",
      ],
      how: [
        "Call us, request a visit online, or book at the front desk on your way out. Being off Park Lane makes this office unusually easy to fit into an errand — the visit does not have to be the only reason you are out.",
        "Bring immunization records if you are new to us, any forms, and your list.",
      ],
      where: [
        "Come to 491 West Bourne Circle, Suite 1, just off Park Lane behind Station Park — about four to six minutes from most of Farmington, and a straight run from the FrontRunner station if you are coming by train.",
        "Our Grow Up Great office at 620 Medical Drive in Bountiful is about twelve to sixteen minutes south on I-15, off at 500 South.",
        "Farmington is your office and there is not much to weigh. Call Bountiful when you need an appointment sooner than we can offer here, or when your day is heading south anyway — the freeway run is quick outside the rush, and it is the same practice, the same records, and often the same provider.",
      ],
    },
    kaysville: {
      description:
        "Well-child visits in Kaysville, Utah. Our Farmington office is about nine minutes south on Highway 89 or I-15. We see children from birth through age 21.",
      lead: "Kaysville families are a short run down Highway 89 or I-15 from our Farmington office.",
      what: [
        "We check growth against your child's own curve, examine them head to toe, test vision and hearing, complete the developmental or mental health screening due at that age, review immunizations, and answer the questions you brought with you.",
        "One appointment covers all of it, including the school and sports forms, which is the difference between a morning out and two.",
      ],
      who: [
        "Continuity is what turns a chart into a story rather than a set of numbers, so your child sees the same pediatrician or advanced practice provider from visit to visit.",
        "They also arrange a dietitian, a therapist or a referral outside the practice, and follow it up next time you are in.",
      ],
      why: [
        "The findings here are ones nobody has noticed: anaemia, hearing loss, a spine beginning to curve, blood pressure that is too high, or a mood that has been slipping since autumn.",
        "In a town where a lot of children play a lot of sport, these visits are also the only routine chance to talk about training load, old head injuries, and eating properly for growth rather than for performance.",
      ],
      when: [
        "Follow the schedule: newborn and two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and annually from three through twenty-one.",
        "If your child plays for Davis or Farmington High, a spring appointment gets the form signed and the conversation had months before the season starts.",
      ],
      how: [
        "Call our Farmington office or request a visit online. Ask for a morning slot if the drive matters to you — southbound I-15 out of Kaysville is fine early and much less so at half past eight.",
        "Bring the immunization record if you are new, forms that need signing, and your questions on paper.",
      ],
      where: [
        "We are at 491 West Bourne Circle, Suite 1, behind Station Park. From Kaysville Main Street the drive takes about eight to eleven minutes, and you can take either Highway 89 or I-15 south to Park Lane depending on which side of town you start from.",
        "Our Grow Up Great office at 620 Medical Drive in Bountiful is about sixteen to twenty-one minutes farther south on I-15, off at 500 South.",
        "Farmington is the sensible choice by a wide margin — half the drive, and the office is right off the road you are already on. Bountiful is a real option only when we cannot see you in Farmington soon enough. From the east side of Kaysville the Highway 89 approach is faster still, so take that over the freeway when it suits you.",
      ],
    },
    layton: {
      description:
        "Well-child visits in Layton, Utah. Our Farmington office is about twelve minutes south on I-15. We see children from birth through age 21.",
      lead: "Layton is the northern edge of what we serve, two exits up I-15 from our Farmington office.",
      what: [
        "One appointment covers everything preventive: we measure and plot growth, examine your child completely, test vision and hearing, complete the screening due at their age, review immunizations, and make time to talk through whatever has been on your mind.",
        "Because the drive is longer than most of our families make, we would rather you brought every question you have than saved some for a phone call.",
      ],
      who: [
        "One provider across the years is what lets the relationship survive the gaps between visits, and from Layton those gaps are longer than most.",
        "We also coordinate anything further — our dietitians, our behavioral health team, or a specialist elsewhere — so a referral does not become a second project for you.",
      ],
      why: [
        "Screening only works while a child is still well. Hearing loss, vision problems, anaemia, a curving spine, high blood pressure, and anxiety are all compatible with a child who seems entirely fine.",
        "If you have moved to Layton from elsewhere, and many families have, the annual visit is also where an incomplete history becomes a proper record.",
      ],
      when: [
        "The schedule is newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and then one visit a year from three to twenty-one.",
        "Book farther ahead than you think you need to. A specific time with your own provider is what makes a twelve-minute drive worth doing; whatever is left at short notice usually is not.",
      ],
      how: [
        "Call our Farmington office or request a visit online, and ask us to stack siblings into one morning if more than one is due.",
        "Bring immunization records if you are transferring in, any forms, and your list of questions.",
      ],
      where: [
        "Our Farmington office sits at 491 West Bourne Circle, Suite 1, behind Station Park. From Layton Hills Mall the drive takes about eleven to fifteen minutes, two exits south on I-15 to Park Lane.",
        "Our Grow Up Great office at 620 Medical Drive in Bountiful is about nineteen to twenty-five minutes from Antelope Drive, which is a long way to go past a closer office.",
        "Farmington is the answer for the whole city. The only thing worth planning around is the hour: southbound I-15 from Layton is slow between about seven and nine, so a first-thing appointment can take twelve minutes and a nine o'clock one can take twenty-five. From west Layton, the Legacy Parkway approach avoids the worst of it.",
      ],
    },
    /* --------------------------------------- Summit & Wasatch County -- */
    "park-city": {
      description:
        "Well-child visits in Park City, Utah. Our Summit office is at Quinn's Junction next to the hospital. We see children from birth through age 21.",
      lead: "Our Summit office is at Quinn's Junction, where SR-248 meets US-40, next to the hospital.",
      what: [
        "We check growth, development, vision, and hearing, examine your child head to toe, complete the screening due at their age, and review immunizations. In Park City we also cover things the rest of the valley rarely raises: altitude and hydration, head injuries and how many is too many, and how children who train seriously from a young age are eating.",
        "Tell us about any concussion, even an old one. We keep that history in one place so that somebody is still looking at it in three years.",
      ],
      who: [
        "In a town this size, a provider who has watched the same child ski, grow, get hurt and recover is easy to take for granted and hard to replace. Your child sees a pediatrician or advanced practice provider here at Summit, across the years rather than one winter at a time.",
        "When something needs more than a well-child visit — imaging, sports medicine, a psychologist for testing — we arrange it and follow it up.",
      ],
      why: [
        "Fitness is an excellent disguise. A child who skis all winter and rides all summer can be anaemic, under-fuelled, sleeping badly, or quietly anxious, and none of it will show on the hill.",
        "These visits are the one appointment a healthy, active child is guaranteed to have, and they are where we notice the things a season of activity has been hiding.",
      ],
      when: [
        "Visits come at birth and two weeks, then at 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, and yearly from three through twenty-one.",
        "If your year runs on the ski season, book the annual visit for late spring or early autumn — after the lifts close or before they open, when neither your family nor the office is at its busiest.",
      ],
      how: [
        "Call our Summit office or request a visit online, and book the next one before you leave. That habit is worth more here than most places, because the calendar fills around the season rather than around the school year.",
        "Bring the immunization record if you are new to us, school or team forms, and a note of any injuries from the winter — including the ones that never quite justified a visit at the time.",
      ],
      where: [
        "Come to 750 Round Valley Drive, Suite 102, at Quinn's Junction beside the hospital where SR-248 meets US-40. From Old Town the drive takes about eight to twelve minutes; from Kimball Junction it is closer to twenty, and the whole way is on roads that get cleared early.",
        "The nearest office off the mountain is Willow Creek at 7138 South Highland Drive, about thirty-five to forty-five minutes down Parley's Canyon on I-80 and then south on I-215.",
        "For a well-child visit, use Summit. It is your office, and there is no reason to drive a canyon for a routine appointment. Willow Creek is worth knowing about for a different reason: if you work down in the valley, an appointment near the end of your day there can be easier than a mid-morning one up here. Check the canyon before you commit to that drive either way.",
      ],
    },
    "heber-city": {
      description:
        "Well-child visits in Heber City, Utah. Our Summit office at Quinn's Junction is about twenty-five minutes north on US-40. We see children from birth through age 21.",
      lead: "Heber is a straight run north on US-40 to our Summit office at Quinn's Junction.",
      what: [
        "Everything happens in one appointment, which matters when the round trip is the better part of an hour: we check growth, examine your child completely, test vision and hearing, complete the developmental or mental health screening due at that age, review immunizations, and answer the questions you came with.",
        "If more than one of your children is due, tell us when you book and we will put them together.",
      ],
      who: [
        "For families who come from farther away and therefore see us less often, continuity carries more weight, not less. One pediatrician or advanced practice provider sees your child at every visit.",
        "They also arrange anything beyond the visit and follow it up the next time you are in.",
      ],
      why: [
        "This appointment is built to find what has no symptoms, and a family who lives farther from care has fewer incidental chances to be seen.",
        "It also keeps immunizations on schedule without anyone tracking them, and puts a growing, active child's history in one place rather than spread across whoever was nearest at the time.",
      ],
      when: [
        "Follow the standard schedule: newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months, then annually from three to twenty-one.",
        "Book early in the day and early in the year. US-40 over Silver Creek is quick in good weather and slow in bad, and a morning appointment gives you the best of it.",
      ],
      how: [
        "Book by phone or through the website, and ask for a specific time with your own provider rather than the next available. With a twenty-five minute drive, a well-chosen appointment is worth waiting an extra fortnight for.",
        "Bring the immunization record if you are new to us, forms that need signing, and every question you have. A phone call afterwards is a poor substitute for being in the room.",
      ],
      where: [
        "Come to our Summit office at 750 Round Valley Drive, Suite 102, at Quinn's Junction. The drive takes about twenty to twenty-seven minutes north on US-40 over Silver Creek, and because the office sits where SR-248 meets the highway, you never have to go into Park City to reach it.",
        "The alternative is a long way farther: our Willow Creek office at 7138 South Highland Drive is about fifty to sixty minutes, north on US-40 to I-80, down Parley's Canyon and south on I-215.",
        "For a routine visit, Summit is the only sensible choice — less than half the drive and none of it through a canyon. Consider the valley offices only if your work already takes you down there regularly, in which case an appointment at the end of a workday costs you nothing extra. In winter, always take the US-40 route rather than planning around Parley's.",
      ],
    },
    kamas: {
      description:
        "Well-child visits in Kamas, Utah. Our Summit office at Quinn's Junction is about twenty minutes west on SR-248. We see children from birth through age 21.",
      lead: "From the Kamas Valley it is about twenty minutes west over Browns Canyon to our Summit office.",
      what: [
        "We do everything in one appointment, because one appointment has to do the work of several out here. We check growth against your child's own history, examine them fully, test vision and hearing, complete the screening due at that age, review immunizations, and leave time to talk.",
        "For families in the Kamas Valley we also use the visit to cover the practical things that come with living farther out — what to do about an injury at the weekend, when a fever is worth the drive, and what we can handle over the phone.",
      ],
      who: [
        "Distance makes continuity matter more, not less: the person seeing your child is holding the thread across appointments that are farther apart than most families'. That is one pediatrician or advanced practice provider at Summit, visit after visit.",
        "We arrange anything further and follow it up rather than leaving it with you.",
      ],
      why: [
        "These visits find what nobody would drive twenty minutes to report — slow speech masking a hearing loss, a growth curve flattening, low iron, a spine starting to curve, or a teenager who has quietly stopped enjoying anything.",
        "For a rural family this is often the only regular contact with the practice at all, which is exactly why it is worth keeping.",
      ],
      when: [
        "Come in often in the first two and a half years — newborn, two weeks, then 1, 2, 4, 6, 9, 12, 15, 18, 24, and 30 months — and then once a year through twenty-one.",
        "Plan around the weather rather than the calendar. SR-248 over Browns Canyon is straightforward most of the year and worth avoiding in a storm, so autumn and spring appointments are the easiest to keep.",
      ],
      how: [
        "Call our Summit office or request a visit online. If you have several children, book them into one block — the drive is the expensive part of the visit, not the visit.",
        "Bring the immunization record if you are new, any forms, and a written list of everything you meant to ask.",
      ],
      where: [
        "Our Summit office is at 750 Round Valley Drive, Suite 102, at Quinn's Junction. The drive takes about eighteen to twenty-four minutes west on SR-248 over Browns Canyon, and because the office sits at the junction with US-40 you arrive without driving through Park City at all.",
        "The nearest valley office is a long way past that: our Salt Lake office at 3838 South 700 East is roughly fifty-five to seventy minutes, north to I-80, down Parley's Canyon and south on I-215.",
        "There is no real choice to make for a routine visit — Summit is a quarter of the drive on the road you already use. Knowing the valley offices exist matters for scheduling and weather: if SR-248 is closed or we are booked out at Summit, an office in the valley is the same practice with the same records, and it is worth asking rather than skipping the year.",
      ],
    },
  },
};
