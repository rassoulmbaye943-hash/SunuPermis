'use strict';

/**
 * Repository unifié de persistance pour SunuPermis.
 * Schéma versionné, écriture atomique, migration douce des données existantes.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SCHEMA_VERSION = 1;

const EMPTY_SCHEMA = () => ({
  version: SCHEMA_VERSION,
  users: [],
  progress: {},
  questions: [],
  inscriptions: [],
  messages: [],
  admins: []
});

function createId() {
  return crypto.randomUUID();
}

function readRepository(dataFile) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  let raw = null;
  if (fs.existsSync(dataFile)) {
    try {
      raw = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {
      const corrupt = dataFile + '.corrupt-' + Date.now();
      try { fs.renameSync(dataFile, corrupt); } catch (_) {}
      return EMPTY_SCHEMA();
    }
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return EMPTY_SCHEMA();
  }
  const data = Object.assign({}, EMPTY_SCHEMA(), raw);
  if (Array.isArray(raw.users)) data.users = raw.users;
  if (raw.progress && typeof raw.progress === 'object' && !Array.isArray(raw.progress)) {
    data.progress = raw.progress;
  }
  if (Array.isArray(raw.questions)) data.questions = raw.questions;
  data.users = Array.isArray(data.users) ? data.users : [];
  data.questions = Array.isArray(data.questions) ? data.questions : [];
  data.inscriptions = Array.isArray(data.inscriptions) ? data.inscriptions : [];
  data.messages = Array.isArray(data.messages) ? data.messages : [];
  data.admins = Array.isArray(data.admins) ? data.admins : [];
  data.progress = data.progress && typeof data.progress === 'object' ? data.progress : {};
  data.users.forEach((u) => {
    if (!u.id) u.id = createId();
    if (!u.role) u.role = 'user';
    if (!u.createdAt) u.createdAt = new Date().toISOString();
  });
  data.version = SCHEMA_VERSION;
  return data;
}

function writeRepository(dataFile, data) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  data.version = SCHEMA_VERSION;
  const temporaryFile = `${dataFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
    mode: 0o600
  });
  fs.renameSync(temporaryFile, dataFile);
}

class Repository {
  constructor(dataDir) {
    this.dir = dataDir;
    this.file = path.join(dataDir, 'db.json');
    this.data = readRepository(this.file);
  }

  save() {
    writeRepository(this.file, this.data);
  }

  get users() { return this.data.users; }
  set users(value) { this.data.users = value; }

  findUserByEmail(email) {
    if (!email) return undefined;
    return this.users.find((u) => String(u.email).toLowerCase() === String(email).toLowerCase());
  }

  findUserById(id) {
    return this.users.find((u) => u.id === id);
  }

  addUser(user) {
    this.users.push(user);
    this.save();
    return user;
  }

  updateUser(id, changes) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = Object.assign({}, this.users[idx], changes);
    this.save();
    return this.users[idx];
  }

  removeUser(id) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    delete this.data.progress[id];
    this.save();
    return true;
  }

  get progress() { return this.data.progress; }
  set progress(value) { this.data.progress = value; }

  getProgress(userId) {
    return this.data.progress[userId];
  }

  setProgress(userId, progress) {
    this.data.progress[userId] = progress;
    this.save();
    return this.data.progress[userId];
  }

  mergeProgress(userId, incoming) {
    const current = this.data.progress[userId] || {};
    const merged = mergeProgressObjects(current, incoming);
    this.data.progress[userId] = merged;
    this.save();
    return merged;
  }

  deleteProgress(userId) {
    delete this.data.progress[id];
    this.save();
  }

  get questions() { return this.data.questions; }
  set questions(value) { this.data.questions = value; }

  addQuestion(question) {
    this.questions.push(question);
    this.save();
    return question;
  }

  removeQuestion(id) {
    const idx = this.questions.findIndex((q) => q.id === id);
    if (idx === -1) return false;
    this.questions.splice(idx, 1);
    this.save();
    return true;
  }

  get inscriptions() { return this.data.inscriptions; }
  set inscriptions(value) { this.data.inscriptions = value; }

  addInscription(inscription) {
    this.inscriptions.push(inscription);
    this.save();
    return inscription;
  }

  updateInscription(id, changes) {
    const idx = this.inscriptions.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.inscriptions[idx] = Object.assign({}, this.inscriptions[idx], changes);
    this.save();
    return this.inscriptions[idx];
  }

  get messages() { return this.data.messages; }
  set messages(value) { this.data.messages = value; }

  addMessage(message) {
    this.messages.push(message);
    this.save();
    return message;
  }

  get admins() { return this.data.admins; }
  set admins(value) { this.data.admins = value; }

  findAdminByEmail(email) {
    if (!email) return undefined;
    return this.admins.find((a) => String(a.email).toLowerCase() === String(email).toLowerCase());
  }

  addAdmin(admin) {
    this.admins.push(admin);
    this.save();
    return admin;
  }
}

/**
 * Fusionne deux etats de progression sans rien perdre (union + deduplication).
 */
function mergeProgressObjects(a, b) {
  const x = sanitizeProgressObject(a || {});
  const y = sanitizeProgressObject(b || {});
  const lessonsSeen = Object.assign({}, x.lessonsSeen, y.lessonsSeen);
  const quizScores = uniqueBy(
    x.quizScores.concat(y.quizScores),
    (r) => r.date + '|' + r.theme + '|' + r.score + '|' + r.total
  ).sort(byDate).slice(-500);
  const examResults = uniqueBy(
    x.examResults.concat(y.examResults),
    (r) => r.date + '|' + r.id + '|' + r.score + '|' + r.total
  ).sort(byDate).slice(-200);
  const streakDays = uniqueBy(x.streakDays.concat(y.streakDays), (d) => d).sort().slice(-400);
  const badges = uniqueBy(x.badges.concat(y.badges), (b) => b).slice(0, 50);
  return { lessonsSeen, quizScores, examResults, streakDays, badges };
}

function sanitizeProgressObject(input) {
  const src = input && typeof input === 'object' ? input : {};
  const out = { lessonsSeen: {}, quizScores: [], examResults: [], streakDays: [], badges: [] };
  const LIMITS = { quiz: 500, exam: 200, days: 400, lessons: 500, badges: 50 };
  const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
  const isCount = (n) => Number.isInteger(n) && n >= 0 && n <= 1000;
  const isDate = (s) => typeof s === 'string' && s.length <= 40 && !Number.isNaN(Date.parse(s));
  if (src.lessonsSeen && typeof src.lessonsSeen === 'object' && !Array.isArray(src.lessonsSeen)) {
    Object.keys(src.lessonsSeen).slice(0, LIMITS.lessons).forEach((k) => {
      if (k.length <= 80 && src.lessonsSeen[k]) out.lessonsSeen[k] = true;
    });
  }
  if (Array.isArray(src.quizScores)) {
    src.quizScores.forEach((r) => {
      if (r && isCount(r.score) && isCount(r.total) && r.total > 0 && r.score <= r.total && isDate(r.date)) {
        out.quizScores.push({ theme: String(r.theme || '').slice(0, 40), score: r.score, total: r.total, date: String(r.date).slice(0, 40) });
      }
    });
  }
  if (Array.isArray(src.examResults)) {
    src.examResults.forEach((r) => {
      if (r && isCount(r.score) && isCount(r.total) && r.total > 0 && r.score <= r.total && isDate(r.date)) {
        const weak = Array.isArray(r.weakThemes) ? r.weakThemes.slice(0, 20).map((t) => String(t || '').slice(0, 40)) : [];
        out.examResults.push({ id: String(r.id || '').slice(0, 40), score: r.score, total: r.total, weakThemes: weak, date: String(r.date).slice(0, 40) });
      }
    });
  }
  if (Array.isArray(src.streakDays)) {
    out.streakDays = src.streakDays.filter((d) => typeof d === 'string' && DAY_RE.test(d)).slice(0, 400);
  }
  if (Array.isArray(src.badges)) {
    out.badges = src.badges.filter((b) => typeof b === 'string' && b.length <= 40).slice(0, 50);
  }
  return out;
}

function uniqueBy(list, keyFn) {
  const seen = new Set();
  return list.filter((item) => {
    const k = keyFn(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function byDate(a, b) {
  return Date.parse(a.date) - Date.parse(b.date);
}

module.exports = { Repository, createId, EMPTY_SCHEMA, readRepository, writeRepository, SCHEMA_VERSION };
