import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

const products = [
  {id:"s1", name:"Sweater Classic Black", price:149000, desc:"Sweater fleece premium, nyaman dan mudah dipadukan.", icon:"🖤"},
  {id:"s2", name:"Sweater Cream Minimalist", price:159000, desc:"Warna cream dengan gaya clean dan modern.", icon:"🤍"},
  {id:"s3", name:"Sweater Navy Oversize", price:169000, desc:"Potongan oversize untuk gaya santai sehari-hari.", icon:"💙"},
  {id:"s4", name:"Sweater Maroon Premium", price:179000, desc:"Bahan hangat dengan tampilan premium.", icon:"❤️"},
  {id:"s5", name:"Sweater Grey Essential", price:149000, desc:"Model basic yang cocok untuk berbagai outfit.", icon:"🩶"},
  {id:"s6", name:"Sweater Green Street", price:169000, desc:"Gaya streetwear dengan warna hijau modern.", icon:"💚"}
];

let cart = JSON.parse(localStorage.getItem("anhar_cart") || "[]");
let currentUser = null;

const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const saveCart = () => { localStorage.setItem("anhar_cart", JSON.stringify(cart)); renderCart(); };

function renderProducts(list=products){
  const grid=document.querySelector("#productGrid");
  grid.innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-img">${p.icon}<span>ANHAR</span></div>
      <div class="product-body">
        <small>SWEATER</small><h3>${p.name}</h3><p>${p.desc}</p>
        <div class="product-bottom"><strong>${rupiah(p.price)}</strong><button class="add" data-id="${p.id}">+ Keranjang</button></div>
      </div>
    </article>`).join("");
  grid.querySelectorAll(".add").forEach(b=>b.onclick=()=>addToCart(b.dataset.id));
}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  const found=cart.find(x=>x.id===id);
  if(found) found.qty++; else cart.push({...p,qty:1});
  saveCart();
  document.querySelector("#cartPanel").classList.add("open");
}
function renderCart(){
  const box=document.querySelector("#cartItems");
  document.querySelector("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  if(!cart.length){box.innerHTML='<p class="empty">Keranjang masih kosong.</p>';document.querySelector("#cartTotal").textContent=rupiah(0);return;}
  box.innerHTML=cart.map(x=>`<div class="cart-item"><div><b>${x.name}</b><small>${rupiah(x.price)} × ${x.qty}</small></div><div><button onclick="window.changeQty('${x.id}',-1)">−</button><span>${x.qty}</span><button onclick="window.changeQty('${x.id}',1)">+</button></div></div>`).join("");
  document.querySelector("#cartTotal").textContent=rupiah(cart.reduce((a,x)=>a+x.price*x.qty,0));
}
window.changeQty=(id,d)=>{
  const x=cart.find(i=>i.id===id); if(!x)return;
  x.qty+=d; if(x.qty<=0) cart=cart.filter(i=>i.id!==id); saveCart();
};

document.querySelector("#cartBtn").onclick=()=>document.querySelector("#cartPanel").classList.add("open");
document.querySelector("#closeCart").onclick=()=>document.querySelector("#cartPanel").classList.remove("open");
document.querySelector("#search").oninput=e=>{
  const q=e.target.value.toLowerCase();
  renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)));
};

document.querySelector("#checkoutBtn").onclick=async()=>{
  if(!cart.length){alert("Keranjang masih kosong.");return;}
  if(!currentUser){alert("Silakan login sebagai pembeli terlebih dahulu.");location.href="login.html";return;}
  const orderRef=push(ref(db,"orders"));
  const total=cart.reduce((a,x)=>a+x.price*x.qty,0);
  await set(orderRef,{uid:currentUser.uid,email:currentUser.email,items:cart,total,status:"baru",createdAt:Date.now()});
  cart=[];saveCart();
  document.querySelector("#checkoutInfo").textContent="Pesanan berhasil dikirim ke pemilik.";
  alert("Pesanan berhasil dibuat. Pemilik Anhar Group sudah dapat melihatnya di dashboard.");
};

onAuthStateChanged(auth,u=>{currentUser=u;});
document.querySelector("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();
