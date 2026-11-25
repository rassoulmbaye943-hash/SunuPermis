'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const KNOWLEDGE_FILE = path.join(__dirname, '..', 'data', 'raoul-knowledge.md');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

let knowledge = '';
try {
  knowledge = fs.readFileSync(KNOWLEDGE_FILE, 'utf8');
} catch (e) {
  knowledge = "(Base de connaissances indisponible.)";
}

const SYSTEM_PROMPT = `
Tu t'appelles Raoul, assistant officiel de SunuPermis.
Tu es sympa, simple, tu tutoies l'utilisateur, et tu expliques en français clair et court.

Règles importantes :
1. Réponds d'abord avec les infos de SunuPermis quand la question concerne le permis, l'inscription, les prix, les documents ou le code de la route. Utilise pour cela la base de connaissances ci-dessous.
2. Tu peux aussi répondre à toutes les autres questions générales : culture générale, maths, devoirs, conseils.
3. Si tu ne connais pas une info sur SunuPermis, dis exactement : « Je ne suis pas sûr, contacte l'équipe SunuPermis. » N'invente JAMAIS un prix ou une démarche.
4. Si l'utilisateur s'adresse à toi en wolof, tu peux répondre un peu en wolof.
5. Reste concis et utile.

Base de connaissances SunuPermis :
${knowledge}
`.trim();

function historiqueVersContenus(historique) {
  const contenus = [];
  for (const h of historique || []) {
    if (!h || !h.text) continue;
    contenus.push({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(h.text) }]
    });
  }
  return contenus;
}

/**
 * POST /api/raoul
 * Body : { message: string, historique: Array<{role, text}> }
 * La clé API Gemini est lue UNIQUEMENT depuis les variables d'environnement
 * (GEMINI_API_KEY), jamais depuis le frontend.
 */
router.post('/', async (req, res) => {
  try {
    const { message, historique } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ erreur: "Merci d'écrire un message." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        erreur:
          "Raoul n'est pas encore configuré : la clé API Gemini (GEMINI_API_KEY) est manquante côté serveur."
      });
    }

    if (message.length > 4000) {
      return res.status(413).json({ erreur: 'Ton message est trop long (4 000 caractères maximum).' });
    }

    const safeHistory = Array.isArray(historique) ? historique.slice(-12) : [];
    const contenus = historiqueVersContenus(safeHistory).map((item) => ({
      ...item, parts: [{ text: item.parts[0].text.slice(0, 2000) }]
    }));
    contenus.push({ role: 'user', parts: [{ text: message.trim() }] });

    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/' +
      GEMINI_MODEL +
      ':generateContent?key=' +
      encodeURIComponent(apiKey);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: contenus,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 600
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const detail = data && data.error ? data.error.message : `HTTP ${response.status}`;
      throw new Error(detail);
    }

    const reponse =
      data.candidates && data.candidates[0] && data.candidates[0].content
        ? data.candidates[0].content.parts.map((p) => p.text || '').join('')
        : '';

    if (!reponse) {
      throw new Error('Réponse vide de l\'IA.');
    }

    res.json({ reponse });
  } catch (err) {
    console.error('Erreur POST /api/raoul :', err);
    res.status(502).json({
      erreur:
        'Raoul est momentanément indisponible. Réessaie dans quelques instants.'
    });
  }
});

module.exports = router;
