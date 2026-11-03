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
let currentOrder = null;
document.getElementById("checkoutForm").addEventListener("submit",event=>{
  event.preventDefault();
  if(!checkoutLines.length){showCheckoutToast("Your cart is empty. Add a product before checkout.");return;}
  const form=event.currentTarget;
  if(!form.reportValidity()) return;
  const data=Object.fromEntries(new FormData(form).entries());
  const method=data.paymentMethod==="mobile_money" ? (data.mobileNetwork==="mtn" ? "MTN Mobile Money" : "Airtel Money") : "Visa / Mastercard";
  currentOrder={
    reference:"EBY-"+new Date().toISOString().replace(/[-:T.Z]/g,"").slice(0,14),
    date:new Date(),
    customer:{name:data.fullName,phone:data.phone,email:data.email||"Not provided",district:data.district,sector:data.sector,address:data.address},
    paymentMethod:method,
    items:checkoutLines.map(item=>({...item})),
    subtotal
  };
  renderOrderReview();
  document.getElementById("orderReviewPanel").hidden=false;
  document.getElementById("orderConfirmedPanel").hidden=true;
  document.getElementById("orderReviewPanel").scrollIntoView({behavior:"smooth",block:"start"});
});
function renderOrderReview(){
  const c=currentOrder.customer;
  document.getElementById("reviewDetails").innerHTML=`
    <div class="review-reference"><span>ORDER REFERENCE</span><strong>${currentOrder.reference}</strong><small>${currentOrder.date.toLocaleString()}</small></div>
    <div class="review-columns">
      <div><span class="review-label">CUSTOMER</span><strong>${escapeHtml(c.name)}</strong><p>${escapeHtml(c.phone)}<br>${escapeHtml(c.email)}</p></div>
      <div><span class="review-label">DELIVERY ADDRESS</span><strong>${escapeHtml(c.district)}, ${escapeHtml(c.sector)}</strong><p>${escapeHtml(c.address)}</p></div>
    </div>
    <div class="review-payment"><span>SELECTED PAYMENT METHOD</span><strong>${escapeHtml(currentOrder.paymentMethod)}</strong></div>
    <div class="review-products">${currentOrder.items.map(item=>`<div><span>${escapeHtml(item.name)} × ${item.quantity}</span><strong>${formatRwf(item.price*item.quantity)}</strong></div>`).join("")}</div>
    <div class="review-total"><span>Estimated total (delivery not included)</span><strong>${formatRwf(currentOrder.subtotal)}</strong></div>`;
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function downloadOrderPdf(){
  if(!currentOrder){showCheckoutToast("Please review your order first.");return;}
  if(!window.jspdf?.jsPDF){showCheckoutToast("PDF tool did not load. Please check your connection and try again.");return;}
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  const c=currentOrder.customer;
  const pageWidth=doc.internal.pageSize.getWidth();
  const pageHeight=doc.internal.pageSize.getHeight();
  const green=[23,59,45], lime=[216,238,131], orange=[229,139,85], ink=[23,37,31], muted=[113,128,120];
  function drawPageBrand(){
    doc.setDrawColor(...green);doc.setLineWidth(1.4);doc.rect(7,7,pageWidth-14,pageHeight-14);
    doc.setFillColor(...green);doc.rect(7,7,pageWidth-14,3,"F");
    doc.setFillColor(...lime);doc.roundedRect(17,17,11,11,2,2,"F");
    doc.setFont("helvetica","bold");doc.setFontSize(15);doc.setTextColor(...green);doc.text("e",20.1,25.1);
    doc.setFontSize(20);doc.setTextColor(...ink);doc.text("buy",32,26);
    doc.setTextColor(...orange);doc.text(".",61,26);
    doc.setFontSize(8);doc.setFont("helvetica","normal");doc.setTextColor(...muted);doc.text("RWANDA MARKETPLACE",pageWidth-17,24,{align:"right"});
    doc.setDrawColor(225,231,222);doc.setLineWidth(.3);doc.line(17,34,pageWidth-17,34);
    doc.setFontSize(8);doc.setTextColor(...muted);doc.text("eBuy Rwanda  •  Order summary",17,pageHeight-14);
    doc.text(currentOrder.reference,pageWidth-17,pageHeight-14,{align:"right"});
  }
  function nextPage(){
    doc.addPage();drawPageBrand();return 47;
  }
  drawPageBrand();
  let y=47;
  doc.setFont("helvetica","bold");doc.setFontSize(17);doc.setTextColor(...green);doc.text("ORDER SUMMARY",17,y);
  y+=9;doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(...muted);
  doc.text("Reference: "+currentOrder.reference,17,y);y+=5;
  doc.text("Date: "+currentOrder.date.toLocaleString(),17,y);y+=10;
  doc.setFont("helvetica","bold");doc.setFontSize(10);doc.setTextColor(...ink);doc.text("CUSTOMER & DELIVERY",17,y);y+=7;
  doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(...ink);
  const lines=["Name: "+c.name,"Phone: "+c.phone,"Email: "+c.email,"Address: "+c.district+", "+c.sector,"Delivery instructions: "+c.address,"Payment preference: "+currentOrder.paymentMethod];
  lines.forEach(line=>{
    const wrapped=doc.splitTextToSize(line,pageWidth-34);
    if(y+wrapped.length*5>pageHeight-28)y=nextPage();
    doc.text(wrapped,17,y);y+=wrapped.length*5+2;
  });
  y+=5;
  if(y>pageHeight-35)y=nextPage();
  doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text("ORDER ITEMS",17,y);y+=7;
  currentOrder.items.forEach(item=>{
    const label=item.name+" × "+item.quantity;
    const wrapped=doc.splitTextToSize(label,pageWidth-95);
    if(y+Math.max(8,wrapped.length*5)>pageHeight-27)y=nextPage();
    doc.setFont("helvetica","normal");doc.setFontSize(9);doc.setTextColor(...ink);
    doc.text(wrapped,17,y);
    doc.setFont("helvetica","bold");doc.text(formatRwf(item.price*item.quantity),pageWidth-17,y,{align:"right"});
    y+=Math.max(8,wrapped.length*5)+2;
    doc.setDrawColor(235,238,232);doc.line(17,y-1,pageWidth-17,y-1);
  });
  if(y>pageHeight-48)y=nextPage();
  y+=7;doc.setDrawColor(...green);doc.setLineWidth(.6);doc.line(17,y,pageWidth-17,y);y+=9;
  doc.setFont("helvetica","bold");doc.setFontSize(12);doc.setTextColor(...green);
  doc.text("ESTIMATED TOTAL",17,y);doc.text(formatRwf(currentOrder.subtotal),pageWidth-17,y,{align:"right"});
  y+=9;doc.setFont("helvetica","normal");doc.setFontSize(8);doc.setTextColor(...muted);
  const note="Delivery fee is not included. This document is an order summary only, not a payment receipt or proof of a submitted order. Payment has not been processed.";
  doc.text(doc.splitTextToSize(note,pageWidth-34),17,y);
  doc.save(currentOrder.reference+".pdf");
}
document.getElementById("downloadOrderButton").addEventListener("click",downloadOrderPdf);
document.getElementById("downloadConfirmedButton").addEventListener("click",downloadOrderPdf);
document.getElementById("confirmOrderButton").addEventListener("click",()=>{
  if(!currentOrder)return;
  document.getElementById("orderConfirmedPanel").hidden=false;
  document.getElementById("orderConfirmedPanel").scrollIntoView({behavior:"smooth",block:"center"});
  showCheckoutToast("Review marked complete. No order has been submitted yet.");
});
function showCheckoutToast(message){
  const toast=document.getElementById("checkoutToast");
  toast.textContent=message;toast.classList.add("visible");
  window.setTimeout(()=>toast.classList.remove("visible"),4200);
}
updatePaymentView();