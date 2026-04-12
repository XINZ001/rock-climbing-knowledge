-- ============================================================
-- diagnosis_results: 存储用户攀岩动物人格测试的完整结果
-- 在 Supabase Dashboard → SQL Editor 中执行
-- ============================================================

CREATE TABLE IF NOT EXISTS diagnosis_results (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers       jsonb NOT NULL,                    -- 7 步完整答案
  persona_id    text,                              -- 匹配到的动物人格 ID
  fusion_rule_ids text[] DEFAULT '{}',             -- 触发的融合规则 ID 列表
  created_at    timestamptz DEFAULT now() NOT NULL
);

-- 按用户查询历史记录
CREATE INDEX idx_diagnosis_results_user_id ON diagnosis_results(user_id);

-- 按时间排序
CREATE INDEX idx_diagnosis_results_created_at ON diagnosis_results(created_at DESC);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;

-- 用户只能读自己的结果
CREATE POLICY "Users can read own diagnosis results"
  ON diagnosis_results FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的结果
CREATE POLICY "Users can insert own diagnosis results"
  ON diagnosis_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的结果
CREATE POLICY "Users can delete own diagnosis results"
  ON diagnosis_results FOR DELETE
  USING (auth.uid() = user_id);
