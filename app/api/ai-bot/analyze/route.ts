import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, audio_url } = body;

  if (!audio_url) {
    return NextResponse.json({ error: "audio_url 필요" }, { status: 400 });
  }

  // TODO: Phase 2에서 실제 Whisper STT + Claude API 연동
  // MVP: 더미 분석 결과 생성
  const analysis = {
    user_id: user_id || "00000000-0000-0000-0000-000000000000",
    audio_url,
    audio_duration: 512,
    transcript: "(STT 연동 후 텍스트가 여기에 표시됩니다)",
    score_total: Math.floor(Math.random() * 30) + 60,
    score_speech: Math.floor(Math.random() * 30) + 55,
    score_tone: Math.floor(Math.random() * 30) + 60,
    score_closing: Math.floor(Math.random() * 30) + 50,
    score_objection: Math.floor(Math.random() * 30) + 60,
    feedback_json: {
      speech: {
        score: 68,
        feedback: "질문과 설명의 비율이 30:70으로 설명에 치우쳐 있습니다.",
        suggestion: "SPIN 기법을 활용해 질문 비율을 높여보세요.",
      },
      tone: {
        score: 75,
        feedback: "전반적으로 안정적이지만 중간에 말 속도가 빨라집니다.",
        suggestion: "여유 있는 페이스를 유지하세요.",
      },
      closing: {
        score: 60,
        feedback: "구매 신호 3회 감지, 클로징 시도 0회.",
        suggestion: "자연스러운 클로징 문구를 준비해두세요.",
      },
      objection: {
        score: 78,
        feedback: "가격 반론에 기능 설명으로 대응했습니다.",
        suggestion: "ROI 기반 응답이 더 효과적입니다.",
      },
      overall: {
        score: 72,
        feedback: "평균 이상. 클로징 신호 포착이 개선점.",
        suggestion: "클로징 타이밍 연습에 집중하세요.",
      },
    },
    is_shared: false,
  };

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("ai_analyses")
    .insert(analysis)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
