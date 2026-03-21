import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const sort = url.searchParams.get("sort") || "latest";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = await createServiceClient();

  let query = supabase
    .from("posts")
    .select("*, users!inner(nickname, profile_image, auth_level, level)", {
      count: "exact",
    })
    .range(offset, offset + limit - 1);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (sort === "popular") {
    query = query.order("likes_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    posts: data || [],
    total: count || 0,
    page,
    hasMore: offset + limit < (count || 0),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, category, title, content, action_type } = body;

  if (!category || !title || !content) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // 행동 포인트 계산
  const ACTION_POINTS: Record<string, number> = {
    cheat: 15, call_review: 20, peer: 25,
    success: 20, failure: 25, challenge: 30, volunteer: 35,
  };
  const action_points = action_type ? (ACTION_POINTS[action_type] || 0) : 0;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user_id || "00000000-0000-0000-0000-000000000000",
      category,
      title,
      content,
      action_type: action_type || null,
      action_points,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
