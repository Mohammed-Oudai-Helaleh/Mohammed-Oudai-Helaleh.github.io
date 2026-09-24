/* ============================================================
   CASE STUDY — SHARED INTERACTIONS
   Reading progress bar + copy-to-clipboard for code blocks.
   Used by every /case-studies/*.html page.
   ============================================================ */
(function () {
  "use strict";

  /* ==========================================================
     1. READING PROGRESS BAR
     ========================================================== */
  var bar = document.getElementById("progress");

  if (bar) {
    var ticking = false;

    function updateProgress() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + "%";
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updateProgress();
  }

  /* ==========================================================
     2. COPY-TO-CLIPBOARD FOR CODE BLOCKS
     ========================================================== */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var block = btn.closest(".code-block");
      var code  = block ? block.querySelector("code") : null;
      if (!code) return;

      var text = code.innerText;

      function done() {
        var original = btn.dataset.originalLabel || btn.textContent;
        btn.dataset.originalLabel = original;
        btn.textContent = "COPIED";
        btn.classList.add("done");
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("done");
        }, 1600);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text);
          done();
        });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  });

})();