'use strict';

/**
 * SunuPermis — Serveur Express principal (point d'entrée unique).
 *
 * Lancement : npm start        (écoute sur le port défini par PORT, défaut 3000)
 *
 * Ce serveur regroupe toutes les fonctionnalités précédemment réparties entre
 * server/index.js (Express moderne) et server/server.js (legacy Node http sur le port 4000).
 *
 * Routes API :
 *  - GET    /api/health
 *  - POST   /api/users/register
 *  - POST   /api/users/login
 *  - POST   /api/users/logout
 *  - GET    /api/me
 *  - PATCH  /api/me
 *  - POST   /api/me/password
 *  - DELETE /api/me
 *  - GET    /api/progress
 *  - PUT    /api/progress
 *  - DELETE /api/progress
 *  - GET    /api/questions
 *  - GET    /api/panneaux
 *  - GET    /api/videos
 *  - POST   /api/raoul
 *  - POST   /api/inscriptions
 *  - GET    /api/inscriptions
 *  - PUT    /api/inscriptions/:id
 *  - POST   /api/contact
 *  - GET    /api/contact
 *  - POST   /api/admin/login
 *  - GET    /api/admin/stats
 *  - GET    /api/admin/users
 *  - GET    /api/admin/questions
 *  - POST   /api/admin/questions
 *  - DELETE /api/admin/questions/:id
 *
 * Le fichier server/server.js (legacy) est conservé pour référence mais n'est plus
 * nécessaire au fonctionnement. Le repository JSON est réservé au développement
 * local ; la production utilise PostgreSQL via server/lib/postgres-repository.js.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const app = express();
if (process.env.VERCEL === '1') app.set('trust proxy', 1);
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'server', 'data');

const { Repository } = require('./lib/repository');
const { createRoutes: createUserRoutes } = require('./routes/users');
const { createRoutes: createProgressRoutes } = require('./routes/progress');
const { createRoutes: createQuestionsRoutes } = require('./routes/questions');
const { createRoutes: createPanneauxRoutes } = require('./routes/panneaux');
const { createRoutes: createVideosRoutes } = require('./routes/videos');
const { createRoutes: createAdminRoutes } = require('./routes/admin');
const { createRoutes: createRaoulRoutes } = require('./routes/raoul');
const { createRoutes: createInscriptionsRoutes } = require('./routes/inscriptions');
const { createRoutes: createContactRoutes } = require('./routes/contact');

// ---------------------------------------------------------------------------
// Initialisation du repository unifié (source unique de données).
// ---------------------------------------------------------------------------
const isProductionRuntime = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
let repo;
if (process.env.DATABASE_URL) {
  const { PostgresRepository } = require('./lib/postgres-repository');
  repo = new PostgresRepository(process.env.DATABASE_URL);
} else if (isProductionRuntime) {
  throw new Error('DATABASE_URL est obligatoire en production ; le stockage JSON n’est réservé qu’au développement local.');
} else {
  repo = new Repository(DATA_DIR);
}
app.locals.repositoryReady = repo.ready || Promise.resolve(repo);
app.locals.repositoryReady.catch(() => {});

// ---------------------------------------------------------------------------
// En-têtes de sécurité de base (aucune dépendance supplémentaire).
// ---------------------------------------------------------------------------
app.disable('x-powered-by');
app.use(compression());
app.use((_req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  });
  next();
});

// ---------------------------------------------------------------------------
// CORS restrictif.
// ---------------------------------------------------------------------------
const configuredOrigins = String(process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',').map((origin) => origin.trim()).filter(Boolean);
const allowedOrigins = Array.from(new Set(configuredOrigins.concat('https://sunupermis.vercel.app')));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origine non autorisée par la politique CORS.'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
}));

app.use(express.json({ limit: '256kb', strict: true }));
app.use('/api', async (_req, res, next) => {
  try {
    await app.locals.repositoryReady;
    return next();
  } catch (error) {
    console.error('Repository indisponible :', error.message);
    return res.status(503).json({ erreur: 'Le service de données est temporairement indisponible.' });
  }
});

// ---------------------------------------------------------------------------
// Limitation simple des requêtes publiques (fenêtre glissante par IP).
// ---------------------------------------------------------------------------
function rateLimit({ windowMs = 15 * 60 * 1000, max = 30 } = {}) {
  const clients = new Map();
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of clients) if (entry.resetAt <= now) clients.delete(ip);
  }, windowMs);
  cleanup.unref?.();

  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = clients.get(ip);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      clients.set(ip, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ erreur: 'Trop de requêtes. Réessaie dans quelques instants.' });
    }
    return next();
  };
}

// Rate limiter dédié aux endpoints d'authentification (plus restrictif).
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

// ---------------------------------------------------------------------------
// Route de santé.
// ---------------------------------------------------------------------------
app.get('/api/health', async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const counts = await repo.getCounts();
    return res.json({
      status: 'ok',
      serveur: 'SunuPermis backend',
      port: PORT,
      users: counts.users,
      questions: counts.questions
    });
  } catch (error) {
    console.error('Vérification de santé impossible :', error.message);
    return res.status(503).json({ status: 'indisponible', serveur: 'SunuPermis backend' });
  }
});

// ---------------------------------------------------------------------------
// Routes API (toutes centralisées sur ce serveur Express).
// ---------------------------------------------------------------------------
app.use('/api', createUserRoutes(repo, authLimiter));
app.use('/api/progress', createProgressRoutes(repo));
app.use('/api/questions', createQuestionsRoutes(repo));
app.use('/api/panneaux', createPanneauxRoutes(repo));
app.use('/api/videos', createVideosRoutes(repo));
app.use('/api/raoul', rateLimit({ max: 15 }), createRaoulRoutes(repo));
app.use('/api/inscriptions', rateLimit({ max: 10 }), createInscriptionsRoutes(repo));
app.use('/api/contact', rateLimit({ max: 10 }), createContactRoutes(repo));
app.use('/api/admin', rateLimit({ max: 10 }), createAdminRoutes(repo));

// ---------------------------------------------------------------------------
// Protection des fichiers internes : /server, /node_modules, fichiers cachés.
// ---------------------------------------------------------------------------
app.use('/server', (_req, res) => res.status(404).send('Introuvable.'));
app.use('/api', (_req, res) => res.status(404).json({ erreur: 'Route API inconnue.' }));

// ---------------------------------------------------------------------------
// Fichiers statiques (site frontend).
// ---------------------------------------------------------------------------
app.use(express.static(ROOT, { dotfiles: 'deny', index: 'index.html', extensions: ['html'] }));

// ---------------------------------------------------------------------------
// Gestionnaire d'erreurs 404 pour les pages.
// ---------------------------------------------------------------------------
app.use((_req, res) => res.status(404).send('Page introuvable.'));

// ---------------------------------------------------------------------------
// Gestionnaire d'erreurs global (jamais de stack trace dévoilée).
// ---------------------------------------------------------------------------
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ erreur: 'Le JSON envoyé est invalide.' });
  }
  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({ erreur: 'Origine non autorisée.' });
  }
  console.error('Erreur serveur :', error.message);
  return res.status(500).json({ erreur: 'Erreur interne du serveur.' });
});

// ---------------------------------------------------------------------------
// Démarrage du serveur.
// ---------------------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SunuPermis disponible sur http://localhost:${PORT}`);
    console.log('API : /api/health, /api/users, /api/progress, /api/questions, /api/panneaux, /api/videos');
    console.log('      /api/raoul, /api/inscriptions, /api/contact, /api/admin');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      console.warn('⚠️  JWT_SECRET absent ou trop court : configure le fichier .env.');
    }
    if (!process.env.NVIDIA_API_KEY) {
      console.warn('⚠️  NVIDIA_API_KEY manquante : Raoul sera indisponible.');
    }
  });
}

module.exports = app;
