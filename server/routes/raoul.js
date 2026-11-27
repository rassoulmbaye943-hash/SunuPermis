'use strict';

/**
 * Routes de Raoul, l'assistant pédagogique de SunuPermis.
 *
 * POST /api/raoul  { message, historique? }
 *
 * La clé API NVIDIA est lue UNIQUEMENT depuis les variables d'environnement
 * (NVIDIA_API_KEY), jamais depuis le frontend.
 *
 * NVIDIA expose une API de chat compatible avec le format OpenAI.
 */
const express = require('express');
const fs = require('fs');
const path = require('path');

function createRoutes(repo) {
  const router = express.Router();
  const KNOWLEDGE_FILE = path.join(__dirname, '..', 'data', 'raoul-knowledge.md');

  const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b';
  const configuredTimeout = Number.parseInt(process.env.NVIDIA_TIMEOUT || '20000', 10);
  const NVIDIA_TIMEOUT = Number.isSafeInteger(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : 20000;
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
        role: ['model', 'assistant', 'raoul'].includes(h.role) ? 'assistant' : 'user',
        content: String(h.text)
      });
    }
    return contenus;
  }

  function extraireReponse(data) {
    const contenu = data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : '';
    return typeof contenu === 'string' ? contenu.trim() : '';
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

      const apiKey = String(process.env.NVIDIA_API_KEY || '').trim();
      if (!apiKey) {
        return res.status(503).json({
          erreur:
            'Raoul n’est pas encore configuré : la clé API NVIDIA (NVIDIA_API_KEY) est manquante côté serveur.'
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
        content: item.content.slice(0, 2000)
      }));
      contenus.push({ role: 'user', content: message.trim() });

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

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(NVIDIA_TIMEOUT),
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: [{ role: 'system', content: systemPrompt }, ...contenus],
          stream: false,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`NVIDIA API HTTP ${response.status}`);
      }

      const data = await response.json();
      const reponse = extraireReponse(data);

      if (!reponse) {
        throw new Error('Reponse vide de l IA.');
      }

      return res.json({ reponse, references });
    } catch (err) {
      console.error('Erreur POST /api/raoul :', err.name || 'Erreur inconnue');
      return res.status(502).json({
        erreur:
          'Raoul est momentanement indisponible. Reessaie dans quelques instants.'
      });
    }
  });

  return router;
}

module.exports = { createRoutes };
