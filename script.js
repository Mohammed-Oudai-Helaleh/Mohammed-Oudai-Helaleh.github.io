/* ============================================================
   PORTFOLIO INTERACTIONS
   Sticky nav, mobile menu, vault filtering, scroll reveal
   ============================================================ */
(function () {
  "use strict";

  /* ==========================================================
     1. STICKY NAV — scroll shadow
     ========================================================== */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ==========================================================
     2. MOBILE NAV TOGGLE
     ========================================================== */
  var navToggle = document.getElementById("navToggle");
  var navLinks  = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("open")) return;
      if (nav.contains(e.target)) return;
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  /* ==========================================================
     3. VAULT FILTERING
     ========================================================== */
  var vaultButtons = document.querySelectorAll(".vault-btn");
  var vaultCards   = document.querySelectorAll(".vault-card");
  var container    = document.getElementById("vaultContainer");
  var emptyState   = null;

  if (container && vaultCards.length) {
    // Stagger the entrance animation per column
    vaultCards.forEach(function (card, i) {
      card.style.animationDelay = (i % 2) * 70 + "ms";
    });

    function filterVault(category, activeBtn) {
      // 1. Button states
      vaultButtons.forEach(function (btn) {
        var isActive = btn === activeBtn;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", String(isActive));
      });

      // 2. Card visibility
      var visible = 0;
      vaultCards.forEach(function (card) {
        var show = category === "all" || card.dataset.category === category;
        card.classList.toggle("is-hidden", !show);
        if (show) visible++;
      });

      // 3. Empty state guard
      if (visible === 0) {
        if (!emptyState) {
          emptyState = document.createElement("div");
          emptyState.className = "empty-state";
          emptyState.textContent = "NO_ASSETS_FOUND_IN_THIS_CHAMBER";
          container.appendChild(emptyState);
        }
      } else if (emptyState) {
        emptyState.remove();
        emptyState = null;
      }
    }

    vaultButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterVault(btn.dataset.filter, btn);
      });
    });
  }

  /* ==========================================================
     4. SCROLL REVEAL
     ========================================================== */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      observer.observe(el);
    });
  } else {
    // Fallback for very old browsers
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

})();