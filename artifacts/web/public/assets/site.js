/**
 * Behaviour for the pages this project adds. Both parts are progressive: the
 * markup is complete and usable without them, and neither depends on jQuery or
 * on the theme's own scripts.
 */
(function () {
  "use strict";

  /*
   * The header's own breakpoint. The menu becomes a burger at 1199, so
   * everything that behaves one way with a menu bar and another with a burger
   * turns here — not at the theme's 768, which is where these used to be and
   * which left the dropdowns unopenable everywhere between the two.
   */
  var wide = window.matchMedia("(min-width: 1200px)");
  var mobile = window.matchMedia("(max-width: 1199px)");

  /* ------------------------------------------------------- section nav -- */

  // The bar scrolls sideways on a phone, so the page you are on can start off
  // beyond the right edge. Bring it into view.
  var current = document.querySelector(".secnav-list a.secnav-current");
  if (current) {
    var list = current.closest(".secnav-list");
    // Only when it is actually off-screen: on a wide viewport the whole bar
    // fits, and scrolling it then just clips the first item for no reason.
    if (list) {
      var left = current.offsetLeft;
      var right = left + current.offsetWidth;
      if (
        left < list.scrollLeft ||
        right > list.scrollLeft + list.clientWidth
      ) {
        list.scrollLeft = left - (list.clientWidth - current.offsetWidth) / 2;
      }
    }
  }

  /*
   * The menu the burger opens, after the window has been resized past it.
   *
   * The theme opens and closes it with jQuery's `slideToggle`, which finishes
   * by writing `style="display: none"` onto `#graynav`. That inline value
   * outranks every stylesheet, so opening the menu on a phone and closing it
   * again left the whole desktop menu invisible the moment the window was
   * widened past 1199 — nothing in CSS could bring it back.
   *
   * Clearing the inline value on the way past the breakpoint hands it back to
   * the stylesheet. Below the breakpoint it is left alone, because that is
   * where the theme's own open and close still need it.
   */
  var graynav = document.getElementById("graynav");

  if (graynav) {
    var wasDesktop = window.innerWidth >= 1200;
    var resizeTimer;

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var isDesktop = window.innerWidth >= 1200;
        if (isDesktop === wasDesktop) return;
        wasDesktop = isDesktop;
        if (isDesktop) {
          graynav.style.removeProperty("display");
          var burger = document.getElementById("mobileburger");
          if (burger) burger.classList.remove("open");
        }
      }, 120);
    });
  }

  /*
   * The section bar folds behind a toggle on a phone, where there is no room
   * for a row of services and no hover to open a flyout.
   */
  var secToggle = document.querySelector(".secbar-toggle");
  var secList = document.getElementById("secbar-list");

  if (secToggle && secList) {
    secToggle.addEventListener("click", function () {
      var open = secList.classList.toggle("is-open");
      secToggle.setAttribute("aria-expanded", String(open));
    });
  }

  /*
   * How many of a section's services the bar can actually show.
   *
   * The server folds to three, which is what fits in the narrowest container
   * the bar appears in. That is a floor, not the answer: at 1200 and up there
   * is room for five or six, and the container width is not something the
   * server can know. So measure the row and pull items back out of More while
   * they fit, then again whenever the window changes size.
   *
   * A promoted item is a plain link. Only dentistry's services carry a flyout
   * and dentistry has three of them, so nothing that folds has one to lose.
   */
  var secBar = document.querySelector("#secbar");
  var secMore = secBar && secBar.querySelector(".secbar-more");

  if (secBar && secMore && secList) {
    var secBox = secBar.querySelector(".container");
    var secName = secBar.querySelector(".secbar-name");
    var secStash = secMore.querySelector(".secfly-topics");
    var secFirst = secList.firstElementChild;

    /* One ordered list of everything between Overview and More. */
    var secAll = [];
    secList.querySelectorAll(".secbar-item").forEach(function (item) {
      if (item !== secFirst && item !== secMore) secAll.push(item);
    });
    secStash.querySelectorAll("a").forEach(function (link) {
      var item = document.createElement("li");
      /*
       * Carry the current-page state across. Without it an item the server had
       * already folded came back as an ordinary link, and the guard below could
       * not tell it was the page you were standing on — so it folded it again.
       */
      var here = link.parentElement.classList.contains("on");
      item.className = here ? "secbar-item on" : "secbar-item";
      item.appendChild(link.cloneNode(true));
      secAll.push(item);
    });

    var secWidth = function () {
      var used = secName.offsetWidth + 30;
      Array.prototype.forEach.call(secList.children, function (item) {
        used += item.offsetWidth + 30;
      });
      return used;
    };

    var secReflow = function () {
      /* Everything back in, then take the tail out again until the row fits. */
      secAll.forEach(function (item) {
        secList.insertBefore(item, secMore);
      });
      secStash.textContent = "";
      secMore.hidden = true;

      /* Below 992 the bar is a dropdown, and the whole list belongs in it. */
      if (window.innerWidth < 992) return;

      /*
       * `secAll` keeps the true order and is never reordered, so every reflow
       * starts from the same bar rather than from the last one's leftovers.
       */
      var shown = secAll.slice();
      while (shown.length && secWidth() > secBox.clientWidth) {
        /*
         * Never fold the page you are on — it is the one item the bar exists to
         * point at. Walk back past it and fold the one before instead.
         */
        var at = shown.length - 1;
        while (at >= 0 && shown[at].classList.contains("on")) at--;
        if (at < 0) break;

        var item = shown[at];
        shown.splice(at, 1);
        secMore.hidden = false;
        var out = document.createElement("li");
        if (item.classList.contains("on")) out.className = "on";
        out.appendChild(item.querySelector("a").cloneNode(true));
        secList.removeChild(item);
        /* Folded from the end backwards, so prepending keeps them in order. */
        secStash.insertBefore(out, secStash.firstChild);
      }
    };

    secReflow();

    var secTimer;
    window.addEventListener("resize", function () {
      clearTimeout(secTimer);
      secTimer = setTimeout(secReflow, 120);
    });
  }

  /*
   * The flyout's two panels. Pointing at a topic on the left swaps the pages
   * shown on the right; the topic's own name is still a link to it, so the
   * pointer never has to land somewhere that does nothing.
   */
  document.querySelectorAll(".secbar-item.has-fly").forEach(function (item) {
    var topics = item.querySelectorAll(".secfly-topics a[data-group]");
    var panes = item.querySelectorAll(".secfly-pages[data-group]");
    if (!topics.length) return;

    var show = function (index) {
      topics.forEach(function (link) {
        link.parentElement.classList.toggle(
          "on",
          link.getAttribute("data-group") === index,
        );
      });
      panes.forEach(function (pane) {
        pane.hidden = pane.getAttribute("data-group") !== index;
      });
    };

    topics.forEach(function (link) {
      var index = link.getAttribute("data-group");
      link.addEventListener("mouseenter", function () {
        show(index);
      });
      link.addEventListener("focus", function () {
        show(index);
      });
    });

    /* Leaving the flyout puts it back to the topic it opens on, so it always
       opens the same way rather than wherever the pointer last left it. */
    var right = item.querySelector(".secfly-right");
    var first = (right && right.getAttribute("data-first")) || "0";
    item.addEventListener("mouseleave", function () {
      show(first);
    });
  });

  /* ----------------------------------------------------- service filter -- */

  var chips = document.querySelectorAll(".svc-chip");
  var hits = document.querySelectorAll(".svc-hit");
  var empty = document.querySelector(".svc-empty");
  if (!chips.length || !hits.length) return;

  function apply(pillar) {
    var shown = 0;
    hits.forEach(function (hit) {
      var match = !pillar || hit.getAttribute("data-pillar") === pillar;
      hit.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (other) {
        other.classList.toggle("is-on", other === chip);
        other.setAttribute("aria-pressed", String(other === chip));
      });
      apply(chip.getAttribute("data-pillar"));
    });
    chip.setAttribute("aria-pressed", String(chip.classList.contains("is-on")));
  });
})();
