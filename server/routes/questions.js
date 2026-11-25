'use strict';

/**
 * Routes de consultation des questions pédagogiques.
 *
 * GET /api/questions?theme=&limit=&random=1
 *
 * Les questions proviennent de js/data.js (source unique de vérité partagée
 * avec le frontend), complétées par les questions personnalisées stockées
 * dans le repository (db.json).
 */
const express = require('express');
const { loadContent } = require('../lib/content');
const path = require('path');

function createRoutes(repo) {
  const router = express.Router();
  const ROOT = path.resolve(__dirname, '..', '..');
  const content = loadContent(path.join(ROOT, 'js', 'data.js'));

  const bankQuestions = content.QUIZ_BANK.map((q, i) =>
    Object.assign({ id: 'b' + (i + 1), custom: false }, q)
  );

  function allQuestions() {
    return bankQuestions.concat(
      (repo.questions || []).map((q) => Object.assign({ custom: true }, q))
    );
  }

  /* GET /api/questions */
  router.get('/', (req, res) => {
    try {
      const theme = req.query.theme;
      let list = allQuestions().filter((q) =>
        !theme || theme === 'tous' || q.theme === theme
      );
      const total = list.length;

      if (req.query.random === '1') {
        list = list.slice();
        for (let i = list.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [list[i], list[j]] = [list[j], list[i]];
        }
      }

      const limit = Number.parseInt(req.query.limit, 10);
      if (limit > 0) list = list.slice(0, Math.min(limit, 200));

      return res.status(200).json({ count: list.length, total, results: list });
    } catch (err) {
      return res.status(500).json({ erreur: 'Erreur lors de la lecture des questions.' });
    }
  });

  return router;
}

module.exports = { createRoutes };
