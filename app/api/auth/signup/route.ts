import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";

const SESSION_COOKIE = "salesking_session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nickname, phone, bio } = body;

  if (!nickname || !phone) {
    return NextResponse.json({ error: "닉네임과 휴대폰 번호는 필수입니다." }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // 닉네임 중복 체크
  const { data: existingNick } = await supabase
    .from("users")
    .select("id")
    .eq("nickname", nickname)
    .single();

  if (existingNick) {
    return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 409 });
  }

  // 진단 데이터 조회 (session_id 쿠키로)
  const sessionId = req.cookies.get("session_id")?.value;
  let diagnosisData = null;

  if (sessionId) {
    const { data } = await supabase
      .from("diagnosis_results")
      .select("*")
      .eq("session_id", sessionId)
      .eq("converted", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    diagnosisData = data;
  }

  // 유저 생성 (진단 데이터 자동 반영)
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      nickname,
      phone,
      bio: bio || null,
      industry: diagnosisData?.industry || "other",
      experience_years: diagnosisData?.experience_years || "under_1",
      income_range: diagnosisData?.income_range || "under_30m",
      growth_needs: diagnosisData?.growth_needs || [],
      auth_level: 1, // 자기신고 완료
      level: 1,
      points: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 진단 결과에 user_id 연동 + converted 플래그 업데이트
  if (diagnosisData) {
    await supabase
      .from("diagnosis_results")
      .update({ user_id: user.id, converted: true })
      .eq("id", diagnosisData.id);
  }

  // 세션 쿠키 설정
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return NextResponse.json(user, { status: 201 });
}
