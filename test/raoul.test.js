'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createRoutes } = require('../server/routes/raoul');

function postHandler(router) {
  const layer = router.stack.find((item) => item.route && item.route.path === '/' && item.route.methods.post);
  assert.ok(layer, 'route POST / introuvable');
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

function restoreEnvironment(name, previous, existed) {
  if (existed) process.env[name] = previous;
  else delete process.env[name];
}

test('Raoul envoie les messages à NVIDIA avec une clé serveur et convertit le format de discussion', async (t) => {
  const previousKey = process.env.NVIDIA_API_KEY;
  const hadKey = Object.hasOwn(process.env, 'NVIDIA_API_KEY');
  const previousModel = process.env.NVIDIA_MODEL;
  const hadModel = Object.hasOwn(process.env, 'NVIDIA_MODEL');
  const previousFetch = global.fetch;
  let capturedRequest;

  process.env.NVIDIA_API_KEY = 'test-placeholder';
  process.env.NVIDIA_MODEL = 'nvidia/test-model';
  global.fetch = async (url, options) => {
    capturedRequest = { url, options };
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Réponse de test.' } }] })
    };
  };
  t.after(() => {
    restoreEnvironment('NVIDIA_API_KEY', previousKey, hadKey);
    restoreEnvironment('NVIDIA_MODEL', previousModel, hadModel);
    global.fetch = previousFetch;
  });

  const route = postHandler(createRoutes());
  const res = response();
  await route({ body: {
    message: 'Quelle est la règle ?',
    historique: [
      { role: 'user', text: 'Que signifie ce panneau ?' },
      { role: 'raoul', text: 'Il annonce un danger.' }
    ]
  } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.reponse, 'Réponse de test.');
  assert.equal(capturedRequest.url, 'https://integrate.api.nvidia.com/v1/chat/completions');
  assert.equal(capturedRequest.options.headers.Authorization, 'Bearer test-placeholder');
  const body = JSON.parse(capturedRequest.options.body);
  assert.equal(body.model, 'nvidia/test-model');
  assert.equal(body.stream, false);
  assert.deepEqual(body.messages.map((item) => item.role), ['system', 'user', 'assistant', 'user']);
  assert.equal(body.messages.at(-1).content, 'Quelle est la règle ?');
  assert.ok(!capturedRequest.options.body.includes('test-placeholder'), 'la clé ne doit jamais être dans le corps JSON');
});

test('Raoul répond 503 sans NVIDIA_API_KEY sans appeler le fournisseur', async (t) => {
  const previousKey = process.env.NVIDIA_API_KEY;
  const hadKey = Object.hasOwn(process.env, 'NVIDIA_API_KEY');
  const previousFetch = global.fetch;
  delete process.env.NVIDIA_API_KEY;
  global.fetch = async () => { throw new Error('fetch ne devrait pas être appelé'); };
  t.after(() => {
    restoreEnvironment('NVIDIA_API_KEY', previousKey, hadKey);
    global.fetch = previousFetch;
  });

  const route = postHandler(createRoutes());
  const res = response();
  await route({ body: { message: 'Bonjour' } }, res);

  assert.equal(res.statusCode, 503);
  assert.match(res.payload.erreur, /NVIDIA_API_KEY/);
});

test('Raoul masque les erreurs de réponse du fournisseur', async (t) => {
  const previousKey = process.env.NVIDIA_API_KEY;
  const hadKey = Object.hasOwn(process.env, 'NVIDIA_API_KEY');
  const previousFetch = global.fetch;
  const previousConsoleError = console.error;
  process.env.NVIDIA_API_KEY = 'test-placeholder';
  global.fetch = async () => ({ ok: false, status: 401 });
  console.error = () => {};
  t.after(() => {
    restoreEnvironment('NVIDIA_API_KEY', previousKey, hadKey);
    global.fetch = previousFetch;
    console.error = previousConsoleError;
  });

  const route = postHandler(createRoutes());
  const res = response();
  await route({ body: { message: 'Bonjour' } }, res);

  assert.equal(res.statusCode, 502);
  assert.equal(res.payload.erreur, 'Raoul est momentanement indisponible. Reessaie dans quelques instants.');
});
