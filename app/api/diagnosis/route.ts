import { NextRequest, NextResponse } from "next/server";
import { calculateDiagnosis } from "@/lib/diagnosis";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { industry, experience_years, income_range, growth_needs } = body;

  if (!industry || !experience_years || !income_range) {
    return NextResponse.json(
      { error: "필수 항목이 누락되었습니다." },
      { status: 400 }
    );
  }

  const resultJson = calculateDiagnosis({
    industry,
    experience_years,
    income_range,
    growth_needs: growth_needs || [],
  });

  const sessionId =
    req.cookies.get("session_id")?.value || crypto.randomUUID();

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("diagnosis_results")
    .insert({
      session_id: sessionId,
      user_id: null,
      industry,
      experience_years,
      income_range,
      growth_needs: growth_needs || [],
      result_json: resultJson,
      converted: false,
    })
    .select("id, result_json")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const res = NextResponse.json(data);
  res.cookies.set("session_id", sessionId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
