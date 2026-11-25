'use strict';

/**
 * Middleware d'autorisation administrateur.
 *
 * Nécessite un utilisateur authentifié (req.user) avec le rôle 'admin'.
 * S'applique aux routes /api/admin/*.
 *
 * Ne révèle jamais si un utilisateur existe ou non : réponse 403 générique.
 */
function authAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ erreur: 'Accès réservé aux administrateurs.' });
  }
  return next();
}

module.exports = { authAdmin };
