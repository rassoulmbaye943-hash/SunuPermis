'use strict';

/**
 * Routes de contact.
 *
 * POST /api/contact   → enregistre un message de contact
 * GET  /api/contact   (admin) → liste les messages de contact
 *
 * Utilise le repository unifié (server/lib/repository.js) pour partager
 * le même fichier db.json avec toutes les autres routes.
 */
const express = require('express');
const { authUser } = require('../middleware/auth-user');
const { authAdmin } = require('../middleware/auth-admin');

function createRoutes(repo) {
  const router = express.Router();

  /* POST /api/contact */
  router.post('/', (_req, res) => {
    try {
      const { nom, telephone, sujet, message } = _req.body || {};

      const erreurs = [];
      if (!nom || !String(nom).trim()) erreurs.push('Le nom est requis.');
      if (!telephone || !String(telephone).trim()) erreurs.push('Le téléphone est requis.');
      if (!sujet || !String(sujet).trim()) erreurs.push('Le sujet est requis.');
      if (!message || !String(message).trim()) erreurs.push('Le message est requis.');
      if (String(message || '').length > 3000) erreurs.push('Le message est trop long (3 000 caractères maximum).');

      if (erreurs.length > 0) {
        return res.status(400).json({ erreur: erreurs.join(' ') });
      }

      const msg = {
        id: require('crypto').randomUUID(),
        nom: String(nom).trim().slice(0, 100),
        telephone: String(telephone).trim().slice(0, 30),
        sujet: String(sujet).trim().slice(0, 150),
        message: String(message).trim().slice(0, 3000),
        dateEnvoi: new Date().toISOString()
      };

      repo.addMessage(msg);
      return res.status(201).json({ message: 'Message envoyé avec succès.', contact: msg });
    } catch (err) {
      console.error('Erreur POST /api/contact :', err);
      return res.status(500).json({ erreur: 'Erreur interne du serveur.' });
    }
  });

  /* GET /api/contact  (admin, protégé) */
  router.get('/', authUser, authAdmin, (_req, res) => {
    try {
      const liste = (repo.messages || []).slice().sort((a, b) => b.dateEnvoi.localeCompare(a.dateEnvoi));
      return res.json({ messages: liste });
    } catch (err) {
      console.error('Erreur GET /api/contact :', err);
      return res.status(500).json({ erreur: 'Erreur interne du serveur.' });
    }
  });

  return router;
}

module.exports = { createRoutes };
