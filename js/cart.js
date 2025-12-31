import { products } from "./data.js";

const cartContainer = document.getElementById("cartContainer");
let cart = JSON.parse(localStorage.getItem("cart")) || [];


 export const displayCart= () => { 
cartContainer.innerHTML = "";

  cart.forEach((product) => { 
    const productCard = document.createElement("div");
    productCard.className = "bg-pink-50 p-8 rounded-lg shadow-lg";
    productCard.innerHTML = `
      <div class="bg-pink-50 p-5 rounded-lg shadow-lg w-1/2 mx-auto mb-4">
        <img src="${product.image}" class="w-1/2 mx-auto h-50  object-cover rounded-lg" />
        <h3 class="text-2xl font-bold text-gray-500 mt-4">${product.name}</h3>
        <p class="text-xl text-gray-400 m-4">
          <button class=" removeBtn text-white bg-gray-500 rounded p-2">Remove </button>
          ${product.quantity}
          <button  class=" addBtn text-white bg-gray-500 rounded p-2">Add </button>
        </p>
        <p class="text-xl text-gray-400 m-4">total price:$${product.price * product.quantity}</p>
      </div>
    `;
      const removeBtn= productCard.querySelector(".removeBtn");
    removeBtn.addEventListener("click", () => removeProduct(product.id));
    const addBtn = productCard.querySelector(".addBtn");
    addBtn.addEventListener("click", () => addToCart(product.id));
    cartContainer.appendChild(productCard);

  });
}


export const addToCart=(productId) =>{
  const product = products.find((card) => card.id === productId);
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

export const removeProduct=(productId) =>{
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex > -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    } else {
      cart.splice(productIndex, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
  updateCartCount() ;
    
  }
}
    //
export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, product) => sum + product.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = totalCount;
  if (totalCount >0) {
    cartCountElement.style.display = "inline-block";
  } else {
    cartCountElement.style.display = "none";
  }
}  
  document.addEventListener("DOMContentLoaded", () => displayCart());
