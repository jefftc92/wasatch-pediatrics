/**
 * Client-side stand-ins for the two server routes, used only by the static
 * preview build (see tools/prerender.ts). The server implementation in
 * src/render/ stays the source of truth; this mirrors its output.
 */
(function () {
  "use strict";

  var BASE = "/wasatch-pediatrics/pr-35";

  /* ---------------------------------------------------------------- filter */

  var form = document.getElementById("filter");
  var response = document.getElementById("response");

  if (form && response) {
    form.addEventListener("submit", function (event) {
      // The theme's script.js posts this form to admin-ajax.php, which no
      // static host can answer. This file is deferred, so it binds before
      // jQuery's ready callback does — stopping propagation here keeps the
      // theme's handler from firing at all.
      event.preventDefault();
      event.stopImmediatePropagation();
      var button = form.querySelector("button");
      if (button) button.textContent = "Processing...";

      fetch(BASE + "/providers-index.json")
        .then(function (r) {
          return r.json();
        })
        .then(function (all) {
          var location = form.querySelector('[name="locationfilter"]').value;
          var gender = form.querySelector('[name="genderfilter"]').value;
          var category = form.querySelector('[name="credentialsfilter"]').value;

          var html = all
            .filter(function (p) {
              if (location && p.locationIds.indexOf(location) === -1)
                return false;
              if (gender && p.gender !== gender) return false;
              if (category && p.categoryIds.indexOf(category) === -1)
                return false;
              return true;
            })
            .map(function (p) {
              return p.html;
            })
            .join("");

          response.innerHTML = html;
          if (button) button.textContent = "Apply Filter";
        })
        .catch(function () {
          if (button) button.textContent = "Apply filter";
        });
    });
  }

  /* ---------------------------------------------------------------- search */

  var params = new URLSearchParams(window.location.search);
  var term = params.get("s");

  // The theme's search form posts to "/", which is the home page here; send it
  // to the prerendered search shell instead.
  if (term === null) {
    document
      .querySelectorAll('form[action$="/"], #searchform')
      .forEach(function (f) {
        if (!f.querySelector('[name="s"]')) return;
        f.addEventListener("submit", function (event) {
          event.preventDefault();
          var value = f.querySelector('[name="s"]').value.trim();
          if (value)
            window.location.href =
              BASE + "/search/?s=" + encodeURIComponent(value);
        });
      });
    return;
  }

  var results = document.querySelector(".blogindex");
  if (!results) return;

  var MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    var name = MONTHS[Number(parts[1]) - 1];
    if (!parts[0] || !name) return "";
    return (
      name + " " + String(Number(parts[2])).padStart(2, "0") + ", " + parts[0]
    );
  }

  function card(entry) {
    var meta = [formatDate(entry.date), entry.category]
      .filter(Boolean)
      .join(" / ");
    return (
      '<div class="col-lg-6 col-md-6 col-12"><div class="bpgraywrap">' +
      (entry.image
        ? '<a class="bp bpp rndi" href="' +
          entry.route +
          '"><img src="' +
          entry.image +
          '" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" /></a>'
        : "") +
      (entry.type === "post" && meta
        ? '<p class="bppostdate date condensed">' + escapeHtml(meta) + "</p>"
        : "") +
      '<p class="bptitle"><a href="' +
      entry.route +
      '">' +
      escapeHtml(entry.title) +
      "</a></p>" +
      '<div class="theexcerpt chap">' +
      escapeHtml(entry.excerpt) +
      "</div>\t<br>" +
      '<a class="btn box green" href="' +
      entry.route +
      '">Read More</a>' +
      "</div></div>"
    );
  }

  var heading = results.querySelector("h1");
  if (heading) heading.textContent = 'Search results for "' + term + '"';
  document.title = "You searched for " + term + " - Wasatch Pediatrics";

  fetch(BASE + "/search-index.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (index) {
      var needle = term.trim().toLowerCase();
      var hits = index
        .map(function (entry) {
          var rank =
            entry.title.toLowerCase().indexOf(needle) !== -1
              ? 3
              : entry.text.indexOf(needle) !== -1
                ? 2
                : entry.links.indexOf(needle) !== -1
                  ? 1
                  : 0;
          return { entry: entry, rank: rank };
        })
        .filter(function (hit) {
          return hit.rank > 0;
        })
        .sort(function (a, b) {
          return b.rank - a.rank || b.entry.date.localeCompare(a.entry.date);
        });

      var markup = hits.length
        ? hits
            .map(function (hit) {
              return card(hit.entry);
            })
            .join("")
        : '<div class="col-12"><p>Sorry, no results were found. Please try another search.</p></div>';

      var header = results.querySelector("header");
      results.innerHTML =
        (header ? header.outerHTML : "") + "<br>" + markup + "<br><br><br><br>";
    });
})();
