"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { OrderStatus } from "@/types/order";

type OrderStatusFormProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

const statusOptions: Array<{ label: string; value: OrderStatus }> = [
  { label: "New", value: "new" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export function OrderStatusForm({
  orderId,
  currentStatus,
}: OrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleStatusChange(nextStatus: OrderStatus) {
    setStatus(nextStatus);
    setFeedback(null);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to update order status");
      }

      setFeedback("Status updated");
      startTransition(() => {
        router.refresh();
      });
    } catch (updateError) {
      setStatus(currentStatus);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update order status",
      );
    }
  }

  return (
    <div className="space-y-3 border border-border bg-surface-strong p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Update Status</p>
        <p className="text-sm text-foreground/60">
          Change the current order stage.
        </p>
      </div>

      <select
        value={status}
        onChange={(event) => {
          const nextStatus = event.target.value as OrderStatus;
          void handleStatusChange(nextStatus);
        }}
        disabled={isPending}
        className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:bg-surface"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {isPending ? (
        <p className="text-sm text-foreground/60">Saving status...</p>
      ) : null}
      {feedback ? <p className="text-sm text-emerald-600">{feedback}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
