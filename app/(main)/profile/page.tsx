"use client";

import { useRouter } from "next/navigation";
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
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { LEVELS, INDUSTRIES, EXPERIENCE_RANGES } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2E75B6] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 px-4">
        <LogIn className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-bold">로그인이 필요합니다</h2>
        <p className="text-sm text-muted-foreground text-center">
          프로필을 확인하려면 먼저 로그인해주세요.
        </p>
        <Link href="/login">
          <Button className="bg-[#2E75B6] hover:bg-[#1B3A5C] text-white">
            로그인하기
          </Button>
        </Link>
      </div>
    );
  }

  const levelInfo = LEVELS.find((l) => l.level === user.level);
  const nextLevel = LEVELS.find((l) => l.level === user.level + 1);
  const industryLabel = INDUSTRIES.find((i) => i.value === user.industry)?.label || user.industry;
  const expLabel = EXPERIENCE_RANGES.find((e) => e.value === user.experience_years)?.label || user.experience_years;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="space-y-4 px-4 py-4">
      {/* 프로필 헤더 */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-[#2E75B6] text-white">
              {user.nickname[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{user.nickname}</h2>
              {user.auth_level >= 2 && (
                <Badge className="bg-[#2E75B6] text-white text-xs">인증</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{industryLabel}</span>
              <span>·</span>
              <span>{expLabel}</span>
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
                Lv.{user.level} {levelInfo?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">포인트</p>
              <p className="font-bold text-[#2E75B6]">{user.points}점</p>
            </div>
          </div>
          {nextLevel && (
            <div className="text-xs text-muted-foreground">
              다음 레벨까지{" "}
              <span className="font-medium text-foreground">
                {nextLevel.minPoints - user.points}점
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
            <p className="text-xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">작성 글</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{user.likes_received}</p>
            <p className="text-xs text-muted-foreground">받은 따봉</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">AI 분석</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* 메뉴 */}
      <div className="space-y-1">
        {user.auth_level < 2 && (
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

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 mt-4"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
}
