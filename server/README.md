# SunuPermis — squelette de backend (non branché au site)

Ce dossier contient un **point de départ** pour une vraie API, écrit en
Node.js pur (aucune dépendance à installer). Il n'est **pas connecté**
au site statique (`../index.html` etc.), qui continue de fonctionner
en autonomie avec `localStorage`.

## Lancer le squelette

```
node server.js
```

Le serveur écoute sur `http://localhost:4000` et expose :

- `GET  /api/questions?theme=panneaux` — liste de questions de démonstration
- `POST /api/questions` — ajoute une question **en mémoire** (perdue au redémarrage)
- `POST /api/users/register` — stub, ne hache pas de mot de passe
- `POST /api/users/login` — stub, ne vérifie rien de façon sécurisée
- `POST /api/progress` — stub, renvoie simplement ce qui a été reçu

## Ce qu'il reste à faire avant toute mise en production

1. Remplacer les tableaux en mémoire par une vraie base de données (PostgreSQL, MySQL ou MongoDB).
2. Ajouter une authentification réelle : hachage des mots de passe (ex. bcrypt/argon2), sessions ou JWT, protection CSRF.
3. Ajouter une validation stricte des entrées et une limitation de débit (rate limiting).
4. Relier le frontend (`js/progress.js`, `profil.html`, `admin.html`) à cette API au lieu de `localStorage`.
5. Ajouter des tests automatisés et un système de migration de schéma.
6. Héberger derrière HTTPS avec un nom de domaine dédié.

Ce squelette sert uniquement à illustrer la forme que pourrait prendre
l'API — il ne doit jamais être déployé tel quel.
---
version: "2.0 (branched)"
---

## ⚙️ API véritable (remplace le squelette initial, `server/server.js`)
Serveur Node.js pur (aucune dépendance npm) qui sert à la fois l'API et le site
statique: `node server.js` = `http://localhost:4000`.

### Authentification réelle
- Mots de passe hachés avec scrypt (salt aléatoire, comparaison constante-temps).
- Jetons JWT (HMAC-SHA256) de 7 jours, envoyés via `Authorization: Bearer`.
- Les comptes premier enregistré dans `ADMIN_EMAILS` du serveur deviennent
  administrateurs (vérifiable en `GET /api/me` et l'espace admin).

### Données persistantes
- `server/data/db.json` (écrits de façon atomique) : comptes, progression,
  questions ajoutées par l'admin.
- `server/data/secret.key` : clé de signature JWT (6000 perms, générée une fois).

### Endpoints
- Public : `/api/health`, `/api/questions?theme=&limit=&random=1`,
  `/api/panneaux?cat=&q=`, `/api/videos`.
- Auth : `POST /api/users/register` (name, email, password, objective),
  `POST /api/users/login`, `GET /api/me`, `PATCH /api/me`, `POST /api/me/password`,
  `DELETE /api/me`.
- Progression : `GET /api/progress`, `PUT /api/progress`, `DELETE /api/progress`.
  La fusion est distribuée : le client fusionne local + serveur à chaque
  enregistrement, et le serveur garde les dédoublonnés par clé.
- Admin : `GET /api/admin/stats` (users, questions, panneaux, videos,
  quizzesTaken, examsTaken), `GET /api/admin/users`, `GET /api/admin/questions`,
  `POST /api/admin/questions`, `DELETE /api/admin/questions/:id`.

### Sécurité et limitation (démo maîtrisée)
- Rate limiting en mémoire par IP (auth 10 requêtes/15 min, API 300/min).
- Réponse 409 en cas de duplicate email, 429 après la limite, 413 pour un corps
  trop lourd, 400 pour champ invalide.
- CORS restreint aux origines localhost par défaut (`CORS_ORIGINS` pour ouvrir).
- Headers de sécurité par défaut (nosniff, X-Frame-Options…).
- Le chemin `server/` et `.git` ne sont jamais servis (traversal bloquée).

### Variables d'environnement
PORT, DATA_DIR, ADMIN_EMAILS (virgules), JWT_SECRET, CORS_ORIGINS, SERVE_STATIC=0.

### Notes de compatibilité
- `js/progress.js` appelle désormais `SPProgress._syncWithServer()` à chaque
  mutation ; `js/progress-sync.js` désérialise le stockage et fusionne.
- `js/api.js` est chargé sur toutes les pages ; quand le backend est injoignable,
  le site fonctionne exactement comme avant (localStorage seule).

## Tests
`node server/server.js`, puis appeler les endpoints listés ci-dessus avec curl
ou le client `js/api.js`. Un script e2e est disponible dans ce dossier.
