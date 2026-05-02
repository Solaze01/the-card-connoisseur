import { HomePage } from "@/components/home-page";
import { products as sampleProducts } from "@/data/products";
import { getStorefrontProducts } from "@/lib/products/admin-products";

export default async function Home() {
  let products = sampleProducts;

  try {
    const databaseProducts = await getStorefrontProducts();

    if (databaseProducts.length > 0) {
      products = databaseProducts;
    }
  } catch {
    products = sampleProducts;
  }

  return <HomePage products={products} />;
}
