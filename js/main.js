console.log("main loaded");

import { getProducts } from "./api.js";
import { addToCart, updateCartCount, showToast } from "./cart.js";

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

updateCartCount();

const links = document.querySelectorAll(".nav-link");
const currentPath = location.pathname.toLowerCase();

links.forEach(link => {
  const page = link.dataset.page.toLowerCase();
  if (currentPath.includes(page) || (currentPath === "/" && page === "index")) {
    link.classList.add("bg-pink-100", "text-black", "font-semibold");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  const productsContainer = document.getElementById("products-container");

  const displayProducts = (productsList) => {
    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    productsList.forEach(product => {
      const productCard = document.createElement("div");
     productCard.className =
  "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72 min-h-[450px]";

      productCard.innerHTML = `
       <img src="${product.image}" class="w-full h-48 object-cover rounded-lg mb-3" />

  <h3 class="text-lg font-semibold text-gray-600 mb-2" style="
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  ">
    ${product.title}
  </h3>

  <p class="text-xl text-gray-400 mb-2">$${product.price}</p>

  <button class="mt-auto bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-400">
    Add to Cart
  </button>
      `;

      const addButton = productCard.querySelector("button");

      addButton.addEventListener("click", () => {
   addToCart(product);

        updateCartCount();
        showToast("Added to cart successfully", "success");
      });

      productsContainer.appendChild(productCard);
    });
  };

  const loadAllProducts = async () => {
    const products = await getProducts();
    displayProducts(products);
  };

  loadAllProducts();
});
