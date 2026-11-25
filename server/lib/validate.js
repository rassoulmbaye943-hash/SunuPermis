'use strict';
/** Validation des entrées et fusion de la progression utilisateur. */

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const OBJECTIVES = ['A', 'B', 'C', 'D'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function cleanText(value, min, max, label) {
  if (typeof value !== 'string') throw new HttpError(400, label + ' requis.');
  // eslint-disable-next-line no-control-regex
  const s = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.length < min || s.length > max) {
    throw new HttpError(400, label + ' : entre ' + min + ' et ' + max + ' caractères.');
  }
  return s;
}

function cleanEmail(value) {
  if (typeof value !== 'string') throw new HttpError(400, 'Adresse e-mail requise.');
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) throw new HttpError(400, 'Adresse e-mail invalide.');
  return email;
}

function cleanPassword(value) {
  if (typeof value !== 'string') throw new HttpError(400, 'Mot de passe requis.');
  if (value.length < 8) throw new HttpError(400, 'Le mot de passe doit contenir au moins 8 caractères.');
  if (value.length > 128) throw new HttpError(400, 'Le mot de passe est trop long (128 caractères maximum).');
  return value;
}

function cleanObjective(value) {
  if (value === undefined || value === null || value === '') return 'B';
  if (OBJECTIVES.indexOf(value) === -1) throw new HttpError(400, 'Objectif de permis invalide.');
  return value;
}

function cleanQuestion(body) {
  const theme = cleanText(body.theme, 2, 40, 'Thème').toLowerCase();
  const q = cleanText(body.q, 5, 500, 'Question');
  if (!Array.isArray(body.rep) || body.rep.length < 2 || body.rep.length > 6) {
    throw new HttpError(400, 'Il faut entre 2 et 6 réponses.');
  }
  const rep = body.rep.map((r) => cleanText(r, 1, 200, 'Réponse'));
  const correct = Number(body.correct);
  if (!Number.isInteger(correct) || correct < 0 || correct >= rep.length) {
    throw new HttpError(400, 'Index de bonne réponse invalide.');
  }
  const exp = body.exp ? cleanText(body.exp, 1, 1000, 'Explication') : '';
  const source = body.source ? cleanText(body.source, 1, 200, 'Source') : null;
  return { theme, q, rep, correct, exp, verified: !!(body.verified && source), source };
}

/* ---------------- Progression ---------------- */

function isDate(s) {
  return typeof s === 'string' && s.length <= 40 && !Number.isNaN(Date.parse(s));
}
function isCount(n) {
  return Number.isInteger(n) && n >= 0 && n <= 1000;
}
function str(s, max) {
  return typeof s === 'string' ? s.slice(0, max) : '';
}

const LIMITS = { quiz: 500, exam: 200, days: 400, lessons: 500, badges: 50 };

function sanitizeProgress(input) {
  const src = input && typeof input === 'object' ? input : {};
  const out = { lessonsSeen: {}, quizScores: [], examResults: [], streakDays: [], badges: [] };

  if (src.lessonsSeen && typeof src.lessonsSeen === 'object' && !Array.isArray(src.lessonsSeen)) {
    Object.keys(src.lessonsSeen).slice(0, LIMITS.lessons).forEach((k) => {
      if (k.length <= 80 && src.lessonsSeen[k]) out.lessonsSeen[k] = true;
    });
  }
  if (Array.isArray(src.quizScores)) {
    src.quizScores.forEach((r) => {
      if (r && isCount(r.score) && isCount(r.total) && r.total > 0 && r.score <= r.total && isDate(r.date)) {
        out.quizScores.push({ theme: str(r.theme, 40), score: r.score, total: r.total, date: r.date });
      }
    });
  }
  if (Array.isArray(src.examResults)) {
    src.examResults.forEach((r) => {
      if (r && isCount(r.score) && isCount(r.total) && r.total > 0 && r.score <= r.total && isDate(r.date)) {
        const weak = Array.isArray(r.weakThemes) ? r.weakThemes.slice(0, 20).map((t) => str(t, 40)) : [];
        out.examResults.push({ id: str(r.id, 40), score: r.score, total: r.total, weakThemes: weak, date: r.date });
      }
    });
  }
  if (Array.isArray(src.streakDays)) {
    out.streakDays = src.streakDays.filter((d) => typeof d === 'string' && DAY_RE.test(d));
  }
  if (Array.isArray(src.badges)) {
    out.badges = src.badges.filter((b) => typeof b === 'string' && b.length <= 40);
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

/** Fusionne deux états de progression sans rien perdre (union + dédoublonnage). */
function mergeProgress(a, b) {
  const x = sanitizeProgress(a);
  const y = sanitizeProgress(b);
  const lessonsSeen = Object.assign({}, x.lessonsSeen, y.lessonsSeen);
  const quizScores = uniqueBy(x.quizScores.concat(y.quizScores), (r) => r.date + '|' + r.theme + '|' + r.score + '|' + r.total)
    .sort(byDate)
    .slice(-LIMITS.quiz);
  const examResults = uniqueBy(x.examResults.concat(y.examResults), (r) => r.date + '|' + r.id + '|' + r.score + '|' + r.total)
    .sort(byDate)
    .slice(-LIMITS.exam);
  const streakDays = uniqueBy(x.streakDays.concat(y.streakDays), (d) => d).sort().slice(-LIMITS.days);
  const badges = uniqueBy(x.badges.concat(y.badges), (b) => b).slice(0, LIMITS.badges);
  return { lessonsSeen, quizScores, examResults, streakDays, badges };
}

module.exports = {
  HttpError, cleanText, cleanEmail, cleanPassword, cleanObjective, cleanQuestion,
  sanitizeProgress, mergeProgress, OBJECTIVES
};
