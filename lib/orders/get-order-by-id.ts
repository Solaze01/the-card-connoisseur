import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { OrderDetail, OrderItemDetail, OrderStatus } from "@/types/order";

type DbOrderRow = {
  id: string;
  order_id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
};

type DbOrderItemRow = {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export async function getOrderById(orderId: string): Promise<OrderDetail | null> {
  const supabase = createSupabaseAdminClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_id, created_at, total_amount, status")
    .eq("order_id", orderId)
    .single()
    .returns<DbOrderRow>();

  if (orderError) {
    if (orderError.code === "PGRST116") {
      return null;
    }

    throw new Error(orderError.message);
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_id, product_name, unit_price, quantity, line_total")
    .eq("order_id", order.id)
    .returns<DbOrderItemRow[]>();

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const mappedItems: OrderItemDetail[] = (items ?? []).map((item) => ({
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    unitPrice: item.unit_price,
    quantity: item.quantity,
    lineTotal: item.line_total,
  }));

  const itemCount = mappedItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: order.id,
    orderId: order.order_id,
    createdAt: order.created_at,
    totalAmount: order.total_amount,
    status: order.status,
    itemCount,
    customerName: null,
    phoneNumber: null,
    deliveryAddress: null,
    additionalNote: null,
    items: mappedItems,
  };
}
