"use client";

import Image from "next/image";
import { useState, MouseEvent } from "react";
import { Product } from "@/types/product";
import { useCart } from "./CartContext";
import { usePreview } from "./PreviewContext";

interface ProductCardProps {
  product: Product;
  collection?: Product[];
}

export default function ProductCard({ product, collection }: ProductCardProps) {
  const imageUrl = product.image?.[0]?.url;
  const { addItem } = useCart();
  const { open: openPreview } = usePreview();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="hover-lift group bg-background rounded-lg overflow-hidden">
      <div
        className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
        onClick={() => openPreview(product, collection)}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
            No image
          </div>
        )}

        {/* Slide-up Add to cart button */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAdd}
            className={`w-full py-3 text-sm tracking-wide transition-colors ${
              added
                ? "bg-green-mid text-white"
                : "bg-green-deep text-white hover:bg-green-hover"
            }`}
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-medium text-foreground">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.category?.name}</p>
        <p className="mt-2 text-foreground font-semibold">${product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}
