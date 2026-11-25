/**
 * SunuPermis — API backend (Node.js pur, aucune dépendance à installer)
 * ---------------------------------------------------------------------
 * Lancer : node server.js        (Node.js 18+)
 * Écoute sur http://localhost:4000 et sert aussi le site statique du dossier parent.
 *
 * Routes publiques
 *   GET  /api/health
 *   GET  /api/questions?theme=&limit=&random=1
 *   GET  /api/panneaux?cat=&q=
 *   GET  /api/videos
 *   POST /api/users/register   { name, email, password, objective }
 *   POST /api/users/login      { email, password }
 *
 * Routes authentifiées (Authorization: Bearer <token>)
 *   GET    /api/me             PATCH /api/me { name, objective }     DELETE /api/me { password }
 *   POST   /api/me/password    { currentPassword, newPassword }
 *   GET    /api/progress       PUT /api/progress (fusion)            DELETE /api/progress
 *   POST   /api/progress       (alias de PUT, compatibilité)
 *
 * Routes administrateur (compte listé dans ADMIN_EMAILS)
 *   GET    /api/admin/stats
 *   GET    /api/admin/users
 *   POST   /api/admin/questions   { theme, q, rep[], correct, exp, source }
 *   DELETE /api/admin/questions/:id   (seules les questions ajoutées peuvent être supprimées)
 *
 * Variables d'environnement
 *   PORT, DATA_DIR, JWT_SECRET, ADMIN_EMAILS (liste ; virgules séparées),
 *   CORS_ORIGINS (liste ; par défaut : localhost uniquement), SERVE_STATIC=0 pour désactiver le site.
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const { Store } = require('./lib/store');
const auth = require('./lib/auth');
const { loadContent } = require('./lib/content');
const v = require('./lib/validate');

const ROOT = path.resolve(__dirname, '..');
const TOKEN_TTL = 7 * 24 * 3600;
const MAX_BODY = 256 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.md': 'text/markdown; charset=utf-8'
};

/* ------------------------- Limitation de débit ------------------------- */
function createLimiter(max, windowMs) {
  const hits = new Map();
  const timer = setInterval(() => {
    const now = Date.now();
    hits.forEach((e, k) => { if (e.reset <= now) hits.delete(k); });
  }, windowMs);
  if (timer.unref) timer.unref();
  return function check(key) {
    const now = Date.now();
    let e = hits.get(key);
    if (!e || e.reset <= now) { e = { count: 0, reset: now + windowMs }; hits.set(key, e); }
    e.count++;
    return { ok: e.count <= max, retryAfter: Math.ceil((e.reset - now) / 1000) };
  };
}

function createApp(options) {
  const opts = options || {};
  const dataDir = opts.dataDir || process.env.DATA_DIR || path.join(__dirname, 'data');
  const store = new Store(dataDir);
  const secret = auth.loadSecret(dataDir, opts.jwtSecret || process.env.JWT_SECRET);
  const adminEmails = String(opts.adminEmails !== undefined ? opts.adminEmails : process.env.ADMIN_EMAILS || '')
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const corsList = String(opts.corsOrigins !== undefined ? opts.corsOrigins : process.env.CORS_ORIGINS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  const serveStatic = opts.serveStatic !== undefined ? opts.serveStatic : process.env.SERVE_STATIC !== '0';
  const content = loadContent(path.join(ROOT, 'js', 'data.js'));
  const authLimiter = createLimiter(opts.authLimit || 10, 15 * 60 * 1000);
  const apiLimiter = createLimiter(opts.apiLimit || 300, 60 * 1000);

  const bankQuestions = content.QUIZ_BANK.map((q, i) => Object.assign({ id: 'b' + (i + 1), custom: false }, q));
  const allQuestions = () => bankQuestions.concat(store.questions.map((q) => Object.assign({ custom: true }, q)));

  /* ------------------------- Utilitaires HTTP ------------------------- */
  function corsHeaders(req) {
    const origin = req.headers.origin;
    if (!origin) return {};
    const local = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (!local && corsList.indexOf(origin) === -1 && corsList.indexOf('*') === -1) return {};
    return {
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Max-Age': '600'
    };
  }

  const SECURITY = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  function send(req, res, status, data, extra) {
    const body = status === 204 ? '' : JSON.stringify(data);
    res.writeHead(status, Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }, SECURITY, corsHeaders(req), extra || {}));
    res.end(body);
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      req.on('data', (c) => {
        size += c.length;
        if (size > MAX_BODY) { reject(new v.HttpError(413, 'Corps de requête trop volumineux.')); req.destroy(); return; }
        chunks.push(c);
      });
      req.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        if (!raw) return resolve({});
        try {
          const parsed = JSON.parse(raw);
          if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return reject(new v.HttpError(400, 'Le corps doit être un objet JSON.'));
          }
          resolve(parsed);
        } catch (e) { reject(new v.HttpError(400, 'JSON invalide.')); }
      });
      req.on('error', reject);
    });
  }

  function clientIp(req) {
    return req.socket.remoteAddress || 'unknown';
  }

  function publicUser(u) {
    return { id: u.id, name: u.name, email: u.email, objective: u.objective, role: u.role, createdAt: u.createdAt };
  }

  function issue(u) {
    return auth.signToken({ sub: u.id }, secret, TOKEN_TTL);
  }

  function currentUser(req) {
    const h = req.headers.authorization || '';
    const m = /^Bearer (.+)$/.exec(h);
    if (!m) throw new v.HttpError(401, 'Authentification requise.');
    const payload = auth.verifyToken(m[1], secret);
    if (!payload) throw new v.HttpError(401, 'Session expirée ou invalide.');
    const user = store.users.find((u) => u.id === payload.sub);
    if (!user) throw new v.HttpError(401, 'Compte introuvable.');
    return user;
  }

  function requireAdmin(req) {
    const user = currentUser(req);
    if (user.role !== 'admin') throw new v.HttpError(403, 'Accès réservé aux administrateurs.');
    return user;
  }
  /* ------------------------- Routes API ------------------------- */
  async function handleApi(req, res, pathname, searchParams) {
    const method = req.method;

    if (pathname === '/api/health' && method === 'GET') {
      return send(req, res, 200, { status: 'ok', questions: allQuestions().length, users: store.users.length });
    }

    if (pathname === '/api/questions' && method === 'GET') {
      const theme = searchParams.get('theme');
      let list = allQuestions().filter((q) => !theme || theme === 'tous' || q.theme === theme);
      const total = list.length;
      if (searchParams.get('random') === '1') {
        list = list.slice();
        for (let i = list.length - 1; i > 0; i--) {
          const j = crypto.randomInt(i + 1);
          [list[i], list[j]] = [list[j], list[i]];
        }
      }
      const limit = parseInt(searchParams.get('limit'), 10);
      if (limit > 0) list = list.slice(0, Math.min(limit, 200));
      return send(req, res, 200, { count: list.length, total, results: list });
    }

    if (pathname === '/api/panneaux' && method === 'GET') {
      const cat = searchParams.get('cat');
      const q = (searchParams.get('q') || '').toLowerCase().trim();
      const list = content.PANNEAUX.filter((p) =>
        (!cat || cat === 'tous' || p.cat === cat) &&
        (!q || (p.nom + ' ' + p.signif + ' ' + p.code).toLowerCase().indexOf(q) !== -1));
      return send(req, res, 200, { count: list.length, results: list });
    }

    if (pathname === '/api/videos' && method === 'GET') {
      return send(req, res, 200, { count: content.VIDEOS.length, results: content.VIDEOS });
    }

    /* ---- Authentification ---- */
    if (pathname === '/api/users/register' && method === 'POST') {
      const gate = authLimiter('auth:' + clientIp(req));
      if (!gate.ok) return send(req, res, 429, { error: 'Trop de tentatives. Réessaie plus tard.' }, { 'Retry-After': String(gate.retryAfter) });
      const body = await readBody(req);
      const name = v.cleanText(body.name, 2, 80, 'Nom');
      const email = v.cleanEmail(body.email);
      const password = v.cleanPassword(body.password);
      const objective = v.cleanObjective(body.objective);
      if (store.users.some((u) => u.email === email)) throw new v.HttpError(409, 'Un compte existe déjà avec cet e-mail.');
      const user = {
        id: crypto.randomUUID(), name, email, objective,
        role: adminEmails.indexOf(email) !== -1 ? 'admin' : 'user',
        passwordHash: await auth.hashPassword(password),
        createdAt: new Date().toISOString()
      };
      if (store.users.some((u) => u.email === email)) throw new v.HttpError(409, 'Un compte existe déjà avec cet e-mail.');
      store.users.push(user);
      store.save();
      return send(req, res, 201, { token: issue(user), user: publicUser(user) });
    }

    if (pathname === '/api/users/login' && method === 'POST') {
      const gate = authLimiter('auth:' + clientIp(req));
      if (!gate.ok) return send(req, res, 429, { error: 'Trop de tentatives. Réessaie plus tard.' }, { 'Retry-After': String(gate.retryAfter) });
      const body = await readBody(req);
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password.slice(0, 128) : '';
      const user = store.users.find((u) => u.email === email);
      const ok = await auth.verifyPassword(password, user ? user.passwordHash : dummyHash);
      if (!user || !ok) throw new v.HttpError(401, 'E-mail ou mot de passe incorrect.');
      if (adminEmails.indexOf(user.email) !== -1 && user.role !== 'admin') { user.role = 'admin'; store.save(); }
      return send(req, res, 200, { token: issue(user), user: publicUser(user) });
    }
    /* ---- Compte ---- */
    if (pathname === '/api/me' && method === 'GET') {
      return send(req, res, 200, { user: publicUser(currentUser(req)) });
    }

    if (pathname === '/api/me' && method === 'PATCH') {
      const user = currentUser(req);
      const body = await readBody(req);
      if (body.name !== undefined) user.name = v.cleanText(body.name, 2, 80, 'Nom');
      if (body.objective !== undefined) user.objective = v.cleanObjective(body.objective);
      store.save();
      return send(req, res, 200, { user: publicUser(user) });
    }

    if (pathname === '/api/me/password' && method === 'POST') {
      const gate = authLimiter('pwd:' + clientIp(req));
      if (!gate.ok) return send(req, res, 429, { error: 'Trop de tentatives. Réessaie plus tard.' }, { 'Retry-After': String(gate.retryAfter) });
      const user = currentUser(req);
      const body = await readBody(req);
      const current = typeof body.currentPassword === 'string' ? body.currentPassword.slice(0, 128) : '';
      if (!(await auth.verifyPassword(current, user.passwordHash))) throw new v.HttpError(403, 'Mot de passe actuel incorrect.');
      user.passwordHash = await auth.hashPassword(v.cleanPassword(body.newPassword));
      store.save();
      return send(req, res, 200, { message: 'Mot de passe modifié.' });
    }

    if (pathname === '/api/me' && method === 'DELETE') {
      const gate = authLimiter('del:' + clientIp(req));
      if (!gate.ok) return send(req, res, 429, { error: 'Trop de tentatives. Réessaie plus tard.' }, { 'Retry-After': String(gate.retryAfter) });
      const user = currentUser(req);
      const body = await readBody(req);
      const pwd = typeof body.password === 'string' ? body.password.slice(0, 128) : '';
      if (!(await auth.verifyPassword(pwd, user.passwordHash))) throw new v.HttpError(403, 'Mot de passe incorrect.');
      store.data.users = store.users.filter((u) => u.id !== user.id);
      delete store.progress[user.id];
      store.save();
      return send(req, res, 200, { message: 'Compte supprimé.' });
    }

    /* ---- Progression ---- */
    if (pathname === '/api/progress' && method === 'GET') {
      const user = currentUser(req);
      return send(req, res, 200, { progress: v.sanitizeProgress(store.progress[user.id]) });
    }

    if (pathname === '/api/progress' && (method === 'PUT' || method === 'POST')) {
      const user = currentUser(req);
      const body = await readBody(req);
      const merged = v.mergeProgress(store.progress[user.id], body.progress !== undefined ? body.progress : body);
      store.progress[user.id] = merged;
      store.save();
      return send(req, res, 200, { progress: merged });
    }

    if (pathname === '/api/progress' && method === 'DELETE') {
      const user = currentUser(req);
      delete store.progress[user.id];
      store.save();
      return send(req, res, 200, { message: 'Progression supprimée.' });
    }
    /* ---- Administration ---- */
    if (pathname === '/api/admin/stats' && method === 'GET') {
      requireAdmin(req);
      const allProgress = Object.keys(store.progress).map((id) => store.progress[id]);
      const sum = (fn) => allProgress.reduce((n, p) => n + fn(p), 0);
      return send(req, res, 200, {
        users: store.users.length,
        admins: store.users.filter((u) => u.role === 'admin').length,
        questions: allQuestions().length,
        customQuestions: store.questions.length,
        panneaux: content.PANNEAUX.length,
        videos: content.VIDEOS.length,
        quizzesTaken: sum((p) => (p.quizScores || []).length),
        examsTaken: sum((p) => (p.examResults || []).length)
      });
    }

    /* ---- Consultation des questions (admin) ---- */
    if (pathname === '/api/admin/questions' && method === 'GET') {
      requireAdmin(req);
      var list = allQuestions();
      var limit = parseInt(searchParams.get('limit'), 10);
      if (limit > 0) list = list.slice(0, Math.min(limit, 200));
      return send(req, res, 200, { count: list.length, results: list });
    }

    if (pathname === '/api/admin/users' && method === 'GET') {
      requireAdmin(req);
      const users = store.users.map((u) => {
        const p = store.progress[u.id] || {};
        return Object.assign(publicUser(u), {
          quizzes: (p.quizScores || []).length,
          exams: (p.examResults || []).length
        });
      });
      return send(req, res, 200, { count: users.length, results: users });
    }

    if (pathname === '/api/admin/questions' && method === 'POST') {
      requireAdmin(req);
      const clean = v.cleanQuestion(await readBody(req));
      const question = Object.assign({ id: 'c' + crypto.randomUUID().slice(0, 8) }, clean);
      store.questions.push(question);
      store.save();
      return send(req, res, 201, { question: Object.assign({ custom: true }, question) });
    }

    const del = /^\/api\/admin\/questions\/([\w-]+)$/.exec(pathname);
    if (del && method === 'DELETE') {
      requireAdmin(req);
      const idx = store.questions.findIndex((q) => q.id === del[1]);
      if (idx === -1) throw new v.HttpError(404, 'Question introuvable (seules les questions ajoutées peuvent être supprimées).');
      store.questions.splice(idx, 1);
      store.save();
      return send(req, res, 200, { message: 'Question supprimée.' });
    }

    return send(req, res, 404, { error: 'Route inconnue', hint: 'Voir la liste des routes en tête de server/server.js.' });
  }

  /* ------------------------- Site statique ------------------------- */
  function handleStatic(req, res, pathname) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    let rel;
    try { rel = decodeURIComponent(pathname); } catch (e) { res.writeHead(400); return res.end(); }
    if (rel === '/' || rel === '') rel = '/index.html';
    const file = path.normalize(path.join(ROOT, rel));
    const relative = path.relative(ROOT, file);
    const first = relative.split(path.sep)[0];
    const blocked = relative.startsWith('..') || path.isAbsolute(relative) ||
      first === 'server' || first.startsWith('.') || first === 'node_modules';
    const ext = path.extname(file).toLowerCase();
    if (blocked || !MIME[ext]) { res.writeHead(404, SECURITY); return res.end('Introuvable'); }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404, SECURITY); return res.end('Introuvable'); }
      res.writeHead(200, Object.assign({
        'Content-Type': MIME[ext],
        'Content-Length': st.size,
        'Cache-Control': ext === '.html' || file.endsWith('sw.js') ? 'no-cache' : 'public, max-age=3600'
      }, SECURITY));
      if (req.method === 'HEAD') return res.end();
      fs.createReadStream(file).pipe(res);
    });
  }

  /* ------------------------- Serveur ------------------------- */
  const server = http.createServer(async (req, res) => {
    let url;
    try { url = new URL(req.url, 'http://localhost'); } catch (e) { res.writeHead(400); return res.end(); }
    const { pathname, searchParams } = url;

    if (!pathname.startsWith('/api/')) {
      if (serveStatic) return handleStatic(req, res, pathname);
      return send(req, res, 404, { error: 'Route inconnue' });
    }

    if (req.method === 'OPTIONS') return send(req, res, 204, null);

    const gate = apiLimiter('api:' + clientIp(req));
    if (!gate.ok) return send(req, res, 429, { error: 'Trop de requêtes.' }, { 'Retry-After': String(gate.retryAfter) });

    try {
      await handleApi(req, res, pathname, searchParams);
    } catch (err) {
      if (err instanceof v.HttpError) return send(req, res, err.status, { error: err.message });
      console.error('Erreur serveur :', err);
      send(req, res, 500, { error: 'Erreur interne du serveur.' });
    }
  });

  return { server, store };
}

module.exports = { createApp };

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  const { server } = createApp();
  server.listen(PORT, () => {
    console.log('SunuPermis — API et site disponibles sur http://localhost:' + PORT);
    if (!process.env.ADMIN_EMAILS) {
      console.log('Astuce : définis ADMIN_EMAILS=ton@email.com pour activer l’espace administrateur.');
    }
  });
}
