"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

type CartContextValue = {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product) => void;
  increaseQuantity: (slug: string) => void;
  decreaseQuantity: (slug: string) => void;
  removeItem: (slug: string) => void;
  getItemQuantity: (slug: string) => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItem = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.slug === product.slug);

      if (existingItem) {
        return currentItems.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (slug: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (slug: string) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.slug !== slug) {
          return [item];
        }

        if (item.quantity === 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  const removeItem = (slug: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.slug !== slug),
    );
  };

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      itemCount,
      subtotal,
      addItem,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      getItemQuantity: (slug: string) =>
        cartItems.find((item) => item.slug === slug)?.quantity ?? 0,
    }),
    [cartItems, itemCount, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
