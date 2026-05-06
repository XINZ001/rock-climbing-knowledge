-- ============================================================
-- Supabase schema snapshot — 2026-05-06
-- Source: pasted by xingjian-hu from Supabase Dashboard
--   (Database → Schema → Schema visualization "context-only" export)
-- ============================================================
-- ⚠️ WARNING (from Supabase): "This schema is for context only and is
-- not meant to be run. Table order and constraints may not be valid
-- for execution."
--
-- What this file COVERS:
--   - 15 tables in the public schema (all CREATE TABLE definitions)
--   - Columns + types + DEFAULT values
--   - PRIMARY KEY constraints
--   - FOREIGN KEY constraints (referencing public.* and auth.users)
--   - One CHECK constraint (media.media_type)
--
-- What this file is MISSING (do not assume restoring this is enough):
--   - Row-Level Security (RLS) policies — critical for Supabase
--   - RPC functions (e.g. `check_email_exists`, `get_feed_post_stats`)
--   - Indexes beyond primary keys
--   - Triggers (likely a handle_new_user trigger on auth.users
--     that auto-creates profiles rows)
--   - Storage bucket policies
--   - Array element types are reported as `ARRAY` (e.g.
--     `climbing_types ARRAY` should be `text[]`); see the inline
--     `'{}'::text[]` defaults for hints
--
-- Refresh procedure:
--   - Supabase Dashboard → Database → Schema visualization → copy
--     the "Context-only" SQL output
--   - Replace the body below this header
--   - Update the date in this header and the filename
--   - For a more complete backup, also export RLS policies, RPCs,
--     and indexes (see sql/README.md once created)
--
-- This is a 70%-coverage backup — better than nothing, not enough
-- for a fully automated disaster restore.
-- ============================================================

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.climbing_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  experience text,
  climbing_types ARRAY DEFAULT '{}'::text[],
  frequency text,
  style text,
  boulder_grade text,
  sport_grade text,
  favorite_gyms text,
  favorite_crags text,
  goal text,
  bio text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  gender text,
  CONSTRAINT climbing_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT climbing_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  parent_comment_id uuid,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id),
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comments(id)
);
CREATE TABLE public.diagnosis_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  answers jsonb NOT NULL,
  persona_id text,
  fusion_rule_ids ARRAY DEFAULT '{}'::text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT diagnosis_results_pkey PRIMARY KEY (id),
  CONSTRAINT diagnosis_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.feed_bookmarks (
  user_id uuid NOT NULL,
  post_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feed_bookmarks_pkey PRIMARY KEY (user_id, post_id),
  CONSTRAINT feed_bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.feed_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feed_comments_pkey PRIMARY KEY (id),
  CONSTRAINT feed_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.feed_likes (
  user_id uuid NOT NULL,
  post_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feed_likes_pkey PRIMARY KEY (user_id, post_id),
  CONSTRAINT feed_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.feed_views (
  user_id uuid NOT NULL,
  post_id text NOT NULL,
  viewed_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feed_views_pkey PRIMARY KEY (user_id, post_id),
  CONSTRAINT feed_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.injury_details (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL UNIQUE,
  body_parts ARRAY NOT NULL,
  injury_type text NOT NULL,
  injury_cause text,
  climbing_type text NOT NULL,
  usual_grade text,
  injury_grade text,
  climbing_experience text,
  climbing_frequency text,
  did_warm_up text,
  was_fatigued text,
  sought_medical boolean,
  diagnosis text,
  recovery_duration text,
  advice_to_others text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT injury_details_pkey PRIMARY KEY (id),
  CONSTRAINT injury_details_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.likes (
  user_id uuid NOT NULL,
  post_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT likes_pkey PRIMARY KEY (user_id, post_id),
  CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  storage_path text NOT NULL,
  media_type text NOT NULL CHECK (media_type = ANY (ARRAY['image'::text, 'video'::text])),
  mime_type text,
  file_size_bytes bigint,
  width integer,
  height integer,
  duration_seconds integer,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT media_pkey PRIMARY KEY (id),
  CONSTRAINT media_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.post_knowledge_points (
  post_id uuid NOT NULL,
  kp_id text NOT NULL,
  tagged_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT post_knowledge_points_pkey PRIMARY KEY (post_id, kp_id),
  CONSTRAINT post_knowledge_points_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id),
  CONSTRAINT post_knowledge_points_tagged_by_fkey FOREIGN KEY (tagged_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  climbing_type text,
  grade text,
  location text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text,
  avatar_url text,
  bio text,
  climbing_level text,
  preferred_style text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.quest_completions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quest_id integer NOT NULL,
  completed_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quest_completions_pkey PRIMARY KEY (id),
  CONSTRAINT quest_completions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_quest_progress (
  user_id uuid NOT NULL,
  quest_id text NOT NULL,
  times integer NOT NULL DEFAULT 0,
  dates ARRAY NOT NULL DEFAULT '{}'::date[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_quest_progress_pkey PRIMARY KEY (user_id, quest_id),
  CONSTRAINT user_quest_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
