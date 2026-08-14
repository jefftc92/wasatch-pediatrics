/**
 * Re-implementation of the Bootstrap 5 carousel behaviour used by the home page
 * hero (`data-bs-ride="carousel"`), including the slide transition class
 * sequence so the CSS in bootstrap5.min.css animates exactly as it does on the
 * live site.
 */

const INTERVAL = 5000; // Bootstrap's default, which the live site relies on.
const TRANSITION_MS = 600; // .carousel-item transition duration in Bootstrap 5.

type Direction = "next" | "prev";

export function initCarousels(root: ParentNode): () => void {
  const cleanups: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>(".carousel").forEach((carousel) => {
    cleanups.push(initCarousel(carousel));
  });

  return () => cleanups.forEach((fn) => fn());
}

function initCarousel(carousel: HTMLElement): () => void {
  const items = Array.from(
    carousel.querySelectorAll<HTMLElement>(".carousel-item"),
  );
  if (items.length < 2) return () => {};

  let sliding = false;
  let timer: number | undefined;
  let paused = false;

  const activeIndex = () =>
    items.findIndex((el) => el.classList.contains("active"));

  const slideTo = (direction: Direction) => {
    if (sliding) return;
    const from = activeIndex();
    if (from < 0) return;
    const to =
      direction === "next"
        ? (from + 1) % items.length
        : (from - 1 + items.length) % items.length;

    const current = items[from]!;
    const next = items[to]!;

    // Bootstrap's class dance: position the incoming slide, force a reflow,
    // then add the directional class that triggers the transform transition.
    const orderClass =
      direction === "next" ? "carousel-item-next" : "carousel-item-prev";
    const directionalClass =
      direction === "next" ? "carousel-item-start" : "carousel-item-end";

    sliding = true;
    next.classList.add(orderClass);
    void next.offsetHeight;
    current.classList.add(directionalClass);
    next.classList.add(directionalClass);

    const complete = () => {
      next.classList.remove(orderClass, directionalClass);
      next.classList.add("active");
      current.classList.remove("active", directionalClass);
      sliding = false;
      carousel.dispatchEvent(new CustomEvent("slid.bs.carousel"));
    };

    window.setTimeout(complete, TRANSITION_MS);
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => {
      if (!paused && !document.hidden) slideTo("next");
    }, INTERVAL);
  };

  const stop = () => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
  };

  const onControlClick = (event: Event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-bs-slide]",
    );
    if (!target || !carousel.contains(target)) return;
    event.preventDefault();
    slideTo(target.dataset.bsSlide === "prev" ? "prev" : "next");
  };

  const onEnter = () => {
    paused = true;
  };
  const onLeave = () => {
    paused = false;
  };

  carousel.addEventListener("click", onControlClick);
  carousel.addEventListener("mouseenter", onEnter);
  carousel.addEventListener("mouseleave", onLeave);

  if (carousel.dataset.bsRide === "carousel") start();

  return () => {
    stop();
    carousel.removeEventListener("click", onControlClick);
    carousel.removeEventListener("mouseenter", onEnter);
    carousel.removeEventListener("mouseleave", onLeave);
  };
}
