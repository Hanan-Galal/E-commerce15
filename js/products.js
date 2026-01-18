import { fetchProducts } from "./api.js";
import { addToCart, updateCartCount } from "./cart.js";

const productsContainer = document.getElementById("products-container");
const categoriesContainer = document.querySelector(".categories");
const paginationContainer = document.getElementById("pagination");
const sortSelect = document.getElementById("sort-select");

let currentCategory = "all";
let currentPage = 1;
let currentSort = "default";
let isFetching = false;
const limit = 50;

async function loadProducts() {
  if (isFetching) return;
  isFetching = true;

  productsContainer.innerHTML = "<p class='col-span-full text-center'>Loading...</p>";

  try {
    let products = await fetchProducts({
      page: currentPage,
      limit,
      category: currentCategory
    });

    if (currentSort === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (currentSort === "name-a-z") {
      products.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === "name-z-a") {
      products.sort((a, b) => b.title.localeCompare(a.title));
    }

    displayProducts(products);
    renderPagination(products.length);
  } finally {
    isFetching = false;
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = "";
  if (products.length === 0) {
    productsContainer.innerHTML = "<p class='col-span-full text-center'>No products found.</p>";
    return;
  }
  products.forEach(product => {
    const imgUrl = product.images?.[0]|| "https://via.placeholder.com/600x400";
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
      <button class="mt-auto bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-400 transition">Add to Cart</button>
    `;
    card.querySelector("button").onclick = () => {
      addToCart(product.id);
      updateCartCount();
    };
    productsContainer.appendChild(card);
  });
}

function renderPagination(currentBatchSize) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";
  const createBtn = (label, targetPage, isDisabled) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = isDisabled;
    btn.className = `px-4 py-2 mx-1 rounded-md border ${isDisabled ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-pink-100'}`;
    if (label === currentPage) btn.className += " bg-gray-600 text-white";
    btn.onclick = () => {
      currentPage = targetPage;
      loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return btn;
  };
  paginationContainer.appendChild(createBtn("Prev", currentPage - 1, currentPage === 1));
  paginationContainer.appendChild(createBtn(currentPage, currentPage, true));
  if (currentBatchSize === limit) {
    paginationContainer.appendChild(createBtn("Next", currentPage + 1, false));
  }
}

async function loadCategories() {
  const res = await fetch("https://api.escuelajs.co/api/v1/categories");
  const categories = await res.json();
  categoriesContainer.innerHTML = "";
  const createCatBtn = (id, name) => {
    const btn = document.createElement("button");
    btn.textContent = name;
    const isActive = currentCategory == id;
    btn.className = `px-4 py-2 m-2 rounded-md transition ${isActive ? 'bg-gray-400 text-white' : 'bg-pink-100'}`;
    btn.onclick = () => {
      currentCategory = id;
      currentPage = 1;
      loadProducts();
      loadCategories();
    };
    return btn;
  };
  categoriesContainer.appendChild(createCatBtn("all", "All"));
  categories.slice(0, 5).forEach(cat => {
    categoriesContainer.appendChild(createCatBtn(cat.id, cat.name));
  });
}

sortSelect?.addEventListener("change", (e) => {
  currentSort = e.target.value;
  loadProducts();
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadCategories();
  loadProducts();
});