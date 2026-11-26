/* SunuPermis — banque des manœuvres. */
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
