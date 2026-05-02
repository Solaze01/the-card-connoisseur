import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusForm } from "@/components/admin/order-status-form";
import { getOrderById } from "@/lib/orders/get-order-by-id";
import type { OrderStatus } from "@/types/order";
import { formatPrice } from "@/utils/format-price";

type OrderDetailsPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

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

function displayOptionalValue(value: string | null) {
  return value?.trim() ? value : "Not available yet";
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-strong"
        >
          ← Back to orders
        </Link>
      </div>

      <section className="border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground/60">Order</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {order.orderId}
            </h1>
            <p className="text-sm text-foreground/70">
              Created {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="space-y-3 text-sm md:min-w-[220px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-foreground/60">Status</span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  order.status,
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-foreground/60">Items</span>
              <span className="font-medium text-foreground">{order.itemCount}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
              <span className="text-foreground/60">Total</span>
              <span className="font-semibold text-foreground">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-border bg-surface">
          <div className="border-b border-border bg-surface-strong px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/60">
              Order Items
            </h2>
          </div>

          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <article
                key={item.id}
                className="grid gap-3 px-5 py-4 md:grid-cols-[1.6fr_0.7fr_1fr_1fr] md:items-center"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                    Product
                  </p>
                  <p className="font-medium text-foreground">{item.productName}</p>
                  <p className="text-sm text-foreground/55">{item.productId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                    Qty
                  </p>
                  <p className="text-sm text-foreground/70">{item.quantity}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                    Unit Price
                  </p>
                  <p className="text-sm text-foreground/70">
                    {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/45 md:hidden">
                    Line Total
                  </p>
                  <p className="font-medium text-foreground">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="border border-border bg-surface">
          <div className="border-b border-border bg-surface-strong px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/60">
              Customer Details
            </h2>
          </div>

          <div className="space-y-4 px-5 py-4 text-sm">
            <OrderStatusForm
              orderId={order.orderId}
              currentStatus={order.status}
            />

            <div>
              <p className="font-medium text-foreground">Customer Name</p>
              <p className="mt-1 text-foreground/70">
                {displayOptionalValue(order.customerName)}
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Phone Number</p>
              <p className="mt-1 text-foreground/70">
                {displayOptionalValue(order.phoneNumber)}
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Delivery Address</p>
              <p className="mt-1 text-foreground/70">
                {displayOptionalValue(order.deliveryAddress)}
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Additional Note</p>
              <p className="mt-1 text-foreground/70">
                {displayOptionalValue(order.additionalNote)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
