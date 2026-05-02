import Link from "next/link";

import { getAdminProductCategories } from "@/lib/products/admin-products";

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof getAdminProductCategories>> = [];
  let error: string | null = null;

  try {
    categories = await getAdminProductCategories();
  } catch (loadError) {
    error =
      loadError instanceof Error ? loadError.message : "Unable to load categories";
  }

  return (
    <main className="space-y-4">
      <section className="rounded-[1.35rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/60">Admin</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Categories
            </h1>
            <p className="text-sm text-foreground/70">
              Review the categories currently used by products in the catalog.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-full border border-zinc-300 bg-surface-strong px-4 py-2 text-sm font-medium text-foreground/80 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] transition-colors hover:bg-white"
          >
            Manage Products
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        {error ? (
          <div className="border-b border-border bg-rose-50 px-5 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {categories.length === 0 ? (
          <div className="p-6 text-sm text-foreground/65">
            No categories found yet. Add products first and categories will appear here.
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1fr_160px] gap-4 border-b border-border bg-[linear-gradient(180deg,#faf9fd_0%,#f3f4f6_100%)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55 md:grid">
              <span>Category</span>
              <span>Products</span>
            </div>

            <div className="divide-y divide-border">
              {categories.map((category) => (
                <article
                  key={category.name}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-black/[0.015] md:grid-cols-[1fr_160px] md:items-center"
                >
                  <div>
                    <p className="font-medium text-foreground">{category.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">
                      {category.productCount} product
                      {category.productCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
