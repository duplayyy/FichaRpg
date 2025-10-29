let known = 0;
let unknown = 46;
let tests = 0;

const knownEl = document.getElementById('known');
const unknownEl = document.getElementById('unknown');
const testsEl = document.getElementById('tests');
const charEl = document.getElementById('character');
const answerEl = document.getElementById('answer');
const nextBtn = document.getElementById('next-btn');

const letters = [
  { char: 'あ', romaji: 'a' },
  { char: 'い', romaji: 'i' },
  { char: 'う', romaji: 'u' },
  { char: 'え', romaji: 'e' },
  { char: 'お', romaji: 'o' }
  // aqui você pode colocar o resto das 46
];

let current = 0;
let streaks = {}; // guarda quantas vezes o usuário acertou cada caractere

function showLetter() {
  charEl.textContent = letters[current].char;
}

function checkAnswer() {
  tests++;
  testsEl.textContent = tests;

  const userAnswer = answerEl.value.trim().toLowerCase();
  const correct = letters[current].romaji;

  if (userAnswer === correct) {
    if (!streaks[correct]) streaks[correct] = 0;
    streaks[correct]++;

    if (streaks[correct] === 3) {
      known++;
      unknown--;
    }
  }

  knownEl.textContent = known;
  unknownEl.textContent = unknown;

  answerEl.value = '';
  current = (current + 1) % letters.length;
  showLetter();
}

nextBtn.addEventListener('click', checkAnswer);

showLetter();
