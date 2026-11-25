/* SunuPermis — client HTTP pour l’API backend (Node.js pur, sans dépendance).
 * Ce fichier rend le site utilisable même si le serveur est absent :
 *  - hors ligne     → les appels retournent { ok:false, offline:true } et le site
 *                     continue de fonctionner avec localStorage (comportement actuel) ;
 *  - en ligne       → les appels partent vers l’API et la progression est synchronisée.
 */
(function () {
  'use strict';

  var cfg = {
    online: true,
    base: '/',
    debug: false
  };

  try {
    var savedBase = localStorage.getItem('sp_api_base');
    if (savedBase) cfg.base = savedBase;
  } catch (e) { /* stockage indisponible */ }

  if (!cfg.base || cfg.base === '/') {
    // Détection : si le fichier est ouvert directement (file://), on cible le backend local.
    try {
      if (location.protocol === 'file:') {
        cfg.base = 'http://localhost:4000/';
        cfg.online = false; // on vérifie la disponibilité du serveur à distance
      }
    } catch (e) { /* ignored */ }
  }

  function log() { if (cfg.debug) console.log('[sp-api]', arguments); }

  function isOnline() {
    if (!navigator.onLine) return Promise.resolve(false);
    var t0 = performance.now();
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', cfg.base + 'api/health', true);
      xhr.timeout = 600;
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        resolve(xhr.status === 200);
      };
      xhr.onerror = function () { resolve(false); };
      xhr.ontimeout = function () { resolve(false); };
      xhr.send(null);
      setTimeout(function () { resolve(false); }, 600);
    });
  }

  var offlined = false;
  function setOffline(v) { offlined = v; }

  /* ------------------------- appels bruts ------------------------- */
  function req(method, url, body) {
    var opts = {
      method: method,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };
    if (typeof sessionToken === 'string' && sessionToken.length) {
      opts.headers['Authorization'] = 'Bearer ' + sessionToken;
    }
    if (body !== undefined && body !== null) opts.body = JSON.stringify(body);
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, cfg.base + url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 0) {
          // Serveur absent : passage en mode hors-ligne.
          if (!offlined) { setOffline(true); dispatch('offline', false); }
          return reject(new Error('hors-ligne'));
        }
        var data = null;
        try { data = JSON.parse(xhr.responseText || 'null'); } catch (e) { data = null; }
        if (xhr.status === 401 && data && data.error) {
          // Session expirée : nettoyage côté client.
          try { localStorage.removeItem('sp_session'); localStorage.removeItem('sp_user'); } catch (e) {}
          dispatch('authchange', false);
        }
        resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, data: data });
      };
      xhr.onerror = function () { reject(new Error('réseau')); };
      xhr.ontimeout = function () { reject(new Error('temps dépassé')); };
      if (opts.method === 'DELETE') { xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8'); }
      log(method, url, body);
      xhr.send(opts.body !== undefined ? opts.body : null);
    });
  }

  function apiGet(url) { return req('GET', url); }
  function apiPost(url, body) { return req('POST', url, body); }
  function apiPut(url, body) { return req('PUT', url, body); }
  function apiDelete(url) { return req('DELETE', url); }

  /* ------------------------- Session ------------------------- */
  var sessionToken = null;
  var sessionUser = null;

  function loadSession() {
    try {
      sessionToken = localStorage.getItem('sp_session');
      sessionUser = localStorage.getItem('sp_user') ? JSON.parse(localStorage.getItem('sp_user')) : null;
    } catch (e) { sessionToken = null; sessionUser = null; }
  }
  function saveSession(token, user) {
    try {
      localStorage.setItem('sp_session', token);
      localStorage.setItem('sp_user', JSON.stringify(user));
    } catch (e) { /* stockage plein : on continue sans session */ }
    sessionToken = token;
    sessionUser = user;
  }
  function clearSession() {
    try { localStorage.removeItem('sp_session'); localStorage.removeItem('sp_user'); } catch (e) {}
    sessionToken = null;
    sessionUser = null;
  }

  /* ------------------------- Auth ------------------------- */
  function login(email, password) {
    return apiPost('api/users/login', { email: email, password: password })
      .then(function (r) {
        if (!r.ok) return Promise.reject(r.data && r.data.error ? r.data.error : 'Erreur de connexion.');
        saveSession(r.data.token, r.data.user);
        dispatch('authchange', true);
        return r.data.user;
      });
  }

  function register(name, email, password, objective) {
    return apiPost('api/users/register', { name: name, email: email, password: password, objective: objective })
      .then(function (r) {
        if (!r.ok) return Promise.reject(r.data && r.data.error ? r.data.error : 'Erreur lors de la création du compte.');
        saveSession(r.data.token, r.data.user);
        dispatch('authchange', true);
        return r.data.user;
      });
  }

  function logout() {
    return apiDelete('api/me', { password: null })
      .catch(function () { /* on supprime quand même localement */ })
      .then(function () { clearSession(); dispatch('authchange', false); return true; });
  }

  function me() {
    return apiGet('api/me').then(function (r) {
      if (!r.ok) return null;
      saveSession(r.data.user.token, r.data.user);
      return r.data.user;
    });
  }

  /* ------------------------- Progression ------------------------- */
  function fetchProgress() {
    return apiGet('api/progress').then(function (r) {
      if (!r.ok) return null;
      return r.data.progress || {};
    });
  }

  function saveProgress(progress) {
    return apiPut('api/progress', { progress: progress }).then(function (r) {
      if (!r.ok) return Promise.reject(r.data && r.data.error ? r.data.error : 'Synchronisation impossible.');
      return r.data.progress;
    });
  }

  function resetProgress() {
    return apiDelete('api/progress').then(function (r) {
      if (!r.ok) return Promise.reject(r.data && r.data.error ? r.data.error : 'Suppression impossible.');
      return true;
    });
  }

  /* ------------------------- Profil ------------------------- */
  function updateProfile(name, objective) {
    return apiPut('api/me', { name: name, objective: objective }).then(function (r) {
      if (!r.ok) return Promise.reject(r.data && r.data.error ? r.data.error : 'Impossible de mettre à jour le profil.');
      saveSession(r.data.user.token, r.data.user);
      return r.data.user;
    });
  }

  function changePassword(current, next) {
    return apiPost('api/me/password', { currentPassword: current, newPassword: next })
      .then(function (r) {
        if (!r.ok) return Promise.reject(r.data && r.data.error ? r.data.error : 'Impossible de changer le mot de passe.');
        return r.data.message;
      });
  }

  function deleteAccount(password) {
    return apiDelete('api/me', { password: password }).then(function (r) {
      if (!r.ok) return Promise.reject(r.data && r.data.error ? r.data.error : 'Impossible de supprimer le compte.');
      clearSession();
      dispatch('authchange', false);
      return true;
    });
  }

  /* ------------------------- Admin ------------------------- */
  function adminStats() { return apiGet('api/admin/stats'); }
  function adminUsers() { return apiGet('api/admin/users'); }
  function adminAddQuestion(body) { return apiPost('api/admin/questions', body); }
  function adminDeleteQuestion(id) { return apiDelete('api/admin/questions/' + encodeURIComponent(id)); }

  /* ------------------------- Événements ------------------------- */
  var handlers = {};
  function dispatch(type, payload) {
    (handlers[type] || []).forEach(function (h) { h(payload); });
  }
  function on(type, fn) {
    if (!handlers[type]) handlers[type] = [];
    handlers[type].push(fn);
    return function () { handlers[type] = handlers[type].filter(function (f) { return f !== fn; }); };
  }

  /* ------------------------- HTML ------------------------- */
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  /* ------------------------- Boot ------------------------- */
  function boot() {
    loadSession();

    function applyHeader() {
      var logged = !!sessionToken;
      var btn = document.getElementById('headerLoginBtn');
      var profileBtn = document.getElementById('headerProfileBtn');
      if (!btn || !profileBtn) return;
      if (logged && sessionUser) {
        btn.style.display = 'none';
        profileBtn.style.display = 'inline-flex';
        profileBtn.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg> ' +
          escapeHtml(sessionUser.name || sessionUser.email);
        profileBtn.setAttribute('aria-label', 'Profil de ' + (sessionUser.name || sessionUser.email));
      } else {
        btn.style.display = 'inline-flex';
        profileBtn.style.display = 'none';
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyHeader);
    } else {
      applyHeader();
    }

    // Détection en temps réel de la disponibilité du backend.
    isOnline().then(function (online) {
      cfg.online = online;
      if (!online && !offlined) setOffline(true);
      dispatch('onlinechange', online);
      log('backend disponible :', online);
    }).catch(function () { /* ignoré */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.__SP_API = {
    cfg: cfg, isOnline: isOnline, online: function () { return cfg.online; },
    login: login, register: register, logout: logout, me: me,
    fetchProgress: fetchProgress, saveProgress: saveProgress, resetProgress: resetProgress,
    updateProfile: updateProfile, changePassword: changePassword, deleteAccount: deleteAccount,
    adminStats: adminStats, adminUsers: adminUsers, adminAddQuestion: adminAddQuestion,
    adminDeleteQuestion: adminDeleteQuestion,
    escapeHtml: escapeHtml, on: on, dispatch: dispatch
  };
})();
