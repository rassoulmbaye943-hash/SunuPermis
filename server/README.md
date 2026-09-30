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
