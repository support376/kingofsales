"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TOTAL_SLIDES = 12;

export default function PitchDeckKr() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white flex flex-col select-none"
      onClick={next}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === " ") next();
        if (e.key === "ArrowLeft") prev();
      }}
      tabIndex={0}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
          style={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }}
        />
      </div>

      {/* Slide container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl">

          {/* ===== Slide 0: 타이틀 ===== */}
          {current === 0 && (
            <div className="text-center space-y-8 animate-in fade-in duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                Seed Round · 2026
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                Closr
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                세일즈의 테슬라.<br />
                오늘은 블랙박스를 팔고,<br />
                내일은 자율주행을 켭니다.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-white/40 pt-4">
                <span>AI 세일즈 코파일럿</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>코칭 마켓플레이스</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>세일즈 자율주행</span>
              </div>
            </div>
          )}

          {/* ===== Slide 1: 문제 ===== */}
          {current === 1 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">문제</p>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                전 세계 1억명의 영업사원이<br />매일 전화를 합니다.<br />
                <span className="text-white/30">전화를 끊는 순간, 데이터는 사라집니다.</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                {[
                  { stat: "1억명+", label: "전 세계 영업직 종사자", sub: "보험, 부동산, B2B, 자동차, 제약..." },
                  { stat: "0%", label: "분석되는 통화", sub: "대부분의 영업사원은 피드백을 받지 못합니다" },
                  { stat: "$4.1조", label: "연간 놓치는 매출", sub: "기술 부족과 놓친 시그널로 인한 손실" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <p className="text-3xl font-bold text-violet-400">{item.stat}</p>
                    <p className="text-sm font-medium text-white mt-2">{item.label}</p>
                    <p className="text-xs text-white/40 mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Slide 2: 솔루션 ===== */}
          {current === 2 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">솔루션</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Closr는 모든 세일즈 대화를 캡처하고<br />
                성장으로 바꿉니다.
              </h2>
              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">1</div>
                    <div>
                      <p className="font-semibold">통화 또는 대화 업로드</p>
                      <p className="text-sm text-white/50 mt-1">녹음, 카카오톡, 이메일 — 모든 세일즈 대화</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">2</div>
                    <div>
                      <p className="font-semibold">AI 코파일럿이 분석</p>
                      <p className="text-sm text-white/50 mt-1">클로징 기회, 반론 처리, 대화 비율, 톤 변화 감지</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">3</div>
                    <div>
                      <p className="font-semibold">검증된 전문가에게 코칭</p>
                      <p className="text-sm text-white/50 mt-1">1:1, 세미나, 코호트 — 데이터로 효과가 증명된 코칭</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">72</div>
                  <p className="text-sm text-white/50 mt-2">이번 주 나의 클로징 점수</p>
                  <div className="flex gap-2 mt-4">
                    {["클로징: 60", "톤: 75", "반론: 78"].map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-white/10 text-xs text-white/60">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== Slide 3: 데이터 해자 ===== */}
          {current === 3 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">핵심 경쟁력 — 데이터 해자</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                세상 어디에도 없는 데이터를<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">우리만 모으고 있습니다.</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                  <p className="text-sm font-medium text-white/60">OpenAI / Google이 가진 것:</p>
                  <p className="text-white/80">일반 대화 데이터, 책, 인터넷 텍스트</p>
                  <p className="text-sm font-medium text-red-400 mt-4">가지고 있지 않은 것:</p>
                  <ul className="text-sm text-white/50 space-y-1">
                    <li>✗ 실전 세일즈 통화 녹음 + 성사/실패 결과</li>
                    <li>✗ 대화별 성공/실패 태그</li>
                    <li>✗ 전문 코치의 통화별 피드백</li>
                    <li>✗ 코칭 전후 효과 비교 데이터</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-2xl p-6 border border-violet-500/20 space-y-4">
                  <p className="text-sm font-medium text-violet-400">Closr가 가진 것:</p>
                  <ul className="text-sm text-white/80 space-y-2">
                    <li>✓ 실전 세일즈 대화 (음성 + 텍스트)</li>
                    <li>✓ 딜 결과 태그 (성사 / 실패 / 보류)</li>
                    <li>✓ AI 분석 점수 (대화별)</li>
                    <li>✓ 전문 코치 코멘트 & 피드백</li>
                    <li>✓ 코칭 전후 점수 변화 데이터</li>
                    <li>✓ 다국어, 다업종</li>
                  </ul>
                  <p className="text-xs text-violet-400/60 pt-2">대화가 쌓일수록 AI가 똑똑해집니다. 경쟁자는 이 데이터를 복제할 수 없습니다.</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== Slide 4: 테슬라 비유 ===== */}
          {current === 4 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">로드맵</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                테슬라는 자율주행 전에 카메라부터 달았습니다.<br />
                <span className="text-white/30">우리는 세일즈의 블랙박스를 먼저 팝니다.</span>
              </h2>
              <div className="space-y-4 pt-4">
                {[
                  { phase: "현재", label: "블랙박스 리뷰", desc: "통화 후 AI 분석 + 코칭 마켓플레이스", active: true },
                  { phase: "v1-2", label: "반자율주행", desc: "통화 중 실시간 코칭 — 감정 게이지, 클로징 타이밍 알림", active: false },
                  { phase: "v3+", label: "부분 자동화", desc: "AI가 팔로업 콜, 문자, 간단한 통화를 직접 처리", active: false },
                  { phase: "v4+", label: "완전 자율주행", desc: "AI가 자율적으로 세일즈. 내 목소리, 내 스타일, 24/7", active: false },
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-6 rounded-2xl p-6 border transition-all",
                    item.active ? "bg-gradient-to-r from-violet-500/20 to-violet-600/10 border-violet-500/30" : "bg-white/[0.02] border-white/5"
                  )}>
                    <div className={cn("text-sm font-bold w-16 shrink-0", item.active ? "text-violet-400" : "text-white/30")}>{item.phase}</div>
                    <div>
                      <p className={cn("font-semibold", item.active ? "text-white" : "text-white/50")}>{item.label}</p>
                      <p className={cn("text-sm mt-0.5", item.active ? "text-white/70" : "text-white/30")}>{item.desc}</p>
                    </div>
                    {item.active && <span className="ml-auto text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300">현재 단계</span>}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/30 text-center pt-4">
                각 단계마다 매출이 나고, 데이터가 쌓이고, 다음 단계가 가능해집니다.
              </p>
            </div>
          )}

          {/* ===== Slide 5: 시장 ===== */}
          {current === 5 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">시장 기회</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                TAM $200B+ (약 270조원)
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { tam: "$5B", label: "세일즈 코칭", desc: "시작점. 코칭 마켓플레이스 + AI 코파일럿.", tag: "현재" },
                  { tam: "$30B", label: "세일즈 자동화", desc: "AI 세일즈 봇 마켓플레이스. 기업이 봇을 고용하는 시대.", tag: "3~4년 후" },
                  { tam: "$170B+", label: "CRM 대체", desc: "대화에서 자동 생성되는 CRM. Salesforce 킬러.", tag: "5년+" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col">
                    <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 w-fit">{item.tag}</span>
                    <p className="text-4xl font-bold text-white mt-4">{item.tam}</p>
                    <p className="text-sm font-medium text-white mt-2">{item.label}</p>
                    <p className="text-xs text-white/40 mt-2 flex-1">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-white/30 text-sm">
                Salesforce 시가총액: 300조원. 우리는 AI 네이티브 대체제를 만들고 있습니다.
              </p>
            </div>
          )}

          {/* ===== Slide 6: 비즈니스 모델 ===== */}
          {current === 6 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">비즈니스 모델</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                도구는 무료입니다.<br />
                <span className="text-white/30">돈은 사람과 AI에서 법니다.</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-sm text-white/60 font-medium">수익원</p>
                  {[
                    { source: "코호트 교육", rate: "20-25%", example: "4주 부트캠프, 10명 × 25만원", primary: true },
                    { source: "1:1 코칭", rate: "20%", example: "회당 3만~10만원", primary: true },
                    { source: "세미나", rate: "20%", example: "온라인 웨비나, 1.5만~4만원/석", primary: false },
                    { source: "인플루언서 구독", rate: "20%", example: "월 9,900원/팔로워", primary: false },
                    { source: "기업 교육 (B2B)", rate: "연간 라이선스", example: "팀 코칭 대시보드", primary: false },
                  ].map((item, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between rounded-xl p-4 border",
                      item.primary ? "bg-violet-500/10 border-violet-500/20" : "bg-white/[0.02] border-white/5"
                    )}>
                      <div>
                        <p className="text-sm font-medium">{item.source}</p>
                        <p className="text-xs text-white/40 mt-0.5">{item.example}</p>
                      </div>
                      <span className="text-sm font-bold text-violet-400">{item.rate}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <p className="text-sm text-white/60 font-medium mb-6">왜 SaaS가 아닌가?</p>
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                      <span className="text-red-400">✗</span>
                      <p className="text-white/60">AI 비용 → 3년 내 0원 수렴. SaaS 가격 기반 붕괴.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-red-400">✗</span>
                      <p className="text-white/60">경쟁자가 같은 도구를 무료로 제공하면 끝.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-400">✓</span>
                      <p className="text-white/80">사람은 무료가 될 수 없음. 코칭은 사람이 하는 것.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-400">✓</span>
                      <p className="text-white/80">플랫폼 수수료는 GMV에 비례. 유저 수가 아니라 거래액.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-400">✓</span>
                      <p className="text-white/80">코치가 떠날 수 없음 — 데이터, 리뷰, 팔로워가 여기 있으니까.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== Slide 7: 비밀 무기 ===== */}
          {current === 7 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">핵심 차별화</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                데이터로 증명되는 코칭.<br />
                <span className="text-white/30">다른 어디에서도 불가능합니다.</span>
              </h2>
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10 max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-lg font-bold">김</div>
                  <div>
                    <p className="font-semibold">김성과 코치 · 보험 · 12년차</p>
                    <p className="text-sm text-white/50">리뷰 48건 · ⭐ 4.9</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">+23</p>
                    <p className="text-xs text-white/40 mt-1">평균 점수 상승</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-violet-400">89%</p>
                    <p className="text-xs text-white/40 mt-1">수강생 향상률</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">4.2배</p>
                    <p className="text-xs text-white/40 mt-1">코칭비 대비 ROI</p>
                  </div>
                </div>
                <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
                  <p className="text-xs text-violet-400 font-medium mb-2">Closr AI 검증</p>
                  <p className="text-sm text-white/70">
                    &quot;김성과 코치 4회 수강 후, 클로징 점수 52 → 78로 상승.
                    반론 처리 능력 31점 향상.&quot;
                  </p>
                  <p className="text-xs text-white/30 mt-2">— 자동 점수 비교, 자기 보고가 아닌 데이터 기반</p>
                </div>
              </div>
              <p className="text-center text-sm text-white/30">
                다른 모든 코칭 플랫폼은 후기에 의존합니다. 우리에겐 데이터가 있습니다.
              </p>
            </div>
          )}

          {/* ===== Slide 8: 엔드게임 ===== */}
          {current === 8 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">엔드게임</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                AI 봇이 세일즈하는 세계.<br />
                봇을 고용하는 마켓플레이스.
              </h2>
              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  {[
                    { icon: "🤖", title: "AI 세일즈 봇", desc: "탑 세일즈맨의 실제 통화 데이터로 학습. 내 목소리, 내 스타일로 24시간 영업." },
                    { icon: "📊", title: "봇 리더보드", desc: "봇끼리 성사율 경쟁. 기업은 성적 좋은 봇을 골라 고용." },
                    { icon: "💬", title: "구별 불가능한 채팅 봇", desc: "카카오톡, 문자, 이메일을 AI가 응대. 고객은 사람인지 모름." },
                    { icon: "📱", title: "Auto CRM", desc: "모든 대화가 자동으로 파이프라인에 기록. 수동 입력 제로." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-2xl p-8 border border-violet-500/20 flex flex-col justify-center">
                  <p className="text-sm text-white/60 mb-4">현재 vs. 미래</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-white/50">기업이 영업사원 10명 고용</span>
                      <span className="text-white/30">연 6억원</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-violet-400 font-medium">기업이 AI 봇 100대 구독</span>
                      <span className="text-violet-400 font-medium">연 6천만원</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/30 mt-6">10배 커버리지. 1/10 비용. 아프지 않고. 퇴사하지 않음.</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== Slide 9: 경쟁 ===== */}
          {current === 9 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">경쟁 구도</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Gong은 대기업 전용입니다.<br />
                <span className="text-white/30">우리는 나머지 전부를 위한 것입니다.</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/40 text-left">
                      <th className="py-3 pr-4"></th>
                      <th className="py-3 px-4">Gong / Chorus</th>
                      <th className="py-3 px-4">Skool</th>
                      <th className="py-3 px-4 text-violet-400">Closr</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    {[
                      ["타겟", "엔터프라이즈 영업팀", "일반 커뮤니티", "개인 영업사원"],
                      ["가격", "연 $50K+", "$99/월 (운영자)", "도구 무료 + 코칭 수수료"],
                      ["AI 분석", "✓ 통화 녹음", "✗", "✓ 음성 + 텍스트 + 코칭"],
                      ["코칭", "✗", "코스만", "✓ 1:1 + 코호트 + 세미나"],
                      ["데이터 증명 효과", "✗", "✗", "✓ 자동 점수 비교"],
                      ["개인 사용", "✗", "✓", "✓"],
                      ["AI 세일즈 로드맵", "아마도", "✗", "✓ 핵심 로드맵"],
                    ].map((row, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="py-3 pr-4 text-white/40 text-xs">{row[0]}</td>
                        <td className="py-3 px-4">{row[1]}</td>
                        <td className="py-3 px-4">{row[2]}</td>
                        <td className="py-3 px-4 text-violet-400 font-medium">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== Slide 10: 로드맵 ===== */}
          {current === 10 && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">실행 계획</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                한국에서 먼저. 그다음 세계로.
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { year: "2026", title: "한국 MVP", items: ["AI 코파일럿 (음성+텍스트)", "코칭 마켓플레이스 런칭", "코치 30명, 유저 5,000명", "첫 코호트 매출 발생"], highlight: true },
                  { year: "2027", title: "한국 시장 장악", items: ["유저 5만, 코치 200명", "기업 교육 파일럿 (10개사)", "시리즈 A ($3~5M)", "월 매출 3억원"], highlight: false },
                  { year: "2028", title: "글로벌 확장", items: ["동남아 + 일본 진출", "영어 코파일럿 출시", "글로벌 유저 10만+", "시리즈 B ($15~30M)"], highlight: false },
                  { year: "2029+", title: "AI 자율주행", items: ["AI 세일즈 봇 마켓플레이스", "Auto-CRM 출시", "유저 100만+", "시리즈 C → 기업가치 1조원+"], highlight: false },
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "rounded-2xl p-6 border flex flex-col",
                    item.highlight ? "bg-violet-500/10 border-violet-500/20" : "bg-white/[0.02] border-white/5"
                  )}>
                    <p className={cn("text-sm font-bold", item.highlight ? "text-violet-400" : "text-white/40")}>{item.year}</p>
                    <p className="font-semibold mt-1">{item.title}</p>
                    <ul className="mt-3 space-y-1.5 flex-1">
                      {item.items.map((li, j) => (
                        <li key={j} className="text-xs text-white/50 flex items-start gap-2">
                          <span className="text-white/20 mt-0.5">→</span> {li}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Slide 11: 투자 요청 ===== */}
          {current === 11 && (
            <div className="text-center space-y-10 animate-in fade-in duration-700">
              <p className="text-sm font-medium text-violet-400 tracking-widest uppercase">투자 제안</p>
              <h2 className="text-5xl md:text-7xl font-bold">
                Seed Round
              </h2>
              <div className="inline-flex items-baseline gap-2">
                <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">$2M</span>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
                {[
                  { pct: "40%", label: "제품 개발", desc: "AI 코파일럿, 코칭 플랫폼, 글로벌 다국어" },
                  { pct: "35%", label: "성장", desc: "한국 시장: 코치 30명, 유저 5,000명, 첫 매출" },
                  { pct: "25%", label: "글로벌 준비", desc: "영어/일본어 출시, 다국어 STT, 팀 빌딩" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                    <p className="text-3xl font-bold text-violet-400">{item.pct}</p>
                    <p className="text-sm font-medium mt-2">{item.label}</p>
                    <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-8 space-y-3">
                <p className="text-xl font-bold">
                  우리는 세일즈의 운영체제를 만들고 있습니다.
                </p>
                <p className="text-white/40">
                  데이터 해자는 지금 시작됩니다. Closr 없이 지나가는 매일이 영원히 사라지는 데이터입니다.
                </p>
              </div>
              <p className="text-sm text-white/20 pt-8">
                closr.ai · hello@closr.ai
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className={cn("w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition", current === 0 && "opacity-30 pointer-events-none")}
        >
          ←
        </button>
        <span className="text-xs text-white/30 tabular-nums">{current + 1} / {TOTAL_SLIDES}</span>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className={cn("w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition", current === TOTAL_SLIDES - 1 && "opacity-30 pointer-events-none")}
        >
          →
        </button>
      </div>
    </div>
  );
}
