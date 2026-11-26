'use strict';

/**
 * Routes de suivi de progression utilisateur.
 *
 * GET    /api/progress   (authentifié)  → retourne la progression de l'utilisateur
 * PUT    /api/progress   (authentifié)  → fusionne et enregistre la progression
 * DELETE /api/progress   (authentifié)  → supprime la progression de l'utilisateur
 *
 * Le repository est partagé avec le serveur principal : JSON en développement
 * local et PostgreSQL en production.
 */
const express = require('express');
const { authUser } = require('../middleware/auth-user');

function createRoutes(repo) {
  const router = express.Router();
  const requireAuth = authUser(repo);

  /**
   * Nettoyage de la progression utilisateur.
   * Extrait les champs valides du stockage et formate la sortie.
   */
  function sanitizeProgress(input) {
    const src = input && typeof input === 'object' ? input : {};
    const out = {
      lessonsSeen: {},
      quizScores: [],
      examResults: [],
      streakDays: [],
      badges: []
    };
    const isCount = (n) => Number.isInteger(n) && n >= 0 && n <= 1000;
    const isDate = (s) => typeof s === 'string' && s.length <= 40 && !Number.isNaN(Date.parse(s));

    if (src.lessonsSeen && typeof src.lessonsSeen === 'object' && !Array.isArray(src.lessonsSeen)) {
      const keys = Object.keys(src.lessonsSeen).filter(k => k.length <= 80 && src.lessonsSeen[k]);
      out.lessonsSeen = keys.reduce((acc, k) => { acc[k] = true; return acc; }, {});
    }
    if (Array.isArray(src.quizScores)) {
      src.quizScores.forEach((r) => {
        if (r && isCount(r.score) && isCount(r.total) && r.total > 0 && r.score <= r.total && isDate(r.date)) {
          out.quizScores.push({ theme: String(r.theme || '').slice(0, 40), score: r.score, total: r.total, date: String(r.date).slice(0, 40) });
        }
      });
    }
    if (Array.isArray(src.examResults)) {
      src.examResults.forEach((r) => {
        if (r && isCount(r.score) && isCount(r.total) && r.total > 0 && r.score <= r.total && isDate(r.date)) {
          const weak = Array.isArray(r.weakThemes) ? r.weakThemes.slice(0, 20).map((t) => String(t || '').slice(0, 40)) : [];
          out.examResults.push({ id: String(r.id || '').slice(0, 40), score: r.score, total: r.total, weakThemes: weak, date: String(r.date).slice(0, 40) });
        }
      });
    }
    if (Array.isArray(src.streakDays)) {
      out.streakDays = src.streakDays.filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(0, 400);
    }
    if (Array.isArray(src.badges)) {
      out.badges = src.badges.filter((b) => typeof b === 'string' && b.length <= 40).slice(0, 50);
    }
    return out;
  }

  /* GET /api/progress */
  router.get('/', requireAuth, async (req, res) => {
    try {
      const progress = await repo.getProgress(req.user.id) || {};
      return res.status(200).json({ progress: sanitizeProgress(progress) });
    } catch (err) {
      return res.status(400).json({ erreur: err.message || 'Impossible d\'extraire la progression.' });
    }
  });

  /* PUT /api/progress  (fusion avec l'existant, rien n'est écrasé) */
  router.put('/', requireAuth, async (req, res) => {
    try {
      const incoming = req.body && req.body.progress !== undefined ? req.body.progress : req.body;
      const merged = await repo.mergeProgress(req.user.id, incoming);
      return res.status(200).json({ progress: merged, message: 'Progression enregistrée.' });
    } catch (err) {
      return res.status(400).json({ erreur: err.message || 'Impossible d\'enregistrer la progression.' });
    }
  });

  /* DELETE /api/progress */
  router.delete('/', requireAuth, async (req, res) => {
    try {
      await repo.deleteProgress(req.user.id);
      return res.status(200).json({ message: 'Progression supprimée.' });
    } catch (err) {
      return res.status(400).json({ erreur: err.message || 'Impossible de supprimer la progression.' });
    }
  });

  return router;
}

module.exports = { createRoutes };
