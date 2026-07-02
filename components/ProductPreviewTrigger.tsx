"use client";

import { ReactNode } from "react";
import { Product } from "@/types/product";
import { usePreview } from "./PreviewContext";

interface Props {
  product: Product;
  children: ReactNode;
  className?: string;
}

export default function ProductPreviewTrigger({
  product,
  children,
  className,
}: Props) {
  const { open } = usePreview();

  return (
    <button
      type="button"
      onClick={() => open(product)}
      className={className}
      aria-label={`Preview ${product.name}`}
    >
      {children}
    </button>
  );
}
