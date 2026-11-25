'use strict';

/**
 * Service d'authentification unifié pour SunuPermis.
 *
 * Remplace les deux implémentations précédentes :
 *  - server/lib/auth.js      (JWT maison avec crypto.scrypt)
 *  - server/middleware/auth.js (jsonwebtoken, admin uniquement)
 *
 * Utilise les dépendances déjà présentes dans package.json :
 *  - bcryptjs pour le hachage des mots de passe
 *  - jsonwebtoken pour les jetons d'accès (JWT HS256)
 *
 * Règles de sécurité :
 *  - Un utilisateur ne peut jamais s'attribuer le rôle 'admin' à l'inscription.
 *  - Le premier administrateur est créé uniquement depuis les variables d'env
 *    ADMIN_EMAIL / ADMIN_PASSWORD (configuration serveur protégée).
 *  - Les tokens expirent (configurable via AUTH_TTL ou défaut 7 jours).
 *  - Aucun secret n'est jamais exposé côté client.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;
const DEFAULT_TTL_SECONDS = 7 * 24 * 3600; // 7 jours

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith('REMPLACER_')) {
    throw new Error('JWT_SECRET doit être défini avec au moins 32 caractères aléatoires.');
  }
  return secret;
}

function getTtlSeconds() {
  const ttl = Number.parseInt(process.env.AUTH_TTL || String(DEFAULT_TTL_SECONDS), 10);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_TTL_SECONDS;
}

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  return bcrypt.compare(password, storedHash);
}

function signToken(payload, secret, ttlSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const body = Object.assign({}, payload, { iat: now, exp: now + ttlSeconds });
  return jwt.sign(body, secret, { algorithm: 'HS256', issuer: 'sunupermis' });
}

function verifyToken(token, secret) {
  if (typeof token !== 'string') return null;
  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'], issuer: 'sunupermis' });
    return payload;
  } catch (e) {
    return null;
  }
}

function extractBearerToken(req) {
  const header = req.headers.authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1] : null;
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  extractBearerToken,
  getJwtSecret,
  getTtlSeconds,
  SALT_ROUNDS,
  DEFAULT_TTL_SECONDS
};
