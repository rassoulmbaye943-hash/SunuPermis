'use strict';

const express = require('express');
const { auth } = require('../middleware/auth');
const { readDatabase, writeDatabase, createId } = require('../lib/database');

const router = express.Router();
/**
 * POST /api/contact
 * Enregistre un message de contact. Champs requis : nom, téléphone, sujet, message.
 */
router.post('/', (req, res) => {
  try {
    const { nom, telephone, sujet, message } = req.body || {};

    const erreurs = [];
    if (!nom || !String(nom).trim()) erreurs.push('Le nom est requis.');
    if (!telephone || !String(telephone).trim()) erreurs.push('Le téléphone est requis.');
    if (!sujet || !String(sujet).trim()) erreurs.push('Le sujet est requis.');
    if (!message || !String(message).trim()) erreurs.push('Le message est requis.');
    if (String(message || '').length > 3000) erreurs.push('Le message est trop long (3 000 caractères maximum).');

    if (erreurs.length > 0) {
      return res.status(400).json({ erreur: erreurs.join(' ') });
    }

    const bdd = readDatabase();

    const msg = {
      id: createId(),
      nom: String(nom).trim().slice(0, 100),
      telephone: String(telephone).trim().slice(0, 30),
      sujet: String(sujet).trim().slice(0, 150),
      message: String(message).trim().slice(0, 3000),
      dateEnvoi: new Date().toISOString()
    };

    bdd.messages.push(msg);
    writeDatabase(bdd);

    res.status(201).json({ message: 'Message envoyé avec succès.', contact: msg });
  } catch (err) {
    console.error('Erreur POST /api/contact :', err);
    res.status(500).json({ erreur: 'Erreur interne du serveur.' });
  }
});

/**
 * GET /api/contact  (admin, protégé)
 * Liste les messages de contact.
 */
router.get('/', auth, (req, res) => {
  try {
    const bdd = readDatabase();
    const liste = bdd.messages.slice().sort((a, b) => b.dateEnvoi.localeCompare(a.dateEnvoi));
    res.json({ messages: liste });
  } catch (err) {
    console.error('Erreur GET /api/contact :', err);
    res.status(500).json({ erreur: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
