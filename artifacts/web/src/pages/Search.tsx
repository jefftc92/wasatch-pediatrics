import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { useThemeInteractions } from "@/lib/themeInteractions";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBodyClass } from "@/lib/useBodyClass";
import { searchIndex, type SearchEntry } from "@/data/searchIndex";

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
  if (!year || Number.isNaN(index) || !MONTHS[index]) return "";
  return `${MONTHS[index]} ${Number(day)}, ${year}`;
}

function score(entry: SearchEntry, term: string): number {
  const title = entry.title.toLowerCase();
  if (title.includes(term)) return 2;
  if (entry.text.includes(term)) return 1;
  return 0;
}

export function Search({ term }: { term: string }) {
  const containerRef = useRef<HTMLElement>(null);
  const [, navigate] = useLocation();
  const [value, setValue] = useState("");

  useDocumentMeta(`You searched for ${term} - Wasatch Pediatrics`);
  useBodyClass("search search-results wp-theme-wasatch");

  const needle = term.trim().toLowerCase();
  const results = needle
    ? searchIndex
        .map((entry) => ({ entry, rank: score(entry, needle) }))
        .filter((hit) => hit.rank > 0)
        .sort(
          (a, b) => b.rank - a.rank || b.entry.date.localeCompare(a.entry.date),
        )
        .map((hit) => hit.entry)
    : [];

  useThemeInteractions(containerRef, [needle, results.length]);

  const go = (href: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(href);
  };

  return (
    <section className="container blogindex" ref={containerRef}>
      <header className="row toprow">
        <div className="col-md-8">
          <h1>Search results for &quot;{term}&quot;</h1>
        </div>
        <div className="col-md-3 offset-md-1">
          <form
            method="get"
            id="searchform"
            action="/"
            onSubmit={(event) => {
              event.preventDefault();
              if (value.trim())
                navigate(`/?s=${encodeURIComponent(value.trim())}`);
            }}
          >
            <div id="postssearchwrap">
              <input
                type="text"
                placeholder="Search"
                name="s"
                id="s"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
              <button id="postssearch" type="submit">
                <img
                  src="/wp-content/themes/wasatch/images/icon_magnify.svg"
                  alt="Search"
                />
              </button>
            </div>
          </form>
        </div>
      </header>
      <br />
      {results.length === 0 && (
        <div className="col-12">
          <p>Sorry, no results were found. Please try another search.</p>
          <br />
          <br />
        </div>
      )}
      {results.map((entry) => (
        <div className="col-lg-6 col-md-6 col-12" key={entry.route}>
          <div className="bpgraywrap">
            {entry.image && (
              <a
                className="bp bpp rndi"
                href={entry.route}
                onClick={go(entry.route)}
              >
                <img
                  src={entry.image}
                  className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                  alt=""
                />
              </a>
            )}
            {entry.type === "post" && (entry.date || entry.category) && (
              <p className="bppostdate date condensed">
                {[formatDate(entry.date), entry.category]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
            )}
            <p className="bptitle">
              <a href={entry.route} onClick={go(entry.route)}>
                {entry.title}
              </a>
            </p>
            <div className="theexcerpt chap">{entry.excerpt}</div>
            <br />
            <a
              className="btn box green"
              href={entry.route}
              onClick={go(entry.route)}
            >
              Read More
            </a>
          </div>
        </div>
      ))}
      <br />
      <br />
      <br />
      <br />
    </section>
  );
}
