import { NextResponse } from "next/server";

import { uploadProductImage } from "@/lib/products/upload-product-image";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please choose an image file to upload." },
        { status: 400 },
      );
    }

    const upload = await uploadProductImage(file);

    return NextResponse.json(upload, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to upload product image";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
