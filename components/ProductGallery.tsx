"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImage } from "@/types/product";

export default function ProductGallery({ images }: { images?: ProductImage[] }) {
  const all = images && images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (all.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-400">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden">
        <Image
          key={active}
          src={all[active].url}
          alt={all[active].name}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1023px) 100vw, 50vw"
          priority
        />
      </div>

      {all.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {all.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden border-2 transition ${
                i === active
                  ? "border-green-deep"
                  : "border-transparent hover:border-cream-border"
              }`}
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
  );
}