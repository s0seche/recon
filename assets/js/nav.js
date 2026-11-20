/**
 * nav.js : sticky nav active-state, kill-chain progress bar, mobile menu, lang switch.
 */
(function () {
  var SECTION_ORDER = ["recon", "weaponization", "delivery", "exploitation", "c2", "actions"];

  function initActiveNav() {
    var links = document.querySelectorAll(".nav-link, .mobile-menu__link");
    var segments = document.querySelectorAll(".progress-bar__segment");
    var progressBar = document.getElementById("progressBar");

    function setActive(sectionId) {
      var index = SECTION_ORDER.indexOf(sectionId);
      if (index === -1) return;

      links.forEach(function (link) {
        var isActive = link.getAttribute("data-section") === sectionId;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });

      segments.forEach(function (seg, i) {
        seg.classList.toggle("is-filled", i <= index);
      });
      if (progressBar) progressBar.setAttribute("aria-valuenow", String(index + 1));
    }

    if (!("IntersectionObserver" in window)) {
      setActive(SECTION_ORDER[0]);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    SECTION_ORDER.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    setActive(SECTION_ORDER[0]);
  }

  function initMobileMenu() {
    var burger = document.getElementById("burgerBtn");
    var menu = document.getElementById("mobileMenu");
    if (!burger || !menu) return;

    function openMenu() {
      menu.hidden = false;
      burger.setAttribute("aria-expanded", "true");
      var firstLink = menu.querySelector("a");
      if (firstLink) firstLink.focus();
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      menu.hidden = true;
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    burger.addEventListener("click", function () {
      var isOpen = burger.getAttribute("aria-expanded") === "true";
      if (isOpen) closeMenu(); else openMenu();
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) closeMenu();
    });
  }

  function initLangSwitch() {
    var btn = document.getElementById("langSwitch");
    if (!btn || !window.I18N) return;
    btn.addEventListener("click", function () {
      var next = window.I18N.lang === "fr" ? "en" : "fr";
      window.I18N.setLang(next);
    });
  }

  window.Nav = {
    init: function () {
      initActiveNav();
      initMobileMenu();
      initLangSwitch();
    }
  };
})();
