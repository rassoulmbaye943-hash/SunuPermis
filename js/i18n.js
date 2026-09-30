/* SunuPermis — architecture d'internationalisation (démonstration FR / WO)
   NOTE IMPORTANTE : les traductions wolof ci-dessous sont une PREMIÈRE
   ébauche à faire valider par un locuteur wolof natif avant toute mise
   en production. Seuls la navigation et la page d'accueil sont traduites
   à ce stade ; le reste du contenu (cours, quiz, glossaire) doit encore
   être traduit lorsqu'une équipe de traduction sera disponible. */
var SP_I18N = {
  fr: {
    nav_accueil:'Accueil', nav_permis:'Choisir mon permis', nav_code:'Code de la route',
    nav_conduire:'Apprendre à conduire', nav_manoeuvres:'Manœuvres', nav_videos:'Vidéos',
    nav_quiz:'Quiz', nav_examen:'Examen blanc', nav_progression:'Ma progression',
    nav_carte:'Carte du Sénégal', nav_glossaire:'Glossaire', nav_conseils:'Conseils', nav_offres:'Offres Gratuit / Premium',
    nav_group_apprendre:'Apprendre', nav_group_evaluer:'S’évaluer', nav_group_ressources:'Ressources',
    btn_connexion:'Se connecter', btn_compte:'Mon compte',
    hero_eyebrow:'Auto-école numérique — Sénégal',
    hero_title:'Prépare ton permis au Sénégal, où que tu sois.',
    hero_lead:'Apprends le code de la route, comprends les règles et entraîne-toi à la conduite grâce à des cours, vidéos, quiz et simulations interactives, pensés pour Dakar, Thiès, Saint-Louis, Touba, Mbour et toutes les routes du Sénégal.',
    hero_cta1:'Commencer gratuitement', hero_cta2:'Apprendre le code', hero_cta3:'Apprendre à conduire', hero_cta4:'Faire un examen blanc',
    footer_tagline:'Apprends le code. Maîtrise la conduite. Décroche ton permis — une préparation pensée pour les réalités sénégalaises de la route.'
  },
  wo: {
    nav_accueil:'Kër', nav_permis:'Tann sama permi', nav_code:'Kodug yoon wi',
    nav_conduire:'Jàng a woto', nav_manoeuvres:'Manëwar yi', nav_videos:'Widéwoy',
    nav_quiz:'Quiz', nav_examen:'Saytu bu jekk', nav_progression:'Sama jëmm kanam',
    nav_carte:'Kaart bu Senegaal', nav_glossaire:'Baatujàng', nav_conseils:'Xalaat yi', nav_offres:'Gratis / Premium',
    nav_group_apprendre:'Jàng', nav_group_evaluer:'Saytu', nav_group_ressources:'Njumte yi',
    btn_connexion:'Dugg', btn_compte:'Sama kompt',
    hero_eyebrow:'Oto-ekol numerik — Senegaal',
    hero_title:'Waajal sa permi ci Senegaal, foo mana nekk.',
    hero_lead:'Jàngal kodug yoon wi, xam yoon yi te jaar-jaari ci woto ak leksio, widéwoy, quiz ak simulasion — ñu def ko ngir Dakar, Thiès, Ndar, Tuubaa, Mbuur ak yoon yépp ci Senegaal.',
    hero_cta1:'Tambali ci amul kopar', hero_cta2:'Jàng kodug yoon wi', hero_cta3:'Jàng a woto', hero_cta4:'Def saytu bu jekk',
    footer_tagline:'Jàngal kodug yoon wi. Am xam-xam ci woto. Am sa permi — waajale ngir yoon yi ci Senegaal. (Tekstal wolof, war a wone ci kenn ku wax wolof lool.)'
  }
};

function spGetLang(){ return localStorage.getItem('sp_lang') || 'fr'; }
function spSetLang(l){ localStorage.setItem('sp_lang', l); spApplyLang(); }

function spApplyLang(){
  var lang = spGetLang();
  var dict = SP_I18N[lang] || SP_I18N.fr;
  document.documentElement.setAttribute('lang', lang === 'wo' ? 'wo' : 'fr');
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key = el.getAttribute('data-i18n');
    if(!dict[key]) return;
    var chev = el.querySelector('.chev');
    if(chev){ el.firstChild.textContent = dict[key] + ' '; }
    else { el.textContent = dict[key]; }
  });
  var badge = document.getElementById('langToggle');
  if(badge) badge.textContent = lang === 'wo' ? 'FR' : 'WO';
}
document.addEventListener('DOMContentLoaded', spApplyLang);
document.addEventListener('click', function(e){
  if(e.target.closest('#langToggle')){
    spSetLang(spGetLang() === 'wo' ? 'fr' : 'wo');
  }
});
