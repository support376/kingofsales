"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      if (!res.ok) { setError(data.error || "가입에 실패했습니다."); setLoading(false); return; }
      await refresh();
      router.push("/");
    } catch { setError("네트워크 오류가 발생했습니다."); setLoading(false); }
  };

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-white">
      <div className="px-5 py-5 space-y-1">
        <p className="text-[17px] font-bold text-gray-900">프로필 작성</p>
        <p className="text-[13px] text-gray-500">커뮤니티에서 사용할 프로필을 설정해주세요</p>
      </div>

      <div className="bg-blue-50 mx-5 rounded-lg p-3 mb-4">
        <p className="text-[11px] text-blue-700">진단에서 입력한 업종/경력/연봉대 정보가 자동으로 반영됩니다.</p>
      </div>

      {error && (
        <div className="bg-red-50 mx-5 rounded-lg p-3 mb-4">
          <p className="text-[11px] text-red-700">{error}</p>
        </div>
      )}

      <div className="px-5 space-y-4 pb-8">
        <div className="space-y-1.5">
          <Label className="text-[12px] text-gray-500">휴대폰 번호 *</Label>
          <Input placeholder="01012345678" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="text-[13px]" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[12px] text-gray-500">닉네임 *</Label>
          <Input placeholder="커뮤니티 활동명 (2~20자)" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={20} className="text-[13px]" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[12px] text-gray-500">한줄 소개 <Badge variant="outline" className="text-[10px] ml-1">선택</Badge></Label>
          <Textarea placeholder="간단한 자기소개를 작성해주세요" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={100} className="h-20 text-[13px]" />
        </div>

        <p className="text-[11px] text-amber-600">
          입력하신 정보는 자기신고 기반이며, 허위 입력 시 추후 인증 요청에 불이익이 있을 수 있습니다.
        </p>

        <Button
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px]"
          disabled={!nickname.trim() || !phone.trim() || loading}
          onClick={handleSubmit}
        >
          {loading ? "가입 중..." : "가입 완료"}
        </Button>
      </div>
    </div>
  );
}
