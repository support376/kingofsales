import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getAiCoachLimit } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id");
  const authLevel = parseInt(url.searchParams.get("auth_level") || "1");

  const limit = getAiCoachLimit(authLevel);

  if (!userId) {
    return NextResponse.json({ used: 0, limit, remaining: limit });
  }

  const supabase = await createServiceClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("ai_analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", today.toISOString());

  const used = count || 0;

  return NextResponse.json({
    used,
    limit,
    remaining: Math.max(0, limit - used),
    resetsAt: new Date(new Date().setHours(24, 0, 0, 0)).toISOString(),
  });
}
