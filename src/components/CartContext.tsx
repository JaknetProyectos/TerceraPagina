"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

export function CartProvider({ children }: any) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      if (prev.find(i => i.experienceId === item.experienceId)) return prev;
      return [...prev, item];
    });
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setCart(prev =>
      prev.map(item =>
        item.experienceId === id ? { ...item, ...updates } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(i => i.experienceId !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("CartContext missing");
  return ctx;
};