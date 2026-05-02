"use client";

import { useState } from "react";

import { ProductForm } from "@/components/admin/product-form";
import type { AdminProduct, ProductFormPayload } from "@/types/product";
import { formatPrice } from "@/utils/format-price";

type ProductManagementProps = {
  initialProducts: AdminProduct[];
  initialError?: string | null;
};

const emptyForm: ProductFormPayload = {
  name: "",
  price: 0,
  category: "",
  image: "",
  description: "",
  availabilityStatus: "available",
};

export function ProductManagement({
  initialProducts,
  initialError = null,
}: ProductManagementProps) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<ProductFormPayload>(emptyForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError);

  function resetForm() {
    setForm(emptyForm);
    setEditingProductId(null);
  }

  function startEdit(product: AdminProduct) {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description ?? "",
      availabilityStatus: product.availabilityStatus,
    });
    setEditingProductId(product.id);
    setFeedback(null);
    setError(null);
  }

  async function handleSubmit(formValues: ProductFormPayload) {
    setIsSaving(true);
    setFeedback(null);
    setError(null);

    try {
      const url = editingProductId
        ? `/api/admin/products/${encodeURIComponent(editingProductId)}`
        : "/api/admin/products";
      const method = editingProductId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const payload = (await response.json()) as AdminProduct & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save product");
      }

      if (editingProductId) {
        setProducts((current) =>
          current.map((product) =>
            product.id === editingProductId ? payload : product,
          ),
        );
        setFeedback("Product updated");
      } else {
        setProducts((current) => [payload, ...current]);
        setFeedback("Product added");
      }

      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save product",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(productId: string) {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    setFeedback(null);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/products/${encodeURIComponent(productId)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to delete product");
      }

      setProducts((current) =>
        current.filter((product) => product.id !== productId),
      );

      if (editingProductId === productId) {
        resetForm();
      }

      setFeedback("Product deleted");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete product",
      );
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.35rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground/60">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-sm text-foreground/70">
            Add, edit, and remove products from the database.
          </p>
        </div>

        <ProductForm
          key={editingProductId ?? "new-product"}
          initialValues={form}
          isSaving={isSaving}
          mode={editingProductId ? "edit" : "add"}
          feedback={feedback}
          error={error}
          onSubmit={handleSubmit}
          onCancel={editingProductId ? resetForm : undefined}
        />
      </section>

      <section className="overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
        {initialError ? (
          <div className="border-b border-border bg-rose-50 px-5 py-3 text-sm text-rose-700">
            {initialError}
          </div>
        ) : null}
        {products.length === 0 ? (
          <div className="p-6 text-sm text-foreground/65">
            No products found in the database yet.
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.5fr_1fr_1fr_0.8fr_1fr] gap-4 border-b border-border bg-[linear-gradient(180deg,#faf9fd_0%,#f3f4f6_100%)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55 md:grid">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-border">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-black/[0.015] md:grid-cols-[1.5fr_1fr_1fr_0.8fr_1fr] md:items-center"
                >
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-foreground/55">{product.slug}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">{product.category}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        product.availabilityStatus === "available"
                        ? "bg-emerald-100 text-emerald-700"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {product.availabilityStatus === "available"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="rounded-full border border-zinc-300 bg-surface-strong px-3 py-1.5 text-sm font-medium text-foreground/75 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] transition-colors hover:bg-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(product.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] transition-colors hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
