"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "vmt-cart";

export interface CartItem {
  experienceId: string;
  title: string;
  destinationName: string;
  price: number;
  fecha?: string;
  personas?: number;
  description?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.experienceId === item.experienceId
      );

      if (existing) {
        return prev.map((i) =>
          i.experienceId === item.experienceId
            ? {
                ...i,
                ...item,
                personas:
                  (i.personas || 1) + (item.personas || 1),
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          personas: item.personas || 1,
        },
      ];
    });
  };

  const updateItem = (
    id: string,
    updates: Partial<CartItem>
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.experienceId === id
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) =>
      prev.filter((i) => i.experienceId !== id)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("CartContext missing");
  }

  return ctx;
};