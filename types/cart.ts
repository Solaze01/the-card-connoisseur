import type { Product } from "@/types/product";

export type CartItem = Product & {
  quantity: number;
};
