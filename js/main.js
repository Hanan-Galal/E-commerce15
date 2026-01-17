console.log("main loaded");

import { fetchProducts } from "./api.js";
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
  const page = link.dataset.page?.toLowerCase();
  if (
    currentPath.includes(page) ||
    (currentPath === "/" && page === "index")
  ) {
    link.classList.add("bg-pink-100", "text-black", "font-semibold");
  }
});


const productsContainer = document.getElementById("products-container");

if (productsContainer) {
  loadProducts();
}

async function loadProducts({
  page = 1,
  limit = 6,
  category = "all",
  sort = "default"
} = {}) {
  updateCartCount();

  const products = await fetchProducts({
    page,
    limit,
    category,
    sort
  });

  productsContainer.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className =
      "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72 min-h-[450px]";

    productCard.innerHTML = `
<img 
  src="${product.images?.[0] || product.category?.image || 'https://via.placeholder.com/600x400'}"
  alt="${product.title}"
  onerror="this.src='https://via.placeholder.com/600x400';"
  loading="lazy"
  class="h-40 object-contain mb-3 select-none pointer-events-none"
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

    productCard
      .querySelector("button")
      .addEventListener("click", () => {
        addToCart(product.id);
        updateCartCount();
      });

    productsContainer.appendChild(productCard);
  });
}
