import { useEffect, useRef, useState } from "react";
import { useThemeInteractions } from "@/lib/themeInteractions";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import { useBodyClass } from "@/lib/useBodyClass";
import type { ContentPage as ContentPageMeta } from "@/data/pages";

/**
 * Page bodies are stored as the exact HTML the live site serves, so they are
 * loaded lazily per route rather than bundled into the entry chunk.
 */
const contentModules = import.meta.glob("../content/*.html", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

export function ContentPage({ page }: { page: ContentPageMeta }) {
  const [html, setHtml] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useDocumentMeta(page.title, page.description);
  useBodyClass(page.bodyClass);

  useEffect(() => {
    let cancelled = false;
    const load = contentModules[`../content/${page.slug}.html`];
    if (!load) {
      setHtml("");
      return;
    }
    load().then((source) => {
      if (!cancelled) setHtml(source);
    });
    return () => {
      cancelled = true;
    };
  }, [page.slug]);

  useThemeInteractions(containerRef, [html]);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html ?? "" }} />
  );
}
