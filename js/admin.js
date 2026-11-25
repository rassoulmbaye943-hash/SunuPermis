/* SunuPermis — tableau de bord administrateur relié au backend.
 *
 * En ligne : tout est servi par l'API (questions, utilisateurs, statistiques).
 * Hors ligne : l'ancienne démo locale continue de fonctionner (lecture seule
 * pour les questions de la banque, ajouts en mémoire jusqu'au retour en ligne).
 */
(function () {
  'use strict';

  var api = window.__SP_API;
  var el = function (id) { return document.getElementById(id); };
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var STATE = {
    online: api ? api.online() : false,
    admin: false,
    questions: [],
    users: [],
    stats: null
  };

  /* ------------------------- Helpers ------------------------- */
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function showToast(kind, msg, sub) {
    var stack = el('toastStack');
    if (!stack) return;
    var t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.innerHTML = '<span class="toast-icon">' + (kind === 'ok' ? '&#10003;' : '&#10007;') + '</span>' +
      '<div><div class="toast-msg">' + escapeHtml(msg) + '</div>' +
      (sub ? '<div class="toast-sub">' + escapeHtml(sub) + '</div>' : '') + '</div>';
    stack.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 7000);
  }

  function setStatus(elId, online) {
    var s = el(elId);
    if (!s) return;
    s.className = 'server-status' + (online ? ' online' : ' offline');
    s.innerHTML = '<span class="dot"></span>' + (online ? 'Base de données connectée' : 'Serveur inaccessible');
  }

  function setSubmitting(form, on) {
    if (!form) return;
    form.querySelectorAll('button[type="submit"]').forEach(function (b) { b.disabled = on; });
    if (on) form.querySelector('.btn--sync') && form.querySelector('.btn--sync').classList.add('loading');
    else form.querySelector('.btn--sync') && form.querySelector('.btn--sync').classList.remove('loading');
  }

  function renderBadge(text, kind) {
    return '<span class="badge badge-' + (kind || 'verified') + '">' + escapeHtml(text) + '</span>';
  }

  /* ------------------------- Authentification ------------------------- */
  function checkAuth() {
    if (!api || !STATE.online) return Promise.resolve(false);
    return api.me().then(function (user) {
      STATE.admin = user && user.role === 'admin';
      return STATE.admin;
    }).catch(function () { return false; });
  }

  /* ------------------------- Rendus ------------------------- */
  function renderDashboard() {
    if (!STATE.stats) return;
    var grid = el('statsGrid');
    if (!grid) return;
    grid.innerHTML =
      '<div class="stat-card"><div class="card-icon" style="width:34px;height:34px;margin-bottom:8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 0 1 4.7 1.1c0 1.7-2.2 1.9-2.2 3.5"/></svg></div><div class="stat-num">' + STATE.stats.users +
      '</div><div class="stat-label">Comptes</div></div>' +
      '<div class="stat-card"><div class="card-icon" style="width:34px;height:34px;margin-bottom:8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 0 1 4.7 1.1c0 1.7-2.2 1.9-2.2 3.5"/></svg></div><div class="stat-num">' + STATE.stats.questions +
      '</div><div class="stat-label">Questions</div></div>' +
      '<div class="stat-card"><div class="card-icon" style="width:34px;height:34px;margin-bottom:8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2.5L21.5 12L12 21.5L2.5 12Z"/></svg></div><div class="stat-num">' + STATE.stats.panneaux +
      '</div><div class="stat-label">Panneaux</div></div>' +
      '<div class="stat-card"><div class="card-icon" style="width:34px;height:34px;margin-bottom:8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="14" height="14" rx="2"/><path d="M16.5 10l5-3v10l-5-3Z"/></svg></div><div class="stat-num">' + STATE.stats.videos +
      '</div><div class="stat-label">Vidéos</div></div>';

    var exams = STATE.stats.examsTaken || 0;
    var quizzes = STATE.stats.quizzesTaken || 0;
    el('quizExamLine').innerHTML =
      'Quiz obtenus : ' + quizzes + ' · Examens blancs compilés : ' + exams;
  }

  function renderQuestions(list) {
    var tbody = el('qTableBody');
    if (!tbody) return;
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="center">Aucune question.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function (q) {
      var verified = q.verified ? renderBadge('Vérifiée') : renderBadge('À confirmer', 'accent');
      var adminNote = q.custom ? '<span class="badge" style="font-size:.72rem;">ajoutée</span>' : '';
      return '<tr>' +
        '<td>' + escapeHtml(q.theme || '–') + '</td>' +
        '<td>' + escapeHtml(q.q) + '</td>' +
        '<td>' + verified + adminNote + '</td>' +
        '<td>' + (q.source ? escapeHtml(q.source) : '–') + '</td>' +
        '<td class="center">' + (q.custom ? '<button class="btn btn-sm btn-outline" data-del="' + escapeHtml(q.id) + '">Supprimer</button>' : '–') + '</td>' +
        '</tr>';
    }).join('');
    $$('#qTableBody [data-del]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Supprimer cette question ?')) return;
        api.adminDeleteQuestion(btn.dataset.del).then(function () {
          showToast('ok', 'Question supprimée.');
          refreshQuestions();
        }).catch(function (err) { showToast('err', 'Impossible de supprimer : ' + err); });
      });
    });
  }

  function renderUsers(list) {
    var tbody = el('userTableBody');
    if (!tbody) return;
    if (!list.length) { tbody.innerHTML = '<tr><td colspan="5" class="center">Aucun compte.</td></tr>'; return; }
    tbody.innerHTML = list.map(function (u) {
      return '<tr>' +
        '<td>' + escapeHtml(u.email) + '</td>' +
        '<td>' + renderBadge(u.role === 'admin' ? 'Administrateur' : 'Utilisateur', u.role === 'admin' ? 'verified' : 'accent') + '</td>' +
        '<td>' + escapeHtml(new Date(u.createdAt).toLocaleDateString('fr-FR')) + '</td>' +
        '<td>' + u.quizzes + '</td><td>' + u.exams + '</td></tr>';
    }).join('');
  }

  function renderPanneux() {
    el('pCount').textContent = STATE.stats ? STATE.stats.panneaux : '–';
    el('vCount').textContent = STATE.stats ? STATE.stats.videos : '–';
  }

  /* ------------------------- Tour d'acte API ------------------------- */
  function refreshQuestions() {
    if (!api || !STATE.online) return;
    api.adminQuestions({ limit: 100 }).then(function (r) {
      if (r.ok) { STATE.questions = r.data.results || []; renderQuestions(STATE.questions); }
    }).catch(function () { /* inattendu */ });
  }

  function addQuestion(form) {
    var theme = el('qCat').value;
    var q = el('qText').value;
    var reps = el('qReps').value.split(';').map(function (s) { return s.trim(); }).filter(Boolean);
    var correct = parseInt(el('qCorrect').value, 10);
    var exp = el('qExp').value;
    var source = el('qSource').value;
    var verified = el('qVerified').checked;
    if (!q || reps.length < 2) { showToast('err', 'Question et au moins deux réponses requises.'); return; }
    if (!(correct >= 0 && correct < reps.length)) { showToast('err', 'Index de bonne réponse invalide.'); return; }
    setSubmitting(form, true);
    var payload = { theme: theme, q: q, rep: reps, correct: correct, exp: exp, source: source, verified: verified };
    api.adminAddQuestion(payload).then(function (r) {
      if (r.ok) {
        showToast('ok', 'Question enregistrée sur le serveur.');
        el('qText').value = ''; el('qReps').value = ''; el('qCorrect').value = '0';
        el('qSource').value = ''; el('qVerified').checked = false;
        refreshQuestions();
      } else { showToast('err', r.data && r.data.error ? r.data.error : 'Erreur'); }
    }).catch(function (err) { showToast('err', 'Serveur inaccessible : ' + err); }).finally(function () { setSubmitting(form, false); });
  }

  function loadLocalQuestions() {
    STATE.questions = QUIZ_BANK.map(function (q) { return Object.assign({}, q, { verified: q.verified, source: q.source }); });
    $$('#qTableBody [data-del]').forEach(function (b) { b.remove(); });
  }

  function refreshUsers() {
    if (!api || !STATE.online) return;
    api.adminUsers().then(function (r) {
      if (r.ok) { STATE.users = r.data.results || []; renderUsers(STATE.users); }
    }).catch(function () {});
  }

  // ---------- Formulaire d'ajout (admin) ----------
  function bindAddForm() {
    var form = el('addQForm');
    if (!form) return;
    el('saveQBtn').addEventListener('click', function (e) {
      e.preventDefault();
      addQuestion(form);
    });
    el('saveQLocalBtn').addEventListener('click', function (e) {
      e.preventDefault();
      if (STATE.online) { showToast('err', 'Le serveur est joignable : utilisez "Enregistrer" (serveur).'); return; }
      var theme = el('qCat').value, q = el('qText').value;
      var reps = el('qReps').value.split(';').map(function (s) { return s.trim(); }).filter(Boolean);
      var correct = parseInt(el('qCorrect').value, 10);
      var exp = el('qExp').value, source = el('qSource').value;
      if (!q || reps.length < 2) { showToast('err', 'Question et au moins deux réponses requises.'); return; }
      if (!(correct >= 0 && correct < reps.length)) { showToast('err', 'Index de bonne réponse invalide.'); return; }
      STATE.questions.unshift({ theme: theme, q: q, rep: reps, correct: correct, exp: exp, source: source, verified: false, custom: true });
      renderQuestions(STATE.questions);
      showToast('ok', 'Question enregistrée (démonstration, non persistée).');
      el('qText').value = ''; el('qReps').value = ''; el('qCorrect').value = '0'; el('qSource').value = '';
    });
  }
  /* ------------------------- Init global ------------------------- */
  function init() {
    if (!api) { setTimeout(init, 250); return; }
    STATE.online = api.online();
    setStatus('qStatus', STATE.online);
    setStatus('userStatus', STATE.online);

    checkAuth().then(function (isAdmin) {
      STATE.admin = isAdmin;
      var gate = el('adminGate');
      var dash = el('admin-dashboard');
      var any = el('admin-questions');
      var users = el('admin-utilisateurs');
      var pan = el('admin-panneaux');
      if (!isAdmin) {
        gate.classList.add('open');
        dash.style.display = 'none'; any.style.display = 'none'; users.style.display = 'none'; pan.style.display = 'none';
        showToast('info', 'Accès réservé', 'Connectez-vous avec un compte administrateur.');
        return;
      }
      gate.classList.remove('open');
      dash.style.display = 'block'; any.style.display = 'block'; users.style.display = 'block'; pan.style.display = 'block';
      if (STATE.online) {
        api.adminStats().then(function (r) {
          if (r.ok) { STATE.stats = r.data; renderDashboard(); }
        }).catch(function () {});
        refreshQuestions();
        refreshUsers();
      } else {
        loadLocalQuestions();
        renderQuestions(STATE.questions);
        showToast('warn', 'Serveur inaccessible', 'Les ajouts restent en mémoire locale jusqu\'au retour en ligne.');
      }
    }).catch(function () { showToast('err', 'Impossible de vérifier le compte.'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  bindAddForm();

  // Connecteur de l'espace admin (administration gestion)
  var alForm = el('adminLoginForm');
  if (alForm) {
    alForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = el('adminLoginMsg');
      var email = el('adminEmail').value.trim().toLowerCase();
      var password = el('adminPassword').value;
      if (!email || !password) { showToast('err', 'E-mail et mot de passe requis.'); return; }
      setSubmitting(alForm, true);
      api.login(email, password).then(function (user) {
        showToast('ok', 'Bonjour ' + user.name + ' · espace administrateur.');
        setTimeout(function () { location.href = 'admin.html'; }, 500);
      }).catch(function (err) {
        showToast('err', err || 'E-mail ou mot de passe incorrect.');
      }).finally(function () { setSubmitting(alForm, false); });
    });
  }

  // Terrain de données
  (function () {
    var s = document.createElement('div');
    s.id = 'toastStack';
    s.className = 'toast-stack';
    document.body.appendChild(s);
  })();
})();
