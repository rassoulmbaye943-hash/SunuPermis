# SunuPermis

Plateforme pédagogique consacrée au code de la route sénégalais. Le dépôt contient le site statique, les ressources pédagogiques, une API Express et des tests autonomes.

## Prérequis et installation

- Node.js 18 ou supérieur
- npm

```bash
npm install
cp .env.example .env
```

Configure ensuite les variables dans `.env` :

- `JWT_SECRET` : secret aléatoire d’au moins 32 caractères.
- `ADMIN_EMAIL` et `ADMIN_PASSWORD` : identifiants du compte administrateur initial.
- `GEMINI_API_KEY` : facultative, nécessaire à l’assistant Raoul.
- `CORS_ORIGINS` : domaines autorisés, séparés par des virgules.

Ne publie jamais `.env`, une clé API ou les données contenues dans `server/data/`.

## Lancer le site et l’API

```bash
npm start
```

Le serveur écoute sur `http://localhost:3000`, sert le site et expose les routes `/api`. Le premier compte administrateur est créé lors de sa première connexion réussie à `/api/admin/login`, avec les identifiants définis dans `.env`.

Pour le développement avec redémarrage automatique :

```bash
npm run dev
```

Les données sont stockées dans `server/data/db.json` (créé au premier enregistrement). Le stockage JSON est adapté au développement et à un petit déploiement, mais pas à une forte charge concurrente.

## Vérification

```bash
npm run check
npm test
```

`npm run check` vérifie la syntaxe JavaScript du dépôt. `npm test` exécute une suite d’intégration isolée sur un port temporaire et une base temporaire ; elle ne nécessite ni serveur déjà lancé, ni compte ou données de l’utilisateur.

## Sécurité et production

- Les mots de passe sont hachés avec bcrypt et les jetons JWT expirent.
- L’adresse configurée dans `ADMIN_EMAIL` est réservée et ne peut pas être inscrite par le formulaire public.
- Les permissions sont relues depuis le repository à chaque requête protégée : suppression ou rétrogradation d’un compte révoque aussi ses anciens jetons.
- Les origines CORS et les limites de requêtes sont configurables côté serveur.
- Utilise HTTPS, une base de données robuste, des sauvegardes et un gestionnaire de secrets pour une mise en production.

Le contenu pédagogique est informatif : les règles applicables doivent être vérifiées auprès des organismes compétents et d’une auto-école agréée.
