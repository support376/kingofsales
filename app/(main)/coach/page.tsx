"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Mic, MessageSquare, Volume2, Target, Shield, History, LogIn, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type AnalysisState = "idle" | "uploading" | "analyzing" | "done";

const DUMMY_RESULT = {
  score_total: 72, score_speech: 68, score_tone: 75, score_closing: 60, score_objection: 78,
  feedback: {
    speech: { score: 68, feedback: "질문과 설명의 비율이 30:70으로 설명에 치우쳐 있습니다.", suggestion: "SPIN 기법을 활용해 질문 비율을 높여보세요." },
    tone: { score: 75, feedback: "전반적으로 안정적이지만 2분 30초 부근에서 말 속도가 급격히 빨라집니다.", suggestion: "긴장되는 순간에도 일정한 페이스를 유지하세요." },
    closing: { score: 60, feedback: "고객의 구매 신호가 3회 감지되었으나 클로징 시도가 0회입니다.", suggestion: '"다음 단계로 넘어갈까요?" 같은 클로징 문구를 준비하세요.' },
    objection: { score: 78, feedback: "가격 반론에 대해 기능 설명으로 대응했습니다.", suggestion: "ROI 기반 응답을 준비하세요." },
    overall: { score: 72, feedback: "평균 이상의 세일즈 스킬을 보여주고 있습니다.", suggestion: "클로징 신호 포착이 가장 큰 개선 포인트입니다." },
  },
};

const SCORE_ITEMS = [
  { key: "speech", label: "화법 패턴", icon: MessageSquare },
  { key: "tone", label: "톤 분석", icon: Volume2 },
  { key: "closing", label: "클로징 신호", icon: Target },
  { key: "objection", label: "반론 처리", icon: Shield },
] as const;

export default function CoachPage() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<AnalysisState>("idle");
  const [quota, setQuota] = useState({ used: 0, limit: 1, remaining: 1 });
  const fileRef = useRef<HTMLInputElement>(null);
  const authLevel = user?.auth_level ?? 0;

  useEffect(() => {
    if (!user) return;
    fetch(`/api/coach/quota?user_id=${user.id}&auth_level=${authLevel}`)
      .then((r) => r.json()).then(setQuota).catch(() => {});
  }, [user, authLevel]);

  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 px-5">
        <LogIn className="h-10 w-10 text-gray-300" />
        <p className="text-[15px] font-bold text-gray-900">로그인이 필요합니다</p>
        <p className="text-[13px] text-gray-500 text-center">AI 코치는 회원만 이용 가능합니다.</p>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] rounded-full px-6">로그인하기</Button>
        </Link>
      </div>
    );
  }

  const handleUpload = () => {
    if (quota.remaining <= 0) return;
    setState("uploading");
    setTimeout(() => setState("analyzing"), 1500);
    setTimeout(() => { setState("done"); setQuota((q) => ({ ...q, used: q.used + 1, remaining: q.remaining - 1 })); }, 4000);
  };

  // 결과 화면
  if (state === "done") {
    return (
      <div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 px-5 py-6 text-center">
          <p className="text-[11px] text-blue-200">종합 점수</p>
          <p className="text-[48px] font-bold text-white leading-none mt-1">{DUMMY_RESULT.score_total}</p>
          <p className="text-[13px] text-blue-200 mt-2">{DUMMY_RESULT.feedback.overall.feedback}</p>
        </div>

        <div className="bg-white mt-2 px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            {SCORE_ITEMS.map(({ key, label, icon: Icon }) => {
              const score = DUMMY_RESULT[`score_${key}` as keyof typeof DUMMY_RESULT] as number;
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-[11px] font-medium text-gray-700">{label}</span>
                  </div>
                  <p className="text-[20px] font-bold text-gray-900">{score}</p>
                  <Progress value={score} className="h-1" />
                </div>
              );
            })}
          </div>
        </div>

        {SCORE_ITEMS.map(({ key, label, icon: Icon }) => {
          const fb = DUMMY_RESULT.feedback[key as keyof typeof DUMMY_RESULT.feedback];
          return (
            <div key={key} className="bg-white mt-2 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-[13px] font-bold text-gray-900">{label}</span>
                </div>
                <Badge variant="outline" className="text-[11px]">{fb.score}점</Badge>
              </div>
              <p className="text-[13px] text-gray-700">{fb.feedback}</p>
              <div className="mt-2 rounded-lg bg-blue-50 p-3">
                <p className="text-[11px] text-blue-700"><span className="font-medium">개선 제안:</span> {fb.suggestion}</p>
              </div>
            </div>
          );
        })}

        <div className="bg-white mt-2 px-5 py-4 flex gap-2">
          <Button variant="outline" className="flex-1 h-9 text-[13px]" onClick={() => setState("idle")}>새 분석</Button>
          <Link href="/coach/history" className="flex-1">
            <Button variant="outline" className="w-full h-9 text-[13px] gap-1"><History className="h-3.5 w-3.5" /> 이력</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white px-5 py-5 text-center">
        <p className="text-[17px] font-bold text-gray-900">AI 세일즈 코치</p>
        <p className="text-[13px] text-gray-500 mt-1">세일즈 콜을 녹음하고 AI가 분석해드립니다</p>
      </div>

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
          ) : (
            <div className="bg-white mt-2 px-5 py-4 space-y-3">
              <div
                className="cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-6 text-center transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-gray-300" />
                <p className="text-[13px] font-medium text-gray-700 mt-2">녹음 파일 업로드</p>
                <p className="text-[11px] text-gray-400 mt-1">MP3, WAV, M4A (최대 50MB / 30분)</p>
              </div>
              <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleUpload} />

              <button
                className="w-full h-12 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={handleUpload}
              >
                <Mic className="h-5 w-5 text-red-500" /> 실시간 녹음 시작
              </button>
            </div>
          )}

          <div className="bg-amber-50 mt-2 px-5 py-3">
            <p className="text-[11px] font-medium text-amber-700">녹음 업로드 안내</p>
            <p className="text-[11px] text-amber-600 mt-0.5">개인정보(고객명, 전화번호 등)가 포함된 경우 편집 후 업로드해주세요.</p>
          </div>

          <div className="bg-white mt-2 px-5 py-3 text-center text-[13px] text-gray-500">
            오늘 남은 무료 분석: <span className="font-bold text-blue-600">{quota.remaining}회</span>
            <span className="text-[11px] ml-1 text-gray-400">(일 {quota.limit}회)</span>
          </div>

          <div className="bg-white mt-2 px-5 py-3">
            <Link href="/coach/history" className="flex items-center justify-center gap-1 text-[13px] text-gray-500">
              <History className="h-3.5 w-3.5" /> 분석 이력 보기
            </Link>
          </div>
        </>
      )}

      {(state === "uploading" || state === "analyzing") && (
        <div className="bg-white mt-2 px-5 py-10 text-center space-y-4">
          <div className="h-12 w-12 mx-auto animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <p className="text-[13px] font-medium text-gray-700">
            {state === "uploading" ? "파일 업로드 중..." : "AI 분석 중..."}
          </p>
          {state === "analyzing" && (
            <div className="max-w-xs mx-auto space-y-1">
              <Progress value={65} className="h-1" />
              <p className="text-[11px] text-gray-400">화법 패턴 분석 중...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
