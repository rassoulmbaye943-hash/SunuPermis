# SunuPermis — améliorations du 24/09/2026

- Navigation mobile : attributs ARIA et état du menu améliorés.
- Ajout d’un lien « Aller au contenu principal » et d’un style focus plus visible.
- Support de `prefers-reduced-motion`.
- Progression : calcul du jour selon l’heure locale plutôt que UTC.
- Quiz : gestion propre d’une catégorie vide et boutons plus accessibles.
- Examen blanc : protection contre une double finalisation et retour propre au sélecteur.
- PWA : version du cache Service Worker incrémentée pour éviter les anciennes ressources.

## Limites conservées

Le backend, l’authentification et les paiements restent des démonstrations et ne sont pas présentés comme prêts pour la production. Les contenus réglementaires marqués « à confirmer » doivent être vérifiés auprès des sources sénégalaises compétentes avant publication.

## 2026-09-25 — Signalisation du dernier PDF fourni
- Suppression de l'ancienne banque d'images de panneaux.
- Extraction et découpe individuelle de tous les visuels uniques du dernier PDF fourni.
- 199 visuels conservés après suppression des doublons dus aux captures défilantes.
- Les images sont stockées dans `assets/panneaux/pdf-001.png` à `pdf-181.png`.
- `PANNEAUX` utilise exclusivement ces 199 visuels et leurs pages/sections du PDF comme métadonnées.
- Ajout du filtre « Arrêt / stationnement ».
- Mise à jour des illustrations du quiz pour supprimer les anciens chemins d'images.

## Correctifs V5.1 — 26 septembre 2026
- Bibliothèque de panneaux dédoublonnée : 181 images initiales ramenées à 172 panneaux visuellement uniques.
- Les occurrences identiques des pages 1–4, 5–8 et 9–12 ont été regroupées dans une seule fiche avec conservation des pages sources.
- Suppression des fichiers images dupliqués correspondants.
- Vidéothèque corrigée : les cartes n'utilisent plus de liens `youtube.com/watch` ni de redirection vers YouTube.
- Lecture via lecteur YouTube intégré `youtube-nocookie.com/embed/...` dans une fenêtre SunuPermis.
- Correction de l'initialisation du lecteur/modal qui pouvait être appelée avant que le modal existe dans le DOM.
- Aucun `window.open`, `location.href`, `youtu.be` ou lien `youtube.com/watch` restant dans la page Vidéothèque et sa banque de vidéos.

- Ajout de 4 panneaux de passage à niveau issus du nouveau PDF fourni le 26/09/2026 (PDF-182 à PDF-185), avec découpes dédiées et fiches pédagogiques.
