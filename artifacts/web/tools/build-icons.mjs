/**
 * Builds public/assets/icons.svg.
 *
 * The icons are Phosphor (MIT), which the dentistry site pulls in through
 * astro-icon. Only the names cross over in the import, so the shapes those
 * names refer to are vendored once into a single sprite and referenced by id —
 * no icon font, no runtime fetch, and only the ones actually used.
 *
 * Two sources: the names the dentistry pages carry, and the names the care
 * categories give the map. Run it after changing either.
 *
 *     node tools/build-icons.mjs [path-to-dentistry-checkout]
 *
 * It reads the icon set out of the dentistry site's node_modules, so that
 * checkout has to be present and installed. The sprite it writes is committed,
 * so a normal build never needs this.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const DENTISTRY = process.argv[2] || '../seotooth';
const set = JSON.parse(readFileSync(new URL(DENTISTRY + '/node_modules/@iconify-json/ph/icons.json', import.meta.url), 'utf8'));
const fromDental = execSync("grep -rhoE 'icon: \"ph:[a-z0-9-]+\"' " + new URL(DENTISTRY + '/src/pages', import.meta.url).pathname, { encoding: 'utf8' })
  .trim().split('\n').map((l) => l.match(/ph:([a-z0-9-]+)/)[1]);
// Icons the care categories name, which the dentistry site never used.
const fromCategories = execSync("grep -oE 'icon: \"[a-z0-9-]+\"' " + new URL('../src/data/careCategories.ts', import.meta.url).pathname, { encoding: 'utf8' })
  .trim().split('\n').map((l) => l.match(/"([a-z0-9-]+)"/)[1]);
const used = [...new Set([...fromDental, ...fromCategories])].sort();
const missing = used.filter((n) => !set.icons[n]);
const w = set.width || 24, h = set.height || 24;
const symbols = used.filter((n) => set.icons[n]).map((n) => {
  const i = set.icons[n];
  return `  <symbol id="i-${n}" viewBox="0 0 ${i.width || w} ${i.height || h}">${i.body}</symbol>`;
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n${symbols.join('\n')}\n</svg>\n`;
writeFileSync(new URL('../public/assets/icons.svg', import.meta.url), svg);
console.log('icons:', used.length, 'missing:', missing.length, missing.join(',') || '(none)');
console.log('bytes:', svg.length, ' license:', set.info?.license?.title, set.info?.license?.spdx || '');
