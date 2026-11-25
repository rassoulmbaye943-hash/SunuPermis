/* SunuPermis — synchronisation de la progression vers le compte utilisateur.
 * Chargé après js/api.js et js/progress.js.
 *
 * Principe : chaque modification de progression (leçon vue, quiz, examen)
 * s'enregistre localement immédiatement (toujours), puis se synchronise
 * vers le serveur. L'arrivée d'une progression serveur fusionne les deux
 * états (union des leçons vues, déduplication des scores/examens par clé,
 * union des badges et de la série de jours). Rien ne se perd.
 *
 * Quand le backend est injoignable (ou si le site est ouvert en local
 * sans serveur), les données restent 100 % dans le localStorage, comme
 * avant l'installation du backend.
 */
(function () {
  'use strict';

  function sanitizeProgress(input) {
    var src = input && typeof input === 'object' ? input : {};
    var out = { lessonsSeen: {}, quizScores: [], examResults: [], streakDays: [], badges: [] };
    if (src.lessonsSeen && typeof src.lessonsSeen === 'object' && !Array.isArray(src.lessonsSeen)) {
      Object.keys(src.lessonsSeen).slice(0, 500).forEach(function (k) {
        if (src.lessonsSeen[k]) out.lessonsSeen[k] = true;
      });
    }
    if (Array.isArray(src.quizScores)) {
      src.quizScores.forEach(function (r) {
        if (r && Number.isInteger(r.score) && Number.isInteger(r.total) &&
            r.total > 0 && r.score <= r.total && r.date) {
          out.quizScores.push({
            theme: String(r.theme || '').slice(0, 40),
            score: r.score, total: r.total, date: String(r.date).slice(0, 40)
          });
        }
      });
    }
    if (Array.isArray(src.examResults)) {
      src.examResults.forEach(function (r) {
        if (r && Number.isInteger(r.score) && Number.isInteger(r.total) &&
            r.total > 0 && r.score <= r.total && r.date) {
          out.examResults.push({
            id: String(r.id || '').slice(0, 40),
            score: r.score, total: r.total,
            weakThemes: Array.isArray(r.weakThemes) ? r.weakThemes.slice(0, 20).map(function (t) {
              return String(t || '').slice(0, 40);
            }) : [],
            date: String(r.date).slice(0, 40)
          });
        }
      });
    }
    if (Array.isArray(src.streakDays)) {
      out.streakDays = src.streakDays.filter(function (d) {
        return typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
      }).slice(0, 400);
    }
    if (Array.isArray(src.badges)) {
      out.badges = src.badges.filter(function (b) { return typeof b === 'string' && b.length <= 40; }).slice(0, 50);
    }
    return out;
  }

  function uniqueBy(list, keyFn) {
    var seen = {};
    return list.filter(function (item) {
      var k = keyFn(item);
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    });
  }

  function mergeProgress(a, b) {
    var x = sanitizeProgress(a);
    var y = sanitizeProgress(b);
    var out = Object.assign({}, x);
    Object.assign(out.lessonsSeen, y.lessonsSeen);
    out.quizScores = uniqueBy(x.quizScores.concat(y.quizScores), function (r) {
      return r.date + '|' + r.theme + '|' + r.score + '|' + r.total;
    }).sort(function (p, q) { return Date.parse(p.date) - Date.parse(q.date); }).slice(-500);
    out.examResults = uniqueBy(x.examResults.concat(y.examResults), function (r) {
      return r.date + '|' + r.id + '|' + r.score + '|' + r.total;
    }).sort(function (p, q) { return Date.parse(p.date) - Date.parse(q.date); }).slice(-200);
    out.streakDays = uniqueBy(x.streakDays.concat(y.streakDays), function (d) { return d; }).sort().slice(-400);
    out.badges = uniqueBy(x.badges.concat(y.badges), function (b) { return b; }).slice(0, 50);
    return out;
  }

  var api = window.__SP_API;

  function applyToStore(serverState) {
    var merged = mergeProgress(SPProgress.load(), serverState || {});
    SPProgress._store = merged;
    try { localStorage.setItem('sp_progress_v1', JSON.stringify(merged)); } catch (e) { /* ignorer */ }
  }

  function sync() {
    if (!api) return Promise.resolve();
    return api.fetchProgress().then(function (serverState) {
      if (!serverState) return;
      applyToStore(serverState);
      if (SPProgress.refreshFromStore) SPProgress.refreshFromStore(serverState);
    }).catch(function () { /* serveur injoignable : on garde les données locales */ });
  }

  function logoutSync() {
    var token = localStorage.getItem('sp_session');
    if (token) {
      api.deleteAccount(token).catch(function () { /* les données locales restent */ });
    }
    localStorage.removeItem('sp_session');
    localStorage.removeItem('sp_user');
  }

  // expose le sync comme _syncWithServer sur SPProgress (déjà attendu par progress.js)
  if (typeof SPProgress !== "undefined") { SPProgress._syncWithServer = SPSync.sync; }

  window.SPSync = {
    sync: sync,
    logout: logoutSync,
    status: function () { return api ? api.online() : false; },
    _mergeProgress: mergeProgress,
    _sanitizeProgress: sanitizeProgress,
    _applyToStore: applyToStore
  };
})();
