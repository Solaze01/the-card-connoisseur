import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { updateOrderStatus } from "@/lib/orders/update-order-status";
import type { OrderStatus, UpdateOrderStatusPayload } from "@/types/order";

const validStatuses: OrderStatus[] = [
  "new",
  "confirmed",
  "processing",
  "delivered",
  "cancelled",
];

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { orderId } = await context.params;
    const body = (await request.json()) as UpdateOrderStatusPayload;

    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    const updatedOrder = await updateOrderStatus(orderId, body.status);

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update order status";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
