"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Medal, Lock, LogIn } from "lucide-react";
import { INDUSTRIES, INCOME_RANGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import type { Industry } from "@/types";

interface LeaderboardEntry {
  id: string;
  source: string;
  display_name: string;
  industry: string;
  income_range: string;
  is_verified: boolean;
  rank_score: number;
}

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | "all">("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const authLevel = user?.auth_level ?? 0;

  useEffect(() => {
    setLoading(true);
    const query = selectedIndustry === "all" ? "" : `?industry=${selectedIndustry}`;
    fetch(`/api/leaderboard${query}`)
      .then((r) => r.json())
      .then((res) => {
        setEntries(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedIndustry]);

  const getIncomeLabel = (range: string) =>
    INCOME_RANGES.find((r) => r.value === range)?.label || range;

  return (
    <div className="space-y-4 px-4 py-4">
      <h1 className="text-lg font-bold flex items-center gap-2">
        <Trophy className="h-5 w-5 text-[#2E75B6]" />
        리더보드
      </h1>

      {/* 업종 필터 */}
      <div className="overflow-x-auto">
        <Tabs
          value={selectedIndustry}
          onValueChange={(v) => setSelectedIndustry(v as typeof selectedIndustry)}
        >
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="all">전체</TabsTrigger>
            {INDUSTRIES.map((ind) => (
              <TabsTrigger key={ind.value} value={ind.value}>
                {ind.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 업계 평균 카드 - 모든 레벨에서 보임 */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">업계 평균</p>
          <p className="text-lg font-bold">영업 직군 평균 연봉: 4,200만원</p>
          <p className="text-xs text-muted-foreground">
            상위 10% 기준: 1.2억원 이상
          </p>
        </CardContent>
      </Card>

      {/* Lv.0: 업계 평균만 보임 */}
      {!authLoading && authLevel === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center space-y-3">
            <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">리더보드를 확인하려면 로그인이 필요합니다</p>
            <p className="text-xs text-muted-foreground">
              가입하면 내 위치를 확인할 수 있습니다
            </p>
            <Link href="/login">
              <Button size="sm" className="gap-1 bg-[#2E75B6]">
                <LogIn className="h-3 w-3" /> 로그인하고 내 순위 보기
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Lv.1 이상: 내 위치 카드 */}
      {authLevel >= 1 && (
        <Card className="bg-gradient-to-r from-[#1B3A5C] to-[#2E75B6] text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70">나의 위치</p>
              <p className="text-xl font-bold">상위 32%</p>
              <p className="text-xs text-white/70">
                {user?.industry
                  ? `${INDUSTRIES.find((i) => i.value === user.industry)?.label || ""} 기준`
                  : "전체 기준"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-green-300">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+5%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lv.1: 전체 리더보드 잠금 안내 */}
      {authLevel === 1 && (
        <Card className="border-dashed border-amber-300 bg-amber-50/50">
          <CardContent className="p-4 text-center space-y-2">
            <Lock className="h-6 w-6 mx-auto text-amber-500" />
            <p className="text-sm font-medium">전체 리더보드는 인증 회원만 열람 가능합니다</p>
            <p className="text-xs text-muted-foreground">
              소득 인증을 완료하면 TOP 랭킹을 확인할 수 있습니다
            </p>
            <Link href="/verify">
              <Button size="sm" variant="outline" className="mt-1">
                인증하러 가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Lv.2: 전체 리더보드 열람 */}
      {authLevel >= 2 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            TOP {entries.length}
          </h2>

          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              불러오는 중...
            </div>
          ) : (
            entries.map((entry, idx) => {
              const rank = idx + 1;
              return (
                <Card
                  key={entry.id}
                  className={cn(
                    "transition-shadow hover:shadow-md",
                    rank <= 3 && "border-[#2E75B6]/30"
                  )}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center flex-shrink-0">
                      {rank <= 3 ? (
                        <Medal
                          className={cn(
                            "h-6 w-6",
                            rank === 1 && "text-yellow-500",
                            rank === 2 && "text-gray-400",
                            rank === 3 && "text-amber-600"
                          )}
                        />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          {rank}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {entry.display_name}
                        </span>
                        {entry.is_verified && (
                          <Badge className="bg-[#2E75B6] text-white text-[10px] px-1.5 py-0">
                            인증
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getIncomeLabel(entry.income_range)}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-[#2E75B6]">
                      {entry.rank_score}점
                    </span>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
