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

  /* ---------- Styles (design SunuPermis) ---------- */
  const css = [
    '.raoul-widget{position:fixed;z-index:1050;}',
    '.raoul-toggle{position:fixed;bottom:22px;right:22px;display:flex;align-items:center;gap:9px;',
    'background:var(--primary,#1c5245);color:#fff;border:none;border-radius:34px;',
    'padding:9px 16px 9px 12px;box-shadow:var(--shadow-2,0 6px 20px rgba(16,51,43,.14));',
    'cursor:pointer;font:600 14px var(--font-body,Inter,sans-serif);}',
    '.raoul-toggle .raoul-toggle-icon{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2;}',
    '.raoul-panel{position:fixed;bottom:82px;right:22px;width:360px;height:560px;background:var(--surface,#fff);',
    'color:var(--text,#16201c);border:1px solid var(--border,#dfdac7);border-radius:14px;',
    'box-shadow:var(--shadow-2);display:flex;flex-direction:column;font-family:var(--font-body,Inter,sans-serif);}',
    '.raoul-header{display:flex;align-items:center;gap:12px;padding:14px 18px;background:var(--primary,#1c5245);color:#fff;border-radius:13px 13px 0 0;}',
    '.raoul-avatar{width:34px;height:34px;border-radius:50%;background:var(--accent,#e0a639);color:#10332b;',
    'display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0;}',
    '.raoul-title{font-weight:700;font-size:15px;}',
    '.raoul-sub{font-size:12px;opacity:.9;}',
    '.raoul-close{background:transparent;border:none;color:#fff;opacity:.8;font-size:20px;cursor:pointer;margin-left:auto;padding:0;line-height:1;}',
    '.raoul-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}',
    '.raoul-msg{max-width:82%;padding:8px 12px;border-radius:12px;line-height:1.45;font-size:14px;}',
    '.raoul-msg.user{align-self:flex-end;background:var(--primary,#1c5245);color:#fff;}',
    '.raoul-msg.raoul{align-self:flex-start;background:var(--surface-2,#eae6d8);color:var(--text,#16201c);border:1px solid var(--border,#dfdac7);}',
    '.raoul-msg p{margin:0;}',
    '.raoul-typing{display:none;align-items:center;gap:6px;padding:8px 16px;font-size:13px;color:var(--text-soft,#46524b);}',
    '.raoul-typing span{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--text-soft,#46524b);animation:raoulBounce 1.4s infinite both;}',
    '.raoul-typing span:nth-child(2){animation-delay:.2s;}.raoul-typing span:nth-child(3){animation-delay:.4s;}',
    '@keyframes raoulBounce{0%,80%,100%{transform:scale(1);}40%{transform:scale(1.4);}}',
    '.raoul-composer{display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--border,#dfdac7);background:var(--surface,#fff);border-radius:0 0 13px 13px;}',
    '.raoul-composer input{flex:1;padding:10px 14px;border:1px solid var(--border,#dfdac7);border-radius:24px;background:var(--paper-100,#f3f1e8);color:var(--text,#16201c);font:inherit;outline:none;}',
    '.raoul-composer input:focus{border-color:var(--primary,#1c5245);}',
    '.raoul-send{background:var(--accent,#e0a639);color:#10332b;border:none;border-radius:24px;padding:0 18px;font:700 14px var(--font-body,Inter,sans-serif);cursor:pointer;}',
    '.raoul-send:active{opacity:.9;}',
    '.raoul-suggestions{display:flex;flex-direction:column;gap:8px;}',
    '.raoul-suggestion{background:var(--surface-2,#eae6d8);border:1px solid var(--border,#dfdac7);color:var(--text-soft,#46524b);',
    'border-radius:20px;padding:8px 14px;font-size:13.5px;cursor:pointer;text-align:left;}',
    '.raoul-suggestion:hover{background:var(--paper-200,#eae6d8);color:var(--primary,#1c5245);}',
    '[data-theme="dark"] .raoul-panel{background:var(--surface,#152019);border-color:var(--border,#28352d);color:var(--text,#ece9dd);}',
    '[data-theme="dark"] .raoul-msg.raoul{background:#1b2820;border-color:var(--border,#28352d);color:var(--text,#ece9dd);}',
    '[data-theme="dark"] .raoul-composer{background:var(--surface,#152019);}',
    '[data-theme="dark"] .raoul-composer input{background:#1b2820;color:var(--text,#ece9dd);border-color:var(--border,#28352d);}',
    '@media (max-width: 480px){.raoul-panel{left:12px;right:12px;width:auto;height:72vh;bottom:90px;}.raoul-toggle{bottom:14px;right:14px;padding:8px 14px;font-size:13px;}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

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
