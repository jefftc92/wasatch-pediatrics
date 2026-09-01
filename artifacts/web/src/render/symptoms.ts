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

  const others = symptoms
    .filter((other) => other.slug !== symptom.slug)
    .map(
      (other) =>
        `<li><a href="${symptomHref(other)}">${escapeAttribute(other.title)}</a></li>`,
    )
    .join("");

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
				<h2 class="dent-band-title">${escapeAttribute(introHeading(symptom))}</h2>
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
				<p class="sym-tool-lead">Answer these and you will get a straight recommendation — care at home, an appointment, or urgent care. They are written and kept current by the American Academy of Pediatrics.</p>
				<iframe title="${escapeAttribute(symptom.title)} — Symptom Checker, from the American Academy of Pediatrics" class="sc-frame" src="${escapeAttribute(aapFrameUrl(symptom))}" width="800" height="2200" loading="lazy"></iframe>
				<p class="sc-note">From the <a href="${escapeAttribute(aapPageUrl(symptom))}" target="_blank" rel="noopener">American Academy of Pediatrics</a>. If it will not load, or the questions run past the bottom, <a href="${escapeAttribute(aapPageUrl(symptom))}" target="_blank" rel="noopener">open it on their site</a>.</p>
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
				<h2 class="svc-index-title">Other symptoms</h2>
				<ul class="area-group">${others}</ul>
			</div>
		</div>
	</div>
</div>`;
}

/**
 * The heading over our own words.
 *
 * "What the American Academy of Pediatrics advises" was the heading here, over
 * a paragraph explaining why the tool is embedded rather than copied — which is
 * this project's reasoning, not a worried parent's question. The heading now
 * asks what they came to ask, in the words they would use.
 */
function introHeading(symptom: Symptom): string {
  const subject = symptom.title
    .replace(/ in (Children|Babies|Newborns)$/i, "")
    .replace(/^A /, "");
  return /^(Reactions|Jaundice|Hives|Nosebleeds|Headaches|Colds|Rashes|Insect|Tick|Asthma|Immunization)/i.test(subject)
    ? `About ${subject.toLowerCase()}`
    : `What ${subject.toLowerCase()} usually means`;
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

/** The list of symptom pages, for the Symptom Checker page to carry. */
export function symptomIndexList(): string {
  return symptoms
    .map(
      (symptom) =>
        `<li><a href="${symptomHref(symptom)}">${escapeAttribute(symptom.title)}</a></li>`,
    )
    .join("");
}
