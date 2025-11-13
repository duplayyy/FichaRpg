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
