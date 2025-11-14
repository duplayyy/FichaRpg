// =============================
//  LOGIN E FIREBASE (｡•̀ᴗ-)✧
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCcgm_yaHJMIWrweQC04Ga3NR6mU-rCwzM",
  authDomain: "duppon-bf5dd.firebaseapp.com",
  projectId: "duppon-bf5dd",
  storageBucket: "duppon-bf5dd.firebasestorage.app",
  messagingSenderId: "37968316933",
  appId: "1:37968316933:web:72666305b63e4294d92a6c",
  measurementId: "G-N8B31BSHMY",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =============================
//  TROCA ENTRE LOGIN E REGISTRO
// =============================
const loginCard = document.getElementById("login-card");
const registerCard = document.getElementById("register-card");
const createAccountBtn = document.getElementById("create-account-btn");
const backToLoginBtn = document.getElementById("back-to-login-btn");

createAccountBtn?.addEventListener("click", () => {
  loginCard.style.display = "none";
  registerCard.style.display = "block";
});

backToLoginBtn?.addEventListener("click", () => {
  registerCard.style.display = "none";
  loginCard.style.display = "block";
});

// =============================
//  CRIAÇÃO DE CONTA (REGISTRO)
// =============================
const signupForm = document.getElementById("signup-form");

signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const displayName = document.getElementById("display-name").value;
  const uniqueNick = document.getElementById("unique-nick").value;

  if (password !== confirmPassword) {
    alert("As senhas não coincidem! (｀д´)");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    await setDoc(doc(db, "usuarios", user.uid), {
      nome: displayName,
      nick: uniqueNick,
      email: email,
      progresso: {},
      criadoEm: new Date()
    });

    alert("Conta criada! Verifique seu e-mail antes de fazer login. ✉️");
    registerCard.style.display = "none";
    loginCard.style.display = "block";
  } catch (error) {
    console.error(error);
    alert("Erro ao criar conta: " + error.message);
  }
});

// preview da foto de perfil + armazena o File pra upload
let selectedProfileFile = null;
const inputProfile = document.getElementById('profile-pic');
const previewImg = document.getElementById('profile-pic-preview');
const uploadLabel = document.querySelector('.upload-label');

if (inputProfile && previewImg) {
  inputProfile.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      previewImg.style.display = 'none';
      selectedProfileFile = null;
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Escolha uma imagem válida.');
      return;
    }
    selectedProfileFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewImg.classList.add("show");
      // esconder câmera (opcional)
      const cam = uploadLabel.querySelector('.camera-icon');
      if (cam) cam.style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  // clique também no container abre o input (mais UX)
  document.querySelector('.profile-pic-container').addEventListener('click', ()=> {
    inputProfile.click();
  });
}

// pré-visualização da imagem de perfil
const profilePicInput = document.getElementById("profile-pic");
const profilePicPreview = document.getElementById("profile-pic-preview");

profilePicInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePicPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});


// =============================
//  LOGIN COM EMAIL E SENHA
// =============================
const loginBtn = document.getElementById("email-login");

loginBtn?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("Verifique seu e-mail antes de entrar! ✉️");
      return;
    }

    alert(`Bem-vindo de volta, ${user.email}! (＾▽＾)`);
  } catch (error) {
    console.error(error);
    alert("Erro ao entrar: " + error.message);
  }
});

// =============================
//  SALVAR E CARREGAR PROGRESSO
// =============================
export async function salvarProgresso(userId, dados) {
  const ref = doc(db, "usuarios", userId);
  await updateDoc(ref, { progresso: dados });
}

export async function carregarProgresso(userId) {
  const ref = doc(db, "usuarios", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data().progresso;
  else return {};
}

// =============================
// SISTEMA DE VERIFICAÇÃO POR CÓDIGO (EMAILJS)
// =============================

// Armazena o código gerado para comparar depois
let generatedCode = null;

// Botão de enviar o código
document.getElementById("verify-email").addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value;

    if (!email) {
        alert("Coloca o email aí néé (；ω；)");
        return;
    }

    // Gera código aleatório de 6 dígitos
    generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Dados que vão pro EmailJS
    const params = {
        to_email: email,
        message: `Seu código de verificação é: ${generatedCode}`
    };

    try {
        await emailjs.send("service_ing0mtg", "template_lbz6p8p", params);
        alert("Código enviado! Vai lá olhar o email (≧◡≦)b");
    } catch (error) {
        console.error(error);
        alert("Opa, deu erro no envio... (；ω；)");
    }
});

// =============================
// VALIDAÇÃO ANTES DE CRIAR CONTA
// =============================
document.getElementById("create-account").addEventListener("click", () => {
    const displayName = document.getElementById("display-name").value;
    const uniqueNick = document.getElementById("unique-nick").value;
    const email = document.getElementById("signup-email").value;
    const codeTyped = document.getElementById("verification-code").value;
    const pass = document.getElementById("new-password").value;
    const confirm = document.getElementById("confirm-password").value;

    const msg = document.getElementById("signup-message");

    // Verifica se todos os campos foram preenchidos
    if (!displayName || !uniqueNick || !email || !codeTyped || !pass || !confirm) {
        msg.textContent = "Preenche tudo aí primeiro, preguiçoso(a) kkk (°ロ°)！";
        return;
    }

    // Verifica código
    if (codeTyped !== generatedCode) {
        msg.textContent = "Código incorreto! Tenta de novo (；ω；)";
        return;
    }

    // Verifica senha
    if (pass.length < 5) {
        msg.textContent = "Senha muito curtinha! Coloca 5+ letras (´･ω･`)";
        return;
    }

    if (pass !== confirm) {
        msg.textContent = "As senhas não batem! (；ω；)";
        return;
    }

    // SE CHEGOU AQUI → CRIA A CONTA NO FIREBASE
    msg.textContent = "Criando conta... (*≧▽≦)ﾉ";

    firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(async userCred => {
            const user = userCred.user;

            // Atualiza displayName no Firebase
            await user.updateProfile({
                displayName: displayName
            });

            msg.textContent = "Conta criadaaa! (≧◡≦)/ 🎉";
        })
        .catch(err => {
            console.error(err);
            msg.textContent = "Erro ao criar conta (；ω；)";
        });
});

// -------------------------------
//  VARIÁVEIS IMPORTANTES
// -------------------------------
const verifyBtn = document.getElementById("verify-email");
const createBtn = document.getElementById("create-account");
const verificationInput = document.getElementById("verification-code");
const emailInput = document.getElementById("signup-email");

let generatedCode = null;  // código aleatório
let emailVerified = false; // status da verificação

// Desabilita o botão de criar conta até validar o email
createBtn.disabled = true;

// -------------------------------
// 1. GERAR CÓDIGO DE 6 DIGITOS
// -------------------------------
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// -------------------------------
// 2. ENVIAR O CÓDIGO PARA O EMAIL
// -------------------------------
verifyBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();

  if (!email) {
    alert("Digite um email antes, nééé (；ω；)");
    return;
  }

  generatedCode = generateCode(); // cria o código
  console.log("Código gerado:", generatedCode); // debug

  verifyBtn.disabled = true;
  verifyBtn.innerText = "Enviando...";

  emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
    code: generatedCode,
    to_email: email
  })
  .then(() => {
    alert("Código enviado! Checa seu email (≧▽≦)");
    verifyBtn.innerText = "Código enviado ✔";
  })
  .catch((err) => {
    console.error(err);
    alert("Deu erro ao enviar (；ω；) tenta de novo depois.");
    verifyBtn.disabled = false;
    verifyBtn.innerText = "Enviar código";
  });
});

// -------------------------------
// 3. VERIFICAR O CÓDIGO DIGITADO
// -------------------------------
verificationInput.addEventListener("input", () => {
  const typed = verificationInput.value.trim();

  if (typed === generatedCode) {
    emailVerified = true;
    verificationInput.style.border = "2px solid #00cc66";
    createBtn.disabled = false;

  } else {
    emailVerified = false;
    verificationInput.style.border = "2px solid red";
    createBtn.disabled = true;
  }
});

// -------------------------------
// 4. AO CRIAR CONTA, CHECA SE EMAIL VALIDADO
// -------------------------------
createBtn.addEventListener("click", () => {
  if (!emailVerified) {
    alert("O email ainda não foi verificado! (°ロ°)！");
    return;
  }

  alert("Email verificado! Agora pode criar conta (≧◡≦)b");
});
