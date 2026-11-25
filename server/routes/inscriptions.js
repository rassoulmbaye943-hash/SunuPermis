'use strict';

/**
 * Routes d'inscription.
 *
 * POST /api/inscriptions   → enregistre une demande d'inscription (statut : en attente)
 * GET  /api/inscriptions   (admin) → liste les inscriptions, filtre ?statut=
 * PUT  /api/inscriptions/:id (admin) → change le statut
 *
 * Utilise le repository unifié (server/lib/repository.js).
 */
const express = require('express');
const { authUser } = require('../middleware/auth-user');
const { authAdmin } = require('../middleware/auth-admin');

const router = express.Router();
const STATUTS = ['en attente', 'contactee', 'validee'];
const TYPES_PERMIS = ['A', 'B', 'C', 'D', 'E'];

function createRoutes(repo) {
  const r = express.Router();

  /* POST /api/inscriptions */
  r.post('/', (_req, res) => {
    try {
      const {
        nom, prenom, telephone, whatsapp, ville, dateNaissance, typePermis, message
      } = _req.body || {};

      const erreurs = [];
      if (!nom || !String(nom).trim() || String(nom).trim().length > 80) {
        erreurs.push('Le nom est requis.');
      }
      if (!telephone || !String(telephone).trim() || String(telephone).trim().length > 30) {
        erreurs.push('Le téléphone est requis.');
      }
      if (!TYPES_PERMIS.includes(typePermis)) {
        erreurs.push('Le type de permis est requis (A, B, C, D ou E).');
      }

      if (erreurs.length > 0) {
        return res.status(400).json({ erreur: erreurs.join(' ') });
      }

      const inscription = {
        id: require('crypto').randomUUID(),
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

      repo.addInscription(inscription);
      return res.status(201).json({ inscription, message: 'Inscription enregistrée avec succès.' });
    } catch (err) {
      console.error('Erreur POST /api/inscriptions :', err);
      return res.status(500).json({ erreur: 'Erreur interne du serveur.' });
    }
  });

  /* GET /api/inscriptions  (admin, protégé) */
  r.get('/', authUser, authAdmin, (_req, res) => {
    try {
      let liste = (repo.inscriptions || []).slice();
      if (_req.query.statut) {
        liste = liste.filter((i) => i.statut === _req.query.statut);
      }
      liste = liste.slice().sort((a, b) => b.dateInscription.localeCompare(a.dateInscription));
      return res.json({ inscriptions: liste });
    } catch (err) {
      console.error('Erreur GET /api/inscriptions :', err);
      return res.status(500).json({ erreur: 'Erreur interne du serveur.' });
    }
  });

  /* PUT /api/inscriptions/:id  (admin, protégé) */
  r.put('/:id', authUser, authAdmin, (_req, res) => {
    try {
      const { statut } = _req.body || {};
      if (!STATUTS.includes(statut)) {
        return res.status(400).json({ erreur: 'Statut invalide (en attente, contactee ou validee).' });
      }

      const updated = repo.updateInscription(_req.params.id, { statut });
      if (!updated) {
        return res.status(404).json({ erreur: 'Inscription introuvable.' });
      }
      return res.json({ inscription: updated });
    } catch (err) {
      console.error('Erreur PUT /api/inscriptions/:id :', err);
      return res.status(500).json({ erreur: 'Erreur interne du serveur.' });
    }
  });

  return r;
}

module.exports = { createRoutes };
