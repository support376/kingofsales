import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const industry = url.searchParams.get("industry");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = await createServiceClient();

  let query = supabase
    .from("leaderboard_data")
    .select("*", { count: "exact" })
    .eq("visible", true)
    .order("is_verified", { ascending: false })
    .order("rank_score", { ascending: false })
    .range(offset, offset + limit - 1);

  if (industry && industry !== "all") {
    query = query.eq("industry", industry);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
  });
}
