import { fetchProducts } from "./api.js";

const cartContainer = document.getElementById("cartContainer");
const placeOrderBtn = document.getElementById("placeOrder");
let cart = JSON.parse(localStorage.getItem("cart")) || [];


const toaster = document.getElementById("toaster") || (() => {
    const t = document.createElement("div");
    t.id = "toaster";
    t.className = "fixed top-5 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-50";
    document.body.appendChild(t);
    return t;
})();

export function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `px-4 py-2 rounded text-white shadow ${type === "success" ? "bg-green-500" : "bg-red-500"}`;
    toast.textContent = message;
    toaster.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}


function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

export function updateCartCount() {
    const counter = document.getElementById("cart-count");
    if (counter) counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(productId) {
    const item = cart.find(i => i.productId === productId);
    item ? item.quantity++ : cart.push({ productId, quantity: 1 });
    saveCart();
    updateCartCount();
    showToast("Added to cart");
}

async function displayCart() {
    if (!cartContainer) return;
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="text-center text-gray-500 w-full">Cart is empty</p>`;
        renderOrderSummary([]);
        return;
    }

    
    const productPromises = cart.map(item => 
        fetch(`https://api.escuelajs.co/api/v1/products/${item.productId}`).then(res => res.json())
    );
    const products = await Promise.all(productPromises);

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product || product.error) return;

        const imgUrl = product.images?.[0] || "https://placehold.co/600x400";
        const card = document.createElement("div");
        card.className = "flex flex-col bg-pink-50 rounded-xl shadow-md p-4 w-72 min-h-[400px]";
        
        card.innerHTML = `
          <img src="${imgUrl}" 
       draggable="false" 
       onerror="this.src='https://via.placeholder.com/600x400';" 
       class="h-40 w-full object-contain rounded-lg mb-3 select-none pointer-events-none" 
       oncontextmenu="return false;" />
            <h3 class="font-semibold text-gray-600 mb-2 line-clamp-2">${product.title}</h3>
            <p class="text-xl font-bold text-gray-400 mb-4">$${(product.price * item.quantity).toFixed(2)}</p>
            <div class="flex items-center justify-between mt-auto bg-white rounded-lg p-2">
                <button class="remove bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md font-bold">-</button>
                <span class="font-bold text-gray-700">${item.quantity}</span>
                <button class="add bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md font-bold">+</button>
            </div>
        `;

        card.querySelector(".remove").onclick = () => {
            if (item.quantity > 1) item.quantity--;
            else cart = cart.filter(i => i.productId !== item.productId);
            saveCart(); displayCart(); updateCartCount();
        };

        card.querySelector(".add").onclick = () => {
            item.quantity++;
            saveCart(); displayCart(); updateCartCount();
        };

        cartContainer.appendChild(card);
    });

    renderOrderSummary(products);
}

function renderOrderSummary(products) {
    const summary = document.getElementById("orderSummary");
    if (!summary) return;

    const totalPrice = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return product ? sum + (product.price * item.quantity) : sum;
    }, 0);

    summary.innerHTML = `
        <div class="bg-pink-50 p-6 rounded-xl shadow-inner">
            <h2 class="text-xl font-bold mb-4 text-gray-700">Order Summary</h2>
            <p class="flex justify-between mb-2 text-gray-600">Total Items: <strong>${cart.reduce((s, i) => s + i.quantity, 0)}</strong></p>
            <p class="flex justify-between text-2xl text-gray-800 font-bold border-t pt-4 border-pink-200">Total: <span>$${totalPrice.toFixed(2)}</span></p>
        </div>
    `;
}

if (placeOrderBtn) {
    placeOrderBtn.onclick = () => {
        if (cart.length === 0) return showToast("Your cart is empty", "error");
        cart = [];
        localStorage.removeItem("cart");
        displayCart();
        updateCartCount();
        showToast("Order placed successfully!");
    };
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    displayCart();
});