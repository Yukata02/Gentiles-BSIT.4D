const ICONS = {
  coffee: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><path d="M14 24h28v16a12 12 0 0 1-12 12H26A12 12 0 0 1 14 40V24z"/><path d="M42 28h6a8 8 0 0 1 0 16h-6"/><path d="M22 12c0 4 4 4 4 8M30 12c0 4 4 4 4 8"/></svg>`,
  sandwich: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 28l20-12 20 12-20 8-20-8z"/><path d="M12 36l20 8 20-8"/><path d="M12 44l20 8 20-8"/></svg>`,
  softdrink: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><path d="M22 20h20l-4 32H26L22 20z"/><path d="M24 20c4-8 12-8 16 0"/><path d="M32 12v8"/></svg>`,
  cookies: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><circle cx="32" cy="32" r="18"/><circle cx="26" cy="26" r="2" fill="currentColor"/><circle cx="36" cy="30" r="2" fill="currentColor"/><circle cx="28" cy="38" r="2" fill="currentColor"/><circle cx="38" cy="40" r="2" fill="currentColor"/></svg>`,
  water: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><path d="M26 14h12v8l4 28a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8l4-28v-8z"/><path d="M26 14h12"/></svg>`,
  chocolate: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="16" y="16" width="32" height="32" rx="4"/><path d="M16 32h32M32 16v32M24 16v32M40 16v32M16 24h32M16 40h32"/></svg>`
};

const FALLBACK_PRODUCTS = [
  { id: "coffee", name: "Coffee", price: 45, category: "Drinks", tone: "coffee", stock: 40 },
  { id: "sandwich", name: "Sandwich", price: 50, category: "Food", tone: "sandwich", stock: 25 },
  { id: "softdrink", name: "Soft Drink", price: 35, category: "Drinks", tone: "softdrink", stock: 50 },
  { id: "cookies", name: "Cookies", price: 25, category: "Snacks", tone: "cookies", stock: 30 },
  { id: "water", name: "Bottled Water", price: 20, category: "Drinks", tone: "water", stock: 60 },
  { id: "chocolate", name: "Chocolate", price: 25, category: "Snacks", tone: "chocolate", stock: 35 }
];

const state = {
  products: [],
  cart: {},
  method: null,
  cashRaw: "",
  lastTxn: null,
  filter: "All"
};

const money = (n) => `₱${Number(n).toFixed(2)}`;

function toast(message, isError = false) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.className = `toast show${isError ? " error" : ""}`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2400);
}

function setStep(n) {
  const labels = ["Order", "Review", "Payment", "Receipt"];
  document.querySelectorAll(".step").forEach((el) => {
    const step = Number(el.dataset.step);
    el.classList.toggle("on", step === n);
    el.classList.toggle("done", step < n);
    el.textContent = step < n ? `✓ ${labels[step - 1]}` : `${step} ${labels[step - 1]}`;
  });
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => {
    const on = s.id === id;
    s.classList.toggle("active", on);
    s.hidden = !on;
  });
  const map = {
    "screen-items": 1,
    "screen-summary": 2,
    "screen-method": 3,
    "screen-cash": 3,
    "screen-qr": 3,
    "screen-card": 3,
    "screen-success": 3,
    "screen-receipt": 4
  };
  setStep(map[id] || 1);
}

function cartItems() {
  return Object.values(state.cart);
}

function cartQty() {
  return cartItems().reduce((n, i) => n + i.qty, 0);
}

function cartTotal() {
  return cartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function productById(id) {
  return state.products.find((p) => p.id === id);
}

function addProduct(id) {
  const product = productById(id);
  const current = state.cart[id]?.qty || 0;
  if (current + 1 > product.stock) {
    toast("Insufficient stock", true);
    return;
  }
  state.cart[id] = {
    id: product.id,
    name: product.name,
    price: product.price,
    qty: current + 1
  };
  toast(`✓ Product added — ${product.name}`);
  renderProducts();
  renderCart();
}

function changeQty(id, delta) {
  const item = state.cart[id];
  if (!item) return;
  const next = item.qty + delta;
  if (next < 0) {
    toast("Invalid quantity", true);
    return;
  }
  if (next === 0) {
    delete state.cart[id];
    toast("Item removed");
    renderProducts();
    renderCart();
    return;
  }
  const product = productById(id);
  if (next > product.stock) {
    toast("Insufficient stock", true);
    return;
  }
  item.qty = next;
  renderProducts();
  renderCart();
}

function removeItem(id) {
  delete state.cart[id];
  toast("Item removed");
  renderProducts();
  renderCart();
}

function visibleProducts() {
  if (state.filter === "All") return state.products;
  return state.products.filter((p) => p.category === state.filter);
}

function renderProducts() {
  const root = document.getElementById("products");
  root.innerHTML = visibleProducts()
    .map((p) => {
      const qty = state.cart[p.id]?.qty || 0;
      return `
      <button class="product-card${qty ? " in-cart" : ""}" data-add="${p.id}">
        <div class="product-art tone-${p.tone || p.id}">
          ${qty ? `<span class="badge">${qty}</span>` : ""}
          ${ICONS[p.id] || ICONS.cookies}
        </div>
        <div class="product-meta">
          <span>${p.name}</span>
          <span class="price">${money(p.price)}</span>
        </div>
      </button>`;
    })
    .join("");
}

function renderCart() {
  const items = cartItems();
  const list = document.getElementById("cart-list");
  document.getElementById("cart-count").textContent = `${cartQty()} items`;
  document.getElementById("cart-total").textContent = money(cartTotal());
  document.getElementById("btn-to-summary").disabled = items.length === 0;

  if (!items.length) {
    list.innerHTML = `
      <div class="empty">
        <div>🛒</div>
        <strong>Your order is empty</strong>
        Tap a product on the left to add it to your order.
      </div>`;
    return;
  }

  list.innerHTML = items
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-top">
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-meta">${money(item.price)} each</div>
          </div>
          <button class="remove-btn" data-remove="${item.id}" aria-label="Remove">🗑</button>
        </div>
        <div class="cart-item-bot">
          <div class="qty-row">
            <button class="qty-btn" data-qty="${item.id}" data-delta="-1">−</button>
            <span class="qty">${item.qty}</span>
            <button class="qty-btn" data-qty="${item.id}" data-delta="1">+</button>
          </div>
          <span class="subtotal">${money(item.price * item.qty)}</span>
        </div>
      </div>`
    )
    .join("");
}

function renderSummary() {
  const items = cartItems();
  document.getElementById("summary-count").textContent = `${cartQty()} items`;
  document.getElementById("summary-total").textContent = money(cartTotal());
  document.getElementById("summary-lines").innerHTML = `
    <div class="review-head"><span>PRODUCT</span><span>QUANTITY</span><span>UNIT PRICE</span><span>SUBTOTAL</span></div>
    ${items
      .map(
        (item) => `
      <div class="review-row">
        <span>${item.name}</span>
        <span>${item.qty}</span>
        <span>${money(item.price)}</span>
        <strong>${money(item.price * item.qty)}</strong>
      </div>`
      )
      .join("")}`;
}

function nextReference() {
  const year = new Date().getFullYear();
  const key = `campus-pos-seq-${year}`;
  const next = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(next));
  return `TXN-${year}-${String(next).padStart(5, "0")}`;
}

function completePayment({ method, amountPaid, change }) {
  const total = cartTotal();
  state.lastTxn = {
    reference: nextReference(),
    date: new Date(),
    items: cartItems().map((i) => ({ ...i })),
    total,
    method,
    amountPaid,
    change,
    status: "Payment Successful"
  };
  toast("Transaction completed successfully");
  document.getElementById("success-details").innerHTML = `
    <div><span>Transaction No.</span><strong>${state.lastTxn.reference}</strong></div>
    <div><span>Payment method</span><strong>${method}</strong></div>
    <div><span>Transaction amount</span><strong>${money(total)}</strong></div>
    <div><span>Amount paid</span><strong>${money(amountPaid)}</strong></div>
    <div><span>Change</span><strong class="change-ok">${money(change)}</strong></div>
  `;
  showScreen("screen-success");
}

function renderReceipt() {
  const txn = state.lastTxn;
  const when = txn.date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
  const rows = txn.items
    .map(
      (item) => `
      <div class="item">
        <div class="row"><strong>${item.name}</strong><strong>${money(item.price * item.qty)}</strong></div>
        <div class="tiny">${item.qty} × ${money(item.price)}</div>
      </div>`
    )
    .join("");

  document.getElementById("receipt").innerHTML = `
    <h2>CAMPUS STORE POS</h2>
    <p class="sub">Self-Service Kiosk · Official Digital Receipt</p>
    <div class="row"><span>Transaction No.</span><strong>${txn.reference}</strong></div>
    <div class="row"><span>Date</span><span>${when}</span></div>
    <hr />
    <div class="row tiny"><span>ITEM</span><span>SUBTOTAL</span></div>
    ${rows}
    <hr />
    <div class="row"><strong>TOTAL</strong><strong>${money(txn.total)}</strong></div>
    <div class="row"><span>Payment method</span><span>${txn.method}</span></div>
    <div class="row"><span>Amount paid</span><span>${money(txn.amountPaid)}</span></div>
    <div class="row"><span>Change</span><span>${money(txn.change)}</span></div>
    <div class="row"><span>Status</span><span class="ok">${txn.status}</span></div>
    <p class="sub">Thank you for your purchase!</p>
  `;
}

function resetTransaction() {
  state.cart = {};
  state.method = null;
  state.cashRaw = "";
  state.lastTxn = null;
  state.filter = "All";
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c.dataset.filter === "All"));
  document.getElementById("card-status").textContent = "Processing payment…";
  document.getElementById("card-process").hidden = true;
  document.getElementById("cash-error").hidden = true;
  document.getElementById("cash-error").textContent = "";
  document.getElementById("cash-input").value = "";
  document.getElementById("cash-paid-wrap").classList.remove("invalid");
  document.getElementById("receipt").innerHTML = "";
  document.getElementById("success-details").innerHTML = "";
  renderProducts();
  renderCart();
  showScreen("screen-items");
  toast("✓ New transaction started — previous order cleared");
}

function peekReference() {
  const year = new Date().getFullYear();
  const next = Number(localStorage.getItem(`campus-pos-seq-${year}`) || "0") + 1;
  return `TXN-${year}-${String(next).padStart(5, "0")}`;
}

function renderQrPlaceholder() {
  const size = 25;
  const cells = Array.from({ length: size }, () => Array(size).fill(0));
  const inBounds = (r, c) => r >= 0 && c >= 0 && r < size && c < size;

  function setBlock(r, c, w, h, value) {
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        if (inBounds(r + i, c + j)) cells[r + i][c + j] = value;
      }
    }
  }

  function finder(r, c) {
    setBlock(r, c, 7, 7, 1);
    setBlock(r + 1, c + 1, 5, 5, 0);
    setBlock(r + 2, c + 2, 3, 3, 1);
  }

  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  setBlock(16, 16, 5, 5, 1);
  setBlock(17, 17, 3, 3, 0);
  setBlock(18, 18, 1, 1, 1);

  for (let i = 8; i < size - 8; i++) {
    cells[6][i] = i % 2 === 0 ? 1 : 0;
    cells[i][6] = i % 2 === 0 ? 1 : 0;
  }

  let seed = Math.round(cartTotal() * 100) + 415;
  const reserved = (r, c) =>
    (r < 8 && c < 8) ||
    (r < 8 && c >= size - 8) ||
    (r >= size - 8 && c < 8) ||
    r === 6 ||
    c === 6 ||
    (r >= 16 && r <= 20 && c >= 16 && c <= 20);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved(r, c)) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      cells[r][c] = seed % 3 === 0 ? 0 : 1;
    }
  }

  const unit = 4;
  const rects = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (cells[r][c]) {
        rects.push(`<rect x="${c * unit}" y="${r * unit}" width="${unit}" height="${unit}" />`);
      }
    }
  }

  const dim = size * unit;
  document.getElementById("qr-box").innerHTML = `
    <svg viewBox="0 0 ${dim} ${dim}" role="img" aria-label="QR code placeholder">
      <rect width="${dim}" height="${dim}" fill="#fff" />
      <g fill="#111827">${rects.join("")}</g>
    </svg>`;
}

function setMethodTotals() {
  const total = money(cartTotal());
  document.getElementById("method-total").textContent = total;
  document.getElementById("cash-total").textContent = total;
  document.getElementById("qr-total").textContent = total;
  document.getElementById("card-total").textContent = total;
  document.getElementById("card-terminal-total").textContent = total;
  document.getElementById("qr-step-amount").textContent =
    `Check that the amount is ${total} and approve it in your app.`;
  document.getElementById("qr-ref").textContent = `Ref: QR-${peekReference()}`;
  renderQrPlaceholder();
}

function paidAmount() {
  if (state.cashRaw.trim() === "") return NaN;
  return Number(state.cashRaw);
}

function renderCash() {
  const input = document.getElementById("cash-input");
  if (document.activeElement !== input) input.value = state.cashRaw;
  const paid = paidAmount();
  const total = cartTotal();
  const box = document.getElementById("cash-change-box");
  document.querySelectorAll("[data-quick]").forEach((btn) => {
    const val = btn.dataset.quick === "exact" ? String(total) : btn.dataset.quick;
    btn.classList.toggle("on", state.cashRaw === val);
  });
  if (!Number.isNaN(paid) && paid >= total) {
    box.className = "change-box ok";
    box.innerHTML = `<div><div>Change</div><small>${money(paid)} – ${money(total)}</small></div><strong>${money(paid - total)}</strong>`;
  } else {
    box.className = "change-box muted";
    box.innerHTML = `<span>Change</span><span id="cash-change">—</span>`;
  }
}

function setCashError(message) {
  const error = document.getElementById("cash-error");
  const wrap = document.getElementById("cash-paid-wrap");
  if (!message) {
    error.hidden = true;
    error.textContent = "";
    wrap.classList.remove("invalid");
    return;
  }
  error.hidden = false;
  error.innerHTML = message;
  wrap.classList.add("invalid");
}

function payCash() {
  const paid = paidAmount();
  const total = cartTotal();
  setCashError("");

  if (state.cashRaw.trim() === "" || Number.isNaN(paid) || paid < 0) {
    setCashError("Invalid payment. Enter a valid amount.");
    toast("Invalid payment", true);
    renderCash();
    return;
  }
  if (paid < total) {
    setCashError(
      `<strong>Insufficient payment.</strong><br>Please enter at least ${money(total)}. You are short by ${money(total - paid)}.`
    );
    toast("Insufficient payment", true);
    renderCash();
    return;
  }
  completePayment({ method: "Cash", amountPaid: paid, change: paid - total });
}

function buildKeypad() {
  const keys = [
    ["1", ""],
    ["2", ""],
    ["3", ""],
    ["4", ""],
    ["5", ""],
    ["6", ""],
    ["7", ""],
    ["8", ""],
    ["9", ""],
    ["Clear", "muted"],
    ["0", ""],
    ["⌫", "muted"]
  ];
  document.getElementById("keypad").innerHTML = keys
    .map(([k, extra]) => `<button class="key ${extra}" data-key="${k}">${k}</button>`)
    .join("");
}

function bind() {
  document.getElementById("products").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (btn) addProduct(btn.dataset.add);
  });

  document.getElementById("filters").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-filter]");
    if (!chip) return;
    state.filter = chip.dataset.filter;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === chip));
    renderProducts();
  });

  document.getElementById("cart-list").addEventListener("click", (e) => {
    const qty = e.target.closest("[data-qty]");
    const remove = e.target.closest("[data-remove]");
    if (qty) changeQty(qty.dataset.qty, Number(qty.dataset.delta));
    if (remove) removeItem(remove.dataset.remove);
  });

  document.getElementById("btn-to-summary").addEventListener("click", () => {
    renderSummary();
    showScreen("screen-summary");
  });
  document.getElementById("btn-back-items").addEventListener("click", () => showScreen("screen-items"));
  document.getElementById("btn-to-pay").addEventListener("click", () => {
    setMethodTotals();
    showScreen("screen-method");
  });
  document.getElementById("btn-back-summary").addEventListener("click", () => {
    renderSummary();
    showScreen("screen-summary");
  });

  document.querySelectorAll(".pay-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.method = btn.dataset.method;
      setMethodTotals();
      if (state.method === "Cash") {
        state.cashRaw = "";
        setCashError("");
        renderCash();
        showScreen("screen-cash");
      } else if (state.method === "QR Payment") {
        showScreen("screen-qr");
      } else {
        document.getElementById("card-process").hidden = true;
        showScreen("screen-card");
      }
    });
  });

  ["btn-back-method-cash", "btn-back-method-qr", "btn-back-method-card"].forEach((id) => {
    document.getElementById(id).addEventListener("click", () => showScreen("screen-method"));
  });

  document.getElementById("cash-input").addEventListener("input", (e) => {
    state.cashRaw = e.target.value;
    setCashError("");
    renderCash();
  });

  document.getElementById("quick-amounts").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-quick]");
    if (!btn) return;
    state.cashRaw = btn.dataset.quick === "exact" ? String(cartTotal()) : btn.dataset.quick;
    setCashError("");
    renderCash();
  });

  document.getElementById("keypad").addEventListener("click", (e) => {
    const key = e.target.closest("[data-key]")?.dataset.key;
    if (!key) return;
    if (key === "Clear") state.cashRaw = "";
    else {
      let digits = state.cashRaw.replace(/[^\d]/g, "");
      if (key === "⌫") digits = digits.slice(0, -1);
      else digits = `${digits}${key}`;
      state.cashRaw = digits.replace(/^0+(?=\d)/, "");
    }
    setCashError("");
    renderCash();
  });

  document.getElementById("btn-pay-cash").addEventListener("click", payCash);
  document.getElementById("btn-confirm-qr").addEventListener("click", () => {
    const total = cartTotal();
    completePayment({ method: "QR Payment", amountPaid: total, change: 0 });
  });
  document.getElementById("btn-process-card").addEventListener("click", () => {
    const box = document.getElementById("card-process");
    box.hidden = false;
    document.getElementById("card-status").textContent = "Processing payment…";
    setTimeout(() => {
      const total = cartTotal();
      completePayment({ method: "Credit/Debit Card", amountPaid: total, change: 0 });
    }, 900);
  });
  document.getElementById("btn-view-receipt").addEventListener("click", () => {
    renderReceipt();
    showScreen("screen-receipt");
  });
  document.getElementById("btn-new").addEventListener("click", resetTransaction);
  document.getElementById("btn-print").addEventListener("click", () => window.print());
}

async function loadProducts() {
  try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("no json");
    state.products = await res.json();
  } catch {
    state.products = FALLBACK_PRODUCTS;
  }
}

async function init() {
  await loadProducts();
  renderProducts();
  renderCart();
  buildKeypad();
  bind();
}

init();
