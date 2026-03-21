// ===== Users =====
export interface User {
  id: string;
  kakao_id: string | null;
  phone: string | null;
  nickname: string;
  profile_image: string | null;
  bio: string | null;
  industry: Industry;
  experience_years: ExperienceRange;
  income_range: IncomeRange;
  growth_needs: GrowthNeed[];
  auth_level: 0 | 1 | 2;
  level: 1 | 2 | 3 | 4 | 5;
  points: number;
  likes_received: number;
  is_instructor: boolean;
  created_at: string;
  updated_at: string;
}

// ===== Enums =====
export type Industry =
  | "insurance"
  | "realestate"
  | "automotive"
  | "b2b"
  | "finance"
  | "other";

export type ExperienceRange =
  | "under_1"
  | "1_3"
  | "3_7"
  | "7_15"
  | "over_15";

export type IncomeRange =
  | "under_30m"
  | "30m_50m"
  | "50m_70m"
  | "70m_100m"
  | "100m_150m"
  | "over_150m";

export type GrowthNeed =
  | "cold_call"
  | "closing"
  | "referral"
  | "team_management"
  | "negotiation"
  | "other";

export type PostCategory =
  | "intro"
  | "knowhow"
  | "qna"
  | "success"
  | "failure"
  | "call_review";

export type ActionType =
  | "cheat"
  | "call_review"
  | "peer"
  | "success"
  | "failure"
  | "challenge"
  | "volunteer";

// ===== Verification =====
export interface Verification {
  id: string;
  user_id: string;
  doc_type: string;
  doc_url: string;
  verified_income_range: string | null;
  status: "pending" | "approved" | "rejected";
  reviewer_note: string | null;
  created_at: string;
  reviewed_at: string | null;
  expires_at: string | null;
}

// ===== Posts =====
export interface Post {
  id: string;
  user_id: string;
  category: PostCategory;
  title: string;
  content: string;
  action_type: ActionType | null;
  action_points: number;
  likes_count: number;
  comments_count: number;
  is_verified_only: boolean;
  created_at: string;
  // joined
  author?: Pick<User, "nickname" | "profile_image" | "auth_level" | "level">;
}

// ===== Comments =====
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_ai: boolean;
  parent_id: string | null;
  created_at: string;
  author?: Pick<User, "nickname" | "profile_image" | "auth_level">;
}

// ===== Likes =====
export interface Like {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  created_at: string;
}

// ===== AI Analysis =====
export interface AiAnalysis {
  id: string;
  user_id: string;
  audio_url: string;
  audio_duration: number;
  transcript: string;
  score_total: number;
  score_speech: number;
  score_tone: number;
  score_closing: number;
  score_objection: number;
  feedback_json: FeedbackJson;
  is_shared: boolean;
  created_at: string;
}

export interface FeedbackJson {
  speech: { score: number; feedback: string; suggestion: string };
  tone: { score: number; feedback: string; suggestion: string };
  closing: { score: number; feedback: string; suggestion: string };
  objection: { score: number; feedback: string; suggestion: string };
  overall: { score: number; feedback: string; suggestion: string };
}

// ===== Leaderboard =====
export interface LeaderboardEntry {
  id: string;
  source: "preset" | "user";
  user_id: string | null;
  industry: Industry;
  display_name: string;
  experience_range: ExperienceRange;
  income_range: IncomeRange;
  is_verified: boolean;
  rank_score: number;
  visible: boolean;
  created_at: string;
}

// ===== Diagnosis =====
export interface DiagnosisResult {
  id: string;
  session_id: string;
  user_id: string | null;
  industry: Industry;
  experience_years: ExperienceRange;
  income_range: IncomeRange;
  growth_needs: GrowthNeed[];
  result_json: DiagnosisResultJson;
  converted: boolean;
  created_at: string;
}

export interface DiagnosisResultJson {
  percentile: number;
  strengths: string[];
  weaknesses: string[];
  type_name: string;
  type_description: string;
  recommendations: string[];
}

// ===== UI helpers =====
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
