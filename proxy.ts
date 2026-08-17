import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasAdminSession, isAdminAuthenticationConfigured } from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") return NextResponse.next();
  if (!isAdminAuthenticationConfigured()) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
    }
    if (pathname === "/admin/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (pathname === "/admin/login") {
    return (await hasAdminSession(request)) ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }
  if (await hasAdminSession(request)) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/api/orders/:path*/status"] };
