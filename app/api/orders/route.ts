import { NextResponse } from "next/server";

import { createOrderFromCart } from "@/lib/orders/create-order";
import type { CreateOrderPayload } from "@/types/order";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderPayload;
    const cartItems = body.cartItems ?? [];

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 },
      );
    }

    const order = await createOrderFromCart(cartItems);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create order";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
