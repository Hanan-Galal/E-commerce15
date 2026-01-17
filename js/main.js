import { fetchProducts } from "./api.js";
import { addToCart, updateCartCount } from "./cart.js";

let currentCategory = "all";
const limit =50;
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const productsContainer = document.getElementById("products-container");
const links = document.querySelectorAll(".nav-link");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
}

const currentPath = location.pathname.toLowerCase();
links.forEach(link => {
  const page = link.dataset.page?.toLowerCase();
  if (currentPath.includes(page) || (currentPath === "/" && page === "index")) {
    link.classList.add("bg-pink-100", "text-black", "font-semibold");
  }
});

async function loadProducts() {
  if (!productsContainer) return;
  
  updateCartCount();
  productsContainer.innerHTML = "<p>Loading All Products...</p>";

  const products = await fetchProducts({
    page: 1,
    limit: limit,
    category: currentCategory
  });

  productsContainer.innerHTML = "";

  products.forEach(product => {
    let imgUrl = product.images?.[0] || 'https://via.placeholder.com/600x400';

    const card = document.createElement("div");
    card.className = "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72 min-h-[450px]";
    card.innerHTML = `
    <img src="${imgUrl}" 
       draggable="false" 
       onerror="this.src='https://via.placeholder.com/600x400';" 
       class="h-40 w-full object-contain rounded-lg mb-3 select-none pointer-events-none" 
       oncontextmenu="return false;" /> 
       
      <h3 class="text-lg font-semibold text-gray-600 mb-2 line-clamp-2">${product.title}</h3>
      <p class="text-xl text-gray-400 mb-4">$${product.price}</p>
      <button class="mt-auto bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-400 transition">
        Add to Cart
      </button>
    `;

    card.querySelector("button").onclick = () => {
      addToCart(product.id);
      updateCartCount();
    };

    productsContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);