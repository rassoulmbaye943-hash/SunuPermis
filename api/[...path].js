'use strict';

// Vercel route catch-all : toutes les requêtes /api/* sont traitées par Express.
module.exports = async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ erreur: 'DATABASE_URL doit être configurée pour servir l’API en production.' }));
    return;
  }

  try {
    const app = require('../server/index.js');
    await app.locals.repositoryReady;
    return app(req, res);
  } catch (error) {
    console.error('Initialisation API SunuPermis impossible :', error.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ erreur: 'Le service de données est temporairement indisponible.' }));
  }
};
