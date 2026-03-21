"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, LogIn } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import type { PostCategory } from "@/types";

export default function WritePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [category, setCategory] = useState<PostCategory | "">("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authLoading && (!user || user.auth_level < 1)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 px-5">
        <LogIn className="h-10 w-10 text-gray-300" />
        <p className="text-[15px] font-bold text-gray-900">로그인이 필요합니다</p>
        <p className="text-[13px] text-gray-500 text-center">글쓰기는 회원만 이용 가능합니다.</p>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] rounded-full px-6">로그인하기</Button>
        </Link>
      </div>
    );
  }

  const canSubmit = category && title.trim() && content.trim();

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
    setLoading(true);
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, category, title, content }),
      });
      router.push("/community");
    } catch { setLoading(false); }
  };

  return (
    <div>
      <div className="bg-white px-5 py-3 border-b border-gray-50">
        <Link href="/community" className="flex items-center gap-1 text-[13px] text-gray-500">
          <ArrowLeft className="h-4 w-4" /> 돌아가기
        </Link>
      </div>

      <div className="bg-white px-5 py-4 space-y-4">
        <p className="text-[15px] font-bold text-gray-900">글쓰기</p>

        <div className="space-y-1.5">
          <Label className="text-[12px] text-gray-500">카테고리</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as PostCategory)}>
            <SelectTrigger className="text-[13px]">
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {POST_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-[13px]">{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[12px] text-gray-500">제목</Label>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="text-[13px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[12px] text-gray-500">본문</Label>
          <Textarea
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] text-[13px]"
          />
        </div>

        <p className="text-[11px] text-gray-400">
          글을 작성하면 AI가 세일즈 관점에서 자동 피드백을 제공합니다.
        </p>

        <Button
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px]"
          disabled={!canSubmit || loading}
          onClick={handleSubmit}
        >
          {loading ? "작성 중..." : "작성 완료"}
        </Button>
      </div>
    </div>
  );
}
