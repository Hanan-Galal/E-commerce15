import { getProducts } from "./api.js";
import { addToCart, updateCartCount, showToast } from "./cart.js";

const productsContainer = document.getElementById("products-container");
let allProducts = [];
let currentProducts = [];

let query = { page: 1, limit: 4 };

export const displayProducts = (productsList) => {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  productsList.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = `
      bg-white rounded-xl shadow-md p-4 flex flex-col
      min-h-[400px] w-full sm:w-72 m-2
      transition-transform transform hover:scale-105
    `;

    productCard.innerHTML = `
      <div class="flex-1 flex flex-col">
        <img src="${product.image}" class="w-full h-48 object-contain mb-3 bg-gray-50 p-2 rounded" />
        <h3 class="text-gray-700 font-medium mb-2 line-clamp-2">${product.title}</h3>
        <p class="text-gray-500 mb-2">$${product.price}</p>
      </div>
      <button
        class="mt-auto bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
        data-id="${product.id}">
        Add to Cart
      </button>
    `;

    const addButton = productCard.querySelector("button");
    addButton.addEventListener("click", () => {
      addToCart(product.id);
      updateCartCount();
      showToast(`${product.title} added to cart`, "success");
    });

    productsContainer.appendChild(productCard);
  });

  updateCartCount();
};


function paginateProducts() {
  const offset = (query.page - 1) * query.limit;
  return currentProducts.slice(offset, offset + query.limit);
}


export function render() {
  const data = paginateProducts();
  displayProducts(data);

  const pageInfo = document.getElementById("pageInfo");
  const totalPages = Math.ceil(currentProducts.length / query.limit);
  pageInfo.textContent = `Page ${query.page} of ${totalPages}`;
}

export const filterByCategory = (category) => {
  currentProducts =
    category === "all"
      ? [...allProducts]
      : allProducts.filter((p) => p.category === category);
  query.page = 1;
  render();
};

export const sortProducts = (type) => {
  let sorted = [...currentProducts];
  switch (type) {
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name-a-z":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-z-a":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }
  currentProducts = sorted;
  query.page = 1;
  render();
};


const categoryBtns = document.querySelectorAll(".categories button");
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterByCategory(btn.dataset.category);
  });
});

const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", () => {
  sortProducts(sortSelect.value);
});

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(currentProducts.length / query.limit);
  if (query.page < totalPages) {
    query.page++;
    render();
  }
});

prevBtn.addEventListener("click", () => {
  if (query.page > 1) {
    query.page--;
    render();
  }
});


export const loadProducts = async () => {
  allProducts = await getProducts();
  currentProducts = [...allProducts];
  render();
};

document.addEventListener("DOMContentLoaded", loadProducts);
