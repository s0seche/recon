/**
 * terminal.js : typewriter effect for fictitious commands, triggered when a
 * terminal block enters the viewport. Pure progressive enhancement: the
 * setup step (which hides output/clears command text) only runs after this
 * script has confirmed it can run, so no-JS visitors see the full static
 * command + output exactly as written in the HTML.
 */
(function () {
  var TYPE_SPEED_MS = 18;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function typeText(el, text) {
    return new Promise(function (resolve) {
      var i = 0;
      el.textContent = "";
      (function step() {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(step, TYPE_SPEED_MS);
        } else {
          el.classList.add("typing-done");
          resolve();
        }
      })();
    });
  }

  function reveal(el) {
    return new Promise(function (resolve) {
      // Force a reflow before adding the class so the CSS transition fires.
      requestAnimationFrame(function () {
        el.classList.add("is-revealed");
        setTimeout(resolve, 200);
      });
    });
  }

  function runSequence(terminalEl) {
    var body = terminalEl.querySelector(".terminal__body");
    if (!body) return;
    var nodes = Array.prototype.slice.call(body.children);

    var chain = Promise.resolve();
    nodes.forEach(function (node) {
      var cmd = node.querySelector && node.querySelector(".terminal__cmd");
      if (cmd) {
        var fullText = cmd.dataset.fullText;
        chain = chain.then(function () { return typeText(cmd, fullText); });
      } else if (node.hasAttribute("data-output")) {
        chain = chain.then(function () { return reveal(node); });
      }
    });
  }

  function setupTerminal(terminalEl) {
    terminalEl.querySelectorAll(".terminal__cmd").forEach(function (cmd) {
      cmd.dataset.fullText = cmd.textContent;
      cmd.textContent = "";
    });
    terminalEl.querySelectorAll(".terminal__output").forEach(function (out) {
      out.setAttribute("data-revealing", "");
    });
  }

  function init() {
    var terminals = document.querySelectorAll(".terminal[data-terminal]");
    if (terminals.length === 0) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      return; // leave static content exactly as authored
    }

    terminals.forEach(setupTerminal);

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runSequence(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    terminals.forEach(function (t) { observer.observe(t); });
  }

  window.Terminal = { init: init };
})();
