/**
 * Behaviour for the pages this project adds. Both parts are progressive: the
 * markup is complete and usable without them, and neither depends on jQuery or
 * on the theme's own scripts.
 */
(function () {
  "use strict";

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
