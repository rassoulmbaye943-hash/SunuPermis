'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { Repository } = require('../server/lib/repository');
const { createRoutes } = require('../server/routes/users');
const authService = require('../server/lib/auth-service');

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

function createHarness(directory) {
  const repo = new Repository(directory);
  const router = createRoutes(repo, (_req, _res, next) => next());
  return {
    repo,
    register: handler(router, 'post', '/users/register'),
    login: handler(router, 'post', '/users/login')
  };
}

function uniqueTestEmail() {
  return `auth-${crypto.randomUUID()}@example.test`;
}

const TEST_JWT_SECRET = 'test-only-auth-secret-with-at-least-32-characters';

test('parcours authentification : inscription, connexion et erreurs de configuration/dépôt', async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = TEST_JWT_SECRET;
  t.after(() => {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sunupermis-auth-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const { repo, register, login } = createHarness(directory);

  // Le parcours nominal couvre l'inscription suivie d'une connexion au même compte.
  const email = uniqueTestEmail();
  const signup = response();
  await register({ body: { name: 'Awa Ndiaye', email: email.toUpperCase(), password: 'TestPassword123' } }, signup);
  assert.equal(signup.statusCode, 201);
  assert.equal(signup.payload.user.email, email.toLowerCase());
  assert.equal('passwordHash' in signup.payload.user, false);

  const signedIn = response();
  await login({ body: { email: ` ${email.toUpperCase()} `, password: 'TestPassword123' } }, signedIn);
  assert.equal(signedIn.statusCode, 200);
  assert.equal(signedIn.payload.user.id, signup.payload.user.id);
  assert.ok(authService.verifyToken(signedIn.payload.token, process.env.JWT_SECRET));

  const wrongPassword = response();
  await login({ body: { email, password: 'incorrect' } }, wrongPassword);
  assert.equal(wrongPassword.statusCode, 401);
  assert.equal(wrongPassword.payload.erreur, 'E-mail ou mot de passe incorrect.');

  // Une configuration JWT absente ne doit ni créer un compte orphelin ni ressembler à une erreur de saisie.
  delete process.env.JWT_SECRET;
  const unconfiguredDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'sunupermis-auth-no-jwt-'));
  t.after(() => fs.rmSync(unconfiguredDirectory, { recursive: true, force: true }));
  const unconfiguredRepo = new Repository(unconfiguredDirectory);
  const unconfiguredRouter = createRoutes(unconfiguredRepo, (_req, _res, next) => next());
  const unconfiguredRegister = handler(unconfiguredRouter, 'post', '/users/register');
  const unconfiguredLogin = handler(unconfiguredRouter, 'post', '/users/login');
  const unconfiguredEmail = uniqueTestEmail();
  const unavailableSignup = response();
  await unconfiguredRegister({ body: { name: 'Awa Ndiaye', email: unconfiguredEmail, password: 'TestPassword123' } }, unavailableSignup);
  assert.equal(unavailableSignup.statusCode, 503);
  assert.equal(await unconfiguredRepo.findUserByEmail(unconfiguredEmail), undefined);
  const unavailableLogin = response();
  await unconfiguredLogin({ body: { email: unconfiguredEmail, password: 'TestPassword123' } }, unavailableLogin);
  assert.equal(unavailableLogin.statusCode, 503);
});
