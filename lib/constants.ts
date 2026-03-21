import type { Industry, ExperienceRange, IncomeRange, GrowthNeed, PostCategory, ActionType } from "@/types";

// ===== 업종 =====
export const INDUSTRIES: { value: Industry; label: string; icon: string }[] = [
  { value: "insurance", label: "보험", icon: "🛡️" },
  { value: "realestate", label: "부동산", icon: "🏠" },
  { value: "automotive", label: "자동차", icon: "🚗" },
  { value: "b2b", label: "B2B SaaS", icon: "💼" },
  { value: "finance", label: "금융", icon: "💰" },
  { value: "other", label: "기타", icon: "📋" },
];

// ===== 경력 =====
export const EXPERIENCE_RANGES: { value: ExperienceRange; label: string }[] = [
  { value: "under_1", label: "1년 미만" },
  { value: "1_3", label: "1~3년" },
  { value: "3_7", label: "3~7년" },
  { value: "7_15", label: "7~15년" },
  { value: "over_15", label: "15년 이상" },
];

// ===== 연봉 =====
export const INCOME_RANGES: { value: IncomeRange; label: string }[] = [
  { value: "under_30m", label: "3천만원 미만" },
  { value: "30m_50m", label: "3천~5천만원" },
  { value: "50m_70m", label: "5천~7천만원" },
  { value: "70m_100m", label: "7천만~1억원" },
  { value: "100m_150m", label: "1억~1.5억원" },
  { value: "over_150m", label: "1.5억원 이상" },
];

// ===== 성장 희망 영역 =====
export const GROWTH_NEEDS: { value: GrowthNeed; label: string }[] = [
  { value: "cold_call", label: "콜드콜" },
  { value: "closing", label: "클로징" },
  { value: "referral", label: "리퍼럴" },
  { value: "team_management", label: "팀 관리" },
  { value: "negotiation", label: "협상" },
  { value: "other", label: "기타" },
];

// ===== 커뮤니티 카테고리 =====
export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: "intro", label: "자유게시판" },
  { value: "knowhow", label: "노하우 공유" },
  { value: "qna", label: "Q&A" },
  { value: "success", label: "성공사례" },
  { value: "failure", label: "실패분석" },
  { value: "call_review", label: "콜리뷰" },
];

// ===== 행동 포인트 =====
export const ACTION_POINTS: Record<ActionType, number> = {
  cheat: 15,
  call_review: 20,
  peer: 25,
  success: 20,
  failure: 25,
  challenge: 30,
  volunteer: 35,
};

// ===== 레벨 =====
export const LEVELS = [
  { level: 1, name: "신입 영업인", minPoints: 0 },
  { level: 2, name: "성장 중", minPoints: 100 },
  { level: 3, name: "실력파", minPoints: 300 },
  { level: 4, name: "고수", minPoints: 700 },
  { level: 5, name: "영업왕", minPoints: 1500 },
] as const;

// ===== AI봇 쿼터 =====
export const AI_BOT_QUOTA = {
  1: 1, // Lv.1: 하루 1회
  2: 3, // Lv.2: 하루 3회
} as const;

// ===== 브랜딩 =====
export const BRAND = {
  name: "영업왕",
  primaryColor: "#1B3A5C",
  accentColor: "#2E75B6",
} as const;

// ===== 하단 네비 =====
export const NAV_ITEMS = [
  { label: "홈", href: "/", icon: "Home" },
  { label: "커뮤니티", href: "/community", icon: "MessageSquare" },
  { label: "AI봇", href: "/ai-bot", icon: "Bot" },
  { label: "리더보드", href: "/leaderboard", icon: "Trophy" },
  { label: "내정보", href: "/profile", icon: "User" },
] as const;
