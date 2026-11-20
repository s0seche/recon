/**
 * i18n.js : bilingual FR/EN engine.
 * Loads assets/data/i18n.json, resolves data-i18n / data-i18n-aria attributes,
 * persists the chosen language in localStorage, and falls back to browser
 * language detection on first visit. Static HTML already contains real French
 * text, so a failed fetch (or JS-disabled) still leaves a fully readable page.
 */
(function () {
  var STORAGE_KEY = "jbbel-portfolio-lang";

  var I18N = {
    data: null,
    lang: "fr",

    /** Dot-path lookup, e.g. t("hero.pitch") */
    t: function (path) {
      var node = this.data && this.data[this.lang];
      if (!node) return "";
      var parts = path.split(".");
      for (var i = 0; i < parts.length; i++) {
        if (node == null) return "";
        node = node[parts[i]];
      }
      return node == null ? "" : node;
    },

    detectInitialLang: function () {
      var stored = null;
      try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
      if (stored === "fr" || stored === "en") return stored;
      var nav = (navigator.language || "fr").toLowerCase();
      return nav.indexOf("en") === 0 ? "en" : "fr";
    },

    setLang: function (lang) {
      this.lang = lang === "en" ? "en" : "fr";
      try { localStorage.setItem(STORAGE_KEY, this.lang); } catch (e) {}
      document.documentElement.lang = this.lang;
      this.apply();
      document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: this.lang } }));
    },

    apply: function () {
      var self = this;

      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var value = self.t(el.getAttribute("data-i18n"));
        if (value) el.textContent = value;
      });

      document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
        var value = self.t(el.getAttribute("data-i18n-aria"));
        if (value) el.setAttribute("aria-label", value);
      });

      // Document metadata
      var title = self.t("meta.title");
      if (title) document.title = title;
      var setMeta = function (selector, attr, value) {
        if (!value) return;
        var el = document.querySelector(selector);
        if (el) el.setAttribute(attr, value);
      };
      setMeta('meta[name="description"]', "content", self.t("meta.description"));
      setMeta('meta[property="og:title"]', "content", self.t("meta.ogTitle"));
      setMeta('meta[property="og:description"]', "content", self.t("meta.ogDescription"));
      setMeta('meta[property="og:locale"]', "content", self.lang === "en" ? "en_US" : "fr_FR");

      var switchBtn = document.getElementById("langSwitch");
      if (switchBtn) switchBtn.setAttribute("data-lang", self.lang);
    },

    init: function () {
      var self = this;
      this.lang = this.detectInitialLang();
      document.documentElement.lang = this.lang;

      return fetch("assets/data/i18n.json")
        .then(function (res) { return res.json(); })
        .then(function (json) {
          self.data = json;
          self.apply();
        })
        .catch(function (err) {
          console.warn("i18n: falling back to static markup", err);
        });
    }
  };

  window.I18N = I18N;
})();
