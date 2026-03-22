"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Upload, Mic, Headphones, FileAudio, FileText, Calendar, MessageSquare, GraduationCap,
  Volume2, Target, Shield, Send, LogIn, Lock, ChevronRight, Loader2, Type,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type TabType = "analyze" | "records";
type UploadMode = "select" | "audio" | "text";
type AnalysisState = "idle" | "uploading" | "transcribing" | "analyzing" | "done";
type SourceType = "audio" | "text";

interface CallRecord {
  id: string;
  date: string;
  title: string;
  source: SourceType;
  duration: string;
  score: number | null;
  memo: string;
  hasAnalysis: boolean;
}

const DUMMY_RECORDS: CallRecord[] = [
  { id: "1", date: "2026.03.22", title: "신규 고객 상담 콜", source: "audio", duration: "8분 32초", score: 72, memo: "가격 반론에서 막힘. 다음엔 ROI 데이터 준비할 것.", hasAnalysis: true },
  { id: "2", date: "2026.03.21", title: "카카오톡 고객 상담", source: "text", duration: "대화 42건", score: 68, memo: "텍스트라 톤 분석은 제외. 클로징 멘트가 약함.", hasAnalysis: true },
  { id: "3", date: "2026.03.20", title: "기존 고객 리뉴얼 콜", source: "audio", duration: "12분 15초", score: 65, memo: "", hasAnalysis: true },
  { id: "4", date: "2026.03.18", title: "콜드콜 연습", source: "audio", duration: "5분 48초", score: null, memo: "연습용 녹음. 첫 10초 오프닝 개선 필요.", hasAnalysis: false },
];

const DUMMY_ANALYSIS_AUDIO = {
  transcript_summary: "고객에게 보험 상품 설명 후 가격 반론 발생. 기능 설명으로 대응했으나 클로징 실패.",
  talk_ratio: { user: 68, customer: 32 },
  key_moments: [
    { time: "2:15", type: "클로징 시도", description: "고객이 긍정 시그널을 보였으나 놓침" },
    { time: "4:30", type: "반론 발생", description: "가격 반론 - 기능 설명으로 대응" },
    { time: "7:10", type: "톤 변화", description: "고객 톤이 방어적으로 변화" },
  ],
  scores: {
    speech: { score: 68, feedback: "질문과 설명의 비율이 30:70으로 설명에 치우쳐 있습니다.", suggestion: "SPIN 기법을 활용해 질문 비율을 높여보세요." },
    tone: { score: 75, feedback: "전반적으로 안정적이지만 2분 30초 부근에서 말 속도가 빨라집니다.", suggestion: "긴장되는 순간에도 일정한 페이스를 유지하세요." },
    closing: { score: 60, feedback: "구매 신호 3회 감지, 클로징 시도 0회.", suggestion: '"다음 단계로 넘어갈까요?" 같은 자연스러운 클로징 문구를 준비하세요.' },
    objection: { score: 78, feedback: "가격 반론에 기능 설명으로 대응했습니다.", suggestion: "ROI 기반 응답이 더 효과적입니다." },
  },
  overall: { score: 72, feedback: "평균 이상이지만 클로징 타이밍 개선이 필요합니다." },
};

const DUMMY_ANALYSIS_TEXT = {
  transcript_summary: "카카오톡 상담에서 상품 소개 후 고객이 가격 문의. 비교 자료 제공했으나 결정 보류.",
  talk_ratio: { user: 55, customer: 45 },
  key_moments: [
    { time: "메시지 #8", type: "관심 표현", description: "고객이 구체적 조건을 질문 - 긍정 시그널" },
    { time: "메시지 #15", type: "반론 발생", description: "타사 가격 언급 - 비교 자료 요청" },
    { time: "메시지 #22", type: "보류 선언", description: "고객이 '생각해볼게요' - 클로징 실패" },
  ],
  scores: {
    speech: { score: 72, feedback: "메시지 길이가 적절하고 질문-답변 비율이 좋습니다.", suggestion: "핵심 메시지를 더 간결하게 전달해보세요." },
    tone: { score: 0, feedback: "텍스트 대화에서는 톤 분석이 제외됩니다.", suggestion: "이모티콘, 존칭 등으로 톤 관리를 해보세요." },
    closing: { score: 55, feedback: "'생각해볼게요'에 대한 후속 대응이 없었습니다.", suggestion: "구체적 다음 약속을 잡는 클로징 멘트를 준비하세요." },
    objection: { score: 70, feedback: "타사 비교에 자료로 대응한 것은 좋았습니다.", suggestion: "차별화 포인트를 3가지로 요약해 전달하세요." },
  },
  overall: { score: 68, feedback: "텍스트 상담의 기본기는 갖추었으나, 클로징 전략이 필요합니다." },
};

const SCORE_ITEMS_AUDIO = [
  { key: "speech", label: "대화 균형", icon: MessageSquare },
  { key: "tone", label: "톤 변화", icon: Volume2 },
  { key: "closing", label: "클로징 기회", icon: Target },
  { key: "objection", label: "반론 대응", icon: Shield },
] as const;

const SCORE_ITEMS_TEXT = [
  { key: "speech", label: "대화 균형", icon: MessageSquare },
  { key: "closing", label: "클로징 기회", icon: Target },
  { key: "objection", label: "반론 대응", icon: Shield },
] as const;

export default function CopilotPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabType>("analyze");
  const [uploadMode, setUploadMode] = useState<UploadMode>("select");
  const [state, setState] = useState<AnalysisState>("idle");
  const [currentSource, setCurrentSource] = useState<SourceType>("audio");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [textContent, setTextContent] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [memoAnalyzing, setMemoAnalyzing] = useState(false);
  const [quota, setQuota] = useState({ used: 0, limit: 1, remaining: 1 });
  const fileRef = useRef<HTMLInputElement>(null);
  const authLevel = user?.auth_level ?? 0;

  useEffect(() => {
    if (!user) return;
    fetch(`/api/copilot/quota?user_id=${user.id}&auth_level=${authLevel}`)
      .then((r) => r.json()).then(setQuota).catch(() => {});
  }, [user, authLevel]);

  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 px-5">
        <LogIn className="h-10 w-10 text-gray-300" />
        <p className="text-[15px] font-bold text-gray-900">로그인이 필요합니다</p>
        <p className="text-[13px] text-gray-500 text-center">코파일럿은 회원만 이용 가능합니다.</p>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] rounded-full px-6">로그인하기</Button>
        </Link>
      </div>
    );
  }

  const handleAudioUpload = () => {
    if (quota.remaining <= 0) return;
    setCurrentSource("audio");
    setState("uploading");
    setTimeout(() => setState("transcribing"), 1500);
    setTimeout(() => setState("analyzing"), 4000);
    setTimeout(() => {
      setState("done");
      setQuota((q) => ({ ...q, used: q.used + 1, remaining: q.remaining - 1 }));
    }, 6000);
  };

  const handleTextSubmit = () => {
    if (quota.remaining <= 0 || !textContent.trim()) return;
    setCurrentSource("text");
    setState("analyzing");
    setTimeout(() => {
      setState("done");
      setQuota((q) => ({ ...q, used: q.used + 1, remaining: q.remaining - 1 }));
    }, 3000);
  };

  const handleMemoAnalysis = () => {
    if (!memo.trim()) return;
    setMemoAnalyzing(true);
    setTimeout(() => setMemoAnalyzing(false), 2000);
  };

  const resetToIdle = () => {
    setState("idle");
    setUploadMode("select");
    setTextContent("");
    setTextTitle("");
    setMemo("");
  };

  const currentAnalysis = currentSource === "audio" ? DUMMY_ANALYSIS_AUDIO : DUMMY_ANALYSIS_TEXT;
  const currentScoreItems = currentSource === "audio" ? SCORE_ITEMS_AUDIO : SCORE_ITEMS_TEXT;

  // ===== 분석 결과 상세 보기 =====
  if (selectedRecord) {
    const record = DUMMY_RECORDS.find((r) => r.id === selectedRecord);
    const analysis = record?.source === "audio" ? DUMMY_ANALYSIS_AUDIO : DUMMY_ANALYSIS_TEXT;
    const scoreItems = record?.source === "audio" ? SCORE_ITEMS_AUDIO : SCORE_ITEMS_TEXT;

    return (
      <div>
        <div className="bg-white px-5 py-3 border-b border-gray-50">
          <button onClick={() => setSelectedRecord(null)} className="text-[13px] text-gray-500">
            ← 분석기록으로
          </button>
        </div>

        <div className="bg-gradient-to-br from-violet-600 to-blue-500 px-5 py-5">
          <div className="flex items-center gap-1.5">
            {record?.source === "audio" ? (
              <Badge className="bg-white/20 text-white text-[10px] h-5 gap-1"><Mic className="h-2.5 w-2.5" /> 음성</Badge>
            ) : (
              <Badge className="bg-white/20 text-white text-[10px] h-5 gap-1"><Type className="h-2.5 w-2.5" /> 텍스트</Badge>
            )}
            <span className="text-[11px] text-violet-200">{record?.date} · {record?.duration}</span>
          </div>
          <p className="text-[15px] font-bold text-white mt-1.5">{record?.title}</p>
          {record?.score && (
            <div className="flex items-end gap-2 mt-2">
              <span className="text-[36px] font-bold text-white leading-none">{record.score}</span>
              <span className="text-[13px] text-violet-200 mb-1">/ 100</span>
            </div>
          )}
        </div>

        {record?.hasAnalysis && (
          <>
            <div className="bg-white mt-2 px-5 py-4">
              <p className="text-[13px] font-bold text-gray-900 mb-2">AI 요약</p>
              <p className="text-[13px] text-gray-600 leading-relaxed">{analysis.transcript_summary}</p>
            </div>

            <div className="bg-white mt-2 px-5 py-4">
              <p className="text-[13px] font-bold text-gray-900 mb-3">대화 비율</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 w-8">나</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full flex items-center justify-center" style={{ width: `${analysis.talk_ratio.user}%` }}>
                    <span className="text-[10px] text-white font-medium">{analysis.talk_ratio.user}%</span>
                  </div>
                  <div className="bg-gray-300 h-full flex items-center justify-center flex-1">
                    <span className="text-[10px] text-gray-700 font-medium">{analysis.talk_ratio.customer}%</span>
                  </div>
                </div>
                <span className="text-[11px] text-gray-500 w-8">고객</span>
              </div>
            </div>

            <div className="bg-white mt-2 px-5 py-4">
              <p className="text-[13px] font-bold text-gray-900 mb-3">핵심 구간</p>
              {analysis.key_moments.map((m, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">{m.time}</Badge>
                  <div>
                    <p className="text-[12px] font-medium text-gray-900">{m.type}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white mt-2 px-5 py-4">
              <p className="text-[13px] font-bold text-gray-900 mb-3">영역별 분석</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {scoreItems.map(({ key, label, icon: Icon }) => {
                  const s = analysis.scores[key as keyof typeof analysis.scores];
                  if (s.score === 0) return null;
                  return (
                    <div key={key} className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-violet-600" />
                        <span className="text-[11px] font-medium text-gray-700">{label}</span>
                      </div>
                      <p className="text-[20px] font-bold text-gray-900">{s.score}</p>
                      <Progress value={s.score} className="h-1" />
                    </div>
                  );
                })}
              </div>
              {scoreItems.map(({ key, label, icon: Icon }) => {
                const s = analysis.scores[key as keyof typeof analysis.scores];
                if (s.score === 0) return null;
                return (
                  <div key={key} className="py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="h-3 w-3 text-violet-600" />
                      <span className="text-[12px] font-bold text-gray-900">{label}</span>
                      <Badge variant="outline" className="text-[10px] ml-auto">{s.score}점</Badge>
                    </div>
                    <p className="text-[12px] text-gray-600">{s.feedback}</p>
                    <div className="mt-1.5 rounded bg-violet-50 p-2">
                      <p className="text-[11px] text-violet-700"><span className="font-medium">제안:</span> {s.suggestion}</p>
                    </div>
                  </div>
                );
              })}
              {record?.source === "text" && (
                <div className="mt-3 rounded bg-amber-50 p-2">
                  <p className="text-[11px] text-amber-700">텍스트 대화에서는 톤/억양 분석이 제외됩니다.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* 메모 섹션 */}
        <div className="bg-white mt-2 px-5 py-4">
          <p className="text-[13px] font-bold text-gray-900 mb-2">내 메모</p>
          {record?.memo ? (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[13px] text-gray-700">{record.memo}</p>
            </div>
          ) : (
            <p className="text-[12px] text-gray-400">아직 메모가 없습니다.</p>
          )}
          <div className="mt-3 space-y-2">
            <Textarea placeholder="메모를 남기면 AI가 추가 분석해드립니다." value={memo} onChange={(e) => setMemo(e.target.value)} className="min-h-[80px] text-[13px] bg-gray-50" />
            <Button size="sm" className="w-full h-9 bg-violet-600 hover:bg-violet-700 text-white text-[12px] gap-1.5" disabled={!memo.trim() || memoAnalyzing} onClick={handleMemoAnalysis}>
              {memoAnalyzing ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> 분석 중...</> : <><Send className="h-3.5 w-3.5" /> 메모 저장 + AI 분석</>}
            </Button>
          </div>
        </div>

        <div className="bg-white mt-2 px-5 py-4">
          <Link href="/coaching">
            <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 p-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <p className="text-[13px] font-bold text-gray-900">이 대화로 코칭받기</p>
                <p className="text-[11px] text-gray-500">전문 코치에게 1:1 피드백을 받아보세요</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // ===== 분석 완료 화면 =====
  if (state === "done") {
    return (
      <div>
        <div className="bg-gradient-to-br from-violet-600 to-blue-500 px-5 py-6 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {currentSource === "audio" ? (
              <Badge className="bg-white/20 text-white text-[10px] h-5 gap-1"><Mic className="h-2.5 w-2.5" /> 음성 분석</Badge>
            ) : (
              <Badge className="bg-white/20 text-white text-[10px] h-5 gap-1"><Type className="h-2.5 w-2.5" /> 텍스트 분석</Badge>
            )}
          </div>
          <p className="text-[11px] text-violet-200">분석 완료</p>
          <p className="text-[48px] font-bold text-white leading-none mt-1">{currentAnalysis.overall.score}</p>
          <p className="text-[13px] text-violet-200 mt-2">{currentAnalysis.overall.feedback}</p>
        </div>

        <div className="bg-white mt-2 px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            {currentScoreItems.map(({ key, label, icon: Icon }) => {
              const s = currentAnalysis.scores[key as keyof typeof currentAnalysis.scores];
              if (s.score === 0) return null;
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-violet-600" />
                    <span className="text-[11px] font-medium text-gray-700">{label}</span>
                  </div>
                  <p className="text-[20px] font-bold text-gray-900">{s.score}</p>
                  <Progress value={s.score} className="h-1" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white mt-2 px-5 py-4">
          <p className="text-[13px] font-bold text-gray-900 mb-2">메모 남기기</p>
          <Textarea placeholder="이 대화에서 깨달은 점, 다음에 적용할 것을 메모하세요..." value={memo} onChange={(e) => setMemo(e.target.value)} className="min-h-[80px] text-[13px] bg-gray-50" />
          <Button size="sm" className="w-full mt-2 h-9 bg-violet-600 hover:bg-violet-700 text-white text-[12px] gap-1.5" disabled={!memo.trim() || memoAnalyzing} onClick={handleMemoAnalysis}>
            {memoAnalyzing ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> AI 분석 중...</> : <><Send className="h-3.5 w-3.5" /> 저장 + AI 피드백 받기</>}
          </Button>
        </div>

        <div className="bg-white mt-2 px-5 py-4 flex gap-2">
          <Button variant="outline" className="flex-1 h-9 text-[13px]" onClick={resetToIdle}>새 분석</Button>
          <Button variant="outline" className="flex-1 h-9 text-[13px]" onClick={() => { resetToIdle(); setTab("records"); }}>분석기록</Button>
        </div>
      </div>
    );
  }

  // ===== 메인 화면 =====
  return (
    <div>
      <div className="bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-violet-600" />
          <p className="text-[17px] font-bold text-gray-900">AI 코파일럿</p>
        </div>
        <p className="text-[13px] text-gray-500 mt-1">음성 또는 대화 내용을 올리고 AI 분석을 받아보세요</p>
      </div>

      <div className="bg-white border-b border-gray-100 flex">
        {([
          { key: "analyze" as TabType, label: "분석하기" },
          { key: "records" as TabType, label: "분석기록" },
        ]).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex-1 py-2.5 text-[13px] font-medium border-b-2 transition-colors", tab === t.key ? "text-gray-900 border-gray-900" : "text-gray-400 border-transparent")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== 분석하기 탭 ===== */}
      {tab === "analyze" && (
        <>
          {state === "idle" && (
            <>
              {quota.remaining <= 0 ? (
                <div className="bg-white mt-2 px-5 py-6 text-center">
                  <Lock className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                  <p className="text-[13px] font-medium text-gray-700">오늘의 무료 분석을 모두 사용했습니다</p>
                  <p className="text-[11px] text-gray-400 mt-1">매일 00:00에 초기화됩니다</p>
                  {authLevel < 2 && (
                    <Link href="/verify">
                      <Button size="sm" variant="outline" className="mt-3 text-[11px] rounded-full">인증하고 3회로 늘리기</Button>
                    </Link>
                  )}
                </div>
              ) : uploadMode === "select" ? (
                /* 업로드 방식 선택 */
                <div className="bg-white mt-2 px-5 py-5 space-y-3">
                  <p className="text-[13px] font-bold text-gray-900">어떤 내용을 분석할까요?</p>

                  <button
                    onClick={() => setUploadMode("audio")}
                    className="w-full flex items-center gap-4 rounded-xl border-2 border-gray-100 hover:border-violet-400 p-4 text-left transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 shrink-0">
                      <Mic className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">음성 올리기</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">통화 녹음, 미팅 녹음 등 음성 파일</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">MP3, WAV, M4A · STT 변환 + AI 분석</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setUploadMode("text")}
                    className="w-full flex items-center gap-4 rounded-xl border-2 border-gray-100 hover:border-blue-400 p-4 text-left transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 shrink-0">
                      <Type className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">대화내용 올리기</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">카카오톡, 문자, 이메일 등 텍스트 대화</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">복사 붙여넣기 · AI 분석</p>
                    </div>
                  </button>
                </div>
              ) : uploadMode === "audio" ? (
                /* 음성 업로드 */
                <div className="bg-white mt-2 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5">
                      <Mic className="h-4 w-4 text-violet-600" /> 음성 올리기
                    </p>
                    <button onClick={() => setUploadMode("select")} className="text-[12px] text-gray-400">← 돌아가기</button>
                  </div>

                  <div
                    className="cursor-pointer border-2 border-dashed border-gray-200 hover:border-violet-400 rounded-xl p-6 text-center transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="h-10 w-10 mx-auto text-gray-300" />
                    <p className="text-[13px] font-medium text-gray-700 mt-2">녹음 파일 업로드</p>
                    <p className="text-[11px] text-gray-400 mt-1">MP3, WAV, M4A (최대 50MB / 30분)</p>
                  </div>
                  <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />

                  <button
                    className="w-full h-12 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={handleAudioUpload}
                  >
                    <Mic className="h-5 w-5 text-red-500" /> 실시간 녹음 시작
                  </button>
                </div>
              ) : (
                /* 텍스트 입력 */
                <div className="bg-white mt-2 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5">
                      <Type className="h-4 w-4 text-blue-600" /> 대화내용 올리기
                    </p>
                    <button onClick={() => setUploadMode("select")} className="text-[12px] text-gray-400">← 돌아가기</button>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-gray-500">제목</Label>
                    <Input
                      placeholder="예: 카카오톡 고객 상담, 이메일 영업 등"
                      value={textTitle}
                      onChange={(e) => setTextTitle(e.target.value)}
                      className="text-[13px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-gray-500">대화 내용</Label>
                    <Textarea
                      placeholder={"카카오톡, 문자, 이메일 대화를 그대로 붙여넣기 하세요.\n\n예시:\n나: 안녕하세요, 지난번 상담 관련 연락드립니다.\n고객: 네, 안녕하세요.\n나: 말씀드린 상품이 이번 주까지 프로모션인데요..."}
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="min-h-[200px] text-[13px] bg-gray-50"
                    />
                  </div>

                  <Button
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px] gap-1.5"
                    disabled={!textContent.trim()}
                    onClick={handleTextSubmit}
                  >
                    <Send className="h-4 w-4" /> 분석 시작
                  </Button>
                </div>
              )}

              <div className="bg-amber-50 mt-2 px-5 py-3">
                <p className="text-[11px] font-medium text-amber-700">개인정보 보호 안내</p>
                <p className="text-[11px] text-amber-600 mt-0.5">고객명, 전화번호 등 개인정보는 편집 후 업로드해주세요.</p>
              </div>

              <div className="bg-white mt-2 px-5 py-3 text-center text-[13px] text-gray-500">
                오늘 남은 무료 분석: <span className="font-bold text-violet-600">{quota.remaining}회</span>
                <span className="text-[11px] ml-1 text-gray-400">(일 {quota.limit}회)</span>
              </div>
            </>
          )}

          {(state === "uploading" || state === "transcribing" || state === "analyzing") && (
            <div className="bg-white mt-2 px-5 py-10 text-center space-y-4">
              <div className="h-12 w-12 mx-auto animate-spin rounded-full border-3 border-violet-600 border-t-transparent" />
              <p className="text-[13px] font-medium text-gray-700">
                {state === "uploading" && "파일 업로드 중..."}
                {state === "transcribing" && "음성 → 텍스트 변환 중..."}
                {state === "analyzing" && "AI 코파일럿 분석 중..."}
              </p>
              {state === "transcribing" && (
                <div className="max-w-xs mx-auto space-y-1">
                  <Progress value={40} className="h-1" />
                  <p className="text-[11px] text-gray-400">Return Zero STT + 화자 분리</p>
                </div>
              )}
              {state === "analyzing" && (
                <div className="max-w-xs mx-auto space-y-1">
                  <Progress value={75} className="h-1" />
                  <p className="text-[11px] text-gray-400">
                    {currentSource === "audio" ? "클로징 기회, 반론 대응, 톤 분석 중..." : "대화 패턴, 클로징 기회, 반론 대응 분석 중..."}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ===== 분석기록 탭 ===== */}
      {tab === "records" && (
        <div>
          {DUMMY_RECORDS.length === 0 ? (
            <div className="bg-white py-16 text-center">
              <FileAudio className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="text-[13px] text-gray-400">아직 분석 기록이 없습니다.</p>
              <Button size="sm" className="mt-3 bg-violet-600 text-[12px] rounded-full" onClick={() => setTab("analyze")}>
                첫 분석하기
              </Button>
            </div>
          ) : (
            DUMMY_RECORDS.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelectedRecord(record.id)}
                className="w-full bg-white px-5 py-4 border-b border-gray-50 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                  record.source === "audio" ? "bg-violet-50" : "bg-blue-50"
                )}>
                  {record.source === "audio" ? (
                    <FileAudio className="h-5 w-5 text-violet-600" />
                  ) : (
                    <FileText className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className={cn("text-[9px] h-4 px-1", record.source === "audio" ? "text-violet-600 border-violet-200" : "text-blue-600 border-blue-200")}>
                      {record.source === "audio" ? "음성" : "텍스트"}
                    </Badge>
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-[11px] text-gray-400">{record.date}</span>
                    <span className="text-[11px] text-gray-300">·</span>
                    <span className="text-[11px] text-gray-400">{record.duration}</span>
                  </div>
                  <p className="text-[13px] font-medium text-gray-900 mt-0.5 truncate">{record.title}</p>
                  {record.memo && (
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{record.memo}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {record.score ? (
                    <p className="text-[17px] font-bold text-violet-600">{record.score}</p>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">메모만</Badge>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
