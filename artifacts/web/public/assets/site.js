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
    var hideTimer = null;
    // The trip back takes 420ms, during which scrolling keeps firing. Without
    // this every event restarted it and it never actually went anywhere.
    var returning = false;
    // Where the bubble sits when nothing is applied to it. Measured at the top
    // of each trip so the chase below can re-aim without measuring again.
    var parked = null;

    /*
     * On a wide screen the header's pill stays put — it scrolls away on its
     * own and is never hidden — so the bubble is a second object rather than
     * the same one relocated. All it has to do is come from the right place:
     * the trip is a transform and a fade, with no size change anywhere in it.
     *
     * Order matters. The element is display:none until it is shown, and a
     * transition cannot start from a state held while hidden, so the far end
     * is set with transitions off and read back before the near end is applied.
     */
    var naturalRect = function () {
      var held = dockBtn.style.transform;
      dock.classList.add("is-measuring");
      dockBtn.style.transform = "";
      void dockBtn.offsetWidth;
      var rect = dockBtn.getBoundingClientRect();
      dockBtn.style.transform = held;
      void dockBtn.offsetWidth;
      dock.classList.remove("is-measuring");
      return rect;
    };

    /*
     * Centre on centre, because the bubble is scaled down at the pill end and
     * a scale grows from the middle — matching corners would leave it visibly
     * off to one side of where it is supposed to have come from.
     */
    var atPill = function (rest) {
      var pill = headerCta && headerCta.getBoundingClientRect();
      if (!pill || (!pill.width && !pill.height) || !rest) return "scale(0.45)";
      var dx = pill.left + pill.width / 2 - (rest.left + rest.width / 2);
      var dy = pill.top + pill.height / 2 - (rest.top + rest.height / 2);
      return (
        "translate(" +
        Math.round(dx) +
        "px," +
        Math.round(dy) +
        "px) scale(0.45)"
      );
    };

    /* Out of the header and down to the corner. */
    var flyOut = function () {
      returning = false;
      window.clearTimeout(hideTimer);
      dock.classList.remove("is-flying");
      dock.classList.add("is-shown");
      parked = naturalRect();

      dock.classList.add("is-at-pill");
      dockBtn.style.transform = atPill(parked);
      void dockBtn.offsetWidth;

      dock.classList.add("is-flying");
      void dockBtn.offsetWidth;
      dock.classList.remove("is-at-pill");
      dockBtn.style.transform = "";
    };

    /* Back up to the pill, shrinking into it and fading as it goes. */
    var flyBack = function () {
      returning = true;
      parked = parked || naturalRect();
      dock.classList.add("is-flying");
      void dockBtn.offsetWidth;
      dock.classList.add("is-at-pill");
      dockBtn.style.transform = atPill(parked);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(finishReturn, 440);
    };

    function finishReturn() {
      returning = false;
      parked = null;
      dock.classList.remove("is-shown", "is-flying", "is-at-pill");
      dockBtn.style.transform = "";
    }

    var syncDock = function () {
      if (wide.matches) {
        var gone = headerCta
          ? headerCta.getBoundingClientRect().bottom < 24
          : window.scrollY > 200;
        var shown = dock.classList.contains("is-shown");

        if (gone) {
          // Either it is not out yet, or it is on its way home and the page
          // has turned around under it — both mean send it back to the corner.
          if (!shown || returning) flyOut();
        } else if (shown && !returning) {
          flyBack();
        }
        /*
         * Nothing while it is on its way home. Aiming again at the pill's live
         * position on each scroll event restarts the transform transition from
         * wherever it had got to, so it kept setting off afresh and never
         * arrived — measured: four restarts in 200ms, and it had covered a
         * third of the distance when the fade ran out. It is aimed once, at the
         * start, and by the time the page has moved enough for that aim to be
         * wrong the bubble is transparent anyway.
         */
        return;
      }

      /*
       * A phone keeps the button it always had: a full-width bar that folds
       * into a circle once the page has moved. None of the above applies.
       */
      returning = false;
      parked = null;
      window.clearTimeout(hideTimer);
      dock.classList.remove("is-shown", "is-flying", "is-at-pill");
      dockBtn.style.transform = "";
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

  /* ----------------------------------------------------------- map ------ */

  /*
   * The locations map.
   *
   * Leaflet is fetched only on the page that has a map, so the other 160 pages
   * pay nothing for it. Everything it draws is already in the HTML above it —
   * this replaces nothing, it just puts the eight offices somewhere you can see
   * them in relation to each other.
   *
   * One pin per office, never one per service. Two services at one address
   * would be two markers on identical coordinates, which no amount of nudging
   * makes readable; what an office offers lives inside its pin instead. The
   * filter then decides which pins are answers and which fade back.
   */
  var mapEl = document.getElementById("loc-map");

  /*
   * OpenStreetMap's own tiles, which need no key. They ask for attribution,
   * which the control bottom-right carries, and their usage policy is written
   * for modest traffic — if this page ever gets heavy, this one line is what
   * changes to point at a paid provider.
   */
  var TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  var TILE_CREDIT =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function loadLeaflet(el, done) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = el.getAttribute("data-leaflet-css");
    document.head.appendChild(css);

    var js = document.createElement("script");
    js.src = el.getAttribute("data-leaflet-js");
    js.onload = done;
    document.head.appendChild(js);
  }

  function popupMarkup(office) {
    return (
      '<div class="loc-pop">' +
      '<p class="loc-pop-name"><a href="' + office.href + '">' + office.name + "</a></p>" +
      "<p>" + office.address + "</p>" +
      '<p><a href="tel:' + office.phone + '">' + office.phoneText + "</a></p>" +
      '<p class="loc-pop-links">' +
      '<a href="#office-' + office.slug + '" data-office-jump="' + office.slug + '">What we offer here</a>' +
      '<a href="' + office.directions + '" target="_blank" rel="noopener">Directions</a>' +
      "</p></div>"
    );
  }

  function initMap(el) {
    var offices = JSON.parse(el.getAttribute("data-offices"));
    var cards = document.querySelectorAll(".loc-hit");
    var count = document.querySelector(".loc-count");
    var emptyNote = document.querySelector(".loc-empty");
    var select = document.getElementById("loc-service");

    /* Leaflet measures the container as it builds, so it has to be visible
       first — the class is what takes it out of display:none. */
    el.classList.add("is-ready");

    var map = L.map(el, {
      scrollWheelZoom: false,
      /* A one-finger drag inside a 340px map is a scroll the visitor meant for
         the page. The zoom buttons still work, and so do the pins. */
      dragging: !L.Browser.mobile,
      tap: false,
      /*
       * Leaflet fits bounds at whole zoom levels by default, which means
       * rounding down to the one that still contains Farmington and Park City
       * — and a whole level is a factor of two in scale. That put Cottonwood
       * and Salt Lake, four kilometres apart, 18px apart with 26px pins: they
       * overlapped. Allowing a fractional zoom uses the scale the bounds
       * actually call for and roughly doubles the gap.
       */
      zoomSnap: 0,
      zoomDelta: 0.5,
    });

    L.tileLayer(TILES, { attribution: TILE_CREDIT, maxZoom: 18 }).addTo(map);

    /* Has to agree with .loc-pin in site.css: Leaflet positions the icon by
       the size it is told, not the size the pin paints at. */
    var iconPx = mobile.matches ? [18, 18] : [22, 22];

    var markers = {};
    offices.forEach(function (office) {
      var marker = L.marker([office.lat, office.lng], {
        icon: L.divIcon({
          className: "loc-marker",
          html: '<span class="loc-pin"></span>',
          iconSize: iconPx,
          iconAnchor: [iconPx[0] / 2, iconPx[1] / 2],
          popupAnchor: [0, -(iconPx[1] / 2 + 2)],
        }),
        title: office.name,
        alt: office.name + " office",
        riseOnHover: true,
      });
      marker.bindPopup(popupMarkup(office));
      marker.addTo(map);
      markers[office.slug] = marker;
    });

    map.fitBounds(
      L.latLngBounds(
        offices.map(function (o) {
          return [o.lat, o.lng];
        }),
      ),
      /* A 44px inset is a quarter of a phone's map. Less padding there buys
         back scale, which is what keeps the closest pair apart. */
      { padding: mobile.matches ? [22, 22] : [44, 44] },
    );

    /* The map is inside a container that was display:none a moment ago, and on
       a phone the address bar can resize the viewport after that. */
    map.invalidateSize();

    function pinOf(slug) {
      var marker = markers[slug];
      return marker ? marker.getElement() : null;
    }

    function raise(slug, on) {
      var pin = pinOf(slug);
      if (pin) pin.classList.toggle("is-raised", on);
    }

    /* Pointing at a card lifts its pin, which is what makes two offices four
       kilometres apart tellable apart at this zoom. */
    cards.forEach(function (card) {
      var slug = card.getAttribute("data-office");
      var on = function () { raise(slug, true); };
      var off = function () { raise(slug, false); };
      card.addEventListener("mouseenter", on);
      card.addEventListener("mouseleave", off);
      card.addEventListener("focusin", on);
      card.addEventListener("focusout", off);
    });

    function pick(slug) {
      cards.forEach(function (card) {
        card.classList.toggle("is-picked", card.getAttribute("data-office") === slug);
      });
      var card = document.getElementById("office-" + slug);
      if (!card) return;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.focus({ preventScroll: true });
    }

    /* The popup is rebuilt each time it opens, so the handler goes on the map
       rather than on a link that may not exist yet. */
    map.on("popupopen", function (event) {
      var link = event.popup
        .getElement()
        .querySelector("[data-office-jump]");
      if (!link) return;
      link.addEventListener("click", function (clicked) {
        clicked.preventDefault();
        map.closePopup();
        pick(link.getAttribute("data-office-jump"));
      });
    });

    function apply(slug, label) {
      var shown = 0;
      cards.forEach(function (card) {
        var offered = (card.getAttribute("data-services") || "").split(" ");
        var match = !slug || offered.indexOf(slug) !== -1;
        card.hidden = !match;
        card.classList.remove("is-picked");
        if (match) shown++;

        /* Say which line in the list the filter was about. */
        card.querySelectorAll("[data-service]").forEach(function (item) {
          item.classList.toggle(
            "is-match",
            Boolean(slug) && item.getAttribute("data-service") === slug,
          );
        });

        var pin = pinOf(card.getAttribute("data-office"));
        if (pin) pin.querySelector(".loc-pin").classList.toggle("is-off", !match);
      });

      if (count) {
        count.textContent = !slug
          ? "All eight offices."
          : shown === 0
            ? "No office currently offers " + label + "."
            : shown === 8
              ? "All eight offices offer " + label + "."
              : shown + " of 8 offices offer " + label + ".";
      }
      if (emptyNote) emptyNote.hidden = shown > 0;

      /* Keeps the filtered view linkable, which is the same thing the form
         does without the script. */
      var url = slug
        ? window.location.pathname + "?service=" + encodeURIComponent(slug)
        : window.location.pathname;
      window.history.replaceState(null, "", url);
    }

    if (select) {
      var form = select.form;
      if (form) {
        /* The submit button is the no-script path; the change handler is why
           it is not needed here. */
        form.addEventListener("submit", function (event) {
          event.preventDefault();
        });
        var go = form.querySelector(".loc-filter-go");
        if (go) go.hidden = true;
      }
      select.addEventListener("change", function () {
        apply(select.value, select.options[select.selectedIndex].text);
      });
      /* The server may have rendered a filtered page; catch the pins up. */
      if (select.value) {
        apply(select.value, select.options[select.selectedIndex].text);
      }
    }
  }

  /*
   * After `load`, never before.
   *
   * The theme hides its full-screen white preloader on `window.load`, not on
   * DOM ready. Tiles requested before that event are subresources that gate it,
   * so a slow tile server — or an ad blocker that swallows the tile domain
   * outright — would leave the visitor staring at the spinner with the whole
   * page underneath it. Asking for Leaflet after the event means the map can
   * never hold the page hostage, and its 150KB stops competing with the page's
   * own assets on the way in.
   */
  function whenLoaded(fn) {
    if (document.readyState === "complete") fn();
    else window.addEventListener("load", fn);
  }

  if (mapEl && mapEl.getAttribute("data-leaflet-js")) {
    whenLoaded(function () {
      loadLeaflet(mapEl, function () {
        initMap(mapEl);
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
