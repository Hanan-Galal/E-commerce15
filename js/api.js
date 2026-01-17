// export const products = [
//   {
//     id: 1,
//     name: "Hydrating Face Cream",
//     price: 25.0,
//     image: "./images/product1.webp",
//     category: "skincare",
//   },
//   {
//     id: 2,
//     name: "Revitalizing Hair Serum",
//     price: 30.0,
//     image: "./images/product2.webp",
//     category: "haircare",
//   },
//   {
//     id: 3,
//     name: "Gentle Foaming Cleanser",
//     price: 20.0,
//     image: "./images/product3.webp",
//     category: "skincare",
//   },
//   {
//     id: 4,
//     name: "Nourishing Night Balm",
//     price: 35.0,
//     image: "./images/product4.webp",
//     category: "skincare",
//   },
//   {
//     id: 5,
//     name: "Vitamin C Serum",
//     price: 32.0,
//     image: "./images/product5.webp",
//     category: "skincare",
//   },
//   {
//     id: 6,
//     name: "Sunscreen SPF 50",
//     price: 28.0,
//     image: "./images/product6.webp",
//     category: "skincare",
//   },
//   {
//     id: 7,
//     name: "Exfoliating Scrub",
//     price: 22.0,
//     image: "./images/product7.webp",
//     category: "bodycare",
//   },
//   {
//     id: 8,
//     name: "Moisturizing Body Lotion",
//     price: 26.0,
//     image: "./images/product8.webp",
//     category: "bodycare",
//   },
//   {
//     id: 9,
//     name: "Moisturizing Body Lotion",
//     price: 26.0,
//     image: "./images/product9.webp",
//     category: "haircare",
//   },
//     {
//     id: 1,
//     name: "Hydrating Face Cream",
//     price: 25.0,
//     image: "./images/product1.webp",
//     category: "skincare",
//   },
//   {
//     id: 2,
//     name: "Revitalizing Hair Serum",
//     price: 30.0,
//     image: "./images/product2.webp",
//     category: "haircare",
//   },
//   {
//     id: 3,
//     name: "Gentle Foaming Cleanser",
//     price: 20.0,
//     image: "./images/product3.webp",
//     category: "skincare",
//   },
//   {
//     id: 4,
//     name: "Nourishing Night Balm",
//     price: 35.0,
//     image: "./images/product4.webp",
//     category: "skincare",
//   },
//   {
//     id: 5,
//     name: "Vitamin C Serum",
//     price: 32.0,
//     image: "./images/product5.webp",
//     category: "skincare",
//   },
//   {
//     id: 6,
//     name: "Sunscreen SPF 50",
//     price: 28.0,
//     image: "./images/product6.webp",
//     category: "skincare",
//   },
//   {
//     id: 7,
//     name: "Exfoliating Scrub",
//     price: 22.0,
//     image: "./images/product7.webp",
//     category: "bodycare",
//   },
//   {
//     id: 8,
//     name: "Moisturizing Body Lotion",
//     price: 26.0,
//     image: "./images/product8.webp",
//     category: "bodycare",
//   },
//   {
//     id: 9,
//     name: "Moisturizing  Lotion",
//     price: 26.0,
//     image: "./images/product9.webp",
//     category: "haircare",
//   },
// ];
// js/api.js
const BASE_URL = "https://api.escuelajs.co/api/v1/products";

export async function fetchProducts({
  page = 1,
  limit = 50,
  category = "all",
}) {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({ offset, limit });

  if (category !== "all") {
    params.append("categoryId", category);
  }

  const res = await fetch(`${BASE_URL}?${params}`);
  return await res.json();
}




