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
   productCard.className =
  "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72 min-h-[450px]";

   productCard.innerHTML = `
 <img
  src="${product.image}"
  draggable="false"
  loading="lazy"
  class="w-full h-48 object-contain select-none"
/>


  <h3 class="text-lg font-semibold text-gray-600 mb-2 line-clamp-2">
    ${product.title}
  </h3>

  <p class="text-xl text-gray-400 mb-2">$${product.price}</p>

  <button class="mt-auto bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-400 transition">
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
