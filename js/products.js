import { products } from "./data.js";
import { addToCart} from "./cart.js";
import { updateCartCount } from "./cart.js";
import {displayCart} from "./cart.js";
let currentProducts = [...products];
 const productsContainer = document.getElementById("products-container");
export const displayProducts= (productsList) => {
    productsContainer.innerHTML = "";
    productsList.forEach(product => { 
        const productCard = document.createElement("div");
    productCard.className = "bg-pink-50 p-8 rounded-lg shadow-lg";

    productCard.innerHTML = `+
      <img src="${product.image}" class="w-64 h-64 object-cover rounded-lg" />
      <h3 class="text-2xl font-bold text-gray-500 mt-4">${product.name}</h3>
      <p class="text-xl text-gray-400 m-4">$${product.price}</p>
      <button class="text-white bg-gray-500 rounded p-2 ">Add to Cart</button>
    `;

      productsContainer.appendChild(productCard); 
        // EventListener for button (add to cart, update cart count)
    const addButton = productCard.querySelector("button");
  addButton.addEventListener("click", () => {
  addToCart(product.id);
  updateCartCount();
});

});
  
    

const categoryBtns = document.querySelectorAll(".categries button");

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category; 
    filterByCategory(category);
  });
});
 


}
export const filterByCategory= (category) => {
    if (category === "all") {
        currentProducts = [...products];
    } else {
        currentProducts = products.filter(product => product.category === category);
    }
    displayProducts(currentProducts);
}

displayProducts(currentProducts);
displayCart();