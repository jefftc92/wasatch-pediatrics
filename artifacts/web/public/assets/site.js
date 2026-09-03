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
   * The main nav on a phone.
   *
   * The theme makes the whole row a toggle and calls preventDefault on the
   * anchor, so tapping Services expanded it and went nowhere — /services/,
   * /locations/ and /resources/ could not be reached from the menu at all. It
   * also opens each one independently, so three taps left three panels open and
   * the menu ran for several screens.
   *
   * Both are replaced here: the label is a link again, the caret beside it is
   * what opens the panel, and opening one closes the rest.
   *
   * The theme binds its handlers in a jQuery ready callback. This file is in
   * the head and the theme's is at the foot, so this registers first and runs
   * first on each tap — stopImmediatePropagation is what keeps the theme's
   * version from running afterwards and undoing it.
   */
  if (window.jQuery) {
    var $ = window.jQuery;
    var parents = ".mainnav > li.menu-item-has-children";

    var closeNav = function (except) {
      $(parents).each(function () {
        if (this === except || !$(this).hasClass("open")) return;
        $(this).removeClass("open").children(".sub-menu").stop(true, true).slideUp("fast");
        $(this).children(".navtoggle").attr("aria-expanded", "false");
      });
    };

    /* The label navigates. Nothing else may claim the tap. */
    $(parents + " > a").on("click", function (event) {
      if (!mobile.matches) return;
      event.stopImmediatePropagation();
    });

    /*
     * The caret opens, and closes whatever else was open.
     *
     * `slideDown` and `slideUp` by name rather than `slideToggle`, because
     * that asks jQuery whether the panel is visible and jQuery answered wrong
     * between 768 and 1199 — it closed a panel that CSS had never opened, so
     * the caret appeared to do nothing there. The class says what the state
     * is; the animation follows it rather than guessing at it.
     */
    $(parents + " > .navtoggle").on("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      var li = $(this).parent();
      var willOpen = !li.hasClass("open");
      closeNav(li[0]);
      li.toggleClass("open", willOpen);
      var sub = li.children(".sub-menu").stop(true, true);
      if (willOpen) sub.slideDown("fast");
      else sub.slideUp("fast");
      $(this).attr("aria-expanded", String(willOpen));
    });

    /*
     * The theme's row handler still fires for taps that are neither — the gap
     * beside the label. Left alone it would toggle without the caret agreeing,
     * so it is stopped and the accordion rule applied in its place.
     */
    $(parents).on("click", function (event) {
      if (!mobile.matches) return;
      if ($(event.target).closest("a, .navtoggle, .sub-menu").length) return;
      event.stopImmediatePropagation();
    });
  }

  /* -------------------------------------------------- header search ---- */

  /*
   * Opening and closing the site search.
   *
   * The field never appeared, and not because nothing was listening. The
   * theme's script adds `.open` to the input on click, and the theme's
   * stylesheet widens `.searchwrap input.open` to 415px. What it cannot do is
   * widen the *wrapper*: this header clips it to the width of the glass, so
   * the field opened to 415px inside a 16px window and stayed invisible.
   *
   * The state therefore goes on the wrapper, which is the input's ancestor and
   * so out of reach of any rule keyed on the input. Driving it from here
   * rather than from `:has()` also gets the close button working at every
   * width: the theme's handler is gated above 767px, which left the burger
   * band with a glass that could open a field it could never close.
   */
  var searchWrap = document.getElementById("searchformwrap");

  if (searchWrap) {
    var searchField = searchWrap.querySelector(".navsearch");

    function openSearch() {
      searchWrap.classList.add("is-open");
      if (searchField) {
        searchField.setAttribute("placeholder", "Search");
        searchField.focus();
      }
    }

    function closeSearch() {
      searchWrap.classList.remove("is-open");
      if (searchField) {
        searchField.value = "";
        searchField.setAttribute("placeholder", "");
        /* The theme's handler leaves `.open` behind at widths it ignores. */
        searchField.classList.remove("open");
      }
    }

    /*
     * The glass is the submit button, so it has two jobs. Closed, it opens the
     * field and must not submit; open with something typed in it, it submits
     * as a search button should.
     */
    searchWrap.addEventListener("click", function (event) {
      if (event.target.closest(".searchclose")) {
        event.preventDefault();
        closeSearch();
        return;
      }
      if (!event.target.closest(".searchbutton")) return;
      if (!searchWrap.classList.contains("is-open")) {
        event.preventDefault();
        openSearch();
      } else if (searchField && !searchField.value.trim()) {
        event.preventDefault();
        closeSearch();
      }
    });

    /* Escape closes it, and so does clicking anywhere else on the page. */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && searchWrap.classList.contains("is-open")) {
        closeSearch();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        searchWrap.classList.contains("is-open") &&
        !searchWrap.contains(event.target) &&
        (!searchField || !searchField.value.trim())
      ) {
        closeSearch();
      }
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

  /*
   * The four care-type symbols, as raw path data.
   *
   * A marker is a single image, so the sprite at /assets/icons.svg cannot be
   * referenced from inside one — an external `use` does not resolve in a data
   * URI. These are the same four paths that sprite holds, on the same 256 grid,
   * copied in by tools/build-icons.mjs so they cannot drift from the key.
   */
  var CARE_ICON = {
      "stethoscope": "M220 160a12 12 0 1 1-12-12a12 12 0 0 1 12 12m-4.55 39.29A48.08 48.08 0 0 1 168 240h-24a48.05 48.05 0 0 1-48-48v-40.51A64 64 0 0 1 40 88V40a8 8 0 0 1 8-8h24a8 8 0 0 1 0 16H56v40a48 48 0 0 0 48.64 48c26.11-.34 47.36-22.25 47.36-48.83V48h-16a8 8 0 0 1 0-16h24a8 8 0 0 1 8 8v47.17c0 32.84-24.53 60.29-56 64.31V192a32 32 0 0 0 32 32h24a32.06 32.06 0 0 0 31.22-25a40 40 0 1 1 16.23.27ZM232 160a24 24 0 1 0-24 24a24 24 0 0 0 24-24",
      "heart": "M178 40c-20.65 0-38.73 8.88-50 23.89C116.73 48.88 98.65 40 78 40a62.07 62.07 0 0 0-62 62c0 70 103.79 126.66 108.21 129a8 8 0 0 0 7.58 0C136.21 228.66 240 172 240 102a62.07 62.07 0 0 0-62-62m-50 174.8c-18.26-10.64-96-59.11-96-112.8a46.06 46.06 0 0 1 46-46c19.45 0 35.78 10.36 42.6 27a8 8 0 0 0 14.8 0c6.82-16.67 23.15-27 42.6-27a46.06 46.06 0 0 1 46 46c0 53.61-77.76 102.15-96 112.8",
      "baby": "M92 140a12 12 0 1 1 12-12a12 12 0 0 1-12 12m72-24a12 12 0 1 0 12 12a12 12 0 0 0-12-12m-12.27 45.23a45 45 0 0 1-47.46 0a8 8 0 0 0-8.54 13.54a61 61 0 0 0 64.54 0a8 8 0 0 0-8.54-13.54M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88.11 88.11 0 0 0-84.09-87.91C120.32 56.38 120 71.88 120 72a8 8 0 0 0 16 0a8 8 0 0 1 16 0a24 24 0 0 1-48 0c0-.73.13-14.3 8.46-30.63A88 88 0 1 0 216 128",
      "tooth": "M171 71.42L149.54 80L171 88.57a8 8 0 1 1-6 14.85l-37-14.81l-37 14.81a8 8 0 1 1-6-14.85L106.46 80L85 71.42a8 8 0 1 1 6-14.85l37 14.81l37-14.81a8 8 0 1 1 6 14.85m53 8.33c0 42.72-8 75.4-14.69 95.28c-8.73 25.8-20.63 45.49-32.65 54a15.69 15.69 0 0 1-15.95 1.41a16.09 16.09 0 0 1-9.18-13.36c-.85-11.5-5.05-49.08-23.53-49.08s-22.68 37.59-23.53 49.11a16.09 16.09 0 0 1-16 14.9a15.67 15.67 0 0 1-9.13-2.95c-12-8.53-23.92-28.22-32.65-54C40 155.15 32 122.47 32 79.75A56 56 0 0 1 88 24h80a56 56 0 0 1 56 55.75m-16 0A40 40 0 0 0 168 40H88a40 40 0 0 0-40 39.76c0 40.55 7.51 71.4 13.85 90.14c11.05 32.66 23 43.37 26.61 46C91.57 174.67 105.59 152 128 152s36.45 22.71 39.49 63.94c3.6-2.59 15.57-13.26 26.66-46c6.34-18.78 13.85-49.63 13.85-90.18Z"
  };

  /*
   * The pin.
   *
   * A teardrop for where the office is, and above it a small white bar holding
   * one badge per kind of care it gives — the same badges, the same colours and
   * the same order as the key on the map. Four segments of a pie all looked
   * alike once you were past two; four little symbols in a row do not, and they
   * say what they mean without the key having to be consulted.
   *
   * It is one SVG rather than a pin plus an overlay because a marker is a
   * single image. The whole thing is anchored at the point of the teardrop, so
   * the bar rides above the place rather than covering it.
   */
  var PIN_W = 34;
  var PIN_H = 44;
  var BADGE = 20;
  var BADGE_GAP = 2;
  var BAR_PAD = 3;
  var BAR_GAP = 3;
  /* A hairline round the bar, enough to seat it on the map without reading as
     a drawn-on border. Zoomed in the bars do not overlap, so it only has to
     separate white from a pale basemap. */
  var BAR_EDGE = 1;
  var BAR_EDGE_COLOR = "#c8cdd2";
  /*
   * The zoom at which the bars appear.
   *
   * Cottonwood and Salt Lake are 4.4km apart, which is 19px at zoom 9 and 38px
   * at zoom 10 — closer than two three-badge bars are wide. At zoom 11 they are
   * 76px apart and no pair on the map overlaps, so that is where the bars are
   * worth showing. Below it the same care types divide the pin's own head
   * instead, which costs no more room than the pin already takes.
   */
  var BAR_ZOOM = 11;

  function barWidth(n) {
    return n * BADGE + (n - 1) * BADGE_GAP + BAR_PAD * 2;
  }

  /** The teardrop's outline, on a 40x52 grid. */
  var DROP =
    "M20 51C20 51 35 32.5 35 20A15 15 0 0 0 5 20C5 32.5 20 51 20 51Z";

  /**
   * Zoomed out: the care types divide the pin's own head.
   *
   * Nothing sits above the pin at this zoom, so two close offices overlap by
   * only as much as two 40px teardrops do rather than by the width of two
   * bars. The white ring around the head is what keeps them apart where they
   * do touch.
   */
  function wheelSvg(colors, dim) {
    var n = colors.length || 1;
    var r = 15;
    var seg = "";

    if (n === 1) {
      seg = '<circle cx="20" cy="20" r="' + r + '" fill="' +
        (colors[0] || "#2b93d1") + '"/>';
    } else {
      for (var i = 0; i < n; i++) {
        var a0 = (Math.PI * 2 * i) / n - Math.PI / 2;
        var a1 = (Math.PI * 2 * (i + 1)) / n - Math.PI / 2;
        seg +=
          '<path d="M20 20 L' + (20 + r * Math.cos(a0)).toFixed(2) + " " +
          (20 + r * Math.sin(a0)).toFixed(2) + " A" + r + " " + r + " 0 " +
          (a1 - a0 > Math.PI ? 1 : 0) + " 1 " +
          (20 + r * Math.cos(a1)).toFixed(2) + " " +
          (20 + r * Math.sin(a1)).toFixed(2) + ' Z" fill="' + colors[i] + '"/>';
      }
    }

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">' +
      '<g opacity="' + (dim ? 0.45 : 1) + '">' +
      '<path d="' + DROP + '" fill="#ffffff"/>' + seg +
      '<circle cx="20" cy="20" r="' + r + '" fill="none" stroke="#ffffff" stroke-width="3"/>' +
      "</g></svg>"
    );
  }

  /** Zoomed in: the key's badges on a bar above the pin. */
  function barSvg(icons, colors, dim) {
    var n = Math.max(icons.length, 1);
    var bw = barWidth(n);
    var bh = BADGE + BAR_PAD * 2;
    var box = pinSize(icons.length, true);
    var midX = box.w / 2;

    var badges = "";
    for (var i = 0; i < icons.length; i++) {
      var x = midX - bw / 2 + BAR_PAD + i * (BADGE + BADGE_GAP);
      var path = CARE_ICON[icons[i]];
      badges +=
        '<rect x="' + x.toFixed(1) + '" y="' + BAR_PAD + '" width="' + BADGE +
        '" height="' + BADGE + '" rx="4" fill="' + colors[i] + '"/>';
      if (path) {
        /* 256-unit artwork scaled into a 14px square, centred in the badge. */
        var s = 14 / 256;
        badges +=
          '<g transform="translate(' + (x + (BADGE - 14) / 2).toFixed(1) + " " +
          (BAR_PAD + (BADGE - 14) / 2).toFixed(1) + ') scale(' + s.toFixed(5) +
          ')"><path fill="#ffffff" d="' + path + '"/></g>';
      }
    }

    var bar =
      '<rect x="' + (midX - bw / 2 + BAR_EDGE / 2).toFixed(1) + '" y="' +
      (BAR_EDGE / 2).toFixed(1) + '" width="' + (bw - BAR_EDGE).toFixed(1) +
      '" height="' + (bh - BAR_EDGE).toFixed(1) +
      '" rx="6" fill="#ffffff" stroke="' + BAR_EDGE_COLOR + '" stroke-width="' +
      BAR_EDGE + '"/>' + badges;

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + box.w + '" height="' +
      box.h + '" viewBox="0 0 ' + box.w + " " + box.h + '">' +
      '<g opacity="' + (dim ? 0.45 : 1) + '">' + bar +
      '<g transform="translate(' + (midX - PIN_W / 2).toFixed(1) + " " +
      (bh + BAR_GAP) + ')">' +
      '<svg width="' + PIN_W + '" height="' + PIN_H + '" viewBox="0 0 40 52">' +
      '<path d="' + DROP + '" fill="#2b93d1" stroke="#ffffff" stroke-width="2.5"/>' +
      '<circle cx="20" cy="19" r="5.5" fill="#ffffff" opacity="0.92"/>' +
      "</svg></g></g></svg>"
    );
  }

  function pinSvg(icons, colors, dim, withBar) {
    return withBar ? barSvg(icons, colors, dim) : wheelSvg(colors, dim);
  }

  /**
   * The image box, and where the point of the teardrop sits inside it. One
   * definition, so the drawing, the scaled size and the anchor cannot drift
   * apart — if they do, the pin lands somewhere other than the office.
   */
  function pinSize(n, withBar) {
    if (!withBar) return { w: 40, h: 52 };
    return {
      w: Math.max(barWidth(Math.max(n, 1)), PIN_W) + BAR_EDGE,
      h: BADGE + BAR_PAD * 2 + BAR_GAP + PIN_H,
    };
  }

  function pinAnchor(n, withBar) {
    var box = pinSize(n, withBar);
    return { x: box.w / 2, y: box.h };
  }

  function pinUrl(icons, colors, dim, withBar) {
    return (
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(pinSvg(icons, colors, dim, withBar))
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
    var keyBox = document.querySelector(".loc-key");
    var keyBtns = Array.prototype.slice.call(
      document.querySelectorAll(".loc-key-btn"),
    );
    var care = el.getAttribute("data-care") || "";

    var opts = {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      /*
       * Google's default on a scrollable page is "cooperative": the wheel
       * scrolls the page and only zooms while ctrl is held, which is a rule
       * nobody is told. "greedy" makes the wheel zoom whenever the pointer is
       * over the map, which is what a map is expected to do.
       */
      gestureHandling: "greedy",
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
    /* Whether the bars are currently drawn, and which pins are faded, so a
       redraw after a zoom keeps the filter's answer rather than resetting it. */
    var bars = false;
    var faded = {};

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
        var box = pinSize(office.icons.length, bars);
        var img = document.createElement("img");
        img.src = pinUrl(office.icons, office.colors, false, bars);
        img.width = box.w;
        img.height = box.h;
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
        icon: markerIcon(office, false),
      });
    }

    /* The image, its drawn size and where its point sits, for a classic Marker. */
    function markerIcon(office, dim) {
      var box = pinSize(office.icons.length, bars);
      var at = pinAnchor(office.icons.length, bars);
      return {
        url: pinUrl(office.icons, office.colors, dim, bars),
        scaledSize: new google.maps.Size(box.w, box.h),
        anchor: new google.maps.Point(at.x, at.y),
      };
    }

    function setDim(office, marker, dim) {
      if (Advanced) {
        var box = pinSize(office.icons.length, bars);
        if (marker.content) {
          marker.content.src = pinUrl(office.icons, office.colors, dim, bars);
          marker.content.width = box.w;
          marker.content.height = box.h;
        }
        marker.zIndex = dim ? 1 : 2;
      } else {
        marker.setIcon(markerIcon(office, dim));
        marker.setZIndex(dim ? 1 : 2);
      }
      faded[office.slug] = dim;
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
      /* Whatever zoom the fit settled on, the pins have to match it. */
      syncBars();
    });

    /*
     * The bars come and go with the zoom. Redrawing eight markers is cheap but
     * not free, so it only happens on the zoom levels where the answer changes
     * — not on every wheel notch.
     */
    function syncBars() {
      var want = map.getZoom() >= BAR_ZOOM;
      if (want === bars) return;
      bars = want;
      offices.forEach(function (office) {
        setDim(office, markers[office.slug], Boolean(faded[office.slug]));
      });
    }

    map.addListener("zoom_changed", syncBars);

    /*
     * One filter, asked two ways. The select names a single service; the key
     * names a whole care type. Choosing in one clears the other, because two
     * live filters on one map is a question nobody can answer by looking.
     *
     * A pin that does not match fades rather than disappearing: an office that
     * does not do the thing you asked for is still an office, and seeing it
     * greyed says more than seeing nothing.
     */
    function apply(serviceSlug, careSlug) {
      var shown = 0;
      var label = null;

      offices.forEach(function (office) {
        var match = true;
        if (serviceSlug) match = office.services.indexOf(serviceSlug) !== -1;
        else if (careSlug) match = office.cares.indexOf(careSlug) !== -1;
        if (match) shown++;
        setDim(office, markers[office.slug], !match);
      });

      cards.forEach(function (card) {
        var hide = false;
        if (serviceSlug) {
          hide = (card.getAttribute("data-services") || "").split(" ").indexOf(serviceSlug) === -1;
        } else if (careSlug) {
          hide = (card.getAttribute("data-cares") || "").split(" ").indexOf(careSlug) === -1;
        }
        card.hidden = hide;
      });

      keyBtns.forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.getAttribute("data-care") === careSlug));
      });
      if (keyBox) keyBox.classList.toggle("has-choice", Boolean(careSlug));

      if (careSlug) {
        var chosen = document.querySelector('.loc-key-btn[data-care="' + careSlug + '"]');
        if (chosen) label = chosen.textContent.trim();
      }

      if (emptyNote) emptyNote.hidden = shown > 0;

      /*
       * Nothing on the page can set a service any more, so the only way one
       * arrives is in the URL — and then the server has already written the
       * count line naming it. Rewriting it here would need the service's name,
       * which the page no longer carries anywhere.
       */
      if (count && !serviceSlug) {
        count.textContent = !label
          ? "All eight offices."
          : shown === 0
            ? "No office currently offers " + label + "."
            : shown === 8
              ? "All eight offices offer " + label + "."
              : shown + " of 8 offices offer " + label + ".";
      }
      info.close();
    }

    function remember(serviceSlug, careSlug) {
      if (!window.history || !window.history.replaceState) return;
      var url = serviceSlug
        ? "?service=" + encodeURIComponent(serviceSlug)
        : careSlug
          ? "?care=" + encodeURIComponent(careSlug)
          : window.location.pathname;
      window.history.replaceState({}, "", url);
    }

    keyBtns.forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        var wanted = btn.getAttribute("data-care");
        care = care === wanted ? "" : wanted;
        apply("", care);
        remember("", care);
      });
    });

    document.addEventListener("click", function (event) {
      var jump = event.target.closest && event.target.closest("[data-office-jump]");
      if (!jump) return;
      event.preventDefault();
      var card = document.getElementById("office-" + jump.getAttribute("data-office-jump"));
      if (!card) return;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.focus({ preventScroll: true });
    });

    apply(el.getAttribute("data-active") || "", care);
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

  /* -------------------------------------------------------- area map ---- */

  /*
   * The map on a service-area page.
   *
   * A different question from the locations map, so a different map. That one
   * asks "where are all eight offices, and which do the thing I need" and earns
   * a legend, a filter and pins that carry a whole service list. This one asks
   * "I am in Cottonwood Heights — how near is near", and the honest answer is
   * one dot for the reader's city and one pin per office worth driving to, with
   * the view fitted to exactly those.
   *
   * Which offices those are is decided on the server (`plottedOffices`), so the
   * map and the cards underneath it never disagree about what is nearby.
   *
   * Same billing discipline as the locations map: Dynamic Maps is billed per
   * `new google.maps.Map()`, so the map is not created until the page has
   * loaded and the band has been scrolled to. Everything it draws is already
   * in the cards below it, so a reader who never scrolls that far loses
   * nothing.
   */
  var areaEl = document.getElementById("area-map");

  /* The city: a ring rather than a teardrop, because it is a place the reader
     already is, not a destination we are sending them to. */
  function cityDotUrl() {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">' +
      '<circle cx="13" cy="13" r="11" fill="#ffffff"/>' +
      '<circle cx="13" cy="13" r="9" fill="none" stroke="#f58220" stroke-width="4"/>' +
      "</svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  /* An office: the same teardrop the locations map uses, in brand blue, with
     its rank in the list so the pin and the card can be read together. */
  function officePinUrl(n) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 40 52">' +
      '<path d="M20 51C20 51 35 32.5 35 20A15 15 0 0 0 5 20C5 32.5 20 51 20 51Z" fill="#2b93d1" stroke="#ffffff" stroke-width="2"/>' +
      '<text x="20" y="26" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" ' +
      'font-size="18" font-weight="700" fill="#ffffff">' + n + "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function initAreaMap(el) {
    var data = JSON.parse(el.getAttribute("data-area"));
    var mapId = el.getAttribute("data-maps-id") || "";

    var opts = {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: "greedy",
      restriction: {
        latLngBounds: { north: 42.2, south: 39.4, west: -113.2, east: -110.2 },
        strictBounds: false,
      },
    };
    if (mapId) opts.mapId = mapId;

    var map = new google.maps.Map(el, opts);
    var bounds = new google.maps.LatLngBounds();
    var info = new google.maps.InfoWindow();
    var Advanced =
      mapId && google.maps.marker && google.maps.marker.AdvancedMarkerElement
        ? google.maps.marker.AdvancedMarkerElement
        : null;

    function place(position, url, w, h, anchorY, title, html) {
      var marker;
      if (Advanced) {
        var img = document.createElement("img");
        img.src = url;
        img.width = w;
        img.height = h;
        img.alt = "";
        marker = new Advanced({ map: map, position: position, title: title, content: img });
      } else {
        marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          icon: {
            url: url,
            scaledSize: new google.maps.Size(w, h),
            anchor: new google.maps.Point(w / 2, anchorY),
          },
        });
      }
      if (html) {
        marker.addListener("click", function () {
          info.setContent(html);
          info.open({ map: map, anchor: marker });
        });
      }
      bounds.extend(position);
      return marker;
    }

    place(
      { lat: data.city.lat, lng: data.city.lng },
      cityDotUrl(),
      26,
      26,
      13,
      data.city.name,
      '<div class="area-pop"><p class="area-pop-name">' + data.city.name + "</p>" +
        '<p class="area-pop-line">You are here</p></div>',
    );

    data.offices.forEach(function (office, i) {
      place(
        { lat: office.lat, lng: office.lng },
        officePinUrl(i + 1),
        34,
        44,
        44,
        office.name,
        '<div class="area-pop"><p class="area-pop-name">' +
          '<a href="' + office.href + '">' + office.name + "</a></p>" +
          '<p class="area-pop-drive">' + office.drive + " from " + data.city.name.split(",")[0] + "</p>" +
          '<p class="area-pop-line">' + office.address + "</p>" +
          '<p class="area-pop-line"><a href="tel:' + office.phone + '">' + office.phoneText + "</a></p></div>",
      );
    });

    /*
     * Fit to everything, then back off if the fit is too tight. A city with an
     * office in it — Bountiful is 0.6 miles from ours — otherwise fits to a
     * span of a few hundred metres and lands on a street map with no context,
     * where the useful fact is "it is in your town" rather than "here is the
     * junction".
     */
    map.fitBounds(bounds, 60);
    google.maps.event.addListenerOnce(map, "idle", function () {
      if (map.getZoom() > 14) map.setZoom(14);
    });
  }

  if (areaEl && areaEl.getAttribute("data-maps-key")) {
    whenLoaded(function () {
      whenSeen(areaEl, function () {
        loadGoogleMaps(
          areaEl.getAttribute("data-maps-key"),
          function () {
            initAreaMap(areaEl);
          },
          function () {
            areaEl.classList.add("is-off");
            areaEl.innerHTML =
              '<p class="area-map-off">The map could not load just now. Every office below has its address, its drive time and a phone number.</p>';
          },
        );
      });
    });
  }

  /* ------------------------------------------------------ section chrome -- */

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

/*
 * Symptom Checker: full screen.
 *
 * The AAP viewer is cross-origin and sends no resize message, so the inline
 * frame cannot grow to fit whichever tab a parent opens. The frame scrolls
 * inside itself, and this hands it the whole window on request. The button
 * ships hidden and is revealed only where <dialog> works, so it never sits
 * there doing nothing. The overlay frame is built on first open.
 */
(function () {
  var grow = document.querySelector("[data-sym-frame]");
  var modal = document.querySelector(".sym-modal");
  if (!grow || !modal || typeof modal.showModal !== "function") return;

  var body = modal.querySelector(".sym-modal-body");
  var root = document.documentElement;
  var prior = "";

  grow.hidden = false;

  grow.addEventListener("click", function () {
    if (!body.firstChild) {
      var frame = document.createElement("iframe");
      frame.title = grow.getAttribute("data-sym-title") || "Symptom Checker";
      frame.src = grow.getAttribute("data-sym-frame");
      body.appendChild(frame);
    }
    // Both axes: setting overflow-y alone leaves overflow-x computing to auto.
    prior = root.style.overflow;
    root.style.overflow = "hidden";
    modal.showModal();
  });

  function restore() {
    root.style.overflow = prior;
  }

  modal.addEventListener("close", restore);
  modal.addEventListener("cancel", restore);

  var closer = modal.querySelector("[data-sym-close]");
  if (closer) {
    closer.addEventListener("click", function () {
      modal.close();
    });
  }

  // A click on the backdrop lands on the dialog itself, never on its contents.
  modal.addEventListener("click", function (event) {
    if (event.target === modal) modal.close();
  });
})();
