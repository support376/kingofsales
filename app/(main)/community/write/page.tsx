"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { POST_CATEGORIES } from "@/lib/constants";
import type { PostCategory } from "@/types";

export default function WritePage() {
  const router = useRouter();
  const [category, setCategory] = useState<PostCategory | "">("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = category && title.trim() && content.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);

    // TODO: API 연동
    // MVP에서는 바로 커뮤니티로 이동
    setTimeout(() => {
      router.push("/community");
    }, 500);
  };

  return (
    <div className="space-y-6 px-4 py-4">
      <Link href="/community" className="flex items-center gap-1 text-sm">
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </Link>

      <h1 className="text-lg font-bold">글쓰기</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>카테고리</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as PostCategory)}
          >
            <SelectTrigger>
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {POST_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>제목</Label>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label>본문</Label>
          <Textarea
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          글을 작성하면 AI가 세일즈 관점에서 자동 피드백을 제공합니다.
        </p>

        <Button
          className="w-full bg-[#2E75B6] hover:bg-[#1B3A5C] text-white"
          size="lg"
          disabled={!canSubmit || loading}
          onClick={handleSubmit}
        >
          {loading ? "작성 중..." : "작성 완료"}
        </Button>
      </div>
    </div>
  );
}
