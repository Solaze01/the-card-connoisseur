import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { OrderStatus, OrderSummary } from "@/types/order";

type GetOrdersOptions = {
  status?: OrderStatus | "all";
  search?: string;
};

type DbOrderRow = {
  id: string;
  order_id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
};

type DbOrderItemRow = {
  order_id: string;
  quantity: number;
};

export async function getOrders({
  status = "all",
  search = "",
}: GetOrdersOptions = {}): Promise<OrderSummary[]> {
  const supabase = createSupabaseAdminClient();

  let ordersQuery = supabase
    .from("orders")
    .select("id, order_id, created_at, total_amount, status")
    .order("created_at", { ascending: false });

  if (status !== "all") {
    ordersQuery = ordersQuery.eq("status", status);
  }

  if (search.trim()) {
    ordersQuery = ordersQuery.ilike("order_id", `%${search.trim()}%`);
  }

  const { data: orders, error: ordersError } =
    await ordersQuery.returns<DbOrderRow[]>();

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  if (!orders || orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((order) => order.id);

  const { data: orderItems, error: orderItemsError } = await supabase
    .from("order_items")
    .select("order_id, quantity")
    .in("order_id", orderIds)
    .returns<DbOrderItemRow[]>();

  if (orderItemsError) {
    throw new Error(orderItemsError.message);
  }

  const itemCountByOrderId = new Map<string, number>();

  for (const item of orderItems ?? []) {
    itemCountByOrderId.set(
      item.order_id,
      (itemCountByOrderId.get(item.order_id) ?? 0) + item.quantity,
    );
  }

  return orders.map((order) => ({
    id: order.id,
    orderId: order.order_id,
    createdAt: order.created_at,
    totalAmount: order.total_amount,
    status: order.status,
    itemCount: itemCountByOrderId.get(order.id) ?? 0,
  }));
}
