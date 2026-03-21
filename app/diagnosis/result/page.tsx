"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Trophy, Users } from "lucide-react";
import type { DiagnosisResultJson } from "@/types";

function DiagnosisResultContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [result, setResult] = useState<DiagnosisResultJson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/diagnosis/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setResult(data.result_json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p>결과를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg min-h-screen bg-background px-4 py-6 space-y-6">
      {/* 타입 카드 */}
      <Card className="bg-gradient-to-br from-[#1B3A5C] to-[#2E75B6] text-white">
        <CardContent className="p-6 text-center space-y-3">
          <Badge variant="secondary" className="bg-white/20 text-white">
            영업 역량 진단 결과
          </Badge>
          <h1 className="text-2xl font-bold">{result.type_name}</h1>
          <div className="text-4xl font-bold">상위 {result.percentile}%</div>
          <p className="text-sm text-white/80">{result.type_description}</p>
        </CardContent>
      </Card>

      {/* 강점 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            강점
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {result.strengths.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              {s}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 개선 영역 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            개선 영역
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {result.weaknesses.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              {w}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 추천 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">맞춤 추천</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.recommendations.map((r, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border p-3 text-sm"
            >
              <Download className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              {r}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="space-y-3 pb-4">
        <Link href="/login">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-800 text-white"
            size="lg"
          >
            회원가입하고 전체 결과 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full" size="lg">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function DiagnosisResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <DiagnosisResultContent />
    </Suspense>
  );
}
