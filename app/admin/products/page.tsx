import { ProductManagement } from "@/components/admin/product-management";
import { getAdminProducts } from "@/lib/products/admin-products";
import type { AdminProduct } from "@/types/product";

export default async function AdminProductsPage() {
  let products: AdminProduct[] = [];
  let initialError: string | null = null;

  try {
    products = await getAdminProducts();
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : "Unable to load products";
  }

  return <ProductManagement initialProducts={products} initialError={initialError} />;
}
