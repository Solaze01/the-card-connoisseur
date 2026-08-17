import Link from "next/link";

import { AdminNav } from "@/components/admin/admin-nav";

type AdminShellProps = {
  children: React.ReactNode;
};

export function getAdminLinkStyles(pathname: string, href: string) {
  const isActiveLink =
    href === "/admin"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return isActiveLink
    ? "border border-accent bg-accent text-white shadow-[0_10px_25px_rgba(139,92,246,0.18)] hover:bg-accent-strong hover:text-white"
    : "border border-transparent text-foreground/75 hover:border-border hover:bg-white hover:text-foreground";
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#fcfbff_0%,#f5f4fb_100%)] text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 overflow-hidden rounded-[1.35rem] border border-zinc-300 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_20px_45px_rgba(24,24,27,0.05)]">
          <div className="h-1 w-full bg-accent/85" />
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                Control Center
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                The Card Connoisseur
              </p>
              <p className="text-sm text-foreground/65">Admin area</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-full border border-zinc-300 bg-surface-strong px-4 py-2 text-sm font-medium text-foreground/80 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] transition-colors hover:bg-white"
              >
                View Storefront
              </Link>
              <form action="/api/admin/logout" method="post">
                <button className="rounded-full border border-zinc-300 bg-surface-strong px-4 py-2 text-sm font-medium text-foreground/80 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] transition-colors hover:bg-white">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-[1.35rem] border border-zinc-300 bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset]">
            <div className="mb-4 rounded-2xl border border-accent/12 bg-[linear-gradient(135deg,rgba(139,92,246,0.10),rgba(255,255,255,0.75))] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Navigation
              </p>
              <p className="mt-2 text-sm text-foreground/70">
                Manage products, orders, categories, and performance in one place.
              </p>
            </div>
            <AdminNav />
          </aside>

          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
