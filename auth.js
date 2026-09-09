import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const form=document.querySelector("#loginForm");
const msg=document.querySelector("#message");
const googleBtn=document.querySelector("#googleBtn");
const registerLink=document.querySelector("#registerLink");

const errorText=e=>({
"auth/invalid-credential":"Email atau password salah.",
"auth/email-already-in-use":"Email sudah terdaftar.",
"auth/weak-password":"Password minimal 6 karakter.",
"auth/invalid-email":"Format email tidak valid."
}[e.code]||e.message);

form.onsubmit=async e=>{
  e.preventDefault(); msg.textContent="Memproses...";
  try{
    const email=document.querySelector("#email").value.trim();
    const password=document.querySelector("#password").value;
    const cred=await signInWithEmailAndPassword(auth,email,password);
    const snap=await get(ref(db,`users/${cred.user.uid}`));
    const role=snap.exists()?snap.val().role:"buyer";
    location.href=role==="owner"?"admin.html":"index.html";
  }catch(err){msg.textContent=errorText(err);}
};

registerLink.onclick=async e=>{
  e.preventDefault();
  const email=prompt("Masukkan email pembeli:");
  if(!email)return;
  const password=prompt("Buat password minimal 6 karakter:");
  if(!password)return;
  try{
    const cred=await createUserWithEmailAndPassword(auth,email,password);
    await set(ref(db,`users/${cred.user.uid}`),{email,role:"buyer",createdAt:Date.now()});
    alert("Akun pembeli berhasil dibuat.");
    location.href="index.html";
  }catch(err){msg.textContent=errorText(err);}
};

googleBtn.onclick=async()=>{
  try{
    const cred=await signInWithPopup(auth,new GoogleAuthProvider());
    const userRef=ref(db,`users/${cred.user.uid}`);
    const snap=await get(userRef);
    if(!snap.exists()) await set(userRef,{email:cred.user.email,role:"buyer",createdAt:Date.now()});
    location.href="index.html";
  }catch(err){msg.textContent=errorText(err);}
};

onAuthStateChanged(auth,async u=>{
  if(u){
    const snap=await get(ref(db,`users/${u.uid}`));
    if(snap.exists() && snap.val().role==="owner") location.href="admin.html";
  }
});
