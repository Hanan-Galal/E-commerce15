import { getProducts, getProductsByCategory } from "./api.js";
import { addToCart, updateCartCount, showToast } from "./cart.js";

const productsContainer = document.getElementById("products-container");
const categoryBtns = document.querySelectorAll(".categories button");
const sortSelect = document.getElementById("sort-select");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const pageInfo = document.getElementById("pageInfo");

let currentCategory = "all";
let currentSort = "default";
let currentPage = 1;
const limit = 4;
let totalProducts = 0;

async function fetchProducts() {
  let products;
  if (currentCategory === "all") {
    products = await getProducts();
  } else {
    products = await getProductsByCategory(currentCategory);
  }

  totalProducts = products.length;


  switch (currentSort) {
    case "price-low":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      products.sort((a, b) => b.price - a.price);
      break;
    case "name-a-z":
      products.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-z-a":
      products.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }


  const start = (currentPage - 1) * limit;
  const paginated = products.slice(start, start + limit);
  displayProducts(paginated);
  updatePageInfo();
}

function displayProducts(products) {
  if (!productsContainer) return;
  productsContainer.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72 min-h-[450px]";

    card.innerHTML = `
   <img 
  src="${product.image}" 
  draggable="false" 
  loading="lazy"
  class="h-40 object-contain mb-3 select-none" 
  ondragstart="return false;" 
/>

      <h3 class="text-lg font-semibold text-gray-600 mb-2 line-clamp-2">${product.title}</h3>
      <p class="text-xl text-gray-400 mb-2">$${product.price}</p>
      <button class="mt-auto bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-400 transition">Add to Cart</button>
    `;

    card.querySelector("button").onclick = () => {
      addToCart(product);
      updateCartCount();
      showToast(`${product.title} added to cart`);
    };

    productsContainer.appendChild(card);
  });
}

function updatePageInfo() {
  const totalPages = Math.ceil(totalProducts / limit);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}


categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    currentPage = 1;
    fetchProducts();
  });
});


sortSelect?.addEventListener("change", () => {
  currentSort = sortSelect.value;
  currentPage = 1;
  fetchProducts();
});


nextBtn?.addEventListener("click", () => {
  const totalPages = Math.ceil(totalProducts / limit);
  if (currentPage < totalPages) currentPage++;
  fetchProducts();
});

prevBtn?.addEventListener("click", () => {
  if (currentPage > 1) currentPage--;
  fetchProducts();
});

document.addEventListener("DOMContentLoaded", fetchProducts);
