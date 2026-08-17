"use client";

import { usePathname } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
