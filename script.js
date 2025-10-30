// ===== HIRAGANA PAGE - CÓDIGO MODIFICADO COM PROVAS =====

// Variáveis de Status
let known = 0;
let unknown = 46;
let tests = 0; // Contagem de provas finalizadas

// Elementos HTML (Busca única no início)
const knownEl = document.getElementById('known');
const unknownEl = document.getElementById('unknown');
const testsEl = document.getElementById('tests');
const charEl = document.getElementById('character');
const answerEl = document.getElementById('answer');
const nextBtn = document.getElementById('next-btn');

// --- VARIÁVEIS E ELEMENTOS DE PROVA ---
const testArea = document.querySelector('.test-area');
const hiraganaCard = document.querySelector('.hiragana-card');
let startTest1Btn = document.getElementById('start-test-1');
let startTest2Btn = document.getElementById('start-test-2');

const totalQuestions = 20;
const requiredScore = Math.round(totalQuestions * 0.80); // 80% de 20 = 16

let testRunning = false; // Indica se uma prova está em andamento
let currentTimer = null; // Para controlar o setTimeout/setInterval

// Função para Embaralhar (Shuffle)
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Lista completa de Hiragana
let letters = shuffle([
    // Coluna A (Vogais)
    { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
    // Coluna K
    { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
    // Coluna S
    { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
    // Coluna T
    { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
    // Coluna N
    { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
    // Coluna H
    { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
    // Coluna M
    { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
    // Coluna Y (tem apenas 3 sons)
    { char: 'や', romaji: 'ya' }, { char: 'ゆ', romaji: 'yu' }, { char: 'よ', romaji: 'yo' },
    // Coluna R
    { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
    // Coluna W (tem apenas 2 sons mais o 'n')
    { char: 'わ', romaji: 'wa' }, { char: 'を', romaji: 'wo' }, 
    { char: 'ん', romaji: 'n' } // N final
]);


let currentCharacter; 
let streaks = {};


// --- FUNÇÕES DO MODO DE TREINO NORMAL (Anki) ---

function nextCharacter() {
    // Passo 4 - Resetar a cor para o CSS definir (branco/preto)
    charEl.style.color = ''; 
    
    currentCharacter = letters.shift(); 
    
    if (!currentCharacter) {
        // Reinicia a lista para não parar o treino
        letters = shuffle([ /* Cole a lista completa de volta aqui ou use uma cópia da original */ ]);
        currentCharacter = letters.shift();
    }

    charEl.textContent = currentCharacter.char;
    answerEl.value = ''; 
    answerEl.focus(); 
}

function checkAnswer() {
    if (testRunning) return; // Não checa no modo prova

    const userAnswer = answerEl.value.trim().toLowerCase();
    const correctRomaji = currentCharacter.romaji; 

    // --- Lógica da Cor e Sistema Anki ---
    if (userAnswer === correctRomaji) {
      charEl.style.color = 'limegreen'; 

      if (!streaks[correctRomaji]) streaks[correctRomaji] = 0;
      streaks[correctRomaji]++;

      if (streaks[correctRomaji] === 3) {
        known++;
        unknown--;
      }
      
      letters.push(currentCharacter);
      
    } else {
      charEl.style.color = 'red'; 
      streaks[correctRomaji] = 0; 
      letters.splice(2, 0, currentCharacter); 
    }
    // ----------------------------------------------------

    knownEl.textContent = known;
    unknownEl.textContent = unknown;

    setTimeout(nextCharacter, 800); 
}

// --- FUNÇÕES DE PROVA ---

// Prepara a interface da prova no stats-box/test-area
function setupTestInterface(title, placeholder) {
    hiraganaCard.style.display = 'none'; // Esconde o card de treino
    testArea.innerHTML = `
        <div style="text-align:center;">
            <h2>${title}</h2>
            <p id="timer" style="font-size: 1.2em; font-weight: bold; color: #ff9900;">Preparar...</p>
            <div id="test-display" class="character"></div>
            <input type="text" id="test-answer" placeholder="${placeholder}" style="width: 90%; margin: 10px 0;">
            <p id="feedback" style="font-weight: bold; min-height: 20px;"></p>
        </div>
    `;
    return {
        timerEl: document.getElementById('timer'),
        displayEl: document.getElementById('test-display'),
        answerEl: document.getElementById('test-answer'),
        feedbackEl: document.getElementById('feedback')
    };
}

// Função de Finalização de Prova (Comum aos dois níveis)
function endTest(score) {
    testRunning = false;
    clearTimeout(currentTimer);

    // Incrementa o contador 'tests'
    tests++;
    testsEl.textContent = tests;
    
    // Lógica de aprovação/reprovação
    let passed = score >= requiredScore;
    let message = passed ? 
        `🎉 PARABÉNS! Você passou! Acertos: ${score}/${totalQuestions}` : 
        `😥 REPROVADO... Tente novamente! Acertos: ${score}/${totalQuestions}.`;

    // Mostra o resultado na tela do test-area
    testArea.innerHTML = `
        <h2>Resultado da Prova</h2>
        <p style="font-size: 1.1em; color: ${passed ? 'limegreen' : 'red'};">${message}</p>
        <p>Pontuação necessária: ${requiredScore}</p>
    `;

    // Mostra o card de treino normal e restaura os botões de prova
    setTimeout(restoreTestButtons, 5000); 
}

// Restaura os botões de prova após o resultado
function restoreTestButtons() {
    testArea.innerHTML = `
        <h2>Provas de Nivelamento</h2>
        <button id="start-test-1" class="hiragana-btn">Nível 1 (Caractere Único)</button>
        <button id="start-test-2" class="hiragana-btn">Nível 2 (5-7 Caracteres)</button>
    `;
    hiraganaCard.style.display = 'block'; // Mostra o card de treino
    
    // Re-adiciona os event listeners aos novos botões
    document.getElementById('start-test-1').addEventListener('click', startTestLevel1);
    document.getElementById('start-test-2').addEventListener('click', startTestLevel2);
}

// --- TESTE DE NÍVEL 1 (Caractere Único) ---
function startTestLevel1() {
    if (testRunning) return;
    testRunning = true;

    const testElements = setupTestInterface('Nível 1: Caractere Único', 'Responda aqui (3.75s)');
    
    let correctCount = 0;
    let currentQuestion = 0;
    let questionKana = '';

    const testCharacters = shuffle([...letters]); // Cria uma cópia embaralhada

    function runQuestion() {
        if (currentQuestion >= totalQuestions) {
            endTest(correctCount);
            return;
        }

        currentQuestion++;
        testElements.timerEl.textContent = `Pergunta ${currentQuestion} de ${totalQuestions}`;
        testElements.answerEl.value = '';
        testElements.answerEl.disabled = false;
        testElements.feedbackEl.textContent = '';
        
        const currentQ = testCharacters.shift();
        questionKana = currentQ.romaji;
        
        // 1. Contagem Regressiva de 3 segundos (Visual)
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
            testElements.displayEl.style.color = 'white'; // Cor padrão da prova
            testElements.answerEl.focus();

            // 2. Timer de Resposta (3.75 segundos)
            currentTimer = setTimeout(() => {
                checkLevel1Answer(false); // Tempo esgotado
            }, 3750);
        }

        // Checa resposta ao pressionar Enter
        testElements.answerEl.onkeyup = (event) => {
            if (event.key === 'Enter') {
                checkLevel1Answer(true);
            }
        };

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

            // Próxima pergunta após 1.5 segundos
            setTimeout(runQuestion, 1500);
        }
    }
    runQuestion();
}

// --- TESTE DE NÍVEL 2 (Múltiplos Caracteres) ---
function startTestLevel2() {
    if (testRunning) return;
    testRunning = true;

    const testElements = setupTestInterface('Nível 2: Múltiplos Caracteres', 'Digite todos (13s):');
    
    let correctCount = 0;
    let currentQuestion = 0;
    let questionKanaString = ''; // Ex: 'katsushiso'
    const testCharacters = shuffle([...letters]);

    function runQuestion() {
        if (currentQuestion >= totalQuestions) {
            endTest(correctCount);
            return;
        }

        currentQuestion++;
        testElements.timerEl.textContent = `Pergunta ${currentQuestion} de ${totalQuestions}`;
        testElements.answerEl.value = '';
        testElements.answerEl.disabled = false;
        testElements.feedbackEl.textContent = '';
        
        // Gera 5 a 7 caracteres
        const count = Math.floor(Math.random() * 3) + 5; // 5, 6 ou 7
        const questionKanas = [];
        for (let i = 0; i < count; i++) {
            // Pega um item aleatório da lista completa
            const item = letters[Math.floor(Math.random() * letters.length)];
            questionKanas.push(item);
        }

        questionKanaString = questionKanas.map(k => k.romaji).join('');
        const displayChars = questionKanas.map(k => k.char).join(' ');
        
        // 1. Contagem Regressiva de 3 segundos
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

            // 2. Timer de Resposta (13 segundos)
            currentTimer = setTimeout(() => {
                checkLevel2Answer(false); // Tempo esgotado
            }, 13000);
        }
        
        // Checa resposta ao pressionar Enter (ou quando o timer acabar)
        testElements.answerEl.onkeyup = (event) => {
            if (event.key === 'Enter') {
                checkLevel2Answer(true);
            }
        };

        function checkLevel2Answer(answered) {
            clearTimeout(currentTimer);
            testElements.answerEl.disabled = true;

            const userAnswer = testElements.answerEl.value.trim().toLowerCase();
            // Regra: Se errar um único caractere, todos dão como errados
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

            // Próxima pergunta após 2 segundos
            setTimeout(runQuestion, 2000);
        }
    }
    runQuestion();
}


// --- INICIALIZAÇÃO e EVENT LISTENERS ---

// Event Listeners do modo de treino normal
if (nextBtn) {
    nextBtn.addEventListener('click', checkAnswer);
    answerEl.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
}


// Event Listeners dos botões de prova
if (startTest1Btn && startTest2Btn) {
    startTest1Btn.addEventListener('click', startTestLevel1);
    startTest2Btn.addEventListener('click', startTestLevel2);
}

// Inicia o treino normal ao carregar a página
if (charEl) {
    nextCharacter();
}

// ===== DARK MODE =====
// ... Mantenha seu código original de Dark Mode aqui ...

// ... CÓDIGO DO DARK MODE (sem alterações) ...

// ===== DARK MODE =====
const toggleBtn = document.getElementById('dark-mode-toggle');

if (toggleBtn) {
  // 1️⃣ Verifica o modo salvo no localStorage
  const darkModeEnabled = localStorage.getItem('darkMode') === 'true';

  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️';
  }

  // 2️⃣ Ao clicar, alterna o modo e salva no localStorage
  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');

    if (isDark) {
      toggleBtn.textContent = '☀️';
    } else {
      toggleBtn.textContent = '🌙';
    }

    // Salva a escolha do usuário
    localStorage.setItem('darkMode', isDark);
  });
}
