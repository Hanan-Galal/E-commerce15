const cartContainer = document.getElementById("cartContainer");
const placeOrderBtn = document.getElementById("placeOrder");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let toasterContainer = document.getElementById("toaster");

if (!toasterContainer) {
  toasterContainer = document.createElement("div");
  toasterContainer.id = "toaster";
  toasterContainer.className =
    "fixed top-5 right-1/2 transform -translate-x-1/2 flex flex-col gap-3 z-50 items-center";
  document.body.appendChild(toasterContainer);
}

export function showToast(message, type = "success", duration = 3000) {
  const toast = document.createElement("div");
  toast.className = `
    px-4 py-2 rounded shadow-md text-white font-medium
    transition-all duration-300 opacity-0
    ${type === "success" ? "bg-green-500" : "bg-red-500"}
  `;
  toast.textContent = message;
  toasterContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("opacity-100"));
  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.addEventListener("transitionend", () => toast.remove());
  }, duration);
}

export const addToCart = (product) => {
  const item = cart.find(p => p.id === product.id);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartCount();
};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  renderOrderSummary();
}

export const updateCartCount = () => {
  const counter = document.getElementById("cart-count");
  if (!counter) return;
  counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
};

export const displayCart = () => {
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  cart.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = `
      bg-white rounded-xl shadow-md p-4 flex flex-col
      min-h-[400px] max-h-[450px] w-72
    `;

    productCard.innerHTML = `
      <div class="flex-1 flex flex-col">
      <img
  src="${product.image}"
  draggable="false"
  loading="lazy"
  class="w-full h-48 object-contain select-none"
/>

        <h3 class="text-lg font-semibold text-gray-700 mb-2 line-clamp-2">${product.title}</h3>
        <p class="text-gray-500 mb-2">$${(product.price * product.quantity).toFixed(2)}</p>
      </div>

      <div class="flex items-center justify-between mt-4">
        <button class="removeBtn bg-gray-400 text-white px-3 py-1 rounded">
          ${product.quantity === 1 ? "Remove" : "-"}
        </button>
        <span class="quantity font-medium">${product.quantity}</span>
        <button class="addBtn bg-gray-400 text-white px-3 py-1 rounded">+</button>
      </div>
    `;

    const removeBtn = productCard.querySelector(".removeBtn");
    const addBtn = productCard.querySelector(".addBtn");
    const quantityEl = productCard.querySelector(".quantity");

    removeBtn.addEventListener("click", () => {
      if (product.quantity > 1) {
        product.quantity--;
      } else {
        cart = cart.filter(p => p.id !== product.id);
      }
      saveCart();
      updateCartCount();
    });

    addBtn.addEventListener("click", () => {
      product.quantity++;
      saveCart();
      updateCartCount();
    });

    cartContainer.appendChild(productCard);
  });
};

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderOrderSummary() {
  const summary = document.getElementById("orderSummary");
  if (!summary) return;

  summary.innerHTML = `
    <p>Total Items: <strong>${cart.length}</strong></p>
    <p>Total Price: <strong>$${getCartTotal().toFixed(2)}</strong></p>
  `;
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    const name = document.getElementById("name")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const address = document.getElementById("address")?.value.trim();

    if (!name || !phone || !address) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (cart.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    const order = {
      customer: { name, phone, address },
      items: cart,
      total: getCartTotal(),
      date: new Date().toISOString()
    };

    console.log(order);

    showToast("Order placed successfully", "success");
    cart = [];
    localStorage.removeItem("cart");
    displayCart();
    updateCartCount();
    renderOrderSummary();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  displayCart();
  renderOrderSummary();
});
