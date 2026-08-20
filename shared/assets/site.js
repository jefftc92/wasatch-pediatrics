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
    /*
     * A phone has no room for the header's pill, so the button lives at the
     * bottom of the screen instead: a full-width bar that folds into a circle
     * once the page has moved, and opens out again at the top.
     *
     * A wide screen keeps the pill in the header and that is all it gets. The
     * bubble used to fly down to the corner and back as you scrolled, which
     * was a second copy of a button already on the page.
     */
    var syncDock = function () {
      dock.classList.toggle("is-mini", !wide.matches && window.scrollY > 140);
    };

    syncDock();
    window.addEventListener("scroll", syncDock, { passive: true });
    window.addEventListener("resize", syncDock);
  }

  /* --------------------------------------------------------- section nav -- */

  /*
   * The section bar lists everything at this level, which on a phone ran to
   * most of a screen before the page began. Closed there, open on a wide
   * screen, where there is room for it.
   *
   * It ships open, so with no script it stays that way — long, but nothing is
   * hidden. A <details> shipped closed could not be forced open by CSS on a
   * desktop: the content is hidden through ::details-content, which `display`
   * on the children does not reach.
   */
  var browse = document.querySelector(".secnav-browse");
  if (browse) {
    var opened = false;
    browse.addEventListener("toggle", function () {
      if (!wide.matches && browse.open) opened = true;
    });

    var syncBrowse = function () {
      if (wide.matches) browse.open = true;
      else if (!opened) browse.open = false;
    };

    syncBrowse();
    window.addEventListener("resize", syncBrowse);
  }

  /* ------------------------------------------------------- nav dropdowns -- */

  /*
   * A mouse click on a top-level item used to focus it, and the :focus-within
   * rule that opens its panel then held that panel open after the pointer had
   * moved to a different item and opened that one too — two panels at once,
   * and the first one still there after the pointer had left the bar entirely.
   *
   * The keyboard needs :focus-within to reach the links inside the panel, so
   * the focus is taken off the click rather than out of the rule. Preventing
   * the default on mousedown suppresses the focus without touching the click,
   * so the link still follows its href.
   *
   * Pointer only. On a phone these taps expand the panel rather than following
   * the link, which is the theme's own behaviour and wants leaving alone.
   */
  var navParents = document.querySelectorAll(
    ".mainnav > li.menu-item-has-children > a",
  );
  navParents.forEach(function (link) {
    link.addEventListener("mousedown", function (event) {
      if (wide.matches) event.preventDefault();
    });
  });

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
   * Google Maps, loaded only on the page that has a map, so the other 160 pages
   * pay nothing for it. Everything it draws is already in the HTML above it —
   * every office's address, phone number, categories and full service list — so
   * this replaces nothing. It puts the eight offices somewhere you can see them
   * in relation to each other, and it is the practice's own map provider.
   *
   * One pin per office, never one per service. Two services at one address
   * would be two markers on identical coordinates, which no amount of nudging
   * makes readable. What an office offers is drawn *into* its pin instead: the
   * head is divided into one segment per care category, in the legend's colours
   * and its order, so every pin reads the same way round. Eight categories is
   * the most any office has, and eight segments is still legible at 40px.
   *
   * The filter then decides which pins are answers and which fade back, rather
   * than removing them — an office that does not do the thing you asked for is
   * still an office, and seeing it greyed tells you more than seeing nothing.
   */
  var mapEl = document.getElementById("loc-map");

  var PIN_R = 15;
  var PIN_CX = 20;
  var PIN_CY = 20;

  /**
   * The pin, as SVG. `colors` is one entry per care category the office has, in
   * legend order; `dim` is the filtered-out state.
   */
  function pinSvg(colors, dim) {
    var n = colors.length || 1;
    var seg = "";

    if (n === 1) {
      seg =
        '<circle cx="' + PIN_CX + '" cy="' + PIN_CY + '" r="' + PIN_R +
        '" fill="' + (colors[0] || "#2b93d1") + '"/>';
    } else {
      for (var i = 0; i < n; i++) {
        var a0 = (Math.PI * 2 * i) / n - Math.PI / 2;
        var a1 = (Math.PI * 2 * (i + 1)) / n - Math.PI / 2;
        var x0 = PIN_CX + PIN_R * Math.cos(a0);
        var y0 = PIN_CY + PIN_R * Math.sin(a0);
        var x1 = PIN_CX + PIN_R * Math.cos(a1);
        var y1 = PIN_CY + PIN_R * Math.sin(a1);
        seg +=
          '<path d="M' + PIN_CX + " " + PIN_CY + " L" + x0.toFixed(2) + " " + y0.toFixed(2) +
          " A" + PIN_R + " " + PIN_R + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " +
          x1.toFixed(2) + " " + y1.toFixed(2) + ' Z" fill="' + colors[i] + '"/>';
      }
    }

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">' +
      '<path d="M20 51C20 51 35 32.5 35 20A15 15 0 0 0 5 20C5 32.5 20 51 20 51Z" fill="#ffffff"' +
      (dim ? ' opacity="0.55"' : "") + "/>" +
      "<g" + (dim ? ' opacity="0.45"' : "") + ">" + seg + "</g>" +
      '<circle cx="' + PIN_CX + '" cy="' + PIN_CY + '" r="' + PIN_R +
      '" fill="none" stroke="#ffffff" stroke-width="3"' + (dim ? ' opacity="0.7"' : "") + "/>" +
      "</svg>"
    );
  }

  function pinUrl(colors, dim) {
    return (
      "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(pinSvg(colors, dim))
    );
  }

  function popupMarkup(office) {
    var cats = office.categories.length
      ? '<p class="loc-pop-cats">' + office.categories.join(" &middot; ") + "</p>"
      : "";
    return (
      '<div class="loc-pop">' +
      '<p class="loc-pop-name"><a href="' + office.href + '">' + office.name + "</a></p>" +
      "<p>" + office.address + "</p>" +
      '<p><a href="tel:' + office.phone + '">' + office.phoneText + "</a></p>" +
      cats +
      '<p class="loc-pop-links">' +
      '<a href="#office-' + office.slug + '" data-office-jump="' + office.slug + '">What we offer here</a>' +
      '<a href="' + office.directions + '" target="_blank" rel="noopener">Directions</a>' +
      "</p></div>"
    );
  }

  /**
   * Google's script is loaded by inserting a tag rather than through the newer
   * bootstrap loader, so there is exactly one way in and a failure is a plain
   * onerror we can act on. A key that is missing, wrong or over quota must not
   * leave a grey rectangle where a map was promised.
   */
  function loadGoogleMaps(key, done, fail) {
    var cb = "__wpMapsReady";
    window[cb] = function () {
      done();
    };
    var js = document.createElement("script");
    js.src =
      "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(key) +
      "&libraries=marker&loading=async&callback=" + cb;
    js.async = true;
    js.onerror = fail;
    document.head.appendChild(js);
  }

  function initMap(el) {
    var offices = JSON.parse(el.getAttribute("data-offices"));
    var mapId = el.getAttribute("data-maps-id") || "";
    var cards = document.querySelectorAll(".loc-hit");
    var count = document.querySelector(".loc-count");
    var emptyNote = document.querySelector(".loc-empty");
    var select = document.getElementById("loc-service");

    var opts = {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      /* The practice is on the Wasatch Front; nobody needs to pan to Kansas. */
      restriction: {
        latLngBounds: { north: 42.2, south: 39.4, west: -113.2, east: -110.2 },
        strictBounds: false,
      },
    };
    if (mapId) opts.mapId = mapId;

    var map = new google.maps.Map(el, opts);
    var bounds = new google.maps.LatLngBounds();
    var info = new google.maps.InfoWindow();
    var markers = {};

    /*
     * AdvancedMarkerElement is the supported marker and needs a Map ID; the
     * classic Marker needs only the key. Which one is available depends on how
     * the practice set the account up, so both are handled and the pin is the
     * same SVG either way.
     */
    var Advanced =
      mapId && google.maps.marker && google.maps.marker.AdvancedMarkerElement
        ? google.maps.marker.AdvancedMarkerElement
        : null;

    function makeMarker(office) {
      var position = { lat: office.lat, lng: office.lng };

      if (Advanced) {
        var img = document.createElement("img");
        img.src = pinUrl(office.colors, false);
        img.width = 40;
        img.height = 52;
        img.alt = "";
        return new Advanced({
          map: map,
          position: position,
          title: office.name,
          content: img,
        });
      }

      return new google.maps.Marker({
        map: map,
        position: position,
        title: office.name,
        icon: {
          url: pinUrl(office.colors, false),
          scaledSize: new google.maps.Size(40, 52),
          anchor: new google.maps.Point(20, 51),
        },
      });
    }

    function setDim(office, marker, dim) {
      var url = pinUrl(office.colors, dim);
      if (Advanced) {
        if (marker.content) marker.content.src = url;
        marker.zIndex = dim ? 1 : 2;
      } else {
        marker.setIcon({
          url: url,
          scaledSize: new google.maps.Size(40, 52),
          anchor: new google.maps.Point(20, 51),
        });
        marker.setZIndex(dim ? 1 : 2);
      }
    }

    offices.forEach(function (office) {
      var marker = makeMarker(office);
      markers[office.slug] = marker;
      bounds.extend({ lat: office.lat, lng: office.lng });
      marker.addListener("click", function () {
        info.setContent(popupMarkup(office));
        if (Advanced) info.open({ map: map, anchor: marker });
        else info.open(map, marker);
      });
    });

    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });

    /* Eight offices across fifty kilometres can fit tighter than is useful. */
    google.maps.event.addListenerOnce(map, "idle", function () {
      if (map.getZoom() > 11) map.setZoom(11);
    });

    function apply(slug) {
      var shown = 0;
      offices.forEach(function (office) {
        var match = !slug || office.services.indexOf(slug) !== -1;
        if (match) shown++;
        setDim(office, markers[office.slug], !match);
      });
      cards.forEach(function (card) {
        var list = (card.getAttribute("data-services") || "").split(" ");
        card.hidden = Boolean(slug) && list.indexOf(slug) === -1;
      });
      if (emptyNote) emptyNote.hidden = shown > 0;
      if (count) {
        var label = select && select.selectedOptions[0] && select.selectedOptions[0].text;
        count.textContent = !slug
          ? "All eight offices."
          : shown === 0
            ? "No office currently offers " + label + "."
            : shown === 8
              ? "All eight offices offer " + label + "."
              : shown + " of 8 offices offer " + label + ".";
      }
      info.close();
    }

    if (select) {
      var form = select.closest("form");
      if (form) {
        var go = form.querySelector(".loc-filter-go");
        if (go) go.hidden = true;
        form.addEventListener("submit", function (event) {
          event.preventDefault();
        });
      }
      select.addEventListener("change", function () {
        var slug = select.value;
        apply(slug);
        /* The filter is a real URL, so a filtered map can be linked and shared. */
        if (window.history && window.history.replaceState) {
          window.history.replaceState(
            {},
            "",
            slug ? "?service=" + encodeURIComponent(slug) : window.location.pathname,
          );
        }
      });
    }

    document.addEventListener("click", function (event) {
      var jump = event.target.closest && event.target.closest("[data-office-jump]");
      if (!jump) return;
      event.preventDefault();
      var card = document.getElementById("office-" + jump.getAttribute("data-office-jump"));
      if (!card) return;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.focus({ preventScroll: true });
    });

    apply(el.getAttribute("data-active") || "");
  }

  /**
   * When the map is built, and why it waits.
   *
   * Google bills Dynamic Maps per successful map load — one billable event each
   * time `new google.maps.Map()` runs. Everything after that is free: panning,
   * zooming, the markers, the info windows, the filter redrawing every pin. So
   * the only number worth reducing is how often a map gets created at all, and
   * the answer is not to create one for somebody who never looks at it.
   *
   * Two gates, in order:
   *
   * 1. The load event, so the map can never hold the page hostage. Scripts
   *    requested before it are subresources that gate it, so a slow maps host —
   *    or a blocker that swallows the domain outright — would leave the visitor
   *    staring at a spinner with the whole page underneath it.
   *
   * 2. The map scrolling into view. It sits below the intro and the filter, so
   *    somebody who lands on the page, reads an address and leaves never costs
   *    anything, while anybody who actually scrolls to it gets it — loading
   *    300px early, so it is drawn by the time it arrives rather than appearing
   *    after it. Where IntersectionObserver is missing, it just loads.
   *
   * Everything the map shows is in the HTML either way, so a visitor who never
   * triggers it still gets all eight offices, their addresses, their phone
   * numbers and everything they offer.
   */
  function whenLoaded(fn) {
    if (document.readyState === "complete") fn();
    else window.addEventListener("load", fn);
  }

  function whenSeen(el, fn) {
    if (!("IntersectionObserver" in window)) {
      fn();
      return;
    }
    var seen = false;
    var watcher = new IntersectionObserver(
      function (entries) {
        if (seen || !entries.some(function (e) { return e.isIntersecting; })) return;
        seen = true;
        watcher.disconnect();
        fn();
      },
      { rootMargin: "300px 0px" },
    );
    watcher.observe(el);
  }

  if (mapEl && mapEl.getAttribute("data-maps-key")) {
    whenLoaded(function () {
      whenSeen(mapEl, function () {
        loadGoogleMaps(
          mapEl.getAttribute("data-maps-key"),
          function () {
            initMap(mapEl);
          },
          function () {
            mapEl.classList.add("is-off");
            mapEl.innerHTML =
              '<p class="loc-map-off">The map could not load just now. Every office is listed below with its address, phone number and everything it offers.</p>';
          },
        );
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
