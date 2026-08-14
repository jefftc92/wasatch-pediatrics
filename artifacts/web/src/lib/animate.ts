/**
 * Minimal re-implementation of the handful of jQuery effects the original
 * wasatchpeds.net theme uses (`script.js`): slideToggle, fadeIn and fadeOut.
 *
 * jQuery's named durations are kept so the timing matches the live site:
 * "fast" = 200ms, "slow" = 600ms, default = 400ms. jQuery's default easing is
 * "swing", which is equivalent to CSS `ease-in-out`.
 */

export type Speed = "fast" | "slow" | number;

const SWING = "cubic-bezier(0.42, 0, 0.58, 1)";

export function duration(speed: Speed = 400): number {
  if (speed === "fast") return 200;
  if (speed === "slow") return 600;
  return speed;
}

/** Properties jQuery animates during a slide, in addition to height. */
const BOX_PROPS = [
  "marginTop",
  "marginBottom",
  "paddingTop",
  "paddingBottom",
] as const;

type Inline = Partial<
  Record<
    "height" | "overflow" | "transition" | (typeof BOX_PROPS)[number],
    string
  >
>;

function snapshot(el: HTMLElement): Inline {
  const s = el.style;
  return {
    height: s.height,
    overflow: s.overflow,
    transition: s.transition,
    marginTop: s.marginTop,
    marginBottom: s.marginBottom,
    paddingTop: s.paddingTop,
    paddingBottom: s.paddingBottom,
  };
}

function restore(el: HTMLElement, saved: Inline) {
  Object.assign(el.style, saved);
}

/** Forces a style recalculation so the next class/style change animates. */
function reflow(el: HTMLElement) {
  void el.offsetHeight;
}

const running = new WeakMap<HTMLElement, () => void>();

function cancelRunning(el: HTMLElement) {
  const cancel = running.get(el);
  if (cancel) cancel();
}

function slide(
  el: HTMLElement,
  down: boolean,
  speed: Speed,
  done?: () => void,
) {
  cancelRunning(el);

  const ms = duration(speed);
  const saved = snapshot(el);

  // These elements are hidden by a stylesheet rule, so an empty inline value
  // would not reveal them — jQuery sets an explicit display too.
  if (down) el.style.display = "block";
  // Measure the natural, fully-expanded box before animating.
  const computed = getComputedStyle(el);
  const target = {
    height: `${el.scrollHeight}px`,
    marginTop: computed.marginTop,
    marginBottom: computed.marginBottom,
    paddingTop: computed.paddingTop,
    paddingBottom: computed.paddingBottom,
  };
  const collapsed = {
    height: "0px",
    marginTop: "0px",
    marginBottom: "0px",
    paddingTop: "0px",
    paddingBottom: "0px",
  };

  const from = down ? collapsed : target;
  const to = down ? target : collapsed;

  el.style.overflow = "hidden";
  el.style.transition = "none";
  Object.assign(el.style, from);
  reflow(el);

  const props = ["height", ...BOX_PROPS]
    .map((p) => `${p} ${ms}ms ${SWING}`)
    .join(", ");
  el.style.transition = props;
  Object.assign(el.style, to);

  const finish = () => {
    el.removeEventListener("transitionend", onEnd);
    clearTimeout(timer);
    running.delete(el);
    restore(el, saved);
    el.style.display = down ? "block" : "none";
    done?.();
  };

  const onEnd = (e: TransitionEvent) => {
    if (e.target === el && e.propertyName === "height") finish();
  };

  el.addEventListener("transitionend", onEnd);
  // Safety net in case transitionend never fires (element removed, reduced motion, …).
  const timer = window.setTimeout(finish, ms + 60);
  running.set(el, finish);
}

export function slideDown(
  el: HTMLElement,
  speed: Speed = 400,
  done?: () => void,
) {
  slide(el, true, speed, done);
}

export function slideUp(
  el: HTMLElement,
  speed: Speed = 400,
  done?: () => void,
) {
  slide(el, false, speed, done);
}

export function slideToggle(
  el: HTMLElement,
  speed: Speed = 400,
  done?: () => void,
) {
  const hidden = getComputedStyle(el).display === "none";
  slide(el, hidden, speed, done);
}

function fade(
  el: HTMLElement,
  inward: boolean,
  speed: Speed,
  done?: () => void,
) {
  cancelRunning(el);

  const ms = duration(speed);
  const savedTransition = el.style.transition;

  if (inward) {
    el.style.display = "block";
    el.style.opacity = "0";
  }
  reflow(el);
  el.style.transition = `opacity ${ms}ms ${SWING}`;
  el.style.opacity = inward ? "1" : "0";

  const finish = () => {
    el.removeEventListener("transitionend", onEnd);
    clearTimeout(timer);
    running.delete(el);
    el.style.transition = savedTransition;
    if (inward) {
      el.style.opacity = "";
    } else {
      el.style.display = "none";
      el.style.opacity = "";
    }
    done?.();
  };

  const onEnd = (e: TransitionEvent) => {
    if (e.target === el && e.propertyName === "opacity") finish();
  };

  el.addEventListener("transitionend", onEnd);
  const timer = window.setTimeout(finish, ms + 60);
  running.set(el, finish);
}

export function fadeIn(el: HTMLElement, speed: Speed = 400, done?: () => void) {
  fade(el, true, speed, done);
}

export function fadeOut(
  el: HTMLElement,
  speed: Speed = 400,
  done?: () => void,
) {
  fade(el, false, speed, done);
}
