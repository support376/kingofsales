/**
 * Return Zero (RTZR) STT API 클라이언트
 * https://developers.rtzr.ai/docs
 *
 * 흐름: 토큰 발급 → 파일 업로드(transcribe) → 상태 폴링 → 결과 조회
 */

const RTZR_AUTH_URL = "https://openapi.vito.ai/v1/authenticate";
const RTZR_TRANSCRIBE_URL = "https://openapi.vito.ai/v1/transcribe";

let cachedToken: { token: string; expiresAt: number } | null = null;

/** JWT 토큰 발급 (client_id + client_secret) */
export async function getRtzrToken(): Promise<string> {
  // 캐시된 토큰이 유효하면 재사용
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.RTZR_CLIENT_ID;
  const clientSecret = process.env.RTZR_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("RTZR_CLIENT_ID / RTZR_CLIENT_SECRET 환경변수가 설정되지 않았습니다.");
  }

  const res = await fetch(RTZR_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret }),
  });

  if (!res.ok) {
    throw new Error(`RTZR 인증 실패: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expire_at ? data.expire_at * 1000 : 3600_000),
  };

  return cachedToken.token;
}

/** 음성 파일 → STT 변환 요청 (비동기) */
export async function requestTranscription(audioBuffer: Buffer, fileName: string): Promise<string> {
  const token = await getRtzrToken();

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(audioBuffer)]), fileName);
  formData.append("config", JSON.stringify({
    use_diarization: true,       // 화자 분리
    diarization: { spk_count: 2 }, // 2명 (세일즈맨 + 고객)
    use_itn: true,                // 숫자/단위 정규화
    use_disfluency_filter: false, // 어... 음... 유지 (분석용)
    use_paragraph_splitter: true, // 문단 분리
    paragraph_splitter: { max: 50 },
  }));

  const res = await fetch(RTZR_TRANSCRIBE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`RTZR 변환 요청 실패: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  return data.id; // transcribe_id
}

/** 변환 상태 확인 + 결과 조회 */
export async function getTranscriptionResult(transcribeId: string): Promise<RtzrResult> {
  const token = await getRtzrToken();

  const res = await fetch(`${RTZR_TRANSCRIBE_URL}/${transcribeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`RTZR 결과 조회 실패: ${res.status}`);
  }

  return res.json();
}

/** 변환 완료까지 폴링 (최대 5분) */
export async function waitForTranscription(transcribeId: string, maxWaitMs = 300_000): Promise<RtzrResult> {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const result = await getTranscriptionResult(transcribeId);

    if (result.status === "completed") {
      return result;
    }

    if (result.status === "failed") {
      throw new Error(`RTZR 변환 실패: ${JSON.stringify(result)}`);
    }

    // 3초 대기 후 재시도
    await new Promise((r) => setTimeout(r, 3000));
  }

  throw new Error("RTZR 변환 시간 초과 (5분)");
}

/** RTZR 결과를 가독성 있는 텍스트로 변환 */
export function formatTranscript(result: RtzrResult): FormattedTranscript {
  const utterances = result.results?.utterances || [];

  const lines = utterances.map((u) => ({
    speaker: u.spk === 0 ? "나" : "고객",
    speakerId: u.spk,
    start: u.start_at / 1000, // ms → sec
    end: (u.start_at + u.duration) / 1000,
    text: u.msg,
  }));

  const totalDuration = utterances.length > 0
    ? Math.max(...utterances.map((u) => u.start_at + u.duration)) / 1000
    : 0;

  // 화자별 발화 시간 계산
  const speakerTime: Record<number, number> = {};
  for (const u of utterances) {
    speakerTime[u.spk] = (speakerTime[u.spk] || 0) + u.duration;
  }

  const totalTime = Object.values(speakerTime).reduce((a, b) => a + b, 0) || 1;
  const talkRatio = {
    user: Math.round(((speakerTime[0] || 0) / totalTime) * 100),
    customer: Math.round(((speakerTime[1] || 0) / totalTime) * 100),
  };

  const fullText = lines.map((l) => `[${l.speaker}] ${l.text}`).join("\n");

  return { lines, fullText, totalDuration, talkRatio };
}

// ===== Types =====

export interface RtzrResult {
  id: string;
  status: "transcribing" | "completed" | "failed";
  results?: {
    utterances: RtzrUtterance[];
  };
}

export interface RtzrUtterance {
  spk: number;       // 화자 ID (0, 1, ...)
  start_at: number;  // 시작 시간 (ms)
  duration: number;  // 길이 (ms)
  msg: string;       // 텍스트
}

export interface FormattedTranscript {
  lines: { speaker: string; speakerId: number; start: number; end: number; text: string }[];
  fullText: string;
  totalDuration: number;
  talkRatio: { user: number; customer: number };
}
