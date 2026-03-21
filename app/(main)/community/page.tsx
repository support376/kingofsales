"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, ThumbsUp, MessageCircle, LogIn } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import type { PostCategory } from "@/types";

interface PostItem {
  id: string;
  category: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  is_verified_only: boolean;
  created_at: string;
  users?: { nickname: string; profile_image: string | null; auth_level: number; level: number };
}

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const [category, setCategory] = useState<"all" | PostCategory>("all");
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    params.set("sort", sort);

    fetch(`/api/posts?${params}`)
      .then((r) => r.json())
      .then((res) => {
        setPosts(res.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, sort]);

  // 비로그인: 읽기 전용 안내
  const isGuest = !authLoading && !user;
  const canWrite = user && user.auth_level >= 1;

  return (
    <div className="space-y-4">
      {/* 비로그인 안내 */}
      {isGuest && (
        <div className="mx-4 mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
          <p className="text-sm text-amber-800">
            커뮤니티 글쓰기는 로그인 후 이용 가능합니다.
          </p>
          <Link href="/login">
            <Button size="sm" className="mt-2 gap-1 bg-[#2E75B6]">
              <LogIn className="h-3 w-3" /> 로그인
            </Button>
          </Link>
        </div>
      )}

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
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
            </CardContent>
          </Card>
        ) : (
          posts
            .filter((post) => {
              // Lv.2 미만은 인증전용 게시글 안 보임
              if (post.is_verified_only && (!user || user.auth_level < 2)) return false;
              return true;
            })
            .map((post) => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {POST_CATEGORIES.find((c) => c.value === post.category)?.label}
                      </Badge>
                      {post.is_verified_only && (
                        <Badge className="bg-amber-500 text-white text-xs">인증전용</Badge>
                      )}
                      {post.users?.auth_level === 2 && (
                        <Badge className="bg-[#2E75B6] text-white text-xs">인증</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>{post.users?.nickname || "익명"}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" /> {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> {post.comments_count}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
        )}
      </div>

      {/* 글쓰기 FAB - Lv.1 이상만 */}
      {canWrite && (
        <Link
          href="/community/write"
          className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#2E75B6] text-white shadow-lg hover:bg-[#1B3A5C] transition-colors"
        >
          <PenSquare className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
}
