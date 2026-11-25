/* SunuPermis — Raoul, assistant flottant (chat).
 * Discuter avec Raoul : ouvre un panneau de discussion.
 * L'historique est conservé dans localStorage.
 * Les appels vers l'IA passent uniquement par le backend (/api/raoul),
 * qui garde la clé GEMINI_API_KEY hors du frontend.
 */
(function () {
  'use strict';

  const API_URL = '/api/raoul';
  const STORAGE_KEY = 'sp_raoul_chat_v1';
  const MAX_HISTORY = 30;

  const suggestions = [
    "C'est quoi SunuPermis ?",
    "Comment m'inscrire ?",
    'Combien coûte le permis ?'
  ];


  /* ---------- HTML ---------- */
  var wrap = document.createElement('div');
  wrap.id = 'raoulWidget';
  wrap.innerHTML =
    '<div class="raoul-toggle" id="raoulToggle" aria-label="Discuter avec Raoul, l\'assistant SunuPermis" aria-expanded="false">' +
    '<span class="raoul-toggle-label">Discuter avec Raoul</span>' +
    '<svg class="raoul-toggle-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/><polyline points="18,14 6,14 6,6"/></svg>' +
    '</div>' +
    '<div class="raoul-panel" id="raoulPanel" hidden>' +
    '<div class="raoul-header">' +
    '<span class="raoul-avatar" aria-hidden="true">R</span>' +
    '<div><div class="raoul-title">Raoul</div><div class="raoul-sub">Assistant SunuPermis</div></div>' +
    '<button class="raoul-close" id="raoulClose" aria-label="Fermer la discussion">✕</button>' +
    '</div>' +
    '<div class="raoul-messages" id="raoulMessages"></div>' +
    '<div class="raoul-typing" id="raoulTyping" hidden><span></span><span></span><span></span><span>Raoul \u00e9crit\u2026</span></div>' +
    '<div class="raoul-composer">' +
    '<input id="raoulInput" type="text" placeholder="Pose ta question \u00e0 Raoul\u2026" aria-label="Message pour Raoul" />' +
    '<button class="raoul-send" id="raoulSend">Envoyer</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  /* ---------- Logique ---------- */
  var el = function (id) { return document.getElementById(id); };
  var toggle = el('raoulToggle');
  var panel = el('raoulPanel');
  var boutonFermer = el('raoulClose');
  var zoneMessages = el('raoulMessages');
  var indicateur = el('raoulTyping');
  var champ = el('raoulInput');
  var boutonEnvoyer = el('raoulSend');

  var historique = chargerHistorique();
  var ouvert = false;

  function chargerHistorique() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* stockage indisponible */ }
    return [];
  }
  function sauverHistorique() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(historique.slice(-MAX_HISTORY)));
    } catch (e) { /* stockage plein */ }
  }

  function defiler() {
    zoneMessages.scrollTop = zoneMessages.scrollHeight;
  }

  function ajouterMessage(role, texte, memoriser) {
    var div = document.createElement('div');
    div.className = 'raoul-msg raoul-msg-' + role;
    var p = document.createElement('p');
    p.textContent = texte;
    div.appendChild(p);
    zoneMessages.appendChild(div);
    if (memoriser !== false) {
      historique.push({ role: role, text: texte });
      sauverHistorique();
    }
    defiler();
  }

  function afficherHistorique() {
    zoneMessages.innerHTML = '';
    if (historique.length === 0) {
      var grille = document.createElement('div');
      grille.className = 'raoul-suggestions';
      suggestions.forEach(function (s) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'raoul-suggestion';
        b.textContent = s;
        b.addEventListener('click', function () { envoyerUtilisateur(s); });
        grille.appendChild(b);
      });
      zoneMessages.appendChild(grille);
    } else {
      historique.forEach(function (h) { ajouterMessage(h.role, h.text, false); });
    }
  }

  function ouvrir() {
    panel.hidden = false;
    ouvert = true;
    toggle.setAttribute('aria-expanded', 'true');
    afficherHistorique();
    champ.focus();
  }
  function fermer() {
    panel.hidden = true;
    ouvert = false;
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () { ouvert ? fermer() : ouvrir(); });
  boutonFermer.addEventListener('click', fermer);

  async function envoyerUtilisateur(texte) {
    if (!texte || !texte.trim()) return;
    ajouterMessage('user', texte.trim());
    champ.value = '';
    indicateur.hidden = false;
    defiler();
    try {
      var reponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: texte.trim(),
          historique: historique.slice(-MAX_HISTORY)
        })
      });
      var donnees = await reponse.json();
      var texteReponse = donnees.reponse || donnees.erreur || "Je n'ai pas pu r\u00e9pondre. R\u00e9essaie.";
      ajouterMessage('raoul', texteReponse);
    } catch (e) {
      ajouterMessage('raoul', "Raoul est indisponible pour l'instant. R\u00e9essaie plus tard.");
    } finally {
      indicateur.hidden = true;
      defiler();
    }
  }

  boutonEnvoyer.addEventListener('click', function () { envoyerUtilisateur(champ.value); });
  champ.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      envoyerUtilisateur(champ.value);
    }
  });

  afficherHistorique();
})();
