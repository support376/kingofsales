"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Mic,
  MessageSquare,
  Volume2,
  Target,
  Shield,
  History,
  LogIn,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type AnalysisState = "idle" | "uploading" | "analyzing" | "done";

const DUMMY_RESULT = {
  score_total: 72,
  score_speech: 68,
  score_tone: 75,
  score_closing: 60,
  score_objection: 78,
  feedback: {
    speech: {
      score: 68,
      feedback: "질문과 설명의 비율이 30:70으로 설명에 치우쳐 있습니다.",
      suggestion: "SPIN 기법을 활용해 상황-문제-시사-필요 순서로 질문해보세요.",
    },
    tone: {
      score: 75,
      feedback: "전반적으로 안정적이지만 2분 30초 부근에서 말 속도가 급격히 빨라집니다.",
      suggestion: "긴장되는 순간에도 일정한 페이스를 유지하는 연습이 필요합니다.",
    },
    closing: {
      score: 60,
      feedback: "고객의 구매 신호가 3회 감지되었으나 클로징 시도가 0회입니다.",
      suggestion: '"다음 단계로 넘어갈까요?" 같은 자연스러운 클로징 문구를 준비해두세요.',
    },
    objection: {
      score: 78,
      feedback: "가격 반론에 대해 기능 설명으로 대응했습니다.",
      suggestion: "ROI 기반 응답을 준비하세요. 비용 대비 효과를 수치로 보여주는 것이 효과적입니다.",
    },
    overall: {
      score: 72,
      feedback: "평균 이상의 세일즈 스킬을 보여주고 있습니다.",
      suggestion: "클로징 신호 포착과 적시 클로징이 가장 큰 개선 포인트입니다.",
    },
  },
};

const SCORE_ITEMS = [
  { key: "speech", label: "화법 패턴", icon: MessageSquare },
  { key: "tone", label: "톤 분석", icon: Volume2 },
  { key: "closing", label: "클로징 신호", icon: Target },
  { key: "objection", label: "반론 처리", icon: Shield },
] as const;

export default function AiBotPage() {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<AnalysisState>("idle");
  const [quota, setQuota] = useState({ used: 0, limit: 1, remaining: 1 });
  const fileRef = useRef<HTMLInputElement>(null);

  const authLevel = user?.auth_level ?? 0;

  // 쿼터 조회
  useEffect(() => {
    if (!user) return;
    fetch(`/api/ai-bot/quota?user_id=${user.id}&auth_level=${authLevel}`)
      .then((r) => r.json())
      .then(setQuota)
      .catch(() => {});
  }, [user, authLevel]);

  // 비로그인 차단
  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 px-4">
        <LogIn className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-bold">로그인이 필요합니다</h2>
        <p className="text-sm text-muted-foreground text-center">
          AI 세일즈 봇은 회원만 이용 가능합니다.
        </p>
        <Link href="/login">
          <Button className="bg-[#2E75B6] hover:bg-[#1B3A5C] text-white">로그인하기</Button>
        </Link>
      </div>
    );
  }

  const handleUpload = () => {
    if (quota.remaining <= 0) return;
    setState("uploading");
    setTimeout(() => setState("analyzing"), 1500);
    setTimeout(() => {
      setState("done");
      setQuota((q) => ({ ...q, used: q.used + 1, remaining: q.remaining - 1 }));
    }, 4000);
  };

  if (state === "done") {
    return (
      <div className="space-y-4 px-4 py-4">
        <h1 className="text-lg font-bold">분석 결과</h1>

        <Card className="bg-gradient-to-br from-[#1B3A5C] to-[#2E75B6] text-white">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm text-white/70">종합 점수</p>
            <p className="text-5xl font-bold">{DUMMY_RESULT.score_total}</p>
            <p className="text-sm text-white/80">{DUMMY_RESULT.feedback.overall.feedback}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {SCORE_ITEMS.map(({ key, label, icon: Icon }) => {
            const score = DUMMY_RESULT[`score_${key}` as keyof typeof DUMMY_RESULT] as number;
            return (
              <Card key={key}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#2E75B6]" />
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                  <p className="text-2xl font-bold">{score}</p>
                  <Progress value={score} className="h-1.5" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {SCORE_ITEMS.map(({ key, label, icon: Icon }) => {
          const fb = DUMMY_RESULT.feedback[key as keyof typeof DUMMY_RESULT.feedback];
          return (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#2E75B6]" />
                  {label}
                  <Badge variant="outline" className="ml-auto">{fb.score}점</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{fb.feedback}</p>
                <div className="rounded-lg bg-blue-50 p-3 text-xs">
                  <span className="font-medium text-[#2E75B6]">개선 제안: </span>
                  {fb.suggestion}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="flex gap-2 pb-4">
          <Button variant="outline" className="flex-1" onClick={() => setState("idle")}>
            새 분석
          </Button>
          <Link href="/ai-bot/history" className="flex-1">
            <Button variant="outline" className="w-full gap-1">
              <History className="h-4 w-4" /> 이력
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold">AI 세일즈 봇</h1>
        <p className="text-sm text-muted-foreground">
          세일즈 콜을 녹음하고 AI가 분석해드립니다
        </p>
      </div>

      {state === "idle" && (
        <>
          {/* 쿼터 초과 시 */}
          {quota.remaining <= 0 ? (
            <Card className="border-amber-300 bg-amber-50">
              <CardContent className="p-6 text-center space-y-3">
                <Lock className="h-10 w-10 mx-auto text-amber-500" />
                <p className="font-medium">오늘의 무료 분석을 모두 사용했습니다</p>
                <p className="text-xs text-muted-foreground">
                  매일 00:00에 초기화됩니다
                </p>
                {authLevel < 2 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-amber-700">
                      인증 회원은 하루 3회까지 무료 분석이 가능합니다
                    </p>
                    <Link href="/verify">
                      <Button size="sm" variant="outline">인증하고 3회로 늘리기</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <Card
                className="cursor-pointer border-dashed border-2 hover:border-[#2E75B6] transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <CardContent className="p-8 text-center space-y-3">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="font-medium">녹음 파일 업로드</p>
                  <p className="text-xs text-muted-foreground">
                    MP3, WAV, M4A (최대 50MB / 30분)
                  </p>
                </CardContent>
              </Card>
              <input
                ref={fileRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleUpload}
              />

              <Button variant="outline" className="w-full gap-2 h-14" onClick={handleUpload}>
                <Mic className="h-5 w-5 text-red-500" />
                실시간 녹음 시작
              </Button>
            </>
          )}

          {/* 개인정보 안내 */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3 text-xs text-amber-800 space-y-1">
              <p className="font-medium">녹음 업로드 안내</p>
              <p>녹음에 고객명, 전화번호 등 개인정보가 포함되어 있다면 직접 편집 후 업로드해주세요.</p>
              <p>개인정보 포함 상태로 업로드 시 플랫폼은 책임지지 않습니다.</p>
            </CardContent>
          </Card>

          {/* 남은 횟수 - 실제 쿼터 연동 */}
          <div className="text-center text-sm text-muted-foreground">
            오늘 남은 무료 분석:{" "}
            <span className="font-bold text-[#2E75B6]">{quota.remaining}회</span>
            <span className="text-xs ml-1">
              (일 {quota.limit}회 · {authLevel >= 2 ? "인증회원" : "일반회원"})
            </span>
          </div>

          <Link href="/ai-bot/history">
            <Button variant="ghost" className="w-full gap-1">
              <History className="h-4 w-4" /> 분석 이력 보기
            </Button>
          </Link>
        </>
      )}

      {(state === "uploading" || state === "analyzing") && (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="h-16 w-16 mx-auto animate-spin rounded-full border-4 border-[#2E75B6] border-t-transparent" />
            <p className="font-medium">
              {state === "uploading" ? "파일 업로드 중..." : "AI 분석 중..."}
            </p>
            {state === "analyzing" && (
              <div className="space-y-1">
                <Progress value={65} />
                <p className="text-xs text-muted-foreground">화법 패턴 분석 중...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
