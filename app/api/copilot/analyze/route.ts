import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { canUseAiCoach } from "@/lib/permissions";

/**
 * POST /api/copilot/analyze
 * 트랜스크립트 + 메모를 받아 Claude API로 세일즈 코칭 분석
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, transcript, memo, auth_level } = body;

  if (!user_id) {
    return NextResponse.json({ error: "user_id 필요" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // 쿼터 체크
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("ai_analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user_id)
    .gte("created_at", today.toISOString());

  const todayCount = count || 0;
  const level = auth_level ?? 1;

  if (!canUseAiCoach(level, todayCount)) {
    return NextResponse.json(
      { error: "오늘의 무료 분석 횟수를 초과했습니다." },
      { status: 429 }
    );
  }

  // Claude API로 분석 (TODO: 실제 연동)
  // 프롬프트: 트랜스크립트 + 메모를 기반으로 세일즈 코칭 분석
  const ANALYSIS_PROMPT = `
당신은 세일즈 코칭 전문가입니다. 아래 통화 녹취록과 메모를 분석하여 피드백을 제공하세요.

[분석 영역]
1. 클로징 기회 감지: 고객이 긍정 시그널을 보냈는데 놓친 순간
2. 반론 대응 분석: 반론에 어떻게 응대했고, 더 나은 대안
3. 대화 흐름: 질문/설명 비율, 고객 발화 기회
4. 톤 변화: 고객 톤이 바뀐 지점
5. 핵심 구간: 가장 중요한 3개 구간 추출
6. 종합 점수 (0~100)와 개선 포인트

[녹취록]
${transcript || "(녹취록 없음)"}

[메모]
${memo || "(메모 없음)"}

JSON 형식으로 응답하세요.
  `.trim();

  // TODO: Phase 2에서 실제 Claude API 호출
  // const response = await anthropic.messages.create({ ... });

  // 더미 분석 결과
  const analysis = {
    user_id,
    transcript: transcript || "",
    memo: memo || "",
    score_total: Math.floor(Math.random() * 30) + 60,
    score_speech: Math.floor(Math.random() * 30) + 55,
    score_tone: Math.floor(Math.random() * 30) + 60,
    score_closing: Math.floor(Math.random() * 30) + 50,
    score_objection: Math.floor(Math.random() * 30) + 60,
    feedback_json: {
      speech: { score: 68, feedback: "질문과 설명의 비율이 30:70으로 설명에 치우쳐 있습니다.", suggestion: "SPIN 기법을 활용해 질문 비율을 높여보세요." },
      tone: { score: 75, feedback: "전반적으로 안정적이지만 중간에 말 속도가 빨라집니다.", suggestion: "여유 있는 페이스를 유지하세요." },
      closing: { score: 60, feedback: "구매 신호 3회 감지, 클로징 시도 0회.", suggestion: "자연스러운 클로징 문구를 준비하세요." },
      objection: { score: 78, feedback: "가격 반론에 기능 설명으로 대응했습니다.", suggestion: "ROI 기반 응답이 더 효과적입니다." },
      overall: { score: 72, feedback: "평균 이상. 클로징 신호 포착이 개선점.", suggestion: "클로징 타이밍 연습에 집중하세요." },
    },
    analysis_prompt: ANALYSIS_PROMPT,
    is_shared: false,
  };

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
