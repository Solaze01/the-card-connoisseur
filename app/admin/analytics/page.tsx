import Link from "next/link";

import { getOrdersAnalytics } from "@/lib/orders/get-orders-analytics";
import type { OrderStatus } from "@/types/order";
import { formatPrice } from "@/utils/format-price";

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

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDayLabel(day: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
  }).format(new Date(day));
}

export default async function AdminAnalyticsPage() {
  const analytics = await getOrdersAnalytics();

  return (
    <main className="space-y-4">
      <section className="rounded-[1.35rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/60">Admin</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Analytics
            </h1>
            <p className="text-sm text-foreground/70">
              Review weekly and monthly order performance.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/admin/orders"
              className="rounded-full border border-zinc-300 bg-surface-strong px-4 py-2 text-sm font-medium text-foreground/75 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] transition-colors hover:bg-white"
            >
              View Orders
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.25rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
          <p className="text-sm font-medium text-foreground/60">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {analytics.summary.totalOrders}
          </p>
        </article>
        <article className="rounded-[1.25rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
          <p className="text-sm font-medium text-foreground/60">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {formatPrice(analytics.summary.totalRevenue)}
          </p>
        </article>
        <article className="rounded-[1.25rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
          <p className="text-sm font-medium text-foreground/60">Orders This Week</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {analytics.summary.ordersThisWeek}
          </p>
        </article>
        <article className="rounded-[1.25rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
          <p className="text-sm font-medium text-foreground/60">Orders This Month</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {analytics.summary.ordersThisMonth}
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
          <div className="border-b border-border bg-[linear-gradient(180deg,#faf9fd_0%,#f3f4f6_100%)] px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/60">
              Best-Selling Products
            </h2>
          </div>

          {analytics.bestSellingProducts.length === 0 ? (
            <div className="p-5 text-sm text-foreground/65">
              No product sales available yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {analytics.bestSellingProducts.map((product) => (
                <article
                  key={product.productId}
                  className="grid gap-3 px-5 py-4 md:grid-cols-[1.6fr_0.8fr_1fr]"
                >
                  <div>
                    <p className="font-medium text-foreground">{product.productName}</p>
                    <p className="text-sm text-foreground/55">{product.productId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                      Quantity Sold
                    </p>
                    <p className="text-sm text-foreground/70">
                      {product.quantitySold}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                      Revenue
                    </p>
                    <p className="font-medium text-foreground">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
          <div className="border-b border-border bg-[linear-gradient(180deg,#faf9fd_0%,#f3f4f6_100%)] px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/60">
              Order Status Breakdown
            </h2>
          </div>

          <div className="space-y-3 px-5 py-4">
            {analytics.statusBreakdown.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-2xl border border-zinc-300 bg-surface-strong px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset]"
              >
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    item.status,
                  )}`}
                >
                  {getStatusLabel(item.status)}
                </span>
                <span className="font-medium text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
          <div className="border-b border-border bg-[linear-gradient(180deg,#faf9fd_0%,#f3f4f6_100%)] px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/60">
              Orders by Day
            </h2>
          </div>

          {analytics.dailyInsights.length === 0 ? (
            <div className="p-5 text-sm text-foreground/65">
              No daily order data available yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {analytics.dailyInsights.map((day) => (
                <article
                  key={day.date}
                  className="grid grid-cols-[1fr_0.8fr_1fr] gap-3 px-5 py-4"
                >
                  <p className="font-medium text-foreground">
                    {formatDayLabel(day.date)}
                  </p>
                  <p className="text-sm text-foreground/70">{day.orders} orders</p>
                  <p className="text-right font-medium text-foreground">
                    {formatPrice(day.revenue)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
          <div className="border-b border-border bg-[linear-gradient(180deg,#faf9fd_0%,#f3f4f6_100%)] px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/60">
              Monthly Summary
            </h2>
          </div>

          {analytics.monthlyInsights.length === 0 ? (
            <div className="p-5 text-sm text-foreground/65">
              No monthly summary available yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {analytics.monthlyInsights.map((month) => (
                <article
                  key={month.month}
                  className="grid grid-cols-[1fr_0.8fr_1fr] gap-3 px-5 py-4"
                >
                  <p className="font-medium text-foreground">
                    {formatMonthLabel(month.month)}
                  </p>
                  <p className="text-sm text-foreground/70">{month.orders} orders</p>
                  <p className="text-right font-medium text-foreground">
                    {formatPrice(month.revenue)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
