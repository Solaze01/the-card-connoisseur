"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductFormPayload } from "@/types/product";

type ProductFormProps = {
  initialValues: ProductFormPayload;
  isSaving: boolean;
  mode: "add" | "edit";
  feedback?: string | null;
  error?: string | null;
  onSubmit: (values: ProductFormPayload) => Promise<void> | void;
  onCancel?: () => void;
};

type FormErrors = Partial<Record<keyof ProductFormPayload, string>>;

function validateProductForm(values: ProductFormPayload) {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Product name is required.";
  }

  if (!values.category.trim()) {
    errors.category = "Category is required.";
  }

  if (!Number.isFinite(values.price) || values.price <= 0) {
    errors.price = "Price must be greater than 0.";
  }

  if (!values.image.trim()) {
    errors.image = "Image URL is required.";
  }

  return errors;
}

export function ProductForm({
  initialValues,
  isSaving,
  mode,
  feedback = null,
  error = null,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormPayload>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateProductForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      ...values,
      name: values.name.trim(),
      category: values.category.trim(),
      image: values.image.trim(),
      description: values.description?.trim() || "",
    });
  }

  function updateField<K extends keyof ProductFormPayload>(
    key: K,
    value: ProductFormPayload[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        imageUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.imageUrl) {
        throw new Error(payload.error ?? "Unable to upload image");
      }

      updateField("image", payload.imageUrl);
    } catch (imageError) {
      setUploadError(
        imageError instanceof Error
          ? imageError.message
          : "Unable to upload image",
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
      <label className="space-y-2 text-sm">
        <span className="font-medium text-foreground">Product Name</span>
        <input
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="w-full rounded-full border border-border bg-white px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
        />
        {errors.name ? <p className="text-sm text-rose-600">{errors.name}</p> : null}
      </label>

      <label className="space-y-2 text-sm">
        <span className="font-medium text-foreground">Category</span>
        <input
          value={values.category}
          onChange={(event) => updateField("category", event.target.value)}
          className="w-full rounded-full border border-border bg-white px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
        />
        {errors.category ? (
          <p className="text-sm text-rose-600">{errors.category}</p>
        ) : null}
      </label>

      <label className="space-y-2 text-sm">
        <span className="font-medium text-foreground">Price</span>
        <input
          type="number"
          min="0"
          step="1"
          value={values.price}
          onChange={(event) => updateField("price", Number(event.target.value))}
          className="w-full rounded-full border border-border bg-white px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
        />
        {errors.price ? <p className="text-sm text-rose-600">{errors.price}</p> : null}
      </label>

      <label className="space-y-2 text-sm">
        <span className="font-medium text-foreground">Availability</span>
        <select
          value={values.availabilityStatus}
          onChange={(event) =>
            updateField(
              "availabilityStatus",
              event.target.value as "available" | "unavailable",
            )
          }
          className="w-full rounded-full border border-border bg-white px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </label>

      <label className="space-y-2 text-sm md:col-span-2">
        <span className="font-medium text-foreground">Product Image</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageUpload}
          disabled={isUploadingImage}
          className="w-full rounded-full border border-border bg-white px-4 py-2 text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
        <p className="text-xs text-foreground/60">
          Upload from your device. JPG, PNG, WEBP, and GIF up to 5MB.
        </p>
        {isUploadingImage ? (
          <p className="text-sm text-foreground/70">Uploading image...</p>
        ) : null}
        {uploadError ? <p className="text-sm text-rose-600">{uploadError}</p> : null}
        {values.image ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-strong">
            <div className="relative aspect-[4/3]">
              <Image
                src={values.image}
                alt={values.name || "Product image preview"}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        ) : null}
      </label>

      <label className="space-y-2 text-sm md:col-span-2">
        <span className="font-medium text-foreground">Image URL</span>
        <input
          value={values.image}
          onChange={(event) => updateField("image", event.target.value)}
          className="w-full rounded-full border border-border bg-white px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
        />
        <p className="text-xs text-foreground/60">
          This will be filled automatically after upload, but you can still paste a URL.
        </p>
        {errors.image ? <p className="text-sm text-rose-600">{errors.image}</p> : null}
      </label>

      <label className="space-y-2 text-sm md:col-span-2">
        <span className="font-medium text-foreground">Description</span>
        <textarea
          value={values.description ?? ""}
          onChange={(event) => updateField("description", event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
        />
      </label>

      <div className="flex flex-wrap gap-2 md:col-span-2">
        <button
          type="submit"
          disabled={isSaving || isUploadingImage}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploadingImage
            ? "Uploading Image..."
            : isSaving
            ? mode === "edit"
              ? "Saving..."
              : "Adding..."
            : mode === "edit"
              ? "Save Changes"
              : "Add Product"}
        </button>

        {mode === "edit" && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border bg-surface-strong px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-white"
          >
            Cancel Edit
          </button>
        ) : null}
      </div>

      {feedback ? <p className="text-sm text-emerald-600 md:col-span-2">{feedback}</p> : null}
      {error ? <p className="text-sm text-rose-600 md:col-span-2">{error}</p> : null}
    </form>
  );
}
