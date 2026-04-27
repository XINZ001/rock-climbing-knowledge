-- ============================================================
-- Climbing Profiles Schema (攀岩档案)
-- ============================================================
-- 用途：存储用户详细的攀岩信息，每个用户一条记录

CREATE TABLE IF NOT EXISTS climbing_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 基础攀岩信息
  gender TEXT,                              -- 性别: male, female, prefer_not_to_say
  experience TEXT,                          -- 攀岩年限: <6m, 6-12m, 1-2y, 2-5y, 5-10y, 10y+
  climbing_types TEXT[] DEFAULT '{}',       -- 攀爬类型（多选）: bouldering, sport, trad, top-rope, speed, deep-water-solo, ice, indoor
  frequency TEXT,                           -- 攀爬频率: 1, 2-3, 4-5, 6+
  style TEXT,                               -- 攀爬风格: power, technique, endurance, balanced

  -- 难度等级
  boulder_grade TEXT,                       -- 抱石最高完攀: V0 ~ V10+
  sport_grade TEXT,                         -- 运动攀最高完攀: 5.6 ~ 5.13a+

  -- 场地偏好
  favorite_gyms TEXT,                       -- 常去岩馆（自由文本）
  favorite_crags TEXT,                      -- 常去岩场（自由文本）

  -- 目标与介绍
  goal TEXT,                                -- 攀岩目标
  bio TEXT,                                 -- 个人简介

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 兼容已存在的表
ALTER TABLE climbing_profiles
  ADD COLUMN IF NOT EXISTS gender TEXT;

-- RLS 策略
ALTER TABLE climbing_profiles ENABLE ROW LEVEL SECURITY;

-- 任何人可以查看档案
CREATE POLICY "climbing_profiles_select_all"
  ON climbing_profiles FOR SELECT
  USING (true);

-- 用户只能编辑自己的档案
CREATE POLICY "climbing_profiles_insert_own"
  ON climbing_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "climbing_profiles_update_own"
  ON climbing_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "climbing_profiles_delete_own"
  ON climbing_profiles FOR DELETE
  USING (auth.uid() = user_id);
