'use strict';

/**
 * Routes de Raoul, l'assistant pédagogique de SunuPermis.
 *
 * POST /api/raoul  { message, historique? }
 *
 * La clé API Gemini est lue UNIQUEMENT depuis les variables d'environnement
 * (GEMINI_API_KEY), jamais depuis le frontend.
 *
 * Architecture : service d'IA abstrait (server/lib/ai-provider.js) pour
 * éviter de coupler l'application directement à Gemini.
 */
const express = require('express');
const fs = require('fs');
const path = require('path');

function createRoutes(repo) {
  const router = express.Router();
  const KNOWLEDGE_FILE = path.join(__dirname, '..', 'data', 'raoul-knowledge.md');

  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const GEMINI_TIMEOUT = Number.parseInt(process.env.GEMINI_TIMEOUT || '20000', 10);
  const MAX_HISTORY = Number.parseInt(process.env.RAOUL_MAX_HISTORY || '12', 10);

  let knowledge = '';
  try {
    knowledge = fs.readFileSync(KNOWLEDGE_FILE, 'utf8');
  } catch (e) {
    knowledge = '(Base de connaissances indisponible.)';
  }

  /**
   * Recherche contextuelle légère (RAG) : extrait les passages les plus
   * pertinents de la base de connaissances en fonction de la question.
   * Retourne les passages avec leurs métadonnées (titre, rubrique, source).
   */
  function rechercherContexte(question) {
    const mots = question.toLowerCase().split(/\s+/).filter((m) => m.length > 2);
    if (mots.length === 0) return [];

    const sections = knowledge.split(/#{2,3}\s+/m);
    const scored = [];

    sections.forEach((section, idx) => {
      const lines = section.split('\n');
      const titre = lines[0] || '';
      const contenu = section.toLowerCase();
      let score = 0;
      mots.forEach((m) => {
        if (contenu.includes(m)) score += 1;
      });
      if (score > 0) {
        scored.push({ score, titre: titre.trim(), contenu: section.trim(), index: idx });
      }
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }

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

  function extraireReponse(data) {
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) return '';
    return data.candidates[0].content.parts.map((p) => p.text || '').join('').trim();
  }

  /**
   * POST /api/raoul
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
            'Raoul n est pas encore configure : la cle API Gemini (GEMINI_API_KEY) est manquante cote serveur.'
        });
      }

      if (message.length > 4000) {
        return res.status(413).json({ erreur: 'Ton message est trop long (4 000 caracteres maximum).' });
      }

      // Recherche RAG : passages pertinents de la base de connaissances.
      const contexte = rechercherContexte(message.trim());
      let contexteTexte = '';
      let references = [];
      if (contexte.length > 0) {
        contexteTexte = '\n\nPassages pertinents de la base de connaissances SunuPermis :\n' +
          contexte.map((c) => `- [${c.titre}] ${c.contenu.slice(0, 500)}`).join('\n');
        references = contexte.map((c) => ({
          titre: c.titre,
          rubrique: 'Base de connaissances SunuPermis',
          source: 'raoul-knowledge.md'
        }));
      }

      const safeHistory = Array.isArray(historique) ? historique.slice(-MAX_HISTORY) : [];
      const contenus = historiqueVersContenus(safeHistory).map((item) => ({
        ...item,
        parts: [{ text: item.parts[0].text.slice(0, 2000) }]
      }));
      contenus.push({ role: 'user', parts: [{ text: message.trim() }] });

      const systemPrompt = `
Tu t'appelles Raoul, l'assistant officiel de SunuPermis, une plateforme de preparation au permis de conduire au Senegal.

Personnalite : sympa, patient, respectueux, pedagogue, naturel, encourageant, professionnel.
Tu tutoies l'utilisateur. Tu explains les notions compliquees avec des mots simples, surtout pour les debutants.
Tu peux utiliser quelques expressions wolof si l'utilisateur s'adresse a toi en wolof.

Regles importantes :
1. Tu reponds d'abord avec les infos de SunuPermis et de la base de connaissances ci-dessous.
2. Tu distingues les informations presenti sur SunuPermis, les explications pedagogiques generales, et les informations officielles necessitant une verification.
3. Tu n'inventes JAMAIS un tarif officiel, une demarche administrative, un age legal, une reglementation ou une procedure d'inscription.
4. Si tu ne connais pas une info, dis : « Je ne suis pas sur de cette information. Le mieux est de la confirmer aupres d'une auto-ecole agreee ou de l'administration competente. »
5. Tu ne pretends jamais que SunuPermis remplace une formation pratique aupres d'un moniteur.
6. Reste concis et adapte la profondeur de l'explication a la question.
7. Quand c'est pertinent, indique la rubrique ou le cours permettant d'approfondir la notion.

Base de connaissances SunuPermis :${contexteTexte}
      `.trim();

      const url =
        'https://generativelanguage.googleapis.com/v1beta/models/' +
        GEMINI_MODEL +
        ':generateContent?key=' +
        encodeURIComponent(apiKey);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(GEMINI_TIMEOUT),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: contenus,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 800
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = data && data.error ? data.error.message : `HTTP ${response.status}`;
        throw new Error(detail);
      }

      const reponse = extraireReponse(data);

      if (!reponse) {
        throw new Error('Reponse vide de l IA.');
      }

      return res.json({ reponse, references });
    } catch (err) {
      console.error('Erreur POST /api/raoul :', err.message);
      return res.status(502).json({
        erreur:
          'Raoul est momentanement indisponible. Reessaie dans quelques instants.'
      });
    }
  });

  return router;
}

module.exports = { createRoutes };
