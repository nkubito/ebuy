const products = [
  {id:"p1",name:"Everyday Classic Sneakers",category:"Fashion",seller:"Kigali Streetwear",price:38500,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",badge:"Popular"},
  {id:"p2",name:"Wireless Studio Headphones",category:"Electronics",seller:"Tech Corner Kigali",price:68500,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",badge:"Top pick"},
  {id:"p3",name:"Minimal Ceramic Vase Set",category:"Home",seller:"Imizi Home",price:24500,image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=85",badge:"Handpicked"},
  {id:"p4",name:"Daily Glow Skincare Kit",category:"Beauty",seller:"Glow House",price:42000,image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",badge:"New"},
  {id:"p5",name:"Timeless Everyday Watch",category:"Accessories",seller:"The Edit Rwanda",price:55000,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",badge:"Popular"},
  {id:"p6",name:"Structured Weekend Tote",category:"Fashion",seller:"Inzuki Designs",price:32000,image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=85",badge:"Local find"},
  {id:"p7",name:"Modern Table Lamp",category:"Home",seller:"Imizi Home",price:47500,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85",badge:"New"},
  {id:"p8",name:"Compact Bluetooth Speaker",category:"Electronics",seller:"Tech Corner Kigali",price:59000,image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85",badge:"Top pick"}
];

const money = value => new Intl.NumberFormat("en-RW",{style:"currency",currency:"RWF",maximumFractionDigits:0}).format(value).replace("RWF","RWF");
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const emptyState = document.getElementById("emptyState");
let activeCategory = "All";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("ebuy-cart") || "[]");
let wishlist = new Set();

function visibleProducts(){
  let list = products.filter(p => (activeCategory === "All" || p.category === activeCategory) && (p.name+" "+p.category+" "+p.seller).toLowerCase().includes(searchTerm));
  const sort = sortSelect.value;
  if(sort === "price-low") list.sort((a,b)=>a.price-b.price);
  if(sort === "price-high") list.sort((a,b)=>b.price-a.price);
  if(sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}
function renderProducts(){
  const list = visibleProducts();
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=700&q=80'">
        <span class="product-badge">${p.badge}</span>
        <button class="wishlist-button ${wishlist.has(p.id)?"active":""}" data-wishlist="${p.id}" aria-label="Add ${p.name} to wishlist" aria-pressed="${wishlist.has(p.id)}">${wishlist.has(p.id)?"♥":"♡"}</button>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name" title="${p.name}">${p.name}</h3>
        <p class="seller-name">Sold by ${p.seller}</p>
        <div class="product-bottom"><strong class="product-price">${money(p.price)}</strong><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button></div>
      </div>
    </article>`).join("");
  emptyState.hidden = list.length !== 0;
}
function saveCart(){localStorage.setItem("ebuy-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.quantity+=1;else cart.push({id,quantity:1});
  saveCart();showToast("Added to your cart");
}
function renderCart(){
  const count=cart.reduce((sum,x)=>sum+x.quantity,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("drawerItemCount").textContent="("+count+")";
  const lines=cart.map(x=>({...products.find(p=>p.id===x.id),quantity:x.quantity})).filter(x=>x.id);
  const total=lines.reduce((sum,x)=>sum+x.price*x.quantity,0);
  document.getElementById("cartItems").innerHTML=lines.map(x=>`
    <div class="cart-line">
      <img src="${x.image}" alt="">
      <div><h3>${x.name}</h3><p>${money(x.price)}</p><div class="quantity-control"><button data-quantity="${x.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${x.quantity}</span><button data-quantity="${x.id}" data-change="1" aria-label="Increase quantity">+</button><button data-remove="${x.id}" aria-label="Remove item" style="border:0;margin-left:5px;color:#b36d62">×</button></div></div>
      <strong class="cart-line-price">${money(x.price*x.quantity)}</strong>
    </div>`).join("");
  document.getElementById("cartEmpty").hidden=lines.length>0;
  document.getElementById("cartSummary").hidden=lines.length===0;
  document.getElementById("cartSubtotal").textContent=money(total);
}
function openCart(){document.getElementById("drawerBackdrop").hidden=false;document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true");document.getElementById("drawerBackdrop").hidden=true;document.body.style.overflow="";}
let toastTimer;
function showToast(message){const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("visible"),2200);}

grid.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");
  const wish=e.target.closest("[data-wishlist]");
  if(add)addToCart(add.dataset.add);
  if(wish){const id=wish.dataset.wishlist;wishlist.has(id)?wishlist.delete(id):wishlist.add(id);renderProducts();}
});
document.getElementById("filterRow").addEventListener("click",e=>{
  const chip=e.target.closest("[data-filter]");if(!chip)return;
  activeCategory=chip.dataset.filter;
  document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("selected",x===chip));
  renderProducts();
});
document.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{
  activeCategory=btn.dataset.category;
  document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("selected",x.dataset.filter===activeCategory));
  renderProducts();document.getElementById("popular").scrollIntoView({behavior:"smooth"});
}));
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=searchInput.value.trim().toLowerCase();renderProducts();document.getElementById("popular").scrollIntoView({behavior:"smooth"});});
searchInput.addEventListener("input",()=>{searchTerm=searchInput.value.trim().toLowerCase();renderProducts();});
sortSelect.addEventListener("change",renderProducts);
document.getElementById("clearFiltersButton").addEventListener("click",()=>{activeCategory="All";searchTerm="";searchInput.value="";sortSelect.value="featured";document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("selected",x.dataset.filter==="All"));renderProducts();});
document.getElementById("cartButton").addEventListener("click",openCart);
document.getElementById("closeCartButton").addEventListener("click",closeCart);
document.getElementById("drawerBackdrop").addEventListener("click",closeCart);
document.getElementById("continueShoppingButton").addEventListener("click",closeCart);
document.getElementById("cartItems").addEventListener("click",e=>{
  const qty=e.target.closest("[data-quantity]");const remove=e.target.closest("[data-remove]");
  if(qty){const item=cart.find(x=>x.id===qty.dataset.quantity);if(item){item.quantity+=Number(qty.dataset.change);if(item.quantity<=0)cart=cart.filter(x=>x.id!==item.id);saveCart();}}
  if(remove){cart=cart.filter(x=>x.id!==remove.dataset.remove);saveCart();}
});
document.getElementById("checkoutButton").addEventListener("click",()=>showToast("Checkout will be available after secure payments are integrated."));
document.getElementById("accountButton").addEventListener("click",()=>document.getElementById("accountDialog").showModal());
document.getElementById("closeAccountButton").addEventListener("click",()=>document.getElementById("accountDialog").close());
document.getElementById("mobileMenuButton").addEventListener("click",e=>{const nav=document.getElementById("mainNav");const open=nav.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",String(open));});
document.getElementById("currentYear").textContent=new Date().getFullYear();
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
renderProducts();renderCart();