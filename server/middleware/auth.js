'use strict';

const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith('REMPLACER_')) {
    throw new Error('JWT_SECRET doit être défini avec au moins 32 caractères aléatoires.');
  }
  return secret;
}

function auth(req, res, next) {
  const match = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (!match) return res.status(401).json({ erreur: 'Authentification requise.' });

  try {
    req.admin = jwt.verify(match[1], getJwtSecret(), { algorithms: ['HS256'] });
    if (req.admin.role !== 'admin') return res.status(403).json({ erreur: 'Accès réservé aux administrateurs.' });
    return next();
  } catch (error) {
    return res.status(401).json({ erreur: 'Session invalide ou expirée.' });
  }
}

module.exports = { auth, getJwtSecret };
