/**
 * Migrated dentistry copy, rendered in this site's vocabulary.
 *
 * The dentistry site is a separate build with its own design language — Tailwind
 * cards, an icon set, its own type scale. What crosses over is the words, their
 * structure, and the photography.
 *
 * Two passes got this wrong before. The first laid the copy out as one white
 * slab of prose, which read as a document rather than a page. The second broke
 * it into the site's white/grey bands but put the display face (`lys`) on every
 * section heading, where a face drawn for six-word marketing lines had to carry
 * "HOW TO SAVE A KNOCKED-OUT PERMANENT TOOTH" — and the copy still sat in a
 * narrow left column with the page's whole right side empty.
 *
 * This pass follows the shape the dentistry site actually uses, because that
 * shape is right for the material: a photographic hero carrying the title, then
 * a rhythm of centred sections at a readable measure, each doing one job.
 *
 *     hero            photograph, brand-blue wash, eyebrow, title, lead, actions
 *     promises        three cards, an icon each
 *     copy            centred sections, one column, rules between
 *     steps           numbered cards, on grey
 *     reassurance     a quiet pull quote, not a shouted band
 *     questions       the theme's own accordion
 *     related         where to go next, as cards — this is the navigation
 *     schedule        the closing call, in brand blue
 *
 * What keeps it this site rather than that one: Montserrat and the brand
 * palette, the theme's 20px card radius and pill buttons, the green schedule
 * button, and the theme's own accordion — `.d-location-title` and `.plusmin`
 * are what script.js listens for, the same markup the dentistry landing page
 * uses for its office cards. No new interaction was invented.
 *
 * The icons are the thirty Phosphor shapes (MIT) the dentistry site named,
 * vendored once into `/assets/icons.svg` and referenced by id.
 */

import {
  dentalContent,
  type DentalCallout,
  type DentalPage,
  type DentalSection,
} from "../data/dentalContent.ts";
import { escapeAttribute } from "./generated.ts";

export function dentalPage(route: string): DentalPage | undefined {
  return dentalContent[route];
}

/**
 * The copy carries inline links and nothing else — they were rewritten to this
 * site's routes on the way in. Those are held aside, the rest is escaped, and
 * they go back afterwards, so no other markup can arrive with the copy.
 *
 * The attribute list is deliberately closed: href, and the target/rel pair the
 * handful of links to outside bodies (the ADA, the CDC) carry. Anything else in
 * a tag leaves it unmatched, and it is escaped along with the rest.
 */
const LINK = /<\/?a(?:\s+(?:href|target|rel)=(?:"[^"]*"|'[^']*'))*\s*>/g;

/*
 * The placeholder is a private-use codepoint, not a digit in spaces. It was a
 * digit in spaces, and the copy is full of real numbers in spaces — "the first
 * 30 to 60 minutes" came out as "the first to minutes", because 30 and 60 were
 * read as link slots and replaced with nothing. Nothing in the copy can contain
 * U+E000.
 */
const SLOT = "\uE000";

function inline(text: string): string {
  const links: string[] = [];
  const held = text.replace(LINK, (tag) => {
    links.push(tag);
    return `${SLOT}${links.length - 1}${SLOT}`;
  });
  return escapeAttribute(held).replace(
    new RegExp(`${SLOT}(\\d+)${SLOT}`, "g"),
    (_, index) => links[Number(index)] ?? "",
  );
}

/** A full-width band, which is how every other page on this site is built. */
function band(bg: string, inner: string, pad = "padme90"): string {
  return `<div class="${bg} ${pad}">
	<div class="container">
${inner}
	</div>
</div>`;
}

/** The display face the site uses on section headings. */
function sectionTitle(text: string): string {
  return `<h2 class="lys dent-band-title">${inline(text)}</h2>`;
}

/* ------------------------------------------------------------------ hero -- */

/**
 * The page's own hero, replacing the flat blue title band the generated pages
 * use. The photograph is the reason: these pages are about a frightened child
 * and a parent deciding what to do in the next ten minutes, and a picture of
 * someone being looked after does more for that than a coloured rectangle.
 *
 * The wash is brand blue over the photograph rather than beside it, so the
 * title has a guaranteed contrast to sit on whatever the picture underneath is
 * doing. Pages with no photograph get the wash alone and look deliberate.
 */
function heroBand(
  page: DentalPage,
  title: string,
  service: { name: string; href: string },
): string {
  const art = page.hero
    ? `<img class="dent-hero-img" src="${page.hero}" alt="" aria-hidden="true" width="1536" height="1024" loading="eager" decoding="async" />`
    : "";
  const eyebrow = page.eyebrow
    ? `<p class="dent-hero-eyebrow">${inline(page.eyebrow)}</p>`
    : "";

  return `<div class="dent-hero${page.hero ? "" : " dent-hero-plain"}">
	${art}
	<div class="dent-hero-wash"></div>
	<div class="container dent-hero-inner">
		${eyebrow}
		<h1 class="dent-hero-title">${escapeAttribute(title)}</h1>
		<p class="dent-hero-lead">${inline(page.lead)}</p>
		<p class="dent-hero-act"><a class="btn dent-hero-ghost" href="${service.href}">All ${escapeAttribute(service.name)}</a></p>
	</div>
</div>`;
}

/* -------------------------------------------------------------- promises -- */

function icon(name: string): string {
  if (!name) return "";
  return `<span class="dent-icon"><svg aria-hidden="true" focusable="false"><use href="/assets/icons.svg#i-${escapeAttribute(name)}"></use></svg></span>`;
}

function promiseBand(page: DentalPage): string {
  if (!page.promises?.length) return "";

  const cards = page.promises
    .map(
      (promise) => `			<div class="col-lg-4 col-md-6">
				<div class="dent-promise">
					${icon(promise.icon)}
					<h2 class="dent-promise-title">${inline(promise.title)}</h2>
					<p>${inline(promise.text)}</p>
				</div>
			</div>`,
    )
    .join("\n");

  return `<div class="whitebg dent-promises">
	<div class="container">
		<div class="row">
${cards}
		</div>
	</div>
</div>`;
}

/* -------------------------------------------------------------- the copy -- */

function callout(note: DentalCallout): string {
  const title = note.title
    ? `<p class="dent-callout-title">${inline(note.title)}</p>\n\t\t\t\t\t`
    : "";

  return `<div class="dent-callout dent-callout-${note.tone}">
					${title}<p>${inline(note.text)}</p>
				</div>`;
}

/**
 * A numbered sequence, as cards rather than a list. These are the "what to do
 * right now" steps on an emergency page, read standing up with a hurt child in
 * the room, so each one is a target the eye can land on rather than a line in a
 * paragraph.
 */
function steps(part: DentalSection): string {
  if (!part.steps?.length) return "";

  const cards = part.steps
    .map(
      (step, index) => `			<div class="col-lg-3 col-md-6">
				<div class="dent-step">
					<span class="dent-step-n">${index + 1}</span>
					<h3 class="dent-step-title">${inline(step.title)}</h3>
					<p>${inline(step.text)}</p>
				</div>
			</div>`,
    )
    .join("\n");

  return `		<div class="row dent-step-row">
${cards}
		</div>`;
}

/**
 * Prose, at a measure you can actually read, centred under its heading.
 *
 * The callout is passed in rather than taken from the section, because where it
 * belongs depends on what else the section has: on a section of steps it is the
 * exception to them and has to come after. "If it's a baby tooth, don't
 * reinsert it" was landing above the four steps it qualifies.
 */
function prose(part: DentalSection, note: DentalCallout | null): string {
  const body = (part.body ?? [])
    .map((paragraph) => `<p>${inline(paragraph)}</p>`)
    .join("\n					");
  if (!body && !note) return "";

  return `		<div class="row justify-content-center">
			<div class="col-lg-8">
				<div class="dent-prose">
					${body}
					${note ? callout(note) : ""}
				</div>
			</div>
		</div>`;
}

/**
 * One section. A section that carries steps is set on grey and runs the full
 * width for its cards; a section of prose stays on white in one centred column.
 * That alternation is what gives the page its rhythm, and it comes out of the
 * material rather than being imposed on it.
 */
function section(part: DentalSection): string {
  const hasSteps = Boolean(part.steps?.length);
  const note = part.callout ?? null;

  const inner = hasSteps
    ? [prose(part, null), steps(part), prose({ heading: "" }, note)]
    : [prose(part, note)];

  return `<div class="${hasSteps ? "graybg" : "whitebg"} dent-band">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-9">
				<h2 class="dent-band-title">${inline(part.heading)}</h2>
			</div>
		</div>
${inner.filter(Boolean).join("\n")}
	</div>
</div>`;
}

/** The second photograph, full width, breaking the copy up partway down. */
function sceneBand(page: DentalPage): string {
  if (!page.scene) return "";

  return `<div class="whitebg dent-scene-band">
	<div class="container">
		<figure class="dent-scene">
			<img src="${page.scene}" alt="${escapeAttribute(page.sceneAlt || "")}" width="1536" height="1024" loading="lazy" decoding="async" />
		</figure>
	</div>
</div>`;
}

/* ------------------------------------------------------------ reassurance -- */

/**
 * The closing reassurance. It was a solid blue band shouting a sentence that is
 * meant to calm someone down; it is now a quiet pull quote, which is what the
 * words are actually doing.
 */
function reassuranceBand(page: DentalPage): string {
  if (!page.reassurance) return "";

  return `<div class="whitebg dent-quote-band">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-8">
				<blockquote class="dent-quote">${inline(page.reassurance)}</blockquote>
			</div>
		</div>
	</div>
</div>`;
}

/* --------------------------------------------------------------- answers -- */

function faqBand(page: DentalPage): string {
  if (!page.faqs?.length) return "";

  const cards = page.faqs
    .map(
      (item) => `			<div class="col-lg-9">
				<div class="dentistry-card dent-faq">
					<h3 class="d-location-title">${inline(item.q)}</h3><div class="plusmin"><span></span><span></span></div>
					<div class="cardcontent">
						<p>${inline(item.a)}</p>
					</div>
				</div>
			</div>`,
    )
    .join("\n");

  return `<div class="graybg dent-band">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-9">
				<h2 class="dent-band-title">Common questions</h2>
			</div>
		</div>
		<div class="row justify-content-center">
${cards}
		</div>
	</div>
</div>`;
}

/* --------------------------------------------------------------- related -- */

/**
 * Where to go next, as cards.
 *
 * This is the answer to navigating four levels of dentistry pages, and it is
 * the answer the large health systems land on too: the trail above tells you
 * where you are, and the page itself tells you where you can go. A permanent
 * bar of every sibling and cousin at the top of the page was two rows of small
 * links before the title had even been read.
 */
function relatedBand(page: DentalPage): string {
  if (!page.related?.length) return "";

  const cards = page.related
    .map(
      (item) => `			<div class="col-lg-4 col-md-6">
				<a class="dent-next" href="${escapeAttribute(item.href)}">
					<span class="dent-next-name">${inline(item.name)}</span>
					${item.blurb ? `<span class="dent-next-blurb">${inline(item.blurb)}</span>` : ""}
				</a>
			</div>`,
    )
    .join("\n");

  return `<div class="whitebg dent-band">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<h2 class="dent-band-title dent-band-title-left">Where to go next</h2>
			</div>
		</div>
		<div class="row">
${cards}
		</div>
	</div>
</div>`;
}

/* -------------------------------------------------------------- schedule -- */

function scheduleBand(
  serviceName: string,
  serviceHref: string,
  pillarName: string,
  pillarHref: string,
): string {
  return `<div class="bluebg dent-cta">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-8">
				<h2 class="dent-cta-title">Need to be seen?</h2>
				<p class="dent-cta-text">Call your office first — most ${escapeAttribute(serviceName.toLowerCase())} are seen the same day.</p>
				<p class="dent-cta-act"><a class="btn green" href="/contact-us/">Schedule an appointment</a></p>
				<p class="dent-cta-links"><a href="${serviceHref}">All ${escapeAttribute(serviceName)}</a> &middot; <a href="${pillarHref}">${escapeAttribute(pillarName)}</a></p>
			</div>
		</div>
	</div>
</div>`;
}

/* ------------------------------------------------------------------ page -- */

/**
 * The whole page, hero included — a migrated page owns its own top, because the
 * photograph is the point of it. The trail comes in from the caller as its own
 * band and goes above the hero: on the photograph it had to be read against
 * whatever the picture was doing behind it.
 *
 * The scene photograph goes in after the first section, far enough down to
 * break the page up rather than sitting under the hero.
 */
export function renderDentalPage(
  page: DentalPage,
  title: string,
  crumbs: string,
  service: { name: string; href: string },
  pillar: { name: string; href: string },
): string {
  const parts = page.sections.map(section);
  const scene = sceneBand(page);
  if (scene && parts.length > 1) parts.splice(1, 0, scene);
  else if (scene) parts.push(scene);

  return [
    crumbs,
    heroBand(page, title, service),
    promiseBand(page),
    ...parts,
    reassuranceBand(page),
    faqBand(page),
    relatedBand(page),
    scheduleBand(service.name, service.href, pillar.name, pillar.href),
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * FAQPage schema for a migrated page. The questions are real and answered on the
 * page itself, which is the whole basis for marking them up.
 */
export function dentalFaqSchema(page: DentalPage): object | null {
  if (!page.faqs?.length) return null;

  return {
    "@type": "FAQPage",
    mainEntity: page.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.replace(/<[^>]+>/g, ""),
      },
    })),
  };
}
