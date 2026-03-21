"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!nickname.trim() || !phone.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, phone, bio }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "가입에 실패했습니다.");
        setLoading(false);
        return;
      }

      // 세션 갱신 후 홈으로
      await refresh();
      router.push("/");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold">프로필 작성</h1>
        <p className="text-sm text-muted-foreground">
          커뮤니티에서 사용할 프로필을 설정해주세요
        </p>
      </div>

      {/* 진단 데이터 자동 반영 안내 */}
      <Card className="bg-blue-50 border-[#2E75B6]/20">
        <CardContent className="p-3 text-xs text-[#1B3A5C]">
          진단에서 입력한 업종/경력/연봉대 정보가 자동으로 반영됩니다.
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 text-xs text-red-700">{error}</CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {/* 휴대폰 */}
        <div className="space-y-2">
          <Label>휴대폰 번호 *</Label>
          <Input
            placeholder="01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
          />
        </div>

        {/* 닉네임 */}
        <div className="space-y-2">
          <Label>닉네임 *</Label>
          <Input
            placeholder="커뮤니티 활동명 (2~20자)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
          />
        </div>

        {/* 한줄 소개 */}
        <div className="space-y-2">
          <Label>
            한줄 소개 <Badge variant="outline" className="text-xs">선택</Badge>
          </Label>
          <Textarea
            placeholder="간단한 자기소개를 작성해주세요"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={100}
            className="h-20"
          />
        </div>

        <p className="text-xs text-amber-600">
          입력하신 정보는 자기신고 기반이며, 허위 입력 시 추후 인증 요청에
          불이익이 있을 수 있습니다.
        </p>

        <Button
          className="w-full bg-[#2E75B6] hover:bg-[#1B3A5C] text-white"
          size="lg"
          disabled={!nickname.trim() || !phone.trim() || loading}
          onClick={handleSubmit}
        >
          {loading ? "가입 중..." : "가입 완료"}
        </Button>
      </div>
    </div>
  );
}
