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
    // The return takes 440ms, during which scrolling keeps firing. Without this
    // every event restarted the trip and it never actually went anywhere.
    var returning = false;
    // Where the button will rest once open, measured once when the return
    // starts so the live pill position can be chased without re-measuring.
    var returnRest = null;

    /*
     * Move the button between the header's pill and its resting corner.
     *
     * Clearing a transform always returns an element to where it naturally
     * sits — the corner — so only the trip down can be done that way. The trip
     * back has to run the other way about: start with no transform and animate
     * *to* an offset that lands on the pill. Getting this backwards had the
     * button fly up to the header and then slide back down again.
     *
     * Order matters either way. The element is display:none until it is shown,
     * and a transition cannot start from a state held while hidden, so each
     * end is set with transitions off and read back before the other is
     * applied. Both positions are measured rather than assumed.
     */
    var offsetTo = function (from, natural) {
      return (
        "translate(" +
        Math.round(from.left - natural.left) +
        "px," +
        Math.round(from.top - natural.top) +
        "px)"
      );
    };

    var morph = function (pill, direction) {
      if (!pill || (!pill.width && !pill.height)) {
        dock.classList.toggle("is-mini", direction === "out");
        return;
      }

      dock.classList.remove("is-morphing");
      // Travel sizing, so what arrives at the header is the size of the pill,
      // and transitions off while the two ends are measured and snapped.
      dock.classList.add("is-travel", "is-measuring");

      if (direction === "out") {
        dock.classList.remove("is-mini");
        void dockBtn.offsetWidth;
        dockBtn.style.transform = offsetTo(
          pill,
          dockBtn.getBoundingClientRect(),
        );
        void dockBtn.offsetWidth;

        dock.classList.remove("is-measuring");
        dock.classList.add("is-morphing");
        void dockBtn.offsetWidth;

        dockBtn.style.transform = "";
        dock.classList.add("is-mini");

        /*
         * Drop the travel styling once it has arrived. Only on the way out —
         * on the way back finishReturn owns the cleanup, and having this fire
         * first cleared the transform and snapped the button to the corner for
         * a frame before it disappeared.
         */
        window.clearTimeout(morphTimer);
        morphTimer = window.setTimeout(function () {
          dock.classList.remove("is-morphing", "is-travel", "is-measuring");
          dockBtn.style.transform = "";
        }, 540);
      } else {
        /*
         * Measure where it will end up before folding it back to the start —
         * with any earlier transform cleared first, since a rect includes it
         * and a stale one sends the button past the pill.
         */
        dockBtn.style.transform = "";
        dock.classList.remove("is-mini");
        void dockBtn.offsetWidth;
        var expanded = dockBtn.getBoundingClientRect();

        dock.classList.add("is-mini");
        void dockBtn.offsetWidth;

        /*
         * The transition has to be in force before the value changes, or the
         * browser sees both arrive in one recalculation and simply jumps.
         */
        returnRest = expanded;
        dock.classList.remove("is-measuring");
        dock.classList.add("is-morphing");
        void dockBtn.offsetWidth;

        dockBtn.style.transform = offsetTo(pill, expanded);
        dock.classList.remove("is-mini");
      }
    };

    /*
     * The pill takes over once the button has arrived and scrolling has
     * stopped. This always finishes: leaving it half-done because the pill had
     * moved again let the next scroll start a second return, which flashed the
     * button back at the corner for a frame before it disappeared. If the page
     * has gone back down, the next check simply sends it out again.
     */
    var finishReturn = function () {
      returning = false;
      returnRest = null;
      dock.classList.remove(
        "is-shown",
        "is-morphing",
        "is-travel",
        "is-measuring",
      );
      dockBtn.style.transform = "";
      if (headerCta) headerCta.classList.remove("is-handed-over");
    };

    var syncDock = function () {
      if (wide.matches) {
        var gone = headerCta
          ? headerCta.getBoundingClientRect().bottom < 24
          : window.scrollY > 200;
        var shown = dock.classList.contains("is-shown");

        if (gone && !shown) {
          returning = false;
          /*
           * Hand the pill's place over to the floating button, and hide the
           * pill itself — with both on screen the two read as separate things
           * rather than one moving, which is what made the return look wrong.
           * visibility keeps the pill's box, so it can still be measured.
           */
          var from = headerCta && headerCta.getBoundingClientRect();
          if (headerCta) headerCta.classList.add("is-handed-over");
          dock.classList.add("is-shown");
          window.clearTimeout(hideTimer);
          morph(from, "out");
        } else if (returning) {
          /*
           * Scrolling to the top animates, so the pill is still moving while
           * the button is on its way to it — aiming at wherever it was when the
           * trip started left the button parked above the pill. Keep re-aiming
           * at the live position; the transform transition smooths the chase.
           */
          if (returnRest && headerCta) {
            dockBtn.style.transform = offsetTo(
              headerCta.getBoundingClientRect(),
              returnRest,
            );
          }
          window.clearTimeout(hideTimer);
          hideTimer = window.setTimeout(finishReturn, 460);
        } else if (!gone && shown) {
          returning = true;
          /*
           * The reverse of the trip down: back up to the pill's place, opening
           * out as it goes, and only then does the pill take over. Travelling
           * back still folded meant a circle landing beside a full-width
           * button, which is the part that looked wrong.
           */
          morph(headerCta && headerCta.getBoundingClientRect(), "back");
          window.clearTimeout(hideTimer);
          hideTimer = window.setTimeout(finishReturn, 520);
        }
        return;
      }

      returning = false;
      dock.classList.remove("is-shown", "is-morphing", "is-travel");
      if (headerCta) headerCta.classList.remove("is-handed-over");
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
