'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const ROOT = path.resolve(__dirname, '..');
const allowedOrigins = String(process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

const raoul = require('./routes/raoul');
const inscriptions = require('./routes/inscriptions');
const contact = require('./routes/contact');
const admin = require('./routes/admin');

// En-têtes de sécurité de base, sans ajouter de dépendance supplémentaire.
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  });
  next();
});

app.use(cors({
  origin(origin, callback) {
    // Les requêtes sans Origin (curl, application mobile, serveur à serveur) sont autorisées.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origine non autorisée par la politique CORS.'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
}));
app.use(express.json({ limit: '256kb', strict: true }));

// Limitation simple des requêtes publiques pour réduire le spam et les abus.
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

app.get('/api/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ status: 'ok', serveur: 'SunuPermis backend' });
});

app.use('/api/raoul', rateLimit({ max: 15 }), raoul);
app.use('/api/inscriptions', rateLimit({ max: 10 }), inscriptions);
app.use('/api/contact', rateLimit({ max: 10 }), contact);
app.use('/api/admin', rateLimit({ max: 10 }), admin);

// Les fichiers internes, secrets et données du serveur ne sont jamais publics.
app.use('/server', (_req, res) => res.status(404).send('Introuvable.'));
app.use('/api', (_req, res) => res.status(404).json({ erreur: 'Route API inconnue.' }));
app.use(express.static(ROOT, { dotfiles: 'deny', index: 'index.html', extensions: ['html'] }));
app.use((_req, res) => res.status(404).send('Page introuvable.'));

// Erreurs de parsing JSON et erreurs CORS.
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SunuPermis disponible sur http://localhost:${PORT}`);
    console.log('API : /api/health, /api/raoul, /api/inscriptions, /api/contact, /api/admin/login');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      console.warn('⚠️ JWT_SECRET absent ou trop court : configure le fichier .env avant la connexion admin.');
    }
  });
}

module.exports = app;
