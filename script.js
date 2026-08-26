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
document.getElementById("closeModal").addEventListener("click",()=>{modal.classList.remove("open");emailOrderContext=null;});
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
const CART_COOKIE = "xboggs_cart";
const DISCOUNT_COOKIE = "xboggs_creator_discount";
const CART_COOKIE_DAYS = 30;

function setCookie(name, value, days=CART_COOKIE_DAYS){
  const expires = new Date(Date.now() + days*864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name){
  const prefix = name + "=";
  const found = document.cookie.split("; ").find(row => row.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
}

function deleteCookie(name){
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function saveCart(){
  try{
    setCookie(CART_COOKIE, JSON.stringify(cart));
  }catch(err){
    console.warn("XBOGGS cart could not be saved:", err);
  }
}

function loadCart(){
  try{
    const raw = getCookie(CART_COOKIE);
    if(!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }catch(err){
    console.warn("XBOGGS cart cookie is invalid:", err);
    return [];
  }
}

function saveDiscount(){
  try{
    if(activeDiscount){
      setCookie(DISCOUNT_COOKIE, JSON.stringify(activeDiscount));
    }else{
      deleteCookie(DISCOUNT_COOKIE);
    }
  }catch(err){
    console.warn("XBOGGS discount could not be saved:", err);
  }
}

function loadDiscount(){
  try{
    const raw = getCookie(DISCOUNT_COOKIE);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.code ? parsed : null;
  }catch(err){
    return null;
  }
}

const cart=loadCart();
let activeDiscount = loadDiscount(); // {code, freeItems}
let discountCodes = null;
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
function getCartPricing(){
  const hardware = cart.reduce((a,x)=>a+Number(x.price||0),0);
  const monthly = cart.reduce((a,x)=>a+Number(x.monthly||0),0);

  // A creator code makes up to N one-time cart items free.
  // The oldest/first N qualifying items are free; subscriptions are never discounted.
  let discount = 0;
  const freeCount = activeDiscount ? Math.max(0, Number(activeDiscount.freeItems)||0) : 0;
  let remaining = freeCount;
  const effectiveItems = cart.map(x=>{
    const original = Number(x.price||0);
    const free = original > 0 && remaining > 0;
    if(free){ discount += original; remaining--; }
    return {...x, originalPrice:original, effectivePrice:free?0:original, creatorFree:free};
  });

  return {hardware, monthly, discount, effectiveHardware:hardware-discount, effectiveItems};
}

function renderCart(){
  cartCount.textContent=cart.length;
  const pricing=getCartPricing();

  if(!cart.length){
    cartItems.innerHTML='<div class="empty-cart">Your cart is suspiciously empty.<br><small>Add some crumulance.</small></div>';
  } else {
    cartItems.innerHTML=pricing.effectiveItems.map((x,i)=>`
      <div class="cart-item">
        <div>
          <b>${x.name}</b>
          <small>${x.monthly?cartMoney(x.monthly)+"/month":(x.creatorFree?"CONTENT CREATOR FREE™":"one-time")}</small>
        </div>
        <strong>${x.creatorFree?'<s>'+cartMoney(x.originalPrice)+'</s> 0,00 €':cartMoney(x.effectivePrice)}</strong>
        <button class="remove" data-i="${i}">Remove</button>
      </div>`).join("");
  }

  document.getElementById("cartHardware").textContent=cartMoney(pricing.effectiveHardware);
  document.getElementById("cartDiscount").textContent="-"+cartMoney(pricing.discount);
  document.getElementById("cartMonthly").textContent=cartMoney(pricing.monthly)+"/mo";

  const status=document.getElementById("discountStatus");
  if(status){
    status.textContent=activeDiscount
      ? `Code ${activeDiscount.code} applied: ${activeDiscount.freeItems} one-time item(s) free. Subscriptions are unchanged.`
      : "Creator codes can make a selected number of cart items free.";
  }

  document.querySelectorAll(".remove").forEach(b=>b.onclick=()=>{
    cart.splice(Number(b.dataset.i),1);
    saveCart();
    renderCart();
  });
}
function openCart(){cartDrawer.classList.add("open");cartOverlay.classList.add("open")}
function closeCart(){cartDrawer.classList.remove("open");cartOverlay.classList.remove("open")}
document.getElementById("cartOpen").onclick=openCart;
document.getElementById("cartClose").onclick=closeCart;
cartOverlay.onclick=closeCart;
document.getElementById("cartCheckout").onclick=()=>{
  if(!cart.length){openCart();return}
  const pricing=getCartPricing();
  openCustomerEmailModal({
    type:"cart",
    message:`Your cart contains ${cart.length} item(s): ${cartMoney(pricing.effectiveHardware)} once + ${cartMoney(pricing.monthly)}/month. Enter your details to prepare the fictional order email.`,
    items:pricing.effectiveItems.map(x=>({...x})),
    discount:activeDiscount ? {...activeDiscount} : null,
    originalHardware:pricing.hardware
  });
  closeCart();
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




// Content creator discount codes live in discount-codes.txt so the static
// GitHub Pages site can be updated without changing the JavaScript.
// Format:
// CODE=NUMBER_OF_FREE_ONE_TIME_ITEMS|ACTIVE=true|EXPIRES=YYYY-MM-DD
//
// ACTIVE controls whether the code can be used.
// EXPIRES is optional and is inclusive: the code remains valid through that date.
async function loadDiscountCodes(){
  if(discountCodes) return discountCodes;
  discountCodes={};
  try{
    const response=await fetch("discount-codes.txt",{cache:"no-store"});
    if(!response.ok) throw new Error("Could not load discount-codes.txt");
    const text=await response.text();
    text.split(/\r?\n/).forEach(line=>{
      const clean=line.trim();
      if(!clean || clean.startsWith("#") || !clean.includes("=")) return;

      const separator=clean.indexOf("=");
      const rawCode=clean.slice(0,separator);
      const rest=clean.slice(separator+1);
      const fields=rest.split("|").map(x=>x.trim()).filter(Boolean);
      const freeItems=parseInt(fields.shift() || "",10);
      const flags={};

      fields.forEach(field=>{
        const eq=field.indexOf("=");
        if(eq===-1) return;
        const key=field.slice(0,eq).trim().toUpperCase();
        const value=field.slice(eq+1).trim();
        flags[key]=value;
      });

      const code=rawCode.trim().toUpperCase();
      const activeValue=(flags.ACTIVE ?? "true").toLowerCase();
      const isActive=["true","1","yes","on"].includes(activeValue);
      const expires=flags.EXPIRES || flags.EXPIRATION || "";
      let isExpired=false;

      if(expires && expires.toUpperCase() !== "NEVER") {
        // Compare calendar dates, not timestamps, so the expiration date itself
        // remains valid until the end of that date.
        const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(expires);
        if(!match) return;
        const expiryDate=new Date(Number(match[1]),Number(match[2])-1,Number(match[3]));
        if(Number.isNaN(expiryDate.getTime())) return;
        const today=new Date();
        today.setHours(0,0,0,0);
        expiryDate.setHours(0,0,0,0);
        isExpired=today>expiryDate;
      }

      if(code && Number.isFinite(freeItems) && freeItems>=0 && isActive && !isExpired){
        discountCodes[code]=freeItems;
      }
    });
  }catch(err){
    console.warn("XBOGGS discount codes unavailable:",err);
  }
  return discountCodes;
}

const applyDiscount=document.getElementById("applyDiscount");
const discountInput=document.getElementById("discountCode");
if(applyDiscount && discountInput){
  applyDiscount.addEventListener("click",async()=>{
    const code=discountInput.value.trim().toUpperCase();
    const status=document.getElementById("discountStatus");
    const codes=await loadDiscountCodes();
    if(!code){
      activeDiscount=null;
      saveDiscount();
      status.textContent="Enter a creator code.";
      status.className="discount-status error";
      renderCart();
      return;
    }
    if(Object.prototype.hasOwnProperty.call(codes,code)){
      activeDiscount={code,freeItems:codes[code]};
      saveDiscount();
      status.textContent=`Code ${code} applied: ${codes[code]} one-time item(s) free.`;
      renderCart();
    }else{
      activeDiscount=null;
      saveDiscount();
      status.textContent="Invalid or expired fictional creator code.";
      status.className="discount-status error";
      renderCart();
    }
  });
  discountInput.addEventListener("keydown", event => {
    if(event.key === "Enter"){
      event.preventDefault();
      applyDiscount.click();
    }
  });
}

// Lineup products can now use the same email-order flow as the configurators.
document.querySelectorAll(".lineup-buy").forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    const name = button.dataset.product || "XBOGGS product";
    const price = Number(button.dataset.price || 0);
    addCart(name, price, 0, button);
  });
});

let emailOrderContext = null;

function openCustomerEmailModal(context) {
  emailOrderContext = context;
  const modal = document.getElementById("checkoutModal");
  const text = document.getElementById("modalText");
  text.textContent = context?.message || "Enter your details below to prepare the fictional order email.";
  modal.classList.add("open");
  document.querySelector(".modal-card").classList.add("done");
}

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

    const lines = [];
    let hardwareTotal = 0;
    let monthlyTotal = 0;

    // New lineup/cart products.
    if (emailOrderContext?.items?.length) {
      emailOrderContext.items.forEach(item => {
        lines.push("- " + item.name + " — " + cartMoney(item.effectivePrice ?? item.price) + (item.creatorFree ? " (FREE via creator code)" : "") + (item.monthly ? " + " + cartMoney(item.monthly) + "/month" : ""));
        hardwareTotal += Number(item.effectivePrice ?? item.price ?? 0);
        monthlyTotal += Number(item.monthly || 0);
      });
    }

    // Existing normal configurator state, included when the user came through
    // the outright-hardware configurator.
    if (!emailOrderContext?.items?.length) {
      const base = document.querySelector('input[name="baseXboggs"]:checked');
      const gpu = document.querySelector('input[name="normalGpu"]:checked');

      if (base) lines.push("- " + (base.dataset.label || base.value));
      if (gpu) lines.push("- " + (gpu.dataset.label || gpu.value));

      document.querySelectorAll('input[name="normalAdd"]:checked, input.normal-add:checked, .normal-option input[type="checkbox"]:checked')
        .forEach(input => {
          const label = input.dataset.label || input.value;
          if (label && !lines.some(x => x.includes(label))) lines.push("- " + label);
        });

      document.querySelectorAll('input[name="serviceAdd"]:checked, input.service-add:checked')
        .forEach(input => {
          const label = input.dataset.label || input.value;
          lines.push("- SERVICE: " + label);
        });

      hardwareTotal = Number(
        (document.getElementById("hardwareSummary")?.textContent || "0")
          .replace(/[^\d,.-]/g, "")
          .replace(/\./g, "")
          .replace(",", ".")
      ) || 0;
    }

    const services = [];
    document.querySelectorAll('input[name="serviceAdd"]:checked, input.service-add:checked')
      .forEach(input => services.push(input.dataset.label || input.value));

    const subject = encodeURIComponent("Xboggs Order — " + name);
    const body = encodeURIComponent(
      "XBOGGS ORDER\n\n" +
      "Customer: " + name + "\n" +
      "Customer email: " + email + "\n\n" +
      "Selected products / hardware:\n" +
      (lines.length ? lines.join("\n") : "- No product selected") +
      "\n\n" +
      "Optional services:\n" +
      (services.length ? services.map(s => "- " + s).join("\n") : "- None") +
      "\n\n" +
      "Original hardware / one-time total: " + cartMoney(emailOrderContext?.originalHardware ?? hardwareTotal) + "\n" +
      "Creator discount: " + (emailOrderContext?.discount ? emailOrderContext.discount.code + " (" + emailOrderContext.discount.freeItems + " free item(s))" : "None") + "\n" +
      "Hardware / one-time total after discount: " + cartMoney(hardwareTotal) + "\n" +
      "Monthly services: " + cartMoney(monthlyTotal) + "/month\n\n" +
      "Fictional Xboggs storefront order.\n" +
      "No payment is taken by this static website."
    );

    window.location.href = "mailto:mylbb@proton.me?subject=" + subject + "&body=" + body;
  });
}


/* XBOGGS Creator Code Manager™ */
(function () {
  const CODE_FILE = "discount-codes.txt";

  function parseCreatorCodes(text) {
    return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
      const parts = line.split("|");
      const first = parts.shift();
      const eq = first.indexOf("=");
      if (eq < 0) return null;
      const code = first.slice(0, eq).trim();
      const uses = Number(first.slice(eq + 1).trim());
      const flags = {};
      parts.forEach(p => {
        const i = p.indexOf("=");
        if (i >= 0) flags[p.slice(0, i).trim().toUpperCase()] = p.slice(i + 1).trim();
      });
      return {
        code,
        uses: Number.isFinite(uses) ? uses : 0,
        active: String(flags.ACTIVE ?? "true").toLowerCase() === "true",
        expires: flags.EXPIRES || "NEVER"
      };
    }).filter(Boolean);
  }

  function codeStatus(c) {
    if (!c.active) return { expired: true, label: "INACTIVE" };
    if (c.expires !== "NEVER") {
      const d = new Date(c.expires + "T23:59:59");
      if (!Number.isNaN(d.getTime()) && Date.now() > d.getTime()) {
        return { expired: true, label: "EXPIRED" };
      }
    }
    if (c.uses <= 0) return { expired: true, label: "NO USES LEFT" };
    return { expired: false, label: "ACTIVE" };
  }

  function renderCreatorCodeProducts(codes) {
    const existing = document.getElementById("xboggs-creator-code-products");
    if (existing) existing.remove();

    const box = document.createElement("section");
    box.id = "xboggs-creator-code-products";
    box.style.cssText =
      "margin:24px 0;padding:20px;border:1px solid #ddd;border-radius:12px;background:#fff;" +
      "font-family:inherit;";

    const title = document.createElement("h2");
    title.textContent = "Creator Codes";
    box.appendChild(title);

    codes.forEach(c => {
      const status = codeStatus(c);
      const product = document.createElement("div");
      product.style.cssText =
        "display:flex;align-items:center;justify-content:space-between;gap:16px;" +
        "padding:14px 0;border-top:1px solid #eee;";

      const info = document.createElement("div");
      const codeName = document.createElement("strong");
      codeName.textContent = c.code;
      info.appendChild(codeName);

      const meta = document.createElement("div");
      meta.style.cssText = "font-size:.9em;color:#666;margin-top:4px;";
      meta.textContent = `${c.uses} use${c.uses === 1 ? "" : "s"} · Expires: ${c.expires}`;
      info.appendChild(meta);

      const badge = document.createElement("span");
      badge.textContent = status.label;
      badge.style.cssText = status.expired
        ? "color:#c00;font-weight:700;"
        : "color:#087f23;font-weight:700;";

      product.appendChild(info);
      product.appendChild(badge);
      box.appendChild(product);
    });

    // Insert near the existing creator-code area if possible; otherwise at the end.
    const target =
      document.querySelector("#creator-codes, .creator-codes, [data-creator-codes]") ||
      document.querySelector("main") ||
      document.body;
    target.appendChild(box);
  }

  async function loadCreatorCodeProducts() {
    try {
      const response = await fetch(CODE_FILE, { cache: "no-store" });
      if (!response.ok) return;
      const text = await response.text();
      renderCreatorCodeProducts(parseCreatorCodes(text));
    } catch (_) {
      // Keep the normal site working if the TXT file cannot be loaded.
    }
  }

  // Expose a helper so the existing code can refresh the product list if needed.
  window.renderCreatorCodeProducts = renderCreatorCodeProducts;
  window.loadCreatorCodeProducts = loadCreatorCodeProducts;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadCreatorCodeProducts);
  } else {
    loadCreatorCodeProducts();
  }
})();
