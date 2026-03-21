"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileAudio } from "lucide-react";

const DUMMY_HISTORY = [
  { id: "1", date: "2026.03.20", duration: "8분 32초", score: 72, industry: "보험" },
  { id: "2", date: "2026.03.18", duration: "12분 15초", score: 65, industry: "보험" },
  { id: "3", date: "2026.03.15", duration: "5분 48초", score: 58, industry: "보험" },
];

export default function AiBotHistoryPage() {
  return (
    <div>
      <div className="bg-white px-5 py-3 border-b border-gray-50">
        <Link href="/ai-bot" className="flex items-center gap-1 text-[13px] text-gray-500">
          <ArrowLeft className="h-4 w-4" /> 돌아가기
        </Link>
      </div>

      <div className="bg-white px-5 py-4">
        <p className="text-[15px] font-bold text-gray-900">분석 이력</p>
      </div>

      <div>
        {DUMMY_HISTORY.length === 0 ? (
          <div className="bg-white mt-2 py-16 text-center">
            <p className="text-[13px] text-gray-400">아직 분석 이력이 없습니다.</p>
          </div>
        ) : (
          DUMMY_HISTORY.map((item) => (
            <div key={item.id} className="bg-white px-5 py-3.5 border-b border-gray-50 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <FileAudio className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-gray-900">세일즈 콜 분석</p>
                <p className="text-[11px] text-gray-400">{item.date} · {item.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-[17px] font-bold text-blue-600">{item.score}점</p>
                <Badge variant="outline" className="text-[10px]">{item.industry}</Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
