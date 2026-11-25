# SunuPermis

Plateforme pédagogique consacrée au code de la route sénégalais. Le projet contient le site statique, les ressources pédagogiques et deux implémentations de serveur conservées pour compatibilité.

## Prérequis

- Node.js 18 ou supérieur
- npm

## Installation

```bash
npm install
cp .env.example .env
```

Avant de démarrer, ouvre `.env` et remplace les valeurs de démonstration :

- `JWT_SECRET` : secret aléatoire d'au moins 32 caractères (commande proposée dans `.env.example`).
- `ADMIN_PASSWORD` : mot de passe administrateur fort d'au moins 12 caractères.
- `GEMINI_API_KEY` : clé Gemini privée, facultative si tu n'utilises pas Raoul.
- `CORS_ORIGINS` : liste des domaines autorisés, séparés par des virgules.

Ne publie jamais `.env`, une clé API, `server/data/` ou un fichier `secret.key`.

## Démarrer le backend principal

```bash
npm start
```

Le serveur Express écoute sur `http://localhost:3000`, sert les pages du site et expose :

| Méthode | Route | Fonction |
|---|---|---|
| GET | `/api/health` | Vérifier que le serveur répond |
| POST | `/api/raoul` | Interroger l'assistant Raoul (clé côté serveur) |
| POST | `/api/inscriptions` | Enregistrer une demande d'inscription |
| GET | `/api/inscriptions` | Lister les demandes (admin) |
| PUT | `/api/inscriptions/:id` | Modifier le statut (admin) |
| POST | `/api/contact` | Envoyer un message |
| GET | `/api/contact` | Lire les messages (admin) |
| POST | `/api/admin/login` | Connexion administrateur |

Les données de ces formulaires sont stockées dans `server/data/db.json`, créé automatiquement au premier enregistrement.

## Vérification du code

```bash
npm run check
```

Cette commande vérifie la syntaxe de tous les fichiers JavaScript du projet.

## Serveur historique des comptes et de la progression

Le fichier `server/server.js` contient une autre API Node.js native, conservée pour les fonctions de comptes, profils, progression, quiz et administration pédagogique (`/api/users`, `/api/me`, `/api/progress`, etc.). Elle n'est pas le point d'entrée de `npm start`.

Pour la lancer séparément sur le port 4000 :

```bash
npm run start:legacy
```

Ne lance pas les deux serveurs sur le même port. Les deux API n'utilisent pas le même schéma de données ; une unification complète des comptes, des inscriptions et de l'administration reste à faire avant un déploiement public.

## Sécurité

- Les secrets sont lus depuis `.env`, jamais depuis le frontend.
- Les valeurs de démonstration ne sont plus utilisées comme secrets par défaut.
- Les routes d'administration vérifient un JWT signé en HS256 et un rôle administrateur.
- Les requêtes publiques sont limitées par adresse IP.
- Les origines CORS sont configurées explicitement.
- Les fichiers du dossier `server/` ne sont pas servis par le serveur statique.

Pour une mise en production, utilise HTTPS, une vraie base de données, des sauvegardes et un gestionnaire de secrets. Le stockage JSON convient à un petit projet local, pas à une forte charge multi-utilisateur.
