"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { Product } from "@/types/product";
import {
  createLocalStorageStore,
  useLocalStorageStore,
} from "@/lib/local-storage-store";

export interface CartItem {
  documentId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (documentId: string) => void;
  updateQuantity: (documentId: string, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clear: () => {},
  isOpen: false,
  setOpen: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

const STORAGE_KEY = "forma-cart";
const cartStore = createLocalStorageStore<CartItem[]>(STORAGE_KEY, []);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorageStore(cartStore);
  const [isOpen, setOpen] = useState(false);

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.documentId === product.documentId);

      if (existing) {
        return prev.map((i) =>
          i.documentId === product.documentId
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i,
        );
      }

      return [
        ...prev,
        {
          documentId: product.documentId,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image?.[0]?.url,
          quantity: 1,
        },
      ];
    });

    setOpen(true);
  };

  const removeItem = (documentId: string) => {
    setItems((prev) => prev.filter((i) => i.documentId !== documentId));
  };

  const updateQuantity = (documentId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(documentId);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.documentId === documentId
          ? {
              ...i,
              quantity,
            }
          : i,
      ),
    );
  };

  const clear = () => setItems([]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        isOpen,
        setOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}