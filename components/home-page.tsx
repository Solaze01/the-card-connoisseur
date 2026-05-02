"use client";

import Link from "next/link";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import { siteConfig } from "@/lib/site";
import type { Product } from "@/types/product";
import type { CreatedOrder } from "@/types/order";
import { formatPrice } from "@/utils/format-price";
import { createWhatsAppCheckoutUrl } from "@/utils/whatsapp-order";

type HomePageProps = {
  products: Product[];
};

export function HomePage({ products }: HomePageProps) {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const { cartItems, itemCount, subtotal, increaseQuantity, decreaseQuantity, removeItem } =
    useCart();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const visibleProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  async function handleWhatsAppCheckout() {
    if (cartItems.length === 0 || isCreatingOrder) {
      return;
    }

    setIsCreatingOrder(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json()) as { error?: string };
        throw new Error(errorPayload.error ?? "Unable to create order");
      }

      const order = (await response.json()) as CreatedOrder;
      const whatsappUrl = createWhatsAppCheckoutUrl({
        cartItems,
        subtotal,
        orderId: order.orderId,
        whatsappNumber: siteConfig.whatsappNumber,
      });

      window.location.href = whatsappUrl;
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to create order",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  }

  const isCheckoutDisabled = cartItems.length === 0 || isCreatingOrder;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between rounded-[1.25rem] border border-zinc-300 bg-surface px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
            TC
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              The Card Connoisseur
            </p>
            <p className="text-sm text-foreground/65">
              Order premium cards
            </p>
          </div>
        </div>

        <Link
          href="#cart-summary"
          className="flex items-center gap-3 rounded-full border border-border bg-surface-strong px-3 py-2 transition-colors hover:bg-white"
        >
          <span className="text-sm text-foreground/75">Cart</span>
          <span className="flex min-w-7 items-center justify-center rounded-full bg-accent px-2 py-1 text-sm font-semibold text-white">
            {itemCount}
          </span>
        </Link>
      </header>

      <section className="mt-4 overflow-hidden rounded-[1.25rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
        <div className="h-1 w-full bg-accent/80" />
        <div className="px-4 py-5 sm:px-5 sm:py-6">
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Curated Selection
              </div>
              <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                <span className="block">Order</span>
                <span className="block text-accent">premium cards</span>
                <span className="block text-foreground/88">
                  for corporate, personal, and bundle requests.
                </span>
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-foreground/70 sm:text-base">
                Browse the catalogue, add items to your cart, and continue your
                order on WhatsApp when you are ready.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border/80 pt-4">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-accent text-white"
                      : "border border-border bg-surface-strong text-foreground/80 hover:bg-white hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground/62">Products</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {selectedCategory === "All"
                  ? "Available cards"
                  : `${selectedCategory} cards`}
              </h2>
            </div>
            <p className="hidden text-sm text-foreground/60 sm:block">
              {visibleProducts.length} product
              {visibleProducts.length === 1 ? "" : "s"} shown.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {visibleProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          {visibleProducts.length === 0 ? (
            <div className="border border-dashed border-border bg-surface p-5 text-sm text-foreground/65">
              No products found in this category yet.
            </div>
          ) : null}
        </div>

        <aside id="cart-summary" className="space-y-4 scroll-mt-24">
          <div className="rounded-[1.25rem] border border-zinc-300 bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset] xl:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/65">Cart</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">
                  {itemCount} items selected
                </h3>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-foreground/68">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppCheckout}
              disabled={isCheckoutDisabled}
              className={`mt-4 flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
                !isCheckoutDisabled
                  ? "bg-accent !text-white hover:bg-accent-strong"
                  : "cursor-not-allowed bg-surface-strong text-foreground/45"
              }`}
            >
              {isCreatingOrder
                ? "Creating Order..."
                : cartItems.length > 0
                  ? "Continue on WhatsApp"
                  : "Cart is Empty"}
            </button>
            {checkoutError ? (
              <p className="mt-3 text-sm text-red-600">{checkoutError}</p>
            ) : null}
          </div>

          <div className="sticky top-4 hidden rounded-[1.25rem] border border-zinc-300 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset] xl:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/65">Cart</p>
                <h3 className="mt-1 text-xl font-semibold text-foreground">
                  {itemCount} items selected
                </h3>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="mt-5 rounded-[1.05rem] border border-dashed border-border bg-surface-strong p-4 text-sm leading-6 text-foreground/68">
                Your cart is empty. Add a few premium cards to see your order
                summary here.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.slug}
                    className="rounded-[1.05rem] border border-zinc-300 bg-surface-strong p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="mt-1 text-sm text-foreground/60">
                          {item.category}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-border bg-surface p-1">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.slug)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5"
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.slug)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-black/5"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 space-y-3 rounded-[1.05rem] border border-zinc-300 bg-surface-strong p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
              <div className="flex items-center justify-between text-sm text-foreground/68">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-foreground/68">
                <span>Delivery</span>
                <span>Calculated later</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-base font-semibold text-foreground">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppCheckout}
              disabled={isCheckoutDisabled}
              className={`mt-5 flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
                !isCheckoutDisabled
                  ? "bg-accent !text-white hover:bg-accent-strong"
                  : "cursor-not-allowed bg-surface-strong text-foreground/45"
              }`}
            >
              {isCreatingOrder
                ? "Creating Order..."
                : cartItems.length > 0
                  ? "Continue on WhatsApp"
                  : "Cart is Empty"}
            </button>
            {checkoutError ? (
              <p className="mt-3 text-sm text-red-600">{checkoutError}</p>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
