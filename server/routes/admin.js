'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDatabase, writeDatabase } = require('../lib/database');
const { getJwtSecret } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const adminPassword = String(process.env.ADMIN_PASSWORD || '');

    if (!adminEmail || adminPassword.length < 12 || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      return res.status(503).json({ erreur: 'La configuration administrateur est incomplète. Vérifie le fichier .env.' });
    }
    if (!email || !password || password.length > 128) {
      return res.status(400).json({ erreur: 'E-mail et mot de passe valides requis.' });
    }

    const database = readDatabase();
    let admin = database.admins.find((item) => item.email === adminEmail);

    // Création initiale uniquement à partir des identifiants fournis dans .env.
    if (!admin) {
      admin = {
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 12),
        createdAt: new Date().toISOString()
      };
      database.admins.push(admin);
      writeDatabase(database);
    }

    const passwordOk = await bcrypt.compare(password, admin.passwordHash);
    if (email !== adminEmail || !passwordOk) {
      return res.status(401).json({ erreur: 'Identifiants incorrects.' });
    }

    const token = jwt.sign({ email: admin.email, role: 'admin' }, getJwtSecret(), {
      algorithm: 'HS256', expiresIn: '8h', issuer: 'sunupermis'
    });

    return res.json({ token, user: { email: admin.email, role: 'admin' }, message: 'Connexion réussie.' });
  } catch (error) {
    console.error('Erreur de connexion administrateur :', error.message);
    return res.status(500).json({ erreur: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
