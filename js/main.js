/* SunuPermis — comportements communs à toutes les pages */
(function () {
  // ---- Thème clair / sombre ----
  var root = document.documentElement;
  var saved = localStorage.getItem("sp_theme");
  if (saved) root.setAttribute("data-theme", saved);
  else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    root.setAttribute("data-theme", "dark");
  }

  function refreshThemeMeta() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
      meta.setAttribute(
        "content",
        root.getAttribute("data-theme") === "dark" ? "#0E1512" : "#10332B",
      );
  }

  function refreshThemeIcon() {
    refreshThemeMeta();
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    var dark = root.getAttribute("data-theme") === "dark";
    btn.innerHTML = dark
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
    btn.setAttribute(
      "aria-label",
      dark ? "Passer en mode clair" : "Passer en mode sombre",
    );
    btn.setAttribute(
      "title",
      dark ? "Passer en mode clair" : "Passer en mode sombre",
    );
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("#themeToggle")) {
      var isDark = root.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      if (next === "light") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "dark");
      localStorage.setItem("sp_theme", next === "light" ? "" : "dark");
      refreshThemeIcon();
    }
    if (e.target.closest("#navToggle")) {
      var nav = document.getElementById("mainNav");
      if (nav) {
        var opened = nav.classList.toggle("open");
        var toggle = document.getElementById("navToggle");
        if (toggle)
          toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        var status = document.getElementById("navStatus");
        if (status) status.textContent = opened ? "Menu ouvert" : "Menu fermé";
      }
    }
    var groupLabel = e.target.closest(".nav-group-label");
    if (groupLabel) {
      var thisGroup = groupLabel.closest(".nav-group");
      document.querySelectorAll(".nav-group.open").forEach(function (g) {
        if (g !== thisGroup) g.classList.remove("open");
      });
      var opened = thisGroup.classList.toggle("open");
      groupLabel.setAttribute("aria-expanded", opened ? "true" : "false");
    } else if (!e.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-group.open").forEach(function (g) {
        g.classList.remove("open");
      });
    }
  });
  refreshThemeIcon();

  // ---- Surlignage du lien de nav actif ----
  document.addEventListener("DOMContentLoaded", function () {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === here) {
        a.classList.add("active");
        var group = a.closest(".nav-group");
        if (group) {
          var label = group.querySelector(".nav-group-label");
          if (label) label.classList.add("active");
        }
      }
      a.addEventListener("click", function () {
        var nav = document.getElementById("mainNav");
        if (nav) {
          nav.classList.remove("open");
          var toggle = document.getElementById("navToggle");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  });
})();

/* Petit utilitaire pour animer les barres de progression au scroll */
function spAnimateBars() {
  document
    .querySelectorAll(".progress-bar[data-value]")
    .forEach(function (bar) {
      var span = bar.querySelector("span");
      var val = bar.getAttribute("data-value");
      requestAnimationFrame(function () {
        span.style.width = val + "%";
      });
    });
}
document.addEventListener("DOMContentLoaded", spAnimateBars);

/* Jauge circulaire de score (SVG), utilisée par les résultats de quiz et d'examen */
function spScoreRing(pct, size) {
  size = size || 128;
  var stroke = 10,
    r = (size - stroke) / 2,
    c = size / 2;
  var circ = 2 * Math.PI * r;
  var offset = circ * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return (
    '<svg class="score-ring" width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 ' +
    size +
    " " +
    size +
    '">' +
    '<circle class="track" cx="' +
    c +
    '" cy="' +
    c +
    '" r="' +
    r +
    '" stroke-width="' +
    stroke +
    '"/>' +
    '<circle class="arc" cx="' +
    c +
    '" cy="' +
    c +
    '" r="' +
    r +
    '" stroke-width="' +
    stroke +
    '" stroke-dasharray="' +
    circ +
    '" stroke-dashoffset="' +
    circ +
    '" transform="rotate(-90 ' +
    c +
    " " +
    c +
    ')" data-final-offset="' +
    offset +
    '"/>' +
    '<text x="' +
    c +
    '" y="' +
    (c + 8) +
    '" text-anchor="middle" font-size="' +
    size * 0.22 +
    '">' +
    Math.round(pct) +
    "%</text>" +
    "</svg>"
  );
}
/* Anime l'arc jusqu'à sa valeur finale (à appeler juste après insertion dans le DOM) */
function spAnimateScoreRing(container) {
  var arc = (container || document).querySelector(".score-ring .arc");
  if (!arc) return;
  var target = arc.getAttribute("data-final-offset");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      arc.style.strokeDashoffset = target;
    });
  });
}

/* Révélation douce au défilement pour les cartes et en-têtes de section */
document.addEventListener("DOMContentLoaded", function () {
  if (!("IntersectionObserver" in window)) return;
  var targets = document.querySelectorAll(
    ".card, .choice-card, .stat-card, .video-card, .section-head",
  );
  if (!targets.length) return;
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  targets.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
    io.observe(el);
  });
});
