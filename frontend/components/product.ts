// export const products = [
//     {
//       id: 1,
//       name: "Classic Straight Fit Jeans",
//       price: 89.99,
//       image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80",
//       colors: ["#000000", "#3B3B3B", "#7C7C7C"]
//     },
//     {
//       id: 2,
//       name: "Slim Fit Dark Wash Jeans",
//       price: 99.99,
//       image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80",
//       colors: ["#1B365D", "#3B3B3B"]
//     },
//     {
//       id: 3,
//       name: "Relaxed Fit Vintage Wash",
//       price: 79.99,
//       image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80",
//       colors: ["#7C7C7C", "#A6A6A6"]
//     },
//     {
//       id: 4,
//       name: "Skinny High-Rise Jeans",
//       price: 94.99,
//       image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80",
//       colors: ["#000000", "#1B365D"]
//     },
//     {
//       id: 5,
//       name: "Distressed Boyfriend Jeans",
//       price: 109.99,
//       image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80",
//       colors: ["#7C7C7C", "#A6A6A6", "#3B3B3B"]
//     },
//     {
//       id: 6,
//       name: "Premium Selvedge Denim",
//       price: 149.99,
//       image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80",
//       colors: ["#1B365D", "#000000"]
//     }
//   ];

import { BACKEND_URL } from "@/config/config";
import axios from "axios";

const fetchProducts = async()=>{
  try {
    const res = await axios.get(`${BACKEND_URL}/api/v1/products`);

    return res.data.products;
  } catch (error) {
    console.log(error);
    
  }
}