console.log("main loaded");

import { getProducts } from "./api.js";
import { addToCart, updateCartCount } from "./cart.js";

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

const links = document.querySelectorAll(".nav-link");
const currentPath = location.pathname.toLowerCase();

links.forEach(link => {
  const page = link.dataset.page.toLowerCase();
  if (
    currentPath.includes(page) ||
    (currentPath === "/" && page === "index")
  ) {
    link.classList.add("bg-pink-100", "text-black", "font-semibold");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  const productsContainer = document.getElementById("products-container");
  if (!productsContainer) return;

  const products = await getProducts();

  productsContainer.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className =
      "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72 min-h-[450px]";

    productCard.innerHTML = `
 <img 
  src="${product.image}" 
  draggable="false" 
  loading="lazy"
  class="h-40 object-contain mb-3 select-none" 
  ondragstart="return false;" 
/>



      <h3 class="text-lg font-semibold text-gray-600 mb-2 line-clamp-2">
        ${product.title}
      </h3>

      <p class="text-xl text-gray-400 mb-4">$${product.price}</p>

      <button
        class="mt-auto bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-400 transition">
        Add to Cart
      </button>
    `;

    const addButton = productCard.querySelector("button");

    addButton.addEventListener("click", () => {
      addToCart(product.id);
      updateCartCount();
    });

    productsContainer.appendChild(productCard);
  });
});
