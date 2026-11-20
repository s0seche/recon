/**
 * skills.js — renders the skills grid from assets/data/skills.json and wires
 * the "memory dump" detail dialog. Re-renders on language change.
 */
(function () {
  var skillsData = null;
  var grid = null;
  var detail, detailBackdrop, detailCloseBtns, lastFocusedCard = null;

  function lang() { return (window.I18N && window.I18N.lang) || "fr"; }
  function t(path) { return (window.I18N && window.I18N.t(path)) || ""; }

  function renderGrid() {
    if (!grid || !skillsData) return;
    grid.innerHTML = "";
    skillsData.domains.forEach(function (domain) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "skill-card fade-in";
      card.setAttribute("data-domain-id", domain.id);
      card.innerHTML =
        '<p class="skill-card__pid">PID ' + domain.pid + "</p>" +
        '<h3 class="skill-card__name">' + domain.name[lang()] + "</h3>" +
        '<p class="skill-card__desc">' + domain.description[lang()] + "</p>" +
        '<p class="skill-card__hint">&gt; ' + t("weaponization.cardHint") + "</p>";
      card.addEventListener("click", function () { openDetail(domain, card); });
      grid.appendChild(card);
    });
    if (window.ScrollFx) window.ScrollFx.observe(grid.querySelectorAll(".fade-in"));
  }

  function openDetail(domain, triggerEl) {
    lastFocusedCard = triggerEl;
    document.getElementById("skillDetailName").textContent = domain.name[lang()];
    document.getElementById("skillDetailTitle").textContent = domain.name[lang()];
    document.getElementById("skillDetailDescription").textContent = domain.description[lang()];
    document.getElementById("skillDetailPid").textContent = domain.pid;
    document.getElementById("skillDetailStart").textContent = domain.start;
    document.getElementById("skillDetailState").textContent = domain.state;

    var list = document.getElementById("skillDetailTechnos");
    list.innerHTML = "";
    domain.children.forEach(function (child) {
      var li = document.createElement("li");
      li.textContent = child.name[lang()] + " (PID " + child.pid + ")";
      list.appendChild(li);
    });

    detail.hidden = false;
    detail.querySelector(".skill-detail__close").focus();
    document.body.style.overflow = "hidden";
  }

  function closeDetail() {
    detail.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedCard) lastFocusedCard.focus();
  }

  function init() {
    grid = document.getElementById("skillsGrid");
    detail = document.getElementById("skillDetail");
    if (!grid || !detail) return;

    detailCloseBtns = detail.querySelectorAll("[data-close-detail]");
    detailCloseBtns.forEach(function (btn) { btn.addEventListener("click", closeDetail); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !detail.hidden) closeDetail();
    });

    fetch("assets/data/skills.json")
      .then(function (res) { return res.json(); })
      .then(function (json) {
        skillsData = json;
        renderGrid();
      })
      .catch(function (err) { console.warn("skills.js: could not load skills.json", err); });

    document.addEventListener("i18n:changed", renderGrid);
  }

  window.Skills = { init: init };
})();
