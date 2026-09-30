/* SunuPermis — en-tête et pied de page communs, injectés via document.write() */
function spHeader(active) {
  function link(href, label, key) {
    return (
      '<a href="' +
      href +
      '" data-i18n="' +
      key +
      '"' +
      (href === active ? ' class="active"' : "") +
      ">" +
      label +
      "</a>"
    );
  }
  var groups = [
    {
      label: "Apprendre",
      key: "nav_group_apprendre",
      items: [
        ["permis.html", "Choisir mon permis", "nav_permis"],
        ["code-route.html", "Code de la route", "nav_code"],
        ["conduire.html", "Apprendre à conduire", "nav_conduire"],
        ["manoeuvres.html", "Manœuvres", "nav_manoeuvres"],
        ["videotheque.html", "Vidéos", "nav_videos"],
      ],
    },
    {
      label: "S’évaluer",
      key: "nav_group_evaluer",
      items: [
        ["quiz.html", "Quiz", "nav_quiz"],
        ["examen.html", "Examen blanc", "nav_examen"],
        ["progression.html", "Ma progression", "nav_progression"],
      ],
    },
    {
      label: "Ressources",
      key: "nav_group_ressources",
      items: [
        ["carte-senegal.html", "Carte du Sénégal", "nav_carte"],
        ["glossaire.html", "Glossaire", "nav_glossaire"],
        ["conseils-examen.html", "Conseils", "nav_conseils"],
        ["offres.html", "Offres Gratuit / Premium", "nav_offres"],
      ],
    },
  ];
  var nav =
    link("index.html", "Accueil", "nav_accueil") +
    groups
      .map(function (g) {
        var isActive = g.items.some(function (it) {
          return it[0] === active;
        });
        var items = g.items
          .map(function (it) {
            return link(it[0], it[1], it[2]);
          })
          .join("");
        return (
          '<div class="nav-group">' +
          '<button type="button" class="nav-group-label' +
          (isActive ? " active" : "") +
          '" data-i18n="' +
          g.key +
          '" aria-expanded="false">' +
          g.label +
          ' <span class="chev" aria-hidden="true">▾</span></button>' +
          '<div class="nav-dropdown">' +
          items +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  return (
    "" +
    '<a class="skip-link" href="#main-content">Aller au contenu principal</a>' +
    '<header class="site-header">' +
    '<div class="container">' +
    '<a href="index.html" class="brand">' +
    '<svg width="30" height="30" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" fill="#E0A639"/><path d="M12 24l4-10h8l4 10" stroke="#10332B" stroke-width="2.4" stroke-linejoin="round" fill="none"/><circle cx="15.5" cy="25.5" r="2.2" fill="#10332B"/><circle cx="24.5" cy="25.5" r="2.2" fill="#10332B"/></svg>' +
    "<span>SunuPermis<small>Code &amp; conduite du Sénégal</small></span>" +
    "</a>" +
    '<nav class="main-nav" id="mainNav">' +
    nav +
    "</nav>" +
    '<div class="header-actions">' +
    '<button type="button" class="icon-btn" id="langToggle" aria-label="Changer de langue (démonstration Wolof)" title="Wolof (démonstration)" style="font-size:.72rem;font-weight:700;">WO</button>' +
    '<button type="button" class="icon-btn" id="themeToggle" aria-label="Changer de thème"></button>' +
    '<span class="sr-only" id="navStatus" aria-live="polite"></span>' +
    '<a href="profil.html" class="btn btn-light btn-sm" style="display:none" id="headerProfileBtn">Mon compte</a>' +
    '<a href="profil.html" class="btn btn-primary btn-sm" data-i18n="btn_connexion">Se connecter</a>' +
    '<button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
    "</div>" +
    "</div>" +
    "</header>"
  );
}

function spFooter() {
  return (
    "" +
    '<footer class="site-footer">' +
    '<div class="container">' +
    '<div class="footer-grid">' +
    "<div>" +
    '<div class="brand" style="color:#fff;margin-bottom:12px;">' +
    '<svg width="26" height="26" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" fill="#E0A639"/><path d="M12 24l4-10h8l4 10" stroke="#10332B" stroke-width="2.4" stroke-linejoin="round" fill="none"/><circle cx="15.5" cy="25.5" r="2.2" fill="#10332B"/><circle cx="24.5" cy="25.5" r="2.2" fill="#10332B"/></svg>' +
    "<span>SunuPermis</span>" +
    "</div>" +
    '<p style="max-width:34ch;" data-i18n="footer_tagline">Apprends le code. Maîtrise la conduite. Décroche ton permis — une préparation pensée pour les réalités sénégalaises de la route.</p>' +
    "</div>" +
    "<div><h4>Apprendre</h4>" +
    '<a href="code-route.html">Code de la route</a>' +
    '<a href="conduire.html">Apprendre à conduire</a>' +
    '<a href="manoeuvres.html">Manœuvres</a>' +
    '<a href="videotheque.html">Vidéothèque</a>' +
    "</div>" +
    "<div><h4>S’évaluer</h4>" +
    '<a href="quiz.html">Quiz thématiques</a>' +
    '<a href="examen.html">Examen blanc</a>' +
    '<a href="progression.html">Ma progression</a>' +
    '<a href="conseils-examen.html">Conseils pour l’examen</a>' +
    "</div>" +
    "<div><h4>Ressources</h4>" +
    '<a href="glossaire.html">Glossaire</a>' +
    '<a href="carte-senegal.html">Carte du Sénégal</a>' +
    '<a href="offres.html">Offres Gratuit / Premium</a>' +
    '<a href="admin.html">Espace administrateur</a>' +
    '<a href="permis.html">Choisir mon permis</a>' +
    "</div>" +
    "</div>" +
    '<div class="footer-bottom">' +
    "<span>© 2026 SunuPermis — prototype pédagogique, indépendant de l’administration sénégalaise.</span>" +
    "<span>Les règles doivent être confirmées auprès de l’ANASER ou d’une auto-école agréée.</span>" +
    "</div>" +
    "</div>" +
    "</footer>" +
    '<script src="js/main.js"><\/script>'
  );
}
