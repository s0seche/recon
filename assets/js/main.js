/**
 * main.js : bootstraps every module once the DOM is ready.
 * Each module is defensive on its own (checks for its DOM hooks before
 * running), so init order here only matters where one module's output
 * (I18N, ScrollFx) is read by another.
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.I18N) {
    window.I18N.init().then(function () {
      // Re-apply once the skill/project grids exist so their first render
      // already uses the resolved language.
      document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: window.I18N.lang } }));
    });
  }
  if (window.ScrollFx) window.ScrollFx.init();
  if (window.Nav) window.Nav.init();
  if (window.Terminal) window.Terminal.init();
  if (window.Skills) window.Skills.init();
  if (window.Projects) window.Projects.init();
  if (window.EasterEgg) window.EasterEgg.init();
});
