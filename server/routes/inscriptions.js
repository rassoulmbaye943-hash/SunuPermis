'use strict';

const express = require('express');
const { auth } = require('../middleware/auth');
const { readDatabase, writeDatabase, createId } = require('../lib/database');

const router = express.Router();
const STATUTS = ['en attente', 'contactee', 'validee'];
const TYPES_PERMIS = ['A', 'B', 'C', 'D', 'E'];

/**
 * POST /api/inscriptions
 * Enregistre une demande d'inscription. Statut initial : en attente.
 * Champs requis : nom, téléphone, type de permis.
 */
router.post('/', (req, res) => {
  try {
    const {
      nom,
      prenom,
      telephone,
      whatsapp,
      ville,
      dateNaissance,
      typePermis,
      message
    } = req.body || {};

    const erreurs = [];
    if (!nom || !String(nom).trim() || String(nom).trim().length > 80) {
      erreurs.push('Le nom est requis.');
    }
    if (!telephone || !String(telephone).trim() || String(telephone).trim().length > 30) {
      erreurs.push('Le téléphone est requis.');
    }
    if (!TYPES_PERMIS.includes(typePermis)) {
      erreurs.push("Le type de permis est requis (A, B, C, D ou E).");
    }

    if (erreurs.length > 0) {
      return res.status(400).json({ erreur: erreurs.join(' ') });
    }

    const bdd = readDatabase();

    const inscription = {
      id: createId(),
      nom: String(nom).trim().slice(0, 80),
      prenom: String(prenom || '').trim().slice(0, 80),
      telephone: String(telephone).trim().slice(0, 30),
      whatsapp: String(whatsapp || '').trim().slice(0, 30),
      ville: String(ville || '').trim().slice(0, 100),
      dateNaissance: String(dateNaissance || '').trim(),
      typePermis,
      message: String(message || '').trim().slice(0, 2000),
      dateInscription: new Date().toISOString(),
      statut: 'en attente'
    };

    bdd.inscriptions.push(inscription);
    writeDatabase(bdd);

    res.status(201).json({ inscription, message: 'Inscription enregistrée avec succès.' });
  } catch (err) {
    console.error('Erreur POST /api/inscriptions :', err);
    res.status(500).json({ erreur: 'Erreur interne du serveur.' });
  }
});

/**
 * GET /api/inscriptions  (admin, protégé)
 * Liste les inscriptions, filtre optionnelle par statut (?statut=...).
 */
router.get('/', auth, (req, res) => {
  try {
    const bdd = readDatabase();
    let liste = bdd.inscriptions;
    if (req.query.statut) {
      liste = liste.filter((i) => i.statut === req.query.statut);
    }
    liste = liste.slice().sort((a, b) => b.dateInscription.localeCompare(a.dateInscription));
    res.json({ inscriptions: liste });
  } catch (err) {
    console.error('Erreur GET /api/inscriptions :', err);
    res.status(500).json({ erreur: 'Erreur interne du serveur.' });
  }
});

/**
 * PUT /api/inscriptions/:id  (admin, protégé)
 * Change le statut d'une inscription (en attente / contactee / validee).
 */
router.put('/:id', auth, (req, res) => {
  try {
    const { statut } = req.body || {};
    if (!STATUTS.includes(statut)) {
      return res
        .status(400)
        .json({ erreur: "Statut invalide (en attente, contactee ou validee)." });
    }

    const bdd = readDatabase();
    const idx = bdd.inscriptions.findIndex((i) => i.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ erreur: 'Inscription introuvable.' });
    }

    bdd.inscriptions[idx].statut = statut;
    writeDatabase(bdd);

    res.json({ inscription: bdd.inscriptions[idx] });
  } catch (err) {
    console.error('Erreur PUT /api/inscriptions/:id :', err);
    res.status(500).json({ erreur: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
