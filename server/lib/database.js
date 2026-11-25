'use strict';

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'db.json');
const EMPTY_DATABASE = () => ({ inscriptions: [], messages: [], admins: [] });

function readDatabase() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return {
      inscriptions: Array.isArray(parsed.inscriptions) ? parsed.inscriptions : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      admins: Array.isArray(parsed.admins) ? parsed.admins : []
    };
  } catch (error) {
    if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error;
    return EMPTY_DATABASE();
  }
}

function writeDatabase(data) {
  const directory = path.dirname(DATA_FILE);
  fs.mkdirSync(directory, { recursive: true });
  const temporaryFile = `${DATA_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 });
  fs.renameSync(temporaryFile, DATA_FILE);
}

function createId() {
  return require('crypto').randomUUID();
}

module.exports = { readDatabase, writeDatabase, createId };
