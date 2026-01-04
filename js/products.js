import { products } from "./data.js";
import { addToCart, updateCartCount } from "./cart.js";

const productsContainer = document.getElementById("products-container");
let currentProducts = [...products];

export const displayProducts = (productsList) => {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  productsList.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72";

    productCard.innerHTML = `
      <img src=".${product.image}" class="w-full h-48 object-cover rounded-lg" />
      <h3 class="text-lg font-semibold text-gray-600">${product.name}</h3>
      <p class="text-xl text-gray-400 m-4">$${product.price}</p>
      <button class="mt-4 bg-gray-600 text-white py-2 rounded-lg  hover:bg-gray-300">Add to Cart</button>
   <a href="./pages/cart.html"
   class="add-check hidden mt-2 hidden text-pink-600 font-medium">
  Added successfully
</a>

    `;
    const addButton = productCard.querySelector("button");
    addButton.addEventListener("click", () => {
      addToCart(product.id);
      updateCartCount();
       const addCheck=productCard.querySelector(".add-check");
  addCheck.classList.add("inline-block");
    });
    productCard.addEventListener("mouseleave", () => {
  const addCheck = productCard.querySelector(".add-check");
  addCheck.classList.remove("inline-block");
});
    productsContainer.appendChild(productCard);
  });
  

  const categoryBtns = document.querySelectorAll(".categries button");
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      filterByCategory(category);
    });
  });
};

export const filterByCategory = (category) => {
  if (category === "all") {
    currentProducts = [...products];
  } else {
    currentProducts = products.filter(
      (product) => product.category === category
    );
  }
  displayProducts(currentProducts);
};

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
