import { products } from "./data.js";

const cartContainer = document.getElementById("cartContainer");
const placeOrderBtn = document.getElementById("placeOrder");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

export const displayCart = () => {
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  cart.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = `
      bg-pink-50 p-4 rounded-lg shadow-lg
      w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4
      flex flex-col items-center
      box-border
    `;

    productCard.innerHTML = `
      <img src=".${product.image}"  loading="lazy" class="w-3/4 h-48 object-cover rounded-lg" />
      <h3 class="text-xl font-bold text-gray-500 mt-4 text-center">
        ${product.name}
      </h3>
      <p class="text-gray-400 flex items-center gap-2 mt-2">
        <button class="removeBtn bg-gray-500 text-white px-2 rounded">-</button>
        ${product.quantity}
        <button class="addBtn bg-gray-500 text-white px-2 rounded">+</button>
      </p>
      <p class="text-gray-400 mt-2">
        Total: $${product.price * product.quantity}
      </p>
    `;

    productCard
      .querySelector(".removeBtn")
      .addEventListener("click", () => removeProduct(product.id));

    productCard
      .querySelector(".addBtn")
      .addEventListener("click", () => addToCart(product.id));

    cartContainer.appendChild(productCard);
  });

  updateCartCount();
  renderOrderSummary();
};

export const addToCart = (productId) => {
  const product = products.find(p => p.id === productId);
  const item = cart.find(p => p.id === productId);

  item ? item.quantity++ : cart.push({ ...product, quantity: 1 });

  saveCart();
};

export const removeProduct = (productId) => {
  const index = cart.findIndex(p => p.id === productId);

  if (index > -1) {
    cart[index].quantity > 1
      ? cart[index].quantity--
      : cart.splice(index, 1);
  }

  saveCart();
};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

export const updateCartCount = () => {
  const counter = document.getElementById("cart-count");
  if (!counter) return;

  counter.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
};

export function getCartTotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function renderOrderSummary() {
  const summary = document.getElementById("orderSummary");
  if (!summary) return;

  summary.innerHTML = `
    <p>Total Items: <strong>${cart.length}</strong></p>
    <p>Total Price: <strong>$${getCartTotal()}</strong></p>
  `;
}

function showMessage(text, type = "success") {
  const msg = document.getElementById("checkoutMessage");
  if (!msg) return;

  msg.textContent = text;
  msg.className = `
    mt-3 text-center font-medium
    ${type === "success" ? "text-green-600" : "text-red-600"}
  `;
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !phone || !address) {
      showMessage("Please fill all fields", "error");
      return;
    }

    if (cart.length === 0) {
      showMessage("Your cart is empty", "error");
      return;
    }

    const order = {
      customer: { name, phone, address },
      items: cart,
      total: getCartTotal(),
      date: new Date().toISOString()
    };

    console.log("ORDER:", order);

    showMessage("Ordered successfully");

    cart = [];
    localStorage.removeItem("cart");
    displayCart();
  });
}

document.addEventListener("DOMContentLoaded", displayCart);
