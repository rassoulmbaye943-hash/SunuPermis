/* SunuPermis — simulateur d'examen blanc */
var SPExam = (function(){
  var state = { questions: [], answers: [], marked: [], i: 0, seconds: 0, timerId: null, examId: null, started:false, finished:false };

  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
    return a;
  }

  function buildExam(examId, size){
    state.examId = examId;
    state.questions = shuffle(QUIZ_BANK).slice(0, size || 20).map(function(q){
      var answers = q.rep.map(function(r,idx){return {text:r,idx:idx};});
      return Object.assign({}, q, {shuffled: shuffle(answers)});
    });
    state.answers = new Array(state.questions.length).fill(null);
    state.marked = new Array(state.questions.length).fill(false);
    state.i = 0;
    state.seconds = (size||20) * 36; // ~ 36s / question, comparable à un temps d'examen court
    state.started = true;
    state.finished = false;
    startTimer();
    renderShell();
    updateAnswered();
    renderQuestion();
  }

  function startTimer(){
    clearInterval(state.timerId);
    state.timerId = setInterval(function(){
      state.seconds--;
      updateTimer();
      if(state.seconds <= 0){ clearInterval(state.timerId); finish(); }
    }, 1000);
  }
  function updateTimer(){
    var el = document.getElementById('examTimer');
    if(!el) return;
    var m = Math.floor(Math.max(0,state.seconds)/60), s = Math.max(0,state.seconds)%60;
    el.textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  }

  function renderShell(){
    var root = document.getElementById('examRoot');
    root.innerHTML =
      '<div class="quiz-shell exam-shell-modern">'+
      '<div class="exam-topbar"><div><strong>Examen '+state.examId+'</strong><small id="examAnswered">0 / '+state.questions.length+' répondues</small></div><div class="timer" id="examTimer"></div></div>'+
      '<div class="flex-between" style="margin-bottom:16px;">'+
        '<span class="badge badge-accent">Navigation</span><span class="exam-legend"><span>● répondue</span><span>★ à revoir</span></span>'+
      '</div>'+
      '<div class="exam-grid" id="examGrid"></div>'+
      '<div id="examQuestion"></div>'+
      '</div>';
    updateTimer();
    renderGrid();
  }

  function renderGrid(){
    var grid = document.getElementById('examGrid');
    grid.innerHTML = state.questions.map(function(q,idx){
      var cls = (idx===state.i?'current ':'')+(state.answers[idx]!==null?'answered ':'')+(state.marked[idx]?'marked':'');
      return '<button class="'+cls+'" aria-label="Question '+(idx+1)+(state.marked[idx]?' à revoir':'')+'" data-i="'+idx+'">'+(idx+1)+(state.marked[idx]?'<span aria-hidden="true">★</span>':'')+'</button>';
    }).join('');
    grid.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){ state.i = +b.dataset.i; renderGrid(); renderQuestion(); });
    });
  }

  function renderQuestion(){
    var q = state.questions[state.i];
    var chosen = state.answers[state.i];
    var marked = state.marked[state.i];
    var box = document.getElementById('examQuestion');
    box.innerHTML =
      '<div class="quiz-card">'+
      '<div class="quiz-question-head"><span class="badge badge-accent">'+q.theme+'</span><button class="mark-question" id="examMark" type="button">'+(marked?'★ À revoir':'☆ Marquer à revoir')+'</button></div>'+
      '<h3 class="quiz-title">Question '+(state.i+1)+'. '+q.q+'</h3>'+
      
      '<ul class="answer-list">'+q.shuffled.map(function(a,i){
        var sel = chosen===a.idx ? ' style="border-color:var(--primary);background:var(--surface-2);"' : '';
        return '<li><button data-idx="'+a.idx+'"'+sel+'><span class="answer-letter">'+String.fromCharCode(65+i)+'</span><span>'+a.text+'</span></button></li>';
      }).join('')+'</ul>'+
      '<div class="quiz-nav">'+
        '<button class="btn btn-outline btn-sm" id="examPrev" '+(state.i===0?'disabled':'')+'>← Précédente</button>'+
        (state.i===state.questions.length-1
          ? '<button class="btn btn-primary btn-sm" id="examFinish">Terminer l’examen</button>'
          : '<button class="btn btn-primary btn-sm" id="examNext">Suivante →</button>')+
      '</div></div>';
    box.querySelectorAll('.answer-list button').forEach(function(btn){
      btn.addEventListener('click', function(){
        state.answers[state.i] = +btn.dataset.idx;
        updateAnswered(); renderGrid(); renderQuestion();
      });
    });
    var prev = document.getElementById('examPrev');
    if(prev) prev.addEventListener('click', function(){ if(state.i>0){state.i--; renderGrid(); renderQuestion();} });
    var next = document.getElementById('examNext');
    if(next) next.addEventListener('click', function(){ state.i++; renderGrid(); renderQuestion(); });
    var fin = document.getElementById('examFinish');
    if(fin) fin.addEventListener('click', finish);
    var mark = document.getElementById('examMark');
    if(mark) mark.addEventListener('click', function(){state.marked[state.i]=!state.marked[state.i];renderGrid();renderQuestion();});
  }

  function updateAnswered(){var el=document.getElementById('examAnswered');if(el)el.textContent=state.answers.filter(function(a){return a!==null;}).length+' / '+state.questions.length+' répondues';}

  function finish(){
    if(state.finished) return;
    var unanswered=state.answers.filter(function(a){return a===null;}).length;
    if(unanswered && !window.confirm('Il reste '+unanswered+' question(s) sans réponse. Terminer quand même ?')) return;
    state.finished = true;
    clearInterval(state.timerId);
    var score = 0; var byTheme = {};
    state.questions.forEach(function(q,idx){
      byTheme[q.theme] = byTheme[q.theme] || {ok:0,total:0};
      byTheme[q.theme].total++;
      if(state.answers[idx] === q.correct){ score++; byTheme[q.theme].ok++; }
    });
    var weak = Object.keys(byTheme).filter(function(t){ return byTheme[t].ok/byTheme[t].total < 0.6; });
    var strong = Object.keys(byTheme).filter(function(t){ return byTheme[t].ok/byTheme[t].total >= 0.8; });
    if(window.SPProgress) SPProgress.addExamResult(state.examId, score, state.questions.length, weak);
    var pct = Math.round(score/state.questions.length*100);
    var root = document.getElementById('examRoot');
    root.innerHTML =
      '<div class="quiz-shell"><div class="quiz-card center">'+
      '<h3>Résultat de l’examen '+state.examId+'</h3>'+
      (window.spScoreRing ? spScoreRing(pct, 150) : '')+
      '<p style="margin-top:6px;">'+score+' / '+state.questions.length+' bonnes réponses</p>'+
      '<p>'+ (pct>=80 ? 'Très bon résultat pour un entraînement.' : pct>=60 ? 'Bonne base : revois les thèmes les moins maîtrisés.' : 'Reprends les notions essentielles puis retente un examen.') +'</p>'+
      '<div class="grid grid-2" style="text-align:left;margin-top:20px;">'+
        '<div class="card"><h4>Thèmes à renforcer</h4>'+(weak.length? '<ul>'+weak.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul>' : '<p>Aucun point faible marqué, bravo !</p>')+'</div>'+
        '<div class="card"><h4>Thèmes bien maîtrisés</h4>'+(strong.length? '<ul>'+strong.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul>' : '<p>Continue à t’entraîner pour consolider tes acquis.</p>')+'</div>'+
      '</div>'+
      '<p class="source-note" style="text-align:left;">Ce simulateur est un outil d’entraînement. Le nombre de questions, la durée et le seuil du véritable examen doivent être confirmés auprès de l’auto-école ou du centre d’examen.</p>'+
      '<div class="hero-ctas center" style="justify-content:center;"><button class="btn btn-primary" id="examRestart">Refaire un examen</button><a href="quiz.html" class="btn btn-outline">Revoir par thème</a></div>'+
      '</div></div>';
    if(window.spAnimateScoreRing) spAnimateScoreRing(root);
    document.getElementById('examRestart').addEventListener('click', function(){
      state.started = false;
      state.finished = false;
      root.innerHTML='';
      var picker = document.getElementById('examPicker');
      if(picker) picker.style.display='grid';
      window.scrollTo({top: picker ? picker.offsetTop - 90 : 0, behavior:'smooth'});
    });
  }

  return { buildExam: buildExam };
})();
