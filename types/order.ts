import type { CartItem } from "@/types/cart";

export type CreateOrderPayload = {
  cartItems: CartItem[];
};

export type OrderStatus =
  | "new"
  | "confirmed"
  | "processing"
  | "delivered"
  | "cancelled";

export type UpdateOrderStatusPayload = {
  status: OrderStatus;
};

export type CreatedOrder = {
  id: string;
  orderId: string;
  totalAmount: number;
};

export type OrderSummary = {
  id: string;
  orderId: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  itemCount: number;
};

export type OrderItemDetail = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDetail = {
  id: string;
  orderId: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  itemCount: number;
  customerName: string | null;
  phoneNumber: string | null;
  deliveryAddress: string | null;
  additionalNote: string | null;
  items: OrderItemDetail[];
};
