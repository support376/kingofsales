-- 영업왕 플랫폼 초기 DB 스키마
-- Supabase (PostgreSQL)

-- ===== 1. users =====
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kakao_id VARCHAR UNIQUE,
  phone VARCHAR,
  nickname VARCHAR(20) NOT NULL UNIQUE,
  profile_image TEXT,
  bio VARCHAR(100),
  industry VARCHAR(20) NOT NULL DEFAULT 'other',
  experience_years VARCHAR(10) NOT NULL DEFAULT 'under_1',
  income_range VARCHAR(10) NOT NULL DEFAULT 'under_30m',
  growth_needs TEXT[] DEFAULT '{}',
  auth_level INT NOT NULL DEFAULT 0 CHECK (auth_level IN (0, 1, 2)),
  level INT NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  points INT NOT NULL DEFAULT 0,
  likes_received INT NOT NULL DEFAULT 0,
  is_instructor BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== 2. verifications =====
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doc_type VARCHAR NOT NULL,
  doc_url TEXT NOT NULL,
  verified_income_range VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- ===== 3. posts =====
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR NOT NULL CHECK (category IN ('intro', 'knowhow', 'qna', 'success', 'failure', 'call_review')),
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  action_type VARCHAR,
  action_points INT NOT NULL DEFAULT 0,
  likes_count INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  is_verified_only BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== 4. comments =====
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_ai BOOLEAN NOT NULL DEFAULT FALSE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== 5. likes =====
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL)
);

-- ===== 6. ai_analyses =====
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  audio_duration INT NOT NULL DEFAULT 0,
  transcript TEXT,
  score_total INT DEFAULT 0,
  score_speech INT DEFAULT 0,
  score_tone INT DEFAULT 0,
  score_closing INT DEFAULT 0,
  score_objection INT DEFAULT 0,
  feedback_json JSONB,
  is_shared BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== 7. leaderboard_data =====
CREATE TABLE leaderboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR NOT NULL CHECK (source IN ('preset', 'user')),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  industry VARCHAR NOT NULL,
  display_name VARCHAR NOT NULL,
  experience_range VARCHAR,
  income_range VARCHAR,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rank_score INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== 8. diagnosis_results =====
CREATE TABLE diagnosis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  industry VARCHAR NOT NULL,
  experience_years VARCHAR NOT NULL,
  income_range VARCHAR NOT NULL,
  growth_needs TEXT[] DEFAULT '{}',
  result_json JSONB NOT NULL,
  converted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== Indexes =====
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_ai_analyses_user_id ON ai_analyses(user_id);
CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at DESC);
CREATE INDEX idx_leaderboard_industry ON leaderboard_data(industry);
CREATE INDEX idx_leaderboard_rank ON leaderboard_data(rank_score DESC);
CREATE INDEX idx_diagnosis_session ON diagnosis_results(session_id);
CREATE INDEX idx_verifications_user ON verifications(user_id);
CREATE INDEX idx_verifications_status ON verifications(status);

-- ===== RLS Policies (기본) =====
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;
