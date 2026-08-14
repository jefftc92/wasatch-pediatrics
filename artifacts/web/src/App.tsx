import { lazy, Suspense, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ContentPage } from "@/components/ContentPage";
import { NotFound } from "@/pages/NotFound";
import { contentPageByRoute } from "@/data/pages";
import { fadeOut } from "@/lib/animate";

// The provider directory and the search index are sizeable data modules; keep
// them out of the entry chunk.
const ProviderDetail = lazy(() =>
  import("@/pages/ProviderDetail").then((m) => ({ default: m.ProviderDetail })),
);
const Providers = lazy(() =>
  import("@/pages/Providers").then((m) => ({ default: m.Providers })),
);
const Search = lazy(() =>
  import("@/pages/Search").then((m) => ({ default: m.Search })),
);

/** Files served straight from /public rather than routed through the app. */
const FILE_EXTENSION = /\.(pdf|jpe?g|png|gif|svg|webp|docx?|xlsx?|zip|mp4)$/i;

export function App() {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const loaderRef = useRef<HTMLElement>(null);

  // The theme shows a full-screen loader until the page is ready, then fades
  // it out ("slow" in jQuery terms).
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;
    const onReady = () => fadeOut(loader, "slow");
    if (document.readyState === "complete") {
      const id = window.setTimeout(onReady, 0);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", onReady);
    return () => window.removeEventListener("load", onReady);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Links inside the copied page markup are plain anchors; route the internal
  // ones through the client-side router instead of reloading the document.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey
      )
        return;

      const anchor = (event.target as HTMLElement).closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (
        FILE_EXTENSION.test(url.pathname) ||
        url.pathname.startsWith("/wp-content/")
      )
        return;

      event.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  // In-page anchors (e.g. /services/#well-child) still need to scroll.
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.setTimeout(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      target?.scrollIntoView();
    }, 100);
    return () => window.clearTimeout(id);
  }, [location]);

  return (
    <>
      <section className="page-load" ref={loaderRef} />
      <Header />
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <Body location={location} search={search} />
      </Suspense>
      <Footer />
    </>
  );
}

function Body({ location, search }: { location: string; search: string }) {
  const path = normalize(location);
  const searchTerm = new URLSearchParams(search).get("s");

  if (path === "/" && searchTerm !== null) {
    return <Search term={searchTerm} />;
  }

  if (path === "/providers/") {
    return <Providers />;
  }

  const provider = path.match(/^\/providers\/([^/]+)\/$/);
  if (provider?.[1]) {
    return <ProviderDetail slug={provider[1]} />;
  }

  const page = contentPageByRoute.get(path);
  if (page) {
    return <ContentPage page={page} />;
  }

  return <NotFound />;
}

/** WordPress serves every page with a trailing slash; match that shape. */
function normalize(path: string): string {
  if (path === "" || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}
