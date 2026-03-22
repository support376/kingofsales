import type { User, Post } from "@/types";
import { AI_COACH_QUOTA } from "./constants";

/** 프로필 노출 필드 제어 */
export function filterProfile(viewerAuthLevel: number, target: User) {
  if (viewerAuthLevel === 0) {
    return { nickname: target.nickname };
  }
  if (viewerAuthLevel === 1) {
    return {
      nickname: target.nickname,
      industry: target.industry,
      experience_years: target.experience_years,
      profile_image: target.profile_image,
      level: target.level,
    };
  }
  // Lv.2
  return { ...target };
}

/** 게시글 접근 권한 */
export function canAccessPost(userAuthLevel: number, post: Post): boolean {
  if (post.is_verified_only && userAuthLevel < 2) return false;
  return userAuthLevel >= 1;
}

/** AI 코치 사용 가능 여부 */
export function canUseAiCoach(authLevel: number, todayCount: number): boolean {
  const limit = AI_COACH_QUOTA[authLevel as keyof typeof AI_COACH_QUOTA] ?? 0;
  return todayCount < limit;
}

/** AI 코치 일일 한도 */
export function getAiCoachLimit(authLevel: number): number {
  return AI_COACH_QUOTA[authLevel as keyof typeof AI_COACH_QUOTA] ?? 0;
}

/** 리더보드 접근 권한 */
export function getLeaderboardAccess(authLevel: number) {
  if (authLevel === 0) return "average_only" as const;
  if (authLevel === 1) return "my_rank" as const;
  return "full" as const;
}
