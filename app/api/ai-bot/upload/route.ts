import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // TODO: Supabase Storage 업로드 연동
  // MVP: 업로드 성공 시뮬레이션
  const formData = await req.formData();
  const file = formData.get("audio");

  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
  }

  return NextResponse.json({
    id: crypto.randomUUID(),
    audio_url: "https://storage.example.com/audio/sample.mp3",
    status: "uploaded",
  });
}
