const titles=[["FORZA HORIZON","🎮 PLAYING · 02:14:37"],["SPOTIFY","🎵 PLAYING · CRUMULANT FM"],["XBOX SERVICES","🟢 CONNECTED · 8 SERVICES"],["WINDOWS UPDATE","⬇️ DOWNLOADING · 47%"],["XBOGGS PANEL™","PLEASE SUBSCRIBE · 9,99 €/2 MONTHS"]];
let i=0;setInterval(()=>{i=(i+1)%titles.length;document.getElementById("oledTitle").textContent=titles[i][0];document.getElementById("oledSub").textContent=titles[i][1]},2500);
document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener("click",e=>e.preventDefault()));

// Xboggs storefront configurator
const planButtons = document.querySelectorAll(".shop-plan");
const addOns = document.querySelectorAll(".option input");
const storage = document.getElementById("storage");
const totalEl = document.getElementById("total");
const summaryEl = document.getElementById("summary");
const productOled = document.getElementById("productOled");
let selectedPlan = {name:"Full", price:39.99};

function money(n){return n.toFixed(2).replace(".",",")+" €";}
function updateStore(){
  let total=selectedPlan.price;
  let parts=[selectedPlan.name];
  addOns.forEach(x=>{if(x.checked){total+=Number(x.dataset.add); let label=x.parentElement.querySelector("b")?.textContent || ""; if(label) parts.push(label.replace("+12 €/mo","Panel").replace("+10 €/mo","LightLink™").replace("+15 €/mo","ezgraphics 10zi™").replace("+8 €/mo","128K Modem™"));}});
  const s=storage.options[storage.selectedIndex];
  total+=Number(storage.value);
  parts.push(s.textContent.split(" — ")[0].replace("MEEEMOPG™","MEEEMOPG™"));
  totalEl.textContent=money(total);
  summaryEl.textContent=parts.join(" · ");
  productOled.textContent="XBOGGS "+selectedPlan.name.toUpperCase()+"™";
}
planButtons.forEach(btn=>btn.addEventListener("click",()=>{
  planButtons.forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  selectedPlan={name:btn.dataset.plan,price:Number(btn.dataset.price)};
  updateStore();
}));
addOns.forEach(x=>x.addEventListener("change",updateStore));
storage.addEventListener("change",updateStore);

const modal=document.getElementById("checkoutModal");
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  document.getElementById("modalText").textContent=`You've selected ${summaryEl.textContent} for ${totalEl.textContent}/month. The Xboggs fulfillment department is now pretending to process your order.`;
  modal.classList.add("open");
  setTimeout(()=>document.querySelector(".modal-card").classList.add("done"),100);
});
document.getElementById("closeModal").addEventListener("click",()=>modal.classList.remove("open"));
updateStore();


// Normal outright Xboggs configurator + individual services
const modeCards=document.querySelectorAll(".mode-card");
const onConfigurator=document.querySelector(".configurator");
const normalConfigurator=document.getElementById("normalConfigurator");
const normalTotal=document.getElementById("normalTotal");
const hardwareSummary=document.getElementById("hardwareSummary");
const serviceSummary=document.getElementById("serviceSummary");
const normalSummary=document.getElementById("normalSummary");
const normalStorage=document.getElementById("normalStorage");
const baseXboggs=document.querySelectorAll('input[name="baseXboggs"]');
const normalGpus=document.querySelectorAll('input[name="normalGpu"]');
const normalAdds=document.querySelectorAll(".normal-add");
const serviceAdds=document.querySelectorAll(".service-add");

function updateNormal(){
  const base=document.querySelector('input[name="baseXboggs"]:checked');
  let hardware=Number(base.value);
  let services=0;
  const parts=[base.dataset.label];
  const gpu=document.querySelector('input[name="normalGpu"]:checked');
  hardware+=Number(gpu.value); parts.push(gpu.dataset.label);
  const st=normalStorage.options[normalStorage.selectedIndex];
  hardware+=Number(normalStorage.value); parts.push(st.dataset.label);
  normalAdds.forEach(x=>{if(x.checked){hardware+=Number(x.dataset.add);parts.push(x.dataset.label)}});
  serviceAdds.forEach(x=>{if(x.checked) services+=Number(x.dataset.add)});
  normalTotal.textContent=money(hardware);
  hardwareSummary.textContent=money(hardware);
  serviceSummary.textContent=money(services)+"/mo";
  normalSummary.textContent=parts.join(" · ");
}
modeCards.forEach(card=>card.addEventListener("click",()=>{
  modeCards.forEach(c=>c.classList.remove("active"));
  card.classList.add("active");
  const normal=card.dataset.mode==="normal";
  if(normal){
    normalConfigurator.classList.add("show");
    normalConfigurator.scrollIntoView({behavior:"smooth",block:"start"});
  } else {
    onConfigurator.style.display="block";
    onConfigurator.scrollIntoView({behavior:"smooth",block:"start"});
  }
}));
baseXboggs.forEach(x=>x.addEventListener("change",updateNormal));
normalGpus.forEach(x=>x.addEventListener("change",updateNormal));
normalAdds.forEach(x=>x.addEventListener("change",updateNormal));
serviceAdds.forEach(x=>x.addEventListener("change",updateNormal));
normalStorage.addEventListener("change",updateNormal);
document.getElementById("normalBuy").addEventListener("click",()=>{
  const modal=document.getElementById("checkoutModal");
  const svc=serviceSummary.textContent;
  document.getElementById("modalText").textContent=`Hardware: ${normalSummary.textContent} for ${hardwareSummary.textContent}. Optional services: ${svc}. You can therefore buy an Xboggs outright and subscribe to LightLink™ alone — no Xboggs ON™ contract required.`;
  modal.classList.add("open");
  document.querySelector(".modal-card").classList.add("done");
});
updateNormal();

// Xboggs cart
const cart=[];
const cartCount=document.getElementById("cartCount");
const cartDrawer=document.getElementById("cartDrawer");
const cartOverlay=document.getElementById("cartOverlay");
const cartItems=document.getElementById("cartItems");
function cartMoney(n){return n.toFixed(2).replace(".",",")+" €";}
function addCart(name,price,monthly=0,button=null){
  cart.push({name,price,monthly});
  renderCart();
  if(button){button.classList.add("added");button.textContent="✓ Added to cart";setTimeout(()=>{button.textContent="+ Add to cart";button.classList.remove("added")},1200)}
}
function renderCart(){
  cartCount.textContent=cart.length;
  if(!cart.length){cartItems.innerHTML='<div class="empty-cart">Your cart is suspiciously empty.<br><small>Add some crumulance.</small></div>';}
  else cartItems.innerHTML=cart.map((x,i)=>`<div class="cart-item"><div><b>${x.name}</b><small>${x.monthly?cartMoney(x.monthly)+"/month": "one-time"}</small></div><strong>${cartMoney(x.price)}</strong><button class="remove" data-i="${i}">Remove</button></div>`).join("");
  const hw=cart.reduce((a,x)=>a+x.price,0), mo=cart.reduce((a,x)=>a+x.monthly,0);
  document.getElementById("cartHardware").textContent=cartMoney(hw);
  document.getElementById("cartMonthly").textContent=cartMoney(mo)+"/mo";
  document.querySelectorAll(".remove").forEach(b=>b.onclick=()=>{cart.splice(Number(b.dataset.i),1);renderCart()});
}
function openCart(){cartDrawer.classList.add("open");cartOverlay.classList.add("open")}
function closeCart(){cartDrawer.classList.remove("open");cartOverlay.classList.remove("open")}
document.getElementById("cartOpen").onclick=openCart;
document.getElementById("cartClose").onclick=closeCart;
cartOverlay.onclick=closeCart;
document.getElementById("cartCheckout").onclick=()=>{
  if(!cart.length){openCart();return}
  const modal=document.getElementById("checkoutModal");
  document.getElementById("modalText").textContent=`Your cart contains ${cart.length} item(s): ${cartMoney(cart.reduce((a,x)=>a+x.price,0))} once + ${cartMoney(cart.reduce((a,x)=>a+x.monthly,0))}/month. The fictional Xboggs fulfillment department is ready.`;
  modal.classList.add("open");document.querySelector(".modal-card").classList.add("done");closeCart();
};

// Add buttons to configurable hardware/service options
document.querySelectorAll(".normal-add").forEach(x=>{
  const label=x.dataset.label, price=Number(x.dataset.add);
  const b=document.createElement("button");b.className="cart-add";b.textContent="+ Add to cart";
  b.onclick=e=>{e.preventDefault();addCart(label,price<0?0:price,0,b)};
  x.closest(".normal-option").appendChild(b);
});
document.querySelectorAll(".service-add").forEach(x=>{
  const label=x.dataset.label, monthly=Number(x.dataset.add);
  const b=document.createElement("button");b.className="cart-add";b.textContent="+ Add to cart";
  b.onclick=e=>{e.preventDefault();addCart(label,0,monthly,b)};
  x.closest(".service-option").appendChild(b);
});
renderCart();


// Customer details / order email
const customerForm = document.getElementById("customerForm");
if (customerForm) {
  customerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("customerName");
    const emailInput = document.getElementById("customerEmail");
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name) {
      nameInput.focus();
      return;
    }
    if (!emailInput.checkValidity()) {
      emailInput.focus();
      return;
    }

    // Build the order from the actual configurator state, not the cart.
    // The normal configurator can be ordered directly, so its selections
    // must be included even when nothing has been added to the separate cart.
    const base = document.querySelector('input[name="baseXboggs"]:checked');
    const gpu = document.querySelector('input[name="normalGpu"]:checked');
    const hardwareParts = [];

    if (base) {
      hardwareParts.push(base.dataset.label || base.value);
    }
    if (gpu) {
      const gpuLabel = gpu.dataset.label || gpu.value;
      hardwareParts.push(gpuLabel);
    }

    document.querySelectorAll('input[name="normalAdd"]:checked, input.normal-add:checked, .normal-option input[type="checkbox"]:checked').forEach(function (input) {
      const label = input.dataset.label || input.value;
      if (label && !hardwareParts.includes(label) && !input.name.includes("baseXboggs") && !input.name.includes("normalGpu")) {
        hardwareParts.push(label);
      }
    });

    const services = [];
    document.querySelectorAll('input[name="serviceAdd"]:checked, input.service-add:checked').forEach(function (input) {
      services.push(input.dataset.label || input.value);
    });

    // Prefer the configurator's live totals.
    const hardwareTotal =
      document.getElementById("hardwareSummary")?.textContent ||
      document.getElementById("normalHardwareTotal")?.textContent ||
      document.getElementById("hardwareTotal")?.textContent ||
      "0,00 €";

    const monthlyTotal =
      document.getElementById("serviceSummary")?.textContent ||
      document.getElementById("normalMonthlyTotal")?.textContent ||
      "0,00 €/mo";

    const orderLines = hardwareParts.length
      ? hardwareParts.map(function (part) { return "- " + part; }).join("\n")
      : "- No hardware selected";

    const serviceLines = services.length
      ? services.map(function (service) { return "- " + service; }).join("\n")
      : "- No optional services";

    const subject = encodeURIComponent("Xboggs Order — " + name);
    const body = encodeURIComponent(
      "XBOGGS ORDER\n\n" +
      "Customer: " + name + "\n" +
      "Customer email: " + email + "\n\n" +
      "Hardware:\n" + orderLines + "\n\n" +
      "Optional services:\n" + serviceLines + "\n\n" +
      "Hardware total: " + hardwareTotal + "\n" +
      "Monthly services: " + monthlyTotal + "\n\n" +
      "Fictional Xboggs storefront order."
    );

    window.location.href = "mailto:mylbb@proton.me?subject=" + subject + "&body=" + body;
  });
}
