/* -------------------------
   Flipkart Clone - script.js
   All JS in one file:
   - products data
   - cart functions
   - render for index/checkout/orders
   ------------------------- */

const products = [
  { id: 1, name: "iPhone 15", price: 79999, category: "Mobiles", image: "https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg" },
  { id: 2, name: "Samsung Galaxy S24", price: 74999, category: "Mobiles", image: "https://m.media-amazon.com/images/I/81-KbyNHhAL._SL1500_.jpg" },
  { id: 3, name: "MacBook Air M2", price: 124999, category: "Laptops", image: "https://m.media-amazon.com/images/I/71eXNIDUGjL._SL1500_.jpg" },
  { id: 4, name: "HP Pavilion 14", price: 69999, category: "Laptops", image: "https://m.media-amazon.com/images/I/81Vv5ZfvU6L._SL1500_.jpg" },
  { id: 5, name: "Sony WH-1000XM5", price: 29999, category: "Headphones", image: "https://m.media-amazon.com/images/I/61aJztK6MAL._SL1500_.jpg" },
  { id: 6, name: "boAt Airdopes 141", price: 1499, category: "Headphones", image: "https://m.media-amazon.com/images/I/61KNJav3S9L._SL1500_.jpg" }
];

// cart persisted in localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ---------- RENDER PRODUCTS (index) ---------- */
function renderProducts(filter = "All") {
  const grid = document.getElementById("products-grid");
  if (!grid) return; // not on index page
  grid.innerHTML = "";
  products.forEach((p) => {
    if (filter === "All" || p.category === filter) {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      `;
      grid.appendChild(div);
    }
  });
}

/* ---------- CATEGORY FILTER ---------- */
function filterCategory(cat) {
  renderProducts(cat);
}

/* ---------- CART FUNCTIONS ---------- */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cart.reduce((s, i) => s + i.quantity, 0);
}

function addToCart(id) {
  const prod = products.find((p) => p.id === id);
  if (!prod) return;
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...prod, quantity: 1 });
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) removeFromCart(id);
  else saveCart();
  renderCart();
}

/* ---------- RENDER CART PANEL (index) ---------- */
function renderCart() {
  const cartPanel = document.getElementById("cart-items");
  if (!cartPanel) return; // not on index page
  cartPanel.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-left">
        <strong>${item.name}</strong><br/>
        <small>₹${item.price} each</small>
      </div>
      <div class="cart-right">
        <span>₹${item.price * item.quantity}</span>
        <div>
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span style="margin:0 6px">${item.quantity}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button onclick="removeFromCart(${item.id})">X</button>
        </div>
      </div>
    `;
    cartPanel.appendChild(li);
  });
  const totalEl = document.getElementById("total");
  if (totalEl) totalEl.textContent = total;
  updateCartCount();
}

/* ---------- CART PANEL TOGGLE ---------- */
function toggleCart() {
  const panel = document.getElementById("cart-panel");
  if (!panel) return;
  panel.classList.toggle("active");
}

/* ---------- NAVIGATION HELPERS ---------- */
function goToCheckout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  saveCart();
  window.location.href = "checkout.html";
}
function goToOrders() {
  window.location.href = "orders.html";
}

/* ---------- CHECKOUT PAGE BEHAVIOR ---------- */
function initCheckoutPage() {
  const summaryItems = document.getElementById("summary-items");
  if (!summaryItems) return; // not checkout page
  const cartLocal = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  summaryItems.innerHTML = "";
  cartLocal.forEach((item) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`;
    summaryItems.appendChild(li);
  });
  const totalEl = document.getElementById("summary-total");
  if (totalEl) totalEl.textContent = total;

  // Payment option toggles
  const paymentRadios = document.querySelectorAll("input[name='payment']");
  if (paymentRadios) {
    paymentRadios.forEach((r) => {
      r.addEventListener("change", function () {
        const details = document.getElementById("payment-details");
        const card = document.getElementById("card-fields");
        const upi = document.getElementById("upi-fields");
        if (!details || !card || !upi) return;
        if (this.value === "COD") {
          details.style.display = "none";
          card.style.display = "none";
          upi.style.display = "none";
        } else {
          details.style.display = "block";
          card.style.display = this.value === "Card" ? "block" : "none";
          upi.style.display = this.value === "UPI" ? "block" : "none";
        }
      });
    });
  }

  // Place order
  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();
      const payment = document.querySelector("input[name='payment']:checked").value;

      if (!name || !phone || !address) {
        alert("Please fill all billing details.");
        return;
      }

      const cartLocal = JSON.parse(localStorage.getItem("cart")) || [];
      if (cartLocal.length === 0) {
        alert("Cart is empty.");
        return;
      }
      const total = cartLocal.reduce((s, it) => s + it.price * it.quantity, 0);
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      const order = {
        id: Date.now(),
        name,
        phone,
        address,
        payment,
        items: cartLocal,
        total,
        date: new Date().toLocaleString()
      };
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.removeItem("cart");
      cart = [];
      saveCart();
      alert(`✅ Order placed successfully!\nPayment: ${payment}`);
      window.location.href = "orders.html";
    });
  }
}

/* ---------- ORDERS PAGE ---------- */
function initOrdersPage() {
  const list = document.getElementById("orders-list");
  if (!list) return;
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  list.innerHTML = "";
  if (orders.length === 0) {
    list.innerHTML = `
      <div class="no-orders">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076502.png" alt="No orders"/>
        <h3>No orders placed yet!</h3>
        <button class="yellow-btn" onclick="window.location.href='index.html'">Shop Now</button>
      </div>
    `;
    return;
  }
  // show from newest to oldest
  orders.slice().reverse().forEach((order) => {
    const div = document.createElement("div");
    div.className = "order-card";
    div.innerHTML = `
      <div class="order-header">
        <h3>Order #${order.id}</h3>
        <span>${order.date}</span>
      </div>
      <div class="order-info">
        <p><strong>Name:</strong> ${escapeHtml(order.name)}</p>
        <p><strong>Address:</strong> ${escapeHtml(order.address)}</p>
        <p><strong>Payment:</strong> ${escapeHtml(order.payment)}</p>
      </div>
      <div class="order-items">
        <h4>Items:</h4>
        <ul>
          ${order.items.map(i => `<li>${escapeHtml(i.name)} x ${i.quantity} - ₹${i.price * i.quantity}</li>`).join('')}
        </ul>
      </div>
      <div class="order-total"><strong>Total: ₹${order.total}</strong></div>
    `;
    list.appendChild(div);
  });
}

/* small helper to avoid showing raw HTML from stored fields */
function escapeHtml(text) {
  return String(text).replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;', '=': '&#61;', '/': '&#47;'
    })[s];
  });
}

/* ---------- ON LOAD ---------- */
document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  renderCart();
  initCheckoutPage();
  initOrdersPage();
  updateCartCount();
});
