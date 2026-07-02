"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Product } from "@/types/product";

interface PreviewContextType {
  product: Product | null;
  collection: Product[];
  currentIndex: number;
  hasNext: boolean;
  hasPrev: boolean;
  open: (product: Product, collection?: Product[]) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

const PreviewContext = createContext<PreviewContextType>({
  product: null,
  collection: [],
  currentIndex: -1,
  hasNext: false,
  hasPrev: false,
  open: () => {},
  close: () => {},
  next: () => {},
  prev: () => {},
});

export function usePreview() {
  return useContext(PreviewContext);
}

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [collection, setCollection] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const product = currentIndex >= 0 ? collection[currentIndex] ?? null : null;

  const open = useCallback((p: Product, coll?: Product[]) => {
    if (coll && coll.length > 0) {
      const idx = coll.findIndex((x) => x.documentId === p.documentId);
      setCollection(coll);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else {
      setCollection([p]);
      setCurrentIndex(0);
    }
  }, []);

  const close = useCallback(() => setCurrentIndex(-1), []);

  const next = useCallback(
    () => setCurrentIndex((i) => (i < collection.length - 1 ? i + 1 : i)),
    [collection.length],
  );

  const prev = useCallback(
    () => setCurrentIndex((i) => (i > 0 ? i - 1 : i)),
    [],
  );

  const hasNext = currentIndex >= 0 && currentIndex < collection.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <PreviewContext.Provider
      value={{
        product,
        collection,
        currentIndex,
        hasNext,
        hasPrev,
        open,
        close,
        next,
        prev,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}
