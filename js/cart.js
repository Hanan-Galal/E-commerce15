import { getProductsByIds } from "./api.js";

const cartContainer = document.getElementById("cartContainer");
const placeOrderBtn = document.getElementById("placeOrder");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let toasterContainer = document.getElementById("toaster");
if (!toasterContainer) {
  toasterContainer = document.createElement("div");
  toasterContainer.id = "toaster";
  toasterContainer.className =
    "fixed top-5 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-50";
  document.body.appendChild(toasterContainer);
}

export function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `
    px-4 py-2 rounded text-white shadow
    ${type === "success" ? "bg-green-500" : "bg-red-500"}
  `;
  toast.textContent = message;
  toasterContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartCount() {
  const counter = document.getElementById("cart-count");
  if (!counter) return;
  counter.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

export function addToCart(productId) {
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  showToast("Added to cart");
}

async function displayCart() {
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML =
      `<p class="text-center text-gray-500">Cart is empty</p>`;
    renderOrderSummary();
    return;
  }

  const ids = cart.map(i => i.productId);
  const products = await getProductsByIds(ids);

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4 w-72 flex flex-col";

    card.innerHTML = `
 <img 
  src="${product.image}" 
  draggable="false" 
  loading="lazy"
  class="h-40 object-contain mb-3 select-none" 
  ondragstart="return false;" 
/>



      <h3 class="font-semibold text-gray-700 line-clamp-2 mb-2">
        ${product.title}
      </h3>

      <p class="text-gray-600 mb-3">
        $${(product.price * item.quantity).toFixed(2)}
      </p>

      <div class="flex justify-between mt-auto">
        <button class="remove bg-gray-300 px-3 py-1 rounded">
          ${item.quantity === 1 ? "Remove" : "-"}
        </button>
        <span>${item.quantity}</span>
        <button class="add bg-gray-300 px-3 py-1 rounded">+</button>
      </div>
    `;

    card.querySelector(".remove").onclick = () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart = cart.filter(i => i.productId !== item.productId);
      }
      saveCart();
      displayCart();
      updateCartCount();
    };

    card.querySelector(".add").onclick = () => {
      item.quantity++;
      saveCart();
      displayCart();
      updateCartCount();
    };

    cartContainer.appendChild(card);
  });

  renderOrderSummary(products);
}

function renderOrderSummary(products = []) {
  const summary = document.getElementById("orderSummary");
  if (!summary) return;

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  summary.innerHTML = `
    <p>Total Items: <strong>${totalItems}</strong></p>
    <p>Total Price: <strong>$${totalPrice.toFixed(2)}</strong></p>
  `;
}

if (placeOrderBtn) {
  placeOrderBtn.onclick = () => {
    if (cart.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    cart = [];
    localStorage.removeItem("cart");
    displayCart();
    updateCartCount();
    showToast("Order placed successfully");
  };
}

document.addEventListener("DOMContentLoaded", () => {
  displayCart();
  updateCartCount();
});
