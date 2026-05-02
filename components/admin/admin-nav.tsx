"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getAdminLinkStyles } from "@/components/admin/admin-shell";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block rounded-full px-4 py-2.5 text-sm font-medium transition-all ${getAdminLinkStyles(
            pathname,
            link.href,
          )}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
