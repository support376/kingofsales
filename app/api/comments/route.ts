import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { post_id, user_id, content, is_ai, parent_id } = body;

  if (!post_id || !content) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id,
      user_id: user_id || "00000000-0000-0000-0000-000000000000",
      content,
      is_ai: is_ai || false,
      parent_id: parent_id || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 댓글 수 업데이트
  try {
    await supabase
      .from("posts")
      .update({ comments_count: 1 }) // TODO: increment
      .eq("id", post_id);
  } catch {
    // MVP: 무시
  }

  return NextResponse.json(data, { status: 201 });
}
