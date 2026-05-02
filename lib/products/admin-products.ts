import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { AdminProduct, Product, ProductFormPayload } from "@/types/product";

type DbProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  description: string | null;
  availability_status: "available" | "unavailable";
  created_at: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapProduct(row: DbProductRow): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    category: row.category,
    image: row.image,
    description: row.description,
    availabilityStatus: row.availability_status,
    createdAt: row.created_at,
  };
}

function mapStorefrontProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    category: row.category,
    image: row.image,
    description: row.description,
    availabilityStatus: row.availability_status,
  };
}

function normalizePayload(payload: ProductFormPayload) {
  return {
    name: payload.name.trim(),
    slug: slugify(payload.name),
    price: payload.price,
    category: payload.category.trim(),
    image: payload.image.trim(),
    description: payload.description?.trim() || null,
    availability_status: payload.availabilityStatus,
  };
}

export type AdminProductCategory = {
  name: string;
  productCount: number;
};

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, category, image, description, availability_status, created_at",
    )
    .order("created_at", { ascending: false })
    .returns<DbProductRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapProduct);
}

export async function getStorefrontProducts(): Promise<Product[]> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, category, image, description, availability_status, created_at",
    )
    .eq("availability_status", "available")
    .order("created_at", { ascending: false })
    .returns<DbProductRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapStorefrontProduct);
}

export async function getAdminProductCategories(): Promise<AdminProductCategory[]> {
  const products = await getAdminProducts();
  const categoryCounts = new Map<string, number>();

  for (const product of products) {
    categoryCounts.set(
      product.category,
      (categoryCounts.get(product.category) ?? 0) + 1,
    );
  }

  return [...categoryCounts.entries()]
    .map(([name, productCount]) => ({
      name,
      productCount,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function createAdminProduct(payload: ProductFormPayload) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .insert(normalizePayload(payload))
    .select(
      "id, name, slug, price, category, image, description, availability_status, created_at",
    )
    .single()
    .returns<DbProductRow>();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create product");
  }

  return mapProduct(data);
}

export async function updateAdminProduct(
  productId: string,
  payload: ProductFormPayload,
) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .update(normalizePayload(payload))
    .eq("id", productId)
    .select(
      "id, name, slug, price, category, image, description, availability_status, created_at",
    )
    .single()
    .returns<DbProductRow>();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update product");
  }

  return mapProduct(data);
}

export async function deleteAdminProduct(productId: string) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }
}
