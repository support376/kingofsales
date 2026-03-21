import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, post_id, comment_id } = body;

  if (!post_id && !comment_id) {
    return NextResponse.json(
      { error: "post_id 또는 comment_id 필요" },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();
  const uid = user_id || "00000000-0000-0000-0000-000000000000";

  // 이미 따봉 눌렀는지 확인
  const checkQuery = post_id
    ? supabase.from("likes").select("id").eq("user_id", uid).eq("post_id", post_id)
    : supabase.from("likes").select("id").eq("user_id", uid).eq("comment_id", comment_id);

  const { data: existing } = await checkQuery;

  if (existing && existing.length > 0) {
    // 취소
    await supabase.from("likes").delete().eq("id", existing[0].id);
    return NextResponse.json({ liked: false });
  }

  // 추가
  const { error } = await supabase.from("likes").insert({
    user_id: uid,
    post_id: post_id || null,
    comment_id: comment_id || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ liked: true });
}
