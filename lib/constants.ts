import type { Industry, ExperienceRange, IncomeRange, GrowthNeed, PostCategory, ActionType } from "@/types";

// ===== 업종 =====
export const INDUSTRIES: { value: Industry; label: string; icon: string }[] = [
  { value: "insurance", label: "보험", icon: "🛡️" },
  { value: "realestate", label: "부동산", icon: "🏠" },
  { value: "automotive", label: "자동차", icon: "🚗" },
  { value: "medical", label: "의료", icon: "🏥" },
  { value: "pharma", label: "제약/의료기기", icon: "💊" },
  { value: "finance", label: "금융", icon: "💰" },
  { value: "b2b", label: "B2B/솔루션", icon: "💼" },
  { value: "it_telecom", label: "IT/통신", icon: "📱" },
  { value: "education", label: "교육/컨설팅", icon: "📚" },
  { value: "distribution", label: "유통/프랜차이즈", icon: "🏪" },
  { value: "advertising", label: "광고/미디어", icon: "📢" },
  { value: "manufacturing", label: "제조/건설", icon: "🏗️" },
  { value: "beauty_life", label: "뷰티/웨딩/라이프", icon: "💄" },
  { value: "trade", label: "무역/해외영업", icon: "🌏" },
  { value: "recruiting", label: "인력/헤드헌팅", icon: "🤝" },
  { value: "legal_accounting", label: "법률/회계", icon: "⚖️" },
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

// ===== 커뮤니티 카테고리 (v4.0: 3탭 + 전체) =====
export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: "free", label: "자유게시판" },
  { value: "knowhow_qa", label: "노하우·Q&A" },
  { value: "call_review", label: "콜리뷰" },
];

// ===== 행동 포인트 (v4.0) =====
export const ACTION_POINTS: Record<ActionType, number> = {
  call_review_upload: 20,
  daily_record: 10,
  post: 10,
  comment: 3,
  like_received: 5,
  peer_review: 15,
  streak_7day: 50,
};

// ===== 레벨 =====
export const LEVELS = [
  { level: 1, name: "신입", minPoints: 0 },
  { level: 2, name: "실전파", minPoints: 500 },
  { level: 3, name: "프로", minPoints: 2000 },
  { level: 4, name: "마스터", minPoints: 5000 },
  { level: 5, name: "클로저", minPoints: 15000 },
] as const;

// ===== AI 코치 쿼터 =====
export const AI_COACH_QUOTA = {
  1: 1, // Lv.1: 하루 1회
  2: 3, // Lv.2: 하루 3회
} as const;

// ===== 브랜딩 =====
export const BRAND = {
  name: "Closr",
  nameKo: "클로저",
  tagline: "AI 세일즈 코치 + 성장 플랫폼",
  primaryColor: "#1B3A5C",
  accentColor: "#2E75B6",
} as const;

// ===== 하단 네비 =====
export const NAV_ITEMS = [
  { label: "홈", href: "/", icon: "Home" },
  { label: "커뮤니티", href: "/community", icon: "MessageSquare" },
  { label: "코파일럿", href: "/copilot", icon: "Headphones" },
  { label: "코칭", href: "/coaching", icon: "GraduationCap" },
  { label: "MY", href: "/profile", icon: "User" },
] as const;
