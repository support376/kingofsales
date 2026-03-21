"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenSquare, ThumbsUp, MessageCircle, LogIn } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
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
  users?: { nickname: string; auth_level: number; level: number };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
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

  const isGuest = !authLoading && !user;
  const canWrite = user && user.auth_level >= 1;

  return (
    <div>
      {/* 비로그인 배너 */}
      {isGuest && (
        <div className="bg-blue-50 px-5 py-3 flex items-center justify-between">
          <p className="text-[12px] text-blue-700">로그인하고 커뮤니티에 참여하세요</p>
          <Link href="/login">
            <Button size="sm" className="h-7 text-[11px] bg-blue-600 rounded-full px-3">
              로그인
            </Button>
          </Link>
        </div>
      )}

      {/* 카테고리 탭 - 블라인드 스타일 */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex px-4 gap-0.5">
          {[{ value: "all" as const, label: "전체" }, ...POST_CATEGORIES].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value as typeof category)}
              className={cn(
                "shrink-0 px-3 py-2.5 text-[13px] font-medium border-b-2 transition-colors",
                category === cat.value
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 */}
      <div className="bg-white px-4 py-2 flex items-center gap-3 border-b border-gray-50">
        {(["latest", "popular"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={cn(
              "text-[12px] font-medium",
              sort === s ? "text-gray-900" : "text-gray-400"
            )}
          >
            {s === "latest" ? "최신순" : "인기순"}
          </button>
        ))}
      </div>

      {/* 피드 */}
      <div>
        {loading ? (
          <div className="py-16 text-center text-[13px] text-gray-400">
            불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white py-16 text-center">
            <p className="text-[13px] text-gray-400">아직 게시글이 없습니다</p>
            {canWrite && (
              <Link href="/community/write">
                <Button size="sm" className="mt-3 rounded-full bg-blue-600 text-[12px]">
                  첫 글 작성하기
                </Button>
              </Link>
            )}
          </div>
        ) : (
          posts
            .filter((post) => {
              if (post.is_verified_only && (!user || user.auth_level < 2)) return false;
              return true;
            })
            .map((post) => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <article className="bg-white px-5 py-4 border-b border-gray-50 active:bg-gray-50 transition-colors">
                  {/* 상단: 카테고리 + 작성자 */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[11px] font-medium text-blue-600">
                      {POST_CATEGORIES.find((c) => c.value === post.category)?.label}
                    </span>
                    {post.is_verified_only && (
                      <Badge className="bg-amber-100 text-amber-700 text-[10px] h-4 px-1 font-normal">
                        인증전용
                      </Badge>
                    )}
                    <span className="text-[11px] text-gray-300">·</span>
                    <span className="text-[11px] text-gray-400">
                      {post.users?.nickname || "익명"}
                    </span>
                    {post.users?.auth_level === 2 && (
                      <Badge className="bg-blue-100 text-blue-700 text-[10px] h-4 px-1 font-normal">
                        인증
                      </Badge>
                    )}
                  </div>

                  {/* 제목 */}
                  <h3 className="text-[14px] font-semibold text-gray-900 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* 본문 미리보기 */}
                  <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>

                  {/* 하단: 좋아요 + 댓글 + 시간 */}
                  <div className="flex items-center gap-3 mt-2.5 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> {post.comments_count}
                    </span>
                    <span>{timeAgo(post.created_at)}</span>
                  </div>
                </article>
              </Link>
            ))
        )}
      </div>

      {/* FAB */}
      {canWrite && (
        <Link
          href="/community/write"
          className="fixed bottom-[72px] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg active:bg-blue-700 transition-colors"
        >
          <PenSquare className="h-5 w-5" />
        </Link>
      )}
    </div>
  );
}
