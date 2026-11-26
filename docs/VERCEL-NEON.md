# SunuPermis : Vercel, Neon et Gemini

## Préparation locale réalisée

Le projet exporte son API Express à travers un handler Vercel catch-all. En production, l’API exige `DATABASE_URL` et utilise PostgreSQL ; en développement local sans URL de base, elle conserve le repository JSON. Le handler refuse explicitement la requête si `DATABASE_URL` manque. Le fichier `server/data/schema.sql` n’est pas exécuté au démarrage : il s’applique uniquement avec `npm run db:migrate`.

La configuration Vercel inclut dans la fonction les fichiers lus dynamiquement (`js/data-*.js` et `server/data/raoul-knowledge.md`), et écarte les données locales du bundle. Le fichier `.vercelignore` exclut aussi les bases JSON et leurs sauvegardes, les fichiers d’environnement, les clés et les artefacts de développement de l’ensemble du déploiement, afin qu’ils ne soient pas servis comme fichiers statiques [7]. Aucune donnée locale de test n’est importée. `GEMINI_API_KEY` reste vide et n’a pas été saisie ; le modèle par défaut est `gemini-3.8-flash`, identifiant stable indiqué par Google au 26 novembre 2026 [5].

## À faire plus tard, après autorisation

1. Dans le projet Vercel qui sert `sunupermis.vercel.app`, examiner l’intégration Neon et son plan avant toute création. L’intégration gérée par Vercel crée un projet Neon et injecte notamment `DATABASE_URL` (connexion poolée) ; elle peut également fournir `DATABASE_URL_UNPOOLED` pour les opérations directes [4]. Vérifier les coûts et les environnements sélectionnés avant de confirmer la création ou la connexion.
2. Après création/connexion autorisée, appliquer le schéma avec `npm run db:migrate`. Le script utilise `DATABASE_URL_UNPOOLED` lorsqu’elle est disponible, sinon `DATABASE_URL`. Cette migration crée les tables et index du schéma ; elle ne copie pas `db.json` et ne migre aucun compte ou donnée de test.
3. Ajouter `GEMINI_API_KEY` comme variable d’environnement sensible dans Vercel, sans la placer dans Git ni dans le JavaScript du navigateur. Le modèle se règle avec `GEMINI_MODEL` ; la valeur par défaut préparée est `gemini-3.8-flash` [5].
4. Déployer seulement après validation. Les changements de variables Vercel ne s’appliquent pas aux déploiements existants : un nouveau déploiement est nécessaire [6]. Puis vérifier `/api/health`, `/api/questions` et `/api/raoul` selon les variables configurées.

Vercel exécute une application Express comme une fonction et ses fonctions ont un système de fichiers en lecture seule, hormis un espace temporaire non persistant ; c’est pourquoi le stockage JSON ne doit pas servir en production [1] [3]. Les fichiers utilisés par chemin calculé doivent être explicitement inclus dans `vercel.json` [2].

## Région choisie et plan Neon

Neon propose notamment Frankfurt (`aws-eu-central-1`) et London (`aws-eu-west-2`) en Europe. La région est fixée à la création d’un projet et ne peut pas être modifiée ensuite [8]. Vercel exécute par défaut ses Functions dans `iad1` (Washington, D.C.). Le plan Hobby permet de sélectionner une seule région; `lhr1` correspond à London et `fra1` à Frankfurt [10] [11]. L’utilisateur a confirmé London pour Neon (`aws-eu-west-2`) et l’API Vercel (`lhr1`); cette région est maintenant inscrite dans `vercel.json` pour la fonction API. Le projet Neon lui-même n’a pas encore été créé et aucune migration n’a été lancée.

Le plan Neon Free coûte actuellement 0 $/mois. Il inclut notamment 100 CU-heures de calcul par projet et par mois, 1 Go de stockage Postgres par projet (20 Go cumulés par compte) et 5 Go de transfert réseau public par projet et par mois. En cas de dépassement, le calcul ou les écritures sont suspendus jusqu’au renouvellement du quota ou à une mise à niveau; le dépassement du plan gratuit ne déclenche pas à lui seul une facturation automatique [9]. Toute mise à niveau payante reste exclue sans nouvelle autorisation.

Lors de la vérification du dépôt public, `main` affichait le commit `c6a3dd9` et le README indiquait encore que les données sont stockées dans `server/data/db.json` [12]. La préparation PostgreSQL/Vercel locale décrite ici n’a pas encore été poussée sur GitHub. La page GitHub observée n’était pas connectée à une session authentifiée; aucune écriture distante n’a été effectuée.

## Références

[1]: https://vercel.com/docs/frameworks/backend/express "Express sur Vercel"
[2]: https://vercel.com/docs/project-configuration/vercel-json "Configuration vercel.json et includeFiles"
[3]: https://vercel.com/docs/functions/runtimes "Runtimes et système de fichiers des fonctions"
[4]: https://neon.com/docs/guides/vercel-managed-integration "Intégration Neon gérée par Vercel"
[8]: https://neon.com/docs/introduction/regions "Régions Neon"
[9]: https://neon.com/docs/introduction/plans "Plans et quotas Neon"
[10]: https://vercel.com/docs/regions "Régions Vercel"
[11]: https://vercel.com/docs/functions/configuring-functions/region "Configuration de la région des Vercel Functions"
[12]: https://github.com/rassoulmbaye943-hash/SunuPermis "Dépôt GitHub SunuPermis"
[5]: https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash "Modèle Gemini 3.8 Flash"
[6]: https://vercel.com/docs/environment-variables/managing-environment-variables "Gestion des variables d’environnement Vercel"
[7]: https://vercel.com/docs/deployments/vercel-ignore "Exclusion de fichiers des déploiements Vercel"
