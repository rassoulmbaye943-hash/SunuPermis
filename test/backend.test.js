'use strict';

/**
 * Tests automatisés du backend SunuPermis.
 * Module natif Node.js (node:test).
 * Lancer : node test/backend.test.js  (serveur sur http://localhost:3000)
 */
const assert = require('node:assert');
const { test, describe } = require('node:test');
const http = require('http');

const BASE = 'http://localhost:3000';

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await req('GET', '/api/health');
      return;
    } catch (e) {
      await sleep(1000);
    }
  }
  throw new Error('Serveur indisponible après ' + maxAttempts + ' tentatives.');
}

function req(method, path, body, token, retries = 3) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers.Authorization = 'Bearer ' + token;
    const r = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data || 'null'); } catch (_) {}
        // Retry en cas de rate limiting (429)
        if (res.statusCode === 429 && retries > 0) {
          const retryAfter = parseInt(res.headers['retry-after'] || '1', 10);
          setTimeout(() => {
            resolve(req(method, path, body, token, retries - 1));
          }, retryAfter * 1000);
          return;
        }
        resolve({ status: res.statusCode, headers: res.headers, data: json, raw: data });
      });
    });
    r.on('error', reject);
    r.write(body ? JSON.stringify(body) : '');
    r.end();
  });
}

let userToken = null;
let adminToken = null;
let createdQuestionId = null;

describe('SunuPermis Backend', async () => {

  await waitForServer();

  test('GET /api/health retourne le statut ok', async () => {
    const r = await req('GET', '/api/health');
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.data.status, 'ok');
  });

  test('POST /api/users/register crée un compte', async () => {
    const r = await req('POST', '/api/users/register', {
      name: 'Testeur Auto',
      email: 'testauto@example.com',
      password: 'Password123',
      objective: 'Permis B'
    });
    assert.strictEqual(r.status, 201);
    assert.ok(r.data.token);
    assert.strictEqual(r.data.user.email, 'testauto@example.com');
    assert.strictEqual(r.data.user.role, 'user');
  });

  test('POST /api/users/register rejette le doublon d email', async () => {
    await sleep(600);
    const r = await req('POST', '/api/users/register', {
      name: 'Doublon',
      email: 'testauto@example.com',
      password: 'Password123'
    });
    assert.strictEqual(r.status, 409);
  });

  test('POST /api/users/login authentifie', async () => {
    await sleep(600);
    const r = await req('POST', '/api/users/login', {
      email: 'testauto@example.com',
      password: 'Password123'
    });
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.token);
    userToken = r.data.token;
  });

  test('POST /api/users/login rejette un mauvais mot de passe', async () => {
    await sleep(600);
    const r = await req('POST', '/api/users/login', {
      email: 'testauto@example.com',
      password: 'MauvaisMotDePasse'
    });
    assert.strictEqual(r.status, 401);
  });

  test('GET /api/me retourne le profil utilisateur', async () => {
    await sleep(600);
    const r = await req('GET', '/api/me', null, userToken);
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.data.user.email, 'testauto@example.com');
  });

  test('PATCH /api/me met à jour le profil', async () => {
    await sleep(600);
    const r = await req('PATCH', '/api/me', { name: 'Testeur Auto Modifié', objective: 'Permis A' }, userToken);
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.data.user.name, 'Testeur Auto Modifié');
  });

  test('GET /api/progress retourne la progression (vide au début)', async () => {
    await sleep(600);
    const r = await req('GET', '/api/progress', null, userToken);
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.progress);
  });

  test('PUT /api/progress enregistre la progression', async () => {
    await sleep(600);
    const r = await req('PUT', '/api/progress', {
      progress: {
        lessonsSeen: { 'code-route': true },
        quizScores: [{ theme: 'panneaux', score: 7, total: 10, date: '2026-11-25' }]
      }
    }, userToken);
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.data.progress.quizScores.length, 1);
  });

  test('GET /api/questions renvoie la banque de questions', async () => {
    const r = await req('GET', '/api/questions?limit=3');
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.results);
    assert.ok(r.data.total > 0);
  });

  test('GET /api/panneaux renvoie les panneaux', async () => {
    const r = await req('GET', '/api/panneaux?cat=danger');
    assert.strictEqual(r.status, 200);
    assert.ok(Array.isArray(r.data.results));
  });

  test('GET /api/videos renvoie les vidéos', async () => {
    const r = await req('GET', '/api/videos');
    assert.strictEqual(r.status, 200);
    assert.ok(Array.isArray(r.data.results));
  });

  test('POST /api/admin/login authentifie l administrateur', async () => {
    await sleep(600);
    const r = await req('POST', '/api/admin/login', {
      email: 'admin@sunupermis.sn',
      password: 'SunupermisAdmin2026!'
    });
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.token);
    assert.strictEqual(r.data.user.role, 'admin');
    adminToken = r.data.token;
  });

  test('GET /api/admin/stats protégée retourne les statistiques', async () => {
    await sleep(600);
    const r = await req('GET', '/api/admin/stats', null, adminToken);
    assert.strictEqual(r.status, 200);
    assert.ok(r.data.users >= 1);
    assert.ok(r.data.admins >= 1);
  });

  test('GET /api/admin/stats rejetée sans token admin', async () => {
    await sleep(600);
    const r = await req('GET', '/api/admin/stats', null, userToken);
    assert.strictEqual(r.status, 403);
  });

  test('POST /api/admin/questions ajoute une question personnalisée', async () => {
    await sleep(600);
    const r = await req('POST', '/api/admin/questions', {
      theme: 'priorites',
      q: 'Question de test automatisé ?',
      rep: ['Réponse A', 'Réponse B', 'Réponse C'],
      correct: 1,
      exp: 'Explication de test.',
      source: 'test-automatisé'
    }, adminToken);
    assert.strictEqual(r.status, 201);
    assert.ok(r.data.question);
    assert.ok(r.data.question.id);
    createdQuestionId = r.data.question.id;
  });

  test('DELETE /api/admin/questions/:id supprime la question personnalisée', async () => {
    await sleep(600);
    const r = await req('DELETE', '/api/admin/questions/' + createdQuestionId, null, adminToken);
    assert.strictEqual(r.status, 200);
  });

  test('POST /api/contact enregistre un message', async () => {
    const r = await req('POST', '/api/contact', {
      nom: 'Test',
      telephone: '770000000',
      sujet: 'Test',
      message: 'Message de test automatisé.'
    });
    assert.strictEqual(r.status, 201);
  });

  test('POST /api/inscriptions enregistre une inscription', async () => {
    const r = await req('POST', '/api/inscriptions', {
      nom: 'Test',
      prenom: 'Auto',
      telephone: '770000000',
      ville: 'Dakar',
      typePermis: 'B'
    });
    assert.strictEqual(r.status, 201);
  });

  test('POST /api/me/password change le mot de passe', async () => {
    await sleep(600);
    const r = await req('POST', '/api/me/password', {
      currentPassword: 'Password123',
      newPassword: 'NouveauPass123'
    }, userToken);
    assert.strictEqual(r.status, 200);
  });

  test('POST /api/users/login avec le nouveau mot de passe', async () => {
    await sleep(600);
    const r = await req('POST', '/api/users/login', {
      email: 'testauto@example.com',
      password: 'NouveauPass123'
    });
    assert.strictEqual(r.status, 200);
  });

  test('DELETE /api/me supprime le compte', async () => {
    await sleep(2000);
    // Relogin pour obtenir un token frais après le changement de mot de passe
    const login = await req('POST', '/api/users/login', { email: 'testauto@example.com', password: 'NouveauPass123' });
    const freshToken = login.data.token;
    const r = await req('DELETE', '/api/me', { password: 'NouveauPass123' }, freshToken, 5);
    assert.strictEqual(r.status, 200);
  });

  test('GET /api/me après suppression retourne 401', async () => {
    await sleep(600);
    const r = await req('GET', '/api/me', null, userToken);
    assert.strictEqual(r.status, 401);
  });

  test('GET /api/raoul sans clé API retourne 503 (config manquante)', async () => {
    const r = await req('POST', '/api/raoul', { message: 'Bonjour' });
    assert.strictEqual(r.status, 503);
  });

});

console.log('✅ Tous les tests backend sont terminés.');
