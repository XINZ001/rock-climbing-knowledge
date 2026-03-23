-- ============================================================
-- injury_details 表 — 伤痛档案结构化数据
-- ============================================================
-- 与 posts 表一对一关联，存放伤害案例特有的字段

CREATE TABLE IF NOT EXISTS injury_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL UNIQUE REFERENCES posts(id) ON DELETE CASCADE,

  -- 受伤信息
  body_parts TEXT[] NOT NULL,                     -- 受伤部位（数组，可多选）
  injury_type TEXT NOT NULL,                      -- 受伤类型
  injury_cause TEXT,                              -- 自己认为的原因

  -- 攀岩背景
  climbing_type TEXT NOT NULL,                    -- bouldering / sport / trad / top-rope / indoor
  usual_grade TEXT,                               -- 日常水平
  injury_grade TEXT,                              -- 受伤时难度
  climbing_experience TEXT,                       -- 攀岩年限
  climbing_frequency TEXT,                        -- 每周频率

  -- 受伤上下文
  did_warm_up TEXT,                               -- yes / no / unsure
  was_fatigued TEXT,                              -- yes / no / unsure
  sought_medical BOOLEAN,                         -- 是否就医
  diagnosis TEXT,                                 -- 诊断结果
  recovery_duration TEXT,                         -- 恢复时长

  -- 经验分享
  advice_to_others TEXT,                          -- 给他人的建议

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_injury_details_post_id ON injury_details(post_id);
CREATE INDEX IF NOT EXISTS idx_injury_details_body_parts ON injury_details USING GIN(body_parts);
CREATE INDEX IF NOT EXISTS idx_injury_details_climbing_type ON injury_details(climbing_type);

-- RLS
ALTER TABLE injury_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "injury_details_select_public" ON injury_details
  FOR SELECT USING (true);

CREATE POLICY "injury_details_insert_post_owner" ON injury_details
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
  );

CREATE POLICY "injury_details_update_post_owner" ON injury_details
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
  );

CREATE POLICY "injury_details_delete_post_owner" ON injury_details
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid())
  );
