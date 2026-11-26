'use strict';

/**
 * Routes de consultation des panneaux de signalisation.
 *
 * GET /api/panneaux?cat=&q=
 */
const express = require('express');
const { loadContent } = require('../lib/content');
const path = require('path');

function createRoutes(repo) {
  const router = express.Router();
  const ROOT = path.resolve(__dirname, '..', '..');
  const content = loadContent(path.join(ROOT, 'js'));

  /* GET /api/panneaux */
  router.get('/', (req, res) => {
    try {
      const cat = req.query.cat;
      const q = ((req.query.q || '')).toLowerCase().trim();
      const list = content.PANNEAUX.filter((p) =>
        (!cat || cat === 'tous' || p.cat === cat) &&
        (!q || (p.nom + ' ' + p.signif + ' ' + (p.code || '')).toLowerCase().indexOf(q) !== -1)
      );
      return res.status(200).json({ count: list.length, results: list });
    } catch (err) {
      return res.status(500).json({ erreur: 'Erreur lors de la lecture des panneaux.' });
    }
  });

  return router;
}

module.exports = { createRoutes };
