-- ============================================================
-- Rock Climbing Community Schema (Supabase / PostgreSQL)
-- ============================================================
-- 用途：支持用户上传攀岩记录（视频/图片）+ 社区互动（评论/点赞）
-- 与现有知识库通过 kp_id 关联

-- ────────────────────────────────────────────────────────────
-- 1) profiles — 用户资料（扩展 Supabase Auth 的 auth.users）
-- ────────────────────────────────────────────────────────────
-- Supabase Auth 会自动管理 auth.users 表，
-- 这张表存放额外的用户信息，通过 id 关联 auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,                           -- 显示名称（唯一）
  avatar_url TEXT,                                -- 头像 URL
  bio TEXT,                                       -- 自我介绍
  climbing_level TEXT,                            -- 攀岩水平：beginner / intermediate / advanced / expert
  preferred_style TEXT,                           -- 偏好风格：bouldering / sport / trad / all
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'preferred_username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 2) posts — 用户发布的攀岩记录
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                            -- 标题，如 "第一次完成 V5"
  description TEXT,                               -- 详细描述
  climbing_type TEXT,                             -- bouldering / sport / trad / top-rope / indoor
  grade TEXT,                                     -- 难度等级，如 V5, 5.11a, 6c+
  location TEXT,                                  -- 攀岩地点
  is_published BOOLEAN NOT NULL DEFAULT true,     -- 是否公开
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 3) media — 帖子关联的图片和视频
-- ────────────────────────────────────────────────────────────
-- 一个 post 可以有多个图片/视频
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,                     -- Supabase Storage 中的路径
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  mime_type TEXT,                                 -- 如 image/jpeg, video/mp4
  file_size_bytes BIGINT,                         -- 文件大小
  width INTEGER,                                  -- 图片/视频宽度（像素）
  height INTEGER,                                 -- 图片/视频高度（像素）
  duration_seconds INTEGER,                       -- 视频时长（秒），图片为 NULL
  display_order INTEGER NOT NULL DEFAULT 0,       -- 在帖子中的排列顺序
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 4) post_knowledge_points — 帖子与知识点的关联
-- ────────────────────────────────────────────────────────────
-- 用户可以给自己的帖子标注相关知识点（如 "heel hook", "flagging"）
-- kp_id 对应现有知识库中的 knowledge_points_catalog.kp_id
CREATE TABLE IF NOT EXISTS post_knowledge_points (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  kp_id TEXT NOT NULL,                            -- 如 kp-heel-hook
  tagged_by UUID REFERENCES profiles(id),         -- 谁标注的（作者自己或其他用户）
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, kp_id)
);

-- ────────────────────────────────────────────────────────────
-- 5) comments — 评论
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 支持回复嵌套
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 6) likes — 点赞
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- ────────────────────────────────────────────────────────────
-- 7) feed_* — 发现页静态帖子互动
-- ────────────────────────────────────────────────────────────
-- feed-registry.json 中的帖子不是 posts 表记录，因此单独用 TEXT post_id 记录互动。
CREATE TABLE IF NOT EXISTS feed_likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS feed_bookmarks (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS feed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feed_views (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- ────────────────────────────────────────────────────────────
-- 8) user_quest_progress — 任务图鉴进度
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_quest_progress (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  times INTEGER NOT NULL DEFAULT 0,
  dates DATE[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, quest_id)
);

-- ============================================================
-- 索引（提升查询性能）
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_climbing_type ON posts(climbing_type);
CREATE INDEX IF NOT EXISTS idx_media_post_id ON media(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_kp_kp_id ON post_knowledge_points(kp_id);
CREATE INDEX IF NOT EXISTS idx_feed_likes_post_id ON feed_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_bookmarks_post_id ON feed_bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_comments_post_id ON feed_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_comments_user_id ON feed_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_views_post_id ON feed_views(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_views_user_id ON feed_views(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quest_progress_user_id ON user_quest_progress(user_id);

-- ============================================================
-- Row Level Security (RLS) — 数据访问权限控制
-- ============================================================
-- Supabase 强烈建议开启 RLS，确保用户只能操作自己的数据

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_select_public" ON profiles
  FOR SELECT USING (true);                        -- 所有人可以查看资料
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);             -- 只能改自己的资料

-- posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "posts_select_published" ON posts;
DROP POLICY IF EXISTS "posts_insert_own" ON posts;
DROP POLICY IF EXISTS "posts_update_own" ON posts;
DROP POLICY IF EXISTS "posts_delete_own" ON posts;
CREATE POLICY "posts_select_published" ON posts
  FOR SELECT USING (is_published = true);         -- 只能看到公开帖子
CREATE POLICY "posts_insert_own" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);   -- 只能以自己名义发帖
CREATE POLICY "posts_update_own" ON posts
  FOR UPDATE USING (auth.uid() = user_id);        -- 只能改自己的帖子
CREATE POLICY "posts_delete_own" ON posts
  FOR DELETE USING (auth.uid() = user_id);        -- 只能删自己的帖子

-- media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "media_select_public" ON media;
DROP POLICY IF EXISTS "media_insert_post_owner" ON media;
DROP POLICY IF EXISTS "media_delete_post_owner" ON media;
CREATE POLICY "media_select_public" ON media
  FOR SELECT USING (true);                        -- 所有人可以查看媒体
CREATE POLICY "media_insert_post_owner" ON media
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
  );                                              -- 只有帖子作者能添加媒体
CREATE POLICY "media_delete_post_owner" ON media
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
  );

-- comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments_select_public" ON comments;
DROP POLICY IF EXISTS "comments_insert_auth" ON comments;
DROP POLICY IF EXISTS "comments_update_own" ON comments;
DROP POLICY IF EXISTS "comments_delete_own" ON comments;
CREATE POLICY "comments_select_public" ON comments
  FOR SELECT USING (true);                        -- 所有人可以查看评论
CREATE POLICY "comments_insert_auth" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);   -- 登录用户才能评论
CREATE POLICY "comments_update_own" ON comments
  FOR UPDATE USING (auth.uid() = user_id);        -- 只能改自己的评论
CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (auth.uid() = user_id);        -- 只能删自己的评论

-- likes
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "likes_select_public" ON likes;
DROP POLICY IF EXISTS "likes_insert_auth" ON likes;
DROP POLICY IF EXISTS "likes_delete_own" ON likes;
CREATE POLICY "likes_select_public" ON likes
  FOR SELECT USING (true);
CREATE POLICY "likes_insert_auth" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- feed_likes
ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feed_likes_select_public" ON feed_likes;
DROP POLICY IF EXISTS "feed_likes_insert_auth" ON feed_likes;
DROP POLICY IF EXISTS "feed_likes_delete_own" ON feed_likes;
CREATE POLICY "feed_likes_select_public" ON feed_likes
  FOR SELECT USING (true);
CREATE POLICY "feed_likes_insert_auth" ON feed_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_likes_delete_own" ON feed_likes
  FOR DELETE USING (auth.uid() = user_id);

-- feed_bookmarks
ALTER TABLE feed_bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feed_bookmarks_select_own" ON feed_bookmarks;
DROP POLICY IF EXISTS "feed_bookmarks_insert_auth" ON feed_bookmarks;
DROP POLICY IF EXISTS "feed_bookmarks_delete_own" ON feed_bookmarks;
CREATE POLICY "feed_bookmarks_select_own" ON feed_bookmarks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "feed_bookmarks_insert_auth" ON feed_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_bookmarks_delete_own" ON feed_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- feed_comments
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feed_comments_select_public" ON feed_comments;
DROP POLICY IF EXISTS "feed_comments_insert_auth" ON feed_comments;
DROP POLICY IF EXISTS "feed_comments_update_own" ON feed_comments;
DROP POLICY IF EXISTS "feed_comments_delete_own" ON feed_comments;
CREATE POLICY "feed_comments_select_public" ON feed_comments
  FOR SELECT USING (true);
CREATE POLICY "feed_comments_insert_auth" ON feed_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_comments_update_own" ON feed_comments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "feed_comments_delete_own" ON feed_comments
  FOR DELETE USING (auth.uid() = user_id);

-- feed_views
ALTER TABLE feed_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feed_views_select_own" ON feed_views;
DROP POLICY IF EXISTS "feed_views_insert_auth" ON feed_views;
DROP POLICY IF EXISTS "feed_views_update_own" ON feed_views;
DROP POLICY IF EXISTS "feed_views_delete_own" ON feed_views;
CREATE POLICY "feed_views_select_own" ON feed_views
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "feed_views_insert_auth" ON feed_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_views_update_own" ON feed_views
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "feed_views_delete_own" ON feed_views
  FOR DELETE USING (auth.uid() = user_id);

-- 发现页静态帖子的聚合统计：阅读人数、点赞人数、评论人数、收藏人数
CREATE OR REPLACE FUNCTION get_feed_post_stats()
RETURNS TABLE (
  post_id TEXT,
  view_count BIGINT,
  like_count BIGINT,
  comment_count BIGINT,
  bookmark_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH all_posts AS (
    SELECT feed_views.post_id FROM feed_views
    UNION
    SELECT feed_likes.post_id FROM feed_likes
    UNION
    SELECT feed_comments.post_id FROM feed_comments
    UNION
    SELECT feed_bookmarks.post_id FROM feed_bookmarks
  ),
  views AS (
    SELECT feed_views.post_id, COUNT(*)::BIGINT AS count
    FROM feed_views
    GROUP BY feed_views.post_id
  ),
  likes AS (
    SELECT feed_likes.post_id, COUNT(*)::BIGINT AS count
    FROM feed_likes
    GROUP BY feed_likes.post_id
  ),
  comments AS (
    SELECT feed_comments.post_id, COUNT(*)::BIGINT AS count
    FROM feed_comments
    GROUP BY feed_comments.post_id
  ),
  bookmarks AS (
    SELECT feed_bookmarks.post_id, COUNT(*)::BIGINT AS count
    FROM feed_bookmarks
    GROUP BY feed_bookmarks.post_id
  )
  SELECT
    all_posts.post_id,
    COALESCE(views.count, 0) AS view_count,
    COALESCE(likes.count, 0) AS like_count,
    COALESCE(comments.count, 0) AS comment_count,
    COALESCE(bookmarks.count, 0) AS bookmark_count
  FROM all_posts
  LEFT JOIN views ON views.post_id = all_posts.post_id
  LEFT JOIN likes ON likes.post_id = all_posts.post_id
  LEFT JOIN comments ON comments.post_id = all_posts.post_id
  LEFT JOIN bookmarks ON bookmarks.post_id = all_posts.post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION get_feed_post_stats() TO anon, authenticated;

-- user_quest_progress
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_quest_progress_select_own" ON user_quest_progress;
DROP POLICY IF EXISTS "user_quest_progress_insert_own" ON user_quest_progress;
DROP POLICY IF EXISTS "user_quest_progress_update_own" ON user_quest_progress;
DROP POLICY IF EXISTS "user_quest_progress_delete_own" ON user_quest_progress;
CREATE POLICY "user_quest_progress_select_own" ON user_quest_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_quest_progress_insert_own" ON user_quest_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_quest_progress_update_own" ON user_quest_progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_quest_progress_delete_own" ON user_quest_progress
  FOR DELETE USING (auth.uid() = user_id);

-- post_knowledge_points
ALTER TABLE post_knowledge_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "post_kp_select_public" ON post_knowledge_points;
DROP POLICY IF EXISTS "post_kp_insert_auth" ON post_knowledge_points;
DROP POLICY IF EXISTS "post_kp_delete_tagger" ON post_knowledge_points;
CREATE POLICY "post_kp_select_public" ON post_knowledge_points
  FOR SELECT USING (true);
CREATE POLICY "post_kp_insert_auth" ON post_knowledge_points
  FOR INSERT WITH CHECK (auth.uid() = tagged_by);
CREATE POLICY "post_kp_delete_tagger" ON post_knowledge_points
  FOR DELETE USING (auth.uid() = tagged_by);
