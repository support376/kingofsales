import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import { DEMO_USER } from "@/lib/auth";

const SESSION_COOKIE = "closr_session";

export async function POST() {
  // DB에 데모 유저 upsert
  const supabase = await createServiceClient();

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("nickname", DEMO_USER.nickname)
    .single();

  let userId = existing?.id;

  if (!userId) {
    const { data: created, error } = await supabase
      .from("users")
      .insert({
        nickname: DEMO_USER.nickname,
        phone: DEMO_USER.phone,
        bio: DEMO_USER.bio,
        industry: DEMO_USER.industry,
        experience_years: DEMO_USER.experience_years,
        income_range: DEMO_USER.income_range,
        growth_needs: DEMO_USER.growth_needs,
        auth_level: DEMO_USER.auth_level,
        level: DEMO_USER.level,
        points: DEMO_USER.points,
        likes_received: DEMO_USER.likes_received,
      })
      .select("id")
      .single();

    if (error) {
      // 이미 존재하면 조회
      const { data: found } = await supabase
        .from("users")
        .select("id")
        .eq("nickname", DEMO_USER.nickname)
        .single();
      userId = found?.id;
    } else {
      userId = created?.id;
    }
  }

  // 세션 쿠키 설정
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId || "demo", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30일
    path: "/",
  });

  return NextResponse.json({ ...DEMO_USER, id: userId });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
