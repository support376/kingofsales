"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Shield,
  FileCheck,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { LEVELS } from "@/lib/constants";

// MVP 더미 유저
const DUMMY_USER = {
  nickname: "영업신입07",
  industry: "보험",
  experience: "1~3년",
  income: "3천~5천만원",
  auth_level: 1 as const,
  level: 2,
  points: 120,
  likes_received: 15,
  bio: "보험 영업 2년차, 매일 성장 중!",
};

export default function ProfilePage() {
  const levelInfo = LEVELS.find((l) => l.level === DUMMY_USER.level);
  const nextLevel = LEVELS.find((l) => l.level === DUMMY_USER.level + 1);

  return (
    <div className="space-y-4 px-4 py-4">
      {/* 프로필 헤더 */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-[#2E75B6] text-white">
              {DUMMY_USER.nickname[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{DUMMY_USER.nickname}</h2>
              {DUMMY_USER.auth_level >= 2 && (
                <Badge className="bg-[#2E75B6] text-white text-xs">인증</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{DUMMY_USER.bio}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{DUMMY_USER.industry}</span>
              <span>·</span>
              <span>{DUMMY_USER.experience}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 레벨 & 포인트 */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">레벨</p>
              <p className="font-bold">
                Lv.{DUMMY_USER.level} {levelInfo?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">포인트</p>
              <p className="font-bold text-[#2E75B6]">
                {DUMMY_USER.points}점
              </p>
            </div>
          </div>
          {nextLevel && (
            <div className="text-xs text-muted-foreground">
              다음 레벨까지{" "}
              <span className="font-medium text-foreground">
                {nextLevel.minPoints - DUMMY_USER.points}점
              </span>{" "}
              남음
            </div>
          )}
        </CardContent>
      </Card>

      {/* 활동 통계 */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">작성 글</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{DUMMY_USER.likes_received}</p>
            <p className="text-xs text-muted-foreground">받은 따봉</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">AI 분석</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* 메뉴 */}
      <div className="space-y-1">
        {DUMMY_USER.auth_level < 2 && (
          <Link href="/verify">
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-3 flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-[#2E75B6]" />
                <span className="flex-1 text-sm font-medium">인증하기</span>
                <Badge variant="outline" className="text-xs text-amber-600">
                  미인증
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        )}

        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm">설정</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm">개인정보처리방침</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 mt-4">
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
