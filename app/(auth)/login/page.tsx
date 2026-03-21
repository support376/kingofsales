"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    setLoading(true);
    await login();
    router.push("/");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background">
      <div className="px-4 pt-4">
        <Link href="/" className="flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 space-y-6">
        {/* 로고 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#1B3A5C]">영업왕</h1>
          <p className="text-sm text-muted-foreground">
            세일즈 전문 커뮤니티에 합류하세요
          </p>
        </div>

        {/* 카카오 로그인 (추후 연동) */}
        <Button
          className="w-full h-12 bg-[#FEE500] text-[#191919] hover:bg-[#FDD835] font-medium text-base"
          disabled={loading}
          onClick={handleDemoLogin}
        >
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.67 1.74 5.01 4.37 6.35-.19.72-.69 2.6-.79 3-.12.48.18.47.37.34.15-.1 2.37-1.61 3.33-2.27.56.08 1.13.13 1.72.13 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" />
          </svg>
          {loading ? "로그인 중..." : "카카오로 시작하기"}
        </Button>

        {/* 데모 안내 */}
        <p className="text-xs text-center text-muted-foreground bg-amber-50 rounded-lg p-3">
          현재 데모 모드입니다. 클릭하면 테스트 계정으로 바로 로그인됩니다.
          <br />
          카카오 연동은 추후 적용 예정입니다.
        </p>

        {/* 안내 */}
        <p className="text-xs text-center text-muted-foreground">
          가입 시{" "}
          <Link href="#" className="underline">
            이용약관
          </Link>
          과{" "}
          <Link href="#" className="underline">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
