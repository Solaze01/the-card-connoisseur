import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { generateOrderId } from "@/lib/orders/generate-order-id";
import type { CartItem } from "@/types/cart";
import type { CreatedOrder } from "@/types/order";

function assertCartHasItems(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }
}

function calculateTotal(cartItems: CartItem[]) {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

async function insertOrder(
  supabase: SupabaseClient,
  cartItems: CartItem[],
): Promise<CreatedOrder> {
  const orderId = generateOrderId();
  const totalAmount = calculateTotal(cartItems);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_id: orderId,
      total_amount: totalAmount,
      status: "new",
    })
    .select("id, order_id, total_amount")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Failed to create order");
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
    line_total: item.price * item.quantity,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    throw new Error(orderItemsError.message);
  }

  return {
    id: order.id,
    orderId: order.order_id,
    totalAmount: order.total_amount,
  };
}

export async function createOrderFromCart(cartItems: CartItem[]) {
  assertCartHasItems(cartItems);

  const supabase = createSupabaseAdminClient();

  return insertOrder(supabase, cartItems);
}
