"use client";

import Image from "next/image";

import { useCart } from "@/components/cart-provider";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/format-price";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, increaseQuantity, decreaseQuantity, removeItem, getItemQuantity } =
    useCart();
  const quantity = getItemQuantity(product.slug);

  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-strong">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div className="space-y-3 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          {product.category}
        </p>
        <div className="space-y-1">
          <h3 className="text-lg font-medium tracking-tight text-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-foreground/65">
            Premium printed card
          </p>
        </div>
        <p className="text-base font-semibold text-foreground">
          {formatPrice(product.price)}
        </p>

        {quantity === 0 ? (
          <button
            type="button"
            onClick={() => addItem(product)}
            className="w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface-strong p-1">
              <button
                type="button"
                onClick={() => decreaseQuantity(product.slug)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5"
              >
                -
              </button>
              <span className="min-w-8 text-center text-sm font-medium text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => increaseQuantity(product.slug)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => removeItem(product.slug)}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
