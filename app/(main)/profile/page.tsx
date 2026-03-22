"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, Shield, FileCheck, ChevronRight, LogOut, LogIn, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";
import { LEVELS, INDUSTRIES, EXPERIENCE_RANGES } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import {
  getAllStats,
  getGroupStats,
  calculatePercentile,
  incomeRangeToSalary,
} from "@/lib/market-data";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const userSalary = user ? incomeRangeToSalary(user.income_range) : 4000;
  const allStats = useMemo(() => getAllStats(), []);
  const myGroupStats = user ? getGroupStats(user.industry) : null;
  const myPercentile = user ? calculatePercentile(user.industry, userSalary) : 50;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 px-5">
        <LogIn className="h-10 w-10 text-gray-300" />
        <p className="text-[15px] font-bold text-gray-900">로그인이 필요합니다</p>
        <p className="text-[13px] text-gray-500 text-center">프로필을 확인하려면 먼저 로그인해주세요.</p>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] rounded-full px-6">로그인하기</Button>
        </Link>
      </div>
    );
  }

  const levelInfo = LEVELS.find((l) => l.level === user.level);
  const nextLevel = LEVELS.find((l) => l.level === user.level + 1);
  const industryLabel = INDUSTRIES.find((i) => i.value === user.industry)?.label || user.industry;
  const expLabel = EXPERIENCE_RANGES.find((e) => e.value === user.experience_years)?.label || user.experience_years;

  const handleLogout = async () => { await logout(); router.push("/"); };

  return (
    <div>
      {/* 프로필 헤더 */}
      <div className="bg-white px-5 py-5 flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-[15px] font-bold bg-blue-600 text-white">{user.nickname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-gray-900">{user.nickname}</span>
            {user.auth_level >= 2 && (
              <Badge className="bg-blue-100 text-blue-700 text-[10px] h-4 px-1 font-normal">인증</Badge>
            )}
          </div>
          <p className="text-[13px] text-gray-500">{user.bio}</p>
          <p className="text-[11px] text-gray-400">{industryLabel} · {expLabel}</p>
        </div>
      </div>

      {/* 레벨 & 포인트 */}
      <div className="bg-white mt-2 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400">레벨</p>
            <p className="text-[15px] font-bold text-gray-900">Lv.{user.level} {levelInfo?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400">포인트</p>
            <p className="text-[15px] font-bold text-blue-600">{user.points}점</p>
          </div>
        </div>
        {nextLevel && (
          <p className="text-[11px] text-gray-400 mt-2">
            다음 레벨까지 <span className="font-medium text-gray-700">{nextLevel.minPoints - user.points}점</span> 남음
          </p>
        )}
      </div>

      {/* 내 위치 (리더보드) */}
      <div className="bg-white mt-2 px-5 py-4">
        <div className="flex items-center gap-1.5 mb-3">
          <Trophy className="h-4 w-4 text-blue-600" />
          <p className="text-[13px] font-bold text-gray-900">내 위치</p>
        </div>

        {/* 내 업종 내 위치 */}
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-4">
          <p className="text-[11px] text-blue-200">{industryLabel} 영업직 중</p>
          <div className="flex items-end justify-between mt-1">
            <div>
              <p className="text-[28px] font-bold text-white">상위 {myPercentile}%</p>
              <p className="text-[11px] text-blue-200 mt-0.5">내 연봉 {userSalary.toLocaleString()}만원</p>
            </div>
            <div className="flex items-center gap-1 text-green-300 text-[12px] font-medium">
              <TrendingUp className="h-3.5 w-3.5" /> +3%
            </div>
          </div>
        </div>

        {/* 업계 평균 비교 */}
        <div className="mt-3 space-y-2">
          {[
            { label: "내 연봉", value: `${userSalary.toLocaleString()}만원`, highlight: true },
            { label: `${industryLabel} 평균`, value: `${myGroupStats?.avg?.toLocaleString() || "-"}만원`, highlight: false },
            { label: `${industryLabel} 상위 10%`, value: `${myGroupStats?.topPct?.toLocaleString() || "-"}만원`, highlight: false },
            { label: "전체 영업직 평균", value: `${allStats.avg.toLocaleString()}만원`, highlight: false },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-[12px] text-gray-500">{row.label}</span>
              <span className={`text-[12px] font-medium ${row.highlight ? "text-blue-600 font-bold" : "text-gray-900"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <Link href="/leaderboard" className="flex items-center justify-center gap-1 mt-3 text-[12px] text-blue-600 font-medium">
          상세 보기 <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* 활동 통계 */}
      <div className="bg-white mt-2 px-5 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "작성 글", value: 0 },
            { label: "받은 따봉", value: user.likes_received },
            { label: "콜 분석", value: 0 },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-[17px] font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 메뉴 */}
      <div className="bg-white mt-2">
        {user.auth_level < 2 && (
          <Link href="/verify" className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50">
            <FileCheck className="h-5 w-5 text-blue-600" />
            <span className="flex-1 text-[13px] font-medium text-gray-900">인증하기</span>
            <Badge className="bg-amber-100 text-amber-700 text-[10px] h-4 px-1 font-normal">미인증</Badge>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Link>
        )}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50">
          <Settings className="h-5 w-5 text-gray-400" />
          <span className="flex-1 text-[13px] text-gray-700">설정</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </div>
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50">
          <Shield className="h-5 w-5 text-gray-400" />
          <span className="flex-1 text-[13px] text-gray-700">개인정보처리방침</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </div>
      </div>

      <div className="bg-white mt-2 px-5 py-3">
        <button onClick={handleLogout} className="flex items-center gap-2 text-[13px] text-red-500">
          <LogOut className="h-4 w-4" /> 로그아웃
        </button>
      </div>
    </div>
  );
}
