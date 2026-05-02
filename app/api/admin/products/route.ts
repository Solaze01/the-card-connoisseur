import { NextResponse } from "next/server";

import { createAdminProduct } from "@/lib/products/admin-products";
import type { ProductFormPayload } from "@/types/product";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ProductFormPayload;
    const product = await createAdminProduct(payload);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create product";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
