'use strict';

/**
 * Middleware d'authentification utilisateur pour SunuPermis.
 * Le rôle est relu depuis le repository pour qu'un token d'un compte supprimé
 * ou rétrogradé ne conserve pas ses anciens privilèges.
 */
const authService = require('../lib/auth-service');

function authUser(repo) {
  return function authenticateUser(req, res, next) {
    const token = authService.extractBearerToken(req);
    if (!token) {
      return res.status(401).json({ erreur: 'Authentification requise.' });
    }

    let payload;
    try {
      payload = authService.verifyToken(token, authService.getJwtSecret());
    } catch (_error) {
      payload = null;
    }

    if (!payload || !payload.sub) {
      return res.status(401).json({ erreur: 'Session invalide ou expirée.' });
    }

    const user = repo && typeof repo.findUserById === 'function'
      ? repo.findUserById(payload.sub)
      : null;
    const legacyAdmin = !user && repo && Array.isArray(repo.admins)
      ? repo.admins.find((admin) => admin.id === payload.sub)
      : null;
    const account = user || legacyAdmin;

    if (!account) {
      return res.status(401).json({ erreur: 'Session invalide ou expirée.' });
    }

    req.user = { id: account.id, role: account.role || (legacyAdmin ? 'admin' : 'user') };
    return next();
  };
}

module.exports = { authUser };
