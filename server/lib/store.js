'use strict';
/**
 * Stockage JSON persistant (écriture atomique).
 * Convient pour un prototype / un petit déploiement. Pour une charge plus
 * importante, remplacer ce module par PostgreSQL / MySQL / MongoDB en
 * conservant la même interface (users, progress, questions, save()).
 */
const fs = require('fs');
const path = require('path');

class Store {
  constructor(dataDir) {
    this.dir = dataDir;
    this.file = path.join(dataDir, 'db.json');
    fs.mkdirSync(dataDir, { recursive: true });
    this.data = { users: [], progress: {}, questions: [] };
    if (fs.existsSync(this.file)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        this.data = Object.assign(this.data, parsed);
      } catch (e) {
        // Fichier corrompu : on le met de côté plutôt que de l'écraser.
        fs.renameSync(this.file, this.file + '.corrupt-' + Date.now());
      }
    }
  }

  save() {
    const tmp = this.file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    fs.renameSync(tmp, this.file);
  }

  get users() { return this.data.users; }
  get progress() { return this.data.progress; }
  get questions() { return this.data.questions; }
}

module.exports = { Store };
