// script.js
// Versão unificada para Hiragana + Katakana + index interactions.
// Mantive comentários explicativos para você se localizar :) <3

// ====== CHAVES DO localStorage ======
const LS_KEYS = {
  hiragana: 'duppon_vezes_hiragana',
  hiragana_tests: 'duppon_vezes_hiragana_tests',
  katakana: 'duppon_vezes_katakana',
  katakana_tests: 'duppon_vezes_katakana_tests',
  particles: 'duppon_vezes_particles',
  darkMode: 'darkMode'
};

// ====== UTILITÁRIOS localStorage ======
function getCount(key) {
  return parseInt(localStorage.getItem(key) || '0', 10);
}
function setCount(key, value) {
  localStorage.setItem(key, String(value));
}
function incrementCount(key) {
  const current = getCount(key);
  setCount(key, current + 1);
  return current + 1;
}

// ====== Atualiza displays index (se existir) ======
function atualizarDisplaysIndex() {
  const elH = document.getElementById('vezes-hiragana');
  const elK = document.getElementById('vezes-katakana');
  const elP = document.getElementById('vezes-particles');
  if (elH) elH.textContent = getCount(LS_KEYS.hiragana);
  if (elK) elK.textContent = getCount(LS_KEYS.katakana);
  if (elP) elP.textContent = getCount(LS_KEYS.particles);
}

// ====== Conjuntos de letras (editar aqui para adicionar/alterar) ======
const HIRAGANA_LETTERS = [
  { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
  { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
  { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
  { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
  { char: 'や', romaji: 'ya' }, { char: 'ゆ', romaji: 'yu' }, { char: 'よ', romaji: 'yo' },
  { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
  { char: 'わ', romaji: 'wa' }, { char: 'を', romaji: 'wo' }, { char: 'ん', romaji: 'n' }
];

const KATAKANA_LETTERS = [
  { char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' },
  { char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' },
  { char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' },
  { char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' },
  { char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' },
  { char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' },
  { char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' },
  { char: 'ヤ', romaji: 'ya' }, { char: 'ユ', romaji: 'yu' }, { char: 'ヨ', romaji: 'yo' },
  { char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' },
  { char: 'ワ', romaji: 'wa' }, { char: 'ヲ', romaji: 'wo' }, { char: 'ン', romaji: 'n' }
];

// ====== Shuffle simples ======
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ====== Estado compartilhado e elementos (inicializados no DOMContentLoaded) ======
let letters = [];
let lettersBackup = [];
let currentCharacter = null;
let streaks = {};
let known = 0;
let unknown = 46;
let tests = 0;

let charEl = null;
let answerEl = null;
let nextBtn = null;
let knownEl = null;
let unknownEl = null;
let testsEl = null;
let testArea = null;
let hiraganaCard = null;
let startTest1Btn = null;
let startTest2Btn = null;

let testRunning = false;
let currentTimer = null;
const totalQuestions = 20;
const requiredScore = Math.round(totalQuestions * 0.80);

// ====== Funções para registrar "Vezes feitas" (usa chave por modo) ======
function usarCardDireitaRegistrar(mode) {
  const key = mode === 'katakana' ? LS_KEYS.katakana : LS_KEYS.hiragana;
  try { incrementCount(key); } catch (e) { console.warn(e); }
  atualizarDisplaysIndex();
}
function registrarFinalizacaoProva(mode) {
  const key = mode === 'katakana' ? LS_KEYS.katakana : LS_KEYS.hiragana;
  const testKey = mode === 'katakana' ? LS_KEYS.katakana_tests : LS_KEYS.hiragana_tests;
  incrementCount(key);
  const currentTests = parseInt(localStorage.getItem(testKey) || '0', 10) + 1;
  localStorage.setItem(testKey, String(currentTests));
  atualizarDisplaysIndex();
  if (testsEl) testsEl.textContent = currentTests;
}

// ====== Treino normal (Anki-like) ======
function nextCharacter() {
  if (charEl) charEl.style.color = '';
  currentCharacter = letters.shift();
  if (!currentCharacter) {
    letters = shuffle(lettersBackup.slice());
    currentCharacter = letters.shift();
  }
  if (charEl) charEl.textContent = currentCharacter.char;
  if (answerEl) { answerEl.value = ''; answerEl.focus(); }
}

function checkAnswer(mode) {
  if (testRunning) return;
  const userAnswer = (answerEl && answerEl.value.trim().toLowerCase()) || '';
  const correctRomaji = currentCharacter.romaji;

  if (userAnswer === correctRomaji) {
    if (charEl) charEl.style.color = 'limegreen';
    if (!streaks[correctRomaji]) streaks[correctRomaji] = 0;
    streaks[correctRomaji]++;
    if (streaks[correctRomaji] === 3) { known++; unknown--; }
    letters.push(currentCharacter);
  } else {
    if (charEl) charEl.style.color = 'red';
    streaks[correctRomaji] = 0;
    letters.splice(2, 0, currentCharacter);
  }

  if (knownEl) knownEl.textContent = known;
  if (unknownEl) unknownEl.textContent = unknown;

  if (nextBtn) {
    nextBtn.disabled = true;
    usarCardDireitaRegistrar(mode);
    setTimeout(() => { nextBtn.disabled = false; }, 300);
  }

  setTimeout(nextCharacter, 800);
}

// ====== Interface de provas (comum) ======
function setupTestInterface(title, placeholder) {
  if (!testArea || !hiraganaCard) return {};
  hiraganaCard.style.display = 'none';
  testArea.innerHTML = `
    <div style="text-align:center;">
      <h2>${title}</h2>
      <p id="timer" style="font-size:1.1em; font-weight:bold; color:#ff9900;">Preparar...</p>
      <div id="test-display" class="character"></div>
      <input type="text" id="test-answer" placeholder="${placeholder}" style="width:90%; margin:10px 0;">
      <p id="feedback" style="font-weight:bold; min-height:20px;"></p>
    </div>
  `;
  return {
    timerEl: document.getElementById('timer'),
    displayEl: document.getElementById('test-display'),
    answerEl: document.getElementById('test-answer'),
    feedbackEl: document.getElementById('feedback')
  };
}

function endTest(score, mode) {
  testRunning = false;
  clearTimeout(currentTimer);

  tests++;
  if (testsEl) testsEl.textContent = tests;

  registrarFinalizacaoProva(mode);

  let passed = score >= requiredScore;
  let message = passed ?
    `🎉 PARABÉNS! Você passou! Acertos: ${score}/${totalQuestions}` :
    `😥 REPROVADO... Tente novamente! Acertos: ${score}/${totalQuestions}.`;

  if (!testArea) return;
  testArea.innerHTML = `
    <h2>Resultado da Prova</h2>
    <p style="font-size:1.1em; color:${passed ? 'limegreen' : 'red'};">${message}</p>
    <p>Pontuação necessária: ${requiredScore}</p>
  `;
  setTimeout(() => restoreTestButtons(mode), 5000);
}

function restoreTestButtons(mode) {
  if (!testArea || !hiraganaCard) return;
  testArea.innerHTML = `
    <h2>Provas de Nivelamento</h2>
    <button id="start-test-1" class="hiragana-btn">Nível 1 (Caractere Único)</button>
    <button id="start-test-2" class="hiragana-btn">Nível 2 (5-7 Caracteres)</button>
  `;
  hiraganaCard.style.display = 'block';
  document.getElementById('start-test-1').addEventListener('click', () => startTestLevel1(mode));
  document.getElementById('start-test-2').addEventListener('click', () => startTestLevel2(mode));
}

// ====== Teste nível 1 e 2 (reaproveitados) ======
function startTestLevel1(mode) {
  if (testRunning) return;
  testRunning = true;
  const testElements = setupTestInterface('Nível 1: Caractere Único', 'Responda aqui (3.75s)');
  let correctCount = 0;
  let currentQuestion = 0;
  const testCharacters = shuffle([...letters]);

  function runQuestion() {
    if (currentQuestion >= totalQuestions) { endTest(correctCount, mode); return; }
    currentQuestion++;
    testElements.timerEl.textContent = `Pergunta ${currentQuestion} de ${totalQuestions}`;
    testElements.answerEl.value = '';
    testElements.answerEl.disabled = false;
    testElements.feedbackEl.textContent = '';
    const currentQ = testCharacters.shift();
    let questionKana = currentQ.romaji;

    let countdown = 3;
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        testElements.displayEl.textContent = countdown;
        testElements.displayEl.style.color = '#ff9900';
        countdown--;
      } else {
        clearInterval(countdownInterval);
        showCharacter();
      }
    }, 1000);

    function showCharacter() {
      testElements.displayEl.textContent = currentQ.char;
      testElements.displayEl.style.color = 'white';
      testElements.answerEl.focus();
      currentTimer = setTimeout(() => { checkLevel1Answer(false); }, 3750);
    }

    testElements.answerEl.onkeyup = (event) => { if (event.key === 'Enter') checkLevel1Answer(true); };

    function checkLevel1Answer(answered) {
      clearTimeout(currentTimer);
      testElements.answerEl.disabled = true;
      const userAnswer = testElements.answerEl.value.trim().toLowerCase();
      const isCorrect = userAnswer === questionKana;
      if (isCorrect) {
        correctCount++;
        testElements.feedbackEl.textContent = 'CORRETO!';
        testElements.feedbackEl.style.color = 'limegreen';
        testElements.displayEl.style.color = 'limegreen';
      } else {
        testElements.feedbackEl.textContent = `ERRADO! Resposta correta: ${questionKana}`;
        testElements.feedbackEl.style.color = 'red';
        testElements.displayEl.style.color = 'red';
      }
      setTimeout(runQuestion, 1500);
    }
  }
  runQuestion();
}

function startTestLevel2(mode) {
  if (testRunning) return;
  testRunning = true;
  const testElements = setupTestInterface('Nível 2: Múltiplos Caracteres', 'Digite todos (13s):');
  let correctCount = 0;
  let currentQuestion = 0;

  function runQuestion() {
    if (currentQuestion >= totalQuestions) { endTest(correctCount, mode); return; }
    currentQuestion++;
    testElements.timerEl.textContent = `Pergunta ${currentQuestion} de ${totalQuestions}`;
    testElements.answerEl.value = '';
    testElements.answerEl.disabled = false;
    testElements.feedbackEl.textContent = '';

    const count = Math.floor(Math.random() * 3) + 5; // 5-7
    const questionKanas = [];
    for (let i = 0; i < count; i++) {
      const item = letters[Math.floor(Math.random() * letters.length)];
      questionKanas.push(item);
    }

    const questionKanaString = questionKanas.map(k => k.romaji).join('');
    const displayChars = questionKanas.map(k => k.char).join(' ');

    let countdown = 3;
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        testElements.displayEl.textContent = countdown;
        testElements.displayEl.style.color = '#ff9900';
        countdown--;
      } else {
        clearInterval(countdownInterval);
        showCharacters();
      }
    }, 1000);

    function showCharacters() {
      testElements.displayEl.textContent = displayChars;
      testElements.displayEl.style.color = 'white';
      testElements.answerEl.focus();
      currentTimer = setTimeout(() => { checkLevel2Answer(false); }, 13000);
    }

    testElements.answerEl.onkeyup = (event) => { if (event.key === 'Enter') checkLevel2Answer(true); };

    function checkLevel2Answer(answered) {
      clearTimeout(currentTimer);
      testElements.answerEl.disabled = true;
      const userAnswer = testElements.answerEl.value.trim().toLowerCase();
      const isCorrect = userAnswer === questionKanaString;
      if (isCorrect) {
        correctCount++;
        testElements.feedbackEl.textContent = 'CORRETO! Você é rápido!';
        testElements.feedbackEl.style.color = 'limegreen';
        testElements.displayEl.style.color = 'limegreen';
      } else {
        testElements.feedbackEl.textContent = `ERRADO! Resposta correta: ${questionKanaString}`;
        testElements.feedbackEl.style.color = 'red';
        testElements.displayEl.style.color = 'red';
      }
      setTimeout(runQuestion, 2000);
    }
  }
  runQuestion();
}

// ====== Detecção e inicialização robusta (usa data-mode no <body>) ======
// Aplica dark mode no load e atualiza os ícones nos botões
function aplicarDarkModeSeNecessario() {
  const isDark = localStorage.getItem(LS_KEYS.darkMode) === 'true';
  if (isDark) document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode');
  // Atualiza texto/ícone em todos os botões de toggle que existirem na página
  document.querySelectorAll('#dark-mode-toggle, .dark-btn').forEach(btn => {
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
  });
}

// Dark mode: toggle com spin + transição suave
function ligarTogglesDarkMode() {
  // Seleciona botões que podem existir em diferentes páginas
  const toggles = document.querySelectorAll('#dark-mode-toggle, .dark-btn');

  // Para evitar múltiplos listeners, removemos listeners existentes substituindo os nós
  toggles.forEach(btn => {
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
  });

  // Re-seleciona nós (agora sem listeners duplicados)
  document.querySelectorAll('#dark-mode-toggle, .dark-btn').forEach(toggleBtn => {
    // Clique -> aplica animação de giro e alterna o tema
    toggleBtn.addEventListener('click', () => {
      // 1) Adiciona a classe que faz o spin (CSS .spin)
      toggleBtn.classList.add('spin');

      // 2) Breve efeito de "modo trocando" no body para dar sensação de transição
      document.body.classList.add('mode-switching');
      // remove a classe depois do breve delay
      setTimeout(() => { document.body.classList.remove('mode-switching'); }, 350);

      // 3) Espera o tempo parcial da rotação para trocar o ícone (sincroniza visual)
      setTimeout(() => {
        const isDarkNow = document.body.classList.toggle('dark-mode');
        // salva estado
        localStorage.setItem(LS_KEYS.darkMode, isDarkNow);
        // atualiza o texto/ícone de TODOS os toggles na página
        document.querySelectorAll('#dark-mode-toggle, .dark-btn').forEach(btn => {
          btn.textContent = isDarkNow ? '☀️' : '🌙';
        });
      }, 220); // troca o ícone um pouco antes do fim da rotação para parecer fluido

      // 4) Remove a classe .spin após a animação terminar (para permitir reuso)
      setTimeout(() => {
        toggleBtn.classList.remove('spin');
      }, 700);
    });
  });
}

// Caso o index tenha um botão (button) para iniciar katakana em vez de link, liga o redirecionamento
function ligarStartKatakanaSeNecessario() {
  const startKatBtn = document.getElementById('start-katakana');
  if (startKatBtn) startKatBtn.addEventListener('click', () => { window.location.href = 'katakana.html'; });
}

// Detecta modo via data-mode ou fallback
function detectarModo() {
  const bodyMode = document.body && document.body.dataset && document.body.dataset.mode;
  if (bodyMode === 'hiragana') return 'hiragana';
  if (bodyMode === 'katakana') return 'katakana';
  return null;
}

// Inicialização principal
document.addEventListener('DOMContentLoaded', () => {
  aplicarDarkModeSeNecessario();
  ligarTogglesDarkMode();
  ligarStartKatakanaSeNecessario();
  atualizarDisplaysIndex();

  const mode = detectarModo();
  if (!mode) return; // se for index ou outra página sem treino, não inicializa treino

  // Seleciona elementos da página de treino
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

  // Prepara o conjunto de letras
  lettersBackup = (mode === 'hiragana') ? HIRAGANA_LETTERS.slice() : KATAKANA_LETTERS.slice();
  letters = shuffle(lettersBackup.slice());

  known = 0;
  unknown = lettersBackup.length;
  const storedTests = parseInt(localStorage.getItem(mode === 'hiragana' ? LS_KEYS.hiragana_tests : LS_KEYS.katakana_tests) || '0', 10);
  tests = storedTests;

  if (knownEl) knownEl.textContent = known;
  if (unknownEl) unknownEl.textContent = unknown;
  if (testsEl) testsEl.textContent = tests;

  // Bind seguro dos listeners (recria nós para evitar listeners duplicados)
  if (nextBtn) {
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    nextBtn = document.getElementById('next-btn');
    nextBtn.addEventListener('click', () => checkAnswer(mode));
  }
  if (answerEl) {
    answerEl.replaceWith(answerEl.cloneNode(true));
    answerEl = document.getElementById('answer');
    answerEl.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkAnswer(mode); });
  }
  if (startTest1Btn && startTest2Btn) {
    startTest1Btn.replaceWith(startTest1Btn.cloneNode(true));
    startTest2Btn.replaceWith(startTest2Btn.cloneNode(true));
    startTest1Btn = document.getElementById('start-test-1');
    startTest2Btn = document.getElementById('start-test-2');
    startTest1Btn.addEventListener('click', () => startTestLevel1(mode));
    startTest2Btn.addEventListener('click', () => startTestLevel2(mode));
  }

  // Inicia o treino
  if (charEl) nextCharacter();
});

// ====== Sincronização entre abas (atualiza index se algo mudar em outra aba) ======
window.addEventListener('storage', (e) => {
  if (!e.key) return;
  const keysOfInterest = Object.values(LS_KEYS);
  if (keysOfInterest.includes(e.key)) {
    atualizarDisplaysIndex();
    // Atualiza contador de tests na página de treino (se aplicável)
    const mode = detectarModo();
    if (mode && document.getElementById('tests')) {
      const testsKey = (mode === 'katakana') ? LS_KEYS.katakana_tests : LS_KEYS.hiragana_tests;
      document.getElementById('tests').textContent = localStorage.getItem(testsKey) || '0';
    }
  }
});
