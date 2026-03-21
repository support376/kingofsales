import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Trophy, MessageSquare, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* 히어로 */}
      <section className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[#1B3A5C]">
          당신의 영업 역량을
          <br />
          진단해보세요
        </h1>
        <p className="text-sm text-muted-foreground">
          3분 진단으로 나의 세일즈 역량을 확인하고
          <br />
          업계 상위 몇 %인지 알아보세요
        </p>
        <Link href="/diagnosis">
          <Button
            size="lg"
            className="mt-2 bg-[#2E75B6] hover:bg-[#1B3A5C] text-white"
          >
            무료 진단 시작하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* 퀵 메뉴 */}
      <section className="grid grid-cols-3 gap-3">
        <Link href="/ai-bot">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <Bot className="h-8 w-8 text-[#2E75B6]" />
              <span className="text-xs font-medium">AI 세일즈 봇</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/leaderboard">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <Trophy className="h-8 w-8 text-[#2E75B6]" />
              <span className="text-xs font-medium">리더보드</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/community">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <MessageSquare className="h-8 w-8 text-[#2E75B6]" />
              <span className="text-xs font-medium">커뮤니티</span>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* 인기 게시글 미리보기 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">인기 게시글</h2>
          <Link
            href="/community"
            className="text-sm text-[#2E75B6] hover:underline"
          >
            더보기
          </Link>
        </div>
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
