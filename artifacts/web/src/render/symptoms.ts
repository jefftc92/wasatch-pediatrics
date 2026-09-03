/**
 * A page per symptom: our words, the AAP's guidance, our next step.
 *
 * The Symptom Checker is embedded rather than copied because the AAP keeps it
 * current — a threshold they revise this year should change on this site the
 * same day, and it cannot do that from a file in this repository. Their viewer
 * takes the topic as a query parameter, so each page opens the frame at its own
 * symptom instead of at the index.
 *
 * What that leaves for us is the half a frame cannot do. A cross-origin frame
 * is invisible to a search engine and silent about this practice: it does not
 * know we hold same-day appointments, that most offices run After Hours Care,
 * or that a nurse answers the office number at three in the morning. The
 * introduction and the closing section carry both jobs — the words that make
 * the page findable, and the ones that tell a parent where to take the problem.
 *
 * The closing section is deliberately the same on every page. It is routing,
 * not content, and the differentiation lives in the introductions, which are
 * written one at a time in `symptoms.ts`.
 */

import { symptoms, type Symptom } from "../data/symptoms.ts";
import { symptomTerms } from "../data/symptomTerms.ts";
import { escapeAttribute, SITE, type GeneratedPage } from "./generated.ts";
import type { Crumb } from "./generated.ts";

const CHECKER = "/symptom-checker/";

/** The AAP's viewer, opened at one topic. `key` is the practice's own embed. */
export function aapFrameUrl(symptom: Symptom): string {
  const base =
    "https://www.healthychildren.org/English/tips-tools/symptom-checker/IFrame/Pages/symptomviewer.aspx";
  const query = new URLSearchParams({
    symptom: symptom.aap,
    style: "iframe",
    key: "3E16EA89-5AEB-4342-8B5B-E0503CA3D59A",
  });
  return `${base}?${query.toString()}`;
}

/** The same topic on the AAP's own site, for when the frame will not load. */
export function aapPageUrl(symptom: Symptom): string {
  const query = new URLSearchParams({ symptom: symptom.aap });
  return `https://www.healthychildren.org/English/tips-tools/symptom-checker/Pages/default.aspx?${query.toString()}`;
}

export function symptomHref(symptom: Symptom): string {
  return `${CHECKER}${symptom.slug}/`;
}

/* ------------------------------------------------------------ the page -- */

function crumbs(symptom: Symptom): Crumb[] {
  return [{ name: "Symptom Checker", href: CHECKER }, { name: symptom.title }];
}

/**
 * The title band. The same photographic hero the symptom checker page already
 * uses, so a symptom page reads as part of it rather than as a stray page, with
 * the trail sitting on the wash the way it does on every other generated page.
 */
function heroBand(symptom: Symptom): string {
  const trail = [
    `<li><a href="/">Home</a></li>`,
    `<li><a href="${CHECKER}">Symptom Checker</a></li>`,
    `<li>${escapeAttribute(symptom.title)}</li>`,
  ].join("");

  return `<div class="dent-hero sym-hero">
	<img class="dent-hero-img" src="/wp-content/uploads/2022/05/WAS21-0020_Website_Header_Symptom-Checker_v1.jpg" alt="" aria-hidden="true" width="1536" height="1024" loading="eager" decoding="async" />
	<div class="dent-hero-wash"></div>
	<div class="container dent-hero-inner">
		<nav class="crumbs hero-crumbs" aria-label="Breadcrumb"><ol>${trail}</ol></nav>
		<p class="dent-hero-eyebrow">Symptom Checker</p>
		<h1 class="dent-hero-title">${escapeAttribute(symptom.title)}</h1>
		<p class="dent-hero-lead">${escapeAttribute(symptom.lead)}</p>
		<p class="dent-hero-act"><a class="btn dent-hero-ghost" href="${CHECKER}">All symptoms</a></p>
	</div>
</div>`;
}

function renderSymptomPage(symptom: Symptom): string {
  const intro = symptom.intro
    .map((p) => `\t\t\t\t\t<p>${escapeAttribute(p)}</p>`)
    .join("\n");

  /*
   * The rest of this symptom's own group, not all 163 others. Listing every
   * page ran to seven thousand pixels on a phone — more than twice the rest
   * of the page — and put the same block on all 164, which helps nobody
   * reading and says nothing to a search engine. Neighbours in the group are
   * the pages a parent might actually have wanted instead of this one.
   */
  const NEIGHBOURS = 11;
  const siblings = symptoms.filter(
    (other) => other.group === symptom.group && other.slug !== symptom.slug,
  );
  const others = siblings
    .slice(0, NEIGHBOURS)
    .map(
      (other) =>
        `<li><a href="${symptomHref(other)}">${escapeAttribute(other.title)}</a></li>`,
    )
    .join("");
  const moreInGroup = siblings.length > NEIGHBOURS;

  return `${heroBand(symptom)}
<div class="sym-alert">
	<div class="container">
		<p><strong>If your child is struggling to breathe, cannot be woken, is having a seizure, or is badly hurt — call 911 now.</strong> For anything else, our nurse line answers on your office&#8217;s own number, at any hour.</p>
	</div>
</div>
<div class="whitebg padme90 sym-intro">
	<div class="container">
		<div class="row">
			<div class="col-lg-9">
				<h2 class="dent-band-title">${escapeAttribute(symptom.heading)}</h2>
				<div class="pagebody" style="margin-top:0px">
${intro}
				</div>
			</div>
		</div>
	</div>
</div>
<div class="graybg padme90 sym-tool">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="dent-band-title">Should my child be seen?</h2>
				<p class="sym-tool-lead">The American Academy of Pediatrics keeps a decision tool for this. Work through its questions — how your child looks, how long this has run, what has changed since it started — and it ends on one of three answers: care for your child at home, book an appointment, or seek care now. Most parents finish in about a minute.</p>
				<div class="sym-embed">
					<p class="sym-embed-bar">
						<span class="sym-embed-name">AAP Symptom Checker<span class="sym-embed-topic">${escapeAttribute(symptom.short)}</span></span>
						<span class="sym-embed-acts">
							<button type="button" class="sym-embed-grow" data-sym-frame="${escapeAttribute(aapFrameUrl(symptom))}" data-sym-title="${escapeAttribute(symptom.title)} — Symptom Checker, from the American Academy of Pediatrics" hidden>Full screen<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 2.5H2.5V6M10 2.5h3.5V6M6 13.5H2.5V10M10 13.5h3.5V10"></path></svg></button>
							<a class="sym-embed-open" href="${escapeAttribute(aapPageUrl(symptom))}" target="_blank" rel="noopener">New tab<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3h7v7M13 3L6.5 9.5M11 9.5V13H3V5h3.5"></path></svg></a>
						</span>
					</p>
					<iframe class="sym-embed-frame" title="${escapeAttribute(symptom.title)} — Symptom Checker, from the American Academy of Pediatrics" src="${escapeAttribute(aapFrameUrl(symptom))}" loading="lazy"></iframe>
				</div>
				<dialog class="sym-modal" aria-label="Symptom Checker: ${escapeAttribute(symptom.short)}">
					<div class="sym-modal-bar">
						<span class="sym-embed-name">Symptom Checker<span class="sym-embed-topic">${escapeAttribute(symptom.short)}</span></span>
						<span class="sym-embed-acts">
							<a class="sym-embed-open" href="${escapeAttribute(aapPageUrl(symptom))}" target="_blank" rel="noopener">New tab<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3h7v7M13 3L6.5 9.5M11 9.5V13H3V5h3.5"></path></svg></a>
							<button type="button" class="sym-modal-close" data-sym-close>Close<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8"></path></svg></button>
						</span>
					</div>
					<div class="sym-modal-body"></div>
				</dialog>
			</div>
		</div>
	</div>
</div>
<div class="whitebg padme90 sym-next">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="dent-band-title">Getting your child seen</h2>
				<ul class="sc-routes">
					<li><strong>Talk to a nurse now, at any hour.</strong> Call your office&#8217;s main number — nights, weekends and holidays included. You will reach a nurse or a physician, not an answering service.</li>
					<li><strong>Be seen today.</strong> Every office keeps <a href="/medical-care/sick-visits/">same-day appointments</a> for illness and injury.</li>
					<li><strong>This evening or at the weekend.</strong> Most offices run <a href="/medical-care/after-hours-care/">After Hours Care</a>. It is by appointment rather than walk-in, and the hours differ by office.</li>
				</ul>
				<p class="sc-trust">If you are worried, call. We would rather answer a question that turns out to be nothing than have you sit up all night deciding whether it was.</p>
				<p class="area-office-act"><a class="btn blue" href="/medical-care/sick-visits/">Same-day sick visits</a> <a class="btn blue" href="/locations/">Find your office</a></p>
			</div>
		</div>
	</div>
</div>
<div class="graybg padme90 svc-index sym-others">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="svc-index-title">More on ${escapeAttribute(symptom.group.toLowerCase())}</h2>
				<ul class="area-group">${others}</ul>
				<p class="sym-others-all"><a href="${CHECKER}">${moreInGroup ? "See the rest of this group and all 164 symptoms" : "See all 164 symptoms"}</a></p>
			</div>
		</div>
	</div>
</div>`;
}

/* ---------------------------------------------------------- structured -- */

function symptomSchema(symptom: Symptom): object[] {
  return [
    {
      "@type": "MedicalWebPage",
      "@id": `${SITE}${symptomHref(symptom)}#page`,
      url: SITE + symptomHref(symptom),
      name: symptom.title,
      description: symptom.description,
      inLanguage: "en-US",
      audience: { "@type": "MedicalAudience", audienceType: "Parent" },
      about: { "@type": "MedicalSignOrSymptom", name: symptom.title },
      /*
       * The clinical guidance on this page is the AAP's, shown in their own
       * frame. Citing it is both accurate and the honest way to describe a
       * page whose advice is somebody else's work.
       */
      citation: {
        "@type": "WebPage",
        name: `${symptom.aap} — Symptom Checker`,
        publisher: {
          "@type": "Organization",
          name: "American Academy of Pediatrics",
        },
        url: aapPageUrl(symptom),
      },
      publisher: {
        "@type": "MedicalClinic",
        name: "Wasatch Pediatrics",
        url: `${SITE}/`,
      },
      significantLink: [
        `${SITE}/medical-care/sick-visits/`,
        `${SITE}/medical-care/after-hours-care/`,
        `${SITE}/locations/`,
      ],
    },
  ];
}

/* ----------------------------------------------------------- documents -- */

export function symptomDocument(
  symptom: Symptom,
): GeneratedPage & { route: string } {
  return {
    route: symptomHref(symptom),
    title: `${symptom.title} - Wasatch Pediatrics`,
    description: symptom.description,
    bodyClass:
      "wp-singular page-template page-template-page-flex-hero page wp-theme-wasatch",
    menu: {
      classes: {
        "144":
          "menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item current_page_item menu-item-144",
      },
      currentIds: ["144"],
    },
    breadcrumbs: crumbs(symptom),
    content: renderSymptomPage(symptom),
    extraSchema: symptomSchema(symptom),
  };
}

export function symptomRoutes(): Array<GeneratedPage & { route: string }> {
  return symptoms.map(symptomDocument);
}

/**
 * The index on the Symptom Checker page.
 *
 * This is the page's main job, so it is a set of grouped tiles rather than a
 * list of links: twenty-eight titles that all end in "in Children" is a wall
 * nobody reads, and a parent arriving here already knows the child is theirs.
 * The groups are how somebody with a sick child actually narrows down — by
 * what they can see or hear, not alphabetically.
 */
/*
 * The twelve a parent is likeliest to arrive with. They sit above the full
 * list so that the common case never involves scrolling: on mobile the
 * grouped list alone runs close to nine thousand pixels.
 */
const COMMON = [
  "fever",
  "cough",
  "vomiting",
  "diarrhea",
  "rash",
  "sore-throat",
  "earache",
  "colds",
  "stomach-pain",
  "head-injury",
  "croup",
  "pink-eye",
];

/** Everything a tile can be found by, for the type-to-filter box. */
function tileTerms(symptom: Symptom): string {
  const words = [
    symptom.short,
    symptom.title,
    symptom.aap,
    symptom.group,
    ...(symptomTerms[symptom.slug] ?? []),
  ]
    .join(" ")
    .toLowerCase()
    // Apostrophes first, so "won't" collapses to "wont" rather than
    // splitting into "won" and a stray "t" that matches nothing.
    .replace(/['\u2018\u2019]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return [...new Set(words)].join(" ");
}

function tile(symptom: Symptom): string {
  return `<li data-terms="${escapeAttribute(tileTerms(symptom))}"><a href="${symptomHref(symptom)}">${escapeAttribute(symptom.short)}</a></li>`;
}

export function symptomIndexList(): string {
  /*
   * Commonest first, not alphabetical. A parent scanning at two in the morning
   * is far likelier to want a fever or a cough than a tick bite, and the order
   * should follow that rather than the letter a group starts with. Any group
   * missing from this list falls to the end, so adding a symptom can never
   * silently drop its group off the page.
   */
  const GROUP_ORDER = [
    "Fever and infection",
    "Coughs and breathing",
    "Stomach and bowels",
    "Skin and rashes",
    "Ears, nose, mouth and teeth",
    "Eyes",
    "Knocks, pain and injuries",
    "Bites and stings",
    "Babies and newborns",
    "Feeding and growth",
    "Peeing and private parts",
    "Feelings and mental health",
    "Growing up",
  ];

  const byGroup = new Map<string, typeof symptoms>();
  for (const symptom of symptoms) {
    if (!byGroup.has(symptom.group)) byGroup.set(symptom.group, []);
    byGroup.get(symptom.group)!.push(symptom);
  }
  const order = [...byGroup.keys()].sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a);
    const bi = GROUP_ORDER.indexOf(b);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });

  const bySlug = new Map(symptoms.map((s) => [s.slug, s]));
  const common = COMMON.map((slug) => bySlug.get(slug)).filter(Boolean) as Symptom[];

  const groups = order
    .map((group) => {
      const list = byGroup.get(group)!;
      return `<div class="sym-group">
							<h3 class="sym-group-title">${escapeAttribute(group)} <span class="sym-group-count">${list.length}</span></h3>
							<ul class="sym-tiles">${list.map(tile).join("")}</ul>
						</div>`;
    })
    .join("\n\t\t\t\t\t\t");

  return `<div class="sym-find">
						<label class="sym-find-label" for="sym-find-input">Type what you are seeing</label>
						<div class="sym-find-box">
							<svg class="sym-find-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6"></circle><path d="M13.5 13.5L18 18"></path></svg>
							<input id="sym-find-input" class="sym-find-input" type="search" autocomplete="off" placeholder="throwing up, rash, ear, hit head&#8230;">
							<button type="button" class="sym-find-clear" hidden>Clear<span class="visually-hidden"> the search</span></button>
						</div>
						<p class="sym-find-hint">Everyday words work: &#8220;throwing up&#8221;, &#8220;poop&#8221;, &#8220;bug bite&#8221;, &#8220;temperature&#8221;.</p>
						<p class="sym-find-count" role="status" aria-live="polite"></p>
					</div>
					<div class="sym-group sym-common">
						<h3 class="sym-group-title">Most looked up</h3>
						<ul class="sym-tiles">${common.map(tile).join("")}</ul>
					</div>
					<div class="sym-browse">
						<h3 class="sym-browse-title">Or browse all ${symptoms.length}</h3>
						${groups}
					</div>
					<div class="sym-none" hidden>
						<p class="sym-none-lead">Nothing here matches that word.</p>
						<p>Try a plainer one &#8212; &#8220;rash&#8221; rather than the name of a rash, &#8220;tummy&#8221; rather than where it hurts. If you would rather just ask someone, call your office and a nurse will answer, whatever the hour.</p>
						<p class="area-office-act"><a class="btn blue" href="/locations/">Find your office</a></p>
					</div>`;
}
