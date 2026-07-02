"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";

export default function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, total, count } =
    useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-cream-border">
          <h2
            className="text-xl font-serif text-foreground"
            suppressHydrationWarning
          >
            Your cart{count > 0 && ` (${count})`}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-foreground hover:text-green-mid transition"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <p className="text-2xl font-serif text-foreground mb-3">
              Your cart is empty
            </p>
            <p className="text-muted text-sm mb-8 max-w-xs">
              Pieces built once, kept for decades. Start with something
              you&apos;ll never replace.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="bg-green-deep text-white px-8 py-4 rounded-sm hover:bg-green-hover transition"
            >
              Browse the collection
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
              {items.map((item) => (
                <div key={item.documentId} className="flex gap-3 sm:gap-4">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-100 rounded-sm overflow-hidden"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    )}
                  </Link>

                  <div className="flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="font-medium text-foreground hover:text-green-mid transition"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted mt-1">
                      ${item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-cream-border rounded-sm">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.documentId,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-1 text-foreground hover:bg-white transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.documentId,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 text-foreground hover:bg-white transition"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.documentId)}
                        className="text-gray-400 hover:text-red-600 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="font-semibold text-foreground self-start">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-border px-4 sm:px-6 py-5 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-foreground">Subtotal</span>
                <span className="font-serif font-semibold text-foreground">
                  ${total.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted">
                Shipping and taxes calculated at checkout.
              </p>
              <button className="w-full bg-green-deep text-white py-4 rounded-sm hover:bg-green-hover transition">
                Checkout
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full text-center text-sm text-muted hover:text-foreground transition"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}