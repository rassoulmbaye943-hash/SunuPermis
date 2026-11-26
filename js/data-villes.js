/* SunuPermis — banque de conseils par ville. */
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
