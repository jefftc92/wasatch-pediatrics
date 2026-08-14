#!/usr/bin/env python3
"""Re-sync this app from the live wasatchpeds.net site.

The app is a 1:1 copy of the WordPress site: the theme stylesheet and media are
vendored under `public/`, each page body is stored verbatim under `src/content/`,
and the repeating records (providers) are extracted into typed data modules.
This script regenerates all of that from the live site.

    python3 tools/sync-from-live.py            # full sync
    python3 tools/sync-from-live.py --no-fetch # regenerate from the local cache
    python3 tools/sync-from-live.py --no-assets

Downloaded HTML is cached under `.sync-cache/` so re-runs are cheap. Review the
resulting diff before committing — content changes on the live site will show up
as changes to `src/content/` and `src/data/`.
"""

from __future__ import annotations

import argparse
import html as ihtml
import json
import os
import re
import urllib.parse
import urllib.request

SITE = "https://wasatchpeds.net"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, ".sync-cache", "pages")
CONTENT = os.path.join(ROOT, "src", "content")
DATA = os.path.join(ROOT, "src", "data")
PUBLIC = os.path.join(ROOT, "public")

# Pages rendered by React components rather than stored content HTML.
COMPONENT_ROUTES = {"/providers/"}

# Filter dropdown values, taken from the live /providers/ markup.
LOCATION_OPTIONS = [
    ("5", "Cottonwood"),
    ("42", "Dentistry & Orthodontics"),
    ("6", "Draper"),
    ("7", "Farmington"),
    ("8", "Grow Up Great"),
    ("9", "Salt Lake"),
    ("10", "Southpoint"),
    ("11", "Summit"),
    ("4", "Willow Creek"),
]
CATEGORY_OPTIONS = [
    ("14", "Behavioral Health Providers"),
    ("41", "Dentistry & Orthodontics"),
    ("13", "Dietitians"),
    ("15", "Nurse Practitioners"),
    ("12", "Physicians"),
]

# Top-level routes that are WordPress *pages*; every other top-level slug is a
# blog post. Used to label search results.
KNOWN_PAGES = {
    "/",
    "/about/",
    "/behavioral-health/",
    "/blog/",
    "/careers/",
    "/comments/",
    "/contact-us/",
    "/covid-19/",
    "/dentistry-orthodontics/",
    "/helpful-links/",
    "/new-patients/",
    "/office-forms/",
    "/services/",
    "/symptom-checker/",
    "/terms-of-use-privacy-statement/",
}


# --------------------------------------------------------------------------- #
# fetching
# --------------------------------------------------------------------------- #

def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "wasatch-site-sync"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def post(url: str, fields: dict[str, str]) -> str:
    body = urllib.parse.urlencode(fields).encode()
    request = urllib.request.Request(url, data=body, headers={"User-Agent": "wasatch-site-sync"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", "replace")


def slug_for(url: str) -> str:
    path = url.replace(SITE, "").strip("/")
    return path.replace("/", "__") if path else "home"


def route_for(slug: str) -> str:
    if slug == "home":
        return "/"
    if slug.startswith("blog__page__"):
        return f"/blog/page/{slug.rsplit('__', 1)[1]}/"
    return "/" + slug.replace("__", "/") + "/"


def sitemap_urls() -> list[str]:
    index = get(f"{SITE}/sitemap_index.xml").decode("utf-8", "replace")
    urls: list[str] = []
    for sitemap in sorted(set(re.findall(r"<loc>([^<]+)</loc>", index))):
        page = get(sitemap).decode("utf-8", "replace")
        urls.extend(re.findall(r"<loc>([^<]+)</loc>", page))
    return sorted(set(urls))


def fetch_pages() -> None:
    """Mirror every page of the live site into the cache."""
    os.makedirs(CACHE, exist_ok=True)
    urls = sitemap_urls()
    urls.append(f"{SITE}/blog/")

    # Blog pagination, discovered from the pager on /blog/.
    blog = get(f"{SITE}/blog/").decode("utf-8", "replace")
    pages = [int(n) for n in re.findall(r"/blog/page/(\d+)/", blog)] or [1]
    urls.extend(f"{SITE}/blog/page/{n}/" for n in range(2, max(pages) + 1))

    for url in sorted(set(urls)):
        save(url)

    # Blog posts are not in the sitemap index; collect them from the blog and
    # category listings that have just been mirrored.
    listings = [f for f in os.listdir(CACHE) if f.startswith(("blog", "category__"))]
    candidates: set[str] = set()
    for name in listings:
        source = read_cached(name[:-5])
        candidates.update(re.findall(rf'href="{re.escape(SITE)}(/[a-z0-9-]+/)"', source))

    known = {route_for(f[:-5]) for f in os.listdir(CACHE)}
    for path in sorted(candidates):
        if path in known or path.strip("/") in {"blog", "providers", "wp-json"}:
            continue
        save(SITE + path)


def save(url: str) -> None:
    target = os.path.join(CACHE, slug_for(url) + ".html")
    if os.path.exists(target) and os.path.getsize(target) > 0:
        return
    print("fetch", url)
    with open(target, "wb") as handle:
        handle.write(get(url))


def read_cached(slug: str) -> str:
    with open(os.path.join(CACHE, slug + ".html"), encoding="utf-8", errors="replace") as handle:
        return handle.read()


# --------------------------------------------------------------------------- #
# html helpers
# --------------------------------------------------------------------------- #

def strip_noise(source: str) -> str:
    source = re.sub(r"<script.*?</script>", "", source, flags=re.S)
    source = re.sub(r"<style.*?</style>", "", source, flags=re.S)
    return re.sub(r"<!--.*?-->", "", source, flags=re.S)


def to_relative(source: str) -> str:
    source = source.replace(f"{SITE}/wp-content", "/wp-content")
    source = source.replace("http://wasatchpeds.net/wp-content", "/wp-content")
    return source.replace(f"{SITE}/", "/").replace(SITE, "/")


def page_body(source: str) -> str | None:
    """The markup between </header> and <footer>, as the theme renders it."""
    body = strip_noise(source)
    if "</header>" not in body:
        return None
    return to_relative(body.split("</header>", 1)[1].split("<footer", 1)[0]).strip()


def text_of(markup: str) -> str:
    without_svg = re.sub(r"<svg.*?</svg>", " ", markup, flags=re.S)
    return ihtml.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", without_svg))).strip()


def tidy(markup: str) -> str:
    return re.sub(r"\n\s*\n+", "\n", re.sub(r"[ \t]+\n", "\n", markup)).strip()


def meta(source: str, pattern: str) -> str:
    found = re.search(pattern, source, flags=re.S)
    return ihtml.unescape(found.group(1)).strip() if found else ""


def balanced_div(source: str, start: int) -> str:
    """Inner HTML of the <div> that opens at `start`."""
    begin = source.index(">", start) + 1
    depth = 1
    for match in re.finditer(r"<(/?)div\b", source[begin:]):
        depth += -1 if match.group(1) else 1
        if depth == 0:
            return source[begin : begin + match.start()]
    return source[begin:]


def ts(value) -> str:
    return json.dumps(value, ensure_ascii=False)


# --------------------------------------------------------------------------- #
# assets
# --------------------------------------------------------------------------- #

ASSET_PATTERN = re.compile(r"/wp-content/(?:uploads|themes/wasatch)/[^\"')?\s>]+")


def sync_assets(sources: list[str]) -> None:
    """Download every referenced theme/upload asset, keeping its original path."""
    paths: set[str] = set()
    for source in sources:
        paths.update(ASSET_PATTERN.findall(source.replace(SITE, "")))

    # The stylesheet references fonts and background images of its own.
    theme_css = f"{PUBLIC}/wp-content/themes/wasatch/style.css"
    if os.path.exists(theme_css):
        with open(theme_css, encoding="utf-8", errors="replace") as handle:
            css = handle.read()
        for url in re.findall(r"url\(['\"]?([^'\")]+)['\"]?\)", css):
            if url.startswith(("data:", "http")):
                continue
            paths.add("/wp-content/themes/wasatch/" + url.lstrip("/").replace("wp-content/themes/wasatch/", ""))

    for path in sorted(paths):
        target = PUBLIC + path
        if os.path.exists(target) and os.path.getsize(target) > 0:
            continue
        os.makedirs(os.path.dirname(target), exist_ok=True)
        print("asset", path)
        try:
            with open(target, "wb") as handle:
                handle.write(get(SITE + path))
        except Exception as error:  # noqa: BLE001 - keep syncing the rest
            os.path.exists(target) and os.remove(target)
            print("  skipped:", error)


def sync_stylesheets() -> None:
    for path in (
        "/wp-content/themes/wasatch/style.css",
        "/wp-content/themes/wasatch/bootstrap/bootstrap5.min.css",
    ):
        target = PUBLIC + path
        os.makedirs(os.path.dirname(target), exist_ok=True)
        print("style", path)
        with open(target, "wb") as handle:
            handle.write(get(SITE + path))

    target = f"{PUBLIC}/wp-content/pagenavi-css.css"
    with open(target, "wb") as handle:
        handle.write(get(f"{SITE}/wp-content/plugins/wp-pagenavi/pagenavi-css.css?ver=2.70"))


# --------------------------------------------------------------------------- #
# content pages
# --------------------------------------------------------------------------- #

def write_content_pages() -> list[dict]:
    os.makedirs(CONTENT, exist_ok=True)
    for name in os.listdir(CONTENT):
        os.remove(os.path.join(CONTENT, name))

    pages: list[dict] = []
    for name in sorted(os.listdir(CACHE)):
        if not name.endswith(".html"):
            continue
        slug = name[:-5]
        route = route_for(slug)
        # Provider pages are rendered from src/data/providers.ts instead.
        if route in COMPONENT_ROUTES or slug.startswith("providers"):
            continue

        source = read_cached(slug)
        body = page_body(source)
        if body is None:
            print("skip (no header):", slug)
            continue

        with open(os.path.join(CONTENT, slug + ".html"), "w", encoding="utf-8") as handle:
            handle.write(body)

        pages.append(
            {
                "route": route,
                "slug": slug,
                "title": meta(source, r"<title>(.*?)</title>"),
                "description": meta(source, r'<meta name="description" content="(.*?)"'),
                "bodyClass": meta(source, r'<body class="([^"]*)"'),
            }
        )

    pages.sort(key=lambda page: page["route"])
    lines = [
        "/**",
        " * Route table for the pages copied from wasatchpeds.net.",
        " *",
        " * `slug` maps to the matching file in `src/content/`, which holds the page",
        " * body exactly as the live site renders it (between </header> and <footer>).",
        " * Generated by tools/sync-from-live.py — edit the content files, not this map.",
        " */",
        "",
        "export type ContentPage = {",
        "  route: string;",
        "  slug: string;",
        "  title: string;",
        "  description: string;",
        "  /** The class list WordPress puts on <body>; some theme CSS keys off it. */",
        "  bodyClass: string;",
        "};",
        "",
        "export const contentPages: ContentPage[] = [",
    ]
    for page in pages:
        lines.append("  {")
        for key in ("route", "slug", "title", "description", "bodyClass"):
            lines.append(f"    {key}: {ts(page[key])},")
        lines.append("  },")
    lines += [
        "];",
        "",
        "export const contentPageByRoute = new Map(contentPages.map((page) => [page.route, page]));",
        "",
    ]
    write(os.path.join(DATA, "pages.ts"), "\n".join(lines))
    print(f"content pages: {len(pages)}")
    return pages


# --------------------------------------------------------------------------- #
# providers
# --------------------------------------------------------------------------- #

def provider_slugs(markup: str) -> list[str]:
    return re.findall(r'href="(?:https://wasatchpeds\.net)?/providers/([a-z0-9-]+)/"', markup)


def filter_membership(fetch: bool) -> tuple[dict, dict, dict]:
    """Ask the live filter endpoint which providers belong to each taxonomy."""
    cache_path = os.path.join(ROOT, ".sync-cache", "filters.json")
    if not fetch and os.path.exists(cache_path):
        with open(cache_path, encoding="utf-8") as handle:
            cached = json.load(handle)
        return cached["locations"], cached["categories"], cached["gender"]

    endpoint = f"{SITE}/wp-admin/admin-ajax.php"
    locations: dict[str, list[str]] = {}
    categories: dict[str, list[str]] = {}
    gender: dict[str, str] = {}

    for value, _ in LOCATION_OPTIONS:
        markup = post(endpoint, {"action": "myfilter", "locationfilter": value, "genderfilter": "", "credentialsfilter": ""})
        for slug in provider_slugs(markup):
            locations.setdefault(slug, []).append(value)
    for value, _ in CATEGORY_OPTIONS:
        markup = post(endpoint, {"action": "myfilter", "locationfilter": "", "genderfilter": "", "credentialsfilter": value})
        for slug in provider_slugs(markup):
            categories.setdefault(slug, []).append(value)
    for value in ("male", "female"):
        markup = post(endpoint, {"action": "myfilter", "locationfilter": "", "genderfilter": value, "credentialsfilter": ""})
        for slug in provider_slugs(markup):
            gender[slug] = value

    os.makedirs(os.path.dirname(cache_path), exist_ok=True)
    with open(cache_path, "w", encoding="utf-8") as handle:
        json.dump({"locations": locations, "categories": categories, "gender": gender}, handle, indent=1)
    return locations, categories, gender


def gray_boxes(chunk: str) -> list[dict]:
    boxes = []
    for match in re.finditer(r'<div class="graybox">', chunk):
        inner = balanced_div(chunk, match.start())
        title = re.search(r'<div class="grayboxtitle[^"]*">(.*?)</div>', inner, flags=re.S)
        if title:
            boxes.append({"title": text_of(title.group(1)), "html": tidy(inner[title.end() :])})
    return boxes


def write_providers(fetch: bool) -> None:
    locations, categories, gender = filter_membership(fetch)
    index = to_relative(strip_noise(read_cached("providers")))
    listing = index.split('id="response"', 1)[1]

    providers = []
    for block in listing.split('<div class="providerblock">')[1:]:
        found = re.search(r'href="/providers/([a-z0-9-]+)/"', block)
        if not found:
            continue
        slug = found.group(1)
        card_image = re.search(r'<img src="([^"]*)"', block)
        card_name = re.search(r'<h3 class="centerme">(.*?)</h3>', block, flags=re.S)
        card_locations = [tidy(p) for p in re.findall(r'<p class="centerme">(.*?)</p>', block, flags=re.S) if text_of(p)]

        source = read_cached("providers__" + slug)
        body = to_relative(strip_noise(source)).split("</header>", 1)[1].split("<footer", 1)[0]
        left, _, right = body.partition('<div class="col-lg-7')

        offices = []
        outside = left
        for match in re.finditer(r'<div class="prov-loc-wrap">', left):
            block_html = balanced_div(left, match.start())
            outside = outside.replace(block_html, "")
            address = re.search(r'class="prov-address">(.*?)</a>', block_html, flags=re.S)
            map_url = re.search(r'href="(http://maps\.google\.com/[^"]*)"', block_html)
            phone = re.search(r'href="tel:([0-9]+)"[^>]*>(.*?)</a>', block_html, flags=re.S)
            button = re.search(r'<a class="btn box green" href="([^"]*)">(.*?)</a>', block_html, flags=re.S)
            offices.append(
                {
                    "addressHtml": tidy(address.group(1)) if address else "",
                    "mapUrl": ihtml.unescape(map_url.group(1)) if map_url else "",
                    "phone": text_of(phone.group(2)) if phone else "",
                    "phoneHref": phone.group(1) if phone else "",
                    "href": button.group(1) if button else "",
                    "label": text_of(button.group(2)) if button else "",
                }
            )

        # An optional scheduling button sits outside the location blocks.
        schedule = re.search(r'<p class="loc-link centerme">\s*<a class="btn box green"([^>]*)>(.*?)</a>', outside, flags=re.S)
        schedule_href = re.search(r'href="([^"]*)"', schedule.group(1)) if schedule else None

        name = re.search(r'<div class="provider-title">\s*<h3 class="centerme">(.*?)</h3>', body, flags=re.S)
        image = re.search(r'<div class="provider-image">\s*<img src="([^"]*)"', body, flags=re.S)
        quote = re.search(r'<div class="bigquote">\s*<h1 class="lys">(.*?)</h1>', body, flags=re.S)
        full_name = text_of(name.group(1)) if name else text_of(card_name.group(1) if card_name else "")
        display, _, credentials = full_name.partition(",")

        providers.append(
            {
                "slug": slug,
                "bodyClass": meta(source, r'<body class="([^"]*)"'),
                "name": full_name,
                "displayName": display.strip(),
                "credentials": credentials.strip(),
                "cardName": tidy(card_name.group(1)) if card_name else "",
                "pageTitle": meta(source, r"<title>(.*?)</title>"),
                "description": meta(source, r'<meta name="description" content="(.*?)"'),
                "image": image.group(1) if image else (card_image.group(1) if card_image else ""),
                "quote": ihtml.unescape(tidy(quote.group(1))) if quote else "",
                "scheduleUrl": (schedule_href.group(1).replace(SITE, "") if schedule_href else ""),
                "scheduleLabel": text_of(schedule.group(2)) if schedule else "",
                "scheduleNewTab": bool(schedule and 'target="_blank"' in schedule.group(1)),
                "gender": gender.get(slug, ""),
                "locationIds": locations.get(slug, []),
                "categoryIds": categories.get(slug, []),
                "cardLocations": card_locations,
                "officeLocations": offices,
                "sidebar": gray_boxes(left),
                "sections": gray_boxes(right),
            }
        )

    lines = [
        "/**",
        " * Provider directory copied from wasatchpeds.net.",
        " *",
        " * Location and category ids match the values used by the live site's filter",
        " * dropdowns, so the filtering on /providers/ produces the same results.",
        " * Generated by tools/sync-from-live.py.",
        " */",
        "",
        "export type ProviderSection = {",
        "  title: string;",
        "  html: string;",
        "};",
        "",
        "export type ProviderOffice = {",
        "  addressHtml: string;",
        "  mapUrl: string;",
        "  phone: string;",
        "  phoneHref: string;",
        "  href: string;",
        "  label: string;",
        "};",
        "",
        "export type Provider = {",
        "  slug: string;",
        "  /** The class list WordPress puts on <body> for this profile. */",
        "  bodyClass: string;",
        "  name: string;",
        "  displayName: string;",
        "  credentials: string;",
        "  cardName: string;",
        "  pageTitle: string;",
        "  description: string;",
        "  image: string;",
        "  quote: string;",
        "  /** Optional standalone scheduling button shown under the location blocks. */",
        "  scheduleUrl: string;",
        "  scheduleLabel: string;",
        "  scheduleNewTab: boolean;",
        '  gender: "male" | "female" | "";',
        "  locationIds: string[];",
        "  categoryIds: string[];",
        "  cardLocations: string[];",
        "  officeLocations: ProviderOffice[];",
        "  sidebar: ProviderSection[];",
        "  sections: ProviderSection[];",
        "};",
        "",
        "export const providerLocationOptions: Array<{ value: string; label: string }> = [",
    ]
    for value, label in LOCATION_OPTIONS:
        lines.append(f"  {{ value: {ts(value)}, label: {ts(label)} }},")
    lines += ["];", "", "export const providerCategoryOptions: Array<{ value: string; label: string }> = ["]
    for value, label in CATEGORY_OPTIONS:
        lines.append(f"  {{ value: {ts(value)}, label: {ts(label)} }},")
    lines += [
        "];",
        "",
        'export const providersArchiveBodyClass = "archive post-type-archive post-type-archive-providers wp-theme-wasatch";',
        "",
        "export const providers: Provider[] = [",
    ]
    scalar_keys = (
        "slug", "bodyClass", "name", "displayName", "credentials", "cardName", "pageTitle",
        "description", "image", "quote", "scheduleUrl", "scheduleLabel", "scheduleNewTab", "gender",
    )
    for provider in providers:
        lines.append("  {")
        for key in scalar_keys:
            lines.append(f"    {key}: {ts(provider[key])},")
        for key in ("locationIds", "categoryIds", "cardLocations"):
            lines.append(f"    {key}: {ts(provider[key])},")
        lines.append("    officeLocations: [")
        for office in provider["officeLocations"]:
            lines.append("      {")
            for key in ("addressHtml", "mapUrl", "phone", "phoneHref", "href", "label"):
                lines.append(f"        {key}: {ts(office[key])},")
            lines.append("      },")
        lines.append("    ],")
        for key in ("sidebar", "sections"):
            lines.append(f"    {key}: [")
            for section in provider[key]:
                lines.append("      {")
                lines.append(f"        title: {ts(section['title'])},")
                lines.append(f"        html: {ts(section['html'])},")
                lines.append("      },")
            lines.append("    ],")
        lines.append("  },")
    lines += [
        "];",
        "",
        "export const providerBySlug = new Map(providers.map((provider) => [provider.slug, provider]));",
        "",
    ]
    write(os.path.join(DATA, "providers.ts"), "\n".join(lines))
    print(f"providers: {len(providers)}")


# --------------------------------------------------------------------------- #
# search index
# --------------------------------------------------------------------------- #

def write_search_index(pages: list[dict]) -> None:
    entries = []
    for page in pages:
        if page["slug"].startswith("blog__page__"):
            continue
        source = read_cached(page["slug"])
        body = page_body(source) or ""
        route = page["route"]
        is_post = not (route in KNOWN_PAGES or route.startswith(("/locations/", "/category/")))
        category = ""
        if is_post:
            found = re.search(r'<p class="bppostdate date condensed">(.*?)</p>', source, flags=re.S)
            if found:
                parts = text_of(found.group(1)).split("/")
                category = parts[-1].strip() if len(parts) > 1 else ""
        text = text_of(body)
        entries.append(
            {
                "route": route,
                "title": page["title"].replace(" - Wasatch Pediatrics", "").strip(),
                "type": "post" if is_post else "page",
                "image": meta(source, r'<meta property="og:image" content="([^"]*)"').replace(SITE, ""),
                "date": meta(source, r'<meta property="article:published_time" content="([^"]*)"')[:10],
                "category": category,
                "excerpt": (text[:260] + "…") if len(text) > 260 else text,
                "text": text[:4000].lower(),
            }
        )

    lines = [
        "/**",
        " * Lightweight search index over the copied pages and blog posts, used by the",
        " * site search (the live site runs the same search server-side through",
        " * WordPress). Generated by tools/sync-from-live.py.",
        " */",
        "",
        "export type SearchEntry = {",
        "  route: string;",
        "  title: string;",
        '  type: "post" | "page";',
        "  image: string;",
        "  date: string;",
        "  category: string;",
        "  excerpt: string;",
        "  text: string;",
        "};",
        "",
        "export const searchIndex: SearchEntry[] = [",
    ]
    for entry in entries:
        lines.append("  {")
        for key in ("route", "title", "type", "image", "date", "category", "excerpt", "text"):
            lines.append(f"    {key}: {ts(entry[key])},")
        lines.append("  },")
    lines += ["];", ""]
    write(os.path.join(DATA, "searchIndex.ts"), "\n".join(lines))
    print(f"search entries: {len(entries)}")


def write(path: str, body: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(body)


# --------------------------------------------------------------------------- #

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--no-fetch", action="store_true", help="use the cached HTML instead of re-downloading")
    parser.add_argument("--no-assets", action="store_true", help="skip downloading images, fonts and stylesheets")
    args = parser.parse_args()

    if not args.no_fetch:
        fetch_pages()

    pages = write_content_pages()
    write_providers(fetch=not args.no_fetch)
    write_search_index(pages)

    if not args.no_assets:
        sync_stylesheets()
        sources = [read_cached(name[:-5]) for name in os.listdir(CACHE) if name.endswith(".html")]
        sync_assets(sources)

    print("done — review `git status` before committing")


if __name__ == "__main__":
    main()
