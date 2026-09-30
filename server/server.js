/**
 * SunuPermis — squelette de backend (préparation d'architecture)
 * ---------------------------------------------------------------
 * Serveur Node.js sans dépendance externe, à titre de POINT DE DÉPART.
 * Il n'est PAS branché au frontend statique (qui fonctionne actuellement
 * en localStorage) : il montre la forme que pourrait prendre une vraie
 * API avant de remplacer les données en mémoire par une base de données
 * réelle (PostgreSQL, MySQL, MongoDB…) et une authentification réelle
 * (sessions, JWT, hachage de mot de passe, etc.).
 *
 * Lancer : node server.js   (Node.js 18+ recommandé)
 * Écoute sur http://localhost:4000
 *
 * Endpoints de démonstration :
 *   GET  /api/questions?theme=panneaux
 *   GET  /api/panneaux
 *   POST /api/questions        (ajoute une question EN MÉMOIRE, non persistée)
 *   POST /api/users/register   (stub — ne stocke rien de façon durable)
 *   POST /api/users/login      (stub — ne vérifie rien de façon sécurisée)
 *   POST /api/progress         (stub — reçoit un score et le renvoie tel quel)
 *
 * IMPORTANT : ce squelette ne doit jamais être utilisé tel quel en
 * production. Il ne fait aucun contrôle de sécurité réel (pas de
 * hachage de mot de passe, pas de validation poussée, pas de
 * protection contre les abus).
 */
const http = require('http');
const { URL } = require('url');

// ---- Données de démonstration en mémoire (à remplacer par une vraie base) ----
let questions = [
  { id: 1, theme: 'panneaux', q: 'Que signifie un panneau triangulaire à bordure rouge ?', verified: true },
  { id: 2, theme: 'priorites', q: 'Qui est prioritaire en l’absence de panneau ?', verified: true }
];
let users = []; // { id, email } — jamais de mot de passe en clair, même ici (volontairement absent)

function send(res, status, data) {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = url;

  if (req.method === 'OPTIONS') { return send(res, 204, {}); }

  try {
    if (pathname === '/api/questions' && req.method === 'GET') {
      const theme = searchParams.get('theme');
      const list = theme ? questions.filter((q) => q.theme === theme) : questions;
      return send(res, 200, { count: list.length, results: list });
    }

    if (pathname === '/api/questions' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.q || !body.theme) return send(res, 400, { error: 'Champs "q" et "theme" requis.' });
      const newQ = { id: questions.length + 1, theme: body.theme, q: body.q, verified: !!body.verified };
      questions.push(newQ);
      return send(res, 201, { message: 'Ajoutée en mémoire (non persistée après redémarrage).', question: newQ });
    }

    if (pathname === '/api/users/register' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.email) return send(res, 400, { error: 'Champ "email" requis.' });
      const user = { id: users.length + 1, email: body.email };
      users.push(user);
      return send(res, 201, {
        message: 'Utilisateur ajouté en mémoire — STUB uniquement. Une vraie inscription doit hacher le mot de passe (ex. bcrypt) et le stocker en base.',
        user
      });
    }

    if (pathname === '/api/users/login' && req.method === 'POST') {
      return send(res, 200, {
        message: 'STUB — aucune vérification réelle n’est effectuée. Une vraie connexion doit vérifier le mot de passe haché et émettre une session ou un token (ex. JWT).'
      });
    }

    if (pathname === '/api/progress' && req.method === 'POST') {
      const body = await readBody(req);
      return send(res, 200, {
        message: 'STUB — reçu mais non persisté. À relier à une table "progress" liée à l’utilisateur authentifié.',
        received: body
      });
    }

    send(res, 404, { error: 'Route inconnue', hint: 'Voir les commentaires en tête de server.js pour la liste des routes disponibles.' });
  } catch (err) {
    send(res, 500, { error: 'Erreur serveur', details: String(err.message || err) });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`SunuPermis — squelette de backend à l'écoute sur http://localhost:${PORT}`);
});
