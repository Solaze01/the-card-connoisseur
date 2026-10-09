import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: "Cron authentication is not configured" },
      { status: 500 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await createSupabaseAdminClient()
    .from("products")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Supabase keep-alive query failed:", error.message);
    return NextResponse.json(
      { error: "Supabase keep-alive query failed" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
