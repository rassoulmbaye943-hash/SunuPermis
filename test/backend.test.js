'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { Repository } = require('../server/lib/repository');
const { createRoutes: createUserRoutes } = require('../server/routes/users');
const { createRoutes: createProgressRoutes } = require('../server/routes/progress');
const { createRoutes: createAdminRoutes } = require('../server/routes/admin');
const authService = require('../server/lib/auth-service');
const { authUser } = require('../server/middleware/auth-user');
const { authAdmin } = require('../server/middleware/auth-admin');

function handler(router, method, routePath) {
  const layer = router.stack.find((item) => item.route && item.route.path === routePath && item.route.methods[method]);
  assert.ok(layer, `route ${method.toUpperCase()} ${routePath} introuvable`);
  return layer.route.stack[layer.route.stack.length - 1].handle;
}

function response() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.payload = value; return this; }
  };
}

test('API SunuPermis : réservation admin, progression, permissions et contenu', async (t) => {
  const previous = {
    jwt: process.env.JWT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
  };
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'sunupermis-test-'));
  process.env.JWT_SECRET = 'test-only-secret-with-at-least-32-characters-long';
  process.env.ADMIN_EMAIL = 'admin-test@example.test';
  process.env.ADMIN_PASSWORD = 'TestAdminPassword-2026';
  t.after(() => {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
    if (previous.jwt === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previous.jwt;
    if (previous.adminEmail === undefined) delete process.env.ADMIN_EMAIL; else process.env.ADMIN_EMAIL = previous.adminEmail;
    if (previous.adminPassword === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previous.adminPassword;
  });

  const repo = new Repository(temporaryDirectory);
  const noLimit = (_req, _res, next) => next();
  const users = createUserRoutes(repo, noLimit);
  const progress = createProgressRoutes(repo);
  const admin = createAdminRoutes(repo);
  const register = handler(users, 'post', '/users/register');
  const loginAdmin = handler(admin, 'post', '/login');

  const reservedResponse = response();
  await register({ body: { name: 'Intrus', email: process.env.ADMIN_EMAIL, password: 'Password123' } }, reservedResponse);
  assert.equal(reservedResponse.statusCode, 409, 'l’adresse administrateur est réservée');
  assert.equal(repo.users.length, 0, 'l’inscription publique ne doit créer aucun administrateur');

  const signupResponse = response();
  await register({ body: { name: 'Testeur', email: 'test@example.test', password: 'Password123', objective: 'B' } }, signupResponse);
  assert.equal(signupResponse.statusCode, 201);
  assert.equal(signupResponse.payload.user.role, 'user');
  const user = signupResponse.payload.user;
  const userToken = signupResponse.payload.token;

  const putProgress = handler(progress, 'put', '/');
  const progressResponse = response();
  putProgress({ user: { id: user.id }, body: { progress: {
    lessonsSeen: { 'code-route': true },
    quizScores: [{ theme: 'panneaux', score: 2, total: 3, date: '2026-11-25' }]
  } } }, progressResponse);
  assert.equal(progressResponse.statusCode, 200);
  assert.equal(progressResponse.payload.progress.quizScores.length, 1);

  const adminResponse = response();
  await loginAdmin({ body: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD } }, adminResponse);
  assert.equal(adminResponse.statusCode, 200);
  assert.equal(adminResponse.payload.user.role, 'admin');
  const adminUser = repo.findUserById(adminResponse.payload.user.id);
  const adminToken = adminResponse.payload.token;

  const statsRoute = admin.stack.find((item) => item.route && item.route.path === '/stats').route;
  const getStats = statsRoute.stack[statsRoute.stack.length - 1].handle;
  const statsResponse = response();
  getStats({ user: { id: adminUser.id, role: 'admin' } }, statsResponse);
  assert.equal(statsResponse.statusCode, 200);
  assert.ok(statsResponse.payload.panneaux > 0);
  assert.ok(statsResponse.payload.videos >= 0);

  const addQuestion = handler(admin, 'post', '/questions');
  const questionResponse = response();
  addQuestion({ body: { theme: 'priorites', q: 'Question de contrôle ?', rep: ['A', 'B'], correct: 0, source: 'Test interne' } }, questionResponse);
  assert.equal(questionResponse.statusCode, 201);
  assert.equal(questionResponse.payload.question.correct, 0);

  let nextCalled = false;
  const adminAuthResponse = response();
  authUser(repo)({ headers: { authorization: 'Bearer ' + adminToken } }, adminAuthResponse, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.equal(adminAuthResponse.statusCode, 200);
  const forbidden = response();
  let forbiddenNext = false;
  authAdmin({ user: { id: user.id, role: 'user' } }, forbidden, () => { forbiddenNext = true; });
  assert.equal(forbidden.statusCode, 403);
  assert.equal(forbiddenNext, false);

  repo.updateUser(adminUser.id, { role: 'user' });
  const demoted = response();
  let demotedNext = false;
  authUser(repo)({ headers: { authorization: 'Bearer ' + adminToken } }, demoted, () => { demotedNext = true; });
  assert.equal(demotedNext, true);
  const demotedAdmin = response();
  authAdmin({ user: { id: adminUser.id, role: repo.findUserById(adminUser.id).role } }, demotedAdmin, () => {});
  assert.equal(demotedAdmin.statusCode, 403, 'la rétrogradation invalide les anciens privilèges admin');

  repo.removeUser(user.id);
  const deleted = response();
  let deletedNext = false;
  authUser(repo)({ headers: { authorization: 'Bearer ' + userToken } }, deleted, () => { deletedNext = true; });
  assert.equal(deleted.statusCode, 401);
  assert.equal(deletedNext, false, 'un token lié à un compte supprimé doit être refusé');

  const tampered = response();
  let tamperedNext = false;
  authUser(repo)({ headers: { authorization: 'Bearer ' + userToken + 'x' } }, tampered, () => { tamperedNext = true; });
  assert.equal(tampered.statusCode, 401);
  assert.equal(tamperedNext, false);

  assert.equal(typeof authService.verifyToken, 'function');
});
