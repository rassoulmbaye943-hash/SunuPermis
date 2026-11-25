'use strict';

/**
 * Middleware d'authentification utilisateur pour SunuPermis.
 *
 * Vérifie le jeton JWT (Bearer) et attache l'utilisateur courant à req.user.
 * S'applique aux routes privées : /api/me, /api/progress, etc.
 *
 * Réponse en cas d'échec : 401 { erreur: '...' } (jamais de stack trace).
 */
const authService = require('../lib/auth-service');

function authUser(req, res, next) {
  const token = authService.extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ erreur: 'Authentification requise.' });
  }

  let payload;
  try {
    payload = authService.verifyToken(token, authService.getJwtSecret());
  } catch (e) {
    return res.status(401).json({ erreur: 'Session invalide ou expirée.' });
  }

  if (!payload || !payload.sub) {
    return res.status(401).json({ erreur: 'Session invalide ou expirée.' });
  }

  req.user = { id: payload.sub, role: payload.role || 'user' };
  return next();
}

module.exports = { authUser };
