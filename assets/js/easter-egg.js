/**
 * easter-egg.js : Konami code (↑ ↑ ↓ ↓ ← → ← → b a) reveals a fake
 * `cat /root/flag.txt` overlay. Purely decorative, no gameplay impact.
 */
(function () {
  var SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  var progress = 0;

  function openOverlay() {
    var overlay = document.getElementById("konamiOverlay");
    if (!overlay) return;
    overlay.hidden = false;
    overlay.focus();

    function close() {
      overlay.hidden = true;
      document.removeEventListener("keydown", closeOnKey);
      overlay.removeEventListener("click", close);
    }
    function closeOnKey() { close(); }

    // Delay binding so the "a" keyup that triggered the egg doesn't instantly close it.
    setTimeout(function () {
      document.addEventListener("keydown", closeOnKey);
      overlay.addEventListener("click", close);
    }, 50);
  }

  function init() {
    document.addEventListener("keydown", function (e) {
      var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[progress]) {
        progress++;
        if (progress === SEQUENCE.length) {
          progress = 0;
          openOverlay();
        }
      } else {
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
    });
  }

  window.EasterEgg = { init: init };
})();
