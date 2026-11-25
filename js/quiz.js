/* SunuPermis — moteur de quiz thématique */
var SPQuiz = (function(){
  var state = { list: [], i: 0, score: 0, theme: 'tous', answered:false, best:0 };
  function shuffle(arr){var a=arr.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function start(theme,count){
    state.theme=theme; var pool=theme==='tous'?QUIZ_BANK:QUIZ_BANK.filter(function(q){return q.theme===theme;});
    state.list=shuffle(pool).slice(0,count||pool.length); state.i=0; state.score=0; state.answered=false;
    if(!state.list.length){document.getElementById('quizArea').innerHTML='<div class="quiz-card center"><h3>Aucune question disponible</h3><p>Cette catégorie ne contient pas encore de questions.</p></div>';return;}
    render();
  }
  function render(){
    var shell=document.getElementById('quizArea'); if(state.i>=state.list.length){renderResult();return;}
    var q=state.list[state.i], answers=shuffle(q.rep.map(function(r,idx){return {text:r,idx:idx};}));
    shell.innerHTML='<div class="quiz-progress"><div><strong>Question '+(state.i+1)+' / '+state.list.length+'</strong><span class="quiz-progress-label"> · '+state.score+' bonne'+(state.score>1?'s':'')+' réponse'+(state.score>1?'s':'')+'</span></div><span class="badge badge-accent">'+q.theme+'</span></div>'+
      '<div class="quiz-progress-line"><span style="width:'+Math.round(state.i/state.list.length*100)+'%"></span></div>'+
      '<div class="quiz-card">'+mediaFor(q)+'<div class="quiz-question-head"><span class="badge">Défi '+(state.i+1)+'</span><span class="quiz-status">Une seule réponse</span></div><h3 class="quiz-title">'+q.q+'</h3>'+
      '<ul class="answer-list">'+answers.map(function(a,i){return '<li><button data-idx="'+a.idx+'"><span class="answer-letter">'+String.fromCharCode(65+i)+'</span><span>'+a.text+'</span></button></li>';}).join('')+'</ul>'+
      '<div class="quiz-explain" id="quizExplain" aria-live="polite"></div>'+
      '<div class="quiz-nav"><button class="btn btn-outline btn-sm" id="quizQuit">Quitter</button><button class="btn btn-primary btn-sm" id="quizNext" style="display:none;">'+(state.i===state.list.length-1?'Voir le résultat':'Question suivante →')+'</button></div></div>';
    shell.querySelectorAll('.answer-list button').forEach(function(btn){btn.addEventListener('click',function(){answer(+btn.dataset.idx);});});
    document.getElementById('quizQuit').addEventListener('click',function(){shell.innerHTML='<div class="quiz-card center"><h3>Quiz interrompu</h3><p>Tu peux reprendre un nouveau quiz en choisissant un thème.</p></div>';});
  }
  function mediaFor(q){
    var text=(q.q||'').toLowerCase(),image='';
    if(q.theme==='panneaux'){if(text.indexOf('stop')!==-1)image='assets/panneaux/pdf-145.png';else if(text.indexOf('cédez')!==-1)image='assets/panneaux/pdf-143.png';else if(text.indexOf('losange')!==-1)image='assets/panneaux/pdf-146.png';else if(text.indexOf('chaussée glissante')!==-1)image='assets/panneaux/pdf-172.png';}
    if(image)return '<figure class="quiz-media"><img src="'+image+'" alt="Illustration du panneau associé à la question" loading="lazy"><figcaption>Illustration issue de la banque de panneaux du PDF fourni.</figcaption></figure>';
    return '';
  }
  function answer(idx){
    if(state.answered)return; state.answered=true; var q=state.list[state.i],shell=document.getElementById('quizArea');
    shell.querySelectorAll('.answer-list button').forEach(function(b){b.disabled=true;if(+b.dataset.idx===q.correct)b.classList.add('correct');else if(+b.dataset.idx===idx)b.classList.add('incorrect');});
    if(idx===q.correct)state.score++;
    var exp=document.getElementById('quizExplain');exp.innerHTML='<strong>'+ (idx===q.correct?'Bonne réponse.':'Réponse à revoir.')+'</strong> '+q.exp+(q.verified?' <span class="badge badge-verified">Vérifié</span>':' <span class="badge badge-accent">À confirmer</span>');exp.classList.add('show');
    var next=document.getElementById('quizNext');next.style.display='inline-flex';next.onclick=function(){state.i++;state.answered=false;render();};
  }
  function renderResult(){
    var shell=document.getElementById('quizArea'),total=state.list.length,pct=total?Math.round(state.score/total*100):0;
    if(window.SPProgress)SPProgress.addQuizScore(state.theme,state.score,total);
    var message=pct>=80?'Très bon rythme : consolide les questions encore hésitantes.':pct>=60?'Bonne base : revois les explications puis refais un quiz.':'Reprends les notions du thème avant de retenter l’exercice.';
    shell.innerHTML='<div class="quiz-card center quiz-result"><span class="badge badge-accent">Quiz terminé</span><h3>Ton résultat</h3>'+(window.spScoreRing?spScoreRing(pct,150):'')+'<p class="result-score">'+state.score+' / '+total+' · '+pct+' %</p><p>'+message+'</p><div class="hero-ctas center" style="justify-content:center"><button class="btn btn-primary" id="quizRestart">Recommencer</button><a href="examen.html" class="btn btn-outline">Passer à l’examen blanc</a></div></div>';
    if(window.spAnimateScoreRing)spAnimateScoreRing(shell);
    document.getElementById('quizRestart').addEventListener('click',function(){start(state.theme,state.list.length);});
  }
  return {start:start};
})();
