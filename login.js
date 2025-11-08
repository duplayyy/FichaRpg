// =============================
//  LOGIN E FIREBASE (｡•̀ᴗ-)✧
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

// =============================
//  POPUP DO LOGIN
// =============================
const loginBtn = document.querySelector(".login-btn");
const loginCard = document.getElementById("login-card");
const closeLoginBtn = document.getElementById("close-login");
const message = document.getElementById("login-message");

// Abre o card
loginBtn.addEventListener("click", () => {
  loginCard.classList.add("show");
});

// Fecha o card
closeLoginBtn.addEventListener("click", () => {
  loginCard.classList.remove("show");
});

// Fecha clicando fora
window.addEventListener("click", (e) => {
  if (e.target === loginCard) {
    loginCard.classList.remove("show");
  }
});

// =============================
//  LOGIN COM GOOGLE
// =============================
document.getElementById("google-login").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    message.textContent = `Bem-vindo, ${user.displayName}! (☆ω☆)`;
  } catch (error) {
    console.error(error);
    message.textContent = "Erro ao entrar com o Google!";
  }
});

// =============================
//  LOGIN COM EMAIL
// =============================
document.getElementById("email-login").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    message.textContent = `Logado como ${email}!`;
  } catch (error) {
    message.textContent = "Erro no login! Verifique o email ou senha.";
  }
});

// =============================
//  CADASTRAR NOVA CONTA
// =============================
document.getElementById("signup").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    message.textContent = "Conta criada com sucesso!";
  } catch (error) {
    message.textContent = "Erro ao criar conta!";
  }
});
