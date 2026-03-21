"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, ThumbsUp, MessageCircle, Bot } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants";
import type { Post, PostCategory } from "@/types";

// MVP 더미 데이터
const DUMMY_POSTS: (Post & { author: NonNullable<Post["author"]> })[] = [
  {
    id: "1",
    user_id: "u1",
    category: "knowhow",
    title: "보험 영업 첫 달, 콜드콜 100통의 교훈",
    content:
      "처음 한 달 동안 매일 20통씩 콜드콜을 했습니다. 처음엔 거절이 두려웠지만...",
    action_type: "cheat",
    action_points: 15,
    likes_count: 24,
    comments_count: 8,
    is_verified_only: false,
    created_at: "2026-03-20T09:00:00Z",
    author: {
      nickname: "보험왕김대리",
      profile_image: null,
      auth_level: 2,
      level: 3,
    },
  },
  {
    id: "2",
    user_id: "u2",
    category: "success",
    title: "B2B SaaS 영업 3년차, 연봉 2배 올린 비결",
    content: "스타트업에서 엔터프라이즈로 타겟을 바꾸면서 모든 게 달라졌습니다...",
    action_type: "success",
    action_points: 20,
    likes_count: 42,
    comments_count: 15,
    is_verified_only: false,
    created_at: "2026-03-19T14:00:00Z",
    author: {
      nickname: "SaaS마스터",
      profile_image: null,
      auth_level: 2,
      level: 4,
    },
  },
  {
    id: "3",
    user_id: "u3",
    category: "qna",
    title: "부동산 영업 시작하려는데 어떤 준비가 필요할까요?",
    content: "현재 직장을 그만두고 부동산 영업으로 전환하려고 합니다...",
    action_type: null,
    action_points: 0,
    likes_count: 5,
    comments_count: 12,
    is_verified_only: false,
    created_at: "2026-03-18T20:00:00Z",
    author: {
      nickname: "전직희망자",
      profile_image: null,
      auth_level: 1,
      level: 1,
    },
  },
];

export default function CommunityPage() {
  const [category, setCategory] = useState<"all" | PostCategory>("all");
  const [sort, setSort] = useState<"latest" | "popular">("latest");

  const filtered =
    category === "all"
      ? DUMMY_POSTS
      : DUMMY_POSTS.filter((p) => p.category === category);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "popular") return b.likes_count - a.likes_count;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-4">
      {/* 카테고리 탭 */}
      <div className="overflow-x-auto px-4 pt-4">
        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as typeof category)}
        >
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="all">전체</TabsTrigger>
            {POST_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 정렬 */}
      <div className="flex items-center gap-2 px-4">
        <Button
          variant={sort === "latest" ? "default" : "outline"}
          size="sm"
          onClick={() => setSort("latest")}
        >
          최신
        </Button>
        <Button
          variant={sort === "popular" ? "default" : "outline"}
          size="sm"
          onClick={() => setSort("popular")}
        >
          인기
        </Button>
      </div>

      {/* 게시글 리스트 */}
      <div className="space-y-2 px-4 pb-4">
        {sorted.map((post) => (
          <Link key={post.id} href={`/community/${post.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {
                      POST_CATEGORIES.find((c) => c.value === post.category)
                        ?.label
                    }
                  </Badge>
                  {post.author.auth_level === 2 && (
                    <Badge className="bg-[#2E75B6] text-white text-xs">
                      인증
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>{post.author.nickname}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />{" "}
                      {post.comments_count}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 글쓰기 FAB */}
      <Link
        href="/community/write"
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#2E75B6] text-white shadow-lg hover:bg-[#1B3A5C] transition-colors"
      >
        <PenSquare className="h-6 w-6" />
      </Link>
    </div>
  );
}
