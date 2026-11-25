'use strict';

/**
 * Routes d'administration unifiées.
 *
 * POST /api/admin/login        { email, password }
 * GET  /api/admin/stats        (admin)
 * GET  /api/admin/users        (admin)
 * GET  /api/admin/questions    (admin)
 * POST /api/admin/questions    (admin)  { theme, q, rep[], correct, exp, source }
 * DELETE /api/admin/questions/:id (admin)
 *
 * Utilise le repository partagé (db.json) et le service d'authentification unifié.
 * Le premier administrateur est créé depuis ADMIN_EMAIL / ADMIN_PASSWORD (.env).
 */
const express = require('express');
const authService = require('../lib/auth-service');
const { authUser } = require('../middleware/auth-user');
const { authAdmin } = require('../middleware/auth-admin');

function createRoutes(repo) {
  const router = express.Router();
  const { signToken, getJwtSecret, getTtlSeconds, verifyPassword, hashPassword } = authService;

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

  /* ---------- Connexion administrateur ---------- */
  router.post('/login', async (req, res) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      const password = String(req.body?.password || '');
      const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
      const adminPassword = String(process.env.ADMIN_PASSWORD || '');

      if (!adminEmail || !adminPassword || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        return res.status(503).json({ erreur: 'La configuration administrateur est incomplète. Vérifie le fichier .env.' });
      }
      if (!email || !password) {
        return res.status(400).json({ erreur: 'E-mail et mot de passe requis.' });
      }

      // L'administrateur est soit dans la table users (rôle admin), soit créé depuis .env.
      let admin = repo.findUserByEmail(adminEmail);

      // Création initiale uniquement à partir des identifiants .env (pas de rétrogradation).
      if (!admin) {
        const existingAdmin = repo.findAdminByEmail(adminEmail);
        if (!existingAdmin) {
          const passwordHash = await hashPassword(adminPassword);
          admin = {
            id: require('crypto').randomUUID(),
            name: 'Administrateur',
            email: adminEmail,
            objective: '',
            role: 'admin',
            passwordHash,
            createdAt: new Date().toISOString()
          };
          repo.addUser(admin);
        } else {
          admin = existingAdmin;
        }
      }

      // Vérifie le mot de passe (dans users ou admins).
      const passwordHash = admin.passwordHash || (repo.findAdminByEmail(email) || {}).passwordHash;
      const ok = passwordHash ? await verifyPassword(password, passwordHash) : false;

      if (email !== adminEmail || !ok) {
        return res.status(401).json({ erreur: 'Identifiants incorrects.' });
      }

      // S'assurer que le rôle est bien admin.
      if (admin.role !== 'admin') {
        repo.updateUser(admin.id, { role: 'admin' });
        admin.role = 'admin';
      }

      const token = signToken({ sub: admin.id, role: 'admin' }, getJwtSecret(), getTtlSeconds());
      return res.json({ token, user: publicUser(admin), message: 'Connexion administrateur réussie.' });
    } catch (error) {
      console.error('Erreur de connexion administrateur :', error.message);
      return res.status(500).json({ erreur: 'Erreur interne du serveur.' });
    }
  });

  /* ---------- Routes protégées (admin) ---------- */

  /* GET /api/admin/stats */
  router.get('/stats', authUser, authAdmin, (_req, res) => {
    try {
      const allProgress = Object.values(repo.progress || {}).filter(Boolean);
      const sum = (fn) => allProgress.reduce((n, p) => n + (fn(p) || 0), 0);
      return res.status(200).json({
        users: repo.users.length,
        admins: repo.users.filter((u) => u.role === 'admin').length,
        questions: (repo.questions || []).length,
        customQuestions: (repo.questions || []).length,
        inscriptions: repo.inscriptions.length,
        messages: repo.messages.length,
        quizzesTaken: sum((p) => (p.quizScores || []).length),
        examsTaken: sum((p) => (p.examResults || []).length)
      });
    } catch (err) {
      return res.status(500).json({ erreur: 'Erreur lors du calcul des statistiques.' });
    }
  });

  /* GET /api/admin/users */
  router.get('/users', authUser, authAdmin, (_req, res) => {
    try {
      const users = repo.users.map((u) => {
        const p = repo.getProgress(u.id) || {};
        return Object.assign({}, publicUser(u), {
          quizzes: (p.quizScores || []).length,
          exams: (p.examResults || []).length
        });
      });
      return res.status(200).json({ count: users.length, results: users });
    } catch (err) {
      return res.status(500).json({ erreur: 'Erreur lors de la lecture des utilisateurs.' });
    }
  });

  /* GET /api/admin/questions */
  router.get('/questions', authUser, authAdmin, (_req, res) => {
    try {
      const limit = Number.parseInt(_req.query.limit, 10);
      let list = (repo.questions || []).slice();
      if (limit > 0) list = list.slice(0, Math.min(limit, 200));
      return res.status(200).json({ count: list.length, results: list });
    } catch (err) {
      return res.status(500).json({ erreur: 'Erreur lors de la lecture des questions.' });
    }
  });

  /* POST /api/admin/questions */
  router.post('/questions', authUser, authAdmin, (req, res) => {
    try {
      const theme = String(req.body.theme || '').trim().toLowerCase().slice(0, 40);
      const q = String(req.body.q || '').trim().slice(0, 500);
      const rep = Array.isArray(req.body.rep) ? req.body.rep.map(String).slice(0, 6) : [];
      const correct = Number.parseInt(req.body.correct, 10);
      const exp = String(req.body.exp || '').trim().slice(0, 1000);
      const source = String(req.body.source || '').trim().slice(0, 200) || null;

      if (!theme || theme.length < 2) {
        return res.status(400).json({ erreur: 'Thème requis (2 caractères minimum).' });
      }
      if (!q || q.length < 5) {
        return res.status(400).json({ erreur: 'Question requise (5 caractères minimum).' });
      }
      if (rep.length < 2 || rep.length > 6) {
        return res.status(400).json({ erreur: 'Il faut entre 2 et 6 réponses.' });
      }
      if (!Number.isInteger(correct) || correct < 0 || correct >= rep.length) {
        return res.status(400).json({ erreur: 'Index de bonne réponse invalide.' });
      }

      const question = {
        id: 'c' + require('crypto').randomUUID().slice(0, 8),
        theme,
        q,
        rep,
        correct,
        exp,
        source,
        verified: !!source,
        createdAt: new Date().toISOString()
      };

      repo.addQuestion(question);
      return res.status(201).json({ question: Object.assign({ custom: true }, question) });
    } catch (err) {
      return res.status(400).json({ erreur: err.message || 'Impossible d\'ajouter la question.' });
    }
  });

  /* DELETE /api/admin/questions/:id */
  router.delete('/questions/:id', authUser, authAdmin, (req, res) => {
    const removed = repo.removeQuestion(req.params.id);
    if (!removed) {
      return res.status(404).json({ erreur: 'Question introuvable (seules les questions ajoutées peuvent être supprimées).' });
    }
    return res.status(200).json({ message: 'Question supprimée.' });
  });

  return router;
}

module.exports = { createRoutes };
