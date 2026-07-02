"use client";

import Image from "next/image";
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreview } from "./PreviewContext";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { Product } from "@/types/product";

function stockLabel(stock?: number) {
  if (stock === undefined) return null;
  if (stock === 0) return { text: "Out of stock", color: "text-red-600" };
  if (stock <= 5)
    return { text: `Low stock — only ${stock} left`, color: "text-gold" };
  return { text: "In stock", color: "text-green-mid" };
}

function PreviewContent({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const images = product.image ?? [];
  const imageUrl = images[activeImage]?.url;
  const wished = hasWishlist(product.documentId);
  const stock = stockLabel(product.stock);

  const variantsText = Array.isArray(product.variants)
    ? product.variants.join(", ")
    : product.variants;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      key={product.id}
      className="md:grid md:grid-cols-2"
      style={{ animation: "preview-swap 0.3s ease-out" }}
    >
      {/* Image */}
      <div className="flex flex-col gap-3 p-4 md:p-6">
        <div className="relative aspect-square bg-gray-100 overflow-hidden group rounded-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              No image
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 flex-wrap justify-center">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden border-2 transition ${
                  i === activeImage
                    ? "border-green-deep"
                    : "border-transparent hover:border-cream-border"
                }`}
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === activeImage}
              >
                <Image
                  src={img.url}
                  alt={img.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
        {product.category?.name && (
          <p className="uppercase tracking-[0.2em] text-xs text-muted mb-4">
            {product.category.name}
          </p>
        )}

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-4">
          {product.name}
        </h2>

        <p className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
          ${product.price.toLocaleString()}
        </p>

        {stock && (
          <p className={`text-sm mb-6 ${stock.color}`}>{stock.text}</p>
        )}

        {product.description && (
          <p className="text-muted leading-7 whitespace-pre-line mb-6">
            {product.description}
          </p>
        )}

        {product.material && (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
              Material
            </p>
            <p className="text-foreground">{product.material}</p>
          </div>
        )}

        {product.dimensions && (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
              Dimensions
            </p>
            <p className="text-foreground">{product.dimensions}</p>
          </div>
        )}

        {variantsText && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
              Variants
            </p>
            <p className="text-foreground">{variantsText}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleAdd}
            className={`flex-1 px-6 py-4 rounded-sm transition text-sm tracking-wide ${
              added
                ? "bg-green-mid text-white"
                : "bg-green-deep text-white hover:bg-green-hover"
            }`}
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            className={`px-5 py-4 rounded-sm border transition flex items-center justify-center ${
              wished
                ? "border-green-deep text-green-deep"
                : "border-cream-border text-foreground hover:border-green-mid hover:text-green-mid"
            }`}
          >
            <Heart
              size={20}
              className={`transition-transform duration-300 ${
                wished ? "scale-110 fill-current" : "scale-100"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductPreview() {
  const {
    product,
    close,
    next,
    prev,
    hasNext,
    hasPrev,
  } = usePreview();
  const [visible, setVisible] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const isOpen = product !== null;

  useEffect(() => {
    if (isOpen) {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = undefined;
      }
      document.body.style.overflow = "hidden";
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const raf = requestAnimationFrame(() => setVisible(true));
      const focusTimer = setTimeout(
        () => closeButtonRef.current?.focus(),
        120,
      );
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(focusTimer);
      };
    }
    document.body.style.overflow = "";
    previouslyFocused.current?.focus();
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    closeTimer.current = setTimeout(() => close(), 500);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowRight" && hasNext) {
        next();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        prev();
      } else if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, a, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasNext, hasPrev, next, prev]);

  if (!product) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} quick view`}
        className={`relative bg-background rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transition-all duration-500 ease-out ${
          visible
            ? "opacity-100 scale-100 rotate-0 translate-y-0"
            : "opacity-0 scale-[0.8] rotate-[360deg] -translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-foreground hover:text-green-mid transition"
          aria-label="Close preview"
        >
          <X size={24} />
        </button>

        {/* Prev / Next */}
        {hasPrev && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow transition"
            aria-label="Previous product"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {hasNext && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow transition"
            aria-label="Next product"
          >
            <ChevronRight size={24} />
          </button>
        )}

        <PreviewContent product={product} />
      </div>
    </div>
  );
}
