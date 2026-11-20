/**
 * projects.js — renders the project cards grid from assets/data/projects.json.
 * Data-driven and easy to extend: add an object to the JSON array and a new
 * card appears automatically (see README for the schema).
 */
(function () {
  var projectsData = null;
  var grid = null;

  function lang() { return (window.I18N && window.I18N.lang) || "fr"; }
  function t(path) { return (window.I18N && window.I18N.t(path)) || ""; }

  function render() {
    if (!grid || !projectsData) return;
    grid.innerHTML = "";
    projectsData.forEach(function (project) {
      var card = document.createElement("article");
      card.className = "project-card fade-in";

      var tagsHtml = project.tags.map(function (tag) { return "<li>" + tag + "</li>"; }).join("");

      var linksHtml = "";
      if (project.github) {
        linksHtml += '<a href="' + project.github + '" target="_blank" rel="noopener noreferrer">' + t("c2.viewGithub") + "</a>";
      }
      if (project.demo) {
        linksHtml += '<a href="' + project.demo + '" target="_blank" rel="noopener noreferrer">' + t("c2.viewDemo") + "</a>";
      }

      card.innerHTML =
        "<h3>" + project.title[lang()] + "</h3>" +
        "<p>" + project.description[lang()] + "</p>" +
        '<ul class="project-card__tags">' + tagsHtml + "</ul>" +
        '<div class="project-card__links">' + linksHtml + "</div>" +
        (project.status === "placeholder" ? '<p class="project-card__status">' + t("c2.comingSoon") + "</p>" : "");

      grid.appendChild(card);
    });
    if (window.ScrollFx) window.ScrollFx.observe(grid.querySelectorAll(".fade-in"));
  }

  function init() {
    grid = document.getElementById("projectGrid");
    if (!grid) return;

    fetch("assets/data/projects.json")
      .then(function (res) { return res.json(); })
      .then(function (json) {
        projectsData = json;
        render();
      })
      .catch(function (err) { console.warn("projects.js: could not load projects.json", err); });

    document.addEventListener("i18n:changed", render);
  }

  window.Projects = { init: init };
})();
