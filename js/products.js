import { products } from "./data.js";
import { addToCart, updateCartCount } from "./cart.js";
import { showToast } from "./cart.js";

const productsContainer = document.getElementById("products-container");
let currentProducts = [...products];

export const displayProducts = (productsList) => {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  productsList.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className =
      "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72";

    productCard.innerHTML = `
      <img src=".${product.image}" class="w-full h-48 object-cover rounded-lg" />
      <h3 class="text-lg font-semibold text-gray-600">${product.name}</h3>
      <p class="text-xl text-gray-400 m-4">$${product.price}</p>
      <button class="mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-400">
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

  updateCartCount();
};



// FILTER 
export const filterByCategory = (category) => {
  currentProducts =
    category === "all"
      ? [...products]
      : products.filter((product) => product.category === category);
  query.page = 1;
   render();
};

// SORT
export const sortProducts = (type) => {
  let sortedProducts = [...currentProducts];

  switch (type) {
    case "price-low":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;

    case "name-a-z":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "name-z-a":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
  currentProducts = sortedProducts;
query.page = 1; 
   render();
};

//events

// category buttons
const categoryBtns = document.querySelectorAll(".categories button");
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterByCategory(btn.dataset.category);
    render();
  });
});

// sort select
const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", () => {
  sortProducts(sortSelect.value);
});

//state of pagination 
let query = {
  page: 1,
  limit: 4,
};
//pagination function
export function paginateProducts(params) {
    const { page, limit } = params;
  const offset = (page - 1) * limit;
    return currentProducts.slice(offset, offset + limit);

}
//render function
export function render() {
  const data = paginateProducts(query);

  displayProducts(data);
  // update page info
  const pageInfo = document.getElementById("pageInfo");
  const totalPages = Math.ceil(currentProducts.length / query.limit);
  pageInfo.textContent = `Page ${query.page} of ${totalPages}`;
}
//next
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

render();

