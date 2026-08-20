/**
 * Pulls the dentistry site's copy into src/data/dentalContent.ts.
 *
 *   node tools/import-dentistry.mjs ../../../seotooth
 *
 * The dentistry site is a separate Astro build that holds its pages as typed
 * props to two layouts, so the copy can be read out of it structurally rather
 * than scraped: MessageLeaf pages are one props object, and the hand-built ones
 * keep their content in frontmatter consts plus a little prose in the template.
 *
 * What crosses over is the words and their shape. Classes, icon names and photo
 * splits are dropped at this boundary, and inline links are rewritten onto this
 * site's routes — so nothing of the dentistry site's design language reaches
 * src/render/dental.ts, which renders it all in this site's own.
 *
 * Re-run it when the dentistry site's copy changes; do not hand-edit the output.
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import vm from 'node:vm';

const SITE = process.argv[2];
if (!SITE) {
  console.error('usage: node tools/import-dentistry.mjs <path to the dentistry site checkout>');
  process.exit(1);
}
const ROOT = join(SITE, 'src/pages');
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

/* ---- the dental site's routes, mapped onto this site's ---- */
const SERVICE = { emergencies: 'dental-emergencies', 'pediatric-dentistry': 'pediatric-dentistry', orthodontics: 'orthodontics' };
function mapRoute(r) {
  const parts = r.replace(/^\//, '').split('/');
  const svc = SERVICE[parts[0]];
  if (!svc) return null;
  return '/dentistry-orthodontics/' + [svc, ...parts.slice(1)].join('/') + '/';
}
const CONTACT = { phoneDisplay: '(801) 676-3700', phoneHref: 'tel:+18016763700' };

/** Inline links in the copy point at the dental site; move them and drop its classes. */
function rewrite(html) {
  return String(html)
    .replace(/\s*class=(['"])[^'"]*\1/g, '')
    .replace(/href=(['"])([^'"]+)\1/g, (m, q, href) => {
      if (/^(https?:|tel:|mailto:|#)/.test(href)) return `href=${q}${href}${q}`;
      const mapped = mapRoute(href);
      return `href=${q}${mapped ?? href}${q}`;
    });
}
const clean = (v) => (typeof v === 'string' ? rewrite(v) : v);

/* ---- <Tag ... /> attribute reader ---- */
function tagProps(src, tag) {
  const open = src.indexOf('<' + tag);
  if (open < 0) return null;
  let i = open + tag.length + 1;
  const out = {};
  while (i < src.length) {
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src.startsWith('/>', i) || src.startsWith('>', i)) break;
    const m = /^([A-Za-z][A-Za-z0-9]*)\s*=\s*/.exec(src.slice(i));
    if (!m) break;
    i += m[0].length;
    let raw;
    if (src[i] === '{') {
      let d = 0, j = i, s = null;
      for (; j < src.length; j++) { const c = src[j];
        if (s) { if (c === '\\') j++; else if (c === s) s = null; continue; }
        if (c === '"' || c === "'" || c === '`') { s = c; continue; }
        if (c === '{') d++; else if (c === '}') { d--; if (!d) { j++; break; } } }
      raw = src.slice(i + 1, j - 1); i = j;
    } else if (src[i] === '"' || src[i] === "'") {
      const q = src[i]; let j = i + 1;
      for (; j < src.length; j++) { if (src[j] === '\\') j++; else if (src[j] === q) { j++; break; } }
      raw = src.slice(i, j); i = j;
    } else break;
    try { out[m[1]] = vm.runInNewContext('(' + raw + ')', { CONTACT }); } catch { /* skip computed */ }
  }
  return out;
}

/** `const name = [...]` / `{...}` out of the frontmatter, with stubs available. */
function consts(src, names, base) {
  const fm = src.slice(0, src.indexOf('---', 3) + 3);
  const ctx = { CONTACT, base };
  const out = {};
  for (const n of names) {
    const m = new RegExp('const\\s+' + n + '\\s*=\\s*', 'g').exec(fm);
    if (!m) continue;
    let i = m.index + m[0].length, d = 0, j = i, s = null;
    for (; j < src.length; j++) { const c = fm[j];
      if (s) { if (c === '\\') j++; else if (c === s) s = null; continue; }
      if (c === '"' || c === "'" || c === '`') { s = c; continue; }
      if (c === '[' || c === '{') d++;
      else if (c === ']' || c === '}') { d--; if (!d) { j++; break; } } }
    try { out[n] = vm.runInNewContext('(' + fm.slice(i, j) + ')', ctx); } catch { /* skip */ }
  }
  return out;
}


/**
 * Prose out of a hand-built page's template: an <h2> and the paragraphs under
 * it. Blocks whose content is a .map() over one of the frontmatter arrays are
 * skipped — those are the card grids this site generates for itself.
 */
function proseSections(src) {
  const body = src.slice(src.indexOf('---', 3) + 3);
  const out = [];
  const heading = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  let m;
  while ((m = heading.exec(body))) {
    const text = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const title = text(m[1]);
    if (!title || title.includes('{')) continue;
    // paragraphs between this heading and the next one
    const next = body.indexOf('<h2', m.index + 1);
    const chunk = body.slice(m.index, next < 0 ? body.length : next);
    if (chunk.includes('.map(')) continue;
    const paras = [];
    for (const p of chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
      const inner = p[1];
      if (inner.includes('{') || inner.includes('.map(')) continue;
      const t = inner.replace(/\s+/g, ' ').trim();
      if (t.split(' ').length > 6) paras.push(rewrite(t));
    }
    if (paras.length) out.push({ heading: title, body: paras, steps: [], callout: null });
  }
  return out;
}


/* ---- the images that ship with each page ---- */

/**
 * The dentistry site files its images by a slightly different tree than its
 * routes: the hubs live under `overview/`, and pediatric-dentistry is just
 * `pediatric/`. Every page directory carries a `hero.webp`, and the ones with
 * a photo-split in the copy also carry a `scene.webp`.
 */
function imageDir(from) {
  const parts = from.replace(/^\//, '').split('/');
  const tree = parts[0] === 'pediatric-dentistry' ? 'pediatric' : parts[0];
  const rest = parts.slice(1);
  return [tree, ...(rest.length ? rest : ['overview'])].join('/');
}

function imagesFor(from) {
  const dir = imageDir(from);
  const out = {};
  for (const kind of ['hero', 'scene']) {
    const file = join(SITE, 'public/images', dir, kind + '.webp');
    if (existsSync(file)) out[kind] = '/assets/dentistry/' + dir + '/' + kind + '.webp';
  }
  return out;
}

const pages = {};
for (const p of walk(ROOT)) {
  const rel = relative(ROOT, p);
  if (!/^(emergencies|pediatric-dentistry|orthodontics)(\.astro$|\/)/.test(rel)) continue;
  const src = readFileSync(p, 'utf8');
  const from = '/' + rel.replace(/\.astro$/, '').replace(/\/index$/, '');
  const route = mapRoute(from);
  const base = from;

  let page;
  if (src.includes('<MessageLeaf')) {
    const pr = tagProps(src, 'MessageLeaf');
    page = {
      description: pr.description,
      lead: clean(pr.heroIntro),
      benefits: (pr.benefits || []).map((b) => ({ title: b.title, text: clean(b.text) })),
      sceneAlt: (pr.sections || []).find((s) => s.imageAlt)?.imageAlt || '',
      sections: (pr.sections || []).map((s) => ({
        heading: s.heading,
        body: (s.body || []).map(clean),
        steps: (s.steps || []).map((t) => ({ title: t.title, text: clean(t.text) })),
        callout: s.callout ? { tone: s.callout.tone || 'info', title: s.callout.title || '', text: clean(s.callout.text) } : null,
      })),
      reassurance: clean(pr.reassurance || ''),
      faqs: (pr.faqs || []).map((f) => ({ q: f.q, a: clean(f.a) })),
    };
  } else {
    const bl = tagProps(src, 'BaseLayout') || {};
    const hero = tagProps(src, 'PageHero') || {};
    const c = consts(src, ['benefits', 'promises', 'steps', 'faqs'], base);
    const prose = proseSections(src);
    const stepSection = (c.steps || []).length
      ? [{ heading: 'What to do', body: [], steps: c.steps.map((t) => ({ title: t.title, text: clean(t.text) })), callout: null }]
      : [];
    page = {
      description: bl.description,
      lead: clean(hero.intro || ''),
      benefits: (c.benefits || c.promises || []).map((b) => ({ title: b.title, text: clean(b.text) })),
      sections: [...prose, ...stepSection],
      reassurance: '',
      faqs: (c.faqs || []).map((f) => ({ q: f.q, a: clean(f.a) })),
    };
  }
  const art = imagesFor(from);
  if (art.hero) page.hero = art.hero;
  if (art.scene) page.scene = art.scene;

  // drop empties so the data file stays readable
  page.sections = page.sections.filter((s) => s.body.length || s.steps.length || s.callout);
  for (const s of page.sections) { if (!s.steps.length) delete s.steps; if (!s.body.length) delete s.body; if (!s.callout) delete s.callout; }
  if (!page.reassurance) delete page.reassurance;
  if (!page.faqs.length) delete page.faqs;
  if (!page.benefits.length) delete page.benefits;
  pages[route] = page;
}

const routes = Object.keys(pages).sort();
console.log('pages:', routes.length);
for (const r of routes) {
  const p = pages[r];
  console.log(' ', r.padEnd(72), 'sec=' + (p.sections?.length || 0), 'faq=' + (p.faqs?.length || 0), 'ben=' + (p.benefits?.length || 0), p.lead ? '' : ' NO LEAD');
}

/* ------------------------------------------------------------- output -- */

const q = (s) => JSON.stringify(s);
const lines = [];
lines.push(`/**
 * Copy migrated from the dentistry site.
 *
 * The dentistry site holds this content as typed props to an Astro layout, so
 * what came across is the words and their structure, not its markup: no classes,
 * no icon names, no photo splits. \`src/render/dental.ts\` renders it in this
 * site's own vocabulary, which is the point — the pages read as part of Wasatch
 * Pediatrics rather than as a second site bolted on.
 *
 * Inline links in the copy were rewritten from the dentistry site's routes to
 * this site's. Generated by tools/import-dentistry.mjs; edit the source there
 * and re-run rather than hand-editing this file.
 */

export type DentalStep = { title: string; text: string };

export type DentalCallout = {
  /** alert = act now, info = worth knowing, tip = makes it easier. */
  tone: "alert" | "info" | "tip";
  title: string;
  text: string;
};

export type DentalSection = {
  heading: string;
  /** Paragraphs. May carry inline links. */
  body?: string[];
  /** A numbered sequence, rendered as an ordered list. */
  steps?: DentalStep[];
  callout?: DentalCallout;
};

/** The three things this page promises, shown above the copy. */
export type DentalPromise = { title: string; text: string };

export type DentalPage = {
  /** Meta description, replacing the standing one for this route. */
  description: string;
  /** The opening line, rendered as the page's lead. */
  lead: string;
  /** Photograph shown beside the lead. */
  hero?: string;
  /** Second photograph, dropped into the body partway down. */
  scene?: string;
  sceneAlt?: string;
  promises?: DentalPromise[];
  sections: DentalSection[];
  reassurance?: string;
  faqs?: Array<{ q: string; a: string }>;
};

/** Keyed by this site's route, with the trailing slash. */
export const dentalContent: Record<string, DentalPage> = {`);

for (const route of Object.keys(pages).sort()) {
  const p = pages[route];
  lines.push(`  ${q(route)}: {`);
  lines.push(`    description: ${q(p.description)},`);
  lines.push(`    lead: ${q(p.lead)},`);
  if (p.hero) lines.push(`    hero: ${q(p.hero)},`);
  if (p.scene) lines.push(`    scene: ${q(p.scene)},`);
  if (p.sceneAlt) lines.push(`    sceneAlt: ${q(p.sceneAlt)},`);
  if (p.benefits) {
    lines.push(`    promises: [`);
    for (const b of p.benefits) lines.push(`      { title: ${q(b.title)}, text: ${q(b.text)} },`);
    lines.push(`    ],`);
  }
  lines.push(`    sections: [`);
  for (const s of p.sections) {
    lines.push(`      {`);
    lines.push(`        heading: ${q(s.heading)},`);
    if (s.body) { lines.push(`        body: [`); for (const b of s.body) lines.push(`          ${q(b)},`); lines.push(`        ],`); }
    if (s.steps) { lines.push(`        steps: [`); for (const t of s.steps) lines.push(`          { title: ${q(t.title)}, text: ${q(t.text)} },`); lines.push(`        ],`); }
    if (s.callout) lines.push(`        callout: { tone: ${q(s.callout.tone)}, title: ${q(s.callout.title)}, text: ${q(s.callout.text)} },`);
    lines.push(`      },`);
  }
  lines.push(`    ],`);
  if (p.reassurance) lines.push(`    reassurance: ${q(p.reassurance)},`);
  if (p.faqs) { lines.push(`    faqs: [`); for (const f of p.faqs) lines.push(`      { q: ${q(f.q)}, a: ${q(f.a)} },`); lines.push(`    ],`); }
  lines.push(`  },`);
}
lines.push('};');
lines.push('');
writeFileSync(new URL('../src/data/dentalContent.ts', import.meta.url), lines.join('\n'));
console.log('wrote', Object.keys(pages).length, 'pages into src/data/dentalContent.ts');
