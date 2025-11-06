// script.js
// Arquivo unificado para:
// - index.html (exibe contadores)
// - hiragana.html e katakana.html (treino + provas)
// Recursos:
// - localStorage para contadores (persistência no browser)
// - detecção de página via <body data-mode="...">
// - dark-mode persistente com animação (spin)
// - comentários explicativos para facilitar manutenção
// ---------------------------------------------------------

/* =========================
   Configurações e utilitários
   ========================= */
const LS_KEYS = {
  hiragana: 'duppon_vezes_hiragana',
  hiragana_tests: 'duppon_vezes_hiragana_tests',
  katakana: 'duppon_vezes_katakana',
  katakana_tests: 'duppon_vezes_katakana_tests',
  particles: 'duppon_vezes_particles',
  darkMode: 'darkMode'
};

// localStorage helpers
function getCount(key){ return parseInt(localStorage.getItem(key) || '0', 10); }
function setCount(key, value){ localStorage.setItem(key, String(value)); }
function incrementCount(key){ const c = getCount(key); setCount(key, c+1); return c+1; }

// Atualiza os spans na página index com os valores do localStorage
function atualizarDisplaysIndex(){
  const elH = document.getElementById('vezes-hiragana');
  const elK = document.getElementById('vezes-katakana');
  const elP = document.getElementById('vezes-particles');
  if(elH) elH.textContent = getCount(LS_KEYS.hiragana);
  if(elK) elK.textContent = getCount(LS_KEYS.katakana);
  if(elP) elP.textContent = getCount(LS_KEYS.particles);
}

/* =========================
   Dados: Hiragana e Katakana
   - Edite estes arrays para adicionar/ajustar caracteres/romaji
   ========================= */
const HIRAGANA_LETTERS = [
  {char:'あ', romaji:'a'}, {char:'い', romaji:'i'}, {char:'う', romaji:'u'}, {char:'え', romaji:'e'}, {char:'お', romaji:'o'},
  {char:'か', romaji:'ka'},{char:'き', romaji:'ki'},{char:'く', romaji:'ku'},{char:'け', romaji:'ke'},{char:'こ', romaji:'ko'},
  {char:'さ', romaji:'sa'},{char:'し', romaji:'shi'},{char:'す', romaji:'su'},{char:'せ', romaji:'se'},{char:'そ', romaji:'so'},
  {char:'た', romaji:'ta'},{char:'ち', romaji:'chi'},{char:'つ', romaji:'tsu'},{char:'て', romaji:'te'},{char:'と', romaji:'to'},
  {char:'な', romaji:'na'},{char:'に', romaji:'ni'},{char:'ぬ', romaji:'nu'},{char:'ね', romaji:'ne'},{char:'の', romaji:'no'},
  {char:'は', romaji:'ha'},{char:'ひ', romaji:'hi'},{char:'ふ', romaji:'fu'},{char:'へ', romaji:'he'},{char:'ほ', romaji:'ho'},
  {char:'ま', romaji:'ma'},{char:'み', romaji:'mi'},{char:'む', romaji:'mu'},{char:'め', romaji:'me'},{char:'も', romaji:'mo'},
  {char:'や', romaji:'ya'},{char:'ゆ', romaji:'yu'},{char:'よ', romaji:'yo'},
  {char:'ら', romaji:'ra'},{char:'り', romaji:'ri'},{char:'る', romaji:'ru'},{char:'れ', romaji:'re'},{char:'ろ', romaji:'ro'},
  {char:'わ', romaji:'wa'},{char:'を', romaji:'wo'},{char:'ん', romaji:'n'},{ char: 'が', romaji: 'ga' },{ char: 'ぎ', romaji: 'gi' },
  { char: 'ぐ', romaji: 'gu' },{ char: 'げ', romaji: 'ge' },{ char: 'ご', romaji: 'go' },{ char: 'ざ', romaji: 'za' },
  { char: 'じ', romaji: 'ji' },{ char: 'ず', romaji: 'zu' },{ char: 'ぜ', romaji: 'ze' },{ char: 'ぞ', romaji: 'zo' },{ char: 'だ', romaji: 'da' },
  { char: 'ぢ', romaji: 'ji' },{ char: 'づ', romaji: 'zu' }, { char: 'で', romaji: 'de' },{ char: 'ど', romaji: 'do' },{ char: 'ば', romaji: 'ba' },
  { char: 'び', romaji: 'bi' },{ char: 'ぶ', romaji: 'bu' },{ char: 'べ', romaji: 'be' },{ char: 'ぼ', romaji: 'bo' },{ char: 'ぱ', romaji: 'pa' },
  { char: 'ぴ', romaji: 'pi' },{ char: 'ぷ', romaji: 'pu' },{ char: 'ぺ', romaji: 'pe' },{ char: 'ぽ', romaji: 'po' },
  // Kya, kyu, kyo
  { char: 'きゃ', romaji: 'kya' },
  { char: 'きゅ', romaji: 'kyu' },
  { char: 'きょ', romaji: 'kyo' },
  // Shya, shyu, shyo (sha, shu, sho)
  { char: 'しゃ', romaji: 'sha' },
  { char: 'しゅ', romaji: 'shu' },
  { char: 'しょ', romaji: 'sho' },
  // Chya, chyu, chyo (cha, chu, cho)
  { char: 'ちゃ', romaji: 'cha' },
  { char: 'ちゅ', romaji: 'chu' },
  { char: 'ちょ', romaji: 'cho' },
  // Nya, nyu, nyo
  { char: 'にゃ', romaji: 'nya' },
  { char: 'にゅ', romaji: 'nyu' },
  { char: 'にょ', romaji: 'nyo' },
  // Hya, hyu, hyo
  { char: 'ひゃ', romaji: 'hya' },
  { char: 'ひゅ', romaji: 'hyu' },
  { char: 'ひょ', romaji: 'hyo' },
  // Mya, myu, myo
  { char: 'みゃ', romaji: 'mya' },
  { char: 'みゅ', romaji: 'myu' },
  { char: 'みょ', romaji: 'myo' },
  // Rya, ryu, ryo
  { char: 'りゃ', romaji: 'rya' },
  { char: 'りゅ', romaji: 'ryu' },
  { char: 'りょ', romaji: 'ryo' },

  // Dakuon Yōon (Sons expressos palatalizados)
  // Gya, gyu, gyo
  { char: 'ぎゃ', romaji: 'gya' },
  { char: 'ぎゅ', romaji: 'gyu' },
  { char: 'ぎょ', romaji: 'gyo' },
  // Jya, jyu, jyo (ja, ju, jo)
  { char: 'じゃ', romaji: 'ja' },
  { char: 'じゅ', romaji: 'ju' },
  { char: 'じょ', romaji: 'jo' },
  // Bya, byu, byo
  { char: 'びゃ', romaji: 'bya' },
  { char: 'びゅ', romaji: 'byu' },
  { char: 'びょ', romaji: 'byo' },

  // Han-dakuon Yōon (Sons semi-expressos palatalizados)
  // Pya, pyu, pyo
  { char: 'ぴゃ', romaji: 'pya' },
  { char: 'ぴゅ', romaji: 'pyu' },
  { char: 'ぴょ', romaji: 'pyo' }
];

const KATAKANA_LETTERS = [
  {char:'ア', romaji:'a'}, {char:'イ', romaji:'i'}, {char:'ウ', romaji:'u'}, {char:'エ', romaji:'e'}, {char:'オ', romaji:'o'},
  {char:'カ', romaji:'ka'},{char:'キ', romaji:'ki'},{char:'ク', romaji:'ku'},{char:'ケ', romaji:'ke'},{char:'コ', romaji:'ko'},
  {char:'サ', romaji:'sa'},{char:'シ', romaji:'shi'},{char:'ス', romaji:'su'},{char:'セ', romaji:'se'},{char:'ソ', romaji:'so'},
  {char:'タ', romaji:'ta'},{char:'チ', romaji:'chi'},{char:'ツ', romaji:'tsu'},{char:'テ', romaji:'te'},{char:'ト', romaji:'to'},
  {char:'ナ', romaji:'na'},{char:'ニ', romaji:'ni'},{char:'ヌ', romaji:'nu'},{char:'ネ', romaji:'ne'},{char:'ノ', romaji:'no'},
  {char:'ハ', romaji:'ha'},{char:'ヒ', romaji:'hi'},{char:'フ', romaji:'fu'},{char:'ヘ', romaji:'he'},{char:'ホ', romaji:'ho'},
  {char:'マ', romaji:'ma'},{char:'ミ', romaji:'mi'},{char:'ム', romaji:'mu'},{char:'メ', romaji:'me'},{char:'モ', romaji:'mo'},
  {char:'ヤ', romaji:'ya'},{char:'ユ', romaji:'yu'},{char:'ヨ', romaji:'yo'},
  {char:'ラ', romaji:'ra'},{char:'リ', romaji:'ri'},{char:'ル', romaji:'ru'},{char:'レ', romaji:'re'},{char:'ロ', romaji:'ro'},
  {char:'ワ', romaji:'wa'},{char:'ヲ', romaji:'wo'},{char:'ン', romaji:'n'},
  { char: 'ギ', romaji: 'gi' },
  { char: 'グ', romaji: 'gu' },
  { char: 'ゲ', romaji: 'ge' },
  { char: 'ゴ', romaji: 'go' },
  // Linha Z (za, ji, zu, ze, zo)
  { char: 'ザ', romaji: 'za' },
  { char: 'ジ', romaji: 'ji' },
  { char: 'ズ', romaji: 'zu' },
  { char: 'ゼ', romaji: 'ze' },
  { char: 'ゾ', romaji: 'zo' },
  // Linha D (da, ji, zu, de, do)
  { char: 'ダ', romaji: 'da' },
  { char: 'ヂ', romaji: 'ji' }, // Pronuncia-se como 'ji', similar ao anterior
  { char: 'ヅ', romaji: 'zu' }, // Pronuncia-se como 'zu', similar ao anterior
  { char: 'デ', romaji: 'de' },
  { char: 'ド', romaji: 'do' },
  // Linha B (ba, bi, bu, be, bo)
  { char: 'バ', romaji: 'ba' },
  { char: 'ビ', romaji: 'bi' },
  { char: 'ブ', romaji: 'bu' },
  { char: 'ベ', romaji: 'be' },
  { char: 'ボ', romaji: 'bo' },
   // Linha P (pa, pi, pu, pe, po)
  { char: 'パ', romaji: 'pa' },
  { char: 'ピ', romaji: 'pi' },
  { char: 'プ', romaji: 'pu' },
  { char: 'ペ', romaji: 'pe' },
  { char: 'ポ', romaji: 'po' },
  // Kya, kyu, kyo
  { char: 'キャ', romaji: 'kya' },
  { char: 'キュ', romaji: 'kyu' },
  { char: 'キョ', romaji: 'kyo' },
  // Shya, shyu, shyo (sha, shu, sho)
  { char: 'シャ', romaji: 'sha' },
  { char: 'シュ', romaji: 'shu' },
  { char: 'ショ', romaji: 'sho' },
  // Chya, chyu, chyo (cha, chu, cho)
  { char: 'チャ', romaji: 'cha' },
  { char: 'チュ', romaji: 'chu' },
  { char: 'チョ', romaji: 'cho' },
  // Nya, nyu, nyo
  { char: 'ニャ', romaji: 'nya' },
  { char: 'ニュ', romaji: 'nyu' },
  { char: 'ニョ', romaji: 'nyo' },
  // Hya, hyu, hyo
  { char: 'ヒャ', romaji: 'hya' },
  { char: 'ヒュ', romaji: 'hyu' },
  { char: 'ヒョ', romaji: 'hyo' },
  // Mya, myu, myo
  { char: 'ミャ', romaji: 'mya' },
  { char: 'ミュ', romaji: 'myu' },
  { char: 'ミョ', romaji: 'myo' },
  // Rya, ryu, ryo
  { char: 'リャ', romaji: 'rya' },
  { char: 'リュ', romaji: 'ryu' },
  { char: 'リョ', romaji: 'ryo' },

  // Dakuon Yōon (Sons expressos palatalizados)
  // Gya, gyu, gyo
  { char: 'ギャ', romaji: 'gya' },
  { char: 'ギュ', romaji: 'gyu' },
  { char: 'ギョ', romaji: 'gyo' },
  // Jya, jyu, jyo (ja, ju, jo)
  { char: 'ジャ', romaji: 'ja' },
  { char: 'ジュ', romaji: 'ju' },
  { char: 'ジョ', romaji: 'jo' },
  // Bya, byu, byo
  { char: 'ビャ', romaji: 'bya' },
  { char: 'ビュ', romaji: 'byu' },
  { char: 'ビョ', romaji: 'byo' },

  // Han-dakuon Yōon (Sons semi-expressos palatalizados)
  // Pya, pyu, pyo
  { char: 'ピャ', romaji: 'pya' },
  { char: 'ピュ', romaji: 'pyu' },
  { char: 'ピョ', romaji: 'pyo' }
];

// shuffle simples (não criptográfica)
function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }

/* =========================
   Estado compartilhado (usado pelas páginas de treino)
   - O script inicializa somente quando detecta data-mode no body
   ========================= */
let letters = [];
let lettersBackup = [];
let currentCharacter = null;
let streaks = {};
let known = 0;
let unknown = 46;
let tests = 0;

// elementos DOM (colocados no load)
let charEl, answerEl, nextBtn, knownEl, unknownEl, testsEl, testArea, hiraganaCard, startTest1Btn, startTest2Btn;

/* =========================
   Contadores: funções que ligam o treino/provas ao localStorage
   - usarCardDireitaRegistrar(mode): incrementa "vezes" (treino)
   - registrarFinalizacaoProva(mode): incrementa "vezes" + contador de provas
   ========================= */
function usarCardDireitaRegistrar(mode){
  const key = mode === 'katakana' ? LS_KEYS.katakana : LS_KEYS.hiragana;
  try { incrementCount(key); } catch(e){ console.warn('Erro localStorage', e); }
  atualizarDisplaysIndex();
}

function registrarFinalizacaoProva(mode){
  const key = mode === 'katakana' ? LS_KEYS.katakana : LS_KEYS.hiragana;
  const testKey = mode === 'katakana' ? LS_KEYS.katakana_tests : LS_KEYS.hiragana_tests;
  incrementCount(key);
  const currentTests = parseInt(localStorage.getItem(testKey) || '0', 10) + 1;
  localStorage.setItem(testKey, String(currentTests));
  atualizarDisplaysIndex();
  if(testsEl) testsEl.textContent = currentTests;
}

/* =========================
   Modo treino (Anki-like)
   - nextCharacter(): mostra próximo
   - checkAnswer(mode): avalia resposta do usuário
   ========================= */
function nextCharacter(){
  if(charEl) charEl.style.color = '';
  currentCharacter = letters.shift();
  if(!currentCharacter){
    letters = shuffle(lettersBackup.slice());
    currentCharacter = letters.shift();
  }
  if(charEl) charEl.textContent = currentCharacter.char;
  if(answerEl){ answerEl.value = ''; answerEl.focus(); }
}

let testRunning = false;
let currentTimer = null;
const totalQuestions = 20;
const requiredScore = Math.round(totalQuestions * 0.80);

function checkAnswer(mode){
  if(testRunning) return;
  const userAnswer = (answerEl && answerEl.value.trim().toLowerCase()) || '';
  const correctRomaji = currentCharacter.romaji;

  if(userAnswer === correctRomaji){
    if(charEl) charEl.style.color = 'limegreen';
    if(!streaks[correctRomaji]) streaks[correctRomaji]=0;
    streaks[correctRomaji]++;
    if(streaks[correctRomaji]===3){ known++; unknown--; }
    letters.push(currentCharacter);
  } else {
    if(charEl) charEl.style.color = 'red';
    streaks[correctRomaji]=0;
    letters.splice(2,0,currentCharacter);
  }

  if(knownEl) knownEl.textContent = known;
  if(unknownEl) unknownEl.textContent = unknown;

  if(nextBtn){
    nextBtn.disabled = true;
    usarCardDireitaRegistrar(mode);
    setTimeout(()=>{ nextBtn.disabled=false; },300);
  }

  setTimeout(nextCharacter, 800);
}

/* =========================
   Provas (Nível 1 e Nível 2)
   - setupTestInterface: monta a UI dentro do test-area
   - startTestLevel1 / startTestLevel2: lógica dos testes
   - endTest: finalização comum
   ========================= */
function setupTestInterface(title, placeholder){
  if(!testArea || !hiraganaCard) return {};
  hiraganaCard.style.display='none';
  testArea.innerHTML = `
    <div style="text-align:center;">
      <h2>${title}</h2>
      <p id="timer" style="font-size:1.1em;font-weight:bold;color:#ff9900">Preparar...</p>
      <div id="test-display" class="character"></div>
      <input type="text" id="test-answer" placeholder="${placeholder}" style="width:90%;margin:10px 0;">
      <p id="feedback" style="font-weight:bold;min-height:20px"></p>
    </div>
  `;
  return {
    timerEl: document.getElementById('timer'),
    displayEl: document.getElementById('test-display'),
    answerEl: document.getElementById('test-answer'),
    feedbackEl: document.getElementById('feedback')
  };
}

function endTest(score, mode){
  testRunning=false;
  clearTimeout(currentTimer);

  tests++;
  if(testsEl) testsEl.textContent = tests;

  registrarFinalizacaoProva(mode);

  const passed = score >= requiredScore;
  const message = passed ? `🎉 PARABÉNS! Você passou! Acertos: ${score}/${totalQuestions}` : `😥 REPROVADO... Tente novamente! Acertos: ${score}/${totalQuestions}.`;

  if(!testArea) return;
  testArea.innerHTML = `
    <h2>Resultado da Prova</h2>
    <p style="font-size:1.1em;color:${passed? 'limegreen':'red'};">${message}</p>
    <p>Pontuação necessária: ${requiredScore}</p>
  `;
  setTimeout(()=> restoreTestButtons(mode), 5000);
}

function restoreTestButtons(mode){
  if(!testArea || !hiraganaCard) return;
  testArea.innerHTML = `
    <h2>Provas de Nivelamento</h2>
    <button id="start-test-1" class="hiragana-btn">Nível 1 (Caractere Único)</button>
    <button id="start-test-2" class="hiragana-btn">Nível 2 (5-7 Caracteres)</button>
  `;
  hiraganaCard.style.display='block';
  document.getElementById('start-test-1').addEventListener('click', ()=> startTestLevel1(mode));
  document.getElementById('start-test-2').addEventListener('click', ()=> startTestLevel2(mode));
}

function startTestLevel1(mode){
  if(testRunning) return;
  testRunning=true;
  const testElements = setupTestInterface('Nível 1: Caractere Único', 'Responda aqui (3.75s)');
  let correctCount = 0, currentQuestion = 0;
  const testCharacters = shuffle([...letters]);

  function runQuestion(){
    if(currentQuestion >= totalQuestions){ endTest(correctCount, mode); return; }
    currentQuestion++;
    testElements.timerEl.textContent = `Pergunta ${currentQuestion} de ${totalQuestions}`;
    testElements.answerEl.value=''; testElements.answerEl.disabled=false; testElements.feedbackEl.textContent='';

    const currentQ = testCharacters.shift();
    const questionKana = currentQ.romaji;

    let countdown = 3;
    const countdownInterval = setInterval(()=>{
      if(countdown>0){
        testElements.displayEl.textContent = countdown;
        testElements.displayEl.style.color = '#ff9900';
        countdown--;
      } else {
        clearInterval(countdownInterval);
        showCharacter();
      }
    },1000);

    function showCharacter(){
      testElements.displayEl.textContent = currentQ.char;
      testElements.displayEl.style.color = 'white';
      testElements.answerEl.focus();
      currentTimer = setTimeout(()=> checkLevel1Answer(false), 3750);
    }

    testElements.answerEl.onkeyup = (e)=> { if(e.key==='Enter') checkLevel1Answer(true); };

    function checkLevel1Answer(answered){
      clearTimeout(currentTimer);
      testElements.answerEl.disabled = true;
      const userAnswer = testElements.answerEl.value.trim().toLowerCase();
      const isCorrect = userAnswer === questionKana;
      if(isCorrect){
        correctCount++; testElements.feedbackEl.textContent='CORRETO!'; testElements.feedbackEl.style.color='limegreen'; testElements.displayEl.style.color='limegreen';
      } else {
        testElements.feedbackEl.textContent=`ERRADO! Resposta correta: ${questionKana}`; testElements.feedbackEl.style.color='red'; testElements.displayEl.style.color='red';
      }
      setTimeout(runQuestion, 1500);
    }
  }
  runQuestion();
}

function startTestLevel2(mode){
  if(testRunning) return;
  testRunning=true;
  const testElements = setupTestInterface('Nível 2: Múltiplos Caracteres','Digite todos (13s):');
  let correctCount=0, currentQuestion=0;

  function runQuestion(){
    if(currentQuestion >= totalQuestions){ endTest(correctCount, mode); return; }
    currentQuestion++;
    testElements.timerEl.textContent = `Pergunta ${currentQuestion} de ${totalQuestions}`;
    testElements.answerEl.value=''; testElements.answerEl.disabled=false; testElements.feedbackEl.textContent='';

    const count = Math.floor(Math.random()*3)+5; // 5-7
    const questionKanas=[];
    for(let i=0;i<count;i++){ questionKanas.push(letters[Math.floor(Math.random()*letters.length)]); }

    const questionKanaString = questionKanas.map(k=>k.romaji).join('');
    const displayChars = questionKanas.map(k=>k.char).join(' ');

    let countdown = 3;
    const countdownInterval = setInterval(()=>{
      if(countdown>0){ testElements.displayEl.textContent = countdown; testElements.displayEl.style.color = '#ff9900'; countdown--; }
      else { clearInterval(countdownInterval); showCharacters(); }
    },1000);

    function showCharacters(){
      testElements.displayEl.textContent = displayChars;
      testElements.displayEl.style.color='white';
      testElements.answerEl.focus();
      currentTimer = setTimeout(()=> checkLevel2Answer(false), 13000);
    }

    testElements.answerEl.onkeyup = (e)=> { if(e.key==='Enter') checkLevel2Answer(true); };

    function checkLevel2Answer(answered){
      clearTimeout(currentTimer);
      testElements.answerEl.disabled = true;
      const userAnswer = testElements.answerEl.value.trim().toLowerCase();
      const isCorrect = userAnswer === questionKanaString;
      if(isCorrect){
        correctCount++; testElements.feedbackEl.textContent='CORRETO! Você é rápido!'; testElements.feedbackEl.style.color='limegreen'; testElements.displayEl.style.color='limegreen';
      } else {
        testElements.feedbackEl.textContent=`ERRADO! Resposta correta: ${questionKanaString}`; testElements.feedbackEl.style.color='red'; testElements.displayEl.style.color='red';
      }
      setTimeout(runQuestion, 2000);
    }
  }
  runQuestion();
}

/* =========================
   Dark Mode: aplicação imediata + toggle com spin
   - aplicarDarkModeSeNecessario(): aplica estado ao carregar
   - ligarTogglesDarkMode(): liga botão(s) para alternar tema
   ========================= */
function aplicarDarkModeSeNecessario(){
  const isDark = localStorage.getItem(LS_KEYS.darkMode) === 'true';
  if(isDark) document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode');
  document.querySelectorAll('#dark-mode-toggle, .dark-btn').forEach(btn => { if(btn) btn.textContent = isDark ? '☀️' : '🌙'; });
}

function ligarTogglesDarkMode(){
  const toggles = document.querySelectorAll('#dark-mode-toggle, .dark-btn');
  // remove listeners duplicados substituindo nós
  toggles.forEach(btn => { const clone = btn.cloneNode(true); btn.parentNode.replaceChild(clone, btn); });
  // rebind
  document.querySelectorAll('#dark-mode-toggle, .dark-btn').forEach(toggleBtn =>{
    toggleBtn.addEventListener('click', ()=>{
      // spin visual
      toggleBtn.classList.add('spin');
      // overlay de transição
      document.body.classList.add('mode-switching');
      setTimeout(()=> document.body.classList.remove('mode-switching'), 350);
      // trocamos o tema um pouco antes do fim da rotação
      setTimeout(()=>{
        const isDarkNow = document.body.classList.toggle('dark-mode');
        localStorage.setItem(LS_KEYS.darkMode, isDarkNow);
        document.querySelectorAll('#dark-mode-toggle, .dark-btn').forEach(btn => { btn.textContent = isDarkNow ? '☀️' : '🌙'; });
      }, 220);
      // remove spin após animação
      setTimeout(()=> toggleBtn.classList.remove('spin'), 700);
    });
  });
}

/* =========================
   Helpers de inicialização / detecção de página
   - detectarModo(): lê data-mode no <body>
   - ligarStartKatakanaSeNecessario(): caso index use <button id="start-katakana">
   ========================= */
function detectarModo(){
  const bodyMode = document.body && document.body.dataset && document.body.dataset.mode;
  if(bodyMode==='hiragana') return 'hiragana';
  if(bodyMode==='katakana') return 'katakana';
  return null;
}

function ligarStartKatakanaSeNecessario(){
  const startKatBtn = document.getElementById('start-katakana');
  if(startKatBtn) startKatBtn.addEventListener('click', ()=> { window.location.href='katakana.html'; });
}

/* =========================
   Inicialização quando DOM estiver pronto
   - aplica dark mode salvo
   - atualiza index
   - se estiver em página de treino (hiragana/katakana) inicializa treino
   - liga botões com cuidado (evita múltiplos listeners)
   ========================= */
document.addEventListener('DOMContentLoaded', ()=>{
  // 1) Dark mode e bind do toggle
  aplicarDarkModeSeNecessario();
  ligarTogglesDarkMode();
  // 2) redirecionamento alternativo (index)
  ligarStartKatakanaSeNecessario();
  // 3) atualiza spans da index
  atualizarDisplaysIndex();

  // 4) detecta modo (hiragana/katakana)
  const mode = detectarModo();
  if(!mode) return; // index.php ou outra página - nada de treino

  // 5) Seleciona elementos da página de treino (podem não existir se html diferente)
  charEl = document.getElementById('character');
  answerEl = document.getElementById('answer');
  nextBtn = document.getElementById('next-btn');
  knownEl = document.getElementById('known');
  unknownEl = document.getElementById('unknown');
  testsEl = document.getElementById('tests');
  testArea = document.querySelector('.test-area');
  hiraganaCard = document.querySelector('.hiragana-card');
  startTest1Btn = document.getElementById('start-test-1');
  startTest2Btn = document.getElementById('start-test-2');

  // 6) Prepara o conjunto de letras (backup + shuffle)
  lettersBackup = (mode === 'hiragana') ? HIRAGANA_LETTERS.slice() : KATAKANA_LETTERS.slice();
  letters = shuffle(lettersBackup.slice());

  // 7) inicializa variáveis de estatística
  known = 0;
  unknown = lettersBackup.length;
  const storedTests = parseInt(localStorage.getItem(mode === 'hiragana' ? LS_KEYS.hiragana_tests : LS_KEYS.katakana_tests) || '0', 10);
  tests = storedTests;

  if(knownEl) knownEl.textContent = known;
  if(unknownEl) unknownEl.textContent = unknown;
  if(testsEl) testsEl.textContent = tests;

  // 8) Bind seguro dos listeners (recria nós para evitar listeners duplicados)
  if(nextBtn){
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', ()=> checkAnswer(mode));
  }
  if(answerEl){
    answerEl.replaceWith(answerEl.cloneNode(true));
    answerEl = document.getElementById('answer');
    answerEl.addEventListener('keyup', e=> { if(e.key==='Enter') checkAnswer(mode); });
  }
  if(startTest1Btn && startTest2Btn){
    startTest1Btn.replaceWith(startTest1Btn.cloneNode(true));
    startTest2Btn.replaceWith(startTest2Btn.cloneNode(true));
    startTest1Btn = document.getElementById('start-test-1');
    startTest2Btn = document.getElementById('start-test-2');
    startTest1Btn.addEventListener('click', ()=> startTestLevel1(mode));
    startTest2Btn.addEventListener('click', ()=> startTestLevel2(mode));
  }

  // 9) inicia o treino mostrando o primeiro caractere
  if(charEl) nextCharacter();
});

/* =========================
   Sincronização entre abas:
   - quando localStorage muda em outra aba, atualiza os displays automaticamente
   ========================= */
window.addEventListener('storage', (e)=>{
  if(!e.key) return;
  const keysOfInterest = Object.values(LS_KEYS);
  if(keysOfInterest.includes(e.key)){
    atualizarDisplaysIndex();
    const mode = detectarModo();
    if(mode && document.getElementById('tests')){
      const testsKey = (mode==='katakana') ? LS_KEYS.katakana_tests : LS_KEYS.hiragana_tests;
      document.getElementById('tests').textContent = localStorage.getItem(testsKey) || '0';
    }
  }
});

/* =========================
   FIM do script.js
   - Pontos fáceis de customizar:
     * Adicionar caracteres/romaji nos arrays no topo
     * Ajustar totalQuestions / requiredScore
     * Mudar chaves do localStorage (LS_KEYS)
     * Adicionar autenticação/servidor no futuro (para contagem global)
   - Para novas páginas de treino, crie HTML idêntico (body data-mode="...") e
     mantenha ids: character, answer, next-btn, start-test-1, start-test-2, known, unknown, tests
   ========================= */
