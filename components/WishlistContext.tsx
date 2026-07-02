"use client";

import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { Product } from "@/types/product";
import {
  createLocalStorageStore,
  useLocalStorageStore,
} from "@/lib/local-storage-store";

export interface WishlistItem {
  documentId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  has: (documentId: string) => boolean;
  toggle: (product: Product) => void;
  remove: (documentId: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  count: 0,
  has: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
});

export function useWishlist() {
  return useContext(WishlistContext);
}

const STORAGE_KEY = "forma-wishlist";
const wishlistStore = createLocalStorageStore<WishlistItem[]>(STORAGE_KEY, []);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorageStore(wishlistStore);

  const has = (documentId: string) =>
    items.some((i) => i.documentId === documentId);

  const toggle = (product: Product) => {
    setItems((prev) =>
      prev.some((i) => i.documentId === product.documentId)
        ? prev.filter((i) => i.documentId !== product.documentId)
        : [
            ...prev,
            {
              documentId: product.documentId,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.image?.[0]?.url,
            },
          ],
    );
  };

  const remove = (documentId: string) =>
    setItems((prev) => prev.filter((i) => i.documentId !== documentId));

  const clear = () => setItems([]);

  const count = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{ items, count, has, toggle, remove, clear }}
    >
      {children}
    </WishlistContext.Provider>
  );
}