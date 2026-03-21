"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ThumbsUp, Bot } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants";
import type { Comment } from "@/types";

const DUMMY_COMMENTS: Comment[] = [
  {
    id: "c1", post_id: "1", user_id: "ai",
    content: "좋은 경험 공유 감사합니다! 콜드콜에서 가장 중요한 것은 첫 10초입니다. 상대방의 관심을 끌 수 있는 핵심 가치 제안을 준비해보세요.",
    is_ai: true, parent_id: null, created_at: "2026-03-20T09:05:00Z",
    author: { nickname: "AI 코치", profile_image: null, auth_level: 2 },
  },
  {
    id: "c2", post_id: "1", user_id: "u4",
    content: "저도 처음에 콜드콜이 제일 힘들었는데, 스크립트를 만들어놓으니 훨씬 나아졌어요!",
    is_ai: false, parent_id: null, created_at: "2026-03-20T10:30:00Z",
    author: { nickname: "영업신입", profile_image: null, auth_level: 1 },
  },
];

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div>
      {/* 뒤로가기 */}
      <div className="bg-white px-5 py-3 border-b border-gray-50">
        <Link href="/community" className="flex items-center gap-1 text-[13px] text-gray-500">
          <ArrowLeft className="h-4 w-4" /> 목록으로
        </Link>
      </div>

      {/* 게시글 */}
      <article className="bg-white px-5 py-4">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[11px] font-medium text-blue-600">노하우 공유</span>
          <Badge className="bg-blue-100 text-blue-700 text-[10px] h-4 px-1 font-normal">인증</Badge>
        </div>
        <h1 className="text-[17px] font-bold text-gray-900 leading-snug">
          보험 영업 첫 달, 콜드콜 100통의 교훈
        </h1>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400">
          <span>보험왕김대리</span>
          <span>·</span>
          <span>Lv.3 실력파</span>
          <span>·</span>
          <span>2026.03.20</span>
        </div>

        <Separator className="my-3" />

        <div className="text-[13px] text-gray-700 leading-relaxed space-y-3">
          <p>처음 한 달 동안 매일 20통씩 콜드콜을 했습니다. 처음엔 거절이 두려웠지만, 100통을 넘기니 패턴이 보이기 시작했습니다.</p>
          <p>제가 발견한 3가지 핵심 교훈:</p>
          <p>1. 첫 10초가 전부다 - 상대방이 전화를 끊지 않게 하려면 첫 10초 안에 가치를 전달해야 합니다.</p>
          <p>2. 거절은 데이터다 - 거절 사유를 기록하면 패턴이 보입니다.</p>
          <p>3. 오후 2~4시가 골든타임 - 이 시간대에 통화 성공률이 가장 높았습니다.</p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button className="flex items-center gap-1.5 text-[12px] text-gray-500 bg-gray-50 rounded-full px-3 py-1.5">
            <ThumbsUp className="h-3.5 w-3.5" /> 따봉 24
          </button>
        </div>
      </article>

      <div className="h-2 bg-gray-50" />

      {/* 댓글 */}
      <div className="bg-white px-5 py-4">
        <p className="text-[13px] font-bold text-gray-900 mb-3">
          댓글 {DUMMY_COMMENTS.length}
        </p>

        <div className="space-y-3">
          {DUMMY_COMMENTS.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-lg p-3 ${comment.is_ai ? "bg-blue-50/60" : "bg-gray-50"}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] mb-1.5">
                <span className="font-medium text-gray-700">{comment.author?.nickname}</span>
                {comment.is_ai && (
                  <Badge className="bg-blue-100 text-blue-700 text-[10px] h-4 px-1 font-normal gap-0.5">
                    <Bot className="h-2.5 w-2.5" /> AI
                  </Badge>
                )}
                <span className="text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString("ko")}
                </span>
              </div>
              <p className="text-[13px] text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>

        {/* 댓글 입력 */}
        <div className="mt-4 space-y-2">
          <Textarea
            placeholder="댓글을 입력하세요..."
            className="min-h-[72px] text-[13px] bg-gray-50 border-gray-200"
          />
          <Button className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-[13px]">
            댓글 작성
          </Button>
        </div>
      </div>
    </div>
  );
}
