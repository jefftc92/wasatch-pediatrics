/**
 * Behaviour for the pages this project adds. Both parts are progressive: the
 * markup is complete and usable without them, and neither depends on jQuery or
 * on the theme's own scripts.
 */
(function () {
  "use strict";

  var wide = window.matchMedia("(min-width: 768px)");
  var mobile = window.matchMedia("(max-width: 767px)");

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

  /* ------------------------------------------------------- sticky navbar -- */

  /*
   * Pin the grey nav bar once the page scrolls past it. The theme positions it
   * absolutely, which cannot stick on its own, and the space it leaves behind
   * is already reserved by the header's bottom margin — so switching to fixed
   * moves nothing. Mobile is handled in CSS, where the whole header sticks.
   */
  var graynav = document.getElementById("graynav");
  if (graynav) {
    var pinAt = 0;
    var measure = function () {
      graynav.classList.remove("is-stuck");
      pinAt = graynav.getBoundingClientRect().top + window.scrollY;
    };
    var sync = function () {
      if (!wide.matches) {
        graynav.classList.remove("is-stuck");
        return;
      }
      graynav.classList.toggle("is-stuck", window.scrollY > pinAt);
    };
    measure();
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", function () {
      measure();
      sync();
    });
  }

  /* ------------------------------------------------- floating schedule -- */

  /*
   * On a phone the button starts as a full-width bar and folds into a circle
   * once the page has moved, then opens out again at the top. On a wide screen
   * the header carries the pill until it scrolls away, at which point the folded
   * button fades in as a reminder.
   */
  var dock = document.querySelector(".ctadock");
  if (dock) {
    var dockBtn = dock.querySelector(".ctadock-btn");
    var headerCta = document.querySelector(".header-cta");
    var morphTimer = null;
    var hideTimer = null;

    /*
     * Move the button between the header's pill and its resting corner.
     *
     * Order matters: the element is display:none until it is shown, and a
     * transition cannot start from a state it held while hidden. So it is made
     * visible, snapped to the far end with transitions off, and only then
     * allowed to animate back. Both ends are measured at the moment of the
     * switch rather than assumed.
     */
    var morph = function (from, fold) {
      if (!from || (!from.width && !from.height)) {
        dock.classList.toggle("is-mini", fold);
        return;
      }

      dock.classList.remove("is-morphing");
      dock.classList.toggle("is-mini", !fold);
      void dockBtn.offsetWidth;

      var to = dockBtn.getBoundingClientRect();
      dockBtn.style.transform =
        "translate(" +
        Math.round(from.left - to.left) +
        "px," +
        Math.round(from.top - to.top) +
        "px)";
      void dockBtn.offsetWidth;

      dock.classList.add("is-morphing");
      dockBtn.style.transform = "";
      dock.classList.toggle("is-mini", fold);

      window.clearTimeout(morphTimer);
      morphTimer = window.setTimeout(function () {
        dock.classList.remove("is-morphing");
      }, 460);
    };

    var syncDock = function () {
      if (wide.matches) {
        var gone = headerCta
          ? headerCta.getBoundingClientRect().bottom < 24
          : window.scrollY > 200;
        var shown = dock.classList.contains("is-shown");

        if (gone && !shown) {
          dock.classList.add("is-shown");
          morph(headerCta && headerCta.getBoundingClientRect(), true);
        } else if (!gone && shown) {
          /*
           * Travel back to the header still folded and hand over to the pill,
           * which is on screen again by then. Unfolding on the way up only
           * competes with it.
           */
          morph(headerCta && headerCta.getBoundingClientRect(), true);
          window.clearTimeout(hideTimer);
          hideTimer = window.setTimeout(function () {
            var back =
              headerCta && headerCta.getBoundingClientRect().bottom >= 24;
            if (wide.matches && back) {
              dock.classList.remove("is-shown", "is-morphing");
            }
          }, 430);
        }
        return;
      }

      dock.classList.remove("is-shown", "is-morphing");
      dock.classList.toggle("is-mini", window.scrollY > 140);
    };

    syncDock();
    window.addEventListener("scroll", syncDock, { passive: true });
    window.addEventListener("resize", syncDock);
  }

  /* --------------------------------------------------- mobile dropdowns -- */

  /*
   * The theme opens each dropdown independently on a phone, so tapping three of
   * them leaves three open and the menu runs for several screens. Make them
   * behave as an accordion: opening one closes the rest.
   *
   * This binds before jQuery's ready callback does, so it runs first on each
   * tap — the siblings are closed, then the theme toggles the one you tapped.
   * Closing uses the theme's own slideUp so the motion matches.
   */
  if (window.jQuery) {
    var $ = window.jQuery;
    $(".mainnav > li.menu-item-has-children").on("click", function () {
      if (!mobile.matches) return;
      var self = this;
      $(".mainnav > li.menu-item-has-children").each(function () {
        if (this === self || !$(this).hasClass("open")) return;
        $(this).removeClass("open").children(".sub-menu").slideUp("fast");
      });
    });
  }

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
