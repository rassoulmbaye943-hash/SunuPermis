'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const progressSource = fs.readFileSync(path.join(__dirname, '..', 'js', 'progress.js'), 'utf8');

function loadProgress(localStorage) {
  const context = { localStorage };
  vm.runInNewContext(progressSource, context, { filename: 'js/progress.js' });
  return context.SPProgress;
}

test('réinitialiser la progression locale ne la restaure pas depuis le serveur', () => {
  const values = new Map([['sp_progress_v1', JSON.stringify({ quizScores: [{ score: 1 }] })]]);
  const localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  };
  const progress = loadProgress(localStorage);
  let syncCalls = 0;
  progress._syncWithServer = () => { syncCalls += 1; return Promise.resolve(); };

  progress.reset();

  assert.equal(localStorage.getItem('sp_progress_v1'), null);
  assert.equal(syncCalls, 0, 'la réinitialisation locale ne doit pas fusionner la copie du compte');
});

test('la réinitialisation reste sans exception si le stockage local est indisponible', () => {
  const progress = loadProgress({ removeItem() { throw new Error('stockage indisponible'); } });

  assert.doesNotThrow(() => progress.reset());
});
