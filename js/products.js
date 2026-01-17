import { fetchProducts } from "./api.js";
import { addToCart, updateCartCount } from "./cart.js";

const productsContainer = document.getElementById("products-container");
const categoriesContainer = document.querySelector(".categories");
const sortSelect = document.getElementById("sort-select");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const pageInfo = document.getElementById("pageInfo");

let currentCategory = "all";
let currentSort = "default";
let currentPage = 1;
const limit = 6;
let totalPages = 1;

async function loadProducts() {
  try {
    const data = await fetchProducts({
      page: currentPage,
      limit,
      category: currentCategory,
      sort: currentSort,
    });

    const products = data.products || data;
    const totalProducts = data.total || products.length;
    totalPages = Math.ceil(totalProducts / limit);

    displayProducts(products);
    updatePaginationInfo();
    highlightActiveCategory();
  } catch (err) {
    console.error("Error fetching products:", err);
    productsContainer.innerHTML = `<p class="text-red-500">Failed to load products</p>`;
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = "";

  products.forEach(product => {
    const imgUrl = product.images?.[0] || product.category?.image || "https://placehold.co/600x400";

    const card = document.createElement("div");
    card.className = "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72 min-h-[450px]";

    card.innerHTML = `
      <img src="${imgUrl}" alt="${product.title}" onerror="this.src='https://placehold.co/600x400';" loading="lazy" class="h-40 object-contain mb-3 select-none pointer-events-none"/>
      <h3 class="text-lg font-semibold text-gray-600 mb-2 line-clamp-2">${product.title}</h3>
      <p class="text-xl text-gray-400 mb-4">$${product.price}</p>
      <button class="mt-auto bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-400 transition">Add to Cart</button>
    `;

    card.querySelector("button").onclick = () => {
      addToCart(product.id);
      updateCartCount();
      alert(`${product.title} added to cart`);
    };

    productsContainer.appendChild(card);
  });
}

function updatePaginationInfo() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function highlightActiveCategory() {
  const btns = categoriesContainer.querySelectorAll("button");
  btns.forEach(btn => {
    btn.classList.remove("bg-gray-400", "text-white");
    btn.classList.add("bg-pink-100");
    if (btn.dataset.category === currentCategory) {
      btn.classList.add("bg-gray-400", "text-white");
      btn.classList.remove("bg-pink-100");
    }
  });
}
async function loadCategories() {
  try {
    const data = await fetchProducts({ limit: 50 });
    const products = data.products || data;
    const categoriesMap = new Map();
    products.forEach(p => categoriesMap.set(p.category.slug, p.category.name));

    categoriesContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.dataset.category = "all";
    allBtn.className = "bg-pink-100 px-4 py-2 m-2 sm:m-4 rounded-md";
    allBtn.onclick = () => {
      currentCategory = "all";
      currentPage = 1;
      loadProducts();
    };
    categoriesContainer.appendChild(allBtn);

    categoriesMap.forEach((name, slug) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.dataset.category = slug;
      btn.className = "bg-pink-100 px-4 py-2 m-2 sm:m-4 rounded-md";
      btn.onclick = () => {
        currentCategory = slug;
        currentPage = 1;
        loadProducts();
      };
      categoriesContainer.appendChild(btn);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

sortSelect?.addEventListener("change", () => {
  currentSort = sortSelect.value;
  currentPage = 1;
  loadProducts();
});


nextBtn?.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadProducts();
  }
});
prevBtn?.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadProducts();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadCategories();
  loadProducts();
});
