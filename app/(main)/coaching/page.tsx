"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GraduationCap, User, Users, Calendar, Star, Clock, ChevronRight, LogIn, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type TabType = "one_on_one" | "seminar" | "cohort";

interface Coach {
  id: string;
  name: string;
  industry: string;
  experience: string;
  rating: number;
  reviews: number;
  price: string;
  tags: string[];
  available: boolean;
}

interface Seminar {
  id: string;
  title: string;
  speaker: string;
  date: string;
  time: string;
  spots: number;
  maxSpots: number;
  price: string;
  tags: string[];
}

interface Cohort {
  id: string;
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  duration: string;
  members: number;
  maxMembers: number;
  price: string;
  tags: string[];
}

const DUMMY_COACHES: Coach[] = [
  { id: "1", name: "김성과", industry: "보험", experience: "12년", rating: 4.9, reviews: 48, price: "30,000원/회", tags: ["콜드콜", "클로징"], available: true },
  { id: "2", name: "박실적", industry: "B2B SaaS", experience: "8년", rating: 4.7, reviews: 32, price: "50,000원/회", tags: ["데모", "파이프라인"], available: true },
  { id: "3", name: "이매출", industry: "부동산", experience: "15년", rating: 4.8, reviews: 67, price: "40,000원/회", tags: ["리퍼럴", "브랜딩"], available: false },
];

const DUMMY_SEMINARS: Seminar[] = [
  { id: "1", title: "콜드콜 마스터클래스: 첫 10초의 기술", speaker: "김성과 코치", date: "2026.04.05", time: "오후 7시 (90분)", spots: 12, maxSpots: 30, price: "19,900원", tags: ["콜드콜", "초급~중급"] },
  { id: "2", title: "가격 반론 완벽 대응법", speaker: "박실적 코치", date: "2026.04.12", time: "오후 8시 (60분)", spots: 5, maxSpots: 20, price: "15,000원", tags: ["반론처리", "중급"] },
  { id: "3", title: "B2B 엔터프라이즈 세일즈 전략", speaker: "최엔터 코치", date: "2026.04.20", time: "오후 2시 (120분)", spots: 18, maxSpots: 25, price: "39,900원", tags: ["B2B", "고급"] },
];

const DUMMY_COHORTS: Cohort[] = [
  { id: "1", title: "4주 클로징 부트캠프", description: "매주 1회 콜리뷰 + 그룹 피드백 + 실전 과제", instructor: "김성과 코치", startDate: "2026.04.07", duration: "4주 (주 1회)", members: 3, maxMembers: 5, price: "199,000원", tags: ["클로징", "소그룹"] },
  { id: "2", title: "콜드콜 30일 챌린지", description: "매일 콜 1건 분석 + 주간 그룹 세션 + 1:1 피드백", instructor: "박실적 코치", startDate: "2026.04.14", duration: "4주 (매일)", members: 7, maxMembers: 10, price: "149,000원", tags: ["콜드콜", "챌린지"] },
];

export default function CoachingPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabType>("one_on_one");

  return (
    <div>
      {/* 헤더 */}
      <div className="bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <p className="text-[17px] font-bold text-gray-900">코칭받기</p>
        </div>
        <p className="text-[13px] text-gray-500 mt-1">실전 전문가에게 직접 코칭받으세요</p>
      </div>

      {/* 탭 */}
      <div className="bg-white border-b border-gray-100 flex">
        {([
          { key: "one_on_one" as TabType, label: "1:1 코칭" },
          { key: "seminar" as TabType, label: "세미나" },
          { key: "cohort" as TabType, label: "코호트" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 py-2.5 text-[13px] font-medium border-b-2 transition-colors",
              tab === t.key ? "text-gray-900 border-gray-900" : "text-gray-400 border-transparent"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== 1:1 코칭 탭 ===== */}
      {tab === "one_on_one" && (
        <div>
          {/* 안내 배너 */}
          <div className="bg-blue-50 px-5 py-3">
            <p className="text-[12px] text-blue-700">
              실적으로 검증된 Lv.4+ 마스터 코치에게 1:1 피드백을 받아보세요.
            </p>
          </div>

          {DUMMY_COACHES.map((coach) => (
            <div key={coach.id} className="bg-white px-5 py-4 border-b border-gray-50">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarFallback className="text-[13px] font-bold bg-blue-600 text-white">
                    {coach.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-gray-900">{coach.name}</span>
                    <Badge className="bg-blue-100 text-blue-700 text-[10px] h-4 px-1 font-normal">인증</Badge>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-0.5">{coach.industry} · {coach.experience}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-[12px] font-medium text-gray-900">{coach.rating}</span>
                    <span className="text-[11px] text-gray-400">({coach.reviews})</span>
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {coach.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold text-gray-900">{coach.price}</p>
                  {coach.available ? (
                    <Button size="sm" className="mt-2 h-7 text-[11px] bg-blue-600 hover:bg-blue-700 rounded-full px-3">
                      신청하기
                    </Button>
                  ) : (
                    <Badge variant="outline" className="mt-2 text-[10px] text-gray-400">마감</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* 코치 지원 CTA */}
          <div className="bg-white mt-2 px-5 py-4">
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-[13px] font-medium text-gray-700">당신도 코치가 될 수 있습니다</p>
              <p className="text-[11px] text-gray-500 mt-1">Lv.4 마스터 이상이면 코치 지원 가능</p>
              <Button size="sm" variant="outline" className="mt-3 text-[11px] rounded-full">
                코치 지원하기 <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 세미나 탭 ===== */}
      {tab === "seminar" && (
        <div>
          <div className="bg-violet-50 px-5 py-3">
            <p className="text-[12px] text-violet-700">
              현장 전문가의 실전 노하우를 온라인 세미나로 배워보세요.
            </p>
          </div>

          {DUMMY_SEMINARS.map((seminar) => (
            <div key={seminar.id} className="bg-white px-5 py-4 border-b border-gray-50">
              <div className="flex gap-1 mb-2">
                {seminar.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5">{tag}</Badge>
                ))}
              </div>
              <p className="text-[14px] font-bold text-gray-900">{seminar.title}</p>
              <p className="text-[12px] text-gray-500 mt-1">{seminar.speaker}</p>

              <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {seminar.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {seminar.time}</span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-[13px] font-bold text-gray-900">{seminar.price}</span>
                  <span className="text-[11px] text-gray-400 ml-2">
                    잔여 {seminar.maxSpots - seminar.spots}석
                  </span>
                </div>
                <Button size="sm" className="h-8 text-[12px] bg-violet-600 hover:bg-violet-700 rounded-full px-4">
                  신청하기
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== 코호트 탭 ===== */}
      {tab === "cohort" && (
        <div>
          <div className="bg-emerald-50 px-5 py-3">
            <p className="text-[12px] text-emerald-700">
              소그룹으로 함께 성장하세요. 매주 콜리뷰 + 그룹 피드백 + 실전 과제.
            </p>
          </div>

          {DUMMY_COHORTS.map((cohort) => (
            <div key={cohort.id} className="bg-white px-5 py-4 border-b border-gray-50">
              <div className="flex gap-1 mb-2">
                {cohort.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5">{tag}</Badge>
                ))}
              </div>
              <p className="text-[14px] font-bold text-gray-900">{cohort.title}</p>
              <p className="text-[12px] text-gray-600 mt-1">{cohort.description}</p>
              <p className="text-[12px] text-gray-500 mt-1">{cohort.instructor}</p>

              <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {cohort.startDate} 시작</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cohort.duration}</span>
              </div>

              {/* 인원 바 */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Users className="h-3 w-3" /> {cohort.members}/{cohort.maxMembers}명
                  </span>
                  <span className={cn(
                    "font-medium",
                    cohort.members >= cohort.maxMembers ? "text-red-500" : "text-emerald-600"
                  )}>
                    {cohort.maxMembers - cohort.members}자리 남음
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${(cohort.members / cohort.maxMembers) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-[13px] font-bold text-gray-900">{cohort.price}</span>
                <Button
                  size="sm"
                  className="h-8 text-[12px] bg-emerald-600 hover:bg-emerald-700 rounded-full px-4"
                  disabled={cohort.members >= cohort.maxMembers}
                >
                  {cohort.members >= cohort.maxMembers ? "마감" : "참여하기"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 비로그인 시 로그인 유도 */}
      {!authLoading && !user && (
        <div className="bg-white mt-2 px-5 py-6 text-center">
          <LogIn className="h-8 w-8 mx-auto text-gray-300 mb-3" />
          <p className="text-[13px] font-medium text-gray-700">로그인하고 코칭을 신청하세요</p>
          <Link href="/login">
            <Button size="sm" className="mt-3 rounded-full bg-blue-600 text-[12px] px-5">
              로그인하기
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
