import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { ref, onValue, get } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

onAuthStateChanged(auth,async user=>{
  if(!user){location.href="login.html";return;}
  const snap=await get(ref(db,`users/${user.uid}`));
  if(!snap.exists() || snap.val().role!=="owner"){alert("Akses hanya untuk pemilik.");location.href="index.html";return;}
  document.querySelector("#ownerEmail").textContent=user.email;
  onValue(ref(db,"orders"),snap=>{
    const data=snap.val()||{};
    const orders=Object.entries(data).map(([id,o])=>({id,...o})).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    document.querySelector("#orderCount").textContent=orders.length;
    document.querySelector("#revenue").textContent=money(orders.reduce((a,o)=>a+(o.total||0),0));
    document.querySelector("#orders").innerHTML=orders.length?orders.map(o=>`
      <article class="order">
        <div class="order-head"><b>Pesanan #${o.id.slice(-6)}</b><span>${new Date(o.createdAt).toLocaleString("id-ID")}</span></div>
        <p><b>Pembeli:</b> ${o.email}</p>
        <ul>${(o.items||[]).map(i=>`<li>${i.name} × ${i.qty} — ${money(i.price*i.qty)}</li>`).join("")}</ul>
        <div class="order-total">${money(o.total)} <span class="badge">${o.status||"baru"}</span></div>
      </article>`).join(""):'<div class="empty">Belum ada pesanan.</div>';
  });
});
document.querySelector("#logoutBtn").onclick=()=>signOut(auth).then(()=>location.href="login.html");
