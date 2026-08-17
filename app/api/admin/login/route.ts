import { NextResponse } from "next/server";

import { adminSessionCookie, createAdminSession, credentialsAreValid, isAdminAuthenticationConfigured } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminAuthenticationConfigured()) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "configuration");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }
  try {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const next = formData.get("next");
    if (!(await credentialsAreValid(typeof username === "string" ? username : "", typeof password === "string" ? password : ""))) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "invalid");
      if (typeof next === "string" && next.startsWith("/admin")) loginUrl.searchParams.set("next", next);
      return NextResponse.redirect(loginUrl, { status: 303 });
    }
    const session = await createAdminSession();
    if (!session) return NextResponse.json({ error: "Unable to start an admin session." }, { status: 500 });
    const destination = typeof next === "string" && next.startsWith("/admin") ? next : "/admin";
    const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });
    response.cookies.set(adminSessionCookie(session));
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in." }, { status: 400 });
  }
}
