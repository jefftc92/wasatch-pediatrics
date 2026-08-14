import { useEffect } from "react";
import { fadeIn, fadeOut, slideToggle } from "./animate";
import { initCarousels } from "./carousel";

/**
 * Port of the behaviour in the original theme's `script.js` that applies to
 * page content (the header owns its own interactions in `Header.tsx`).
 *
 * Handlers are delegated off the container element so they keep working for
 * markup that React renders after mount, mirroring how jQuery re-bound on each
 * full page load.
 */
export function useThemeInteractions(
  ref: React.RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Accordion cards: `.plusmin` toggles its sibling `.cardcontent`.
      const plusmin = target.closest<HTMLElement>(".plusmin");
      if (plusmin) {
        plusmin.classList.toggle("open");
        const content =
          plusmin.parentElement?.querySelector<HTMLElement>(".cardcontent");
        if (content) slideToggle(content, "fast");
        return;
      }

      // The card title toggles the same content, and flips the +/- glyph.
      const locationTitle = target.closest<HTMLElement>(".d-location-title");
      if (locationTitle) {
        const parent = locationTitle.parentElement;
        parent
          ?.querySelector<HTMLElement>(".plusmin")
          ?.classList.toggle("open");
        const content = parent?.querySelector<HTMLElement>(".cardcontent");
        if (content) slideToggle(content, "fast");
        return;
      }

      // FAQ rows.
      const faq = target.closest<HTMLElement>(".faq-block");
      if (faq) {
        faq.classList.toggle("open");
        const content = faq.querySelector<HTMLElement>(".faq-content");
        if (content) slideToggle(content, "fast");
        return;
      }

      // Contact page "customer service info" disclosure.
      if (target.closest("#cuscinfo")) {
        const tag = root.querySelector<HTMLElement>("#cuscinfotag");
        if (tag) slideToggle(tag, "fast");
        return;
      }

      // Tabbed sections: cross-fade between `.tabcontent` panels.
      const tab = target.closest<HTMLElement>(".tab");
      if (tab) {
        const tabName = tab.dataset.tabName;
        root
          .querySelectorAll(".tab")
          .forEach((el) => el.classList.remove("active"));
        tab.classList.add("active");

        const current = root.querySelector<HTMLElement>(".tabcontent.active");
        const next = tabName
          ? root.querySelector<HTMLElement>(`#${CSS.escape(tabName)}`)
          : null;
        if (current) {
          current.classList.remove("active");
          fadeOut(current, "fast", () => {
            if (next) {
              next.classList.add("active");
              fadeIn(next, "fast");
            }
          });
        } else if (next) {
          next.classList.add("active");
          fadeIn(next, "fast");
        }
      }
    };

    // Buttons bounce while hovered.
    const onOver = (event: MouseEvent) => {
      (event.target as HTMLElement)
        .closest<HTMLElement>(".btn")
        ?.classList.add("bounce");
    };
    const onOut = (event: MouseEvent) => {
      (event.target as HTMLElement)
        .closest<HTMLElement>(".btn")
        ?.classList.remove("bounce");
    };

    root.addEventListener("click", onClick);
    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseout", onOut);
    const disposeCarousels = initCarousels(root);

    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseout", onOut);
      disposeCarousels();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
