import { randomInt } from "node:crypto";

export function generateOrderId(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const serial = String(randomInt(0, 10000)).padStart(4, "0");

  return `TCC-${year}${month}${day}-${serial}`;
}
