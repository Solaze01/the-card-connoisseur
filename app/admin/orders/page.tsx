import Link from "next/link";

import { getOrders } from "@/lib/orders/get-orders";
import type { OrderStatus } from "@/types/order";
import { formatPrice } from "@/utils/format-price";

type AdminOrdersPageProps = {
  searchParams?: Promise<{
    status?: string;
    q?: string;
  }>;
};

const statusTabs: Array<{ label: string; value: OrderStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

function getStatusLabel(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "new":
      return "bg-violet-100 text-violet-700";
    case "confirmed":
      return "bg-sky-100 text-sky-700";
    case "processing":
      return "bg-amber-100 text-amber-700";
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = (await searchParams) ?? {};
  const currentStatus = statusTabs.some((tab) => tab.value === params.status)
    ? (params.status as OrderStatus | "all")
    : "all";
  const currentSearch = params.q?.trim() ?? "";
  const orders = await getOrders({
    status: currentStatus,
    search: currentSearch,
  });

  return (
    <main className="space-y-4">
      <section className="rounded-[1.35rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        <div className="flex flex-col gap-5">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/60">Admin</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Orders
            </h1>
            <p className="text-sm text-foreground/70">
              View saved orders and track their current status.
            </p>
          </div>

          <form className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tab) => {
                const isActive = tab.value === currentStatus;
                const href =
                  tab.value === "all"
                    ? currentSearch
                      ? `/admin/orders?q=${encodeURIComponent(currentSearch)}`
                      : "/admin/orders"
                    : `/admin/orders?status=${tab.value}${
                        currentSearch
                          ? `&q=${encodeURIComponent(currentSearch)}`
                          : ""
                      }`;

                return (
                  <Link
                    key={tab.value}
                    href={href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "border border-accent bg-accent text-white shadow-[0_8px_20px_rgba(139,92,246,0.18)]"
                        : "border border-zinc-300 bg-surface-strong text-foreground/75 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] hover:bg-white"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex gap-2">
              {currentStatus !== "all" ? (
                <input type="hidden" name="status" value={currentStatus} />
              ) : null}
              <input
                type="search"
                name="q"
                defaultValue={currentSearch}
                placeholder="Search order ID"
                className="min-w-[220px] rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-foreground outline-none shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] transition-colors placeholder:text-foreground/40 focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_rgba(139,92,246,0.18)] transition-colors hover:bg-accent-strong"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        {orders.length === 0 ? (
          <div className="p-6 text-sm text-foreground/65">
            No orders found for the current filter.
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.5fr_1.2fr_1fr_1fr_0.8fr] gap-4 border-b border-border bg-[linear-gradient(180deg,#faf9fd_0%,#f3f4f6_100%)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55 md:grid">
              <span>Order ID</span>
              <span>Created</span>
              <span>Total</span>
              <span>Status</span>
              <span>Items</span>
            </div>

            <div className="divide-y divide-border">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-black/[0.015] md:grid-cols-[1.5fr_1.2fr_1fr_1fr_0.8fr] md:items-center"
                >
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                      Order ID
                    </p>
                    <Link
                      href={`/admin/orders/${encodeURIComponent(order.orderId)}`}
                      className="font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {order.orderId}
                    </Link>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                      Created
                    </p>
                    <p className="text-sm text-foreground/70">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                      Total
                    </p>
                    <p className="font-medium text-foreground">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                      Status
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        order.status,
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                      Items
                    </p>
                    <p className="text-sm text-foreground/70">{order.itemCount}</p>
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
