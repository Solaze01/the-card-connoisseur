import type { CartItem } from "@/types/cart";

import { siteConfig } from "@/lib/site";
import { formatPrice } from "@/utils/format-price";

type WhatsAppOrderDetails = {
  cartItems: CartItem[];
  subtotal: number;
  orderId?: string;
  whatsappNumber?: string;
};

const defaultOrderId = "TCC-TEMP-001";

export function formatWhatsAppOrderMessage({
  cartItems,
  subtotal,
  orderId = defaultOrderId,
}: WhatsAppOrderDetails) {
  const itemLines = cartItems.map(
    (item, index) =>
      `${index + 1}. ${item.name} x${item.quantity} — ${formatPrice(item.price)} each`,
  );

  return [
    "Hello, I would like to place an order.",
    "",
    `Order ID: ${orderId}`,
    "",
    "Items:",
    ...itemLines,
    "",
    `Total: ${formatPrice(subtotal)}`,
    "",
    "Name:",
    "Delivery Address:",
    "Phone Number:",
    "Additional Note:",
  ].join("\n");
}

export function createWhatsAppCheckoutUrl(details: WhatsAppOrderDetails) {
  const message = formatWhatsAppOrderMessage(details);
  const whatsappNumber = details.whatsappNumber ?? siteConfig.whatsappNumber;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
