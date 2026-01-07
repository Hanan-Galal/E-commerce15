import { products } from "./data.js";
import { addToCart} from "./cart.js";
import { updateCartCount } from "./cart.js";

 const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  }); 
 updateCartCount();

 const links = document.querySelectorAll(".nav-link");
  const currentPath = location.pathname.toLowerCase();

  links.forEach(link => {
    const page = link.dataset.page.toLowerCase();
    if (currentPath.includes(page) || (currentPath === "/" && page === "index")) {
      link.classList.add("bg-pink-100", "text-black", "font-semibold");
    }
  });


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
    productCard.className = "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72";

    productCard.innerHTML = `
      <img src="${product.image}"  loading="lazy" class="w-full h-48 object-cover rounded-lg" />
      <h3 class="text-lg font-semibold text-gray-600">${product.name}</h3>
      <p class="text-xl text-gray-400 m-4">$${product.price}</p>
      <button class="mt-4 bg-gray-600 text-white py-2 rounded-lg cursor-pointer  hover:bg-gray-300 ">Add to Cart</button>
 <a
  href="./pages/cart.html"
  class="add-check mt-2 block text-gray-600 font-medium
         opacity-0  transition-opacity duration-300"
>
  Added successfully
</a>


    `;

    // EventListener for button (add to cart, update cart count)
    const addButton = productCard.querySelector("button");
   
  addButton.addEventListener("click", () => {
  addToCart(product.id);
  updateCartCount();
   const addCheck=productCard.querySelector(".add-check");
  addCheck.classList.remove("opacity-0");
addCheck.classList.add("opacity-100");

  setTimeout(() => {
    addCheck.classList.remove("opacity-100");
    addCheck.classList.add("opacity-0");
  }, 2000);

  

});

    productsContainer.appendChild(productCard);
  });
  updateCartCount();
});
