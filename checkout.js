const checkoutProducts = [
  {id:"p1",name:"Everyday Classic Sneakers",price:38500,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=160&q=80"},
  {id:"p2",name:"Wireless Studio Headphones",price:68500,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=160&q=80"},
  {id:"p3",name:"Minimal Ceramic Vase Set",price:24500,image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=160&q=80"},
  {id:"p4",name:"Daily Glow Skincare Kit",price:42000,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=160&q=80"},
  {id:"p5",name:"Timeless Everyday Watch",price:55000,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=160&q=80"},
  {id:"p6",name:"Structured Weekend Tote",price:32000,image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=160&q=80"},
  {id:"p7",name:"Modern Table Lamp",price:47500,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=160&q=80"},
  {id:"p8",name:"Compact Bluetooth Speaker",price:59000,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=160&q=80"},
  {id:"p9",name:"Fresh Market Fruit Basket",price:12500,image:"https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=160&q=80"},
  {id:"p10",name:"Pantry Essentials Bundle",price:18500,image:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=160&q=80"},
  {id:"p11",name:"Home Cleaning Starter Set",price:14500,image:"https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=160&q=80"},
  {id:"p12",name:"Everyday Cookware Set",price:46500,image:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=160&q=80"},
  {id:"p13",name:"Soft Living Room Cushion Set",price:28000,image:"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=160&q=80"},
  {id:"p14",name:"Gentle Daily Care Set",price:22000,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=160&q=80"},
  {id:"p15",name:"Baby Care Essentials Pack",price:31500,image:"https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=160&q=80"}
];
const formatRwf = amount => "RWF " + new Intl.NumberFormat("en-RW",{maximumFractionDigits:0}).format(amount);
let checkoutCart = [];
try { checkoutCart = JSON.parse(localStorage.getItem("ebuy-cart") || "[]"); } catch { checkoutCart = []; }
const checkoutLines = checkoutCart.map(item => {
  const product = checkoutProducts.find(p => p.id === item.id);
  return product ? {...product, quantity:Math.max(1,Number(item.quantity)||1)} : null;
}).filter(Boolean);
const subtotal = checkoutLines.reduce((sum,item)=>sum+item.price*item.quantity,0);
document.getElementById("checkoutItems").innerHTML = checkoutLines.length ? checkoutLines.map(item => `
  <div class="checkout-item"><img src="${item.image}" alt=""><div><strong>${item.name}</strong><small>Qty: ${item.quantity}</small></div><b>${formatRwf(item.price*item.quantity)}</b></div>
`).join("") : '<p class="checkout-no-items">Your cart is empty. <a href="index.html">Browse products</a>.</p>';
document.getElementById("checkoutSubtotal").textContent = formatRwf(subtotal);
document.getElementById("checkoutTotal").textContent = formatRwf(subtotal);
document.getElementById("checkoutYear").textContent = new Date().getFullYear();
const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
const mobileDetail = document.getElementById("mobileMoneyDetail");
const cardDetail = document.getElementById("cardDetail");
function updatePaymentView(){
  const method = document.querySelector('input[name="paymentMethod"]:checked')?.value;
  mobileDetail.hidden = method !== "mobile_money";
  cardDetail.hidden = method !== "card";
  document.querySelectorAll("[data-payment-option]").forEach(label => label.classList.toggle("selected",label.querySelector("input").checked));
}
paymentRadios.forEach(radio => radio.addEventListener("change",updatePaymentView));
document.getElementById("checkoutForm").addEventListener("submit",event=>{
  event.preventDefault();
  if(!checkoutLines.length){showCheckoutToast("Your cart is empty. Add a product before checkout.");return;}
  const form = event.currentTarget;
  if(!form.reportValidity()) return;
  showCheckoutToast("Checkout preview saved. Secure order and payment processing will be connected in the backend.");
});
function showCheckoutToast(message){
  const toast=document.getElementById("checkoutToast");
  toast.textContent=message;toast.classList.add("visible");
  window.setTimeout(()=>toast.classList.remove("visible"),4200);
}
updatePaymentView();