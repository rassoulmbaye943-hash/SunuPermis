/* ===================================================================
   SunuPermis — banque de contenu de démonstration.
   Les règles marquées "verified:true" s'appuient sur la Loi n°2002-30
   portant Code de la route du Sénégal et son décret d'application
   n°2004-13 du 19 janvier 2004. Les règles marquées "verified:false"
   sont des pratiques usuelles à FAIRE CONFIRMER auprès de l'ANASER, de
   la Direction des Transports Terrestres ou d'une auto-école agréée.
   IMPORTANT : un nouveau Code de la route est en préparation au Sénégal
   (permis à points, vidéo-verbalisation), avec une entrée en vigueur
   visée pour le premier semestre 2026 selon les déclarations du
   ministère des Transports terrestres et aériens. Les règles décrites
   ici pourront donc évoluer.
   =================================================================== */

var SOURCES = [
  {id:'loi-2002-30', label:'Loi n°2002-30 du 24 décembre 2002 portant Code de la route (partie législative)'},
  {id:'decret-2004', label:'Décret n°2004-13 du 19 janvier 2004 fixant les règles d’application de la Loi n°2002-30 (partie réglementaire)'},
  {id:'anaser', label:'Agence Nationale de la Sécurité Routière (ANASER) — communications publiques'},
  {id:'senegal-services', label:'Portail officiel senegalservices.sn — démarches du permis de conduire'},
  {id:'convention-vienne', label:'Cadre international de la Convention de Vienne sur la signalisation routière (1968), dont s’inspirent de nombreux pays francophones — référence de forme générale, ne remplace pas une confirmation locale pour le Sénégal'},
  {id:'reforme-2026', label:'Annonce gouvernementale (ministère des Transports terrestres et aériens, 2026) d’un nouveau Code de la route sénégalais — permis à points, vidéo-verbalisation — visant une entrée en vigueur au premier semestre 2026'},
  {id:'senboutique', label:'Sen Boutique Sécurité — fournisseur sénégalais de panneaux de signalisation routière physiques livrés au Sénégal (catalogue commercial, preuve d’usage local réel — pas un texte de loi)'},
  {id:'temoignage-local', label:'Signalé par un utilisateur du site résidant au Sénégal, qui rapporte observer ce panneau régulièrement sur place — témoignage individuel non vérifié de façon indépendante'},
  {id:'pdf-signaux-routiers', label:'PDF détaillé de signalisation fourni par l’utilisateur — source des 172 panneaux uniques et de leurs significations dans cette bibliothèque'},
  {id:'pdf-passage-niveau-2026-09-26', label:'Nouveau PDF de 4 pages fourni le 26 septembre 2026 — source des 4 panneaux supplémentaires de passage à niveau'}
];

/* -------------------- PANNEAUX -------------------- */
var PANNEAUX = [
    {
      "id": "pdf001",
      "code": "PDF-001",
      "image": "assets/panneaux/pdf-001.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Sortie d'autoroute.",
      "signif": "Sortie d'autoroute.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement du PDF fourni — même visuel présent aux pages 1, 2, 3, 4. Les doublons visuels ont été regroupés.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 1,
      "pages": [
        1,
        2,
        3,
        4
      ]
    },
    {
      "id": "pdf005",
      "code": "PDF-005",
      "image": "assets/panneaux/pdf-005.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Entrée d'autoroute.",
      "signif": "Entrée d'autoroute.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement du PDF fourni — même visuel présent aux pages 5, 6, 7, 8. Les doublons visuels ont été regroupés.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 5,
      "pages": [
        5,
        6,
        7,
        8
      ]
    },
    {
      "id": "pdf009",
      "code": "PDF-009",
      "image": "assets/panneaux/pdf-009.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Fin de voie verte.",
      "signif": "Fin de voie verte.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement du PDF fourni — même visuel présent aux pages 9, 10, 11, 12. Les doublons visuels ont été regroupés.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 9,
      "pages": [
        9,
        10,
        11,
        12
      ]
    },
    {
      "id": "pdf013",
      "code": "PDF-013",
      "image": "assets/panneaux/pdf-013.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Voie verte.",
      "signif": "Voie verte.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 13 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 13,
      "pages": [
        13
      ]
    },
    {
      "id": "pdf014",
      "code": "PDF-014",
      "image": "assets/panneaux/pdf-014.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "MS Fin d'une piste ou d'une bande cyclable conseillée et réservée aux cycles (vélos) à deux ou trois roues.",
      "signif": "MS Fin d'une piste ou d'une bande cyclable conseillée et réservée aux cycles (vélos) à deux ou trois roues.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 14 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 14,
      "pages": [
        14
      ]
    },
    {
      "id": "pdf015",
      "code": "PDF-015",
      "image": "assets/panneaux/pdf-015.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Piste ou bande cyclable conseillée et réservée aux cycles (vélos) à deux ou trois roues.",
      "signif": "Piste ou bande cyclable conseillée et réservée aux cycles (vélos) à deux ou trois roues.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 15 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 15,
      "pages": [
        15
      ]
    },
    {
      "id": "pdf016",
      "code": "PDF-016",
      "image": "assets/panneaux/pdf-016.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "KL p Aire piétonne.",
      "signif": "KL p Aire piétonne.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 16 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 16,
      "pages": [
        16
      ]
    },
    {
      "id": "pdf017",
      "code": "PDF-017",
      "image": "assets/panneaux/pdf-017.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Fin d'aire piétonne.",
      "signif": "Fin d'aire piétonne.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 17 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 17,
      "pages": [
        17
      ]
    },
    {
      "id": "pdf018",
      "code": "PDF-018",
      "image": "assets/panneaux/pdf-018.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Sortie de tunnel.",
      "signif": "Sortie de tunnel.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 18 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 18,
      "pages": [
        18
      ]
    },
    {
      "id": "pdf019",
      "code": "PDF-019",
      "image": "assets/panneaux/pdf-019.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Entrée d'un tunnel où il est interdit de faire demi-tour, de s'arrêter et de stationner en dehors des emplacements d'arrêt d'urgence prévus à cet effet, et où l'allumage des feux de croisement est obligatoire.",
      "signif": "Entrée d'un tunnel où il est interdit de faire demi-tour, de s'arrêter et de stationner en dehors des emplacements d'arrêt d'urgence prévus à cet effet, et où l'allumage des feux de croisement est obligatoire.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 19 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 19,
      "pages": [
        19
      ]
    },
    {
      "id": "pdf020",
      "code": "PDF-020",
      "image": "assets/panneaux/pdf-020.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Route à accès réglementé.",
      "signif": "Route à accès réglementé.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 20 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 20,
      "pages": [
        20
      ]
    },
    {
      "id": "pdf021",
      "code": "PDF-021",
      "image": "assets/panneaux/pdf-021.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "v Fin de route à accès réglementé.",
      "signif": "v Fin de route à accès réglementé.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 21 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 21,
      "pages": [
        21
      ]
    },
    {
      "id": "pdf022",
      "code": "PDF-022",
      "image": "assets/panneaux/pdf-022.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Paiement par abonnement.",
      "signif": "Paiement par abonnement.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 22 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 22,
      "pages": [
        22
      ]
    },
    {
      "id": "pdf023",
      "code": "PDF-023",
      "image": "assets/panneaux/pdf-023.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Paiement automatique par carte bancaire ou accréditive.",
      "signif": "Paiement automatique par carte bancaire ou accréditive.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 23 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 23,
      "pages": [
        23
      ]
    },
    {
      "id": "pdf024",
      "code": "PDF-024",
      "image": "assets/panneaux/pdf-024.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Paiement automatique par pièces et billets.",
      "signif": "Paiement automatique par pièces et billets.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 24 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 24,
      "pages": [
        24
      ]
    },
    {
      "id": "pdf025",
      "code": "PDF-025",
      "image": "assets/panneaux/pdf-025.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Paiement auprès d’un péagiste.",
      "signif": "Paiement auprès d’un péagiste.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 25 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 25,
      "pages": [
        25
      ]
    },
    {
      "id": "pdf026",
      "code": "PDF-026",
      "image": "assets/panneaux/pdf-026.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "présignalisation du paiement du péage.",
      "signif": "présignalisation du paiement du péage.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 26 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 26,
      "pages": [
        26
      ]
    },
    {
      "id": "pdf027",
      "code": "PDF-027",
      "image": "assets/panneaux/pdf-027.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Section à péage 1500 m Présignalisation du début d'une section à péage.",
      "signif": "Section à péage 1500 m Présignalisation du début d'une section à péage.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 27 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 27,
      "pages": [
        27
      ]
    },
    {
      "id": "pdf028",
      "code": "PDF-028",
      "image": "assets/panneaux/pdf-028.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Section de route à 3 voies affectées.",
      "signif": "Section de route à 3 voies affectées.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 28 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 28,
      "pages": [
        28
      ]
    },
    {
      "id": "pdf029",
      "code": "PDF-029",
      "image": "assets/panneaux/pdf-029.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Fin d'un créneau de dépassement à trois voies affectées.",
      "signif": "Fin d'un créneau de dépassement à trois voies affectées.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 29 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 29,
      "pages": [
        29
      ]
    },
    {
      "id": "pdf030",
      "code": "PDF-030",
      "image": "assets/panneaux/pdf-030.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Créneau de dépassement à 3 voies affectées.",
      "signif": "Créneau de dépassement à 3 voies affectées.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 30 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 30,
      "pages": [
        30
      ]
    },
    {
      "id": "pdf031",
      "code": "PDF-031",
      "image": "assets/panneaux/pdf-031.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Présignalisation d'un créneau de dépassement ou d'une section de route à chaussées séparées.",
      "signif": "Présignalisation d'un créneau de dépassement ou d'une section de route à chaussées séparées.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 31 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 31,
      "pages": [
        31
      ]
    },
    {
      "id": "pdf032",
      "code": "PDF-032",
      "image": "assets/panneaux/pdf-032.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Réduction du nombre de voies sur une route à chaussées séparées.",
      "signif": "Réduction du nombre de voies sur une route à chaussées séparées.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 32 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 32,
      "pages": [
        32
      ]
    },
    {
      "id": "pdf033",
      "code": "PDF-033",
      "image": "assets/panneaux/pdf-033.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Rappel des limites de vitesse sur autoroute.",
      "signif": "Rappel des limites de vitesse sur autoroute.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 33 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 33,
      "pages": [
        33
      ]
    },
    {
      "id": "pdf034",
      "code": "PDF-034",
      "image": "assets/panneaux/pdf-034.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Voie de détresse à droite.",
      "signif": "Voie de détresse à droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 34 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 34,
      "pages": [
        34
      ]
    },
    {
      "id": "pdf035",
      "code": "PDF-035",
      "image": "assets/panneaux/pdf-035.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "La voie de droite est réservée aux usagers qui tournent à droite.",
      "signif": "La voie de droite est réservée aux usagers qui tournent à droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 35 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 35,
      "pages": [
        35
      ]
    },
    {
      "id": "pdf036",
      "code": "PDF-036",
      "image": "assets/panneaux/pdf-036.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Conditions particulières de circulation sur la route ou la voie transversale.",
      "signif": "Conditions particulières de circulation sur la route ou la voie transversale.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 36 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 36,
      "pages": [
        36
      ]
    },
    {
      "id": "pdf037",
      "code": "PDF-037",
      "image": "assets/panneaux/pdf-037.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Surélévation de la chaussée (ralentisseur).",
      "signif": "Surélévation de la chaussée (ralentisseur).",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 37 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 37,
      "pages": [
        37
      ]
    },
    {
      "id": "pdf038",
      "code": "PDF-038",
      "image": "assets/panneaux/pdf-038.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "La voie de circulation en sens inverse est réservée aux autobus.",
      "signif": "La voie de circulation en sens inverse est réservée aux autobus.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 38 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 38,
      "pages": [
        38
      ]
    },
    {
      "id": "pdf039",
      "code": "PDF-039",
      "image": "assets/panneaux/pdf-039.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "K Passage pour piétons.",
      "signif": "K Passage pour piétons.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 39 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 39,
      "pages": [
        39
      ]
    },
    {
      "id": "pdf040",
      "code": "PDF-040",
      "image": "assets/panneaux/pdf-040.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Présignalisation d'une impasse.",
      "signif": "Présignalisation d'une impasse.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 40 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 40,
      "pages": [
        40
      ]
    },
    {
      "id": "pdf041",
      "code": "PDF-041",
      "image": "assets/panneaux/pdf-041.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Impasse comportant une issue pour les piétons et les cyclistes.",
      "signif": "Impasse comportant une issue pour les piétons et les cyclistes.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 41 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 41,
      "pages": [
        41
      ]
    },
    {
      "id": "pdf042",
      "code": "PDF-042",
      "image": "assets/panneaux/pdf-042.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Priorité par rapport à la circulation venant en sens inverse.",
      "signif": "Priorité par rapport à la circulation venant en sens inverse.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 42 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 42,
      "pages": [
        42
      ]
    },
    {
      "id": "pdf043",
      "code": "PDF-043",
      "image": "assets/panneaux/pdf-043.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Impasse.",
      "signif": "Impasse.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 43 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 43,
      "pages": [
        43
      ]
    },
    {
      "id": "pdf044",
      "code": "PDF-044",
      "image": "assets/panneaux/pdf-044.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Circulation à sens unique.",
      "signif": "Circulation à sens unique.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 44 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 44,
      "pages": [
        44
      ]
    },
    {
      "id": "pdf045",
      "code": "PDF-045",
      "image": "assets/panneaux/pdf-045.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Impasse comportant une issue pour les piétons.",
      "signif": "Impasse comportant une issue pour les piétons.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 45 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 45,
      "pages": [
        45
      ]
    },
    {
      "id": "pdf046",
      "code": "PDF-046",
      "image": "assets/panneaux/pdf-046.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Era Arrêt d'autobus.",
      "signif": "Era Arrêt d'autobus.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 46 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 46,
      "pages": [
        46
      ]
    },
    {
      "id": "pdf047",
      "code": "PDF-047",
      "image": "assets/panneaux/pdf-047.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Emplacement d'arrêt d'urgence.",
      "signif": "Emplacement d'arrêt d'urgence.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 47 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 47,
      "pages": [
        47
      ]
    },
    {
      "id": "pdf048",
      "code": "PDF-048",
      "image": "assets/panneaux/pdf-048.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Fin de vitesse conseillée.",
      "signif": "Fin de vitesse conseillée.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 48 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 48,
      "pages": [
        48
      ]
    },
    {
      "id": "pdf049",
      "code": "PDF-049",
      "image": "assets/panneaux/pdf-049.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "TAXIS Station de taxis.",
      "signif": "TAXIS Station de taxis.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 49 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 49,
      "pages": [
        49
      ]
    },
    {
      "id": "pdf050",
      "code": "PDF-050",
      "image": "assets/panneaux/pdf-050.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Vitesse conseillée.",
      "signif": "Vitesse conseillée.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 50 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 50,
      "pages": [
        50
      ]
    },
    {
      "id": "pdf051",
      "code": "PDF-051",
      "image": "assets/panneaux/pdf-051.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Attention au feu",
      "signif": "Attention au feu — risque d’incendie.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 51 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 51,
      "pages": [
        51
      ]
    },
    {
      "id": "pdf052",
      "code": "PDF-052",
      "image": "assets/panneaux/pdf-052.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Lieu aménagé pour le stationnement payant.",
      "signif": "Lieu aménagé pour le stationnement payant.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 52 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 52,
      "pages": [
        52
      ]
    },
    {
      "id": "pdf053",
      "code": "PDF-053",
      "image": "assets/panneaux/pdf-053.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Lieu aménagé pour le stationnement gratuit à durée limitée avec contrôle par disque.",
      "signif": "Lieu aménagé pour le stationnement gratuit à durée limitée avec contrôle par disque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 53 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 53,
      "pages": [
        53
      ]
    },
    {
      "id": "pdf054",
      "code": "PDF-054",
      "image": "assets/panneaux/pdf-054.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Station d'autopartage.",
      "signif": "Station d'autopartage.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 54 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 54,
      "pages": [
        54
      ]
    },
    {
      "id": "pdf055",
      "code": "PDF-055",
      "image": "assets/panneaux/pdf-055.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Lieu aménagé pour le stationnement gratuit à durée limitée à 1h30, avec contrôle par disque.",
      "signif": "Lieu aménagé pour le stationnement gratuit à durée limitée à 1h30, avec contrôle par disque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 55 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 55,
      "pages": [
        55
      ]
    },
    {
      "id": "pdf056",
      "code": "PDF-056",
      "image": "assets/panneaux/pdf-056.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Fin de l’obligation d’allumage des feux.",
      "signif": "Fin de l’obligation d’allumage des feux.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 56 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 56,
      "pages": [
        56
      ]
    },
    {
      "id": "pdf057",
      "code": "PDF-057",
      "image": "assets/panneaux/pdf-057.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Obligation d’allumage des feux.",
      "signif": "Obligation d’allumage des feux.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 57 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 57,
      "pages": [
        57
      ]
    },
    {
      "id": "pdf058",
      "code": "PDF-058",
      "image": "assets/panneaux/pdf-058.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Lieu aménagé pour le stationnement.",
      "signif": "Lieu aménagé pour le stationnement.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 58 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 58,
      "pages": [
        58
      ]
    },
    {
      "id": "pdf059",
      "code": "PDF-059",
      "image": "assets/panneaux/pdf-059.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Fur Voie réservée aux véhicules des services réguliers de transport en commun (autobus...).",
      "signif": "Fur Voie réservée aux véhicules des services réguliers de transport en commun (autobus...).",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 59 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 59,
      "pages": [
        59
      ]
    },
    {
      "id": "pdf060",
      "code": "PDF-060",
      "image": "assets/panneaux/pdf-060.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Fin de vitesse minimale obligatoire.",
      "signif": "Fin de vitesse minimale obligatoire.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 60 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 60,
      "pages": [
        60
      ]
    },
    {
      "id": "pdf061",
      "code": "PDF-061",
      "image": "assets/panneaux/pdf-061.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Vitesse minimale obligatoire.",
      "signif": "Vitesse minimale obligatoire.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 61 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 61,
      "pages": [
        61
      ]
    },
    {
      "id": "pdf062",
      "code": "PDF-062",
      "image": "assets/panneaux/pdf-062.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Fin de voie réservée aux véhicules des services réguliers de transport en commun (autobus...).",
      "signif": "Fin de voie réservée aux véhicules des services réguliers de transport en commun (autobus...).",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 62 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 62,
      "pages": [
        62
      ]
    },
    {
      "id": "pdf063",
      "code": "PDF-063",
      "image": "assets/panneaux/pdf-063.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Fin de chemin obligatoire pour cavaliers.",
      "signif": "Fin de chemin obligatoire pour cavaliers.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 63 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 63,
      "pages": [
        63
      ]
    },
    {
      "id": "pdf064",
      "code": "PDF-064",
      "image": "assets/panneaux/pdf-064.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Chemin obligatoire pour cavaliers.",
      "signif": "Chemin obligatoire pour cavaliers.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 64 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 64,
      "pages": [
        64
      ]
    },
    {
      "id": "pdf065",
      "code": "PDF-065",
      "image": "assets/panneaux/pdf-065.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Chemin obligatoire pour piétons.",
      "signif": "Chemin obligatoire pour piétons.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 65 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 65,
      "pages": [
        65
      ]
    },
    {
      "id": "pdf066",
      "code": "PDF-066",
      "image": "assets/panneaux/pdf-066.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Fin de chemin obligatoire pour piétons.",
      "signif": "Fin de chemin obligatoire pour piétons.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 66 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 66,
      "pages": [
        66
      ]
    },
    {
      "id": "pdf067",
      "code": "PDF-067",
      "image": "assets/panneaux/pdf-067.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Fin de piste ou bande obligatoire pour cycles (vélos) sans side-car ou remorque.",
      "signif": "Fin de piste ou bande obligatoire pour cycles (vélos) sans side-car ou remorque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 67 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 67,
      "pages": [
        67
      ]
    },
    {
      "id": "pdf068",
      "code": "PDF-068",
      "image": "assets/panneaux/pdf-068.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Piste ou bande obligatoire pour les cycles (vélos) sans side-car ou remorque.",
      "signif": "Piste ou bande obligatoire pour les cycles (vélos) sans side-car ou remorque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 68 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 68,
      "pages": [
        68
      ]
    },
    {
      "id": "pdf069",
      "code": "PDF-069",
      "image": "assets/panneaux/pdf-069.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Directions obligatoires à la prochaine intersection : à droite ou à gauche.",
      "signif": "Directions obligatoires à la prochaine intersection : à droite ou à gauche.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 69 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 69,
      "pages": [
        69
      ]
    },
    {
      "id": "pdf070",
      "code": "PDF-070",
      "image": "assets/panneaux/pdf-070.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Directions obligatoires à la prochaine intersection : tout droit ou à gauche.",
      "signif": "Directions obligatoires à la prochaine intersection : tout droit ou à gauche.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 70 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 70,
      "pages": [
        70
      ]
    },
    {
      "id": "pdf071",
      "code": "PDF-071",
      "image": "assets/panneaux/pdf-071.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Directions obligatoires à la prochaine intersection : tout droit ou à droite.",
      "signif": "Directions obligatoires à la prochaine intersection : tout droit ou à droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 71 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 71,
      "pages": [
        71
      ]
    },
    {
      "id": "pdf072",
      "code": "PDF-072",
      "image": "assets/panneaux/pdf-072.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Direction obligatoire à la prochaine intersection : à gauche.",
      "signif": "Direction obligatoire à la prochaine intersection : à gauche.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 72 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 72,
      "pages": [
        72
      ]
    },
    {
      "id": "pdf073",
      "code": "PDF-073",
      "image": "assets/panneaux/pdf-073.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Direction obligatoire à la prochaine intersection : à droite.",
      "signif": "Direction obligatoire à la prochaine intersection : à droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 73 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 73,
      "pages": [
        73
      ]
    },
    {
      "id": "pdf074",
      "code": "PDF-074",
      "image": "assets/panneaux/pdf-074.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Direction obligatoire à la prochaine intersection : tout droit.",
      "signif": "Direction obligatoire à la prochaine intersection : tout droit.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 74 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 74,
      "pages": [
        74
      ]
    },
    {
      "id": "pdf075",
      "code": "PDF-075",
      "image": "assets/panneaux/pdf-075.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Contournement obligatoire par la gauche.",
      "signif": "Contournement obligatoire par la gauche.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 75 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 75,
      "pages": [
        75
      ]
    },
    {
      "id": "pdf076",
      "code": "PDF-076",
      "image": "assets/panneaux/pdf-076.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Obligation de tourner à gauche avant le panneau.",
      "signif": "Obligation de tourner à gauche avant le panneau.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 76 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 76,
      "pages": [
        76
      ]
    },
    {
      "id": "pdf077",
      "code": "PDF-077",
      "image": "assets/panneaux/pdf-077.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Obligation de tourner à droite avant le panneau.",
      "signif": "Obligation de tourner à droite avant le panneau.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 77 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 77,
      "pages": [
        77
      ]
    },
    {
      "id": "pdf078",
      "code": "PDF-078",
      "image": "assets/panneaux/pdf-078.png",
      "cat": "obligation",
      "forme": "image-pdf",
      "nom": "Contournement obligatoire par la droite.",
      "signif": "Contournement obligatoire par la droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 78 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 78,
      "pages": [
        78
      ]
    },
    {
      "id": "pdf079",
      "code": "PDF-079",
      "image": "assets/panneaux/pdf-079.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Entrée d’une zone à stationnement unilatéral à alternance semi-mensuelle et à durée limitée, avec contrôle par disque.",
      "signif": "Entrée d’une zone à stationnement unilatéral à alternance semi-mensuelle et à durée limitée, avec contrôle par disque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 79 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 79,
      "pages": [
        79
      ]
    },
    {
      "id": "pdf080",
      "code": "PDF-080",
      "image": "assets/panneaux/pdf-080.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Sortie de zone à stationnement unilatéral à alternance semi-mensuelle et à durée limitée, avec contrôle par disque.",
      "signif": "Sortie de zone à stationnement unilatéral à alternance semi-mensuelle et à durée limitée, avec contrôle par disque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 80 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 80,
      "pages": [
        80
      ]
    },
    {
      "id": "pdf081",
      "code": "PDF-081",
      "image": "assets/panneaux/pdf-081.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Entrée d’une zone à stationnement unilatéral à alternance semi-mensuelle et à durée limitée à 1h30, avec contrôle par disque.",
      "signif": "Entrée d’une zone à stationnement unilatéral à alternance semi-mensuelle et à durée limitée à 1h30, avec contrôle par disque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 81 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 81,
      "pages": [
        81
      ]
    },
    {
      "id": "pdf082",
      "code": "PDF-082",
      "image": "assets/panneaux/pdf-082.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Sortie de zone à stationnement payant.",
      "signif": "Sortie de zone à stationnement payant.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 82 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 82,
      "pages": [
        82
      ]
    },
    {
      "id": "pdf083",
      "code": "PDF-083",
      "image": "assets/panneaux/pdf-083.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Sortie de zone à stationnement unilatéral à alternance semi-mensuelle et à durée limitée à 1h30 avec contrôle par disque.",
      "signif": "Sortie de zone à stationnement unilatéral à alternance semi-mensuelle et à durée limitée à 1h30 avec contrôle par disque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 83 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 83,
      "pages": [
        83
      ]
    },
    {
      "id": "pdf084",
      "code": "PDF-084",
      "image": "assets/panneaux/pdf-084.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Sortie de zone à stationnement de durée limitée avec contrôle par disque.",
      "signif": "Sortie de zone à stationnement de durée limitée avec contrôle par disque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 84 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 84,
      "pages": [
        84
      ]
    },
    {
      "id": "pdf085",
      "code": "PDF-085",
      "image": "assets/panneaux/pdf-085.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Entrée d’une zone à stationnement de durée limitée avec contrôle par disque (zone bleue).",
      "signif": "Entrée d’une zone à stationnement de durée limitée avec contrôle par disque (zone bleue).",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 85 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 85,
      "pages": [
        85
      ]
    },
    {
      "id": "pdf086",
      "code": "PDF-086",
      "image": "assets/panneaux/pdf-086.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Entrée d’une zone à stationnement payant.",
      "signif": "Entrée d’une zone à stationnement payant.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 86 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 86,
      "pages": [
        86
      ]
    },
    {
      "id": "pdf087",
      "code": "PDF-087",
      "image": "assets/panneaux/pdf-087.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Entrée d’une zone à stationnement de durée limitée à 1h30 avec contrôle par disque (zone bleue).",
      "signif": "Entrée d’une zone à stationnement de durée limitée à 1h30 avec contrôle par disque (zone bleue).",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 87 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 87,
      "pages": [
        87
      ]
    },
    {
      "id": "pdf088",
      "code": "PDF-088",
      "image": "assets/panneaux/pdf-088.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Sortie de zone à stationnement de durée limitée à 1h30 avec contrôle par disque.",
      "signif": "Sortie de zone à stationnement de durée limitée à 1h30 avec contrôle par disque.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 88 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 88,
      "pages": [
        88
      ]
    },
    {
      "id": "pdf089",
      "code": "PDF-089",
      "image": "assets/panneaux/pdf-089.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Entrée d’une zone à stationnement unilatéral à alternance semi-mensuelle.",
      "signif": "Entrée d’une zone à stationnement unilatéral à alternance semi-mensuelle.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 89 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 89,
      "pages": [
        89
      ]
    },
    {
      "id": "pdf090",
      "code": "PDF-090",
      "image": "assets/panneaux/pdf-090.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Sortie de zone à stationnement interdit.",
      "signif": "Sortie de zone à stationnement interdit.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 90 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 90,
      "pages": [
        90
      ]
    },
    {
      "id": "pdf091",
      "code": "PDF-091",
      "image": "assets/panneaux/pdf-091.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Sortie de zone à stationnement unilatéral à alternance semi-mensuelle.",
      "signif": "Sortie de zone à stationnement unilatéral à alternance semi-mensuelle.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 91 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 91,
      "pages": [
        91
      ]
    },
    {
      "id": "pdf092",
      "code": "PDF-092",
      "image": "assets/panneaux/pdf-092.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Stationnement interdit du 16 au dernier jour du mois.",
      "signif": "Stationnement interdit du 16 au dernier jour du mois.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 92 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 92,
      "pages": [
        92
      ]
    },
    {
      "id": "pdf093",
      "code": "PDF-093",
      "image": "assets/panneaux/pdf-093.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Stationnement interdit du 1er au 15 du mois.",
      "signif": "Stationnement interdit du 1er au 15 du mois.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 93 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 93,
      "pages": [
        93
      ]
    },
    {
      "id": "pdf094",
      "code": "PDF-094",
      "image": "assets/panneaux/pdf-094.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Arrêt et stationnement interdits.",
      "signif": "Arrêt et stationnement interdits.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 94 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 94,
      "pages": [
        94
      ]
    },
    {
      "id": "pdf095",
      "code": "PDF-095",
      "image": "assets/panneaux/pdf-095.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Entrée d’une zone à stationnement interdit.",
      "signif": "Entrée d’une zone à stationnement interdit.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 95 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 95,
      "pages": [
        95
      ]
    },
    {
      "id": "pdf096",
      "code": "PDF-096",
      "image": "assets/panneaux/pdf-096.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Fin de toutes les interdictions précédemment signalées, imposées aux véhicules en mouvement.",
      "signif": "Fin de toutes les interdictions précédemment signalées, imposées aux véhicules en mouvement.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 96 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 96,
      "pages": [
        96
      ]
    },
    {
      "id": "pdf097",
      "code": "PDF-097",
      "image": "assets/panneaux/pdf-097.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Fin d’interdiction de stationner.",
      "signif": "Fin d’interdiction de stationner.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 97 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 97,
      "pages": [
        97
      ]
    },
    {
      "id": "pdf098",
      "code": "PDF-098",
      "image": "assets/panneaux/pdf-098.png",
      "cat": "stationnement",
      "forme": "image-pdf",
      "nom": "Stationnement interdit.",
      "signif": "Stationnement interdit.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 98 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 98,
      "pages": [
        98
      ]
    },
    {
      "id": "pdf099",
      "code": "PDF-099",
      "image": "assets/panneaux/pdf-099.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Interdit aux troupeaux",
      "signif": "Interdit aux troupeaux — autre interdiction dont la nature est indiquée par une inscription sur le panneau.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 99 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 99,
      "pages": [
        99
      ]
    },
    {
      "id": "pdf100",
      "code": "PDF-100",
      "image": "assets/panneaux/pdf-100.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accèsinterdit aux véhicules transportant des marchandises dangereuses.",
      "signif": "Accèsinterdit aux véhicules transportant des marchandises dangereuses.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 100 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 100,
      "pages": [
        100
      ]
    },
    {
      "id": "pdf101",
      "code": "PDF-101",
      "image": "assets/panneaux/pdf-101.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accèsinterdit aux véhicules transportant des marchandises explosives ou facilement inflammables.",
      "signif": "Accèsinterdit aux véhicules transportant des marchandises explosives ou facilement inflammables.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 101 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 101,
      "pages": [
        101
      ]
    },
    {
      "id": "pdf102",
      "code": "PDF-102",
      "image": "assets/panneaux/pdf-102.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accèsinterdit aux véhicules transportant des marchandises susceptibles de polluer les eaux.",
      "signif": "Accèsinterdit aux véhicules transportant des marchandises susceptibles de polluer les eaux.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 102 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 102,
      "pages": [
        102
      ]
    },
    {
      "id": "pdf103",
      "code": "PDF-103",
      "image": "assets/panneaux/pdf-103.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Interdiction aux véhicules de circuler sans maintenir entre eux un intervalle au moins égal à 70 mètres.",
      "signif": "Interdiction aux véhicules de circuler sans maintenir entre eux un intervalle au moins égal à 70 mètres.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 103 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 103,
      "pages": [
        103
      ]
    },
    {
      "id": "pdf104",
      "code": "PDF-104",
      "image": "assets/panneaux/pdf-104.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Signaux sonores interdits.",
      "signif": "Signaux sonores interdits.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 104 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 104,
      "pages": [
        104
      ]
    },
    {
      "id": "pdf105",
      "code": "PDF-105",
      "image": "assets/panneaux/pdf-105.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Cédez le passage à la circulation venant en sens inverse.",
      "signif": "Cédez le passage à la circulation venant en sens inverse.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 105 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 105,
      "pages": [
        105
      ]
    },
    {
      "id": "pdf106",
      "code": "PDF-106",
      "image": "assets/panneaux/pdf-106.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Fin d'interdiction de l'usage de l'avertisseur sonore.",
      "signif": "Fin d'interdiction de l'usage de l'avertisseur sonore.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 106 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 106,
      "pages": [
        106
      ]
    },
    {
      "id": "pdf107",
      "code": "PDF-107",
      "image": "assets/panneaux/pdf-107.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Entrée d’une zone à vitesse limitée à 30 km/h.",
      "signif": "Entrée d’une zone à vitesse limitée à 30 km/h.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 107 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 107,
      "pages": [
        107
      ]
    },
    {
      "id": "pdf108",
      "code": "PDF-108",
      "image": "assets/panneaux/pdf-108.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Sortie d’une zone à vitesse limitée à 30 km/h.",
      "signif": "Sortie d’une zone à vitesse limitée à 30 km/h.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 108 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 108,
      "pages": [
        108
      ]
    },
    {
      "id": "pdf109",
      "code": "PDF-109",
      "image": "assets/panneaux/pdf-109.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules pesant plus de 3 tonnes sur un essieu.",
      "signif": "Accès interdit aux véhicules pesant plus de 3 tonnes sur un essieu.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 109 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 109,
      "pages": [
        109
      ]
    },
    {
      "id": "pdf110",
      "code": "PDF-110",
      "image": "assets/panneaux/pdf-110.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules dont la hauteur, chargement compris, est supérieure à 3,5 mètres.",
      "signif": "Accès interdit aux véhicules dont la hauteur, chargement compris, est supérieure à 3,5 mètres.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 110 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 110,
      "pages": [
        110
      ]
    },
    {
      "id": "pdf111",
      "code": "PDF-111",
      "image": "assets/panneaux/pdf-111.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules dont le poids total autorisé en charge ou le poids total roulant autorisé excède 5,5 tonnes.",
      "signif": "Accès interdit aux véhicules dont le poids total autorisé en charge ou le poids total roulant autorisé excède 5,5 tonnes.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 111 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 111,
      "pages": [
        111
      ]
    },
    {
      "id": "pdf112",
      "code": "PDF-112",
      "image": "assets/panneaux/pdf-112.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules dont la longueur est supérieure à 10 mètres.",
      "signif": "Accès interdit aux véhicules dont la longueur est supérieure à 10 mètres.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 112 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 112,
      "pages": [
        112
      ]
    },
    {
      "id": "pdf113",
      "code": "PDF-113",
      "image": "assets/panneaux/pdf-113.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules dont la largeur, chargement compris, est supérieure à 3,5 mètres.",
      "signif": "Accès interdit aux véhicules dont la largeur, chargement compris, est supérieure à 3,5 mètres.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 113 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 113,
      "pages": [
        113
      ]
    },
    {
      "id": "pdf114",
      "code": "PDF-114",
      "image": "assets/panneaux/pdf-114.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux motocyclettes et motocyclettes légères.",
      "signif": "Accès interdit aux motocyclettes et motocyclettes légères.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 114 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 114,
      "pages": [
        114
      ]
    },
    {
      "id": "pdf115",
      "code": "PDF-115",
      "image": "assets/panneaux/pdf-115.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules tractant une caravane ou une remorque de plus de 250 kg.",
      "signif": "Accès interdit aux véhicules tractant une caravane ou une remorque de plus de 250 kg.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 115 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 115,
      "pages": [
        115
      ]
    },
    {
      "id": "pdf116",
      "code": "PDF-116",
      "image": "assets/panneaux/pdf-116.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules de transport en commun de personnes.",
      "signif": "Accès interdit aux véhicules de transport en commun de personnes.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 116 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 116,
      "pages": [
        116
      ]
    },
    {
      "id": "pdf117",
      "code": "PDF-117",
      "image": "assets/panneaux/pdf-117.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux cyclomoteurs.",
      "signif": "Accès interdit aux cyclomoteurs.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 117 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 117,
      "pages": [
        117
      ]
    },
    {
      "id": "pdf118",
      "code": "PDF-118",
      "image": "assets/panneaux/pdf-118.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux voitures à bras.",
      "signif": "Accès interdit aux voitures à bras.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 118 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 118,
      "pages": [
        118
      ]
    },
    {
      "id": "pdf119",
      "code": "PDF-119",
      "image": "assets/panneaux/pdf-119.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules à traction animale.",
      "signif": "Accès interdit aux véhicules à traction animale.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 119 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 119,
      "pages": [
        119
      ]
    },
    {
      "id": "pdf120",
      "code": "PDF-120",
      "image": "assets/panneaux/pdf-120.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules agricoles à moteur.",
      "signif": "Accès interdit aux véhicules agricoles à moteur.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 120 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 120,
      "pages": [
        120
      ]
    },
    {
      "id": "pdf121",
      "code": "PDF-121",
      "image": "assets/panneaux/pdf-121.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux cyclistes.",
      "signif": "Accès interdit aux cyclistes.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 121 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 121,
      "pages": [
        121
      ]
    },
    {
      "id": "pdf122",
      "code": "PDF-122",
      "image": "assets/panneaux/pdf-122.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux piétons.",
      "signif": "Accès interdit aux piétons.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 122 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 122,
      "pages": [
        122
      ]
    },
    {
      "id": "pdf123",
      "code": "PDF-123",
      "image": "assets/panneaux/pdf-123.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules de transport de marchandises.",
      "signif": "Accès interdit aux véhicules de transport de marchandises.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 123 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 123,
      "pages": [
        123
      ]
    },
    {
      "id": "pdf124",
      "code": "PDF-124",
      "image": "assets/panneaux/pdf-124.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Limitation de vitesse.",
      "signif": "Limitation de vitesse.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 124 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 124,
      "pages": [
        124
      ]
    },
    {
      "id": "pdf125",
      "code": "PDF-125",
      "image": "assets/panneaux/pdf-125.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit à tous les véhicules à moteur.",
      "signif": "Accès interdit à tous les véhicules à moteur.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 125 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 125,
      "pages": [
        125
      ]
    },
    {
      "id": "pdf126",
      "code": "PDF-126",
      "image": "assets/panneaux/pdf-126.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Arrêt au poste de péage.",
      "signif": "Arrêt au poste de péage.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 126 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 126,
      "pages": [
        126
      ]
    },
    {
      "id": "pdf127",
      "code": "PDF-127",
      "image": "assets/panneaux/pdf-127.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Accès interdit aux véhicules à moteur à l’exception des cyclomoteurs.",
      "signif": "Accès interdit aux véhicules à moteur à l’exception des cyclomoteurs.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 127 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 127,
      "pages": [
        127
      ]
    },
    {
      "id": "pdf128",
      "code": "PDF-128",
      "image": "assets/panneaux/pdf-128.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Arrêt au poste de police.",
      "signif": "Arrêt au poste de police.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 128 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 128,
      "pages": [
        128
      ]
    },
    {
      "id": "pdf129",
      "code": "PDF-129",
      "image": "assets/panneaux/pdf-129.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Arrêt au poste de gendarmerie.",
      "signif": "Arrêt au poste de gendarmerie.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 129 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 129,
      "pages": [
        129
      ]
    },
    {
      "id": "pdf130",
      "code": "PDF-130",
      "image": "assets/panneaux/pdf-130.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Fin d’interdiction aux poids lourds de dépasser les véhicules à moteur autres que ceux à deux roues sans side-car.",
      "signif": "Fin d’interdiction aux poids lourds de dépasser les véhicules à moteur autres que ceux à deux roues sans side-car.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 130 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 130,
      "pages": [
        130
      ]
    },
    {
      "id": "pdf131",
      "code": "PDF-131",
      "image": "assets/panneaux/pdf-131.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Interdiction aux poids lourds de dépasser tous les véhicules à moteur autres que ceux à deux roues sans side-car.",
      "signif": "Interdiction aux poids lourds de dépasser tous les véhicules à moteur autres que ceux à deux roues sans side-car.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 131 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 131,
      "pages": [
        131
      ]
    },
    {
      "id": "pdf132",
      "code": "PDF-132",
      "image": "assets/panneaux/pdf-132.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Fin d’interdiction de dépasser les véhicules à moteur autres que ceux à deux roues sans side-car.",
      "signif": "Fin d’interdiction de dépasser les véhicules à moteur autres que ceux à deux roues sans side-car.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 132 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 132,
      "pages": [
        132
      ]
    },
    {
      "id": "pdf133",
      "code": "PDF-133",
      "image": "assets/panneaux/pdf-133.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Interdiction de dépasser tous les véhicules à moteur autres que ceux à deux roues sans side-car.",
      "signif": "Interdiction de dépasser tous les véhicules à moteur autres que ceux à deux roues sans side-car.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 133 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 133,
      "pages": [
        133
      ]
    },
    {
      "id": "pdf134",
      "code": "PDF-134",
      "image": "assets/panneaux/pdf-134.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Interdiction de faire demi-tour sur la route suivie jusqu’à la prochaine intersection incluse.",
      "signif": "Interdiction de faire demi-tour sur la route suivie jusqu’à la prochaine intersection incluse.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 134 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 134,
      "pages": [
        134
      ]
    },
    {
      "id": "pdf135",
      "code": "PDF-135",
      "image": "assets/panneaux/pdf-135.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Interdiction de tourner à droite à la prochaine intersection.",
      "signif": "Interdiction de tourner à droite à la prochaine intersection.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 135 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 135,
      "pages": [
        135
      ]
    },
    {
      "id": "pdf136",
      "code": "PDF-136",
      "image": "assets/panneaux/pdf-136.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Interdiction de tourner à gauche à la prochaine intersection.",
      "signif": "Interdiction de tourner à gauche à la prochaine intersection.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 136 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 136,
      "pages": [
        136
      ]
    },
    {
      "id": "pdf137",
      "code": "PDF-137",
      "image": "assets/panneaux/pdf-137.png",
      "cat": "interdiction",
      "forme": "image-pdf",
      "nom": "Sens interdit à tout véhicule.",
      "signif": "Sens interdit à tout véhicule.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 137 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 137,
      "pages": [
        137
      ]
    },
    {
      "id": "pdf138",
      "code": "PDF-138",
      "image": "assets/panneaux/pdf-138.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Autorise un cycliste à franchir le feu pour aller tout droit.",
      "signif": "Autorise un cycliste à franchir le feu pour aller tout droit.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 138 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 138,
      "pages": [
        138
      ]
    },
    {
      "id": "pdf139",
      "code": "PDF-139",
      "image": "assets/panneaux/pdf-139.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Circulation interdite à tout véhicule dans les deux sens.",
      "signif": "Circulation interdite à tout véhicule dans les deux sens.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 139 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 139,
      "pages": [
        139
      ]
    },
    {
      "id": "pdf140",
      "code": "PDF-140",
      "image": "assets/panneaux/pdf-140.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Carrefour à sens giratoire.",
      "signif": "Carrefour à sens giratoire.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 140 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 140,
      "pages": [
        140
      ]
    },
    {
      "id": "pdf141",
      "code": "PDF-141",
      "image": "assets/panneaux/pdf-141.png",
      "cat": "indication",
      "forme": "image-pdf",
      "nom": "Autorise un cycliste à franchir le feu pour s’engager à droite.",
      "signif": "Autorise un cycliste à franchir le feu pour s’engager à droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 141 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 141,
      "pages": [
        141
      ]
    },
    {
      "id": "pdf142",
      "code": "PDF-142",
      "image": "assets/panneaux/pdf-142.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Annonce d’un STOP à 150 m.",
      "signif": "Annonce d’un STOP à 150 m.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 142 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 142,
      "pages": [
        142
      ]
    },
    {
      "id": "pdf143",
      "code": "PDF-143",
      "image": "assets/panneaux/pdf-143.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Cédez le passage à l’intersection",
      "signif": "Cédez le passage à l’intersection — signal de position.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 143 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 143,
      "pages": [
        143
      ]
    },
    {
      "id": "pdf144",
      "code": "PDF-144",
      "image": "assets/panneaux/pdf-144.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Annonce d’un cédez-le-passage à 150 m.",
      "signif": "Annonce d’un cédez-le-passage à 150 m.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 144 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 144,
      "pages": [
        144
      ]
    },
    {
      "id": "pdf145",
      "code": "PDF-145",
      "image": "assets/panneaux/pdf-145.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "STOP",
      "signif": "STOP — signal de position.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 145 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 145,
      "pages": [
        145
      ]
    },
    {
      "id": "pdf146",
      "code": "PDF-146",
      "image": "assets/panneaux/pdf-146.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Indication du caractère prioritaire d’une route.",
      "signif": "Indication du caractère prioritaire d’une route.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 146 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 146,
      "pages": [
        146
      ]
    },
    {
      "id": "pdf147",
      "code": "PDF-147",
      "image": "assets/panneaux/pdf-147.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Intersection avec une route dont les usagers doivent me céder le passage.",
      "signif": "Intersection avec une route dont les usagers doivent me céder le passage.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 147 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 147,
      "pages": [
        147
      ]
    },
    {
      "id": "pdf148",
      "code": "PDF-148",
      "image": "assets/panneaux/pdf-148.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Fin du caractère prioritaire d’une route.",
      "signif": "Fin du caractère prioritaire d’une route.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 148 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 148,
      "pages": [
        148
      ]
    },
    {
      "id": "pdf149",
      "code": "PDF-149",
      "image": "assets/panneaux/pdf-149.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Signalisation de position d’un passage à niveau à une seule voie sans barrières ni demi-barrières.",
      "signif": "Signalisation de position d’un passage à niveau à une seule voie sans barrières ni demi-barrières.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 149 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 149,
      "pages": [
        149
      ]
    },
    {
      "id": "pdf150",
      "code": "PDF-150",
      "image": "assets/panneaux/pdf-150.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Intersection où je suis tenu de céder le passage aux véhicules venant de droite.",
      "signif": "Intersection où je suis tenu de céder le passage aux véhicules venant de droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 150 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 150,
      "pages": [
        150
      ]
    },
    {
      "id": "pdf151",
      "code": "PDF-151",
      "image": "assets/panneaux/pdf-151.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "La voie ferrée que je vais traverser sera électrifiée.",
      "signif": "La voie ferrée que je vais traverser sera électrifiée.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 151 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 151,
      "pages": [
        151
      ]
    },
    {
      "id": "pdf152",
      "code": "PDF-152",
      "image": "assets/panneaux/pdf-152.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Passage à niveau muni de demi-barrières à fonctionnement automatique lors du passage des trains.",
      "signif": "Passage à niveau muni de demi-barrières à fonctionnement automatique lors du passage des trains.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 152 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 152,
      "pages": [
        152
      ]
    },
    {
      "id": "pdf153",
      "code": "PDF-153",
      "image": "assets/panneaux/pdf-153.png",
      "cat": "priorite",
      "forme": "image-pdf",
      "nom": "Passage à niveau sans barrières ni demi-barrières.",
      "signif": "Passage à niveau sans barrières ni demi-barrières.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 153 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 153,
      "pages": [
        153
      ]
    },
    {
      "id": "pdf154",
      "code": "PDF-154",
      "image": "assets/panneaux/pdf-154.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Traversée d’une aire de danger aérien.",
      "signif": "Traversée d’une aire de danger aérien.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 154 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 154,
      "pages": [
        154
      ]
    },
    {
      "id": "pdf155",
      "code": "PDF-155",
      "image": "assets/panneaux/pdf-155.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Débouché de cyclistes venant de droite ou de gauche.",
      "signif": "Débouché de cyclistes venant de droite ou de gauche.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 155 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 155,
      "pages": [
        155
      ]
    },
    {
      "id": "pdf156",
      "code": "PDF-156",
      "image": "assets/panneaux/pdf-156.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Passage à niveau muni de barrières à fonctionnement manuel lors du passage des trains.",
      "signif": "Passage à niveau muni de barrières à fonctionnement manuel lors du passage des trains.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 156 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 156,
      "pages": [
        156
      ]
    },
    {
      "id": "pdf157",
      "code": "PDF-157",
      "image": "assets/panneaux/pdf-157.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Passage d’animaux sauvages.",
      "signif": "Passage d’animaux sauvages.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 157 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 157,
      "pages": [
        157
      ]
    },
    {
      "id": "pdf158",
      "code": "PDF-158",
      "image": "assets/panneaux/pdf-158.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Passage de cavaliers.",
      "signif": "Passage de cavaliers.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 158 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 158,
      "pages": [
        158
      ]
    },
    {
      "id": "pdf159",
      "code": "PDF-159",
      "image": "assets/panneaux/pdf-159.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Passage d’animaux domestiques.",
      "signif": "Passage d’animaux domestiques.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 159 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 159,
      "pages": [
        159
      ]
    },
    {
      "id": "pdf160",
      "code": "PDF-160",
      "image": "assets/panneaux/pdf-160.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Passage pour piétons.",
      "signif": "Passage pour piétons.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 160 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 160,
      "pages": [
        160
      ]
    },
    {
      "id": "pdf161",
      "code": "PDF-161",
      "image": "assets/panneaux/pdf-161.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Endroit fréquenté par les enfants.",
      "signif": "Endroit fréquenté par les enfants.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 161 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 161,
      "pages": [
        161
      ]
    },
    {
      "id": "pdf162",
      "code": "PDF-162",
      "image": "assets/panneaux/pdf-162.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Passage d’animaux domestiques.",
      "signif": "Passage d’animaux domestiques.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 162 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 162,
      "pages": [
        162
      ]
    },
    {
      "id": "pdf163",
      "code": "PDF-163",
      "image": "assets/panneaux/pdf-163.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Manche à air.",
      "signif": "Manche à air.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 163 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 163,
      "pages": [
        163
      ]
    },
    {
      "id": "pdf164",
      "code": "PDF-164",
      "image": "assets/panneaux/pdf-164.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Vent latéral.",
      "signif": "Vent latéral.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 164 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 164,
      "pages": [
        164
      ]
    },
    {
      "id": "pdf165",
      "code": "PDF-165",
      "image": "assets/panneaux/pdf-165.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Annonce de feux tricolores.",
      "signif": "Annonce de feux tricolores.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 165 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 165,
      "pages": [
        165
      ]
    },
    {
      "id": "pdf166",
      "code": "PDF-166",
      "image": "assets/panneaux/pdf-166.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Pont mobile.",
      "signif": "Pont mobile.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 166 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 166,
      "pages": [
        166
      ]
    },
    {
      "id": "pdf167",
      "code": "PDF-167",
      "image": "assets/panneaux/pdf-167.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Circulation dans les deux sens.",
      "signif": "Circulation dans les deux sens.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 167 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 167,
      "pages": [
        167
      ]
    },
    {
      "id": "pdf168",
      "code": "PDF-168",
      "image": "assets/panneaux/pdf-168.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Risque de chute de pierres ou de présence sur la route de pierres tombées.",
      "signif": "Risque de chute de pierres ou de présence sur la route de pierres tombées.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 168 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 168,
      "pages": [
        168
      ]
    },
    {
      "id": "pdf169",
      "code": "PDF-169",
      "image": "assets/panneaux/pdf-169.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Descente dangereuse.",
      "signif": "Descente dangereuse.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 169 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 169,
      "pages": [
        169
      ]
    },
    {
      "id": "pdf170",
      "code": "PDF-170",
      "image": "assets/panneaux/pdf-170.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Ralentisseur de type dos-d’âne.",
      "signif": "Ralentisseur de type dos-d’âne.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 170 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 170,
      "pages": [
        170
      ]
    },
    {
      "id": "pdf171",
      "code": "PDF-171",
      "image": "assets/panneaux/pdf-171.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Cassis ou dos-d’âne.",
      "signif": "Cassis ou dos-d’âne.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 171 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 171,
      "pages": [
        171
      ]
    },
    {
      "id": "pdf172",
      "code": "PDF-172",
      "image": "assets/panneaux/pdf-172.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Chaussée particulièrement glissante.",
      "signif": "Chaussée particulièrement glissante.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 172 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 172,
      "pages": [
        172
      ]
    },
    {
      "id": "pdf173",
      "code": "PDF-173",
      "image": "assets/panneaux/pdf-173.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Débouché sur un quai ou une berge.",
      "signif": "Débouché sur un quai ou une berge.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 173 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 173,
      "pages": [
        173
      ]
    },
    {
      "id": "pdf174",
      "code": "PDF-174",
      "image": "assets/panneaux/pdf-174.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Chaussée rétrécie par la droite.",
      "signif": "Chaussée rétrécie par la droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 174 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 174,
      "pages": [
        174
      ]
    },
    {
      "id": "pdf175",
      "code": "PDF-175",
      "image": "assets/panneaux/pdf-175.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Chaussée rétrécie.",
      "signif": "Chaussée rétrécie.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 175 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 175,
      "pages": [
        175
      ]
    },
    {
      "id": "pdf176",
      "code": "PDF-176",
      "image": "assets/panneaux/pdf-176.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Succession de virages dont le premier est à gauche.",
      "signif": "Succession de virages dont le premier est à gauche.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 176 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 176,
      "pages": [
        176
      ]
    },
    {
      "id": "pdf177",
      "code": "PDF-177",
      "image": "assets/panneaux/pdf-177.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Chaussée rétrécie par la gauche.",
      "signif": "Chaussée rétrécie par la gauche.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 177 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 177,
      "pages": [
        177
      ]
    },
    {
      "id": "pdf178",
      "code": "PDF-178",
      "image": "assets/panneaux/pdf-178.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Virage à gauche.",
      "signif": "Virage à gauche.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 178 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 178,
      "pages": [
        178
      ]
    },
    {
      "id": "pdf179",
      "code": "PDF-179",
      "image": "assets/panneaux/pdf-179.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Virage à droite.",
      "signif": "Virage à droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 179 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 179,
      "pages": [
        179
      ]
    },
    {
      "id": "pdf180",
      "code": "PDF-180",
      "image": "assets/panneaux/pdf-180.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Danger non précisé.",
      "signif": "Danger non précisé.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 180 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 180,
      "pages": [
        180
      ]
    },
    {
      "id": "pdf181",
      "code": "PDF-181",
      "image": "assets/panneaux/pdf-181.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Succession de virages dont le premier est à droite.",
      "signif": "Succession de virages dont le premier est à droite.",
      "comportement": "Respecter la consigne indiquée par le panneau et adapter sa conduite en conséquence.",
      "exemple": "Panneau extrait directement de la page 181 du PDF fourni.",
      "erreur": "Ne pas remplacer la signification du panneau par une habitude locale : apprendre d’abord la consigne affichée.",
      "verified": false,
      "source": "pdf-signaux-routiers",
      "page": 181,
      "pages": [
        181
      ]
    },
    {
      "id": "pdf182",
      "code": "PDF-182",
      "image": "assets/panneaux/pdf-182.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Les demi-barrières à fonctionnement automatique sont fermées. Le feu rouge clignotant et la sonnerie fonctionnent.",
      "signif": "Les demi-barrières à fonctionnement automatique sont fermées. Le feu rouge clignotant et la sonnerie fonctionnent.",
      "comportement": "S’arrêter avant le passage à niveau et ne pas franchir les demi-barrières lorsque le feu rouge clignote et que la sonnerie fonctionne.",
      "exemple": "Panneau extrait directement de la page 1 du nouveau PDF fourni.",
      "erreur": "Ne pas franchir les demi-barrières ni s’engager lorsque le feu rouge clignote et que la sonnerie fonctionne.",
      "verified": false,
      "source": "pdf-passage-niveau-2026-09-26",
      "page": 1,
      "pages": [1]
    },
    {
      "id": "pdf183",
      "code": "PDF-183",
      "image": "assets/panneaux/pdf-183.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Balises d’annonce d’un passage à niveau.",
      "signif": "Balises d’annonce d’un passage à niveau.",
      "comportement": "Ralentir et rester particulièrement attentif à l’approche du passage à niveau annoncé.",
      "exemple": "Panneau extrait directement de la page 2 du nouveau PDF fourni.",
      "erreur": "Ne pas considérer ces balises comme une autorisation de franchir le passage sans contrôler la situation.",
      "verified": false,
      "source": "pdf-passage-niveau-2026-09-26",
      "page": 2,
      "pages": [2]
    },
    {
      "id": "pdf184",
      "code": "PDF-184",
      "image": "assets/panneaux/pdf-184.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Signalisation de position d’un passage à niveau à plusieurs voies sans barrières ni demi-barrières.",
      "signif": "Signalisation de position d’un passage à niveau à plusieurs voies sans barrières ni demi-barrières.",
      "comportement": "Ralentir, observer attentivement le passage et vérifier qu’aucun train n’approche sur les différentes voies avant de traverser.",
      "exemple": "Panneau extrait directement de la page 3 du nouveau PDF fourni.",
      "erreur": "Ne pas regarder une seule voie puis s’engager immédiatement : plusieurs voies peuvent être concernées.",
      "verified": false,
      "source": "pdf-passage-niveau-2026-09-26",
      "page": 3,
      "pages": [3]
    },
    {
      "id": "pdf185",
      "code": "PDF-185",
      "image": "assets/panneaux/pdf-185.png",
      "cat": "danger",
      "forme": "image-pdf",
      "nom": "Signalisation de position d’un passage à niveau à une voie, muni d’une signalisation automatique lumineuse et sonore, sans barrières ni demi-barrières.",
      "signif": "Signalisation de position d’un passage à niveau à une voie, muni d’une signalisation automatique lumineuse et sonore, sans barrières ni demi-barrières.",
      "comportement": "Ralentir, observer la signalisation lumineuse et sonore et ne traverser que lorsque le franchissement est autorisé et sûr.",
      "exemple": "Panneau extrait directement de la page 4 du nouveau PDF fourni.",
      "erreur": "Ne pas franchir le passage si la signalisation automatique indique un danger ou interdit le passage.",
      "verified": false,
      "source": "pdf-passage-niveau-2026-09-26",
      "page": 4,
      "pages": [4]
    }

  ];

var GLOSSAIRE = [
  {terme:'ABS', def:'Système antiblocage des roues qui évite le blocage des freins lors d’un freinage appuyé, pour conserver la capacité à diriger le véhicule.'},
  {terme:'Angle mort', def:'Zone autour du véhicule non visible dans les rétroviseurs ni directement, où un autre usager peut se trouver sans être vu.'},
  {terme:'Aquaplanage', def:'Perte d’adhérence des pneus qui « flottent » sur une pellicule d’eau, faisant perdre le contrôle de la direction et du freinage.'},
  {terme:'Distance de sécurité', def:'Espace à maintenir avec le véhicule qui précède pour pouvoir s’arrêter sans le heurter en cas de freinage brusque.'},
  {terme:'Distance d’arrêt', def:'Somme de la distance parcourue pendant le temps de réaction et de la distance de freinage.'},
  {terme:'Embrayage', def:'Mécanisme qui permet de désaccoupler temporairement le moteur de la boîte de vitesses, notamment pour changer de rapport.'},
  {terme:'Frein moteur', def:'Ralentissement du véhicule obtenu en relâchant l’accélérateur sans débrayer, utile en descente.'},
  {terme:'Point de patinage', def:'Position de la pédale d’embrayage où celui-ci commence tout juste à transmettre la puissance du moteur aux roues.'},
  {terme:'Priorité à droite', def:'Règle par défaut selon laquelle, à une intersection non signalée, le véhicule arrivant de la droite doit être laissé passer.'},
  {terme:'Sous-virage', def:'Comportement du véhicule qui tend à aller tout droit dans un virage malgré la rotation du volant.'},
  {terme:'Survirage', def:'Comportement du véhicule dont l’arrière se déporte vers l’extérieur du virage, au-delà de la trajectoire voulue.'},
  {terme:'PTAC', def:'Poids Total Autorisé en Charge : masse maximale autorisée du véhicule chargé, utilisée pour définir les catégories de permis.'},
  {terme:'Voie de détresse', def:'Voie latérale en forte descente permettant d’arrêter un véhicule dont les freins ne répondent plus.'},
  {terme:'Cédez-le-passage', def:'Panneau ou marquage imposant de laisser la priorité aux véhicules circulant sur la voie abordée.'},
  {terme:'Giratoire', def:'Carrefour où la circulation s’effectue en anneau autour d’un îlot central, généralement avec priorité à l’anneau.'}
];

/* -------------------- VIDEOTHEQUE -------------------- */
var VIDEOS = [
  {id:'v1',cat:'Sécurité', titre:'Apprendre la sécurité routière avant de prendre le volant', duree:'4:24', niveau:'Débutant', desc:'Les réflexes essentiels avant de démarrer et pour protéger les autres usagers.', youtube:'pkzcjQ7_NaY', chaine:'SIKANA Français'},
  {id:'v2',cat:'Panneaux', titre:'Tous les panneaux du Code de la route à connaître', duree:'25:15', niveau:'Débutant', desc:'Présentation des panneaux de danger, de priorité, d’interdiction, d’obligation et d’indication.', youtube:'xN-GGwtQk3o', chaine:'Code en poche'},
  {id:'v3',cat:'Manœuvres', titre:'Les 6 manœuvres du jour de l’examen', duree:'4:05', niveau:'Intermédiaire', desc:'Tour d’horizon de la marche arrière, du demi-tour et des différents stationnements.', youtube:'BOanq0hYi-4', chaine:'Auto École Evry Village - Kris'},
  {id:'v4',cat:'Manœuvres', titre:'Réussir son créneau du premier coup', duree:'3:04', niveau:'Intermédiaire', desc:'Repères simples pour réaliser un créneau proprement et en sécurité.', youtube:'HMynZ9Dc-vU', chaine:'La Navette'},
  {id:'v5',cat:'Manœuvres', titre:'Faire un demi-tour en trois temps', duree:'2:11', niveau:'Intermédiaire', desc:'Méthode et précautions pour effectuer un demi-tour lorsque la situation le permet.', youtube:'BjIKjqJAfWQ', chaine:'La Navette'},
  {id:'v6',cat:'Manœuvres', titre:'Le stationnement en bataille', duree:'2:27', niveau:'Intermédiaire', desc:'Placement et contrôles à effectuer pour réussir un stationnement en bataille.', youtube:'Yqhh8WkZDtU', chaine:'La Navette'},
  {id:'v7',cat:'Manœuvres', titre:'Le rangement en épi en marche arrière', duree:'1:46', niveau:'Intermédiaire', desc:'Une démonstration courte du rangement en épi et des contrôles associés.', youtube:'OJbIBvgvs4g', chaine:'La Navette'},
  {id:'v8',cat:'Confiance au volant', titre:'Sept astuces pour avoir confiance au volant', duree:'4:31', niveau:'Débutant', desc:'Conseils pratiques pour réduire le stress et progresser avec davantage d’assurance.', youtube:'aMiGb-j0Fbg', chaine:'La Navette'},
  {id:'v9',cat:'Marche arrière', titre:'Réussir sa marche arrière', duree:'0:40', niveau:'Débutant', desc:'Rappel des contrôles et de la progression lente lors d’une marche arrière.', youtube:'cF3Jopfuank', chaine:'La Navette'},
  {id:'v10',cat:'Priorités', titre:'Priorité à droite : ce qui est attendu à l’examen', duree:'13:04', niveau:'Intermédiaire', desc:'Explications et situations pratiques pour mieux anticiper les priorités.', youtube:'pLOrgSMJbNA', chaine:'Alex Permis'},
  {id:'v11',cat:'Vérifications', titre:'Les vérifications du véhicule au permis', duree:'13:37', niveau:'Débutant', desc:'Les contrôles du véhicule et les questions fréquemment posées à l’examen.', youtube:'oIRb2rpppnw', chaine:'La Navette'}
];

/* -------------------- MANŒUVRES -------------------- */
var MANOEUVRES = [
  {id:'creneau', nom:'Créneau', desc:'Stationnement latéral entre deux véhicules, en marche arrière.',
    etapes:['Se positionner parallèlement au véhicule avant l’emplacement','Passer la marche arrière et braquer au bon repère','Redresser progressivement en surveillant l’arrière','Ajuster l’avant du véhicule'],
    erreurs:['Se garer trop loin du trottoir', 'Braquer trop tôt ou trop tard']},
  {id:'bataille', nom:'Stationnement en bataille', desc:'Stationnement perpendiculaire à la chaussée, très courant sur les parkings de marché.',
    etapes:['Repérer l’emplacement et ralentir', 'Braquer au moment adapté en avançant ou en reculant', 'Centrer le véhicule entre les lignes', 'Vérifier l’alignement final'],
    erreurs:['Empiéter sur l’emplacement voisin', 'Mal évaluer la largeur du véhicule']},
  {id:'epi', nom:'Stationnement en épi', desc:'Stationnement en biais, fréquent sur certaines avenues commerçantes.',
    etapes:['Suivre l’angle des places déjà marquées', 'Ralentir tôt avant de braquer', 'Ajuster la trajectoire en un seul mouvement si possible'],
    erreurs:['Aborder l’angle trop tard', 'Corriger plusieurs fois la trajectoire']},
  {id:'demi-tour', nom:'Demi-tour', desc:'Changement de direction à 180°, à n’effectuer que si la visibilité et la largeur le permettent.',
    etapes:['Vérifier la visibilité dans les deux sens', 'Signaler son intention', 'Effectuer la manœuvre en un minimum de mouvements', 'Redémarrer en sécurité'],
    erreurs:['Réaliser la manœuvre sur une route à circulation dense', 'Oublier de signaler']},
  {id:'marche-arriere', nom:'Marche arrière rectiligne', desc:'Reculer en ligne droite en gardant la maîtrise de la trajectoire.',
    etapes:['Se retourner ou utiliser les rétroviseurs', 'Avancer lentement en petites touches d’accélérateur', 'Corriger la trajectoire au volant en douceur'],
    erreurs:['Reculer trop vite', 'Ne regarder que dans le rétroviseur central']},
  {id:'cote', nom:'Démarrage en côte', desc:'Démarrer sans reculer sur une route en pente montante.',
    etapes:['Frein à main serré, pied sur le frein', 'Première vitesse engagée', 'Trouver le point de patinage', 'Relâcher le frein à main en accélérant légèrement'],
    erreurs:['Relâcher le frein à main trop tôt', 'Caler par manque d’accélération']}
];

/* -------------------- CARTE DU SÉNÉGAL : conseils par ville -------------------- */
var VILLES = [
  {id:'dakar', nom:'Dakar', x:70, y:150, conseil:'Circulation urbaine très dense, nombreux ronds-points et clandos (taxis collectifs) qui s’arrêtent brusquement. Anticiper les changements de voie soudains.', verified:false},
  {id:'rufisque', nom:'Rufisque', x:100, y:150, conseil:'Axe très fréquenté par les poids lourds entre Dakar et l’intérieur du pays ; redoubler de vigilance sur la route nationale.', verified:false},
  {id:'thies', nom:'Thiès', x:150, y:180, conseil:'Carrefour ferroviaire et routier majeur ; attention aux passages à niveau et à la traversée de charrettes.', verified:false},
  {id:'mbour', nom:'Mbour / Petite Côte', x:130, y:230, conseil:'Route sinueuse le long de la côte, forte présence touristique et traversées piétonnes à surveiller.', verified:false},
  {id:'saint-louis', nom:'Saint-Louis', x:110, y:40, conseil:'Ponts et rues étroites du centre historique ; priorité fréquente aux piétons dans le centre-ville.', verified:false},
  {id:'touba', nom:'Touba', x:200, y:130, conseil:'Affluence exceptionnelle lors du Grand Magal : prévoir des délais de circulation très allongés à ces périodes.', verified:false},
  {id:'kaolack', nom:'Kaolack', x:230, y:220, conseil:'Carrefour commercial avec forte présence de charrettes et de deux-roues aux abords du marché.', verified:false},
  {id:'ziguinchor', nom:'Ziguinchor', x:150, y:340, conseil:'Routes régionales parfois moins entretenues ; adapter sa vitesse à l’état de la chaussée.', verified:false}
];

/* -------------------- BANQUE DE QUESTIONS -------------------- */
/* Chaque question : theme, question, image(optionnelle, pointe vers un panneau id), reponses[], correct(index), explication, verified */
var QUIZ_BANK = [
  // Panneaux
  {theme:'panneaux', q:'Que signifie un panneau triangulaire à bordure rouge ?', rep:['Une obligation','Un danger à venir','Une interdiction','Une indication utile'], correct:1, exp:'La forme triangulaire à bordure rouge annonce un danger sur la chaussée.', verified:true, source:'decret-2004'},
  {theme:'panneaux', q:'Un panneau rond à fond bleu indique généralement…', rep:['Une interdiction','Une obligation','Un simple conseil','Une fin de zone'], correct:1, exp:'Les panneaux ronds à fond bleu imposent une obligation (direction, piste cyclable, etc.).', verified:true, source:'decret-2004'},
  {theme:'panneaux', q:'Un panneau rond à bordure rouge avec un symbole barré signifie…', rep:['Obligation','Danger','Interdiction','Priorité'], correct:2, exp:'Le cercle à bordure rouge exprime une interdiction.', verified:true, source:'loi-2002-30'},
  {theme:'panneaux', q:'Quelle est la forme du panneau STOP ?', rep:['Triangle','Cercle','Octogone','Losange'], correct:2, exp:'Le panneau STOP a une forme d’octogone unique, reconnaissable même de dos.', verified:true, source:'loi-2002-30'},
  {theme:'panneaux', q:'Un panneau annonçant une école signale surtout…', rep:['Un radar fixe','Un risque de traversée d’enfants','Une interdiction de circuler','Un péage'], correct:1, exp:'Ce panneau prévient d’un risque accru de traversée de jeunes enfants.', verified:false, source:null},
  {theme:'panneaux', q:'Le panneau « cédez le passage » a la forme…', rep:['D’un triangle pointe en haut','D’un triangle pointe en bas','D’un cercle','D’un rectangle'], correct:1, exp:'Le triangle inversé (pointe vers le bas) signale l’obligation de céder le passage.', verified:true, source:'loi-2002-30'},
  {theme:'panneaux', q:'Un panneau bleu rectangulaire indique en général…', rep:['Un danger imminent','Une information ou une indication utile','Une interdiction stricte','Une priorité absolue'], correct:1, exp:'Les panneaux rectangulaires bleus servent surtout à indiquer (parkings, passages piétons, services).', verified:false, source:null},

  // Priorités
  {theme:'priorites', q:'En l’absence de tout panneau, à une intersection, qui est prioritaire ?', rep:['Le véhicule le plus rapide','Le véhicule venant de la droite','Le plus gros véhicule','Celui qui klaxonne en premier'], correct:1, exp:'La priorité à droite s’applique par défaut si aucune signalisation ne l’écarte.', verified:true, source:'loi-2002-30'},
  {theme:'priorites', q:'Au panneau STOP, que faut-il faire ?', rep:['Ralentir fortement','S’arrêter complètement puis repartir si la voie est libre','S’arrêter uniquement s’il y a un véhicule visible','Klaxonner puis avancer'], correct:1, exp:'L’arrêt doit être total, même si la voie semble libre.', verified:true, source:'loi-2002-30'},
  {theme:'priorites', q:'Dans un giratoire (rond-point), qui est généralement prioritaire ?', rep:['Les véhicules qui entrent dans l’anneau','Les véhicules déjà engagés dans l’anneau','Les deux-roues uniquement','Aucune règle ne s’applique'], correct:1, exp:'Sauf signalisation différente, les véhicules déjà présents dans l’anneau ont la priorité sur ceux qui s’y engagent.', verified:false, source:null},
  {theme:'priorites', q:'Que faire face à un véhicule de police ou de pompiers en intervention (avertisseurs actionnés) ?', rep:['Accélérer pour libérer la voie plus vite','Se rabattre et faciliter son passage, au besoin en s’arrêtant','L’ignorer si l’on est déjà engagé','Le dépasser rapidement'], correct:1, exp:'Le conducteur doit céder immédiatement la priorité à ces véhicules et faciliter leur passage.', verified:true, source:'decret-2004'},
  {theme:'priorites', q:'À un passage à niveau sans barrière, que doit faire le conducteur ?', rep:['S’engager sans ralentir', 'S’assurer qu’aucun train n’approche avant de s’engager', 'Klaxonner puis avancer', 'Attendre systématiquement 5 minutes'], correct:1, exp:'L’usager doit s’assurer qu’il peut traverser en toute sécurité avant de s’engager.', verified:true, source:'decret-2004'},

  // Vitesse
  {theme:'vitesse', q:'Quelle est la vitesse maximale généralement autorisée en agglomération au Sénégal ?', rep:['30 km/h','50 km/h','70 km/h','90 km/h'], correct:1, exp:'Sauf indication contraire, la vitesse est limitée à 50 km/h en agglomération.', verified:true, source:'anaser'},
  {theme:'vitesse', q:'Hors agglomération, sur route nationale, la vitesse est généralement limitée à…', rep:['50 km/h','70 km/h','environ 90 km/h (selon signalisation)','150 km/h'], correct:2, exp:'Les sources s’accordent sur une limite autour de 90 km/h hors agglomération, la signalisation locale faisant foi.', verified:false, source:null},
  {theme:'vitesse', q:'Un conducteur doit adapter sa vitesse…', rep:['Uniquement selon la limite affichée','Selon la limite affichée ET les conditions de circulation/visibilité','Uniquement selon son ressenti','Selon la vitesse des autres véhicules'], correct:1, exp:'La vitesse doit toujours être adaptée aux conditions réelles, même en dessous de la limite affichée.', verified:true, source:'decret-2004'},
  {theme:'vitesse', q:'Aux abords d’une école signalée, il est recommandé de circuler…', rep:['À la vitesse normale d’agglomération','Très nettement ralenti (de l’ordre de 30 km/h)','Plus vite pour dégager la zone','Sans changement particulier'], correct:1, exp:'Une réduction de vitesse marquée est attendue aux abords des établissements scolaires.', verified:false, source:null},

  // Sécurité
  {theme:'securite', q:'La ceinture de sécurité à l’avant est…', rep:['Facultative en ville','Obligatoire','Recommandée seulement la nuit','Obligatoire uniquement sur autoroute'], correct:1, exp:'Le port de la ceinture est obligatoire pour les occupants des places avant.', verified:true, source:'anaser'},
  {theme:'securite', q:'L’usage du téléphone tenu en main au volant est…', rep:['Autorisé à faible vitesse','Interdit', 'Autorisé si la conversation est brève','Toléré en cas d’embouteillage'], correct:1, exp:'L’usage du téléphone sans kit mains-libres est interdit au volant.', verified:true, source:'anaser'},
  {theme:'securite', q:'Quel est le rôle de l’ABS ?', rep:['Augmenter la vitesse maximale','Éviter le blocage des roues au freinage','Réduire la consommation de carburant','Éclairer davantage la route'], correct:1, exp:'L’ABS empêche le blocage des roues pour conserver la maîtrise directionnelle en freinage d’urgence.', verified:false, source:null},
  {theme:'securite', q:'La distance de sécurité sert principalement à…', rep:['Faire plaisir au conducteur suivant','Pouvoir s’arrêter sans percuter le véhicule qui précède','Économiser du carburant','Éviter les contrôles radar'], correct:1, exp:'Elle garantit un espace suffisant pour s’arrêter en cas de freinage brusque du véhicule précédent.', verified:false, source:null},
  {theme:'securite', q:'Conduire sous l’emprise de l’alcool est…', rep:['Toléré en dessous d’un certain seuil non précisé par les textes courants','Totalement autorisé','Sans conséquence pénale','Recommandé d’éviter uniquement de nuit'], correct:0, exp:'La conduite en état d’ivresse est sanctionnée pénalement ; le seuil précis d’alcoolémie doit être confirmé auprès des autorités, les sources consultées ne le précisant pas clairement.', verified:false, source:null},

  // Dépassement
  {theme:'depassement', q:'Avant de dépasser, un conducteur doit notamment…', rep:['Klaxonner et dépasser immédiatement','Vérifier la visibilité, signaler et s’assurer qu’aucun véhicule n’arrive en face','Dépasser seulement de nuit','Accélérer sans vérifier les rétroviseurs'], correct:1, exp:'Le dépassement exige une visibilité suffisante et une vérification complète avant de s’engager.', verified:false, source:null},
  {theme:'depassement', q:'Le dépassement est interdit notamment…', rep:['Sur ligne droite dégagée','À l’approche d’un sommet de côte à visibilité réduite','Sur autoroute','Quand il n’y a aucun autre véhicule'], correct:1, exp:'La visibilité insuffisante, comme à l’approche d’un sommet de côte, interdit le dépassement.', verified:true, source:'decret-2004'},
  {theme:'depassement', q:'Peut-on dépasser un véhicule de secours en intervention (feux et avertisseurs actifs) ?', rep:['Oui, sans restriction','Non, le dépassement est interdit','Oui, uniquement de nuit','Oui, si on klaxonne avant'], correct:1, exp:'Il est interdit de dépasser les véhicules prioritaires en intervention circulant dans les mêmes conditions.', verified:true, source:'decret-2004'},

  // Stationnement
  {theme:'stationnement', q:'Hors agglomération, le stationnement sur la chaussée est…', rep:['Toujours autorisé','Interdit, sauf cas de force majeure','Autorisé la nuit uniquement','Autorisé si les warnings sont allumés'], correct:1, exp:'Le stationnement hors agglomération est interdit sauf force majeure ou impossibilité de se garer sur l’accotement.', verified:true, source:'decret-2004'},
  {theme:'stationnement', q:'En cas d’arrêt forcé hors agglomération, le conducteur doit…', rep:['Repartir dès que possible sans signaler', 'Signaler la position du véhicule (par exemple avec un triangle)', 'Laisser le véhicule sans aucune précaution', 'Appeler uniquement une dépanneuse'], correct:1, exp:'La position du véhicule immobilisé doit être signalée aux autres usagers.', verified:true, source:'decret-2004'},

  // Feux et marquage
  {theme:'feux', q:'Un feu orange fixe signifie…', rep:['Accélérer pour passer','S’arrêter, sauf si l’arrêt est impossible en sécurité','Continuer normalement','Céder uniquement aux piétons'], correct:1, exp:'Le feu orange impose l’arrêt, sauf si le véhicule est trop engagé pour s’arrêter en sécurité.', verified:false, source:null},
  {theme:'feux', q:'Une ligne continue au sol signifie…', rep:['On peut la franchir avec prudence','Le franchissement est interdit','Elle indique un stationnement autorisé','Elle n’a qu’un rôle décoratif'], correct:1, exp:'Une ligne continue ne doit pas être franchie, notamment pour dépasser.', verified:false, source:null},
  {theme:'feux', q:'Une ligne discontinue au sol signifie…', rep:['Franchissement interdit en toutes circonstances','Franchissement possible si la manœuvre est sûre','Voie réservée aux bus','Fin de chaussée'], correct:1, exp:'La ligne discontinue autorise le franchissement lorsque les conditions de sécurité sont réunies.', verified:false, source:null},

  // Comportement / permis
  {theme:'comportement', q:'Pour conduire un véhicule léger (catégorie B) au Sénégal, l’âge minimum est généralement de…', rep:['16 ans','18 ans','21 ans','25 ans'], correct:1, exp:'La catégorie B (véhicules légers) est accessible à partir de 18 ans selon les sources consultées.', verified:false, source:'senegal-services'},
  {theme:'comportement', q:'L’examen théorique du permis au Sénégal comporte généralement…', rep:['10 questions','25 questions','50 questions','100 questions'], correct:1, exp:'Selon les guides consultés, l’épreuve théorique compte usuellement 25 questions à choix multiples ; à confirmer auprès de l’auto-école.', verified:false, source:null},
  {theme:'comportement', q:'Conduire un véhicule sans être titulaire du permis correspondant à sa catégorie est…', rep:['Toléré pour un court trajet','Une infraction pénale', 'Autorisé pendant l’apprentissage sans restriction', 'Sans conséquence si aucun accident n’a lieu'], correct:1, exp:'La loi sanctionne pénalement la conduite sans permis valable pour la catégorie du véhicule utilisé.', verified:true, source:'loi-2002-30'},
  {theme:'comportement', q:'Un apprenti conducteur qui suit une formation encadrée…', rep:['Commet toujours une infraction','Bénéficie d’une exception prévue par la loi pendant l’apprentissage encadré','Doit déjà avoir un permis','N’a aucune existence légale'], correct:1, exp:'La loi prévoit une exception pour les personnes qui apprennent à conduire en se conformant à la réglementation applicable.', verified:true, source:'loi-2002-30'},

  // Panneaux (suite)
  {theme:'panneaux', q:'Un losange jaune signale généralement…', rep:['Une route à caractère prioritaire','Une interdiction de klaxonner','Un péage','Une aire de repos'], correct:0, exp:'Le losange jaune indique une route bénéficiant d’un statut prioritaire jusqu’au panneau de fin.', verified:false, source:null},
  {theme:'panneaux', q:'Un panneau signalant un virage dangereux impose surtout de…', rep:['Accélérer pour le négocier plus vite','Réduire sa vitesse avant d’aborder le virage','Klaxonner en continu','Changer de voie immédiatement'], correct:1, exp:'Il faut ralentir avant le virage, pas pendant.', verified:true, source:'decret-2004'},
  {theme:'panneaux', q:'Le panneau « chaussée déformée » prévient d’un risque de…', rep:['Radar automatique','Nids-de-poule ou irrégularités de la route','Verglas','Embouteillage permanent'], correct:1, exp:'Il annonce une chaussée irrégulière nécessitant prudence et adaptation de la vitesse.', verified:false, source:null},
  {theme:'panneaux', q:'Un panneau annonçant une traversée d’animaux invite à…', rep:['Ignorer le panneau en ville','Ralentir et rester prêt à s’arrêter','Accélérer pour dégager la zone','Klaxonner longuement sans ralentir'], correct:1, exp:'La prudence et la réduction de vitesse restent la meilleure réponse à ce risque.', verified:true, source:'decret-2004'},
  {theme:'panneaux', q:'Un panneau interdisant l’accès aux deux-roues concerne…', rep:['Uniquement les vélos','Motos et cyclomoteurs','Uniquement les poids lourds','Tous les véhicules sans exception'], correct:1, exp:'Ce panneau vise spécifiquement les deux-roues motorisés.', verified:false, source:null},

  // Priorités (suite)
  {theme:'priorites', q:'Un panneau « fin de priorité » signifie…', rep:['La priorité reprend plus loin','La route perd son statut prioritaire à partir de ce point','Il faut s’arrêter obligatoirement','Aucun véhicule ne peut plus passer'], correct:1, exp:'À partir de ce panneau, la route n’est plus prioritaire ; les règles habituelles (priorité à droite, etc.) s’appliquent de nouveau.', verified:false, source:null},
  {theme:'priorites', q:'À une intersection avec un feu tricolore fonctionnel, la priorité à droite…', rep:['S’applique quand même en priorité','Est remplacée par l’indication du feu','N’a jamais existé','S’applique uniquement la nuit'], correct:1, exp:'Le feu tricolore prime sur la règle générale de priorité à droite tant qu’il fonctionne.', verified:true, source:'decret-2004'},
  {theme:'priorites', q:'S’insérer sur une route depuis une bretelle impose de…', rep:['S’imposer car on est prioritaire','Céder le passage aux véhicules déjà engagés sur la voie principale','Klaxonner puis s’engager','S’arrêter systématiquement sur la bretelle'], correct:1, exp:'Le véhicule qui s’insère doit s’adapter au trafic déjà engagé sur la voie principale.', verified:false, source:null},

  // Vitesse (suite)
  {theme:'vitesse', q:'La vitesse doit toujours rester compatible avec…', rep:['La seule limite affichée','La limite affichée et la visibilité, l’état de la route et le trafic','La vitesse du véhicule qui précède uniquement','Le nombre de passagers à bord'], correct:1, exp:'La limite affichée est un plafond, pas un objectif ; la vitesse réelle doit rester adaptée aux conditions.', verified:true, source:'decret-2004'},
  {theme:'vitesse', q:'Circuler très en dessous de la vitesse autorisée sans raison peut…', rep:['Être totalement sans conséquence','Gêner la circulation et présenter un risque', 'Être toujours recommandé par sécurité','Être obligatoire en agglomération'], correct:1, exp:'Une vitesse anormalement basse sans justification peut elle aussi créer un danger pour la circulation.', verified:false, source:null},
  {theme:'vitesse', q:'Par mauvaise visibilité (pluie, poussière), il convient de…', rep:['Maintenir la vitesse autorisée','Réduire sa vitesse sous la limite affichée si nécessaire','Accélérer pour sortir plus vite de la zone','Rouler feux éteints pour économiser la batterie'], correct:1, exp:'La vitesse doit être réduite en dessous de la limite quand les conditions l’exigent.', verified:true, source:'decret-2004'},

  // Sécurité (suite)
  {theme:'securite', q:'Les enfants doivent voyager…', rep:['Sur les genoux d’un adulte à l’avant','Avec un dispositif de retenue adapté à leur âge/taille','Debout à l’arrière','Sans restriction particulière'], correct:1, exp:'Un dispositif adapté (siège auto, réhausseur) protège mieux les enfants qu’un maintien manuel.', verified:false, source:null},
  {theme:'securite', q:'Les feux de détresse (warnings) doivent être utilisés…', rep:['En permanence la nuit','En cas de danger ponctuel ou d’arrêt d’urgence','Pour indiquer un virage','Pour klaxonner à la place'], correct:1, exp:'Ils signalent un danger ou un arrêt inhabituel, pas un usage permanent.', verified:false, source:null},
  {theme:'securite', q:'La fatigue au volant augmente surtout le risque…', rep:['De consommer plus de carburant','D’endormissement et de temps de réaction allongé','De crevaison','De surchauffe moteur'], correct:1, exp:'La fatigue réduit la vigilance et allonge le temps de réaction, facteur majeur d’accidents.', verified:false, source:null},
  {theme:'securite', q:'Le triangle de présignalisation sert à…', rep:['Décorer le véhicule','Signaler un véhicule immobilisé aux autres usagers','Remplacer les feux de détresse','Indiquer un excès de vitesse'], correct:1, exp:'Il alerte les autres conducteurs de la présence d’un véhicule arrêté, notamment hors agglomération.', verified:false, source:null},

  // Dépassement (suite)
  {theme:'depassement', q:'Dépasser dans un virage sans visibilité est…', rep:['Autorisé si la route est large','Interdit', 'Autorisé de nuit uniquement','Autorisé pour les motos seulement'], correct:1, exp:'Le manque de visibilité dans un virage rend le dépassement interdit et dangereux.', verified:true, source:'decret-2004'},
  {theme:'depassement', q:'Après un dépassement, il faut…', rep:['Se rabattre dès que possible en sécurité','Rester sur la voie de dépassement indéfiniment','Accélérer encore plus fort','Freiner brusquement devant le véhicule dépassé'], correct:0, exp:'Se rabattre en sécurité dès que la distance avec le véhicule dépassé le permet.', verified:false, source:null},

  // Stationnement (suite)
  {theme:'stationnement', q:'Se garer devant une bouche d’incendie ou un accès de secours est…', rep:['Autorisé si c’est rapide','Interdit', 'Autorisé la nuit','Toléré en cas de forte affluence'], correct:1, exp:'Ces accès doivent rester libres pour les secours à tout moment.', verified:false, source:null},
  {theme:'stationnement', q:'Le stationnement gênant se caractérise par…', rep:['Un véhicule garé sur une place autorisée','Un véhicule qui empêche la circulation ou l’accès à un endroit','Un véhicule garé de nuit','Un véhicule avec les warnings allumés'], correct:1, exp:'C’est l’entrave à la circulation ou à un accès qui caractérise le stationnement gênant.', verified:false, source:null},

  // Feux et marquage (suite)
  {theme:'feux', q:'Un feu clignotant orange à une intersection signifie généralement…', rep:['Arrêt obligatoire strict comme un STOP','Passage autorisé avec prudence accrue','Sens interdit','Fin de route'], correct:1, exp:'Le clignotant orange invite à une vigilance renforcée plutôt qu’à un arrêt obligatoire de type STOP.', verified:false, source:null},
  {theme:'feux', q:'Une double ligne continue au sol signifie…', rep:['On peut doubler dans un sens','Franchissement interdit dans les deux sens','C’est une zone de stationnement','Cela n’a pas de signification particulière'], correct:1, exp:'La double ligne continue interdit le franchissement dans les deux sens de circulation.', verified:false, source:null},
  {theme:'feux', q:'Un marquage en damier (zébras) au sol indique…', rep:['Une zone à ne pas emprunter ni stationner','Une zone de stationnement gratuite','Un ralentisseur','Une piste cyclable'], correct:0, exp:'Ce marquage délimite une zone qui doit rester dégagée pour la fluidité et la sécurité de la circulation.', verified:false, source:null},

  // Comportement / permis (suite)
  {theme:'comportement', q:'Le renouvellement ou la validité du permis de conduire au Sénégal…', rep:['N’existe pas, le permis est à vie sans aucune démarche','Peut être soumis à des démarches administratives à vérifier','Doit être refait chaque année dans tous les cas','Est automatique sans aucune condition'], correct:1, exp:'Les modalités précises de validité/renouvellement doivent être vérifiées auprès de la Direction des Transports Terrestres.', verified:false, source:null},
  {theme:'comportement', q:'En cas d’accident matériel léger, un conducteur responsable devrait…', rep:['Quitter les lieux rapidement','S’arrêter, échanger les informations utiles et si besoin établir un constat','Ne rien faire','Négocier en espèces et repartir sans laisser de trace'], correct:1, exp:'S’arrêter et échanger les informations nécessaires est la base d’un comportement responsable après un accident.', verified:false, source:null},
  {theme:'comportement', q:'Le délit de fuite après un accident est…', rep:['Sans conséquence si personne n’est blessé','Une infraction pénalement sanctionnée','Toléré si le trafic est dense','Autorisé si le véhicule est assuré'], correct:1, exp:'Quitter les lieux d’un accident sans se faire connaître constitue une infraction sanctionnée par la loi.', verified:true, source:'loi-2002-30'},

  // Manœuvres (nouveau thème)
  {theme:'manoeuvres', q:'Avant d’effectuer un créneau, il faut notamment…', rep:['Vérifier ses angles morts et signaler son intention','Accélérer fortement dès le début','Couper le moteur','Ne regarder que devant soi'], correct:0, exp:'La vérification des angles morts et la signalisation de l’intention sont indispensables avant toute manœuvre.', verified:false, source:null},
  {theme:'manoeuvres', q:'Lors d’une marche arrière, le conducteur doit…', rep:['Se fier uniquement au rétroviseur central','Se retourner et/ou utiliser tous les rétroviseurs disponibles','Accélérer fort pour aller plus vite','Ne pas se soucier des piétons derrière'], correct:1, exp:'Une bonne visibilité arrière, via les rétroviseurs et en se retournant si besoin, est essentielle en marche arrière.', verified:false, source:null},
  {theme:'manoeuvres', q:'Le demi-tour doit être évité…', rep:['Sur une route large et dégagée','Sur une route à circulation dense ou à visibilité réduite','Sur un parking vide','Toujours, en toutes circonstances'], correct:1, exp:'Le demi-tour est risqué là où la visibilité est réduite ou la circulation dense.', verified:false, source:null},

  // Autoroute / voie rapide (nouveau thème)
  {theme:'autoroute', q:'Pour s’insérer sur une voie rapide, il faut utiliser…', rep:['La bande d’arrêt d’urgence','La voie d’accélération pour atteindre une vitesse adaptée','Le klaxon uniquement','Les feux de détresse en continu'], correct:1, exp:'La voie d’accélération permet de rejoindre la vitesse du trafic avant de s’insérer.', verified:false, source:null},
  {theme:'autoroute', q:'La bande d’arrêt d’urgence doit être utilisée…', rep:['Pour rouler plus vite que les autres','Uniquement en cas d’urgence réelle','Pour stationner et se reposer','Pour doubler par la droite'], correct:1, exp:'Elle est réservée aux situations d’urgence (panne, malaise, accident) et non à un usage courant.', verified:false, source:null},
  {theme:'autoroute', q:'Sur voie rapide, la distance de sécurité doit être…', rep:['Réduite car la route est dégagée','Augmentée en raison de la vitesse plus élevée','Sans importance','Identique quelle que soit la vitesse'], correct:1, exp:'Plus la vitesse est élevée, plus la distance de freinage augmente : il faut donc accroître la distance de sécurité.', verified:false, source:null},

  // Série complémentaire : lecture des panneaux et conduite défensive
  {theme:'panneaux', q:'Le panneau 5.09 « direction de la route principale » sert à…', rep:['Indiquer la direction suivie par la route prioritaire','Interdire de tourner à droite','Annoncer un poste de secours','Imposer une vitesse minimale'], correct:0, exp:'La plaque montre la direction de la route principale à suivre dans le carrefour.', verified:false, source:'pdf-signaux-routiers'},
  {theme:'panneaux', q:'Un panneau rond bleu avec une flèche blanche vers la droite indique…', rep:['Une direction conseillée','Un sens obligatoire vers la droite','Une interdiction de tourner à droite','Une route prioritaire'], correct:1, exp:'Le disque bleu correspond à une obligation : la direction indiquée doit être suivie.', verified:false, source:'pdf-signaux-routiers'},
  {theme:'panneaux', q:'Face à un panneau de chaussée glissante, le conducteur doit surtout…', rep:['Freiner brutalement','Réduire progressivement sa vitesse et éviter les gestes brusques','Accélérer dans le virage','Couper immédiatement le moteur'], correct:1, exp:'Sur une chaussée glissante, les freinages et changements de direction brusques peuvent provoquer une perte d’adhérence.', verified:false, source:'decret-2004'},
  {theme:'panneaux', q:'Un panneau indiquant une limitation de vitesse fixe…', rep:['Une vitesse minimale obligatoire','Une vitesse maximale à ne pas dépasser','Une vitesse recommandée sans obligation','Une vitesse réservée aux poids lourds'], correct:1, exp:'La valeur affichée correspond à la vitesse maximale autorisée jusqu’à une nouvelle indication.', verified:true, source:'loi-2002-30'},
  {theme:'panneaux', q:'Que signifie un panneau de fin d’interdiction de dépasser ?', rep:['Le dépassement redevient possible si les conditions sont sûres','Il faut dépasser immédiatement','La route devient prioritaire','Tous les véhicules doivent s’arrêter'], correct:0, exp:'La fin de l’interdiction ne dispense jamais de vérifier la visibilité et la sécurité de la manœuvre.', verified:false, source:'pdf-signaux-routiers'},
  {theme:'priorites', q:'Si un agent de circulation donne une indication contraire au feu, que faut-il suivre ?', rep:['Le feu, toujours','L’indication de l’agent','Le véhicule le plus proche','La priorité à droite'], correct:1, exp:'Les indications de l’agent chargé de régler la circulation priment sur les feux et panneaux.', verified:false, source:'decret-2004'},
  {theme:'priorites', q:'En sortant d’un parking ou d’une propriété privée vers la route, le conducteur doit…', rep:['Prendre la priorité s’il arrive le premier','Céder le passage aux usagers déjà sur la route','Klaxonner et s’engager','Attendre uniquement les véhicules venant de gauche'], correct:1, exp:'Le conducteur qui quitte un lieu privé doit s’assurer de ne gêner aucun usager déjà engagé.', verified:false, source:null},
  {theme:'priorites', q:'Dans un carrefour sans panneau ni feu, avant de s’engager il faut…', rep:['Regarder uniquement à gauche','Observer toutes les directions et appliquer la priorité à droite','Accélérer pour passer avant les autres','Suivre le véhicule précédent sans vérifier'], correct:1, exp:'L’observation complète du carrefour est indispensable avant d’appliquer la règle de priorité à droite.', verified:true, source:'loi-2002-30'},
  {theme:'securite', q:'Avant de démarrer, le conducteur doit vérifier notamment…', rep:['Uniquement le niveau de carburant','Sa position, ses rétroviseurs, sa ceinture et l’environnement immédiat','Seulement la radio','La couleur du véhicule voisin'], correct:1, exp:'Une installation correcte et une observation de l’environnement réduisent les risques dès les premiers mètres.', verified:false, source:null},
  {theme:'securite', q:'En cas de pluie forte, les distances de freinage peuvent…', rep:['Diminuer','Augmenter','Rester toujours identiques','Disparaître avec les feux allumés'], correct:1, exp:'L’eau réduit l’adhérence et peut augmenter la distance nécessaire pour s’arrêter.', verified:true, source:'decret-2004'},
  {theme:'securite', q:'Pour éviter l’angle mort d’un autre véhicule, il vaut mieux…', rep:['Rester longtemps à sa hauteur','Dépasser rapidement ou rester à une distance permettant d’être vu','Rouler sans éclairage','Klaxonner en continu'], correct:1, exp:'Il faut éviter de rester dans la zone que le conducteur voisin ne peut pas voir dans ses rétroviseurs.', verified:false, source:null},
  {theme:'securite', q:'Un piéton déjà engagé sur un passage protégé doit…', rep:['Céder le passage aux véhicules','Être laissé traverser, le conducteur ralentissant ou s’arrêtant si nécessaire','Courir pour libérer la voie','Être averti par un long coup de klaxon'], correct:1, exp:'Le conducteur doit anticiper et céder le passage au piéton engagé.', verified:true, source:'decret-2004'},
  {theme:'manoeuvres', q:'Pendant une manœuvre, si un piéton apparaît derrière le véhicule, il faut…', rep:['Continuer lentement','S’arrêter et ne reprendre que lorsque la zone est libre','Accélérer pour terminer','Regarder uniquement devant'], correct:1, exp:'La priorité est donnée à la sécurité : toute manœuvre doit être interrompue si la zone devient dangereuse.', verified:false, source:null},
  {theme:'manoeuvres', q:'Pour un créneau réussi, le conducteur doit d’abord…', rep:['Choisir un emplacement adapté et signaler son intention','Braquer immédiatement sans regarder','Monter sur le trottoir','Couper les rétroviseurs'], correct:0, exp:'Le choix de l’emplacement, la signalisation et les contrôles précèdent le braquage.', verified:false, source:null},
  {theme:'manoeuvres', q:'Lors d’un stationnement en bataille, le véhicule doit être…', rep:['Centré dans sa place sans gêner les places voisines','Posé sur la ligne séparatrice','Orienté en travers de la circulation','Le plus près possible du véhicule voisin'], correct:0, exp:'Le centrage laisse l’espace nécessaire aux autres véhicules et aux piétons.', verified:false, source:null},
  {theme:'comportement', q:'Un conducteur prudent doit adapter son comportement aux usagers vulnérables, notamment…', rep:['Piétons, cyclistes et motocyclistes','Uniquement aux poids lourds','Uniquement aux véhicules neufs','À personne si la route est large'], correct:0, exp:'Les usagers vulnérables nécessitent une marge de sécurité et une attention particulières.', verified:false, source:null},
  {theme:'comportement', q:'À l’approche d’un marché ou d’une école, il est préférable de…', rep:['Accélérer avant la zone','Réduire l’allure et anticiper les traversées imprévisibles','Rouler sur l’accotement','Utiliser les feux de route en plein jour'], correct:1, exp:'La présence de piétons et d’enfants exige une vitesse réduite et une vigilance renforcée.', verified:false, source:null},
  {theme:'feux', q:'Avant de changer de voie, l’ordre correct est généralement…', rep:['Braquer puis regarder','Observer, signaler, contrôler l’angle mort puis se décaler si possible','Klaxonner et fermer les yeux','Accélérer sans signaler'], correct:1, exp:'L’observation et la signalisation doivent précéder le déplacement latéral.', verified:false, source:null},
  {theme:'feux', q:'Les feux de croisement sont utiles notamment…', rep:['Pour mieux voir et être vu sans éblouir les autres','Uniquement quand le véhicule est stationné','Pour remplacer le clignotant','Pour signaler un dépassement'], correct:0, exp:'Ils améliorent la visibilité tout en limitant l’éblouissement des autres usagers.', verified:false, source:null},
  {theme:'autoroute', q:'Sur une voie rapide, une panne impose d’abord de…', rep:['Rester au milieu de la voie','Se mettre en sécurité, signaler le danger et contacter les secours si nécessaire','Faire demi-tour','Marcher sur la chaussée sans précaution'], correct:1, exp:'La mise en sécurité et le signalement du véhicule immobilisé sont prioritaires.', verified:false, source:null}
];
