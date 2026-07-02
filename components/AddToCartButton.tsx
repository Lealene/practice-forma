"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { Product } from "@/types/product";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`px-8 py-4 rounded-sm transition self-start ${
        added
          ? "bg-green-deep text-white"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}