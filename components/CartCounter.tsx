"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";

export default function CartCounter() {
  const { count, setOpen } = useCart();

  return (
    <button
      onClick={() => setOpen(true)}
      className="relative cursor-pointer"
      aria-label={`Cart with ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingCart size={20} />

      {count > 0 && (
        <span
          suppressHydrationWarning
          className="absolute -top-2 -right-3 bg-[#233329] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
        >
          {count}
        </span>
      )}
    </button>
  );
}
