/* SunuPermis — suivi de progression (stockage local navigateur)
   NOTE : ceci est un stockage local de démonstration (localStorage).
   Dans une vraie mise en production, ces données doivent être
   synchronisées avec un compte utilisateur côté serveur. */
var SPProgress = (function(){
  var KEY = 'sp_progress_v1';

  function defaultState(){
    return {
      lessonsSeen: {},        // { 'panneaux-danger': true, ... }
      quizScores: [],         // [{theme, score, total, date}]
      examResults: [],        // [{id, score, total, date, weakThemes:[]}]
      streakDays: [],         // ['2026-09-14', ...]
      badges: []              // ['premiers-pas', 'code-70']
    };
  }

  function load(){
    try{
      var raw = localStorage.getItem(KEY);
      return raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
    }catch(e){ return defaultState(); }
  }
  function save(state){
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e) {}
  }
  function localDateKey(){
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth()+1).padStart(2,'0');
    var day = String(d.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+day;
  }

  function markLessonSeen(id){
    var s = load(); s.lessonsSeen[id] = true; save(s); touchStreak();
  }
  function addQuizScore(theme, score, total){
    var s = load();
    s.quizScores.push({theme:theme, score:score, total:total, date:new Date().toISOString()});
    save(s); touchStreak(); checkBadges();
  }
  function addExamResult(examId, score, total, weakThemes){
    var s = load();
    s.examResults.push({id:examId, score:score, total:total, weakThemes:weakThemes||[], date:new Date().toISOString()});
    save(s); touchStreak(); checkBadges();
  }
  function touchStreak(){
    var s = load();
    var today = localDateKey();
    if(s.streakDays.indexOf(today) === -1){ s.streakDays.push(today); save(s); }
  }
  function checkBadges(){
    var s = load();
    var add = function(b){ if(s.badges.indexOf(b)===-1) s.badges.push(b); };
    if(s.quizScores.length >= 1) add('premiers-pas');
    if(s.quizScores.length >= 10) add('assidu');
    if(s.examResults.some(function(r){ return r.score/r.total >= 0.8; })) add('pret-pour-lexamen');
    if(s.streakDays.length >= 3) add('serie-3-jours');
    save(s);
  }

  function categoryPercent(cat){
    var s = load();
    var keys = Object.keys(s.lessonsSeen).filter(function(k){ return k.indexOf(cat+':') === 0; });
    // pourcentage de démonstration basé sur le nombre de leçons de la catégorie vues
    var totalByCat = {code:12, conduite:8, manoeuvres:6, examens:10};
    var total = totalByCat[cat] || 10;
    return Math.min(100, Math.round((keys.length/total)*100));
  }

  function reset(){ localStorage.removeItem(KEY); }

  return {
    load: load, markLessonSeen: markLessonSeen, addQuizScore: addQuizScore,
    addExamResult: addExamResult, categoryPercent: categoryPercent, reset: reset
  };
})();
