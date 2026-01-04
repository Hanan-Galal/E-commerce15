import { products } from "./data.js";

const cartContainer = document.getElementById("cartContainer");
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
        <img src=".${
          product.image
        }" class="w-3/4 sm:w-2/3 md:w-3/4 h-40 sm:h-48 md:h-52 lg:h-56 xl:h-60 object-cover rounded-lg" />
        <h3 class="text-xl sm:text-2xl font-bold text-gray-500 mt-4 text-center">${
          product.name
        }</h3>
        <p class="text-md sm:text-lg text-gray-400 my-4 flex justify-center items-center gap-2">
            <button class="removeBtn text-white bg-gray-500 rounded p-2">Remove</button>
            ${product.quantity}
            <button class="addBtn text-white bg-gray-500 rounded p-2">Add</button>
        </p>
        <p class="text-md sm:text-lg text-gray-400 my-2">total price: $${
          product.price * product.quantity
        }</p>
    `;

    const removeBtn = productCard.querySelector(".removeBtn");
    removeBtn.addEventListener("click", () => removeProduct(product.id));
    const addBtn = productCard.querySelector(".addBtn");
    addBtn.addEventListener("click", () => addToCart(product.id));
    cartContainer.appendChild(productCard);
  });
};

export const addToCart = (productId) => {
  const product = products.find((card) => card.id === productId);
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
};

export const removeProduct = (productId) => {
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex > -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    } else {
      cart.splice(productIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
};

export const updateCartCount = () => {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  cartCount.textContent = totalQuantity;
};

document.addEventListener("DOMContentLoaded", () => displayCart());
