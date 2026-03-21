"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileAudio } from "lucide-react";

const DUMMY_HISTORY = [
  {
    id: "1",
    date: "2026.03.20",
    duration: "8분 32초",
    score: 72,
    industry: "보험",
  },
  {
    id: "2",
    date: "2026.03.18",
    duration: "12분 15초",
    score: 65,
    industry: "보험",
  },
  {
    id: "3",
    date: "2026.03.15",
    duration: "5분 48초",
    score: 58,
    industry: "보험",
  },
];

export default function AiBotHistoryPage() {
  return (
    <div className="space-y-4 px-4 py-4">
      <Link href="/ai-bot" className="flex items-center gap-1 text-sm">
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Link>

      <h1 className="text-lg font-bold">분석 이력</h1>

      <div className="space-y-2">
        {DUMMY_HISTORY.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E75B6]/10">
                <FileAudio className="h-5 w-5 text-[#2E75B6]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">세일즈 콜 분석</p>
                <p className="text-xs text-muted-foreground">
                  {item.date} · {item.duration}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#2E75B6]">
                  {item.score}점
                </p>
                <Badge variant="outline" className="text-[10px]">
                  {item.industry}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {DUMMY_HISTORY.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          아직 분석 이력이 없습니다.
        </div>
      )}
    </div>
  );
}
