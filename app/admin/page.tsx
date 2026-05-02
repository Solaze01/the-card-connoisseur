import Link from "next/link";

import { getAdminProductCategories } from "@/lib/products/admin-products";

export default async function AdminDashboardPage() {
  let categories: string[] = [];

  try {
    const categoryRows = await getAdminProductCategories();
    categories = categoryRows.map((category) => category.name);
  } catch {
    categories = [];
  }

  const quickLinks = [
    {
      href: "/admin/orders",
      title: "Orders",
      description: "View and manage saved orders.",
    },
    {
      href: "/admin/analytics",
      title: "Analytics",
      description: "Review order performance and trends.",
    },
    {
      href: "/admin/products",
      title: "Products",
      description: "Maintain the product catalog later.",
    },
    {
      href: "/admin/categories",
      title: "Categories",
      description: "Review the product categories currently in use.",
    },
  ];

  return (
    <main className="space-y-4">
      <section className="overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        <div className="h-1 w-full bg-accent/85" />
        <div className="p-5">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/60">Admin</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-foreground/70">
              Manage orders and review business performance from one place.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-[1.25rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_30px_rgba(24,24,27,0.06)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              0{index + 1}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-foreground">{link.title}</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/70">{link.description}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-[1.35rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Product Groups
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">Categories</h2>
            <p className="mt-1 text-sm text-foreground/70">
              Product categories currently available in the admin catalog.
            </p>
          </div>
          <Link
            href="/admin/categories"
            className="rounded-full border border-zinc-300 bg-surface-strong px-4 py-2 text-sm font-medium text-foreground/80 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] transition-colors hover:bg-white"
          >
            View Categories
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-accent/15 bg-accent/5 px-3 py-1.5 text-sm font-medium text-foreground/85"
              >
                {category}
              </span>
            ))
          ) : (
            <p className="text-sm text-foreground/65">
              Categories will appear here once products are available.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
