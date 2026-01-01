import { products } from "./data.js";
import { addToCart, updateCartCount } from "./cart.js";

const productsContainer = document.getElementById("products-container");
let currentProducts = [...products];

export const displayProducts = (productsList) => {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  productsList.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "bg-pink-50 p-8 rounded-lg shadow-lg";
    productCard.innerHTML = `
      <img src="${product.image}" class="w-64 h-64 object-cover rounded-lg" />
      <h3 class="text-2xl font-bold text-gray-500 mt-4">${product.name}</h3>
      <p class="text-xl text-gray-400 m-4">$${product.price}</p>
      <button class="text-white bg-gray-500 rounded p-2">Add to Cart</button>
    `;
    const addButton = productCard.querySelector("button");
    addButton.addEventListener("click", () => {
      addToCart(product.id);
      updateCartCount();
    });
    productsContainer.appendChild(productCard);
  });

  const categoryBtns = document.querySelectorAll(".categries button");
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      filterByCategory(category);
    });
  });
}

export const filterByCategory = (category) => {
  if (category === "all") {
    currentProducts = [...products];
  } else {
    currentProducts = products.filter(product => product.category === category);
  }
  displayProducts(currentProducts);
}

displayProducts(currentProducts);

const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", () => {
  sortProducts(sortSelect.value);
});
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
 displayProducts(getPaginatedProducts());
  currentProducts = sortedProducts;
};
let currentPage = 1;
const itemsPerPage = 3;
const getPaginatedProducts = () => {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return currentProducts.slice(start, end);
};
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayProducts(getPaginatedProducts());
  }
});

nextBtn.addEventListener("click", () => {
  const maxPage = Math.ceil(currentProducts.length / itemsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    displayProducts(getPaginatedProducts());
  }
});
