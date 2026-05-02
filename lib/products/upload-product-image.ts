import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  buildProductImagePath,
  productImagesBucket,
  validateProductImage,
} from "@/lib/products/product-image";

export async function uploadProductImage(file: File) {
  validateProductImage(file);

  const supabase = createSupabaseAdminClient();
  const filePath = buildProductImagePath(file);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(productImagesBucket)
    .upload(filePath, fileBuffer, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(productImagesBucket).getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error("Unable to generate a public image URL.");
  }

  return {
    imageUrl: data.publicUrl,
    path: filePath,
  };
}
