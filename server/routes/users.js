'use strict';

/**
 * Routes d'authentification et de gestion de compte utilisateur.
 *
 * POST /api/users/register   { name, email, password, objective? }
 * POST /api/users/login      { email, password }
 * POST /api/users/logout     (side client : retourne succès, le token est effacé côté client)
 * GET  /api/me               (Authorization: Bearer <token>)
 * PATCH /api/me              { name?, objective? }
 * POST /api/me/password      { currentPassword, newPassword }
 * DELETE /api/me             { password }
 *
 * Règles de sécurité :
 *  - Le hachage des mots de passe utilise bcrypt (12 tours).
 *  - Les tokens JWT expirent (AUTH_TTL, défaut 7 jours).
 *  - Un utilisateur ne peut jamais s'attribuer le rôle 'admin' à l'inscription.
 *  - Le premier administrateur est créé depuis ADMIN_EMAIL / ADMIN_PASSWORD (.env).
 *  - Rate limiting appliqué sur register / login / password / delete.
 */
const express = require('express');
const crypto = require('crypto');
const authService = require('../lib/auth-service');
const { authUser } = require('../middleware/auth-user');

const router = express.Router();

// Le repository est injecté par le serveur principal pour partager la même instance.
function createRoutes(repo, authLimiter) {
  const { hashPassword, verifyPassword, signToken, getJwtSecret, getTtlSeconds } = authService;
  const requireAuth = authUser(repo);

  /* ---------- Helpers ---------- */
  function publicUser(u) {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      objective: u.objective || '',
      role: u.role || 'user',
      createdAt: u.createdAt
    };
  }

  function issueToken(user) {
    return signToken({ sub: user.id, role: user.role || 'user' }, getJwtSecret(), getTtlSeconds());
  }

  function requireBody(req, res, next) {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ erreur: 'Corps de requête invalide.' });
    }
    next();
  }

  function cleanText(value, min, max, field) {
    if (typeof value !== 'string') throw new Error(`${field} requis.`);
    const v = value.trim();
    if (v.length < min) throw new Error(`${field} trop court (${min} caractères minimum).`);
    if (v.length > max) throw new Error(`${field} trop long (${max} caractères maximum).`);
    return v;
  }

  function cleanEmail(value) {
    if (typeof value !== 'string') throw new Error('E-mail requis.');
    const v = value.trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(v)) throw new Error('E-mail invalide.');
    return v;
  }

  function cleanPassword(value) {
    if (typeof value !== 'string') throw new Error('Mot de passe requis.');
    const v = value;
    if (v.length < 8) throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
    if (v.length > 128) throw new Error('Mot de passe trop long.');
    return v;
  }

  function cleanObjective(value) {
    if (value === undefined || value === null) return '';
    return String(value).trim().slice(0, 200);
  }

  /* ---------- Inscription ---------- */
  router.post('/users/register', authLimiter, requireBody, async (req, res) => {
    try {
      const name = cleanText(req.body.name, 2, 80, 'Nom');
      const email = cleanEmail(req.body.email);
      const password = cleanPassword(req.body.password);
      const objective = cleanObjective(req.body.objective);

      const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
      if (adminEmail && email === adminEmail) {
        return res.status(409).json({ erreur: 'Cette adresse e-mail est réservée à l’administrateur.' });
      }

      if (repo.findUserByEmail(email)) {
        return res.status(409).json({ erreur: 'Un compte existe déjà avec cet e-mail.' });
      }
      if (repo.findAdminByEmail(email)) {
        return res.status(409).json({ erreur: 'Un compte existe déjà avec cet e-mail.' });
      }

      const passwordHash = await hashPassword(password);
      const user = {
        id: repo.createId ? repo.createId() : crypto.randomUUID(),
        name,
        email,
        objective,
        role: 'user',
        passwordHash,
        createdAt: new Date().toISOString()
      };

      repo.addUser(user);

      return res.status(201).json({
        token: issueToken(user),
        user: publicUser(user),
        message: 'Compte créé avec succès.'
      });
    } catch (err) {
      return res.status(400).json({ erreur: err.message || 'Impossible de créer le compte.' });
    }
  });

  /* ---------- Connexion ---------- */
  router.post('/users/login', authLimiter, requireBody, async (req, res) => {
    try {
      const email = cleanEmail(req.body.email);
      const password = typeof req.body.password === 'string' ? req.body.password : '';

      const user = repo.findUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ erreur: 'E-mail ou mot de passe incorrect.' });
      }

      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ erreur: 'E-mail ou mot de passe incorrect.' });
      }

      const tokenUser = Object.assign({}, user, { role: user.role || 'user' });
      return res.status(200).json({
        token: issueToken(tokenUser),
        user: publicUser(tokenUser),
        message: 'Connexion réussie.'
      });
    } catch (err) {
      return res.status(401).json({ erreur: 'E-mail ou mot de passe incorrect.' });
    }
  });

  /* ---------- Déconnexion ---------- */
  router.post('/users/logout', (_req, res) => {
    return res.status(200).json({ message: 'Déconnecté avec succès.' });
  });

  /* ---------- Profil (authentifié) ---------- */
  router.get('/me', requireAuth, (req, res) => {
    const user = repo.findUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ erreur: 'Compte introuvable.' });
    }
    return res.status(200).json({ user: publicUser(user) });
  });

  router.patch('/me', requireAuth, requireBody, async (req, res) => {
    try {
      const user = repo.findUserById(req.user.id);
      if (!user) {
        return res.status(401).json({ erreur: 'Compte introuvable.' });
      }
      const changes = {};
      if (req.body.name !== undefined) changes.name = cleanText(req.body.name, 2, 80, 'Nom');
      if (req.body.objective !== undefined) changes.objective = cleanObjective(req.body.objective);
      const updated = repo.updateUser(user.id, changes);
      return res.status(200).json({ user: publicUser(updated), message: 'Profil mis à jour.' });
    } catch (err) {
      return res.status(400).json({ erreur: err.message || 'Impossible de mettre à jour le profil.' });
    }
  });

  router.post('/me/password', requireAuth, authLimiter, requireBody, async (req, res) => {
    try {
      const user = repo.findUserById(req.user.id);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ erreur: 'Compte introuvable.' });
      }
      const current = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
      if (!(await verifyPassword(current, user.passwordHash))) {
        return res.status(403).json({ erreur: 'Mot de passe actuel incorrect.' });
      }
      const newPassword = cleanPassword(req.body.newPassword);
      user.passwordHash = await hashPassword(newPassword);
      repo.updateUser(user.id, { passwordHash: user.passwordHash });
      return res.status(200).json({ message: 'Mot de passe modifié.' });
    } catch (err) {
      return res.status(400).json({ erreur: err.message || 'Impossible de modifier le mot de passe.' });
    }
  });

  router.delete('/me', requireAuth, authLimiter, requireBody, async (req, res) => {
    try {
      const user = repo.findUserById(req.user.id);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ erreur: 'Compte introuvable.' });
      }
      const pwd = typeof req.body.password === 'string' ? req.body.password : '';
      if (!(await verifyPassword(pwd, user.passwordHash))) {
        return res.status(403).json({ erreur: 'Mot de passe incorrect.' });
      }
      repo.removeUser(user.id);
      return res.status(200).json({ message: 'Compte supprimé.' });
    } catch (err) {
      return res.status(400).json({ erreur: err.message || 'Impossible de supprimer le compte.' });
    }
  });

  return router;
}

module.exports = { createRoutes };
