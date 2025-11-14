// =============================
//  FIREBASE SETUP
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCcgm_yaHJMIWrweQC04Ga3NR6mU-rCwzM",
  authDomain: "duppon-bf5dd.firebaseapp.com",
  projectId: "duppon-bf5dd",
  storageBucket: "duppon-bf5dd.firebasestorage.app",
  messagingSenderId: "37968316933",
  appId: "1:37968316933:web:72666305b63e4294d92a6c",
  measurementId: "G-N8B31BSHMY",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =============================
//  EMAILJS INIT
// =============================
emailjs.init("kObwvZ7n4D0S94EOA");

// IDs reais do EmailJS
const SERVICE_ID = "service_ing0mtg";
const TEMPLATE_ID = "template_thpnojp";

// =============================
// TROCA DE TELAS LOGIN/REGISTRO
// =============================
const loginCard = document.getElementById("login-card");
const registerCard = document.getElementById("register-card");

document.getElementById("create-account-btn")?.addEventListener("click", () => {
  loginCard.style.display = "none";
  registerCard.style.display = "block";
});

document.getElementById("back-to-login-btn")?.addEventListener("click", () => {
  registerCard.style.display = "none";
  loginCard.style.display = "block";
});

// =============================
// VARIÁVEIS DO SISTEMA DE VERIFICAÇÃO
// =============================
let generatedCode = null;
let emailVerified = false;

const verifyBtn = document.getElementById("verify-email");
const createBtn = document.getElementById("create-account");
const verificationInput = document.getElementById("verification-code");
const emailInput = document.getElementById("signup-email");
const msg = document.getElementById("signup-message");

// travar criação até validar email
createBtn.disabled = true;

// =============================
// GERAR CÓDIGO DE 6 DÍGITOS
// =============================
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// =============================
// ENVIAR CÓDIGO PELO EMAILJS
// =============================
verifyBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();

  if (!email) {
    alert("Coloca um email néé (；ω；)");
    return;
  }

  generatedCode = generateCode();
  verifyBtn.disabled = true;
  verifyBtn.textContent = "Enviando...";

  emailjs.send("service_ing0mtg", "template_lbz6p8p", {
    name: nomeDoUsuario,
    to_email: email,
    code: generatedCode,
  })
  .then(() => {
    alert("Código enviado! Vai lá olhar o email (≧◡≦)b");
    verifyBtn.textContent = "Código enviado ✔";
  })
  .catch((err) => {
    console.error(err);
    alert("Erro ao enviar (；ω；)");
    verifyBtn.disabled = false;
    verifyBtn.textContent = "Enviar código";
   });

// =============================
// VERIFICAR CÓDIGO DIGITADO
// =============================
verificationInput.addEventListener("input", () => {
  if (verificationInput.value.trim() === generatedCode) {
    verificationInput.style.border = "2px solid #00cc66";
    emailVerified = true;
    createBtn.disabled = false;
  } else {
    verificationInput.style.border = "2px solid red";
    emailVerified = false;
    createBtn.disabled = true;
  }
});

// =============================
//  CRIAR CONTA DEPOIS DE VERIFICAR
// =============================
createBtn.addEventListener("click", async () => {
  if (!emailVerified) {
    alert("Verifica o email primeiro! (°ロ°)！");
    return;
  }

  const name = document.getElementById("display-name").value;
  const nick = document.getElementById("unique-nick").value;
  const email = document.getElementById("signup-email").value;
  const pass = document.getElementById("new-password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (!name || !nick || !email || !pass || !confirm) {
    msg.textContent = "Preenche tudo aí poxa kkk (・ω・)";
    return;
  }

  if (pass !== confirm) {
    msg.textContent = "As senhas não coincidem (；ω；)";
    return;
  }

  msg.textContent = "Criando conta... (*≧▽≦)ﾉ";

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;

    // salvar no firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: name,
      nick: nick,
      email: email,
      criadoEm: new Date(),
      progresso: {},
    });

    msg.textContent = "Conta criada com sucesso! (≧◡≦)/ 🎉";
  } catch (err) {
    console.error(err);
    msg.textContent = "Erro ao criar conta (；ω；)";
  }
});

// =============================
//  LOGIN
// =============================
document.getElementById("email-login")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("Entrouuu! (≧◡≦)/");
  } catch (err) {
    console.error(err);
    alert("Erro ao fazer login (；ω；)");
  }
});
