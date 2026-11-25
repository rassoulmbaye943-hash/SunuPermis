'use strict';
/**
 * Charge la banque de contenu du frontend (js/data.js) pour que le frontend
 * et l'API partagent une seule source de vérité.
 */
const fs = require('fs');
const vm = require('vm');

function loadContent(dataJsPath) {
  const code = fs.readFileSync(dataJsPath, 'utf8');
  const sandbox = vm.createContext({});
  vm.runInContext(
    code + '\n;this.__out = { QUIZ_BANK: QUIZ_BANK, PANNEAUX: PANNEAUX, VIDEOS: VIDEOS, GLOSSAIRE: GLOSSAIRE };',
    sandbox,
    { timeout: 5000 }
  );
  // Copie JSON pour sortir des objets du contexte vm.
  return JSON.parse(JSON.stringify(sandbox.__out));
}

module.exports = { loadContent };
