import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, GraduationCap, MessageSquare, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-2">
      {/* 히어로 배너 */}
      <div className="bg-white px-5 py-6">
        <p className="text-[13px] text-gray-500 mb-1">세일즈 역량 진단</p>
        <h1 className="text-[20px] font-bold text-gray-900 leading-snug">
          나는 업계 상위 몇 %일까?
        </h1>
        <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
          3분이면 끝. 업종·경력 기반 역량 진단
        </p>
        <Link href="/diagnosis">
          <Button
            size="sm"
            className="mt-3 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium px-5"
          >
            무료 진단 시작 <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* 퀵 메뉴 */}
      <div className="bg-white px-5 py-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Headphones, label: "코파일럿", href: "/copilot", color: "text-violet-600 bg-violet-50" },
            { icon: GraduationCap, label: "코칭받기", href: "/coaching", color: "text-blue-600 bg-blue-50" },
            { icon: MessageSquare, label: "커뮤니티", href: "/community", color: "text-emerald-600 bg-emerald-50" },
            { icon: Zap, label: "인증하기", href: "/verify", color: "text-amber-600 bg-amber-50" },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 인기 게시글 */}
      <div className="bg-white px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-gray-900">인기 토픽</h2>
          <Link href="/community" className="text-[12px] text-gray-400">
            더보기
          </Link>
        </div>
        <div className="space-y-3">
          {[
            { title: "보험 영업 첫 달, 콜드콜 100통의 교훈", likes: 24, comments: 8 },
            { title: "B2B 영업 3년차, 연봉 2배 올린 비결", likes: 42, comments: 15 },
            { title: "부동산 영업 시작하려는데 어떤 준비가 필요할까요?", likes: 5, comments: 12 },
          ].map((post, i) => (
            <Link key={i} href="/community" className="block">
              <div className="flex items-start gap-3">
                <span className="text-[13px] font-bold text-blue-600 mt-0.5 w-5 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 line-clamp-1">
                    {post.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    좋아요 {post.likes} · 댓글 {post.comments}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 코파일럿 배너 */}
      <Link href="/copilot" className="block">
        <div className="bg-white px-5 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-50 to-blue-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600">
              <Headphones className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-gray-900">AI 코파일럿</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                통화를 업로드하고 AI 분석 + 메모를 남겨보세요
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </Link>
    </div>
  );
}
