"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ThumbsUp, Bot } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants";
import type { Comment } from "@/types";

// MVP 더미 데이터
const DUMMY_COMMENTS: Comment[] = [
  {
    id: "c1",
    post_id: "1",
    user_id: "ai",
    content:
      "좋은 경험 공유 감사합니다! 콜드콜에서 가장 중요한 것은 첫 10초입니다. 상대방의 관심을 끌 수 있는 핵심 가치 제안을 준비해보세요. 거절을 두려워하지 않는 마인드셋도 훌륭합니다.",
    is_ai: true,
    parent_id: null,
    created_at: "2026-03-20T09:05:00Z",
    author: { nickname: "AI 코치", profile_image: null, auth_level: 2 },
  },
  {
    id: "c2",
    post_id: "1",
    user_id: "u4",
    content:
      "저도 처음에 콜드콜이 제일 힘들었는데, 스크립트를 만들어놓으니 훨씬 나아졌어요!",
    is_ai: false,
    parent_id: null,
    created_at: "2026-03-20T10:30:00Z",
    author: { nickname: "영업신입", profile_image: null, auth_level: 1 },
  },
];

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-4 px-4 py-4">
      {/* 뒤로가기 */}
      <Link href="/community" className="flex items-center gap-1 text-sm">
        <ArrowLeft className="h-4 w-4" />
        목록으로
      </Link>

      {/* 게시글 */}
      <article className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">노하우 공유</Badge>
          <Badge className="bg-[#2E75B6] text-white text-xs">인증</Badge>
        </div>
        <h1 className="text-lg font-bold">
          보험 영업 첫 달, 콜드콜 100통의 교훈
        </h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>보험왕김대리</span>
          <span>Lv.3 실력파</span>
          <span>2026.03.20</span>
        </div>
        <Separator />
        <div className="text-sm leading-relaxed">
          <p>
            처음 한 달 동안 매일 20통씩 콜드콜을 했습니다. 처음엔 거절이
            두려웠지만, 100통을 넘기니 패턴이 보이기 시작했습니다.
          </p>
          <br />
          <p>제가 발견한 3가지 핵심 교훈:</p>
          <br />
          <p>
            1. 첫 10초가 전부다 - 상대방이 전화를 끊지 않게 하려면 첫 10초 안에
            가치를 전달해야 합니다.
          </p>
          <p>
            2. 거절은 데이터다 - 거절 사유를 기록하면 패턴이 보입니다. 가격
            때문인지, 타이밍 때문인지, 신뢰 때문인지.
          </p>
          <p>
            3. 오후 2~4시가 골든타임 - 제 경험상 이 시간대에 통화 성공률이 가장
            높았습니다.
          </p>
        </div>

        {/* 따봉 */}
        <div className="flex items-center gap-4 pt-2">
          <Button variant="outline" size="sm" className="gap-1">
            <ThumbsUp className="h-4 w-4" />
            따봉 24
          </Button>
        </div>
      </article>

      <Separator />

      {/* 댓글 */}
      <section className="space-y-4">
        <h3 className="font-semibold text-sm">댓글 {DUMMY_COMMENTS.length}</h3>

        {DUMMY_COMMENTS.map((comment) => (
          <Card
            key={comment.id}
            className={comment.is_ai ? "border-[#2E75B6]/30 bg-blue-50/50" : ""}
          >
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium">
                  {comment.author?.nickname}
                </span>
                {comment.is_ai && (
                  <Badge
                    variant="outline"
                    className="text-[#2E75B6] border-[#2E75B6] gap-1"
                  >
                    <Bot className="h-3 w-3" />
                    AI
                  </Badge>
                )}
                <span className="text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString("ko")}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </CardContent>
          </Card>
        ))}

        {/* 댓글 입력 */}
        <div className="flex gap-2">
          <Textarea
            placeholder="댓글을 입력하세요..."
            className="min-h-[80px] text-sm"
          />
        </div>
        <Button className="w-full bg-[#2E75B6] hover:bg-[#1B3A5C] text-white">
          댓글 작성
        </Button>
      </section>
    </div>
  );
}
