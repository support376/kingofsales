import type { User } from "@/types";

// MVP 데모 유저 (카카오 연동 전까지 사용)
export const DEMO_USER: User = {
  id: "demo-user-001",
  kakao_id: null,
  phone: "01012345678",
  nickname: "영업신입07",
  profile_image: null,
  bio: "보험 영업 2년차, 매일 성장 중!",
  industry: "insurance",
  experience_years: "1_3",
  income_range: "30m_50m",
  growth_needs: ["cold_call", "closing"],
  auth_level: 1,
  level: 2,
  points: 120,
  likes_received: 15,
  is_instructor: false,
  created_at: "2026-03-01T00:00:00Z",
  updated_at: "2026-03-22T00:00:00Z",
};

const SESSION_KEY = "salesking_session";

/** 로그인 (쿠키에 세션 저장) */
export async function demoLogin(): Promise<User> {
  const res = await fetch("/api/auth/demo", { method: "POST" });
  if (!res.ok) throw new Error("로그인 실패");
  const user = await res.json();
  return user;
}

/** 로그아웃 */
export async function demoLogout(): Promise<void> {
  await fetch("/api/auth/demo", { method: "DELETE" });
}

/** 현재 세션 조회 */
export async function getSession(): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}
