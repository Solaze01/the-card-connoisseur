import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { OrderStatus } from "@/types/order";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_id", orderId)
    .select("id, order_id, status")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
