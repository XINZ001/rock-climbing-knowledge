PRAGMA foreign_keys = ON;

-- ============================================================
-- YouTube x Climbing Knowledge Mapping Schema (SQLite)
-- ============================================================
-- Naming convention:
-- - yt_*                       : YouTube domain entities
-- - knowledge_points_catalog   : your internal climbing knowledge taxonomy
-- - *_matches / *_reviews      : AI mapping + human review workflow

-- 1) Channels: curated climbing YouTubers
CREATE TABLE IF NOT EXISTS yt_channels (
  yt_channel_id TEXT PRIMARY KEY,                 -- YouTube channel id
  yt_handle TEXT,                                 -- @handle
  channel_name TEXT NOT NULL,
  channel_url TEXT NOT NULL UNIQUE,
  country_code TEXT,                              -- e.g., US, GB, CN
  primary_language TEXT,                          -- e.g., en, zh
  subscriber_count INTEGER,
  published_video_count INTEGER,
  last_synced_at TEXT,                            -- ISO8601
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2) Videos: all videos from channels above
CREATE TABLE IF NOT EXISTS yt_videos (
  yt_video_id TEXT PRIMARY KEY,                   -- YouTube video id
  yt_channel_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL UNIQUE,
  published_at TEXT,                              -- ISO8601
  duration_seconds INTEGER,
  view_count INTEGER,
  like_count INTEGER,
  comment_count INTEGER,
  is_short INTEGER NOT NULL DEFAULT 0 CHECK (is_short IN (0, 1)),
  is_live_stream INTEGER NOT NULL DEFAULT 0 CHECK (is_live_stream IN (0, 1)),
  fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (yt_channel_id) REFERENCES yt_channels(yt_channel_id) ON DELETE CASCADE
);

-- 3) Knowledge points: your canonical climbing taxonomy
CREATE TABLE IF NOT EXISTS knowledge_points_catalog (
  kp_id TEXT PRIMARY KEY,                         -- e.g. kp-grip-types
  section_id TEXT NOT NULL,                       -- e.g. section-03
  sub_section_id TEXT NOT NULL,                   -- e.g. s03-handholds
  kp_name_zh TEXT NOT NULL,
  kp_name_en TEXT,
  keywords_zh TEXT,                               -- CSV or JSON string
  keywords_en TEXT,                               -- CSV or JSON string
  negative_keywords TEXT,                         -- optional disambiguation terms
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 4) AI mapping result: video -> knowledge point relevance
CREATE TABLE IF NOT EXISTS yt_video_kp_matches (
  match_id INTEGER PRIMARY KEY AUTOINCREMENT,
  yt_video_id TEXT NOT NULL,
  kp_id TEXT NOT NULL,
  relevance_tier TEXT NOT NULL
    CHECK (relevance_tier IN ('primary', 'secondary', 'related')),
  relevance_score REAL NOT NULL
    CHECK (relevance_score >= 0 AND relevance_score <= 100),
  match_reason TEXT,                              -- short rationale from model
  matched_by_model TEXT,                          -- model name
  matched_by_version TEXT,                        -- model/version tag
  matched_at TEXT NOT NULL DEFAULT (datetime('now')),
  current_review_status TEXT NOT NULL DEFAULT 'auto'
    CHECK (current_review_status IN ('auto', 'approved', 'rejected')),
  UNIQUE (yt_video_id, kp_id, relevance_tier),
  FOREIGN KEY (yt_video_id) REFERENCES yt_videos(yt_video_id) ON DELETE CASCADE,
  FOREIGN KEY (kp_id) REFERENCES knowledge_points_catalog(kp_id) ON DELETE CASCADE
);

-- 5) Review history: keep every decision (auditable)
CREATE TABLE IF NOT EXISTS yt_video_kp_match_reviews (
  review_id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id INTEGER NOT NULL,
  review_status TEXT NOT NULL
    CHECK (review_status IN ('approved', 'rejected', 'needs_edit')),
  reviewer_name TEXT,
  review_note TEXT,
  reviewed_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (match_id) REFERENCES yt_video_kp_matches(match_id) ON DELETE CASCADE
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_yt_videos_channel ON yt_videos(yt_channel_id);
CREATE INDEX IF NOT EXISTS idx_yt_videos_published ON yt_videos(published_at);
CREATE INDEX IF NOT EXISTS idx_yt_matches_video ON yt_video_kp_matches(yt_video_id);
CREATE INDEX IF NOT EXISTS idx_yt_matches_kp ON yt_video_kp_matches(kp_id);
CREATE INDEX IF NOT EXISTS idx_yt_matches_status_score
  ON yt_video_kp_matches(current_review_status, relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_yt_reviews_match ON yt_video_kp_match_reviews(match_id);

-- Keep updated_at fresh
CREATE TRIGGER IF NOT EXISTS trg_yt_channels_updated_at
AFTER UPDATE ON yt_channels
FOR EACH ROW
BEGIN
  UPDATE yt_channels SET updated_at = datetime('now') WHERE yt_channel_id = OLD.yt_channel_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_yt_videos_updated_at
AFTER UPDATE ON yt_videos
FOR EACH ROW
BEGIN
  UPDATE yt_videos SET updated_at = datetime('now') WHERE yt_video_id = OLD.yt_video_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_kp_catalog_updated_at
AFTER UPDATE ON knowledge_points_catalog
FOR EACH ROW
BEGIN
  UPDATE knowledge_points_catalog SET updated_at = datetime('now') WHERE kp_id = OLD.kp_id;
END;

