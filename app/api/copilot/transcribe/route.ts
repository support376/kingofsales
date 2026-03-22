import { NextRequest, NextResponse } from "next/server";
import { requestTranscription, waitForTranscription, formatTranscript } from "@/lib/rtzr";

/**
 * POST /api/copilot/transcribe
 * 음성 파일을 받아 Return Zero STT로 변환 후 결과 반환
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return NextResponse.json({ error: "음성 파일이 필요합니다." }, { status: 400 });
    }

    // 파일 크기 제한 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 50MB 이하여야 합니다." }, { status: 400 });
    }

    // RTZR API 키 확인
    if (!process.env.RTZR_CLIENT_ID || !process.env.RTZR_CLIENT_SECRET) {
      // 개발 모드: 더미 데이터 반환
      return NextResponse.json({
        status: "completed",
        transcript: {
          fullText: "[나] 안녕하세요, 이번에 새로운 상품을 안내드리려고 연락드렸습니다.\n[고객] 네, 말씀해보세요.\n[나] 이 상품은 월 5만원으로 최대 3억원까지 보장받으실 수 있는데요.\n[고객] 음, 지금 다른 보험도 있어서 가격이 좀 부담되는데요.\n[나] 그런 부분은 충분히 이해합니다. 기존 보험과 비교해드리면 보장 범위가...",
          totalDuration: 512,
          talkRatio: { user: 65, customer: 35 },
          lines: [
            { speaker: "나", speakerId: 0, start: 0, end: 8.5, text: "안녕하세요, 이번에 새로운 상품을 안내드리려고 연락드렸습니다." },
            { speaker: "고객", speakerId: 1, start: 9.0, end: 11.2, text: "네, 말씀해보세요." },
            { speaker: "나", speakerId: 0, start: 12.0, end: 22.5, text: "이 상품은 월 5만원으로 최대 3억원까지 보장받으실 수 있는데요." },
            { speaker: "고객", speakerId: 1, start: 23.0, end: 30.0, text: "음, 지금 다른 보험도 있어서 가격이 좀 부담되는데요." },
            { speaker: "나", speakerId: 0, start: 31.0, end: 42.0, text: "그런 부분은 충분히 이해합니다. 기존 보험과 비교해드리면 보장 범위가..." },
          ],
        },
      });
    }

    // 실제 RTZR API 호출
    const buffer = Buffer.from(await file.arrayBuffer());
    const transcribeId = await requestTranscription(buffer, file.name);

    // 결과 폴링 (최대 5분)
    const result = await waitForTranscription(transcribeId);
    const formatted = formatTranscript(result);

    return NextResponse.json({
      status: "completed",
      transcribeId,
      transcript: formatted,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
