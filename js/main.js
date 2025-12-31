import { products } from "./data.js";
import { addToCart} from "./cart.js";
import { updateCartCount } from "./cart.js";

  

document.addEventListener("DOMContentLoaded", () => {

  // Slider
  const slider = document.getElementById("slider");
  const sliders = slider.children.length;
  let index = 0;

  const showSlide = () => {
    slider.style.transform = `translateX(-${index * 100}%)`;
  };

  const nextSlide = () => {
    index = (index + 1) % sliders;
    showSlide();
  };

  const prevSlide = () => {
    index = (index - 1 + sliders) % sliders;
    showSlide();
  };

  document.getElementById("nextBtn").addEventListener("click", nextSlide);
  document.getElementById("prevBtn").addEventListener("click", prevSlide);

  // Add products
  const productsContainer = document.getElementById("products-container");

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "bg-pink-50 p-8 rounded-lg shadow-lg";

    productCard.innerHTML = `
      <img src="${product.image}" class="w-64 h-64 object-cover rounded-lg" />
      <h3 class="text-2xl font-bold text-gray-500 mt-4">${product.name}</h3>
      <p class="text-xl text-gray-400 m-4">$${product.price}</p>
      <button class="text-white bg-gray-500 rounded p-2 ">Add to Cart</button>
    `;

    // EventListener for button (add to cart, update cart count)
    const addButton = productCard.querySelector("button");
  addButton.addEventListener("click", () => {
  addToCart(product.id);
  updateCartCount();
});




    productsContainer.appendChild(productCard);
  });
  updateCartCount();
});
