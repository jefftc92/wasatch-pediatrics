import { searchIndex, type SearchEntry } from "../data/searchIndex.ts";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  const index = Number(month) - 1;
  const name = MONTHS[index];
  if (!year || !name) return "";
  return `${name} ${String(Number(day)).padStart(2, "0")}, ${year}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Title matches rank above body text, which ranks above pages that only
 * mention the term in a link target; ties break on publish date.
 */
export function searchSite(term: string): SearchEntry[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return [];

  return searchIndex
    .map((entry) => ({
      entry,
      rank: entry.title.toLowerCase().includes(needle)
        ? 3
        : entry.text.includes(needle)
          ? 2
          : entry.links.includes(needle)
            ? 1
            : 0,
    }))
    .filter((hit) => hit.rank > 0)
    .sort((a, b) => b.rank - a.rank || b.entry.date.localeCompare(a.entry.date))
    .map((hit) => hit.entry);
}

function resultCard(entry: SearchEntry): string {
  const meta = [formatDate(entry.date), entry.category]
    .filter(Boolean)
    .join(" / ");

  return `					<div class="col-lg-6 col-md-6 col-12">
						<div class="bpgraywrap">
							${entry.image ? `<a class="bp bpp rndi" href="${entry.route}"><img src="${entry.image}" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" /></a>` : ""}
							${entry.type === "post" && meta ? `<p class="bppostdate date condensed">${escapeHtml(meta)}</p>` : ""}
							<p class="bptitle"><a href="${entry.route}">${escapeHtml(entry.title)}</a></p>
							<div class="theexcerpt chap">${escapeHtml(entry.excerpt)}</div>	<br>
							<a class="btn box green" href="${entry.route}">Read More</a>
						</div>
					</div>`;
}

/** The search results page, mirroring the theme's search template. */
export function renderSearchResults(
  term: string,
  results: SearchEntry[],
): string {
  const body = results.length
    ? results.map(resultCard).join("\n")
    : `					<div class="col-12">
						<p>Sorry, no results were found. Please try another search.</p>
					</div>`;

  return `		<section class="container blogindex">
			<header class="row toprow">
				<div class="col-md-8">
					<h1>Search results for &quot;${escapeHtml(term)}&quot;</h1>
				</div>
				<div class="col-md-3 offset-md-1">
					<form method="get" id="searchform" action="/" >
	    <div id="postssearchwrap">
	        <input type="text" value="" placeholder="Search" name="s" id="s" />
	        <button id="postssearch"><img src="/wp-content/themes/wasatch/images/icon_magnify.svg" alt="Search"></button>
	    </div>
	    </form>				</div>
			</header>
			<br>
${body}
			<br><br><br><br>
		</section>`;
}
