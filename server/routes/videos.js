'use strict';

/**
 * Routes de consultation de la vidéothèque.
 *
 * GET /api/videos
 */
const express = require('express');
const { loadContent } = require('../lib/content');
const path = require('path');

function createRoutes(repo) {
  const router = express.Router();
  const ROOT = path.resolve(__dirname, '..', '..');
  const content = loadContent(path.join(ROOT, 'js', 'data.js'));

  /* GET /api/videos */
  router.get('/', (_req, res) => {
    try {
      return res.status(200).json({ count: content.VIDEOS.length, results: content.VIDEOS });
    } catch (err) {
      return res.status(500).json({ erreur: 'Erreur lors de la lecture des vidéos.' });
    }
  });

  return router;
}

module.exports = { createRoutes };
