import { NextResponse } from "next/server";

import {
  deleteAdminProduct,
  updateAdminProduct,
} from "@/lib/products/admin-products";
import type { ProductFormPayload } from "@/types/product";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { productId } = await context.params;
    const payload = (await request.json()) as ProductFormPayload;
    const product = await updateAdminProduct(productId, payload);

    return NextResponse.json(product);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update product";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { productId } = await context.params;
    await deleteAdminProduct(productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete product";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
