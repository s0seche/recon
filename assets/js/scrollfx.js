/**
 * scrollfx.js : generic fade-in-on-scroll for elements with the `.fade-in`
 * class. Respects prefers-reduced-motion by doing nothing (CSS already shows
 * content instantly in that case, see style.css).
 */
(function () {
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var observer = null;

  function getObserver() {
    if (observer || !("IntersectionObserver" in window)) return observer;
    observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    return observer;
  }

  function observe(elements) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var obs = getObserver();
    elements.forEach(function (el) { obs.observe(el); });
  }

  function init() {
    observe(document.querySelectorAll(".fade-in"));
  }

  window.ScrollFx = { init: init, observe: observe };
})();
